# Icon generation (no sharp available)

PNG icons are generated via Windows PowerShell + System.Drawing (no npm packages).

Run from repo root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/generate-icons.ps1
```

If conversion fails manually, upload `public/icons/icon-512.svg` to
https://realfavicongenerator.net/ and export 192 / 512 / maskable-512 PNGs into `public/icons/`.
