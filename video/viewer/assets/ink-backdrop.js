var InkGamesBackdrop=(function(Qn){"use strict";const Pt="srgb",_n="srgb-linear",mn="linear",st="srgb",jn="300 es";function Aa(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function xn(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Ra(){const n=xn("canvas");return n.style.display="block",n}const Ks={};function Zs(...n){const e="THREE."+n.shift();console.log(e,...n)}function $s(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Be(...n){n=$s(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function je(...n){n=$s(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Pi(...n){const e=n.join(" ");e in Ks||(Ks[e]=!0,Be(...n))}function wa(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const Ca={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],es=Math.PI/180,ts=180/Math.PI;function Qi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(bt[n&255]+bt[n>>8&255]+bt[n>>16&255]+bt[n>>24&255]+"-"+bt[e&255]+bt[e>>8&255]+"-"+bt[e>>16&15|64]+bt[e>>24&255]+"-"+bt[t&63|128]+bt[t>>8&255]+"-"+bt[t>>16&255]+bt[t>>24&255]+bt[i&255]+bt[i>>8&255]+bt[i>>16&255]+bt[i>>24&255]).toLowerCase()}function Ke(n,e,t){return Math.max(e,Math.min(t,n))}function Pa(n,e){return(n%e+e)%e}function is(n,e,t){return(1-t)*n+t*e}function ji(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Dt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}class Di{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let c=i[s+0],l=i[s+1],d=i[s+2],u=i[s+3],h=r[a+0],m=r[a+1],g=r[a+2],y=r[a+3];if(u!==y||c!==h||l!==m||d!==g){let p=c*h+l*m+d*g+u*y;p<0&&(h=-h,m=-m,g=-g,y=-y,p=-p);let f=1-o;if(p<.9995){const A=Math.acos(p),w=Math.sin(A);f=Math.sin(f*A)/w,o=Math.sin(o*A)/w,c=c*f+h*o,l=l*f+m*o,d=d*f+g*o,u=u*f+y*o}else{c=c*f+h*o,l=l*f+m*o,d=d*f+g*o,u=u*f+y*o;const A=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=A,l*=A,d*=A,u*=A}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],d=i[s+3],u=r[a],h=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+d*u+c*m-l*h,e[t+1]=c*g+d*h+l*u-o*m,e[t+2]=l*g+d*m+o*h-c*u,e[t+3]=d*g-o*u-c*h-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),d=o(s/2),u=o(r/2),h=c(i/2),m=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=h*d*u+l*m*g,this._y=l*m*u-h*d*g,this._z=l*d*g+h*m*u,this._w=l*d*u-h*m*g;break;case"YXZ":this._x=h*d*u+l*m*g,this._y=l*m*u-h*d*g,this._z=l*d*g-h*m*u,this._w=l*d*u+h*m*g;break;case"ZXY":this._x=h*d*u-l*m*g,this._y=l*m*u+h*d*g,this._z=l*d*g+h*m*u,this._w=l*d*u-h*m*g;break;case"ZYX":this._x=h*d*u-l*m*g,this._y=l*m*u+h*d*g,this._z=l*d*g-h*m*u,this._w=l*d*u+h*m*g;break;case"YZX":this._x=h*d*u+l*m*g,this._y=l*m*u+h*d*g,this._z=l*d*g-h*m*u,this._w=l*d*u-h*m*g;break;case"XZY":this._x=h*d*u-l*m*g,this._y=l*m*u-h*d*g,this._z=l*d*g+h*m*u,this._w=l*d*u+h*m*g;break;default:Be("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],d=t[6],u=t[10],h=i+o+u;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-c)*m,this._y=(r-l)*m,this._z=(a-s)*m}else if(i>o&&i>u){const m=2*Math.sqrt(1+i-o-u);this._w=(d-c)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+l)/m}else if(o>u){const m=2*Math.sqrt(1+o-i-u);this._w=(r-l)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+u-i-o);this._w=(a-s)/m,this._x=(r+l)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,d=t._w;return this._x=i*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-i*l,this._z=r*d+a*l+i*c-s*o,this._w=a*d-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,t=Math.sin(t*l)/d,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{static{H.prototype.isVector3=!0}constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Js.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Js.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*i),d=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+c*l+a*u-o*d,this.y=i+c*d+o*l-r*u,this.z=s+c*u+r*d-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ns.copy(this).projectOnVector(e),this.sub(ns)}reflect(e){return this.sub(ns.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ns=new H,Js=new Di;class $e{static{$e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class vi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const xt=new H,gn=new $e;let Da=0;class ti extends vi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Da++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)gn.fromBufferAttribute(this,t),gn.applyMatrix3(e),this.setXY(t,gn.x,gn.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix3(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix4(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)xt.fromBufferAttribute(this,t),xt.applyNormalMatrix(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)xt.fromBufferAttribute(this,t),xt.transformDirection(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ji(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Dt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ji(t,this.array)),t}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ji(t,this.array)),t}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ji(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ji(t,this.array)),t}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),i=Dt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),i=Dt(i,this.array),s=Dt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),i=Dt(i,this.array),s=Dt(s,this.array),r=Dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Qs extends ti{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class js extends ti{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class qt extends ti{constructor(e,t,i){super(new Float32Array(e),t,i)}}class en{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ot.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ot.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Ot.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ot):Ot.fromBufferAttribute(r,a),Ot.applyMatrix4(e.matrixWorld),this.expandByPoint(Ot);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vn.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),vn.copy(i.boundingBox)),vn.applyMatrix4(e.matrixWorld),this.union(vn)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ot),Ot.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(tn),Sn.subVectors(this.max,tn),Li.subVectors(e.a,tn),Fi.subVectors(e.b,tn),Ii.subVectors(e.c,tn),li.subVectors(Fi,Li),ci.subVectors(Ii,Fi),Si.subVectors(Li,Ii);let t=[0,-li.z,li.y,0,-ci.z,ci.y,0,-Si.z,Si.y,li.z,0,-li.x,ci.z,0,-ci.x,Si.z,0,-Si.x,-li.y,li.x,0,-ci.y,ci.x,0,-Si.y,Si.x,0];return!ss(t,Li,Fi,Ii,Sn)||(t=[1,0,0,0,1,0,0,0,1],!ss(t,Li,Fi,Ii,Sn))?!1:(Mn.crossVectors(li,ci),t=[Mn.x,Mn.y,Mn.z],ss(t,Li,Fi,Ii,Sn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ot).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ot).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ii),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ii=[new H,new H,new H,new H,new H,new H,new H,new H],Ot=new H,vn=new en,Li=new H,Fi=new H,Ii=new H,li=new H,ci=new H,Si=new H,tn=new H,Sn=new H,Mn=new H,Mi=new H;function ss(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Mi.fromArray(n,r);const o=s.x*Math.abs(Mi.x)+s.y*Math.abs(Mi.y)+s.z*Math.abs(Mi.z),c=e.dot(Mi),l=t.dot(Mi),d=i.dot(Mi);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const La=new en,nn=new H,rs=new H;class as{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):La.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;nn.subVectors(e,this.center);const t=nn.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(nn,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(rs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(nn.copy(e.center).add(rs)),this.expandByPoint(nn.copy(e.center).sub(rs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}class _t{static{_t.prototype.isMatrix4=!0}constructor(e,t,i,s,r,a,o,c,l,d,u,h,m,g,y,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,l,d,u,h,m,g,y,p)}set(e,t,i,s,r,a,o,c,l,d,u,h,m,g,y,p){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=d,f[10]=u,f[14]=h,f[3]=m,f[7]=g,f[11]=y,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _t().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Ui.setFromMatrixColumn(e,0).length(),r=1/Ui.setFromMatrixColumn(e,1).length(),a=1/Ui.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const h=a*d,m=a*u,g=o*d,y=o*u;t[0]=c*d,t[4]=-c*u,t[8]=l,t[1]=m+g*l,t[5]=h-y*l,t[9]=-o*c,t[2]=y-h*l,t[6]=g+m*l,t[10]=a*c}else if(e.order==="YXZ"){const h=c*d,m=c*u,g=l*d,y=l*u;t[0]=h+y*o,t[4]=g*o-m,t[8]=a*l,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=m*o-g,t[6]=y+h*o,t[10]=a*c}else if(e.order==="ZXY"){const h=c*d,m=c*u,g=l*d,y=l*u;t[0]=h-y*o,t[4]=-a*u,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*d,t[9]=y-h*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const h=a*d,m=a*u,g=o*d,y=o*u;t[0]=c*d,t[4]=g*l-m,t[8]=h*l+y,t[1]=c*u,t[5]=y*l+h,t[9]=m*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const h=a*c,m=a*l,g=o*c,y=o*l;t[0]=c*d,t[4]=y-h*u,t[8]=g*u+m,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-l*d,t[6]=m*u+g,t[10]=h-y*u}else if(e.order==="XZY"){const h=a*c,m=a*l,g=o*c,y=o*l;t[0]=c*d,t[4]=-u,t[8]=l*d,t[1]=h*u+y,t[5]=a*d,t[9]=m*u-g,t[2]=g*u-m,t[6]=o*d,t[10]=y*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Fa,e,Ia)}lookAt(e,t,i){const s=this.elements;return Lt.subVectors(e,t),Lt.lengthSq()===0&&(Lt.z=1),Lt.normalize(),hi.crossVectors(i,Lt),hi.lengthSq()===0&&(Math.abs(i.z)===1?Lt.x+=1e-4:Lt.z+=1e-4,Lt.normalize(),hi.crossVectors(i,Lt)),hi.normalize(),yn.crossVectors(Lt,hi),s[0]=hi.x,s[4]=yn.x,s[8]=Lt.x,s[1]=hi.y,s[5]=yn.y,s[9]=Lt.y,s[2]=hi.z,s[6]=yn.z,s[10]=Lt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],d=i[1],u=i[5],h=i[9],m=i[13],g=i[2],y=i[6],p=i[10],f=i[14],A=i[3],w=i[7],S=i[11],M=i[15],b=s[0],R=s[4],x=s[8],E=s[12],C=s[1],I=s[5],U=s[9],O=s[13],P=s[2],N=s[6],k=s[10],X=s[14],te=s[3],W=s[7],$=s[11],j=s[15];return r[0]=a*b+o*C+c*P+l*te,r[4]=a*R+o*I+c*N+l*W,r[8]=a*x+o*U+c*k+l*$,r[12]=a*E+o*O+c*X+l*j,r[1]=d*b+u*C+h*P+m*te,r[5]=d*R+u*I+h*N+m*W,r[9]=d*x+u*U+h*k+m*$,r[13]=d*E+u*O+h*X+m*j,r[2]=g*b+y*C+p*P+f*te,r[6]=g*R+y*I+p*N+f*W,r[10]=g*x+y*U+p*k+f*$,r[14]=g*E+y*O+p*X+f*j,r[3]=A*b+w*C+S*P+M*te,r[7]=A*R+w*I+S*N+M*W,r[11]=A*x+w*U+S*k+M*$,r[15]=A*E+w*O+S*X+M*j,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],d=e[2],u=e[6],h=e[10],m=e[14],g=e[3],y=e[7],p=e[11],f=e[15],A=c*m-l*h,w=o*m-l*u,S=o*h-c*u,M=a*m-l*d,b=a*h-c*d,R=a*u-o*d;return t*(y*A-p*w+f*S)-i*(g*A-p*M+f*b)+s*(g*w-y*M+f*R)-r*(g*S-y*b+p*R)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],d=e[10];return t*(a*d-o*l)-i*(r*d-o*c)+s*(r*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=e[9],h=e[10],m=e[11],g=e[12],y=e[13],p=e[14],f=e[15],A=t*o-i*a,w=t*c-s*a,S=t*l-r*a,M=i*c-s*o,b=i*l-r*o,R=s*l-r*c,x=d*y-u*g,E=d*p-h*g,C=d*f-m*g,I=u*p-h*y,U=u*f-m*y,O=h*f-m*p,P=A*O-w*U+S*I+M*C-b*E+R*x;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/P;return e[0]=(o*O-c*U+l*I)*N,e[1]=(s*U-i*O-r*I)*N,e[2]=(y*R-p*b+f*M)*N,e[3]=(h*b-u*R-m*M)*N,e[4]=(c*C-a*O-l*E)*N,e[5]=(t*O-s*C+r*E)*N,e[6]=(p*S-g*R-f*w)*N,e[7]=(d*R-h*S+m*w)*N,e[8]=(a*U-o*C+l*x)*N,e[9]=(i*C-t*U-r*x)*N,e[10]=(g*b-y*S+f*A)*N,e[11]=(u*S-d*b-m*A)*N,e[12]=(o*E-a*I-c*x)*N,e[13]=(t*I-i*E+s*x)*N,e[14]=(y*w-g*M-p*A)*N,e[15]=(d*M-u*w+h*A)*N,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,l=r*a,d=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+i,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,d=a+a,u=o+o,h=r*l,m=r*d,g=r*u,y=a*d,p=a*u,f=o*u,A=c*l,w=c*d,S=c*u,M=i.x,b=i.y,R=i.z;return s[0]=(1-(y+f))*M,s[1]=(m+S)*M,s[2]=(g-w)*M,s[3]=0,s[4]=(m-S)*b,s[5]=(1-(h+f))*b,s[6]=(p+A)*b,s[7]=0,s[8]=(g+w)*R,s[9]=(p-A)*R,s[10]=(1-(h+y))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=Ui.set(s[0],s[1],s[2]).length();const o=Ui.set(s[4],s[5],s[6]).length(),c=Ui.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Gt.copy(this);const l=1/a,d=1/o,u=1/c;return Gt.elements[0]*=l,Gt.elements[1]*=l,Gt.elements[2]*=l,Gt.elements[4]*=d,Gt.elements[5]*=d,Gt.elements[6]*=d,Gt.elements[8]*=u,Gt.elements[9]*=u,Gt.elements[10]*=u,t.setFromRotationMatrix(Gt),i.x=a,i.y=o,i.z=c,this}makePerspective(e,t,i,s,r,a,o=2e3,c=!1){const l=this.elements,d=2*r/(t-e),u=2*r/(i-s),h=(t+e)/(t-e),m=(i+s)/(i-s);let g,y;if(c)g=r/(a-r),y=a*r/(a-r);else if(o===2e3)g=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===2001)g=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=2e3,c=!1){const l=this.elements,d=2/(t-e),u=2/(i-s),h=-(t+e)/(t-e),m=-(i+s)/(i-s);let g,y;if(c)g=1/(a-r),y=a/(a-r);else if(o===2e3)g=-2/(a-r),y=-(a+r)/(a-r);else if(o===2001)g=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=u,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Ui=new H,Gt=new _t,Fa=new H(0,0,0),Ia=new H(1,1,1),hi=new H,yn=new H,Lt=new H,er=new _t,tr=new Di;class yi{constructor(e=0,t=0,i=0,s=yi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],h=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ke(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:Be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return er.makeRotationFromQuaternion(e),this.setFromRotationMatrix(er,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return tr.setFromEuler(this),this.setFromQuaternion(tr,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yi.DEFAULT_ORDER="XYZ";class ir{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}class Oe{static{Oe.prototype.isMatrix3=!0}constructor(e,t,i,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,l)}set(e,t,i,s,r,a,o,c,l){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=i,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],d=i[4],u=i[7],h=i[2],m=i[5],g=i[8],y=s[0],p=s[3],f=s[6],A=s[1],w=s[4],S=s[7],M=s[2],b=s[5],R=s[8];return r[0]=a*y+o*A+c*M,r[3]=a*p+o*w+c*b,r[6]=a*f+o*S+c*R,r[1]=l*y+d*A+u*M,r[4]=l*p+d*w+u*b,r[7]=l*f+d*S+u*R,r[2]=h*y+m*A+g*M,r[5]=h*p+m*w+g*b,r[8]=h*f+m*S+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8];return t*a*d-t*o*l-i*r*d+i*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=d*a-o*l,h=o*c-d*r,m=l*r-a*c,g=t*u+i*h+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return e[0]=u*y,e[1]=(s*l-d*i)*y,e[2]=(o*i-s*a)*y,e[3]=h*y,e[4]=(d*t-s*c)*y,e[5]=(s*r-o*t)*y,e[6]=m*y,e[7]=(i*c-l*t)*y,e[8]=(a*t-i*r)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return Pi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(os.makeScale(e,t)),this}rotate(e){return Pi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(os.makeRotation(-e)),this}translate(e,t){return Pi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(os.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const os=new Oe;let Ua=0;const nr=new H,Ni=new Di,ni=new _t,bn=new H,sn=new H,Na=new H,Ba=new Di,sr=new H(1,0,0),rr=new H(0,1,0),ar=new H(0,0,1),or={type:"added"},Oa={type:"removed"},Bi={type:"childadded",child:null},ls={type:"childremoved",child:null};class Ft extends vi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ua++}),this.uuid=Qi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ft.DEFAULT_UP.clone();const e=new H,t=new yi,i=new Di,s=new H(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new _t},normalMatrix:{value:new Oe}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=Ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ir,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ni.setFromAxisAngle(e,t),this.quaternion.multiply(Ni),this}rotateOnWorldAxis(e,t){return Ni.setFromAxisAngle(e,t),this.quaternion.premultiply(Ni),this}rotateX(e){return this.rotateOnAxis(sr,e)}rotateY(e){return this.rotateOnAxis(rr,e)}rotateZ(e){return this.rotateOnAxis(ar,e)}translateOnAxis(e,t){return nr.copy(e).applyQuaternion(this.quaternion),this.position.add(nr.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(sr,e)}translateY(e){return this.translateOnAxis(rr,e)}translateZ(e){return this.translateOnAxis(ar,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ni.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?bn.copy(e):bn.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),sn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ni.lookAt(sn,bn,this.up):ni.lookAt(bn,sn,this.up),this.quaternion.setFromRotationMatrix(ni),s&&(ni.extractRotation(s.matrixWorld),Ni.setFromRotationMatrix(ni),this.quaternion.premultiply(Ni.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(or),Bi.child=e,this.dispatchEvent(Bi),Bi.child=null):je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Oa),ls.child=e,this.dispatchEvent(ls),ls.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ni.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ni.multiply(e.parent.matrixWorld)),e.applyMatrix4(ni),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(or),Bi.child=e,this.dispatchEvent(Bi),Bi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sn,e,Na),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sn,Ba,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),d=a(e.images),u=a(e.shapes),h=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Ft.DEFAULT_UP=new H(0,1,0),Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0,Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;let Ga=0;const Ut=new _t,cs=new Ft,Oi=new H,It=new en,rn=new en,yt=new H;class Yt extends vi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ga++}),this.uuid=Qi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Aa(e)?js:Qs)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Oe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ut.makeRotationFromQuaternion(e),this.applyMatrix4(Ut),this}rotateX(e){return Ut.makeRotationX(e),this.applyMatrix4(Ut),this}rotateY(e){return Ut.makeRotationY(e),this.applyMatrix4(Ut),this}rotateZ(e){return Ut.makeRotationZ(e),this.applyMatrix4(Ut),this}translate(e,t,i){return Ut.makeTranslation(e,t,i),this.applyMatrix4(Ut),this}scale(e,t,i){return Ut.makeScale(e,t,i),this.applyMatrix4(Ut),this}lookAt(e){return cs.lookAt(e),cs.updateMatrix(),this.applyMatrix4(cs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Oi).negate(),this.translate(Oi.x,Oi.y,Oi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new qt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new en);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];It.setFromBufferAttribute(r),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,It.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,It.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(It.min),this.boundingBox.expandByPoint(It.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new as);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const i=this.boundingSphere.center;if(It.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];rn.setFromBufferAttribute(o),this.morphTargetsRelative?(yt.addVectors(It.min,rn.min),It.expandByPoint(yt),yt.addVectors(It.max,rn.max),It.expandByPoint(yt)):(It.expandByPoint(rn.min),It.expandByPoint(rn.max))}It.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)yt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(yt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)yt.fromBufferAttribute(o,l),c&&(Oi.fromBufferAttribute(e,l),yt.add(Oi)),s=Math.max(s,i.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new ti(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let x=0;x<i.count;x++)o[x]=new H,c[x]=new H;const l=new H,d=new H,u=new H,h=new $e,m=new $e,g=new $e,y=new H,p=new H;function f(x,E,C){l.fromBufferAttribute(i,x),d.fromBufferAttribute(i,E),u.fromBufferAttribute(i,C),h.fromBufferAttribute(r,x),m.fromBufferAttribute(r,E),g.fromBufferAttribute(r,C),d.sub(l),u.sub(l),m.sub(h),g.sub(h);const I=1/(m.x*g.y-g.x*m.y);isFinite(I)&&(y.copy(d).multiplyScalar(g.y).addScaledVector(u,-m.y).multiplyScalar(I),p.copy(u).multiplyScalar(m.x).addScaledVector(d,-g.x).multiplyScalar(I),o[x].add(y),o[E].add(y),o[C].add(y),c[x].add(p),c[E].add(p),c[C].add(p))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let x=0,E=A.length;x<E;++x){const C=A[x],I=C.start,U=C.count;for(let O=I,P=I+U;O<P;O+=3)f(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const w=new H,S=new H,M=new H,b=new H;function R(x){M.fromBufferAttribute(s,x),b.copy(M);const E=o[x];w.copy(E),w.sub(M.multiplyScalar(M.dot(E))).normalize(),S.crossVectors(b,E);const I=S.dot(c[x])<0?-1:1;a.setXYZW(x,w.x,w.y,w.z,I)}for(let x=0,E=A.length;x<E;++x){const C=A[x],I=C.start,U=C.count;for(let O=I,P=I+U;O<P;O+=3)R(e.getX(O+0)),R(e.getX(O+1)),R(e.getX(O+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new ti(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const s=new H,r=new H,a=new H,o=new H,c=new H,l=new H,d=new H,u=new H;if(e)for(let h=0,m=e.count;h<m;h+=3){const g=e.getX(h+0),y=e.getX(h+1),p=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,p),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,y),l.fromBufferAttribute(i,p),o.add(d),c.add(d),l.add(d),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(y,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let h=0,m=t.count;h<m;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(o,c){const l=o.array,d=o.itemSize,u=o.normalized,h=new l.constructor(c.length*d);let m=0,g=0;for(let y=0,p=c.length;y<p;y++){o.isInterleavedBufferAttribute?m=c[y]*o.data.stride+o.offset:m=c[y]*d;for(let f=0;f<d;f++)h[g++]=l[m++]}return new ti(h,d,u)}if(this.index===null)return Be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Yt,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,i);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,u=l.length;d<u;d++){const h=l[d],m=e(h,i);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,h=l.length;u<h;u++){const m=l[u];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(t))}const r=e.morphAttributes;for(const l in r){const d=[],u=r[l];for(let h=0,m=u.length;h<m;h++)d.push(u[h].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,d=a.length;l<d;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class an extends Yt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(s),l=o+1,d=c+1,u=e/o,h=t/c,m=[],g=[],y=[],p=[];for(let f=0;f<d;f++){const A=f*h-a;for(let w=0;w<l;w++){const S=w*u-r;g.push(S,-A,0),y.push(0,0,1),p.push(w/o),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let A=0;A<o;A++){const w=A+l*f,S=A+l*(f+1),M=A+1+l*(f+1),b=A+1+l*f;m.push(w,S,b),m.push(S,M,b)}this.setIndex(m),this.setAttribute("position",new qt(g,3)),this.setAttribute("normal",new qt(y,3)),this.setAttribute("uv",new qt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new an(e.width,e.height,e.widthSegments,e.heightSegments)}}class dt{static{dt.prototype.isVector4=!0}constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const c=e.elements,l=c[0],d=c[4],u=c[8],h=c[1],m=c[5],g=c[9],y=c[2],p=c[6],f=c[10];if(Math.abs(d-h)<.01&&Math.abs(u-y)<.01&&Math.abs(g-p)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+y)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(l+1)/2,S=(m+1)/2,M=(f+1)/2,b=(d+h)/4,R=(u+y)/4,x=(g+p)/4;return w>S&&w>M?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=b/i,r=R/i):S>M?S<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),i=b/s,r=x/s):M<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),i=R/r,s=x/r),this.set(i,s,r,t),this}let A=Math.sqrt((p-g)*(p-g)+(u-y)*(u-y)+(h-d)*(h-d));return Math.abs(A)<.001&&(A=1),this.x=(p-g)/A,this.y=(u-y)/A,this.z=(h-d)/A,this.w=Math.acos((l+m+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}const lr=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cr=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function za(){const n={enabled:!0,workingColorSpace:_n,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===st&&(s.r=si(s.r),s.g=si(s.g),s.b=si(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===st&&(s.r=Gi(s.r),s.g=Gi(s.g),s.b=Gi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===""?mn:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Pi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Pi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[_n]:{primaries:e,whitePoint:i,transfer:mn,toXYZ:lr,fromXYZ:cr,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Pt},outputColorSpaceConfig:{drawingBufferColorSpace:Pt}},[Pt]:{primaries:e,whitePoint:i,transfer:st,toXYZ:lr,fromXYZ:cr,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Pt}}}),n}const Ze=za();function si(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Gi(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const hr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fi={h:0,s:0,l:0},En={h:0,s:0,l:0};function hs(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<.16666666666666666?n+(e-n)*6*t:t<.5?e:t<.6666666666666666?n+(e-n)*6*(.6666666666666666-t):n}class tt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Pt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ze.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ze.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ze.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ze.workingColorSpace){if(e=Pa(e,1),t=Ke(t,0,1),i=Ke(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=hs(a,r,e+.3333333333333333),this.g=hs(a,r,e),this.b=hs(a,r,e-.3333333333333333)}return Ze.colorSpaceToWorking(this,s),this}setStyle(e,t=Pt){function i(r){r!==void 0&&parseFloat(r)<1&&Be("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Be("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Pt){const i=hr[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=si(e.r),this.g=si(e.g),this.b=si(e.b),this}copyLinearToSRGB(e){return this.r=Gi(e.r),this.g=Gi(e.g),this.b=Gi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pt){return Ze.workingToColorSpace(Et.copy(this),e),Math.round(Ke(Et.r*255,0,255))*65536+Math.round(Ke(Et.g*255,0,255))*256+Math.round(Ke(Et.b*255,0,255))}getHexString(e=Pt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ze.workingColorSpace){Ze.workingToColorSpace(Et.copy(this),t);const i=Et.r,s=Et.g,r=Et.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=d<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=Ze.workingColorSpace){return Ze.workingToColorSpace(Et.copy(this),t),e.r=Et.r,e.g=Et.g,e.b=Et.b,e}getStyle(e=Pt){Ze.workingToColorSpace(Et.copy(this),e);const t=Et.r,i=Et.g,s=Et.b;return e!==Pt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(fi),this.setHSL(fi.h+e,fi.s+t,fi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(fi),e.getHSL(En);const i=is(fi.h,En.h,t),s=is(fi.s,En.s,t),r=is(fi.l,En.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Et=new tt;tt.NAMES=hr;const fs=new H,ka=new H,Va=new Oe;class di{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=fs.subVectors(i,t).cross(ka.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(fs),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Va.getNormalMatrix(e),s=this.coplanarPoint(fs).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Ha=0;class Tn extends vi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ha++}),this.uuid=Qi(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Be(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new tt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new di().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new $e().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new $e().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class ds extends Tn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}function zi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(fr(s))s.isRenderTargetTexture?(Be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(fr(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Rt(n){const e={};for(let t=0;t<n.length;t++){const i=zi(n[t]);for(const s in i)e[s]=i[s]}return e}function fr(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Wa(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function dr(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}const Xa={clone:zi,merge:Rt},qa=`
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`,Ya=`
void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}
`;class Kt extends Tn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=qa,this.fragmentShader=Ya,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zi(e.uniforms),this.uniformsGroups=Wa(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new tt().setHex(s.value);break;case"v2":this.uniforms[i].value=new $e().fromArray(s.value);break;case"v3":this.uniforms[i].value=new H().fromArray(s.value);break;case"v4":this.uniforms[i].value=new dt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Oe().fromArray(s.value);break;case"m4":this.uniforms[i].value=new _t().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class ur extends Kt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}const ri=new H,us=new H,An=new H,Rn=new H;class Ka{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ri)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ri.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ri.copy(this.origin).addScaledVector(this.direction,t),ri.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){us.copy(e).add(t).multiplyScalar(.5),An.copy(t).sub(e).normalize(),Rn.copy(this.origin).sub(us);const r=e.distanceTo(t)*.5,a=-this.direction.dot(An),o=Rn.dot(this.direction),c=-Rn.dot(An),l=Rn.lengthSq(),d=Math.abs(1-a*a);let u,h,m,g;if(d>0)if(u=a*c-o,h=a*o-c,g=r*d,u>=0)if(h>=-g)if(h<=g){const y=1/d;u*=y,h*=y,m=u*(u+a*h+2*o)+h*(a*u+h+2*c)+l}else h=r,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*c)+l;else h=-r,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*c)+l;else h<=-g?(u=Math.max(0,-(-a*r+o)),h=u>0?-r:Math.min(Math.max(-r,-c),r),m=-u*u+h*(h+2*c)+l):h<=g?(u=0,h=Math.min(Math.max(-r,-c),r),m=h*(h+2*c)+l):(u=Math.max(0,-(a*r+o)),h=u>0?r:Math.min(Math.max(-r,-c),r),m=-u*u+h*(h+2*c)+l);else h=a>0?-r:r,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(us).addScaledVector(An,h),m}intersectSphere(e,t){if(e.radius<0)return null;ri.subVectors(e.center,this.origin);const i=ri.dot(this.direction),s=ri.dot(ri)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(i=(e.min.x-h.x)*l,s=(e.max.x-h.x)*l):(i=(e.max.x-h.x)*l,s=(e.min.x-h.x)*l),d>=0?(r=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-h.z)*u,c=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,c=(e.min.z-h.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,ri)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,c=o.x,l=o.y,d=o.z,u=e.x-a.x,h=e.y-a.y,m=e.z-a.z,g=t.x-a.x,y=t.y-a.y,p=t.z-a.z,f=i.x-a.x,A=i.y-a.y,w=i.z-a.z,S=Math.abs(c),M=Math.abs(l),b=Math.abs(d);let R,x,E,C,I,U,O,P,N,k,X,te;if(S>=M&&S>=b?(E=c,U=u,N=g,te=f,c>=0?(R=l,x=d,C=h,I=m,O=y,P=p,k=A,X=w):(R=d,x=l,C=m,I=h,O=p,P=y,k=w,X=A)):M>=b?(E=l,U=h,N=y,te=A,l>=0?(R=d,x=c,C=m,I=u,O=p,P=g,k=w,X=f):(R=c,x=d,C=u,I=m,O=g,P=p,k=f,X=w)):(E=d,U=m,N=p,te=w,d>=0?(R=c,x=l,C=u,I=h,O=g,P=y,k=f,X=A):(R=l,x=c,C=h,I=u,O=y,P=g,k=A,X=f)),E===0)return null;const W=R/E,$=x/E,j=1/E,ve=C-W*U,xe=I-$*U,Xe=O-W*N,Le=P-$*N,ke=k-W*te,Y=X-$*te,K=ke*Le-Y*Xe,_e=ve*Y-xe*ke,Pe=Xe*xe-Le*ve;if(s){if(K<0||_e<0||Pe<0)return null}else if((K<0||_e<0||Pe<0)&&(K>0||_e>0||Pe>0))return null;const fe=K+_e+Pe;if(fe===0)return null;const Ge=j*(K*U+_e*N+Pe*te);return(fe>0?Ge<0:Ge>0)?null:this.at(Ge/fe,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}const zt=new H,ai=new H,ps=new H,oi=new H,ki=new H,Vi=new H,pr=new H,_s=new H,ms=new H,xs=new H,gs=new dt,vs=new dt,Ss=new dt;class kt{constructor(e=new H,t=new H,i=new H){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),zt.subVectors(e,t),s.cross(zt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){zt.subVectors(s,t),ai.subVectors(i,t),ps.subVectors(e,t);const a=zt.dot(zt),o=zt.dot(ai),c=zt.dot(ps),l=ai.dot(ai),d=ai.dot(ps),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const h=1/u,m=(l*c-o*d)*h,g=(a*d-o*c)*h;return r.set(1-m-g,g,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,oi)===null?!1:oi.x>=0&&oi.y>=0&&oi.x+oi.y<=1}static getInterpolation(e,t,i,s,r,a,o,c){return this.getBarycoord(e,t,i,s,oi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,oi.x),c.addScaledVector(a,oi.y),c.addScaledVector(o,oi.z),c)}static getInterpolatedAttribute(e,t,i,s,r,a){return gs.setScalar(0),vs.setScalar(0),Ss.setScalar(0),gs.fromBufferAttribute(e,t),vs.fromBufferAttribute(e,i),Ss.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(gs,r.x),a.addScaledVector(vs,r.y),a.addScaledVector(Ss,r.z),a}static isFrontFacing(e,t,i,s){return zt.subVectors(i,t),ai.subVectors(e,t),zt.cross(ai).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zt.subVectors(this.c,this.b),ai.subVectors(this.a,this.b),zt.cross(ai).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(.3333333333333333)}getNormal(e){return kt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return kt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return kt.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return kt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return kt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;ki.subVectors(s,i),Vi.subVectors(r,i),_s.subVectors(e,i);const c=ki.dot(_s),l=Vi.dot(_s);if(c<=0&&l<=0)return t.copy(i);ms.subVectors(e,s);const d=ki.dot(ms),u=Vi.dot(ms);if(d>=0&&u<=d)return t.copy(s);const h=c*u-d*l;if(h<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(i).addScaledVector(ki,a);xs.subVectors(e,r);const m=ki.dot(xs),g=Vi.dot(xs);if(g>=0&&m<=g)return t.copy(r);const y=m*l-c*g;if(y<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(i).addScaledVector(Vi,o);const p=d*g-m*u;if(p<=0&&u-d>=0&&m-g>=0)return pr.subVectors(r,s),o=(u-d)/(u-d+(m-g)),t.copy(s).addScaledVector(pr,o);const f=1/(p+y+h);return a=y*f,o=h*f,t.copy(i).addScaledVector(ki,a).addScaledVector(Vi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const _r=new _t,bi=new Ka,wn=new as,mr=new H,Cn=new H,Pn=new H,Dn=new H,Ms=new H,Ln=new H,xr=new H,Fn=new H;class Vt extends Ft{constructor(e=new Yt,t=new ds){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ln.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],u=r[c];d!==0&&(Ms.fromBufferAttribute(u,e),a?Ln.addScaledVector(Ms,d):Ln.addScaledVector(Ms.sub(t),d))}t.add(Ln)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),wn.copy(i.boundingSphere),wn.applyMatrix4(r),bi.copy(e.ray).recast(e.near),!(wn.containsPoint(bi.origin)===!1&&(bi.intersectSphere(wn,mr)===null||bi.origin.distanceToSquared(mr)>(e.far-e.near)**2))&&(_r.copy(r).invert(),bi.copy(e.ray).applyMatrix4(_r),!(i.boundingBox!==null&&bi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,bi)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,h=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){const p=h[g],f=a[p.materialIndex],A=Math.max(p.start,m.start),w=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let S=A,M=w;S<M;S+=3){const b=o.getX(S),R=o.getX(S+1),x=o.getX(S+2);s=In(this,f,e,i,l,d,u,b,R,x),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),y=Math.min(o.count,m.start+m.count);for(let p=g,f=y;p<f;p+=3){const A=o.getX(p),w=o.getX(p+1),S=o.getX(p+2);s=In(this,a,e,i,l,d,u,A,w,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){const p=h[g],f=a[p.materialIndex],A=Math.max(p.start,m.start),w=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let S=A,M=w;S<M;S+=3){const b=S,R=S+1,x=S+2;s=In(this,f,e,i,l,d,u,b,R,x),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),y=Math.min(c.count,m.start+m.count);for(let p=g,f=y;p<f;p+=3){const A=p,w=p+1,S=p+2;s=In(this,a,e,i,l,d,u,A,w,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function Za(n,e,t,i,s,r,a,o){let c;if(e.side===1?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===0,o),c===null)return null;Fn.copy(o),Fn.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Fn);return l<t.near||l>t.far?null:{distance:l,point:Fn.clone(),object:n}}function In(n,e,t,i,s,r,a,o,c,l){n.getVertexPosition(o,Cn),n.getVertexPosition(c,Pn),n.getVertexPosition(l,Dn);const d=Za(n,e,t,i,Cn,Pn,Dn,xr);if(d){const u=new H;kt.getBarycoord(xr,Cn,Pn,Dn,u),s&&(d.uv=kt.getInterpolatedAttribute(s,o,c,l,u,new $e)),r&&(d.uv1=kt.getInterpolatedAttribute(r,o,c,l,u,new $e)),a&&(d.normal=kt.getInterpolatedAttribute(a,o,c,l,u,new H),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:c,c:l,normal:new H,materialIndex:0};kt.getNormal(Cn,Pn,Dn,h.normal),d.face=h,d.barycoord=u}return d}const Un=new H,Nn=new Di,Zt=new H;class gr extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _t,this.projectionMatrix=new _t,this.projectionMatrixInverse=new _t,this.coordinateSystem=2e3,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Un,Nn,Zt),Zt.x===1&&Zt.y===1&&Zt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Un,Nn,Zt.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Un,Nn,Zt),Zt.x===1&&Zt.y===1&&Zt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Un,Nn,Zt.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}class Bn extends gr{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class vr extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yi,this.environmentIntensity=1,this.environmentRotation=new yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}let Hi;class $a{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Hi===void 0&&(Hi=xn("canvas")),Hi.width=e.width,Hi.height=e.height;const s=Hi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Hi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=xn("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=si(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(si(t[i]/255)*255):t[i]=si(t[i]);return{data:t,width:e.width,height:e.height}}else return Be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ja=0;class ys{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ja++}),this.uuid=Qi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(bs(s[a].image)):r.push(bs(s[a]))}else r=bs(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function bs(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?$a.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Be("Texture: Unable to serialize Texture."),{})}let Qa=0;const Es=new H;class wt extends vi{constructor(e=wt.DEFAULT_IMAGE,t=wt.DEFAULT_MAPPING,i=1001,s=1001,r=1006,a=1008,o=1023,c=1009,l=wt.DEFAULT_ANISOTROPY,d=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qa++}),this.uuid=Qi(),this.name="",this.source=new ys(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new $e(0,0),this.repeat=new $e(1,1),this.center=new $e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Es).x}get height(){return this.source.getSize(Es).y}get depth(){return this.source.getSize(Es).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Be(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}wt.DEFAULT_IMAGE=null,wt.DEFAULT_MAPPING=300,wt.DEFAULT_ANISOTROPY=1;class on extends wt{constructor(e=null,t=1,i=1,s,r,a,o,c,l=1003,d=1003,u,h){super(null,a,o,c,l,d,s,r,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ja extends vi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},r=new wt(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new ys(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Nt extends ja{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}const Ei=new as,eo=new $e(.5,.5),On=new H;class Sr{constructor(e=new di,t=new di,i=new di,s=new di,r=new di,a=new di){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],u=r[5],h=r[6],m=r[7],g=r[8],y=r[9],p=r[10],f=r[11],A=r[12],w=r[13],S=r[14],M=r[15];if(s[0].setComponents(l-a,m-d,f-g,M-A).normalize(),s[1].setComponents(l+a,m+d,f+g,M+A).normalize(),s[2].setComponents(l+o,m+u,f+y,M+w).normalize(),s[3].setComponents(l-o,m-u,f-y,M-w).normalize(),i)s[4].setComponents(c,h,p,S).normalize(),s[5].setComponents(l-c,m-h,f-p,M-S).normalize();else if(s[4].setComponents(l-c,m-h,f-p,M-S).normalize(),t===2e3)s[5].setComponents(l+c,m+h,f+p,M+S).normalize();else if(t===2001)s[5].setComponents(c,h,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ei.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ei.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ei)}intersectsSprite(e){Ei.center.set(0,0,0);const t=eo.distanceTo(e.center);return Ei.radius=.7071067811865476+t,Ei.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ei)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(On.x=s.normal.x>0?e.max.x:e.min.x,On.y=s.normal.y>0?e.max.y:e.min.y,On.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(On)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Mr(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function to(n){const e=new WeakMap;function t(o,c){const l=o.array,d=o.usage,u=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),o.onUploadCallback();let m;if(l instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=n.SHORT;else if(l instanceof Uint32Array)m=n.UNSIGNED_INT;else if(l instanceof Int32Array)m=n.INT;else if(l instanceof Int8Array)m=n.BYTE;else if(l instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,l){const d=c.array,u=c.updateRanges;if(n.bindBuffer(l,o),u.length===0)n.bufferSubData(l,0,d);else{u.sort((m,g)=>m.start-g.start);let h=0;for(let m=1;m<u.length;m++){const g=u[h],y=u[m];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,u[h]=y)}u.length=h+1;for(let m=0,g=u.length;m<g;m++){const y=u[m];n.bufferSubData(l,y.start*d.BYTES_PER_ELEMENT,d,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}class ln extends Yt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],u=[];let h=0,m=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new qt(l,3)),this.setAttribute("normal",new qt(d,3)),this.setAttribute("uv",new qt(u,2));function g(y,p,f,A,w,S,M,b,R,x,E){const C=S/R,I=M/x,U=S/2,O=M/2,P=b/2,N=R+1,k=x+1;let X=0,te=0;const W=new H;for(let $=0;$<k;$++){const j=$*I-O;for(let ve=0;ve<N;ve++){const xe=ve*C-U;W[y]=xe*A,W[p]=j*w,W[f]=P,l.push(W.x,W.y,W.z),W[y]=0,W[p]=0,W[f]=b>0?1:-1,d.push(W.x,W.y,W.z),u.push(ve/R),u.push(1-$/x),X+=1}}for(let $=0;$<x;$++)for(let j=0;j<R;j++){const ve=h+j+N*$,xe=h+j+N*($+1),Xe=h+(j+1)+N*($+1),Le=h+(j+1)+N*$;c.push(ve,xe,Le),c.push(xe,Xe,Le),te+=6}o.addGroup(m,te,E),m+=te,h+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ln(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}const He={alphahash_fragment:`
#ifdef USE_ALPHAHASH

	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;

#endif
`,alphahash_pars_fragment:`
#ifdef USE_ALPHAHASH

	/**
	 * See: https://casual-effects.com/research/Wyman2017Hashed/index.html
	 */

	const float ALPHA_HASH_SCALE = 0.05; // Derived from trials only, and may be changed.

	float hash2D( vec2 value ) {

		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );

	}

	float hash3D( vec3 value ) {

		return hash2D( vec2( hash2D( value.xy ), value.z ) );

	}

	float getAlphaHashThreshold( vec3 position ) {

		// Find the discretized derivatives of our coordinates
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );

		// Find two nearest log-discretized noise scales
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);

		// Compute alpha thresholds at our two noise scales
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);

		// Factor to interpolate lerp with
		float lerpFactor = fract( log2( pixScale ) );

		// Interpolate alpha threshold from noise at two scales
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;

		// Pass into CDF to compute uniformly distrib threshold
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);

		// Find our final, uniformly distributed alpha threshold (ατ)
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;

		// Avoids ατ == 0. Could also do ατ =1-ατ
		return clamp( threshold , 1.0e-6, 1.0 );

	}

#endif
`,alphamap_fragment:`
#ifdef USE_ALPHAMAP

	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;

#endif
`,alphamap_pars_fragment:`
#ifdef USE_ALPHAMAP

	uniform sampler2D alphaMap;

#endif
`,alphatest_fragment:`
#ifdef USE_ALPHATEST

	#ifdef ALPHA_TO_COVERAGE

	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;

	#else

	if ( diffuseColor.a < alphaTest ) discard;

	#endif

#endif
`,alphatest_pars_fragment:`
#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif
`,aomap_fragment:`
#ifdef USE_AOMAP

	// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;

	reflectedLight.indirectDiffuse *= ambientOcclusion;

	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif

	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif

	#if defined( USE_ENVMAP ) && defined( STANDARD )

		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );

		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );

	#endif

#endif
`,aomap_pars_fragment:`
#ifdef USE_AOMAP

	uniform sampler2D aoMap;
	uniform float aoMapIntensity;

#endif
`,batching_pars_vertex:`
#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif

	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {

		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );

	}

	float getIndirectIndex( const in int i ) {

		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );

	}

#endif

#ifdef USE_BATCHING_COLOR

	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {

		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );

	}

#endif
`,batching_vertex:`
#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif
`,begin_vertex:`
vec3 transformed = vec3( position );

#ifdef USE_ALPHAHASH

	vPosition = vec3( position );

#endif
`,beginnormal_vertex:`
vec3 objectNormal = vec3( normal );

#ifdef USE_TANGENT

	vec3 objectTangent = vec3( tangent.xyz );

#endif
`,bsdfs:`

float G_BlinnPhong_Implicit( /* const in float dotNL, const in float dotNV */ ) {

	// geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)
	return 0.25;

}

float D_BlinnPhong( const in float shininess, const in float dotNH ) {

	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );

}

vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {

	vec3 halfDir = normalize( lightDir + viewDir );

	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );

	vec3 F = F_Schlick( specularColor, 1.0, dotVH );

	float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );

	float D = D_BlinnPhong( shininess, dotNH );

	return F * ( G * D );

} // validated

`,iridescence_fragment:`

#ifdef USE_IRIDESCENCE

	// XYZ to linear-sRGB color space
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);

	// Assume air interface for top
	// Note: We don't handle the case fresnel0 == 1
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {

		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );

	}

	// Conversion FO/IOR
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {

		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );

	}

	// ior is a value between 1.0 and 3.0. 1.0 is air interface
	float IorToFresnel0( float transmittedIor, float incidentIor ) {

		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));

	}

	// Fresnel equations for dielectric/dielectric interfaces.
	// Ref: https://belcour.github.io/blog/research/2017/05/01/brdf-thin-film.html
	// Evaluation XYZ sensitivity curves in Fourier space
	vec3 evalSensitivity( float OPD, vec3 shift ) {

		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );

		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;

		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;

	}

	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {

		vec3 I;

		// Force iridescenceIOR -> outsideIOR when thinFilmThickness -> 0.0
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		// Evaluate the cosTheta on the base layer (Snell law)
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );

		// Handle TIR:
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {

			return vec3( 1.0 );

		}

		float cosTheta2 = sqrt( cosTheta2Sq );

		// First interface
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;

		// Second interface
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) ); // guard against 1.0
		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;

		// Phase shift
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;

		// Compound terms
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );

		// Reflectance term for m = 0 (DC term amplitude)
		vec3 C0 = R12 + Rs;
		I = C0;

		// Reflectance term for m > 0 (pairs of diracs)
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {

			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;

		}

		// Since out of gamut colors might be produced, negative color values are clamped to 0.
		return max( I, vec3( 0.0 ) );

	}

#endif

`,bumpmap_pars_fragment:`
#ifdef USE_BUMPMAP

	uniform sampler2D bumpMap;
	uniform float bumpScale;

	// Bump Mapping Unparametrized Surfaces on the GPU by Morten S. Mikkelsen
	// https://mmikk.github.io/papers3d/mm_sfgrad_bump.pdf

	// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)

	vec2 dHdxy_fwd() {

		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );

		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;

		return vec2( dBx, dBy );

	}

	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {

		// normalize is done to ensure that the bump map looks the same regardless of the texture's scale
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm; // normalized

		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );

		float fDet = dot( vSigmaX, R1 ) * faceDirection;

		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );

	}

#endif
`,clipping_planes_fragment:`
#if NUM_CLIPPING_PLANES > 0

	vec4 plane;

	#ifdef ALPHA_TO_COVERAGE

		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;

		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {

			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );

			if ( clipOpacity == 0.0 ) discard;

		}
		#pragma unroll_loop_end

		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES

			float unionClipOpacity = 1.0;

			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {

				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );

			}
			#pragma unroll_loop_end

			clipOpacity *= 1.0 - unionClipOpacity;

		#endif

		diffuseColor.a *= clipOpacity;

		if ( diffuseColor.a == 0.0 ) discard;

	#else

		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {

			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;

		}
		#pragma unroll_loop_end

		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES

			bool clipped = true;

			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {

				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;

			}
			#pragma unroll_loop_end

			if ( clipped ) discard;

		#endif

	#endif

#endif
`,clipping_planes_pars_fragment:`
#if NUM_CLIPPING_PLANES > 0

	varying vec3 vClipPosition;

	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];

#endif
`,clipping_planes_pars_vertex:`
#if NUM_CLIPPING_PLANES > 0

	varying vec3 vClipPosition;

#endif
`,clipping_planes_vertex:`
#if NUM_CLIPPING_PLANES > 0

	vClipPosition = - mvPosition.xyz;

#endif
`,color_fragment:`
#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )

	diffuseColor *= vColor;

#endif
`,color_pars_fragment:`
#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )

	varying vec4 vColor;

#endif
`,color_pars_vertex:`
#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )

	varying vec4 vColor;

#endif
`,color_vertex:`
#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )

	vColor = vec4( 1.0 );

#endif

#ifdef USE_COLOR_ALPHA

	vColor *= color;

#elif defined( USE_COLOR )

	vColor.rgb *= color;

#endif

#ifdef USE_INSTANCING_COLOR

	vColor.rgb *= instanceColor.rgb;

#endif

#ifdef USE_BATCHING_COLOR

	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );

#endif
`,common:`
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

#ifndef saturate
// <tonemapping_pars_fragment> may have defined saturate() already
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )

float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }

// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand( const in vec2 uv ) {

	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );

	return fract( sin( sn ) * c );

}

#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif

struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};

struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};

#ifdef USE_ALPHAHASH

	varying vec3 vPosition;

#endif

vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

}

#define inverseTransformDirection transformDirectionByInverseViewMatrix // @deprecated r185

vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {

	// upper-left 3x3 of view matrix is assumed to be orthogonal

	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );

}

vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {

	// upper-left 3x3 of view matrix is assumed to be orthogonal

	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );

}

bool isPerspectiveMatrix( mat4 m ) {

	return m[ 2 ][ 3 ] == - 1.0;

}

vec2 equirectUv( in vec3 dir ) {

	// dir is assumed to be unit length

	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;

	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;

	return vec2( u, v );

}

vec3 BRDF_Lambert( const in vec3 diffuseColor ) {

	return RECIPROCAL_PI * diffuseColor;

} // validated

vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {

	// Original approximation by Christophe Schlick '94
	// float fresnel = pow( 1.0 - dotVH, 5.0 );

	// Optimized variant (presented by Epic at SIGGRAPH '13)
	// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );

	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );

} // validated

float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {

	// Original approximation by Christophe Schlick '94
	// float fresnel = pow( 1.0 - dotVH, 5.0 );

	// Optimized variant (presented by Epic at SIGGRAPH '13)
	// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );

	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );

} // validated
`,cube_uv_reflection_fragment:`
#ifdef ENVMAP_TYPE_CUBE_UV

	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0

	// These shader functions convert between the UV coordinates of a single face of
	// a cubemap, the 0-5 integer index of a cube face, and the direction vector for
	// sampling a textureCube (not generally normalized ).

	float getFace( vec3 direction ) {

		vec3 absDirection = abs( direction );

		float face = - 1.0;

		if ( absDirection.x > absDirection.z ) {

			if ( absDirection.x > absDirection.y )

				face = direction.x > 0.0 ? 0.0 : 3.0;

			else

				face = direction.y > 0.0 ? 1.0 : 4.0;

		} else {

			if ( absDirection.z > absDirection.y )

				face = direction.z > 0.0 ? 2.0 : 5.0;

			else

				face = direction.y > 0.0 ? 1.0 : 4.0;

		}

		return face;

	}

	// RH coordinate system; PMREM face-indexing convention
	vec2 getUV( vec3 direction, float face ) {

		vec2 uv;

		if ( face == 0.0 ) {

			uv = vec2( direction.z, direction.y ) / abs( direction.x ); // pos x

		} else if ( face == 1.0 ) {

			uv = vec2( - direction.x, - direction.z ) / abs( direction.y ); // pos y

		} else if ( face == 2.0 ) {

			uv = vec2( - direction.x, direction.y ) / abs( direction.z ); // pos z

		} else if ( face == 3.0 ) {

			uv = vec2( - direction.z, direction.y ) / abs( direction.x ); // neg x

		} else if ( face == 4.0 ) {

			uv = vec2( - direction.x, direction.z ) / abs( direction.y ); // neg y

		} else {

			uv = vec2( direction.x, direction.y ) / abs( direction.z ); // neg z

		}

		return 0.5 * ( uv + 1.0 );

	}

	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {

		float face = getFace( direction );

		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );

		mipInt = max( mipInt, cubeUV_minMipLevel );

		float faceSize = exp2( mipInt );

		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0; // #25071

		if ( face > 2.0 ) {

			uv.y += faceSize;

			face -= 3.0;

		}

		uv.x += face * faceSize;

		uv.x += filterInt * 3.0 * cubeUV_minTileSize;

		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );

		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;

		#ifdef texture2DGradEXT

			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb; // disable anisotropic filtering

		#else

			return texture2D( envMap, uv ).rgb;

		#endif

	}

	// These defines must match with PMREMGenerator

	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0

	float roughnessToMip( float roughness ) {

		float mip = 0.0;

		if ( roughness >= cubeUV_r1 ) {

			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;

		} else if ( roughness >= cubeUV_r4 ) {

			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;

		} else if ( roughness >= cubeUV_r5 ) {

			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;

		} else if ( roughness >= cubeUV_r6 ) {

			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;

		} else {

			mip = - 2.0 * log2( 1.16 * roughness ); // 1.16 = 1.79^0.25
		}

		return mip;

	}

	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {

		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );

		float mipF = fract( mip );

		float mipInt = floor( mip );

		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );

		if ( mipF == 0.0 ) {

			return vec4( color0, 1.0 );

		} else {

			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );

			return vec4( mix( color0, color1, mipF ), 1.0 );

		}

	}

#endif
`,defaultnormal_vertex:`

vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT

	vec3 transformedTangent = objectTangent;

#endif

#ifdef USE_BATCHING

	// this is in lieu of a per-instance normal-matrix
	// non-uniform scaling in the instance matrix is supported
	// shear transforms are not supported

	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;

	#ifdef USE_TANGENT

		transformedTangent = bm * transformedTangent;

	#endif

#endif

#ifdef USE_INSTANCING

	// this is in lieu of a per-instance normal-matrix
	// non-uniform scaling in the instance matrix is supported
	// shear transforms are not supported

	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;

	#ifdef USE_TANGENT

		transformedTangent = im * transformedTangent;

	#endif

#endif

transformedNormal = normalMatrix * transformedNormal;

#ifdef FLIP_SIDED

	transformedNormal = - transformedNormal;

#endif

#ifdef USE_TANGENT

	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;

#endif
`,displacementmap_pars_vertex:`
#ifdef USE_DISPLACEMENTMAP

	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;

#endif
`,displacementmap_vertex:`
#ifdef USE_DISPLACEMENTMAP

	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );

#endif
`,emissivemap_fragment:`
#ifdef USE_EMISSIVEMAP

	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );

	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE

		// use inline sRGB decode until browsers properly support SRGB8_ALPHA8 with video textures (#26516)

		emissiveColor = sRGBTransferEOTF( emissiveColor );

	#endif

	totalEmissiveRadiance *= emissiveColor.rgb;

#endif
`,emissivemap_pars_fragment:`
#ifdef USE_EMISSIVEMAP

	uniform sampler2D emissiveMap;

#endif
`,colorspace_fragment:`
gl_FragColor = linearToOutputTexel( gl_FragColor );
`,colorspace_pars_fragment:`

vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}

vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}

vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}

`,envmap_fragment:`
#ifdef USE_ENVMAP

	#ifdef ENV_WORLDPOS

		vec3 cameraToFrag;

		if ( isOrthographic ) {

			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );

		} else {

			cameraToFrag = normalize( vWorldPosition - cameraPosition );

		}

		// Transforming Normal Vectors with the Inverse Transformation
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );

		#ifdef ENVMAP_MODE_REFLECTION

			vec3 reflectVec = reflect( cameraToFrag, worldNormal );

		#else

			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );

		#endif

	#else

		vec3 reflectVec = vReflect;

	#endif

	#ifdef ENVMAP_TYPE_CUBE

		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );

		#ifdef ENVMAP_BLENDING_MULTIPLY

			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );

		#elif defined( ENVMAP_BLENDING_MIX )

			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );

		#elif defined( ENVMAP_BLENDING_ADD )

			outgoingLight += envColor.xyz * specularStrength * reflectivity;

		#endif

	#endif

#endif
`,envmap_common_pars_fragment:`
#ifdef USE_ENVMAP

	uniform float envMapIntensity;
	uniform mat3 envMapRotation;

	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif

#endif
`,envmap_pars_fragment:`
#ifdef USE_ENVMAP

	uniform float reflectivity;

	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )

		#define ENV_WORLDPOS

	#endif

	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif

#endif
`,envmap_pars_vertex:`
#ifdef USE_ENVMAP

	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )

		#define ENV_WORLDPOS

	#endif

	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;

	#else

		varying vec3 vReflect;
		uniform float refractionRatio;

	#endif

#endif
`,envmap_physical_pars_fragment:`
#ifdef USE_ENVMAP

	vec3 getIBLIrradiance( const in vec3 normal ) {

		#ifdef ENVMAP_TYPE_CUBE_UV

			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );

			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );

			return PI * envMapColor.rgb * envMapIntensity;

		#else

			return vec3( 0.0 );

		#endif

	}

	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {

		#ifdef ENVMAP_TYPE_CUBE_UV

			vec3 reflectVec = reflect( - viewDir, normal );

			// Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );

			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );

			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );

			return envMapColor.rgb * envMapIntensity;

		#else

			return vec3( 0.0 );

		#endif

	}

	#ifdef USE_RETROREFLECTION

		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {

			#ifdef ENVMAP_TYPE_CUBE_UV

				// The retroreflective lobe returns light toward its source, so the environment is sampled along the view direction
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );

				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );

				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );

				return envMapColor.rgb * envMapIntensity;

			#else

				return vec3( 0.0 );

			#endif

		}

	#endif

	#ifdef USE_ANISOTROPY

		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {

			#ifdef ENVMAP_TYPE_CUBE_UV

			  // https://google.github.io/filament/Filament.md.html#lighting/imagebasedlights/anisotropy
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );

				return getIBLRadiance( viewDir, bentNormal, roughness );

			#else

				return vec3( 0.0 );

			#endif

		}

		#ifdef USE_RETROREFLECTION

			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {

				#ifdef ENVMAP_TYPE_CUBE_UV

				  // https://google.github.io/filament/Filament.md.html#lighting/imagebasedlights/anisotropy
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );

					return getIBLRetroRadiance( viewDir, bentNormal, roughness );

				#else

					return vec3( 0.0 );

				#endif

			}

		#endif

	#endif

#endif
`,envmap_vertex:`
#ifdef USE_ENVMAP

	#ifdef ENV_WORLDPOS

		vWorldPosition = worldPosition.xyz;

	#else

		vec3 cameraToVertex;

		if ( isOrthographic ) {

			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );

		} else {

			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );

		}

		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );

		#ifdef ENVMAP_MODE_REFLECTION

			vReflect = reflect( cameraToVertex, worldNormal );

		#else

			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );

		#endif

	#endif

#endif
`,fog_vertex:`
#ifdef USE_FOG

	vFogDepth = - mvPosition.z;

#endif
`,fog_pars_vertex:`
#ifdef USE_FOG

	varying float vFogDepth;

#endif
`,fog_fragment:`
#ifdef USE_FOG

	#ifdef FOG_EXP2

		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );

	#else

		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );

	#endif

	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

#endif
`,fog_pars_fragment:`
#ifdef USE_FOG

	uniform vec3 fogColor;
	varying float vFogDepth;

	#ifdef FOG_EXP2

		uniform float fogDensity;

	#else

		uniform float fogNear;
		uniform float fogFar;

	#endif

#endif
`,gradientmap_pars_fragment:`

#ifdef USE_GRADIENTMAP

	uniform sampler2D gradientMap;

#endif

vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {

	// dotNL will be from -1.0 to 1.0
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );

	#ifdef USE_GRADIENTMAP

		return vec3( texture2D( gradientMap, coord ).r );

	#else

		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );

	#endif

}
`,lightmap_pars_fragment:`
#ifdef USE_LIGHTMAP

	uniform sampler2D lightMap;
	uniform float lightMapIntensity;

#endif
`,lights_lambert_fragment:`
LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;
`,lights_lambert_pars_fragment:`
varying vec3 vViewPosition;

struct LambertMaterial {

	vec3 diffuseColor;
	float specularStrength;

};

void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {

	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert
`,lights_pars_begin:`
uniform bool receiveShadow;
uniform vec3 ambientLightColor;

#if defined( USE_LIGHT_PROBES )

	uniform vec3 lightProbe[ 9 ];

#endif

// get the irradiance (radiance convolved with cosine lobe) at the point 'normal' on the unit sphere
// source: https://graphics.stanford.edu/papers/envmap/envmap.pdf
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {

	// normal is assumed to have unit length

	float x = normal.x, y = normal.y, z = normal.z;

	// band 0
	vec3 result = shCoefficients[ 0 ] * 0.886227;

	// band 1
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;

	// band 2
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );

	return result;

}

vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {

	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );

	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );

	return irradiance;

}

vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {

	vec3 irradiance = ambientLightColor;

	return irradiance;

}

float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {

	// based upon Frostbite 3 Moving to Physically-based Rendering
	// page 32, equation 26: E[window1]
	// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );

	if ( cutoffDistance > 0.0 ) {

		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );

	}

	return distanceFalloff;

}

float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {

	return smoothstep( coneCosine, penumbraCosine, angleCosine );

}

#if NUM_SUN_LIGHTS > 0

	struct SunLight {
		vec3 direction;
		vec3 color;
	};

	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];

	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {

		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;

	}

#endif


#if NUM_DIR_LIGHTS > 0

	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};

	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];

	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {

		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;

	}

#endif


#if NUM_POINT_LIGHTS > 0

	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};

	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

	// light is an out parameter as having it as a return value caused compiler errors on some devices
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {

		vec3 lVector = pointLight.position - geometryPosition;

		light.direction = normalize( lVector );

		float lightDistance = length( lVector );

		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );

	}

#endif


#if NUM_SPOT_LIGHTS > 0

	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};

	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];

	// light is an out parameter as having it as a return value caused compiler errors on some devices
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {

		vec3 lVector = spotLight.position - geometryPosition;

		light.direction = normalize( lVector );

		float angleCos = dot( light.direction, spotLight.direction );

		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );

		if ( spotAttenuation > 0.0 ) {

			float lightDistance = length( lVector );

			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );

		} else {

			light.color = vec3( 0.0 );
			light.visible = false;

		}

	}

#endif


#if NUM_RECT_AREA_LIGHTS > 0

	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};

	// Pre-computed values of LinearTransformedCosine approximation of BRDF
	// BRDF approximation Texture is 64x64
	uniform sampler2D ltc_1; // RGBA Float
	uniform sampler2D ltc_2; // RGBA Float

	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];

#endif


#if NUM_HEMI_LIGHTS > 0

	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};

	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];

	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {

		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );

		return irradiance;

	}

#endif

#include <lightprobes_pars_fragment>
`,lights_toon_fragment:`
ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;
`,lights_toon_pars_fragment:`
varying vec3 vViewPosition;

struct ToonMaterial {

	vec3 diffuseColor;

};

void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {

	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon
`,lights_phong_fragment:`
BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;
`,lights_phong_pars_fragment:`
varying vec3 vViewPosition;

struct BlinnPhongMaterial {

	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;

};

void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {

	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;

}

void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {

	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
`,lights_physical_fragment:`
PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;

vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );

material.roughness = max( roughnessFactor, 0.0525 );// 0.0525 corresponds to the base mip of a 256 cubemap.
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );

#ifdef IOR

	material.ior = ior;

	#ifdef USE_SPECULAR

		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;

		#ifdef USE_SPECULAR_COLORMAP

			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;

		#endif

		#ifdef USE_SPECULAR_INTENSITYMAP

			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;

		#endif

		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );

	#else

		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;

	#endif

	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );

#else

	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;

#endif

#ifdef USE_CLEARCOAT

	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;

	#ifdef USE_CLEARCOATMAP

		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;

	#endif

	#ifdef USE_CLEARCOAT_ROUGHNESSMAP

		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;

	#endif

	material.clearcoat = saturate( material.clearcoat ); // Burley clearcoat model
	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );

#endif

#ifdef USE_DISPERSION

	material.dispersion = dispersion;

#endif

#ifdef USE_RETROREFLECTION

	material.retroreflectivity = retroreflectivity;

#endif

#ifdef USE_IRIDESCENCE

	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;

	#ifdef USE_IRIDESCENCEMAP

		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;

	#endif

	#ifdef USE_IRIDESCENCE_THICKNESSMAP

		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;

	#else

		material.iridescenceThickness = iridescenceThicknessMaximum;

	#endif

#endif

#ifdef USE_SHEEN

	material.sheenColor = sheenColor;

	#ifdef USE_SHEEN_COLORMAP

		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;

	#endif

	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );

	#ifdef USE_SHEEN_ROUGHNESSMAP

		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;

	#endif

#endif

#ifdef USE_ANISOTROPY

	#ifdef USE_ANISOTROPYMAP

		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;

	#else

		vec2 anisotropyV = anisotropyVector;

	#endif

	material.anisotropy = length( anisotropyV );

	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}

	// Roughness along the anisotropy bitangent is the material roughness, while the tangent roughness increases with anisotropy.
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );

	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;

#endif
`,lights_physical_pars_fragment:`

uniform sampler2D dfgLUT;

struct PhysicalMaterial {

	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;

	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;

	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif

	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif

	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif

	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif

	#ifdef IOR
		float ior;
	#endif

	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif

	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif

};

// temporary
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );

vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );

    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}

// Moving Frostbite to Physically Based Rendering 3.0 - page 12, listing 2
// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {

	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );

	return 0.5 / max( gv + gl, EPSILON );

}

// Microfacet Models for Refraction through Rough Surfaces - equation (33)
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html
// alpha is "roughness squared" in Disney’s reparameterization
float D_GGX( const in float alpha, const in float dotNH ) {

	float a2 = pow2( alpha );

	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0; // avoid alpha = 0 with dotNH = 1

	return RECIPROCAL_PI * a2 / pow2( denom );

}

// https://google.github.io/filament/Filament.md.html#materialsystem/anisotropicmodel/anisotropicspecularbrdf
#ifdef USE_ANISOTROPY

	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {

		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );

	}

	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {

		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;

		return RECIPROCAL_PI * a2 * pow2 ( w2 );

	}

#endif

#ifdef USE_CLEARCOAT

	// GGX Distribution, Schlick Fresnel, GGX_SmithCorrelated Visibility
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {

		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;

		float alpha = pow2( roughness ); // UE4's roughness

		vec3 halfDir = normalize( lightDir + viewDir );

		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );

		vec3 F = F_Schlick( f0, f90, dotVH );

		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );

		float D = D_GGX( alpha, dotNH );

		return F * ( V * D );

	}

#endif

vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {

	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;

	float alpha = pow2( roughness ); // UE4's roughness

	vec3 halfDir = normalize( lightDir + viewDir );

	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );

	vec3 F = F_Schlick( f0, f90, dotVH );

	#ifdef USE_IRIDESCENCE

		F = mix( F, material.iridescenceFresnel, material.iridescence );

	#endif

	#ifdef USE_ANISOTROPY

		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );

		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );

		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );

	#else

		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );

		float D = D_GGX( alpha, dotNH );

	#endif

	return F * ( V * D );

}

// Rect Area Light

// Real-Time Polygonal-Light Shading with Linearly Transformed Cosines
// by Eric Heitz, Jonathan Dupuy, Stephen Hill and David Neubelt
// code: https://github.com/selfshadow/ltc_code/

vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {

	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;

	float dotNV = saturate( dot( N, V ) );

	// texture parameterized by sqrt( GGX alpha ) and sqrt( 1 - cos( theta ) )
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );

	uv = uv * LUT_SCALE + LUT_BIAS;

	return uv;

}

float LTC_ClippedSphereFormFactor( const in vec3 f ) {

	// Real-Time Area Lighting: a Journey from Research to Production (p.102)
	// An approximation of the form factor of a horizon-clipped rectangle.

	float l = length( f );

	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );

}

vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {

	float x = dot( v1, v2 );

	float y = abs( x );

	// rational polynomial approximation to theta / sin( theta ) / 2PI
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;

	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;

	return cross( v1, v2 ) * theta_sintheta;

}

vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {

	// bail if point is on back side of plane of light
	// assumes ccw winding order of light vertices
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );

	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );

	// construct orthonormal basis around N
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 ); // negated from paper; possibly due to a different handedness of world coordinate system

	// compute transform
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );

	// transform rect
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );

	// project rect onto sphere
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );

	// calculate vector form factor
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );

	// adjust for horizon clipping
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );

/*
	// alternate method of adjusting for horizon clipping (see reference)
	// refactoring required
	float len = length( vectorFormFactor );
	float z = vectorFormFactor.z / len;

	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;

	// tabulated horizon-clipped sphere, apparently...
	vec2 uv = vec2( z * 0.5 + 0.5, len );
	uv = uv * LUT_SCALE + LUT_BIAS;

	float scale = texture2D( ltc_2, uv ).w;

	float result = len * scale;
*/

	return vec3( result );

}

// End Rect Area Light

#if defined( USE_SHEEN )

// https://github.com/google/filament/blob/master/shaders/src/brdf.fs
float D_Charlie( float roughness, float dotNH ) {

	float alpha = pow2( roughness );

	// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF"
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 ); // 2^(-14/2), so sin2h^2 > 0 in fp16

	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );

}

// https://github.com/google/filament/blob/master/shaders/src/brdf.fs
float V_Neubelt( float dotNV, float dotNL ) {

	// Neubelt and Pettineo 2013, "Crafting a Next-gen Material Pipeline for The Order: 1886"
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );

}

vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {

	vec3 halfDir = normalize( lightDir + viewDir );

	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );

	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );

	return sheenColor * ( D * V );

}

#endif

// This is a curve-fit approximation to the "Charlie sheen" BRDF integrated over the hemisphere from
// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF".
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {

	float dotNV = saturate( dot( normal, viewDir ) );

	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );

	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;

	float DG = exp( a * dotNV + b );

	return saturate( DG );

}

vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {

	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;

	return specularColor * fab.x + specularF90 * fab.y;

}

// Fdez-Agüera's "Multiple-Scattering Microfacet Model for Real-Time Image Based Lighting"
// Approximates multiscattering in order to preserve energy.
// http://www.jcgt.org/published/0008/01/03/
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif

	#ifdef USE_IRIDESCENCE

		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );

	#else

		vec3 Fr = specularColor;

	#endif

	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;

	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;

	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619; // 1/21
	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );

	singleScatter += FssEss;
	multiScatter += Fms * Ems;

}

#if NUM_RECT_AREA_LIGHTS > 0

	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;

		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight; // counterclockwise; light shines in local neg z direction
		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;

		vec2 uv = LTC_Uv( normal, viewDir, roughness );

		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );

		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);

		// LTC Fresnel Approximation by Stephen Hill
		// http://blog.selfshadow.com/publications/s2016-advances/s2016_ltc_fresnel.pdf
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );

		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );

		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );

		#ifdef USE_CLEARCOAT

			vec3 Ncc = geometryClearcoatNormal;

			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );

			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );

			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);

			// LTC Fresnel Approximation for clearcoat
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;

			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );

		#endif

	}

#endif

void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );

	vec3 irradiance = dotNL * directLight.color;

	#ifdef USE_CLEARCOAT

		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );

		vec3 ccIrradiance = dotNLcc * directLight.color;

		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );

	#endif

	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif

	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );

	#ifdef USE_RETROREFLECTION

		// Minimal Retroreflective Microfacet Model:
		// https://jcgt.org/published/0015/01/04/
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );

		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );

	#endif

	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;

	// Light reflected by the specular interface is not available to the diffuse layer ( glTF fresnel_mix )
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );

	#ifdef USE_RETROREFLECTION

		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );

		F = mix( F, retroF, saturate( material.retroreflectivity ) );

	#endif

	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}

void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

	// Energy reflected by the specular lobe is not available to the diffuse layer
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );

	#ifdef USE_IRIDESCENCE

		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );

	#else

		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );

	#endif

	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );

	#ifdef USE_SHEEN

		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );

		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;

		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;

		diffuse *= sheenEnergyComp;

	#endif

	reflectedLight.indirectDiffuse += diffuse;

}

void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {

	#ifdef USE_CLEARCOAT

		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );

	#endif

	#ifdef USE_SHEEN

		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;

 	#endif

	// Both indirect specular and indirect diffuse light accumulate here
	// Compute multiscattering separately for dielectric and metallic, then mix

	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );

	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );

	#ifdef USE_IRIDESCENCE

		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );

	#else

		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );

	#endif

	// Mix based on metalness
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );

	// Diffuse energy conservation uses dielectric path
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );

	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;

	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;

	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;

	#ifdef USE_SHEEN

		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );

		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;

		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;

	#endif

	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;

}

#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical

// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {

	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );

}
`,lights_fragment_begin:`
/**
 * This is a template that can be used to light a material, it uses pluggable
 * RenderEquations (RE)for specific lighting scenarios.
 *
 * Instructions for use:
 * - Ensure that both RE_Direct, RE_IndirectDiffuse and RE_IndirectSpecular are defined
 * - Create a material parameter that is to be passed as the third parameter to your lighting functions.
 *
 * TODO:
 * - Add area light support.
 * - Add sphere light support.
 * - Add diffuse light probe (irradiance cubemap) support.
 */

vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

vec3 geometryClearcoatNormal = vec3( 0.0 );

#ifdef USE_CLEARCOAT

	geometryClearcoatNormal = clearcoatNormal;

#endif

#ifdef USE_IRIDESCENCE

	float dotNVi = saturate( dot( normal, geometryViewDir ) );

	if ( material.iridescenceThickness == 0.0 ) {

		material.iridescence = 0.0;

	} else {

		material.iridescence = saturate( material.iridescence );

	}

	if ( material.iridescence > 0.0 ) {

		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );

		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );

		// Iridescence F0 approximation
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );

	}

#endif

#ifdef STANDARD

	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );

	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;

	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )

		// Multi-scattering energy compensation for direct lighting
		// Based on "Practical Multiple Scattering Compensation for Microfacet Models"
		// https://blog.selfshadow.com/publications/turquin/ms_comp_final.pdf

		// Energy of the single-scattering lobe in a white furnace ( F0 = F90 = 1 )
		float EssMs = material.dfg.x + material.dfg.y;

		// Compensate for the energy lost to multiple scattering, tinting the added term by F0 ( equation 16 )
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );

	#endif

#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointLightInfo( pointLight, geometryPosition, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;

	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotLightInfo( spotLight, geometryPosition, directLight );

		// spot lights are ordered [shadows with maps, shadows without maps, maps without shadows, none]
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif

		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif

		#undef SPOT_LIGHT_MAP_INDEX

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )

	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {

		sunLight = sunLights[ i ];

		getSunLightInfo( sunLight, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalLightInfo( directionalLight, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if defined( USE_LIGHT_PROBES )

		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );

	#endif

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );

		}
		#pragma unroll_loop_end

	#endif

	#ifdef USE_LIGHT_PROBES_GRID

		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`,lights_fragment_maps:`
#if defined( RE_IndirectDiffuse )

	#ifdef USE_LIGHTMAP

		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;

		irradiance += lightMapIrradiance;

	#endif

	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )

		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )

			iblIrradiance += getIBLIrradiance( geometryNormal );

		#endif

	#endif

#endif

#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )

	#ifdef USE_ANISOTROPY

		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );

	#else

		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );

	#endif

	#ifdef USE_RETROREFLECTION

		#ifdef USE_ANISOTROPY

			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );

		#else

			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );

		#endif

		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );

	#endif

	radiance += iblRadiance;

	#ifdef USE_CLEARCOAT

		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );

	#endif

#endif
`,lights_fragment_end:`
#if defined( RE_IndirectDiffuse )

	#if defined( LAMBERT ) || defined( PHONG )

		irradiance += iblIrradiance;

	#endif

	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

#endif

#if defined( RE_IndirectSpecular )

	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

#endif
`,lightprobes_pars_fragment:`
#ifdef USE_LIGHT_PROBES_GRID

// Single atlas 3D texture that stores all 7 SH sub-volumes stacked along Z.
// Atlas depth = 7 * ( nz + 2 ) where nz = probesResolution.z.
// Each sub-volume occupies ( nz + 2 ) slices: 1 padding + nz data + 1 padding.
// Padding is a copy of the first / last data slice and prevents color bleeding
// when the hardware linear filter reads across a sub-volume boundary.
uniform highp sampler3D probesSH;

uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;

vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {

	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;

	// Offset sample position along normal by half a probe spacing
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );

	// Remap to texel centers of the probe grid (XY and Z)
	uvw = uvw * resMinusOne / res + 0.5 / res;

	// Atlas UV mapping along Z:
	//   paddedSlices = nz + 2  (1 padding texel at each end of every sub-volume)
	//   atlasDepth   = 7 * paddedSlices
	//   For sub-volume t the first DATA texel sits at atlas slice t*paddedSlices + 1.
	//   Given probe-grid texel-centre UVZ = ( iz + 0.5 ) / nz the atlas UV is:
	//     atlasUvZ = ( uvw.z * nz + t * paddedSlices + 1 ) / atlasDepth
	//
	// uvZBase encodes the nz-scaled Z plus the intra-volume offset (+ 1 for padding),
	// so adding t*paddedSlices steps to each successive sub-volume.
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;

	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );

	// Unpack 9 vec3 SH L2 coefficients
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;

	// Evaluate L2 irradiance
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;

	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );

	return max( result, vec3( 0.0 ) );

}

#endif
`,logdepthbuf_fragment:`
#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )

	// Doing a strict comparison with == 1.0 can cause noise artifacts
	// on some platforms. See issue #17623.
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;

#endif
`,logdepthbuf_pars_fragment:`
#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )

	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;

#endif
`,logdepthbuf_pars_vertex:`
#ifdef USE_LOGARITHMIC_DEPTH_BUFFER

	varying float vFragDepth;
	varying float vIsPerspective;

#endif
`,logdepthbuf_vertex:`
#ifdef USE_LOGARITHMIC_DEPTH_BUFFER

	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );

#endif
`,map_fragment:`
#ifdef USE_MAP

	vec4 sampledDiffuseColor = texture2D( map, vMapUv );

	#ifdef DECODE_VIDEO_TEXTURE

		// use inline sRGB decode until browsers properly support SRGB8_ALPHA8 with video textures (#26516)

		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );

	#endif

	diffuseColor *= sampledDiffuseColor;

#endif
`,map_pars_fragment:`
#ifdef USE_MAP

	uniform sampler2D map;

#endif
`,map_particle_fragment:`
#if defined( USE_MAP ) || defined( USE_ALPHAMAP )

	#if defined( USE_POINTS_UV )

		vec2 uv = vUv;

	#else

		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;

	#endif

#endif

#ifdef USE_MAP

	diffuseColor *= texture2D( map, uv );

#endif

#ifdef USE_ALPHAMAP

	diffuseColor.a *= texture2D( alphaMap, uv ).g;

#endif
`,map_particle_pars_fragment:`
#if defined( USE_POINTS_UV )

	varying vec2 vUv;

#else

	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )

		uniform mat3 uvTransform;

	#endif

#endif

#ifdef USE_MAP

	uniform sampler2D map;

#endif

#ifdef USE_ALPHAMAP

	uniform sampler2D alphaMap;

#endif
`,metalnessmap_fragment:`
float metalnessFactor = metalness;

#ifdef USE_METALNESSMAP

	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );

	// reads channel B, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	metalnessFactor *= texelMetalness.b;

#endif
`,metalnessmap_pars_fragment:`
#ifdef USE_METALNESSMAP

	uniform sampler2D metalnessMap;

#endif
`,morphinstance_vertex:`
#ifdef USE_INSTANCING_MORPH

	float morphTargetInfluences[ MORPHTARGETS_COUNT ];

	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;

	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;

	}
#endif
`,morphcolor_vertex:`
#if defined( USE_MORPHCOLORS )

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	vColor *= morphTargetBaseInfluence;

	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

		#if defined( USE_COLOR_ALPHA )

			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];

		#elif defined( USE_COLOR )

			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];

		#endif

	}

#endif
`,morphnormal_vertex:`
#ifdef USE_MORPHNORMALS

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	objectNormal *= morphTargetBaseInfluence;

	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];

	}

#endif
`,morphtarget_pars_vertex:`
#ifdef USE_MORPHTARGETS

	#ifndef USE_INSTANCING_MORPH

		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];

	#endif

	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;

	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {

		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;

		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );

	}

#endif
`,morphtarget_vertex:`
#ifdef USE_MORPHTARGETS

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in position = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	transformed *= morphTargetBaseInfluence;

	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];

	}

#endif
`,normal_fragment_begin:`
float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;

#ifdef FLAT_SHADED

	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );

#else

	vec3 normal = normalize( vNormal );

	#ifdef DOUBLE_SIDED

		normal *= faceDirection;

	#endif

#endif

#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )

	#ifdef USE_TANGENT

		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

	#else

		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);

	#endif

	#ifdef DOUBLE_SIDED

		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;

	#endif

#endif

#ifdef USE_CLEARCOAT_NORMALMAP

	#ifdef USE_TANGENT

		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

	#else

		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );

	#endif

	#ifdef DOUBLE_SIDED

		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;

	#endif

#endif

// non perturbed normal for clearcoat among others

vec3 nonPerturbedNormal = normal;

`,normal_fragment_maps:`

#ifdef USE_NORMALMAP_OBJECTSPACE

	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

	#ifdef FLIP_SIDED

		normal = - normal;

	#endif

	#ifdef DOUBLE_SIDED

		normal = normal * faceDirection;

	#endif

	normal = normalize( normalMatrix * normal );

#elif defined( USE_NORMALMAP_TANGENTSPACE )

	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;

	#if defined( USE_PACKED_NORMALMAP )

		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );

	#endif

	mapN.xy *= normalScale;

	normal = normalize( tbn * mapN );

#elif defined( USE_BUMPMAP )

	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );

#endif
`,normal_pars_fragment:`
#ifndef FLAT_SHADED

	varying vec3 vNormal;

	#ifdef USE_TANGENT

		varying vec3 vTangent;
		varying vec3 vBitangent;

	#endif

#endif
`,normal_pars_vertex:`
#ifndef FLAT_SHADED

	varying vec3 vNormal;

	#ifdef USE_TANGENT

		varying vec3 vTangent;
		varying vec3 vBitangent;

	#endif

#endif
`,normal_vertex:`
#ifndef FLAT_SHADED // normal is computed with derivatives when FLAT_SHADED

	vNormal = normalize( transformedNormal );

	#ifdef USE_TANGENT

		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );

		#ifdef FLIP_SIDED

			vBitangent = - vBitangent;

		#endif

	#endif

#endif
`,normalmap_pars_fragment:`
#ifdef USE_NORMALMAP

	uniform sampler2D normalMap;
	uniform vec2 normalScale;

#endif

#ifdef USE_NORMALMAP_OBJECTSPACE

	uniform mat3 normalMatrix;

#endif

#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )

	// Normal Mapping Without Precomputed Tangents
	// http://www.thetenthplanet.de/archives/1180

	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {

		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );

		vec3 N = surf_norm; // normalized

		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );

		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;

		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );

		return mat3( T * scale, B * scale, N );

	}

#endif
`,clearcoat_normal_fragment_begin:`
#ifdef USE_CLEARCOAT

	vec3 clearcoatNormal = nonPerturbedNormal;

#endif
`,clearcoat_normal_fragment_maps:`
#ifdef USE_CLEARCOAT_NORMALMAP

	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;

	clearcoatNormal = normalize( tbn2 * clearcoatMapN );

#endif
`,clearcoat_pars_fragment:`

#ifdef USE_CLEARCOATMAP

	uniform sampler2D clearcoatMap;

#endif

#ifdef USE_CLEARCOAT_NORMALMAP

	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;

#endif

#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	uniform sampler2D clearcoatRoughnessMap;

#endif
`,iridescence_pars_fragment:`

#ifdef USE_IRIDESCENCEMAP

	uniform sampler2D iridescenceMap;

#endif

#ifdef USE_IRIDESCENCE_THICKNESSMAP

	uniform sampler2D iridescenceThicknessMap;

#endif
`,opaque_fragment:`
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif

gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`,packing:`
vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}

vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}

const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)
const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;

const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );

const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );

vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}

vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	// the 0.9999 tweak is unimportant, very tiny empirical improvement
	// return vec3( vuf * Inv255, gf * PackUpscale, bf * 0.9999 );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}

vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}

float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}

float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}

float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}

vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}

vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}

// NOTE: viewZ, the z-coordinate in camera space, is negative for points in front of the camera

float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	// -near maps to 0; -far maps to 1
	return ( viewZ + near ) / ( near - far );
}

float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {

	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;

	#else

		return depth * ( near - far ) - near;

	#endif
}

// NOTE: https://twitter.com/gonnavis/status/1377183786949959682

float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	// -near maps to 0; -far maps to 1
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}

float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER

		return ( near * far ) / ( ( near - far ) * depth - near );

	#else

		return ( near * far ) / ( ( far - near ) * depth - far );

	#endif
}
`,premultiplied_alpha_fragment:`
#ifdef PREMULTIPLIED_ALPHA

	gl_FragColor.rgb *= gl_FragColor.a;

#endif
`,project_vertex:`
vec4 mvPosition = vec4( transformed, 1.0 );

#ifdef USE_BATCHING

	mvPosition = batchingMatrix * mvPosition;

#endif

#ifdef USE_INSTANCING

	mvPosition = instanceMatrix * mvPosition;

#endif

mvPosition = modelViewMatrix * mvPosition;

gl_Position = projectionMatrix * mvPosition;
`,dithering_fragment:`
#ifdef DITHERING

	gl_FragColor.rgb = dithering( gl_FragColor.rgb );

#endif
`,dithering_pars_fragment:`
#ifdef DITHERING

	// based on https://www.shadertoy.com/view/MslGR8
	vec3 dithering( vec3 color ) {
		//Calculate grid position
		float grid_position = rand( gl_FragCoord.xy );

		//Shift the individual colors differently, thus making it even harder to see the dithering pattern
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );

		//modify shift according to grid position.
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );

		//shift the color by dither_shift
		return color + dither_shift_RGB;
	}

#endif
`,roughnessmap_fragment:`
float roughnessFactor = roughness;

#ifdef USE_ROUGHNESSMAP

	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );

	// reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	roughnessFactor *= texelRoughness.g;

#endif
`,roughnessmap_pars_fragment:`
#ifdef USE_ROUGHNESSMAP

	uniform sampler2D roughnessMap;

#endif
`,shadowmap_pars_fragment:`
#if NUM_SPOT_LIGHT_COORDS > 0

	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];

#endif

#if NUM_SPOT_LIGHT_MAPS > 0

	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];

#endif

#ifdef USE_SHADOWMAP

	#if NUM_SUN_LIGHT_SHADOWS > 0

		// must match the cascade count in SunLightShadow

		#define SUN_LIGHT_CASCADES 2

		#if defined( SHADOWMAP_TYPE_PCF )

			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];

		#else

			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];

		#endif

		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;

		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];

	#endif

	#if NUM_DIR_LIGHT_SHADOWS > 0

		#if defined( SHADOWMAP_TYPE_PCF )

			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];

		#else

			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];

		#endif

		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];

		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

		#if defined( SHADOWMAP_TYPE_PCF )

			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];

		#else

			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];

		#endif

		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

		#if defined( SHADOWMAP_TYPE_PCF )

			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];

		#elif defined( SHADOWMAP_TYPE_BASIC )

			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];

		#endif

		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];

		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};

		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];

	#endif

	#if defined( SHADOWMAP_TYPE_PCF )

		// Interleaved Gradient Noise for randomizing sampling patterns
		float interleavedGradientNoise( vec2 position ) {

			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );

		}

		// Vogel disk sampling for uniform circular distribution
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {

			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;

		}

	#endif

	#if defined( SHADOWMAP_TYPE_PCF )

		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {

			float shadow = 1.0;

			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;

			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;

			if ( frustumTest ) {

				// Hardware PCF with LinearFilter gives us 4-tap filtering per sample
				// 5 samples using Vogel disk + IGN = effectively 20 filtered taps with better distribution
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;

				// Use IGN to rotate sampling pattern per pixel
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;

				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;

			}

			return mix( 1.0, shadow, shadowIntensity );

		}

	#elif defined( SHADOWMAP_TYPE_VSM )

		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {

			float shadow = 1.0;

			shadowCoord.xyz /= shadowCoord.w;

			#ifdef USE_REVERSED_DEPTH_BUFFER

				shadowCoord.z -= shadowBias;

			#else

				shadowCoord.z += shadowBias;

			#endif

			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;

			if ( frustumTest ) {

				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;

				float mean = distribution.x;
				float variance = distribution.y * distribution.y;

				#ifdef USE_REVERSED_DEPTH_BUFFER

					float hard_shadow = step( mean, shadowCoord.z );

				#else

					float hard_shadow = step( shadowCoord.z, mean );

				#endif
				
				// Early return if fully lit
				if ( hard_shadow == 1.0 ) {

					shadow = 1.0;

				} else {

					// Variance must be non-zero to avoid division by zero
					variance = max( variance, 0.0000001 );

					// Distance from mean
					float d = shadowCoord.z - mean;

					// Chebyshev's inequality for upper bound on probability
					float p_max = variance / ( variance + d * d );

					// Reduce light bleeding by remapping [amount, 1] to [0, 1]
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );

					shadow = max( hard_shadow, p_max );

				}

			}

			return mix( 1.0, shadow, shadowIntensity );

		}

	#else // SHADOWMAP_TYPE_BASIC

		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {

			float shadow = 1.0;

			shadowCoord.xyz /= shadowCoord.w;

			#ifdef USE_REVERSED_DEPTH_BUFFER

				shadowCoord.z -= shadowBias;

			#else

				shadowCoord.z += shadowBias;

			#endif

			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;

			if ( frustumTest ) {

				float depth = texture2D( shadowMap, shadowCoord.xy ).r;

				#ifdef USE_REVERSED_DEPTH_BUFFER

					shadow = step( depth, shadowCoord.z );

				#else

					shadow = step( shadowCoord.z, depth );

				#endif

			}

			return mix( 1.0, shadow, shadowIntensity );

		}

	#endif

	#if NUM_SUN_LIGHT_SHADOWS > 0

		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {

			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;

			float shadow = 1.0;

			// walk the cascades back to front so each fade band can blend with the shadow behind it

			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {

				// ( begin, end, fade start ) view depths of the cascade

				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];

				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {

					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);

					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );

				}

			}

			return shadow;

		}

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

	#if defined( SHADOWMAP_TYPE_PCF )

	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {

		float shadow = 1.0;

		// for point lights, the uniform @vShadowCoord is re-purposed to hold
		// the vector from the light to the world-space position of the fragment.
		vec3 lightToPosition = shadowCoord.xyz;

		// Direction from light to fragment
		vec3 bd3D = normalize( lightToPosition );

		// For cube shadow maps, depth is stored as distance along each face's view axis, not radial distance
		// The view-space depth is the maximum component of the direction vector (which face is sampled)
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );

		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {

			// viewZ to perspective depth

			#ifdef USE_REVERSED_DEPTH_BUFFER

				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;

			#else

				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;

			#endif

			// Hardware PCF with LinearFilter gives us 4-tap filtering per sample
			// Use Vogel disk + IGN sampling for better quality
			float texelSize = shadowRadius / shadowMapSize.x;

			// Build a tangent-space coordinate system for applying offsets
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );

			// Use IGN to rotate sampling pattern per pixel
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;

			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );

			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;

		}

		return mix( 1.0, shadow, shadowIntensity );

	}

	#elif defined( SHADOWMAP_TYPE_BASIC )

	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {

		float shadow = 1.0;

		// for point lights, the uniform @vShadowCoord is re-purposed to hold
		// the vector from the light to the world-space position of the fragment.
		vec3 lightToPosition = shadowCoord.xyz;

		// For cube shadow maps, depth is stored as distance along each face's view axis, not radial distance
		// The view-space depth is the maximum component of the direction vector (which face is sampled)
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );

		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {

			// viewZ to perspective depth

			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;

			// Direction from light to fragment
			vec3 bd3D = normalize( lightToPosition );

			float depth = textureCube( shadowMap, bd3D ).r;

			#ifdef USE_REVERSED_DEPTH_BUFFER

				depth = 1.0 - depth;

			#endif

			shadow = step( dp, depth );

		}

		return mix( 1.0, shadow, shadowIntensity );

	}

	#endif

	#endif

#endif
`,shadowmap_pars_vertex:`

#if NUM_SPOT_LIGHT_COORDS > 0

	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];

#endif

#ifdef USE_SHADOWMAP

	#if NUM_SUN_LIGHT_SHADOWS > 0

		// cascade selection and shadow coordinates are computed per fragment

		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;

	#endif

	#if NUM_DIR_LIGHT_SHADOWS > 0

		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];

		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];

		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};

		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): uniforms for area light shadows

	#endif
	*/

#endif
`,shadowmap_vertex:`

#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )

	#ifdef HAS_NORMAL

		// Offsetting the position used for querying occlusion along the world normal can be used to reduce shadow acne.

		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );

	#else

		vec3 shadowWorldNormal = vec3( 0.0 ); // fallback, see #21483

	#endif

	vec4 shadowWorldPosition;

#endif

#if defined( USE_SHADOWMAP )

	#if NUM_SUN_LIGHT_SHADOWS > 0

		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;

	#endif

	#if NUM_DIR_LIGHT_SHADOWS > 0

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;

		}
		#pragma unroll_loop_end

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {

			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;

		}
		#pragma unroll_loop_end

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): update vAreaShadowCoord with area light info

	#endif
	*/

#endif

// spot lights can be evaluated without active shadow mapping (when SpotLight.map is used)

#if NUM_SPOT_LIGHT_COORDS > 0

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {

		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;

	}
	#pragma unroll_loop_end

#endif


`,shadowmask_pars_fragment:`
float getShadowMask() {

	float shadow = 1.0;

	#ifdef USE_SHADOWMAP

	#if NUM_SUN_LIGHT_SHADOWS > 0

	SunLightShadow sunLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {

		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	#if NUM_DIR_LIGHT_SHADOWS > 0

	DirectionalLightShadow directionalLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

	SpotLightShadow spotLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {

		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )

	PointLightShadow pointLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {

		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;

	}
	#pragma unroll_loop_end

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): update shadow for Area light

	#endif
	*/

	#endif

	return shadow;

}
`,skinbase_vertex:`
#ifdef USE_SKINNING

	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );

#endif
`,skinning_pars_vertex:`
#ifdef USE_SKINNING

	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;

	uniform highp sampler2D boneTexture;

	mat4 getBoneMatrix( const in float i ) {

		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );

		return mat4( v1, v2, v3, v4 );

	}

#endif
`,skinning_vertex:`
#ifdef USE_SKINNING

	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );

	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;

	transformed = ( bindMatrixInverse * skinned ).xyz;

#endif
`,skinnormal_vertex:`
#ifdef USE_SKINNING

	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;

	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;

	#ifdef USE_TANGENT

		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;

	#endif

#endif
`,specularmap_fragment:`
float specularStrength;

#ifdef USE_SPECULARMAP

	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;

#else

	specularStrength = 1.0;

#endif
`,specularmap_pars_fragment:`
#ifdef USE_SPECULARMAP

	uniform sampler2D specularMap;

#endif
`,tonemapping_fragment:`
#if defined( TONE_MAPPING )

	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );

#endif
`,tonemapping_pars_fragment:`
#ifndef saturate
// <common> may have defined saturate() already
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif

uniform float toneMappingExposure;

// exposure only
vec3 LinearToneMapping( vec3 color ) {

	return saturate( toneMappingExposure * color );

}

// source: https://www.cs.utah.edu/docs/techreports/2002/pdf/UUCS-02-001.pdf
vec3 ReinhardToneMapping( vec3 color ) {

	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );

}

// source: http://filmicworlds.com/blog/filmic-tonemapping-operators/
vec3 CineonToneMapping( vec3 color ) {

	// filmic operator by Jim Hejl and Richard Burgess-Dawson
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );

}

// source: https://github.com/selfshadow/ltc_code/blob/master/webgl/shaders/ltc/ltc_blit.fs
vec3 RRTAndODTFit( vec3 v ) {

	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;

}

// this implementation of ACES is modified to accommodate a brighter viewing environment.
// the scale factor of 1/0.6 is subjective. see discussion in #19621.

vec3 ACESFilmicToneMapping( vec3 color ) {

	// sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ), // transposed from source
		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);

	// ODT_SAT => XYZ => D60_2_D65 => sRGB
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ), // transposed from source
		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);

	color *= toneMappingExposure / 0.6;

	color = ACESInputMat * color;

	// Apply RRT and ODT
	color = RRTAndODTFit( color );

	color = ACESOutputMat * color;

	// Clamp to [0, 1]
	return saturate( color );

}

// Matrices for rec 2020 <> rec 709 color space conversion
// matrix provided in row-major order so it has been transposed
// https://www.itu.int/pub/R-REP-BT.2407-2017
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);

const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);

// https://iolite-engine.com/blog_posts/minimal_agx_implementation
// Mean error^2: 3.6705141e-06
vec3 agxDefaultContrastApprox( vec3 x ) {

	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;

	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;

}

// AgX Tone Mapping implementation based on Filament, which in turn is based
// on Blender's implementation using rec 2020 primaries
// https://github.com/google/filament/pull/7236
// Inputs and outputs are encoded as Linear-sRGB.

vec3 AgXToneMapping( vec3 color ) {

	// AgX constants
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);

	// explicit AgXOutsetMatrix generated from Filaments AgXOutsetMatrixInv
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);

	// LOG2_MIN      = -10.0
	// LOG2_MAX      =  +6.5
	// MIDDLE_GRAY   =  0.18
	const float AgxMinEv = - 12.47393;  // log2( pow( 2, LOG2_MIN ) * MIDDLE_GRAY )
	const float AgxMaxEv = 4.026069;    // log2( pow( 2, LOG2_MAX ) * MIDDLE_GRAY )

	color *= toneMappingExposure;

	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;

	color = AgXInsetMatrix * color;

	// Log2 encoding
	color = max( color, 1e-10 ); // avoid 0 or negative numbers for log2
	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );

	color = clamp( color, 0.0, 1.0 );

	// Apply sigmoid
	color = agxDefaultContrastApprox( color );

	// Apply AgX look
	// v = agxLook(v, look);

	color = AgXOutsetMatrix * color;

	// Linearize
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );

	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;

	// Gamut mapping. Simple clamp for now.
	color = clamp( color, 0.0, 1.0 );

	return color;

}

// https://modelviewer.dev/examples/tone-mapping

vec3 NeutralToneMapping( vec3 color ) {

	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;

	color *= toneMappingExposure;

	float x = min( color.r, min( color.g, color.b ) );

	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;

	color -= offset;

	float peak = max( color.r, max( color.g, color.b ) );

	if ( peak < StartCompression ) return color;

	float d = 1. - StartCompression;

	float newPeak = 1. - d * d / ( peak + d - StartCompression );

	color *= newPeak / peak;

	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );

	return mix( color, vec3( newPeak ), g );

}

vec3 CustomToneMapping( vec3 color ) { return color; }
`,transmission_fragment:`
#ifdef USE_TRANSMISSION

	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;

	#ifdef USE_TRANSMISSIONMAP

		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;

	#endif

	#ifdef USE_THICKNESSMAP

		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;

	#endif

	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );

	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );

	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );

	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );

#endif
`,transmission_pars_fragment:`
#ifdef USE_TRANSMISSION

	// Transmission code is based on glTF-Sampler-Viewer
	// https://github.com/KhronosGroup/glTF-Sample-Viewer

	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;

	#ifdef USE_TRANSMISSIONMAP

		uniform sampler2D transmissionMap;

	#endif

	#ifdef USE_THICKNESSMAP

		uniform sampler2D thicknessMap;

	#endif

	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;

	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;

	varying vec3 vWorldPosition;

	// Mipped Bicubic Texture Filtering by N8
	// https://www.shadertoy.com/view/Dl2SDW

	float w0( float a ) {

		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );

	}

	float w1( float a ) {

		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );

	}

	float w2( float a ){

		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );

	}

	float w3( float a ) {

		return ( 1.0 / 6.0 ) * ( a * a * a );

	}

	// g0 and g1 are the two amplitude functions
	float g0( float a ) {

		return w0( a ) + w1( a );

	}

	float g1( float a ) {

		return w2( a ) + w3( a );

	}

	// h0 and h1 are the two offset functions
	float h0( float a ) {

		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );

	}

	float h1( float a ) {

		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );

	}

	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {

		uv = uv * texelSize.zw + 0.5;

		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );

		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );

		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;

		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );

	}

	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {

		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );

	}

	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {

		// Direction of refracted light.
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );

		// Compute rotation-independent scaling of the model matrix.
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );

		// The thickness is specified in local space.
		return normalize( refractionVector ) * thickness * modelScale;

	}

	float applyIorToRoughness( const in float roughness, const in float ior ) {

		// Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
		// an IOR of 1.5 results in the default amount of microfacet refraction.
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );

	}

	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {

		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );

	}

	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {

		if ( isinf( attenuationDistance ) ) {

			// Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
			return vec3( 1.0 );

		} else {

			// Compute light attenuation using Beer's law.
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
			return transmittance;

		}

	}

	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {

		vec4 transmittedLight;
		vec3 transmittance;

		#ifdef USE_DISPERSION

			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );

			for ( int i = 0; i < 3; i ++ ) {

				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;

				// Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;

				// Sample framebuffer to get pixel the refracted ray hits.
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;

				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];

			}

			transmittedLight.a /= 3.0;

		#else

			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;

			// Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;

			// Sample framebuffer to get pixel the refracted ray hits.
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );

		#endif

		vec3 attenuatedColor = transmittance * transmittedLight.rgb;

		// Get the specular component.
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );

		// As less light is transmitted, the opacity should be increased. This simple approximation does a decent job
		// of modulating a CSS background, and has no effect when the buffer is opaque, due to a solid object or clear color.
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;

		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );

	}
#endif
`,uv_pars_fragment:`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	varying vec2 vUv;

#endif
#ifdef USE_MAP

	varying vec2 vMapUv;

#endif
#ifdef USE_ALPHAMAP

	varying vec2 vAlphaMapUv;

#endif
#ifdef USE_LIGHTMAP

	varying vec2 vLightMapUv;

#endif
#ifdef USE_AOMAP

	varying vec2 vAoMapUv;

#endif
#ifdef USE_BUMPMAP

	varying vec2 vBumpMapUv;

#endif
#ifdef USE_NORMALMAP

	varying vec2 vNormalMapUv;

#endif
#ifdef USE_EMISSIVEMAP

	varying vec2 vEmissiveMapUv;

#endif
#ifdef USE_METALNESSMAP

	varying vec2 vMetalnessMapUv;

#endif
#ifdef USE_ROUGHNESSMAP

	varying vec2 vRoughnessMapUv;

#endif
#ifdef USE_ANISOTROPYMAP

	varying vec2 vAnisotropyMapUv;

#endif
#ifdef USE_CLEARCOATMAP

	varying vec2 vClearcoatMapUv;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

	varying vec2 vClearcoatNormalMapUv;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	varying vec2 vClearcoatRoughnessMapUv;

#endif
#ifdef USE_IRIDESCENCEMAP

	varying vec2 vIridescenceMapUv;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

	varying vec2 vIridescenceThicknessMapUv;

#endif
#ifdef USE_SHEEN_COLORMAP

	varying vec2 vSheenColorMapUv;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

	varying vec2 vSheenRoughnessMapUv;

#endif
#ifdef USE_SPECULARMAP

	varying vec2 vSpecularMapUv;

#endif
#ifdef USE_SPECULAR_COLORMAP

	varying vec2 vSpecularColorMapUv;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

	varying vec2 vSpecularIntensityMapUv;

#endif
#ifdef USE_TRANSMISSIONMAP

	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;

#endif
#ifdef USE_THICKNESSMAP

	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;

#endif
`,uv_pars_vertex:`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	varying vec2 vUv;

#endif
#ifdef USE_MAP

	uniform mat3 mapTransform;
	varying vec2 vMapUv;

#endif
#ifdef USE_ALPHAMAP

	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;

#endif
#ifdef USE_LIGHTMAP

	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;

#endif
#ifdef USE_AOMAP

	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;

#endif
#ifdef USE_BUMPMAP

	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;

#endif
#ifdef USE_NORMALMAP

	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;

#endif
#ifdef USE_DISPLACEMENTMAP

	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;

#endif
#ifdef USE_EMISSIVEMAP

	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;

#endif
#ifdef USE_METALNESSMAP

	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;

#endif
#ifdef USE_ROUGHNESSMAP

	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;

#endif
#ifdef USE_ANISOTROPYMAP

	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;

#endif
#ifdef USE_CLEARCOATMAP

	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;

#endif
#ifdef USE_SHEEN_COLORMAP

	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;

#endif
#ifdef USE_IRIDESCENCEMAP

	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;

#endif
#ifdef USE_SPECULARMAP

	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;

#endif
#ifdef USE_SPECULAR_COLORMAP

	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;

#endif
#ifdef USE_TRANSMISSIONMAP

	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;

#endif
#ifdef USE_THICKNESSMAP

	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;

#endif
`,uv_vertex:`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	vUv = vec3( uv, 1 ).xy;

#endif
#ifdef USE_MAP

	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;

#endif
#ifdef USE_ALPHAMAP

	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_LIGHTMAP

	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_AOMAP

	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_BUMPMAP

	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_NORMALMAP

	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_DISPLACEMENTMAP

	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_EMISSIVEMAP

	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_METALNESSMAP

	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_ROUGHNESSMAP

	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_ANISOTROPYMAP

	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_CLEARCOATMAP

	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_IRIDESCENCEMAP

	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_SHEEN_COLORMAP

	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_SPECULARMAP

	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_SPECULAR_COLORMAP

	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_TRANSMISSIONMAP

	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;

#endif
#ifdef USE_THICKNESSMAP

	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;

#endif
`,worldpos_vertex:`
#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0

	vec4 worldPosition = vec4( transformed, 1.0 );

	#ifdef USE_BATCHING

		worldPosition = batchingMatrix * worldPosition;

	#endif

	#ifdef USE_INSTANCING

		worldPosition = instanceMatrix * worldPosition;

	#endif

	worldPosition = modelMatrix * worldPosition;

#endif
`,background_vert:`
varying vec2 vUv;
uniform mat3 uvTransform;

void main() {

	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;

	gl_Position = vec4( position.xy, 1.0, 1.0 );

}
`,background_frag:`
uniform sampler2D t2D;
uniform float backgroundIntensity;

varying vec2 vUv;

void main() {

	vec4 texColor = texture2D( t2D, vUv );

	#ifdef DECODE_VIDEO_TEXTURE

		// use inline sRGB decode until browsers properly support SRGB8_ALPHA8 with video textures

		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );

	#endif

	texColor.rgb *= backgroundIntensity;

	gl_FragColor = texColor;

	#include <tonemapping_fragment>
	#include <colorspace_fragment>

}
`,backgroundCube_vert:`
varying vec3 vWorldDirection;

#include <common>

void main() {

	vWorldDirection = transformDirection( position, modelMatrix );

	#include <begin_vertex>
	#include <project_vertex>

	gl_Position.z = gl_Position.w; // set z to camera.far

}
`,backgroundCube_frag:`

#ifdef ENVMAP_TYPE_CUBE

	uniform samplerCube envMap;

#elif defined( ENVMAP_TYPE_CUBE_UV )

	uniform sampler2D envMap;

#endif

uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;

varying vec3 vWorldDirection;

#include <cube_uv_reflection_fragment>

void main() {

	#ifdef ENVMAP_TYPE_CUBE

		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );

	#elif defined( ENVMAP_TYPE_CUBE_UV )

		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );

	#else

		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );

	#endif

	texColor.rgb *= backgroundIntensity;

	gl_FragColor = texColor;

	#include <tonemapping_fragment>
	#include <colorspace_fragment>

}
`,cube_vert:`
varying vec3 vWorldDirection;

#include <common>

void main() {

	vWorldDirection = transformDirection( position, modelMatrix );

	#include <begin_vertex>
	#include <project_vertex>

	gl_Position.z = gl_Position.w; // set z to camera.far

}
`,cube_frag:`
uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;

varying vec3 vWorldDirection;

void main() {

	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );

	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;

	#include <tonemapping_fragment>
	#include <colorspace_fragment>

}
`,depth_vert:`
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

// This is used for computing an equivalent of gl_FragCoord.z that is as high precision as possible.
// Some platforms compute gl_FragCoord at a lower precision which makes the manually computed value better for
// depth-based postprocessing effects. Reproduced on iPad with A10 processor / iPadOS 13.3.1.
varying vec2 vHighPrecisionZW;

void main() {

	#include <uv_vertex>

	#include <batching_vertex>
	#include <skinbase_vertex>

	#include <morphinstance_vertex>

	#ifdef USE_DISPLACEMENTMAP

		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>

	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vHighPrecisionZW = gl_Position.zw;

}
`,depth_frag:`
#if DEPTH_PACKING == 3200

	uniform float opacity;

#endif

#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

varying vec2 vHighPrecisionZW;

void main() {

	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>

	#if DEPTH_PACKING == 3200

		diffuseColor.a = opacity;

	#endif

	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>

	#include <logdepthbuf_fragment>

	// Higher precision equivalent of gl_FragCoord.z

	#ifdef USE_REVERSED_DEPTH_BUFFER

		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];

	#else

		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;

	#endif

	#if DEPTH_PACKING == 3200

		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );

	#elif DEPTH_PACKING == 3201

		// TODO Deprecate
		gl_FragColor = packDepthToRGBA( fragCoordZ );

	#elif DEPTH_PACKING == 3202

		// TODO Deprecate
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );

	#elif DEPTH_PACKING == 3203

		// TODO Deprecate
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );

	#endif

}
`,distance_vert:`
#define DISTANCE

varying vec3 vWorldPosition;

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>

	#include <batching_vertex>
	#include <skinbase_vertex>

	#include <morphinstance_vertex>

	#ifdef USE_DISPLACEMENTMAP

		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>

	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>

	vWorldPosition = worldPosition.xyz;

}
`,distance_frag:`
#define DISTANCE

uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;

#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>

	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>

	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist ); // clamp to [ 0, 1 ]

	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );

}
`,equirect_vert:`
varying vec3 vWorldDirection;

#include <common>

void main() {

	vWorldDirection = transformDirection( position, modelMatrix );

	#include <begin_vertex>
	#include <project_vertex>

}
`,equirect_frag:`
uniform sampler2D tEquirect;

varying vec3 vWorldDirection;

#include <common>

void main() {

	vec3 direction = normalize( vWorldDirection );

	vec2 sampleUV = equirectUv( direction );

	gl_FragColor = texture2D( tEquirect, sampleUV );

	#include <tonemapping_fragment>
	#include <colorspace_fragment>

}
`,linedashed_vert:`
uniform float scale;
attribute float lineDistance;

varying float vLineDistance;

#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	vLineDistance = scale * lineDistance;

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

}
`,linedashed_frag:`
uniform vec3 diffuse;
uniform float opacity;

uniform float dashSize;
uniform float totalSize;

varying float vLineDistance;

#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>

	if ( mod( vLineDistance, totalSize ) > dashSize ) {

		discard;

	}

	vec3 outgoingLight = vec3( 0.0 );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>

	outgoingLight = diffuseColor.rgb; // simple shader

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>

}
`,meshbasic_vert:`
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>

	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )

		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>

	#endif

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>

}
`,meshbasic_frag:`
uniform vec3 diffuse;
uniform float opacity;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

	// accumulation (baked indirect lighting only)
	#ifdef USE_LIGHTMAP

		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;

	#else

		reflectedLight.indirectDiffuse += vec3( 1.0 );

	#endif

	// modulation
	#include <aomap_fragment>

	reflectedLight.indirectDiffuse *= diffuseColor.rgb;

	vec3 outgoingLight = reflectedLight.indirectDiffuse;

	#include <envmap_fragment>

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,meshlambert_vert:`
#define LAMBERT

varying vec3 vViewPosition;

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,meshlambert_frag:`
#define LAMBERT

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,meshmatcap_vert:`
#define MATCAP

varying vec3 vViewPosition;

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>

#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

	vViewPosition = - mvPosition.xyz;

}
`,meshmatcap_frag:`
#define MATCAP

uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;

varying vec3 vViewPosition;

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>

	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks

	#ifdef USE_MATCAP

		vec4 matcapColor = texture2D( matcap, uv );

	#else

		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 ); // default if matcap is missing

	#endif

	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,meshnormal_vert:`
#define NORMAL

#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )

	varying vec3 vViewPosition;

#endif

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <batching_vertex>

	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )

	vViewPosition = - mvPosition.xyz;

#endif

}
`,meshnormal_frag:`
#define NORMAL

uniform float opacity;

#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )

	varying vec3 vViewPosition;

#endif

#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );

	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>

	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );

	#ifdef OPAQUE

		gl_FragColor.a = 1.0;

	#endif

}
`,meshphong_vert:`
#define PHONG

varying vec3 vViewPosition;

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>

	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,meshphong_frag:`
#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,meshphysical_vert:`
#define STANDARD

varying vec3 vViewPosition;

#ifdef USE_TRANSMISSION

	varying vec3 vWorldPosition;

#endif

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

#ifdef USE_TRANSMISSION

	vWorldPosition = worldPosition.xyz;

#endif
}
`,meshphysical_frag:`
#define STANDARD

#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef IOR
	uniform float ior;
#endif

#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;

	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif

	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif

#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif

#ifdef USE_DISPERSION
	uniform float dispersion;
#endif

#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif

#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif

#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;

	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif

	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif

#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;

	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif

varying vec3 vViewPosition;

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

	#include <transmission_fragment>

	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif

	#ifdef USE_CLEARCOAT

		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );

		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );

		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;

	#endif

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,meshtoon_vert:`
#define TOON

varying vec3 vViewPosition;

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,meshtoon_frag:`
#define TOON

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`,points_vert:`
uniform float size;
uniform float scale;

#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#ifdef USE_POINTS_UV

	varying vec2 vUv;
	uniform mat3 uvTransform;

#endif

void main() {

	#ifdef USE_POINTS_UV

		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;

	#endif

	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>

	gl_PointSize = size;

	#ifdef USE_SIZEATTENUATION

		bool isPerspective = isPerspectiveMatrix( projectionMatrix );

		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );

	#endif

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>

}
`,points_frag:`
uniform vec3 diffuse;
uniform float opacity;

#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>

	vec3 outgoingLight = vec3( 0.0 );

	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>

	outgoingLight = diffuseColor.rgb;

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>

}
`,shadow_vert:`
#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>

void main() {

	#include <batching_vertex>

	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`,shadow_frag:`
uniform vec3 color;
uniform float opacity;

#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

void main() {

	#include <logdepthbuf_fragment>

	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );

	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>

}
`,sprite_vert:`
uniform float rotation;
uniform vec2 center;

#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>

	vec4 mvPosition = modelViewMatrix[ 3 ];

	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );

	#ifndef USE_SIZEATTENUATION

		bool isPerspective = isPerspectiveMatrix( projectionMatrix );

		if ( isPerspective ) scale *= - mvPosition.z;

	#endif

	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;

	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;

	mvPosition.xy += rotatedPosition;

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>

}
`,sprite_frag:`
uniform vec3 diffuse;
uniform float opacity;

#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>

	vec3 outgoingLight = vec3( 0.0 );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>

	outgoingLight = diffuseColor.rgb;

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>

}
`},ce={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new $e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new H},probesMax:{value:new H},probesResolution:{value:new H}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new $e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},$t={basic:{uniforms:Rt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:Rt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new tt(0)},envMapIntensity:{value:1}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:Rt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:Rt([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:Rt([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new tt(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:Rt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:Rt([ce.points,ce.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:Rt([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:Rt([ce.common,ce.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:Rt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:Rt([ce.sprite,ce.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distance:{uniforms:Rt([ce.common,ce.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distance_vert,fragmentShader:He.distance_frag},shadow:{uniforms:Rt([ce.lights,ce.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};$t.physical={uniforms:Rt([$t.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new $e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new $e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new $e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const Gn={r:0,b:0,g:0},io=new _t,yr=new Oe;yr.set(-1,0,0,0,1,0,0,0,1);function no(n,e,t,i,s,r){const a=new tt(0);let o=s===!0?0:1,c,l,d=null,u=0,h=null;function m(A){let w=A.isScene===!0?A.background:null;if(w&&w.isTexture){const S=A.backgroundBlurriness>0;w=e.get(w,S)}return w}function g(A){let w=!1;const S=m(A);S===null?p(a,o):S&&S.isColor&&(p(S,1),w=!0);const M=n.xr.getEnvironmentBlendMode();M==="additive"?t.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function y(A,w){const S=m(w);S&&(S.isCubeTexture||S.mapping===306)?(l===void 0&&(l=new Vt(new ln(1,1,1),new Kt({name:"BackgroundCubeMaterial",uniforms:zi($t.backgroundCube.uniforms),vertexShader:$t.backgroundCube.vertexShader,fragmentShader:$t.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(M,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=S,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(io.makeRotationFromEuler(w.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(yr),l.material.toneMapped=Ze.getTransfer(S.colorSpace)!==st,(d!==S||u!==S.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,d=S,u=S.version,h=n.toneMapping),l.layers.enableAll(),A.unshift(l,l.geometry,l.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Vt(new an(2,2),new Kt({name:"BackgroundMaterial",uniforms:zi($t.background.uniforms),vertexShader:$t.background.vertexShader,fragmentShader:$t.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=Ze.getTransfer(S.colorSpace)!==st,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(d!==S||u!==S.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,d=S,u=S.version,h=n.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function p(A,w){A.getRGB(Gn,dr(n)),t.buffers.color.setClear(Gn.r,Gn.g,Gn.b,w,r)}function f(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(A,w=1){a.set(A),o=w,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(A){o=A,p(a,o)},render:g,addToRenderList:y,dispose:f}}function so(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,a=!1;function o(I,U,O,P,N){let k=!1;const X=u(I,P,O,U);r!==X&&(r=X,l(r.object)),k=m(I,P,O,N),k&&g(I,P,O,N),N!==null&&e.update(N,n.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,S(I,U,O,P),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function c(){return n.createVertexArray()}function l(I){return n.bindVertexArray(I)}function d(I){return n.deleteVertexArray(I)}function u(I,U,O,P){const N=P.wireframe===!0;let k=i[U.id];k===void 0&&(k={},i[U.id]=k);const X=I.isInstancedMesh===!0?I.id:0;let te=k[X];te===void 0&&(te={},k[X]=te);let W=te[O.id];W===void 0&&(W={},te[O.id]=W);let $=W[N];return $===void 0&&($=h(c()),W[N]=$),$}function h(I){const U=[],O=[],P=[];for(let N=0;N<t;N++)U[N]=0,O[N]=0,P[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:O,attributeDivisors:P,object:I,attributes:{},index:null}}function m(I,U,O,P){const N=r.attributes,k=U.attributes;let X=0;const te=O.getAttributes();for(const W in te)if(te[W].location>=0){const j=N[W];let ve=k[W];if(ve===void 0&&(W==="instanceMatrix"&&I.instanceMatrix&&(ve=I.instanceMatrix),W==="instanceColor"&&I.instanceColor&&(ve=I.instanceColor)),j===void 0||j.attribute!==ve||ve&&j.data!==ve.data)return!0;X++}return r.attributesNum!==X||r.index!==P}function g(I,U,O,P){const N={},k=U.attributes;let X=0;const te=O.getAttributes();for(const W in te)if(te[W].location>=0){let j=k[W];j===void 0&&(W==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),W==="instanceColor"&&I.instanceColor&&(j=I.instanceColor));const ve={};ve.attribute=j,j&&j.data&&(ve.data=j.data),N[W]=ve,X++}r.attributes=N,r.attributesNum=X,r.index=P}function y(){const I=r.newAttributes;for(let U=0,O=I.length;U<O;U++)I[U]=0}function p(I){f(I,0)}function f(I,U){const O=r.newAttributes,P=r.enabledAttributes,N=r.attributeDivisors;O[I]=1,P[I]===0&&(n.enableVertexAttribArray(I),P[I]=1),N[I]!==U&&(n.vertexAttribDivisor(I,U),N[I]=U)}function A(){const I=r.newAttributes,U=r.enabledAttributes;for(let O=0,P=U.length;O<P;O++)U[O]!==I[O]&&(n.disableVertexAttribArray(O),U[O]=0)}function w(I,U,O,P,N,k,X){X===!0?n.vertexAttribIPointer(I,U,O,N,k):n.vertexAttribPointer(I,U,O,P,N,k)}function S(I,U,O,P){y();const N=P.attributes,k=O.getAttributes(),X=U.defaultAttributeValues;for(const te in k){const W=k[te];if(W.location>=0){let $=N[te];if($===void 0&&(te==="instanceMatrix"&&I.instanceMatrix&&($=I.instanceMatrix),te==="instanceColor"&&I.instanceColor&&($=I.instanceColor)),$!==void 0){const j=$.normalized,ve=$.itemSize,xe=e.get($);if(xe===void 0)continue;const Xe=xe.buffer,Le=xe.type,ke=xe.bytesPerElement,Y=Le===n.INT||Le===n.UNSIGNED_INT||$.gpuType===1013;if($.isInterleavedBufferAttribute){const K=$.data,_e=K.stride,Pe=$.offset;if(K.isInstancedInterleavedBuffer){for(let fe=0;fe<W.locationSize;fe++)f(W.location+fe,K.meshPerAttribute);I.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let fe=0;fe<W.locationSize;fe++)p(W.location+fe);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let fe=0;fe<W.locationSize;fe++)w(W.location+fe,ve/W.locationSize,Le,j,_e*ke,(Pe+ve/W.locationSize*fe)*ke,Y)}else{if($.isInstancedBufferAttribute){for(let K=0;K<W.locationSize;K++)f(W.location+K,$.meshPerAttribute);I.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let K=0;K<W.locationSize;K++)p(W.location+K);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let K=0;K<W.locationSize;K++)w(W.location+K,ve/W.locationSize,Le,j,ve*ke,ve/W.locationSize*K*ke,Y)}}else if(X!==void 0){const j=X[te];if(j!==void 0)switch(j.length){case 2:n.vertexAttrib2fv(W.location,j);break;case 3:n.vertexAttrib3fv(W.location,j);break;case 4:n.vertexAttrib4fv(W.location,j);break;default:n.vertexAttrib1fv(W.location,j)}}}}A()}function M(){E();for(const I in i){const U=i[I];for(const O in U){const P=U[O];for(const N in P){const k=P[N];for(const X in k)d(k[X].object),delete k[X];delete P[N]}}delete i[I]}}function b(I){if(i[I.id]===void 0)return;const U=i[I.id];for(const O in U){const P=U[O];for(const N in P){const k=P[N];for(const X in k)d(k[X].object),delete k[X];delete P[N]}}delete i[I.id]}function R(I){for(const U in i){const O=i[U];for(const P in O){const N=O[P];if(N[I.id]===void 0)continue;const k=N[I.id];for(const X in k)d(k[X].object),delete k[X];delete N[I.id]}}}function x(I){for(const U in i){const O=i[U],P=I.isInstancedMesh===!0?I.id:0,N=O[P];if(N!==void 0){for(const k in N){const X=N[k];for(const te in X)d(X[te].object),delete X[te];delete N[k]}delete O[P],Object.keys(O).length===0&&delete i[U]}}}function E(){C(),a=!0,r!==s&&(r=s,l(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:C,dispose:M,releaseStatesOfGeometry:b,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:p,disableUnusedAttributes:A}}function ro(n,e,t){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function a(c,l,d){d!==0&&(n.drawArraysInstanced(i,c,l,d),t.update(l,i,d))}function o(c,l,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,d);let h=0;for(let m=0;m<d;m++)h+=l[m];t.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function ao(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==1023&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const x=R===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==1009&&R!==1015&&!x&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function c(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const d=c(l);d!==l&&(Be("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Be("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),A=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),w=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:p,maxAttributes:f,maxVertexUniforms:A,maxVaryings:w,maxFragmentUniforms:S,maxSamples:M,samples:b}}function oo(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new di,o=new Oe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const m=u.length!==0||h||i!==0||s;return s=h,i=u.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,m){const g=u.clippingPlanes,y=u.clipIntersection,p=u.clipShadows,f=n.get(u);if(!s||g===null||g.length===0||r&&!p)r?d(null):l();else{const A=r?0:i,w=A*4;let S=f.clippingState||null;c.value=S,S=d(g,h,w,m);for(let M=0;M!==w;++M)S[M]=t[M];f.clippingState=S,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,h,m,g){const y=u!==null?u.length:0;let p=null;if(y!==0){if(p=c.value,g!==!0||p===null){const f=m+y*4,A=h.matrixWorldInverse;o.getNormalMatrix(A),(p===null||p.length<f)&&(p=new Float32Array(f));for(let w=0,S=m;w!==y;++w,S+=4)a.copy(u[w]).applyMatrix4(A,o),a.normal.toArray(p,S),p[S+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,p}}const ui=new H,br=new $e,Er=new $e;class Ht extends gr{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ts*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(es*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ts*2*Math.atan(Math.tan(es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ui.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ui.x,ui.y).multiplyScalar(-e/ui.z),ui.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ui.x,ui.y).multiplyScalar(-e/ui.z)}getViewSize(e,t){return this.getViewBounds(e,br,Er),t.subVectors(Er,br)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(es*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Wi=4,lo=6,co=20,ho=256,cn=new Bn,Tr=new tt;let Ts=null,As=0,Rs=0,ws=!1;const fo=new H,Ti=new H;class Ar{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=fo}=r;Ts=this._renderer.getRenderTarget(),As=this._renderer.getActiveCubeFace(),Rs=this._renderer.getActiveMipmapLevel(),ws=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cr(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wr(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ts,As,Rs),this._renderer.xr.enabled=ws,e.scissorTest=!1,Xi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ts=this._renderer.getRenderTarget(),As=this._renderer.getActiveCubeFace(),Rs=this._renderer.getActiveMipmapLevel(),ws=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:_n,depthBuffer:!1},s=Rr(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rr(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=uo(r)),this._blurMaterial=_o(r,e,t),this._ggxMaterial=po(r,e,t)}return s}_compileMaterial(e){const t=new Vt(new Yt,e);this._renderer.compile(t,cn)}_sceneToCubeUV(e,t,i,s,r){const c=new Ht(90,1,t,i),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,m=u.toneMapping;u.getClearColor(Tr),u.toneMapping=0,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Vt(new ln,new ds({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,p=y.material;let f=!1;const A=e.background;A?A.isColor&&(p.color.copy(A),e.background=null,f=!0):(p.color.copy(Tr),f=!0);for(let w=0;w<6;w++){const S=w%3;S===0?(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[w],r.y,r.z)):S===1?(c.up.set(0,0,l[w]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[w],r.z)):(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[w]));const M=this._cubeSize;Xi(s,S*M,w>2?M:0,M,M),u.setRenderTarget(s),f&&u.render(y,c),u.render(e,c)}u.toneMapping=m,u.autoClear=h,e.background=A}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===301||e.mapping===302;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cr()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wr());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Xi(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,cn)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-d*d),h=l*1.25,m=u*h,{_lodMax:g}=this,y=this._sizeLods[i],p=3*y*(i>g-Wi?i-g+Wi:0),f=4*(this._cubeSize-y);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=g-t,Xi(r,p,f,3*y,2*y),s.setRenderTarget(r),s.render(o,cn),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-i,Xi(e,p,f,3*y,2*y),s.setRenderTarget(e),s.render(o,cn)}_blur(e,t,i,s){const r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,i,a),this._blurPass(r,e,i,i,a)}_blurPass(e,t,i,s,r){const a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[s];c.material=o;const l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-i;const d=this._sizeLods[s],u=3*d*(s>this._lodMax-Wi?s-this._lodMax+Wi:0),h=4*(this._cubeSize-d);Xi(t,u,h,3*d,2*d),a.setRenderTarget(t),a.render(c,cn)}}function uo(n){const e=[],t=[];let i=n;const s=n-Wi+1+lo;for(let r=0;r<s;r++){const a=Math.pow(2,i);e.push(a);const o=1/(a-2),c=-o,l=1+o,d=[c,c,l,c,l,l,c,c,l,l,c,l],u=6,h=6,m=3,g=new Float32Array(m*h*u),y=new Float32Array(m*h*u);for(let f=0;f<u;f++){const A=f%3*2/3-1,w=f>2?0:-1,S=[A,w,0,A+2/3,w,0,A+2/3,w+1,0,A,w,0,A+2/3,w+1,0,A,w+1,0];g.set(S,m*h*f);for(let M=0;M<h;M++){const b=d[M*2]*2-1,R=d[M*2+1]*2-1;f===0?Ti.set(1,R,b):f===1?Ti.set(-b,1,-R):f===2?Ti.set(-b,R,1):f===3?Ti.set(-1,R,-b):f===4?Ti.set(-b,-1,R):Ti.set(b,R,-1),Ti.toArray(y,(f*h+M)*m)}}const p=new Yt;p.setAttribute("position",new ti(g,m)),p.setAttribute("outputDirection",new ti(y,m)),t.push(new Vt(p,null)),i>Wi&&i--}return{lodMeshes:t,sizeLods:e}}function Rr(n,e,t){const i=new Nt(n,e,t);return i.texture.mapping=306,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Xi(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function po(n,e,t){return new Kt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ho,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:zn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function _o(n,e,t){return new Kt({name:"SphericalGaussianBlur",defines:{SAMPLES:co,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:zn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function wr(){return new Kt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:zn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Cr(){return new Kt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:zn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function zn(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}const qi=-90,Yi=1;class mo extends Ft{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ht(qi,Yi,e,t);s.layers=this.layers,this.add(s);const r=new Ht(qi,Yi,e,t);r.layers=this.layers,this.add(r);const a=new Ht(qi,Yi,e,t);a.layers=this.layers,this.add(a);const o=new Ht(qi,Yi,e,t);o.layers=this.layers,this.add(o);const c=new Ht(qi,Yi,e,t);c.layers=this.layers,this.add(c);const l=new Ht(qi,Yi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===2e3)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===2001)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(u,h,m),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Pr extends wt{constructor(e=[],t=301,i,s,r,a,o,c,l,d){super(e,t,i,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Dr extends Nt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Pr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ln(5,5,5),r=new Kt({name:"CubemapFromEquirect",uniforms:zi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:1,blending:0});r.uniforms.tEquirect.value=t;const a=new Vt(s,r),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new mo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}function xo(n){let e=new WeakMap,t=new WeakMap,i=null;function s(h,m=!1){return h==null?null:m?a(h):r(h)}function r(h){if(h&&h.isTexture){const m=h.mapping;if(m===303||m===304)if(e.has(h)){const g=e.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const y=new Dr(g.height);return y.fromEquirectangularTexture(n,h),e.set(h,y),h.addEventListener("dispose",l),o(y.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){const m=h.mapping,g=m===303||m===304,y=m===301||m===302;if(g||y){let p=t.get(h);const f=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==f)return i===null&&(i=new Ar(n)),p=g?i.fromEquirectangular(h,p):i.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,t.set(h,p),p.texture;if(p!==void 0)return p.texture;{const A=h.image;return g&&A&&A.height>0||y&&A&&c(A)?(i===null&&(i=new Ar(n)),p=g?i.fromEquirectangular(h):i.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,t.set(h,p),h.addEventListener("dispose",d),p.texture):null}}}return h}function o(h,m){return m===303?h.mapping=301:m===304&&(h.mapping=302),h}function c(h){let m=0;const g=6;for(let y=0;y<g;y++)h[y]!==void 0&&m++;return m===g}function l(h){const m=h.target;m.removeEventListener("dispose",l);const g=e.get(m);g!==void 0&&(e.delete(m),g.dispose())}function d(h){const m=h.target;m.removeEventListener("dispose",d);const g=t.get(m);g!==void 0&&(t.delete(m),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function go(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Pi("WebGLRenderer: "+i+" extension not supported."),s}}}function vo(n,e,t,i){const s={},r=new WeakMap;function a(u){const h=u.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete s[h.id];const m=r.get(h);m&&(e.remove(m),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function c(u){const h=u.attributes;for(const m in h)e.update(h[m],n.ARRAY_BUFFER)}function l(u){const h=[],m=u.index,g=u.attributes.position;let y=0;if(g===void 0)return;if(m!==null){const A=m.array;y=m.version;for(let w=0,S=A.length;w<S;w+=3){const M=A[w+0],b=A[w+1],R=A[w+2];h.push(M,b,b,R,R,M)}}else{const A=g.array;y=g.version;for(let w=0,S=A.length/3-1;w<S;w+=3){const M=w+0,b=w+1,R=w+2;h.push(M,b,b,R,R,M)}}const p=new(g.count>=65535?js:Qs)(h,1);p.version=y;const f=r.get(u);f&&e.remove(f),r.set(u,p)}function d(u){const h=r.get(u);if(h){const m=u.index;m!==null&&h.version<m.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function So(n,e,t){let i;function s(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,h){n.drawElements(i,h,r,u*a),t.update(h,i,1)}function l(u,h,m){m!==0&&(n.drawElementsInstanced(i,h,r,u*a,m),t.update(h,i,m))}function d(u,h,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,u,0,m);let y=0;for(let p=0;p<m;p++)y+=h[p];t.update(y,i,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d}function Mo(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:je("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}class Lr extends wt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}function yo(n,e,t){const i=new WeakMap,s=new dt;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(o);if(h===void 0||h.count!==u){let E=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",E)};h!==void 0&&h.texture.dispose();const m=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let w=0;m===!0&&(w=1),g===!0&&(w=2),y===!0&&(w=3);let S=o.attributes.position.count*w,M=1;S>e.maxTextureSize&&(M=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const b=new Float32Array(S*M*4*u),R=new Lr(b,S,M,u);R.type=1015,R.needsUpdate=!0;const x=w*4;for(let C=0;C<u;C++){const I=p[C],U=f[C],O=A[C],P=S*M*4*C;for(let N=0;N<I.count;N++){const k=N*x;m===!0&&(s.fromBufferAttribute(I,N),b[P+k+0]=s.x,b[P+k+1]=s.y,b[P+k+2]=s.z,b[P+k+3]=0),g===!0&&(s.fromBufferAttribute(U,N),b[P+k+4]=s.x,b[P+k+5]=s.y,b[P+k+6]=s.z,b[P+k+7]=0),y===!0&&(s.fromBufferAttribute(O,N),b[P+k+8]=s.x,b[P+k+9]=s.y,b[P+k+10]=s.z,b[P+k+11]=O.itemSize===4?s.w:1)}}h={count:u,texture:R,size:new $e(S,M)},i.set(o,h),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let m=0;for(let y=0;y<l.length;y++)m+=l[y];const g=o.morphTargetsRelative?1:1-m;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function bo(n,e,t,i,s){let r=new WeakMap;function a(l){const d=s.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==d&&(e.update(h),r.set(h,d)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==d&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,d))),l.isSkinnedMesh){const m=l.skeleton;r.get(m)!==d&&(m.update(),r.set(m,d))}return h}function o(){r=new WeakMap}function c(l){const d=l.target;d.removeEventListener("dispose",c),i.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:a,dispose:o}}const Eo={1:"LINEAR_TONE_MAPPING",2:"REINHARD_TONE_MAPPING",3:"CINEON_TONE_MAPPING",4:"ACES_FILMIC_TONE_MAPPING",6:"AGX_TONE_MAPPING",7:"NEUTRAL_TONE_MAPPING",5:"CUSTOM_TONE_MAPPING"};function To(n,e,t,i,s,r){const a=new Nt(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,c=null;const l=new Yt;l.setAttribute("position",new qt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new qt([0,2,0,0,2,0],2));const d=new ur({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Vt(l,d),h=new Bn(-1,1,1,-1,0,1);let m=null,g=null,y=!1,p,f=null,A=[],w=!1;this.setSize=function(S,M){a.setSize(S,M),o!==null&&o.setSize(S,M),c!==null&&c.setSize(S,M);for(let b=0;b<A.length;b++){const R=A[b];R.setSize&&R.setSize(S,M)}},this.setEffects=function(S){A=S,w=A.length>0&&A[0].isRenderPass===!0;const M=a.width,b=a.height;A.length>0&&o===null&&(o=new Nt(M,b,{type:1016,depthBuffer:!1,stencilBuffer:!1}),c=new Nt(M,b,{type:1016,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<A.length;R++){const x=A[R];x.setSize&&x.setSize(M,b)}},this.begin=function(S,M){if(y||S.toneMapping===0&&A.length===0)return!1;if(f=M,M!==null){const b=M.width,R=M.height;(a.width!==b||a.height!==R)&&this.setSize(b,R)}return w===!1&&S.setRenderTarget(a),p=S.toneMapping,S.toneMapping=0,!0},this.hasRenderPass=function(){return w},this.end=function(S,M){S.toneMapping=p,y=!0;let b=a,R=o;for(let x=0;x<A.length;x++){const E=A[x];E.enabled!==!1&&(E.render(S,R,b,M),E.needsSwap!==!1&&(b=R,R=R===o?c:o))}if(m!==S.outputColorSpace||g!==S.toneMapping){m=S.outputColorSpace,g=S.toneMapping,d.defines={},Ze.getTransfer(m)===st&&(d.defines.SRGB_TRANSFER="");const x=Eo[g];x&&(d.defines[x]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=b.texture,S.setRenderTarget(f),S.render(u,h),f=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),d.dispose()}}class Ao extends wt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class hn extends wt{constructor(e,t,i=1014,s,r,a,o=1003,c=1003,l,d=1026,u=1){if(d!==1026&&d!==1027)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:u};super(h,s,r,a,o,c,d,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ys(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}const Fr=new wt,Cs=new hn(1,1),Ir=new Lr,Ur=new Ao,Nr=new Pr,Br=[],Or=[],Gr=new Float32Array(16),zr=new Float32Array(9),kr=new Float32Array(4);function Ki(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Br[s];if(r===void 0&&(r=new Float32Array(s),Br[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function St(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Mt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function kn(n,e){let t=Or[e];t===void 0&&(t=new Int32Array(e),Or[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Ro(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function wo(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;n.uniform2fv(this.addr,e),Mt(t,e)}}function Co(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(St(t,e))return;n.uniform3fv(this.addr,e),Mt(t,e)}}function Po(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;n.uniform4fv(this.addr,e),Mt(t,e)}}function Do(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(St(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,i))return;kr.set(i),n.uniformMatrix2fv(this.addr,!1,kr),Mt(t,i)}}function Lo(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(St(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,i))return;zr.set(i),n.uniformMatrix3fv(this.addr,!1,zr),Mt(t,i)}}function Fo(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(St(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,i))return;Gr.set(i),n.uniformMatrix4fv(this.addr,!1,Gr),Mt(t,i)}}function Io(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Uo(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;n.uniform2iv(this.addr,e),Mt(t,e)}}function No(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;n.uniform3iv(this.addr,e),Mt(t,e)}}function Bo(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;n.uniform4iv(this.addr,e),Mt(t,e)}}function Oo(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Go(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;n.uniform2uiv(this.addr,e),Mt(t,e)}}function zo(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;n.uniform3uiv(this.addr,e),Mt(t,e)}}function ko(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;n.uniform4uiv(this.addr,e),Mt(t,e)}}function Vo(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Cs.compareFunction=t.isReversedDepthBuffer()?518:515,r=Cs):r=Fr,t.setTexture2D(e||r,s)}function Ho(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Ur,s)}function Wo(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Nr,s)}function Xo(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Ir,s)}function qo(n){switch(n){case 5126:return Ro;case 35664:return wo;case 35665:return Co;case 35666:return Po;case 35674:return Do;case 35675:return Lo;case 35676:return Fo;case 5124:case 35670:return Io;case 35667:case 35671:return Uo;case 35668:case 35672:return No;case 35669:case 35673:return Bo;case 5125:return Oo;case 36294:return Go;case 36295:return zo;case 36296:return ko;case 35678:case 36198:case 36298:case 36306:case 35682:return Vo;case 35679:case 36299:case 36307:return Ho;case 35680:case 36300:case 36308:case 36293:return Wo;case 36289:case 36303:case 36311:case 36292:return Xo}}function Yo(n,e){n.uniform1fv(this.addr,e)}function Ko(n,e){const t=Ki(e,this.size,2);n.uniform2fv(this.addr,t)}function Zo(n,e){const t=Ki(e,this.size,3);n.uniform3fv(this.addr,t)}function $o(n,e){const t=Ki(e,this.size,4);n.uniform4fv(this.addr,t)}function Jo(n,e){const t=Ki(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Qo(n,e){const t=Ki(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function jo(n,e){const t=Ki(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function el(n,e){n.uniform1iv(this.addr,e)}function tl(n,e){n.uniform2iv(this.addr,e)}function il(n,e){n.uniform3iv(this.addr,e)}function nl(n,e){n.uniform4iv(this.addr,e)}function sl(n,e){n.uniform1uiv(this.addr,e)}function rl(n,e){n.uniform2uiv(this.addr,e)}function al(n,e){n.uniform3uiv(this.addr,e)}function ol(n,e){n.uniform4uiv(this.addr,e)}function ll(n,e,t){const i=this.cache,s=e.length,r=kn(t,s);St(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=Cs:a=Fr;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function cl(n,e,t){const i=this.cache,s=e.length,r=kn(t,s);St(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Ur,r[a])}function hl(n,e,t){const i=this.cache,s=e.length,r=kn(t,s);St(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Nr,r[a])}function fl(n,e,t){const i=this.cache,s=e.length,r=kn(t,s);St(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Ir,r[a])}function dl(n){switch(n){case 5126:return Yo;case 35664:return Ko;case 35665:return Zo;case 35666:return $o;case 35674:return Jo;case 35675:return Qo;case 35676:return jo;case 5124:case 35670:return el;case 35667:case 35671:return tl;case 35668:case 35672:return il;case 35669:case 35673:return nl;case 5125:return sl;case 36294:return rl;case 36295:return al;case 36296:return ol;case 35678:case 36198:case 36298:case 36306:case 35682:return ll;case 35679:case 36299:case 36307:return cl;case 35680:case 36300:case 36308:case 36293:return hl;case 36289:case 36303:case 36311:case 36292:return fl}}class ul{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=qo(t.type)}}class pl{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=dl(t.type)}}class _l{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Ps=/(\w+)(\])?(\[|\.)?/g;function Vr(n,e){n.seq.push(e),n.map[e.id]=e}function ml(n,e,t){const i=n.name,s=i.length;for(Ps.lastIndex=0;;){const r=Ps.exec(i),a=Ps.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Vr(t,l===void 0?new ul(o,n,e):new pl(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new _l(o),Vr(t,u)),t=u}}}class Vn{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);ml(o,c,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function Hr(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const xl=37297;let gl=0;function vl(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Wr=new Oe;function Sl(n){Ze._getMatrix(Wr,Ze.workingColorSpace,n);const e=`mat3( ${Wr.elements.map(t=>t.toFixed(4))} )`;switch(Ze.getTransfer(n)){case mn:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return Be("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Xr(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+vl(n.getShaderSource(e),o)}else return r}function Ml(n,e){const t=Sl(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const yl={1:"Linear",2:"Reinhard",3:"Cineon",4:"ACESFilmic",6:"AgX",7:"Neutral",5:"Custom"};function bl(n,e){const t=yl[e];return t===void 0?(Be("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Hn=new H;function El(){Ze.getLuminanceCoefficients(Hn);const n=Hn.x.toFixed(4),e=Hn.y.toFixed(4),t=Hn.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Tl(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fn).join(`
`)}function Al(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Rl(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function fn(n){return n!==""}function qr(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Yr(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const wl=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ds(n){return n.replace(wl,Pl)}const Cl=new Map;function Pl(n,e){let t=He[e];if(t===void 0){const i=Cl.get(e);if(i!==void 0)t=He[i],Be('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Ds(t)}const Dl=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Kr(n){return n.replace(Dl,Ll)}function Ll(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Zr(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Fl={1:"SHADOWMAP_TYPE_PCF",3:"SHADOWMAP_TYPE_VSM"};function Il(n){return Fl[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Ul={301:"ENVMAP_TYPE_CUBE",302:"ENVMAP_TYPE_CUBE",306:"ENVMAP_TYPE_CUBE_UV"};function Nl(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":Ul[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const Bl={302:"ENVMAP_MODE_REFRACTION"};function Ol(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Bl[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Gl={0:"ENVMAP_BLENDING_MULTIPLY",1:"ENVMAP_BLENDING_MIX",2:"ENVMAP_BLENDING_ADD"};function zl(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Gl[n.combine]||"ENVMAP_BLENDING_NONE"}function kl(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Vl(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=Il(t),l=Nl(t),d=Ol(t),u=zl(t),h=kl(t),m=Tl(t),g=Al(r),y=s.createProgram();let p,f,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(fn).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(fn).join(`
`),f.length>0&&(f+=`
`)):(p=[Zr(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fn).join(`
`),f=[Zr(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?He.tonemapping_pars_fragment:"",t.toneMapping!==0?bl("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,Ml("linearToOutputTexel",t.outputColorSpace),El(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fn).join(`
`)),a=Ds(a),a=qr(a,t),a=Yr(a,t),o=Ds(o),o=qr(o,t),o=Yr(o,t),a=Kr(a),o=Kr(o),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",t.glslVersion===jn?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===jn?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const w=A+p+a,S=A+f+o,M=Hr(s,s.VERTEX_SHADER,w),b=Hr(s,s.FRAGMENT_SHADER,S);s.attachShader(y,M),s.attachShader(y,b),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function R(I){if(n.debug.checkShaderErrors){const U=s.getProgramInfoLog(y)||"",O=s.getShaderInfoLog(M)||"",P=s.getShaderInfoLog(b)||"",N=U.trim(),k=O.trim(),X=P.trim();let te=!0,W=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(te=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,y,M,b);else{const $=Xr(s,M,"vertex"),j=Xr(s,b,"fragment");je("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+N+`
`+$+`
`+j)}else N!==""?Be("WebGLProgram: Program Info Log:",N):(k===""||X==="")&&(W=!1);W&&(I.diagnostics={runnable:te,programLog:N,vertexShader:{log:k,prefix:p},fragmentShader:{log:X,prefix:f}})}s.deleteShader(M),s.deleteShader(b),x=new Vn(s,y),E=Rl(s,y)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(y,xl)),C},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=gl++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=M,this.fragmentShader=b,this}let Hl=0;class Wl{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Xl(e),t.set(e,i)),i}}class Xl{constructor(e){this.id=Hl++,this.code=e,this.usedTimes=0}}function ql(n){return n===1030||n===37490||n===36285}function Yl(n,e,t,i,s,r){const a=new ir,o=new Wl,c=new Set,l=[],d=new Map,u=i.logarithmicDepthBuffer;let h=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return c.add(x),x===0?"uv":`uv${x}`}function y(x,E,C,I,U,O){const P=I.fog,N=U.geometry,k=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,X=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,te=e.get(x.envMap||k,X),W=te&&te.mapping===306?te.image.height:null,$=m[x.type];x.precision!==null&&(h=i.getMaxPrecision(x.precision),h!==x.precision&&Be("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));const j=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,ve=j!==void 0?j.length:0;let xe=0;N.morphAttributes.position!==void 0&&(xe=1),N.morphAttributes.normal!==void 0&&(xe=2),N.morphAttributes.color!==void 0&&(xe=3);let Xe,Le,ke,Y;if($){const ct=$t[$];Xe=ct.vertexShader,Le=ct.fragmentShader}else{Xe=x.vertexShader,Le=x.fragmentShader;const ct=o.getVertexShaderStage(x),it=o.getFragmentShaderStage(x);o.update(x,ct,it),ke=ct.id,Y=it.id}const K=n.getRenderTarget(),_e=n.state.buffers.depth.getReversed(),Pe=U.isInstancedMesh===!0,fe=U.isBatchedMesh===!0,Ge=!!x.map,ut=!!x.matcap,Ie=!!te,Ue=!!x.aoMap,et=!!x.lightMap,Ne=!!x.bumpMap&&x.wireframe===!1,Ye=!!x.normalMap,Se=!!x.displacementMap,we=!!x.emissiveMap,Ee=!!x.metalnessMap,ze=!!x.roughnessMap,D=x.anisotropy>0,lt=x.clearcoat>0,Je=x.dispersion>0,T=x.retroreflectivity>0,_=x.iridescence>0,B=x.sheen>0,V=x.transmission>0,Z=D&&!!x.anisotropyMap,ne=lt&&!!x.clearcoatMap,se=lt&&!!x.clearcoatNormalMap,J=lt&&!!x.clearcoatRoughnessMap,ee=_&&!!x.iridescenceMap,re=_&&!!x.iridescenceThicknessMap,Ae=B&&!!x.sheenColorMap,he=B&&!!x.sheenRoughnessMap,ae=!!x.specularMap,Re=!!x.specularColorMap,De=!!x.specularIntensityMap,Ve=V&&!!x.transmissionMap,F=V&&!!x.thicknessMap,oe=!!x.gradientMap,Q=!!x.alphaMap,le=x.alphaTest>0,pe=!!x.alphaHash,ie=!!x.extensions;let Ce=0;x.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Ce=n.toneMapping);const be={shaderID:$,shaderType:x.type,shaderName:x.name,vertexShader:Xe,fragmentShader:Le,defines:x.defines,customVertexShaderID:ke,customFragmentShaderID:Y,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:fe,batchingColor:fe&&U._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&U.instanceColor!==null,instancingMorph:Pe&&U.morphTexture!==null,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Ze.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Ge,matcap:ut,envMap:Ie,envMapMode:Ie&&te.mapping,envMapCubeUVHeight:W,aoMap:Ue,lightMap:et,bumpMap:Ne,normalMap:Ye,displacementMap:Se,emissiveMap:we,normalMapObjectSpace:Ye&&x.normalMapType===1,normalMapTangentSpace:Ye&&x.normalMapType===0,packedNormalMap:Ye&&x.normalMapType===0&&ql(x.normalMap.format),metalnessMap:Ee,roughnessMap:ze,anisotropy:D,anisotropyMap:Z,clearcoat:lt,clearcoatMap:ne,clearcoatNormalMap:se,clearcoatRoughnessMap:J,dispersion:Je,retroreflection:T,iridescence:_,iridescenceMap:ee,iridescenceThicknessMap:re,sheen:B,sheenColorMap:Ae,sheenRoughnessMap:he,specularMap:ae,specularColorMap:Re,specularIntensityMap:De,transmission:V,transmissionMap:Ve,thicknessMap:F,gradientMap:oe,opaque:x.transparent===!1&&x.blending===1&&x.alphaToCoverage===!1,alphaMap:Q,alphaTest:le,alphaHash:pe,combine:x.combine,mapUv:Ge&&g(x.map.channel),aoMapUv:Ue&&g(x.aoMap.channel),lightMapUv:et&&g(x.lightMap.channel),bumpMapUv:Ne&&g(x.bumpMap.channel),normalMapUv:Ye&&g(x.normalMap.channel),displacementMapUv:Se&&g(x.displacementMap.channel),emissiveMapUv:we&&g(x.emissiveMap.channel),metalnessMapUv:Ee&&g(x.metalnessMap.channel),roughnessMapUv:ze&&g(x.roughnessMap.channel),anisotropyMapUv:Z&&g(x.anisotropyMap.channel),clearcoatMapUv:ne&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:se&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ee&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:re&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Ae&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:he&&g(x.sheenRoughnessMap.channel),specularMapUv:ae&&g(x.specularMap.channel),specularColorMapUv:Re&&g(x.specularColorMap.channel),specularIntensityMapUv:De&&g(x.specularIntensityMap.channel),transmissionMapUv:Ve&&g(x.transmissionMap.channel),thicknessMapUv:F&&g(x.thicknessMap.channel),alphaMapUv:Q&&g(x.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(Ye||D),vertexNormals:!!N.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!N.attributes.uv&&(Ge||Q),fog:!!P,useFog:x.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||N.attributes.normal===void 0&&Ye===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:_e,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:N.attributes.position!==void 0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:xe,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:O.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ce,decodeVideoTexture:Ge&&x.map.isVideoTexture===!0&&Ze.getTransfer(x.map.colorSpace)===st,decodeVideoTextureEmissive:we&&x.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(x.emissiveMap.colorSpace)===st,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===2,flipSided:x.side===1,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ie&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ie&&x.extensions.multiDraw===!0||fe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return be.vertexUv1s=c.has(1),be.vertexUv2s=c.has(2),be.vertexUv3s=c.has(3),c.clear(),be}function p(x){const E=[];if(x.shaderID?E.push(x.shaderID):(E.push(x.customVertexShaderID),E.push(x.customFragmentShaderID)),x.defines!==void 0)for(const C in x.defines)E.push(C),E.push(x.defines[C]);return x.isRawShaderMaterial===!1&&(f(E,x),A(E,x),E.push(n.outputColorSpace)),E.push(x.customProgramCacheKey),E.join()}function f(x,E){x.push(E.precision),x.push(E.outputColorSpace),x.push(E.envMapMode),x.push(E.envMapCubeUVHeight),x.push(E.mapUv),x.push(E.alphaMapUv),x.push(E.lightMapUv),x.push(E.aoMapUv),x.push(E.bumpMapUv),x.push(E.normalMapUv),x.push(E.displacementMapUv),x.push(E.emissiveMapUv),x.push(E.metalnessMapUv),x.push(E.roughnessMapUv),x.push(E.anisotropyMapUv),x.push(E.clearcoatMapUv),x.push(E.clearcoatNormalMapUv),x.push(E.clearcoatRoughnessMapUv),x.push(E.iridescenceMapUv),x.push(E.iridescenceThicknessMapUv),x.push(E.sheenColorMapUv),x.push(E.sheenRoughnessMapUv),x.push(E.specularMapUv),x.push(E.specularColorMapUv),x.push(E.specularIntensityMapUv),x.push(E.transmissionMapUv),x.push(E.thicknessMapUv),x.push(E.combine),x.push(E.fogExp2),x.push(E.sizeAttenuation),x.push(E.morphTargetsCount),x.push(E.morphAttributeCount),x.push(E.numSunLights),x.push(E.numDirLights),x.push(E.numPointLights),x.push(E.numSpotLights),x.push(E.numSpotLightMaps),x.push(E.numHemiLights),x.push(E.numRectAreaLights),x.push(E.numSunLightShadows),x.push(E.numDirLightShadows),x.push(E.numPointLightShadows),x.push(E.numSpotLightShadows),x.push(E.numSpotLightShadowsWithMaps),x.push(E.numLightProbes),x.push(E.shadowMapType),x.push(E.toneMapping),x.push(E.numClippingPlanes),x.push(E.numClipIntersection),x.push(E.depthPacking)}function A(x,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function w(x){const E=m[x.type];let C;if(E){const I=$t[E];C=Xa.clone(I.uniforms)}else C=x.uniforms;return C}function S(x,E){let C=d.get(E);return C!==void 0?++C.usedTimes:(C=new Vl(n,E,x,s),l.push(C),d.set(E,C)),C}function M(x){if(--x.usedTimes===0){const E=l.indexOf(x);l[E]=l[l.length-1],l.pop(),d.delete(x.cacheKey),x.destroy()}}function b(x){o.remove(x)}function R(){o.dispose()}return{getParameters:y,getProgramCacheKey:p,getUniforms:w,acquireProgram:S,releaseProgram:M,releaseShaderCache:b,programs:l,dispose:R}}function Kl(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Zl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function $r(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Jr(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(h){let m=0;return h.isInstancedMesh&&(m+=2),h.isSkinnedMesh&&(m+=1),m}function o(h,m,g,y,p,f){let A=n[e];return A===void 0?(A={id:h.id,object:h,geometry:m,material:g,materialVariant:a(h),groupOrder:y,renderOrder:h.renderOrder,z:p,group:f},n[e]=A):(A.id=h.id,A.object=h,A.geometry=m,A.material=g,A.materialVariant=a(h),A.groupOrder=y,A.renderOrder=h.renderOrder,A.z=p,A.group=f),e++,A}function c(h,m,g,y,p,f,A){A.reversedDepth===!0&&(p=-p);const w=o(h,m,g,y,p,f);g.transmission>0?i.push(w):g.transparent===!0?s.push(w):t.push(w)}function l(h,m,g,y,p,f){const A=o(h,m,g,y,p,f);g.transmission>0?i.unshift(A):g.transparent===!0?s.unshift(A):t.unshift(A)}function d(h,m){t.length>1&&t.sort(h||Zl),i.length>1&&i.sort(m||$r),s.length>1&&s.sort(m||$r)}function u(){for(let h=e,m=n.length;h<m;h++){const g=n[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:u,sort:d}}function $l(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new Jr,n.set(i,[a])):s>=r.length?(a=new Jr,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Jl(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new H,color:new tt};break;case"SpotLight":t={position:new H,direction:new H,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new tt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":t={color:new tt,position:new H,halfWidth:new H,halfHeight:new H};break}return n[e.id]=t,t}}}function Ql(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let jl=0;function ec(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function tc(n){const e=new Jl,t=Ql(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new H);const s=new H,r=new _t,a=new _t;function o(l){let d=0,u=0,h=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let m=0,g=0,y=0,p=0,f=0,A=0,w=0,S=0,M=0,b=0,R=0,x=0,E=0,C=0;l.sort(ec);for(let U=0,O=l.length;U<O;U++){const P=l[U],N=P.color,k=P.intensity,X=P.distance;let te=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===1030?te=P.shadow.map.texture:te=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)d+=N.r*k,u+=N.g*k,h+=N.b*k;else if(P.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(P.sh.coefficients[W],k);C++}else if(P.isSunLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const $=P.shadow,j=t.get(P);j.shadowIntensity=$.intensity,j.shadowBias=$.bias,j.shadowNormalBias=$.normalBias,j.shadowRadius=$.radius,j.shadowMapSize.copy($.mapSize).multiply($.getFrameExtents()),i.sunShadow[g]=j,i.sunShadowMap[g]=te;const ve=$.getViewportCount();for(let xe=0;xe<ve;xe++)i.sunShadowMatrix[y+xe]=$.getMatrix(xe),i.sunShadowCascade[y+xe]=$._cascadeData[xe];y+=ve,g++}i.sun[m]=W,m++}else if(P.isDirectionalLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const $=P.shadow,j=t.get(P);j.shadowIntensity=$.intensity,j.shadowBias=$.bias,j.shadowNormalBias=$.normalBias,j.shadowRadius=$.radius,j.shadowMapSize=$.mapSize,i.directionalShadow[p]=j,i.directionalShadowMap[p]=te,i.directionalShadowMatrix[p]=P.shadow.matrix,M++}i.directional[p]=W,p++}else if(P.isSpotLight){const W=e.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(N).multiplyScalar(k),W.distance=X,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,i.spot[A]=W;const $=P.shadow;if(P.map&&(i.spotLightMap[x]=P.map,x++,$.updateMatrices(P),P.castShadow&&E++),i.spotLightMatrix[A]=$.matrix,P.castShadow){const j=t.get(P);j.shadowIntensity=$.intensity,j.shadowBias=$.bias,j.shadowNormalBias=$.normalBias,j.shadowRadius=$.radius,j.shadowMapSize=$.mapSize,i.spotShadow[A]=j,i.spotShadowMap[A]=te,R++}A++}else if(P.isRectAreaLight){const W=e.get(P);W.color.copy(N).multiplyScalar(k),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),i.rectArea[w]=W,w++}else if(P.isPointLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){const $=P.shadow,j=t.get(P);j.shadowIntensity=$.intensity,j.shadowBias=$.bias,j.shadowNormalBias=$.normalBias,j.shadowRadius=$.radius,j.shadowMapSize=$.mapSize,j.shadowCameraNear=$.camera.near,j.shadowCameraFar=$.camera.far,i.pointShadow[f]=j,i.pointShadowMap[f]=te,i.pointShadowMatrix[f]=P.shadow.matrix,b++}i.point[f]=W,f++}else if(P.isHemisphereLight){const W=e.get(P);W.skyColor.copy(P.color).multiplyScalar(k),W.groundColor.copy(P.groundColor).multiplyScalar(k),i.hemi[S]=W,S++}}w>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ce.LTC_FLOAT_1,i.rectAreaLTC2=ce.LTC_FLOAT_2):(i.rectAreaLTC1=ce.LTC_HALF_1,i.rectAreaLTC2=ce.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const I=i.hash;(I.sunLength!==m||I.directionalLength!==p||I.pointLength!==f||I.spotLength!==A||I.rectAreaLength!==w||I.hemiLength!==S||I.numSunShadows!==g||I.numDirectionalShadows!==M||I.numPointShadows!==b||I.numSpotShadows!==R||I.numSpotMaps!==x||I.numLightProbes!==C)&&(i.sun.length=m,i.directional.length=p,i.spot.length=A,i.rectArea.length=w,i.point.length=f,i.hemi.length=S,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=y,i.sunShadowCascade.length=y,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.directionalShadowMatrix.length=M,i.pointShadow.length=b,i.pointShadowMap.length=b,i.pointShadowMatrix.length=b,i.spotShadow.length=R,i.spotShadowMap.length=R,i.spotLightMatrix.length=R+x-E,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=C,I.sunLength=m,I.directionalLength=p,I.pointLength=f,I.spotLength=A,I.rectAreaLength=w,I.hemiLength=S,I.numSunShadows=g,I.numDirectionalShadows=M,I.numPointShadows=b,I.numSpotShadows=R,I.numSpotMaps=x,I.numLightProbes=C,i.version=jl++)}function c(l,d){let u=0,h=0,m=0,g=0,y=0,p=0;const f=d.matrixWorldInverse;for(let A=0,w=l.length;A<w;A++){const S=l[A];if(S.isSunLight){const M=i.sun[u];M.direction.setFromMatrixPosition(S.matrixWorld),M.direction.transformDirection(f),u++}else if(S.isDirectionalLight){const M=i.directional[h];M.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(f),h++}else if(S.isSpotLight){const M=i.spot[g];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(f),M.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(f),g++}else if(S.isRectAreaLight){const M=i.rectArea[y];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(f),a.identity(),r.copy(S.matrixWorld),r.premultiply(f),a.extractRotation(r),M.halfWidth.set(S.width*.5,0,0),M.halfHeight.set(0,S.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),y++}else if(S.isPointLight){const M=i.point[m];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(f),m++}else if(S.isHemisphereLight){const M=i.hemi[p];M.direction.setFromMatrixPosition(S.matrixWorld),M.direction.transformDirection(f),p++}}}return{setup:o,setupView:c,state:i}}function Qr(n){const e=new tc(n),t=[],i=[],s=[];function r(h){u.camera=h,t.length=0,i.length=0,s.length=0}function a(h){t.push(h)}function o(h){i.push(h)}function c(h){s.push(h)}function l(){e.setup(t)}function d(h){e.setupView(t,h)}const u={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:d,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function ic(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Qr(n),e.set(s,[o])):r>=a.length?(o=new Qr(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}class nc extends Tn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class sc extends Tn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class rc extends hn{constructor(e,t=1014,i=301,s,r,a=1003,o=1003,c,l=1026){const d={width:e,height:e,depth:1},u=[d,d,d,d,d,d];super(e,e,t,i,s,r,a,o,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}const ac=`
void main() {

	gl_Position = vec4( position, 1.0 );

}
`,oc=`
uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;

void main() {

	const float samples = float( VSM_SAMPLES );

	float mean = 0.0;
	float squared_mean = 0.0;

	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {

		float uvOffset = uvStart + i * uvStride;

		#ifdef HORIZONTAL_PASS

			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;

		#else

			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;

		#endif

	}

	mean = mean / samples;
	squared_mean = squared_mean / samples;

	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );

	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );

}
`,lc=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],cc=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],jr=new _t,dn=new H,Ls=new H;function hc(n,e,t){let i=new Sr;const s=new $e,r=new $e,a=new dt,o=new nc,c=new sc,l={},d=t.maxTextureSize,u={0:1,1:0,2:2},h=new Kt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $e},radius:{value:4}},vertexShader:ac,fragmentShader:oc}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const g=new Yt;g.setAttribute("position",new ti(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Vt(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let f=this.type;this.render=function(b,R,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;this.type===2&&(Be("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=1);const E=n.getRenderTarget(),C=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),U=n.state;U.setBlending(0),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const O=f!==this.type;O&&R.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(N=>N.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,N=b.length;P<N;P++){const k=b[P],X=k.shadow;if(X===void 0){Be("WebGLShadowMap:",k,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const te=X.getFrameExtents();s.multiply(te),r.copy(X.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/te.x),s.x=r.x*te.x,X.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/te.y),s.y=r.y*te.y,X.mapSize.y=r.y));const W=n.state.buffers.depth.getReversed();if(X.camera._reversedDepth=W,X.map===null||O===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===3){if(k.isPointLight){Be("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new Nt(s.x,s.y,{format:1030,type:1016,minFilter:1006,magFilter:1006,generateMipmaps:!1}),X.map.texture.name=k.name+".shadowMap",X.map.depthTexture=new hn(s.x,s.y,1015),X.map.depthTexture.name=k.name+".shadowMapDepth",X.map.depthTexture.format=1026,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=1003,X.map.depthTexture.magFilter=1003}else k.isPointLight?(X.map=new Dr(s.x),X.map.depthTexture=new rc(s.x,1014)):(X.map=new Nt(s.x,s.y),X.map.depthTexture=new hn(s.x,s.y,1014)),X.map.depthTexture.name=k.name+".shadowMap",X.map.depthTexture.format=1026,this.type===1?(X.map.depthTexture.compareFunction=W?518:515,X.map.depthTexture.minFilter=1006,X.map.depthTexture.magFilter=1006):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=1003,X.map.depthTexture.magFilter=1003);X.camera.updateProjectionMatrix()}X.map.isWebGLCubeRenderTarget!==!0&&(X.map.width!==s.x||X.map.height!==s.y)&&X.map.setSize(s.x,s.y);const $=X.map.isWebGLCubeRenderTarget?6:X.getViewportCount();k.isPointLight!==!0&&X.updateMatrices(k,x);for(let j=0;j<$;j++){const ve=X.getCamera(j);if(k.isPointLight){const xe=X.camera,Xe=X.matrix,Le=k.distance||xe.far;Le!==xe.far&&(xe.far=Le,xe.updateProjectionMatrix()),dn.setFromMatrixPosition(k.matrixWorld),xe.position.copy(dn),Ls.copy(xe.position),Ls.add(lc[j]),xe.up.copy(cc[j]),xe.lookAt(Ls),xe.updateMatrixWorld(),Xe.makeTranslation(-dn.x,-dn.y,-dn.z),jr.multiplyMatrices(xe.projectionMatrix,xe.matrixWorldInverse),X._frustum.setFromProjectionMatrix(jr,xe.coordinateSystem,xe.reversedDepth)}if(X.map.isWebGLCubeRenderTarget)n.setRenderTarget(X.map,j),n.clear();else{j===0&&(n.setRenderTarget(X.map),n.clear());const xe=X.getViewport(j);a.set(r.x*xe.x,r.y*xe.y,r.x*xe.z,r.y*xe.w),U.viewport(a)}i=X.getFrustum(j),S(R,x,ve,k,this.type)}X.isPointLightShadow!==!0&&this.type===3&&A(X,x),X.needsUpdate=!1}f=this.type,p.needsUpdate=!1,n.setRenderTarget(E,C,I)};function A(b,R){const x=e.update(y);h.defines.VSM_SAMPLES!==b.blurSamples&&(h.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null?b.mapPass=new Nt(s.x,s.y,{format:1030,type:1016}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),h.uniforms.shadow_pass.value=b.map.depthTexture,h.uniforms.resolution.value.set(b.map.width,b.map.height),h.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(R,null,x,h,y,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value.set(b.map.width,b.map.height),m.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(R,null,x,m,y,null)}function w(b,R,x,E){let C=null;const I=x.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(I!==void 0)C=I;else if(C=x.isPointLight===!0?c:o,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const U=C.uuid,O=R.uuid;let P=l[U];P===void 0&&(P={},l[U]=P);let N=P[O];N===void 0&&(N=C.clone(),P[O]=N,R.addEventListener("dispose",M)),C=N}if(C.visible=R.visible,C.wireframe=R.wireframe,E===3?C.side=R.shadowSide!==null?R.shadowSide:R.side:C.side=R.shadowSide!==null?R.shadowSide:u[R.side],C.alphaMap=R.alphaMap,C.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,C.map=R.map,C.clipShadows=R.clipShadows,C.clippingPlanes=R.clippingPlanes,C.clipIntersection=R.clipIntersection,C.displacementMap=R.displacementMap,C.displacementScale=R.displacementScale,C.displacementBias=R.displacementBias,C.wireframeLinewidth=R.wireframeLinewidth,C.linewidth=R.linewidth,x.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const U=n.properties.get(C);U.light=x}return C}function S(b,R,x,E,C){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&C===3)&&(!b.frustumCulled||b.intersectsFrustum(i))){b.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,b.matrixWorld);const O=e.update(b),P=b.material;if(Array.isArray(P)){const N=O.groups;for(let k=0,X=N.length;k<X;k++){const te=N[k],W=P[te.materialIndex];if(W&&W.visible){const $=w(b,W,E,C);b.onBeforeShadow(n,b,R,x,O,$,te),n.renderBufferDirect(x,null,O,$,b,te),b.onAfterShadow(n,b,R,x,O,$,te)}}}else if(P.visible){const N=w(b,P,E,C);b.onBeforeShadow(n,b,R,x,O,N,null),n.renderBufferDirect(x,null,O,N,b,null),b.onAfterShadow(n,b,R,x,O,N,null)}}const U=b.children;for(let O=0,P=U.length;O<P;O++)S(U[O],R,x,E,C)}function M(b){b.target.removeEventListener("dispose",M);for(const x in l){const E=l[x],C=b.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function fc(n,e){function t(){let F=!1;const oe=new dt;let Q=null;const le=new dt(0,0,0,0);return{setMask:function(pe){Q!==pe&&!F&&(n.colorMask(pe,pe,pe,pe),Q=pe)},setLocked:function(pe){F=pe},setClear:function(pe,ie,Ce,be,ct){ct===!0&&(pe*=be,ie*=be,Ce*=be),oe.set(pe,ie,Ce,be),le.equals(oe)===!1&&(n.clearColor(pe,ie,Ce,be),le.copy(oe))},reset:function(){F=!1,Q=null,le.set(-1,0,0,0)}}}function i(){let F=!1,oe=!1,Q=null,le=null,pe=null;return{setReversed:function(ie){if(oe!==ie){const Ce=e.get("EXT_clip_control");ie?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),oe=ie;const be=pe;pe=null,this.setClear(be)}},getReversed:function(){return oe},setTest:function(ie){ie?K(n.DEPTH_TEST):_e(n.DEPTH_TEST)},setMask:function(ie){Q!==ie&&!F&&(n.depthMask(ie),Q=ie)},setFunc:function(ie){if(oe&&(ie=Ca[ie]),le!==ie){switch(ie){case 0:n.depthFunc(n.NEVER);break;case 1:n.depthFunc(n.ALWAYS);break;case 2:n.depthFunc(n.LESS);break;case 3:n.depthFunc(n.LEQUAL);break;case 4:n.depthFunc(n.EQUAL);break;case 5:n.depthFunc(n.GEQUAL);break;case 6:n.depthFunc(n.GREATER);break;case 7:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}le=ie}},setLocked:function(ie){F=ie},setClear:function(ie){pe!==ie&&(pe=ie,oe&&(ie=1-ie),n.clearDepth(ie))},reset:function(){F=!1,Q=null,le=null,pe=null,oe=!1}}}function s(){let F=!1,oe=null,Q=null,le=null,pe=null,ie=null,Ce=null,be=null,ct=null;return{setTest:function(it){F||(it?K(n.STENCIL_TEST):_e(n.STENCIL_TEST))},setMask:function(it){oe!==it&&!F&&(n.stencilMask(it),oe=it)},setFunc:function(it,Xt,jt){(Q!==it||le!==Xt||pe!==jt)&&(n.stencilFunc(it,Xt,jt),Q=it,le=Xt,pe=jt)},setOp:function(it,Xt,jt){(ie!==it||Ce!==Xt||be!==jt)&&(n.stencilOp(it,Xt,jt),ie=it,Ce=Xt,be=jt)},setLocked:function(it){F=it},setClear:function(it){ct!==it&&(n.clearStencil(it),ct=it)},reset:function(){F=!1,oe=null,Q=null,le=null,pe=null,ie=null,Ce=null,be=null,ct=null}}}const r=new t,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},h={},m=new WeakMap,g=[],y=null,p=!1,f=null,A=null,w=null,S=null,M=null,b=null,R=null,x=new tt(0,0,0),E=0,C=!1,I=null,U=null,O=null,P=null,N=null;const k=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,te=0;const W=n.getParameter(n.VERSION);W.indexOf("WebGL")!==-1?(te=parseFloat(/^WebGL (\d)/.exec(W)[1]),X=te>=1):W.indexOf("OpenGL ES")!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),X=te>=2);let $=null,j={};const ve=n.getParameter(n.SCISSOR_BOX),xe=n.getParameter(n.VIEWPORT),Xe=new dt().fromArray(ve),Le=new dt().fromArray(xe);function ke(F,oe,Q,le){const pe=new Uint8Array(4),ie=n.createTexture();n.bindTexture(F,ie),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ce=0;Ce<Q;Ce++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(oe,0,n.RGBA,1,1,le,0,n.RGBA,n.UNSIGNED_BYTE,pe):n.texImage2D(oe+Ce,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,pe);return ie}const Y={};Y[n.TEXTURE_2D]=ke(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=ke(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=ke(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=ke(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(n.DEPTH_TEST),a.setFunc(3),Ne(!1),Ye(1),K(n.CULL_FACE),Ue(0);function K(F){d[F]!==!0&&(n.enable(F),d[F]=!0)}function _e(F){d[F]!==!1&&(n.disable(F),d[F]=!1)}function Pe(F,oe){return h[F]!==oe?(n.bindFramebuffer(F,oe),h[F]=oe,F===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=oe),F===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=oe),!0):!1}function fe(F,oe){let Q=g,le=!1;if(F){Q=m.get(oe),Q===void 0&&(Q=[],m.set(oe,Q));const pe=F.textures;if(Q.length!==pe.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let ie=0,Ce=pe.length;ie<Ce;ie++)Q[ie]=n.COLOR_ATTACHMENT0+ie;Q.length=pe.length,le=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,le=!0);le&&n.drawBuffers(Q)}function Ge(F){return y!==F?(n.useProgram(F),y=F,!0):!1}const ut={100:n.FUNC_ADD,101:n.FUNC_SUBTRACT,102:n.FUNC_REVERSE_SUBTRACT};ut[103]=n.MIN,ut[104]=n.MAX;const Ie={200:n.ZERO,201:n.ONE,202:n.SRC_COLOR,204:n.SRC_ALPHA,210:n.SRC_ALPHA_SATURATE,208:n.DST_COLOR,206:n.DST_ALPHA,203:n.ONE_MINUS_SRC_COLOR,205:n.ONE_MINUS_SRC_ALPHA,209:n.ONE_MINUS_DST_COLOR,207:n.ONE_MINUS_DST_ALPHA,211:n.CONSTANT_COLOR,212:n.ONE_MINUS_CONSTANT_COLOR,213:n.CONSTANT_ALPHA,214:n.ONE_MINUS_CONSTANT_ALPHA};function Ue(F,oe,Q,le,pe,ie,Ce,be,ct,it){if(F===0){p===!0&&(_e(n.BLEND),p=!1);return}if(p===!1&&(K(n.BLEND),p=!0),F!==5){if(F!==f||it!==C){if((A!==100||M!==100)&&(n.blendEquation(n.FUNC_ADD),A=100,M=100),it)switch(F){case 1:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case 2:n.blendFunc(n.ONE,n.ONE);break;case 3:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case 4:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:je("WebGLState: Invalid blending: ",F);break}else switch(F){case 1:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case 2:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case 3:je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case 4:je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:je("WebGLState: Invalid blending: ",F);break}w=null,S=null,b=null,R=null,x.set(0,0,0),E=0,f=F,C=it}return}pe=pe||oe,ie=ie||Q,Ce=Ce||le,(oe!==A||pe!==M)&&(n.blendEquationSeparate(ut[oe],ut[pe]),A=oe,M=pe),(Q!==w||le!==S||ie!==b||Ce!==R)&&(n.blendFuncSeparate(Ie[Q],Ie[le],Ie[ie],Ie[Ce]),w=Q,S=le,b=ie,R=Ce),(be.equals(x)===!1||ct!==E)&&(n.blendColor(be.r,be.g,be.b,ct),x.copy(be),E=ct),f=F,C=!1}function et(F,oe){F.side===2?_e(n.CULL_FACE):K(n.CULL_FACE);let Q=F.side===1;oe&&(Q=!Q),Ne(Q),F.blending===1&&F.transparent===!1?Ue(0):Ue(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const le=F.stencilWrite;o.setTest(le),le&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),we(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):_e(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ne(F){I!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),I=F)}function Ye(F){F!==0?(K(n.CULL_FACE),F!==U&&(F===1?n.cullFace(n.BACK):F===2?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):_e(n.CULL_FACE),U=F}function Se(F){F!==O&&(X&&n.lineWidth(F),O=F)}function we(F,oe,Q){F?(K(n.POLYGON_OFFSET_FILL),(P!==oe||N!==Q)&&(P=oe,N=Q,a.getReversed()&&(oe=-oe),n.polygonOffset(oe,Q))):_e(n.POLYGON_OFFSET_FILL)}function Ee(F){F?K(n.SCISSOR_TEST):_e(n.SCISSOR_TEST)}function ze(F){F===void 0&&(F=n.TEXTURE0+k-1),$!==F&&(n.activeTexture(F),$=F)}function D(F,oe,Q){Q===void 0&&($===null?Q=n.TEXTURE0+k-1:Q=$);let le=j[Q];le===void 0&&(le={type:void 0,texture:void 0},j[Q]=le),(le.type!==F||le.texture!==oe)&&($!==Q&&(n.activeTexture(Q),$=Q),n.bindTexture(F,oe||Y[F]),le.type=F,le.texture=oe)}function lt(){const F=j[$];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function Je(){try{n.compressedTexImage2D(...arguments)}catch(F){je("WebGLState:",F)}}function T(){try{n.compressedTexImage3D(...arguments)}catch(F){je("WebGLState:",F)}}function _(){try{n.texSubImage2D(...arguments)}catch(F){je("WebGLState:",F)}}function B(){try{n.texSubImage3D(...arguments)}catch(F){je("WebGLState:",F)}}function V(){try{n.compressedTexSubImage2D(...arguments)}catch(F){je("WebGLState:",F)}}function Z(){try{n.compressedTexSubImage3D(...arguments)}catch(F){je("WebGLState:",F)}}function ne(){try{n.texStorage2D(...arguments)}catch(F){je("WebGLState:",F)}}function se(){try{n.texStorage3D(...arguments)}catch(F){je("WebGLState:",F)}}function J(){try{n.texImage2D(...arguments)}catch(F){je("WebGLState:",F)}}function ee(){try{n.texImage3D(...arguments)}catch(F){je("WebGLState:",F)}}function re(F){return u[F]!==void 0?u[F]:n.getParameter(F)}function Ae(F,oe){u[F]!==oe&&(n.pixelStorei(F,oe),u[F]=oe)}function he(F){Xe.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),Xe.copy(F))}function ae(F){Le.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),Le.copy(F))}function Re(F,oe){let Q=l.get(oe);Q===void 0&&(Q=new WeakMap,l.set(oe,Q));let le=Q.get(F);le===void 0&&(le=n.getUniformBlockIndex(oe,F.name),Q.set(F,le))}function De(F,oe){const le=l.get(oe).get(F);c.get(oe)!==le&&(n.uniformBlockBinding(oe,le,F.__bindingPointIndex),c.set(oe,le))}function Ve(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),d={},u={},$=null,j={},h={},m=new WeakMap,g=[],y=null,p=!1,f=null,A=null,w=null,S=null,M=null,b=null,R=null,x=new tt(0,0,0),E=0,C=!1,I=null,U=null,O=null,P=null,N=null,Xe.set(0,0,n.canvas.width,n.canvas.height),Le.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:K,disable:_e,bindFramebuffer:Pe,drawBuffers:fe,useProgram:Ge,setBlending:Ue,setMaterial:et,setFlipSided:Ne,setCullFace:Ye,setLineWidth:Se,setPolygonOffset:we,setScissorTest:Ee,activeTexture:ze,bindTexture:D,unbindTexture:lt,compressedTexImage2D:Je,compressedTexImage3D:T,texImage2D:J,texImage3D:ee,pixelStorei:Ae,getParameter:re,updateUBOMapping:Re,uniformBlockBinding:De,texStorage2D:ne,texStorage3D:se,texSubImage2D:_,texSubImage3D:B,compressedTexSubImage2D:V,compressedTexSubImage3D:Z,scissor:he,viewport:ae,reset:Ve}}function ea(n,e,t,i){const s=dc(i);switch(t){case 1021:return n*e;case 1028:return n*e/s.components*s.byteLength;case 1029:return n*e/s.components*s.byteLength;case 1030:return n*e*2/s.components*s.byteLength;case 1031:return n*e*2/s.components*s.byteLength;case 1022:return n*e*3/s.components*s.byteLength;case 1023:return n*e*4/s.components*s.byteLength;case 1033:return n*e*4/s.components*s.byteLength;case 33776:case 33777:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(n,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(n,8)*Math.max(e,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(n/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(n/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function dc(n){switch(n){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}function uc(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new $e,d=new WeakMap,u=new Set;let h;const m=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(T,_){return g?new OffscreenCanvas(T,_):xn("canvas")}function p(T,_,B){let V=1;const Z=Je(T);if((Z.width>B||Z.height>B)&&(V=B/Math.max(Z.width,Z.height)),V<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const ne=Math.floor(V*Z.width),se=Math.floor(V*Z.height);h===void 0&&(h=y(ne,se));const J=_?y(ne,se):h;return J.width=ne,J.height=se,J.getContext("2d").drawImage(T,0,0,ne,se),Be("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+ne+"x"+se+")."),J}else return"data"in T&&Be("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),T;return T}function f(T){return T.generateMipmaps}function A(T){n.generateMipmap(T)}function w(T){return T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?n.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(T,_,B,V,Z,ne=!1){if(T!==null){if(n[T]!==void 0)return n[T];Be("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let se;V&&(se=e.get("EXT_texture_norm16"),se||Be("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=_;if(_===n.RED&&(B===n.FLOAT&&(J=n.R32F),B===n.HALF_FLOAT&&(J=n.R16F),B===n.UNSIGNED_BYTE&&(J=n.R8),B===n.UNSIGNED_SHORT&&se&&(J=se.R16_EXT),B===n.SHORT&&se&&(J=se.R16_SNORM_EXT)),_===n.RED_INTEGER&&(B===n.UNSIGNED_BYTE&&(J=n.R8UI),B===n.UNSIGNED_SHORT&&(J=n.R16UI),B===n.UNSIGNED_INT&&(J=n.R32UI),B===n.BYTE&&(J=n.R8I),B===n.SHORT&&(J=n.R16I),B===n.INT&&(J=n.R32I)),_===n.RG&&(B===n.FLOAT&&(J=n.RG32F),B===n.HALF_FLOAT&&(J=n.RG16F),B===n.UNSIGNED_BYTE&&(J=n.RG8),B===n.UNSIGNED_SHORT&&se&&(J=se.RG16_EXT),B===n.SHORT&&se&&(J=se.RG16_SNORM_EXT)),_===n.RG_INTEGER&&(B===n.UNSIGNED_BYTE&&(J=n.RG8UI),B===n.UNSIGNED_SHORT&&(J=n.RG16UI),B===n.UNSIGNED_INT&&(J=n.RG32UI),B===n.BYTE&&(J=n.RG8I),B===n.SHORT&&(J=n.RG16I),B===n.INT&&(J=n.RG32I)),_===n.RGB_INTEGER&&(B===n.UNSIGNED_BYTE&&(J=n.RGB8UI),B===n.UNSIGNED_SHORT&&(J=n.RGB16UI),B===n.UNSIGNED_INT&&(J=n.RGB32UI),B===n.BYTE&&(J=n.RGB8I),B===n.SHORT&&(J=n.RGB16I),B===n.INT&&(J=n.RGB32I)),_===n.RGBA_INTEGER&&(B===n.UNSIGNED_BYTE&&(J=n.RGBA8UI),B===n.UNSIGNED_SHORT&&(J=n.RGBA16UI),B===n.UNSIGNED_INT&&(J=n.RGBA32UI),B===n.BYTE&&(J=n.RGBA8I),B===n.SHORT&&(J=n.RGBA16I),B===n.INT&&(J=n.RGBA32I)),_===n.RGB&&(B===n.UNSIGNED_SHORT&&se&&(J=se.RGB16_EXT),B===n.SHORT&&se&&(J=se.RGB16_SNORM_EXT),B===n.UNSIGNED_INT_5_9_9_9_REV&&(J=n.RGB9_E5),B===n.UNSIGNED_INT_10F_11F_11F_REV&&(J=n.R11F_G11F_B10F)),_===n.RGBA){const ee=ne?mn:Ze.getTransfer(Z);B===n.FLOAT&&(J=n.RGBA32F),B===n.HALF_FLOAT&&(J=n.RGBA16F),B===n.UNSIGNED_BYTE&&(J=ee===st?n.SRGB8_ALPHA8:n.RGBA8),B===n.UNSIGNED_SHORT&&se&&(J=se.RGBA16_EXT),B===n.SHORT&&se&&(J=se.RGBA16_SNORM_EXT),B===n.UNSIGNED_SHORT_4_4_4_4&&(J=n.RGBA4),B===n.UNSIGNED_SHORT_5_5_5_1&&(J=n.RGB5_A1)}return(J===n.R16F||J===n.R32F||J===n.RG16F||J===n.RG32F||J===n.RGBA16F||J===n.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function M(T,_){let B;return T?_===null||_===1014||_===1020?B=n.DEPTH24_STENCIL8:_===1015?B=n.DEPTH32F_STENCIL8:_===1012&&(B=n.DEPTH24_STENCIL8,Be("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===1014||_===1020?B=n.DEPTH_COMPONENT24:_===1015?B=n.DEPTH_COMPONENT32F:_===1012&&(B=n.DEPTH_COMPONENT16),B}function b(T,_){return f(T)===!0||T.isFramebufferTexture&&T.minFilter!==1003&&T.minFilter!==1006?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function R(T){const _=T.target;_.removeEventListener("dispose",R),E(_),_.isVideoTexture&&d.delete(_),_.isHTMLTexture&&u.delete(_)}function x(T){const _=T.target;_.removeEventListener("dispose",x),I(_)}function E(T){const _=i.get(T);if(_.__webglInit===void 0)return;const B=T.source,V=m.get(B);if(V){const Z=V[_.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&C(T),Object.keys(V).length===0&&m.delete(B)}i.remove(T)}function C(T){const _=i.get(T);n.deleteTexture(_.__webglTexture);const B=T.source,V=m.get(B);delete V[_.__cacheKey],a.memory.textures--}function I(T){const _=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(_.__webglFramebuffer[V]))for(let Z=0;Z<_.__webglFramebuffer[V].length;Z++)n.deleteFramebuffer(_.__webglFramebuffer[V][Z]);else n.deleteFramebuffer(_.__webglFramebuffer[V]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[V])}else{if(Array.isArray(_.__webglFramebuffer))for(let V=0;V<_.__webglFramebuffer.length;V++)n.deleteFramebuffer(_.__webglFramebuffer[V]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let V=0;V<_.__webglColorRenderbuffer.length;V++)_.__webglColorRenderbuffer[V]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[V]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const B=T.textures;for(let V=0,Z=B.length;V<Z;V++){const ne=i.get(B[V]);ne.__webglTexture&&(n.deleteTexture(ne.__webglTexture),a.memory.textures--),i.remove(B[V])}i.remove(T)}let U=0;function O(){U=0}function P(){return U}function N(T){U=T}function k(){const T=U;return T>=s.maxTextures&&Be("WebGLTextures: Trying to use "+(T+1)+" texture units while this GPU supports only "+s.maxTextures),U+=1,T}function X(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function te(T,_){const B=i.get(T);if(T.isVideoTexture&&D(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&B.__version!==T.version){const V=T.image;if(V===null)Be("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)Be("WebGLRenderer: Texture marked for update but image is incomplete");else{_e(B,T,_);return}}else T.isExternalTexture&&(B.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,B.__webglTexture,n.TEXTURE0+_)}function W(T,_){const B=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){_e(B,T,_);return}else T.isExternalTexture&&(B.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,B.__webglTexture,n.TEXTURE0+_)}function $(T,_){const B=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){_e(B,T,_);return}t.bindTexture(n.TEXTURE_3D,B.__webglTexture,n.TEXTURE0+_)}function j(T,_){const B=i.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&B.__version!==T.version){Pe(B,T,_);return}t.bindTexture(n.TEXTURE_CUBE_MAP,B.__webglTexture,n.TEXTURE0+_)}const ve={1e3:n.REPEAT,1001:n.CLAMP_TO_EDGE,1002:n.MIRRORED_REPEAT},xe={1003:n.NEAREST,1004:n.NEAREST_MIPMAP_NEAREST,1005:n.NEAREST_MIPMAP_LINEAR,1006:n.LINEAR,1007:n.LINEAR_MIPMAP_NEAREST,1008:n.LINEAR_MIPMAP_LINEAR},Xe={512:n.NEVER,519:n.ALWAYS,513:n.LESS,515:n.LEQUAL,514:n.EQUAL,518:n.GEQUAL,516:n.GREATER,517:n.NOTEQUAL};function Le(T,_){if(_.type===1015&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===1006||_.magFilter===1007||_.magFilter===1005||_.magFilter===1008||_.minFilter===1006||_.minFilter===1007||_.minFilter===1005||_.minFilter===1008)&&Be("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,ve[_.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,ve[_.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,ve[_.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,xe[_.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,xe[_.minFilter]),_.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,Xe[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===1003||_.minFilter!==1005&&_.minFilter!==1008||_.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");n.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function ke(T,_){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",R));const V=_.source;let Z=m.get(V);Z===void 0&&(Z={},m.set(V,Z));const ne=X(_);if(ne!==T.__cacheKey){Z[ne]===void 0&&(Z[ne]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,B=!0),Z[ne].usedTimes++;const se=Z[T.__cacheKey];se!==void 0&&(Z[T.__cacheKey].usedTimes--,se.usedTimes===0&&C(_)),T.__cacheKey=ne,T.__webglTexture=Z[ne].texture}return B}function Y(T,_,B){return Math.floor(Math.floor(T/B)/_)}function K(T,_,B,V){const ne=T.updateRanges;if(ne.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,_.width,_.height,B,V,_.data);else{ne.sort((Ae,he)=>Ae.start-he.start);let se=0;for(let Ae=1;Ae<ne.length;Ae++){const he=ne[se],ae=ne[Ae],Re=he.start+he.count,De=Y(ae.start,_.width,4),Ve=Y(he.start,_.width,4);ae.start<=Re+1&&De===Ve&&Y(ae.start+ae.count-1,_.width,4)===De?he.count=Math.max(he.count,ae.start+ae.count-he.start):(++se,ne[se]=ae)}ne.length=se+1;const J=t.getParameter(n.UNPACK_ROW_LENGTH),ee=t.getParameter(n.UNPACK_SKIP_PIXELS),re=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,_.width);for(let Ae=0,he=ne.length;Ae<he;Ae++){const ae=ne[Ae],Re=Math.floor(ae.start/4),De=Math.ceil(ae.count/4),Ve=Re%_.width,F=Math.floor(Re/_.width),oe=De,Q=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Ve),t.pixelStorei(n.UNPACK_SKIP_ROWS,F),t.texSubImage2D(n.TEXTURE_2D,0,Ve,F,oe,Q,B,V,_.data)}T.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,J),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(n.UNPACK_SKIP_ROWS,re)}}function _e(T,_,B){let V=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(V=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(V=n.TEXTURE_3D);const Z=ke(T,_),ne=_.source;t.bindTexture(V,T.__webglTexture,n.TEXTURE0+B);const se=i.get(ne);if(ne.version!==se.__version||Z===!0){if(t.activeTexture(n.TEXTURE0+B),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const Q=Ze.getPrimaries(Ze.workingColorSpace),le=_.colorSpace===""?null:Ze.getPrimaries(_.colorSpace),pe=_.colorSpace===""||Q===le?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}t.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment);let ee=p(_.image,!1,s.maxTextureSize);ee=lt(_,ee);const re=r.convert(_.format,_.colorSpace),Ae=r.convert(_.type);let he=S(_.internalFormat,re,Ae,_.normalized,_.colorSpace,_.isVideoTexture);Le(V,_);let ae;const Re=_.mipmaps,De=_.isVideoTexture!==!0,Ve=se.__version===void 0||Z===!0,F=ne.dataReady,oe=b(_,ee);if(_.isDepthTexture)he=M(_.format===1027,_.type),Ve&&(De?t.texStorage2D(n.TEXTURE_2D,1,he,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,he,ee.width,ee.height,0,re,Ae,null));else if(_.isDataTexture)if(Re.length>0){De&&Ve&&t.texStorage2D(n.TEXTURE_2D,oe,he,Re[0].width,Re[0].height);for(let Q=0,le=Re.length;Q<le;Q++)ae=Re[Q],De?F&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,ae.width,ae.height,re,Ae,ae.data):t.texImage2D(n.TEXTURE_2D,Q,he,ae.width,ae.height,0,re,Ae,ae.data);_.generateMipmaps=!1}else De?(Ve&&t.texStorage2D(n.TEXTURE_2D,oe,he,ee.width,ee.height),F&&K(_,ee,re,Ae)):t.texImage2D(n.TEXTURE_2D,0,he,ee.width,ee.height,0,re,Ae,ee.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){De&&Ve&&t.texStorage3D(n.TEXTURE_2D_ARRAY,oe,he,Re[0].width,Re[0].height,ee.depth);for(let Q=0,le=Re.length;Q<le;Q++)if(ae=Re[Q],_.format!==1023)if(re!==null)if(De){if(F)if(_.layerUpdates.size>0){const pe=ea(ae.width,ae.height,_.format,_.type);for(const ie of _.layerUpdates){const Ce=ae.data.subarray(ie*pe/ae.data.BYTES_PER_ELEMENT,(ie+1)*pe/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,ie,ae.width,ae.height,1,re,Ce)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ae.width,ae.height,ee.depth,re,ae.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,he,ae.width,ae.height,ee.depth,0,ae.data,0,0);else Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?F&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ae.width,ae.height,ee.depth,re,Ae,ae.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Q,he,ae.width,ae.height,ee.depth,0,re,Ae,ae.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{De&&Ve&&t.texStorage2D(n.TEXTURE_2D,oe,he,Re[0].width,Re[0].height);for(let Q=0,le=Re.length;Q<le;Q++)ae=Re[Q],_.format!==1023?re!==null?De?F&&t.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,ae.width,ae.height,re,ae.data):t.compressedTexImage2D(n.TEXTURE_2D,Q,he,ae.width,ae.height,0,ae.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?F&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,ae.width,ae.height,re,Ae,ae.data):t.texImage2D(n.TEXTURE_2D,Q,he,ae.width,ae.height,0,re,Ae,ae.data)}else if(_.isDataArrayTexture)if(De){if(Ve&&t.texStorage3D(n.TEXTURE_2D_ARRAY,oe,he,ee.width,ee.height,ee.depth),F)if(_.layerUpdates.size>0){const Q=ea(ee.width,ee.height,_.format,_.type);for(const le of _.layerUpdates){const pe=ee.data.subarray(le*Q/ee.data.BYTES_PER_ELEMENT,(le+1)*Q/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,le,ee.width,ee.height,1,re,Ae,pe)}_.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,re,Ae,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,he,ee.width,ee.height,ee.depth,0,re,Ae,ee.data);else if(_.isData3DTexture)De?(Ve&&t.texStorage3D(n.TEXTURE_3D,oe,he,ee.width,ee.height,ee.depth),F&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,re,Ae,ee.data)):t.texImage3D(n.TEXTURE_3D,0,he,ee.width,ee.height,ee.depth,0,re,Ae,ee.data);else if(_.isFramebufferTexture){if(Ve)if(De)t.texStorage2D(n.TEXTURE_2D,oe,he,ee.width,ee.height);else{let Q=ee.width,le=ee.height;for(let pe=0;pe<oe;pe++)t.texImage2D(n.TEXTURE_2D,pe,he,Q,le,0,re,Ae,null),Q>>=1,le>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in n){const Q=n.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),ee.parentNode!==Q){Q.appendChild(ee),u.add(_),Q.onpaint=le=>{const pe=le.changedElements;for(const ie of u)pe.includes(ie.image)&&(ie.needsUpdate=!0)},Q.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,ee);else{const pe=n.RGBA,ie=n.RGBA,Ce=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,pe,ie,Ce,ee)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Re.length>0){if(De&&Ve){const Q=Je(Re[0]);t.texStorage2D(n.TEXTURE_2D,oe,he,Q.width,Q.height)}for(let Q=0,le=Re.length;Q<le;Q++)ae=Re[Q],De?F&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,re,Ae,ae):t.texImage2D(n.TEXTURE_2D,Q,he,re,Ae,ae);_.generateMipmaps=!1}else if(De){if(Ve){const Q=Je(ee);t.texStorage2D(n.TEXTURE_2D,oe,he,Q.width,Q.height)}F&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,re,Ae,ee)}else t.texImage2D(n.TEXTURE_2D,0,he,re,Ae,ee);f(_)&&A(V),se.__version=ne.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Pe(T,_,B){if(_.image.length!==6)return;const V=ke(T,_),Z=_.source;t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+B);const ne=i.get(Z);if(Z.version!==ne.__version||V===!0){t.activeTexture(n.TEXTURE0+B);const se=Ze.getPrimaries(Ze.workingColorSpace),J=_.colorSpace===""?null:Ze.getPrimaries(_.colorSpace),ee=_.colorSpace===""||se===J?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);const re=_.isCompressedTexture||_.image[0].isCompressedTexture,Ae=_.image[0]&&_.image[0].isDataTexture,he=[];for(let ie=0;ie<6;ie++)!re&&!Ae?he[ie]=p(_.image[ie],!0,s.maxCubemapSize):he[ie]=Ae?_.image[ie].image:_.image[ie],he[ie]=lt(_,he[ie]);const ae=he[0],Re=r.convert(_.format,_.colorSpace),De=r.convert(_.type),Ve=S(_.internalFormat,Re,De,_.normalized,_.colorSpace),F=_.isVideoTexture!==!0,oe=ne.__version===void 0||V===!0,Q=Z.dataReady;let le=b(_,ae);Le(n.TEXTURE_CUBE_MAP,_);let pe;if(re){F&&oe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,le,Ve,ae.width,ae.height);for(let ie=0;ie<6;ie++){pe=he[ie].mipmaps;for(let Ce=0;Ce<pe.length;Ce++){const be=pe[Ce];_.format!==1023?Re!==null?F?Q&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,0,0,be.width,be.height,Re,be.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,Ve,be.width,be.height,0,be.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,0,0,be.width,be.height,Re,De,be.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce,Ve,be.width,be.height,0,Re,De,be.data)}}}else{if(pe=_.mipmaps,F&&oe){pe.length>0&&le++;const ie=Je(he[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,le,Ve,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(Ae){F?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,he[ie].width,he[ie].height,Re,De,he[ie].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Ve,he[ie].width,he[ie].height,0,Re,De,he[ie].data);for(let Ce=0;Ce<pe.length;Ce++){const ct=pe[Ce].image[ie].image;F?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,0,0,ct.width,ct.height,Re,De,ct.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,Ve,ct.width,ct.height,0,Re,De,ct.data)}}else{F?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Re,De,he[ie]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Ve,Re,De,he[ie]);for(let Ce=0;Ce<pe.length;Ce++){const be=pe[Ce];F?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,0,0,Re,De,be.image[ie]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ce+1,Ve,Re,De,be.image[ie])}}}f(_)&&A(n.TEXTURE_CUBE_MAP),ne.__version=Z.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function fe(T,_,B,V,Z,ne){const se=r.convert(B.format,B.colorSpace),J=r.convert(B.type),ee=S(B.internalFormat,se,J,B.normalized,B.colorSpace),re=i.get(_),Ae=i.get(B);if(Ae.__renderTarget=_,!re.__hasExternalTextures){const he=Math.max(1,_.width>>ne),ae=Math.max(1,_.height>>ne);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?t.texImage3D(Z,ne,ee,he,ae,_.depth,0,se,J,null):t.texImage2D(Z,ne,ee,he,ae,0,se,J,null)}t.bindFramebuffer(n.FRAMEBUFFER,T),ze(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,V,Z,Ae.__webglTexture,0,Ee(_)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,V,Z,Ae.__webglTexture,ne),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ge(T,_,B){if(n.bindRenderbuffer(n.RENDERBUFFER,T),_.depthBuffer){const V=_.depthTexture,Z=V&&V.isDepthTexture?V.type:null,ne=M(_.stencilBuffer,Z),se=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ze(_)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ee(_),ne,_.width,_.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ee(_),ne,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,ne,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,se,n.RENDERBUFFER,T)}else{const V=_.textures;for(let Z=0;Z<V.length;Z++){const ne=V[Z],se=r.convert(ne.format,ne.colorSpace),J=r.convert(ne.type),ee=S(ne.internalFormat,se,J,ne.normalized,ne.colorSpace);ze(_)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ee(_),ee,_.width,_.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ee(_),ee,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,ee,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ut(T,_,B){const V=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Z=i.get(_.depthTexture);if(Z.__renderTarget=_,(!Z.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),V){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,_.depthTexture.addEventListener("dispose",R)),Z.__webglTexture===void 0){Z.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),Le(n.TEXTURE_CUBE_MAP,_.depthTexture);const re=r.convert(_.depthTexture.format),Ae=r.convert(_.depthTexture.type);let he;_.depthTexture.format===1026?he=n.DEPTH_COMPONENT24:_.depthTexture.format===1027&&(he=n.DEPTH24_STENCIL8);for(let ae=0;ae<6;ae++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,he,_.width,_.height,0,re,Ae,null)}}else te(_.depthTexture,0);const ne=Z.__webglTexture,se=Ee(_),J=V?n.TEXTURE_CUBE_MAP_POSITIVE_X+B:n.TEXTURE_2D,ee=_.depthTexture.format===1027?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(_.depthTexture.format===1026)ze(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,J,ne,0,se):n.framebufferTexture2D(n.FRAMEBUFFER,ee,J,ne,0);else if(_.depthTexture.format===1027)ze(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,J,ne,0,se):n.framebufferTexture2D(n.FRAMEBUFFER,ee,J,ne,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ie(T){const _=i.get(T),B=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const V=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),V){const Z=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,V.removeEventListener("dispose",Z)};V.addEventListener("dispose",Z),_.__depthDisposeCallback=Z}_.__boundDepthTexture=V}if(T.depthTexture&&!_.__autoAllocateDepthBuffer)if(B)for(let V=0;V<6;V++)ut(_.__webglFramebuffer[V],T,V);else{const V=T.texture.mipmaps;V&&V.length>0?ut(_.__webglFramebuffer[0],T,0):ut(_.__webglFramebuffer,T,0)}else if(B){_.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[V]),_.__webglDepthbuffer[V]===void 0)_.__webglDepthbuffer[V]=n.createRenderbuffer(),Ge(_.__webglDepthbuffer[V],T,!1);else{const Z=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=_.__webglDepthbuffer[V];n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,ne)}}else{const V=T.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),Ge(_.__webglDepthbuffer,T,!1);else{const Z=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,ne)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ue(T,_,B){const V=i.get(T);_!==void 0&&fe(V.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),B!==void 0&&Ie(T)}function et(T){const _=T.texture,B=i.get(T),V=i.get(_);T.addEventListener("dispose",x);const Z=T.textures,ne=T.isWebGLCubeRenderTarget===!0,se=Z.length>1;if(se||(V.__webglTexture===void 0&&(V.__webglTexture=n.createTexture()),V.__version=_.version,a.memory.textures++),ne){B.__webglFramebuffer=[];for(let J=0;J<6;J++)if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer[J]=[];for(let ee=0;ee<_.mipmaps.length;ee++)B.__webglFramebuffer[J][ee]=n.createFramebuffer()}else B.__webglFramebuffer[J]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer=[];for(let J=0;J<_.mipmaps.length;J++)B.__webglFramebuffer[J]=n.createFramebuffer()}else B.__webglFramebuffer=n.createFramebuffer();if(se)for(let J=0,ee=Z.length;J<ee;J++){const re=i.get(Z[J]);re.__webglTexture===void 0&&(re.__webglTexture=n.createTexture(),a.memory.textures++)}if(T.samples>0&&ze(T)===!1){B.__webglMultisampledFramebuffer=n.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let J=0;J<Z.length;J++){const ee=Z[J];B.__webglColorRenderbuffer[J]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,B.__webglColorRenderbuffer[J]);const re=r.convert(ee.format,ee.colorSpace),Ae=r.convert(ee.type),he=S(ee.internalFormat,re,Ae,ee.normalized,ee.colorSpace,T.isXRRenderTarget===!0),ae=Ee(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,ae,he,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+J,n.RENDERBUFFER,B.__webglColorRenderbuffer[J])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=n.createRenderbuffer(),Ge(B.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ne){t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture),Le(n.TEXTURE_CUBE_MAP,_);for(let J=0;J<6;J++)if(_.mipmaps&&_.mipmaps.length>0)for(let ee=0;ee<_.mipmaps.length;ee++)fe(B.__webglFramebuffer[J][ee],T,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ee);else fe(B.__webglFramebuffer[J],T,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);f(_)&&A(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){for(let J=0,ee=Z.length;J<ee;J++){const re=Z[J],Ae=i.get(re);let he=n.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(he=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(he,Ae.__webglTexture),Le(he,re),fe(B.__webglFramebuffer,T,re,n.COLOR_ATTACHMENT0+J,he,0),f(re)&&A(he)}t.unbindTexture()}else{let J=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(J=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(J,V.__webglTexture),Le(J,_),_.mipmaps&&_.mipmaps.length>0)for(let ee=0;ee<_.mipmaps.length;ee++)fe(B.__webglFramebuffer[ee],T,_,n.COLOR_ATTACHMENT0,J,ee);else fe(B.__webglFramebuffer,T,_,n.COLOR_ATTACHMENT0,J,0);f(_)&&A(J),t.unbindTexture()}T.depthBuffer&&Ie(T)}function Ne(T){const _=T.textures;for(let B=0,V=_.length;B<V;B++){const Z=_[B];if(f(Z)){const ne=w(T),se=i.get(Z).__webglTexture;t.bindTexture(ne,se),A(ne),t.unbindTexture()}}}const Ye=[],Se=[];function we(T){if(T.samples>0){if(ze(T)===!1){const _=T.textures,B=T.width,V=T.height;let Z=n.COLOR_BUFFER_BIT;const ne=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,se=i.get(T),J=_.length>1;if(J)for(let re=0;re<_.length;re++)t.bindFramebuffer(n.FRAMEBUFFER,se.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,se.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer);const ee=T.texture.mipmaps;ee&&ee.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,se.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let re=0;re<_.length;re++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),J){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,se.__webglColorRenderbuffer[re]);const Ae=i.get(_[re]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ae,0)}n.blitFramebuffer(0,0,B,V,0,0,B,V,Z,n.NEAREST),c===!0&&(Ye.length=0,Se.length=0,Ye.push(n.COLOR_ATTACHMENT0+re),T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&(Ye.push(ne),Se.push(ne),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Se)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ye))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),J)for(let re=0;re<_.length;re++){t.bindFramebuffer(n.FRAMEBUFFER,se.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.RENDERBUFFER,se.__webglColorRenderbuffer[re]);const Ae=i.get(_[re]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,se.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.TEXTURE_2D,Ae,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&c){const _=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function Ee(T){return Math.min(s.maxSamples,T.samples)}function ze(T){const _=i.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function D(T){const _=a.render.frame;d.get(T)!==_&&(d.set(T,_),T.update())}function lt(T,_){const B=T.colorSpace,V=T.format,Z=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==_n&&B!==""&&(Ze.getTransfer(B)===st?(V!==1023||Z!==1009)&&Be("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):je("WebGLTextures: Unsupported texture color space:",B)),_}function Je(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=O,this.getTextureUnits=P,this.setTextureUnits=N,this.setTexture2D=te,this.setTexture2DArray=W,this.setTexture3D=$,this.setTextureCube=j,this.rebindTextures=Ue,this.setupRenderTarget=et,this.updateRenderTargetMipmap=Ne,this.updateMultisampleRenderTarget=we,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=ze,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function pc(n,e){function t(i,s=""){let r;const a=Ze.getTransfer(s);if(i===1009)return n.UNSIGNED_BYTE;if(i===1017)return n.UNSIGNED_SHORT_4_4_4_4;if(i===1018)return n.UNSIGNED_SHORT_5_5_5_1;if(i===35902)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===35899)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===1010)return n.BYTE;if(i===1011)return n.SHORT;if(i===1012)return n.UNSIGNED_SHORT;if(i===1013)return n.INT;if(i===1014)return n.UNSIGNED_INT;if(i===1015)return n.FLOAT;if(i===1016)return n.HALF_FLOAT;if(i===1021)return n.ALPHA;if(i===1022)return n.RGB;if(i===1023)return n.RGBA;if(i===1026)return n.DEPTH_COMPONENT;if(i===1027)return n.DEPTH_STENCIL;if(i===1028)return n.RED;if(i===1029)return n.RED_INTEGER;if(i===1030)return n.RG;if(i===1031)return n.RG_INTEGER;if(i===1033)return n.RGBA_INTEGER;if(i===33776||i===33777||i===33778||i===33779)if(a===st)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===33776)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===33777)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===33778)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===33779)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===33776)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===33777)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===33778)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===33779)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===35840||i===35841||i===35842||i===35843)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===35840)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===35841)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===35842)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===35843)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===36196||i===37492||i===37496||i===37488||i===37489||i===37490||i===37491)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===36196||i===37492)return a===st?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===37496)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===37488)return r.COMPRESSED_R11_EAC;if(i===37489)return r.COMPRESSED_SIGNED_R11_EAC;if(i===37490)return r.COMPRESSED_RG11_EAC;if(i===37491)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===37808||i===37809||i===37810||i===37811||i===37812||i===37813||i===37814||i===37815||i===37816||i===37817||i===37818||i===37819||i===37820||i===37821)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===37808)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===37809)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===37810)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===37811)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===37812)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===37813)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===37814)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===37815)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===37816)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===37817)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===37818)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===37819)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===37820)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===37821)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===36492||i===36494||i===36495)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===36492)return a===st?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===36494)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===36495)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===36283||i===36284||i===36285||i===36286)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===36283)return r.COMPRESSED_RED_RGTC1_EXT;if(i===36284)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===36285)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===36286)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===1020?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class _c extends Ht{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Wn extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const mc={type:"move"};class Fs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const y of e.hand.values()){const p=t.getJointPose(y,i),f=this._getHandJoint(l,y);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=d.position.distanceTo(u.position),m=.02,g=.005;l.inputState.pinching&&h>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(mc)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Wn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class ta extends wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}const xc=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gc=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class vc{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new ta(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Kt({vertexShader:xc,fragmentShader:gc,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Vt(new an(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Sc extends vi{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,u=null,h=null,m=null,g=null;const y=typeof XRWebGLBinding<"u",p=new vc,f={},A=t.getContextAttributes();let w=null,S=null;const M=[],b=[],R=new $e;let x=null,E=null;const C=new Ht;C.viewport=new dt;const I=new Ht;I.viewport=new dt;const U=[C,I],O=new _c;let P=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=M[Y];return K===void 0&&(K=new Fs,M[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=M[Y];return K===void 0&&(K=new Fs,M[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=M[Y];return K===void 0&&(K=new Fs,M[Y]=K),K.getHandSpace()};function k(Y){const K=b.indexOf(Y.inputSource);if(K===-1)return;const _e=M[K];_e!==void 0&&(_e.update(Y.inputSource,Y.frame,l||a),_e.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",te);for(let Y=0;Y<M.length;Y++){const K=b[Y];K!==null&&(b[Y]=null,M[Y].disconnect(K))}P=null,N=null,p.reset();for(const Y in f)delete f[Y];if(e.setRenderTarget(w),m=null,h=null,u=null,s=null,S=null,ke.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(R.width,R.height,!1),E!==null){const Y=E.camera;Y.fov=E.fov,Y.zoom=E.zoom,Y.updateProjectionMatrix(),E=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&Be("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&Be("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return u===null&&y&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",X),s.addEventListener("inputsourceschange",te),A.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(R),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,Pe=null,fe=null;A.depth&&(fe=A.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=A.stencil?1027:1026,Pe=A.stencil?1020:1014);const Ge={colorFormat:t.RGBA8,depthFormat:fe,scaleFactor:r};u=this.getBinding(),h=u.createProjectionLayer(Ge),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),S=new Nt(h.textureWidth,h.textureHeight,{format:1023,type:1009,depthTexture:new hn(h.textureWidth,h.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:A.stencil,colorSpace:e.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const _e={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,_e),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),S=new Nt(m.framebufferWidth,m.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1,storeMultisampledDepthBuffer:m.ignoreDepthValues===!1,storeMultisampledStencilBuffer:m.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),ke.setContext(s),ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function te(Y){for(let K=0;K<Y.removed.length;K++){const _e=Y.removed[K],Pe=b.indexOf(_e);Pe>=0&&(b[Pe]=null,M[Pe].disconnect(_e))}for(let K=0;K<Y.added.length;K++){const _e=Y.added[K];let Pe=b.indexOf(_e);if(Pe===-1){for(let Ge=0;Ge<M.length;Ge++)if(Ge>=b.length){b.push(_e),Pe=Ge;break}else if(b[Ge]===null){b[Ge]=_e,Pe=Ge;break}if(Pe===-1)break}const fe=M[Pe];fe&&fe.connect(_e)}}const W=new H,$=new H;function j(Y,K,_e){W.setFromMatrixPosition(K.matrixWorld),$.setFromMatrixPosition(_e.matrixWorld);const Pe=W.distanceTo($),fe=K.projectionMatrix.elements,Ge=_e.projectionMatrix.elements,ut=fe[14]/(fe[10]-1),Ie=fe[14]/(fe[10]+1),Ue=(fe[9]+1)/fe[5],et=(fe[9]-1)/fe[5],Ne=(fe[8]-1)/fe[0],Ye=(Ge[8]+1)/Ge[0],Se=ut*Ne,we=ut*Ye,Ee=Pe/(-Ne+Ye),ze=Ee*-Ne;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ze),Y.translateZ(Ee),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),fe[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const D=ut+Ee,lt=Ie+Ee,Je=Se-ze,T=we+(Pe-ze),_=Ue*Ie/lt*D,B=et*Ie/lt*D;Y.projectionMatrix.makePerspective(Je,T,_,B,D,lt),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ve(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let K=Y.near,_e=Y.far;p.texture!==null&&(p.depthNear>0&&(K=p.depthNear),p.depthFar>0&&(_e=p.depthFar)),O.near=I.near=C.near=K,O.far=I.far=C.far=_e,(P!==O.near||N!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),P=O.near,N=O.far),O.layers.mask=Y.layers.mask|6,C.layers.mask=O.layers.mask&-5,I.layers.mask=O.layers.mask&-3;const Pe=Y.parent,fe=O.cameras;ve(O,Pe);for(let Ge=0;Ge<fe.length;Ge++)ve(fe[Ge],Pe);fe.length===2?j(O,C,I):O.projectionMatrix.copy(C.projectionMatrix),E===null&&Y.isPerspectiveCamera&&(E={camera:Y,fov:Y.fov,zoom:Y.zoom}),xe(Y,O,Pe)};function xe(Y,K,_e){_e===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(_e.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=ts*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(h===null&&m===null))return c},this.setFoveation=function(Y){c=Y,h!==null&&(h.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(O)},this.getCameraTexture=function(Y){return f[Y]};let Xe=null;function Le(Y,K){if(d=K.getViewerPose(l||a),g=K,d!==null){const _e=d.views;m!==null&&(e.setRenderTargetFramebuffer(S,m.framebuffer),e.setRenderTarget(S));let Pe=!1;_e.length!==O.cameras.length&&(O.cameras.length=0,Pe=!0);for(let Ie=0;Ie<_e.length;Ie++){const Ue=_e[Ie];let et=null;if(m!==null)et=m.getViewport(Ue);else{const Ye=u.getViewSubImage(h,Ue);et=Ye.viewport,Ie===0&&(e.setRenderTargetTextures(S,Ye.colorTexture,Ye.depthStencilTexture),e.setRenderTarget(S))}let Ne=U[Ie];Ne===void 0&&(Ne=new Ht,Ne.layers.enable(Ie),Ne.viewport=new dt,U[Ie]=Ne),Ne.matrix.fromArray(Ue.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(Ue.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(et.x,et.y,et.width,et.height),Ie===0&&(O.matrix.copy(Ne.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Pe===!0&&O.cameras.push(Ne)}const fe=s.enabledFeatures;if(fe&&fe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){u=i.getBinding();const Ie=u.getDepthInformation(_e[0]);Ie&&Ie.isValid&&Ie.texture&&p.init(Ie,s.renderState)}if(fe&&fe.includes("camera-access")&&y){e.state.unbindTexture(),u=i.getBinding();for(let Ie=0;Ie<_e.length;Ie++){const Ue=_e[Ie].camera;if(Ue){let et=f[Ue];et||(et=new ta,f[Ue]=et);const Ne=u.getCameraImage(Ue);et.sourceTexture=Ne}}}}for(let _e=0;_e<M.length;_e++){const Pe=b[_e],fe=M[_e];Pe!==null&&fe!==void 0&&fe.update(Pe,K,l||a)}Xe&&Xe(Y,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),g=null}const ke=new Mr;ke.setAnimationLoop(Le),this.setAnimationLoop=function(Y){Xe=Y},this.dispose=function(){}}}const Mc=new _t,ia=new Oe;ia.set(-1,0,0,0,1,0,0,0,1);function yc(n,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function i(p,f){f.color.getRGB(p.fogColor.value,dr(n)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,A,w,S){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(p,f):f.isMeshLambertMaterial?(r(p,f),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(p,f),u(p,f)):f.isMeshPhongMaterial?(r(p,f),d(p,f),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(p,f),h(p,f),f.isMeshPhysicalMaterial&&m(p,f,S)):f.isMeshMatcapMaterial?(r(p,f),g(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),y(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(a(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?c(p,f,A,w):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===1&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===1&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const A=e.get(f),w=A.envMap,S=A.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4(Mc.makeRotationFromEuler(S)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(ia),p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function a(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,A,w){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*A,p.scale.value=w*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function d(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function h(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,A){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===1&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.retroreflectivity>0&&(p.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function y(p,f){const A=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function bc(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,M){const b=M.program;i.uniformBlockBinding(S,b)}function l(S,M){let b=s[S.id];b===void 0&&(p(S),b=d(S),s[S.id]=b,S.addEventListener("dispose",A));const R=M.program;i.updateUBOMapping(S,R);const x=e.render.frame;r[S.id]!==x&&(h(S),r[S.id]=x)}function d(S){const M=u();S.__bindingPointIndex=M;const b=n.createBuffer(),R=S.__size,x=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,R,x),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,b),b}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){const M=s[S.id],b=S.uniforms,R=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let x=0,E=b.length;x<E;x++){const C=b[x];if(Array.isArray(C))for(let I=0,U=C.length;I<U;I++)m(C[I],x,I,R);else m(C,x,0,R)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(S,M,b,R){if(y(S,M,b,R)===!0){const x=S.__offset,E=S.value;if(Array.isArray(E)){let C=0;for(let I=0;I<E.length;I++){const U=E[I],O=f(U);g(U,S.__data,C),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(C+=O.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(E,S.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,x,S.__data)}}function g(S,M,b){typeof S=="number"||typeof S=="boolean"?M[0]=S:S.isMatrix3?(M[0]=S.elements[0],M[1]=S.elements[1],M[2]=S.elements[2],M[3]=0,M[4]=S.elements[3],M[5]=S.elements[4],M[6]=S.elements[5],M[7]=0,M[8]=S.elements[6],M[9]=S.elements[7],M[10]=S.elements[8],M[11]=0):ArrayBuffer.isView(S)?M.set(new S.constructor(S.buffer,S.byteOffset,M.length)):S.toArray(M,b)}function y(S,M,b,R){const x=S.value,E=M+"_"+b;if(R[E]===void 0)return typeof x=="number"||typeof x=="boolean"?R[E]=x:ArrayBuffer.isView(x)?R[E]=x.slice():R[E]=x.clone(),!0;{const C=R[E];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return R[E]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function p(S){const M=S.uniforms;let b=0;const R=16;for(let E=0,C=M.length;E<C;E++){const I=Array.isArray(M[E])?M[E]:[M[E]];for(let U=0,O=I.length;U<O;U++){const P=I[U],N=Array.isArray(P.value)?P.value:[P.value];for(let k=0,X=N.length;k<X;k++){const te=N[k],W=f(te),$=b%R,j=$%W.boundary,ve=$+j;b+=j,ve!==0&&R-ve<W.storage&&(b+=R-ve),P.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=b,b+=W.storage}}}const x=b%R;return x>0&&(b+=R-x),S.__size=b,S.__cache={},this}function f(S){const M={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(M.boundary=4,M.storage=4):S.isVector2?(M.boundary=8,M.storage=8):S.isVector3||S.isColor?(M.boundary=16,M.storage=12):S.isVector4?(M.boundary=16,M.storage=16):S.isMatrix3?(M.boundary=48,M.storage=48):S.isMatrix4?(M.boundary=64,M.storage=64):S.isTexture?Be("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(M.boundary=16,M.storage=S.byteLength):Be("WebGLRenderer: Unsupported uniform value type.",S),M}function A(S){const M=S.target;M.removeEventListener("dispose",A);const b=a.indexOf(M.__bindingPointIndex);a.splice(b,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function w(){for(const S in s)n.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:c,update:l,dispose:w}}const Ec=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Jt=null;function Tc(){return Jt===null&&(Jt=new on(Ec,16,16,1030,1016),Jt.name="DFG_LUT",Jt.minFilter=1006,Jt.magFilter=1006,Jt.wrapS=1001,Jt.wrapT=1001,Jt.generateMipmaps=!1,Jt.needsUpdate=!0),Jt}class Ac{constructor(e={}){const{canvas:t=Ra(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1,outputBufferType:m=1009}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const y=m,p=new Set([1033,1031,1029]),f=new Set([1009,1014,1012,1020,1017,1018]),A=new Uint32Array(4),w=new Int32Array(4),S=new H;let M=null,b=null;const R=[],x=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let I=!1,U=null,O=null,P=null,N=null;this._outputColorSpace=Pt;let k=0,X=0,te=null,W=-1,$=null;const j=new dt,ve=new dt;let xe=null;const Xe=new tt(0);let Le=0,ke=t.width,Y=t.height,K=1,_e=null,Pe=null;const fe=new dt(0,0,ke,Y),Ge=new dt(0,0,ke,Y);let ut=!1;const Ie=new Sr;let Ue=!1,et=!1;const Ne=new _t,Ye=new H,Se=new dt,we={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ee=!1;function ze(){return te===null?K:1}let D=i;function lt(v,L){return t.getContext(v,L)}let Je,T,_,B,V,Z,ne,se,J,ee,re,Ae,he,ae,Re,De,Ve,F,oe,Q,le,pe,ie;try{const v={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r186"),t.addEventListener("webglcontextlost",ct,!1),t.addEventListener("webglcontextrestored",it,!1),t.addEventListener("webglcontextcreationerror",Xt,!1),D===null){const L="webgl2";if(D=lt(L,v),D===null)throw lt(L)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ce()}catch(v){throw t.removeEventListener("webglcontextlost",ct,!1),t.removeEventListener("webglcontextrestored",it,!1),t.removeEventListener("webglcontextcreationerror",Xt,!1),je("WebGLRenderer: "+v.message),v}function Ce(){Je=new go(D),Je.init(),le=new pc(D,Je),T=new ao(D,Je,e,le),_=new fc(D,Je),T.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),O=D.createFramebuffer(),P=D.createFramebuffer(),N=D.createFramebuffer(),B=new Mo(D),V=new Kl,Z=new uc(D,Je,_,V,T,le,B),ne=new xo(C),se=new to(D),pe=new so(D,se),J=new vo(D,se,B,pe),ee=new bo(D,J,se,pe,B),F=new yo(D,T,Z),Re=new oo(V),re=new Yl(C,ne,Je,T,pe,Re),Ae=new yc(C,V),he=new $l,ae=new ic(Je),Ve=new no(C,ne,_,ee,g,c),De=new hc(C,ee,T),ie=new bc(D,B,T,_),oe=new ro(D,Je,B),Q=new So(D,Je,B),B.programs=re.programs,C.capabilities=T,C.extensions=Je,C.properties=V,C.renderLists=he,C.shadowMap=De,C.state=_,C.info=B}y!==1009&&(E=new To(y,t.width,t.height,o,s,r));const be=new Sc(C,D);this.xr=be,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const v=Je.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=Je.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(v){v!==void 0&&(K=v,this.setSize(ke,Y,!1))},this.getSize=function(v){return v.set(ke,Y)},this.setSize=function(v,L,q=!0){if(be.isPresenting){Be("WebGLRenderer: Can't change size while VR device is presenting.");return}ke=v,Y=L,t.width=Math.floor(v*K),t.height=Math.floor(L*K),q===!0&&(t.style.width=v+"px",t.style.height=L+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,v,L)},this.getDrawingBufferSize=function(v){return v.set(ke*K,Y*K).floor()},this.setDrawingBufferSize=function(v,L,q){ke=v,Y=L,K=q,t.width=Math.floor(v*q),t.height=Math.floor(L*q),this.setViewport(0,0,v,L)},this.setEffects=function(v){if(y===1009){je("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let L=0;L<v.length;L++)if(v[L].isOutputPass===!0){Be("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(j)},this.getViewport=function(v){return v.copy(fe)},this.setViewport=function(v,L,q,G){v.isVector4?fe.set(v.x,v.y,v.z,v.w):fe.set(v,L,q,G),_.viewport(j.copy(fe).multiplyScalar(K).round())},this.getScissor=function(v){return v.copy(Ge)},this.setScissor=function(v,L,q,G){v.isVector4?Ge.set(v.x,v.y,v.z,v.w):Ge.set(v,L,q,G),_.scissor(ve.copy(Ge).multiplyScalar(K).round())},this.getScissorTest=function(){return ut},this.setScissorTest=function(v){_.setScissorTest(ut=v)},this.setOpaqueSort=function(v){_e=v},this.setTransparentSort=function(v){Pe=v},this.getClearColor=function(v){return v.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(v=!0,L=!0,q=!0){let G=0;if(v){let z=!1;if(te!==null){const ue=te.texture.format;z=p.has(ue)}if(z){const ue=te.texture.type,ge=f.has(ue),de=Ve.getClearColor(),Me=Ve.getClearAlpha(),Te=de.r,We=de.g,qe=de.b;ge?(A[0]=Te,A[1]=We,A[2]=qe,A[3]=Me,D.clearBufferuiv(D.COLOR,0,A)):(w[0]=Te,w[1]=We,w[2]=qe,w[3]=Me,D.clearBufferiv(D.COLOR,0,w))}else G|=D.COLOR_BUFFER_BIT}L&&(G|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(G|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&D.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),U=v},this.dispose=function(){t.removeEventListener("webglcontextlost",ct,!1),t.removeEventListener("webglcontextrestored",it,!1),t.removeEventListener("webglcontextcreationerror",Xt,!1),Ve.dispose(),he.dispose(),ae.dispose(),V.dispose(),ne.dispose(),ee.dispose(),pe.dispose(),ie.dispose(),re.dispose(),be.dispose(),be.removeEventListener("sessionstart",xa),be.removeEventListener("sessionend",ga),Ci.stop()};function ct(v){v.preventDefault(),Zs("WebGLRenderer: Context Lost."),I=!0}function it(){Zs("WebGLRenderer: Context Restored."),I=!1;const v=B.autoReset,L=De.enabled,q=De.autoUpdate,G=De.needsUpdate,z=De.type;Ce(),B.autoReset=v,De.enabled=L,De.autoUpdate=q,De.needsUpdate=G,De.type=z}function Xt(v){je("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function jt(v){const L=v.target;L.removeEventListener("dispose",jt),Sh(L)}function Sh(v){Mh(v),V.remove(v)}function Mh(v){const L=V.get(v).programs;L!==void 0&&(L.forEach(function(q){re.releaseProgram(q)}),v.isShaderMaterial&&re.releaseShaderCache(v))}this.renderBufferDirect=function(v,L,q,G,z,ue){L===null&&(L=we);const ge=z.isMesh&&z.matrixWorld.determinantAffine()<0,de=Eh(v,L,q,G,z);_.setMaterial(G,ge);let Me=q.index,Te=1;if(G.wireframe===!0){if(Me=J.getWireframeAttribute(q),Me===void 0)return;Te=2}const We=q.drawRange,qe=q.attributes.position;let ye=We.start*Te,nt=(We.start+We.count)*Te;ue!==null&&(ye=Math.max(ye,ue.start*Te),nt=Math.min(nt,(ue.start+ue.count)*Te)),Me!==null?(ye=Math.max(ye,0),nt=Math.min(nt,Me.count)):qe!=null&&(ye=Math.max(ye,0),nt=Math.min(nt,qe.count));const vt=nt-ye;if(vt<0||vt===1/0)return;pe.setup(z,G,de,q,Me);let ft,ot=oe;if(Me!==null&&(ft=se.get(Me),ot=Q,ot.setIndex(ft)),z.isMesh)G.wireframe===!0?(_.setLineWidth(G.wireframeLinewidth*ze()),ot.setMode(D.LINES)):ot.setMode(D.TRIANGLES);else if(z.isLine){let At=G.linewidth;At===void 0&&(At=1),_.setLineWidth(At*ze()),z.isLineSegments?ot.setMode(D.LINES):z.isLineLoop?ot.setMode(D.LINE_LOOP):ot.setMode(D.LINE_STRIP)}else z.isPoints?ot.setMode(D.POINTS):z.isSprite&&ot.setMode(D.TRIANGLES);if(z.isBatchedMesh)if(Je.get("WEBGL_multi_draw"))ot.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const At=z._multiDrawStarts,me=z._multiDrawCounts,Ct=z._multiDrawCount,Qe=Me?se.get(Me).bytesPerElement:1,Bt=V.get(G).currentProgram.getUniforms();for(let ei=0;ei<Ct;ei++)Bt.setValue(D,"_gl_DrawID",ei),ot.render(At[ei]/Qe,me[ei])}else if(z.isInstancedMesh)ot.renderInstances(ye,vt,z.count);else if(q.isInstancedBufferGeometry){const At=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,me=Math.min(q.instanceCount,At);ot.renderInstances(ye,vt,me)}else ot.render(ye,vt)};function ma(v,L,q,G){U!==null&&v.isNodeMaterial&&U.setObject(G,v),Ue===!0&&Re.setState(v,q,!1),v.transparent===!0&&v.side===2&&v.forceSinglePass===!1?(v.side=1,v.needsUpdate=!0,Jn(v,L,G),v.side=0,v.needsUpdate=!0,Jn(v,L,G),v.side=2):Jn(v,L,G)}this.compile=function(v,L,q=null){q===null&&(q=v),U!==null&&U.renderStart(v,L,q),b=ae.get(q),b.init(L),x.push(b),q.traverseVisible(function(z){z.isLight&&z.layers.test(L.layers)&&(b.pushLight(z),z.castShadow&&b.pushShadow(z))}),v!==q&&v.traverseVisible(function(z){z.isLight&&z.layers.test(L.layers)&&(b.pushLight(z),z.castShadow&&b.pushShadow(z))}),b.setupLights(),U!==null&&U.updateLights(b.state.lightsArray),et=this.localClippingEnabled,Ue=Re.init(this.clippingPlanes,et),Ue===!0&&Re.setGlobalState(this.clippingPlanes,L),U!==null&&De.render(b.state.shadowsArray,q,L);const G=new Set;return v.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const ue=z.material;if(ue)if(Array.isArray(ue))for(let ge=0;ge<ue.length;ge++){const de=ue[ge];ma(de,q,L,z),G.add(de)}else ma(ue,q,L,z),G.add(ue)}),b=x.pop(),U!==null&&U.renderEnd(),G},this.compileAsync=function(v,L,q=null){const G=this.compile(v,L,q);return new Promise(z=>{function ue(){if(G.forEach(function(ge){const Me=V.get(ge).currentProgram;(Me===void 0||Me.isReady())&&G.delete(ge)}),G.size===0){z(v);return}setTimeout(ue,10)}Je.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let qs=null;function yh(v){qs&&qs(v)}function xa(){Ci.stop()}function ga(){Ci.start()}const Ci=new Mr;Ci.setAnimationLoop(yh),typeof self<"u"&&Ci.setContext(self),this.setAnimationLoop=function(v){qs=v,be.setAnimationLoop(v),v===null?Ci.stop():Ci.start()},be.addEventListener("sessionstart",xa),be.addEventListener("sessionend",ga),this.render=function(v,L){if(L!==void 0&&L.isCamera!==!0){je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;U!==null&&U.renderStart(v,L);const q=be.enabled===!0&&be.isPresenting===!0,G=E!==null&&(te===null||q)&&E.begin(C,te);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),be.enabled===!0&&be.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(be.cameraAutoUpdate===!0&&be.updateCamera(L),L=be.getCamera()),v.isScene===!0&&v.onBeforeRender(C,v,L,te),b=ae.get(v,x.length),b.init(L),b.state.textureUnits=Z.getTextureUnits(),x.push(b),Ne.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),Ie.setFromProjectionMatrix(Ne,2e3,L.reversedDepth),et=this.localClippingEnabled,Ue=Re.init(this.clippingPlanes,et),M=he.get(v,R.length),M.init(),R.push(M),be.enabled===!0&&be.isPresenting===!0){const ge=C.xr.getDepthSensingMesh();ge!==null&&Ys(ge,L,-1/0,C.sortObjects)}Ys(v,L,0,C.sortObjects),M.finish(),U!==null&&U.updateLights(b.state.lightsArray),C.sortObjects===!0&&M.sort(_e,Pe),Ee=be.enabled===!1||be.isPresenting===!1||be.hasDepthSensing()===!1,Ee&&Ve.addToRenderList(M,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ue===!0&&Re.beginShadows();const z=b.state.shadowsArray;if(De.render(z,v,L),Ue===!0&&Re.endShadows(),(G&&E.hasRenderPass())===!1){const ge=M.opaque,de=M.transmissive;if(b.setupLights(),L.isArrayCamera){const Me=L.cameras;if(de.length>0)for(let Te=0,We=Me.length;Te<We;Te++){const qe=Me[Te];Sa(ge,de,v,qe)}Ee&&Ve.render(v);for(let Te=0,We=Me.length;Te<We;Te++){const qe=Me[Te];va(M,v,qe,qe.viewport)}}else de.length>0&&Sa(ge,de,v,L),Ee&&Ve.render(v),va(M,v,L)}te!==null&&X===0&&(Z.updateMultisampleRenderTarget(te),Z.updateRenderTargetMipmap(te)),G&&E.end(C),v.isScene===!0&&v.onAfterRender(C,v,L),pe.resetDefaultState(),W=-1,$=null,x.pop(),x.length>0?(b=x[x.length-1],Z.setTextureUnits(b.state.textureUnits),Ue===!0&&Re.setGlobalState(C.clippingPlanes,b.state.camera)):b=null,R.pop(),R.length>0?M=R[R.length-1]:M=null,U!==null&&U.renderEnd()};function Ys(v,L,q,G){if(v.visible===!1)return;if(v.layers.test(L.layers)){if(v.isGroup)q=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(L);else if(v.isLightProbeGrid)b.pushLightProbeGrid(v);else if(v.isLight)b.pushLight(v),v.castShadow&&b.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||v.intersectsFrustum(Ie)){G&&Se.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Ne);const ge=ee.update(v),de=v.material;de.visible&&M.push(v,ge,de,q,Se.z,null,L)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||v.intersectsFrustum(Ie))){const ge=ee.update(v),de=v.material;if(G&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Se.copy(v.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),Se.copy(ge.boundingSphere.center)),Se.applyMatrix4(v.matrixWorld).applyMatrix4(Ne)),Array.isArray(de)){const Me=ge.groups;for(let Te=0,We=Me.length;Te<We;Te++){const qe=Me[Te],ye=de[qe.materialIndex];ye&&ye.visible&&M.push(v,ge,ye,q,Se.z,qe,L)}}else de.visible&&M.push(v,ge,de,q,Se.z,null,L)}}const ue=v.children;for(let ge=0,de=ue.length;ge<de;ge++)Ys(ue[ge],L,q,G)}function va(v,L,q,G){const{opaque:z,transmissive:ue,transparent:ge}=v;b.setupLightsView(q),Ue===!0&&Re.setGlobalState(C.clippingPlanes,q),G&&_.viewport(j.copy(G)),z.length>0&&$n(z,L,q),ue.length>0&&$n(ue,L,q),ge.length>0&&$n(ge,L,q),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Sa(v,L,q,G){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[G.id]===void 0){const ye=Je.has("EXT_color_buffer_half_float")||Je.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[G.id]=new Nt(1,1,{generateMipmaps:!0,type:ye?1016:1009,minFilter:1008,samples:Math.max(4,T.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ze.workingColorSpace})}const ue=b.state.transmissionRenderTarget[G.id],ge=G.viewport||j;ue.setSize(ge.z*C.transmissionResolutionScale,ge.w*C.transmissionResolutionScale);const de=C.getRenderTarget(),Me=C.getActiveCubeFace(),Te=C.getActiveMipmapLevel();C.setRenderTarget(ue),C.getClearColor(Xe),Le=C.getClearAlpha(),Le<1&&C.setClearColor(16777215,.5),C.clear(),Ee&&Ve.render(q);const We=C.toneMapping;C.toneMapping=0;const qe=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),b.setupLightsView(G),Ue===!0&&Re.setGlobalState(C.clippingPlanes,G),$n(v,q,G),Z.updateMultisampleRenderTarget(ue),Z.updateRenderTargetMipmap(ue),Je.has("WEBGL_multisampled_render_to_texture")===!1){let ye=!1;for(let nt=0,vt=L.length;nt<vt;nt++){const ft=L[nt],{object:ot,geometry:At,material:me,group:Ct}=ft;if(me.side===2&&ot.layers.test(G.layers)){const Qe=me.side;me.side=1,me.needsUpdate=!0,Ma(ot,q,G,At,me,Ct),me.side=Qe,me.needsUpdate=!0,ye=!0}}ye===!0&&(Z.updateMultisampleRenderTarget(ue),Z.updateRenderTargetMipmap(ue))}C.setRenderTarget(de,Me,Te),C.setClearColor(Xe,Le),qe!==void 0&&(G.viewport=qe),C.toneMapping=We}function $n(v,L,q){const G=L.isScene===!0?L.overrideMaterial:null;for(let z=0,ue=v.length;z<ue;z++){const ge=v[z],{object:de,geometry:Me,group:Te}=ge;let We=ge.material;We.allowOverride===!0&&G!==null&&(We=G),de.layers.test(q.layers)&&Ma(de,L,q,Me,We,Te)}}function Ma(v,L,q,G,z,ue){U!==null&&z.isNodeMaterial&&U.setObject(v,z),v.onBeforeRender(C,L,q,G,z,ue),v.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),z.onBeforeRender(C,L,q,G,v,ue),z.transparent===!0&&z.side===2&&z.forceSinglePass===!1?(z.side=1,z.needsUpdate=!0,C.renderBufferDirect(q,L,G,z,v,ue),z.side=0,z.needsUpdate=!0,C.renderBufferDirect(q,L,G,z,v,ue),z.side=2):C.renderBufferDirect(q,L,G,z,v,ue),v.onAfterRender(C,L,q,G,z,ue)}function Jn(v,L,q){L.isScene!==!0&&(L=we);const G=V.get(v),z=b.state.lights,ue=b.state.shadowsArray,ge=z.state.version,de=re.getParameters(v,z.state,ue,L,q,b.state.lightProbeGridArray),Me=re.getProgramCacheKey(de);let Te=G.programs;G.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,G.fog=L.fog;const We=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;G.envMap=ne.get(v.envMap||G.environment,We),G.envMapRotation=G.environment!==null&&v.envMap===null?L.environmentRotation:v.envMapRotation,Te===void 0&&(v.addEventListener("dispose",jt),Te=new Map,G.programs=Te);let qe=Te.get(Me);if(qe!==void 0){if(G.currentProgram===qe&&G.lightsStateVersion===ge)return ba(v,de),qe}else de.uniforms=re.getUniforms(v),U!==null&&v.isNodeMaterial&&U.build(v,q,de),v.onBeforeCompile(de,C),qe=re.acquireProgram(de,Me),Te.set(Me,qe),G.uniforms=de.uniforms;const ye=G.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(ye.clippingPlanes=Re.uniform),ba(v,de),G.needsLights=Ah(v),G.lightsStateVersion=ge,G.needsLights&&(ye.ambientLightColor.value=z.state.ambient,ye.lightProbe.value=z.state.probe,ye.sunLights.value=z.state.sun,ye.sunLightShadows.value=z.state.sunShadow,ye.directionalLights.value=z.state.directional,ye.directionalLightShadows.value=z.state.directionalShadow,ye.spotLights.value=z.state.spot,ye.spotLightShadows.value=z.state.spotShadow,ye.rectAreaLights.value=z.state.rectArea,ye.ltc_1.value=z.state.rectAreaLTC1,ye.ltc_2.value=z.state.rectAreaLTC2,ye.pointLights.value=z.state.point,ye.pointLightShadows.value=z.state.pointShadow,ye.hemisphereLights.value=z.state.hemi,ye.sunShadowMatrix.value=z.state.sunShadowMatrix,ye.sunShadowCascade.value=z.state.sunShadowCascade,ye.directionalShadowMatrix.value=z.state.directionalShadowMatrix,ye.spotLightMatrix.value=z.state.spotLightMatrix,ye.spotLightMap.value=z.state.spotLightMap,ye.pointShadowMatrix.value=z.state.pointShadowMatrix),G.lightProbeGrid=b.state.lightProbeGridArray.length>0,G.currentProgram=qe,G.uniformsList=null,qe}function ya(v){if(v.uniformsList===null){const L=v.currentProgram.getUniforms();v.uniformsList=Vn.seqWithValue(L.seq,v.uniforms)}return v.uniformsList}function ba(v,L){const q=V.get(v);q.outputColorSpace=L.outputColorSpace,q.batching=L.batching,q.batchingColor=L.batchingColor,q.instancing=L.instancing,q.instancingColor=L.instancingColor,q.instancingMorph=L.instancingMorph,q.skinning=L.skinning,q.morphTargets=L.morphTargets,q.morphNormals=L.morphNormals,q.morphColors=L.morphColors,q.morphTargetsCount=L.morphTargetsCount,q.numClippingPlanes=L.numClippingPlanes,q.numIntersection=L.numClipIntersection,q.vertexAlphas=L.vertexAlphas,q.vertexTangents=L.vertexTangents,q.toneMapping=L.toneMapping}function bh(v,L){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;S.setFromMatrixPosition(L.matrixWorld);for(let q=0,G=v.length;q<G;q++){const z=v[q];if(z.texture!==null&&z.boundingBox.containsPoint(S))return z}return null}function Eh(v,L,q,G,z){L.isScene!==!0&&(L=we),Z.resetTextureUnits();const ue=L.fog,ge=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?L.environment:null,de=te===null?C.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ze.workingColorSpace,Me=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Te=ne.get(G.envMap||ge,Me),We=G.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,qe=!!q.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),ye=!!q.morphAttributes.position,nt=!!q.morphAttributes.normal,vt=!!q.morphAttributes.color;let ft=0;G.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(ft=C.toneMapping);const ot=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,At=ot!==void 0?ot.length:0,me=V.get(G),Ct=b.state.lights;if(Ue===!0&&(et===!0||v!==$)){const ht=v===$&&G.id===W;Re.setState(G,v,ht)}let Qe=!1;G.version===me.__version?(me.needsLights&&me.lightsStateVersion!==Ct.state.version||me.outputColorSpace!==de||z.isBatchedMesh&&me.batching===!1||!z.isBatchedMesh&&me.batching===!0||z.isBatchedMesh&&me.batchingColor===!0&&z._colorsTexture===null||z.isBatchedMesh&&me.batchingColor===!1&&z._colorsTexture!==null||z.isInstancedMesh&&me.instancing===!1||!z.isInstancedMesh&&me.instancing===!0||z.isSkinnedMesh&&me.skinning===!1||!z.isSkinnedMesh&&me.skinning===!0||z.isInstancedMesh&&me.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&me.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&me.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&me.instancingMorph===!1&&z.morphTexture!==null||me.envMap!==Te||G.fog===!0&&me.fog!==ue||me.numClippingPlanes!==void 0&&(me.numClippingPlanes!==Re.numPlanes||me.numIntersection!==Re.numIntersection)||me.vertexAlphas!==We||me.vertexTangents!==qe||me.morphTargets!==ye||me.morphNormals!==nt||me.morphColors!==vt||me.toneMapping!==ft||me.morphTargetsCount!==At||!!me.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(Qe=!0):(Qe=!0,me.__version=G.version);let Bt=me.currentProgram;Qe===!0&&(Bt=Jn(G,L,z),U&&G.isNodeMaterial&&U.onUpdateProgram(G,Bt,me));let ei=!1,mi=!1,$i=!1;const at=Bt.getUniforms(),mt=me.uniforms;if(_.useProgram(Bt.program)&&(ei=!0,mi=!0,$i=!0),G.id!==W&&(W=G.id,mi=!0),me.needsLights){const ht=bh(b.state.lightProbeGridArray,z);me.lightProbeGrid!==ht&&(me.lightProbeGrid=ht,mi=!0)}if(ei||$!==v){_.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),at.setValue(D,"projectionMatrix",v.projectionMatrix),at.setValue(D,"viewMatrix",v.matrixWorldInverse);const gi=at.map.cameraPosition;gi!==void 0&&gi.setValue(D,Ye.setFromMatrixPosition(v.matrixWorld)),T.logarithmicDepthBuffer&&at.setValue(D,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&at.setValue(D,"isOrthographic",v.isOrthographicCamera===!0),$!==v&&($=v,mi=!0,$i=!0)}if(me.needsLights&&(Ct.state.sunShadowMap.length>0&&at.setValue(D,"sunShadowMap",Ct.state.sunShadowMap,Z),Ct.state.directionalShadowMap.length>0&&at.setValue(D,"directionalShadowMap",Ct.state.directionalShadowMap,Z),Ct.state.spotShadowMap.length>0&&at.setValue(D,"spotShadowMap",Ct.state.spotShadowMap,Z),Ct.state.pointShadowMap.length>0&&at.setValue(D,"pointShadowMap",Ct.state.pointShadowMap,Z)),z.isSkinnedMesh){at.setOptional(D,z,"bindMatrix"),at.setOptional(D,z,"bindMatrixInverse");const ht=z.skeleton;ht&&(ht.boneTexture===null&&ht.computeBoneTexture(),at.setValue(D,"boneTexture",ht.boneTexture,Z))}z.isBatchedMesh&&(at.setOptional(D,z,"batchingTexture"),at.setValue(D,"batchingTexture",z._matricesTexture,Z),at.setOptional(D,z,"batchingIdTexture"),at.setValue(D,"batchingIdTexture",z._indirectTexture,Z),at.setOptional(D,z,"batchingColorTexture"),z._colorsTexture!==null&&at.setValue(D,"batchingColorTexture",z._colorsTexture,Z));const xi=q.morphAttributes;if((xi.position!==void 0||xi.normal!==void 0||xi.color!==void 0)&&F.update(z,q,Bt),(mi||me.receiveShadow!==z.receiveShadow)&&(me.receiveShadow=z.receiveShadow,at.setValue(D,"receiveShadow",z.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&L.environment!==null&&(mt.envMapIntensity.value=L.environmentIntensity),mt.dfgLUT!==void 0&&(mt.dfgLUT.value=Tc()),mi){if(at.setValue(D,"toneMappingExposure",C.toneMappingExposure),me.needsLights&&Th(mt,$i),ue&&G.fog===!0&&Ae.refreshFogUniforms(mt,ue),Ae.refreshMaterialUniforms(mt,G,K,Y,b.state.transmissionRenderTarget[v.id]),me.needsLights&&me.lightProbeGrid){const ht=me.lightProbeGrid;mt.probesSH.value=ht.texture,mt.probesMin.value.copy(ht.boundingBox.min),mt.probesMax.value.copy(ht.boundingBox.max),mt.probesResolution.value.copy(ht.resolution)}Vn.upload(D,ya(me),mt,Z)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Vn.upload(D,ya(me),mt,Z),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&at.setValue(D,"center",z.center),at.setValue(D,"modelViewMatrix",z.modelViewMatrix),at.setValue(D,"normalMatrix",z.normalMatrix),at.setValue(D,"modelMatrix",z.matrixWorld),G.uniformsGroups!==void 0){const ht=G.uniformsGroups;for(let gi=0,Ji=ht.length;gi<Ji;gi++){const Ta=ht[gi];ie.update(Ta,Bt),ie.bind(Ta,Bt)}}return Bt}function Th(v,L){v.ambientLightColor.needsUpdate=L,v.lightProbe.needsUpdate=L,v.sunLights.needsUpdate=L,v.sunLightShadows.needsUpdate=L,v.directionalLights.needsUpdate=L,v.directionalLightShadows.needsUpdate=L,v.pointLights.needsUpdate=L,v.pointLightShadows.needsUpdate=L,v.spotLights.needsUpdate=L,v.spotLightShadows.needsUpdate=L,v.rectAreaLights.needsUpdate=L,v.hemisphereLights.needsUpdate=L}function Ah(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return te},this.setRenderTargetTextures=function(v,L,q){const G=V.get(v);G.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),V.get(v.texture).__webglTexture=L,V.get(v.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:q,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,L){const q=V.get(v);q.__webglFramebuffer=L,q.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(v,L=0,q=0){te=v,k=L,X=q;let G=null,z=!1,ue=!1;if(v){const de=V.get(v);if(de.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(D.FRAMEBUFFER,de.__webglFramebuffer),j.copy(v.viewport),ve.copy(v.scissor),xe=v.scissorTest,_.viewport(j),_.scissor(ve),_.setScissorTest(xe),W=-1;return}else if(de.__webglFramebuffer===void 0)Z.setupRenderTarget(v);else if(de.__hasExternalTextures)Z.rebindTextures(v,V.get(v.texture).__webglTexture,V.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const We=v.depthTexture;if(de.__boundDepthTexture!==We){if(We!==null&&V.has(We)&&(v.width!==We.image.width||v.height!==We.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(v)}}const Me=v.texture;(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)&&(ue=!0);const Te=V.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Te[L])?G=Te[L][q]:G=Te[L],z=!0):v.samples>0&&Z.useMultisampledRTT(v)===!1?G=V.get(v).__webglMultisampledFramebuffer:Array.isArray(Te)?G=Te[q]:G=Te,j.copy(v.viewport),ve.copy(v.scissor),xe=v.scissorTest}else j.copy(fe).multiplyScalar(K).floor(),ve.copy(Ge).multiplyScalar(K).floor(),xe=ut;if(q!==0&&(G=O),_.bindFramebuffer(D.FRAMEBUFFER,G)&&_.drawBuffers(v,G),_.viewport(j),_.scissor(ve),_.setScissorTest(xe),z){const de=V.get(v.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+L,de.__webglTexture,q)}else if(ue){const de=L;for(let Me=0;Me<v.textures.length;Me++){const Te=V.get(v.textures[Me]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Me,Te.__webglTexture,q,de)}}else if(v!==null&&q!==0){const de=V.get(v.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,de.__webglTexture,q)}W=-1};function Ea(v){const L=V.get(v);return(L.__readFormat!==v.format||L.__readType!==v.type)&&(L.__readFormat=v.format,L.__readType=v.type,L.__formatReadable=T.textureFormatReadable(v.format),L.__typeReadable=T.textureTypeReadable(v.type)),L}this.readRenderTargetPixels=function(v,L,q,G,z,ue,ge,de=0){if(!(v&&v.isWebGLRenderTarget)){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=V.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ge!==void 0&&(Me=Me[ge]),Me){_.bindFramebuffer(D.FRAMEBUFFER,Me);try{const Te=v.textures[de],We=Te.format,qe=Te.type;v.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+de);const ye=Ea(Te);if(ye.__formatReadable===!1){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ye.__typeReadable===!1){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=v.width-G&&q>=0&&q<=v.height-z&&D.readPixels(L,q,G,z,le.convert(We),le.convert(qe),ue)}finally{const Te=te!==null?V.get(te).__webglFramebuffer:null;_.bindFramebuffer(D.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(v,L,q,G,z,ue,ge,de=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=V.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ge!==void 0&&(Me=Me[ge]),Me)if(L>=0&&L<=v.width-G&&q>=0&&q<=v.height-z){_.bindFramebuffer(D.FRAMEBUFFER,Me);const Te=v.textures[de],We=Te.format,qe=Te.type;v.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+de);const ye=Ea(Te);if(ye.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ye.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const nt=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,nt),D.bufferData(D.PIXEL_PACK_BUFFER,ue.byteLength,D.STREAM_READ),D.readPixels(L,q,G,z,le.convert(We),le.convert(qe),0),D.bindBuffer(D.PIXEL_PACK_BUFFER,null);const vt=te!==null?V.get(te).__webglFramebuffer:null;_.bindFramebuffer(D.FRAMEBUFFER,vt);const ft=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await wa(D,ft,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,nt),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,ue),D.bindBuffer(D.PIXEL_PACK_BUFFER,null),D.deleteBuffer(nt),D.deleteSync(ft),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,L=null,q=0){const G=Math.pow(2,-q),z=Math.floor(v.image.width*G),ue=Math.floor(v.image.height*G),ge=L!==null?L.x:0,de=L!==null?L.y:0;Z.setTexture2D(v,0),D.copyTexSubImage2D(D.TEXTURE_2D,q,0,0,ge,de,z,ue),_.unbindTexture()},this.copyTextureToTexture=function(v,L,q=null,G=null,z=0,ue=0){let ge,de,Me,Te,We,qe,ye,nt,vt;const ft=v.isCompressedTexture?v.mipmaps[ue]:v.image;if(q!==null)ge=q.max.x-q.min.x,de=q.max.y-q.min.y,Me=q.isBox3?q.max.z-q.min.z:1,Te=q.min.x,We=q.min.y,qe=q.isBox3?q.min.z:0;else{const mt=Math.pow(2,-z);ge=Math.floor(ft.width*mt),de=Math.floor(ft.height*mt),v.isDataArrayTexture?Me=ft.depth:v.isData3DTexture?Me=Math.floor(ft.depth*mt):Me=1,Te=0,We=0,qe=0}G!==null?(ye=G.x,nt=G.y,vt=G.z):(ye=0,nt=0,vt=0);const ot=le.convert(L.format),At=le.convert(L.type);let me;L.isData3DTexture?(Z.setTexture3D(L,0),me=D.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(Z.setTexture2DArray(L,0),me=D.TEXTURE_2D_ARRAY):(Z.setTexture2D(L,0),me=D.TEXTURE_2D),_.activeTexture(D.TEXTURE0),_.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,L.flipY),_.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),_.pixelStorei(D.UNPACK_ALIGNMENT,L.unpackAlignment);const Ct=_.getParameter(D.UNPACK_ROW_LENGTH),Qe=_.getParameter(D.UNPACK_IMAGE_HEIGHT),Bt=_.getParameter(D.UNPACK_SKIP_PIXELS),ei=_.getParameter(D.UNPACK_SKIP_ROWS),mi=_.getParameter(D.UNPACK_SKIP_IMAGES);_.pixelStorei(D.UNPACK_ROW_LENGTH,ft.width),_.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ft.height),_.pixelStorei(D.UNPACK_SKIP_PIXELS,Te),_.pixelStorei(D.UNPACK_SKIP_ROWS,We),_.pixelStorei(D.UNPACK_SKIP_IMAGES,qe);const $i=v.isDataArrayTexture||v.isData3DTexture,at=L.isDataArrayTexture||L.isData3DTexture;if(v.isDepthTexture){const mt=V.get(v),xi=V.get(L),ht=V.get(mt.__renderTarget),gi=V.get(xi.__renderTarget);_.bindFramebuffer(D.READ_FRAMEBUFFER,ht.__webglFramebuffer),_.bindFramebuffer(D.DRAW_FRAMEBUFFER,gi.__webglFramebuffer);for(let Ji=0;Ji<Me;Ji++)$i&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,V.get(v).__webglTexture,z,qe+Ji),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,V.get(L).__webglTexture,ue,vt+Ji)),D.blitFramebuffer(Te,We,ge,de,ye,nt,ge,de,D.DEPTH_BUFFER_BIT,D.NEAREST);_.bindFramebuffer(D.READ_FRAMEBUFFER,null),_.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(z!==0||v.isRenderTargetTexture||V.has(v)){const mt=V.get(v),xi=V.get(L);_.bindFramebuffer(D.READ_FRAMEBUFFER,P),_.bindFramebuffer(D.DRAW_FRAMEBUFFER,N);for(let ht=0;ht<Me;ht++)$i?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,mt.__webglTexture,z,qe+ht):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,mt.__webglTexture,z),at?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,xi.__webglTexture,ue,vt+ht):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,xi.__webglTexture,ue),z!==0?D.blitFramebuffer(Te,We,ge,de,ye,nt,ge,de,D.COLOR_BUFFER_BIT,D.NEAREST):at?D.copyTexSubImage3D(me,ue,ye,nt,vt+ht,Te,We,ge,de):D.copyTexSubImage2D(me,ue,ye,nt,Te,We,ge,de);_.bindFramebuffer(D.READ_FRAMEBUFFER,null),_.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else at?v.isDataTexture||v.isData3DTexture?D.texSubImage3D(me,ue,ye,nt,vt,ge,de,Me,ot,At,ft.data):L.isCompressedArrayTexture?D.compressedTexSubImage3D(me,ue,ye,nt,vt,ge,de,Me,ot,ft.data):D.texSubImage3D(me,ue,ye,nt,vt,ge,de,Me,ot,At,ft):v.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,ue,ye,nt,ge,de,ot,At,ft.data):v.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,ue,ye,nt,ft.width,ft.height,ot,ft.data):D.texSubImage2D(D.TEXTURE_2D,ue,ye,nt,ge,de,ot,At,ft);_.pixelStorei(D.UNPACK_ROW_LENGTH,Ct),_.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Qe),_.pixelStorei(D.UNPACK_SKIP_PIXELS,Bt),_.pixelStorei(D.UNPACK_SKIP_ROWS,ei),_.pixelStorei(D.UNPACK_SKIP_IMAGES,mi),ue===0&&L.generateMipmaps&&D.generateMipmap(me),_.unbindTexture()},this.initRenderTarget=function(v){V.get(v).__webglFramebuffer===void 0&&Z.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?Z.setTextureCube(v,0):v.isData3DTexture?Z.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?Z.setTexture2DArray(v,0):Z.setTexture2D(v,0),_.unbindTexture()},this.resetState=function(){k=0,X=0,te=null,_.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ze._getUnpackColorSpace()}}const na=[{id:0,name:"black",rgb:[26,26,26],label:"黑色"},{id:1,name:"white",rgb:[242,242,242],label:"白色"},{id:2,name:"dark_gray",rgb:[47,47,47],label:"深灰色"},{id:3,name:"medium_gray_new",rgb:[85,85,85],label:"中灰色"},{id:4,name:"light_gray_new",rgb:[150,150,150],label:"浅灰色"},{id:5,name:"green",rgb:[63,77,24],label:"绿色"},{id:6,name:"orange",rgb:[255,160,62],label:"橙色"},{id:7,name:"brown",rgb:[175,140,89],label:"咖啡色"},{id:8,name:"green_dark",rgb:[4,130,130],label:"墨绿色"},{id:9,name:"blue_dark",rgb:[57,80,192],label:"深蓝色"},{id:10,name:"purple",rgb:[140,106,172],label:"紫色"},{id:11,name:"lime",rgb:[138,149,73],label:"浅绿色"},{id:12,name:"light_gray",rgb:[136,122,125],label:"浅灰色"},{id:13,name:"blue_gray",rgb:[138,57,26],label:"蓝灰色"},{id:14,name:"terra_cotta",rgb:[112,79,57],label:"赭石色"},{id:15,name:"olive_green",rgb:[168,200,72],label:"橄榄绿"},{id:16,name:"pink",rgb:[240,170,207],label:"粉红色"},{id:17,name:"wine_red",rgb:[128,49,52],label:"酒红色"},{id:18,name:"gold_orange",rgb:[233,175,52],label:"金橙色"},{id:19,name:"gray_brown",rgb:[128,125,114],label:"灰褐色"},{id:20,name:"sage_gray",rgb:[121,132,129],label:"鼠尾草灰"},{id:21,name:"brick_red",rgb:[159,114,85],label:"砖红色"},{id:22,name:"silver",rgb:[181,180,185],label:"银灰色"},{id:23,name:"beige",rgb:[235,220,201],label:"米色"},{id:24,name:"gray_green",rgb:[148,162,158],label:"青灰色"},{id:25,name:"tan",rgb:[210,169,151],label:"驼色"},{id:26,name:"khaki",rgb:[165,162,147],label:"卡其色"},{id:27,name:"dusty_rose",rgb:[203,243,251],label:"雾玫瑰色"},{id:28,name:"mauve_gray",rgb:[174,161,164],label:"淡紫灰"},{id:29,name:"medium_gray",rgb:[155,155,155],label:"中灰色"},{id:30,name:"red",rgb:[208,34,63],label:"红色"},{id:31,name:"yellow",rgb:[255,249,56],label:"黄色"},{id:32,name:"blue",rgb:[2,66,109],label:"蓝色"},{id:33,name:"custom",rgb:[26,26,26],label:"自定义"},{id:34,name:"coral",rgb:[255,127,80],label:"珊瑚色"},{id:35,name:"mint",rgb:[152,251,152],label:"薄荷绿"}],Rc=na.map(n=>n.name);function Is(n){return na.find(e=>e.id===n)?.rgb??[26,26,26]}const sa=4294967296,wc=1664525,Cc=1013904223,Us=3.141592653589793,Ns=1.5707963267948966,pi=6.283185307179586;function _i(n){let e=n-pi*Math.round(n/pi);e>Ns?e=Us-e:e<-Ns&&(e=-Us-e);const t=e*e;return e*(1+t*(-.16666666666666666+t*(.008333333333333333+t*(-.0001984126984126984+t*(27557319223985893e-22+t*(-2505210838544172e-23+t*16059043836821613e-26))))))}function Ai(n){return _i(n+Ns)}class Xn{state=0;constructor(e=0){this.seed(e)}seed(e){this.state=e>>>0}next(){return this.state=(wc*this.state+Cc)%sa,this.state/sa}random(e,t){const i=this.next();return e===void 0?i:t===void 0?i*e:e>t?i*(e-t)+t:i*(t-e)+e}}const ra=4,qn=1<<ra,aa=8,Pc=1<<aa,Qt=4095,Dc=4,Lc=.5;function Bs(n){return .5*(1-Ai(n*Us))}class oa{perlin=new Float64Array(Qt+1);constructor(e=0){this.seed(e)}seed(e){const t=new Xn(e);for(let i=0;i<=Qt;i++)this.perlin[i]=t.next()}noise(e,t=0,i=0){const s=this.perlin;let r=e<0?-e:e,a=t<0?-t:t,o=i<0?-i:i,c=Math.floor(r),l=Math.floor(a),d=Math.floor(o);r-=c,a-=l,o-=d;let u=0,h=.5;for(let m=0;m<Dc;m++){let g=c+(l<<ra)+(d<<aa);const y=Bs(r),p=Bs(a);let f=s[g&Qt]??0;f+=y*((s[g+1&Qt]??0)-f);let A=s[g+qn&Qt]??0;A+=y*((s[g+qn+1&Qt]??0)-A),f+=p*(A-f),g+=Pc,A=s[g&Qt]??0,A+=y*((s[g+1&Qt]??0)-A);let w=s[g+qn&Qt]??0;w+=y*((s[g+qn+1&Qt]??0)-w),A+=p*(w-A),f+=Bs(o)*(A-f),u+=f*h,h*=Lc,c<<=1,r*=2,l<<=1,a*=2,d<<=1,o*=2,r>=1&&(c++,r--),a>=1&&(l++,a--),o>=1&&(d++,o--)}return u}}function rt(n,e,t,i,s){return(n-e)/(t-e)*(s-i)+i}function Wt(n,e,t){return n+(e-n)*t}function Os(n){return Math.round(n*100)/100}function Fc(n){if(!(n>0))return 0;const e=n*n*n;let t=n<1?1-.6*(1-n):1+.6*(n-1);for(let i=0;i<40;i++){const s=t*t*t*t,r=t-(s*t-e)/(5*s);if(Math.abs(r-t)<1e-12)return r;t=r}return t}const Ic={brush:1,marker:2,gothic:3,pen:4,dots:5,fly:6,brushSP:7},Uc={"ultra-small":.1,"extra-small":.25,small:.5,medium:1,large:2,"extra-large":3,"extra-extra-large":5,huge:10},Nc={mix:0,sharpen:1,flyingWhite:2,wet:3,effect4:4,hair:5},Bc={mix:0,multiply:1,darken:2,spectral:3},Oc=[{x:!1,y:!1},{x:!0,y:!1},{x:!1,y:!0},{x:!0,y:!0}],Gc=[{base:2,sx:1,sy:1,threshold:.05},{base:1,sx:-1,sy:-1,threshold:.1},{base:3,sx:-1,sy:-1,threshold:.12},{base:1,sx:1,sy:1,threshold:.08},{base:3,sx:1,sy:1,threshold:.2}],zc=pi/8,kc=pi/12,Vc=[.065,.1,.125,.15,.1,.125,.15,.18].map((n,e)=>({angle:e*zc,radius:1.6,threshold:n,jitter:9+e})),Hc=[.07,.08,.1,.13,.16,.1,.13,.16,.19,.13,.16,.19].map((n,e)=>({angle:e*kc,radius:1,threshold:n,jitter:17+e})),Wc=[{perp:1.5,threshold:.7},{perp:-1.5,threshold:.75},{perp:3,threshold:.8},{perp:-3,threshold:.85},{perp:5,threshold:.9}],un=[.1,.25,.5,1,2,3,5,10],Gs=-10;function gt(n,e,t){return n<e?e:n>t?t:n}function Ri(n){return n<0?Math.ceil(n):Math.floor(n)}function Xc(n){return typeof n=="number"?n:Uc[n]}class qc{rng=new Xn(0);perlin=new oa(0);ops=[];brushMode=1;baseBrushSize=2;pressureBaseBrushSize=2;useSharpen=0;brushColorMode=0;customBrushColor=[26,26,26];whiteBrushMode=!1;keyBlendMode=0;useSpectralMix=!1;strokeSeed=1234567890;strokeFrame=0;mouseCountStart=0;inkGray=0;initialSize=0;spraySize=6;randStep=.05;maxUpdates=30;interpSteps=15;step2=5;spring=.6;friction=.5;expectedStrokeLength=400;brushSize=0;brushSizeMin=2;sizeNow=20;strokeWidth=0;lineWidth=0;smoothedWidth=0;velX=0;velY=0;speed=0;x=0;y=0;springInitialized=!1;prevTipX=0;prevTipY=0;isDrawing=!1;isReleasing=!1;countdownFrame=0;whiteMaxOpacity=.95;hueShift=0;satShift=0;briShift=0;explodeStart=0;explodeEnd=0;targetmainStrokeDir=0;brushDir=0;indiffusionStrength=.45;effect3Brightness=.2;shapeType=0;ctlNoiseByFrame=1;interpolationOffset=0;pathRotation=0;penSketchNoiseBase=.5;brushModeSP=!1;penPressure=0;stylusDetected=!1;pressureHistory=[0,0,0];strokeStartBaseBrushSize=2;markerAxis={x:1,y:0};markerMove={x:1,y:0};flyMove={x:1,y:0};flyConfigs=new Map;flyWeights=new Map;sprayParticles=[];sprayParticleCounter=0;configure(e){this.brushMode=Ic[e.mode],this.baseBrushSize=Xc(e.size),this.pressureBaseBrushSize=this.baseBrushSize,this.useSharpen=Nc[e.effect],e.blend==="spectral"?this.useSpectralMix=!0:(this.keyBlendMode=Bc[e.blend],this.useSpectralMix=!1)}setColor(e){if(typeof e=="string"){this.whiteBrushMode=e==="white";const t=Rc.indexOf(e);this.brushColorMode=t<0?0:t;const i=Is(this.brushColorMode);this.customBrushColor[0]=i[0],this.customBrushColor[1]=i[1],this.customBrushColor[2]=i[2];return}this.customBrushColor[0]=e[0],this.customBrushColor[1]=e[1],this.customBrushColor[2]=e[2],this.brushColorMode=33,this.whiteBrushMode=!1}get mode(){return this.brushMode}get effect(){return this.useSharpen}get pendingCommit(){return this.isDrawing||this.isReleasing}shaderState(){return{brushMode:this.brushMode,baseBrushSize:this.baseBrushSize,useSharpen:this.useSharpen,effect3Brightness:this.effect3Brightness,indiffusionStrength:this.indiffusionStrength,brushColorMode:this.brushColorMode,brushCategory:this.brushColorMode===1?1:0,mouseCount:(this.strokeFrame+this.mouseCountStart)%40,mouseCountAccumulated:this.strokeFrame+this.mouseCountStart,strokeSeed:this.strokeSeed,whiteMaxOpacity:this.whiteMaxOpacity,hueShift:this.hueShift,satShift:this.satShift,briShift:this.briShift,keyBlendMode:this.keyBlendMode,useSpectralMix:this.useSpectralMix?1:0,customBrushColor:[this.customBrushColor[0],this.customBrushColor[1],this.customBrushColor[2]]}}applyPressure(e){e!==void 0&&(this.stylusDetected=!0,this.penPressure=this.pressureMedian3(e))}press(e,t,i){const s=this.rng;this.pressureHistory[0]=this.pressureHistory[1]=this.pressureHistory[2]=0,s.seed(i),this.strokeSeed=Ri(s.random(1e8,999999999)),s.seed(this.strokeSeed),this.perlin.seed(this.strokeSeed),this.mouseCountStart=this.strokeFrame,this.inkGray=0,this.strokeFrame=0,this.pressureBaseBrushSize!==null&&(this.baseBrushSize=this.pressureBaseBrushSize),this.sprayParticles=[],this.sprayParticleCounter=0,this.whiteMaxOpacity=s.random(.5,.99),this.hueShift=s.random(-.02,.02),this.satShift=s.random(-.05,.05),this.briShift=s.random(-.05,.05),this.explodeStart=s.random(0,1)>.8?1:0,this.explodeEnd=s.random(0,1)>.8?1:0,s.random(-1,3),this.targetmainStrokeDir=Math.max(0,Ri(s.random(-1,3))),this.brushDir=Ri(s.random(0,4)),s.random(.4,.5),this.brushMode===3||this.brushMode===4?s.random(.2,.3):this.brushMode===5&&s.random(.25,.35),this.indiffusionStrength=.45,this.baseBrushSize<=1.5&&(this.explodeStart=this.explodeEnd=0),this.effect3Brightness=s.random(.5,.9),Ri(s.random(0,4)),this.shapeType=Ri(s.random(0,4)),this.ctlNoiseByFrame=Math.max(this.perlin.noise(0),0,1,.2,.8),this.interpolationOffset=Ri(s.random(-2,4)),s.random(0,1),this.pathRotation=0;const r=this.baseBrushSize;switch(this.brushMode){case 1:this.initialSize=Os(s.random(20,24)*r),this.spraySize=r>5?1.5*r:3*r,this.randStep=.05,this.maxUpdates=30,this.interpSteps=15,this.step2=5,this.spring=.6,this.friction=.5;break;case 2:this.initialSize=Os(s.random(20,24)*r),this.spraySize=r,this.randStep=.05,this.maxUpdates=10,this.interpSteps=10,this.step2=10,this.spring=.3,this.friction=.5;break;case 3:this.initialSize=s.random(2,4)*r,this.spraySize=10*r,this.step2=3,this.randStep=.05,this.maxUpdates=10;break;case 4:this.initialSize=s.random(6,9)*r,this.spraySize=r,this.step2=5,this.randStep=.05,this.maxUpdates=10,this.penSketchNoiseBase=this.perlin.noise(e,t),s.random(0,1),this.spring=.6,this.friction=.5;break;case 5:case 6:this.initialSize=s.random(10,14)*r,this.spraySize=10,this.step2=1,this.randStep=.05,this.maxUpdates=10,this.interpSteps=10,this.spring=.6,this.friction=.5;break;default:this.initialSize=s.random(30,40),this.maxUpdates=10,this.randStep=.05;break}this.useSharpen>=3.5&&(this.maxUpdates=20),this.expectedStrokeLength=400,this.brushSize=this.initialSize,this.sizeNow=this.brushSize,this.strokeWidth=this.sizeNow,this.strokeStartBaseBrushSize=this.baseBrushSize,this.pressureBaseBrushSize===null&&(this.pressureBaseBrushSize=this.baseBrushSize),this.springInitialized=!1,this.x=e,this.y=t,this.velX=0,this.velY=0,this.speed=0,this.lineWidth=0,this.smoothedWidth=0,this.markerAxis={x:1,y:0},this.markerMove={x:1,y:0},this.flyConfigs=new Map,this.flyWeights=new Map,this.flyMove={x:1,y:0},this.prevTipX=e,this.prevTipY=t,this.isDrawing=!0,this.isReleasing=!1,this.countdownFrame=0;const a=Ri(s.random(1e6,9999999));this.brushModeSP=this.brushMode===7,s.seed(a),this.perlin.seed(a)}release(){this.isDrawing&&(this.sprayParticles.length&&(this.sprayParticles=this.sprayParticles.filter(e=>e.radius>0)),this.isReleasing||(this.isReleasing=!0,this.countdownFrame=0),this.stylusDetected&&(this.penPressure=0))}committed(){this.isDrawing=!1,this.isReleasing=!1,this.countdownFrame=0}frame(e,t,i,s,r){this.ops=[];const a=this.brushMode,c=a===3||a===4||a===5?e:e&&this.brushSize>0;c&&this.isDrawing&&this.drawFrame(t,i,s,r);let l,d=!1;return c&&this.isDrawing?l=a===4?.4:1:this.isReleasing&&this.countdownFrame<this.maxUpdates?(l=rt(this.countdownFrame,0,this.maxUpdates,1,0),a===4&&(l*=.4),this.countdownFrame++):this.isReleasing&&(d=!0),{ops:this.ops,force:l,commit:d}}drawFrame(e,t,i,s){const r=this.rng,a=this.brushMode;if(this.strokeFrame++,r.seed(this.strokeSeed+this.strokeFrame*1e8),a===3){const u=r.random(0,1),h=r.random(150,250),m=u>.1?this.perlin.noise(e*.01,t*.01)*150:h;this.inkGray=this.inkGray*.3+m*.7}else{const u=r.random(0,1),h=r.random(20,50),m=u>.3?this.perlin.noise(e*.01,t*.01)*10:h;this.inkGray=this.inkGray*.6+m*.4}this.brushSize=Math.max(1,this.brushSize-this.randStep),this.sizeNow=this.brushSize,this.strokeFrame>=8&&this.pressureLadder(),this.brushSize<=this.brushSizeMin&&!this.isReleasing&&a!==3&&a!==4&&a!==5&&(this.isReleasing=!0,this.countdownFrame=0);let o=e,c=t;const l=rt(this.perlin.noise(o*.01,c*.01),0,1,-this.pathRotation,this.pathRotation);if(a!==3){r.seed(this.strokeSeed+this.strokeFrame*1e7);const u=r.random(this.pathRotation*.5,this.pathRotation),h=r.random(this.pathRotation*.5,this.pathRotation);o+=u*Ai(l)+Gs,c+=h*_i(l)+Gs}Math.hypot(o-this.prevTipX,c-this.prevTipY)>1&&this.strokeFrame<this.expectedStrokeLength&&(a===4&&this.drawDryBrush(o,c,this.prevTipX,this.prevTipY),(a===1||a===7)&&(r.random(0,1)>.9&&!this.whiteBrushMode&&!this.brushModeSP&&this.baseBrushSize>=1.5&&this.strokeFrame>5&&this.baseBrushSize<6&&this.drawSprayDots(o,c,i,s),this.drawBrushStroke(o,c,this.targetmainStrokeDir)),a===2&&(r.random(0,1),this.drawMarker(o,c)),a===3&&(this.drawGothic(o,c,this.prevTipX,this.prevTipY),r.random(0,1)>.4&&this.drawSprayDots(o,c,i,s)),a===5&&r.random(0,1)>.05&&this.drawSprayDots(o,c,i,s),a===6&&this.drawFlyBrush(o,c)),this.prevTipX=o,this.prevTipY=c}pressureLadder(){const e=this.penPressure,t=this.baseBrushSize;if(e>=.3){const i=this.pressureBaseBrushSize||this.strokeStartBaseBrushSize||1;let s=un.indexOf(i);s===-1&&(s=un.findIndex(a=>a>=i),s===-1&&(s=un.length-1));const r=e<.5?1:e<.7?2:3;this.baseBrushSize=un[Math.min(s+r,un.length-1)]??i}else e>=0&&(this.baseBrushSize=this.pressureBaseBrushSize||this.strokeStartBaseBrushSize||this.baseBrushSize);if(this.baseBrushSize!==t&&t>0){const i=Fc(this.baseBrushSize/t);this.brushSize*=i,this.initialSize*=i}}pressureMedian3(e){const t=this.pressureHistory;return t[0]=t[1],t[1]=t[2],t[2]=e,Math.max(Math.min(t[0],t[1]),Math.min(Math.max(t[0],t[1]),t[2]))}effBaseSize(){return this.pressureBaseBrushSize??this.baseBrushSize}inkJitter(e){return this.brushColorMode===0?e+this.rng.random(10,40):e+this.rng.random(30,80)}inkGrayOf(e,t){return this.brushColorMode===0?e:this.brushColorMode===1?150:t}line(e,t,i,s,r,a,o){const c=gt(a,0,255);this.ops.push({kind:"line",x0:e,y0:t,x1:i,y1:s,w:r,h:0,lw:0,r:c,g:c,b:c,a:gt(o,0,255)})}lineRgb(e,t,i,s,r,a,o,c,l){this.ops.push({kind:"line",x0:e,y0:t,x1:i,y1:s,w:r,h:0,lw:0,r:gt(a,0,255),g:gt(o,0,255),b:gt(c,0,255),a:gt(l,0,255)})}dot(e,t,i,s,r){const a=gt(s,0,255);this.ops.push({kind:"dot",x0:e,y0:t,x1:0,y1:0,w:i,h:0,lw:0,r:a,g:a,b:a,a:gt(r,0,255)})}drawBranch(e,t,i,s,r,a,o,c,l,d,u,h,m){const g=this.rng,y=this.effBaseSize(),p=y<.25;let f=l*d+u;const A=p?Math.max(2,y*10):15;f>A&&(f=g.random(p?.6:1,A));let w=Math.max(p?.6:1,f);if(w<3&&(w*=2),this.brushModeSP){const M=Math.max(.15,Math.min(1.5,y)),b=g.random(0,1)>.8,R=g.random(0,1)>.05?g.random(-6*M,6*M):g.random(-16*M,16*M),x=g.random(0,1)>.05?g.random(-6*M,6*M):g.random(-16*M,16*M);b?this.line(i+e+o,s+t+c,r+e+R,a+t+x,g.random(.5,1.5),h,m):(w=Math.min(1,w),w<4&&this.line(i+e+o,s+t+c,r+e,a+t,w+.5,h,m));return}const S=y<4?w:g.random(w*.5,w);this.line(i+e+o,s+t+c,r+e,a+t,S,h,m)}drawSprayDots(e,t,i,s){if(this.strokeFrame>=this.expectedStrokeLength)return;const r=this.rng,a=this.perlin,o=this.inkJitter(this.inkGray),c=this.inkJitter(this.inkGray),l=.5*this.initialSize*a.noise(e*.01,t*.01)*(Math.abs(e-i)+Math.abs(t-s)),d=this.effBaseSize(),u=Math.min(this.spraySize*d,l)*rt(a.noise(e,t),0,1,.3,1);let h=Math.max(3,u);this.strokeFrame<5?h=Math.max(2,u*rt(this.strokeFrame,0,5,-.2,1)):this.strokeFrame>=this.expectedStrokeLength-5&&(h=Math.max(2,u*rt(this.strokeFrame,this.expectedStrokeLength-5,this.expectedStrokeLength,1,-.2)));const m=this.inkGrayOf(o,c);for(let g=0;g<this.step2;g++){const y=Wt(e,i,g/this.step2),p=Wt(t,s,g/this.step2);for(let f=0;f<10;f++){const A=r.random(0,1)>.1?1:1.5,w=r.random(pi),S=r.random(),M=r.random(-h*A,h*A),b=r.random(-h*A,h*A);let R,x;if(this.shapeType===0){const X=Math.sqrt(S)*h;R=X*Ai(w),x=X*_i(w)}else if(this.shapeType===1)R=_i(w)*M,x=Ai(w)*b;else if(this.shapeType===2){const X=w/pi,te=S;X+te>1?(R=h*(1-X),x=h*(1-te)):(R=h*X,x=h*te),R-=h*.5,x-=h*.5}else{const X=M/h,te=b/h,W=Math.abs(X)+Math.abs(te);W>1?(R=X/W*h,x=te/W*h):(R=X*h,x=te*h)}const E=r.random(0,1);let C=r.random(.2,1),I=r.random(1,2);const U=d<.25?.1:.3;C=Math.max(U,C*d),I=Math.max(U,I*d);const O=r.random(100,255);let P=E>.1?C:I;(this.brushMode===3||this.brushMode===5)&&(P*=2);const N=d<.25?Math.max(.3,d*3):2,k=d<.25?d*5:20;P=Math.max(N,Math.min(k,P)),this.dot(y+R,p+x,P,m,O)}}}drawBrushStroke(e,t,i){if(this.strokeFrame>=this.expectedStrokeLength)return;const s=this.rng,r=this.perlin,a=this.inkJitter(this.inkGray),o=this.inkJitter(this.inkGray),c=this.effBaseSize(),l=this.baseBrushSize,d=this.penPressure>=0?.7+.4*Math.min(this.penPressure/.7,1):1,u=c<.25,h=u?s.random(.4,.8):s.random(l*.8,l*2),m=Math.max(.6,l*2);let g=u?m:Math.max(.6,l*1.5);g<3&&(g*=2);let y=u?m:Math.max(.6,l*1.2);y<3&&(y*=2);const p=u?Math.max(2,c*10):c<.5?.7:9999;this.lineWidth=this.strokeWidth*.5,this.springInitialized||(this.springInitialized=!0,this.x=e,this.y=t),this.velX=(this.velX+(e-this.x)*this.spring)*this.friction,this.velY=(this.velY+(t-this.y)*this.spring)*this.friction,this.speed=Math.sqrt(this.velX*this.velX+this.velY*this.velY),this.speed*=l<=1?.9:l<=2?1.3:l<=3?2:3,this.strokeWidth=this.sizeNow-this.speed;const f=this.ctlNoiseByFrame,A=l*f*d,w=2*l*f*d,S=3*l*f*d;let M=.1;const b=this.initialSize;let R=0,x=0;i===0?M=.08:i===1?M=.6:i===2&&(M=.2);const E=this.interpSteps+this.interpolationOffset,C=Oc[this.brushDir]??{x:!1,y:!1};for(let I=0;I<E;++I){let U=0;l<1.5?U=s.random(0,1)>.4?0:s.random(0,1)>.4?1:2:l>1.5&&l<6?U=s.random(0,1)>.4?2:s.random(0,1)>.6?3:4:l>6&&(U=s.random(0,1)>.3?3:4),this.brushModeSP&&(U=s.random(0,1)>.3?3:s.random(0,1)>.5?2:4),this.strokeFrame<5&&(U=s.random(0,1)>.2?5:U);const O=this.x,P=this.y;this.x+=this.velX/E,this.y+=this.velY/E;const N=this.x,k=this.y,X=s.random(0,1),te=s.random(0,4),W=s.random(0,3),$=s.random(-1,1),j=s.random(-1,1),ve=s.random(-1,1),xe=s.random(-1,1);let Xe=M,Le=1;U===3?(Xe*=.8,Le*=.8):U===4&&(Xe*=.6,Le*=.5),c<.25?Xe=.18:c<1.5&&(Xe=.1),this.smoothedWidth=Wt(this.smoothedWidth,this.strokeWidth,.5),this.brushMode===1?X>.8&&this.lineWidth<2&&I===0&&(this.lineWidth=Os(te)):this.lineWidth+=(this.smoothedWidth-this.lineWidth)*.3;let ke;if(this.brushMode===1)ke=this.lineWidth;else if(this.strokeFrame<5)ke=Math.max(u?.1:.5,this.lineWidth*rt(this.strokeFrame,0,5,.05,1)),this.explodeStart&&(R=$*rt(this.strokeFrame,0,5,10,0),x=j*rt(this.strokeFrame,0,5,10,0));else if(this.strokeFrame>=this.expectedStrokeLength-5){const Se=this.expectedStrokeLength;ke=Math.max(u?.1:.5,this.lineWidth*rt(this.strokeFrame,Se-5,Se,1,.05)),this.explodeEnd&&(R=ve*rt(this.strokeFrame,Se-5,Se,0,10),x=xe*rt(this.strokeFrame,Se-5,Se,0,10))}else this.lineWidth>2?ke=Math.max(u?.2:1,this.lineWidth):ke=Math.max(u?.1:.5,this.lineWidth+(W/3-.5));let Y=ke,K=ke*.5;U===3?(Y*=.8,K*=.8):U===4&&(Y*=.5,K*=.5);const _e=s.random(0,1),Pe=s.random(150,255),fe=s.random(100,255),Ge=s.random(100,255),ut=s.random(100,255),Ie=this.inkGrayOf(a,o);if(u){if(!this.brushModeSP&&this.strokeFrame>1){const Se=Math.min(b,Math.max(g,Y));this.line(N+R,k+x,O,P,Math.min(p,Se),Ie,Pe)}}else if(_e>Xe){const Se=!this.brushModeSP&&this.strokeFrame>3&&l<4;if(Y<5){const we=i===0?1.5*Math.min(b,Math.max(g,Y)):Math.min(b,Math.max(g,Y));Se&&this.line(N+R,k+x,O,P,Math.min(p,we),Ie,Pe)}else{let we=Le*Math.min(b,Math.max(g,Y));we>15&&(we=s.random(1.5,we)),Se&&this.line(N+R,k+x,O,P,Math.min(p,we),Ie,Pe)}}const Ue=[],et=[];for(let Se=0;Se<30;Se++)Ue.push(s.random(0,1)),et.push(s.random(-.5,.5));i===1?(Ue[0]=(Ue[0]??0)*2,Ue[1]=(Ue[1]??0)*.5,Ue[2]=(Ue[2]??0)*.5):i===2&&(Ue[0]=(Ue[0]??0)*.5,Ue[1]=(Ue[1]??0)*.5,Ue[2]=(Ue[2]??0)*.5);const Ne=Se=>Ue[Se]??0,Ye=Se=>et[Se]??0;if(U===0){if(Ne(0)>.2){const Se=C.x?-1:1,we=C.y?-1:1;let Ee=rt(r.noise(N*.1,k*.1),0,1,.8,1.2);Ee=Math.max(1+Ye(0),Ee);const ze=K*Ee<5?Math.min(p,r.noise(N*.1,k*.2)+1.5*Math.max(y,K*Ee)):Math.min(p,Le*Math.max(h,K*Ee));this.line(N+Se*w+R,k+we*w+x,O+Se*w,P+we*w,ze,Ie,fe)}if(Ne(1)>.3){const Se=C.x?-1:1,we=C.y?1:-1;let Ee=rt(r.noise(N*.3+300,k*.3+300),0,1,.6,1.5);Ee=Math.max(1+Ye(1),Ee);const ze=Math.min(p,Le*Math.max(h,K*Ee));this.line(N+Se*w+R,k+we*w+x,O+Se*w,P+we*w,ze,Ie,Ge)}}else if(U===1){if(Ne(0)>.1){const Se=C.x?-1:1,we=C.y?-1:1;let Ee=rt(r.noise(N*.3+200,k*.1+100),0,1,.8,1.2);Ee=Math.max(1+Ye(0),Ee);const ze=Math.min(p,Le*Math.max(h,K*Ee));this.line(N+Se*w+R,k+we*w+x,O+Se*w,P+we*w,ze,Ie,fe)}if(Ne(1)>.05){const Se=C.x?-1:1,we=C.y?1:-1;let Ee=rt(r.noise(N*.2+300,k*.2+200),0,1,.8,1.2);Ee=Math.max(1+Ye(1),Ee);const ze=Math.min(p,Le*Math.max(h,K*Ee));this.line(N+Se*A+R,k+we*A+x,O+Se*A,P+we*A,ze,Ie,Ge)}if(Ne(2)>.15){let Se=rt(r.noise(N*.1+400,k*.3+300),0,1,.8,1.2);Se=Math.max(1+Ye(2),Se);const we=K*Se<5?Math.min(p,r.noise(N*1,k*2)+1.5*Math.max(y,K*Se)):Math.min(p,Le*Math.max(h,K*Se));this.line(N-S+R,k-S+x,O-S,P-S,we,Ie,ut)}}else if(U===2){const Se=rt(r.noise(N*.1+400,k*.1+200),0,1,.8,1.2);Gc.forEach((we,Ee)=>{if(Ne(Ee)<=we.threshold)return;const ze=we.base===1?A:we.base===2?w:S,D=Ee===0&&C.x?-we.sx:we.sx,lt=Ee===0&&C.y?-we.sy:we.sy;this.drawBranch(D*ze,lt*ze,N,k,O,P,R,x,K,Se,Ye(3+Ee),Ie,fe)})}else if(U===3){const Se=rt(r.noise(N*.1+400,k*.1+200),0,1,.85,1.15);let we=l*f;l>4&&(we*=s.random(.5,2.5)),Vc.forEach((Ee,ze)=>{const D=l>4?s.random(0,6.28):0;if(Ne(ze)<=Ee.threshold)return;const lt=Ai(Ee.angle+D)*Ee.radius*we,Je=_i(Ee.angle+D)*Ee.radius*we;this.drawBranch((C.x?-1:1)*lt,(C.y?-1:1)*Je,N,k,O,P,R,x,K,Se,Ye(Ee.jitter),Ie,fe)})}else if(U===4){const Se=rt(r.noise(N*.1+400,k*.1+200),0,1,.9,1.1),we=this.brushColorMode;let Ee=l*f;l>4&&(Ee*=s.random(.5,2.5)),Hc.forEach((ze,D)=>{const lt=l>4?s.random(0,6.28):0;if(Ne(D)<=ze.threshold)return;const Je=Ai(ze.angle+lt)*ze.radius*Ee,T=_i(ze.angle+lt)*ze.radius*Ee;this.drawBranch((C.x?-1:1)*Je,(C.y?-1:1)*T,N,k,O,P,R,x,K,Se,Ye(ze.jitter),we,255)})}}}drawDryBrush(e,t,i,s){const r=this.rng,a=this.effBaseSize(),o=this.baseBrushSize,c=Math.max(a<.25?.3:1,this.initialSize-this.strokeFrame*this.randStep),l=Math.min(o*2,5*c*this.penSketchNoiseBase*rt(_i(this.strokeFrame*2),0,1,.5,1.5)),d=Math.abs(e-i)>.1||Math.abs(t-s)>.1,u=this.inkJitter(this.inkGray),h=this.inkJitter(this.inkGray),m=[];for(let y=0;y<80;y++)m.push({t:r.random(0,1),weight:Math.max(a<.25?.1:.3,Math.min(a<.25?o*5:2,o*r.random(-.5,1))),angle:r.random(0,pi),radius:Math.sqrt(r.random(0,1))*l,alpha:r.random(150,255)});if(this.strokeFrame<=3)return;const g=this.inkGrayOf(u,h);for(const y of m){const p=y.radius*Ai(y.angle),f=y.radius*_i(y.angle),A=d?Wt(e,i,y.t)+p:e+p,w=d?Wt(t,s,y.t)+f:t+f;this.dot(A,w,y.weight,g,y.alpha)}}drawMarker(e,t){if(this.strokeFrame>=this.expectedStrokeLength)return;const i=this.rng,s=this.perlin,r=this.effBaseSize(),a=r<.25,o=a?r*5:9999,c=this.inkJitter(this.inkGray),l=this.inkJitter(this.inkGray),d=this.initialSize*.3;this.springInitialized||(this.springInitialized=!0,this.x=e,this.y=t),this.velX=(this.velX+(e-this.x)*this.spring)*this.friction,this.velY=(this.velY+(t-this.y)*this.spring)*this.friction,this.speed=Math.sqrt(this.velX*this.velX+this.velY*this.velY)*1.2;const u=this.baseBrushSize;this.speed*=u<=1?.9:u<=2?1.3:1.5,this.strokeWidth=this.sizeNow-this.speed;const h=this.smoothedWidth,m=this.strokeWidth,g=Math.hypot(e-this.x,t-this.y),y=Math.max(a?.1:.5,m*.5),p=1.5*Math.min(d,Math.max(a?.5:4,y)),f=Math.max(p*.6*.8,.5);let A=Math.max(1,Math.ceil(g/f));A=Math.max(10,Math.min(50,A));const w=A/this.interpSteps,S=Math.min(1,g/10),M=i.random(50,100),b=[];for(let E=0;E<this.interpSteps;++E){for(let P=0;P<4;P++)i.random(-1,1);const C=i.random(0,1),I=i.random(80,200),U=i.random(.8,1.2),O=[i.random(0,1),i.random(0,1),i.random(0,1),i.random(0,1),i.random(0,1)];b.push({show:C,alpha:I,widthMult:U,fly:O})}const R=this.inkGrayOf(c,l);let x=1;for(let E=0;E<this.interpSteps;++E){const C=b[E];if(!C)continue;const I=this.x,U=this.y;this.x+=this.velX/this.interpSteps,this.y+=this.velY/this.interpSteps;const O=this.x,P=this.y,N=(E+1)/this.interpSteps;this.smoothedWidth=Wt(this.smoothedWidth,Wt(h,m,N),.5),this.lineWidth+=(this.smoothedWidth-this.lineWidth)*.8,this.lineWidth=Math.max(a?.2:1.5,this.lineWidth);let k;const X=this.expectedStrokeLength;this.strokeFrame<5?k=Math.max(a?.1:.5,this.lineWidth*rt(this.strokeFrame,0,5,.05,1)):this.strokeFrame>=X-5?k=Math.max(a?.1:.5,this.lineWidth*rt(this.strokeFrame,X-5,X,1,.05)):k=Math.max(a?.1:.5,this.lineWidth);let te=.3;if(w>1?te=.3/w:w<1&&(te=.3*(2-w)),C.show>te&&this.strokeFrame>5){const W=Math.min(o,1.2*Math.min(d,Math.max(3*r,k))),$=O-I,j=P-U,ve=Math.sqrt($*$+j*j);ve>=.1&&(this.markerMove={x:$/ve,y:j/ve},this.markerAxis={x:-j/ve,y:$/ve});const xe=W*C.widthMult,Xe=xe*(.5+s.noise(O*.1,P*.1)*.5),Le=gt(R,0,255);this.ops.push({kind:"rect",x0:O,y0:P,x1:this.markerAxis.x,y1:this.markerAxis.y,w:xe,h:Xe,lw:x,r:Le,g:Le,b:Le,a:gt(C.alpha,0,255)})}if(S>.9&&this.strokeFrame>5&&this.strokeFrame<X-5){const W=-this.markerMove.y,$=this.markerMove.x;Wc.forEach((j,ve)=>{if((C.fly[ve]??0)<=j.threshold-S*.3)return;const xe=W*j.perp*r,Xe=$*j.perp*r;x=Math.min(o,Math.max(a?.1:.5,k*.3)),this.line(I+xe,U+Xe,O+xe,P+Xe,x,M,255)})}}}buildFlyBranchConfig(e){const t=this.rng;let i,s;e<=.1?(i=2,s=4):e<=.25?(i=4,s=7):e<=.5?(i=6,s=10):e<=2?(i=10,s=15):e<=3?(i=20,s=30):(i=30,s=50),t.seed(this.strokeSeed+5e4);const r=Math.floor(t.random(i,s+1)),a=this.strokeSeed+6e4,o=(l,d,u)=>(t.seed(a+l),t.random(d,u)),c=[];for(let l=0;l<r;l++){const d=o(l*1e3,-6,6),u=o(l*2e3+1,.5,1),h=o(l*3e3+2,1,2),m=o(l*4e3+3,.7,1.3);o(l*5e3+4,.8,1.2);const g=Math.floor(o(l*6e3+5,0,6)),y=o(l*7e3+6,0,8),p=o(l*8e3+7,1,2),f=o(l*9e3+8,0,1),A=o(l*1e4+9,0,1);c.push({perpOffset:d,randThreshold:u,sizeMultiplier:h,speedMultiplier:m,startOffset:g,endDistanceOffset:y,brushSpeedMultiplier:p,widthVariationFactor:f,offsetVariationFactor:A})}return c.sort((l,d)=>l.perpOffset-d.perpOffset)}drawGothic(e,t,i,s){if(this.strokeFrame>=this.expectedStrokeLength)return;const r=this.rng,a=this.perlin,o=e-i,c=t-s,l=Math.sqrt(o*o+c*c),d=rt(gt(l,3,50),0,50,.1,5);let u=0,h=1,m=0,g=-1;if(l>.1){const S=o/l,M=c/l;u=-M,h=S,m=M,g=-S}const y=rt(gt(d,.1,5),.1,5,20,1);r.seed(this.strokeSeed+this.strokeFrame*1e4+1);const p=Math.floor(r.random(0,y)),f=this.baseBrushSize;for(let S=0;S<p;S++){r.seed(this.strokeSeed+this.strokeFrame*1e3+this.sprayParticleCounter);const M=r.random(5,15)*f,b=e+r.random(-2,2)*f,R=t+r.random(-2,2)*f,x=r.random(0,1)>.5?1:-1;let E,C,I;this.brushColorMode===0?E=C=I=this.inkGray*.3:this.brushColorMode===1?E=C=I=150:this.brushColorMode===33?[E,C,I]=this.customBrushColor:[E,C,I]=Is(this.brushColorMode),this.sprayParticles.push({id:this.sprayParticleCounter++,location:{x:b,y:R},prevLocation:{x:b,y:R},radius:M,r:E,g:C,b:I,xOff:0,yOff:0,sideDirection:x})}const A=rt(gt(f||1,.1,4),.1,4,.01,.1),w=rt(gt(f||1,.1,4),.1,4,.1,.5);for(let S=this.sprayParticles.length-1;S>=0;S--){const M=this.sprayParticles[S];if(!M||M.radius<=0)continue;r.seed(this.strokeSeed+this.strokeFrame*1e3+M.id*100),M.radius-=r.random(A,w)*3,M.xOff+=r.random(-.5,.5)*d,M.yOff+=r.random(-.5,.5)*d;const b=2*d;r.random(0,1);const R=M.sideDirection,x=(R===1?m:u)*b,E=(R===1?g:h)*b,C=a.noise(M.location.x)*M.xOff,I=a.noise(M.location.y)*M.yOff;if(M.prevLocation.x=M.location.x,M.prevLocation.y=M.location.y,M.location.x+=2*(x*.2+C*.8),M.location.y+=2*(E*.2+I*.8),this.brushColorMode>=2){const P=a.noise(M.location.x*.01,M.location.y*.01)*5;M.r=gt(M.r+P,0,255),M.g=gt(M.g+P,0,255),M.b=gt(M.b+P,0,255)}else if(this.brushColorMode===0){const P=a.noise(M.location.x*.01,M.location.y*.01)*2;M.r=gt(M.r+P,0,200),M.g=gt(M.g+P,0,200),M.b=gt(M.b+P,0,200)}const U=r.random(0,1)>.2,O=r.random(0,1)>.99;M.radius>0?(U&&this.lineRgb(M.prevLocation.x,M.prevLocation.y,M.location.x,M.location.y,Math.max(1,M.radius*.5),M.r,M.g,M.b,200),O&&(M.radius=-1)):M.radius=-1}this.sprayParticles=this.sprayParticles.filter(S=>S.radius>0)}drawFlyBrush(e,t){if(this.strokeFrame>=this.expectedStrokeLength)return;const i=this.rng,s=this.perlin,r=this.inkJitter(this.inkGray),a=this.effBaseSize();this.springInitialized||(this.springInitialized=!0,this.x=e,this.y=t),this.velX=(this.velX+(e-this.x)*this.spring)*this.friction,this.velY=(this.velY+(t-this.y)*this.spring)*this.friction,this.speed=Math.sqrt(this.velX*this.velX+this.velY*this.velY)*.7,this.strokeWidth=this.sizeNow-this.speed;const o=this.smoothedWidth,c=this.strokeWidth,l=a<.25,d=a<1;i.random(30,70);const u=`${a}_${this.strokeSeed}`;let h=this.flyConfigs.get(u);h||(h=this.buildFlyBranchConfig(a),this.flyConfigs.set(u,h));const m=[];for(let y=0;y<this.interpSteps;++y){const p=[],f=[],A=[];for(let S=0;S<40;S++)p.push(i.random(.3,1.2)),f.push(s.noise(this.strokeFrame*.08+S*.15,this.strokeFrame*.08+S*.15+y*.01)),A.push(s.noise(this.strokeFrame*.1+S*.1,this.strokeFrame*.1+S*.1+y*.01));i.random(-1,1),i.random(-1,1),i.random(-1,1),i.random(-1,1);const w=i.random(0,1);i.random(80,200),i.random(.8,1.2),m.push({showMainBrush:w,flyWhiteRandoms:p,flyWhiteOffsetNoises:f,flyWhiteWidthNoises:A})}const g=this.expectedStrokeLength;for(let y=0;y<this.interpSteps;++y){const p=m[y];if(!p)continue;const f=this.x,A=this.y;this.x+=this.velX/this.interpSteps,this.y+=this.velY/this.interpSteps;const w=this.x,S=this.y,M=(y+1)/this.interpSteps;this.smoothedWidth=Wt(this.smoothedWidth,Wt(o,c,M),.5),this.lineWidth+=(this.smoothedWidth-this.lineWidth)*.8,this.lineWidth=Math.max(d?a*1.5:1.5,this.lineWidth);const b=w-f,R=S-A,x=Math.sqrt(b*b+R*R);x>=.1&&(this.flyMove={x:b/x,y:R/x});const E=this.flyMove,C=-E.y,I=E.x,U=Math.max(l?a*.4:d?a*.5:.5,this.sizeNow*.5),O=this.speed*.5,P=this.strokeFrame>=g-5,N=P?.7:1,k=this.strokeFrame>=g,X=P?this.strokeFrame-(g-5):0,te=P?Math.min(1,X/5):0;h.forEach((W,$)=>{if(this.strokeFrame<W.startOffset||k||(p.flyWhiteRandoms[$]??0)<=W.randThreshold*N)return;const j=p.flyWhiteOffsetNoises[$]??0,xe=1+(rt(j,0,1,1,2)-1)*W.offsetVariationFactor,Xe=d?Math.max(.3,a*3):a,Le=W.perpOffset*Xe*xe,ke=C*Le,Y=I*Le;let K=w,_e=S,Pe=f,fe=A;if(P){const D=W.endDistanceOffset*te*a;if(K=w+E.x*D,_e=S+E.y*D,X!==0){const lt=W.endDistanceOffset*Math.min(1,(X-1)/5)*a;Pe=w+E.x*lt,fe=S+E.y*lt}}const Ge=O*W.brushSpeedMultiplier*W.speedMultiplier,ut=Math.max(l||d?a*.3:.5,U-Ge)*.6,Ue=1+(rt(p.flyWhiteWidthNoises[$]??0,0,1,.8,1.2)-1)*W.widthVariationFactor,et=Math.max(0,rt($,0,h?.length??1,80,230)-s.noise(y*.5,$*.5)*30),Ne=Math.min(200,et)+i.random(-50,50),Ye=Math.max(1,ut*W.sizeMultiplier*Ue),Se=`${u}_${$}`,we=this.flyWeights.get(Se)??Ye,Ee=we<3?.15:we>=5?.3:Wt(.15,.3,(we-3)/2),ze=Wt(we,Ye,Ee);this.flyWeights.set(Se,ze),this.line(Pe+ke,fe+Y,K+ke,_e+Y,ze,r,Ne)})}}}const Yc=`
precision highp float;
in vec3 position;
uniform vec4 uRect;
uniform vec2 uCanvas;
out vec2 vPixel;
void main() {
  vec2 uv = position.xy * 0.5 + 0.5;
  vPixel = uRect.xy + uv * uRect.zw;
  gl_Position = vec4(
    vPixel.x / uCanvas.x * 2.0 - 1.0,
    vPixel.y / uCanvas.y * 2.0 - 1.0,
    0.0,
    1.0
  );
}
`,Kc=`
precision highp float;
in vec2 vPixel;
out vec4 finalColor;
uniform vec3 uColor;
void main() { finalColor = vec4(uColor, 1.0); }
`,Zc=`
precision highp float;
in vec2 vPixel;
out vec4 finalColor;
uniform vec4 uRect;
uniform sampler2D uStamp;
void main() {
  vec2 local = (vPixel - uRect.xy) / uRect.zw;
  vec4 stamp = texture(uStamp, vec2(local.x, 1.0 - local.y));
  finalColor = vec4(stamp.rgb, stamp.a);
}
`,$c=`
precision highp float;
in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
uniform sampler2D uSource;
void main() {
  finalColor = texture(uSource, vec2(vPixel.x / uCanvas.x, vPixel.y / uCanvas.y));
}
`;class Jc{constructor(e,t,i){this.renderer=e,this.width=t,this.height=i;const s=new Yt;s.setAttribute("position",new qt([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],3)),this.fillMat=this.material(Kc,{uColor:{value:new H(1,1,1)}}),this.blitMat=this.material(Zc,{uStamp:{value:zs()}},1),this.blitMat.transparent=!0,this.blitMat.premultipliedAlpha=!1,this.copyMat=this.material($c,{uSource:{value:zs()}}),this.mesh=new Vt(s,this.fillMat),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}width;height;scene=new vr;camera=new Bn(-1,1,1,-1,0,1);mesh;fillMat;blitMat;copyMat;stamp;disposed=!1;material(e,t,i=0){return new ur({glslVersion:jn,vertexShader:Yc,fragmentShader:`precision highp float;
${e}`,uniforms:{uCanvas:{value:new $e(this.width,this.height)},uRect:{value:new dt(0,0,this.width,this.height)},...t},blending:i,depthTest:!1,depthWrite:!1,toneMapped:!1})}target(){const e=new Nt(this.width,this.height,{depthBuffer:!1,stencilBuffer:!1,magFilter:1006,minFilter:1006,generateMipmaps:!1});return e.texture.colorSpace="",e.texture.flipY=!1,e}fill(e,t,i){const s=this.fillMat.uniforms.uColor;s&&s.value.set(i[0],i[1],i[2]),this.draw(this.fillMat,e,t)}clear(e,t){this.fill(e,{x:0,y:0,w:this.width,h:this.height},t)}blitStamp(e,t,i){if(t.w<1||t.h<1)return;!this.stamp||this.stamp.image.width!==t.w||this.stamp.image.height!==t.h?(this.stamp?.dispose(),this.stamp=new on(e,t.w,t.h,1023,1009),this.stamp.flipY=!0,this.stamp.magFilter=1006,this.stamp.minFilter=1006,this.stamp.colorSpace="",this.stamp.generateMipmaps=!1):this.stamp.image.data=e,this.stamp.needsUpdate=!0;const s=this.blitMat.uniforms.uStamp;s&&(s.value=this.stamp),this.draw(this.blitMat,i,t)}copy(e,t,i){this.blitTexture(e.texture,t,i)}read(e,t){this.renderer.readRenderTargetPixels(e,0,0,this.width,this.height,t)}blitTexture(e,t,i){const s=this.copyMat.uniforms.uSource;s&&(s.value=e),this.draw(this.copyMat,t,i)}draw(e,t,i){if(this.disposed)return;const s=e.uniforms.uRect;s&&s.value.set(i.x,i.y,i.w,i.h),this.mesh.material=e;const r=this.renderer.getRenderTarget(),a=this.renderer.autoClear;this.renderer.autoClear=!1,this.renderer.setRenderTarget(t),this.renderer.setViewport(0,0,this.width,this.height),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(r),this.renderer.autoClear=a}dispose(){this.disposed||(this.disposed=!0,this.fillMat.dispose(),this.blitMat.dispose(),this.copyMat.dispose(),this.stamp?.dispose(),this.mesh.geometry.dispose())}}function zs(){const n=new on(new Uint8Array([255,255,255,255]),1,1,1023,1009);return n.colorSpace="",n.needsUpdate=!0,n.magFilter=1006,n.minFilter=1006,n.generateMipmaps=!1,n}function Qc(n,e){const t=new Uint8Array(e.w*e.h*4);for(const i of n)i.kind==="line"?jc(t,e,i):i.kind==="dot"?eh(t,e,i):th(t,e,i);return t}function jc(n,e,t){const i=Math.max(t.w/2,.4),s=Math.max(0,Math.floor(Math.min(t.x0,t.x1)-i-e.x)),r=Math.min(e.w-1,Math.ceil(Math.max(t.x0,t.x1)+i-e.x)),a=Math.max(0,Math.floor(Math.min(t.y0,t.y1)-i-e.y)),o=Math.min(e.h-1,Math.ceil(Math.max(t.y0,t.y1)+i-e.y)),c=t.x1-t.x0,l=t.y1-t.y0,d=c*c+l*l;for(let u=a;u<=o;u++)for(let h=s;h<=r;h++){const m=e.x+h+.5,g=e.y+u+.5,y=d<1e-6?0:ih(((m-t.x0)*c+(g-t.y0)*l)/d),p=t.x0+c*y,f=t.y0+l*y;Math.sqrt((m-p)*(m-p)+(g-f)*(g-f))<=i&&Yn(n,(u*e.w+h)*4,t.r,t.g,t.b,t.a)}}function eh(n,e,t){const i=Math.max(t.w/2,.4),s=Math.max(0,Math.floor(t.x0-i-e.x)),r=Math.min(e.w-1,Math.ceil(t.x0+i-e.x)),a=Math.max(0,Math.floor(t.y0-i-e.y)),o=Math.min(e.h-1,Math.ceil(t.y0+i-e.y));for(let c=a;c<=o;c++)for(let l=s;l<=r;l++){const d=e.x+l+.5-t.x0,u=e.y+c+.5-t.y0;d*d+u*u<=i*i&&Yn(n,(c*e.w+l)*4,t.r,t.g,t.b,t.a)}}function th(n,e,t){const i=t.x1,s=t.y1,r=t.w/2,a=t.h/2,o=r+a+t.lw+1,c=Math.max(0,Math.floor(t.x0-o-e.x)),l=Math.min(e.w-1,Math.ceil(t.x0+o-e.x)),d=Math.max(0,Math.floor(t.y0-o-e.y)),u=Math.min(e.h-1,Math.ceil(t.y0+o-e.y));for(let h=d;h<=u;h++)for(let m=c;m<=l;m++){const g=e.x+m+.5-t.x0,y=e.y+h+.5-t.y0,p=g*i+y*s,f=g*-s+y*i;if(Math.abs(p)>r||Math.abs(f)>a)continue;r-Math.abs(p)<t.lw||a-Math.abs(f)<t.lw?Yn(n,(h*e.w+m)*4,t.r,t.g,t.b,t.a):Yn(n,(h*e.w+m)*4,255,255,255,255)}}function Yn(n,e,t,i,s,r){const a=Math.max(0,Math.min(255,r))/255,o=n[e]??0,c=n[e+1]??0,l=n[e+2]??0,d=(n[e+3]??0)/255,u=a+d*(1-a);u<=0||(n[e]=Math.round((t*a+o*d*(1-a))/u),n[e+1]=Math.round((i*a+c*d*(1-a))/u),n[e+2]=Math.round((s*a+l*d*(1-a))/u),n[e+3]=Math.round(u*255))}function ih(n){return n<0?0:n>1?1:n}const nh=`in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
vec4 T(sampler2D s, vec2 c) { return texture(s, vec2(c.x, 1.0 - c.y)); }
vec2 inkFragCoord() { return vec2(vPixel.x, uCanvas.y - vPixel.y); }
uniform sampler2D tex0;
uniform sampler2D forceMap;
uniform float force;
uniform float indiffusionStrength;
uniform float brushMode;
uniform float baseBrushSize;
uniform float useSharpen;
uniform float effect3Brightness;
uniform float brushColorMode;
uniform float brushCategory;
uniform float mouseCount;
uniform float mouseCountAccumulated;
uniform float strokeSeed;
float _x5(vec2 co){
return fract(sin(dot(co.xy,vec2(12.9898,78.233)))* 43758.5453);
}
float _x5(float _x13){
return fract(cos(_x13 * 89.42)* 343.42);
}
float _x6(float _x13){
return fract(sin(_x13)* 43758.5453);
}
float _x7(vec2 x){
vec2 _x11 = floor(x);
vec2 _x12 = fract(x);
_x12 = _x12 * _x12 *(3.0 - 2.0 * _x12);
float _x13 = _x11.x + _x11.y * 57.0;
return mix(mix(_x6(_x13 + 0.0),_x6(_x13 + 1.0),_x12.x),mix(_x6(_x13 + 57.0),_x6(_x13 + 58.0),_x12.x),_x12.y);
}
float _x8(float _x14,float amount){
return clamp(1.0 /(clamp(_x14,1.0 / amount,1.0)* amount),0.0,1.0);
}
float _x9(vec2 _x15,float _x16,float xmax){
return max(_x16 - _x15.x,_x15.x - xmax);
}
vec4 _x10(vec4 _x17,vec2 _x18,vec2 _x19,sampler2D tex0,float intensity){
float _x20 = dot(_x17.rgb,vec3(0.299,0.587,0.114));
float _x21 = 1.0 - _x20;
if (_x21 > 0.05){
float _x22 = _x7(_x18 * 15.0);
float _x23 = _x7(_x18 * 35.0 + vec2(12.3,45.7));
float _x24 =(_x22 * 0.6 + _x23 * 0.4);
float _x25 = 0.6;
float _x26 = smoothstep(_x25,_x25 + 0.2,_x24);
float _x27 = fract(sin(dot(_x18 * 100.0,vec2(12.9898,78.233)))* 43758.5453);
float _x28 = 1.5 + _x27 * 0.8;
vec2 _x29 = _x19 * _x28;
vec4 _x30 = T(tex0,_x18 + vec2(0.0,_x29.y));
vec4 _x31 = T(tex0,_x18 + vec2(0.0,-_x29.y));
vec4 _x32 = T(tex0,_x18 + vec2(-_x29.x,0.0));
vec4 _x33 = T(tex0,_x18 + vec2(_x29.x,0.0));
float _x34 = dot(_x30.rgb,vec3(0.299,0.587,0.114));
float _x35 = dot(_x31.rgb,vec3(0.299,0.587,0.114));
float _x3 = dot(_x32.rgb,vec3(0.299,0.587,0.114));
float _x4 = dot(_x33.rgb,vec3(0.299,0.587,0.114));
float _x36 = abs(_x20 - _x34)+ abs(_x20 - _x35)+ abs(_x20 - _x3)+ abs(_x20 - _x4);
_x36 = clamp(_x36 * 0.5,0.0,1.0);
float _x37 = 0.35 + _x27 * 0.2;
float _x38 = smoothstep(_x37,_x37 + 0.15,_x36);
float _x39 = smoothstep(0.85,0.95,_x38);
float _x40 = 0.6 + _x27 * 0.8;
float _x41 = smoothstep(0.3,0.8,_x21);
float _x42 = _x39 * _x41 * intensity * _x26;
float _x43 = 0.3 * _x40 * _x42;
_x17.rgb = mix(_x17.rgb,vec3(0.0),_x43);
}
return clamp(_x17,0.0,1.0);
}
void main(void){
vec2 _x18 =(inkFragCoord() / uCanvas);
vec2 _x44 = (1.0 / uCanvas);
bool _x46 = _x18.x < 0.002||_x18.x > 0.998||_x18.y < 0.002||_x18.y > 0.998;
if (_x46){
vec4 _x17 = T(tex0,_x18);
finalColor = _x17;
return;
}
vec4 _x47 = T(forceMap,_x18);
vec2 _x48 =(_x47.xy - vec2(0.5))* force * 0.2;
vec4 _x49 = T(tex0,_x18);
vec4 _x50 = T(tex0,_x18 + _x48 * _x44);
vec4 _x51 = min(_x49,_x50);
vec2 _x19 = _x44;
if (useSharpen < 0.5){
float _x52 = dot(_x49.rgb,vec3(0.299,0.587,0.114));
float _x53 = 1.0 - _x52;
if (_x53 < 0.01){
finalColor = _x49;
return;
}
float _x54 = dot(_x51.rgb,vec3(0.299,0.587,0.114));
float _x55 = 1.0 - _x54;
if (_x55 > 0.01){
vec2 _x56 = -normalize(_x48 + vec2(0.0001));
vec4 _x57 = vec4(0.0);
float _x58 = 0.0;
const float _x0 = 0.8;
const float _x1 = 2.0;
const float _x2 = 1.0;
vec2 offsets[4];
offsets[0] = vec2(0.0,1.0);
offsets[1] = vec2(0.0,-1.0);
offsets[2] = vec2(-1.0,0.0);
offsets[3] = vec2(1.0,0.0);
for (int _x59 = 0; _x59 < 4; _x59++){
vec2 _x60 = offsets[_x59] * _x19 * _x0;
vec4 _x61 = T(tex0,_x18 + _x60);
float _x62 = 1.0 - dot(_x61.rgb,vec3(0.299,0.587,0.114));
float _x63 = abs(_x55 - _x62);
float _x64 = dot(offsets[_x59],_x56);
float _x65 = 1.0 + max(0.0,_x64)* _x2;
float _x66 =(1.0 + _x63 * _x1)* _x65;
_x57+=_x61 * _x66 * 0.5;
_x58+=_x66;
}
_x57/=_x58;
if (force > 0.5){
float _x67 = smoothstep(0.05,0.6,_x55)* indiffusionStrength;
_x51 = mix(_x51,_x57,_x67);
float _x68 = fract(sin(dot(_x18 * 100.0,vec2(12.9898,78.233)))* 43758.5453);
_x68 = _x68 * 0.17 - 0.12;
float _x69 =(1.0 - _x55 * 0.5);
_x51.rgb+=_x68 * _x69 * _x55;
float _x70 = dot(normalize(_x48 + vec2(0.001)),vec2(1.0,1.0))* 0.5 + 0.5;
float _x71 = mix(0.90,1.06,_x70);
if (_x55 > 0.1){
_x51.rgb*=_x71;
}
if (_x55 < 0.5){
float _x72 =(0.3 - _x55)* 0.15;
_x51.rgb+=_x72;
}
}
}
_x51 = clamp(_x51,0.0,1.0);
vec4 _x17 = _x51;
finalColor = clamp(_x17,0.0,1.0);
}
else if (useSharpen < 1.5){
float _x73 = dot(_x49.rgb,vec3(0.299,0.587,0.114));
if (_x73 > 0.99){
finalColor = _x49;
return;
}
if (brushCategory > 0.5){
vec4 _x17 = _x51;
float _x20 = dot(_x17.rgb,vec3(0.299,0.587,0.114));
float _x21 = 1.0 - _x20;
if (_x21 > 0.1){
float _x74 = fract(sin(dot(_x18 * 25.0,vec2(12.9898,78.233)))* 43758.5453);
float _x75 = fract(sin(dot(_x18 * 50.0,vec2(45.164,94.673)))* 19134.9521);
float _x76 = _x74 * 0.6 + _x75 * 0.4;
float _x77 = step(0.35,_x76);
_x17.rgb+=(_x77 - 0.5)* 0.15 * _x21;
float _x78 = fract(sin(dot(_x18 * 110.0,vec2(67.521,23.845)))* 31415.9265);
float _x79 = fract(sin(dot(_x18 * 180.0,vec2(31.628,52.741)))* 27182.8182);
float _x80 = _x78 * 0.7 + _x79 * 0.3;
float _x81 = step(0.4,_x80);
_x17.rgb+=(_x81 - 0.5)* 0.12 * _x21;
float _x82 = fract(sin(dot(_x18 * 320.0,vec2(89.123,67.456)))* 53241.6789);
float _x83 = step(0.5,_x82);
_x17.rgb+=(_x83 - 0.5)* 0.10 * _x21;
float _x84 = fract(sin(dot(_x18 * 480.0,vec2(23.456,91.234)))* 67890.1234);
float _x85 = fract(sin(dot(_x18 * 620.0,vec2(54.321,78.901)))* 45678.9012);
float _x86 = _x84 * 0.6 + _x85 * 0.4;
float _x87 = step(0.55,_x86);
_x17.rgb+=(_x87 - 0.5)* 0.08 * _x21;
float _x88 = _x7(_x18 * 120.0);
_x17.rgb+=(_x88 - 0.5)* 0.02 * _x21;
}
finalColor = clamp(_x17,0.0,1.0);
return;
}
vec4 _x17 = _x51;
float _x20 = dot(_x17.rgb,vec3(0.299,0.587,0.114));
float _x21 = 1.0 - _x20;
if (_x21 > 0.2){
float _x89 = fract(sin(dot(_x18 * 15.0,vec2(12.9898,78.233)))* 43758.5453);
float _x90 = fract(sin(dot(_x18 * 35.0,vec2(45.164,94.673)))* 19134.9521);
float _x91 = fract(sin(dot(_x18 * 80.0,vec2(67.521,23.845)))* 31415.9265);
float _x92 = _x89 * 0.6 + _x90 * 0.3 + _x91 * 0.1;
_x92 = pow(_x92,0.6);
float _x93 = smoothstep(0.1,0.8,_x92);
vec4 _x94 = _x17;
if (brushCategory < 0.5){
vec2 _x95 = _x19 * 1.3;
vec4 _x96 = vec4(0.0);
_x96+=T(tex0,_x18 + vec2(0.0,_x95.y))* 0.15;
_x96+=T(tex0,_x18 + vec2(0.0,-_x95.y))* 0.15;
_x96+=T(tex0,_x18 + vec2(_x95.x,0.0))* 0.15;
_x96+=T(tex0,_x18 + vec2(-_x95.x,0.0))* 0.15;
_x94 = mix(_x17,_x96,0.7);
}
vec2 _x97 = _x19 * 0.8;
vec4 _x34 = T(tex0,_x18 + vec2(0.0,_x97.y));
vec4 _x35 = T(tex0,_x18 + vec2(0.0,-_x97.y));
vec4 _x3 = T(tex0,_x18 + vec2(_x97.x,0.0));
vec4 _x4 = T(tex0,_x18 + vec2(-_x97.x,0.0));
vec4 _x98 = _x17 * 5.0 -(_x34 + _x35 + _x3 + _x4);
float _x99 = dot(_x98.rgb,vec3(0.299,0.587,0.114));
float _x100 = clamp(abs(_x99)* 3.0,0.0,1.0);
float _x101 = 0.2;
vec4 _x102 = mix(_x17,_x17 + _x98 * _x101,_x100);
vec4 _x103 =(_x93 > 0.5)? _x94 : _x102;
float _x104 = 0.8;
float _x105 =(1.0 - _x93)* _x104;
float _x55 = _x21;
float _x106 = 1.0 + _x55;
_x105*=_x106;
float _x107 = 0.1;
_x103.rgb = _x103.rgb *(1.0 + _x105 * _x107);
_x103 = _x10(_x103,_x18,_x19,tex0,2.0);
finalColor = clamp(_x103,0.0,1.0);
}
else {
finalColor = _x17;
}
}
else if (useSharpen < 2.5){
float _x73 = dot(_x49.rgb,vec3(0.299,0.587,0.114));
if (_x73 > 0.99){
finalColor = _x49;
return;
}
vec4 _x17 = _x51;
float _x20 = dot(_x17.rgb,vec3(0.299,0.587,0.114));
float _x21 = 1.0 - _x20;
if (_x21 > 0.05){
float _x27 = fract(sin(dot(_x18 * 100.0,vec2(12.9898,78.233)))* 43758.5453);
float _x28 = 2.0 + _x27 * 1.5;
vec2 _x29 = _x19 * _x28;
float _x34 = dot(T(tex0,_x18 + vec2(0.0,_x29.y)).rgb,vec3(0.299,0.587,0.114));
float _x35 = dot(T(tex0,_x18 + vec2(0.0,-_x29.y)).rgb,vec3(0.299,0.587,0.114));
float _x3 = dot(T(tex0,_x18 + vec2(-_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114));
float _x4 = dot(T(tex0,_x18 + vec2(_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114));
float _x36 = abs(_x20 - _x34)+ abs(_x20 - _x35)+ abs(_x20 - _x3)+ abs(_x20 - _x4);
_x36 = clamp(_x36 * .5,0.0,1.0);
float _x37 = 0.15 + _x27 * 0.3;
float _x38 = smoothstep(_x37,_x37 + 0.3,_x36);
float _x40 = 0.5 + _x27 * 1.5;
float _x108,centerShift,shiftStrength;
if (brushCategory > 0.5){
_x108 = -0.25 * _x40;
centerShift = 0.15 * _x40;
shiftStrength = 1.5;
}
else {
_x108 = -0.55 * _x40;
centerShift = 0.3 * _x40;
shiftStrength = 0.05;
}
float _x109 = mix(centerShift,_x108,_x38);
float _x41 = smoothstep(0.3,0.8,_x21);
_x109*=_x41;
_x109 = _x109 * shiftStrength;
_x17.rgb+=_x109;
float _x110 = _x7(_x18 *(16.3 + 5.0 *(mouseCount / 40.0))+ fract(strokeSeed / 1200.0));
_x110+=_x7(_x18 *(5.0 + 5.0 *(mouseCount / 40.0))+ fract(strokeSeed / 1300.0))* 0.2;
_x110 = _x110 / 2.0;
if (_x110 < 0.5){
float _x111 =(0.5 - _x110)* 0.3 *(0.8 + _x27 * 0.4);
if (brushCategory > 0.5){
}
else {
float _x112 = _x7(_x18 * 8.5 + vec2(12.3,45.7));
_x112 = _x7(_x18 * 12.0 + vec2(23.1,67.8))* 0.7 + _x112 * 0.3;
_x112 = smoothstep(0.3,0.85,_x112);
float _x113 = _x21 * 0.6;
float _x114 = mix(_x113 * 0.3,_x113 * 1.8,_x112);
_x17.rgb-=_x111 * _x114;
}
}
float _x115 = _x27 * 6.28318;
vec2 _x116 = vec2(cos(_x115),sin(_x115));
vec2 _x117 = _x18 * 2.0 + _x116 * 20.0 + fract(strokeSeed / 1400.0);
float _x118 = _x7(_x117);
_x118+=_x7(_x117 * 1.8 + fract(strokeSeed / 1500.0))* 0.1;
_x118 =(_x118 / 1.4 - 0.5)* 0.1 *(0.7 + _x27 * 0.6);
float _x119 = _x7(_x18 * 7.2 + vec2(34.5,89.1)+ fract(strokeSeed / 1600.0));
_x119 = _x7(_x18 * 11.5 + vec2(56.7,23.4)+ fract(strokeSeed / 1700.0))* 0.6 + _x119 * 0.4;
_x119 = smoothstep(0.25,0.9,_x119);
float _x120 = _x21 * 0.5;
float _x121 = mix(_x120 * 0.1,_x120,_x119);
_x17.rgb+=_x118 * _x121 *(1.0 - _x38 * 2.4);
}
finalColor = clamp(_x17,0.0,1.0);
return;
}
else if (useSharpen < 3.5){
float _x73 = dot(_x49.rgb,vec3(0.299,0.587,0.114));
if (_x73 > 0.99){
finalColor = _x49;
return;
}
vec4 _x17 = _x51;
float _x20 = dot(_x17.rgb,vec3(0.299,0.587,0.114));
float _x21 = 1.0 - _x20;
bool _x122 = force > 0.1;
if (_x122&&_x21 > 0.1){
vec2 _x15 = _x18 * 100.0;
const float _x3 = 18.0;
const float _x4 = 20.0;
float _x123 = _x9(_x15,_x3,_x4);
float _x124 = dot(normalize(_x48 + vec2(0.001)),vec2(1.0,0.0));
_x123-=_x124 * 2.0;
float _x125 = 50.0 + _x5(_x15.y)* 100.0;
float _x126 = _x8(_x123,_x125)* smoothstep(0.2,0.7,_x21);
_x17.rgb = mix(_x17.rgb,_x17.rgb * 0.7,_x126 * 0.3);
_x17.rgb+=(_x5(_x15)- 0.5)* 0.03 * _x21;
}
if (_x122&&_x21 > 0.1){
float _x127 = _x7(_x18 * 40.0);
_x127+=_x7(_x18 * 80.0)* 0.5;
_x127/=1.5;
float _x128 = smoothstep(0.55,0.75,_x127);
_x17.rgb+=vec3(_x128 * 0.02);
float _x129 = _x7(_x18 * 200.0);
_x129+=_x7(_x18 * 400.0)* 0.5;
_x129/=1.5;
float _x83 = smoothstep(0.78,0.95,_x129);
_x17.rgb+=vec3(_x83 * 0.2);
}
if (_x122&&_x21 > 0.1){
float _x130 = _x7(_x18 * 50.0)* 0.5;
_x130+=_x7(_x18 * 100.0)* 0.3;
_x130+=_x7(_x18 * 200.0)* 0.2;
float _x131 =(_x130 - 0.5)* 0.12;
float _x132 = smoothstep(0.2,0.5,_x21)*(1.0 - smoothstep(0.7,0.9,_x21));
_x17.rgb+=_x131 * _x132;
}
finalColor = clamp(_x17,0.0,1.0);
}
else if (useSharpen < 4.5){
float _x133 = _x7((_x18 * 32.0 * fract(strokeSeed / 100.0))+ 0.5);
float _x134 = mix(0.05,2.0,_x133);
_x134 = max(0.0,_x134);
float _x135;
if (baseBrushSize>=1.0){
_x135 = 0.75;
}
else if (baseBrushSize>=0.5){
_x135 = mix(0.5,1.0,(baseBrushSize - 0.5)/ 0.5);
}
else if (baseBrushSize>=0.25){
_x135 = mix(0.2,0.5,(baseBrushSize - 0.25)/ 0.25);
}
else {
_x135 = 0.2;
}
vec2 _x44 = _x134 * (1.0 / uCanvas) * _x135;
vec4 _x47 = T(forceMap,_x18);
float _x136 = clamp(baseBrushSize / 1.5,0.5,2.0);
vec2 _x137 =(_x47.xy - vec2(0.5))* _x44 * _x136;
float _x138 = _x7(_x18 * 12.0 + vec2(mouseCount * 0.1,mouseCount * 0.2)+ fract(strokeSeed / 200.0));
float _x139 =(_x138 - 0.5)* 10.0;
float _x140 = _x139 * _x136;
float _x141 = atan(_x137.y,_x137.x);
float _x142 = _x141 + _x140;
float _x143 = length(_x137);
vec2 _x144 = vec2(cos(_x142),sin(_x142))* _x143;
float _x145 = _x7(_x18 * 8.0 + mouseCount * 0.1 + fract(strokeSeed / 300.0))* 6.28318;
float _x146 = 0.50;
vec2 _x147 = vec2(cos(_x145),sin(_x145))* _x44 * _x146 * _x136;
vec2 _x148 = clamp(_x18 + _x144,vec2(0.01),vec2(0.99));
vec2 _x149 = clamp(_x18 + _x144 + _x147,vec2(0.01),vec2(0.99));
vec2 _x150 = clamp(_x18 + _x144 - _x147 * 0.6,vec2(0.01),vec2(0.99));
vec4 _x151 = T(tex0,_x18);
vec4 _x152 = T(tex0,_x148);
vec4 _x153 = T(tex0,_x149);
vec4 _x154 = T(tex0,_x150);
vec4 _x155 = min(_x152,min(_x153,_x154));
vec4 _x156;
if (brushColorMode==1.0){
_x156 = max(_x151,_x155);
}
else {
_x156 = min(_x151,_x155);
}
float _x157 = dot(_x156.rgb,vec3(0.299,0.587,0.114));
if (_x157 > 0.99){
finalColor = clamp(_x151,0.0,0.95);
return;
}
float _x55 = 1.0 - _x157;
bool _x122 = force > 0.1;
float _x73 = dot(_x151.rgb,vec3(0.299,0.587,0.114));
float _x53 = 1.0 - _x73;
float _x158 = dot(_x155.rgb,vec3(0.299,0.587,0.114));
float _x159 = 1.0 - _x158;
vec2 _x160 = _x47.xy - vec2(0.5);
float _x161 = length(_x160);
float _x162 = clamp(_x161 / 0.707,0.0,1.0);
vec2 _x48 = _x160 * force * 0.2;
float _x163 = length(_x48);
bool _x164 = _x122&&_x163 > 0.0001&&_x159 > _x53 + 0.08;
float _x165 = mix(0.3,1.5,_x162);
if (_x55 > 0.1){
float _x166 = _x7(_x18 * 2.0 + mouseCount * 0.02 + fract(strokeSeed / 400.0));
float _x167 = _x7(_x18 * 50.0 + mouseCount * 0.03 + fract(strokeSeed / 500.0));
float _x168 = _x7(_x18 * 400.0 + fract(strokeSeed / 600.0));
float _x169 = _x166 * 0.5 + _x167 * 0.3 + _x168 * 0.2;
float _x170 = smoothstep(0.75,0.92,_x169);
float _x171 = _x170 * _x55;
_x156.rgb = mix(_x156.rgb,vec3(1.0),_x171);
float _x172 = mix(0.80,0.95,1.0 - _x55);
_x156.rgb = min(_x156.rgb,vec3(_x172));
if (_x164&&_x53 > 0.05){
float _x27 = fract(sin(dot(_x18 * 100.0,vec2(12.9898,78.233))+ strokeSeed)* 43758.5453);
float _x28 = 1.0 + _x27 * 2.0;
vec2 _x29 = _x19 * _x28;
float _x34 = dot(T(tex0,_x18 + vec2(0.0,_x29.y)).rgb,vec3(0.299,0.587,0.114));
float _x35 = dot(T(tex0,_x18 + vec2(0.0,-_x29.y)).rgb,vec3(0.299,0.587,0.114));
float _x3 = dot(T(tex0,_x18 + vec2(-_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114));
float _x4 = dot(T(tex0,_x18 + vec2(_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114));
float _x36 = abs(_x73 - _x34)+ abs(_x73 - _x35)+ abs(_x73 - _x3)+ abs(_x73 - _x4);
_x36 = clamp(_x36 * .5,0.0,1.0);
float _x37 = 0.15 + _x27 * 0.3;
float _x38 = smoothstep(_x37,_x37 + 0.3,_x36);
float _x40 = 0.5 + _x27 * 1.5;
float _x108,centerShift,shiftStrength;
if (brushCategory > 0.5){
_x108 = -0.25 * _x40;
centerShift = 0.15 * _x40;
shiftStrength = 1.5;
}
else {
_x108 = -0.05 * _x40;
centerShift = 0.8 * _x40;
shiftStrength = 0.02;
}
float _x109 = mix(centerShift,_x108,_x38);
float _x41 = smoothstep(0.1,0.8,_x53);
_x109*=_x41;
_x109 = _x109 * shiftStrength;
_x109*=_x165;
vec3 _x173 = vec3(_x109);
_x156.rgb+=_x173 * _x55;
float _x110 = _x7(_x18 *(16.3 + 5.0 *(mouseCount / 40.0))+ fract(strokeSeed / 700.0));
_x110+=_x7(_x18 *(15.2 + 8.0 *(mouseCount / 40.0))+ fract(strokeSeed / 800.0))* 0.2;
_x110 = _x110 / 1.5;
if (_x110 < 0.5){
float _x111 =(0.5 - _x110)* 0.3 *(0.8 + _x27 * 0.4);
if (brushCategory > 0.5){
}
else {
_x156.rgb-=_x111 * _x55 * _x165;
}
}
float _x115 = _x27 * 6.28318;
vec2 _x116 = vec2(cos(_x115),sin(_x115));
vec2 _x117 = _x18 * 50.0 + _x116 * 20.0 + fract(strokeSeed / 1000.0);
float _x118 = _x7(_x117);
_x118+=_x7(_x117 * 1.8 + fract(strokeSeed / 1100.0))* 0.4;
_x118 =(_x118 / 1.4 - 0.5)* 0.1 *(0.7 + _x27 * 0.6);
_x156.rgb+=_x118 * _x55 *(1.0 - _x38 * 0.4)* _x165;
float _x74 = fract(sin(dot(_x18 * 25.0,vec2(12.9898,78.233)))* 43758.5453);
float _x75 = fract(sin(dot(_x18 * 50.0,vec2(45.164,94.673)))* 19134.9521);
float _x76 = _x74 * 0.6 + _x75 * 0.4;
float _x77 = step(0.35,_x76);
_x156.rgb+=(_x77 - 0.5)* 0.15 * _x55 * _x165;
float _x78 = fract(sin(dot(_x18 * 110.0,vec2(67.521,23.845)))* 31415.9265);
float _x79 = fract(sin(dot(_x18 * 180.0,vec2(31.628,52.741)))* 27182.8182);
float _x80 = _x78 * 0.7 + _x79 * 0.3;
float _x81 = step(0.4,_x80);
_x156.rgb+=(_x81 - 0.5)* 0.2 * _x55 * _x165;
float _x82 = fract(sin(dot(_x18 * 320.0,vec2(89.123,67.456)))* 53241.6789);
float _x83 = step(0.5,_x82);
_x156.rgb+=(_x83 - 0.5)* 0.10 * _x55 * _x165;
float _x84 = fract(sin(dot(_x18 * 480.0,vec2(23.456,91.234)))* 67890.1234);
float _x85 = fract(sin(dot(_x18 * 620.0,vec2(54.321,78.901)))* 45678.9012);
float _x86 = _x84 * 0.6 + _x85 * 0.4;
float _x87 = step(0.55,_x86);
_x156.rgb+=(_x87 - 0.5)* 0.08 * _x55 * _x165;
float _x88 = _x7(_x18 * 120.0);
_x156.rgb+=(_x88 - 0.5)* 0.02 * _x55 * _x165;
}
}
finalColor = clamp(_x156,0.0,1.0);
}
else if (useSharpen < 5.5){
float _x174 = 0.3;
float _x175 = 1.0;
if (brushColorMode < 1.0){
_x175 = 0.7;
}
else {
_x175 = 2.0;
}
float _x176 = mouseCountAccumulated;
float _x177 = fract(strokeSeed / 10000.0);
float _x178 = fract(strokeSeed / 1000000.0);
float _x133 = _x7((_x18 * 32.0 + vec2(_x177 * 10.0,_x178 * 10.0))+ _x176 * 0.01);
float _x134 = mix(0.05,2.0,_x133);
_x134 = max(0.0,_x134);
float _x135;
if (baseBrushSize>=1.0){
_x135 = 0.75;
}
else if (baseBrushSize>=0.5){
_x135 = mix(0.5,1.0,(baseBrushSize - 0.5)/ 0.5);
}
else if (baseBrushSize>=0.25){
_x135 = mix(0.2,0.5,(baseBrushSize - 0.25)/ 0.25);
}
else {
_x135 = 0.2;
}
_x135*=_x174;
vec2 _x44 = _x134 * (1.0 / uCanvas) * _x135;
vec4 _x47 = T(forceMap,_x18);
float _x136 = clamp(baseBrushSize / 1.5,0.5,2.0);
vec2 _x137 =(_x47.xy - vec2(0.5))* _x44 * _x136;
float _x138 = _x7(_x18 * 12.0 + vec2(_x176 * 0.1,_x176 * 0.2)+ fract(strokeSeed / 200.0));
float _x139 =(_x138 - 0.5)* 10.0;
float _x140 = _x139 * _x136;
float _x141 = atan(_x137.y,_x137.x);
float _x142 = _x141 + _x140;
float _x143 = length(_x137);
vec2 _x144 = vec2(cos(_x142),sin(_x142))* _x143;
float _x145 = _x7(_x18 * 8.0 + _x176 * 0.1 + fract(strokeSeed / 300.0))* 6.28318;
float _x146 = 0.50;
vec2 _x147 = vec2(cos(_x145),sin(_x145))* _x44 * _x146 * _x136;
vec2 _x148 = clamp(_x18 + _x144,vec2(0.01),vec2(0.99));
vec2 _x149 = clamp(_x18 + _x144 + _x147,vec2(0.01),vec2(0.99));
vec2 _x150 = clamp(_x18 + _x144 - _x147 * 0.6,vec2(0.01),vec2(0.99));
vec4 _x151 = T(tex0,_x18);
vec4 _x152 = T(tex0,_x148);
vec4 _x153 = T(tex0,_x149);
vec4 _x154 = T(tex0,_x150);
vec4 _x155 = min(_x152,min(_x153,_x154));
vec4 _x156;
if (brushColorMode==1.0){
_x156 = max(_x151,_x155);
}
else {
_x156 = min(_x151,_x155);
}
float _x157 = dot(_x156.rgb,vec3(0.299,0.587,0.114));
if (_x157 > 0.99){
finalColor = clamp(_x151,0.0,0.95);
return;
}
float _x55 = 1.0 - _x157;
bool _x122 = force > 0.1;
float _x73 = dot(_x151.rgb,vec3(0.299,0.587,0.114));
float _x53 = 1.0 - _x73;
float _x158 = dot(_x155.rgb,vec3(0.299,0.587,0.114));
float _x159 = 1.0 - _x158;
vec2 _x160 = _x47.xy - vec2(0.5);
float _x161 = length(_x160);
float _x162 = clamp(_x161 / 0.707,0.0,1.0);
vec2 _x48 = _x160 * force * 0.2;
float _x163 = length(_x48);
bool _x164 = _x122&&_x163 > 0.0001&&_x159 > _x53 + 0.08;
float _x165 = mix(0.3,1.5,_x162);
if (_x164&&_x55 > 0.1){
float _x179 = mix(0.80,0.70,smoothstep(0.1,0.8,_x55));
_x156.rgb*=_x179;
}
if (_x55 > 0.1){
float _x166 = _x7(_x18 * 2.0 + _x176 * 0.02 + fract(strokeSeed / 400.0));
float _x167 = _x7(_x18 * 50.0 + _x176 * 0.03 + fract(strokeSeed / 500.0));
float _x168 = _x7(_x18 * 400.0 + fract(strokeSeed / 600.0));
float _x169 = _x166 * 0.5 + _x167 * 0.3 + _x168 * 0.2;
float _x170 = smoothstep(0.75,0.92,_x169);
float _x171 = _x170 * _x55;
_x156.rgb = mix(_x156.rgb,vec3(1.0),_x171);
if (_x53 > 0.05){
float _x27 = fract(sin(dot(_x18 * 100.0,vec2(12.9898,78.233))+ strokeSeed)* 43758.5453);
float _x180 = _x7(_x18 * 8.0 + fract(strokeSeed / 2000.0));
float _x181 = _x7(_x18 * 3.0 + fract(strokeSeed / 2100.0))* 0.6;
float _x182 = _x7(_x18 * 100.0 + fract(strokeSeed / 2200.0))* 0.2;
float _x183 =(_x180 + _x181 + _x182)/ 1.9;
float _x184 = 1.5;
float _x185 = 2.0;
float _x186 = 0.6;
float _x187 = _x7(_x18 * 12.0 + fract(strokeSeed / 2300.0));
float _x188 = mix(1.0,_x187,_x186);
float _x189 = mix(1.0 / _x184,_x184,_x183)* _x188 * _x185;
float _x190 = mix(0.5,1.5,_x183);
float _x191 = mix(0.0,2.0,_x183);
float _x192 = mix(0.01,2.0,_x183);
float _x28 =(1.0 + _x27 * 2.0)* _x191;
vec2 _x29 = _x19 * _x28;
float _x34 = dot(T(tex0,_x18 + vec2(0.0,_x29.y)).rgb,vec3(0.299,0.587,0.114));
float _x35 = dot(T(tex0,_x18 + vec2(0.0,-_x29.y)).rgb,vec3(0.299,0.587,0.114));
float _x3 = dot(T(tex0,_x18 + vec2(-_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114));
float _x4 = dot(T(tex0,_x18 + vec2(_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114));
float _x36 = abs(_x73 - _x34)+ abs(_x73 - _x35)+ abs(_x73 - _x3)+ abs(_x73 - _x4);
_x36 = clamp(_x36 * .5,0.0,1.0);
float _x37 = 0.15 + _x27 * 0.3;
float _x38 = smoothstep(_x37,_x37 + 0.3,_x36);
float _x40 = 0.5 + _x27 * 1.5;
float _x108,centerShift,shiftStrength;
if (brushCategory > 0.5){
_x108 = -0.25 * _x40;
centerShift = 0.15 * _x40;
shiftStrength = 1.5;
}
else {
_x108 = -0.05 * _x40;
centerShift = 0.8 * _x40;
shiftStrength = 0.02;
}
float _x109 = mix(centerShift,_x108,_x38);
float _x41 = smoothstep(0.1,0.8,_x53);
_x109*=_x41;
_x109 = _x109 * shiftStrength;
float _x193 = _x164 ? _x165 : 0.7;
_x193*=_x175;
_x193*=_x190;
_x109*=_x193;
vec3 _x173 = vec3(_x109);
_x156.rgb+=_x173 * _x55;
float _x194 = mod(_x176,40.0);
float _x110 = _x7(_x18 *(16.3 + 5.0 *(_x194 / 40.0))* _x191 * _x189 + fract(strokeSeed / 700.0)+ _x176 * 0.001);
_x110+=_x7(_x18 *(15.2 + 8.0 *(_x194 / 40.0))* _x191 * _x189 + fract(strokeSeed / 800.0)+ _x176 * 0.001)* 0.2;
_x110 = _x110 / 1.5;
if (_x110 < 0.5){
float _x111 =(0.5 - _x110)* 0.3 *(0.8 + _x27 * 0.4);
if (brushCategory > 0.5){
}
else {
_x156.rgb-=_x111 * _x55 * _x193 * _x192;
}
}
float _x115 = _x27 * 6.28318;
vec2 _x116 = vec2(cos(_x115),sin(_x115));
vec2 _x117 = _x18 * 50.0 * _x191 * _x189 + _x116 * 20.0 + fract(strokeSeed / 1000.0);
float _x118 = _x7(_x117);
_x118+=_x7(_x117 * 1.8 + fract(strokeSeed / 1100.0))* 0.4;
_x118 =(_x118 / 1.4 - 0.5)* 0.1 *(0.7 + _x27 * 0.6);
_x156.rgb+=_x118 * _x55 *(1.0 - _x38 * 0.4)* _x193 * _x192;
float _x74 = fract(sin(dot(_x18 * 25.0 * _x191 * _x189,vec2(12.9898,78.233)))* 43758.5453);
float _x75 = fract(sin(dot(_x18 * 50.0 * _x191 * _x189,vec2(45.164,94.673)))* 19134.9521);
float _x76 = _x74 * 0.6 + _x75 * 0.4;
float _x77 = step(0.35 * _x192,_x76);
_x156.rgb+=(_x77 - 0.5)* 0.15 * _x55 * _x193 * _x192;
float _x78 = fract(sin(dot(_x18 * 110.0 * _x191 * _x189,vec2(67.521,23.845)))* 31415.9265);
float _x79 = fract(sin(dot(_x18 * 180.0 * _x191 * _x189,vec2(31.628,52.741)))* 27182.8182);
float _x80 = _x78 * 0.7 + _x79 * 0.3;
float _x81 = step(0.4 * _x192,_x80);
_x156.rgb+=(_x81 - 0.5)* 0.2 * _x55 * _x193 * _x192;
float _x82 = fract(sin(dot(_x18 * 320.0 * _x191 * _x189,vec2(89.123,67.456)))* 53241.6789);
float _x83 = step(0.5 * _x192,_x82);
_x156.rgb+=(_x83 - 0.5)* 0.10 * _x55 * _x193 * _x192;
float _x84 = fract(sin(dot(_x18 * 480.0 * _x191 * _x189,vec2(23.456,91.234)))* 67890.1234);
float _x85 = fract(sin(dot(_x18 * 620.0 * _x191 * _x189,vec2(54.321,78.901)))* 45678.9012);
float _x86 = _x84 * 0.6 + _x85 * 0.4;
float _x87 = step(0.55 * _x192,_x86);
_x156.rgb+=(_x87 - 0.5)* 0.08 * _x55 * _x193 * _x192;
float _x88 = _x7(_x18 * 120.0 * _x191 * _x189);
_x156.rgb+=(_x88 - 0.5)* 0.02 * _x55 * _x193 * _x192;
}
}
finalColor = clamp(_x156,0.0,1.0);
}
}`,sh=`in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
vec4 T(sampler2D s, vec2 c) { return texture(s, vec2(c.x, 1.0 - c.y)); }
vec2 inkFragCoord() { return vec2(vPixel.x, uCanvas.y - vPixel.y); }
uniform sampler2D baseTex;
uniform sampler2D strokeTex;
uniform float brushColorMode;
uniform float brushCategory;
uniform float whiteMaxOpacity;
uniform float hueShift;
uniform float satShift;
uniform float briShift;
uniform int keyBlendMode;
uniform float useSharpen;
uniform vec3 canvasBackgroundColor;
uniform vec3 customBrushColor;
uniform sampler2D typeMapTex;
uniform float useSpectralMix;
const int _x0 = 38;
const float _x1 = 2.4;
const float _x2 = 0.0000000000000001;
float _x38(float x){
return (x < 0.04045)? x / 12.92 : pow((x + 0.055)/ 1.055,_x1);
}
float _x39(float x){
return (x < 0.0031308)? x * 12.92 : 1.055 * pow(x,1.0 / _x1)- 0.055;
}
vec3 _x40(vec3 srgb){
return vec3(_x38(srgb[0]),_x38(srgb[1]),_x38(srgb[2]));
}
vec3 _x41(vec3 _x49){
return clamp(vec3(_x39(_x49[0]),_x39(_x49[1]),_x39(_x49[2])),0.,1.);
}
void _x42(vec3 _x49,inout float R[_x0]){
float _x50 = min(_x49.r,min(_x49.g,_x49.b));
_x49-=_x50;
float _x51 = min(_x49.g,_x49.b);
float _x52 = min(_x49.r,_x49.b);
float _x53 = min(_x49.r,_x49.g);
float _x54 = min(max(0.0,_x49.r - _x49.b),max(0.0,_x49.r - _x49.g));
float _x55 = min(max(0.0,_x49.g - _x49.b),max(0.0,_x49.g - _x49.r));
float _x56 = min(max(0.0,_x49.b - _x49.g),max(0.0,_x49.b - _x49.r));
R[ 0] = max(_x2,_x50*1.0011607271876400 + _x51*0.9705850013229620 + _x52*0.9906735573199880 + _x53*0.0210523371789306 + _x54*0.0315605737777207 + _x55*0.0095560747554212 + _x56*0.9794047525020140);
R[ 1] = max(_x2,_x50*1.0011606515972800 + _x51*0.9705924981434250 + _x52*0.9906715249619790 + _x53*0.0210564627517414 + _x54*0.0315520718330149 + _x55*0.0095581580120851 + _x56*0.9794007068431300);
R[ 2] = max(_x2,_x50*1.0011603192274700 + _x51*0.9706253487298910 + _x52*0.9906625823534210 + _x53*0.0210746178695038 + _x54*0.0315148215513658 + _x55*0.0095673245444588 + _x56*0.9793829034702610);
R[ 3] = max(_x2,_x50*1.0011586727078900 + _x51*0.9707868061190170 + _x52*0.9906181076447950 + _x53*0.0211649058448753 + _x54*0.0313318044982702 + _x55*0.0096129126297349 + _x56*0.9792943649455940);
R[ 4] = max(_x2,_x50*1.0011525984455200 + _x51*0.9713686732282480 + _x52*0.9904514808787100 + _x53*0.0215027957272504 + _x54*0.0306729857725527 + _x55*0.0097837090401843 + _x56*0.9789630146085700);
R[ 5] = max(_x2,_x50*1.0011325252899800 + _x51*0.9731632306212520 + _x52*0.9898710814002040 + _x53*0.0226738799041561 + _x54*0.0286480476989607 + _x55*0.0103786227058710 + _x56*0.9778144666940430);
R[ 6] = max(_x2,_x50*1.0010850066332700 + _x51*0.9767402231587650 + _x52*0.9882866087596400 + _x53*0.0258235649693629 + _x54*0.0246450407045709 + _x55*0.0120026452378567 + _x56*0.9747243211338360);
R[ 7] = max(_x2,_x50*1.0009968788945300 + _x51*0.9815876054913770 + _x52*0.9842906927975040 + _x53*0.0334879385639851 + _x54*0.0192960753663651 + _x55*0.0160977721473922 + _x56*0.9671984823439730);
R[ 8] = max(_x2,_x50*1.0008652515227400 + _x51*0.9862802656529490 + _x52*0.9739349056253060 + _x53*0.0519069663740307 + _x54*0.0142066612220556 + _x55*0.0267061902231680 + _x56*0.9490796575305750);
R[ 9] = max(_x2,_x50*1.0006962900094000 + _x51*0.9899491476891340 + _x52*0.9418178384601450 + _x53*0.1007490148334730 + _x54*0.0102942608878609 + _x55*0.0595555440185881 + _x56*0.9008501289409770);
R[10] = max(_x2,_x50*1.0005049611488800 + _x51*0.9924927015384200 + _x52*0.8173903261951560 + _x53*0.2391298997068470 + _x54*0.0076191460521811 + _x55*0.1860398265328260 + _x56*0.7631504454622400);
R[11] = max(_x2,_x50*1.0003080818799200 + _x51*0.9941456804052560 + _x52*0.4324728050657290 + _x53*0.5348043122727480 + _x54*0.0058980410835420 + _x55*0.5705798201161590 + _x56*0.4659221716493190);
R[12] = max(_x2,_x50*1.0001196660201300 + _x51*0.9951839750332120 + _x52*0.1384539782588700 + _x53*0.7978075786430300 + _x54*0.0048233247781713 + _x55*0.8614677684002920 + _x56*0.2012632804510050);
R[13] = max(_x2,_x50*0.9999527659684070 + _x51*0.9957567501108180 + _x52*0.0537347216940033 + _x53*0.9114498940673840 + _x54*0.0042298748350633 + _x55*0.9458790897676580 + _x56*0.0877524413419623);
R[14] = max(_x2,_x50*0.9998218368992970 + _x51*0.9959128182867100 + _x52*0.0292174996673231 + _x53*0.9537979630045070 + _x54*0.0040599171299341 + _x55*0.9704654864743050 + _x56*0.0457176793291679);
R[15] = max(_x2,_x50*0.9997386095575930 + _x51*0.9956061578345280 + _x52*0.0213136517508590 + _x53*0.9712416154654290 + _x54*0.0043533695594676 + _x55*0.9784136302844500 + _x56*0.0284706050521843);
R[16] = max(_x2,_x50*0.9997095516396120 + _x51*0.9945976009618540 + _x52*0.0201349530181136 + _x53*0.9793031238075880 + _x54*0.0053434425970201 + _x55*0.9795890314112240 + _x56*0.0205271767569850);
R[17] = max(_x2,_x50*0.9997319302106270 + _x51*0.9922157154923700 + _x52*0.0241323096280662 + _x53*0.9833801195075750 + _x54*0.0076917201010463 + _x55*0.9755335369086320 + _x56*0.0165302792310211);
R[18] = max(_x2,_x50*0.9997994363461950 + _x51*0.9862364527832490 + _x52*0.0372236145223627 + _x53*0.9854612465677550 + _x54*0.0135969795736536 + _x55*0.9622887553978130 + _x56*0.0145135107212858);
R[19] = max(_x2,_x50*0.9999003303166710 + _x51*0.9679433372645410 + _x52*0.0760506552706601 + _x53*0.9864350469766050 + _x54*0.0316975442661115 + _x55*0.9231215745131200 + _x56*0.0136003508637687);
R[20] = max(_x2,_x50*1.0000204065261100 + _x51*0.8912850042449430 + _x52*0.2053754719423990 + _x53*0.9867382506701410 + _x54*0.1078611963552490 + _x55*0.7934340189431110 + _x56*0.0133604258769571);
R[21] = max(_x2,_x50*1.0001447879365800 + _x51*0.5362024778620530 + _x52*0.5412689034604390 + _x53*0.9866178824450320 + _x54*0.4638126031687040 + _x55*0.4592701359024290 + _x56*0.0135488943145680);
R[22] = max(_x2,_x50*1.0002599790341200 + _x51*0.1541081190018780 + _x52*0.8158416850864860 + _x53*0.9862777767586430 + _x54*0.8470554052720110 + _x55*0.1855741036663030 + _x56*0.0139594356366992);
R[23] = max(_x2,_x50*1.0003557969708900 + _x51*0.0574575093228929 + _x52*0.9128177041239760 + _x53*0.9858605924440560 + _x54*0.9431854093939180 + _x55*0.0881774959955372 + _x56*0.0144434255753570);
R[24] = max(_x2,_x50*1.0004275378026900 + _x51*0.0315349873107007 + _x52*0.9463398301669620 + _x53*0.9854749276762100 + _x54*0.9688621506965580 + _x55*0.0543630228766700 + _x56*0.0148854440621406);
R[25] = max(_x2,_x50*1.0004762334488800 + _x51*0.0222633920086335 + _x52*0.9599276963319910 + _x53*0.9851769347655580 + _x54*0.9780306674736030 + _x55*0.0406288447060719 + _x56*0.0152254296999746);
R[26] = max(_x2,_x50*1.0005072096750800 + _x51*0.0182022841492439 + _x52*0.9662605952303120 + _x53*0.9849715740141810 + _x54*0.9820436438543060 + _x55*0.0342215204316970 + _x56*0.0154592848180209);
R[27] = max(_x2,_x50*1.0005251915637300 + _x51*0.0162990559732640 + _x52*0.9693259700584240 + _x53*0.9848463034157120 + _x54*0.9839236237187070 + _x55*0.0311185790956966 + _x56*0.0156018026485961);
R[28] = max(_x2,_x50*1.0005350960689600 + _x51*0.0153656239334613 + _x52*0.9708545367213990 + _x53*0.9847753518111990 + _x54*0.9848454841543820 + _x55*0.0295708898336134 + _x56*0.0156824871281936);
R[29] = max(_x2,_x50*1.0005402209748200 + _x51*0.0149111568733976 + _x52*0.9716050665281280 + _x53*0.9847380666252650 + _x54*0.9852942758145960 + _x55*0.0288108739348928 + _x56*0.0157248764360615);
R[30] = max(_x2,_x50*1.0005427281678400 + _x51*0.0146954339898235 + _x52*0.9719627697573920 + _x53*0.9847196483117650 + _x54*0.9855072952198250 + _x55*0.0284486271324597 + _x56*0.0157458108784121);
R[31] = max(_x2,_x50*1.0005438956908700 + _x51*0.0145964146717719 + _x52*0.9721272722745090 + _x53*0.9847110233919390 + _x54*0.9856050715398370 + _x55*0.0282820301724731 + _x56*0.0157556123350225);
R[32] = max(_x2,_x50*1.0005444821215100 + _x51*0.0145470156699655 + _x52*0.9722094177458120 + _x53*0.9847066833006760 + _x54*0.9856538499335780 + _x55*0.0281988376490237 + _x56*0.0157605443964911);
R[33] = max(_x2,_x50*1.0005447695999200 + _x51*0.0145228771899495 + _x52*0.9722495776784240 + _x53*0.9847045543930910 + _x54*0.9856776850338830 + _x55*0.0281581655342037 + _x56*0.0157629637515278);
R[34] = max(_x2,_x50*1.0005448988776200 + _x51*0.0145120341118965 + _x52*0.9722676219987420 + _x53*0.9847035963093700 + _x54*0.9856883918061220 + _x55*0.0281398910216386 + _x56*0.0157640525629106);
R[35] = max(_x2,_x50*1.0005449625468900 + _x51*0.0145066940939832 + _x52*0.9722765094621500 + _x53*0.9847031240775520 + _x54*0.9856936646900310 + _x55*0.0281308901665811 + _x56*0.0157645892329510);
R[36] = max(_x2,_x50*1.0005449892705800 + _x51*0.0145044507314479 + _x52*0.9722802433068740 + _x53*0.9847029256150900 + _x54*0.9856958798482050 + _x55*0.0281271086805816 + _x56*0.0157648147772649);
R[37] = max(_x2,_x50*1.0005449969930000 + _x51*0.0145038009464639 + _x52*0.9722813248265600 + _x53*0.9847028681227950 + _x54*0.9856965214637620 + _x55*0.0281260133612096 + _x56*0.0157648801149616);
}
vec3 _x43(vec3 _x58){
mat3 _x57;
_x57[0] = vec3(3.2409699419045200,-1.537383177570090,-0.4986107602930030);
_x57[1] = vec3(-0.9692436362808790,1.875967501507720,0.0415550574071756);
_x57[2] = vec3(0.0556300796969936,-0.203976958888976,1.0569715142428700);
float _x54 = dot(_x57[0],_x58);
float _x55 = dot(_x57[1],_x58);
float _x56 = dot(_x57[2],_x58);
return _x41(vec3(_x54,_x55,_x56));
}
vec3 _x44(float R[_x0]){
vec3 _x58 = vec3(0.);
_x58+=R[ 0] * vec3(0.0000646919989576,0.0000018442894440,0.0003050171476380);
_x58+=R[ 1] * vec3(0.0002194098998132,0.0000062053235865,0.0010368066663574);
_x58+=R[ 2] * vec3(0.0011205743509343,0.0000310096046799,0.0053131363323992);
_x58+=R[ 3] * vec3(0.0037666134117111,0.0001047483849269,0.0179543925899536);
_x58+=R[ 4] * vec3(0.0118805536037990,0.0003536405299538,0.0570775815345485);
_x58+=R[ 5] * vec3(0.0232864424191771,0.0009514714056444,0.1136516189362870);
_x58+=R[ 6] * vec3(0.0345594181969747,0.0022822631748318,0.1733587261835500);
_x58+=R[ 7] * vec3(0.0372237901162006,0.0042073290434730,0.1962065755586570);
_x58+=R[ 8] * vec3(0.0324183761091486,0.0066887983719014,0.1860823707062960);
_x58+=R[ 9] * vec3(0.0212332056093810,0.0098883960193565,0.1399504753832070);
_x58+=R[10] * vec3(0.0104909907685421,0.0152494514496311,0.0891745294268649);
_x58+=R[11] * vec3(0.0032958375797931,0.0214183109449723,0.0478962113517075);
_x58+=R[12] * vec3(0.0005070351633801,0.0334229301575068,0.0281456253957952);
_x58+=R[13] * vec3(0.0009486742057141,0.0513100134918512,0.0161376622950514);
_x58+=R[14] * vec3(0.0062737180998318,0.0704020839399490,0.0077591019215214);
_x58+=R[15] * vec3(0.0168646241897775,0.0878387072603517,0.0042961483736618);
_x58+=R[16] * vec3(0.0286896490259810,0.0942490536184085,0.0020055092122156);
_x58+=R[17] * vec3(0.0426748124691731,0.0979566702718931,0.0008614711098802);
_x58+=R[18] * vec3(0.0562547481311377,0.0941521856862608,0.0003690387177652);
_x58+=R[19] * vec3(0.0694703972677158,0.0867810237486753,0.0001914287288574);
_x58+=R[20] * vec3(0.0830531516998291,0.0788565338632013,0.0001495555858975);
_x58+=R[21] * vec3(0.0861260963002257,0.0635267026203555,0.0000923109285104);
_x58+=R[22] * vec3(0.0904661376847769,0.0537414167568200,0.0000681349182337);
_x58+=R[23] * vec3(0.0850038650591277,0.0426460643574120,0.0000288263655696);
_x58+=R[24] * vec3(0.0709066691074488,0.0316173492792708,0.0000157671820553);
_x58+=R[25] * vec3(0.0506288916373645,0.0208852059213910,0.0000039406041027);
_x58+=R[26] * vec3(0.0354739618852640,0.0138601101360152,0.0000015840125870);
_x58+=R[27] * vec3(0.0214682102597065,0.0081026402038399,0.0000000000000000);
_x58+=R[28] * vec3(0.0125164567619117,0.0046301022588030,0.0000000000000000);
_x58+=R[29] * vec3(0.0068045816390165,0.0024913800051319,0.0000000000000000);
_x58+=R[30] * vec3(0.0034645657946526,0.0012593033677378,0.0000000000000000);
_x58+=R[31] * vec3(0.0014976097506959,0.0005416465221680,0.0000000000000000);
_x58+=R[32] * vec3(0.0007697004809280,0.0002779528920067,0.0000000000000000);
_x58+=R[33] * vec3(0.0004073680581315,0.0001471080673854,0.0000000000000000);
_x58+=R[34] * vec3(0.0001690104031614,0.0000610327472927,0.0000000000000000);
_x58+=R[35] * vec3(0.0000952245150365,0.0000343873229523,0.0000000000000000);
_x58+=R[36] * vec3(0.0000490309872958,0.0000177059860053,0.0000000000000000);
_x58+=R[37] * vec3(0.0000199961492222,0.0000072209749130,0.0000000000000000);
return _x58;
}
float _x45(float R){
return pow(1.0 - R,2.0)/(2.0 * R);
}
float _x46(float KS){
return 1.0 + KS - sqrt(pow(KS,2.0)+ 2.0 * KS);
}
vec3 _x47(vec3 _x51){
vec4 _x59 = vec4(0.0,-1.0 / 3.0,2.0 / 3.0,-1.0);
vec4 _x60 = mix(vec4(_x51.bg,_x59.wz),vec4(_x51.gb,_x59.xy),step(_x51.b,_x51.g));
vec4 _x61 = mix(vec4(_x60.xyw,_x51.r),vec4(_x51.r,_x60.yzx),step(_x60.x,_x51.r));
float _x62 = _x61.x - min(_x61.w,_x61.y);
float _x63 = 1.0e-10;
return vec3(abs(_x61.z +(_x61.w - _x61.y)/(6.0 * _x62 + _x63)),_x62 /(_x61.x + _x63),_x61.x);
}
vec3 _x48(vec3 _x51){
vec3 _x64 = clamp(abs(mod(_x51.x * 6.0 + vec3(0.0,4.0,2.0),6.0)- 3.0)- 1.0,0.0,1.0);
_x64 = _x64 * _x64 *(3.0 - 2.0 * _x64);
return _x51.z * mix(vec3(1.0),_x64,_x51.y);
}
const vec3 _x3 = vec3(26.0 / 255.0,26.0 / 255.0,26.0 / 255.0);
const vec3 _x4 = vec3(242.0 / 255.0,242.0 / 255.0,242.0 / 255.0);
const vec3 _x5 = vec3(47.0 / 255.0,47.0 / 255.0,47.0 / 255.0);
const vec3 _x6 = vec3(85.0 / 255.0,85.0 / 255.0,85.0 / 255.0);
const vec3 _x7 = vec3(150.0 / 255.0,150.0 / 255.0,150.0 / 255.0);
const vec3 _x8 = vec3(63.0 / 255.0,77.0 / 255.0,24.0 / 255.0);
const vec3 _x9 = vec3(255.0 / 255.0,160.0 / 255.0,62.0 / 255.0);
const vec3 _x10 = vec3(175.0 / 255.0,140.0 / 255.0,89.0 / 255.0);
const vec3 _x11 = vec3(4.0 / 255.0,130.0 / 255.0,130.0 / 255.0);
const vec3 _x12 = vec3(57.0 / 255.0,80.0 / 255.0,192.0 / 255.0);
const vec3 _x13 = vec3(140.0 / 255.0,106.0 / 255.0,172.0 / 255.0);
const vec3 _x14 = vec3(138.0 / 255.0,149.0 / 255.0,73.0 / 255.0);
const vec3 _x15 = vec3(136.0 / 255.0,122.0 / 255.0,125.0 / 255.0);
const vec3 _x16 = vec3(138.0 / 255.0,57.0 / 255.0,26.0 / 255.0);
const vec3 _x17 = vec3(112.0 / 255.0,79.0 / 255.0,57.0 / 255.0);
const vec3 _x18 = vec3(168.0 / 255.0,200.0 / 255.0,72.0 / 255.0);
const vec3 _x19 = vec3(240.0 / 255.0,170.0 / 255.0,207.0 / 255.0);
const vec3 _x20 = vec3(128.0 / 255.0,49.0 / 255.0,52.0 / 255.0);
const vec3 _x21 = vec3(233.0 / 255.0,175.0 / 255.0,52.0 / 255.0);
const vec3 _x22 = vec3(128.0 / 255.0,125.0 / 255.0,114.0 / 255.0);
const vec3 _x23 = vec3(121.0 / 255.0,132.0 / 255.0,129.0 / 255.0);
const vec3 _x24 = vec3(159.0 / 255.0,114.0 / 255.0,85.0 / 255.0);
const vec3 _x25 = vec3(181.0 / 255.0,180.0 / 255.0,185.0 / 255.0);
const vec3 _x26 = vec3(235.0 / 255.0,220.0 / 255.0,201.0 / 255.0);
const vec3 _x27 = vec3(148.0 / 255.0,162.0 / 255.0,158.0 / 255.0);
const vec3 _x28 = vec3(210.0 / 255.0,169.0 / 255.0,151.0 / 255.0);
const vec3 _x29 = vec3(165.0 / 255.0,162.0 / 255.0,147.0 / 255.0);
const vec3 _x30 = vec3(203.0 / 255.0,243.0 / 255.0,251.0 / 255.0);
const vec3 _x31 = vec3(174.0 / 255.0,161.0 / 255.0,164.0 / 255.0);
const vec3 _x32 = vec3(155.0 / 255.0,155.0 / 255.0,155.0 / 255.0);
const vec3 _x33 = vec3(208.0 / 255.0,34.0 / 255.0,63.0 / 255.0);
const vec3 _x34 = vec3(255.0 / 255.0,249.0 / 255.0,56.0 / 255.0);
const vec3 _x35 = vec3(2.0 / 255.0,66.0 / 255.0,109.0 / 255.0);
const vec3 _x36 = vec3(255.0 / 255.0,127.0 / 255.0,80.0 / 255.0);
const vec3 _x37 = vec3(152.0 / 255.0,251.0 / 255.0,152.0 / 255.0);
void main(){
vec2 _x65 =(inkFragCoord() / uCanvas);
vec4 _x66 = T(baseTex,_x65);
vec3 _x68 = _x66.rgb;
float _x69 = _x66.a;
vec3 _x70 = T(strokeTex,_x65).rgb;
float _x71 = dot(_x70,vec3(0.299,0.587,0.114));
float _x72 = brushColorMode;
int _x73 = int(brushColorMode + 0.5);
vec3 _x74;
if (_x73==0){
_x74 = _x3;
}
else if (_x73==1){
_x74 = _x4;
}
else if (_x73==29){
_x74 = canvasBackgroundColor;
}
else if (_x73==33){
_x74 = customBrushColor;
}
else if (_x73==2){
_x74 = _x5;
}
else if (_x73==3){
_x74 = _x6;
}
else if (_x73==4){
_x74 = _x7;
}
else if (_x73==12){
_x74 = _x15;
}
else if (_x73==22){
_x74 = _x25;
}
else if (_x73==13){
_x74 = _x16;
}
else if (_x73==19){
_x74 = _x22;
}
else if (_x73==26){
_x74 = _x29;
}
else if (_x73==20){
_x74 = _x23;
}
else if (_x73==24){
_x74 = _x27;
}
else if (_x73==28){
_x74 = _x31;
}
else if (_x73==23){
_x74 = _x26;
}
else if (_x73==25){
_x74 = _x28;
}
else if (_x73==14){
_x74 = _x17;
}
else if (_x73==21){
_x74 = _x24;
}
else if (_x73==7){
_x74 = _x10;
}
else if (_x73==8){
_x74 = _x11;
}
else if (_x73==5){
_x74 = _x8;
}
else if (_x73==15){
_x74 = _x18;
}
else if (_x73==11){
_x74 = _x14;
}
else if (_x73==9){
_x74 = _x12;
}
else if (_x73==32){
_x74 = _x35;
}
else if (_x73==10){
_x74 = _x13;
}
else if (_x73==17){
_x74 = _x20;
}
else if (_x73==27){
_x74 = _x30;
}
else if (_x73==16){
_x74 = _x19;
}
else if (_x73==30){
_x74 = _x33;
}
else if (_x73==18){
_x74 = _x21;
}
else if (_x73==6){
_x74 = _x9;
}
else if (_x73==31){
_x74 = _x34;
}
else if (_x73==34){
_x74 = _x36;
}
else if (_x73==35){
_x74 = _x37;
}
else {
_x74 = _x3;
}
vec3 _x75;
float _x76 = clamp(1.0 - _x71,0.0,1.0);
float _x77 = 0.0;
if (_x71 > 0.9){
_x75 = _x68;
finalColor = vec4(_x75,_x69);
return;
}
if (_x76 < 0.001){
_x75 = _x68;
}
else {
if (brushCategory > 0.5){
float _x78 = pow(_x76,0.5);
float _x79 = mix(1.0,0.5,_x78);
_x75 = vec3(_x79);
}
else {
vec3 _x80 = _x74;
if (_x72 > 1.0){
vec3 _x81 = _x47(_x74);
if (_x72==29.0){
_x81.x = 0.0;
_x81.y = 0.0;
_x81.z = 1.0;
_x80 = _x48(_x81);
}
else {
float _x82 = 1.0;
if (_x72==2.0||_x72==3.0||_x72==4.0){
_x82 = 0.0;
}
float _x83 =(_x81.z > 0.6)?(0.95 - _x81.z): briShift;
_x81.x = mod(_x81.x + hueShift * _x82,1.0);
_x81.y = clamp(_x81.y + satShift * _x82,0.0,1.0);
_x81.z = clamp(_x81.z + _x83 * _x82,0.0,0.95);
_x80 = _x48(_x81);
}
}
if (useSharpen==3.0||useSharpen==2.0||useSharpen==1.0){
_x77 = pow(_x76,0.7);
}
else if (useSharpen==0.0){
_x77 = 1.02 * clamp(0.15 +(1.0 - 0.15)* pow(_x76,0.6),0.0,1.0);
}
else if (useSharpen==4.0||useSharpen==5.0){
if (_x72==0.0){
_x77 = pow(_x76,1.5)* 0.98;
}
else {
_x77 = pow(_x76,0.7);
}
}
else {
_x77 = 0.0;
}
float _x84 = dot(_x80,vec3(0.299,0.587,0.114));
vec3 _x85;
if (useSharpen==0.0&&_x72 > 1.0){
if (_x84 > 0.65){
_x85 = vec3(_x84 * 0.8);
}
else {
_x85 = vec3(0.95);
}
}
else {
_x85 = vec3(0.95);
}
float _x86 = dot(_x68,vec3(0.299,0.587,0.114));
float _x87 = max(max(abs(_x68.r - _x68.g),abs(_x68.g - _x68.b)),abs(_x68.b - _x68.r));
bool _x88 = _x87 < 0.05;
vec4 _x89 = T(typeMapTex,_x65);
bool _x90 =(_x89.r > 0.75)||(_x88&&_x86 > 0.7)||(_x86 > 0.85&&_x87 < 0.15);
bool _x91 =(_x72==0.0)||(_x72!=0.0&&(_x90||keyBlendMode==0));
vec3 _x92;
if (_x91){
_x92 = mix(_x85,_x80,_x77);
}
else {
_x92 = vec3(0.0);
}
if (_x72==0.0){
if (useSharpen==4.0||useSharpen==0.0||useSharpen==5.0){
if (_x88){
if (_x90){
vec3 _x93 = mix(_x68,_x92,_x77);
vec3 _x94 = _x47(_x93);
_x94.y = clamp(_x94.z * 0.0,0.0,1.0);
_x94.z = clamp(_x94.z * 1.0,0.0,1.0);
_x75 = _x48(_x94);
}
else {
_x75 = min(_x68,_x92);
}
}
else {
vec3 _x93 = min(_x68,_x92);
vec3 _x94 = _x47(_x93);
_x94.y = 0.0;
_x94.z = clamp(_x94.z * 1.0,0.0,1.0);
_x75 = _x48(_x94);
}
}
else {
if (_x88){
vec3 _x93 = mix(_x68,_x92,_x77);
vec3 _x94 = _x47(_x93);
_x94.y = clamp(_x94.z * 0.0,0.0,1.0);
_x94.z = clamp(_x94.z * 1.0,0.0,1.0);
_x75 = _x48(_x94);
}
else {
vec3 _x93 = mix(_x68,_x92,_x77);
_x93 = min(_x68,_x92);
vec3 _x94 = _x47(_x93);
_x94.y = clamp(_x94.y * 0.0,0.0,1.0);
_x94.z = clamp(_x94.z * 1.1,0.0,1.0);
_x75 = _x48(_x94);
}
}
}
else {
if (_x90){
vec3 _x95 = _x92;
vec3 _x94 = _x47(_x95);
if (_x94.y < 0.05){
_x94.y = 0.0;
}
else {
_x94.y = clamp(_x94.y * 0.9,0.0,1.0);
}
_x94.z = clamp(_x94.z * 1.02,0.0,1.0);
_x75 = _x48(_x94);
}
else {
if (useSpectralMix > 0.5){
vec3 _x96 = _x40(_x68);
vec3 _x97 = _x40(_x80);
float sR1[_x0];
float sR2[_x0];
_x42(_x96,sR1);
_x42(_x97,sR2);
float sR[_x0];
for (int _x98 = 0; _x98 < _x0; _x98++){
sR[_x98] = pow(sR1[_x98],0.35)* pow(sR2[_x98],0.65);
}
vec3 _x99 = _x43(_x44(sR));
vec3 _x100 = _x47(_x99);
_x100.y = clamp(_x100.y * 1.2,0.0,1.0);
_x99 = _x48(_x100);
_x75 = mix(_x68,_x99,_x77);
}
else if (keyBlendMode==0){
_x75 = mix(_x68,_x92,_x77);
}
else if (keyBlendMode==1){
vec3 _x101 = mix(vec3(1.0),_x80,_x77);
_x75 = _x68 * _x101;
}
else if (keyBlendMode==2){
vec3 _x102 = min(_x68,_x80);
_x75 = mix(_x68,_x102,_x77);
}
}
}
}
}
float _x103;
if (_x72==0.0){
_x103 = 0.99;
}
else if (_x72 > 1.0){
_x103 = 0.995 + _x77 * 0.005;
_x103 = clamp(_x103,0.995,1.0);
}
else {
_x103 = 0.99;
}
float inkA = floor(_x103 * 255.0 + 0.5) / 255.0;
finalColor = vec4(clamp(_x75 + (1.0 - inkA), 0.0, 1.0), 1.0);
}`,rh=`in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
vec4 T(sampler2D s, vec2 c) { return texture(s, vec2(c.x, 1.0 - c.y)); }
vec2 inkFragCoord() { return vec2(vPixel.x, uCanvas.y - vPixel.y); }
uniform sampler2D baseTex;
uniform sampler2D strokeTex;
uniform float brushCategory;
uniform float whiteMaxOpacity;
void main(){
vec2 _x0 =(inkFragCoord() / uCanvas);
vec4 _x1 = T(baseTex,_x0);
vec3 _x3 = T(strokeTex,_x0).rgb;
float _x4 = dot(_x3,vec3(0.299,0.587,0.114));
if (_x4 < 0.9){
float _x5;
float _x6;
if (brushCategory > 0.5){
_x5 = 1.0;
_x6 = whiteMaxOpacity;
}
else {
_x5 = 0.5;
_x6 = 0.0;
}
finalColor = vec4(_x5,_x6,0.0,1.0);
}
else {
finalColor = _x1;
}
}`,ah=`in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
vec4 T(sampler2D s, vec2 c) { return texture(s, vec2(c.x, 1.0 - c.y)); }
vec2 inkFragCoord() { return vec2(vPixel.x, uCanvas.y - vPixel.y); }
uniform sampler2D baseTex;
uniform sampler2D encodedTex;
uniform sampler2D typeMapTex;
uniform float useSharpen;
uniform float brushColorMode;
vec3 _x0(vec3 c){
vec4 _x3 = vec4(0.0,-1.0 / 3.0,2.0 / 3.0,-1.0);
vec4 _x4 = mix(vec4(c.bg,_x3.wz),vec4(c.gb,_x3.xy),step(c.b,c.g));
vec4 _x5 = mix(vec4(_x4.xyw,c.r),vec4(c.r,_x4.yzx),step(_x4.x,c.r));
float _x6 = _x5.x - min(_x5.w,_x5.y);
float _x7 = 1.0e-10;
return vec3(abs(_x5.z +(_x5.w - _x5.y)/(6.0 * _x6 + _x7)),_x6 /(_x5.x + _x7),_x5.x);
}
float _x1(vec2 co){
return fract(sin(dot(co.xy,vec2(12.9898,78.233)))* 43758.5453);
}
float _x2(vec3 _x8,float _x9,float storedMaxOpacity){
if (_x9 > 0.75){
float _x10 = _x8.r;
float _x11 =(1.0 - _x10)/ 0.5;
_x11 = clamp(_x11,0.0,1.0);
_x11*=clamp(storedMaxOpacity,0.0,1.0);
return _x11;
}
float _x12 = dot(_x8,vec3(0.299,0.587,0.114));
return clamp(1.0 - _x12,0.0,1.0);
}
void main(){
vec2 _x13 =(inkFragCoord() / uCanvas);
vec3 _x14 = T(baseTex,_x13).rgb;
vec4 _x15 = T(encodedTex,_x13);
vec3 _x16 = _x15.rgb;
float _x17 = _x15.a;
float _x18 = 0.0;
float _x19 = dot(_x16,vec3(0.299,0.587,0.114));
vec3 _x20;
vec4 _x21 = T(typeMapTex,_x13);
float _x9 = _x21.r;
float _x22 = _x21.g;
bool _x23 =(_x9 > 0.75);
float _x24 = max(max(abs(_x16.r - _x16.g),abs(_x16.g - _x16.b)),abs(_x16.b - _x16.r));
if (_x19 > 0.995&&_x24 < 0.01){
_x20 = _x14;
}
else if (_x23){
float _x10 = _x16.r;
float _x25 = _x22;
float _x11 =(1.0 - _x10)/ 0.5;
_x11 = clamp(_x11,0.0,1.0);
_x18 = _x11 * _x25;
float _x26 = _x11;
float _x27 = 1.0;
float _x28 = 0.0;
if (_x11 > 0.01){
float _x29 = 1.0 + _x1(_x13 * 500.0)* 8.0;
float _x30 = _x29 / uCanvas.x;
vec2 _x31 = vec2(_x30,-_x30);
vec3 _x32 = T(encodedTex,_x13 + _x31).rgb;
float _x33 = dot(_x32,vec3(0.299,0.587,0.114));
vec4 _x34 = T(typeMapTex,_x13 + _x31);
bool _x35 =(_x34.r > 0.75);
if (_x35&&_x33 < 0.995){
float _x36 = _x32.r;
float _x37 =(1.0 - _x36)/ 0.5;
_x37 = clamp(_x37,0.0,1.0);
float _x38 = 0.3 + _x1(_x13 * 700.0)* 0.7;
_x28 = _x37 * _x38 * 0.15;
}
}
vec3 _x39 = vec3(mix(0.3,1.0,_x26));
_x39*=(1.0 - _x28);
_x39 = clamp(_x39,vec3(0.5),vec3(1.0));
vec3 _x40 = vec3(1.0)-(vec3(1.0)- _x14)*(vec3(1.0)- _x39);
float _x41 = _x25;
_x20 = mix(_x14,_x40,_x41);
}
else {
float _x42 = dot(_x16,vec3(0.299,0.587,0.114));
if (_x42 > 0.995){
_x20 = _x14;
}
else {
vec3 _x43 = _x16;
float _x44 = max(max(abs(_x16.r - _x16.g),abs(_x16.g - _x16.b)),abs(_x16.b - _x16.r));
if (_x44 > 0.001&&_x44 < 0.1){
_x43 = vec3(_x42);
}
float _x45 = _x0(_x14).y;
float _x46 = smoothstep(0.3,0.8,_x45);
bool _x47 =(_x17 < 0.995);
bool _x48 =(_x17>=0.995&&_x17 < 1.0);
if (_x47){
float _x49 = 1.0 - smoothstep(0.0,0.95,_x42);
if (_x49 < 0.01){
_x20 = _x14;
}
else {
vec3 _x50 = mix(vec3(1.0),_x43,_x49);
vec3 _x51 = _x14 * _x50;
vec3 _x52 = mix(_x14,_x43,_x49);
_x20 = mix(_x51,_x52,_x46);
}
}
else if (_x48){
float _x53 =(_x17 - 0.995)/ 0.005;
float _x49 = clamp(_x53,0.0,1.0);
vec3 _x54 = _x0(_x43);
float _x55 = _x54.x;
float _x56 = _x54.y;
float _x57 = _x54.z;
bool _x58 =(_x55 < 0.2&&_x56 > 0.3);
if (_x49 < 0.02){
_x20 = _x14;
}
else if (_x58){
_x20 = mix(_x14,_x43,_x49);
}
else {
if (_x49 < 0.2){
vec3 _x50 = mix(vec3(1.0),_x43,_x49);
vec3 _x51 = mix(_x14,_x14 * _x50,_x49);
vec3 _x52 = mix(_x14,_x43,_x49);
_x20 = mix(_x51,_x52,_x46);
}
else {
vec3 _x50 = mix(vec3(1.0),_x43,_x49);
vec3 _x51 = _x14 * _x50;
vec3 _x52 = mix(_x14,_x43,_x49);
_x20 = mix(_x51,_x52,_x46);
}
}
}
else {
vec3 _x51 = _x14 * _x43;
vec3 _x52 = _x43;
_x20 = mix(_x51,_x52,_x46);
}
}
}
finalColor = vec4(_x20,1.0);
}`,oh=`in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
vec4 T(sampler2D s, vec2 c) { return texture(s, vec2(c.x, 1.0 - c.y)); }
vec2 inkFragCoord() { return vec2(vPixel.x, uCanvas.y - vPixel.y); }
uniform sampler2D baseTex;
uniform sampler2D addTex;
uniform sampler2D encodedTex;
uniform float brushColorMode;
uniform float brushCategory;
uniform vec3 brushColor;
uniform float whiteMaxOpacity;
uniform float hueShift;
uniform float satShift;
uniform float briShift;
uniform float useSharpen;
vec3 _x0(vec3 c){
vec4 _x2 = vec4(0.0,-1.0 / 3.0,2.0 / 3.0,-1.0);
vec4 _x3 = mix(vec4(c.bg,_x2.wz),vec4(c.gb,_x2.xy),step(c.b,c.g));
vec4 _x4 = mix(vec4(_x3.xyw,c.r),vec4(c.r,_x3.yzx),step(_x3.x,c.r));
float _x5 = _x4.x - min(_x4.w,_x4.y);
float _x6 = 1.0e-10;
return vec3(abs(_x4.z +(_x4.w - _x4.y)/(6.0 * _x5 + _x6)),_x5 /(_x4.x + _x6),_x4.x);
}
vec3 _x1(vec3 c){
vec3 _x7 = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0),6.0)- 3.0)- 1.0,0.0,1.0);
_x7 = _x7 * _x7 *(3.0 - 2.0 * _x7);
return c.z * mix(vec3(1.0),_x7,c.y);
}
void main(){
vec2 _x8 =(inkFragCoord() / uCanvas);
vec3 _x9 = T(baseTex,_x8).rgb;
vec3 _x11 = T(addTex,_x8).rgb;
vec3 _x12 = T(encodedTex,_x8).rgb;
float _x13 = dot(_x11,vec3(0.299,0.587,0.114));
float _x14 = _x12.g;
vec3 _x15 = _x9;
if (brushColorMode < 0.5){
float _x16 = 1.0 - smoothstep(0.0,0.95,_x13);
_x15 = mix(_x9,_x11,_x16);
}
else if (brushCategory > 0.5){
if (_x13 < 0.99){
float _x17 = 1.0 - _x13;
_x17 = pow(_x17,0.5);
_x17 = smoothstep(0.0,1.0,_x17);
vec3 _x18 = mix(vec3(0.0),brushColor,_x17);
vec3 _x19 = vec3(1.0)-(vec3(1.0)- _x9)*(vec3(1.0)- _x18);
_x15 = mix(_x9,_x19,_x17 * whiteMaxOpacity);
_x15 = min(_x15,vec3(0.99));
}
}
else if (brushColorMode > 28.5&&brushColorMode < 29.5){
float _x16 = 1.0 - smoothstep(0.0,0.95,_x13);
if (_x16 > 0.02){
vec3 _x20 = vec3(0.0,0.82,0.25);
_x15 = mix(_x9,_x20,_x16);
}
}
else {
vec3 _x21 = brushColor;
if (brushColorMode > 1.5){
vec3 _x22 = _x0(brushColor);
float _x23 =(_x22.z > 0.6)?(0.95 - _x22.z): briShift;
_x22.x = mod(_x22.x + hueShift,1.0);
_x22.y = clamp(_x22.y + satShift,0.0,1.0);
_x22.z = clamp(_x22.z + _x23,0.0,0.95);
_x21 = _x1(_x22);
}
float _x16 = 1.0 - smoothstep(0.0,0.95,_x13);
float _x24 = _x0(_x9).y;
float _x25 = smoothstep(0.3,0.8,_x24);
float _x26 = dot(_x21,vec3(0.299,0.587,0.114));
float _x27 = clamp((1.0 - _x13)/ max(1.0 - _x26,0.01),0.0,1.0);
float _x28 = _x25 * _x27;
if (_x16 < 0.02){
_x15 = _x9;
}
else if (_x16 < 0.2){
float _x29 =(_x16 - 0.02)/ 0.18;
vec3 _x30 = mix(_x9,_x9 * _x21,_x29);
vec3 _x31 = mix(_x9,_x21,_x29);
_x15 = mix(_x30,_x31,_x28);
}
else {
vec3 _x32 = mix(vec3(1.0),_x21,_x16);
vec3 _x30 = _x9 * _x32;
vec3 _x31 = mix(_x9,_x21,_x16);
_x15 = mix(_x30,_x31,_x28);
}
}
finalColor = vec4(_x15,1.0);
}`,lh=`in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
vec4 T(sampler2D s, vec2 c) { return texture(s, vec2(c.x, 1.0 - c.y)); }
vec2 inkFragCoord() { return vec2(vPixel.x, uCanvas.y - vPixel.y); }
uniform sampler2D tex0;
uniform float _x5,randomSeed2,randomSeed3,randomSeed4;
uniform float _x6,scale2,scale3;
uniform float _x7,amplitude2,amplitude3;
uniform float _x8,phase2,phase3;
uniform float _x9,vortexScale2;
uniform float _x10,clusterScale2;
uniform vec2 canvasCenter;
uniform float time;
vec3 _x1(vec3 _x18){
return _x18 - floor(_x18 *(1.0 / 289.0))* 289.0;
}
vec2 _x1(vec2 _x18){
return _x18 - floor(_x18 *(1.0 / 289.0))* 289.0;
}
vec3 _x2(vec3 _x18){
return _x1(((_x18*34.0)+1.0)*_x18);
}
float _x3(vec2 v){
const vec4 _x0 = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
vec2 _x11 = floor(v + dot(v,_x0.yy));
vec2 _x12 = v - _x11 + dot(_x11,_x0.xx);
vec2 _x13 =(_x12.x > _x12.y)? vec2(1.0,0.0):vec2(0.0,1.0);
vec2 _x14 = _x12.xy + _x0.xx - _x13;
vec2 _x15 = _x12.xy + _x0.zz;
_x11 = _x1(_x11);
vec3 _x16 = _x2(_x2(_x11.y + vec3(0.0,_x13.y,1.0))+ _x11.x + vec3(0.0,_x13.x,1.0));
vec3 _x17 = max(0.5 - vec3(dot(_x12,_x12),dot(_x14,_x14),dot(_x15,_x15)),0.0);
_x17 = _x17*_x17;
_x17 = _x17*_x17;
vec3 _x18 = 2.0 * fract(_x16 * _x0.www)- 1.0;
vec3 _x19 = abs(_x18)- 0.5;
vec3 _x20 = floor(_x18 + 0.5);
vec3 _x21 = _x18 - _x20;
_x17*=1.79284291400159 - 0.85373472095314 *(_x21*_x21+_x19*_x19);
vec3 _x22;
_x22.x = _x21.x * _x12.x + _x19.x * _x12.y;
_x22.yz = _x21.yz * vec2(_x14.x,_x15.x)+ _x19.yz * vec2(_x14.y,_x15.y);
return 130.0 * dot(_x17,_x22);
}
vec2 _x4(vec2 v){
return vec2(_x3(v)- _x3(v + vec2(12.3,23.4)),_x3(v + vec2(34.5,45.6))- _x3(v + vec2(56.7,67.8)));
}
void main(void){
vec2 _x23 = inkFragCoord();
vec2 _x24 = canvasCenter;
vec2 _x25 = vec2(time * 0.1,time * 0.15);
vec2 _x26 = _x4(_x23 * _x6 + vec2(_x8)+ _x25)* _x7;
vec2 _x27 = _x4(_x23 * scale2 + vec2(phase2)+ _x25 * 0.7)* amplitude2;
vec2 _x28 = _x4(_x23 * scale3 + vec2(phase3)+ _x25 * 0.5)* amplitude3;
vec2 _x29 = vec2(sin(_x23.x*_x9+_x23.y*_x9*0.5 + time*0.5),cos(_x23.x*_x9*0.5+_x23.y*_x9 + time*0.3))*0.2;
vec2 _x30 = vec2(cos(_x23.x*vortexScale2-_x23.y*vortexScale2*0.7 + time*0.4),sin(_x23.x*vortexScale2*0.7-_x23.y*vortexScale2 + time*0.6))*0.15;
float _x31 = _x3(_x23*_x10+vec2(_x5,randomSeed2));
float _x32 = _x3(_x23*clusterScale2+vec2(randomSeed3,randomSeed4));
float _x33 = length(_x23 - _x24)* 0.001;
vec2 _x34 = normalize(_x23 - _x24)* sin(_x33 * 2.0)* 0.3;
vec2 _x35 = vec2(sin(time*3.14159),cos(time*2.71828))*0.1;
vec2 _x36 = _x26 + _x27 + _x28 + _x29 + _x30 + _x34 + _x35;
float _x37 =(_x31 + _x32)* 0.5;
_x36*=(1.0 + _x37 * 0.5);
_x36+=_x4(_x23 * 0.08 + vec2(123.4,567.8))* 0.08;
finalColor = vec4(_x36 * 0.5 + vec2(0.5),0.0,1.0);
}`,wi={minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0};class ch{width;height;pass;background;wet;pingPong;scratch;final;typeMap;display;force;lastStroke;composite;forceMap;forceSeeds;engine=new qc;seed;base;blank;feedback;encode;typeEncode;realtime;materials;stroke={...wi};storedPath={...wi};storedRect;strokeFrames=0;frames=2;serial=0;storedSeed=0;live;disposedFlag=!1;constructor(e,t){this.width=Math.max(2,Math.round(t.width)),this.height=Math.max(2,Math.round(t.height)),this.seed=t.seed??1234567890,this.background=t.background??[214,206,188],this.pass=new Jc(e,this.width,this.height);const i=()=>this.pass.target();this.wet=i(),this.pingPong=i(),this.scratch=i(),this.final=i(),this.typeMap=i(),this.display=i(),this.force=i(),this.lastStroke=t.recordLastStroke===!1?void 0:i(),this.blank=zs(),this.base=this.makeBase(t);const s=this.forceParams();this.forceSeeds=s.seeds;const r=this.width,a=this.height,o=this.background;this.feedback=this.pass.material(nh,{tex0:Tt(this.wet.texture),forceMap:Tt(this.force.texture),force:Fe(1),indiffusionStrength:Fe(.45),brushMode:Fe(1),baseBrushSize:Fe(2),useSharpen:Fe(0),effect3Brightness:Fe(.2),brushColorMode:Fe(0),brushCategory:Fe(0),mouseCount:Fe(0),mouseCountAccumulated:Fe(0),strokeSeed:Fe(0)},1),this.feedback.transparent=!0,this.feedback.premultipliedAlpha=!1,this.encode=this.pass.material(sh,{baseTex:Tt(this.final.texture),strokeTex:Tt(this.wet.texture),typeMapTex:Tt(this.typeMap.texture),brushColorMode:Fe(0),brushCategory:Fe(0),whiteMaxOpacity:Fe(.95),hueShift:Fe(0),satShift:Fe(0),briShift:Fe(0),keyBlendMode:Fe(0),useSharpen:Fe(0),canvasBackgroundColor:Vs(o[0]/255,o[1]/255,o[2]/255),customBrushColor:Vs(.10196078431372549,.10196078431372549,.10196078431372549),useSpectralMix:Fe(0)}),this.typeEncode=this.pass.material(rh,{baseTex:Tt(this.typeMap.texture),strokeTex:Tt(this.wet.texture),brushCategory:Fe(0),whiteMaxOpacity:Fe(.95)}),this.composite=this.pass.material(ah,{baseTex:Tt(this.base),encodedTex:Tt(this.final.texture),typeMapTex:Tt(this.typeMap.texture),useSharpen:Fe(0),brushColorMode:Fe(0)}),this.realtime=this.pass.material(oh,{baseTex:Tt(this.scratch.texture),addTex:Tt(this.wet.texture),encodedTex:Tt(this.final.texture),brushColorMode:Fe(0),brushCategory:Fe(0),brushColor:Vs(.10196078431372549,.10196078431372549,.10196078431372549),whiteMaxOpacity:Fe(.95),hueShift:Fe(0),satShift:Fe(0),briShift:Fe(0),useSharpen:Fe(0)}),this.forceMap=this.pass.material(lh,{tex0:Tt(this.blank),_x5:Fe(0),_x6:Fe(0),_x7:Fe(0),_x8:Fe(0),_x9:Fe(0),_x10:Fe(0),randomSeed2:Fe(s.seeds[1]??200),randomSeed3:Fe(s.seeds[2]??300),randomSeed4:Fe(s.seeds[3]??400),scale2:Fe(s.scales[1]??.005),scale3:Fe(s.scales[2]??.015),amplitude2:Fe(s.amplitudes[1]??.4),amplitude3:Fe(s.amplitudes[2]??.3),phase2:Fe(s.phases[1]??0),phase3:Fe(s.phases[2]??0),vortexScale2:Fe(s.vortexScales[1]??.012),clusterScale2:Fe(s.clusterScales[1]??8e-4),canvasCenter:ks(r/2,a/2),time:Fe(0)}),this.materials=[this.feedback,this.encode,this.typeEncode,this.composite,this.realtime,this.forceMap];const c=this.fullRect(),l=[1,1,1];this.pass.fill(this.wet,c,l),this.pass.fill(this.pingPong,c,l),this.pass.fill(this.final,c,l),this.lastStroke&&this.pass.fill(this.lastStroke,c,l),this.pass.fill(this.typeMap,c,[0,0,0]),this.pass.draw(this.forceMap,this.force,c),this.pass.draw(this.composite,this.display,c)}get disposed(){return this.disposedFlag}get texture(){return this.display.texture}get frameCount(){return this.frames}set frameCount(e){this.frames=e}get lastRect(){return this.storedRect}get pathBounds(){return this.storedPath}get strokeSeed(){return this.storedSeed}setBrush(e){this.engine.configure(e)}setColor(e){this.engine.setColor(e)}paint(e){this.setBrush(e.brush),this.setColor(e.color),this.strokePath(e.points,e.seed)}strokePath(e,t){if(this.disposedFlag||!e.length)return;this.finishLive();const i=Ws(e,this.engine.mode===3),s=i[0];if(!s)return;this.storedPath={...wi};for(const o of i)pn(this.storedPath,o.x,o.y,o.x,o.y);this.pressAt(s,t);let r=s;for(let o=1;o<i.length;o++){const c=i[o];c&&(this.engine.applyPressure(c.pressure),this.runFrame(!0,Zi(c),r,!1),r=c)}const a=i[i.length-1]??s;this.runFrame(!0,Zi(a),i[i.length-2]??s,!1),this.engine.release();for(let o=0;o<200&&this.engine.pendingCommit;o++)this.runFrame(!1,Zi(a),a,!1)}beginStroke(e,t,i=0){if(this.disposedFlag)return;this.finishLive();const s=Ws([{x:e,y:t}],this.engine.mode===3)[0]??{x:e,y:t};this.live={down:!0,cursor:s,pmouse:s,pending:s,lift:0},this.pressAt(s,i,!0)}addPoint(e,t){this.live?.down&&(this.live.pending=Ws([{x:e,y:t}],this.engine.mode===3)[0]??{x:e,y:t})}endStroke(){this.live?.down&&(this.live.lift=1)}update(){const e=this.live;if(!(!e||this.disposedFlag)){if(e.down&&e.lift>0&&(e.lift=0,e.down=!1,this.engine.release()),e.down){const t=e.pending??e.cursor;e.pmouse=e.cursor,e.cursor=t,e.pending=void 0,this.engine.applyPressure(t.pressure)}this.runFrame(e.down,Zi(e.cursor),e.pmouse,!0),this.engine.pendingCommit||(this.live=void 0)}}readTarget(e){const t=new Uint8Array(this.width*this.height*4);return this.pass.read(e,t),t}blitBuffer(e,t){const i=new on(t,this.width,this.height,1023,1009);i.flipY=!1,i.colorSpace="",i.magFilter=1006,i.minFilter=1006,i.generateMipmaps=!1,i.needsUpdate=!0,this.pass.blitTexture(i,e,this.fullRect()),i.dispose()}clear(){if(this.disposedFlag)return;this.live=void 0,this.engine.pendingCommit&&this.engine.committed();const e=this.fullRect(),t=[1,1,1];this.pass.fill(this.wet,e,t),this.pass.fill(this.pingPong,e,t),this.pass.fill(this.final,e,t),this.pass.fill(this.typeMap,e,[0,0,0]),this.pass.draw(this.composite,this.display,e),this.stroke={...wi}}dispose(){if(this.disposedFlag)return;this.disposedFlag=!0;for(const t of this.materials)t.dispose();const e=[this.wet,this.pingPong,this.scratch,this.final,this.typeMap,this.display,this.force,this.lastStroke];for(const t of e)t?.dispose();this.base.dispose(),this.blank.dispose(),this.pass.dispose()}clampRect(e){if(!e)return;const t=Math.max(0,Math.floor(e.x)),i=Math.max(0,Math.floor(e.y)),s=Math.min(this.width,Math.ceil(e.x+e.w)),r=Math.min(this.height,Math.ceil(e.y+e.h));if(!(s<=t||r<=i))return{x:t,y:i,w:s-t,h:r-i}}fullRect(){return{x:0,y:0,w:this.width,h:this.height}}pressAt(e,t,i=!1){this.engine.pendingCommit&&this.commit(),this.serial+=1,this.storedRect=void 0,this.stroke={...wi},this.strokeFrames=0,this.engine.applyPressure(e.pressure);const s=Zi(e);this.storedSeed=t??this.seed+this.serial*7919>>>0,this.engine.press(s.x,s.y,this.storedSeed),this.runFrame(!0,s,e,i)}runFrame(e,t,i,s){const r=this.engine.frame(e,t.x,t.y,i.x,i.y);this.frames+=1,this.strokeFrames+=1,r.ops.length&&this.drawOps(r.ops);const a=this.strokeRect();r.force!==void 0&&a&&(pt(this.forceMap,"time",this.frames/60),this.pass.draw(this.forceMap,this.force,a),Hs(this.feedback,this.engine.shaderState()),pt(this.feedback,"force",r.force),this.pass.draw(this.feedback,this.pingPong,a),this.pass.copy(this.pingPong,this.wet,a),s&&this.showLive(a)),r.commit&&this.commit()}drawOps(e){const t={...wi};for(const s of e)if(s.kind==="line"){const r=s.w/2+1;pn(t,Math.min(s.x0,s.x1)-r,Math.min(s.y0,s.y1)-r,Math.max(s.x0,s.x1)+r,Math.max(s.y0,s.y1)+r)}else if(s.kind==="dot")pn(t,s.x0-s.w/2-1,s.y0-s.w/2-1,s.x0+s.w/2+1,s.y0+s.w/2+1);else{const r=(s.w+s.h)/2+s.lw+1;pn(t,s.x0-r,s.y0-r,s.x0+r,s.y0+r)}const i=this.clampRect(ha(t,0));i&&(pn(this.stroke,t.minX,t.minY,t.maxX,t.maxY),this.pass.blitStamp(Qc(e,i),i,this.wet))}strokeRect(){const e=this.engine.effect>=4?3*this.strokeFrames:0;return this.clampRect(ha(this.stroke,3+e))}commit(){const e=this.strokeRect(),t=this.engine.shaderState();if(this.engine.committed(),!e)return;Hs(this.encode,t);const i=t.customBrushColor;ca(this.encode,"customBrushColor",i[0]/255,i[1]/255,i[2]/255),this.pass.draw(this.encode,this.scratch,e),this.pass.copy(this.scratch,this.final,e),pt(this.typeEncode,"brushCategory",t.brushCategory),pt(this.typeEncode,"whiteMaxOpacity",t.whiteMaxOpacity),this.pass.draw(this.typeEncode,this.scratch,e),this.pass.copy(this.scratch,this.typeMap,e),this.lastStroke&&(this.pass.fill(this.lastStroke,this.fullRect(),[1,1,1]),this.pass.copy(this.wet,this.lastStroke,e)),this.pass.fill(this.wet,e,[1,1,1]),this.pass.draw(this.composite,this.display,e),this.storedRect=e,this.stroke={...wi}}showLive(e){const t=this.engine.shaderState();this.pass.draw(this.composite,this.scratch,e),Hs(this.realtime,t);const i=t.brushColorMode===33?t.customBrushColor:Is(t.brushColorMode);ca(this.realtime,"brushColor",i[0]/255,i[1]/255,i[2]/255),hh(this.realtime,"baseTex",this.scratch.texture),this.pass.draw(this.realtime,this.display,e)}finishLive(){if(this.live){this.live.down&&this.engine.release();for(let e=0;e<200&&this.engine.pendingCommit;e++)this.runFrame(!1,Zi(this.live.cursor),this.live.cursor,!1);this.live=void 0}}makeBase(e){const t=this.background;let i;if(e.transparent)i=Xs(this.width,this.height,[255,255,255]);else if(e.paper!==!1&&e.paperPixels)try{i=e.paperPixels(this.width,this.height,t,this.seed)}catch{i=Xs(this.width,this.height,t)}else i=Xs(this.width,this.height,t);const s=new on(i,this.width,this.height,1023,1009);return s.flipY=!1,s.colorSpace="",s.magFilter=1006,s.minFilter=1006,s.generateMipmaps=!1,s.needsUpdate=!0,s}forceParams(){const e=new Xn(this.seed),t=[],i=[],s=[],r=[],a=[],o=[];for(let c=0;c<4;c++)t.push(e.random(100+c*100,200+c*100));for(let c=0;c<3;c++)i.push(e.random(.001+c*.002,.003+c*.005)),s.push(e.random(.1+c*.1,.4+c*.2)),r.push(e.random(0,pi));for(let c=0;c<2;c++)a.push(e.random(.005+c*.003,.015+c*.003)),o.push(e.random(5e-4+c*3e-4,.002+c*5e-4));return{seeds:t,scales:i,amplitudes:s,phases:r,vortexScales:a,clusterScales:o}}}function Fe(n){return{value:n}}function ks(n,e){return{value:new $e(n,e)}}function Vs(n,e,t){return{value:new H(n,e,t)}}function Tt(n){return{value:n}}function pt(n,e,t){const i=n.uniforms[e];i&&typeof i.value=="number"&&(i.value=t)}function la(n,e,t,i){const s=n.uniforms[e];s?.value instanceof $e&&s.value.set(t,i)}function ca(n,e,t,i,s){const r=n.uniforms[e];r?.value instanceof H&&r.value.set(t,i,s)}function hh(n,e,t){const i=n.uniforms[e];i&&(i.value=t)}function Hs(n,e){pt(n,"brushMode",e.brushMode),pt(n,"baseBrushSize",e.baseBrushSize),pt(n,"useSharpen",e.useSharpen),pt(n,"effect3Brightness",e.effect3Brightness),pt(n,"indiffusionStrength",e.indiffusionStrength),pt(n,"brushColorMode",e.brushColorMode),pt(n,"brushCategory",e.brushCategory),pt(n,"mouseCount",e.mouseCount),pt(n,"mouseCountAccumulated",e.mouseCountAccumulated),pt(n,"strokeSeed",e.strokeSeed),pt(n,"whiteMaxOpacity",e.whiteMaxOpacity),pt(n,"hueShift",e.hueShift),pt(n,"satShift",e.satShift),pt(n,"briShift",e.briShift),pt(n,"keyBlendMode",e.keyBlendMode),pt(n,"useSpectralMix",e.useSpectralMix)}function Ws(n,e){const t=e?0:-Gs;return n.map(i=>i.pressure===void 0?{x:i.x+t,y:i.y+t}:{x:i.x+t,y:i.y+t,pressure:i.pressure})}function pn(n,e,t,i,s){e<n.minX&&(n.minX=e),t<n.minY&&(n.minY=t),i>n.maxX&&(n.maxX=i),s>n.maxY&&(n.maxY=s)}function ha(n,e){if(n.maxX>=n.minX)return{x:n.minX-e,y:n.minY-e,w:n.maxX-n.minX+e*2,h:n.maxY-n.minY+e*2}}function Zi(n){return{x:Math.round(n.x*100)/100,y:Math.round(n.y*100)/100}}function Xs(n,e,t){const i=new Uint8Array(n*e*4);for(let s=0;s<i.length;s+=4)i[s]=t[0],i[s+1]=t[1],i[s+2]=t[2],i[s+3]=255;return i}const fa=`
in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
uniform sampler2D uSource;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uTypeMode;
void main() {
  vec4 color = texture(uSource, vec2(vPixel.x / uCanvas.x, vPixel.y / uCanvas.y));
  float wipe = smoothstep(uRadius, uRadius * 0.35, length(vPixel - uCenter));
  if (uTypeMode > 0.5) finalColor = wipe > 0.6 ? vec4(0.0, 0.0, 0.0, 1.0) : color;
  else finalColor = vec4(mix(color.rgb, vec3(1.0), wipe), 1.0);
}
`;class fh{constructor(e){this.sheet=e,this.color=e.pass.material(fa,{uSource:Tt(e.final.texture),uCenter:ks(0,0),uRadius:{value:24},uTypeMode:{value:0}}),this.type=e.pass.material(fa,{uSource:Tt(e.typeMap.texture),uCenter:ks(0,0),uRadius:{value:24},uTypeMode:{value:1}})}color;type;disposed=!1;wash(e,t,i){if(this.disposed||this.sheet.disposed)return;const s=this.sheet.clampRect({x:Math.floor(e-i-2),y:Math.floor(t-i-2),w:Math.ceil(i*2+4),h:Math.ceil(i*2+4)});s&&(la(this.color,"uCenter",e,t),la(this.type,"uCenter",e,t),pt(this.color,"uRadius",Math.max(1,i)),pt(this.type,"uRadius",Math.max(1,i)),this.sheet.pass.draw(this.color,this.sheet.scratch,s),this.sheet.pass.copy(this.sheet.scratch,this.sheet.final,s),this.sheet.pass.draw(this.type,this.sheet.scratch,s),this.sheet.pass.copy(this.sheet.scratch,this.sheet.typeMap,s),this.sheet.pass.draw(this.sheet.composite,this.sheet.display,s))}dispose(){this.disposed||(this.disposed=!0,this.color.dispose(),this.type.dispose())}}const dh=[236,234,228],da=[110,110,108],uh=[179,36,28],Kn=480,Zn=270;function ph(n,e=Kn,t=Zn){const i=new Xn(n),s=[],r=7;for(let a=0;a<r;a++){const o=a===r-1;s.push({x:e*(.1+i.random()*.8),y:t*(.12+i.random()*.76),vermilion:o,radius:o?3:8+i.random()*14})}return s}const _h=125,mh=500,xh=8e3,gh=10;function ua(n,e){return n<12?12:n>e-12?e-12:n}class vh{canvas;renderer;surface;wash;scene=new vr;camera;sheet;noise;marks;seed;reduced;disposed=!1;raf=0;lastDraw=0;lastInput=0;frames=0;bloom=0;trail=[];onResize=()=>{this.layout()};onInput=()=>{this.lastInput=performance.now()};onLost=e=>{e.preventDefault(),this.canvas.style.display="none",this.stop()};loop=e=>{if(this.disposed||this.reduced||(this.raf=requestAnimationFrame(this.loop),document.hidden))return;const t=e-this.lastInput>xh?mh:_h;e-this.lastDraw<t||(this.lastDraw=e,this.step(),this.present(),this.frames+=1,this.canvas.dataset.inkFrames=String(this.frames))};constructor(e){this.canvas=e.canvas,this.seed=e.seed??20261012,this.reduced=e.reducedMotion??!1,this.noise=new oa(this.seed),this.marks=ph(this.seed);let t;try{t=new Ac({canvas:this.canvas,antialias:!1,alpha:!1,powerPreference:"low-power"})}catch(r){throw this.canvas.style.display="none",r}this.renderer=t,this.renderer.outputColorSpace=Pt,this.renderer.setPixelRatio(1),this.renderer.setClearColor(15526628,1),this.surface=new ch(this.renderer,{width:Kn,height:Zn,seed:this.seed,paper:!1,recordLastStroke:!1,background:dh}),this.wash=new fh(this.surface),this.surface.texture.colorSpace=Pt;const i=new an(2,2),s=new ds({map:this.surface.texture,toneMapped:!1,depthWrite:!1});this.sheet=new Vt(i,s),this.sheet.frustumCulled=!1,this.scene.add(this.sheet),this.camera=new Bn(-1,1,1,-1,.1,10),this.camera.position.z=1,this.seedSheet(),this.layout(),this.present(),this.canvas.addEventListener("webglcontextlost",this.onLost)}get frameCount(){return this.frames}start(){this.disposed||this.reduced||this.raf||(this.lastInput=performance.now(),this.lastDraw=0,window.addEventListener("resize",this.onResize),window.addEventListener("pointermove",this.onInput,{passive:!0}),window.addEventListener("scroll",this.onInput,{passive:!0}),window.addEventListener("keydown",this.onInput),this.raf=requestAnimationFrame(this.loop))}setReducedMotion(e){this.reduced=e,e?this.stop():this.start()}dispose(){this.disposed||(this.disposed=!0,this.stop(),this.canvas.removeEventListener("webglcontextlost",this.onLost),this.wash.dispose(),this.surface.dispose(),this.scene.traverse(e=>{const t=e;t.geometry?.dispose();const i=t.material;i&&!Array.isArray(i)&&i.dispose()}),this.renderer.dispose())}seedSheet(){const e={mode:"brush",size:"medium",effect:"mix",blend:"mix"};this.marks.forEach((t,i)=>{const s=t.radius;this.surface.paint({brush:t.vermilion?{mode:"dots",size:"ultra-small",effect:"mix",blend:"mix"}:e,color:t.vermilion?uh:da,points:t.vermilion?[{x:t.x,y:t.y,pressure:.4}]:[{x:t.x-s*.45,y:t.y,pressure:.25},{x:t.x,y:t.y+s*.15,pressure:.4},{x:t.x+s*.35,y:t.y-s*.1,pressure:.15}],seed:this.seed+i*17})})}step(){const e=this.marks[this.bloom%this.marks.length];if(!e||e.vermilion){this.bloom+=1;return}const t=(this.frames+1)*.07,i=ua(e.x+(this.noise.noise(t,.4)-.5)*70,Kn),s=ua(e.y+(this.noise.noise(.4,t)-.5)*46,Zn);if(this.surface.paint({brush:{mode:"brush",size:"medium",effect:"wet",blend:"mix"},color:da,points:[{x:i-8,y:s,pressure:.28},{x:i,y:s+5,pressure:.34}],seed:this.seed+this.frames*19>>>0}),this.trail.push({x:i,y:s}),this.trail.length>gh){const r=this.trail.shift();r&&this.wash.wash(r.x,r.y,30)}this.frames%48===47&&(this.bloom+=1)}present(){this.renderer.setRenderTarget(null),this.renderer.setViewport(0,0,this.canvas.width,this.canvas.height),this.renderer.render(this.scene,this.camera)}layout(){const e=Math.max(1,this.canvas.clientWidth),t=Math.max(1,this.canvas.clientHeight);this.renderer.setPixelRatio(1),this.renderer.setSize(e,t,!1);const i=this.sheet.material.map;if(!i)return;const s=e/t,r=Kn/Zn;s>r?i.repeat.set(1,r/s):i.repeat.set(s/r,1),i.offset.set((1-i.repeat.x)/2,(1-i.repeat.y)/2)}stop(){this.raf&&cancelAnimationFrame(this.raf),this.raf=0,window.removeEventListener("resize",this.onResize),window.removeEventListener("pointermove",this.onInput),window.removeEventListener("scroll",this.onInput),window.removeEventListener("keydown",this.onInput)}}function pa(n){const e=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let t;try{t=new vh({canvas:n,reducedMotion:e})}catch{n.remove();return}const i=window.matchMedia("(prefers-reduced-motion: reduce)"),s=()=>{t.setReducedMotion(i.matches)};return i.addEventListener("change",s),t.start(),t}function _a(){const n=document.getElementById("inkbg");n instanceof HTMLCanvasElement&&pa(n)}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_a):_a(),Qn.mountInkBackdrop=pa,Object.defineProperty(Qn,Symbol.toStringTag,{value:"Module"}),Qn})({});
