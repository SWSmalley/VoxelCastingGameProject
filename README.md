## Overview:

This is currently a first pass implementation that uses raycasting to project a 2D height map onto a canvas. The image produced is B&W and reflects the distance of features to the camera.

## short term todo:

-  The algorithm needs a lot of optimisation - current render times for a 800x800px image are close to 10s. There are existing solutions they just need to be implemented.

-  The final image is distorted due to rendering features with respect to the camera origin and not the pixels of the display.

-  Controls to navigate the 3d space

![outputexample](https://github.com/user-attachments/assets/6a71e347-e621-4553-97ba-0e33087afea6)

