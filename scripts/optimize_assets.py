"""Convert page PNGs to WebP for faster loading."""
from pathlib import Path
from PIL import Image

PAGES = Path(__file__).resolve().parents[1] / "public" / "assets" / "pages"

def main():
    for png in sorted(PAGES.glob("page-*.png")):
        webp = png.with_suffix(".webp")
        img = Image.open(png)
        img.save(webp, "WEBP", quality=82, method=6)
        png.unlink()
        print(f"{webp.name}: {webp.stat().st_size // 1024} KB")

if __name__ == "__main__":
    main()
