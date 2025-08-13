$ErrorActionPreference = 'SilentlyContinue'

# Stop lingering background jobs
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

Start-Sleep -Milliseconds 500


