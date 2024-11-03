import camera from "./objects/camera.js"
import Vector from "./objects/vectors.js";



const cameraStart = {x:350,y:300,z:100}
camera.setPosition(cameraStart.x,cameraStart.y,cameraStart.z)
camera.setFacing(0,0,1)
///render window vars
const canvas = document.getElementById('voxelViewport');
const topDownMap = document.getElementById('topDownMap');
const tdmpctx = topDownMap.getContext('2d');
const ctx = canvas.getContext('2d');
const width = 800;
const height = 800;
const FoVx = 90; // field of view in degrees
const FoVy = height/width *FoVx // set so the fov is consistent with the asepct ratio
let imageData = ctx.createImageData(width,height);
let mapimg = new Image()
mapimg.src = "heightmap.png"
const viewDistance =800
let pixelsHitMapMarkers = [] 

mapimg.onload = function(){
    tdmpctx.drawImage(mapimg,0,0,width,height)
}
///fps

const FPSLimit = 60;
const frameTime = 1.0/FPSLimit;
var oldCycleTime = 0 //total run time used for calculaitn delta
var cycleCount = 0; 
var fps_rate = "calculating..."



//heightmap code
let map = null
async function loadMap (path){
    map = await fetch(path)
    map = await map.json()
    gameLoop()
    tdmpctx.fillStyle = "red"; // Change color as needed

    // Draw each marker
    pixelsHitMapMarkers.forEach(([y, x]) => {
        tdmpctx.fillRect(x, y, 1, 1);})
    //console.log(pixelsHitMapMarkers)
    //console.log("image data length = ", imageData.length, ", imagedata  = ", imageData,)
     tdmpctx.fillStyle = "blue"
    tdmpctx.beginPath();  
    tdmpctx.arc(camera.position.x, camera.position.z, 4, 0, 2 * Math.PI)
    tdmpctx.fill()
    
}


//initialiseBasePixelVectors
let initialPixelVectors = []
function defineInitialPixelVectors(){
    for (let yPixelCoord =0; yPixelCoord<height;yPixelCoord++){
        let newPixelRow = []
        for (let xPixelCoord = 0; xPixelCoord<width; xPixelCoord++){
            // angles are done with respect to the z axis (forwards away from the camera)
            //so for this as the angle gets bigger the x component gets bigger
          // Calculate angle offsets for each pixel
            const xAngle = (-FoVx / 2 + (FoVx / width) * xPixelCoord) * (Math.PI / 180);
            const yAngle = (FoVy / 2 - (FoVy / height) * yPixelCoord) * (Math.PI / 180);

          // Calculate the components of the ray direction
            const xV = Math.sin(xAngle);              
            const yV = Math.sin(yAngle);              
            const zV = Math.cos(xAngle) * Math.cos(yAngle);  

          // Normalize the vector
            const length = Math.sqrt(xV * xV + yV * yV + zV * zV);
            let pixelVector = 
                {
                    x:xV/ length,
                    y:yV/ length,
                    z:zV/ length
                }
            newPixelRow.push(pixelVector) // add it to the row
            }
            initialPixelVectors.push(newPixelRow)
       
        }
        
    }

    defineInitialPixelVectors()




// main loop of the game
async function gameLoop(){

    if (map != null ){ //&& elapsedTime > frameTime


        let newFrame = getNewFrame();
        updateImageData(newFrame);
        ctx.putImageData(imageData, 0, 0)

    }
}



function getNewFrame(){
    let frame = []
    for (let yPixelCoord =0; yPixelCoord<height;yPixelCoord++){
        let newPixelRow = []
        for (let xPixelCoord = 0; xPixelCoord<width; xPixelCoord++){
            let newPixelValue = voxelScan(xPixelCoord,yPixelCoord)
        newPixelRow.push(newPixelValue)
        }
    frame.push(newPixelRow)
    }
    return frame
}

function voxelScan(xPixelCoord,yPixelCoord){
    let scanVector = updatePixelVector(xPixelCoord,yPixelCoord) // we could store this if the game involves being stationary a lot. more efficient

    let scanTarget = {
        x: scanVector.x*viewDistance + camera.position.x,
        y: scanVector.y*viewDistance + camera.position.y,
        z: scanVector.z*viewDistance + camera.position.z
    }
    ////scan

    const pixelCoordsHit = getFirstThreadedPixel(scanTarget,xPixelCoord,yPixelCoord)
    
    try{pixelsHitMapMarkers.push([pixelCoordsHit.z,pixelCoordsHit.x])} catch{}


try{return scaleTo255(pixelCoordsHit.distance)}catch{return 0}


      /// scales the value for distance between 0 and 
        
        
        
}

