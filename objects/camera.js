const camera = {
    position :{
    x:200,
    y:100,
    z:200,
    },
    facing :{
    x:0,
    y:0,
    z:1,
    },
setPosition(x,y,z) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;},
setFacing(x,y,z) {
    this.facing.x = x;
    this.facing.y = y;
    this.facing.z = z;
    this.normaliseFacing()
},
normaliseFacing(){
const magnitude = Math.sqrt(this.facing.x**2 + this.facing.y**2 + this.facing.z **2 )
this.facing.x /= magnitude
this.facing.y /= magnitude
this.facing.z /= magnitude
}
}
export default camera;