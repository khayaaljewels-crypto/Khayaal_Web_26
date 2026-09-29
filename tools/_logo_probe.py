import os
from PIL import Image

TARGETS = [
    "public/images/Khayaal_logo.png",
    "public/images/Khayaal_logo_trimmed.png",
    "public/images/bg.jpeg",
    "public/images/BG1.jpeg",
]

for p in TARGETS:
    if not os.path.exists(p):
        print(p, "MISSING")
        continue
    im = Image.open(p)
    print("=" * 60)
    print(p)
    print("  format:", im.format, "mode:", im.mode, "size:", im.size)
    print("  info keys:", sorted(im.info.keys()))
    rgba = im.convert("RGBA")
    px = list(rgba.getdata())
    n = len(px)
    alphas = sorted({a for (_, _, _, a) in px})
    print("  distinct alpha count:", len(alphas), "min:", alphas[0], "max:", alphas[-1])
    step = max(1, n // 12)
    print("  samples:", [px[i] for i in range(0, n, step)])
    if alphas[0] < 255:
        print("  -> has transparency")
