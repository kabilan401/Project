Add-Type -AssemblyName System.Drawing

$logoPath = "c:\Users\Kabilan\OneDrive\Desktop\Presentation\public\logo.png"
if (-not (Test-Path $logoPath)) {
    Write-Error "Logo file not found at $logoPath"
    exit 1
}

$logo = [System.Drawing.Image]::FromFile($logoPath)

$sizes = @(
    @{ Path = "android\app\src\main\res\mipmap-mdpi"; Size = 48 },
    @{ Path = "android\app\src\main\res\mipmap-hdpi"; Size = 72 },
    @{ Path = "android\app\src\main\res\mipmap-xhdpi"; Size = 96 },
    @{ Path = "android\app\src\main\res\mipmap-xxhdpi"; Size = 144 },
    @{ Path = "android\app\src\main\res\mipmap-xxxhdpi"; Size = 192 }
)

foreach ($item in $sizes) {
    $dir = $item.Path
    $dim = $item.Size
    
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $bmp = New-Object System.Drawing.Bitmap($dim, $dim)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($logo, 0, 0, $dim, $dim)
    $g.Dispose()

    $bmp.Save("$dir\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save("$dir\ic_launcher_round.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save("$dir\ic_launcher_foreground.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    Write-Host "Updated icons in $dir ($dim x $dim)"
}

$logo.Dispose()
Write-Host "All Android app icons updated successfully!"
