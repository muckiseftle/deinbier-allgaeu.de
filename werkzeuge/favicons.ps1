# =============================================================================
# Erzeugt das Favicon-Set aus dem Logo.
#
# ACHTUNG: Quelle ist derzeit das 300-px-PNG der Altseite. Die Groessen ab
# 192 px werden dadurch hochskaliert und sind nicht scharf. Sobald die
# Vektordatei vorliegt (OFFENE-FRAGEN Nr. 16), muss dieses Skript erneut
# laufen, dann mit der SVG als Quelle.
#
# Aufruf:  powershell -File werkzeuge/favicons.ps1
# =============================================================================

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Set-Location (Split-Path $PSScriptRoot -Parent)

$quelle = 'public\logo.png'
$ziel = 'public'

function Skaliere([string]$quellPfad, [int]$kante, [string]$hintergrund, [double]$anteil) {
  # anteil: wie viel der Kantenlaenge das Logo einnimmt (1.0 = randlos).
  # Fuer maskierbare Symbole braucht Android einen Sicherheitsrand.
  $src = [System.Drawing.Image]::FromFile((Resolve-Path $quellPfad))
  $bmp = New-Object System.Drawing.Bitmap($kante, $kante)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  if ($hintergrund) {
    $farbe = [System.Drawing.ColorTranslator]::FromHtml($hintergrund)
    $g.Clear($farbe)
  } else {
    $g.Clear([System.Drawing.Color]::Transparent)
  }

  $innen = [int]($kante * $anteil)
  $versatz = [int](($kante - $innen) / 2)
  $g.DrawImage($src, $versatz, $versatz, $innen, $innen)

  $g.Dispose()
  $src.Dispose()
  return $bmp
}

# --- PNG-Symbole -------------------------------------------------------------
# Cremefarbener Hintergrund statt Transparenz: das Logo hat einen dunklen
# Rand, der auf dunklen Kacheln sonst verschwindet.
$symbole = @(
  @{ datei = 'apple-touch-icon.png'; kante = 180; bg = '#FBF7EC'; anteil = 0.86 }
  @{ datei = 'icon-192.png';         kante = 192; bg = '#FBF7EC'; anteil = 0.90 }
  @{ datei = 'icon-512.png';         kante = 512; bg = '#FBF7EC'; anteil = 0.90 }
  # Maskierbar: Android schneidet bis zu 20 Prozent weg, deshalb mehr Rand.
  @{ datei = 'icon-512-maskable.png'; kante = 512; bg = '#FBF7EC'; anteil = 0.64 }
)

foreach ($s in $symbole) {
  $bmp = Skaliere $quelle $s.kante $s.bg $s.anteil
  $pfad = Join-Path $ziel $s.datei
  $bmp.Save($pfad, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  "{0,-26} {1}x{1}  {2:N0} KB" -f $s.datei, $s.kante, ((Get-Item $pfad).Length / 1KB)
}

# --- favicon.ico -------------------------------------------------------------
# ICO mit eingebetteten PNG-Daten. Wird von allen aktuellen Browsern
# verstanden und ist deutlich kleiner als das alte BMP-Format.
$kanten = @(16, 32, 48)
$bloecke = @()

foreach ($k in $kanten) {
  $bmp = Skaliere $quelle $k '#FBF7EC' 1.0
  $ms = New-Object System.IO.MemoryStream
  $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  $bloecke += , @{ kante = $k; daten = $ms.ToArray() }
  $ms.Dispose()
}

$aus = New-Object System.IO.MemoryStream
$schreiber = New-Object System.IO.BinaryWriter($aus)

# ICONDIR
$schreiber.Write([UInt16]0)                  # reserviert
$schreiber.Write([UInt16]1)                  # Typ 1 = Symbol
$schreiber.Write([UInt16]$bloecke.Count)

# Der Datenbereich beginnt hinter Kopf und Verzeichnis.
$versatz = 6 + (16 * $bloecke.Count)

foreach ($b in $bloecke) {
  $schreiber.Write([Byte]($b.kante -band 0xFF))  # 256 waere 0
  $schreiber.Write([Byte]($b.kante -band 0xFF))
  $schreiber.Write([Byte]0)                      # Farbanzahl
  $schreiber.Write([Byte]0)                      # reserviert
  $schreiber.Write([UInt16]1)                    # Ebenen
  $schreiber.Write([UInt16]32)                   # Bit je Bildpunkt
  $schreiber.Write([UInt32]$b.daten.Length)
  $schreiber.Write([UInt32]$versatz)
  $versatz += $b.daten.Length
}

foreach ($b in $bloecke) { $schreiber.Write($b.daten) }

$schreiber.Flush()
[IO.File]::WriteAllBytes((Join-Path $ziel 'favicon.ico'), $aus.ToArray())
$schreiber.Dispose()
$aus.Dispose()

"{0,-26} 16+32+48  {1:N0} KB" -f 'favicon.ico', ((Get-Item (Join-Path $ziel 'favicon.ico')).Length / 1KB)