function scaleTo255(value, maxThreshold = 500) {
    const min = 50
    
    // Scale the values
    
        if (value > maxThreshold) {
            return 255; // Set values greater than maxThreshold to 255
        } else {
            // Apply the scaling formula
            let outputvalue = Math.floor(((value - min) / (maxThreshold - min)) * 255);
            return  outputvalue
            
        }
    }


function updatePixelVector(xPixelCoord,yPixelCoord){
    //so we rotate each initial pixel vector (normalised /defined at the origin) to the normalised current camera facing
    let initialVector = initialPixelVectors[yPixelCoord][xPixelCoord];
    const defaultCameraFacing = {x:0,y:0,z:1}// these should alredy be normalised
    const currentCameraFacing = {x:0,y:0,z:1}//camera.facing/// these should alredy be normalised

    let axis = Vector.crossProduct(defaultCameraFacing, currentCameraFacing)

    axis = Vector.normalise(axis);
  
    const angle = Math.acos(Vector.dotProduct(defaultCameraFacing, currentCameraFacing));
   
    let newVector = Vector.rotateVector(initialVector,axis,angle)
   
    return newVector

}

function getFirstThreadedPixel(scanTarget,xPixelCoord,yPixelCoord) { /// untested partial chatgpt code - asked it to implement a Bresenham's line algorithm
    const tiles = [];
    // this rounding is problematic and might not mean our render updates until the player moves to a new tile???
    let x1 = Math.round(camera.position.x), z1 =Math.round(camera.position.z);
    const x2 = Math.round(scanTarget.x), z2 = Math.round(scanTarget.z);
  
    const dx = Math.abs(x2 - x1);
    const dz = Math.abs(z2 - z1);
    const sx = x1 < x2 ? 1 : -1;
    const sz = z1 < z2 ? 1 : -1;
  
    let err = dx - dz;
    while (true) {
        /// i think there is an issue here that we are using the center points of tiles were hitting and not the coordinates of where were hitting them.... might be ok though??
        let basisPixelVector = initialPixelVectors[yPixelCoord][xPixelCoord]
        let basisPixelXZToYRatio = basisPixelVector.y / Math.sqrt(basisPixelVector.x**2+basisPixelVector.z**2) /// this gives us a ratio of how much height we gain for a magnitude of the vectors in the xz plane
        let currentXZMag = Math.sqrt(x1**2+z1**2)
        let scanVectorHeightAtTile = basisPixelXZToYRatio*currentXZMag
        try{
        if (map[z1][x1] > scanVectorHeightAtTile+camera.position.y){
            return { x: x1, z: z1, distance: Math.sqrt((x1-x2)**2+(z1-z2)**2)}//+scanVectorHeightAtTile**2) } // returns the map index for the point of intersection and the raycast length to the center of that tile at that height
        }
        }catch(error){
            return null // index invalid... ran out of map
        }
       // tiles.push({ x: x1, z: z1 });  // Add current point to the list
  
        if (z1 === x2 && z1 === z2) break;  // Stop if we've reached the end point
  
            const e2 = 2 * err;
  
        if (e2 > -dz) {
            err -= dz;
            x1 += sx;
        }
  
        if (e2 < dx) {
            err += dx;
            z1 += sz;
        }

    }
    //return null // no tile found....
  }
function updateImageData(newFrame){
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        
        
        // Convert value to a grayscale color (0 to 255)
        const grayValue = Math.floor(newFrame[y][x]); // Scale to 0-255

        // Set the pixel data (r, g, b, a)
        const pixelIndex = (y * width + x) * 4; // Each pixel has 4 values (RGBA)
        imageData.data[pixelIndex] = grayValue;     // Red
        imageData.data[pixelIndex + 1] = grayValue; // Green
        imageData.data[pixelIndex + 2] = grayValue; // Blue
        imageData.data[pixelIndex + 3] = 255;       // Alpha (fully opaque)
    }
}
}
loadMap ("map.json")

    
///this is based on the 

// for each angle we check if the cell intersects at the comparative height of our scan at that spot
