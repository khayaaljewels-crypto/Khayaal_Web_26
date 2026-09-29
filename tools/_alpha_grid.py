import numpy as np
from PIL import Image

ta = np.array(Image.open("public/images/Khayaal_logo_trimmed.png").convert("RGBA"))[..., 3]
mass = ta.astype(np.float64).sum() / 255.0
print("ink mass (sum alpha/255):", round(mass, 1))
print("ink pixels:", int((ta > 0).sum()))
print("mean alpha over ink:", round(ta[ta > 0].mean(), 1))

def dump(x0, x1, y0, y1, title):
    print("-" * (4 * (x1 - x0) + 8), title)
    for y in range(y0, y1):
        print("%4d " % y + "".join("%4d" % ta[y, x] for x in range(x0, x1)))

dump(178, 202, 36, 60, "window A (x178-201,y36-59)")
dump(56, 80, 30, 54, "window B (x56-79,y30-53)")

# magnified crop for visual inspection
crop = Image.fromarray(ta[36:60, 178:202], "L")
crop.resize((crop.width * 16, crop.height * 16), Image.NEAREST).save("tools/_alpha_zoom.png")
print("saved tools/_alpha_zoom.png")
