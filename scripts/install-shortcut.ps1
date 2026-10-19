# `npm run shortcut` (Windows): puts a WOMBOT shortcut on the desktop and in the Start menu. It opens the WOMBOT chat
# in Microsoft 365 Copilot in its own Edge window. Needs a provisioned agent: M365_TITLE_ID in env/.env.dev.
# Kept ASCII-only: Windows PowerShell 5.1 reads UTF-8 files without a BOM as Windows-1252.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

$envFile = Join-Path $root 'env\.env.dev'
if (-not (Test-Path $envFile)) { throw 'env/.env.dev not found. Run npm run env:init and provision WOMBOT first.' }
$titleLine = Get-Content $envFile | Where-Object { $_ -match '^M365_TITLE_ID=(\S+)$' } | Select-Object -First 1
if (-not $titleLine) { throw 'M365_TITLE_ID is missing in env/.env.dev. Provision WOMBOT first (docs/tutorials/erste-schritte.md).' }
$titleId = ($titleLine -split '=', 2)[1]
$url = "https://m365.cloud.microsoft/chat/?titleId=$titleId"

$edge = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'Microsoft Edge not found.' }

# An .ico that embeds the 192 px PNG; Windows scales it for the desktop, Start menu and taskbar.
$iconDirectory = Join-Path $env:LOCALAPPDATA 'WOMBOT'
New-Item -ItemType Directory -Force $iconDirectory | Out-Null
$icon = Join-Path $iconDirectory 'wombot.ico'
$png = [IO.File]::ReadAllBytes((Join-Path $root 'appPackage\color.png'))
$stream = New-Object IO.MemoryStream
$writer = New-Object IO.BinaryWriter $stream
$writer.Write([UInt16]0); $writer.Write([UInt16]1); $writer.Write([UInt16]1)
$writer.Write([Byte]192); $writer.Write([Byte]192); $writer.Write([Byte]0); $writer.Write([Byte]0)
$writer.Write([UInt16]1); $writer.Write([UInt16]32); $writer.Write([UInt32]$png.Length); $writer.Write([UInt32]22)
$writer.Write($png)
$writer.Flush()
[IO.File]::WriteAllBytes($icon, $stream.ToArray())

$shell = New-Object -ComObject WScript.Shell
foreach ($folder in @([Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('Programs'))) {
  $path = Join-Path $folder 'WOMBOT.lnk'
  $shortcut = $shell.CreateShortcut($path)
  $shortcut.TargetPath = $edge
  $shortcut.Arguments = "--app=`"$url`""
  $shortcut.IconLocation = "$icon,0"
  $shortcut.Description = 'WOMBOT - who owes me what?'
  $shortcut.WorkingDirectory = Split-Path $edge
  $shortcut.Save()
  Write-Output "Created $path"
}
Write-Output 'To pin it to the taskbar: right-click WOMBOT in the Start menu and choose Pin to taskbar.'
