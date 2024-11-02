///this is a set of functions for vector operations.
//each vector is an object containing xyz

const Vector = {

createVector(x, y, z) {
    return { x, y, z };
},

dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
},

crossProduct(v1, v2) {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    };
},

magnitude(v) {
    return Math.sqrt(v.x **2 + v.y **2 + v.z **2);
},

normalise(v) {
    const mag = this.magnitude(v);
    //console.log(mag, " = normalised vector magnitude")
    if (mag!==0) { // if you normalise a 0 0 0 vector it divides by 0
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag }}
        else{ return { x: 0, y: 0, z: 0 }}
},

rotateVector(v, axis, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dot = this.dotProduct(axis, v);

    return {
        x: v.x * cos + this.crossProduct(axis, v).x * sin + axis.x * dot * (1 - cos),
        y: v.y * cos + this.crossProduct(axis, v).y * sin + axis.y * dot * (1 - cos),
        z: v.z * cos + this.crossProduct(axis, v).z * sin + axis.z * dot * (1 - cos)
    };
}
}
export default Vector;