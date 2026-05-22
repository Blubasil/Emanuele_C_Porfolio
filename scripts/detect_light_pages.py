from pathlib import Path
from PIL import Image

pages = Path(__file__).resolve().parents[1] / "public" / "assets" / "pages"
for p in sorted(pages.glob("page-*.webp")):
    im = Image.open(p).convert("L").resize((256, 192))
    w, h = im.size
    data = list(im.get_flattened_data())
    full = sum(data) / len(data)
    # top/bottom 12% strips (PDF header/footer zones)
    m = int(h * 0.12)
    top = data[: w * m]
    bot = data[w * (h - m) :]
    edge_avg = (sum(top) / len(top) + sum(bot) / len(bot)) / 2
    light = full > 165 and edge_avg > 150
    print(f"{p.stem}: full={full:.0f} edge={edge_avg:.0f} {'LIGHT' if light else 'dark'}")
