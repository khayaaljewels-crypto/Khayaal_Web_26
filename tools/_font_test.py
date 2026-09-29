import sys
import numpy as np
from PIL import Image, ImageFont, ImageDraw
from fontTools.ttLib import TTFont

SRC_FONT = "public/fonts/BrittanySignature.woff2"
TTF = "tools/_BrittanySignature.ttf"
LOGO = "public/images/Khayaal_logo_trimmed.png"

f = TTFont(SRC_FONT)
print("flavor:", f.flavor)
for rec in f["name"].names:
    if rec.nameID in (1, 2, 4, 5, 6):
        try:
            print("  name", rec.nameID, "=", rec.toUnicode())
        except Exception:
            pass
print("numGlyphs:", f["maxp"].numGlyphs)
cmap = f.getBestCmap()
print("missing in 'Khayaal':", [c for c in "Khayaal" if ord(c) not in cmap])
print("has space:", 32 in cmap)
f.flavor = None
f.save(TTF)
print("saved:", TTF)

# ---- connected components of the source mark -------------------------------
arr = np.array(Image.open(LOGO).convert("RGBA")).astype(np.int16)
mask = arr[..., 3] > 40
H, W = mask.shape
seen = np.zeros_like(mask, dtype=bool)
comps = []
for y0 in range(H):
    for x0 in range(W):
        if mask[y0, x0] and not seen[y0, x0]:
            stack = [(y0, x0)]
            seen[y0, x0] = True
            pix = []
            while stack:
                y, x = stack.pop()
                pix.append((y, x))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            stack.append((ny, nx))
            ys = [p[0] for p in pix]
            xs = [p[1] for p in pix]
            comps.append((len(pix), min(xs), min(ys), max(xs), max(ys)))
comps.sort(reverse=True)
print("components (area, x0,y0,x1,y1) top 20 of", len(comps))
for c in comps[:20]:
    print("   ", c)

# ---- render the script font ------------------------------------------------
font = ImageFont.truetype(TTF, 400)
bbox = font.getbbox("Khayaal")
print("font render size400 bbox:", bbox, "w:", bbox[2] - bbox[0], "h:", bbox[3] - bbox[1])
print("ratio w/h:", (bbox[2] - bbox[0]) / (bbox[3] - bbox[1]))
