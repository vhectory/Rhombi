#!/usr/bin/env python3
"""
scan_fotos.py — Rhombi website foto-scanner
Genereert fotos.json op basis van de inhoud van de fotos/ mappen.
Optioneel: converteert JPG naar WebP voor snellere laadtijden.

Gebruik:
  python3 scan_fotos.py            # scan + update fotos.json
  python3 scan_fotos.py --webp     # scan + converteer naar WebP
  python3 scan_fotos.py --check    # controleer welke mappen foto's missen
"""

import os, json, sys, argparse
from pathlib import Path

BASE = Path(__file__).parent

# Mappen die gescand worden en hun JSON-sleutel
FOLDERS = {
    "sfeer":              "sfeer",
    "kunst":              "kunst",
    "hero":               "hero",
    "tafel":              "tafel",
    "accent":             "accent",
    "wand":               "wand",
    "plafond":            "plafond",
    "hang":               "hang",
    "uitleg":             "uitleg",
    "ontwerper":          "ontwerper",
    "geometrie":          "geometrie",
    "materiaal/basic":    "materiaal/basic",
    "materiaal/mat":      "materiaal/mat",
    "materiaal/cf":       "materiaal/cf",
    "materiaal/metal":    "materiaal/metal",
    "materiaal/translucent": "materiaal/translucent",
}

IMG_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}

def scan():
    result = {}
    missing = []

    for folder, key in FOLDERS.items():
        path = BASE / "fotos" / folder
        if not path.exists():
            missing.append(folder)
            result[key] = []
            continue

        files = sorted([
            f.name for f in path.iterdir()
            if f.suffix.lower() in IMG_EXTS
            and f.name != "placeholder.jpg"
            and not f.name.startswith(".")
        ], reverse=True)  # nieuwste eerst (tijdstempelbestandsnamen)

        result[key] = files
        if not files:
            missing.append(folder)

    return result, missing

def check(missing):
    print("\n📷 Foto-status Rhombi website\n" + "─" * 40)
    for folder, key in FOLDERS.items():
        path = BASE / "fotos" / folder
        count = 0
        if path.exists():
            count = len([f for f in path.iterdir()
                        if f.suffix.lower() in IMG_EXTS
                        and f.name != "placeholder.jpg"])
        status = "✓" if count > 0 else "✗ LEEG"
        print(f"  {status:12}  fotos/{folder}/  ({count} foto's)")
    print()

def convert_webp():
    try:
        from PIL import Image
    except ImportError:
        print("Installeer Pillow: pip install Pillow")
        return

    converted = 0
    for folder in FOLDERS:
        path = BASE / "fotos" / folder
        if not path.exists():
            continue
        for img_path in path.glob("*.jpg"):
            webp_path = img_path.with_suffix(".webp")
            if webp_path.exists():
                continue
            try:
                img = Image.open(img_path)
                img.save(webp_path, "WEBP", quality=85, method=6)
                print(f"  → {webp_path.relative_to(BASE)}")
                converted += 1
            except Exception as e:
                print(f"  ✗ {img_path.name}: {e}")

    print(f"\n{converted} bestanden geconverteerd naar WebP")

def main():
    parser = argparse.ArgumentParser(description="Rhombi foto-scanner")
    parser.add_argument("--webp", action="store_true", help="Converteer JPGs naar WebP")
    parser.add_argument("--check", action="store_true", help="Controleer welke mappen leeg zijn")
    args = parser.parse_args()

    data, missing = scan()

    if args.check or missing:
        check(missing)

    if args.webp:
        print("WebP conversie...")
        convert_webp()

    # Schrijf fotos.json
    out = BASE / "fotos.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    total = sum(len(v) for v in data.values())
    print(f"✓ fotos.json bijgewerkt — {total} foto's in {len(FOLDERS)} mappen")

    if missing:
        print(f"\n⚠ Lege mappen ({len(missing)}): {', '.join(missing)}")
        print("  Voeg foto's toe en run dit script opnieuw.\n")

if __name__ == "__main__":
    main()
