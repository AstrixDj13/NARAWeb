import os
import glob
from fontTools.ttLib import TTFont

fonts_dir = os.path.join(os.getcwd(), 'src', 'fonts', 'antikor_mono')
outfit_dir = os.path.join(os.getcwd(), 'src', 'fonts', 'Outfit')

keep_antikor = [
    'Taner Ardali  Antikor Mono Regular.ttf',
    'Taner Ardali  Antikor Mono Medium.ttf',
    'Taner Ardali  Antikor Mono Bold.ttf'
]

keep_outfit = [
    'outfit_variable.ttf'
]

def process_dir(directory, keep_files):
    if not os.path.exists(directory):
        return
    for file in os.listdir(directory):
        if not file.endswith('.ttf'):
            continue
        filepath = os.path.join(directory, file)
        if file in keep_files:
            print(f"Converting {file} to WOFF2...")
            try:
                font = TTFont(filepath)
                font.flavor = 'woff2'
                outpath = filepath.replace('.ttf', '.woff2')
                font.save(outpath)
                print(f"Success: {outpath}")
                os.remove(filepath)
            except Exception as e:
                print(f"Failed to convert {file}: {e}")
        else:
            print(f"Deleting unused font: {file}")
            os.remove(filepath)

process_dir(fonts_dir, keep_antikor)
process_dir(outfit_dir, keep_outfit)
print("Conversion process complete.")
