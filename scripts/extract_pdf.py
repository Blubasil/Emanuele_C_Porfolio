"""Render PDF pages and extract embedded images."""
import fitz
from pathlib import Path

PDF = Path(__file__).resolve().parents[1] / "Design-Portfolio-Emanuele_Canova_ML.pdf"
OUT = Path(__file__).resolve().parents[1] / "public" / "assets"
PAGES = OUT / "pages"
IMAGES = OUT / "images"

def main():
    PAGES.mkdir(parents=True, exist_ok=True)
    IMAGES.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(PDF)
    print(f"pages: {doc.page_count}")
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        out = PAGES / f"page-{i+1:02d}.png"
        pix.save(str(out))
        print(f"wrote {out.name} {pix.width}x{pix.height}")
        for j, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            try:
                base = doc.extract_image(xref)
                ext = base["ext"]
                data = base["image"]
                img_path = IMAGES / f"p{i+1:02d}-img{j+1:02d}.{ext}"
                img_path.write_bytes(data)
            except Exception as e:
                print(f"  skip img {j}: {e}")
    doc.close()

if __name__ == "__main__":
    main()
