var InkGamesBackdrop=(function(ar){"use strict";/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Dt="srgb",Si="srgb-linear",Mi="linear",st="srgb",or="300 es";function Ia(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function yi(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ua(){const i=yi("canvas");return i.style.display="block",i}const ts={};function ns(...i){const e="THREE."+i.shift();console.log(e,...i)}function is(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Be(...i){i=is(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function et(...i){i=is(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Dn(...i){const e=i.join(" ");e in ts||(ts[e]=!0,Be(...i))}function Na(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const Ba={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};class Mn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const r=n[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Et=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],lr=Math.PI/180,cr=180/Math.PI;function ni(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Et[i&255]+Et[i>>8&255]+Et[i>>16&255]+Et[i>>24&255]+"-"+Et[e&255]+Et[e>>8&255]+"-"+Et[e>>16&15|64]+Et[e>>24&255]+"-"+Et[t&63|128]+Et[t>>8&255]+"-"+Et[t>>16&255]+Et[t>>24&255]+Et[n&255]+Et[n>>8&255]+Et[n>>16&255]+Et[n>>24&255]).toLowerCase()}function Ke(i,e,t){return Math.max(e,Math.min(t,i))}function Oa(i,e){return(i%e+e)%e}function fr(i,e,t){return(1-t)*i+t*e}function ii(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Lt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}class Ze{static{Ze.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ln{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let c=n[r+0],l=n[r+1],u=n[r+2],d=n[r+3],f=s[a+0],x=s[a+1],g=s[a+2],y=s[a+3];if(d!==y||c!==f||l!==x||u!==g){let _=c*f+l*x+u*g+d*y;_<0&&(f=-f,x=-x,g=-g,y=-y,_=-_);let h=1-o;if(_<.9995){const T=Math.acos(_),w=Math.sin(T);h=Math.sin(h*T)/w,o=Math.sin(o*T)/w,c=c*h+f*o,l=l*h+x*o,u=u*h+g*o,d=d*h+y*o}else{c=c*h+f*o,l=l*h+x*o,u=u*h+g*o,d=d*h+y*o;const T=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=T,l*=T,u*=T,d*=T}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],u=n[r+3],d=s[a],f=s[a+1],x=s[a+2],g=s[a+3];return e[t]=o*g+u*d+c*x-l*f,e[t+1]=c*g+u*f+l*d-o*x,e[t+2]=l*g+u*x+o*f-c*d,e[t+3]=u*g-o*d-c*f-l*x,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(r/2),d=o(s/2),f=c(n/2),x=c(r/2),g=c(s/2);switch(a){case"XYZ":this._x=f*u*d+l*x*g,this._y=l*x*d-f*u*g,this._z=l*u*g+f*x*d,this._w=l*u*d-f*x*g;break;case"YXZ":this._x=f*u*d+l*x*g,this._y=l*x*d-f*u*g,this._z=l*u*g-f*x*d,this._w=l*u*d+f*x*g;break;case"ZXY":this._x=f*u*d-l*x*g,this._y=l*x*d+f*u*g,this._z=l*u*g+f*x*d,this._w=l*u*d-f*x*g;break;case"ZYX":this._x=f*u*d-l*x*g,this._y=l*x*d+f*u*g,this._z=l*u*g-f*x*d,this._w=l*u*d+f*x*g;break;case"YZX":this._x=f*u*d+l*x*g,this._y=l*x*d+f*u*g,this._z=l*u*g-f*x*d,this._w=l*u*d-f*x*g;break;case"XZY":this._x=f*u*d-l*x*g,this._y=l*x*d-f*u*g,this._z=l*u*g+f*x*d,this._w=l*u*d+f*x*g;break;default:Be("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],d=t[10],f=n+o+d;if(f>0){const x=.5/Math.sqrt(f+1);this._w=.25/x,this._x=(u-c)*x,this._y=(s-l)*x,this._z=(a-r)*x}else if(n>o&&n>d){const x=2*Math.sqrt(1+n-o-d);this._w=(u-c)/x,this._x=.25*x,this._y=(r+a)/x,this._z=(s+l)/x}else if(o>d){const x=2*Math.sqrt(1+o-n-d);this._w=(s-l)/x,this._x=(r+a)/x,this._y=.25*x,this._z=(c+u)/x}else{const x=2*Math.sqrt(1+d-n-o);this._w=(a-r)/x,this._x=(s+l)/x,this._y=(c+u)/x,this._z=.25*x}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+a*o+r*l-s*c,this._y=r*u+a*c+s*o-n*l,this._z=s*u+a*l+n*c-r*o,this._w=a*u-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,s=-s,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+n*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{static{H.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(rs.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(rs.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*r-o*n),u=2*(o*t-s*r),d=2*(s*n-a*t);return this.x=t+c*l+a*d-o*u,this.y=n+c*u+o*l-s*d,this.z=r+c*d+s*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,c=t.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return hr.copy(this).projectOnVector(e),this.sub(hr)}reflect(e){return this.sub(hr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const hr=new H,rs=new Ln;class Oe{static{Oe.prototype.isMatrix3=!0}constructor(e,t,n,r,s,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,c,l)}set(e,t,n,r,s,a,o,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],d=n[7],f=n[2],x=n[5],g=n[8],y=r[0],_=r[3],h=r[6],T=r[1],w=r[4],M=r[7],S=r[2],b=r[5],A=r[8];return s[0]=a*y+o*T+c*S,s[3]=a*_+o*w+c*b,s[6]=a*h+o*M+c*A,s[1]=l*y+u*T+d*S,s[4]=l*_+u*w+d*b,s[7]=l*h+u*M+d*A,s[2]=f*y+x*T+g*S,s[5]=f*_+x*w+g*b,s[8]=f*h+x*M+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-n*s*u+n*o*c+r*s*l-r*a*c}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=u*a-o*l,f=o*c-u*s,x=l*s-a*c,g=t*d+n*f+r*x;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return e[0]=d*y,e[1]=(r*l-u*n)*y,e[2]=(o*n-r*a)*y,e[3]=f*y,e[4]=(u*t-r*c)*y,e[5]=(r*s-o*t)*y,e[6]=x*y,e[7]=(n*c-l*t)*y,e[8]=(a*t-n*s)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-r*l,r*c,-r*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return Dn("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ur.makeScale(e,t)),this}rotate(e){return Dn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ur.makeRotation(-e)),this}translate(e,t){return Dn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ur.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ur=new Oe,ss=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),as=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ka(){const i={enabled:!0,workingColorSpace:Si,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===st&&(r.r=sn(r.r),r.g=sn(r.g),r.b=sn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===st&&(r.r=Fn(r.r),r.g=Fn(r.g),r.b=Fn(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===""?Mi:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Dn("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Dn("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Si]:{primaries:e,whitePoint:n,transfer:Mi,toXYZ:ss,fromXYZ:as,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Dt},outputColorSpaceConfig:{drawingBufferColorSpace:Dt}},[Dt]:{primaries:e,whitePoint:n,transfer:st,toXYZ:ss,fromXYZ:as,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Dt}}}),i}const $e=ka();function sn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fn(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let In;class za{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{In===void 0&&(In=yi("canvas")),In.width=e.width,In.height=e.height;const r=In.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=In}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=yi("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=sn(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(sn(t[n]/255)*255):t[n]=sn(t[n]);return{data:t,width:e.width,height:e.height}}else return Be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ga=0;class dr{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ga++}),this.uuid=ni(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(_r(r[a].image)):s.push(_r(r[a]))}else s=_r(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function _r(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?za.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Be("Texture: Unable to serialize Texture."),{})}let Va=0;const xr=new H;class Rt extends Mn{constructor(e=Rt.DEFAULT_IMAGE,t=Rt.DEFAULT_MAPPING,n=1001,r=1001,s=1006,a=1008,o=1023,c=1009,l=Rt.DEFAULT_ANISOTROPY,u=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Va++}),this.uuid=ni(),this.name="",this.source=new dr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ze(0,0),this.repeat=new Ze(1,1),this.center=new Ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(xr).x}get height(){return this.source.getSize(xr).y}get depth(){return this.source.getSize(xr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Be(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Rt.DEFAULT_IMAGE=null,Rt.DEFAULT_MAPPING=300,Rt.DEFAULT_ANISOTROPY=1;class ut{static{ut.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const c=e.elements,l=c[0],u=c[4],d=c[8],f=c[1],x=c[5],g=c[9],y=c[2],_=c[6],h=c[10];if(Math.abs(u-f)<.01&&Math.abs(d-y)<.01&&Math.abs(g-_)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+y)<.1&&Math.abs(g+_)<.1&&Math.abs(l+x+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(l+1)/2,M=(x+1)/2,S=(h+1)/2,b=(u+f)/4,A=(d+y)/4,m=(g+_)/4;return w>M&&w>S?w<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(w),r=b/n,s=A/n):M>S?M<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),n=b/r,s=m/r):S<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),n=A/s,r=m/s),this.set(n,r,s,t),this}let T=Math.sqrt((_-g)*(_-g)+(d-y)*(d-y)+(f-u)*(f-u));return Math.abs(T)<.001&&(T=1),this.x=(_-g)/T,this.y=(d-y)/T,this.z=(f-u)/T,this.w=Math.acos((l+x+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ha extends Mn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:n.depth},s=new Rt(r),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new dr(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Bt extends Ha{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class os extends Rt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Wa extends Rt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class pt{static{pt.prototype.isMatrix4=!0}constructor(e,t,n,r,s,a,o,c,l,u,d,f,x,g,y,_){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,c,l,u,d,f,x,g,y,_)}set(e,t,n,r,s,a,o,c,l,u,d,f,x,g,y,_){const h=this.elements;return h[0]=e,h[4]=t,h[8]=n,h[12]=r,h[1]=s,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=u,h[10]=d,h[14]=f,h[3]=x,h[7]=g,h[11]=y,h[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,r=1/Un.setFromMatrixColumn(e,0).length(),s=1/Un.setFromMatrixColumn(e,1).length(),a=1/Un.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=a*u,x=a*d,g=o*u,y=o*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=x+g*l,t[5]=f-y*l,t[9]=-o*c,t[2]=y-f*l,t[6]=g+x*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*u,x=c*d,g=l*u,y=l*d;t[0]=f+y*o,t[4]=g*o-x,t[8]=a*l,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=x*o-g,t[6]=y+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*u,x=c*d,g=l*u,y=l*d;t[0]=f-y*o,t[4]=-a*d,t[8]=g+x*o,t[1]=x+g*o,t[5]=a*u,t[9]=y-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*u,x=a*d,g=o*u,y=o*d;t[0]=c*u,t[4]=g*l-x,t[8]=f*l+y,t[1]=c*d,t[5]=y*l+f,t[9]=x*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,x=a*l,g=o*c,y=o*l;t[0]=c*u,t[4]=y-f*d,t[8]=g*d+x,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=x*d+g,t[10]=f-y*d}else if(e.order==="XZY"){const f=a*c,x=a*l,g=o*c,y=o*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=f*d+y,t[5]=a*u,t[9]=x*d-g,t[2]=g*d-x,t[6]=o*u,t[10]=y*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Xa,e,qa)}lookAt(e,t,n){const r=this.elements;return Ft.subVectors(e,t),Ft.lengthSq()===0&&(Ft.z=1),Ft.normalize(),un.crossVectors(n,Ft),un.lengthSq()===0&&(Math.abs(n.z)===1?Ft.x+=1e-4:Ft.z+=1e-4,Ft.normalize(),un.crossVectors(n,Ft)),un.normalize(),bi.crossVectors(Ft,un),r[0]=un.x,r[4]=bi.x,r[8]=Ft.x,r[1]=un.y,r[5]=bi.y,r[9]=Ft.y,r[2]=un.z,r[6]=bi.z,r[10]=Ft.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],d=n[5],f=n[9],x=n[13],g=n[2],y=n[6],_=n[10],h=n[14],T=n[3],w=n[7],M=n[11],S=n[15],b=r[0],A=r[4],m=r[8],E=r[12],C=r[1],D=r[5],I=r[9],N=r[13],P=r[2],B=r[6],G=r[10],W=r[14],j=r[3],X=r[7],Z=r[11],ee=r[15];return s[0]=a*b+o*C+c*P+l*j,s[4]=a*A+o*D+c*B+l*X,s[8]=a*m+o*I+c*G+l*Z,s[12]=a*E+o*N+c*W+l*ee,s[1]=u*b+d*C+f*P+x*j,s[5]=u*A+d*D+f*B+x*X,s[9]=u*m+d*I+f*G+x*Z,s[13]=u*E+d*N+f*W+x*ee,s[2]=g*b+y*C+_*P+h*j,s[6]=g*A+y*D+_*B+h*X,s[10]=g*m+y*I+_*G+h*Z,s[14]=g*E+y*N+_*W+h*ee,s[3]=T*b+w*C+M*P+S*j,s[7]=T*A+w*D+M*B+S*X,s[11]=T*m+w*I+M*G+S*Z,s[15]=T*E+w*N+M*W+S*ee,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],d=e[6],f=e[10],x=e[14],g=e[3],y=e[7],_=e[11],h=e[15],T=c*x-l*f,w=o*x-l*d,M=o*f-c*d,S=a*x-l*u,b=a*f-c*u,A=a*d-o*u;return t*(y*T-_*w+h*M)-n*(g*T-_*S+h*b)+r*(g*w-y*S+h*A)-s*(g*M-y*b+_*A)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[1],a=e[5],o=e[9],c=e[2],l=e[6],u=e[10];return t*(a*u-o*l)-n*(s*u-o*c)+r*(s*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=e[9],f=e[10],x=e[11],g=e[12],y=e[13],_=e[14],h=e[15],T=t*o-n*a,w=t*c-r*a,M=t*l-s*a,S=n*c-r*o,b=n*l-s*o,A=r*l-s*c,m=u*y-d*g,E=u*_-f*g,C=u*h-x*g,D=d*_-f*y,I=d*h-x*y,N=f*h-x*_,P=T*N-w*I+M*D+S*C-b*E+A*m;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/P;return e[0]=(o*N-c*I+l*D)*B,e[1]=(r*I-n*N-s*D)*B,e[2]=(y*A-_*b+h*S)*B,e[3]=(f*b-d*A-x*S)*B,e[4]=(c*C-a*N-l*E)*B,e[5]=(t*N-r*C+s*E)*B,e[6]=(_*M-g*A-h*w)*B,e[7]=(u*A-f*M+x*w)*B,e[8]=(a*I-o*C+l*m)*B,e[9]=(n*C-t*I-s*m)*B,e[10]=(g*b-y*M+h*T)*B,e[11]=(d*M-u*b-x*T)*B,e[12]=(o*E-a*D-c*m)*B,e[13]=(t*D-n*E+r*m)*B,e[14]=(y*w-g*S-_*T)*B,e[15]=(u*S-d*w+f*T)*B,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,c=e.z,l=s*a,u=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,u*o+n,u*c-r*a,0,l*c-r*o,u*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,c=t._w,l=s+s,u=a+a,d=o+o,f=s*l,x=s*u,g=s*d,y=a*u,_=a*d,h=o*d,T=c*l,w=c*u,M=c*d,S=n.x,b=n.y,A=n.z;return r[0]=(1-(y+h))*S,r[1]=(x+M)*S,r[2]=(g-w)*S,r[3]=0,r[4]=(x-M)*b,r[5]=(1-(f+h))*b,r[6]=(_+T)*b,r[7]=0,r[8]=(g+w)*A,r[9]=(_-T)*A,r[10]=(1-(f+y))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=Un.set(r[0],r[1],r[2]).length();const o=Un.set(r[4],r[5],r[6]).length(),c=Un.set(r[8],r[9],r[10]).length();s<0&&(a=-a),Gt.copy(this);const l=1/a,u=1/o,d=1/c;return Gt.elements[0]*=l,Gt.elements[1]*=l,Gt.elements[2]*=l,Gt.elements[4]*=u,Gt.elements[5]*=u,Gt.elements[6]*=u,Gt.elements[8]*=d,Gt.elements[9]*=d,Gt.elements[10]*=d,t.setFromRotationMatrix(Gt),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,r,s,a,o=2e3,c=!1){const l=this.elements,u=2*s/(t-e),d=2*s/(n-r),f=(t+e)/(t-e),x=(n+r)/(n-r);let g,y;if(c)g=s/(a-s),y=a*s/(a-s);else if(o===2e3)g=-(a+s)/(a-s),y=-2*a*s/(a-s);else if(o===2001)g=-a/(a-s),y=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=d,l[9]=x,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=2e3,c=!1){const l=this.elements,u=2/(t-e),d=2/(n-r),f=-(t+e)/(t-e),x=-(n+r)/(n-r);let g,y;if(c)g=1/(a-s),y=a/(a-s);else if(o===2e3)g=-2/(a-s),y=-(a+s)/(a-s);else if(o===2001)g=-1/(a-s),y=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=d,l[9]=0,l[13]=x,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Un=new H,Gt=new pt,Xa=new H(0,0,0),qa=new H(1,1,1),un=new H,bi=new H,Ft=new H,ls=new pt,cs=new Ln;class yn{constructor(e=0,t=0,n=0,r=yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],u=r[9],d=r[2],f=r[6],x=r[10];switch(t){case"XYZ":this._y=Math.asin(Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,x),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,x),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,x),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Ke(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,x),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ke(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,x));break;case"XZY":this._z=Math.asin(-Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,x),this._y=0);break;default:Be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ls.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ls,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return cs.setFromEuler(this),this.setFromQuaternion(cs,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yn.DEFAULT_ORDER="XYZ";class fs{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Ya=0;const hs=new H,Nn=new Ln,an=new pt,Ei=new H,ri=new H,Ka=new H,$a=new Ln,us=new H(1,0,0),ds=new H(0,1,0),_s=new H(0,0,1),xs={type:"added"},Za={type:"removed"},Bn={type:"childadded",child:null},pr={type:"childremoved",child:null};class It extends Mn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ya++}),this.uuid=ni(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=It.DEFAULT_UP.clone();const e=new H,t=new yn,n=new Ln,r=new H(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new pt},normalMatrix:{value:new Oe}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=It.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Nn.setFromAxisAngle(e,t),this.quaternion.multiply(Nn),this}rotateOnWorldAxis(e,t){return Nn.setFromAxisAngle(e,t),this.quaternion.premultiply(Nn),this}rotateX(e){return this.rotateOnAxis(us,e)}rotateY(e){return this.rotateOnAxis(ds,e)}rotateZ(e){return this.rotateOnAxis(_s,e)}translateOnAxis(e,t){return hs.copy(e).applyQuaternion(this.quaternion),this.position.add(hs.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(us,e)}translateY(e){return this.translateOnAxis(ds,e)}translateZ(e){return this.translateOnAxis(_s,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(an.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ei.copy(e):Ei.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),ri.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?an.lookAt(ri,Ei,this.up):an.lookAt(Ei,ri,this.up),this.quaternion.setFromRotationMatrix(an),r&&(an.extractRotation(r.matrixWorld),Nn.setFromRotationMatrix(an),this.quaternion.premultiply(Nn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(et("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(xs),Bn.child=e,this.dispatchEvent(Bn),Bn.child=null):et("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Za),pr.child=e,this.dispatchEvent(pr),pr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),an.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),an.multiply(e.parent.matrixWorld)),e.applyMatrix4(an),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(xs),Bn.child=e,this.dispatchEvent(Bn),Bn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ri,e,Ka),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ri,$a,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*r,s[13]+=n-s[1]*t-s[5]*n-s[9]*r,s[14]+=r-s[2]*t-s[6]*n-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),x=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),x.length>0&&(n.animations=x),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}It.DEFAULT_UP=new H(0,1,0),It.DEFAULT_MATRIX_AUTO_UPDATE=!0,It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ti extends It{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ja={type:"move"};class mr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ti,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ti,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ti,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const y of e.hand.values()){const _=t.getJointPose(y,n),h=this._getHandJoint(l,y);_!==null&&(h.matrix.fromArray(_.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=_.radius),h.visible=_!==null}const u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=u.position.distanceTo(d.position),x=.02,g=.005;l.inputState.pinching&&f>x+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=x-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ja)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ti;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const ps={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},dn={h:0,s:0,l:0},Ai={h:0,s:0,l:0};function gr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<.16666666666666666?i+(e-i)*6*t:t<.5?e:t<.6666666666666666?i+(e-i)*6*(.6666666666666666-t):i}class nt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Dt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=$e.workingColorSpace){return this.r=e,this.g=t,this.b=n,$e.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=$e.workingColorSpace){if(e=Oa(e,1),t=Ke(t,0,1),n=Ke(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=gr(a,s,e+.3333333333333333),this.g=gr(a,s,e),this.b=gr(a,s,e-.3333333333333333)}return $e.colorSpaceToWorking(this,r),this}setStyle(e,t=Dt){function n(s){s!==void 0&&parseFloat(s)<1&&Be("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Be("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Dt){const n=ps[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=sn(e.r),this.g=sn(e.g),this.b=sn(e.b),this}copyLinearToSRGB(e){return this.r=Fn(e.r),this.g=Fn(e.g),this.b=Fn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Dt){return $e.workingToColorSpace(Tt.copy(this),e),Math.round(Ke(Tt.r*255,0,255))*65536+Math.round(Ke(Tt.g*255,0,255))*256+Math.round(Ke(Tt.b*255,0,255))}getHexString(e=Dt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Tt.copy(this),t);const n=Tt.r,r=Tt.g,s=Tt.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=u<=.5?d/(a+o):d/(2-a-o),a){case n:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-n)/d+2;break;case s:c=(n-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Tt.copy(this),t),e.r=Tt.r,e.g=Tt.g,e.b=Tt.b,e}getStyle(e=Dt){$e.workingToColorSpace(Tt.copy(this),e);const t=Tt.r,n=Tt.g,r=Tt.b;return e!==Dt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(dn),this.setHSL(dn.h+e,dn.s+t,dn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(dn),e.getHSL(Ai);const n=fr(dn.h,Ai.h,t),r=fr(dn.s,Ai.s,t),s=fr(dn.l,Ai.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Tt=new nt;nt.NAMES=ps;class ms extends It{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yn,this.environmentIntensity=1,this.environmentRotation=new yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Vt=new H,on=new H,vr=new H,ln=new H,On=new H,kn=new H,gs=new H,Sr=new H,Mr=new H,yr=new H,br=new ut,Er=new ut,Tr=new ut;class Ht{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Vt.subVectors(e,t),r.cross(Vt);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Vt.subVectors(r,t),on.subVectors(n,t),vr.subVectors(e,t);const a=Vt.dot(Vt),o=Vt.dot(on),c=Vt.dot(vr),l=on.dot(on),u=on.dot(vr),d=a*l-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,x=(l*c-o*u)*f,g=(a*u-o*c)*f;return s.set(1-x-g,g,x)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,ln)===null?!1:ln.x>=0&&ln.y>=0&&ln.x+ln.y<=1}static getInterpolation(e,t,n,r,s,a,o,c){return this.getBarycoord(e,t,n,r,ln)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,ln.x),c.addScaledVector(a,ln.y),c.addScaledVector(o,ln.z),c)}static getInterpolatedAttribute(e,t,n,r,s,a){return br.setScalar(0),Er.setScalar(0),Tr.setScalar(0),br.fromBufferAttribute(e,t),Er.fromBufferAttribute(e,n),Tr.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(br,s.x),a.addScaledVector(Er,s.y),a.addScaledVector(Tr,s.z),a}static isFrontFacing(e,t,n,r){return Vt.subVectors(n,t),on.subVectors(e,t),Vt.cross(on).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vt.subVectors(this.c,this.b),on.subVectors(this.a,this.b),Vt.cross(on).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(.3333333333333333)}getNormal(e){return Ht.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ht.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return Ht.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return Ht.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ht.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;On.subVectors(r,n),kn.subVectors(s,n),Sr.subVectors(e,n);const c=On.dot(Sr),l=kn.dot(Sr);if(c<=0&&l<=0)return t.copy(n);Mr.subVectors(e,r);const u=On.dot(Mr),d=kn.dot(Mr);if(u>=0&&d<=u)return t.copy(r);const f=c*d-u*l;if(f<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(n).addScaledVector(On,a);yr.subVectors(e,s);const x=On.dot(yr),g=kn.dot(yr);if(g>=0&&x<=g)return t.copy(s);const y=x*l-c*g;if(y<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(kn,o);const _=u*g-x*d;if(_<=0&&d-u>=0&&x-g>=0)return gs.subVectors(s,r),o=(d-u)/(d-u+(x-g)),t.copy(r).addScaledVector(gs,o);const h=1/(_+y+f);return a=y*h,o=f*h,t.copy(n).addScaledVector(On,a).addScaledVector(kn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class si{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Wt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Wt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Wt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Wt):Wt.fromBufferAttribute(s,a),Wt.applyMatrix4(e.matrixWorld),this.expandByPoint(Wt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ri.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ri.copy(n.boundingBox)),Ri.applyMatrix4(e.matrixWorld),this.union(Ri)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Wt),Wt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ai),wi.subVectors(this.max,ai),zn.subVectors(e.a,ai),Gn.subVectors(e.b,ai),Vn.subVectors(e.c,ai),_n.subVectors(Gn,zn),xn.subVectors(Vn,Gn),bn.subVectors(zn,Vn);let t=[0,-_n.z,_n.y,0,-xn.z,xn.y,0,-bn.z,bn.y,_n.z,0,-_n.x,xn.z,0,-xn.x,bn.z,0,-bn.x,-_n.y,_n.x,0,-xn.y,xn.x,0,-bn.y,bn.x,0];return!Ar(t,zn,Gn,Vn,wi)||(t=[1,0,0,0,1,0,0,0,1],!Ar(t,zn,Gn,Vn,wi))?!1:(Ci.crossVectors(_n,xn),t=[Ci.x,Ci.y,Ci.z],Ar(t,zn,Gn,Vn,wi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Wt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Wt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(cn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),cn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),cn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),cn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),cn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),cn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),cn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),cn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(cn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const cn=[new H,new H,new H,new H,new H,new H,new H,new H],Wt=new H,Ri=new si,zn=new H,Gn=new H,Vn=new H,_n=new H,xn=new H,bn=new H,ai=new H,wi=new H,Ci=new H,En=new H;function Ar(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){En.fromArray(i,s);const o=r.x*Math.abs(En.x)+r.y*Math.abs(En.y)+r.z*Math.abs(En.z),c=e.dot(En),l=t.dot(En),u=n.dot(En);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const gt=new H,Pi=new Ze;let Qa=0;class fn extends Mn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Qa++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Pi.fromBufferAttribute(this,t),Pi.applyMatrix3(e),this.setXY(t,Pi.x,Pi.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ii(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ii(t,this.array)),t}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ii(t,this.array)),t}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ii(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ii(t,this.array)),t}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),r=Lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),r=Lt(r,this.array),s=Lt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class vs extends fn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Ss extends fn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class $t extends fn{constructor(e,t,n){super(new Float32Array(e),t,n)}}const ja=new si,oi=new H,Rr=new H;class wr{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):ja.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;oi.subVectors(e,this.center);const t=oi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(oi,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Rr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(oi.copy(e.center).add(Rr)),this.expandByPoint(oi.copy(e.center).sub(Rr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let eo=0;const Ot=new pt,Cr=new It,Hn=new H,Ut=new si,li=new si,bt=new H;class Zt extends Mn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:eo++}),this.uuid=ni(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ia(e)?Ss:vs)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Oe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ot.makeRotationFromQuaternion(e),this.applyMatrix4(Ot),this}rotateX(e){return Ot.makeRotationX(e),this.applyMatrix4(Ot),this}rotateY(e){return Ot.makeRotationY(e),this.applyMatrix4(Ot),this}rotateZ(e){return Ot.makeRotationZ(e),this.applyMatrix4(Ot),this}translate(e,t,n){return Ot.makeTranslation(e,t,n),this.applyMatrix4(Ot),this}scale(e,t,n){return Ot.makeScale(e,t,n),this.applyMatrix4(Ot),this}lookAt(e){return Cr.lookAt(e),Cr.updateMatrix(),this.applyMatrix4(Cr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hn).negate(),this.translate(Hn.x,Hn.y,Hn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new $t(n,3))}else{const n=Math.min(e.length,t.count);for(let r=0;r<n;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new si);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){et("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Ut.setFromBufferAttribute(s),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Ut.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Ut.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Ut.min),this.boundingBox.expandByPoint(Ut.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&et('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){et("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const n=this.boundingSphere.center;if(Ut.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];li.setFromBufferAttribute(o),this.morphTargetsRelative?(bt.addVectors(Ut.min,li.min),Ut.expandByPoint(bt),bt.addVectors(Ut.max,li.max),Ut.expandByPoint(bt)):(Ut.expandByPoint(li.min),Ut.expandByPoint(li.max))}Ut.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)bt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(bt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)bt.fromBufferAttribute(o,l),c&&(Hn.fromBufferAttribute(e,l),bt.add(Hn)),r=Math.max(r,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&et('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){et("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new fn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let m=0;m<n.count;m++)o[m]=new H,c[m]=new H;const l=new H,u=new H,d=new H,f=new Ze,x=new Ze,g=new Ze,y=new H,_=new H;function h(m,E,C){l.fromBufferAttribute(n,m),u.fromBufferAttribute(n,E),d.fromBufferAttribute(n,C),f.fromBufferAttribute(s,m),x.fromBufferAttribute(s,E),g.fromBufferAttribute(s,C),u.sub(l),d.sub(l),x.sub(f),g.sub(f);const D=1/(x.x*g.y-g.x*x.y);isFinite(D)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(d,-x.y).multiplyScalar(D),_.copy(d).multiplyScalar(x.x).addScaledVector(u,-g.x).multiplyScalar(D),o[m].add(y),o[E].add(y),o[C].add(y),c[m].add(_),c[E].add(_),c[C].add(_))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let m=0,E=T.length;m<E;++m){const C=T[m],D=C.start,I=C.count;for(let N=D,P=D+I;N<P;N+=3)h(e.getX(N+0),e.getX(N+1),e.getX(N+2))}const w=new H,M=new H,S=new H,b=new H;function A(m){S.fromBufferAttribute(r,m),b.copy(S);const E=o[m];w.copy(E),w.sub(S.multiplyScalar(S.dot(E))).normalize(),M.crossVectors(b,E);const D=M.dot(c[m])<0?-1:1;a.setXYZW(m,w.x,w.y,w.z,D)}for(let m=0,E=T.length;m<E;++m){const C=T[m],D=C.start,I=C.count;for(let N=D,P=D+I;N<P;N+=3)A(e.getX(N+0)),A(e.getX(N+1)),A(e.getX(N+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new fn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,x=n.count;f<x;f++)n.setXYZ(f,0,0,0);const r=new H,s=new H,a=new H,o=new H,c=new H,l=new H,u=new H,d=new H;if(e)for(let f=0,x=e.count;f<x;f+=3){const g=e.getX(f+0),y=e.getX(f+1),_=e.getX(f+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,y),a.fromBufferAttribute(t,_),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,_),o.add(u),c.add(u),l.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(_,l.x,l.y,l.z)}else for(let f=0,x=t.count;f<x;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,d=o.normalized,f=new l.constructor(c.length*u);let x=0,g=0;for(let y=0,_=c.length;y<_;y++){o.isInterleavedBufferAttribute?x=c[y]*o.data.stride+o.offset:x=c[y]*u;for(let h=0;h<u;h++)f[g++]=l[x++]}return new fn(f,u,d)}if(this.index===null)return Be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Zt,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,n);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let u=0,d=l.length;u<d;u++){const f=l[u],x=e(f,n);c.push(x)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let d=0,f=l.length;d<f;d++){const x=l[d];u.push(x.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],d=s[l];for(let f=0,x=d.length;f<x;f++)u.push(d[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,u=a.length;l<u;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Pr=new H,to=new H,no=new Oe;class pn{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=Pr.subVectors(n,t).cross(to.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const r=e.delta(Pr),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||no.getNormalMatrix(e),r=this.coplanarPoint(Pr).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let io=0;class Di extends Mn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:io++}),this.uuid=ni(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new nt(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Be(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new nt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new pn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ze().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ze().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const hn=new H,Dr=new H,Li=new H,Fi=new H;class ro{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hn.copy(this.origin).addScaledVector(this.direction,t),hn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Dr.copy(e).add(t).multiplyScalar(.5),Li.copy(t).sub(e).normalize(),Fi.copy(this.origin).sub(Dr);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Li),o=Fi.dot(this.direction),c=-Fi.dot(Li),l=Fi.lengthSq(),u=Math.abs(1-a*a);let d,f,x,g;if(u>0)if(d=a*c-o,f=a*o-c,g=s*u,d>=0)if(f>=-g)if(f<=g){const y=1/u;d*=y,f*=y,x=d*(d+a*f+2*o)+f*(a*d+f+2*c)+l}else f=s,d=Math.max(0,-(a*f+o)),x=-d*d+f*(f+2*c)+l;else f=-s,d=Math.max(0,-(a*f+o)),x=-d*d+f*(f+2*c)+l;else f<=-g?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-c),s),x=-d*d+f*(f+2*c)+l):f<=g?(d=0,f=Math.min(Math.max(-s,-c),s),x=f*(f+2*c)+l):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-c),s),x=-d*d+f*(f+2*c)+l);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),x=-d*d+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(Dr).addScaledVector(Li,f),x}intersectSphere(e,t){if(e.radius<0)return null;hn.subVectors(e.center,this.origin);const n=hn.dot(this.direction),r=hn.dot(hn)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,r=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,r=(e.min.x-f.x)*l),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,hn)!==null}intersectTriangle(e,t,n,r,s){const a=this.origin,o=this.direction,c=o.x,l=o.y,u=o.z,d=e.x-a.x,f=e.y-a.y,x=e.z-a.z,g=t.x-a.x,y=t.y-a.y,_=t.z-a.z,h=n.x-a.x,T=n.y-a.y,w=n.z-a.z,M=Math.abs(c),S=Math.abs(l),b=Math.abs(u);let A,m,E,C,D,I,N,P,B,G,W,j;if(M>=S&&M>=b?(E=c,I=d,B=g,j=h,c>=0?(A=l,m=u,C=f,D=x,N=y,P=_,G=T,W=w):(A=u,m=l,C=x,D=f,N=_,P=y,G=w,W=T)):S>=b?(E=l,I=f,B=y,j=T,l>=0?(A=u,m=c,C=x,D=d,N=_,P=g,G=w,W=h):(A=c,m=u,C=d,D=x,N=g,P=_,G=h,W=w)):(E=u,I=x,B=_,j=w,u>=0?(A=c,m=l,C=d,D=f,N=g,P=y,G=h,W=T):(A=l,m=c,C=f,D=d,N=y,P=g,G=T,W=h)),E===0)return null;const X=A/E,Z=m/E,ee=1/E,Se=C-X*I,ge=D-Z*I,Xe=N-X*B,Fe=P-Z*B,Ge=G-X*j,Y=W-Z*j,K=Ge*Fe-Y*Xe,pe=Se*Y-ge*Ge,De=Xe*ge-Fe*Se;if(r){if(K<0||pe<0||De<0)return null}else if((K<0||pe<0||De<0)&&(K>0||pe>0||De>0))return null;const ue=K+pe+De;if(ue===0)return null;const ke=ee*(K*I+pe*B+De*j);return(ue>0?ke<0:ke>0)?null:this.at(ke/ue,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Lr extends Di{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ms=new pt,Tn=new ro,Ii=new wr,ys=new H,Ui=new H,Ni=new H,Bi=new H,Fr=new H,Oi=new H,bs=new H,ki=new H;class Xt extends It{constructor(e=new Zt,t=new Lr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Oi.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=o[c],d=s[c];u!==0&&(Fr.fromBufferAttribute(d,e),a?Oi.addScaledVector(Fr,u):Oi.addScaledVector(Fr.sub(t),u))}t.add(Oi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ii.copy(n.boundingSphere),Ii.applyMatrix4(s),Tn.copy(e.ray).recast(e.near),!(Ii.containsPoint(Tn.origin)===!1&&(Tn.intersectSphere(Ii,ys)===null||Tn.origin.distanceToSquared(ys)>(e.far-e.near)**2))&&(Ms.copy(s).invert(),Tn.copy(e.ray).applyMatrix4(Ms),!(n.boundingBox!==null&&Tn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Tn)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,x=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=f.length;g<y;g++){const _=f[g],h=a[_.materialIndex],T=Math.max(_.start,x.start),w=Math.min(o.count,Math.min(_.start+_.count,x.start+x.count));for(let M=T,S=w;M<S;M+=3){const b=o.getX(M),A=o.getX(M+1),m=o.getX(M+2);r=zi(this,h,e,n,l,u,d,b,A,m),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=_.materialIndex,t.push(r))}}else{const g=Math.max(0,x.start),y=Math.min(o.count,x.start+x.count);for(let _=g,h=y;_<h;_+=3){const T=o.getX(_),w=o.getX(_+1),M=o.getX(_+2);r=zi(this,a,e,n,l,u,d,T,w,M),r&&(r.faceIndex=Math.floor(_/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,y=f.length;g<y;g++){const _=f[g],h=a[_.materialIndex],T=Math.max(_.start,x.start),w=Math.min(c.count,Math.min(_.start+_.count,x.start+x.count));for(let M=T,S=w;M<S;M+=3){const b=M,A=M+1,m=M+2;r=zi(this,h,e,n,l,u,d,b,A,m),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=_.materialIndex,t.push(r))}}else{const g=Math.max(0,x.start),y=Math.min(c.count,x.start+x.count);for(let _=g,h=y;_<h;_+=3){const T=_,w=_+1,M=_+2;r=zi(this,a,e,n,l,u,d,T,w,M),r&&(r.faceIndex=Math.floor(_/3),t.push(r))}}}}function so(i,e,t,n,r,s,a,o){let c;if(e.side===1?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,e.side===0,o),c===null)return null;ki.copy(o),ki.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(ki);return l<t.near||l>t.far?null:{distance:l,point:ki.clone(),object:i}}function zi(i,e,t,n,r,s,a,o,c,l){i.getVertexPosition(o,Ui),i.getVertexPosition(c,Ni),i.getVertexPosition(l,Bi);const u=so(i,e,t,n,Ui,Ni,Bi,bs);if(u){const d=new H;Ht.getBarycoord(bs,Ui,Ni,Bi,d),r&&(u.uv=Ht.getInterpolatedAttribute(r,o,c,l,d,new Ze)),s&&(u.uv1=Ht.getInterpolatedAttribute(s,o,c,l,d,new Ze)),a&&(u.normal=Ht.getInterpolatedAttribute(a,o,c,l,d,new H),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new H,materialIndex:0};Ht.getNormal(Ui,Ni,Bi,f.normal),u.face=f,u.barycoord=d}return u}class Wn extends Rt{constructor(e=null,t=1,n=1,r,s,a,o,c,l=1003,u=1003,d,f){super(null,a,o,c,l,u,r,s,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const An=new wr,ao=new Ze(.5,.5),Gi=new H;class Es{constructor(e=new pn,t=new pn,n=new pn,r=new pn,s=new pn,a=new pn){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3,n=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],c=s[2],l=s[3],u=s[4],d=s[5],f=s[6],x=s[7],g=s[8],y=s[9],_=s[10],h=s[11],T=s[12],w=s[13],M=s[14],S=s[15];if(r[0].setComponents(l-a,x-u,h-g,S-T).normalize(),r[1].setComponents(l+a,x+u,h+g,S+T).normalize(),r[2].setComponents(l+o,x+d,h+y,S+w).normalize(),r[3].setComponents(l-o,x-d,h-y,S-w).normalize(),n)r[4].setComponents(c,f,_,M).normalize(),r[5].setComponents(l-c,x-f,h-_,S-M).normalize();else if(r[4].setComponents(l-c,x-f,h-_,S-M).normalize(),t===2e3)r[5].setComponents(l+c,x+f,h+_,S+M).normalize();else if(t===2001)r[5].setComponents(c,f,_,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),An.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),An.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(An)}intersectsSprite(e){An.center.set(0,0,0);const t=ao.distanceTo(e.center);return An.radius=.7071067811865476+t,An.applyMatrix4(e.matrixWorld),this.intersectsSphere(An)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(Gi.x=r.normal.x>0?e.max.x:e.min.x,Gi.y=r.normal.y>0?e.max.y:e.min.y,Gi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Gi)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ts extends Rt{constructor(e=[],t=301,n,r,s,a,o,c,l,u){super(e,t,n,r,s,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ci extends Rt{constructor(e,t,n=1014,r,s,a,o=1003,c=1003,l,u=1026,d=1){if(u!==1026&&u!==1027)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:d};super(f,r,s,a,o,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new dr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class oo extends ci{constructor(e,t=1014,n=301,r,s,a=1003,o=1003,c,l=1026){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,r,s,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class As extends Rt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class fi extends Zt{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],u=[],d=[];let f=0,x=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,r,a,2),g("x","z","y",1,-1,e,n,-t,r,a,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new $t(l,3)),this.setAttribute("normal",new $t(u,3)),this.setAttribute("uv",new $t(d,2));function g(y,_,h,T,w,M,S,b,A,m,E){const C=M/A,D=S/m,I=M/2,N=S/2,P=b/2,B=A+1,G=m+1;let W=0,j=0;const X=new H;for(let Z=0;Z<G;Z++){const ee=Z*D-N;for(let Se=0;Se<B;Se++){const ge=Se*C-I;X[y]=ge*T,X[_]=ee*w,X[h]=P,l.push(X.x,X.y,X.z),X[y]=0,X[_]=0,X[h]=b>0?1:-1,u.push(X.x,X.y,X.z),d.push(Se/A),d.push(1-Z/m),W+=1}}for(let Z=0;Z<m;Z++)for(let ee=0;ee<A;ee++){const Se=f+ee+B*Z,ge=f+ee+B*(Z+1),Xe=f+(ee+1)+B*(Z+1),Fe=f+(ee+1)+B*Z;c.push(Se,ge,Fe),c.push(ge,Xe,Fe),j+=6}o.addGroup(x,j,E),x+=j,f+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class hi extends Zt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),c=Math.floor(r),l=o+1,u=c+1,d=e/o,f=t/c,x=[],g=[],y=[],_=[];for(let h=0;h<u;h++){const T=h*f-a;for(let w=0;w<l;w++){const M=w*d-s;g.push(M,-T,0),y.push(0,0,1),_.push(w/o),_.push(1-h/c)}}for(let h=0;h<c;h++)for(let T=0;T<o;T++){const w=T+l*h,M=T+l*(h+1),S=T+1+l*(h+1),b=T+1+l*h;x.push(w,M,b),x.push(M,S,b)}this.setIndex(x),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(y,3)),this.setAttribute("uv",new $t(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hi(e.width,e.height,e.widthSegments,e.heightSegments)}}function Xn(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];if(Rs(r))r.isRenderTargetTexture?(Be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone();else if(Array.isArray(r))if(Rs(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][n]=s}else e[t][n]=r.slice();else e[t][n]=r}}return e}function wt(i){const e={};for(let t=0;t<i.length;t++){const n=Xn(i[t]);for(const r in n)e[r]=n[r]}return e}function Rs(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function lo(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ws(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const co={clone:Xn,merge:wt};var fo=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ho=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Jt extends Di{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fo,this.fragmentShader=ho,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Xn(e.uniforms),this.uniformsGroups=lo(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case"t":this.uniforms[n].value=t[r.value]||null;break;case"c":this.uniforms[n].value=new nt().setHex(r.value);break;case"v2":this.uniforms[n].value=new Ze().fromArray(r.value);break;case"v3":this.uniforms[n].value=new H().fromArray(r.value);break;case"v4":this.uniforms[n].value=new ut().fromArray(r.value);break;case"m3":this.uniforms[n].value=new Oe().fromArray(r.value);break;case"m4":this.uniforms[n].value=new pt().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Cs extends Jt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class uo extends Di{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class _o extends Di{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Vi=new H,Hi=new Ln,Qt=new H;class Ps extends It{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=2e3,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Vi,Hi,Qt),Qt.x===1&&Qt.y===1&&Qt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Vi,Hi,Qt.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Vi,Hi,Qt),Qt.x===1&&Qt.y===1&&Qt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Vi,Hi,Qt.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const mn=new H,Ds=new Ze,Ls=new Ze;class qt extends Ps{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=cr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(lr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return cr*2*Math.atan(Math.tan(lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){mn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(mn.x,mn.y).multiplyScalar(-e/mn.z),mn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(mn.x,mn.y).multiplyScalar(-e/mn.z)}getViewSize(e,t){return this.getViewBounds(e,Ds,Ls),t.subVectors(Ls,Ds)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(lr*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,t-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Wi extends Ps{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const qn=-90,Yn=1;class xo extends It{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new qt(qn,Yn,e,t);r.layers=this.layers,this.add(r);const s=new qt(qn,Yn,e,t);s.layers=this.layers,this.add(s);const a=new qt(qn,Yn,e,t);a.layers=this.layers,this.add(a);const o=new qt(qn,Yn,e,t);o.layers=this.layers,this.add(o);const c=new qt(qn,Yn,e,t);c.layers=this.layers,this.add(c);const l=new qt(qn,Yn,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,c]=t;for(const l of t)this.remove(l);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),x=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let _=!1;e.isWebGLRenderer===!0?_=e.state.buffers.depth.getReversed():_=e.reversedDepthBuffer,e.setRenderTarget(n,0,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,r),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,f,x),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class po extends qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Fs{static{Fs.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=r,this}}function Is(i,e,t,n){const r=mo(n);switch(t){case 1021:return i*e;case 1028:return i*e/r.components*r.byteLength;case 1029:return i*e/r.components*r.byteLength;case 1030:return i*e*2/r.components*r.byteLength;case 1031:return i*e*2/r.components*r.byteLength;case 1022:return i*e*3/r.components*r.byteLength;case 1023:return i*e*4/r.components*r.byteLength;case 1033:return i*e*4/r.components*r.byteLength;case 33776:case 33777:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(i,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(i,8)*Math.max(e,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(i/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(i/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mo(i){switch(i){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}})),typeof window<"u"&&(window.__THREE__?Be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Us(){let i=null,e=!1,t=null,n=null;function r(s,a){n=i.requestAnimationFrame(r),t(s,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function go(i){const e=new WeakMap;function t(o,c){const l=o.array,u=o.usage,d=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,u),o.onUploadCallback();let x;if(l instanceof Float32Array)x=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)x=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?x=i.HALF_FLOAT:x=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)x=i.SHORT;else if(l instanceof Uint32Array)x=i.UNSIGNED_INT;else if(l instanceof Int32Array)x=i.INT;else if(l instanceof Int8Array)x=i.BYTE;else if(l instanceof Uint8Array)x=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)x=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:x,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const u=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,u);else{d.sort((x,g)=>x.start-g.start);let f=0;for(let x=1;x<d.length;x++){const g=d[f],y=d[x];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++f,d[f]=y)}d.length=f+1;for(let x=0,g=d.length;x<g;x++){const y=d[x];i.bufferSubData(l,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var vo=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,So=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Mo=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yo=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bo=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Eo=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,To=`#ifdef USE_AOMAP
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
#endif`,Ao=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ro=`#ifdef USE_BATCHING
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
#endif`,wo=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Co=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Po=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Do=`float G_BlinnPhong_Implicit( ) {
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
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Lo=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
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
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Fo=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Io=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Uo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,No=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bo=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Oo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,ko=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,zo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Go=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Vo=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
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
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ho=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
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
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
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
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
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
			mip = - 2.0 * log2( 1.16 * roughness );		}
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
#endif`,Wo=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
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
#endif`,Xo=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qo=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Yo=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ko=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$o="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zo=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jo=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
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
#endif`,Qo=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,jo=`#ifdef USE_ENVMAP
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
#endif`,el=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,tl=`#ifdef USE_ENVMAP
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
#endif`,nl=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,il=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rl=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sl=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,al=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ol=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ll=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cl=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,fl=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
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
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
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
#include <lightprobes_pars_fragment>`,hl=`#ifdef USE_ENVMAP
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
#endif`,ul=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dl=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_l=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xl=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,pl=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
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
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
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
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ml=`uniform sampler2D dfgLUT;
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
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
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
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
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
	float alpha = pow2( roughness );
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
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
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
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
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
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
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
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
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
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
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
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,gl=`
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
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
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
#endif`,vl=`#if defined( RE_IndirectDiffuse )
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
#endif`,Sl=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ml=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
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
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
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
#endif`,yl=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bl=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,El=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tl=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Al=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Rl=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,wl=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Cl=`#if defined( USE_POINTS_UV )
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
#endif`,Pl=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Dl=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ll=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Fl=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Il=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ul=`#ifdef USE_MORPHTARGETS
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
#endif`,Nl=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bl=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ol=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
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
#endif`,kl=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zl=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gl=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Vl=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Hl=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wl=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xl=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ql=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Yl=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Kl=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
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
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,$l=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zl=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jl=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ql=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jl=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ec=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tc=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
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
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
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
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
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
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
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
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
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
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
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
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
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
#endif`,nc=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
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
#endif`,ic=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
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
#endif
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
#endif`,rc=`float getShadowMask() {
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
	#endif
	return shadow;
}`,sc=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ac=`#ifdef USE_SKINNING
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
#endif`,oc=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lc=`#ifdef USE_SKINNING
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
#endif`,cc=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fc=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hc=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,uc=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
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
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,dc=`#ifdef USE_TRANSMISSION
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
#endif`,_c=`#ifdef USE_TRANSMISSION
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
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
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
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
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
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,xc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mc=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gc=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const He={alphahash_fragment:vo,alphahash_pars_fragment:So,alphamap_fragment:Mo,alphamap_pars_fragment:yo,alphatest_fragment:bo,alphatest_pars_fragment:Eo,aomap_fragment:To,aomap_pars_fragment:Ao,batching_pars_vertex:Ro,batching_vertex:wo,begin_vertex:Co,beginnormal_vertex:Po,bsdfs:Do,iridescence_fragment:Lo,bumpmap_pars_fragment:Fo,clipping_planes_fragment:Io,clipping_planes_pars_fragment:Uo,clipping_planes_pars_vertex:No,clipping_planes_vertex:Bo,color_fragment:Oo,color_pars_fragment:ko,color_pars_vertex:zo,color_vertex:Go,common:Vo,cube_uv_reflection_fragment:Ho,defaultnormal_vertex:Wo,displacementmap_pars_vertex:Xo,displacementmap_vertex:qo,emissivemap_fragment:Yo,emissivemap_pars_fragment:Ko,colorspace_fragment:$o,colorspace_pars_fragment:Zo,envmap_fragment:Jo,envmap_common_pars_fragment:Qo,envmap_pars_fragment:jo,envmap_pars_vertex:el,envmap_physical_pars_fragment:hl,envmap_vertex:tl,fog_vertex:nl,fog_pars_vertex:il,fog_fragment:rl,fog_pars_fragment:sl,gradientmap_pars_fragment:al,lightmap_pars_fragment:ol,lights_lambert_fragment:ll,lights_lambert_pars_fragment:cl,lights_pars_begin:fl,lights_toon_fragment:ul,lights_toon_pars_fragment:dl,lights_phong_fragment:_l,lights_phong_pars_fragment:xl,lights_physical_fragment:pl,lights_physical_pars_fragment:ml,lights_fragment_begin:gl,lights_fragment_maps:vl,lights_fragment_end:Sl,lightprobes_pars_fragment:Ml,logdepthbuf_fragment:yl,logdepthbuf_pars_fragment:bl,logdepthbuf_pars_vertex:El,logdepthbuf_vertex:Tl,map_fragment:Al,map_pars_fragment:Rl,map_particle_fragment:wl,map_particle_pars_fragment:Cl,metalnessmap_fragment:Pl,metalnessmap_pars_fragment:Dl,morphinstance_vertex:Ll,morphcolor_vertex:Fl,morphnormal_vertex:Il,morphtarget_pars_vertex:Ul,morphtarget_vertex:Nl,normal_fragment_begin:Bl,normal_fragment_maps:Ol,normal_pars_fragment:kl,normal_pars_vertex:zl,normal_vertex:Gl,normalmap_pars_fragment:Vl,clearcoat_normal_fragment_begin:Hl,clearcoat_normal_fragment_maps:Wl,clearcoat_pars_fragment:Xl,iridescence_pars_fragment:ql,opaque_fragment:Yl,packing:Kl,premultiplied_alpha_fragment:$l,project_vertex:Zl,dithering_fragment:Jl,dithering_pars_fragment:Ql,roughnessmap_fragment:jl,roughnessmap_pars_fragment:ec,shadowmap_pars_fragment:tc,shadowmap_pars_vertex:nc,shadowmap_vertex:ic,shadowmask_pars_fragment:rc,skinbase_vertex:sc,skinning_pars_vertex:ac,skinning_vertex:oc,skinnormal_vertex:lc,specularmap_fragment:cc,specularmap_pars_fragment:fc,tonemapping_fragment:hc,tonemapping_pars_fragment:uc,transmission_fragment:dc,transmission_pars_fragment:_c,uv_pars_fragment:xc,uv_pars_vertex:pc,uv_vertex:mc,worldpos_vertex:gc,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
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
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
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
}`,depth_frag:`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
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
}`,distance_frag:`#define DISTANCE
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
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
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
}`,linedashed_frag:`uniform vec3 diffuse;
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
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
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
}`,meshbasic_frag:`uniform vec3 diffuse;
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
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
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
}`,meshlambert_vert:`#define LAMBERT
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
}`,meshlambert_frag:`#define LAMBERT
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
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
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
}`,meshmatcap_frag:`#define MATCAP
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
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
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
}`,meshnormal_frag:`#define NORMAL
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
}`,meshphong_vert:`#define PHONG
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
}`,meshphong_frag:`#define PHONG
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
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
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
}`,meshphysical_frag:`#define STANDARD
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
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
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
}`,meshtoon_vert:`#define TOON
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
}`,meshtoon_frag:`#define TOON
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
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
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
}`,points_frag:`uniform vec3 diffuse;
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
}`,shadow_vert:`#include <common>
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
}`,shadow_frag:`uniform vec3 color;
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
}`,sprite_vert:`uniform float rotation;
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
}`,sprite_frag:`uniform vec3 diffuse;
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
}`},fe={common:{diffuse:{value:new nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new Ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new H},probesMax:{value:new H},probesResolution:{value:new H}},points:{diffuse:{value:new nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new nt(16777215)},opacity:{value:1},center:{value:new Ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},jt={basic:{uniforms:wt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:wt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new nt(0)},envMapIntensity:{value:1}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:wt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new nt(0)},specular:{value:new nt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:wt([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:wt([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new nt(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:wt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:wt([fe.points,fe.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:wt([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:wt([fe.common,fe.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:wt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:wt([fe.sprite,fe.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distance:{uniforms:wt([fe.common,fe.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distance_vert,fragmentShader:He.distance_frag},shadow:{uniforms:wt([fe.lights,fe.fog,{color:{value:new nt(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};jt.physical={uniforms:wt([jt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new Ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new Ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new nt(0)},specularColor:{value:new nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new Ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const Xi={r:0,b:0,g:0},vc=new pt,Ns=new Oe;Ns.set(-1,0,0,0,1,0,0,0,1);function Sc(i,e,t,n,r,s){const a=new nt(0);let o=r===!0?0:1,c,l,u=null,d=0,f=null;function x(T){let w=T.isScene===!0?T.background:null;if(w&&w.isTexture){const M=T.backgroundBlurriness>0;w=e.get(w,M)}return w}function g(T){let w=!1;const M=x(T);M===null?_(a,o):M&&M.isColor&&(_(M,1),w=!0);const S=i.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,s):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(i.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(T,w){const M=x(w);M&&(M.isCubeTexture||M.mapping===306)?(l===void 0&&(l=new Xt(new fi(1,1,1),new Jt({name:"BackgroundCubeMaterial",uniforms:Xn(jt.backgroundCube.uniforms),vertexShader:jt.backgroundCube.vertexShader,fragmentShader:jt.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(S,b,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(vc.makeRotationFromEuler(w.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Ns),l.material.toneMapped=$e.getTransfer(M.colorSpace)!==st,(u!==M||d!==M.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=M,d=M.version,f=i.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Xt(new hi(2,2),new Jt({name:"BackgroundMaterial",uniforms:Xn(jt.background.uniforms),vertexShader:jt.background.vertexShader,fragmentShader:jt.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=$e.getTransfer(M.colorSpace)!==st,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||d!==M.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=M,d=M.version,f=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function _(T,w){T.getRGB(Xi,ws(i)),t.buffers.color.setClear(Xi.r,Xi.g,Xi.b,w,s)}function h(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(T,w=1){a.set(T),o=w,_(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(T){o=T,_(a,o)},render:g,addToRenderList:y,dispose:h}}function Mc(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=f(null);let s=r,a=!1;function o(D,I,N,P,B){let G=!1;const W=d(D,P,N,I);s!==W&&(s=W,l(s.object)),G=x(D,P,N,B),G&&g(D,P,N,B),B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,M(D,I,N,P),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function c(){return i.createVertexArray()}function l(D){return i.bindVertexArray(D)}function u(D){return i.deleteVertexArray(D)}function d(D,I,N,P){const B=P.wireframe===!0;let G=n[I.id];G===void 0&&(G={},n[I.id]=G);const W=D.isInstancedMesh===!0?D.id:0;let j=G[W];j===void 0&&(j={},G[W]=j);let X=j[N.id];X===void 0&&(X={},j[N.id]=X);let Z=X[B];return Z===void 0&&(Z=f(c()),X[B]=Z),Z}function f(D){const I=[],N=[],P=[];for(let B=0;B<t;B++)I[B]=0,N[B]=0,P[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:N,attributeDivisors:P,object:D,attributes:{},index:null}}function x(D,I,N,P){const B=s.attributes,G=I.attributes;let W=0;const j=N.getAttributes();for(const X in j)if(j[X].location>=0){const ee=B[X];let Se=G[X];if(Se===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(Se=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(Se=D.instanceColor)),ee===void 0||ee.attribute!==Se||Se&&ee.data!==Se.data)return!0;W++}return s.attributesNum!==W||s.index!==P}function g(D,I,N,P){const B={},G=I.attributes;let W=0;const j=N.getAttributes();for(const X in j)if(j[X].location>=0){let ee=G[X];ee===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(ee=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(ee=D.instanceColor));const Se={};Se.attribute=ee,ee&&ee.data&&(Se.data=ee.data),B[X]=Se,W++}s.attributes=B,s.attributesNum=W,s.index=P}function y(){const D=s.newAttributes;for(let I=0,N=D.length;I<N;I++)D[I]=0}function _(D){h(D,0)}function h(D,I){const N=s.newAttributes,P=s.enabledAttributes,B=s.attributeDivisors;N[D]=1,P[D]===0&&(i.enableVertexAttribArray(D),P[D]=1),B[D]!==I&&(i.vertexAttribDivisor(D,I),B[D]=I)}function T(){const D=s.newAttributes,I=s.enabledAttributes;for(let N=0,P=I.length;N<P;N++)I[N]!==D[N]&&(i.disableVertexAttribArray(N),I[N]=0)}function w(D,I,N,P,B,G,W){W===!0?i.vertexAttribIPointer(D,I,N,B,G):i.vertexAttribPointer(D,I,N,P,B,G)}function M(D,I,N,P){y();const B=P.attributes,G=N.getAttributes(),W=I.defaultAttributeValues;for(const j in G){const X=G[j];if(X.location>=0){let Z=B[j];if(Z===void 0&&(j==="instanceMatrix"&&D.instanceMatrix&&(Z=D.instanceMatrix),j==="instanceColor"&&D.instanceColor&&(Z=D.instanceColor)),Z!==void 0){const ee=Z.normalized,Se=Z.itemSize,ge=e.get(Z);if(ge===void 0)continue;const Xe=ge.buffer,Fe=ge.type,Ge=ge.bytesPerElement,Y=Fe===i.INT||Fe===i.UNSIGNED_INT||Z.gpuType===1013;if(Z.isInterleavedBufferAttribute){const K=Z.data,pe=K.stride,De=Z.offset;if(K.isInstancedInterleavedBuffer){for(let ue=0;ue<X.locationSize;ue++)h(X.location+ue,K.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ue=0;ue<X.locationSize;ue++)_(X.location+ue);i.bindBuffer(i.ARRAY_BUFFER,Xe);for(let ue=0;ue<X.locationSize;ue++)w(X.location+ue,Se/X.locationSize,Fe,ee,pe*Ge,(De+Se/X.locationSize*ue)*Ge,Y)}else{if(Z.isInstancedBufferAttribute){for(let K=0;K<X.locationSize;K++)h(X.location+K,Z.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let K=0;K<X.locationSize;K++)_(X.location+K);i.bindBuffer(i.ARRAY_BUFFER,Xe);for(let K=0;K<X.locationSize;K++)w(X.location+K,Se/X.locationSize,Fe,ee,Se*Ge,Se/X.locationSize*K*Ge,Y)}}else if(W!==void 0){const ee=W[j];if(ee!==void 0)switch(ee.length){case 2:i.vertexAttrib2fv(X.location,ee);break;case 3:i.vertexAttrib3fv(X.location,ee);break;case 4:i.vertexAttrib4fv(X.location,ee);break;default:i.vertexAttrib1fv(X.location,ee)}}}}T()}function S(){E();for(const D in n){const I=n[D];for(const N in I){const P=I[N];for(const B in P){const G=P[B];for(const W in G)u(G[W].object),delete G[W];delete P[B]}}delete n[D]}}function b(D){if(n[D.id]===void 0)return;const I=n[D.id];for(const N in I){const P=I[N];for(const B in P){const G=P[B];for(const W in G)u(G[W].object),delete G[W];delete P[B]}}delete n[D.id]}function A(D){for(const I in n){const N=n[I];for(const P in N){const B=N[P];if(B[D.id]===void 0)continue;const G=B[D.id];for(const W in G)u(G[W].object),delete G[W];delete B[D.id]}}}function m(D){for(const I in n){const N=n[I],P=D.isInstancedMesh===!0?D.id:0,B=N[P];if(B!==void 0){for(const G in B){const W=B[G];for(const j in W)u(W[j].object),delete W[j];delete B[G]}delete N[P],Object.keys(N).length===0&&delete n[I]}}}function E(){C(),a=!0,s!==r&&(s=r,l(s.object))}function C(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:E,resetDefaultState:C,dispose:S,releaseStatesOfGeometry:b,releaseStatesOfObject:m,releaseStatesOfProgram:A,initAttributes:y,enableAttribute:_,disableUnusedAttributes:T}}function yc(i,e,t){let n;function r(c){n=c}function s(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function a(c,l,u){u!==0&&(i.drawArraysInstanced(n,c,l,u),t.update(l,n,u))}function o(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,u);let f=0;for(let x=0;x<u;x++)f+=l[x];t.update(f,n,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function bc(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==1023&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const m=A===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==1009&&A!==1015&&!m&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(Be("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&f===!1&&Be("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const x=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:x,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:_,maxAttributes:h,maxVertexUniforms:T,maxVaryings:w,maxFragmentUniforms:M,maxSamples:S,samples:b}}function Ec(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new pn,o=new Oe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const x=d.length!==0||f||n!==0||r;return r=f,n=d.length,x},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,x){const g=d.clippingPlanes,y=d.clipIntersection,_=d.clipShadows,h=i.get(d);if(!r||g===null||g.length===0||s&&!_)s?u(null):l();else{const T=s?0:n,w=T*4;let M=h.clippingState||null;c.value=M,M=u(g,f,w,x);for(let S=0;S!==w;++S)M[S]=t[S];h.clippingState=M,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=T}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,f,x,g){const y=d!==null?d.length:0;let _=null;if(y!==0){if(_=c.value,g!==!0||_===null){const h=x+y*4,T=f.matrixWorldInverse;o.getNormalMatrix(T),(_===null||_.length<h)&&(_=new Float32Array(h));for(let w=0,M=x;w!==y;++w,M+=4)a.copy(d[w]).applyMatrix4(T,o),a.normal.toArray(_,M),_[M+3]=a.constant}c.value=_,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,_}}const Kn=4,Tc=6,Ac=20,Rc=256,ui=new Wi,Bs=new nt;let Ir=null,Ur=0,Nr=0,Br=!1;const wc=new H,Rn=new H;class Os{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,s={}){const{size:a=256,position:o=wc}=s;Ir=this._renderer.getRenderTarget(),Ur=this._renderer.getActiveCubeFace(),Nr=this._renderer.getActiveMipmapLevel(),Br=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,r,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gs(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zs(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ir,Ur,Nr),this._renderer.xr.enabled=Br,e.scissorTest=!1,$n(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ir=this._renderer.getRenderTarget(),Ur=this._renderer.getActiveCubeFace(),Nr=this._renderer.getActiveMipmapLevel(),Br=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:Si,depthBuffer:!1},r=ks(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ks(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Cc(s)),this._blurMaterial=Dc(s,e,t),this._ggxMaterial=Pc(s,e,t)}return r}_compileMaterial(e){const t=new Xt(new Zt,e);this._renderer.compile(t,ui)}_sceneToCubeUV(e,t,n,r,s){const c=new qt(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,x=d.toneMapping;d.getClearColor(Bs),d.toneMapping=0,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Xt(new fi,new Lr({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,_=y.material;let h=!1;const T=e.background;T?T.isColor&&(_.color.copy(T),e.background=null,h=!0):(_.color.copy(Bs),h=!0);for(let w=0;w<6;w++){const M=w%3;M===0?(c.up.set(0,l[w],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[w],s.y,s.z)):M===1?(c.up.set(0,0,l[w]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[w],s.z)):(c.up.set(0,l[w],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[w]));const S=this._cubeSize;$n(r,M*S,w>2?S:0,S,S),d.setRenderTarget(r),h&&d.render(y,c),d.render(e,c)}d.toneMapping=x,d.autoClear=f,e.background=T}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gs()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zs());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;$n(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,ui)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-u*u),f=l*1.25,x=d*f,{_lodMax:g}=this,y=this._sizeLods[n],_=3*y*(n>g-Kn?n-g+Kn:0),h=4*(this._cubeSize-y);c.envMap.value=e.texture,c.roughness.value=x,c.mipInt.value=g-t,$n(s,_,h,3*y,2*y),r.setRenderTarget(s),r.render(o,ui),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=g-n,$n(e,_,h,3*y,2*y),r.setRenderTarget(e),r.render(o,ui)}_blur(e,t,n,r){const s=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,n,a),this._blurPass(s,e,n,n,a)}_blurPass(e,t,n,r,s){const a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[r];c.material=o;const l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=s,l.mipInt.value=this._lodMax-n;const u=this._sizeLods[r],d=3*u*(r>this._lodMax-Kn?r-this._lodMax+Kn:0),f=4*(this._cubeSize-u);$n(t,d,f,3*u,2*u),a.setRenderTarget(t),a.render(c,ui)}}function Cc(i){const e=[],t=[];let n=i;const r=i-Kn+1+Tc;for(let s=0;s<r;s++){const a=Math.pow(2,n);e.push(a);const o=1/(a-2),c=-o,l=1+o,u=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,f=6,x=3,g=new Float32Array(x*f*d),y=new Float32Array(x*f*d);for(let h=0;h<d;h++){const T=h%3*2/3-1,w=h>2?0:-1,M=[T,w,0,T+2/3,w,0,T+2/3,w+1,0,T,w,0,T+2/3,w+1,0,T,w+1,0];g.set(M,x*f*h);for(let S=0;S<f;S++){const b=u[S*2]*2-1,A=u[S*2+1]*2-1;h===0?Rn.set(1,A,b):h===1?Rn.set(-b,1,-A):h===2?Rn.set(-b,A,1):h===3?Rn.set(-1,A,-b):h===4?Rn.set(-b,-1,A):Rn.set(b,A,-1),Rn.toArray(y,(h*f+S)*x)}}const _=new Zt;_.setAttribute("position",new fn(g,x)),_.setAttribute("outputDirection",new fn(y,x)),t.push(new Xt(_,null)),n>Kn&&n--}return{lodMeshes:t,sizeLods:e}}function ks(i,e,t){const n=new Bt(i,e,t);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function $n(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Pc(i,e,t){return new Jt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Rc,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:qi(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Dc(i,e,t){return new Jt({name:"SphericalGaussianBlur",defines:{SAMPLES:Ac,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:qi(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function zs(){return new Jt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qi(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Gs(){return new Jt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qi(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function qi(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Vs extends Bt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ts(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new fi(5,5,5),s=new Jt({name:"CubemapFromEquirect",uniforms:Xn(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;const a=new Xt(r,s),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new xo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}function Lc(i){let e=new WeakMap,t=new WeakMap,n=null;function r(f,x=!1){return f==null?null:x?a(f):s(f)}function s(f){if(f&&f.isTexture){const x=f.mapping;if(x===303||x===304)if(e.has(f)){const g=e.get(f).texture;return o(g,f.mapping)}else{const g=f.image;if(g&&g.height>0){const y=new Vs(g.height);return y.fromEquirectangularTexture(i,f),e.set(f,y),f.addEventListener("dispose",l),o(y.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture){const x=f.mapping,g=x===303||x===304,y=x===301||x===302;if(g||y){let _=t.get(f);const h=_!==void 0?_.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==h)return n===null&&(n=new Os(i)),_=g?n.fromEquirectangular(f,_):n.fromCubemap(f,_),_.texture.pmremVersion=f.pmremVersion,t.set(f,_),_.texture;if(_!==void 0)return _.texture;{const T=f.image;return g&&T&&T.height>0||y&&T&&c(T)?(n===null&&(n=new Os(i)),_=g?n.fromEquirectangular(f):n.fromCubemap(f),_.texture.pmremVersion=f.pmremVersion,t.set(f,_),f.addEventListener("dispose",u),_.texture):null}}}return f}function o(f,x){return x===303?f.mapping=301:x===304&&(f.mapping=302),f}function c(f){let x=0;const g=6;for(let y=0;y<g;y++)f[y]!==void 0&&x++;return x===g}function l(f){const x=f.target;x.removeEventListener("dispose",l);const g=e.get(x);g!==void 0&&(e.delete(x),g.dispose())}function u(f){const x=f.target;x.removeEventListener("dispose",u);const g=t.get(x);g!==void 0&&(t.delete(x),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:d}}function Fc(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&Dn("WebGLRenderer: "+n+" extension not supported."),r}}}function Ic(i,e,t,n){const r={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete r[f.id];const x=s.get(f);x&&(e.remove(x),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,t.memory.geometries++),f}function c(d){const f=d.attributes;for(const x in f)e.update(f[x],i.ARRAY_BUFFER)}function l(d){const f=[],x=d.index,g=d.attributes.position;let y=0;if(g===void 0)return;if(x!==null){const T=x.array;y=x.version;for(let w=0,M=T.length;w<M;w+=3){const S=T[w+0],b=T[w+1],A=T[w+2];f.push(S,b,b,A,A,S)}}else{const T=g.array;y=g.version;for(let w=0,M=T.length/3-1;w<M;w+=3){const S=w+0,b=w+1,A=w+2;f.push(S,b,b,A,A,S)}}const _=new(g.count>=65535?Ss:vs)(f,1);_.version=y;const h=s.get(d);h&&e.remove(h),s.set(d,_)}function u(d){const f=s.get(d);if(f){const x=d.index;x!==null&&f.version<x.version&&l(d)}else l(d);return s.get(d)}return{get:o,update:c,getWireframeAttribute:u}}function Uc(i,e,t){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,s,d*a),t.update(f,n,1)}function l(d,f,x){x!==0&&(i.drawElementsInstanced(n,f,s,d*a,x),t.update(f,n,x))}function u(d,f,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,d,0,x);let y=0;for(let _=0;_<x;_++)y+=f[_];t.update(y,n,1)}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Nc(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:et("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function Bc(i,e,t){const n=new WeakMap,r=new ut;function s(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let E=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",E)};f!==void 0&&f.texture.dispose();const x=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,_=o.morphAttributes.position||[],h=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let w=0;x===!0&&(w=1),g===!0&&(w=2),y===!0&&(w=3);let M=o.attributes.position.count*w,S=1;M>e.maxTextureSize&&(S=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const b=new Float32Array(M*S*4*d),A=new os(b,M,S,d);A.type=1015,A.needsUpdate=!0;const m=w*4;for(let C=0;C<d;C++){const D=_[C],I=h[C],N=T[C],P=M*S*4*C;for(let B=0;B<D.count;B++){const G=B*m;x===!0&&(r.fromBufferAttribute(D,B),b[P+G+0]=r.x,b[P+G+1]=r.y,b[P+G+2]=r.z,b[P+G+3]=0),g===!0&&(r.fromBufferAttribute(I,B),b[P+G+4]=r.x,b[P+G+5]=r.y,b[P+G+6]=r.z,b[P+G+7]=0),y===!0&&(r.fromBufferAttribute(N,B),b[P+G+8]=r.x,b[P+G+9]=r.y,b[P+G+10]=r.z,b[P+G+11]=N.itemSize===4?r.w:1)}}f={count:d,texture:A,size:new Ze(M,S)},n.set(o,f),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let x=0;for(let y=0;y<l.length;y++)x+=l[y];const g=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:s}}function Oc(i,e,t,n,r){let s=new WeakMap;function a(l){const u=r.render.frame,d=l.geometry,f=e.get(l,d);if(s.get(f)!==u&&(e.update(f),s.set(f,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),s.get(l)!==u&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,u))),l.isSkinnedMesh){const x=l.skeleton;s.get(x)!==u&&(x.update(),s.set(x,u))}return f}function o(){s=new WeakMap}function c(l){const u=l.target;u.removeEventListener("dispose",c),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const kc={1:"LINEAR_TONE_MAPPING",2:"REINHARD_TONE_MAPPING",3:"CINEON_TONE_MAPPING",4:"ACES_FILMIC_TONE_MAPPING",6:"AGX_TONE_MAPPING",7:"NEUTRAL_TONE_MAPPING",5:"CUSTOM_TONE_MAPPING"};function zc(i,e,t,n,r,s){const a=new Bt(e,t,{type:i,depthBuffer:r,stencilBuffer:s,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,c=null;const l=new Zt;l.setAttribute("position",new $t([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new $t([0,2,0,0,2,0],2));const u=new Cs({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Xt(l,u),f=new Wi(-1,1,1,-1,0,1);let x=null,g=null,y=!1,_,h=null,T=[],w=!1;this.setSize=function(M,S){a.setSize(M,S),o!==null&&o.setSize(M,S),c!==null&&c.setSize(M,S);for(let b=0;b<T.length;b++){const A=T[b];A.setSize&&A.setSize(M,S)}},this.setEffects=function(M){T=M,w=T.length>0&&T[0].isRenderPass===!0;const S=a.width,b=a.height;T.length>0&&o===null&&(o=new Bt(S,b,{type:1016,depthBuffer:!1,stencilBuffer:!1}),c=new Bt(S,b,{type:1016,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<T.length;A++){const m=T[A];m.setSize&&m.setSize(S,b)}},this.begin=function(M,S){if(y||M.toneMapping===0&&T.length===0)return!1;if(h=S,S!==null){const b=S.width,A=S.height;(a.width!==b||a.height!==A)&&this.setSize(b,A)}return w===!1&&M.setRenderTarget(a),_=M.toneMapping,M.toneMapping=0,!0},this.hasRenderPass=function(){return w},this.end=function(M,S){M.toneMapping=_,y=!0;let b=a,A=o;for(let m=0;m<T.length;m++){const E=T[m];E.enabled!==!1&&(E.render(M,A,b,S),E.needsSwap!==!1&&(b=A,A=A===o?c:o))}if(x!==M.outputColorSpace||g!==M.toneMapping){x=M.outputColorSpace,g=M.toneMapping,u.defines={},$e.getTransfer(x)===st&&(u.defines.SRGB_TRANSFER="");const m=kc[g];m&&(u.defines[m]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=b.texture,M.setRenderTarget(h),M.render(d,f),h=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}const Hs=new Rt,Or=new ci(1,1),Ws=new os,Xs=new Wa,qs=new Ts,Ys=[],Ks=[],$s=new Float32Array(16),Zs=new Float32Array(9),Js=new Float32Array(4);function Zn(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=Ys[r];if(s===void 0&&(s=new Float32Array(r),Ys[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function Mt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Yi(i,e){let t=Ks[e];t===void 0&&(t=new Int32Array(e),Ks[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Gc(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Vc(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2fv(this.addr,e),yt(t,e)}}function Hc(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mt(t,e))return;i.uniform3fv(this.addr,e),yt(t,e)}}function Wc(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4fv(this.addr,e),yt(t,e)}}function Xc(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;Js.set(n),i.uniformMatrix2fv(this.addr,!1,Js),yt(t,n)}}function qc(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;Zs.set(n),i.uniformMatrix3fv(this.addr,!1,Zs),yt(t,n)}}function Yc(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;$s.set(n),i.uniformMatrix4fv(this.addr,!1,$s),yt(t,n)}}function Kc(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function $c(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2iv(this.addr,e),yt(t,e)}}function Zc(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3iv(this.addr,e),yt(t,e)}}function Jc(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4iv(this.addr,e),yt(t,e)}}function Qc(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function jc(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2uiv(this.addr,e),yt(t,e)}}function ef(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3uiv(this.addr,e),yt(t,e)}}function tf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4uiv(this.addr,e),yt(t,e)}}function nf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Or.compareFunction=t.isReversedDepthBuffer()?518:515,s=Or):s=Hs,t.setTexture2D(e||s,r)}function rf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Xs,r)}function sf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||qs,r)}function af(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Ws,r)}function of(i){switch(i){case 5126:return Gc;case 35664:return Vc;case 35665:return Hc;case 35666:return Wc;case 35674:return Xc;case 35675:return qc;case 35676:return Yc;case 5124:case 35670:return Kc;case 35667:case 35671:return $c;case 35668:case 35672:return Zc;case 35669:case 35673:return Jc;case 5125:return Qc;case 36294:return jc;case 36295:return ef;case 36296:return tf;case 35678:case 36198:case 36298:case 36306:case 35682:return nf;case 35679:case 36299:case 36307:return rf;case 35680:case 36300:case 36308:case 36293:return sf;case 36289:case 36303:case 36311:case 36292:return af}}function lf(i,e){i.uniform1fv(this.addr,e)}function cf(i,e){const t=Zn(e,this.size,2);i.uniform2fv(this.addr,t)}function ff(i,e){const t=Zn(e,this.size,3);i.uniform3fv(this.addr,t)}function hf(i,e){const t=Zn(e,this.size,4);i.uniform4fv(this.addr,t)}function uf(i,e){const t=Zn(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function df(i,e){const t=Zn(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function _f(i,e){const t=Zn(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function xf(i,e){i.uniform1iv(this.addr,e)}function pf(i,e){i.uniform2iv(this.addr,e)}function mf(i,e){i.uniform3iv(this.addr,e)}function gf(i,e){i.uniform4iv(this.addr,e)}function vf(i,e){i.uniform1uiv(this.addr,e)}function Sf(i,e){i.uniform2uiv(this.addr,e)}function Mf(i,e){i.uniform3uiv(this.addr,e)}function yf(i,e){i.uniform4uiv(this.addr,e)}function bf(i,e,t){const n=this.cache,r=e.length,s=Yi(t,r);Mt(n,s)||(i.uniform1iv(this.addr,s),yt(n,s));let a;this.type===i.SAMPLER_2D_SHADOW?a=Or:a=Hs;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function Ef(i,e,t){const n=this.cache,r=e.length,s=Yi(t,r);Mt(n,s)||(i.uniform1iv(this.addr,s),yt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Xs,s[a])}function Tf(i,e,t){const n=this.cache,r=e.length,s=Yi(t,r);Mt(n,s)||(i.uniform1iv(this.addr,s),yt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||qs,s[a])}function Af(i,e,t){const n=this.cache,r=e.length,s=Yi(t,r);Mt(n,s)||(i.uniform1iv(this.addr,s),yt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Ws,s[a])}function Rf(i){switch(i){case 5126:return lf;case 35664:return cf;case 35665:return ff;case 35666:return hf;case 35674:return uf;case 35675:return df;case 35676:return _f;case 5124:case 35670:return xf;case 35667:case 35671:return pf;case 35668:case 35672:return mf;case 35669:case 35673:return gf;case 5125:return vf;case 36294:return Sf;case 36295:return Mf;case 36296:return yf;case 35678:case 36198:case 36298:case 36306:case 35682:return bf;case 35679:case 36299:case 36307:return Ef;case 35680:case 36300:case 36308:case 36293:return Tf;case 36289:case 36303:case 36311:case 36292:return Af}}class wf{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=of(t.type)}}class Cf{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Rf(t.type)}}class Pf{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const kr=/(\w+)(\])?(\[|\.)?/g;function Qs(i,e){i.seq.push(e),i.map[e.id]=e}function Df(i,e,t){const n=i.name,r=n.length;for(kr.lastIndex=0;;){const s=kr.exec(n),a=kr.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){Qs(t,l===void 0?new wf(o,i,e):new Cf(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new Pf(o),Qs(t,d)),t=d}}}class Ki{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);Df(o,c,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function js(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Lf=37297;let Ff=0;function If(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const ea=new Oe;function Uf(i){$e._getMatrix(ea,$e.workingColorSpace,i);const e=`mat3( ${ea.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(i)){case Mi:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return Be("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function ta(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+If(i.getShaderSource(e),o)}else return s}function Nf(i,e){const t=Uf(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Bf={1:"Linear",2:"Reinhard",3:"Cineon",4:"ACESFilmic",6:"AgX",7:"Neutral",5:"Custom"};function Of(i,e){const t=Bf[e];return t===void 0?(Be("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const $i=new H;function kf(){$e.getLuminanceCoefficients($i);const i=$i.x.toFixed(4),e=$i.y.toFixed(4),t=$i.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zf(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(di).join(`
`)}function Gf(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Vf(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function di(i){return i!==""}function na(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ia(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Hf=/^[ \t]*#include +<([\w\d./]+)>/gm;function zr(i){return i.replace(Hf,Xf)}const Wf=new Map;function Xf(i,e){let t=He[e];if(t===void 0){const n=Wf.get(e);if(n!==void 0)t=He[n],Be('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return zr(t)}const qf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ra(i){return i.replace(qf,Yf)}function Yf(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function sa(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Kf={1:"SHADOWMAP_TYPE_PCF",3:"SHADOWMAP_TYPE_VSM"};function $f(i){return Kf[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Zf={301:"ENVMAP_TYPE_CUBE",302:"ENVMAP_TYPE_CUBE",306:"ENVMAP_TYPE_CUBE_UV"};function Jf(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Zf[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Qf={302:"ENVMAP_MODE_REFRACTION"};function jf(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Qf[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const eh={0:"ENVMAP_BLENDING_MULTIPLY",1:"ENVMAP_BLENDING_MIX",2:"ENVMAP_BLENDING_ADD"};function th(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":eh[i.combine]||"ENVMAP_BLENDING_NONE"}function nh(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function ih(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=$f(t),l=Jf(t),u=jf(t),d=th(t),f=nh(t),x=zf(t),g=Gf(s),y=r.createProgram();let _,h,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(di).join(`
`),_.length>0&&(_+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(di).join(`
`),h.length>0&&(h+=`
`)):(_=[sa(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(di).join(`
`),h=[sa(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?He.tonemapping_pars_fragment:"",t.toneMapping!==0?Of("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,Nf("linearToOutputTexel",t.outputColorSpace),kf(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(di).join(`
`)),a=zr(a),a=na(a,t),a=ia(a,t),o=zr(o),o=na(o,t),o=ia(o,t),a=ra(a),o=ra(o),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,_=[x,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,h=["#define varying in",t.glslVersion===or?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===or?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const w=T+_+a,M=T+h+o,S=js(r,r.VERTEX_SHADER,w),b=js(r,r.FRAGMENT_SHADER,M);r.attachShader(y,S),r.attachShader(y,b),t.index0AttributeName!==void 0?r.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function A(D){if(i.debug.checkShaderErrors){const I=r.getProgramInfoLog(y)||"",N=r.getShaderInfoLog(S)||"",P=r.getShaderInfoLog(b)||"",B=I.trim(),G=N.trim(),W=P.trim();let j=!0,X=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,y,S,b);else{const Z=ta(r,S,"vertex"),ee=ta(r,b,"fragment");et("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+B+`
`+Z+`
`+ee)}else B!==""?Be("WebGLProgram: Program Info Log:",B):(G===""||W==="")&&(X=!1);X&&(D.diagnostics={runnable:j,programLog:B,vertexShader:{log:G,prefix:_},fragmentShader:{log:W,prefix:h}})}r.deleteShader(S),r.deleteShader(b),m=new Ki(r,y),E=Vf(r,y)}let m;this.getUniforms=function(){return m===void 0&&A(this),m};let E;this.getAttributes=function(){return E===void 0&&A(this),E};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=r.getProgramParameter(y,Lf)),C},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ff++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=S,this.fragmentShader=b,this}let rh=0;class sh{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new ah(e),t.set(e,n)),n}}class ah{constructor(e){this.id=rh++,this.code=e,this.usedTimes=0}}function oh(i){return i===1030||i===37490||i===36285}function lh(i,e,t,n,r,s){const a=new fs,o=new sh,c=new Set,l=[],u=new Map,d=n.logarithmicDepthBuffer;let f=n.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(m){return c.add(m),m===0?"uv":`uv${m}`}function y(m,E,C,D,I,N){const P=D.fog,B=I.geometry,G=m.isMeshStandardMaterial||m.isMeshLambertMaterial||m.isMeshPhongMaterial?D.environment:null,W=m.isMeshStandardMaterial||m.isMeshLambertMaterial&&!m.envMap||m.isMeshPhongMaterial&&!m.envMap,j=e.get(m.envMap||G,W),X=j&&j.mapping===306?j.image.height:null,Z=x[m.type];m.precision!==null&&(f=n.getMaxPrecision(m.precision),f!==m.precision&&Be("WebGLProgram.getParameters:",m.precision,"not supported, using",f,"instead."));const ee=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Se=ee!==void 0?ee.length:0;let ge=0;B.morphAttributes.position!==void 0&&(ge=1),B.morphAttributes.normal!==void 0&&(ge=2),B.morphAttributes.color!==void 0&&(ge=3);let Xe,Fe,Ge,Y;if(Z){const ft=jt[Z];Xe=ft.vertexShader,Fe=ft.fragmentShader}else{Xe=m.vertexShader,Fe=m.fragmentShader;const ft=o.getVertexShaderStage(m),it=o.getFragmentShaderStage(m);o.update(m,ft,it),Ge=ft.id,Y=it.id}const K=i.getRenderTarget(),pe=i.state.buffers.depth.getReversed(),De=I.isInstancedMesh===!0,ue=I.isBatchedMesh===!0,ke=!!m.map,xt=!!m.matcap,Ie=!!j,Ue=!!m.aoMap,tt=!!m.lightMap,Ne=!!m.bumpMap&&m.wireframe===!1,Ye=!!m.normalMap,Me=!!m.displacementMap,Ce=!!m.emissiveMap,Te=!!m.metalnessMap,ze=!!m.roughnessMap,L=m.anisotropy>0,ct=m.clearcoat>0,Qe=m.dispersion>0,R=m.retroreflectivity>0,p=m.iridescence>0,O=m.sheen>0,V=m.transmission>0,$=L&&!!m.anisotropyMap,re=ct&&!!m.clearcoatMap,se=ct&&!!m.clearcoatNormalMap,J=ct&&!!m.clearcoatRoughnessMap,te=p&&!!m.iridescenceMap,ae=p&&!!m.iridescenceThicknessMap,Re=O&&!!m.sheenColorMap,he=O&&!!m.sheenRoughnessMap,oe=!!m.specularMap,we=!!m.specularColorMap,Le=!!m.specularIntensityMap,Ve=V&&!!m.transmissionMap,U=V&&!!m.thicknessMap,le=!!m.gradientMap,Q=!!m.alphaMap,ce=m.alphaTest>0,xe=!!m.alphaHash,ne=!!m.extensions;let Pe=0;m.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Pe=i.toneMapping);const Ee={shaderID:Z,shaderType:m.type,shaderName:m.name,vertexShader:Xe,fragmentShader:Fe,defines:m.defines,customVertexShaderID:Ge,customFragmentShaderID:Y,isRawShaderMaterial:m.isRawShaderMaterial===!0,glslVersion:m.glslVersion,precision:f,batching:ue,batchingColor:ue&&I._colorsTexture!==null,instancing:De,instancingColor:De&&I.instanceColor!==null,instancingMorph:De&&I.morphTexture!==null,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:$e.workingColorSpace,alphaToCoverage:!!m.alphaToCoverage,map:ke,matcap:xt,envMap:Ie,envMapMode:Ie&&j.mapping,envMapCubeUVHeight:X,aoMap:Ue,lightMap:tt,bumpMap:Ne,normalMap:Ye,displacementMap:Me,emissiveMap:Ce,normalMapObjectSpace:Ye&&m.normalMapType===1,normalMapTangentSpace:Ye&&m.normalMapType===0,packedNormalMap:Ye&&m.normalMapType===0&&oh(m.normalMap.format),metalnessMap:Te,roughnessMap:ze,anisotropy:L,anisotropyMap:$,clearcoat:ct,clearcoatMap:re,clearcoatNormalMap:se,clearcoatRoughnessMap:J,dispersion:Qe,retroreflection:R,iridescence:p,iridescenceMap:te,iridescenceThicknessMap:ae,sheen:O,sheenColorMap:Re,sheenRoughnessMap:he,specularMap:oe,specularColorMap:we,specularIntensityMap:Le,transmission:V,transmissionMap:Ve,thicknessMap:U,gradientMap:le,opaque:m.transparent===!1&&m.blending===1&&m.alphaToCoverage===!1,alphaMap:Q,alphaTest:ce,alphaHash:xe,combine:m.combine,mapUv:ke&&g(m.map.channel),aoMapUv:Ue&&g(m.aoMap.channel),lightMapUv:tt&&g(m.lightMap.channel),bumpMapUv:Ne&&g(m.bumpMap.channel),normalMapUv:Ye&&g(m.normalMap.channel),displacementMapUv:Me&&g(m.displacementMap.channel),emissiveMapUv:Ce&&g(m.emissiveMap.channel),metalnessMapUv:Te&&g(m.metalnessMap.channel),roughnessMapUv:ze&&g(m.roughnessMap.channel),anisotropyMapUv:$&&g(m.anisotropyMap.channel),clearcoatMapUv:re&&g(m.clearcoatMap.channel),clearcoatNormalMapUv:se&&g(m.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&g(m.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&g(m.iridescenceMap.channel),iridescenceThicknessMapUv:ae&&g(m.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&g(m.sheenColorMap.channel),sheenRoughnessMapUv:he&&g(m.sheenRoughnessMap.channel),specularMapUv:oe&&g(m.specularMap.channel),specularColorMapUv:we&&g(m.specularColorMap.channel),specularIntensityMapUv:Le&&g(m.specularIntensityMap.channel),transmissionMapUv:Ve&&g(m.transmissionMap.channel),thicknessMapUv:U&&g(m.thicknessMap.channel),alphaMapUv:Q&&g(m.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(Ye||L),vertexNormals:!!B.attributes.normal,vertexColors:m.vertexColors,vertexAlphas:m.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!B.attributes.uv&&(ke||Q),fog:!!P,useFog:m.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:m.wireframe===!1&&(m.flatShading===!0||B.attributes.normal===void 0&&Ye===!1&&(m.isMeshLambertMaterial||m.isMeshPhongMaterial||m.isMeshStandardMaterial||m.isMeshPhysicalMaterial)),sizeAttenuation:m.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:pe,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:Se,morphTextureStride:ge,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:N.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:m.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Pe,decodeVideoTexture:ke&&m.map.isVideoTexture===!0&&$e.getTransfer(m.map.colorSpace)===st,decodeVideoTextureEmissive:Ce&&m.emissiveMap.isVideoTexture===!0&&$e.getTransfer(m.emissiveMap.colorSpace)===st,premultipliedAlpha:m.premultipliedAlpha,doubleSided:m.side===2,flipSided:m.side===1,useDepthPacking:m.depthPacking>=0,depthPacking:m.depthPacking||0,index0AttributeName:m.index0AttributeName,extensionClipCullDistance:ne&&m.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ne&&m.extensions.multiDraw===!0||ue)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:m.customProgramCacheKey()};return Ee.vertexUv1s=c.has(1),Ee.vertexUv2s=c.has(2),Ee.vertexUv3s=c.has(3),c.clear(),Ee}function _(m){const E=[];if(m.shaderID?E.push(m.shaderID):(E.push(m.customVertexShaderID),E.push(m.customFragmentShaderID)),m.defines!==void 0)for(const C in m.defines)E.push(C),E.push(m.defines[C]);return m.isRawShaderMaterial===!1&&(h(E,m),T(E,m),E.push(i.outputColorSpace)),E.push(m.customProgramCacheKey),E.join()}function h(m,E){m.push(E.precision),m.push(E.outputColorSpace),m.push(E.envMapMode),m.push(E.envMapCubeUVHeight),m.push(E.mapUv),m.push(E.alphaMapUv),m.push(E.lightMapUv),m.push(E.aoMapUv),m.push(E.bumpMapUv),m.push(E.normalMapUv),m.push(E.displacementMapUv),m.push(E.emissiveMapUv),m.push(E.metalnessMapUv),m.push(E.roughnessMapUv),m.push(E.anisotropyMapUv),m.push(E.clearcoatMapUv),m.push(E.clearcoatNormalMapUv),m.push(E.clearcoatRoughnessMapUv),m.push(E.iridescenceMapUv),m.push(E.iridescenceThicknessMapUv),m.push(E.sheenColorMapUv),m.push(E.sheenRoughnessMapUv),m.push(E.specularMapUv),m.push(E.specularColorMapUv),m.push(E.specularIntensityMapUv),m.push(E.transmissionMapUv),m.push(E.thicknessMapUv),m.push(E.combine),m.push(E.fogExp2),m.push(E.sizeAttenuation),m.push(E.morphTargetsCount),m.push(E.morphAttributeCount),m.push(E.numSunLights),m.push(E.numDirLights),m.push(E.numPointLights),m.push(E.numSpotLights),m.push(E.numSpotLightMaps),m.push(E.numHemiLights),m.push(E.numRectAreaLights),m.push(E.numSunLightShadows),m.push(E.numDirLightShadows),m.push(E.numPointLightShadows),m.push(E.numSpotLightShadows),m.push(E.numSpotLightShadowsWithMaps),m.push(E.numLightProbes),m.push(E.shadowMapType),m.push(E.toneMapping),m.push(E.numClippingPlanes),m.push(E.numClipIntersection),m.push(E.depthPacking)}function T(m,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),m.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),m.push(a.mask)}function w(m){const E=x[m.type];let C;if(E){const D=jt[E];C=co.clone(D.uniforms)}else C=m.uniforms;return C}function M(m,E){let C=u.get(E);return C!==void 0?++C.usedTimes:(C=new ih(i,E,m,r),l.push(C),u.set(E,C)),C}function S(m){if(--m.usedTimes===0){const E=l.indexOf(m);l[E]=l[l.length-1],l.pop(),u.delete(m.cacheKey),m.destroy()}}function b(m){o.remove(m)}function A(){o.dispose()}return{getParameters:y,getProgramCacheKey:_,getUniforms:w,acquireProgram:M,releaseProgram:S,releaseShaderCache:b,programs:l,dispose:A}}function ch(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function fh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function aa(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function oa(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(f){let x=0;return f.isInstancedMesh&&(x+=2),f.isSkinnedMesh&&(x+=1),x}function o(f,x,g,y,_,h){let T=i[e];return T===void 0?(T={id:f.id,object:f,geometry:x,material:g,materialVariant:a(f),groupOrder:y,renderOrder:f.renderOrder,z:_,group:h},i[e]=T):(T.id=f.id,T.object=f,T.geometry=x,T.material=g,T.materialVariant=a(f),T.groupOrder=y,T.renderOrder=f.renderOrder,T.z=_,T.group=h),e++,T}function c(f,x,g,y,_,h,T){T.reversedDepth===!0&&(_=-_);const w=o(f,x,g,y,_,h);g.transmission>0?n.push(w):g.transparent===!0?r.push(w):t.push(w)}function l(f,x,g,y,_,h){const T=o(f,x,g,y,_,h);g.transmission>0?n.unshift(T):g.transparent===!0?r.unshift(T):t.unshift(T)}function u(f,x){t.length>1&&t.sort(f||fh),n.length>1&&n.sort(x||aa),r.length>1&&r.sort(x||aa)}function d(){for(let f=e,x=i.length;f<x;f++){const g=i[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:c,unshift:l,finish:d,sort:u}}function hh(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new oa,i.set(n,[a])):r>=s.length?(a=new oa,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function uh(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new H,color:new nt};break;case"SpotLight":t={position:new H,direction:new H,color:new nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new nt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new nt,groundColor:new nt};break;case"RectAreaLight":t={color:new nt,position:new H,halfWidth:new H,halfHeight:new H};break}return i[e.id]=t,t}}}function dh(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let _h=0;function xh(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function ph(i){const e=new uh,t=dh(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new H);const r=new H,s=new pt,a=new pt;function o(l){let u=0,d=0,f=0;for(let I=0;I<9;I++)n.probe[I].set(0,0,0);let x=0,g=0,y=0,_=0,h=0,T=0,w=0,M=0,S=0,b=0,A=0,m=0,E=0,C=0;l.sort(xh);for(let I=0,N=l.length;I<N;I++){const P=l[I],B=P.color,G=P.intensity,W=P.distance;let j=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===1030?j=P.shadow.map.texture:j=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=B.r*G,d+=B.g*G,f+=B.b*G;else if(P.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(P.sh.coefficients[X],G);C++}else if(P.isSunLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Z=P.shadow,ee=t.get(P);ee.shadowIntensity=Z.intensity,ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize.copy(Z.mapSize).multiply(Z.getFrameExtents()),n.sunShadow[g]=ee,n.sunShadowMap[g]=j;const Se=Z.getViewportCount();for(let ge=0;ge<Se;ge++)n.sunShadowMatrix[y+ge]=Z.getMatrix(ge),n.sunShadowCascade[y+ge]=Z._cascadeData[ge];y+=Se,g++}n.sun[x]=X,x++}else if(P.isDirectionalLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Z=P.shadow,ee=t.get(P);ee.shadowIntensity=Z.intensity,ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize=Z.mapSize,n.directionalShadow[_]=ee,n.directionalShadowMap[_]=j,n.directionalShadowMatrix[_]=P.shadow.matrix,S++}n.directional[_]=X,_++}else if(P.isSpotLight){const X=e.get(P);X.position.setFromMatrixPosition(P.matrixWorld),X.color.copy(B).multiplyScalar(G),X.distance=W,X.coneCos=Math.cos(P.angle),X.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),X.decay=P.decay,n.spot[T]=X;const Z=P.shadow;if(P.map&&(n.spotLightMap[m]=P.map,m++,Z.updateMatrices(P),P.castShadow&&E++),n.spotLightMatrix[T]=Z.matrix,P.castShadow){const ee=t.get(P);ee.shadowIntensity=Z.intensity,ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize=Z.mapSize,n.spotShadow[T]=ee,n.spotShadowMap[T]=j,A++}T++}else if(P.isRectAreaLight){const X=e.get(P);X.color.copy(B).multiplyScalar(G),X.halfWidth.set(P.width*.5,0,0),X.halfHeight.set(0,P.height*.5,0),n.rectArea[w]=X,w++}else if(P.isPointLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),X.distance=P.distance,X.decay=P.decay,P.castShadow){const Z=P.shadow,ee=t.get(P);ee.shadowIntensity=Z.intensity,ee.shadowBias=Z.bias,ee.shadowNormalBias=Z.normalBias,ee.shadowRadius=Z.radius,ee.shadowMapSize=Z.mapSize,ee.shadowCameraNear=Z.camera.near,ee.shadowCameraFar=Z.camera.far,n.pointShadow[h]=ee,n.pointShadowMap[h]=j,n.pointShadowMatrix[h]=P.shadow.matrix,b++}n.point[h]=X,h++}else if(P.isHemisphereLight){const X=e.get(P);X.skyColor.copy(P.color).multiplyScalar(G),X.groundColor.copy(P.groundColor).multiplyScalar(G),n.hemi[M]=X,M++}}w>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=fe.LTC_FLOAT_1,n.rectAreaLTC2=fe.LTC_FLOAT_2):(n.rectAreaLTC1=fe.LTC_HALF_1,n.rectAreaLTC2=fe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=f;const D=n.hash;(D.sunLength!==x||D.directionalLength!==_||D.pointLength!==h||D.spotLength!==T||D.rectAreaLength!==w||D.hemiLength!==M||D.numSunShadows!==g||D.numDirectionalShadows!==S||D.numPointShadows!==b||D.numSpotShadows!==A||D.numSpotMaps!==m||D.numLightProbes!==C)&&(n.sun.length=x,n.directional.length=_,n.spot.length=T,n.rectArea.length=w,n.point.length=h,n.hemi.length=M,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=y,n.sunShadowCascade.length=y,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=b,n.pointShadowMap.length=b,n.pointShadowMatrix.length=b,n.spotShadow.length=A,n.spotShadowMap.length=A,n.spotLightMatrix.length=A+m-E,n.spotLightMap.length=m,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,D.sunLength=x,D.directionalLength=_,D.pointLength=h,D.spotLength=T,D.rectAreaLength=w,D.hemiLength=M,D.numSunShadows=g,D.numDirectionalShadows=S,D.numPointShadows=b,D.numSpotShadows=A,D.numSpotMaps=m,D.numLightProbes=C,n.version=_h++)}function c(l,u){let d=0,f=0,x=0,g=0,y=0,_=0;const h=u.matrixWorldInverse;for(let T=0,w=l.length;T<w;T++){const M=l[T];if(M.isSunLight){const S=n.sun[d];S.direction.setFromMatrixPosition(M.matrixWorld),S.direction.transformDirection(h),d++}else if(M.isDirectionalLight){const S=n.directional[f];S.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(h),f++}else if(M.isSpotLight){const S=n.spot[g];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(h),S.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(h),g++}else if(M.isRectAreaLight){const S=n.rectArea[y];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(h),a.identity(),s.copy(M.matrixWorld),s.premultiply(h),a.extractRotation(s),S.halfWidth.set(M.width*.5,0,0),S.halfHeight.set(0,M.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),y++}else if(M.isPointLight){const S=n.point[x];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(h),x++}else if(M.isHemisphereLight){const S=n.hemi[_];S.direction.setFromMatrixPosition(M.matrixWorld),S.direction.transformDirection(h),_++}}}return{setup:o,setupView:c,state:n}}function la(i){const e=new ph(i),t=[],n=[],r=[];function s(f){d.camera=f,t.length=0,n.length=0,r.length=0}function a(f){t.push(f)}function o(f){n.push(f)}function c(f){r.push(f)}function l(){e.setup(t)}function u(f){e.setupView(t,f)}const d={lightsArray:t,shadowsArray:n,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function mh(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new la(i),e.set(r,[o])):s>=a.length?(o=new la(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const gh=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,vh=`uniform sampler2D shadow_pass;
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
}`,Sh=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],Mh=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],ca=new pt,_i=new H,Gr=new H;function yh(i,e,t){let n=new Es;const r=new Ze,s=new Ze,a=new ut,o=new uo,c=new _o,l={},u=t.maxTextureSize,d={0:1,1:0,2:2},f=new Jt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ze},radius:{value:4}},vertexShader:gh,fragmentShader:vh}),x=f.clone();x.defines.HORIZONTAL_PASS=1;const g=new Zt;g.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Xt(g,f),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let h=this.type;this.render=function(b,A,m){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||b.length===0)return;this.type===2&&(Be("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=1);const E=i.getRenderTarget(),C=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),I=i.state;I.setBlending(0),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const N=h!==this.type;N&&A.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(B=>B.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,B=b.length;P<B;P++){const G=b[P],W=G.shadow;if(W===void 0){Be("WebGLShadowMap:",G,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const j=W.getFrameExtents();r.multiply(j),s.copy(W.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/j.x),r.x=s.x*j.x,W.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/j.y),r.y=s.y*j.y,W.mapSize.y=s.y));const X=i.state.buffers.depth.getReversed();if(W.camera._reversedDepth=X,W.map===null||N===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===3){if(G.isPointLight){Be("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new Bt(r.x,r.y,{format:1030,type:1016,minFilter:1006,magFilter:1006,generateMipmaps:!1}),W.map.texture.name=G.name+".shadowMap",W.map.depthTexture=new ci(r.x,r.y,1015),W.map.depthTexture.name=G.name+".shadowMapDepth",W.map.depthTexture.format=1026,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=1003,W.map.depthTexture.magFilter=1003}else G.isPointLight?(W.map=new Vs(r.x),W.map.depthTexture=new oo(r.x,1014)):(W.map=new Bt(r.x,r.y),W.map.depthTexture=new ci(r.x,r.y,1014)),W.map.depthTexture.name=G.name+".shadowMap",W.map.depthTexture.format=1026,this.type===1?(W.map.depthTexture.compareFunction=X?518:515,W.map.depthTexture.minFilter=1006,W.map.depthTexture.magFilter=1006):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=1003,W.map.depthTexture.magFilter=1003);W.camera.updateProjectionMatrix()}W.map.isWebGLCubeRenderTarget!==!0&&(W.map.width!==r.x||W.map.height!==r.y)&&W.map.setSize(r.x,r.y);const Z=W.map.isWebGLCubeRenderTarget?6:W.getViewportCount();G.isPointLight!==!0&&W.updateMatrices(G,m);for(let ee=0;ee<Z;ee++){const Se=W.getCamera(ee);if(G.isPointLight){const ge=W.camera,Xe=W.matrix,Fe=G.distance||ge.far;Fe!==ge.far&&(ge.far=Fe,ge.updateProjectionMatrix()),_i.setFromMatrixPosition(G.matrixWorld),ge.position.copy(_i),Gr.copy(ge.position),Gr.add(Sh[ee]),ge.up.copy(Mh[ee]),ge.lookAt(Gr),ge.updateMatrixWorld(),Xe.makeTranslation(-_i.x,-_i.y,-_i.z),ca.multiplyMatrices(ge.projectionMatrix,ge.matrixWorldInverse),W._frustum.setFromProjectionMatrix(ca,ge.coordinateSystem,ge.reversedDepth)}if(W.map.isWebGLCubeRenderTarget)i.setRenderTarget(W.map,ee),i.clear();else{ee===0&&(i.setRenderTarget(W.map),i.clear());const ge=W.getViewport(ee);a.set(s.x*ge.x,s.y*ge.y,s.x*ge.z,s.y*ge.w),I.viewport(a)}n=W.getFrustum(ee),M(A,m,Se,G,this.type)}W.isPointLightShadow!==!0&&this.type===3&&T(W,m),W.needsUpdate=!1}h=this.type,_.needsUpdate=!1,i.setRenderTarget(E,C,D)};function T(b,A){const m=e.update(y);f.defines.VSM_SAMPLES!==b.blurSamples&&(f.defines.VSM_SAMPLES=b.blurSamples,x.defines.VSM_SAMPLES=b.blurSamples,f.needsUpdate=!0,x.needsUpdate=!0),b.mapPass===null?b.mapPass=new Bt(r.x,r.y,{format:1030,type:1016}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),f.uniforms.shadow_pass.value=b.map.depthTexture,f.uniforms.resolution.value.set(b.map.width,b.map.height),f.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(A,null,m,f,y,null),x.uniforms.shadow_pass.value=b.mapPass.texture,x.uniforms.resolution.value.set(b.map.width,b.map.height),x.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(A,null,m,x,y,null)}function w(b,A,m,E){let C=null;const D=m.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(D!==void 0)C=D;else if(C=m.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const I=C.uuid,N=A.uuid;let P=l[I];P===void 0&&(P={},l[I]=P);let B=P[N];B===void 0&&(B=C.clone(),P[N]=B,A.addEventListener("dispose",S)),C=B}if(C.visible=A.visible,C.wireframe=A.wireframe,E===3?C.side=A.shadowSide!==null?A.shadowSide:A.side:C.side=A.shadowSide!==null?A.shadowSide:d[A.side],C.alphaMap=A.alphaMap,C.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,C.map=A.map,C.clipShadows=A.clipShadows,C.clippingPlanes=A.clippingPlanes,C.clipIntersection=A.clipIntersection,C.displacementMap=A.displacementMap,C.displacementScale=A.displacementScale,C.displacementBias=A.displacementBias,C.wireframeLinewidth=A.wireframeLinewidth,C.linewidth=A.linewidth,m.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const I=i.properties.get(C);I.light=m}return C}function M(b,A,m,E,C){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&C===3)&&(!b.frustumCulled||b.intersectsFrustum(n))){b.modelViewMatrix.multiplyMatrices(m.matrixWorldInverse,b.matrixWorld);const N=e.update(b),P=b.material;if(Array.isArray(P)){const B=N.groups;for(let G=0,W=B.length;G<W;G++){const j=B[G],X=P[j.materialIndex];if(X&&X.visible){const Z=w(b,X,E,C);b.onBeforeShadow(i,b,A,m,N,Z,j),i.renderBufferDirect(m,null,N,Z,b,j),b.onAfterShadow(i,b,A,m,N,Z,j)}}}else if(P.visible){const B=w(b,P,E,C);b.onBeforeShadow(i,b,A,m,N,B,null),i.renderBufferDirect(m,null,N,B,b,null),b.onAfterShadow(i,b,A,m,N,B,null)}}const I=b.children;for(let N=0,P=I.length;N<P;N++)M(I[N],A,m,E,C)}function S(b){b.target.removeEventListener("dispose",S);for(const m in l){const E=l[m],C=b.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function bh(i,e){function t(){let U=!1;const le=new ut;let Q=null;const ce=new ut(0,0,0,0);return{setMask:function(xe){Q!==xe&&!U&&(i.colorMask(xe,xe,xe,xe),Q=xe)},setLocked:function(xe){U=xe},setClear:function(xe,ne,Pe,Ee,ft){ft===!0&&(xe*=Ee,ne*=Ee,Pe*=Ee),le.set(xe,ne,Pe,Ee),ce.equals(le)===!1&&(i.clearColor(xe,ne,Pe,Ee),ce.copy(le))},reset:function(){U=!1,Q=null,ce.set(-1,0,0,0)}}}function n(){let U=!1,le=!1,Q=null,ce=null,xe=null;return{setReversed:function(ne){if(le!==ne){const Pe=e.get("EXT_clip_control");ne?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),le=ne;const Ee=xe;xe=null,this.setClear(Ee)}},getReversed:function(){return le},setTest:function(ne){ne?K(i.DEPTH_TEST):pe(i.DEPTH_TEST)},setMask:function(ne){Q!==ne&&!U&&(i.depthMask(ne),Q=ne)},setFunc:function(ne){if(le&&(ne=Ba[ne]),ce!==ne){switch(ne){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ce=ne}},setLocked:function(ne){U=ne},setClear:function(ne){xe!==ne&&(xe=ne,le&&(ne=1-ne),i.clearDepth(ne))},reset:function(){U=!1,Q=null,ce=null,xe=null,le=!1}}}function r(){let U=!1,le=null,Q=null,ce=null,xe=null,ne=null,Pe=null,Ee=null,ft=null;return{setTest:function(it){U||(it?K(i.STENCIL_TEST):pe(i.STENCIL_TEST))},setMask:function(it){le!==it&&!U&&(i.stencilMask(it),le=it)},setFunc:function(it,Kt,nn){(Q!==it||ce!==Kt||xe!==nn)&&(i.stencilFunc(it,Kt,nn),Q=it,ce=Kt,xe=nn)},setOp:function(it,Kt,nn){(ne!==it||Pe!==Kt||Ee!==nn)&&(i.stencilOp(it,Kt,nn),ne=it,Pe=Kt,Ee=nn)},setLocked:function(it){U=it},setClear:function(it){ft!==it&&(i.clearStencil(it),ft=it)},reset:function(){U=!1,le=null,Q=null,ce=null,xe=null,ne=null,Pe=null,Ee=null,ft=null}}}const s=new t,a=new n,o=new r,c=new WeakMap,l=new WeakMap;let u={},d={},f={},x=new WeakMap,g=[],y=null,_=!1,h=null,T=null,w=null,M=null,S=null,b=null,A=null,m=new nt(0,0,0),E=0,C=!1,D=null,I=null,N=null,P=null,B=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,j=0;const X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(X)[1]),W=j>=1):X.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),W=j>=2);let Z=null,ee={};const Se=i.getParameter(i.SCISSOR_BOX),ge=i.getParameter(i.VIEWPORT),Xe=new ut().fromArray(Se),Fe=new ut().fromArray(ge);function Ge(U,le,Q,ce){const xe=new Uint8Array(4),ne=i.createTexture();i.bindTexture(U,ne),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Pe=0;Pe<Q;Pe++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(le,0,i.RGBA,1,1,ce,0,i.RGBA,i.UNSIGNED_BYTE,xe):i.texImage2D(le+Pe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xe);return ne}const Y={};Y[i.TEXTURE_2D]=Ge(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=Ge(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=Ge(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=Ge(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(i.DEPTH_TEST),a.setFunc(3),Ne(!1),Ye(1),K(i.CULL_FACE),Ue(0);function K(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function pe(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function De(U,le){return f[U]!==le?(i.bindFramebuffer(U,le),f[U]=le,U===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=le),U===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=le),!0):!1}function ue(U,le){let Q=g,ce=!1;if(U){Q=x.get(le),Q===void 0&&(Q=[],x.set(le,Q));const xe=U.textures;if(Q.length!==xe.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let ne=0,Pe=xe.length;ne<Pe;ne++)Q[ne]=i.COLOR_ATTACHMENT0+ne;Q.length=xe.length,ce=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,ce=!0);ce&&i.drawBuffers(Q)}function ke(U){return y!==U?(i.useProgram(U),y=U,!0):!1}const xt={100:i.FUNC_ADD,101:i.FUNC_SUBTRACT,102:i.FUNC_REVERSE_SUBTRACT};xt[103]=i.MIN,xt[104]=i.MAX;const Ie={200:i.ZERO,201:i.ONE,202:i.SRC_COLOR,204:i.SRC_ALPHA,210:i.SRC_ALPHA_SATURATE,208:i.DST_COLOR,206:i.DST_ALPHA,203:i.ONE_MINUS_SRC_COLOR,205:i.ONE_MINUS_SRC_ALPHA,209:i.ONE_MINUS_DST_COLOR,207:i.ONE_MINUS_DST_ALPHA,211:i.CONSTANT_COLOR,212:i.ONE_MINUS_CONSTANT_COLOR,213:i.CONSTANT_ALPHA,214:i.ONE_MINUS_CONSTANT_ALPHA};function Ue(U,le,Q,ce,xe,ne,Pe,Ee,ft,it){if(U===0){_===!0&&(pe(i.BLEND),_=!1);return}if(_===!1&&(K(i.BLEND),_=!0),U!==5){if(U!==h||it!==C){if((T!==100||S!==100)&&(i.blendEquation(i.FUNC_ADD),T=100,S=100),it)switch(U){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:et("WebGLState: Invalid blending: ",U);break}else switch(U){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case 3:et("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case 4:et("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:et("WebGLState: Invalid blending: ",U);break}w=null,M=null,b=null,A=null,m.set(0,0,0),E=0,h=U,C=it}return}xe=xe||le,ne=ne||Q,Pe=Pe||ce,(le!==T||xe!==S)&&(i.blendEquationSeparate(xt[le],xt[xe]),T=le,S=xe),(Q!==w||ce!==M||ne!==b||Pe!==A)&&(i.blendFuncSeparate(Ie[Q],Ie[ce],Ie[ne],Ie[Pe]),w=Q,M=ce,b=ne,A=Pe),(Ee.equals(m)===!1||ft!==E)&&(i.blendColor(Ee.r,Ee.g,Ee.b,ft),m.copy(Ee),E=ft),h=U,C=!1}function tt(U,le){U.side===2?pe(i.CULL_FACE):K(i.CULL_FACE);let Q=U.side===1;le&&(Q=!Q),Ne(Q),U.blending===1&&U.transparent===!1?Ue(0):Ue(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),s.setMask(U.colorWrite);const ce=U.stencilWrite;o.setTest(ce),ce&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Ce(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):pe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ne(U){D!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),D=U)}function Ye(U){U!==0?(K(i.CULL_FACE),U!==I&&(U===1?i.cullFace(i.BACK):U===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pe(i.CULL_FACE),I=U}function Me(U){U!==N&&(W&&i.lineWidth(U),N=U)}function Ce(U,le,Q){U?(K(i.POLYGON_OFFSET_FILL),(P!==le||B!==Q)&&(P=le,B=Q,a.getReversed()&&(le=-le),i.polygonOffset(le,Q))):pe(i.POLYGON_OFFSET_FILL)}function Te(U){U?K(i.SCISSOR_TEST):pe(i.SCISSOR_TEST)}function ze(U){U===void 0&&(U=i.TEXTURE0+G-1),Z!==U&&(i.activeTexture(U),Z=U)}function L(U,le,Q){Q===void 0&&(Z===null?Q=i.TEXTURE0+G-1:Q=Z);let ce=ee[Q];ce===void 0&&(ce={type:void 0,texture:void 0},ee[Q]=ce),(ce.type!==U||ce.texture!==le)&&(Z!==Q&&(i.activeTexture(Q),Z=Q),i.bindTexture(U,le||Y[U]),ce.type=U,ce.texture=le)}function ct(){const U=ee[Z];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Qe(){try{i.compressedTexImage2D(...arguments)}catch(U){et("WebGLState:",U)}}function R(){try{i.compressedTexImage3D(...arguments)}catch(U){et("WebGLState:",U)}}function p(){try{i.texSubImage2D(...arguments)}catch(U){et("WebGLState:",U)}}function O(){try{i.texSubImage3D(...arguments)}catch(U){et("WebGLState:",U)}}function V(){try{i.compressedTexSubImage2D(...arguments)}catch(U){et("WebGLState:",U)}}function $(){try{i.compressedTexSubImage3D(...arguments)}catch(U){et("WebGLState:",U)}}function re(){try{i.texStorage2D(...arguments)}catch(U){et("WebGLState:",U)}}function se(){try{i.texStorage3D(...arguments)}catch(U){et("WebGLState:",U)}}function J(){try{i.texImage2D(...arguments)}catch(U){et("WebGLState:",U)}}function te(){try{i.texImage3D(...arguments)}catch(U){et("WebGLState:",U)}}function ae(U){return d[U]!==void 0?d[U]:i.getParameter(U)}function Re(U,le){d[U]!==le&&(i.pixelStorei(U,le),d[U]=le)}function he(U){Xe.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Xe.copy(U))}function oe(U){Fe.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Fe.copy(U))}function we(U,le){let Q=l.get(le);Q===void 0&&(Q=new WeakMap,l.set(le,Q));let ce=Q.get(U);ce===void 0&&(ce=i.getUniformBlockIndex(le,U.name),Q.set(U,ce))}function Le(U,le){const ce=l.get(le).get(U);c.get(le)!==ce&&(i.uniformBlockBinding(le,ce,U.__bindingPointIndex),c.set(le,ce))}function Ve(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},Z=null,ee={},f={},x=new WeakMap,g=[],y=null,_=!1,h=null,T=null,w=null,M=null,S=null,b=null,A=null,m=new nt(0,0,0),E=0,C=!1,D=null,I=null,N=null,P=null,B=null,Xe.set(0,0,i.canvas.width,i.canvas.height),Fe.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:K,disable:pe,bindFramebuffer:De,drawBuffers:ue,useProgram:ke,setBlending:Ue,setMaterial:tt,setFlipSided:Ne,setCullFace:Ye,setLineWidth:Me,setPolygonOffset:Ce,setScissorTest:Te,activeTexture:ze,bindTexture:L,unbindTexture:ct,compressedTexImage2D:Qe,compressedTexImage3D:R,texImage2D:J,texImage3D:te,pixelStorei:Re,getParameter:ae,updateUBOMapping:we,uniformBlockBinding:Le,texStorage2D:re,texStorage3D:se,texSubImage2D:p,texSubImage3D:O,compressedTexSubImage2D:V,compressedTexSubImage3D:$,scissor:he,viewport:oe,reset:Ve}}function Eh(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ze,u=new WeakMap,d=new Set;let f;const x=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(R,p){return g?new OffscreenCanvas(R,p):yi("canvas")}function _(R,p,O){let V=1;const $=Qe(R);if(($.width>O||$.height>O)&&(V=O/Math.max($.width,$.height)),V<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const re=Math.floor(V*$.width),se=Math.floor(V*$.height);f===void 0&&(f=y(re,se));const J=p?y(re,se):f;return J.width=re,J.height=se,J.getContext("2d").drawImage(R,0,0,re,se),Be("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+re+"x"+se+")."),J}else return"data"in R&&Be("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),R;return R}function h(R){return R.generateMipmaps}function T(R){i.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(R,p,O,V,$,re=!1){if(R!==null){if(i[R]!==void 0)return i[R];Be("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let se;V&&(se=e.get("EXT_texture_norm16"),se||Be("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=p;if(p===i.RED&&(O===i.FLOAT&&(J=i.R32F),O===i.HALF_FLOAT&&(J=i.R16F),O===i.UNSIGNED_BYTE&&(J=i.R8),O===i.UNSIGNED_SHORT&&se&&(J=se.R16_EXT),O===i.SHORT&&se&&(J=se.R16_SNORM_EXT)),p===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(J=i.R8UI),O===i.UNSIGNED_SHORT&&(J=i.R16UI),O===i.UNSIGNED_INT&&(J=i.R32UI),O===i.BYTE&&(J=i.R8I),O===i.SHORT&&(J=i.R16I),O===i.INT&&(J=i.R32I)),p===i.RG&&(O===i.FLOAT&&(J=i.RG32F),O===i.HALF_FLOAT&&(J=i.RG16F),O===i.UNSIGNED_BYTE&&(J=i.RG8),O===i.UNSIGNED_SHORT&&se&&(J=se.RG16_EXT),O===i.SHORT&&se&&(J=se.RG16_SNORM_EXT)),p===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(J=i.RG8UI),O===i.UNSIGNED_SHORT&&(J=i.RG16UI),O===i.UNSIGNED_INT&&(J=i.RG32UI),O===i.BYTE&&(J=i.RG8I),O===i.SHORT&&(J=i.RG16I),O===i.INT&&(J=i.RG32I)),p===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(J=i.RGB8UI),O===i.UNSIGNED_SHORT&&(J=i.RGB16UI),O===i.UNSIGNED_INT&&(J=i.RGB32UI),O===i.BYTE&&(J=i.RGB8I),O===i.SHORT&&(J=i.RGB16I),O===i.INT&&(J=i.RGB32I)),p===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),O===i.UNSIGNED_INT&&(J=i.RGBA32UI),O===i.BYTE&&(J=i.RGBA8I),O===i.SHORT&&(J=i.RGBA16I),O===i.INT&&(J=i.RGBA32I)),p===i.RGB&&(O===i.UNSIGNED_SHORT&&se&&(J=se.RGB16_EXT),O===i.SHORT&&se&&(J=se.RGB16_SNORM_EXT),O===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),p===i.RGBA){const te=re?Mi:$e.getTransfer($);O===i.FLOAT&&(J=i.RGBA32F),O===i.HALF_FLOAT&&(J=i.RGBA16F),O===i.UNSIGNED_BYTE&&(J=te===st?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT&&se&&(J=se.RGBA16_EXT),O===i.SHORT&&se&&(J=se.RGBA16_SNORM_EXT),O===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function S(R,p){let O;return R?p===null||p===1014||p===1020?O=i.DEPTH24_STENCIL8:p===1015?O=i.DEPTH32F_STENCIL8:p===1012&&(O=i.DEPTH24_STENCIL8,Be("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):p===null||p===1014||p===1020?O=i.DEPTH_COMPONENT24:p===1015?O=i.DEPTH_COMPONENT32F:p===1012&&(O=i.DEPTH_COMPONENT16),O}function b(R,p){return h(R)===!0||R.isFramebufferTexture&&R.minFilter!==1003&&R.minFilter!==1006?Math.log2(Math.max(p.width,p.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?p.mipmaps.length:1}function A(R){const p=R.target;p.removeEventListener("dispose",A),E(p),p.isVideoTexture&&u.delete(p),p.isHTMLTexture&&d.delete(p)}function m(R){const p=R.target;p.removeEventListener("dispose",m),D(p)}function E(R){const p=n.get(R);if(p.__webglInit===void 0)return;const O=R.source,V=x.get(O);if(V){const $=V[p.__cacheKey];$.usedTimes--,$.usedTimes===0&&C(R),Object.keys(V).length===0&&x.delete(O)}n.remove(R)}function C(R){const p=n.get(R);i.deleteTexture(p.__webglTexture);const O=R.source,V=x.get(O);delete V[p.__cacheKey],a.memory.textures--}function D(R){const p=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(p.__webglFramebuffer[V]))for(let $=0;$<p.__webglFramebuffer[V].length;$++)i.deleteFramebuffer(p.__webglFramebuffer[V][$]);else i.deleteFramebuffer(p.__webglFramebuffer[V]);p.__webglDepthbuffer&&i.deleteRenderbuffer(p.__webglDepthbuffer[V])}else{if(Array.isArray(p.__webglFramebuffer))for(let V=0;V<p.__webglFramebuffer.length;V++)i.deleteFramebuffer(p.__webglFramebuffer[V]);else i.deleteFramebuffer(p.__webglFramebuffer);if(p.__webglDepthbuffer&&i.deleteRenderbuffer(p.__webglDepthbuffer),p.__webglMultisampledFramebuffer&&i.deleteFramebuffer(p.__webglMultisampledFramebuffer),p.__webglColorRenderbuffer)for(let V=0;V<p.__webglColorRenderbuffer.length;V++)p.__webglColorRenderbuffer[V]&&i.deleteRenderbuffer(p.__webglColorRenderbuffer[V]);p.__webglDepthRenderbuffer&&i.deleteRenderbuffer(p.__webglDepthRenderbuffer)}const O=R.textures;for(let V=0,$=O.length;V<$;V++){const re=n.get(O[V]);re.__webglTexture&&(i.deleteTexture(re.__webglTexture),a.memory.textures--),n.remove(O[V])}n.remove(R)}let I=0;function N(){I=0}function P(){return I}function B(R){I=R}function G(){const R=I;return R>=r.maxTextures&&Be("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+r.maxTextures),I+=1,R}function W(R){const p=[];return p.push(R.wrapS),p.push(R.wrapT),p.push(R.wrapR||0),p.push(R.magFilter),p.push(R.minFilter),p.push(R.anisotropy),p.push(R.internalFormat),p.push(R.format),p.push(R.type),p.push(R.generateMipmaps),p.push(R.premultiplyAlpha),p.push(R.flipY),p.push(R.unpackAlignment),p.push(R.colorSpace),p.join()}function j(R,p){const O=n.get(R);if(R.isVideoTexture&&L(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){const V=R.image;if(V===null)Be("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)Be("WebGLRenderer: Texture marked for update but image is incomplete");else{pe(O,R,p);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+p)}function X(R,p){const O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){pe(O,R,p);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+p)}function Z(R,p){const O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){pe(O,R,p);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+p)}function ee(R,p){const O=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){De(O,R,p);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+p)}const Se={1e3:i.REPEAT,1001:i.CLAMP_TO_EDGE,1002:i.MIRRORED_REPEAT},ge={1003:i.NEAREST,1004:i.NEAREST_MIPMAP_NEAREST,1005:i.NEAREST_MIPMAP_LINEAR,1006:i.LINEAR,1007:i.LINEAR_MIPMAP_NEAREST,1008:i.LINEAR_MIPMAP_LINEAR},Xe={512:i.NEVER,519:i.ALWAYS,513:i.LESS,515:i.LEQUAL,514:i.EQUAL,518:i.GEQUAL,516:i.GREATER,517:i.NOTEQUAL};function Fe(R,p){if(p.type===1015&&e.has("OES_texture_float_linear")===!1&&(p.magFilter===1006||p.magFilter===1007||p.magFilter===1005||p.magFilter===1008||p.minFilter===1006||p.minFilter===1007||p.minFilter===1005||p.minFilter===1008)&&Be("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,Se[p.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,Se[p.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,Se[p.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,ge[p.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,ge[p.minFilter]),p.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Xe[p.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(p.magFilter===1003||p.minFilter!==1005&&p.minFilter!==1008||p.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(p.anisotropy>1||n.get(p).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(p.anisotropy,r.getMaxAnisotropy())),n.get(p).__currentAnisotropy=p.anisotropy}}}function Ge(R,p){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,p.addEventListener("dispose",A));const V=p.source;let $=x.get(V);$===void 0&&($={},x.set(V,$));const re=W(p);if(re!==R.__cacheKey){$[re]===void 0&&($[re]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),$[re].usedTimes++;const se=$[R.__cacheKey];se!==void 0&&($[R.__cacheKey].usedTimes--,se.usedTimes===0&&C(p)),R.__cacheKey=re,R.__webglTexture=$[re].texture}return O}function Y(R,p,O){return Math.floor(Math.floor(R/O)/p)}function K(R,p,O,V){const re=R.updateRanges;if(re.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,p.width,p.height,O,V,p.data);else{re.sort((Re,he)=>Re.start-he.start);let se=0;for(let Re=1;Re<re.length;Re++){const he=re[se],oe=re[Re],we=he.start+he.count,Le=Y(oe.start,p.width,4),Ve=Y(he.start,p.width,4);oe.start<=we+1&&Le===Ve&&Y(oe.start+oe.count-1,p.width,4)===Le?he.count=Math.max(he.count,oe.start+oe.count-he.start):(++se,re[se]=oe)}re.length=se+1;const J=t.getParameter(i.UNPACK_ROW_LENGTH),te=t.getParameter(i.UNPACK_SKIP_PIXELS),ae=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,p.width);for(let Re=0,he=re.length;Re<he;Re++){const oe=re[Re],we=Math.floor(oe.start/4),Le=Math.ceil(oe.count/4),Ve=we%p.width,U=Math.floor(we/p.width),le=Le,Q=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ve),t.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,Ve,U,le,Q,O,V,p.data)}R.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,J),t.pixelStorei(i.UNPACK_SKIP_PIXELS,te),t.pixelStorei(i.UNPACK_SKIP_ROWS,ae)}}function pe(R,p,O){let V=i.TEXTURE_2D;(p.isDataArrayTexture||p.isCompressedArrayTexture)&&(V=i.TEXTURE_2D_ARRAY),p.isData3DTexture&&(V=i.TEXTURE_3D);const $=Ge(R,p),re=p.source;t.bindTexture(V,R.__webglTexture,i.TEXTURE0+O);const se=n.get(re);if(re.version!==se.__version||$===!0){if(t.activeTexture(i.TEXTURE0+O),(typeof ImageBitmap<"u"&&p.image instanceof ImageBitmap)===!1){const Q=$e.getPrimaries($e.workingColorSpace),ce=p.colorSpace===""?null:$e.getPrimaries(p.colorSpace),xe=p.colorSpace===""||Q===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,p.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,p.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe)}t.pixelStorei(i.UNPACK_ALIGNMENT,p.unpackAlignment);let te=_(p.image,!1,r.maxTextureSize);te=ct(p,te);const ae=s.convert(p.format,p.colorSpace),Re=s.convert(p.type);let he=M(p.internalFormat,ae,Re,p.normalized,p.colorSpace,p.isVideoTexture);Fe(V,p);let oe;const we=p.mipmaps,Le=p.isVideoTexture!==!0,Ve=se.__version===void 0||$===!0,U=re.dataReady,le=b(p,te);if(p.isDepthTexture)he=S(p.format===1027,p.type),Ve&&(Le?t.texStorage2D(i.TEXTURE_2D,1,he,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,he,te.width,te.height,0,ae,Re,null));else if(p.isDataTexture)if(we.length>0){Le&&Ve&&t.texStorage2D(i.TEXTURE_2D,le,he,we[0].width,we[0].height);for(let Q=0,ce=we.length;Q<ce;Q++)oe=we[Q],Le?U&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,oe.width,oe.height,ae,Re,oe.data):t.texImage2D(i.TEXTURE_2D,Q,he,oe.width,oe.height,0,ae,Re,oe.data);p.generateMipmaps=!1}else Le?(Ve&&t.texStorage2D(i.TEXTURE_2D,le,he,te.width,te.height),U&&K(p,te,ae,Re)):t.texImage2D(i.TEXTURE_2D,0,he,te.width,te.height,0,ae,Re,te.data);else if(p.isCompressedTexture)if(p.isCompressedArrayTexture){Le&&Ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,he,we[0].width,we[0].height,te.depth);for(let Q=0,ce=we.length;Q<ce;Q++)if(oe=we[Q],p.format!==1023)if(ae!==null)if(Le){if(U)if(p.layerUpdates.size>0){const xe=Is(oe.width,oe.height,p.format,p.type);for(const ne of p.layerUpdates){const Pe=oe.data.subarray(ne*xe/oe.data.BYTES_PER_ELEMENT,(ne+1)*xe/oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,ne,oe.width,oe.height,1,ae,Pe)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,oe.width,oe.height,te.depth,ae,oe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,he,oe.width,oe.height,te.depth,0,oe.data,0,0);else Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Le?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,oe.width,oe.height,te.depth,ae,Re,oe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Q,he,oe.width,oe.height,te.depth,0,ae,Re,oe.data);p.layerUpdates.size>0&&p.clearLayerUpdates()}else{Le&&Ve&&t.texStorage2D(i.TEXTURE_2D,le,he,we[0].width,we[0].height);for(let Q=0,ce=we.length;Q<ce;Q++)oe=we[Q],p.format!==1023?ae!==null?Le?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,oe.width,oe.height,ae,oe.data):t.compressedTexImage2D(i.TEXTURE_2D,Q,he,oe.width,oe.height,0,oe.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Le?U&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,oe.width,oe.height,ae,Re,oe.data):t.texImage2D(i.TEXTURE_2D,Q,he,oe.width,oe.height,0,ae,Re,oe.data)}else if(p.isDataArrayTexture)if(Le){if(Ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,he,te.width,te.height,te.depth),U)if(p.layerUpdates.size>0){const Q=Is(te.width,te.height,p.format,p.type);for(const ce of p.layerUpdates){const xe=te.data.subarray(ce*Q/te.data.BYTES_PER_ELEMENT,(ce+1)*Q/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ce,te.width,te.height,1,ae,Re,xe)}p.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,ae,Re,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,he,te.width,te.height,te.depth,0,ae,Re,te.data);else if(p.isData3DTexture)Le?(Ve&&t.texStorage3D(i.TEXTURE_3D,le,he,te.width,te.height,te.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,ae,Re,te.data)):t.texImage3D(i.TEXTURE_3D,0,he,te.width,te.height,te.depth,0,ae,Re,te.data);else if(p.isFramebufferTexture){if(Ve)if(Le)t.texStorage2D(i.TEXTURE_2D,le,he,te.width,te.height);else{let Q=te.width,ce=te.height;for(let xe=0;xe<le;xe++)t.texImage2D(i.TEXTURE_2D,xe,he,Q,ce,0,ae,Re,null),Q>>=1,ce>>=1}}else if(p.isHTMLTexture){if("texElementImage2D"in i){const Q=i.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),te.parentNode!==Q){Q.appendChild(te),d.add(p),Q.onpaint=ce=>{const xe=ce.changedElements;for(const ne of d)xe.includes(ne.image)&&(ne.needsUpdate=!0)},Q.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,te);else{const xe=i.RGBA,ne=i.RGBA,Pe=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,xe,ne,Pe,te)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(we.length>0){if(Le&&Ve){const Q=Qe(we[0]);t.texStorage2D(i.TEXTURE_2D,le,he,Q.width,Q.height)}for(let Q=0,ce=we.length;Q<ce;Q++)oe=we[Q],Le?U&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ae,Re,oe):t.texImage2D(i.TEXTURE_2D,Q,he,ae,Re,oe);p.generateMipmaps=!1}else if(Le){if(Ve){const Q=Qe(te);t.texStorage2D(i.TEXTURE_2D,le,he,Q.width,Q.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ae,Re,te)}else t.texImage2D(i.TEXTURE_2D,0,he,ae,Re,te);h(p)&&T(V),se.__version=re.version,p.onUpdate&&p.onUpdate(p)}R.__version=p.version}function De(R,p,O){if(p.image.length!==6)return;const V=Ge(R,p),$=p.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+O);const re=n.get($);if($.version!==re.__version||V===!0){t.activeTexture(i.TEXTURE0+O);const se=$e.getPrimaries($e.workingColorSpace),J=p.colorSpace===""?null:$e.getPrimaries(p.colorSpace),te=p.colorSpace===""||se===J?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,p.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,p.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,p.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);const ae=p.isCompressedTexture||p.image[0].isCompressedTexture,Re=p.image[0]&&p.image[0].isDataTexture,he=[];for(let ne=0;ne<6;ne++)!ae&&!Re?he[ne]=_(p.image[ne],!0,r.maxCubemapSize):he[ne]=Re?p.image[ne].image:p.image[ne],he[ne]=ct(p,he[ne]);const oe=he[0],we=s.convert(p.format,p.colorSpace),Le=s.convert(p.type),Ve=M(p.internalFormat,we,Le,p.normalized,p.colorSpace),U=p.isVideoTexture!==!0,le=re.__version===void 0||V===!0,Q=$.dataReady;let ce=b(p,oe);Fe(i.TEXTURE_CUBE_MAP,p);let xe;if(ae){U&&le&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ce,Ve,oe.width,oe.height);for(let ne=0;ne<6;ne++){xe=he[ne].mipmaps;for(let Pe=0;Pe<xe.length;Pe++){const Ee=xe[Pe];p.format!==1023?we!==null?U?Q&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Pe,0,0,Ee.width,Ee.height,we,Ee.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Pe,Ve,Ee.width,Ee.height,0,Ee.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Pe,0,0,Ee.width,Ee.height,we,Le,Ee.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Pe,Ve,Ee.width,Ee.height,0,we,Le,Ee.data)}}}else{if(xe=p.mipmaps,U&&le){xe.length>0&&ce++;const ne=Qe(he[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ce,Ve,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(Re){U?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,he[ne].width,he[ne].height,we,Le,he[ne].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Ve,he[ne].width,he[ne].height,0,we,Le,he[ne].data);for(let Pe=0;Pe<xe.length;Pe++){const ft=xe[Pe].image[ne].image;U?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Pe+1,0,0,ft.width,ft.height,we,Le,ft.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Pe+1,Ve,ft.width,ft.height,0,we,Le,ft.data)}}else{U?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,we,Le,he[ne]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,Ve,we,Le,he[ne]);for(let Pe=0;Pe<xe.length;Pe++){const Ee=xe[Pe];U?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Pe+1,0,0,we,Le,Ee.image[ne]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Pe+1,Ve,we,Le,Ee.image[ne])}}}h(p)&&T(i.TEXTURE_CUBE_MAP),re.__version=$.version,p.onUpdate&&p.onUpdate(p)}R.__version=p.version}function ue(R,p,O,V,$,re){const se=s.convert(O.format,O.colorSpace),J=s.convert(O.type),te=M(O.internalFormat,se,J,O.normalized,O.colorSpace),ae=n.get(p),Re=n.get(O);if(Re.__renderTarget=p,!ae.__hasExternalTextures){const he=Math.max(1,p.width>>re),oe=Math.max(1,p.height>>re);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,re,te,he,oe,p.depth,0,se,J,null):t.texImage2D($,re,te,he,oe,0,se,J,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),ze(p)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,$,Re.__webglTexture,0,Te(p)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,V,$,Re.__webglTexture,re),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ke(R,p,O){if(i.bindRenderbuffer(i.RENDERBUFFER,R),p.depthBuffer){const V=p.depthTexture,$=V&&V.isDepthTexture?V.type:null,re=S(p.stencilBuffer,$),se=p.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ze(p)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Te(p),re,p.width,p.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,Te(p),re,p.width,p.height):i.renderbufferStorage(i.RENDERBUFFER,re,p.width,p.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,R)}else{const V=p.textures;for(let $=0;$<V.length;$++){const re=V[$],se=s.convert(re.format,re.colorSpace),J=s.convert(re.type),te=M(re.internalFormat,se,J,re.normalized,re.colorSpace);ze(p)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Te(p),te,p.width,p.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,Te(p),te,p.width,p.height):i.renderbufferStorage(i.RENDERBUFFER,te,p.width,p.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function xt(R,p,O){const V=p.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(p.depthTexture&&p.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const $=n.get(p.depthTexture);if($.__renderTarget=p,(!$.__webglTexture||p.depthTexture.image.width!==p.width||p.depthTexture.image.height!==p.height)&&(p.depthTexture.image.width=p.width,p.depthTexture.image.height=p.height,p.depthTexture.needsUpdate=!0),V){if($.__webglInit===void 0&&($.__webglInit=!0,p.depthTexture.addEventListener("dispose",A)),$.__webglTexture===void 0){$.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Fe(i.TEXTURE_CUBE_MAP,p.depthTexture);const ae=s.convert(p.depthTexture.format),Re=s.convert(p.depthTexture.type);let he;p.depthTexture.format===1026?he=i.DEPTH_COMPONENT24:p.depthTexture.format===1027&&(he=i.DEPTH24_STENCIL8);for(let oe=0;oe<6;oe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,he,p.width,p.height,0,ae,Re,null)}}else j(p.depthTexture,0);const re=$.__webglTexture,se=Te(p),J=V?i.TEXTURE_CUBE_MAP_POSITIVE_X+O:i.TEXTURE_2D,te=p.depthTexture.format===1027?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(p.depthTexture.format===1026)ze(p)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,J,re,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,te,J,re,0);else if(p.depthTexture.format===1027)ze(p)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,J,re,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,te,J,re,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ie(R){const p=n.get(R),O=R.isWebGLCubeRenderTarget===!0;if(p.__boundDepthTexture!==R.depthTexture){const V=R.depthTexture;if(p.__depthDisposeCallback&&p.__depthDisposeCallback(),V){const $=()=>{delete p.__boundDepthTexture,delete p.__depthDisposeCallback,V.removeEventListener("dispose",$)};V.addEventListener("dispose",$),p.__depthDisposeCallback=$}p.__boundDepthTexture=V}if(R.depthTexture&&!p.__autoAllocateDepthBuffer)if(O)for(let V=0;V<6;V++)xt(p.__webglFramebuffer[V],R,V);else{const V=R.texture.mipmaps;V&&V.length>0?xt(p.__webglFramebuffer[0],R,0):xt(p.__webglFramebuffer,R,0)}else if(O){p.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(i.FRAMEBUFFER,p.__webglFramebuffer[V]),p.__webglDepthbuffer[V]===void 0)p.__webglDepthbuffer[V]=i.createRenderbuffer(),ke(p.__webglDepthbuffer[V],R,!1);else{const $=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=p.__webglDepthbuffer[V];i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,re)}}else{const V=R.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(i.FRAMEBUFFER,p.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,p.__webglFramebuffer),p.__webglDepthbuffer===void 0)p.__webglDepthbuffer=i.createRenderbuffer(),ke(p.__webglDepthbuffer,R,!1);else{const $=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=p.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,re)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ue(R,p,O){const V=n.get(R);p!==void 0&&ue(V.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Ie(R)}function tt(R){const p=R.texture,O=n.get(R),V=n.get(p);R.addEventListener("dispose",m);const $=R.textures,re=R.isWebGLCubeRenderTarget===!0,se=$.length>1;if(se||(V.__webglTexture===void 0&&(V.__webglTexture=i.createTexture()),V.__version=p.version,a.memory.textures++),re){O.__webglFramebuffer=[];for(let J=0;J<6;J++)if(p.mipmaps&&p.mipmaps.length>0){O.__webglFramebuffer[J]=[];for(let te=0;te<p.mipmaps.length;te++)O.__webglFramebuffer[J][te]=i.createFramebuffer()}else O.__webglFramebuffer[J]=i.createFramebuffer()}else{if(p.mipmaps&&p.mipmaps.length>0){O.__webglFramebuffer=[];for(let J=0;J<p.mipmaps.length;J++)O.__webglFramebuffer[J]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(se)for(let J=0,te=$.length;J<te;J++){const ae=n.get($[J]);ae.__webglTexture===void 0&&(ae.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&ze(R)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let J=0;J<$.length;J++){const te=$[J];O.__webglColorRenderbuffer[J]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[J]);const ae=s.convert(te.format,te.colorSpace),Re=s.convert(te.type),he=M(te.internalFormat,ae,Re,te.normalized,te.colorSpace,R.isXRRenderTarget===!0),oe=Te(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,he,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+J,i.RENDERBUFFER,O.__webglColorRenderbuffer[J])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),ke(O.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(re){t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),Fe(i.TEXTURE_CUBE_MAP,p);for(let J=0;J<6;J++)if(p.mipmaps&&p.mipmaps.length>0)for(let te=0;te<p.mipmaps.length;te++)ue(O.__webglFramebuffer[J][te],R,p,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,te);else ue(O.__webglFramebuffer[J],R,p,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);h(p)&&T(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){for(let J=0,te=$.length;J<te;J++){const ae=$[J],Re=n.get(ae);let he=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(he=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(he,Re.__webglTexture),Fe(he,ae),ue(O.__webglFramebuffer,R,ae,i.COLOR_ATTACHMENT0+J,he,0),h(ae)&&T(he)}t.unbindTexture()}else{let J=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(J=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(J,V.__webglTexture),Fe(J,p),p.mipmaps&&p.mipmaps.length>0)for(let te=0;te<p.mipmaps.length;te++)ue(O.__webglFramebuffer[te],R,p,i.COLOR_ATTACHMENT0,J,te);else ue(O.__webglFramebuffer,R,p,i.COLOR_ATTACHMENT0,J,0);h(p)&&T(J),t.unbindTexture()}R.depthBuffer&&Ie(R)}function Ne(R){const p=R.textures;for(let O=0,V=p.length;O<V;O++){const $=p[O];if(h($)){const re=w(R),se=n.get($).__webglTexture;t.bindTexture(re,se),T(re),t.unbindTexture()}}}const Ye=[],Me=[];function Ce(R){if(R.samples>0){if(ze(R)===!1){const p=R.textures,O=R.width,V=R.height;let $=i.COLOR_BUFFER_BIT;const re=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=n.get(R),J=p.length>1;if(J)for(let ae=0;ae<p.length;ae++)t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer);const te=R.texture.mipmaps;te&&te.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let ae=0;ae<p.length;ae++){if(R.resolveDepthBuffer&&(R.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),J){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,se.__webglColorRenderbuffer[ae]);const Re=n.get(p[ae]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Re,0)}i.blitFramebuffer(0,0,O,V,0,0,O,V,$,i.NEAREST),c===!0&&(Ye.length=0,Me.length=0,Ye.push(i.COLOR_ATTACHMENT0+ae),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(Ye.push(re),Me.push(re),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Me)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ye))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),J)for(let ae=0;ae<p.length;ae++){t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,se.__webglColorRenderbuffer[ae]);const Re=n.get(p[ae]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.TEXTURE_2D,Re,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&c){const p=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[p])}}}function Te(R){return Math.min(r.maxSamples,R.samples)}function ze(R){const p=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&p.__useRenderToTexture!==!1}function L(R){const p=a.render.frame;u.get(R)!==p&&(u.set(R,p),R.update())}function ct(R,p){const O=R.colorSpace,V=R.format,$=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==Si&&O!==""&&($e.getTransfer(O)===st?(V!==1023||$!==1009)&&Be("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):et("WebGLTextures: Unsupported texture color space:",O)),p}function Qe(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=G,this.resetTextureUnits=N,this.getTextureUnits=P,this.setTextureUnits=B,this.setTexture2D=j,this.setTexture2DArray=X,this.setTexture3D=Z,this.setTextureCube=ee,this.rebindTextures=Ue,this.setupRenderTarget=tt,this.updateRenderTargetMipmap=Ne,this.updateMultisampleRenderTarget=Ce,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=ue,this.useMultisampledRTT=ze,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Th(i,e){function t(n,r=""){let s;const a=$e.getTransfer(r);if(n===1009)return i.UNSIGNED_BYTE;if(n===1017)return i.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return i.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return i.BYTE;if(n===1011)return i.SHORT;if(n===1012)return i.UNSIGNED_SHORT;if(n===1013)return i.INT;if(n===1014)return i.UNSIGNED_INT;if(n===1015)return i.FLOAT;if(n===1016)return i.HALF_FLOAT;if(n===1021)return i.ALPHA;if(n===1022)return i.RGB;if(n===1023)return i.RGBA;if(n===1026)return i.DEPTH_COMPONENT;if(n===1027)return i.DEPTH_STENCIL;if(n===1028)return i.RED;if(n===1029)return i.RED_INTEGER;if(n===1030)return i.RG;if(n===1031)return i.RG_INTEGER;if(n===1033)return i.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===st)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===33776)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===33776)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===35840)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===36196||n===37492)return a===st?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===37496)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return s.COMPRESSED_R11_EAC;if(n===37489)return s.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return s.COMPRESSED_RG11_EAC;if(n===37491)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===37808)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===36492)return a===st?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===36283)return s.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Ah=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Rh=`
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

}`;class wh{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new As(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Jt({vertexShader:Ah,fragmentShader:Rh,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Xt(new hi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ch extends Mn{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,u=null,d=null,f=null,x=null,g=null;const y=typeof XRWebGLBinding<"u",_=new wh,h={},T=t.getContextAttributes();let w=null,M=null;const S=[],b=[],A=new Ze;let m=null,E=null;const C=new qt;C.viewport=new ut;const D=new qt;D.viewport=new ut;const I=[C,D],N=new po;let P=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=S[Y];return K===void 0&&(K=new mr,S[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=S[Y];return K===void 0&&(K=new mr,S[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=S[Y];return K===void 0&&(K=new mr,S[Y]=K),K.getHandSpace()};function G(Y){const K=b.indexOf(Y.inputSource);if(K===-1)return;const pe=S[K];pe!==void 0&&(pe.update(Y.inputSource,Y.frame,l||a),pe.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){r.removeEventListener("select",G),r.removeEventListener("selectstart",G),r.removeEventListener("selectend",G),r.removeEventListener("squeeze",G),r.removeEventListener("squeezestart",G),r.removeEventListener("squeezeend",G),r.removeEventListener("end",W),r.removeEventListener("inputsourceschange",j);for(let Y=0;Y<S.length;Y++){const K=b[Y];K!==null&&(b[Y]=null,S[Y].disconnect(K))}P=null,B=null,_.reset();for(const Y in h)delete h[Y];if(e.setRenderTarget(w),x=null,f=null,d=null,r=null,M=null,Ge.stop(),n.isPresenting=!1,e.setPixelRatio(m),e.setSize(A.width,A.height,!1),E!==null){const Y=E.camera;Y.fov=E.fov,Y.zoom=E.zoom,Y.updateProjectionMatrix(),E=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&Be("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&Be("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return f!==null?f:x},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(w=e.getRenderTarget(),r.addEventListener("select",G),r.addEventListener("selectstart",G),r.addEventListener("selectend",G),r.addEventListener("squeeze",G),r.addEventListener("squeezestart",G),r.addEventListener("squeezeend",G),r.addEventListener("end",W),r.addEventListener("inputsourceschange",j),T.xrCompatible!==!0&&await t.makeXRCompatible(),m=e.getPixelRatio(),e.getSize(A),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,De=null,ue=null;T.depth&&(ue=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=T.stencil?1027:1026,De=T.stencil?1020:1014);const ke={colorFormat:t.RGBA8,depthFormat:ue,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer(ke),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),M=new Bt(f.textureWidth,f.textureHeight,{format:1023,type:1009,depthTexture:new ci(f.textureWidth,f.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{const pe={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:s};x=new XRWebGLLayer(r,t,pe),r.updateRenderState({baseLayer:x}),e.setPixelRatio(1),e.setSize(x.framebufferWidth,x.framebufferHeight,!1),M=new Bt(x.framebufferWidth,x.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:x.ignoreDepthValues===!1,resolveStencilBuffer:x.ignoreDepthValues===!1,storeMultisampledDepthBuffer:x.ignoreDepthValues===!1,storeMultisampledStencilBuffer:x.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),Ge.setContext(r),Ge.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function j(Y){for(let K=0;K<Y.removed.length;K++){const pe=Y.removed[K],De=b.indexOf(pe);De>=0&&(b[De]=null,S[De].disconnect(pe))}for(let K=0;K<Y.added.length;K++){const pe=Y.added[K];let De=b.indexOf(pe);if(De===-1){for(let ke=0;ke<S.length;ke++)if(ke>=b.length){b.push(pe),De=ke;break}else if(b[ke]===null){b[ke]=pe,De=ke;break}if(De===-1)break}const ue=S[De];ue&&ue.connect(pe)}}const X=new H,Z=new H;function ee(Y,K,pe){X.setFromMatrixPosition(K.matrixWorld),Z.setFromMatrixPosition(pe.matrixWorld);const De=X.distanceTo(Z),ue=K.projectionMatrix.elements,ke=pe.projectionMatrix.elements,xt=ue[14]/(ue[10]-1),Ie=ue[14]/(ue[10]+1),Ue=(ue[9]+1)/ue[5],tt=(ue[9]-1)/ue[5],Ne=(ue[8]-1)/ue[0],Ye=(ke[8]+1)/ke[0],Me=xt*Ne,Ce=xt*Ye,Te=De/(-Ne+Ye),ze=Te*-Ne;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ze),Y.translateZ(Te),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ue[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const L=xt+Te,ct=Ie+Te,Qe=Me-ze,R=Ce+(De-ze),p=Ue*Ie/ct*L,O=tt*Ie/ct*L;Y.projectionMatrix.makePerspective(Qe,R,p,O,L,ct),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Se(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let K=Y.near,pe=Y.far;_.texture!==null&&(_.depthNear>0&&(K=_.depthNear),_.depthFar>0&&(pe=_.depthFar)),N.near=D.near=C.near=K,N.far=D.far=C.far=pe,(P!==N.near||B!==N.far)&&(r.updateRenderState({depthNear:N.near,depthFar:N.far}),P=N.near,B=N.far),N.layers.mask=Y.layers.mask|6,C.layers.mask=N.layers.mask&-5,D.layers.mask=N.layers.mask&-3;const De=Y.parent,ue=N.cameras;Se(N,De);for(let ke=0;ke<ue.length;ke++)Se(ue[ke],De);ue.length===2?ee(N,C,D):N.projectionMatrix.copy(C.projectionMatrix),E===null&&Y.isPerspectiveCamera&&(E={camera:Y,fov:Y.fov,zoom:Y.zoom}),ge(Y,N,De)};function ge(Y,K,pe){pe===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(pe.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=cr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(f===null&&x===null))return c},this.setFoveation=function(Y){c=Y,f!==null&&(f.fixedFoveation=Y),x!==null&&x.fixedFoveation!==void 0&&(x.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(N)},this.getCameraTexture=function(Y){return h[Y]};let Xe=null;function Fe(Y,K){if(u=K.getViewerPose(l||a),g=K,u!==null){const pe=u.views;x!==null&&(e.setRenderTargetFramebuffer(M,x.framebuffer),e.setRenderTarget(M));let De=!1;pe.length!==N.cameras.length&&(N.cameras.length=0,De=!0);for(let Ie=0;Ie<pe.length;Ie++){const Ue=pe[Ie];let tt=null;if(x!==null)tt=x.getViewport(Ue);else{const Ye=d.getViewSubImage(f,Ue);tt=Ye.viewport,Ie===0&&(e.setRenderTargetTextures(M,Ye.colorTexture,Ye.depthStencilTexture),e.setRenderTarget(M))}let Ne=I[Ie];Ne===void 0&&(Ne=new qt,Ne.layers.enable(Ie),Ne.viewport=new ut,I[Ie]=Ne),Ne.matrix.fromArray(Ue.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(Ue.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(tt.x,tt.y,tt.width,tt.height),Ie===0&&(N.matrix.copy(Ne.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),De===!0&&N.cameras.push(Ne)}const ue=r.enabledFeatures;if(ue&&ue.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&y){d=n.getBinding();const Ie=d.getDepthInformation(pe[0]);Ie&&Ie.isValid&&Ie.texture&&_.init(Ie,r.renderState)}if(ue&&ue.includes("camera-access")&&y){e.state.unbindTexture(),d=n.getBinding();for(let Ie=0;Ie<pe.length;Ie++){const Ue=pe[Ie].camera;if(Ue){let tt=h[Ue];tt||(tt=new As,h[Ue]=tt);const Ne=d.getCameraImage(Ue);tt.sourceTexture=Ne}}}}for(let pe=0;pe<S.length;pe++){const De=b[pe],ue=S[pe];De!==null&&ue!==void 0&&ue.update(De,K,l||a)}Xe&&Xe(Y,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const Ge=new Us;Ge.setAnimationLoop(Fe),this.setAnimationLoop=function(Y){Xe=Y},this.dispose=function(){}}}const Ph=new pt,fa=new Oe;fa.set(-1,0,0,0,1,0,0,0,1);function Dh(i,e){function t(_,h){_.matrixAutoUpdate===!0&&_.updateMatrix(),h.value.copy(_.matrix)}function n(_,h){h.color.getRGB(_.fogColor.value,ws(i)),h.isFog?(_.fogNear.value=h.near,_.fogFar.value=h.far):h.isFogExp2&&(_.fogDensity.value=h.density)}function r(_,h,T,w,M){h.isNodeMaterial?h.uniformsNeedUpdate=!1:h.isMeshBasicMaterial?s(_,h):h.isMeshLambertMaterial?(s(_,h),h.envMap&&(_.envMapIntensity.value=h.envMapIntensity)):h.isMeshToonMaterial?(s(_,h),d(_,h)):h.isMeshPhongMaterial?(s(_,h),u(_,h),h.envMap&&(_.envMapIntensity.value=h.envMapIntensity)):h.isMeshStandardMaterial?(s(_,h),f(_,h),h.isMeshPhysicalMaterial&&x(_,h,M)):h.isMeshMatcapMaterial?(s(_,h),g(_,h)):h.isMeshDepthMaterial?s(_,h):h.isMeshDistanceMaterial?(s(_,h),y(_,h)):h.isMeshNormalMaterial?s(_,h):h.isLineBasicMaterial?(a(_,h),h.isLineDashedMaterial&&o(_,h)):h.isPointsMaterial?c(_,h,T,w):h.isSpriteMaterial?l(_,h):h.isShadowMaterial?(_.color.value.copy(h.color),_.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(_,h){_.opacity.value=h.opacity,h.color&&_.diffuse.value.copy(h.color),h.emissive&&_.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(_.map.value=h.map,t(h.map,_.mapTransform)),h.alphaMap&&(_.alphaMap.value=h.alphaMap,t(h.alphaMap,_.alphaMapTransform)),h.bumpMap&&(_.bumpMap.value=h.bumpMap,t(h.bumpMap,_.bumpMapTransform),_.bumpScale.value=h.bumpScale,h.side===1&&(_.bumpScale.value*=-1)),h.normalMap&&(_.normalMap.value=h.normalMap,t(h.normalMap,_.normalMapTransform),_.normalScale.value.copy(h.normalScale),h.side===1&&_.normalScale.value.negate()),h.displacementMap&&(_.displacementMap.value=h.displacementMap,t(h.displacementMap,_.displacementMapTransform),_.displacementScale.value=h.displacementScale,_.displacementBias.value=h.displacementBias),h.emissiveMap&&(_.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,_.emissiveMapTransform)),h.specularMap&&(_.specularMap.value=h.specularMap,t(h.specularMap,_.specularMapTransform)),h.alphaTest>0&&(_.alphaTest.value=h.alphaTest);const T=e.get(h),w=T.envMap,M=T.envMapRotation;w&&(_.envMap.value=w,_.envMapRotation.value.setFromMatrix4(Ph.makeRotationFromEuler(M)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&_.envMapRotation.value.premultiply(fa),_.reflectivity.value=h.reflectivity,_.ior.value=h.ior,_.refractionRatio.value=h.refractionRatio),h.lightMap&&(_.lightMap.value=h.lightMap,_.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,_.lightMapTransform)),h.aoMap&&(_.aoMap.value=h.aoMap,_.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,_.aoMapTransform))}function a(_,h){_.diffuse.value.copy(h.color),_.opacity.value=h.opacity,h.map&&(_.map.value=h.map,t(h.map,_.mapTransform))}function o(_,h){_.dashSize.value=h.dashSize,_.totalSize.value=h.dashSize+h.gapSize,_.scale.value=h.scale}function c(_,h,T,w){_.diffuse.value.copy(h.color),_.opacity.value=h.opacity,_.size.value=h.size*T,_.scale.value=w*.5,h.map&&(_.map.value=h.map,t(h.map,_.uvTransform)),h.alphaMap&&(_.alphaMap.value=h.alphaMap,t(h.alphaMap,_.alphaMapTransform)),h.alphaTest>0&&(_.alphaTest.value=h.alphaTest)}function l(_,h){_.diffuse.value.copy(h.color),_.opacity.value=h.opacity,_.rotation.value=h.rotation,h.map&&(_.map.value=h.map,t(h.map,_.mapTransform)),h.alphaMap&&(_.alphaMap.value=h.alphaMap,t(h.alphaMap,_.alphaMapTransform)),h.alphaTest>0&&(_.alphaTest.value=h.alphaTest)}function u(_,h){_.specular.value.copy(h.specular),_.shininess.value=Math.max(h.shininess,1e-4)}function d(_,h){h.gradientMap&&(_.gradientMap.value=h.gradientMap)}function f(_,h){_.metalness.value=h.metalness,h.metalnessMap&&(_.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,_.metalnessMapTransform)),_.roughness.value=h.roughness,h.roughnessMap&&(_.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,_.roughnessMapTransform)),h.envMap&&(_.envMapIntensity.value=h.envMapIntensity)}function x(_,h,T){_.ior.value=h.ior,h.sheen>0&&(_.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),_.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(_.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,_.sheenColorMapTransform)),h.sheenRoughnessMap&&(_.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,_.sheenRoughnessMapTransform))),h.clearcoat>0&&(_.clearcoat.value=h.clearcoat,_.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(_.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,_.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(_.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===1&&_.clearcoatNormalScale.value.negate())),h.dispersion>0&&(_.dispersion.value=h.dispersion),h.retroreflectivity>0&&(_.retroreflectivity.value=h.retroreflectivity),h.iridescence>0&&(_.iridescence.value=h.iridescence,_.iridescenceIOR.value=h.iridescenceIOR,_.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],_.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(_.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,_.iridescenceMapTransform)),h.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),h.transmission>0&&(_.transmission.value=h.transmission,_.transmissionSamplerMap.value=T.texture,_.transmissionSamplerSize.value.set(T.width,T.height),h.transmissionMap&&(_.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,_.transmissionMapTransform)),_.thickness.value=h.thickness,h.thicknessMap&&(_.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=h.attenuationDistance,_.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(_.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(_.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=h.specularIntensity,_.specularColor.value.copy(h.specularColor),h.specularColorMap&&(_.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,_.specularColorMapTransform)),h.specularIntensityMap&&(_.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,_.specularIntensityMapTransform))}function g(_,h){h.matcap&&(_.matcap.value=h.matcap)}function y(_,h){const T=e.get(h).light;_.referencePosition.value.setFromMatrixPosition(T.matrixWorld),_.nearDistance.value=T.shadow.camera.near,_.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Lh(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,S){const b=S.program;n.uniformBlockBinding(M,b)}function l(M,S){let b=r[M.id];b===void 0&&(_(M),b=u(M),r[M.id]=b,M.addEventListener("dispose",T));const A=S.program;n.updateUBOMapping(M,A);const m=e.render.frame;s[M.id]!==m&&(f(M),s[M.id]=m)}function u(M){const S=d();M.__bindingPointIndex=S;const b=i.createBuffer(),A=M.__size,m=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,A,m),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,b),b}function d(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return et("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){const S=r[M.id],b=M.uniforms,A=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let m=0,E=b.length;m<E;m++){const C=b[m];if(Array.isArray(C))for(let D=0,I=C.length;D<I;D++)x(C[D],m,D,A);else x(C,m,0,A)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function x(M,S,b,A){if(y(M,S,b,A)===!0){const m=M.__offset,E=M.value;if(Array.isArray(E)){let C=0;for(let D=0;D<E.length;D++){const I=E[D],N=h(I);g(I,M.__data,C),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(C+=N.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(E,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,m,M.__data)}}function g(M,S,b){typeof M=="number"||typeof M=="boolean"?S[0]=M:M.isMatrix3?(S[0]=M.elements[0],S[1]=M.elements[1],S[2]=M.elements[2],S[3]=0,S[4]=M.elements[3],S[5]=M.elements[4],S[6]=M.elements[5],S[7]=0,S[8]=M.elements[6],S[9]=M.elements[7],S[10]=M.elements[8],S[11]=0):ArrayBuffer.isView(M)?S.set(new M.constructor(M.buffer,M.byteOffset,S.length)):M.toArray(S,b)}function y(M,S,b,A){const m=M.value,E=S+"_"+b;if(A[E]===void 0)return typeof m=="number"||typeof m=="boolean"?A[E]=m:ArrayBuffer.isView(m)?A[E]=m.slice():A[E]=m.clone(),!0;{const C=A[E];if(typeof m=="number"||typeof m=="boolean"){if(C!==m)return A[E]=m,!0}else{if(ArrayBuffer.isView(m))return!0;if(C.equals(m)===!1)return C.copy(m),!0}}return!1}function _(M){const S=M.uniforms;let b=0;const A=16;for(let E=0,C=S.length;E<C;E++){const D=Array.isArray(S[E])?S[E]:[S[E]];for(let I=0,N=D.length;I<N;I++){const P=D[I],B=Array.isArray(P.value)?P.value:[P.value];for(let G=0,W=B.length;G<W;G++){const j=B[G],X=h(j),Z=b%A,ee=Z%X.boundary,Se=Z+ee;b+=ee,Se!==0&&A-Se<X.storage&&(b+=A-Se),P.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=b,b+=X.storage}}}const m=b%A;return m>0&&(b+=A-m),M.__size=b,M.__cache={},this}function h(M){const S={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(S.boundary=4,S.storage=4):M.isVector2?(S.boundary=8,S.storage=8):M.isVector3||M.isColor?(S.boundary=16,S.storage=12):M.isVector4?(S.boundary=16,S.storage=16):M.isMatrix3?(S.boundary=48,S.storage=48):M.isMatrix4?(S.boundary=64,S.storage=64):M.isTexture?Be("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(S.boundary=16,S.storage=M.byteLength):Be("WebGLRenderer: Unsupported uniform value type.",M),S}function T(M){const S=M.target;S.removeEventListener("dispose",T);const b=a.indexOf(S.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function w(){for(const M in r)i.deleteBuffer(r[M]);a=[],r={},s={}}return{bind:c,update:l,dispose:w}}const Fh=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let en=null;function Ih(){return en===null&&(en=new Wn(Fh,16,16,1030,1016),en.name="DFG_LUT",en.minFilter=1006,en.magFilter=1006,en.wrapS=1001,en.wrapT=1001,en.generateMipmaps=!1,en.needsUpdate=!0),en}class Uh{constructor(e={}){const{canvas:t=Ua(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:x=1009}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const y=x,_=new Set([1033,1031,1029]),h=new Set([1009,1014,1012,1020,1017,1018]),T=new Uint32Array(4),w=new Int32Array(4),M=new H;let S=null,b=null;const A=[],m=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let D=!1,I=null,N=null,P=null,B=null;this._outputColorSpace=Dt;let G=0,W=0,j=null,X=-1,Z=null;const ee=new ut,Se=new ut;let ge=null;const Xe=new nt(0);let Fe=0,Ge=t.width,Y=t.height,K=1,pe=null,De=null;const ue=new ut(0,0,Ge,Y),ke=new ut(0,0,Ge,Y);let xt=!1;const Ie=new Es;let Ue=!1,tt=!1;const Ne=new pt,Ye=new H,Me=new ut,Ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Te=!1;function ze(){return j===null?K:1}let L=n;function ct(v,F){return t.getContext(v,F)}let Qe,R,p,O,V,$,re,se,J,te,ae,Re,he,oe,we,Le,Ve,U,le,Q,ce,xe,ne;try{const v={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r186"),t.addEventListener("webglcontextlost",ft,!1),t.addEventListener("webglcontextrestored",it,!1),t.addEventListener("webglcontextcreationerror",Kt,!1),L===null){const F="webgl2";if(L=ct(F,v),L===null)throw ct(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Pe()}catch(v){throw t.removeEventListener("webglcontextlost",ft,!1),t.removeEventListener("webglcontextrestored",it,!1),t.removeEventListener("webglcontextcreationerror",Kt,!1),et("WebGLRenderer: "+v.message),v}function Pe(){Qe=new Fc(L),Qe.init(),ce=new Th(L,Qe),R=new bc(L,Qe,e,ce),p=new bh(L,Qe),R.reversedDepthBuffer&&f&&p.buffers.depth.setReversed(!0),N=L.createFramebuffer(),P=L.createFramebuffer(),B=L.createFramebuffer(),O=new Nc(L),V=new ch,$=new Eh(L,Qe,p,V,R,ce,O),re=new Lc(C),se=new go(L),xe=new Mc(L,se),J=new Ic(L,se,O,xe),te=new Oc(L,J,se,xe,O),U=new Bc(L,R,$),we=new Ec(V),ae=new lh(C,re,Qe,R,xe,we),Re=new Dh(C,V),he=new hh,oe=new mh(Qe),Ve=new Sc(C,re,p,te,g,c),Le=new yh(C,te,R),ne=new Lh(L,O,R,p),le=new yc(L,Qe,O),Q=new Uc(L,Qe,O),O.programs=ae.programs,C.capabilities=R,C.extensions=Qe,C.properties=V,C.renderLists=he,C.shadowMap=Le,C.state=p,C.info=O}y!==1009&&(E=new zc(y,t.width,t.height,o,r,s));const Ee=new Ch(C,L);this.xr=Ee,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const v=Qe.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=Qe.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(v){v!==void 0&&(K=v,this.setSize(Ge,Y,!1))},this.getSize=function(v){return v.set(Ge,Y)},this.setSize=function(v,F,q=!0){if(Ee.isPresenting){Be("WebGLRenderer: Can't change size while VR device is presenting.");return}Ge=v,Y=F,t.width=Math.floor(v*K),t.height=Math.floor(F*K),q===!0&&(t.style.width=v+"px",t.style.height=F+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,v,F)},this.getDrawingBufferSize=function(v){return v.set(Ge*K,Y*K).floor()},this.setDrawingBufferSize=function(v,F,q){Ge=v,Y=F,K=q,t.width=Math.floor(v*q),t.height=Math.floor(F*q),this.setViewport(0,0,v,F)},this.setEffects=function(v){if(y===1009){et("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let F=0;F<v.length;F++)if(v[F].isOutputPass===!0){Be("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(ee)},this.getViewport=function(v){return v.copy(ue)},this.setViewport=function(v,F,q,k){v.isVector4?ue.set(v.x,v.y,v.z,v.w):ue.set(v,F,q,k),p.viewport(ee.copy(ue).multiplyScalar(K).round())},this.getScissor=function(v){return v.copy(ke)},this.setScissor=function(v,F,q,k){v.isVector4?ke.set(v.x,v.y,v.z,v.w):ke.set(v,F,q,k),p.scissor(Se.copy(ke).multiplyScalar(K).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(v){p.setScissorTest(xt=v)},this.setOpaqueSort=function(v){pe=v},this.setTransparentSort=function(v){De=v},this.getClearColor=function(v){return v.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(v=!0,F=!0,q=!0){let k=0;if(v){let z=!1;if(j!==null){const _e=j.texture.format;z=_.has(_e)}if(z){const _e=j.texture.type,ve=h.has(_e),de=Ve.getClearColor(),ye=Ve.getClearAlpha(),Ae=de.r,We=de.g,qe=de.b;ve?(T[0]=Ae,T[1]=We,T[2]=qe,T[3]=ye,L.clearBufferuiv(L.COLOR,0,T)):(w[0]=Ae,w[1]=We,w[2]=qe,w[3]=ye,L.clearBufferiv(L.COLOR,0,w))}else k|=L.COLOR_BUFFER_BIT}F&&(k|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(k|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&L.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),I=v},this.dispose=function(){t.removeEventListener("webglcontextlost",ft,!1),t.removeEventListener("webglcontextrestored",it,!1),t.removeEventListener("webglcontextcreationerror",Kt,!1),Ve.dispose(),he.dispose(),oe.dispose(),V.dispose(),re.dispose(),te.dispose(),xe.dispose(),ne.dispose(),ae.dispose(),Ee.dispose(),Ee.removeEventListener("sessionstart",Ta),Ee.removeEventListener("sessionend",Aa),Pn.stop()};function ft(v){v.preventDefault(),ns("WebGLRenderer: Context Lost."),D=!0}function it(){ns("WebGLRenderer: Context Restored."),D=!1;const v=O.autoReset,F=Le.enabled,q=Le.autoUpdate,k=Le.needsUpdate,z=Le.type;Pe(),O.autoReset=v,Le.enabled=F,Le.autoUpdate=q,Le.needsUpdate=k,Le.type=z}function Kt(v){et("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function nn(v){const F=v.target;F.removeEventListener("dispose",nn),Nu(F)}function Nu(v){Bu(v),V.remove(v)}function Bu(v){const F=V.get(v).programs;F!==void 0&&(F.forEach(function(q){ae.releaseProgram(q)}),v.isShaderMaterial&&ae.releaseShaderCache(v))}this.renderBufferDirect=function(v,F,q,k,z,_e){F===null&&(F=Ce);const ve=z.isMesh&&z.matrixWorld.determinantAffine()<0,de=zu(v,F,q,k,z);p.setMaterial(k,ve);let ye=q.index,Ae=1;if(k.wireframe===!0){if(ye=J.getWireframeAttribute(q),ye===void 0)return;Ae=2}const We=q.drawRange,qe=q.attributes.position;let be=We.start*Ae,rt=(We.start+We.count)*Ae;_e!==null&&(be=Math.max(be,_e.start*Ae),rt=Math.min(rt,(_e.start+_e.count)*Ae)),ye!==null?(be=Math.max(be,0),rt=Math.min(rt,ye.count)):qe!=null&&(be=Math.max(be,0),rt=Math.min(rt,qe.count));const St=rt-be;if(St<0||St===1/0)return;xe.setup(z,k,de,q,ye);let dt,lt=le;if(ye!==null&&(dt=se.get(ye),lt=Q,lt.setIndex(dt)),z.isMesh)k.wireframe===!0?(p.setLineWidth(k.wireframeLinewidth*ze()),lt.setMode(L.LINES)):lt.setMode(L.TRIANGLES);else if(z.isLine){let At=k.linewidth;At===void 0&&(At=1),p.setLineWidth(At*ze()),z.isLineSegments?lt.setMode(L.LINES):z.isLineLoop?lt.setMode(L.LINE_LOOP):lt.setMode(L.LINE_STRIP)}else z.isPoints?lt.setMode(L.POINTS):z.isSprite&&lt.setMode(L.TRIANGLES);if(z.isBatchedMesh)if(Qe.get("WEBGL_multi_draw"))lt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const At=z._multiDrawStarts,me=z._multiDrawCounts,Pt=z._multiDrawCount,je=ye?se.get(ye).bytesPerElement:1,zt=V.get(k).currentProgram.getUniforms();for(let rn=0;rn<Pt;rn++)zt.setValue(L,"_gl_DrawID",rn),lt.render(At[rn]/je,me[rn])}else if(z.isInstancedMesh)lt.renderInstances(be,St,z.count);else if(q.isInstancedBufferGeometry){const At=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,me=Math.min(q.instanceCount,At);lt.renderInstances(be,St,me)}else lt.render(be,St)};function Ea(v,F,q,k){I!==null&&v.isNodeMaterial&&I.setObject(k,v),Ue===!0&&we.setState(v,q,!1),v.transparent===!0&&v.side===2&&v.forceSinglePass===!1?(v.side=1,v.needsUpdate=!0,sr(v,F,k),v.side=0,v.needsUpdate=!0,sr(v,F,k),v.side=2):sr(v,F,k)}this.compile=function(v,F,q=null){q===null&&(q=v),I!==null&&I.renderStart(v,F,q),b=oe.get(q),b.init(F),m.push(b),q.traverseVisible(function(z){z.isLight&&z.layers.test(F.layers)&&(b.pushLight(z),z.castShadow&&b.pushShadow(z))}),v!==q&&v.traverseVisible(function(z){z.isLight&&z.layers.test(F.layers)&&(b.pushLight(z),z.castShadow&&b.pushShadow(z))}),b.setupLights(),I!==null&&I.updateLights(b.state.lightsArray),tt=this.localClippingEnabled,Ue=we.init(this.clippingPlanes,tt),Ue===!0&&we.setGlobalState(this.clippingPlanes,F),I!==null&&Le.render(b.state.shadowsArray,q,F);const k=new Set;return v.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const _e=z.material;if(_e)if(Array.isArray(_e))for(let ve=0;ve<_e.length;ve++){const de=_e[ve];Ea(de,q,F,z),k.add(de)}else Ea(_e,q,F,z),k.add(_e)}),b=m.pop(),I!==null&&I.renderEnd(),k},this.compileAsync=function(v,F,q=null){const k=this.compile(v,F,q);return new Promise(z=>{function _e(){if(k.forEach(function(ve){const ye=V.get(ve).currentProgram;(ye===void 0||ye.isReady())&&k.delete(ve)}),k.size===0){z(v);return}setTimeout(_e,10)}Qe.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let jr=null;function Ou(v){jr&&jr(v)}function Ta(){Pn.stop()}function Aa(){Pn.start()}const Pn=new Us;Pn.setAnimationLoop(Ou),typeof self<"u"&&Pn.setContext(self),this.setAnimationLoop=function(v){jr=v,Ee.setAnimationLoop(v),v===null?Pn.stop():Pn.start()},Ee.addEventListener("sessionstart",Ta),Ee.addEventListener("sessionend",Aa),this.render=function(v,F){if(F!==void 0&&F.isCamera!==!0){et("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;I!==null&&I.renderStart(v,F);const q=Ee.enabled===!0&&Ee.isPresenting===!0,k=E!==null&&(j===null||q)&&E.begin(C,j);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Ee.enabled===!0&&Ee.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Ee.cameraAutoUpdate===!0&&Ee.updateCamera(F),F=Ee.getCamera()),v.isScene===!0&&v.onBeforeRender(C,v,F,j),b=oe.get(v,m.length),b.init(F),b.state.textureUnits=$.getTextureUnits(),m.push(b),Ne.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Ie.setFromProjectionMatrix(Ne,2e3,F.reversedDepth),tt=this.localClippingEnabled,Ue=we.init(this.clippingPlanes,tt),S=he.get(v,A.length),S.init(),A.push(S),Ee.enabled===!0&&Ee.isPresenting===!0){const ve=C.xr.getDepthSensingMesh();ve!==null&&es(ve,F,-1/0,C.sortObjects)}es(v,F,0,C.sortObjects),S.finish(),I!==null&&I.updateLights(b.state.lightsArray),C.sortObjects===!0&&S.sort(pe,De),Te=Ee.enabled===!1||Ee.isPresenting===!1||Ee.hasDepthSensing()===!1,Te&&Ve.addToRenderList(S,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ue===!0&&we.beginShadows();const z=b.state.shadowsArray;if(Le.render(z,v,F),Ue===!0&&we.endShadows(),(k&&E.hasRenderPass())===!1){const ve=S.opaque,de=S.transmissive;if(b.setupLights(),F.isArrayCamera){const ye=F.cameras;if(de.length>0)for(let Ae=0,We=ye.length;Ae<We;Ae++){const qe=ye[Ae];wa(ve,de,v,qe)}Te&&Ve.render(v);for(let Ae=0,We=ye.length;Ae<We;Ae++){const qe=ye[Ae];Ra(S,v,qe,qe.viewport)}}else de.length>0&&wa(ve,de,v,F),Te&&Ve.render(v),Ra(S,v,F)}j!==null&&W===0&&($.updateMultisampleRenderTarget(j),$.updateRenderTargetMipmap(j)),k&&E.end(C),v.isScene===!0&&v.onAfterRender(C,v,F),xe.resetDefaultState(),X=-1,Z=null,m.pop(),m.length>0?(b=m[m.length-1],$.setTextureUnits(b.state.textureUnits),Ue===!0&&we.setGlobalState(C.clippingPlanes,b.state.camera)):b=null,A.pop(),A.length>0?S=A[A.length-1]:S=null,I!==null&&I.renderEnd()};function es(v,F,q,k){if(v.visible===!1)return;if(v.layers.test(F.layers)){if(v.isGroup)q=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(F);else if(v.isLightProbeGrid)b.pushLightProbeGrid(v);else if(v.isLight)b.pushLight(v),v.castShadow&&b.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||v.intersectsFrustum(Ie)){k&&Me.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Ne);const ve=te.update(v),de=v.material;de.visible&&S.push(v,ve,de,q,Me.z,null,F)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||v.intersectsFrustum(Ie))){const ve=te.update(v),de=v.material;if(k&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Me.copy(v.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),Me.copy(ve.boundingSphere.center)),Me.applyMatrix4(v.matrixWorld).applyMatrix4(Ne)),Array.isArray(de)){const ye=ve.groups;for(let Ae=0,We=ye.length;Ae<We;Ae++){const qe=ye[Ae],be=de[qe.materialIndex];be&&be.visible&&S.push(v,ve,be,q,Me.z,qe,F)}}else de.visible&&S.push(v,ve,de,q,Me.z,null,F)}}const _e=v.children;for(let ve=0,de=_e.length;ve<de;ve++)es(_e[ve],F,q,k)}function Ra(v,F,q,k){const{opaque:z,transmissive:_e,transparent:ve}=v;b.setupLightsView(q),Ue===!0&&we.setGlobalState(C.clippingPlanes,q),k&&p.viewport(ee.copy(k)),z.length>0&&rr(z,F,q),_e.length>0&&rr(_e,F,q),ve.length>0&&rr(ve,F,q),p.buffers.depth.setTest(!0),p.buffers.depth.setMask(!0),p.buffers.color.setMask(!0),p.setPolygonOffset(!1)}function wa(v,F,q,k){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[k.id]===void 0){const be=Qe.has("EXT_color_buffer_half_float")||Qe.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[k.id]=new Bt(1,1,{generateMipmaps:!0,type:be?1016:1009,minFilter:1008,samples:Math.max(4,R.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:$e.workingColorSpace})}const _e=b.state.transmissionRenderTarget[k.id],ve=k.viewport||ee;_e.setSize(ve.z*C.transmissionResolutionScale,ve.w*C.transmissionResolutionScale);const de=C.getRenderTarget(),ye=C.getActiveCubeFace(),Ae=C.getActiveMipmapLevel();C.setRenderTarget(_e),C.getClearColor(Xe),Fe=C.getClearAlpha(),Fe<1&&C.setClearColor(16777215,.5),C.clear(),Te&&Ve.render(q);const We=C.toneMapping;C.toneMapping=0;const qe=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),b.setupLightsView(k),Ue===!0&&we.setGlobalState(C.clippingPlanes,k),rr(v,q,k),$.updateMultisampleRenderTarget(_e),$.updateRenderTargetMipmap(_e),Qe.has("WEBGL_multisampled_render_to_texture")===!1){let be=!1;for(let rt=0,St=F.length;rt<St;rt++){const dt=F[rt],{object:lt,geometry:At,material:me,group:Pt}=dt;if(me.side===2&&lt.layers.test(k.layers)){const je=me.side;me.side=1,me.needsUpdate=!0,Ca(lt,q,k,At,me,Pt),me.side=je,me.needsUpdate=!0,be=!0}}be===!0&&($.updateMultisampleRenderTarget(_e),$.updateRenderTargetMipmap(_e))}C.setRenderTarget(de,ye,Ae),C.setClearColor(Xe,Fe),qe!==void 0&&(k.viewport=qe),C.toneMapping=We}function rr(v,F,q){const k=F.isScene===!0?F.overrideMaterial:null;for(let z=0,_e=v.length;z<_e;z++){const ve=v[z],{object:de,geometry:ye,group:Ae}=ve;let We=ve.material;We.allowOverride===!0&&k!==null&&(We=k),de.layers.test(q.layers)&&Ca(de,F,q,ye,We,Ae)}}function Ca(v,F,q,k,z,_e){I!==null&&z.isNodeMaterial&&I.setObject(v,z),v.onBeforeRender(C,F,q,k,z,_e),v.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),z.onBeforeRender(C,F,q,k,v,_e),z.transparent===!0&&z.side===2&&z.forceSinglePass===!1?(z.side=1,z.needsUpdate=!0,C.renderBufferDirect(q,F,k,z,v,_e),z.side=0,z.needsUpdate=!0,C.renderBufferDirect(q,F,k,z,v,_e),z.side=2):C.renderBufferDirect(q,F,k,z,v,_e),v.onAfterRender(C,F,q,k,z,_e)}function sr(v,F,q){F.isScene!==!0&&(F=Ce);const k=V.get(v),z=b.state.lights,_e=b.state.shadowsArray,ve=z.state.version,de=ae.getParameters(v,z.state,_e,F,q,b.state.lightProbeGridArray),ye=ae.getProgramCacheKey(de);let Ae=k.programs;k.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?F.environment:null,k.fog=F.fog;const We=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;k.envMap=re.get(v.envMap||k.environment,We),k.envMapRotation=k.environment!==null&&v.envMap===null?F.environmentRotation:v.envMapRotation,Ae===void 0&&(v.addEventListener("dispose",nn),Ae=new Map,k.programs=Ae);let qe=Ae.get(ye);if(qe!==void 0){if(k.currentProgram===qe&&k.lightsStateVersion===ve)return Da(v,de),qe}else de.uniforms=ae.getUniforms(v),I!==null&&v.isNodeMaterial&&I.build(v,q,de),v.onBeforeCompile(de,C),qe=ae.acquireProgram(de,ye),Ae.set(ye,qe),k.uniforms=de.uniforms;const be=k.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(be.clippingPlanes=we.uniform),Da(v,de),k.needsLights=Vu(v),k.lightsStateVersion=ve,k.needsLights&&(be.ambientLightColor.value=z.state.ambient,be.lightProbe.value=z.state.probe,be.sunLights.value=z.state.sun,be.sunLightShadows.value=z.state.sunShadow,be.directionalLights.value=z.state.directional,be.directionalLightShadows.value=z.state.directionalShadow,be.spotLights.value=z.state.spot,be.spotLightShadows.value=z.state.spotShadow,be.rectAreaLights.value=z.state.rectArea,be.ltc_1.value=z.state.rectAreaLTC1,be.ltc_2.value=z.state.rectAreaLTC2,be.pointLights.value=z.state.point,be.pointLightShadows.value=z.state.pointShadow,be.hemisphereLights.value=z.state.hemi,be.sunShadowMatrix.value=z.state.sunShadowMatrix,be.sunShadowCascade.value=z.state.sunShadowCascade,be.directionalShadowMatrix.value=z.state.directionalShadowMatrix,be.spotLightMatrix.value=z.state.spotLightMatrix,be.spotLightMap.value=z.state.spotLightMap,be.pointShadowMatrix.value=z.state.pointShadowMatrix),k.lightProbeGrid=b.state.lightProbeGridArray.length>0,k.currentProgram=qe,k.uniformsList=null,qe}function Pa(v){if(v.uniformsList===null){const F=v.currentProgram.getUniforms();v.uniformsList=Ki.seqWithValue(F.seq,v.uniforms)}return v.uniformsList}function Da(v,F){const q=V.get(v);q.outputColorSpace=F.outputColorSpace,q.batching=F.batching,q.batchingColor=F.batchingColor,q.instancing=F.instancing,q.instancingColor=F.instancingColor,q.instancingMorph=F.instancingMorph,q.skinning=F.skinning,q.morphTargets=F.morphTargets,q.morphNormals=F.morphNormals,q.morphColors=F.morphColors,q.morphTargetsCount=F.morphTargetsCount,q.numClippingPlanes=F.numClippingPlanes,q.numIntersection=F.numClipIntersection,q.vertexAlphas=F.vertexAlphas,q.vertexTangents=F.vertexTangents,q.toneMapping=F.toneMapping}function ku(v,F){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;M.setFromMatrixPosition(F.matrixWorld);for(let q=0,k=v.length;q<k;q++){const z=v[q];if(z.texture!==null&&z.boundingBox.containsPoint(M))return z}return null}function zu(v,F,q,k,z){F.isScene!==!0&&(F=Ce),$.resetTextureUnits();const _e=F.fog,ve=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?F.environment:null,de=j===null?C.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:$e.workingColorSpace,ye=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Ae=re.get(k.envMap||ve,ye),We=k.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,qe=!!q.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),be=!!q.morphAttributes.position,rt=!!q.morphAttributes.normal,St=!!q.morphAttributes.color;let dt=0;k.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(dt=C.toneMapping);const lt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,At=lt!==void 0?lt.length:0,me=V.get(k),Pt=b.state.lights;if(Ue===!0&&(tt===!0||v!==Z)){const ht=v===Z&&k.id===X;we.setState(k,v,ht)}let je=!1;k.version===me.__version?(me.needsLights&&me.lightsStateVersion!==Pt.state.version||me.outputColorSpace!==de||z.isBatchedMesh&&me.batching===!1||!z.isBatchedMesh&&me.batching===!0||z.isBatchedMesh&&me.batchingColor===!0&&z._colorsTexture===null||z.isBatchedMesh&&me.batchingColor===!1&&z._colorsTexture!==null||z.isInstancedMesh&&me.instancing===!1||!z.isInstancedMesh&&me.instancing===!0||z.isSkinnedMesh&&me.skinning===!1||!z.isSkinnedMesh&&me.skinning===!0||z.isInstancedMesh&&me.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&me.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&me.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&me.instancingMorph===!1&&z.morphTexture!==null||me.envMap!==Ae||k.fog===!0&&me.fog!==_e||me.numClippingPlanes!==void 0&&(me.numClippingPlanes!==we.numPlanes||me.numIntersection!==we.numIntersection)||me.vertexAlphas!==We||me.vertexTangents!==qe||me.morphTargets!==be||me.morphNormals!==rt||me.morphColors!==St||me.toneMapping!==dt||me.morphTargetsCount!==At||!!me.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(je=!0):(je=!0,me.__version=k.version);let zt=me.currentProgram;je===!0&&(zt=sr(k,F,z),I&&k.isNodeMaterial&&I.onUpdateProgram(k,zt,me));let rn=!1,gn=!1,ei=!1;const ot=zt.getUniforms(),mt=me.uniforms;if(p.useProgram(zt.program)&&(rn=!0,gn=!0,ei=!0),k.id!==X&&(X=k.id,gn=!0),me.needsLights){const ht=ku(b.state.lightProbeGridArray,z);me.lightProbeGrid!==ht&&(me.lightProbeGrid=ht,gn=!0)}if(rn||Z!==v){p.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),ot.setValue(L,"projectionMatrix",v.projectionMatrix),ot.setValue(L,"viewMatrix",v.matrixWorldInverse);const Sn=ot.map.cameraPosition;Sn!==void 0&&Sn.setValue(L,Ye.setFromMatrixPosition(v.matrixWorld)),R.logarithmicDepthBuffer&&ot.setValue(L,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ot.setValue(L,"isOrthographic",v.isOrthographicCamera===!0),Z!==v&&(Z=v,gn=!0,ei=!0)}if(me.needsLights&&(Pt.state.sunShadowMap.length>0&&ot.setValue(L,"sunShadowMap",Pt.state.sunShadowMap,$),Pt.state.directionalShadowMap.length>0&&ot.setValue(L,"directionalShadowMap",Pt.state.directionalShadowMap,$),Pt.state.spotShadowMap.length>0&&ot.setValue(L,"spotShadowMap",Pt.state.spotShadowMap,$),Pt.state.pointShadowMap.length>0&&ot.setValue(L,"pointShadowMap",Pt.state.pointShadowMap,$)),z.isSkinnedMesh){ot.setOptional(L,z,"bindMatrix"),ot.setOptional(L,z,"bindMatrixInverse");const ht=z.skeleton;ht&&(ht.boneTexture===null&&ht.computeBoneTexture(),ot.setValue(L,"boneTexture",ht.boneTexture,$))}z.isBatchedMesh&&(ot.setOptional(L,z,"batchingTexture"),ot.setValue(L,"batchingTexture",z._matricesTexture,$),ot.setOptional(L,z,"batchingIdTexture"),ot.setValue(L,"batchingIdTexture",z._indirectTexture,$),ot.setOptional(L,z,"batchingColorTexture"),z._colorsTexture!==null&&ot.setValue(L,"batchingColorTexture",z._colorsTexture,$));const vn=q.morphAttributes;if((vn.position!==void 0||vn.normal!==void 0||vn.color!==void 0)&&U.update(z,q,zt),(gn||me.receiveShadow!==z.receiveShadow)&&(me.receiveShadow=z.receiveShadow,ot.setValue(L,"receiveShadow",z.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&F.environment!==null&&(mt.envMapIntensity.value=F.environmentIntensity),mt.dfgLUT!==void 0&&(mt.dfgLUT.value=Ih()),gn){if(ot.setValue(L,"toneMappingExposure",C.toneMappingExposure),me.needsLights&&Gu(mt,ei),_e&&k.fog===!0&&Re.refreshFogUniforms(mt,_e),Re.refreshMaterialUniforms(mt,k,K,Y,b.state.transmissionRenderTarget[v.id]),me.needsLights&&me.lightProbeGrid){const ht=me.lightProbeGrid;mt.probesSH.value=ht.texture,mt.probesMin.value.copy(ht.boundingBox.min),mt.probesMax.value.copy(ht.boundingBox.max),mt.probesResolution.value.copy(ht.resolution)}Ki.upload(L,Pa(me),mt,$)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Ki.upload(L,Pa(me),mt,$),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ot.setValue(L,"center",z.center),ot.setValue(L,"modelViewMatrix",z.modelViewMatrix),ot.setValue(L,"normalMatrix",z.normalMatrix),ot.setValue(L,"modelMatrix",z.matrixWorld),k.uniformsGroups!==void 0){const ht=k.uniformsGroups;for(let Sn=0,ti=ht.length;Sn<ti;Sn++){const Fa=ht[Sn];ne.update(Fa,zt),ne.bind(Fa,zt)}}return zt}function Gu(v,F){v.ambientLightColor.needsUpdate=F,v.lightProbe.needsUpdate=F,v.sunLights.needsUpdate=F,v.sunLightShadows.needsUpdate=F,v.directionalLights.needsUpdate=F,v.directionalLightShadows.needsUpdate=F,v.pointLights.needsUpdate=F,v.pointLightShadows.needsUpdate=F,v.spotLights.needsUpdate=F,v.spotLightShadows.needsUpdate=F,v.rectAreaLights.needsUpdate=F,v.hemisphereLights.needsUpdate=F}function Vu(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(v,F,q){const k=V.get(v);k.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),V.get(v.texture).__webglTexture=F,V.get(v.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:q,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,F){const q=V.get(v);q.__webglFramebuffer=F,q.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(v,F=0,q=0){j=v,G=F,W=q;let k=null,z=!1,_e=!1;if(v){const de=V.get(v);if(de.__useDefaultFramebuffer!==void 0){p.bindFramebuffer(L.FRAMEBUFFER,de.__webglFramebuffer),ee.copy(v.viewport),Se.copy(v.scissor),ge=v.scissorTest,p.viewport(ee),p.scissor(Se),p.setScissorTest(ge),X=-1;return}else if(de.__webglFramebuffer===void 0)$.setupRenderTarget(v);else if(de.__hasExternalTextures)$.rebindTextures(v,V.get(v.texture).__webglTexture,V.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const We=v.depthTexture;if(de.__boundDepthTexture!==We){if(We!==null&&V.has(We)&&(v.width!==We.image.width||v.height!==We.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(v)}}const ye=v.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(_e=!0);const Ae=V.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Ae[F])?k=Ae[F][q]:k=Ae[F],z=!0):v.samples>0&&$.useMultisampledRTT(v)===!1?k=V.get(v).__webglMultisampledFramebuffer:Array.isArray(Ae)?k=Ae[q]:k=Ae,ee.copy(v.viewport),Se.copy(v.scissor),ge=v.scissorTest}else ee.copy(ue).multiplyScalar(K).floor(),Se.copy(ke).multiplyScalar(K).floor(),ge=xt;if(q!==0&&(k=N),p.bindFramebuffer(L.FRAMEBUFFER,k)&&p.drawBuffers(v,k),p.viewport(ee),p.scissor(Se),p.setScissorTest(ge),z){const de=V.get(v.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+F,de.__webglTexture,q)}else if(_e){const de=F;for(let ye=0;ye<v.textures.length;ye++){const Ae=V.get(v.textures[ye]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+ye,Ae.__webglTexture,q,de)}}else if(v!==null&&q!==0){const de=V.get(v.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,de.__webglTexture,q)}X=-1};function La(v){const F=V.get(v);return(F.__readFormat!==v.format||F.__readType!==v.type)&&(F.__readFormat=v.format,F.__readType=v.type,F.__formatReadable=R.textureFormatReadable(v.format),F.__typeReadable=R.textureTypeReadable(v.type)),F}this.readRenderTargetPixels=function(v,F,q,k,z,_e,ve,de=0){if(!(v&&v.isWebGLRenderTarget)){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=V.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ve!==void 0&&(ye=ye[ve]),ye){p.bindFramebuffer(L.FRAMEBUFFER,ye);try{const Ae=v.textures[de],We=Ae.format,qe=Ae.type;v.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+de);const be=La(Ae);if(be.__formatReadable===!1){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(be.__typeReadable===!1){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=v.width-k&&q>=0&&q<=v.height-z&&L.readPixels(F,q,k,z,ce.convert(We),ce.convert(qe),_e)}finally{const Ae=j!==null?V.get(j).__webglFramebuffer:null;p.bindFramebuffer(L.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(v,F,q,k,z,_e,ve,de=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=V.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ve!==void 0&&(ye=ye[ve]),ye)if(F>=0&&F<=v.width-k&&q>=0&&q<=v.height-z){p.bindFramebuffer(L.FRAMEBUFFER,ye);const Ae=v.textures[de],We=Ae.format,qe=Ae.type;v.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+de);const be=La(Ae);if(be.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(be.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const rt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,rt),L.bufferData(L.PIXEL_PACK_BUFFER,_e.byteLength,L.STREAM_READ),L.readPixels(F,q,k,z,ce.convert(We),ce.convert(qe),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);const St=j!==null?V.get(j).__webglFramebuffer:null;p.bindFramebuffer(L.FRAMEBUFFER,St);const dt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Na(L,dt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,rt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,_e),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(rt),L.deleteSync(dt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,F=null,q=0){const k=Math.pow(2,-q),z=Math.floor(v.image.width*k),_e=Math.floor(v.image.height*k),ve=F!==null?F.x:0,de=F!==null?F.y:0;$.setTexture2D(v,0),L.copyTexSubImage2D(L.TEXTURE_2D,q,0,0,ve,de,z,_e),p.unbindTexture()},this.copyTextureToTexture=function(v,F,q=null,k=null,z=0,_e=0){let ve,de,ye,Ae,We,qe,be,rt,St;const dt=v.isCompressedTexture?v.mipmaps[_e]:v.image;if(q!==null)ve=q.max.x-q.min.x,de=q.max.y-q.min.y,ye=q.isBox3?q.max.z-q.min.z:1,Ae=q.min.x,We=q.min.y,qe=q.isBox3?q.min.z:0;else{const mt=Math.pow(2,-z);ve=Math.floor(dt.width*mt),de=Math.floor(dt.height*mt),v.isDataArrayTexture?ye=dt.depth:v.isData3DTexture?ye=Math.floor(dt.depth*mt):ye=1,Ae=0,We=0,qe=0}k!==null?(be=k.x,rt=k.y,St=k.z):(be=0,rt=0,St=0);const lt=ce.convert(F.format),At=ce.convert(F.type);let me;F.isData3DTexture?($.setTexture3D(F,0),me=L.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?($.setTexture2DArray(F,0),me=L.TEXTURE_2D_ARRAY):($.setTexture2D(F,0),me=L.TEXTURE_2D),p.activeTexture(L.TEXTURE0),p.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,F.flipY),p.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),p.pixelStorei(L.UNPACK_ALIGNMENT,F.unpackAlignment);const Pt=p.getParameter(L.UNPACK_ROW_LENGTH),je=p.getParameter(L.UNPACK_IMAGE_HEIGHT),zt=p.getParameter(L.UNPACK_SKIP_PIXELS),rn=p.getParameter(L.UNPACK_SKIP_ROWS),gn=p.getParameter(L.UNPACK_SKIP_IMAGES);p.pixelStorei(L.UNPACK_ROW_LENGTH,dt.width),p.pixelStorei(L.UNPACK_IMAGE_HEIGHT,dt.height),p.pixelStorei(L.UNPACK_SKIP_PIXELS,Ae),p.pixelStorei(L.UNPACK_SKIP_ROWS,We),p.pixelStorei(L.UNPACK_SKIP_IMAGES,qe);const ei=v.isDataArrayTexture||v.isData3DTexture,ot=F.isDataArrayTexture||F.isData3DTexture;if(v.isDepthTexture){const mt=V.get(v),vn=V.get(F),ht=V.get(mt.__renderTarget),Sn=V.get(vn.__renderTarget);p.bindFramebuffer(L.READ_FRAMEBUFFER,ht.__webglFramebuffer),p.bindFramebuffer(L.DRAW_FRAMEBUFFER,Sn.__webglFramebuffer);for(let ti=0;ti<ye;ti++)ei&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,V.get(v).__webglTexture,z,qe+ti),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,V.get(F).__webglTexture,_e,St+ti)),L.blitFramebuffer(Ae,We,ve,de,be,rt,ve,de,L.DEPTH_BUFFER_BIT,L.NEAREST);p.bindFramebuffer(L.READ_FRAMEBUFFER,null),p.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(z!==0||v.isRenderTargetTexture||V.has(v)){const mt=V.get(v),vn=V.get(F);p.bindFramebuffer(L.READ_FRAMEBUFFER,P),p.bindFramebuffer(L.DRAW_FRAMEBUFFER,B);for(let ht=0;ht<ye;ht++)ei?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,mt.__webglTexture,z,qe+ht):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,mt.__webglTexture,z),ot?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,vn.__webglTexture,_e,St+ht):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,vn.__webglTexture,_e),z!==0?L.blitFramebuffer(Ae,We,ve,de,be,rt,ve,de,L.COLOR_BUFFER_BIT,L.NEAREST):ot?L.copyTexSubImage3D(me,_e,be,rt,St+ht,Ae,We,ve,de):L.copyTexSubImage2D(me,_e,be,rt,Ae,We,ve,de);p.bindFramebuffer(L.READ_FRAMEBUFFER,null),p.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else ot?v.isDataTexture||v.isData3DTexture?L.texSubImage3D(me,_e,be,rt,St,ve,de,ye,lt,At,dt.data):F.isCompressedArrayTexture?L.compressedTexSubImage3D(me,_e,be,rt,St,ve,de,ye,lt,dt.data):L.texSubImage3D(me,_e,be,rt,St,ve,de,ye,lt,At,dt):v.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,_e,be,rt,ve,de,lt,At,dt.data):v.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,_e,be,rt,dt.width,dt.height,lt,dt.data):L.texSubImage2D(L.TEXTURE_2D,_e,be,rt,ve,de,lt,At,dt);p.pixelStorei(L.UNPACK_ROW_LENGTH,Pt),p.pixelStorei(L.UNPACK_IMAGE_HEIGHT,je),p.pixelStorei(L.UNPACK_SKIP_PIXELS,zt),p.pixelStorei(L.UNPACK_SKIP_ROWS,rn),p.pixelStorei(L.UNPACK_SKIP_IMAGES,gn),_e===0&&F.generateMipmaps&&L.generateMipmap(me),p.unbindTexture()},this.initRenderTarget=function(v){V.get(v).__webglFramebuffer===void 0&&$.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?$.setTextureCube(v,0):v.isData3DTexture?$.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?$.setTexture2DArray(v,0):$.setTexture2D(v,0),p.unbindTexture()},this.resetState=function(){G=0,W=0,j=null,p.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}const ha=[{id:0,name:"black",rgb:[26,26,26],label:"黑色"},{id:1,name:"white",rgb:[242,242,242],label:"白色"},{id:2,name:"dark_gray",rgb:[47,47,47],label:"深灰色"},{id:3,name:"medium_gray_new",rgb:[85,85,85],label:"中灰色"},{id:4,name:"light_gray_new",rgb:[150,150,150],label:"浅灰色"},{id:5,name:"green",rgb:[63,77,24],label:"绿色"},{id:6,name:"orange",rgb:[255,160,62],label:"橙色"},{id:7,name:"brown",rgb:[175,140,89],label:"咖啡色"},{id:8,name:"green_dark",rgb:[4,130,130],label:"墨绿色"},{id:9,name:"blue_dark",rgb:[57,80,192],label:"深蓝色"},{id:10,name:"purple",rgb:[140,106,172],label:"紫色"},{id:11,name:"lime",rgb:[138,149,73],label:"浅绿色"},{id:12,name:"light_gray",rgb:[136,122,125],label:"浅灰色"},{id:13,name:"blue_gray",rgb:[138,57,26],label:"蓝灰色"},{id:14,name:"terra_cotta",rgb:[112,79,57],label:"赭石色"},{id:15,name:"olive_green",rgb:[168,200,72],label:"橄榄绿"},{id:16,name:"pink",rgb:[240,170,207],label:"粉红色"},{id:17,name:"wine_red",rgb:[128,49,52],label:"酒红色"},{id:18,name:"gold_orange",rgb:[233,175,52],label:"金橙色"},{id:19,name:"gray_brown",rgb:[128,125,114],label:"灰褐色"},{id:20,name:"sage_gray",rgb:[121,132,129],label:"鼠尾草灰"},{id:21,name:"brick_red",rgb:[159,114,85],label:"砖红色"},{id:22,name:"silver",rgb:[181,180,185],label:"银灰色"},{id:23,name:"beige",rgb:[235,220,201],label:"米色"},{id:24,name:"gray_green",rgb:[148,162,158],label:"青灰色"},{id:25,name:"tan",rgb:[210,169,151],label:"驼色"},{id:26,name:"khaki",rgb:[165,162,147],label:"卡其色"},{id:27,name:"dusty_rose",rgb:[203,243,251],label:"雾玫瑰色"},{id:28,name:"mauve_gray",rgb:[174,161,164],label:"淡紫灰"},{id:29,name:"medium_gray",rgb:[155,155,155],label:"中灰色"},{id:30,name:"red",rgb:[208,34,63],label:"红色"},{id:31,name:"yellow",rgb:[255,249,56],label:"黄色"},{id:32,name:"blue",rgb:[2,66,109],label:"蓝色"},{id:33,name:"custom",rgb:[26,26,26],label:"自定义"},{id:34,name:"coral",rgb:[255,127,80],label:"珊瑚色"},{id:35,name:"mint",rgb:[152,251,152],label:"薄荷绿"}],Nh=ha.map(i=>i.name);function Vr(i){return ha.find(e=>e.id===i)?.rgb??[26,26,26]}const ua=4294967296,Bh=1664525,Oh=1013904223,Zi=3.141592653589793,Ji=1.5707963267948966,kt=6.283185307179586;function Ct(i){let e=i-kt*Math.round(i/kt);e>Ji?e=Zi-e:e<-Ji&&(e=-Zi-e);const t=e*e;return e*(1+t*(-.16666666666666666+t*(.008333333333333333+t*(-.0001984126984126984+t*(27557319223985893e-22+t*(-2505210838544172e-23+t*16059043836821613e-26))))))}function Nt(i){return Ct(i+Ji)}function Qi(i,e){if(e===0&&i===0)return 0;const t=e<0?-e:e,n=i<0?-i:i,r=t<n?t/n:n/t,s=r*r;let a=((-.0464964749*s+.15931422)*s-.327622764)*s*r+r;return n>t&&(a=Ji-a),e<0&&(a=Zi-a),i<0&&(a=-a),a}class Jn{state=0;constructor(e=0){this.seed(e)}seed(e){this.state=e>>>0}next(){return this.state=(Bh*this.state+Oh)%ua,this.state/ua}random(e,t){const n=this.next();return e===void 0?n:t===void 0?n*e:e>t?n*(e-t)+t:n*(t-e)+e}}const da=4,ji=1<<da,_a=8,kh=1<<_a,tn=4095,zh=4,Gh=.5;function Hr(i){return .5*(1-Nt(i*Zi))}class er{perlin=new Float64Array(tn+1);constructor(e=0){this.seed(e)}seed(e){const t=new Jn(e);for(let n=0;n<=tn;n++)this.perlin[n]=t.next()}noise(e,t=0,n=0){const r=this.perlin;let s=e<0?-e:e,a=t<0?-t:t,o=n<0?-n:n,c=Math.floor(s),l=Math.floor(a),u=Math.floor(o);s-=c,a-=l,o-=u;let d=0,f=.5;for(let x=0;x<zh;x++){let g=c+(l<<da)+(u<<_a);const y=Hr(s),_=Hr(a);let h=r[g&tn]??0;h+=y*((r[g+1&tn]??0)-h);let T=r[g+ji&tn]??0;T+=y*((r[g+ji+1&tn]??0)-T),h+=_*(T-h),g+=kh,T=r[g&tn]??0,T+=y*((r[g+1&tn]??0)-T);let w=r[g+ji&tn]??0;w+=y*((r[g+ji+1&tn]??0)-w),T+=_*(w-T),h+=Hr(o)*(T-h),d+=h*f,f*=Gh,c<<=1,s*=2,l<<=1,a*=2,u<<=1,o*=2,s>=1&&(c++,s--),a>=1&&(l++,a--),o>=1&&(u++,o--)}return d}}function at(i,e,t,n,r){return(i-e)/(t-e)*(r-n)+n}function Yt(i,e,t){return i+(e-i)*t}function Wr(i){return Math.round(i*100)/100}function Vh(i){if(!(i>0))return 0;const e=i*i*i;let t=i<1?1-.6*(1-i):1+.6*(i-1);for(let n=0;n<40;n++){const r=t*t*t*t,s=t-(r*t-e)/(5*r);if(Math.abs(s-t)<1e-12)return s;t=s}return t}const Hh={brush:1,marker:2,gothic:3,pen:4,dots:5,fly:6,brushSP:7},Wh={"ultra-small":.1,"extra-small":.25,small:.5,medium:1,large:2,"extra-large":3,"extra-extra-large":5,huge:10},Xh={mix:0,sharpen:1,flyingWhite:2,wet:3,effect4:4,hair:5},qh={mix:0,multiply:1,darken:2,spectral:3},Yh=[{x:!1,y:!1},{x:!0,y:!1},{x:!1,y:!0},{x:!0,y:!0}],Kh=[{base:2,sx:1,sy:1,threshold:.05},{base:1,sx:-1,sy:-1,threshold:.1},{base:3,sx:-1,sy:-1,threshold:.12},{base:1,sx:1,sy:1,threshold:.08},{base:3,sx:1,sy:1,threshold:.2}],$h=kt/8,Zh=kt/12,Jh=[.065,.1,.125,.15,.1,.125,.15,.18].map((i,e)=>({angle:e*$h,radius:1.6,threshold:i,jitter:9+e})),Qh=[.07,.08,.1,.13,.16,.1,.13,.16,.19,.13,.16,.19].map((i,e)=>({angle:e*Zh,radius:1,threshold:i,jitter:17+e})),jh=[{perp:1.5,threshold:.7},{perp:-1.5,threshold:.75},{perp:3,threshold:.8},{perp:-3,threshold:.85},{perp:5,threshold:.9}],xi=[.1,.25,.5,1,2,3,5,10],Xr=-10;function vt(i,e,t){return i<e?e:i>t?t:i}function wn(i){return i<0?Math.ceil(i):Math.floor(i)}function eu(i){return typeof i=="number"?i:Wh[i]}class tu{rng=new Jn(0);perlin=new er(0);ops=[];brushMode=1;baseBrushSize=2;pressureBaseBrushSize=2;useSharpen=0;brushColorMode=0;customBrushColor=[26,26,26];whiteBrushMode=!1;keyBlendMode=0;useSpectralMix=!1;strokeSeed=1234567890;strokeFrame=0;mouseCountStart=0;inkGray=0;initialSize=0;spraySize=6;randStep=.05;maxUpdates=30;interpSteps=15;step2=5;spring=.6;friction=.5;expectedStrokeLength=400;brushSize=0;brushSizeMin=2;sizeNow=20;strokeWidth=0;lineWidth=0;smoothedWidth=0;velX=0;velY=0;speed=0;x=0;y=0;springInitialized=!1;prevTipX=0;prevTipY=0;isDrawing=!1;isReleasing=!1;countdownFrame=0;whiteMaxOpacity=.95;hueShift=0;satShift=0;briShift=0;explodeStart=0;explodeEnd=0;targetmainStrokeDir=0;brushDir=0;indiffusionStrength=.45;effect3Brightness=.2;shapeType=0;ctlNoiseByFrame=1;interpolationOffset=0;pathRotation=0;penSketchNoiseBase=.5;brushModeSP=!1;penPressure=0;stylusDetected=!1;pressureHistory=[0,0,0];strokeStartBaseBrushSize=2;markerAxis={x:1,y:0};markerMove={x:1,y:0};flyMove={x:1,y:0};flyConfigs=new Map;flyWeights=new Map;sprayParticles=[];sprayParticleCounter=0;configure(e){this.brushMode=Hh[e.mode],this.baseBrushSize=eu(e.size),this.pressureBaseBrushSize=this.baseBrushSize,this.useSharpen=Xh[e.effect],e.blend==="spectral"?this.useSpectralMix=!0:(this.keyBlendMode=qh[e.blend],this.useSpectralMix=!1)}setColor(e){if(typeof e=="string"){this.whiteBrushMode=e==="white";const t=Nh.indexOf(e);this.brushColorMode=t<0?0:t;const n=Vr(this.brushColorMode);this.customBrushColor[0]=n[0],this.customBrushColor[1]=n[1],this.customBrushColor[2]=n[2];return}this.customBrushColor[0]=e[0],this.customBrushColor[1]=e[1],this.customBrushColor[2]=e[2],this.brushColorMode=33,this.whiteBrushMode=!1}get mode(){return this.brushMode}get effect(){return this.useSharpen}get pendingCommit(){return this.isDrawing||this.isReleasing}shaderState(){return{brushMode:this.brushMode,baseBrushSize:this.baseBrushSize,useSharpen:this.useSharpen,effect3Brightness:this.effect3Brightness,indiffusionStrength:this.indiffusionStrength,brushColorMode:this.brushColorMode,brushCategory:this.brushColorMode===1?1:0,mouseCount:(this.strokeFrame+this.mouseCountStart)%40,mouseCountAccumulated:this.strokeFrame+this.mouseCountStart,strokeSeed:this.strokeSeed,whiteMaxOpacity:this.whiteMaxOpacity,hueShift:this.hueShift,satShift:this.satShift,briShift:this.briShift,keyBlendMode:this.keyBlendMode,useSpectralMix:this.useSpectralMix?1:0,customBrushColor:[this.customBrushColor[0],this.customBrushColor[1],this.customBrushColor[2]]}}applyPressure(e){e!==void 0&&(this.stylusDetected=!0,this.penPressure=this.pressureMedian3(e))}press(e,t,n){const r=this.rng;this.pressureHistory[0]=this.pressureHistory[1]=this.pressureHistory[2]=0,r.seed(n),this.strokeSeed=wn(r.random(1e8,999999999)),r.seed(this.strokeSeed),this.perlin.seed(this.strokeSeed),this.mouseCountStart=this.strokeFrame,this.inkGray=0,this.strokeFrame=0,this.pressureBaseBrushSize!==null&&(this.baseBrushSize=this.pressureBaseBrushSize),this.sprayParticles=[],this.sprayParticleCounter=0,this.whiteMaxOpacity=r.random(.5,.99),this.hueShift=r.random(-.02,.02),this.satShift=r.random(-.05,.05),this.briShift=r.random(-.05,.05),this.explodeStart=r.random(0,1)>.8?1:0,this.explodeEnd=r.random(0,1)>.8?1:0,r.random(-1,3),this.targetmainStrokeDir=Math.max(0,wn(r.random(-1,3))),this.brushDir=wn(r.random(0,4)),r.random(.4,.5),this.brushMode===3||this.brushMode===4?r.random(.2,.3):this.brushMode===5&&r.random(.25,.35),this.indiffusionStrength=.45,this.baseBrushSize<=1.5&&(this.explodeStart=this.explodeEnd=0),this.effect3Brightness=r.random(.5,.9),wn(r.random(0,4)),this.shapeType=wn(r.random(0,4)),this.ctlNoiseByFrame=Math.max(this.perlin.noise(0),0,1,.2,.8),this.interpolationOffset=wn(r.random(-2,4)),r.random(0,1),this.pathRotation=0;const s=this.baseBrushSize;switch(this.brushMode){case 1:this.initialSize=Wr(r.random(20,24)*s),this.spraySize=s>5?1.5*s:3*s,this.randStep=.05,this.maxUpdates=30,this.interpSteps=15,this.step2=5,this.spring=.6,this.friction=.5;break;case 2:this.initialSize=Wr(r.random(20,24)*s),this.spraySize=s,this.randStep=.05,this.maxUpdates=10,this.interpSteps=10,this.step2=10,this.spring=.3,this.friction=.5;break;case 3:this.initialSize=r.random(2,4)*s,this.spraySize=10*s,this.step2=3,this.randStep=.05,this.maxUpdates=10;break;case 4:this.initialSize=r.random(6,9)*s,this.spraySize=s,this.step2=5,this.randStep=.05,this.maxUpdates=10,this.penSketchNoiseBase=this.perlin.noise(e,t),r.random(0,1),this.spring=.6,this.friction=.5;break;case 5:case 6:this.initialSize=r.random(10,14)*s,this.spraySize=10,this.step2=1,this.randStep=.05,this.maxUpdates=10,this.interpSteps=10,this.spring=.6,this.friction=.5;break;default:this.initialSize=r.random(30,40),this.maxUpdates=10,this.randStep=.05;break}this.useSharpen>=3.5&&(this.maxUpdates=20),this.expectedStrokeLength=400,this.brushSize=this.initialSize,this.sizeNow=this.brushSize,this.strokeWidth=this.sizeNow,this.strokeStartBaseBrushSize=this.baseBrushSize,this.pressureBaseBrushSize===null&&(this.pressureBaseBrushSize=this.baseBrushSize),this.springInitialized=!1,this.x=e,this.y=t,this.velX=0,this.velY=0,this.speed=0,this.lineWidth=0,this.smoothedWidth=0,this.markerAxis={x:1,y:0},this.markerMove={x:1,y:0},this.flyConfigs=new Map,this.flyWeights=new Map,this.flyMove={x:1,y:0},this.prevTipX=e,this.prevTipY=t,this.isDrawing=!0,this.isReleasing=!1,this.countdownFrame=0;const a=wn(r.random(1e6,9999999));this.brushModeSP=this.brushMode===7,r.seed(a),this.perlin.seed(a)}release(){this.isDrawing&&(this.sprayParticles.length&&(this.sprayParticles=this.sprayParticles.filter(e=>e.radius>0)),this.isReleasing||(this.isReleasing=!0,this.countdownFrame=0),this.stylusDetected&&(this.penPressure=0))}committed(){this.isDrawing=!1,this.isReleasing=!1,this.countdownFrame=0}frame(e,t,n,r,s){this.ops=[];const a=this.brushMode,c=a===3||a===4||a===5?e:e&&this.brushSize>0;c&&this.isDrawing&&this.drawFrame(t,n,r,s);let l,u=!1;return c&&this.isDrawing?l=a===4?.4:1:this.isReleasing&&this.countdownFrame<this.maxUpdates?(l=at(this.countdownFrame,0,this.maxUpdates,1,0),a===4&&(l*=.4),this.countdownFrame++):this.isReleasing&&(u=!0),{ops:this.ops,force:l,commit:u}}drawFrame(e,t,n,r){const s=this.rng,a=this.brushMode;if(this.strokeFrame++,s.seed(this.strokeSeed+this.strokeFrame*1e8),a===3){const d=s.random(0,1),f=s.random(150,250),x=d>.1?this.perlin.noise(e*.01,t*.01)*150:f;this.inkGray=this.inkGray*.3+x*.7}else{const d=s.random(0,1),f=s.random(20,50),x=d>.3?this.perlin.noise(e*.01,t*.01)*10:f;this.inkGray=this.inkGray*.6+x*.4}this.brushSize=Math.max(1,this.brushSize-this.randStep),this.sizeNow=this.brushSize,this.strokeFrame>=8&&this.pressureLadder(),this.brushSize<=this.brushSizeMin&&!this.isReleasing&&a!==3&&a!==4&&a!==5&&(this.isReleasing=!0,this.countdownFrame=0);let o=e,c=t;const l=at(this.perlin.noise(o*.01,c*.01),0,1,-this.pathRotation,this.pathRotation);if(a!==3){s.seed(this.strokeSeed+this.strokeFrame*1e7);const d=s.random(this.pathRotation*.5,this.pathRotation),f=s.random(this.pathRotation*.5,this.pathRotation);o+=d*Nt(l)+Xr,c+=f*Ct(l)+Xr}Math.hypot(o-this.prevTipX,c-this.prevTipY)>1&&this.strokeFrame<this.expectedStrokeLength&&(a===4&&this.drawDryBrush(o,c,this.prevTipX,this.prevTipY),(a===1||a===7)&&(s.random(0,1)>.9&&!this.whiteBrushMode&&!this.brushModeSP&&this.baseBrushSize>=1.5&&this.strokeFrame>5&&this.baseBrushSize<6&&this.drawSprayDots(o,c,n,r),this.drawBrushStroke(o,c,this.targetmainStrokeDir)),a===2&&(s.random(0,1),this.drawMarker(o,c)),a===3&&(this.drawGothic(o,c,this.prevTipX,this.prevTipY),s.random(0,1)>.4&&this.drawSprayDots(o,c,n,r)),a===5&&s.random(0,1)>.05&&this.drawSprayDots(o,c,n,r),a===6&&this.drawFlyBrush(o,c)),this.prevTipX=o,this.prevTipY=c}pressureLadder(){const e=this.penPressure,t=this.baseBrushSize;if(e>=.3){const n=this.pressureBaseBrushSize||this.strokeStartBaseBrushSize||1;let r=xi.indexOf(n);r===-1&&(r=xi.findIndex(a=>a>=n),r===-1&&(r=xi.length-1));const s=e<.5?1:e<.7?2:3;this.baseBrushSize=xi[Math.min(r+s,xi.length-1)]??n}else e>=0&&(this.baseBrushSize=this.pressureBaseBrushSize||this.strokeStartBaseBrushSize||this.baseBrushSize);if(this.baseBrushSize!==t&&t>0){const n=Vh(this.baseBrushSize/t);this.brushSize*=n,this.initialSize*=n}}pressureMedian3(e){const t=this.pressureHistory;return t[0]=t[1],t[1]=t[2],t[2]=e,Math.max(Math.min(t[0],t[1]),Math.min(Math.max(t[0],t[1]),t[2]))}effBaseSize(){return this.pressureBaseBrushSize??this.baseBrushSize}inkJitter(e){return this.brushColorMode===0?e+this.rng.random(10,40):e+this.rng.random(30,80)}inkGrayOf(e,t){return this.brushColorMode===0?e:this.brushColorMode===1?150:t}line(e,t,n,r,s,a,o){const c=vt(a,0,255);this.ops.push({kind:"line",x0:e,y0:t,x1:n,y1:r,w:s,h:0,lw:0,r:c,g:c,b:c,a:vt(o,0,255)})}lineRgb(e,t,n,r,s,a,o,c,l){this.ops.push({kind:"line",x0:e,y0:t,x1:n,y1:r,w:s,h:0,lw:0,r:vt(a,0,255),g:vt(o,0,255),b:vt(c,0,255),a:vt(l,0,255)})}dot(e,t,n,r,s){const a=vt(r,0,255);this.ops.push({kind:"dot",x0:e,y0:t,x1:0,y1:0,w:n,h:0,lw:0,r:a,g:a,b:a,a:vt(s,0,255)})}drawBranch(e,t,n,r,s,a,o,c,l,u,d,f,x){const g=this.rng,y=this.effBaseSize(),_=y<.25;let h=l*u+d;const T=_?Math.max(2,y*10):15;h>T&&(h=g.random(_?.6:1,T));let w=Math.max(_?.6:1,h);if(w<3&&(w*=2),this.brushModeSP){const S=Math.max(.15,Math.min(1.5,y)),b=g.random(0,1)>.8,A=g.random(0,1)>.05?g.random(-6*S,6*S):g.random(-16*S,16*S),m=g.random(0,1)>.05?g.random(-6*S,6*S):g.random(-16*S,16*S);b?this.line(n+e+o,r+t+c,s+e+A,a+t+m,g.random(.5,1.5),f,x):(w=Math.min(1,w),w<4&&this.line(n+e+o,r+t+c,s+e,a+t,w+.5,f,x));return}const M=y<4?w:g.random(w*.5,w);this.line(n+e+o,r+t+c,s+e,a+t,M,f,x)}drawSprayDots(e,t,n,r){if(this.strokeFrame>=this.expectedStrokeLength)return;const s=this.rng,a=this.perlin,o=this.inkJitter(this.inkGray),c=this.inkJitter(this.inkGray),l=.5*this.initialSize*a.noise(e*.01,t*.01)*(Math.abs(e-n)+Math.abs(t-r)),u=this.effBaseSize(),d=Math.min(this.spraySize*u,l)*at(a.noise(e,t),0,1,.3,1);let f=Math.max(3,d);this.strokeFrame<5?f=Math.max(2,d*at(this.strokeFrame,0,5,-.2,1)):this.strokeFrame>=this.expectedStrokeLength-5&&(f=Math.max(2,d*at(this.strokeFrame,this.expectedStrokeLength-5,this.expectedStrokeLength,1,-.2)));const x=this.inkGrayOf(o,c);for(let g=0;g<this.step2;g++){const y=Yt(e,n,g/this.step2),_=Yt(t,r,g/this.step2);for(let h=0;h<10;h++){const T=s.random(0,1)>.1?1:1.5,w=s.random(kt),M=s.random(),S=s.random(-f*T,f*T),b=s.random(-f*T,f*T);let A,m;if(this.shapeType===0){const W=Math.sqrt(M)*f;A=W*Nt(w),m=W*Ct(w)}else if(this.shapeType===1)A=Ct(w)*S,m=Nt(w)*b;else if(this.shapeType===2){const W=w/kt,j=M;W+j>1?(A=f*(1-W),m=f*(1-j)):(A=f*W,m=f*j),A-=f*.5,m-=f*.5}else{const W=S/f,j=b/f,X=Math.abs(W)+Math.abs(j);X>1?(A=W/X*f,m=j/X*f):(A=W*f,m=j*f)}const E=s.random(0,1);let C=s.random(.2,1),D=s.random(1,2);const I=u<.25?.1:.3;C=Math.max(I,C*u),D=Math.max(I,D*u);const N=s.random(100,255);let P=E>.1?C:D;(this.brushMode===3||this.brushMode===5)&&(P*=2);const B=u<.25?Math.max(.3,u*3):2,G=u<.25?u*5:20;P=Math.max(B,Math.min(G,P)),this.dot(y+A,_+m,P,x,N)}}}drawBrushStroke(e,t,n){if(this.strokeFrame>=this.expectedStrokeLength)return;const r=this.rng,s=this.perlin,a=this.inkJitter(this.inkGray),o=this.inkJitter(this.inkGray),c=this.effBaseSize(),l=this.baseBrushSize,u=this.penPressure>=0?.7+.4*Math.min(this.penPressure/.7,1):1,d=c<.25,f=d?r.random(.4,.8):r.random(l*.8,l*2),x=Math.max(.6,l*2);let g=d?x:Math.max(.6,l*1.5);g<3&&(g*=2);let y=d?x:Math.max(.6,l*1.2);y<3&&(y*=2);const _=d?Math.max(2,c*10):c<.5?.7:9999;this.lineWidth=this.strokeWidth*.5,this.springInitialized||(this.springInitialized=!0,this.x=e,this.y=t),this.velX=(this.velX+(e-this.x)*this.spring)*this.friction,this.velY=(this.velY+(t-this.y)*this.spring)*this.friction,this.speed=Math.sqrt(this.velX*this.velX+this.velY*this.velY),this.speed*=l<=1?.9:l<=2?1.3:l<=3?2:3,this.strokeWidth=this.sizeNow-this.speed;const h=this.ctlNoiseByFrame,T=l*h*u,w=2*l*h*u,M=3*l*h*u;let S=.1;const b=this.initialSize;let A=0,m=0;n===0?S=.08:n===1?S=.6:n===2&&(S=.2);const E=this.interpSteps+this.interpolationOffset,C=Yh[this.brushDir]??{x:!1,y:!1};for(let D=0;D<E;++D){let I=0;l<1.5?I=r.random(0,1)>.4?0:r.random(0,1)>.4?1:2:l>1.5&&l<6?I=r.random(0,1)>.4?2:r.random(0,1)>.6?3:4:l>6&&(I=r.random(0,1)>.3?3:4),this.brushModeSP&&(I=r.random(0,1)>.3?3:r.random(0,1)>.5?2:4),this.strokeFrame<5&&(I=r.random(0,1)>.2?5:I);const N=this.x,P=this.y;this.x+=this.velX/E,this.y+=this.velY/E;const B=this.x,G=this.y,W=r.random(0,1),j=r.random(0,4),X=r.random(0,3),Z=r.random(-1,1),ee=r.random(-1,1),Se=r.random(-1,1),ge=r.random(-1,1);let Xe=S,Fe=1;I===3?(Xe*=.8,Fe*=.8):I===4&&(Xe*=.6,Fe*=.5),c<.25?Xe=.18:c<1.5&&(Xe=.1),this.smoothedWidth=Yt(this.smoothedWidth,this.strokeWidth,.5),this.brushMode===1?W>.8&&this.lineWidth<2&&D===0&&(this.lineWidth=Wr(j)):this.lineWidth+=(this.smoothedWidth-this.lineWidth)*.3;let Ge;if(this.brushMode===1)Ge=this.lineWidth;else if(this.strokeFrame<5)Ge=Math.max(d?.1:.5,this.lineWidth*at(this.strokeFrame,0,5,.05,1)),this.explodeStart&&(A=Z*at(this.strokeFrame,0,5,10,0),m=ee*at(this.strokeFrame,0,5,10,0));else if(this.strokeFrame>=this.expectedStrokeLength-5){const Me=this.expectedStrokeLength;Ge=Math.max(d?.1:.5,this.lineWidth*at(this.strokeFrame,Me-5,Me,1,.05)),this.explodeEnd&&(A=Se*at(this.strokeFrame,Me-5,Me,0,10),m=ge*at(this.strokeFrame,Me-5,Me,0,10))}else this.lineWidth>2?Ge=Math.max(d?.2:1,this.lineWidth):Ge=Math.max(d?.1:.5,this.lineWidth+(X/3-.5));let Y=Ge,K=Ge*.5;I===3?(Y*=.8,K*=.8):I===4&&(Y*=.5,K*=.5);const pe=r.random(0,1),De=r.random(150,255),ue=r.random(100,255),ke=r.random(100,255),xt=r.random(100,255),Ie=this.inkGrayOf(a,o);if(d){if(!this.brushModeSP&&this.strokeFrame>1){const Me=Math.min(b,Math.max(g,Y));this.line(B+A,G+m,N,P,Math.min(_,Me),Ie,De)}}else if(pe>Xe){const Me=!this.brushModeSP&&this.strokeFrame>3&&l<4;if(Y<5){const Ce=n===0?1.5*Math.min(b,Math.max(g,Y)):Math.min(b,Math.max(g,Y));Me&&this.line(B+A,G+m,N,P,Math.min(_,Ce),Ie,De)}else{let Ce=Fe*Math.min(b,Math.max(g,Y));Ce>15&&(Ce=r.random(1.5,Ce)),Me&&this.line(B+A,G+m,N,P,Math.min(_,Ce),Ie,De)}}const Ue=[],tt=[];for(let Me=0;Me<30;Me++)Ue.push(r.random(0,1)),tt.push(r.random(-.5,.5));n===1?(Ue[0]=(Ue[0]??0)*2,Ue[1]=(Ue[1]??0)*.5,Ue[2]=(Ue[2]??0)*.5):n===2&&(Ue[0]=(Ue[0]??0)*.5,Ue[1]=(Ue[1]??0)*.5,Ue[2]=(Ue[2]??0)*.5);const Ne=Me=>Ue[Me]??0,Ye=Me=>tt[Me]??0;if(I===0){if(Ne(0)>.2){const Me=C.x?-1:1,Ce=C.y?-1:1;let Te=at(s.noise(B*.1,G*.1),0,1,.8,1.2);Te=Math.max(1+Ye(0),Te);const ze=K*Te<5?Math.min(_,s.noise(B*.1,G*.2)+1.5*Math.max(y,K*Te)):Math.min(_,Fe*Math.max(f,K*Te));this.line(B+Me*w+A,G+Ce*w+m,N+Me*w,P+Ce*w,ze,Ie,ue)}if(Ne(1)>.3){const Me=C.x?-1:1,Ce=C.y?1:-1;let Te=at(s.noise(B*.3+300,G*.3+300),0,1,.6,1.5);Te=Math.max(1+Ye(1),Te);const ze=Math.min(_,Fe*Math.max(f,K*Te));this.line(B+Me*w+A,G+Ce*w+m,N+Me*w,P+Ce*w,ze,Ie,ke)}}else if(I===1){if(Ne(0)>.1){const Me=C.x?-1:1,Ce=C.y?-1:1;let Te=at(s.noise(B*.3+200,G*.1+100),0,1,.8,1.2);Te=Math.max(1+Ye(0),Te);const ze=Math.min(_,Fe*Math.max(f,K*Te));this.line(B+Me*w+A,G+Ce*w+m,N+Me*w,P+Ce*w,ze,Ie,ue)}if(Ne(1)>.05){const Me=C.x?-1:1,Ce=C.y?1:-1;let Te=at(s.noise(B*.2+300,G*.2+200),0,1,.8,1.2);Te=Math.max(1+Ye(1),Te);const ze=Math.min(_,Fe*Math.max(f,K*Te));this.line(B+Me*T+A,G+Ce*T+m,N+Me*T,P+Ce*T,ze,Ie,ke)}if(Ne(2)>.15){let Me=at(s.noise(B*.1+400,G*.3+300),0,1,.8,1.2);Me=Math.max(1+Ye(2),Me);const Ce=K*Me<5?Math.min(_,s.noise(B*1,G*2)+1.5*Math.max(y,K*Me)):Math.min(_,Fe*Math.max(f,K*Me));this.line(B-M+A,G-M+m,N-M,P-M,Ce,Ie,xt)}}else if(I===2){const Me=at(s.noise(B*.1+400,G*.1+200),0,1,.8,1.2);Kh.forEach((Ce,Te)=>{if(Ne(Te)<=Ce.threshold)return;const ze=Ce.base===1?T:Ce.base===2?w:M,L=Te===0&&C.x?-Ce.sx:Ce.sx,ct=Te===0&&C.y?-Ce.sy:Ce.sy;this.drawBranch(L*ze,ct*ze,B,G,N,P,A,m,K,Me,Ye(3+Te),Ie,ue)})}else if(I===3){const Me=at(s.noise(B*.1+400,G*.1+200),0,1,.85,1.15);let Ce=l*h;l>4&&(Ce*=r.random(.5,2.5)),Jh.forEach((Te,ze)=>{const L=l>4?r.random(0,6.28):0;if(Ne(ze)<=Te.threshold)return;const ct=Nt(Te.angle+L)*Te.radius*Ce,Qe=Ct(Te.angle+L)*Te.radius*Ce;this.drawBranch((C.x?-1:1)*ct,(C.y?-1:1)*Qe,B,G,N,P,A,m,K,Me,Ye(Te.jitter),Ie,ue)})}else if(I===4){const Me=at(s.noise(B*.1+400,G*.1+200),0,1,.9,1.1),Ce=this.brushColorMode;let Te=l*h;l>4&&(Te*=r.random(.5,2.5)),Qh.forEach((ze,L)=>{const ct=l>4?r.random(0,6.28):0;if(Ne(L)<=ze.threshold)return;const Qe=Nt(ze.angle+ct)*ze.radius*Te,R=Ct(ze.angle+ct)*ze.radius*Te;this.drawBranch((C.x?-1:1)*Qe,(C.y?-1:1)*R,B,G,N,P,A,m,K,Me,Ye(ze.jitter),Ce,255)})}}}drawDryBrush(e,t,n,r){const s=this.rng,a=this.effBaseSize(),o=this.baseBrushSize,c=Math.max(a<.25?.3:1,this.initialSize-this.strokeFrame*this.randStep),l=Math.min(o*2,5*c*this.penSketchNoiseBase*at(Ct(this.strokeFrame*2),0,1,.5,1.5)),u=Math.abs(e-n)>.1||Math.abs(t-r)>.1,d=this.inkJitter(this.inkGray),f=this.inkJitter(this.inkGray),x=[];for(let y=0;y<80;y++)x.push({t:s.random(0,1),weight:Math.max(a<.25?.1:.3,Math.min(a<.25?o*5:2,o*s.random(-.5,1))),angle:s.random(0,kt),radius:Math.sqrt(s.random(0,1))*l,alpha:s.random(150,255)});if(this.strokeFrame<=3)return;const g=this.inkGrayOf(d,f);for(const y of x){const _=y.radius*Nt(y.angle),h=y.radius*Ct(y.angle),T=u?Yt(e,n,y.t)+_:e+_,w=u?Yt(t,r,y.t)+h:t+h;this.dot(T,w,y.weight,g,y.alpha)}}drawMarker(e,t){if(this.strokeFrame>=this.expectedStrokeLength)return;const n=this.rng,r=this.perlin,s=this.effBaseSize(),a=s<.25,o=a?s*5:9999,c=this.inkJitter(this.inkGray),l=this.inkJitter(this.inkGray),u=this.initialSize*.3;this.springInitialized||(this.springInitialized=!0,this.x=e,this.y=t),this.velX=(this.velX+(e-this.x)*this.spring)*this.friction,this.velY=(this.velY+(t-this.y)*this.spring)*this.friction,this.speed=Math.sqrt(this.velX*this.velX+this.velY*this.velY)*1.2;const d=this.baseBrushSize;this.speed*=d<=1?.9:d<=2?1.3:1.5,this.strokeWidth=this.sizeNow-this.speed;const f=this.smoothedWidth,x=this.strokeWidth,g=Math.hypot(e-this.x,t-this.y),y=Math.max(a?.1:.5,x*.5),_=1.5*Math.min(u,Math.max(a?.5:4,y)),h=Math.max(_*.6*.8,.5);let T=Math.max(1,Math.ceil(g/h));T=Math.max(10,Math.min(50,T));const w=T/this.interpSteps,M=Math.min(1,g/10),S=n.random(50,100),b=[];for(let E=0;E<this.interpSteps;++E){for(let P=0;P<4;P++)n.random(-1,1);const C=n.random(0,1),D=n.random(80,200),I=n.random(.8,1.2),N=[n.random(0,1),n.random(0,1),n.random(0,1),n.random(0,1),n.random(0,1)];b.push({show:C,alpha:D,widthMult:I,fly:N})}const A=this.inkGrayOf(c,l);let m=1;for(let E=0;E<this.interpSteps;++E){const C=b[E];if(!C)continue;const D=this.x,I=this.y;this.x+=this.velX/this.interpSteps,this.y+=this.velY/this.interpSteps;const N=this.x,P=this.y,B=(E+1)/this.interpSteps;this.smoothedWidth=Yt(this.smoothedWidth,Yt(f,x,B),.5),this.lineWidth+=(this.smoothedWidth-this.lineWidth)*.8,this.lineWidth=Math.max(a?.2:1.5,this.lineWidth);let G;const W=this.expectedStrokeLength;this.strokeFrame<5?G=Math.max(a?.1:.5,this.lineWidth*at(this.strokeFrame,0,5,.05,1)):this.strokeFrame>=W-5?G=Math.max(a?.1:.5,this.lineWidth*at(this.strokeFrame,W-5,W,1,.05)):G=Math.max(a?.1:.5,this.lineWidth);let j=.3;if(w>1?j=.3/w:w<1&&(j=.3*(2-w)),C.show>j&&this.strokeFrame>5){const X=Math.min(o,1.2*Math.min(u,Math.max(3*s,G))),Z=N-D,ee=P-I,Se=Math.sqrt(Z*Z+ee*ee);Se>=.1&&(this.markerMove={x:Z/Se,y:ee/Se},this.markerAxis={x:-ee/Se,y:Z/Se});const ge=X*C.widthMult,Xe=ge*(.5+r.noise(N*.1,P*.1)*.5),Fe=vt(A,0,255);this.ops.push({kind:"rect",x0:N,y0:P,x1:this.markerAxis.x,y1:this.markerAxis.y,w:ge,h:Xe,lw:m,r:Fe,g:Fe,b:Fe,a:vt(C.alpha,0,255)})}if(M>.9&&this.strokeFrame>5&&this.strokeFrame<W-5){const X=-this.markerMove.y,Z=this.markerMove.x;jh.forEach((ee,Se)=>{if((C.fly[Se]??0)<=ee.threshold-M*.3)return;const ge=X*ee.perp*s,Xe=Z*ee.perp*s;m=Math.min(o,Math.max(a?.1:.5,G*.3)),this.line(D+ge,I+Xe,N+ge,P+Xe,m,S,255)})}}}buildFlyBranchConfig(e){const t=this.rng;let n,r;e<=.1?(n=2,r=4):e<=.25?(n=4,r=7):e<=.5?(n=6,r=10):e<=2?(n=10,r=15):e<=3?(n=20,r=30):(n=30,r=50),t.seed(this.strokeSeed+5e4);const s=Math.floor(t.random(n,r+1)),a=this.strokeSeed+6e4,o=(l,u,d)=>(t.seed(a+l),t.random(u,d)),c=[];for(let l=0;l<s;l++){const u=o(l*1e3,-6,6),d=o(l*2e3+1,.5,1),f=o(l*3e3+2,1,2),x=o(l*4e3+3,.7,1.3);o(l*5e3+4,.8,1.2);const g=Math.floor(o(l*6e3+5,0,6)),y=o(l*7e3+6,0,8),_=o(l*8e3+7,1,2),h=o(l*9e3+8,0,1),T=o(l*1e4+9,0,1);c.push({perpOffset:u,randThreshold:d,sizeMultiplier:f,speedMultiplier:x,startOffset:g,endDistanceOffset:y,brushSpeedMultiplier:_,widthVariationFactor:h,offsetVariationFactor:T})}return c.sort((l,u)=>l.perpOffset-u.perpOffset)}drawGothic(e,t,n,r){if(this.strokeFrame>=this.expectedStrokeLength)return;const s=this.rng,a=this.perlin,o=e-n,c=t-r,l=Math.sqrt(o*o+c*c),u=at(vt(l,3,50),0,50,.1,5);let d=0,f=1,x=0,g=-1;if(l>.1){const M=o/l,S=c/l;d=-S,f=M,x=S,g=-M}const y=at(vt(u,.1,5),.1,5,20,1);s.seed(this.strokeSeed+this.strokeFrame*1e4+1);const _=Math.floor(s.random(0,y)),h=this.baseBrushSize;for(let M=0;M<_;M++){s.seed(this.strokeSeed+this.strokeFrame*1e3+this.sprayParticleCounter);const S=s.random(5,15)*h,b=e+s.random(-2,2)*h,A=t+s.random(-2,2)*h,m=s.random(0,1)>.5?1:-1;let E,C,D;this.brushColorMode===0?E=C=D=this.inkGray*.3:this.brushColorMode===1?E=C=D=150:this.brushColorMode===33?[E,C,D]=this.customBrushColor:[E,C,D]=Vr(this.brushColorMode),this.sprayParticles.push({id:this.sprayParticleCounter++,location:{x:b,y:A},prevLocation:{x:b,y:A},radius:S,r:E,g:C,b:D,xOff:0,yOff:0,sideDirection:m})}const T=at(vt(h||1,.1,4),.1,4,.01,.1),w=at(vt(h||1,.1,4),.1,4,.1,.5);for(let M=this.sprayParticles.length-1;M>=0;M--){const S=this.sprayParticles[M];if(!S||S.radius<=0)continue;s.seed(this.strokeSeed+this.strokeFrame*1e3+S.id*100),S.radius-=s.random(T,w)*3,S.xOff+=s.random(-.5,.5)*u,S.yOff+=s.random(-.5,.5)*u;const b=2*u;s.random(0,1);const A=S.sideDirection,m=(A===1?x:d)*b,E=(A===1?g:f)*b,C=a.noise(S.location.x)*S.xOff,D=a.noise(S.location.y)*S.yOff;if(S.prevLocation.x=S.location.x,S.prevLocation.y=S.location.y,S.location.x+=2*(m*.2+C*.8),S.location.y+=2*(E*.2+D*.8),this.brushColorMode>=2){const P=a.noise(S.location.x*.01,S.location.y*.01)*5;S.r=vt(S.r+P,0,255),S.g=vt(S.g+P,0,255),S.b=vt(S.b+P,0,255)}else if(this.brushColorMode===0){const P=a.noise(S.location.x*.01,S.location.y*.01)*2;S.r=vt(S.r+P,0,200),S.g=vt(S.g+P,0,200),S.b=vt(S.b+P,0,200)}const I=s.random(0,1)>.2,N=s.random(0,1)>.99;S.radius>0?(I&&this.lineRgb(S.prevLocation.x,S.prevLocation.y,S.location.x,S.location.y,Math.max(1,S.radius*.5),S.r,S.g,S.b,200),N&&(S.radius=-1)):S.radius=-1}this.sprayParticles=this.sprayParticles.filter(M=>M.radius>0)}drawFlyBrush(e,t){if(this.strokeFrame>=this.expectedStrokeLength)return;const n=this.rng,r=this.perlin,s=this.inkJitter(this.inkGray),a=this.effBaseSize();this.springInitialized||(this.springInitialized=!0,this.x=e,this.y=t),this.velX=(this.velX+(e-this.x)*this.spring)*this.friction,this.velY=(this.velY+(t-this.y)*this.spring)*this.friction,this.speed=Math.sqrt(this.velX*this.velX+this.velY*this.velY)*.7,this.strokeWidth=this.sizeNow-this.speed;const o=this.smoothedWidth,c=this.strokeWidth,l=a<.25,u=a<1;n.random(30,70);const d=`${a}_${this.strokeSeed}`;let f=this.flyConfigs.get(d);f||(f=this.buildFlyBranchConfig(a),this.flyConfigs.set(d,f));const x=[];for(let y=0;y<this.interpSteps;++y){const _=[],h=[],T=[];for(let M=0;M<40;M++)_.push(n.random(.3,1.2)),h.push(r.noise(this.strokeFrame*.08+M*.15,this.strokeFrame*.08+M*.15+y*.01)),T.push(r.noise(this.strokeFrame*.1+M*.1,this.strokeFrame*.1+M*.1+y*.01));n.random(-1,1),n.random(-1,1),n.random(-1,1),n.random(-1,1);const w=n.random(0,1);n.random(80,200),n.random(.8,1.2),x.push({showMainBrush:w,flyWhiteRandoms:_,flyWhiteOffsetNoises:h,flyWhiteWidthNoises:T})}const g=this.expectedStrokeLength;for(let y=0;y<this.interpSteps;++y){const _=x[y];if(!_)continue;const h=this.x,T=this.y;this.x+=this.velX/this.interpSteps,this.y+=this.velY/this.interpSteps;const w=this.x,M=this.y,S=(y+1)/this.interpSteps;this.smoothedWidth=Yt(this.smoothedWidth,Yt(o,c,S),.5),this.lineWidth+=(this.smoothedWidth-this.lineWidth)*.8,this.lineWidth=Math.max(u?a*1.5:1.5,this.lineWidth);const b=w-h,A=M-T,m=Math.sqrt(b*b+A*A);m>=.1&&(this.flyMove={x:b/m,y:A/m});const E=this.flyMove,C=-E.y,D=E.x,I=Math.max(l?a*.4:u?a*.5:.5,this.sizeNow*.5),N=this.speed*.5,P=this.strokeFrame>=g-5,B=P?.7:1,G=this.strokeFrame>=g,W=P?this.strokeFrame-(g-5):0,j=P?Math.min(1,W/5):0;f.forEach((X,Z)=>{if(this.strokeFrame<X.startOffset||G||(_.flyWhiteRandoms[Z]??0)<=X.randThreshold*B)return;const ee=_.flyWhiteOffsetNoises[Z]??0,ge=1+(at(ee,0,1,1,2)-1)*X.offsetVariationFactor,Xe=u?Math.max(.3,a*3):a,Fe=X.perpOffset*Xe*ge,Ge=C*Fe,Y=D*Fe;let K=w,pe=M,De=h,ue=T;if(P){const L=X.endDistanceOffset*j*a;if(K=w+E.x*L,pe=M+E.y*L,W!==0){const ct=X.endDistanceOffset*Math.min(1,(W-1)/5)*a;De=w+E.x*ct,ue=M+E.y*ct}}const ke=N*X.brushSpeedMultiplier*X.speedMultiplier,xt=Math.max(l||u?a*.3:.5,I-ke)*.6,Ue=1+(at(_.flyWhiteWidthNoises[Z]??0,0,1,.8,1.2)-1)*X.widthVariationFactor,tt=Math.max(0,at(Z,0,f?.length??1,80,230)-r.noise(y*.5,Z*.5)*30),Ne=Math.min(200,tt)+n.random(-50,50),Ye=Math.max(1,xt*X.sizeMultiplier*Ue),Me=`${d}_${Z}`,Ce=this.flyWeights.get(Me)??Ye,Te=Ce<3?.15:Ce>=5?.3:Yt(.15,.3,(Ce-3)/2),ze=Yt(Ce,Ye,Te);this.flyWeights.set(Me,ze),this.line(De+Ge,ue+Y,K+Ge,pe+Y,ze,s,Ne)})}}}const pi=3.141592653589793,qr=1.5707963267948966;function nu(i,e,t,n,r,s,a,o,c,l=10,u=[.72,.5,.35]){const f=[],g=Math.max(20,n),y=Math.max(20,r),_=Math.min(s-20,n+e),h=Math.min(a-20,r+t);for(let A=y;A<h;A+=4)for(let m=g;m<_;m+=4){const E=((A-r)*e+(m-n))*4,C=i[E]??255,D=i[E+1]??255,I=i[E+2]??255,N=i[E+3]??255,P=C+D+I,B=Math.abs(C-o[0])+Math.abs(D-o[1])+Math.abs(I-o[2]);N>100&&P<700&&B>80&&f.push({x:m,y:A,brightness:P})}if(f.length<10)return[];f.sort((A,m)=>A.brightness-m.brightness);const T=new Jn(c),w=f.slice(0,Math.max(Math.floor(f.length*.5),10)),M=[];for(let A=0;A<10&&w.length>0;A++){let m=0;const E=[];for(let N=0;N<w.length;N++){const P=1-N/w.length,B=P*P;E.push(B),m+=B}let C=T.random(0,m),D=0;for(let N=0;N<E.length;N++)if(C-=E[N]??0,C<=0){D=N;break}const I=w.splice(D,1)[0];I&&M.push(I)}const S=[],b=u[0]<.2&&u[1]<.15&&u[2]<.1;for(const A of M){const m=Math.floor(T.random(2,5)),E=[];for(let C=0;C<m;C++){for(let P=0;P<30;P++)T.random(0,1),T.random(0,kt),T.random(-.25,.25);const D=T.random(0,1),I=T.random(0,1),N=T.random(0,1);T.random(0,1),T.random(0,1),T.random(0,1),E.push({colorRand1:D,colorRand2:I,colorRand3:N,shapeSeedRand:T.random(0,1e4)})}for(let C=0;C<m;C++){const D=E[C];if(!D)continue;const I=xa(Math.floor(A.x),20,s-20),N=xa(Math.floor(A.y),20,a-20),P=Math.floor(A.x*1e3+A.y*333+D.shapeSeedRand),B=iu(T,l,P),G=b?Math.floor(38+D.colorRand1*13):230+D.colorRand1*25,W=b?Math.floor(31+D.colorRand2*7):160+D.colorRand2*60,j=b?Math.floor(20+D.colorRand3*6):0;S.push({x:I,y:N,r:G,g:W,b:j,size:l,vertices:B})}}return S}function xa(i,e,t){return Math.max(e,Math.min(t,i))}function iu(i,e,t){i.random(0,2);const n=Math.floor(i.random(2,4));i.seed(t);const r=new er(t);return n===2?pa(i,r,e,t,!1):pa(i,r,e*3,t,!0)}function pa(i,e,t,n,r){const s=r?3:2,a=r?75:30,o=r?800:300,c=Math.floor(i.random(1,r?4:3)),l=[];for(let d=0;d<s;d++){const f=i.random(0,kt),x=i.random(-t*.2,t*.2),g=i.random(-t*.2,t*.2),y=i.random(0,1),_=i.random(5,15),h=t*i.random(.2,.35),T=i.random(.1,.2)*(r?.5:1),w=i.random(.2,.4)*(r?.5:1),M=t*i.random(.5,.7)*(r?.3:1),S=[];for(let A=0;A<a;A++)S.push({stepVariation:i.random(.7,1.3),subBranchRand:i.random(),subBranchLengthRand:i.random(3,8),subBranchAngle:i.random(-pi/3,pi/3)});const b=[];for(let A=0;A<o;A++)b.push(i.random(.9,1.1));l.push({branchAngle:f,branchOffsetX:x,branchOffsetY:g,numLRand:y,numStepsRand:_,stepSize:h,noiseScale:T,noiseStrength:w,thickness:M,stepRandoms:S,thicknessRandoms:b})}const u=[];for(let d=0;d<c;d++){const f=l[d];if(!f)continue;const x=f.numLRand>.2?1:r?5:2,g=Math.floor(f.numStepsRand)*x,y=[{x:f.branchOffsetX,y:f.branchOffsetY}];let _=f.branchOffsetX,h=f.branchOffsetY,T=f.branchAngle;for(let S=0;S<g;S++){const b=f.stepRandoms[S];if(!b)break;const A=e.noise(S*f.noiseScale,n*.01);e.noise(S*f.noiseScale+100,n*.01),T+=(A-.5)*pi*f.noiseStrength;const m=f.stepSize*b.stepVariation;if(_+=Nt(T)*m,h+=Ct(T)*m,y.push({x:_,y:h}),b.subBranchRand<.1&&S>3&&S<g-3){const E=Math.floor(b.subBranchLengthRand),C=T+b.subBranchAngle;let D=_,I=h;for(let N=0;N<E;N++){const P=e.noise(S*f.noiseScale+N*.5,n*.01+200),B=C+(P-.5)*pi*.5;D+=Nt(B)*f.stepSize*.6,I+=Ct(B)*f.stepSize*.6,y.push({x:D,y:I})}}}const w=[],M=[];for(let S=0;S<y.length;S++){const b=y[S],A=y[S-1],m=y[S+1];if(!b)continue;let E;if(S===0&&m)E=Qi(m.y-b.y,m.x-b.x)+qr;else if(S===y.length-1&&A)E=Qi(b.y-A.y,b.x-A.x)+qr;else if(A&&m){const N=Qi(b.y-A.y,b.x-A.x),P=Qi(m.y-b.y,m.x-b.x);E=(N+P)/2+qr}else E=0;const C=.5+.5*Ct(S/y.length*pi),D=f.thicknessRandoms[Math.min(S,f.thicknessRandoms.length-1)]??1,I=f.thickness*C*D/2;w.push({x:b.x+Nt(E)*I,y:b.y+Ct(E)*I}),M.push({x:b.x-Nt(E)*I,y:b.y-Ct(E)*I})}u.push(...w);for(let S=M.length-1;S>=0;S--){const b=M[S];b&&u.push(b)}}return u}function ru(i,e,t,n){const o=Math.min(i,2e3),c=Math.min(e,2e3),l=new Jn(n),u=new er(n),d=document.createElement("canvas");d.width=40,d.height=40;const f=d.getContext("2d");if(!f)throw new Error("Canvas 2D unavailable for paper texture");f.translate(20,20);for(let M=0;M<100;M++){const S=Math.round(su(.5+l.random(0,1)*.5)*255),b=l.random()*40*.5,A=l.random()*kt;f.fillStyle=`rgb(${S},${S},${S})`,f.beginPath(),f.arc(b*Nt(A),b*Ct(A),.75,0,kt,!1),f.fill()}const x=document.createElement("canvas");x.width=o,x.height=c;const g=x.getContext("2d",{willReadFrequently:!0});if(!g)throw new Error("Canvas 2D unavailable for paper texture");for(let M=-40;M<o+40;M+=o/500)for(let S=-40;S<c+40;S+=20)g.drawImage(d,M,S+(u.noise(M*.1,S*1)-.5)*15);const y=g.getImageData(0,0,o,c).data,_=Math.min(255,t[0]*1.1),h=Math.min(255,t[1]*1.1),T=Math.min(255,t[2]*1.1),w=new Uint8Array(i*e*4);for(let M=0;M<e;M++){const S=Math.min(c-1,Math.floor(M*c/e));for(let b=0;b<i;b++){const A=Math.min(o-1,Math.floor(b*o/i)),m=(S*o+A)*4,C=1-(y[m+3]??0)/255*(1-(y[m]??255)/255),D=(M*i+b)*4;w[D]=Math.round(_*C),w[D+1]=Math.round(h*C),w[D+2]=Math.round(T*C),w[D+3]=255}}return w}function su(i){let e=1-(1-i)/5;for(let t=0;t<30;t++){const n=e*e*e*e,r=e-(n*e-i)/(5*n);if(Math.abs(r-e)<1e-12)return r;e=r}return e}const au=`
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
`,ou=`
precision highp float;
in vec2 vPixel;
out vec4 finalColor;
uniform vec3 uColor;
void main() { finalColor = vec4(uColor, 1.0); }
`,lu=`
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
`,cu=`
precision highp float;
in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
uniform sampler2D uSource;
void main() {
  finalColor = texture(uSource, vec2(vPixel.x / uCanvas.x, vPixel.y / uCanvas.y));
}
`;class fu{constructor(e,t,n){this.renderer=e,this.width=t,this.height=n;const r=new Zt;r.setAttribute("position",new $t([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],3)),this.fillMat=this.material(ou,{uColor:{value:new H(1,1,1)}}),this.blitMat=this.material(lu,{uStamp:{value:Yr()}},1),this.blitMat.transparent=!0,this.blitMat.premultipliedAlpha=!1,this.copyMat=this.material(cu,{uSource:{value:Yr()}}),this.mesh=new Xt(r,this.fillMat),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}width;height;scene=new ms;camera=new Wi(-1,1,1,-1,0,1);mesh;fillMat;blitMat;copyMat;stamp;disposed=!1;material(e,t,n=0){return new Cs({glslVersion:or,vertexShader:au,fragmentShader:`precision highp float;
${e}`,uniforms:{uCanvas:{value:new Ze(this.width,this.height)},uRect:{value:new ut(0,0,this.width,this.height)},...t},blending:n,depthTest:!1,depthWrite:!1,toneMapped:!1})}target(){const e=new Bt(this.width,this.height,{depthBuffer:!1,stencilBuffer:!1,magFilter:1006,minFilter:1006,generateMipmaps:!1});return e.texture.colorSpace="",e.texture.flipY=!1,e}fill(e,t,n){const r=this.fillMat.uniforms.uColor;r&&r.value.set(n[0],n[1],n[2]),this.draw(this.fillMat,e,t)}clear(e,t){this.fill(e,{x:0,y:0,w:this.width,h:this.height},t)}blitStamp(e,t,n){if(t.w<1||t.h<1)return;!this.stamp||this.stamp.image.width!==t.w||this.stamp.image.height!==t.h?(this.stamp?.dispose(),this.stamp=new Wn(e,t.w,t.h,1023,1009),this.stamp.flipY=!0,this.stamp.magFilter=1006,this.stamp.minFilter=1006,this.stamp.colorSpace="",this.stamp.generateMipmaps=!1):this.stamp.image.data=e,this.stamp.needsUpdate=!0;const r=this.blitMat.uniforms.uStamp;r&&(r.value=this.stamp),this.draw(this.blitMat,n,t)}copy(e,t,n){this.blitTexture(e.texture,t,n)}read(e,t){this.renderer.readRenderTargetPixels(e,0,0,this.width,this.height,t)}blitTexture(e,t,n){const r=this.copyMat.uniforms.uSource;r&&(r.value=e),this.draw(this.copyMat,t,n)}draw(e,t,n){if(this.disposed)return;const r=e.uniforms.uRect;r&&r.value.set(n.x,n.y,n.w,n.h),this.mesh.material=e;const s=this.renderer.getRenderTarget(),a=this.renderer.autoClear;this.renderer.autoClear=!1,this.renderer.setRenderTarget(t),this.renderer.setViewport(0,0,this.width,this.height),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(s),this.renderer.autoClear=a}dispose(){this.disposed||(this.disposed=!0,this.fillMat.dispose(),this.blitMat.dispose(),this.copyMat.dispose(),this.stamp?.dispose(),this.mesh.geometry.dispose())}}function Yr(){const i=new Wn(new Uint8Array([255,255,255,255]),1,1,1023,1009);return i.colorSpace="",i.needsUpdate=!0,i.magFilter=1006,i.minFilter=1006,i.generateMipmaps=!1,i}function hu(i,e){const t=new Uint8Array(e.w*e.h*4);for(const n of i)n.kind==="line"?uu(t,e,n):n.kind==="dot"?du(t,e,n):_u(t,e,n);return t}function uu(i,e,t){const n=Math.max(t.w/2,.4),r=Math.max(0,Math.floor(Math.min(t.x0,t.x1)-n-e.x)),s=Math.min(e.w-1,Math.ceil(Math.max(t.x0,t.x1)+n-e.x)),a=Math.max(0,Math.floor(Math.min(t.y0,t.y1)-n-e.y)),o=Math.min(e.h-1,Math.ceil(Math.max(t.y0,t.y1)+n-e.y)),c=t.x1-t.x0,l=t.y1-t.y0,u=c*c+l*l;for(let d=a;d<=o;d++)for(let f=r;f<=s;f++){const x=e.x+f+.5,g=e.y+d+.5,y=u<1e-6?0:xu(((x-t.x0)*c+(g-t.y0)*l)/u),_=t.x0+c*y,h=t.y0+l*y;Math.sqrt((x-_)*(x-_)+(g-h)*(g-h))<=n&&tr(i,(d*e.w+f)*4,t.r,t.g,t.b,t.a)}}function du(i,e,t){const n=Math.max(t.w/2,.4),r=Math.max(0,Math.floor(t.x0-n-e.x)),s=Math.min(e.w-1,Math.ceil(t.x0+n-e.x)),a=Math.max(0,Math.floor(t.y0-n-e.y)),o=Math.min(e.h-1,Math.ceil(t.y0+n-e.y));for(let c=a;c<=o;c++)for(let l=r;l<=s;l++){const u=e.x+l+.5-t.x0,d=e.y+c+.5-t.y0;u*u+d*d<=n*n&&tr(i,(c*e.w+l)*4,t.r,t.g,t.b,t.a)}}function _u(i,e,t){const n=t.x1,r=t.y1,s=t.w/2,a=t.h/2,o=s+a+t.lw+1,c=Math.max(0,Math.floor(t.x0-o-e.x)),l=Math.min(e.w-1,Math.ceil(t.x0+o-e.x)),u=Math.max(0,Math.floor(t.y0-o-e.y)),d=Math.min(e.h-1,Math.ceil(t.y0+o-e.y));for(let f=u;f<=d;f++)for(let x=c;x<=l;x++){const g=e.x+x+.5-t.x0,y=e.y+f+.5-t.y0,_=g*n+y*r,h=g*-r+y*n;if(Math.abs(_)>s||Math.abs(h)>a)continue;s-Math.abs(_)<t.lw||a-Math.abs(h)<t.lw?tr(i,(f*e.w+x)*4,t.r,t.g,t.b,t.a):tr(i,(f*e.w+x)*4,255,255,255,255)}}function tr(i,e,t,n,r,s){const a=Math.max(0,Math.min(255,s))/255,o=i[e]??0,c=i[e+1]??0,l=i[e+2]??0,u=(i[e+3]??0)/255,d=a+u*(1-a);d<=0||(i[e]=Math.round((t*a+o*u*(1-a))/d),i[e+1]=Math.round((n*a+c*u*(1-a))/d),i[e+2]=Math.round((r*a+l*u*(1-a))/d),i[e+3]=Math.round(d*255))}function xu(i){return i<0?0:i>1?1:i}const pu=`in vec2 vPixel;
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
}`,mu=`in vec2 vPixel;
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
}`,gu=`in vec2 vPixel;
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
}`,vu=`in vec2 vPixel;
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
}`,Su=`in vec2 vPixel;
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
}`,Mu=`in vec2 vPixel;
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
}`,yu=`in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
vec4 T(sampler2D s, vec2 c) { return texture(s, vec2(c.x, 1.0 - c.y)); }
vec2 inkFragCoord() { return vec2(vPixel.x, uCanvas.y - vPixel.y); }
uniform sampler2D tex0;
uniform sampler2D forceMap;
uniform float time;
uniform float distortEnabled;
uniform float displacementB;
uniform float displacementC;
uniform float showFbmMask;
uniform float fbmSeed1;
uniform float fbmSeed2;
uniform float fbmSeed3;
uniform float fbmSeed4;
uniform vec3 backgroundColor;
uniform float rsEnabled;
uniform float rsFrequency;
uniform float rsWaveSpeed;
uniform float rsStrength;
uniform float rsGradientMix;
uniform float rsScale;
uniform float cellularEnabled;
uniform float cellularScale;
uniform float cellularSeed;
uniform float whiteDotDensity;
uniform float grainAmount;
#define PI 3.14159265359
#define TAU 6.28318530718
#define RS_SAMPLE_POINTS 16
const mat2 _x0 = mat2(0.80,0.60,-0.60,0.80);
float _x1( vec2 _x27){
return sin(_x27.x)* sin(_x27.y);
}
float _x2(vec2 _x27){
float _x16 = 0.0;
_x16+=0.5000 * _x1(_x27);
_x27 = _x0 * _x27 * 2.02;
_x16+=0.2500 * _x1(_x27);
_x27 = _x0 * _x27 * 2.02;
_x16+=0.1250 * _x1(_x27);
_x27 = _x0 * _x27 * 2.02;
_x16+=0.0625 * _x1(_x27);
return _x16 / 0.9375;
}
float _x3(vec2 _x27){
float _x16 = 0.0;
_x16+=0.500000 *(0.5 + 0.5 * _x1(_x27));
_x27 = _x0 * _x27 * 1.02;
_x16+=0.500000 *(0.5 + 0.5 * _x1(_x27));
_x27 = _x0 * _x27 * 1.32;
_x16+=0.500000 *(0.5 + 0.5 * _x1(_x27));
_x27 = _x0 * _x27 * 0.72;
_x16+=0.250000 *(0.5 + 0.5 * _x1(_x27));
_x27 = _x0 * _x27 * 0.5;
return _x16 / 0.96875;
}
vec2 _x4(vec2 _x27){
return vec2(_x2(_x27 + vec2(fbmSeed1,fbmSeed2)),_x2(_x27 + vec2(7.8 + fbmSeed3,fbmSeed4)));
}
vec2 _x5(vec2 _x27){
return vec2(_x3(_x27 + vec2(16.8 + fbmSeed1,fbmSeed2)),_x3(_x27 + vec2(11.5 + fbmSeed3,fbmSeed4)));
}
float _x6(vec2 _x17,out vec4 _x90){
float _x18 = time * 3.0;
_x17+=0.03 * sin(vec2(0.27,0.23)* _x18 + length(_x17)* vec2(4.1,4.3)+ vec2(fbmSeed1,fbmSeed2));
vec2 _x19 = _x4(0.9 * _x17);
_x19+=0.04 * sin(vec2(0.12,0.14)* _x18 + length(_x19)+ vec2(fbmSeed3,fbmSeed4));
vec2 _x20 = _x5(3.0 * _x19);
_x90 = vec4(_x19,_x20);
float _x16 = 0.5 + 0.5 * _x2(1.8 * _x17 + 6.0 * _x20 + vec2(fbmSeed1,fbmSeed2));
return mix(_x16,_x16 * _x16 * _x16 * 3.5,_x16 * abs(_x20.x));
}
vec4 _x7(vec4 x){
return x - floor(x *(1.0 / 289.0))* 289.0;
}
vec4 _x8(vec4 x){
return _x7(((x * 34.0)+ 1.0)* x);
}
vec2 _x9(vec2 P){
float _x21 = 0.142857142857;
float _x22 = 0.428571428571;
vec2 _x23 = mod(floor(P),289.0);
vec2 _x24 = fract(P);
vec4 _x25 = _x24.x + vec4(-0.5,-1.5,-0.5,-1.5);
vec4 _x26 = _x24.y + vec4(-0.5,-0.5,-1.5,-1.5);
vec4 _x27 = _x8(_x23.x + vec4(0.0,1.0,0.0,1.0));
_x27 = _x8(_x27 + _x23.y + vec4(0.0,0.0,1.0,1.0));
vec4 _x28 = mod(_x27,7.0)* _x21 + _x22;
vec4 _x29 = mod(floor(_x27 * _x21),7.0)* _x21 + _x22;
vec4 _x30 = _x25 + 0.5 - _x28;
vec4 _x31 = _x26 + 0.5 - _x29;
vec4 _x32 = _x30 * _x30 + _x31 * _x31;
vec2 _x33 = vec2(1e6);
for (int _x34 = 0; _x34 < 4; _x34++){
float _x35;
if (_x34==0)_x35 = _x32.x;
else if (_x34==1)_x35 = _x32.y;
else if (_x34==2)_x35 = _x32.z;
else _x35 = _x32.w;
if (_x35 < _x33.x){
_x33.y = _x33.x;
_x33.x = _x35;
}
else if (_x35 < _x33.y){
_x33.y = _x35;
}
}
return sqrt(_x33);
}
float _x10(vec2 st){
return fract(sin(dot(st,vec2(12.9898,78.233)))* 43758.5453123);
}
float _x11(vec2 st){
return fract(sin(dot(st,vec2(269.5,183.3)))* 43758.5453123);
}
float _x12(vec2 st){
return fract(sin(dot(st,vec2(17.0,180.0)))* 2500.0);
}
vec2 _x13(int index){
float _x36 = sqrt(float(RS_SAMPLE_POINTS));
float _x37 = mod(float(index),_x36);
float _x38 = floor(float(index)/ _x36);
vec2 _x39 = vec2((_x37 + 0.5)/ _x36,(_x38 + 0.5)/ _x36);
vec4 _x40 = T(forceMap,_x39);
vec2 _x41 = _x40.xy - vec2(0.5);
vec2 _x42 = _x41 * 0.1;
return (_x39 + _x42 - 0.5)* 2.0;
}
float _x14(int index){
float _x36 = sqrt(float(RS_SAMPLE_POINTS));
float _x37 = mod(float(index),_x36);
float _x38 = floor(float(index)/ _x36);
vec2 _x43 = vec2((_x37 + 0.5)/ _x36,(_x38 + 0.5)/ _x36);
vec4 _x40 = T(forceMap,_x43);
float _x44 = length(_x40.xy - vec2(0.5));
return smoothstep(0.01,0.15,_x44);
}
vec2 _x15(vec2 _x45,vec2 _x77){
vec2 _x46 =(_x45 - 0.5)* 2.0;
float _x47 = time;
vec2 _x48 = _x46 * 0.8 + vec2(_x47 * 0.01,0.0);
vec2 _x49 = _x46 * 1.2 + vec2(0.0,_x47 * 0.015);
float _x50 = _x2(_x48);
float _x51 = _x2(_x49);
float _x16 = rsFrequency;
float _x52 = rsWaveSpeed *(0.7 + 0.6 * _x50);
float _x53 = rsScale *(0.6 + 0.8 * _x51);
float _x54 = -1.5;
float _x55 = _x47 * 0.0075;
float _x32 = 1.0 / _x77.y;
float _x56 = 0.0;
float _x57 = 0.0;
float _x58 = 0.0;
float _x59 = 0.0;
for (int _x34 = 0; _x34 < RS_SAMPLE_POINTS; _x34++){
vec2 _x60 = _x13(_x34);
float _x61 = _x14(_x34);
if (_x61 > 0.01){
_x59+=_x61;
float _x62 = length(_x46 - _x60);
_x56+=sin(TAU * _x16 *(_x55 -(_x62 / _x52))/ _x53)* _x61;
float _x63 = length(vec2(_x46.x + _x32,_x46.y)- _x60);
_x57+=sin(TAU * _x16 *(_x55 -(_x63 / _x52))/ _x53)* _x61;
float _x64 = length(vec2(_x46.x,_x46.y + _x32)- _x60);
_x58+=sin(TAU * _x16 *(_x55 -(_x64 / _x52))/ _x53)* _x61;
}
}
if (_x59 < 0.01){
return vec2(0.0);
}
float _x65 = abs(_x57);
float _x66 = abs(_x58);
float _x67 = abs(_x56);
float _x68 = sqrt((_x65 - _x67)*(_x65 - _x67)+(_x66 - _x67)*(_x66 - _x67));
vec2 _x69 = vec2(0.0);
if (_x68 > 0.0001){
_x69 = vec2(_x54 *(_x65 - _x67)/ _x68,_x54 *(_x66 - _x67)/ _x68);
}
vec2 _x70 = vec2(0.0);
float _x71 = _x56 / max(_x59,1.0);
_x70+=vec2(_x71)* 0.008 *(1.0 - rsGradientMix);
_x70+=_x69 * 0.005 * rsGradientMix;
vec2 _x72 = _x46 * 1.5 + vec2(_x47 * 0.02);
float _x73 = _x2(_x72);
float _x74 = 0.4 + 0.6 * _x73;
return _x70 * rsStrength * _x74;
}
void main(){
vec2 _x75 =(inkFragCoord() / uCanvas);
vec2 _x76 = 0.5 / uCanvas;
vec2 _x77 = uCanvas;
vec4 _x78 = T(tex0,_x75);
vec3 _x79 = _x78.rgb;
vec3 _x80 = backgroundColor;
float _x81 = distance(_x79,_x80);
if (_x81 < 0.05){
finalColor = _x78;
return;
}
float _x82 = dot(_x78.rgb,vec3(0.299,0.587,0.114));
if (_x82 < 0.01){
finalColor = _x78;
return;
}
vec2 _x83 = _x75;
vec4 _x84 = T(forceMap,_x75);
vec2 _x85 = _x84.xy - vec2(0.5);
float _x86 = length(_x85);
float _x87 = clamp(_x86 / 0.707,0.0,1.0);
if (rsEnabled > 0.5){
vec2 _x88 = _x15(_x75,_x77);
_x83+=_x88;
}
vec4 _x89;
if (distortEnabled > 0.5){
vec2 _x27 =(2.0 *(inkFragCoord() - vec2(0.0))- _x77.xy)/ _x77.y;
vec4 _x90;
float _x91 = pow(_x6(_x27,_x90),0.2);
float _x92 = clamp(_x91,0.3,1.0);
float _x93 = displacementB * _x92;
float _x94 = displacementC * _x92;
vec2 _x95 = _x85 * _x76 * _x93;
vec2 _x96 = _x85 * _x76 * _x94;
vec4 _x97 = T(tex0,_x83 + _x95);
vec4 _x98 = T(tex0,(_x83 / 1.05)+ vec2(0.02381,0.02381)+ _x96);
_x98.rgb = mix(_x98.rgb,vec3(1.0),0.75);
_x89 = min(_x97,_x98);
float _x99 = dot(_x89.rgb,vec3(0.299,0.587,0.114));
vec3 _x100 = _x89.rgb;
if (_x99 < 0.7){
float _x101 = max(_x89.r,max(_x89.g,_x89.b));
float _x102 = min(_x89.r,min(_x89.g,_x89.b));
float _x103 = _x101 - _x102;
float _x104 =(_x101 + _x102)* 0.5;
float _x105 =(_x103 < 0.001)? 0.0 : _x103 /(1.0 - abs(2.0 * _x104 - 1.0));
float _x106 = 0.0;
if (_x103 > 0.001){
if (_x101==_x89.r){
_x106 = mod(((_x89.g - _x89.b)/ _x103)+(_x89.g < _x89.b ? 6.0 : 0.0),6.0)/ 6.0;
}
else if (_x101==_x89.g){
_x106 =((_x89.b - _x89.r)/ _x103 + 2.0)/ 6.0;
}
else {
_x106 =((_x89.r - _x89.g)/ _x103 + 4.0)/ 6.0;
}
}
float _x107 = 1.0 + _x87 * 0.3;
_x105 = clamp(_x105 * _x107,0.0,1.0);
vec2 _x108 = _x75 * 0.2;
vec2 _x109 = floor(_x108);
vec2 _x16 = fract(_x108);
_x16 = _x16 * _x16 *(3.0 - 2.0 * _x16);
float _x20 = _x109.x + _x109.y * 57.0;
float _x110 = fract(sin(_x20 + 0.0)* 43758.5453);
float _x111 = fract(sin(_x20 + 1.0)* 43758.5453);
float _x112 = fract(sin(_x20 + 57.0)* 43758.5453);
float _x113 = fract(sin(_x20 + 58.0)* 43758.5453);
float _x114 = mix(_x110,_x111,_x16.x);
float _x115 = mix(_x112,_x113,_x16.x);
float _x116 = mix(_x114,_x115,_x16.y);
float _x117 = fract(sin(dot(_x85,vec2(12.9898,78.233)))* 43758.5453);
float _x118 = mix(_x116,_x117,0.2);
float _x119 = _x87 * 0.2;
_x106 = mod(_x106 + _x118 * _x119,1.0);
float _x56 =(1.0 - abs(2.0 * _x104 - 1.0))* _x105;
float _x120 = _x56 *(1.0 - abs(mod(_x106 * 6.0,2.0)- 1.0));
float _x121 = _x104 - _x56 * 0.5;
vec3 _x122 = vec3(0.0);
if (_x106 < 1.0 / 6.0){
_x122 = vec3(_x56,_x120,0.0);
}
else if (_x106 < 2.0 / 6.0){
_x122 = vec3(_x120,_x56,0.0);
}
else if (_x106 < 3.0 / 6.0){
_x122 = vec3(0.0,_x56,_x120);
}
else if (_x106 < 4.0 / 6.0){
_x122 = vec3(0.0,_x120,_x56);
}
else if (_x106 < 5.0 / 6.0){
_x122 = vec3(_x120,0.0,_x56);
}
else {
_x122 = vec3(_x56,0.0,_x120);
}
_x100 = _x122 + vec3(_x121);
_x100 = clamp(_x100,vec3(0.0),vec3(1.0));
}
_x89 = vec4(_x100,_x89.a);
if (showFbmMask > 0.5){
vec3 _x123;
if (_x92 < 0.33){
_x123 = mix(vec3(0.0,0.0,1.0),vec3(0.0,1.0,1.0),_x92 / 0.33);
}
else if (_x92 < 0.66){
_x123 = mix(vec3(0.0,1.0,1.0),vec3(1.0,1.0,0.0),(_x92 - 0.33)/ 0.33);
}
else {
_x123 = mix(vec3(1.0,1.0,0.0),vec3(1.0,0.0,0.0),(_x92 - 0.66)/ 0.34);
}
finalColor = vec4(_x123,1.0);
return;
}
}
else {
_x89 = T(tex0,_x83);
}
if (cellularEnabled > 0.5){
float _x124 = _x77.x / _x77.y;
vec2 _x125 = floor(_x75 * 3.0);
vec2 _x126 = fract(_x75 * 3.0);
_x126 = _x126 * _x126 *(3.0 - 2.0 * _x126);
float _x127 = mix( mix(_x10(_x125),_x10(_x125 + vec2(1.0,0.0)),_x126.x), mix(_x10(_x125 + vec2(0.0,1.0)),_x10(_x125 + vec2(1.0,1.0)),_x126.x), _x126.y);
float _x128 = mix( mix(_x11(_x125),_x11(_x125 + vec2(1.0,0.0)),_x126.x), mix(_x11(_x125 + vec2(0.0,1.0)),_x11(_x125 + vec2(1.0,1.0)),_x126.x), _x126.y);
vec2 _x129 = _x75;
_x129.x*=_x124;
_x129+=vec2(_x127,_x128)* 0.3 + vec2(cellularSeed * 5.0,cellularSeed * 3.0);
_x129+=vec2( sin(time * 0.02 * 0.7)* 0.15, cos(time * 0.015 * 0.7)* 0.15 );
_x129*=cellularScale;
vec2 _x33 = _x9(_x129);
float _x130 = _x33.y - _x33.x;
float _x131 = smoothstep(0.05,0.3,_x33.x);
float _x132 = step(0.4,_x130)* _x131;
float _x133 = 0.5 + 0.5 * _x127;
float _x134 = _x132 * cellularScale * 15.0 * _x133;
float _x135 = min(min(_x83.x,_x83.y),min(1.0 - _x83.x,1.0 - _x83.y));
float _x136 = smoothstep(0.0,0.10,_x135);
_x134*=_x136;
vec2 _x137 = _x85 * _x76 * _x134;
vec4 _x138 = T(tex0,clamp(_x83 + _x137,vec2(0.0),vec2(1.0)));
_x89 = vec4(min(_x89.rgb,_x138.rgb),_x89.a);
}
if (whiteDotDensity > 0.001){
vec2 _x139 = inkFragCoord();
float _x140 = 1.0 - whiteDotDensity;
vec2 _x141 = floor(_x75 * 2.5 + vec2(fbmSeed1 * 0.1,fbmSeed2 * 0.1));
vec2 _x142 = fract(_x75 * 2.5 + vec2(fbmSeed1 * 0.1,fbmSeed2 * 0.1));
_x142 = _x142 * _x142 *(3.0 - 2.0 * _x142);
float _x143 = mix( mix(_x10(_x141),_x10(_x141 + vec2(1.0,0.0)),_x142.x), mix(_x10(_x141 + vec2(0.0,1.0)),_x10(_x141 + vec2(1.0,1.0)),_x142.x), _x142.y);
_x143 = smoothstep(0.3,0.8,_x143);
if (_x143 > 0.05){
float _x144 = mix(1.0,_x140,_x143);
vec2 _x145 = floor(_x139 * 0.2);
float _x146 = _x10(_x145);
if (_x146 > _x144){
float _x147 = smoothstep(_x144,1.0,_x146);
float _x148 = 0.15 + _x10(_x145 + vec2(19.0,41.0))* 0.3;
vec2 _x149 = fract(_x139 * 0.2)- 0.5;
float _x150 = step(length(_x149),_x148);
_x89.rgb = mix(_x89.rgb,vec3(1.0),_x147 * 0.85 * _x150);
}
float _x151 = 0.05 + _x10(floor(_x139 * 0.002)+ vec2(3.0,7.0))* 0.06;
vec2 _x152 = floor(_x139 * _x151);
float _x153 = _x11(_x152);
if (_x153 > _x144 + 0.005){
float _x154 = smoothstep(_x144 + 0.005,1.0,_x153);
float _x155 = 0.08 + pow(_x10(_x152 + vec2(31.0,17.0)),2.0)* 0.4;
vec2 _x156 = fract(_x139 * _x151)- 0.5;
float _x157 = length(_x156);
float _x158 = step(_x157,_x155);
_x89.rgb = mix(_x89.rgb,vec3(1.0),_x154 * 0.75 * _x158);
}
float _x159 = 0.008 + _x11(floor(_x139 * 0.001))* 0.016;
vec2 _x160 = floor(_x139 * _x159);
float _x161 = _x10(_x160 + vec2(53.0,91.0));
if (_x161 > _x144 + 0.02){
float _x162 = smoothstep(_x144 + 0.02,1.0,_x161);
float _x163 = _x11(_x160 + vec2(11.0,43.0))* PI;
float _x164 = 0.2 + _x10(_x160 + vec2(67.0,23.0))* 0.7;
vec2 _x165 = fract(_x139 * _x159)- 0.5;
float _x166 = cos(_x163),sa = sin(_x163);
vec2 _x167 = vec2(_x166 * _x165.x + sa * _x165.y,-sa * _x165.x + _x166 * _x165.y);
_x167.y/=_x164;
float _x168 = length(_x167);
float _x169 = 0.06 + pow(_x11(_x160 + vec2(5.0,9.0)),3.0)* 0.35;
float _x170 = step(_x168,_x169);
_x89.rgb = mix(_x89.rgb,vec3(1.0),_x162 * 0.55 * _x170);
}
}
}
if (grainAmount > 0.01){
float _x171 = dot(_x89.rgb,vec3(0.299,0.587,0.114));
float _x172 = 1.0 - smoothstep(0.2,0.85,_x171);
float _x173 = smoothstep(0.01,0.15,_x86);
vec2 _x174 = floor(_x75 * 3.0 + vec2(fbmSeed1 * 0.05,fbmSeed2 * 0.05));
vec2 _x175 = fract(_x75 * 3.0 + vec2(fbmSeed1 * 0.05,fbmSeed2 * 0.05));
_x175 = _x175 * _x175 *(3.0 - 2.0 * _x175);
float _x176 = mix( mix(_x10(_x174 + vec2(55.0,33.0)),_x10(_x174 + vec2(56.0,33.0)),_x175.x), mix(_x10(_x174 + vec2(55.0,34.0)),_x10(_x174 + vec2(56.0,34.0)),_x175.x), _x175.y);
_x176 = 0.3 + 0.7 * _x176;
float _x177 = mix(0.2,1.0,_x172 * 0.5 + _x173 * 0.3 + _x176 * 0.2);
vec2 _x178 = _x75 * uCanvas;
float _x179 = _x12(_x178);
float _x180 = _x12(floor(_x178 * 0.5)* 2.0);
float _x181 = _x10(floor(_x178 * 0.15));
float _x182 = _x179 * 0.6 + _x180 * 0.3 + _x181 * 0.1;
float _x183 = _x10(floor(_x178 * 0.3)+ vec2(99.0,77.0));
vec3 _x184 =(_x183 > 0.5)? vec3(_x182): vec3(_x182 * 0.8,_x182 * 0.85,_x182 * 0.9);
float _x185 = grainAmount * 3.0 * _x177;
_x89.rgb = mix(_x89.rgb,_x184,_x185);
}
finalColor = _x89;
}`,bu=`in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
vec4 T(sampler2D s, vec2 c) { return texture(s, vec2(c.x, 1.0 - c.y)); }
vec2 inkFragCoord() { return vec2(vPixel.x, uCanvas.y - vPixel.y); }
uniform sampler2D tex0;
uniform sampler2D lastStrokeTex;
uniform int lastStrokeOnly;
uniform int blendType;
uniform float blendVol;
uniform float radSeed;
uniform vec4 strokeBounds;
uniform float pixD;
uniform float blendA;
uniform float blendB;
uniform float directVol;
uniform float snoiseVol;
uniform int gobalStyle;
uniform int vline;
uniform int hline;
uniform float cellT;
uniform float colorDeep;
uniform float whiteDot;
uniform float doBigShape;
uniform float doMask;
uniform int multiDir;
uniform int drawTime;
uniform float seed;
uniform float iTime;
uniform float pixelScale;
uniform int isTypeMapMode;
const int _x0 = 3;
vec4 _x2(vec4 _x30){
return _x30 - floor(_x30 *(1.0 / 289.0))* 289.0;
}
vec3 _x2(vec3 _x30){
return _x30 - floor(_x30 *(1.0 / 289.0))* 289.0;
}
vec2 _x2(vec2 _x30){
return _x30 - floor(_x30 *(1.0 / 289.0))* 289.0;
}
vec3 _x3(vec3 _x30){
return _x2(((_x30 * 34.0)+ 1.0)* _x30);
}
vec4 _x3(vec4 _x30){
return _x2(((_x30 * 34.0)+ 1.0)* _x30);
}
float _x4(vec2 _x19){
_x19 = fract(_x19 * vec2(123.34,456.21)+ radSeed);
_x19+=dot(_x19,_x19 + 45.32);
return fract(_x19.x * _x19.y);
}
float _x5(float _x14,float _x15,float _x16,float _x17,float max2){
return _x17 +(_x14 - _x15)*(max2 - _x17)/(_x16 - _x15);
}
vec3 _x6(vec3 _x42){
vec4 _x18 = vec4(0.0,-1.0 / 3.0,2.0 / 3.0,-1.0);
vec4 _x19 = mix(vec4(_x42.bg,_x18.wz),vec4(_x42.gb,_x18.xy),step(_x42.b,_x42.g));
vec4 _x20 = mix(vec4(_x19.xyw,_x42.r),vec4(_x42.r,_x19.yzx),step(_x19.x,_x42.r));
float _x21 = _x20.x - min(_x20.w,_x20.y);
float _x22 = 1.0e-10;
return vec3(abs(_x20.z +(_x20.w - _x20.y)/(6.0 * _x21 + _x22)),_x21 /(_x20.x + _x22),_x20.x);
}
vec3 _x7(vec3 _x42){
vec4 _x23 = vec4(1.0,2.0 / 3.0,1.0 / 3.0,3.0);
vec3 _x19 = abs(fract(_x42.xxx + _x23.xyz)* 6.0 - _x23.www);
return _x42.z * mix(_x23.xxx,clamp(_x19 - _x23.xxx,0.0,1.0),_x42.y);
}
float _x8(vec2 v){
const vec4 _x1 = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
vec2 _x24 = floor(v + dot(v,_x1.yy));
vec2 _x25 = v - _x24 + dot(_x24,_x1.xx);
vec2 _x26 =(_x25.x > _x25.y)? vec2(1.0,0.0): vec2(0.0,1.0);
vec2 _x27 = _x25.xy + _x1.xx - _x26;
vec2 _x28 = _x25.xy + _x1.zz;
_x24 = _x2(_x24);
vec3 _x19 = _x3(_x3(_x24.y + vec3(0.0,_x26.y,1.0))+ _x24.x + vec3(0.0,_x26.x,1.0));
vec3 _x29 = max(0.5 - vec3(dot(_x25,_x25),dot(_x27,_x27),dot(_x28,_x28)),0.0);
_x29 = _x29 * _x29 * _x29 * _x29;
vec3 _x30 = 2.0 * fract(_x19 * _x1.www)- 1.0;
vec3 _x31 = abs(_x30)- 0.5;
vec3 _x32 = floor(_x30 + 0.5);
vec3 _x33 = _x30 - _x32;
_x29*=1.79284291400159 - 0.85373472095314 *(_x33 * _x33 + _x31 * _x31);
vec3 _x34 = vec3(0.0);
_x34.x = _x33.x * _x25.x + _x31.x * _x25.y;
_x34.yz = _x33.yz * _x27.xy + _x31.yz * _x28.xy;
return snoiseVol * dot(_x29,_x34);
}
vec2 _x9(vec2 v){
float _x35 = _x5(_x4(vec2(0.16,0.73)),0.0,1.0,5.0,15.0);
float _x36 = _x5(_x4(vec2(0.46,0.35)),0.0,1.0,15.0,24.0);
float _x37 = _x5(_x4(vec2(0.24,0.95)),0.0,1.0,20.0,30.0);
float _x38 = _x5(_x4(vec2(0.57,0.27)),0.0,1.0,40.0,50.0);
return vec2(_x8(v)- _x8(v + vec2(_x35,_x36)),_x8(v + vec2(_x37,_x38))- _x8(v + vec2(56.7,67.8)));
}
float _x10(vec2 _x19){
vec2 _x24 = floor(_x19);
vec2 _x39 = fract(_x19);
float _x40 = _x4(_x24);
float _x41 = _x4(_x24 + vec2(1.0,0.0));
float _x42 = _x4(_x24 + vec2(0.0,1.0));
float _x21 = _x4(_x24 + vec2(1.0,1.0));
vec2 _x43 = _x39 * _x39 *(3.0 - 2.0 * _x39);
return mix(_x40,_x41,_x43.x)+(_x42 - _x40)* _x43.y *(1.0 - _x43.x)+(_x21 - _x41)* _x43.x * _x43.y;
}
float _x11(vec2 _x19){
float _x39 = 0.0;
float _x44 = 0.5;
for (int _x24 = 0; _x24 < 5; _x24++){
_x39+=_x44 * _x10(_x19);
_x19*=2.0;
_x44*=0.5;
}
return _x39;
}
vec2 _x12(vec2 P){
#define K 0.142857142857
#define K2 0.0714285714285
#define jitter 0.8
vec2 _x45 = mod(floor(P),289.0);
vec2 _x46 = fract(P);
vec4 _x47 = _x46.x + vec4(-0.5,-1.5,-0.5,-1.5);
vec4 _x48 = _x46.y + vec4(-0.5,-0.5,-1.5,-1.5);
vec4 _x49 = vec4(_x45.x,_x45.x,_x45.x + 1.0,_x45.x + 1.0);
vec4 _x50 = vec4(_x45.y,_x45.y + 1.0,_x45.y,_x45.y + 1.0);
vec4 _x32 = mod(_x3(mod(_x49,289.0)),7.0)* K + K2;
vec4 _x51 = mod(_x3(mod(_x50,289.0)),7.0)* K + K2;
vec4 _x52 = _x47 + jitter * _x32;
vec4 _x53 = _x48 + jitter * _x51;
vec4 _x21 = _x52 * _x52 + _x53 * _x53;
vec2 _x54 = min(_x21.xy,_x21.zw);
vec2 _x55 = max(_x21.xy,_x21.zw);
_x54 = min(_x54,_x55.yx);
return sqrt(_x54);
}
float _x13(float _x30){
float _x56 = 0.8;
float _x57 = 0.5;
return 1.0 - exp(-0.5 * pow((_x30 - _x57)/ _x56,2.0));
}
void main(){
vec2 _x58 =(inkFragCoord() / uCanvas);
vec2 _x59 = uCanvas;
float _x60 = pixelScale > 0.0 ? pixelScale : 1.0;
vec2 _x61 = _x60 / _x59;
vec2 _x62 = inkFragCoord() / _x60;
if (_x58.x < strokeBounds.x||_x58.x > strokeBounds.z|| _x58.y < strokeBounds.y||_x58.y > strokeBounds.w){
finalColor = T(tex0,_x58);
return;
}
float _x63 = 1.0;
float _x64 = 0.06;
float _x65 = smoothstep(strokeBounds.x,strokeBounds.x + _x64,_x58.x);
float _x66 = smoothstep(strokeBounds.z,strokeBounds.z - _x64,_x58.x);
float _x67 = smoothstep(strokeBounds.y,strokeBounds.y + _x64,_x58.y);
float _x68 = smoothstep(strokeBounds.w,strokeBounds.w - _x64,_x58.y);
float _x69 = min(min(_x65,_x66),min(_x67,_x68));
float _x70 = mix(0.05,0.15,1.0 - _x69);
float _x71 = _x4(_x62 * _x70 + radSeed * 0.1);
_x63 = step(_x71,_x69);
vec2 _x72 = _x58;
vec2 _x73 = _x72;
float _x74 = pixD > 0.0 ? pixD : 1.0;
float _x75 = blendVol > 0.0 ? blendVol : 100.0;
vec4 _x76 = T(tex0,_x72);
float _x77 = dot(_x76.rgb,vec3(0.299,0.587,0.114));
float _x78 = _x4(vec2(0.02,0.12 + seed));
float _x79 = _x10(_x72 * 10.1);
_x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75;
_x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0;
if (gobalStyle==0){
if (_x79 < 0.4){
_x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75;
_x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0;
}
else if (_x79>=0.4&&_x79 < 0.7){
_x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75 * 3.1;
_x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0 * 3.1;
}
else if (_x79>=0.7){
_x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75 * 5.01;
_x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0 * 5.01;
}
}
else if (gobalStyle==1){
if (_x79 < 0.7){
_x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75;
_x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0;
}
else {
float _x80 = _x5(_x4(vec2(5.3,6.1)),0.0,1.0,3.0,15.0);
_x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75 * _x80;
_x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0 * _x80;
}
}
float _x81 = directVol > 0.0 ? directVol : 10.0;
if (multiDir==1){
float layerFrequencies[3];
float layerAmplitudes[3];
layerFrequencies[0] = 0.005;
layerFrequencies[1] = 0.01;
layerFrequencies[2] = 0.02;
layerAmplitudes[0] = _x81 * 0.7;
layerAmplitudes[1] = _x81 * 0.3;
layerAmplitudes[2] = _x81 * 0.1;
vec2 layerDirections[3];
layerDirections[0] = vec2(0.5,0.8);
layerDirections[1] = vec2(-0.6,0.3);
layerDirections[2] = vec2(0.2,-0.4);
for (int _x24 = 0; _x24 < 3; _x24++){
vec2 _x82 = layerDirections[_x24];
float _x83 = layerFrequencies[_x24];
float _x84 = layerAmplitudes[_x24];
vec2 _x85 = vec2(_x8(vec2(_x62.y * _x83 * _x82.y,_x62.x * _x83 * _x82.x)),_x8(vec2(_x62.x * _x83 * _x82.x,_x62.y * _x83 * _x82.y)));
float _x86 = _x13(_x72.y);
_x73+=_x85 * _x61 * _x75 * _x84 *(1.0 - _x86);
}
}
else {
vec2 _x87 = vec2(_x8(vec2(_x62.y * 0.005,_x62.x * 0.002)),_x8(vec2(_x62.x * 0.01,_x62.y * 0.02)));
float _x86 = _x13(_x72.y);
_x73+=_x87 * _x61 * _x75 * _x81 * 0.1 *(1.0 - _x86);
}
if (blendType==2){
float _x88 = _x59.x / _x59.y;
float _x35 = _x5(_x4(vec2(0.3,0.1)),0.0,1.0,0.2,0.8);
float _x36 = _x5(_x4(vec2(0.61,0.15)),0.0,1.0,0.1,0.3);
float _x38 = _x5(_x4(vec2(0.25,0.90)),0.0,1.0,0.2,0.8);
float _x89 = _x5(_x4(vec2(0.31,0.75)),0.0,1.0,0.7,0.9);
float _x37 = _x5(_x4(vec2(0.27,0.78)),0.0,1.0,50.0,100.0);
vec2 _x90 = vec2(_x35,_x36);
vec2 _x91 = vec2(_x38,_x89);
vec2 _x92 = _x72 - _x90;
vec2 _x93 = _x72 - _x91;
_x92.x*=_x88;
_x93.x*=_x88;
float _x94 = length(_x92);
float _x95 = length(_x93);
float _x96 = _x5(sin(_x94 * _x37),-1.0,1.0,0.9,1.0);
float _x97 = _x5(sin(_x95 * _x37),-1.0,1.0,0.95,1.0);
float _x98 = cos(_x94 * _x37 * _x96)* 0.05;
float _x99 = cos(_x95 * _x37 * _x97)* 0.03;
float _x100 = _x8(_x72 * _x37);
float _x101 = 0.5 + _x100 * 0.1;
float _x102 = 0.4 + _x100 * 0.1;
float _x103 = length(_x72 - _x90);
float _x104 = length(_x72 - _x91);
vec2 _x105 = _x72;
float _x106 = 0.0;
if (_x103 < _x101){
_x105+=_x92 * _x98;
_x106 = max(_x106,smoothstep(_x101,_x101 * 0.3,_x103));
}
if (_x104 < _x102){
_x105+=_x93 * _x99;
_x106 = max(_x106,smoothstep(_x102,_x102 * 0.3,_x104));
}
_x73 = mix(_x73,_x105,_x106 * 0.7);
}
else if (blendType==3){
vec2 _x107 = vec2(0.0);
for (int _x24 = 0; _x24 < 5; _x24++){
if (_x24>=vline) break;
float _x108 = _x5(_x4(vec2(0.3 + float(_x24),0.1)),0.0,1.0,30.0,70.0);
float _x35 = _x5(_x4(vec2(0.21 + float(_x24),0.72)),0.0,1.0,3.0,10.0);
float _x36 = _x5(_x4(vec2(0.87 + float(_x24),0.38)),0.0,1.0,60.0,120.0);
float _x37 = _x5(_x4(vec2(0.31 + float(_x24),0.28)),0.0,1.0,30.0,50.0);
float _x38 = _x5(_x4(vec2(0.27 + float(_x24),0.69)),0.0,1.0,30.0,70.0);
float _x89 = _x5(_x4(vec2(0.41 + float(_x24),0.51)),0.0,1.0,0.01,0.4);
float _x109 = sin(_x73.x * _x38 + _x73.y * _x36)* cos(_x73.y * _x37);
float _x110 = cos(_x73.y * _x89 + _x73.x * _x108)* tan(_x73.x * _x35);
_x107+=vec2(_x110,_x109);
}
_x73+=_x107 * 0.001;
}
else if (blendType==4){
vec2 _x107 = vec2(0.0);
for (int _x24 = 0; _x24 < 5; _x24++){
if (_x24>=hline) break;
float _x108 = _x5(_x4(vec2(0.3 + float(_x24),0.1)),0.0,1.0,30.0,70.0);
float _x35 = _x5(_x4(vec2(0.21 + float(_x24),0.72)),0.0,1.0,3.0,10.0);
float _x36 = _x5(_x4(vec2(0.87 + float(_x24),0.38)),0.0,1.0,60.0,120.0);
float _x37 = _x5(_x4(vec2(0.31 + float(_x24),0.28)),0.0,1.0,30.0,50.0);
float _x38 = _x5(_x4(vec2(0.27 + float(_x24),0.69)),0.0,1.0,30.0,70.0);
float _x89 = _x5(_x4(vec2(0.41 + float(_x24),0.51)),0.0,1.0,0.01,0.4);
float _x110 = sin(_x73.y * _x38 + _x73.x * _x36)* cos(_x73.x * _x37);
float _x109 = cos(_x73.x * _x89 + _x73.y * _x108)* tan(_x73.y * _x35);
_x107+=vec2(_x110,_x109);
}
_x73+=_x107 * 0.001;
}
else if (blendType==5){
float _x111 = blendA > 0.0 ? blendA : 0.01;
float _x112 = blendB > 0.0 ? blendB : 25.0;
float _x113 = _x5(_x4(vec2(0.44,0.67)),0.0,1.0,15.0,40.0);
vec2 _x114 = _x72 * _x113;
vec2 _x115 = _x12(_x114);
float _x116 = _x115.y - _x115.x;
vec2 _x117 = _x12(_x114 * 2.5);
float _x118 = _x117.y - _x117.x;
float _x119 = max( smoothstep(0.05,0.4,_x116), smoothstep(0.1,0.5,_x118)* 0.6 );
vec2 _x120 = _x9(_x62 * _x111 * _x74);
vec2 _x121 = _x72 + _x120 * _x61 * _x112 * 3.0;
_x73 = mix(_x73,_x121,_x119 * 0.8);
}
else if (blendType==6){
float _x122 = _x5(_x4(vec2(0.32,0.13)),0.0,1.0,0.04,0.12);
float _x123 = _x5(_x4(vec2(0.21,0.55)),0.0,1.0,0.04,0.12);
vec2 _x124 = floor(_x72 / vec2(_x122,_x123));
float _x125 =(_x4(_x124 + vec2(0.0,radSeed))- 0.5)* 0.03;
float _x126 =(_x4(_x124 + vec2(radSeed,0.0))- 0.5)* 0.03;
vec2 _x127 = _x72 + vec2(_x125,_x126);
_x73 = mix(_x73,_x127,0.8);
}
else if (blendType==7){
float _x35 = _x5(_x4(vec2(0.32,0.12)),0.0,1.0,0.0,0.45);
float _x36 = _x5(_x4(vec2(0.21,0.72)),0.0,1.0,0.0,0.45);
float _x37 = _x5(_x4(vec2(0.87,0.38)),0.0,1.0,0.55,1.0);
float _x38 = _x5(_x4(vec2(0.31,0.28)),0.0,1.0,0.55,1.0);
vec2 _x90 = vec2(_x35,_x36);
vec2 _x91 = vec2(_x37,_x38);
vec2 _x92 = _x72 - _x90;
vec2 _x93 = _x72 - _x91;
float _x128 = atan(_x92.y,_x92.x);
float _x129 = atan(_x93.y,_x93.x);
float _x130 = length(_x92)* 0.995;
float _x131 = length(_x93)* 0.998;
float _x132 = blendA > 0.0 ? blendA : 1.0;
float _x133 = blendB > 0.0 ? blendB : 1.0;
float _x134 = _x130 * _x132 * 0.15;
float _x135 = _x131 * _x132 * 0.08;
float _x136 = _x128 + _x134 * _x133;
float _x137 = _x129 + _x135 * _x133 * 0.8;
vec2 _x138 = _x90 + vec2(cos(_x136),sin(_x136))* _x130;
vec2 _x139 = _x91 + vec2(cos(_x137),sin(_x137))* _x131;
float _x140 = 0.15;
float _x141 = 0.25;
float _x142 = exp(-_x130 * _x130 /(2.0 * _x140 * _x140));
float _x143 = exp(-_x131 * _x131 /(2.0 * _x141 * _x141));
float _x144 = max(_x142,_x143);
vec2 _x145 = mix(_x138,_x139,_x143 /(_x142 + _x143 + 0.001));
_x73 = mix(_x73,_x145,_x144);
}
else if (blendType==8){
vec2 _x146 = _x73;
if (_x59.y > _x59.x){
_x146.y*=_x59.y / _x59.x;
_x146.y-=(_x59.y * 0.5 - _x59.x * 0.5)/ _x59.x;
}
else {
_x146.x*=_x59.x / _x59.y;
_x146.x-=(_x59.x * 0.5 - _x59.y * 0.5)/ _x59.y;
}
float _x89 = _x5(_x4(vec2(0.3,0.1)),0.0,1.0,-2.0,2.0);
float _x147 = _x5(_x4(vec2(0.61,0.15)),0.0,1.0,-2.0,2.0);
_x146+=vec2(_x89,_x147);
float _x148 = cellT > 0.0 ? cellT : 1.0;
float _x35 = _x5(_x4(vec2(0.16,0.73)),0.0,1.0,0.3,0.8);
_x146*=_x35 / _x148;
float _x36 = _x5(_x4(vec2(0.16,0.73)),0.0,1.0,30.0,70.0);
vec2 _x115 = _x12(_x146 * _x36 *(0.1 + 1.0 - dot(_x146,_x146)* 2.0));
float _x37 = _x5(_x4(vec2(0.16,0.73)),0.0,1.0,0.1,0.4);
float _x149 = _x37 +(_x115.y - _x115.x);
float _x150 = smoothstep(0.05,0.3,_x115.x);
float _x151 = step(0.4,_x149)* _x150;
float _x38 = _x5(_x4(vec2(0.16,0.73)),0.0,1.0,300.1,1000.1);
float _x152 = _x151 * _x38;
vec2 _x153 = _x9(_x62 * 0.01 * _x74);
vec2 _x154 = smoothstep(-0.2,0.2,_x153);
_x73+=_x154 * _x61 * _x152;
}
_x73 = clamp(_x73,vec2(0.0),vec2(1.0));
float _x155 = _x5(_x4(vec2(0.22,0.72)),0.0,1.0,0.0016,0.0024);
if (_x78 < 0.3){
float _x156 = _x11(_x62 * _x155)* 0.85;
float _x157 = smoothstep(0.6,0.8,_x156);
float _x158 = _x5(_x4(vec2(0.37,0.69)),0.0,1.0,-0.2,0.2);
float _x159 = _x5(_x4(vec2(0.46,0.52)),0.0,1.0,-0.2,0.2);
_x73 = mix(_x73,_x73 + vec2(_x158,_x159),_x157);
}
else if (_x78>=0.3&&_x78 < 0.8){
float _x156 = _x10(_x62 * _x155 + seed);
if (_x156 > 0.7){
_x73*=0.7;
}
}
if (isTypeMapMode==1){
_x73 = clamp(_x73,vec2(0.0),vec2(1.0));
vec2 _x160 =(floor(_x72 * uCanvas)+ 0.5)/ uCanvas;
vec2 _x161 =(floor(_x73 * uCanvas)+ 0.5)/ uCanvas;
vec4 _x162 = T(tex0,_x160);
vec4 _x163 = T(tex0,_x161);
if (lastStrokeOnly==1){
vec4 _x164 = T(lastStrokeTex,_x73);
float _x165 = dot(_x164.rgb,vec3(0.299,0.587,0.114));
float _x166 = 1.0 - smoothstep(0.85,0.98,_x165);
float _x167 = _x166 * _x63;
finalColor =(_x167 > 0.01)? _x163 : _x162;
return;
}
bool _x168 = _x162.r > 0.01;
bool _x169 = _x163.r > 0.01;
if (_x168&&_x169){
finalColor =(_x163.r < _x162.r)? _x163 : _x162;
}
else {
finalColor =(_x163.r > _x162.r)? _x163 : _x162;
}
return;
}
vec4 _x170 = T(tex0,_x72);
vec4 _x171 = T(tex0,_x73);
vec4 _x172 = min(_x170,_x171);
{
float _x173 = max(max(_x170.r,_x170.g),_x170.b)- min(min(_x170.r,_x170.g),_x170.b);
float _x174 = max(max(_x171.r,_x171.g),_x171.b)- min(min(_x171.r,_x171.g),_x171.b);
bool _x175 = _x173 < 0.05;
bool _x176 = _x174 < 0.05;
if (_x175!=_x176){
vec3 _x177 = _x175 ? _x171.rgb : _x170.rgb;
vec3 _x178 = _x175 ? _x170.rgb : _x171.rgb;
float _x179 = dot(_x177,vec3(0.299,0.587,0.114));
float _x180 = dot(_x178,vec3(0.299,0.587,0.114));
if (_x180 < _x179&&_x179 > 0.001){
_x172.rgb = _x177 *(_x180 / _x179);
}
else {
_x172.rgb = _x177;
}
_x172.a = min(_x170.a,_x171.a);
}
else {
float _x181 = max(max(_x172.r,_x172.g),_x172.b);
float _x182 = min(min(_x172.r,_x172.g),_x172.b);
float _x183 = _x181 - _x182;
if (_x183 > 0.0&&_x183 < 0.05){
float _x184 = dot(_x172.rgb,vec3(0.299,0.587,0.114));
_x172.rgb = vec3(_x184);
}
}
}
float _x185 = whiteDot > 0.0 ? whiteDot : 0.01;
float _x186 = _x10(_x62 * _x185);
if (_x186 > 0.9){
_x172.rgb+=(_x186 - 0.5)* 0.05;
}
float _x187 = _x5(_x4(vec2(0.21,0.95)),0.0,1.0,0.008,0.02);
float _x188 = _x8(vec2(_x62 * _x187 / 100.0 + radSeed));
if (_x188 > 0.9&&doBigShape > 0.5){
vec3 _x189 = vec3(0.05);
float _x190 = fract(_x186 * 10.0);
float _x191 = seed * 10.0;
if (_x190 < 0.3){
float _x192 = abs(sin(atan(_x62.y - 0.5,_x62.x - 0.5)* 5.0 + _x191))* 0.5 + 0.5;
_x189*=_x192;
}
else if (_x190 < 0.6){
float _x193 = smoothstep(0.1,0.2,length(_x62 - 0.5));
_x189*=_x193;
}
else {
float _x194 = smoothstep(0.1,0.2,abs(fract((_x62.y + _x62.x)* 10.0 + _x191)- 0.5));
_x189*=_x194;
}
_x172.rgb+=_x189 * 0.05;
}
float _x195 = colorDeep > 0.0 ? colorDeep : 0.0;
if (_x195 > 0.001){
float _x196 = _x5(_x4(vec2(0.32,0.12)),0.0,1.0,0.3,0.5);
float _x197 =(_x10(_x62 * _x196)- 0.5)* _x195;
vec3 _x198 = _x6(_x172.rgb);
float _x199 = _x5(_x4(vec2(0.22,0.72)),0.0,1.0,0.001,0.003);
float _x200 = 0.0;
if (_x78 > 0.6){
_x200 = _x11(_x62 * _x199);
}
else {
_x200 = _x10(_x62 * _x199 + seed);
}
float _x201 = smoothstep(0.3,0.7,_x200);
float _x202 = dot(_x172.rgb,vec3(0.299,0.587,0.114));
if (_x202 < 0.7){
float _x203 =(doMask > 0.05)? _x197 * _x201 : _x197;
if (_x198.y < 0.1){
_x172.rgb+=_x203;
}
else {
_x198.z+=_x203;
_x172.rgb = _x7(_x198);
}
}
}
if (lastStrokeOnly==1){
vec2 _x204 = _x73;
vec4 _x205 = T(lastStrokeTex,_x204);
float _x206 = dot(_x205.rgb,vec3(0.299,0.587,0.114));
float _x207 = 1.0 - smoothstep(0.85,0.98,_x206);
vec4 _x208 = T(tex0,_x73);
vec4 _x209 = mix(_x170,_x208,_x207 * _x63);
finalColor = _x209;
}
else {
finalColor = mix(_x170,_x172,_x63);
}
}`,Eu=`in vec2 vPixel;
out vec4 finalColor;
uniform vec2 uCanvas;
vec4 T(sampler2D s, vec2 c) { return texture(s, vec2(c.x, 1.0 - c.y)); }
vec2 inkFragCoord() { return vec2(vPixel.x, uCanvas.y - vPixel.y); }
uniform sampler2D tex0;
uniform sampler2D bugsMask;
uniform sampler2D bugsData;
uniform float time;
uniform vec2 resolution;
uniform float metallicStrength;
uniform float flowSpeed;
uniform vec2 lightPos;
uniform float specularPower;
uniform float fresnelStrength;
uniform vec3 metalTint;
#define PI 3.14159265359
#define TAU 6.28318530718
const float _x0 = 2.418;
const float _x1 = 2.408;
const float _x2 = 2.424;
const float _x3 = 2.432;
const vec3 _x4 = vec3(0.98,0.95,0.9);
const int _x5 = 3;
vec2 _x7(vec2 _x17,float _x72){
vec2 _x18;
_x18.x = sin(_x17.y * 6.0 + _x72)* 0.05;
_x18.y = cos(_x17.x * 6.0 + _x72 * 0.8)* 0.05;
return _x17 + _x18;
}
vec2 _x8(vec2 _x17,vec2 _x19,vec3 _x23){
vec2 _x20 = _x17 - _x19;
vec2 _x21 = _x20 / max(_x23.z,0.1);
return _x21 * 0.5 + 0.5;
}
vec2 _x9(vec2 _x22,vec3 _x23,float ior){
vec2 _x24 = normalize(_x23.xy);
float _x25 = -dot(normalize(_x22),_x24);
float _x26 = 1.0 - _x25 * _x25;
float _x27 = _x26 /(ior * ior);
if (_x27 > 1.0){
return reflect(_x22,_x24);
}
float _x28 = sqrt(1.0 - _x27);
vec2 _x29 =(_x22 / ior)+ _x24 *(_x25 / ior - _x28);
return normalize(_x29);
}
float _x10(vec2 _x22,vec3 _x23,float ior){
vec2 _x24 = normalize(_x23.xy);
float _x25 = clamp(dot(-normalize(_x22),_x24),-1.0,1.0);
float _x30 = pow((1.0 - ior)/(1.0 + ior),2.0);
float _x31 = _x30 +(1.0 - _x30)* pow(1.0 - _x25,5.0);
return clamp(_x31,0.0,0.95);
}
float _x11(vec2 _x65){
return fract(sin(dot(_x65,vec2(127.1,311.7)))* 43758.5453123);
}
float _x12(vec2 _x65){
vec2 _x32 = floor(_x65);
vec2 _x33 = fract(_x65);
_x33 = _x33 * _x33 *(3.0 - 2.0 * _x33);
float _x34 = _x11(_x32);
float _x35 = _x11(_x32 + vec2(1.0,0.0));
float _x36 = _x11(_x32 + vec2(0.0,1.0));
float _x37 = _x11(_x32 + vec2(1.0,1.0));
return mix(mix(_x34,_x35,_x33.x),mix(_x36,_x37,_x33.x),_x33.y);
}
float _x13(vec2 _x17,vec2 _x19,float _x72){
vec2 _x38 =(_x17 - _x19)* 20.0;
float _x39 = _x12(_x38 + _x72 * 0.1);
float _x40 = _x12(_x38 * 2.0 - _x72 * 0.15);
float _x41 = atan(_x38.y,_x38.x);
float _x42 = length(_x38);
float _x43 = sin(_x41 * 8.0)* 0.5 + 0.5;
_x43 = pow(_x43,2.0);
float _x44 = _x39 * 0.3 + _x40 * 0.2 + _x43 * 0.5;
return _x44;
}
vec3 _x14(vec2 _x17,vec2 _x19,float _x72){
vec2 _x38 =(_x17 - _x19)* 0.5;
float _x45 = _x72 * flowSpeed * 5.0;
float _x39 = _x12(_x38 * 0.3 + vec2(_x45 * 0.5,_x45 * 0.3));
float _x40 = _x12(_x38 * 0.8 + vec2(_x45 * 0.6,_x45 * 0.4));
float _x46 = _x12(_x38 * 2.0 + vec2(_x45 * 0.7,_x45 * 0.5));
float _x47 = _x11(_x38 * 5.0 + _x45 * 0.3);
float _x48 = _x11(_x38 * 10.0 + _x45 * 0.2);
float _x41 = atan(_x38.y,_x38.x);
float _x42 = length(_x38);
float _x49 = sin(_x41 * 4.0 + _x42 * 0.3 + _x45 * 0.6)* 0.5 + 0.5;
_x49 = pow(_x49,2.5);
float _x50 = _x12(_x38 * 1.2 + vec2(sin(_x45 * 0.8),cos(_x45 * 0.8))* 2.0);
_x50 = pow(_x50,1.8);
vec2 _x51 = vec2(_x11(_x38 * 1.5 + _x45 * 0.2),_x11(_x38 * 1.5 + _x45 * 0.2 + 1.0))* 2.0 - 1.0;
float _x52 = _x12(_x38 * 0.8 + _x51 * 2.0);
float _x53 = _x11(_x38 * 8.0 + _x45 * 0.1);
_x53 = pow(_x53,0.5);
float _x54 = _x39 * 0.2 + _x40 * 0.18 + _x46 * 0.15 + _x47 * 0.12 + _x48 * 0.1 + _x49 * 0.1 + _x50 * 0.08 + _x52 * 0.05 + _x53 * 0.02;
_x54 = pow(_x54,0.15);
_x54 = _x54 * 5.0 - 1.0;
_x54 = clamp(_x54,0.0,1.0);
_x54 = smoothstep(0.05,0.6,_x54);
_x54 = pow(_x54,0.9);
vec3 _x55 = vec3(0.12,0.08,0.06);
vec3 _x56 = vec3(0.35,0.22,0.15);
vec3 _x57 = vec3(0.55,0.40,0.30);
vec3 _x58 = mix(_x55,_x57,_x54);
_x58 = mix(_x58,_x56,0.6);
float _x59 = 1.0 - _x54;
_x58 = mix(_x58,vec3(0.03,0.02,0.01),_x59 * 0.9);
float _x60 = _x11(_x38 * 12.0 + _x45 * 0.05);
_x60 = pow(_x60,2.0);
_x58 = mix(_x58,_x58 * 1.1,_x60 * _x54 * 0.3);
return _x58;
}
float _x15(vec2 _x65){
float _x61 = _x11(_x65 * 100.0);
float _x62 = _x11(_x65 * 50.0);
float _x63 = _x12(_x65 * 30.0);
float _x64 = _x61 * 0.5 + _x62 * 0.3 + _x63 * 0.2;
_x64 = pow(_x64,0.7);
_x64 = _x64 * 1.3 - 0.15;
_x64 = clamp(_x64,0.0,1.0);
return _x64;
}
float _x16(vec2 _x65,float _x72){
float _x66 = _x12(_x65 * 80.0);
float _x67 = _x11(_x65 * 120.0 + _x72 * 0.0001);
float _x68 = _x66 * 0.6 + _x67 * 0.4;
_x68 = pow(_x68,0.65);
_x68 = _x68 * 1.4 - 0.2;
_x68 = clamp(_x68,0.0,1.0);
return _x68;
}
void main(){
vec2 _x17 = inkFragCoord() / resolution.xy;
vec4 _x69 = T(tex0,_x17);
vec4 _x70 = T(bugsMask,_x17);
float _x71 = _x70.a;
if (_x71 < 0.01){
finalColor = _x69;
return;
}
float _x72 = time * 0.0005;
vec2 _x73 = 1.0 / resolution.xy;
float _x74 = _x70.a;
float _x75 = T(bugsMask,_x17 + vec2(_x73.x,0.0)).a;
float _x76 = T(bugsMask,_x17 + vec2(0.0,_x73.y)).a;
float _x77 =(_x75 - _x74)* resolution.x * 0.5;
float _x78 =(_x76 - _x74)* resolution.y * 0.5;
vec3 _x23 = normalize(vec3(_x77,_x78,sqrt(clamp(1.0 - _x77 * _x77 - _x78 * _x78,0.0,1.0))));
float _x79 = _x16(_x17 * resolution.xy,_x72);
_x23.xy+=(_x79 - 0.5)* 0.06;
_x23 = normalize(_x23);
vec4 _x80 = T(bugsData,_x17);
vec2 _x81 = _x80.rg;
if (_x81==vec2(0.0)){
_x81 = _x17;
}
float _x82 = _x11(_x81 * 100.0);
float _x83 = _x11(_x81 * 100.0 + vec2(123.4,567.8));
float _x84 = abs(metalTint.r - metalTint.g);
float _x85 = abs(metalTint.g - metalTint.b);
float _x86 = abs(metalTint.r - metalTint.b);
float _x87 = max(max(_x84,_x85),_x86);
bool _x88 = _x87 < 0.05;
bool _x89 = metalTint.b > metalTint.r&&metalTint.b > metalTint.g&& metalTint.r > 0.9&&metalTint.g > 0.9&&metalTint.b > 0.95;
bool _x90 = metalTint.r < 0.2&&metalTint.g < 0.15&&metalTint.b < 0.1&& metalTint.r > metalTint.g&&metalTint.g > metalTint.b;
float _x91 = 0.7 + _x82 * 0.6;
if (_x89){
_x91 =(0.5 + _x82 * 0.3);
}
float _x92 = _x72 * _x91 * flowSpeed;
vec2 _x93 = _x8(_x17,_x81,_x23);
vec2 _x94 = _x7(_x93,_x92);
vec3 _x95 = vec3(0.0,0.0,-1.0);
float _x96 = 1.0 - pow(clamp(dot(_x23,-_x95),0.0,1.0),1.0);
_x96*=fresnelStrength;
float _x97 = 0.0;
if (_x71 > 0.05){
float _x98 = T(bugsMask,_x17 - vec2(_x73.x,0.0)).a;
float _x99 = T(bugsMask,_x17 - vec2(0.0,_x73.y)).a;
float _x100 = abs(_x75 - _x74)+ abs(_x76 - _x74);
float _x101 = smoothstep(0.0,0.3,_x100)* 0.4;
float _x102 = T(bugsMask,_x17 - vec2(_x73.x * 2.0,0.0)).a;
float _x103 = T(bugsMask,_x17 + vec2(_x73.x * 2.0,0.0)).a;
float _x104 = T(bugsMask,_x17 + vec2(0.0,_x73.y * 2.0)).a;
float _x105 = T(bugsMask,_x17 - vec2(0.0,_x73.y * 2.0)).a;
float _x106 = abs(_x103 - _x102)+ abs(_x104 - _x105);
float _x107 = smoothstep(0.0,0.4,_x106 * 0.5)* 0.25;
float _x108 = T(bugsMask,_x17 - vec2(_x73.x * 3.0,0.0)).a;
float _x109 = T(bugsMask,_x17 + vec2(_x73.x * 3.0,0.0)).a;
float _x110 = T(bugsMask,_x17 + vec2(0.0,_x73.y * 3.0)).a;
float _x111 = T(bugsMask,_x17 - vec2(0.0,_x73.y * 3.0)).a;
float _x112 = abs(_x109 - _x108)+ abs(_x110 - _x111);
float _x113 = smoothstep(0.0,0.5,_x112 * 0.3)* 0.15;
_x97 = max(_x101,max(_x107,_x113));
}
_x96 = mix(_x96,_x97,0.3);
vec2 _x114 = vec2((_x82 - 0.5)* 0.3,(_x83 - 0.5)* 0.3);
vec2 _x115 = lightPos + _x114;
vec3 _x116 = vec3(_x115,0.5);
vec3 _x117 = normalize(_x116 - vec3(_x17,0.0));
float _x118 = clamp(dot(_x23,_x117),0.0,1.0);
float _x119 = 0.75 + 0.25 * _x118;
vec3 _x120 = normalize((_x117 - _x95)* 0.5);
float _x121 = clamp(dot(_x23,_x120),0.0,1.0);
float _x122 = 0.2 + _x83 * 0.3;
if (_x89){
_x122 = 0.05 + _x83 * 0.05;
}
float _x123 = pow(_x121,1.0 / pow(_x122 + 0.1,4.0))*(1.0 - _x122);
if (_x89){
_x123 = pow(_x121,1.0 / pow(_x122 + 0.01,4.0))* 1.5;
}
float _x124 = 1.2 + _x82 * 0.6;
if (_x90){
_x124 = 1.2 + _x82 * 0.6;
}
vec3 _x125;
if (_x89){
vec2 _x126 = normalize(_x17 - _x81);
float _x127 = _x10(_x126,_x23,_x0);
vec2 _x128 = _x9(_x126,_x23,_x1);
vec2 _x129 = _x9(_x126,_x23,_x2);
vec2 _x130 = _x9(_x126,_x23,_x3);
vec2 _x131 = reflect(_x126,normalize(_x23.xy));
vec2 _x132 = _x81 + _x128 * 0.3;
vec2 _x133 = _x81 + _x129 * 0.3;
vec2 _x134 = _x81 + _x130 * 0.3;
vec2 _x135 = _x81 + _x131 * 0.3;
vec2 _x136 = _x7(_x132,_x92);
vec2 _x137 = _x7(_x133,_x92);
vec2 _x138 = _x7(_x134,_x92);
vec2 _x139 = _x7(_x135,_x92);
float _x140 = _x12(_x136 * 15.0);
float _x141 = _x12(_x137 * 15.0);
float _x142 = _x12(_x138 * 15.0);
float _x143 = _x12(_x139 * 15.0);
_x140 = pow(_x140,1.3);
_x141 = pow(_x141,1.3);
_x142 = pow(_x142,1.3);
_x143 = pow(_x143,1.3);
vec3 _x144 = vec3(_x140,_x141,_x142)* _x4;
vec3 _x145 = vec3(_x143)* _x4;
float _x146 = _x13(_x17,_x81,_x92);
_x146 = _x146 * 0.3 + 0.7;
_x125 = mix(_x144,_x145,_x127)* _x146;
_x125*=2.5;
}
else if (_x90){
_x124 = 1.2 + _x82 * 0.6;
float _x147 = _x12(_x94 * 20.0);
float _x148 = _x12(_x94 * 10.0)* 0.5;
float _x149 = _x15(_x17 * resolution.xy)* 0.4;
float _x150 = _x147 + _x148 + _x149;
_x150 = pow(_x150,1.8);
_x150 = _x150 * 1.2 - 0.1;
_x150 = clamp(_x150,0.0,1.0);
vec3 _x151 = vec3(_x150);
float _x152 = 1.0 - _x96 * 0.4;
_x125 = _x151 * _x152 * 1.5 * _x124;
}
else {
_x124 = 1.2 + _x82 * 0.6;
float _x147 = _x12(_x94 * 20.0);
float _x148 = _x12(_x94 * 10.0)* 0.5;
float _x149 = _x15(_x17 * resolution.xy)* 0.4;
float _x150 = _x147 + _x148 + _x149;
_x150 = pow(_x150,1.8);
_x150 = _x150 * 1.2 - 0.1;
_x150 = clamp(_x150,0.0,1.0);
vec3 _x151 = vec3(_x150);
float _x152 = 1.0 - _x96 * 0.4;
_x125 = _x151 * _x152 * 1.5 * _x124;
}
vec3 _x153;
vec3 _x154;
if (_x88){
float _x155 = 0.95 + _x82 * 0.1;
_x153 = metalTint * _x155;
_x154 = _x153;
}
else if (_x89){
_x153 = _x4;
_x154 = _x4;
}
else if (_x90){
_x153 = vec3(0.35,0.22,0.15);
_x154 = _x153;
}
else {
vec3 _x156 = vec3(0.95 + _x82 * 0.1,0.95 + _x83 * 0.1,0.95 + _x11(_x81 * 200.0)* 0.1);
_x153 = metalTint * _x156;
_x154 = mix(_x70.rgb,_x153,0.95);
}
vec3 _x157;
if (_x89){
_x157 = _x125;
vec3 _x158 = vec3(1.0,1.0,1.1)* 2.0;
_x158 = clamp(_x158,vec3(0.0),vec3(1.0));
float _x159 = _x123 * 2.0;
_x157 = mix(_x157,_x158,_x159);
}
else if (_x90){
_x157 = _x119 * _x154 * _x125;
vec3 _x160 = _x153 * 1.5;
_x160 = clamp(_x160,vec3(0.0),vec3(1.0));
_x157 = mix(_x157,_x160,_x123);
}
else {
_x157 = _x119 * _x154 * _x125;
vec3 _x160 = _x153 * 1.5;
_x160 = clamp(_x160,vec3(0.0),vec3(1.0));
_x157 = mix(_x157,_x160,_x123);
}
if (!_x89){
if (_x90){
_x157 = pow(_x157,vec3(0.85));
_x157*=1.08;
}
else {
_x157 = pow(_x157,vec3(0.85));
_x157*=1.08;
}
}
if (_x88){
float _x161 = dot(_x157,vec3(0.299,0.587,0.114));
_x157 = vec3(_x161);
}
else if (_x89){
}
else if (_x90){
float _x161 = dot(_x157,vec3(0.299,0.587,0.114));
vec3 _x162 = vec3(_x161);
_x157 = mix(_x162,_x157,0.85);
}
else {
float _x161 = dot(_x157,vec3(0.299,0.587,0.114));
vec3 _x162 = vec3(_x161);
_x157 = mix(_x162,_x157,0.8);
}
float _x163 = 1.0 - _x97 * 0.5;
_x157*=_x163;
if (!_x88&&!_x89&&!_x90){
float _x164 = dot(_x157,vec3(0.299,0.587,0.114));
vec3 _x165 = vec3(_x164);
_x157 = mix(_x157,_x165,_x97 * 0.6);
}
if (_x89){
float _x164 = dot(_x157,vec3(0.299,0.587,0.114));
_x157.r = mix(_x157.r,_x157.r * 1.1,_x97 * 0.3);
_x157.b = mix(_x157.b,_x157.b * 1.15,_x97 * 0.3);
}
if (!_x89){
float _x166 = _x15(_x17 * resolution.xy);
float _x167 = _x11(_x17 * resolution.xy * 2.0);
_x167 = pow(_x167,0.8);
float _x168 = _x166 * 0.7 + _x167 * 0.3;
float _x169 = dot(_x157,vec3(0.299,0.587,0.114));
float _x170 =(_x168 - 0.5)* 2.0;
float _x171 = mix(0.08,0.20,_x169);
float _x172 = _x170 * _x171;
_x157+=_x172;
}
_x157 = clamp(_x157,0.0,1.0);
vec3 _x173;
if (_x88||_x89||_x90){
_x173 = _x157;
}
else {
_x173 = mix(_x70.rgb,_x157,metallicStrength * _x71);
}
vec3 _x174;
if (_x89||_x90){
vec3 _x175 = vec3(0.0);
_x174 = mix(_x175,_x173,_x71 * metallicStrength);
}
else {
_x174 = mix(_x69.rgb,_x173,_x71);
}
if (_x88){
float _x176 =(_x174.r + _x174.g + _x174.b)/ 3.0;
_x174 = vec3(_x176);
}
else if (_x89){
float _x176 =(_x174.r + _x174.g + _x174.b)/ 3.0;
_x174.b = mix(_x176,_x174.b,0.1);
_x174.r = mix(_x176,_x174.r,0.05);
_x174.g = mix(_x176,_x174.g,0.05);
}
if (_x71 > 0.01&&!_x90){
float _x169 = dot(_x174,vec3(0.299,0.587,0.114));
const float _x6 = 0.3;
if (_x169 < _x6){
float _x177 = _x6 / max(_x169,0.01);
_x174*=_x177;
_x174 = min(_x174,vec3(1.0));
}
}
_x174 = clamp(_x174,0.0,1.0);
finalColor = vec4(_x174,_x69.a);
}`,Cn={minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0},ma=`
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
`;class Tu{width;height;pass;engine=new tu;seed;background;wet;pingPong;scratch;final;typeMap;display;force;lastStroke;bugsMask;bugsData;base;blank;feedback;encode;typeEncode;composite;realtime;forceMap;distort;flow;metallic;washColor;washType;forceSeeds;materials;stroke={...Cn};pathBounds={...Cn};lastRect;strokeFrames=0;frameCount=2;serial=0;pendingFinish;strokeSeed=0;live;disposed=!1;constructor(e,t){this.width=Math.max(2,Math.round(t.width)),this.height=Math.max(2,Math.round(t.height)),this.seed=t.seed??1234567890,this.background=t.background??[214,206,188],this.pass=new fu(e,this.width,this.height);const n=()=>this.pass.target();this.wet=n(),this.pingPong=n(),this.scratch=n(),this.final=n(),this.typeMap=n(),this.display=n(),this.force=n(),this.lastStroke=n(),this.bugsMask=n(),this.bugsData=n(),this.blank=Yr(),this.base=this.makeBase(t);const r=this.forceParams();this.forceSeeds=r.seeds;const s=this.width,a=this.height,o=this.background;this.feedback=this.pass.material(pu,{tex0:_t(this.wet.texture),forceMap:_t(this.force.texture),force:ie(1),indiffusionStrength:ie(.45),brushMode:ie(1),baseBrushSize:ie(2),useSharpen:ie(0),effect3Brightness:ie(.2),brushColorMode:ie(0),brushCategory:ie(0),mouseCount:ie(0),mouseCountAccumulated:ie(0),strokeSeed:ie(0)},1),this.feedback.transparent=!0,this.feedback.premultipliedAlpha=!1,this.encode=this.pass.material(mu,{baseTex:_t(this.final.texture),strokeTex:_t(this.wet.texture),typeMapTex:_t(this.typeMap.texture),brushColorMode:ie(0),brushCategory:ie(0),whiteMaxOpacity:ie(.95),hueShift:ie(0),satShift:ie(0),briShift:ie(0),keyBlendMode:ie(0),useSharpen:ie(0),canvasBackgroundColor:gi(o[0]/255,o[1]/255,o[2]/255),customBrushColor:gi(.10196078431372549,.10196078431372549,.10196078431372549),useSpectralMix:ie(0)}),this.typeEncode=this.pass.material(gu,{baseTex:_t(this.typeMap.texture),strokeTex:_t(this.wet.texture),brushCategory:ie(0),whiteMaxOpacity:ie(.95)}),this.composite=this.pass.material(vu,{baseTex:_t(this.base),encodedTex:_t(this.final.texture),typeMapTex:_t(this.typeMap.texture),useSharpen:ie(0),brushColorMode:ie(0)}),this.realtime=this.pass.material(Su,{baseTex:_t(this.scratch.texture),addTex:_t(this.wet.texture),encodedTex:_t(this.final.texture),brushColorMode:ie(0),brushCategory:ie(0),brushColor:gi(.10196078431372549,.10196078431372549,.10196078431372549),whiteMaxOpacity:ie(.95),hueShift:ie(0),satShift:ie(0),briShift:ie(0),useSharpen:ie(0)}),this.forceMap=this.pass.material(Mu,{tex0:_t(this.blank),_x5:ie(0),_x6:ie(0),_x7:ie(0),_x8:ie(0),_x9:ie(0),_x10:ie(0),randomSeed2:ie(r.seeds[1]??200),randomSeed3:ie(r.seeds[2]??300),randomSeed4:ie(r.seeds[3]??400),scale2:ie(r.scales[1]??.005),scale3:ie(r.scales[2]??.015),amplitude2:ie(r.amplitudes[1]??.4),amplitude3:ie(r.amplitudes[2]??.3),phase2:ie(r.phases[1]??0),phase3:ie(r.phases[2]??0),vortexScale2:ie(r.vortexScales[1]??.012),clusterScale2:ie(r.clusterScales[1]??8e-4),canvasCenter:mi(s/2,a/2),time:ie(0)}),this.distort=this.pass.material(yu,{tex0:_t(this.display.texture),forceMap:_t(this.force.texture),time:ie(0),distortEnabled:ie(1),displacementB:ie(20),displacementC:ie(50),showFbmMask:ie(0),fbmSeed1:ie(this.forceSeeds[0]||100),fbmSeed2:ie(this.forceSeeds[1]||200),fbmSeed3:ie(this.forceSeeds[2]||300),fbmSeed4:ie(this.forceSeeds[3]||400),backgroundColor:gi(o[0]/255,o[1]/255,o[2]/255),rsEnabled:ie(0),rsFrequency:ie(300),rsWaveSpeed:ie(1),rsStrength:ie(.5),rsGradientMix:ie(.1),rsScale:ie(100),cellularEnabled:ie(0),cellularScale:ie(15),cellularSeed:ie(.5),whiteDotDensity:ie(0),grainAmount:ie(0)}),this.flow=this.pass.material(bu,{tex0:_t(this.final.texture),lastStrokeTex:_t(this.lastStroke.texture),lastStrokeOnly:ie(0),blendType:ie(0),blendVol:ie(100),radSeed:ie(0),strokeBounds:Au(0,0,1,1),pixD:ie(1),blendA:ie(.01),blendB:ie(25),directVol:ie(10),snoiseVol:ie(3),gobalStyle:ie(0),vline:ie(5),hline:ie(5),cellT:ie(1),colorDeep:ie(.015),whiteDot:ie(.01),doBigShape:ie(0),doMask:ie(.5),multiDir:ie(0),drawTime:ie(1),seed:ie(0),iTime:ie(0),pixelScale:ie(1),isTypeMapMode:ie(0)}),this.metallic=this.pass.material(Eu,{tex0:_t(this.display.texture),bugsMask:_t(this.blank),bugsData:_t(this.blank),time:ie(0),resolution:mi(s,a),metallicStrength:ie(.85),flowSpeed:ie(1),lightPos:mi(.5,.4),specularPower:ie(12),fresnelStrength:ie(.5),metalTint:gi(.72,.5,.35)}),this.washColor=this.pass.material(ma,{uSource:_t(this.final.texture),uCenter:mi(0,0),uRadius:ie(24),uTypeMode:ie(0)}),this.washType=this.pass.material(ma,{uSource:_t(this.typeMap.texture),uCenter:mi(0,0),uRadius:ie(24),uTypeMode:ie(1)}),this.materials=[this.feedback,this.encode,this.typeEncode,this.composite,this.realtime,this.forceMap,this.distort,this.flow,this.metallic,this.washColor,this.washType];const c=this.fullRect(),l=[1,1,1];this.pass.fill(this.wet,c,l),this.pass.fill(this.pingPong,c,l),this.pass.fill(this.final,c,l),this.pass.fill(this.lastStroke,c,l),this.pass.fill(this.typeMap,c,[0,0,0]),this.pass.draw(this.forceMap,this.force,c),this.pass.draw(this.composite,this.display,c)}get texture(){return this.display.texture}setBrush(e){this.engine.configure(e)}setColor(e){this.engine.setColor(e)}paint(e){this.setBrush(e.brush),this.setColor(e.color),this.pendingFinish=e.finish,this.strokePath(e.points,e.seed),this.pendingFinish=void 0}strokePath(e,t){if(this.disposed||!e.length)return;this.finishLive();const n=Kr(e,this.engine.mode===3),r=n[0];if(!r)return;this.pathBounds={...Cn};for(const c of n)vi(this.pathBounds,c.x,c.y,c.x,c.y);this.pressAt(r,t);let s=r;for(let c=1;c<n.length;c++){const l=n[c];l&&(this.engine.applyPressure(l.pressure),this.runFrame(!0,jn(l),s,!1),s=l)}const a=n[n.length-1]??r;this.runFrame(!0,jn(a),n[n.length-2]??r,!1),this.engine.release();for(let c=0;c<200&&this.engine.pendingCommit;c++)this.runFrame(!1,jn(a),a,!1);const o=this.pendingFinish;o&&this.applyFinish(o)}beginStroke(e,t,n=0){if(this.disposed)return;this.finishLive();const r=Kr([{x:e,y:t}],this.engine.mode===3)[0]??{x:e,y:t};this.live={down:!0,cursor:r,pmouse:r,pending:r,lift:0},this.pressAt(r,n,!0)}addPoint(e,t){this.live?.down&&(this.live.pending=Kr([{x:e,y:t}],this.engine.mode===3)[0]??{x:e,y:t})}endStroke(){this.live?.down&&(this.live.lift=1)}update(){const e=this.live;if(!(!e||this.disposed)){if(e.down&&e.lift>0&&(e.lift=0,e.down=!1,this.engine.release()),e.down){const t=e.pending??e.cursor;e.pmouse=e.cursor,e.cursor=t,e.pending=void 0,this.engine.applyPressure(t.pressure)}this.runFrame(e.down,jn(e.cursor),e.pmouse,!0),this.engine.pendingCommit||(this.live=void 0)}}wash(e,t,n){if(this.disposed)return;const r=this.clampRect({x:Math.floor(e-n-2),y:Math.floor(t-n-2),w:Math.ceil(n*2+4),h:Math.ceil(n*2+4)});r&&($r(this.washColor,"uCenter",e,t),$r(this.washType,"uCenter",e,t),Je(this.washColor,"uRadius",Math.max(1,n)),Je(this.washType,"uRadius",Math.max(1,n)),this.pass.draw(this.washColor,this.scratch,r),this.pass.copy(this.scratch,this.final,r),this.pass.draw(this.washType,this.scratch,r),this.pass.copy(this.scratch,this.typeMap,r),this.pass.draw(this.composite,this.display,r))}snapshot(){return{width:this.width,height:this.height,frameCount:this.frameCount,final:this.readTarget(this.final),typeMap:this.readTarget(this.typeMap),wet:this.readTarget(this.wet)}}restore(e){this.disposed||e.width!==this.width||e.height!==this.height||(this.blitBuffer(this.final,e.final),this.blitBuffer(this.typeMap,e.typeMap),this.blitBuffer(this.wet,e.wet),this.frameCount=e.frameCount,this.pass.draw(this.composite,this.display,this.fullRect()))}replayEffect(e){this.disposed||this.applyFinish(e)}clear(){if(this.disposed)return;this.live=void 0,this.engine.pendingCommit&&this.engine.committed();const e=this.fullRect(),t=[1,1,1];this.pass.fill(this.wet,e,t),this.pass.fill(this.pingPong,e,t),this.pass.fill(this.final,e,t),this.pass.fill(this.typeMap,e,[0,0,0]),this.pass.draw(this.composite,this.display,e),this.stroke={...Cn}}dispose(){if(!this.disposed){this.disposed=!0;for(const e of this.materials)e.dispose();for(const e of[this.wet,this.pingPong,this.scratch,this.final,this.typeMap,this.display,this.force,this.lastStroke,this.bugsMask,this.bugsData])e.dispose();this.base.dispose(),this.blank.dispose(),this.pass.dispose()}}pressAt(e,t,n=!1){this.engine.pendingCommit&&this.commit(),this.serial+=1,this.lastRect=void 0,this.stroke={...Cn},this.strokeFrames=0,this.engine.applyPressure(e.pressure);const r=jn(e);this.strokeSeed=t??this.seed+this.serial*7919>>>0,this.engine.press(r.x,r.y,this.strokeSeed),this.runFrame(!0,r,e,n)}runFrame(e,t,n,r){const s=this.engine.frame(e,t.x,t.y,n.x,n.y);this.frameCount+=1,this.strokeFrames+=1,s.ops.length&&this.drawOps(s.ops);const a=this.strokeRect();s.force!==void 0&&a&&(Je(this.forceMap,"time",this.frameCount/60),this.pass.draw(this.forceMap,this.force,a),this.applyShaderState(this.feedback,this.engine.shaderState()),Je(this.feedback,"force",s.force),this.pass.draw(this.feedback,this.pingPong,a),this.pass.copy(this.pingPong,this.wet,a),r&&this.showLive(a)),s.commit&&this.commit()}drawOps(e){const t={...Cn};for(const r of e)if(r.kind==="line"){const s=r.w/2+1;vi(t,Math.min(r.x0,r.x1)-s,Math.min(r.y0,r.y1)-s,Math.max(r.x0,r.x1)+s,Math.max(r.y0,r.y1)+s)}else if(r.kind==="dot")vi(t,r.x0-r.w/2-1,r.y0-r.w/2-1,r.x0+r.w/2+1,r.y0+r.w/2+1);else{const s=(r.w+r.h)/2+r.lw+1;vi(t,r.x0-s,r.y0-s,r.x0+s,r.y0+s)}const n=this.clampRect(ga(t,0));n&&(vi(this.stroke,t.minX,t.minY,t.maxX,t.maxY),this.pass.blitStamp(hu(e,n),n,this.wet))}strokeRect(){const e=this.engine.effect>=4?3*this.strokeFrames:0;return this.clampRect(ga(this.stroke,3+e))}commit(){const e=this.strokeRect(),t=this.engine.shaderState();if(this.engine.committed(),!e)return;this.applyShaderState(this.encode,t);const n=t.customBrushColor;Zr(this.encode,"customBrushColor",n[0]/255,n[1]/255,n[2]/255),this.pass.draw(this.encode,this.scratch,e),this.pass.copy(this.scratch,this.final,e),Je(this.typeEncode,"brushCategory",t.brushCategory),Je(this.typeEncode,"whiteMaxOpacity",t.whiteMaxOpacity),this.pass.draw(this.typeEncode,this.scratch,e),this.pass.copy(this.scratch,this.typeMap,e),this.pass.fill(this.lastStroke,this.fullRect(),[1,1,1]),this.pass.copy(this.wet,this.lastStroke,e),this.pass.fill(this.wet,e,[1,1,1]),this.pass.draw(this.composite,this.display,e),this.lastRect=e,this.stroke={...Cn}}showLive(e){const t=this.engine.shaderState();this.pass.draw(this.composite,this.scratch,e),this.applyShaderState(this.realtime,t);const n=t.brushColorMode===33?t.customBrushColor:Vr(t.brushColorMode);Zr(this.realtime,"brushColor",n[0]/255,n[1]/255,n[2]/255),Qn(this.realtime,"baseTex",this.scratch.texture),this.pass.draw(this.realtime,this.display,e)}finishLive(){if(this.live){this.live.down&&this.engine.release();for(let e=0;e<200&&this.engine.pendingCommit;e++)this.runFrame(!1,jn(this.live.cursor),this.live.cursor,!1);this.live=void 0}}applyShaderState(e,t){Je(e,"brushMode",t.brushMode),Je(e,"baseBrushSize",t.baseBrushSize),Je(e,"useSharpen",t.useSharpen),Je(e,"effect3Brightness",t.effect3Brightness),Je(e,"indiffusionStrength",t.indiffusionStrength),Je(e,"brushColorMode",t.brushColorMode),Je(e,"brushCategory",t.brushCategory),Je(e,"mouseCount",t.mouseCount),Je(e,"mouseCountAccumulated",t.mouseCountAccumulated),Je(e,"strokeSeed",t.strokeSeed),Je(e,"whiteMaxOpacity",t.whiteMaxOpacity),Je(e,"hueShift",t.hueShift),Je(e,"satShift",t.satShift),Je(e,"briShift",t.briShift),Je(e,"keyBlendMode",t.keyBlendMode),Je(e,"useSpectralMix",t.useSpectralMix)}applyFinish(e){const t=e.distort?.extent==="frame"?this.fullRect():this.effectRect();t&&(e.metallic&&this.applyMetallic(t,e.metallic.tint??[.72,.5,.35],e.metallic.size??10),e.distort&&this.applyDistort(t,e.distort.displacementB??20,e.distort.displacementC??50),e.flow&&this.applyFlow(e.flow.blendType,e.flow.iterations,e.flow.seed))}effectRect(){const e=this.lastRect;if(!e)return;const t=this.height-(e.y+e.h),n=Math.min(e.y,t),r=Math.max(e.y+e.h,t+e.h);return this.clampRect({x:e.x-24,y:n-24,w:e.w+48,h:r-n+48})}applyFlow(e,t,n){const r=this.pathBoundsNormalized(),s=this.effectRect();if(!r||!s)return;const a=Math.max(0,Math.floor(t)),o=n??this.strokeSeed%1e6;Je(this.flow,"blendType",e),Je(this.flow,"blendVol",100*(1+a*.1)),Je(this.flow,"radSeed",o*.001),Ru(this.flow,"strokeBounds",r.minX,r.minY,r.maxX,r.maxY),Je(this.flow,"seed",o*1e-4),Je(this.flow,"iTime",this.frameCount/60),Je(this.flow,"isTypeMapMode",0),Qn(this.flow,"tex0",this.final.texture),this.pass.draw(this.flow,this.scratch,s),this.pass.copy(this.scratch,this.final,s),Je(this.flow,"isTypeMapMode",1),Qn(this.flow,"tex0",this.typeMap.texture),this.pass.draw(this.flow,this.scratch,s),this.pass.copy(this.scratch,this.typeMap,s),this.pass.draw(this.composite,this.display,s)}applyDistort(e,t,n){Je(this.forceMap,"time",this.frameCount/60),this.pass.draw(this.forceMap,this.force,e),Qn(this.distort,"tex0",this.display.texture),Je(this.distort,"time",this.frameCount/60*.005),Je(this.distort,"displacementB",t),Je(this.distort,"displacementC",n),this.pass.draw(this.distort,this.scratch,e),this.pass.copy(this.scratch,this.display,e)}applyMetallic(e,t,n){const r=this.readTarget(this.display),s=this.lastRect??e,a=new Uint8Array(s.w*s.h*4);for(let u=0;u<s.h;u++){const d=((s.y+u)*this.width+s.x)*4;a.set(r.subarray(d,d+s.w*4),u*s.w*4)}const o=nu(a,s.w,s.h,s.x,s.y,this.width,this.height,this.background,this.strokeSeed,n,t);if(!o.length)return;this.paintBites(o);const c=this.frameCount/600;Qn(this.metallic,"tex0",this.display.texture),Je(this.metallic,"time",this.frameCount*1e3/60),$r(this.metallic,"lightPos",.5+Ct(c*.7)*.3,.4+Nt(c*.5)*.25),Zr(this.metallic,"metalTint",t[0],t[1],t[2]);const l=this.clampRect({x:e.x-48,y:e.y-48,w:e.w+96,h:e.h+96})??e;this.pass.draw(this.metallic,this.scratch,l),this.pass.copy(this.scratch,this.display,l)}paintBites(e){const t=document.createElement("canvas"),n=document.createElement("canvas");t.width=n.width=this.width,t.height=n.height=this.height;const r=t.getContext("2d"),s=n.getContext("2d");if(!(!r||!s)){for(const a of e){va(r,a,`rgb(${Math.round(a.r)},${Math.round(a.g)},${Math.round(a.b)})`);const o=Math.round(Jr(a.x/this.width)*255),c=Math.round(Jr(a.y/this.height)*255),l=Math.round(Jr(a.size/this.width)*255);va(s,a,`rgb(${o},${c},${l})`)}this.paintCanvas(t,this.bugsMask,"bugsMask"),this.paintCanvas(n,this.bugsData,"bugsData")}}paintCanvas(e,t,n){const r=e.getContext("2d")?.getImageData(0,0,this.width,this.height);if(!r)return;const s=new Wn(new Uint8Array(r.data.buffer),this.width,this.height,1023,1009);s.flipY=!1,s.colorSpace="",s.magFilter=1006,s.minFilter=1006,s.generateMipmaps=!1,s.needsUpdate=!0,this.pass.blitTexture(s,t,this.fullRect()),Qn(this.metallic,n,t.texture),s.dispose()}pathBoundsNormalized(){const e=this.pathBounds;if(!(e.maxX>=e.minX))return;const t=20;return{minX:Math.max(0,e.minX-t)/this.width,minY:Math.max(0,e.minY-t)/this.height,maxX:Math.min(1,e.maxX+t)/this.width,maxY:Math.min(1,e.maxY+t)/this.height}}readTarget(e){const t=new Uint8Array(this.width*this.height*4);return this.pass.read(e,t),t}blitBuffer(e,t){const n=new Wn(t,this.width,this.height,1023,1009);n.flipY=!1,n.colorSpace="",n.magFilter=1006,n.minFilter=1006,n.generateMipmaps=!1,n.needsUpdate=!0,this.pass.blitTexture(n,e,this.fullRect()),n.dispose()}makeBase(e){const t=this.background;let n;if(e.transparent)n=Qr(this.width,this.height,[255,255,255]);else if(e.paper===!1)n=Qr(this.width,this.height,t);else try{n=ru(this.width,this.height,t,this.seed)}catch{n=Qr(this.width,this.height,t)}const r=new Wn(n,this.width,this.height,1023,1009);return r.flipY=!1,r.colorSpace="",r.magFilter=1006,r.minFilter=1006,r.generateMipmaps=!1,r.needsUpdate=!0,r}forceParams(){const e=new Jn(this.seed),t=[],n=[],r=[],s=[],a=[],o=[];for(let c=0;c<4;c++)t.push(e.random(100+c*100,200+c*100));for(let c=0;c<3;c++)n.push(e.random(.001+c*.002,.003+c*.005)),r.push(e.random(.1+c*.1,.4+c*.2)),s.push(e.random(0,kt));for(let c=0;c<2;c++)a.push(e.random(.005+c*.003,.015+c*.003)),o.push(e.random(5e-4+c*3e-4,.002+c*5e-4));return{seeds:t,scales:n,amplitudes:r,phases:s,vortexScales:a,clusterScales:o}}fullRect(){return{x:0,y:0,w:this.width,h:this.height}}clampRect(e){if(!e)return;const t=Math.max(0,Math.floor(e.x)),n=Math.max(0,Math.floor(e.y)),r=Math.min(this.width,Math.ceil(e.x+e.w)),s=Math.min(this.height,Math.ceil(e.y+e.h));if(!(r<=t||s<=n))return{x:t,y:n,w:r-t,h:s-n}}}function Kr(i,e){const t=e?0:-Xr;return i.map(n=>n.pressure===void 0?{x:n.x+t,y:n.y+t}:{x:n.x+t,y:n.y+t,pressure:n.pressure})}function ie(i){return{value:i}}function mi(i,e){return{value:new Ze(i,e)}}function gi(i,e,t){return{value:new H(i,e,t)}}function Au(i,e,t,n){return{value:new ut(i,e,t,n)}}function _t(i){return{value:i}}function Je(i,e,t){const n=i.uniforms[e];n&&typeof n.value=="number"&&(n.value=t)}function $r(i,e,t,n){const r=i.uniforms[e];r?.value instanceof Ze&&r.value.set(t,n)}function Zr(i,e,t,n,r){const s=i.uniforms[e];s?.value instanceof H&&s.value.set(t,n,r)}function Ru(i,e,t,n,r,s){const a=i.uniforms[e];a?.value instanceof ut&&a.value.set(t,n,r,s)}function Qn(i,e,t){const n=i.uniforms[e];n&&(n.value=t)}function vi(i,e,t,n,r){e<i.minX&&(i.minX=e),t<i.minY&&(i.minY=t),n>i.maxX&&(i.maxX=n),r>i.maxY&&(i.maxY=r)}function ga(i,e){if(i.maxX>=i.minX)return{x:i.minX-e,y:i.minY-e,w:i.maxX-i.minX+e*2,h:i.maxY-i.minY+e*2}}function jn(i){return{x:Math.round(i.x*100)/100,y:Math.round(i.y*100)/100}}function va(i,e,t){i.fillStyle=t,i.beginPath();const n=e.vertices[0];if(!n||e.vertices.length<3){i.rect(e.x-e.size/2,e.y-e.size/2,e.size,e.size),i.fill();return}i.moveTo(e.x+n.x,e.y+n.y);for(let r=1;r<e.vertices.length;r++){const s=e.vertices[r];s&&i.lineTo(e.x+s.x,e.y+s.y)}i.closePath(),i.fill()}function Jr(i){return Math.max(0,Math.min(1,i))}function Qr(i,e,t){const n=new Uint8Array(i*e*4);for(let r=0;r<n.length;r+=4)n[r]=t[0],n[r+1]=t[1],n[r+2]=t[2],n[r+3]=255;return n}const Sa=[110,110,108],wu=[200,198,194],Cu=[179,36,28],nr=480,ir=270;function Pu(i,e=nr,t=ir){const n=new Jn(i),r=[],s=7;for(let a=0;a<s;a++){const o=a===s-1;r.push({x:e*(.1+n.random()*.8),y:t*(.12+n.random()*.76),vermilion:o,radius:o?3:8+n.random()*14})}return r}const Du=125,Lu=500,Fu=8e3,Iu=10;function Ma(i,e){return i<12?12:i>e-12?e-12:i}class Uu{canvas;renderer;surface;scene=new ms;camera;sheet;noise;marks;seed;reduced;disposed=!1;raf=0;lastDraw=0;lastInput=0;frames=0;bloom=0;trail=[];onResize=()=>{this.layout()};onInput=()=>{this.lastInput=performance.now()};onLost=e=>{e.preventDefault(),this.canvas.style.display="none",this.stop()};loop=e=>{if(this.disposed||this.reduced||(this.raf=requestAnimationFrame(this.loop),document.hidden))return;const t=e-this.lastInput>Fu?Lu:Du;e-this.lastDraw<t||(this.lastDraw=e,this.step(),this.present(),this.frames+=1,this.canvas.dataset.inkFrames=String(this.frames))};constructor(e){this.canvas=e.canvas,this.seed=e.seed??20261012,this.reduced=e.reducedMotion??!1,this.noise=new er(this.seed),this.marks=Pu(this.seed);let t;try{t=new Uh({canvas:this.canvas,antialias:!1,alpha:!1,powerPreference:"low-power"})}catch(s){throw this.canvas.style.display="none",s}this.renderer=t,this.renderer.outputColorSpace=Dt,this.renderer.setPixelRatio(1),this.renderer.setClearColor(15526628,1),this.surface=new Tu(this.renderer,{width:nr,height:ir,seed:this.seed,paper:!0,background:wu}),this.surface.texture.colorSpace=Dt;const n=new hi(2,2),r=new Lr({map:this.surface.texture,toneMapped:!1,depthWrite:!1});this.sheet=new Xt(n,r),this.sheet.frustumCulled=!1,this.scene.add(this.sheet),this.camera=new Wi(-1,1,1,-1,.1,10),this.camera.position.z=1,this.seedSheet(),this.layout(),this.present(),this.canvas.addEventListener("webglcontextlost",this.onLost)}get frameCount(){return this.frames}start(){this.disposed||this.reduced||this.raf||(this.lastInput=performance.now(),this.lastDraw=0,window.addEventListener("resize",this.onResize),window.addEventListener("pointermove",this.onInput,{passive:!0}),window.addEventListener("scroll",this.onInput,{passive:!0}),window.addEventListener("keydown",this.onInput),this.raf=requestAnimationFrame(this.loop))}setReducedMotion(e){this.reduced=e,e?this.stop():this.start()}dispose(){this.disposed||(this.disposed=!0,this.stop(),this.canvas.removeEventListener("webglcontextlost",this.onLost),this.surface.dispose(),this.scene.traverse(e=>{const t=e;t.geometry?.dispose();const n=t.material;n&&!Array.isArray(n)&&n.dispose()}),this.renderer.dispose())}seedSheet(){const e={mode:"brush",size:"medium",effect:"mix",blend:"mix"};this.marks.forEach((t,n)=>{const r=t.radius;this.surface.paint({brush:t.vermilion?{mode:"dots",size:"ultra-small",effect:"mix",blend:"mix"}:e,color:t.vermilion?Cu:Sa,points:t.vermilion?[{x:t.x,y:t.y,pressure:.4}]:[{x:t.x-r*.45,y:t.y,pressure:.25},{x:t.x,y:t.y+r*.15,pressure:.4},{x:t.x+r*.35,y:t.y-r*.1,pressure:.15}],seed:this.seed+n*17})})}step(){const e=this.marks[this.bloom%this.marks.length];if(!e||e.vermilion){this.bloom+=1;return}const t=(this.frames+1)*.07,n=Ma(e.x+(this.noise.noise(t,.4)-.5)*70,nr),r=Ma(e.y+(this.noise.noise(.4,t)-.5)*46,ir);if(this.surface.paint({brush:{mode:"brush",size:"medium",effect:"wet",blend:"mix"},color:Sa,points:[{x:n-8,y:r,pressure:.28},{x:n,y:r+5,pressure:.34}],seed:this.seed+this.frames*19>>>0}),this.trail.push({x:n,y:r}),this.trail.length>Iu){const s=this.trail.shift();s&&this.surface.wash(s.x,s.y,30)}this.frames%48===47&&(this.bloom+=1)}present(){this.renderer.setRenderTarget(null),this.renderer.setViewport(0,0,this.canvas.width,this.canvas.height),this.renderer.render(this.scene,this.camera)}layout(){const e=Math.max(1,this.canvas.clientWidth),t=Math.max(1,this.canvas.clientHeight);this.renderer.setPixelRatio(1),this.renderer.setSize(e,t,!1);const n=this.sheet.material.map;if(!n)return;const r=e/t,s=nr/ir;r>s?n.repeat.set(1,s/r):n.repeat.set(r/s,1),n.offset.set((1-n.repeat.x)/2,(1-n.repeat.y)/2)}stop(){this.raf&&cancelAnimationFrame(this.raf),this.raf=0,window.removeEventListener("resize",this.onResize),window.removeEventListener("pointermove",this.onInput),window.removeEventListener("scroll",this.onInput),window.removeEventListener("keydown",this.onInput)}}function ya(i){const e=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let t;try{t=new Uu({canvas:i,reducedMotion:e})}catch{i.remove();return}const n=window.matchMedia("(prefers-reduced-motion: reduce)"),r=()=>{t.setReducedMotion(n.matches)};return n.addEventListener("change",r),t.start(),t}function ba(){const i=document.getElementById("inkbg");i instanceof HTMLCanvasElement&&ya(i)}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ba):ba(),ar.mountInkBackdrop=ya,Object.defineProperty(ar,Symbol.toStringTag,{value:"Module"}),ar})({});
