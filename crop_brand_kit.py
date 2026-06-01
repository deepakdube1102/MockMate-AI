import os
from PIL import Image, ImageDraw

def make_sheet_transparent(img, thresh=30):
    # Ensure image is in RGBA mode for transparency
    rgba = img.convert("RGBA")
    w, h = rgba.size
    
    # Target color is fully transparent
    transparent_color = (255, 255, 255, 0)
    
    # Flood-fill from the four corner coordinates of the entire sheet
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    for pt in corners:
        pixel = rgba.getpixel(pt)
        # Check if the pixel is white-ish (R, G, B > 220)
        if pixel[0] > 220 and pixel[1] > 220 and pixel[2] > 220:
            ImageDraw.floodfill(rgba, pt, transparent_color, thresh=thresh)
            
    return rgba

def remove_mascot_gradient_bg(rgba, thresh=24):
    w, h = rgba.size
    transparent_color = (255, 255, 255, 0)
    
    # 1. SCAN FROM LEFT TO RIGHT ON EACH ROW
    for y in range(h):
        for x in range(w):
            r, g, b, a = rgba.getpixel((x, y))
            if a > 0:
                # First opaque pixel on this row from the left
                if r > 100 and g > 100 and b > 120:
                    ImageDraw.floodfill(rgba, (x, y), transparent_color, thresh=thresh)
                break
                
    # 2. SCAN FROM RIGHT TO LEFT ON EACH ROW
    for y in range(h):
        for x in range(w - 1, -1, -1):
            r, g, b, a = rgba.getpixel((x, y))
            if a > 0:
                # First opaque pixel on this row from the right
                if r > 100 and g > 100 and b > 120:
                    ImageDraw.floodfill(rgba, (x, y), transparent_color, thresh=thresh)
                break
                
    # 3. SCAN FROM TOP TO BOTTOM ON EACH COLUMN
    for x in range(w):
        for y in range(h):
            r, g, b, a = rgba.getpixel((x, y))
            if a > 0:
                # First opaque pixel on this column from the top
                if r > 100 and g > 100 and b > 120:
                    ImageDraw.floodfill(rgba, (x, y), transparent_color, thresh=thresh)
                break
                
    return rgba

def crop_and_trim(img, coords, output_path, padding=10, is_card=False):
    # Crop initial bounding box from the pre-processed transparent sheet
    cropped = img.crop(coords)
    
    if not is_card:
        # Since it is already transparent, find the bounding box of non-zero alpha pixels
        bbox = cropped.getbbox()
        if bbox:
            padded_bbox = (
                max(0, bbox[0] - padding),
                max(0, bbox[1] - padding),
                min(cropped.width, bbox[2] + padding),
                min(cropped.height, bbox[3] + padding)
            )
            cropped = cropped.crop(padded_bbox)
            
    # Specialized gradient removal for mox_mascot.png
    if "mox_mascot.png" in output_path:
        cropped = remove_mascot_gradient_bg(cropped)
            
    # Save transparent PNG
    cropped.save(output_path, "PNG")
    print(f"Extracted & Transparent: {output_path} with size {cropped.size}")

def main():
    img_path = "MockMate_BK.png"
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found.")
        return

    img = Image.open(img_path)
    
    # Target directories
    assets_dir = os.path.join("client", "src", "assets")
    public_dir = os.path.join("client", "public")
    
    os.makedirs(assets_dir, exist_ok=True)
    os.makedirs(public_dir, exist_ok=True)

    print("Pre-processing brand kit sheet to remove global background background...")
    # Pre-process the entire sheet to make its background transparent!
    transparent_sheet = make_sheet_transparent(img, thresh=30)

    # Bounding regions (left, upper, right, lower)
    crops = {
        # 1. Logos
        os.path.join(assets_dir, "logo_primary.png"): ((15, 15, 920, 410), False),
        os.path.join(assets_dir, "logo_secondary.png"): ((15, 430, 360, 625), False),
        os.path.join(assets_dir, "logo_horizontal.png"): ((370, 430, 720, 625), False),
        os.path.join(assets_dir, "logo_symbol.png"): ((730, 430, 920, 625), False),
        
        # 2. Meet Mox & Mascot at desk
        os.path.join(assets_dir, "meet_mox.png"): ((936, 15, 1520, 430), True),
        os.path.join(assets_dir, "mox_mascot.png"): ((995, 80, 1275, 395), False),
        
        # 3. Favicon (Crop the small owl head from the middle-right FAVICON section)
        os.path.join(public_dir, "mox_favicon.png"): ((1390, 490, 1490, 615), False),
        
        # 4. Mascot Expressions (Happy, Thinking, Focused, Celebration)
        os.path.join(assets_dir, "mox_happy.png"): ((760, 715, 930, 915), False),
        os.path.join(assets_dir, "mox_thinking.png"): ((935, 715, 1115, 915), False),
        os.path.join(assets_dir, "mox_focused.png"): ((1120, 715, 1295, 915), False),
        os.path.join(assets_dir, "mox_celebration.png"): ((1300, 715, 1530, 920), False)
    }

    for path, (coords, is_card) in crops.items():
        crop_and_trim(transparent_sheet, coords, path, is_card=is_card)

    print("\nBrand assets successfully extracted with beautiful transparent backgrounds!")

if __name__ == "__main__":
    main()
