// 간단한 TCP 리스너 (port 3055) - TalkToFigma MCP 연결 확인용
// JSP 전환 고려: 순수 Node net 모듈만 사용

const net = require('net');

const PORT = 3055;
const HOST = '0.0.0.0';

const server = net.createServer((socket) => {
  socket.setEncoding('utf8');
  socket.on('data', (data) => {
    // 간단한 에코 및 헬스 체크 응답
    if (typeof data === 'string' && data.trim().toLowerCase() === 'ping') {
      socket.write('pong');
    } else {
      socket.write('ok');
    }
  });
  socket.on('error', () => {});
});

server.on('error', (err) => {
  console.error('[socket-3055] server error:', err.message);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`[socket-3055] listening on ${HOST}:${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});


