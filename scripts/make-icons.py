from PIL import Image
from pathlib import Path

src = Path(
    r"C:\Users\User\.cursor\projects\c-Users-User-Desktop-deutsch-app\assets"
    r"\c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images"
    r"_laut_logo-d424a792-29df-4a65-9c32-3fefb4f6683f.png"
)
out = Path(r"C:\Users\User\Desktop\deutsch-app\icons")
out.mkdir(exist_ok=True)

im = Image.open(src).convert("RGBA")
print("source", im.size, im.mode)

pixels = im.load()
w, h = im.size
min_x, min_y, max_x, max_y = w, h, 0, 0
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if a > 20 and (r + g + b) > 40:
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

pad = 8
bbox = (
    max(0, min_x - pad),
    max(0, min_y - pad),
    min(w, max_x + 1 + pad),
    min(h, max_y + 1 + pad),
)
content = im.crop(bbox)
print("content bbox", bbox, "size", content.size)

im.save(out / "logo.png", optimize=True)


def make_square(icon_content, size, bg=(0, 0, 0, 255), content_ratio=0.72):
    canvas = Image.new("RGBA", (size, size), bg)
    cw, ch = icon_content.size
    target = int(size * content_ratio)
    scale = min(target / cw, target / ch)
    nw, nh = max(1, int(cw * scale)), max(1, int(ch * scale))
    resized = icon_content.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.alpha_composite(resized, (x, y))
    return canvas


for name, size in [
    ("icon-192.png", 192),
    ("icon-512.png", 512),
    ("apple-touch-icon.png", 180),
]:
    icon = make_square(content, size, bg=(0, 0, 0, 255), content_ratio=0.78)
    icon.convert("RGB").save(out / name, optimize=True)
    print("wrote", name, size)


def knockout_black(img, threshold=28):
    px = img.load()
    ww, hh = img.size
    for y in range(hh):
        for x in range(ww):
            r, g, b, a = px[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                px[x, y] = (0, 0, 0, 0)
    return img


mark = knockout_black(content.copy())
mark_sq = make_square(mark, 256, bg=(0, 0, 0, 0), content_ratio=0.92)
mark_sq.save(out / "logo-mark.png", optimize=True)
print("wrote logo-mark.png")

fav = make_square(content, 32, bg=(0, 0, 0, 255), content_ratio=0.85)
fav.convert("RGB").save(out / "favicon.png", optimize=True)
print("done")
