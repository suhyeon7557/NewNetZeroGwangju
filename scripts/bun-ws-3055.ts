// Bun WebSocket server for ws://localhost:3055
// Minimal echo server to satisfy MCP WebSocket handshake

const PORT = 3055;

const server = Bun.serve<{ channel?: string }>({
  port: PORT,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return new Response(null, { status: 101 });
    }
    return new Response('WebSocket only', { status: 426 });
  },
  websocket: {
    message(ws, message) {
      // Expect JSON from MCP; echo minimal structure
      try {
        const text = typeof message === 'string' ? message : new TextDecoder().decode(message as ArrayBuffer);
        const data = JSON.parse(text);
        // If join, acknowledge
        if (data && (data.type === 'join' || data.message?.command === 'join')) {
          ws.send(JSON.stringify({ ok: true, joined: data.channel || data.message?.channel }));
          return;
        }
        // Otherwise, echo a minimal result envelope
        const id = data?.message?.id || data?.id || Math.random().toString(36).slice(2);
        ws.send(
          JSON.stringify({
            message: {
              id,
              result: { success: true, echo: data?.message?.command || 'noop' }
            }
          })
        );
      } catch (_) {
        ws.send(JSON.stringify({ message: { id: 'unknown', result: { success: true } } }));
      }
    },
    open(ws) {
      // no-op
    },
    close(ws) {
      // no-op
    }
  }
});

console.log(`[bun-ws-3055] listening on ws://localhost:${PORT}`);
