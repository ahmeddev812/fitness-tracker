# Generates PULSE PWA PNG icons without sharp (Windows PowerShell + System.Drawing)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$icons = Join-Path $root "public\icons"
if (-not (Test-Path $icons)) { New-Item -ItemType Directory -Path $icons | Out-Null }

Add-Type -AssemblyName System.Drawing

function New-PulseIcon {
  param(
    [int]$Size,
    [string]$Path,
    [switch]$Maskable
  )

  $bg = [System.Drawing.Color]::FromArgb(255, 108, 92, 231)
  $bg2 = [System.Drawing.Color]::FromArgb(255, 162, 155, 254)

  $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear($bg)

  $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $bg, $bg2, 45)
  [void]$g.FillRectangle($brush, $rect)
  $brush.Dispose()

  $pad = if ($Maskable) { $Size * 0.30 } else { $Size * 0.22 }
  $inner = $Size - (2 * $pad)
  $scale = $inner / 24.0

  $pts = @(
    @(0, 12), @(4, 12), @(6, 6), @(9, 18), @(12, 12),
    @(16, 12), @(18, 8), @(21, 16), @(24, 12)
  )

  $penW = [math]::Max(2.0, $Size * 0.045)
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $penW)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

  $pointObjs = New-Object System.Collections.Generic.List[System.Drawing.PointF]
  foreach ($p in $pts) {
    $x = [float]($pad + ($p[0] * $scale))
    $y = [float]($pad + ($p[1] * $scale))
    [void]$pointObjs.Add((New-Object System.Drawing.PointF($x, $y)))
  }
  [void]$g.DrawLines($pen, $pointObjs.ToArray())
  $pen.Dispose()

  $g.Dispose()
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Wrote $Path"
}

New-PulseIcon -Size 192 -Path (Join-Path $icons "icon-192.png")
New-PulseIcon -Size 512 -Path (Join-Path $icons "icon-512.png")
New-PulseIcon -Size 512 -Path (Join-Path $icons "icon-maskable-512.png") -Maskable
Write-Host "Done."
