## Overview:

This is currently a first pass implementation that uses raycasting to project a 2D height map onto a canvas. The image produced is B&W and reflects the distance of features to the camera.

## short term todo:

-  The algorithm needs a lot of optimisation for use in live rendering - current render times for a 800x800px image are close to 10s - The current system casts from each pixel of the viewport to each pixel on the surface along its ray direction. This is more appropriate for full 3d raycast rendering and a lot of information is duplicated in the final render as a result. Games of the 90's rendered columns as opposed to pixels dramatically reducing the number of iterations required.

-  The final image is distorted due to rendering features with respect to the camera origin and not the pixels of the display.

-  Controls to navigate the 3d space in browser / change the camera location.

-  How intput and output resolutions are reconciled needs to be refactored so they can be independent of one another without errors in output

![outputexample](https://github.com/user-attachments/assets/6a71e347-e621-4553-97ba-0e33087afea6)

