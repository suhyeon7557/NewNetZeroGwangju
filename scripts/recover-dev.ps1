$ErrorActionPreference = 'SilentlyContinue'

# Stop background jobs (from previous dev runs)
Get-Job | Stop-Job -Force | Out-Null
Get-Job | Remove-Job -Force | Out-Null

# Kill any process listening on port 3000
$cons = Get-NetTCPConnection -State Listen -LocalPort 3000
if ($cons) {
  $pids = $cons | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($pid in $pids) {
    try { Stop-Process -Id $pid -Force } catch {}
  }
}

Start-Sleep -Seconds 1

# Restart dev server
Start-Job { param($p) cd $p; npm run dev --silent } -ArgumentList (Resolve-Path '..' | Select-Object -ExpandProperty Path) | Out-Null

# Health check
for ($i = 0; $i -lt 20; $i++) {
  try {
    $code = (Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/ -TimeoutSec 3).StatusCode
    if ($code -eq 200) { Write-Output 'OK'; exit 0 }
  } catch {}
  Start-Sleep -Milliseconds 700
}

Write-Output 'FAILED'
exit 1


