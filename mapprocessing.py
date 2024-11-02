import json
from PIL import Image
import numpy as np

def image_to_brightness_array(image_path):
    img = Image.open(image_path).convert('L')
    img_array = np.asarray(img)
    brightness = img_array / 2.55
    return brightness

def save_brightness_array_as_json(brightness_array, output_path):
    # Convert the brightness array to a nested list (2D array)
    brightness_list = brightness_array.tolist()
    
    # Save to a JSON file
    with open(output_path, 'w') as json_file:
        json.dump(brightness_list, json_file)

# Example usage
image_path = 'test heightmap.png'
output_path = 'map.json'

brightness_array = image_to_brightness_array(image_path)
save_brightness_array_as_json(brightness_array, output_path)

print(f'Saved brightness array to {output_path}')