import numpy as np
from PIL import Image

full = np.array(Image.open("public/images/Khayaal_logo.png").convert("RGBA")).astype(np.int16)
trim = np.array(Image.open("public/images/Khayaal_logo_trimmed.png").convert("RGBA")).astype(np.int16)

core = full[full[..., 3] >= 250][:, :3]
print("opaque core RGB:")
print("  median:", np.median(core, axis=0))
print("  mean  :", core.mean(axis=0).round(2))
print("  p05   :", np.percentile(core, 5, axis=0))
print("  p95   :", np.percentile(core, 95, axis=0))
print("  hex   : #%02X%02X%02X" % tuple(int(v) for v in np.median(core, axis=0)))

# where is the content in the full canvas
a = full[..., 3]
ys, xs = np.nonzero(a > 0)
print("full content bbox x", xs.min(), xs.max(), "y", ys.min(), ys.max())

# locate exact crop offset of trimmed inside full
print("crop offset search (mean abs diff):")
for y0 in range(ys.min() - 1, ys.min() + 4):
    for x0 in (xs.min() - 1, xs.min(), xs.min() + 1):
        sub = full[y0:y0 + 146, x0:x0 + 276]
        if sub.shape[:2] != trim.shape[:2]:
            continue
        print("   y0=%d x0=%d -> %.4f" % (y0, x0, np.abs(sub.astype(int) - trim.astype(int)).mean()))

# alpha edge quality: how much of the mark is partial coverage
ta = trim[..., 3]
ink = ta > 0
print("trim: ink px", int(ink.sum()), " partial(0<a<255)", int(((ta > 0) & (ta < 255)).sum()),
      " solid(255)", int((ta == 255).sum()))
print("=> %.1f%% of ink pixels carry anti-aliasing" % (100.0 * ((ta > 0) & (ta < 255)).sum() / ink.sum()))

# preview: nearest 4x vs bicubic 4x of the alpha
src = Image.fromarray(ta, "L")
S = 4
near = src.resize((src.width * S, src.height * S), Image.NEAREST)
bicu = src.resize((src.width * S, src.height * S), Image.BICUBIC)
gap = 20
combo = Image.new("L", (near.width * 2 + gap, near.height), 128)
combo.paste(near, (0, 0))
combo.paste(bicu, (near.width + gap, 0))
combo.save("tools/_mask_preview.png")
print("saved tools/_mask_preview.png", combo.size)
