$ErrorActionPreference = 'SilentlyContinue'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$log = Join-Path $PSScriptRoot 'watch.log'

function Log([string]$msg) {
    $timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    "$timestamp $msg" | Out-File -FilePath $log -Encoding utf8 -Append
}

function Start-Dev {
    try { Get-Job -Name 'netzero-dev' | Where-Object { $_.State -ne 'Running' } | Remove-Job -Force } catch {}
    $running = Get-Job -Name 'netzero-dev' -State Running
    if ($running) { return }
    Start-Job -Name 'netzero-dev' -ScriptBlock { param($p) cd $p; npm run dev --silent } -ArgumentList $root | Out-Null
    Start-Sleep -Seconds 2
}

function Ensure-Dev {
    $cons = Get-NetTCPConnection -State Listen -LocalPort 3000
    $listenerCount = ($cons | Measure-Object).Count

    if ($listenerCount -gt 1) {
        Log "Multiple listeners ($listenerCount) on 3000. Killing..."
        $cons | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { try { Stop-Process -Id $_ -Force } catch {} }
        Start-Sleep -Milliseconds 500
    }

    if ($listenerCount -eq 1) {
        $ok = $false
        try {
            $code = (Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/ -TimeoutSec 3).StatusCode
            if ($code -eq 200) { $ok = $true }
        } catch {}
        if (-not $ok) {
            Log "Health check failed. Restarting dev."
            $cons | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { try { Stop-Process -Id $_ -Force } catch {} }
            Start-Sleep -Milliseconds 300
            Start-Dev
        }
        return
    }

    if ($listenerCount -eq 0) {
        Log "No listener. Starting dev..."
        Start-Dev
        return
    }
}

Log "Watchdog started at $root"
while ($true) {
    Ensure-Dev
    Start-Sleep -Seconds 3
}


