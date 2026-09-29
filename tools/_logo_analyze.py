import numpy as np
from PIL import Image

def load(p):
    return np.array(Image.open(p).convert("RGBA")).astype(np.int16)

full = load("public/images/Khayaal_logo.png")
trim = load("public/images/Khayaal_logo_trimmed.png")

for name, arr in (("full", full), ("trim", trim)):
    a = arr[..., 3]
    ys, xs = np.nonzero(a > 0)
    core = arr[a >= 250]
    print("=" * 62)
    print(name, "shape", arr.shape)
    print("  content bbox  x:", xs.min(), "-", xs.max(), "  y:", ys.min(), "-", ys.max())
    print("  content size  w:", xs.max() - xs.min() + 1, " h:", ys.max() - ys.min() + 1)
    print("  opaque pixels (a>=250):", core.shape[0])
    uniq, counts = np.unique(core.reshape(-1, 4), axis=0, return_counts=True)
    order = np.argsort(-counts)
    print("  distinct fully-opaque colors:", len(uniq))
    for i in order[:8]:
        r, g, b, al = uniq[i]
        print("     #%02X%02X%02X" % (r, g, b), "count", counts[i])
    # alpha ramp histogram
    hist = np.bincount(a.ravel(), minlength=256)
    print("  alpha buckets 0/1-127/128-254/255:",
          hist[0], hist[1:128].sum(), hist[128:255].sum(), hist[255])
