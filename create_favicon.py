from PIL import Image, ImageDraw
import os

# Create a 32x32 favicon with a crypto theme
size = 32
img = Image.new('RGB', (size, size), color='#1a1a2e')
draw = ImageDraw.Draw(img)

# Draw a Bitcoin-style "B" symbol in golden color
# Outer circle
draw.ellipse([4, 4, 28, 28], fill='#f39c12', outline='#f39c12')

# Inner shapes for "B" letter effect
# Left vertical line (white)
draw.rectangle([10, 8, 13, 24], fill='#1a1a2e')

# Top half circle cutout
draw.ellipse([12, 10, 20, 16], fill='#1a1a2e')

# Bottom half circle cutout  
draw.ellipse([12, 18, 20, 24], fill='#1a1a2e')

# Top and bottom bars
draw.rectangle([13, 8, 22, 10], fill='#1a1a2e')
draw.rectangle([13, 15, 22, 17], fill='#1a1a2e')
draw.rectangle([13, 22, 22, 24], fill='#1a1a2e')

# Save as favicon.ico
output_path = 'app/favicon.ico'
img.save(output_path, format='ICO', sizes=[(32, 32)])
print(f"✅ Favicon created successfully at {output_path}")

# Also create a 16x16 version
img_small = img.resize((16, 16), Image.Resampling.LANCZOS)
output_path_16 = 'public/favicon-16x16.ico'
img_small.save(output_path_16, format='ICO', sizes=[(16, 16)])
print(f"✅ Small favicon created at {output_path_16}")
