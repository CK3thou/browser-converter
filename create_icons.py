#!/usr/bin/env python3
"""Create extension icons for Text Converter Pro"""

from PIL import Image, ImageDraw, ImageFont
import os

# Icon sizes
SIZES = [16, 48, 128]

# Create icons directory if it doesn't exist
icons_dir = 'icons'
if not os.path.exists(icons_dir):
    os.makedirs(icons_dir)

def create_icon(size):
    """Create a simple gradient icon with TC text"""
    # Create image with blue gradient
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)
    
    # Draw blue gradient background
    for i in range(size):
        # Gradient from light blue to dark blue
        r = int(30 - (30 * i / size))
        g = int(144 - (42 * i / size))
        b = int(255 - (51 * i / size))
        # Draw horizontal line with gradient color
        draw.rectangle([(0, i), (size, i+1)], fill=(r, g, b))
    
    # Draw white border
    draw.rectangle([(0, 0), (size-1, size-1)], outline=(255, 255, 255), width=1)
    
    # Draw text "TC" (Text Converter)
    try:
        # Try to use a nice font, fallback to default
        font_size = max(int(size * 0.5), 1)
        if size == 128:
            font = ImageFont.load_default()
        else:
            font = ImageFont.load_default()
        
        text = "TC"
        # Get text bounding box
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Center text
        x = (size - text_width) // 2
        y = (size - text_height) // 2
        
        draw.text((x, y), text, fill=(255, 255, 255), font=font)
    except Exception as e:
        print(f"Warning: Could not draw text: {e}")
    
    return img

# Create icons for each size
for size in SIZES:
    icon = create_icon(size)
    filename = os.path.join(icons_dir, f'icon{size}.png')
    icon.save(filename)
    print(f'✓ Created {filename} ({size}x{size})')

print('\n✓ All icons created successfully!')
