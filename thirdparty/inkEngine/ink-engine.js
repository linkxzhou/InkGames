/*!
 * ink-engine.js — readable, standalone restoration of the inkField ink engine (p5.js 1.11.x + WebGL).
 *
 * Restored from the obfuscated inkField build (script.js + shader.js) for linkxzhou, with the
 * permission of the inkField author as stated by the user (written authorization, 2026-10-08).
 * This is NOT an official inkField release. The inkField licence below still applies to this code;
 * the permission covers this user's use only — do not redistribute beyond it.
 *
 *   inkField — Open Creative License
 *   Copyright (c) 2026 Aluan Wang <ileivoivm@gmail.com>
 *   https://github.com/ileivoivm/inkField   (full text: LICENSE next to this file)
 *
 * Third-party: p5.js (LGPL-2.1, loaded separately); p5.EasyCam (MIT, Thomas Diewald, bundled); Inconsolata font embedded as a data URL
 * (SIL Open Font License 1.1, Raph Levien); spectral mixing ideas credited by inkField to spectral.js (MIT).
 *
 * Restoration notes: algorithms, constants and GLSL are kept as in the original; identifiers were
 * renamed (see NAME-MAP.md), site/UI code was removed or stubbed, and browser globals were replaced by
 * per-instance shims ($win/$doc/$store/$in/$clock). Remaining "_jNNN" locals are names that could not
 * be recovered with confidence. "[restored]" comments mark every behavioural edit.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else root.InkEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  // NOTE: deliberately sloppy-mode (no 'use strict') to keep the original semantics.
  const SHADER_SOURCES = {
    // shared pass-through vertex shader
    "./shaders/base.vert": `#extension GL_OES_standard_derivatives : enable
attribute vec3 aPosition; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; uniform mat3 uNormalMatrix; void main(){ gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition,1.0); }`,
    // decode dry layers (base + encoded + typeMap) into the screen image
    "./shaders/composite.frag": `#ifdef GL_ES
precision highp float;
#endif
uniform vec4 rect; uniform sampler2D baseTex; uniform sampler2D encodedTex; uniform sampler2D typeMapTex; uniform float useSharpen; uniform float brushColorMode; vec3 _x0(vec3 c){ vec4 _x3 = vec4(0.0,-1.0 / 3.0,2.0 / 3.0,-1.0); vec4 _x4 = mix(vec4(c.bg,_x3.wz),vec4(c.gb,_x3.xy),step(c.b,c.g)); vec4 _x5 = mix(vec4(_x4.xyw,c.r),vec4(c.r,_x4.yzx),step(_x4.x,c.r)); float _x6 = _x5.x - min(_x5.w,_x5.y); float _x7 = 1.0e-10; return vec3(abs(_x5.z +(_x5.w - _x5.y)/(6.0 * _x6 + _x7)),_x6 /(_x5.x + _x7),_x5.x); } float _x1(vec2 co){ return fract(sin(dot(co.xy,vec2(12.9898,78.233)))* 43758.5453); } float _x2(vec3 _x8,float _x9,float storedMaxOpacity){ if (_x9 > 0.75){ float _x10 = _x8.r; float _x11 =(1.0 - _x10)/ 0.5; _x11 = clamp(_x11,0.0,1.0); _x11*=clamp(storedMaxOpacity,0.0,1.0); return _x11; } float _x12 = dot(_x8,vec3(0.299,0.587,0.114)); return clamp(1.0 - _x12,0.0,1.0); } void main(){ vec2 _x13 =(gl_FragCoord.xy - rect.xy)/ rect.zw; vec3 _x14 = texture2D(baseTex,_x13).rgb; vec4 _x15 = texture2D(encodedTex,_x13); vec3 _x16 = _x15.rgb; float _x17 = _x15.a; float _x18 = 0.0; float _x19 = dot(_x16,vec3(0.299,0.587,0.114)); vec3 _x20; vec4 _x21 = texture2D(typeMapTex,_x13); float _x9 = _x21.r; float _x22 = _x21.g; bool _x23 =(_x9 > 0.75); float _x24 = max(max(abs(_x16.r - _x16.g),abs(_x16.g - _x16.b)),abs(_x16.b - _x16.r)); if (_x19 > 0.995&&_x24 < 0.01){ _x20 = _x14; }else if (_x23){ float _x10 = _x16.r; float _x25 = _x22; float _x11 =(1.0 - _x10)/ 0.5; _x11 = clamp(_x11,0.0,1.0); _x18 = _x11 * _x25; float _x26 = _x11; float _x27 = 1.0; float _x28 = 0.0; if (_x11 > 0.01){ float _x29 = 1.0 + _x1(_x13 * 500.0)* 8.0; float _x30 = _x29 / rect.z; vec2 _x31 = vec2(_x30,-_x30); vec3 _x32 = texture2D(encodedTex,_x13 + _x31).rgb; float _x33 = dot(_x32,vec3(0.299,0.587,0.114)); vec4 _x34 = texture2D(typeMapTex,_x13 + _x31); bool _x35 =(_x34.r > 0.75); if (_x35&&_x33 < 0.995){ float _x36 = _x32.r; float _x37 =(1.0 - _x36)/ 0.5; _x37 = clamp(_x37,0.0,1.0); float _x38 = 0.3 + _x1(_x13 * 700.0)* 0.7; _x28 = _x37 * _x38 * 0.15; } } vec3 _x39 = vec3(mix(0.3,1.0,_x26)); _x39*=(1.0 - _x28); _x39 = clamp(_x39,vec3(0.5),vec3(1.0)); vec3 _x40 = vec3(1.0)-(vec3(1.0)- _x14)*(vec3(1.0)- _x39); float _x41 = _x25; _x20 = mix(_x14,_x40,_x41); }else { float _x42 = dot(_x16,vec3(0.299,0.587,0.114)); if (_x42 > 0.995){ _x20 = _x14; }else { vec3 _x43 = _x16; float _x44 = max(max(abs(_x16.r - _x16.g),abs(_x16.g - _x16.b)),abs(_x16.b - _x16.r)); if (_x44 > 0.001&&_x44 < 0.1){ _x43 = vec3(_x42); } float _x45 = _x0(_x14).y; float _x46 = smoothstep(0.3,0.8,_x45); bool _x47 =(_x17 < 0.995); bool _x48 =(_x17>=0.995&&_x17 < 1.0); if (_x47){ float _x49 = 1.0 - smoothstep(0.0,0.95,_x42); if (_x49 < 0.01){ _x20 = _x14; }else { vec3 _x50 = mix(vec3(1.0),_x43,_x49); vec3 _x51 = _x14 * _x50; vec3 _x52 = mix(_x14,_x43,_x49); _x20 = mix(_x51,_x52,_x46); } }else if (_x48){ float _x53 =(_x17 - 0.995)/ 0.005; float _x49 = clamp(_x53,0.0,1.0); vec3 _x54 = _x0(_x43); float _x55 = _x54.x; float _x56 = _x54.y; float _x57 = _x54.z; bool _x58 =(_x55 < 0.2&&_x56 > 0.3); if (_x49 < 0.02){ _x20 = _x14; }else if (_x58){ _x20 = mix(_x14,_x43,_x49); }else { if (_x49 < 0.2){ vec3 _x50 = mix(vec3(1.0),_x43,_x49); vec3 _x51 = mix(_x14,_x14 * _x50,_x49); vec3 _x52 = mix(_x14,_x43,_x49); _x20 = mix(_x51,_x52,_x46); }else { vec3 _x50 = mix(vec3(1.0),_x43,_x49); vec3 _x51 = _x14 * _x50; vec3 _x52 = mix(_x14,_x43,_x49); _x20 = mix(_x51,_x52,_x46); } } }else { vec3 _x51 = _x14 * _x43; vec3 _x52 = _x43; _x20 = mix(_x51,_x52,_x46); } } } gl_FragColor = vec4(_x20,1.0); }`,
    // layer distortion / paper displacement pass (doEffect)
    "./shaders/distort.frag": `#ifdef GL_ES
precision highp float;
#endif
uniform vec4 rect; uniform sampler2D tex0; uniform sampler2D forceMap; uniform float time; uniform float distortEnabled; uniform float displacementB; uniform float displacementC; uniform float showFbmMask; uniform float fbmSeed1; uniform float fbmSeed2; uniform float fbmSeed3; uniform float fbmSeed4; uniform vec3 backgroundColor; uniform float rsEnabled; uniform float rsFrequency; uniform float rsWaveSpeed; uniform float rsStrength; uniform float rsGradientMix; uniform float rsScale; uniform float cellularEnabled; uniform float cellularScale; uniform float cellularSeed; uniform float whiteDotDensity; uniform float grainAmount;
#define PI 3.14159265359
#define TAU 6.28318530718
#define RS_SAMPLE_POINTS 16
const mat2 _x0 = mat2(0.80,0.60,-0.60,0.80); float _x1(in vec2 _x27){ return sin(_x27.x)* sin(_x27.y); } float _x2(vec2 _x27){ float _x16 = 0.0; _x16+=0.5000 * _x1(_x27); _x27 = _x0 * _x27 * 2.02; _x16+=0.2500 * _x1(_x27); _x27 = _x0 * _x27 * 2.02; _x16+=0.1250 * _x1(_x27); _x27 = _x0 * _x27 * 2.02; _x16+=0.0625 * _x1(_x27); return _x16 / 0.9375; } float _x3(vec2 _x27){ float _x16 = 0.0; _x16+=0.500000 *(0.5 + 0.5 * _x1(_x27)); _x27 = _x0 * _x27 * 1.02; _x16+=0.500000 *(0.5 + 0.5 * _x1(_x27)); _x27 = _x0 * _x27 * 1.32; _x16+=0.500000 *(0.5 + 0.5 * _x1(_x27)); _x27 = _x0 * _x27 * 0.72; _x16+=0.250000 *(0.5 + 0.5 * _x1(_x27)); _x27 = _x0 * _x27 * 0.5; return _x16 / 0.96875; } vec2 _x4(vec2 _x27){ return vec2(_x2(_x27 + vec2(fbmSeed1,fbmSeed2)),_x2(_x27 + vec2(7.8 + fbmSeed3,fbmSeed4))); } vec2 _x5(vec2 _x27){ return vec2(_x3(_x27 + vec2(16.8 + fbmSeed1,fbmSeed2)),_x3(_x27 + vec2(11.5 + fbmSeed3,fbmSeed4))); } float _x6(vec2 _x17,out vec4 _x90){ float _x18 = time * 3.0; _x17+=0.03 * sin(vec2(0.27,0.23)* _x18 + length(_x17)* vec2(4.1,4.3)+ vec2(fbmSeed1,fbmSeed2)); vec2 _x19 = _x4(0.9 * _x17); _x19+=0.04 * sin(vec2(0.12,0.14)* _x18 + length(_x19)+ vec2(fbmSeed3,fbmSeed4)); vec2 _x20 = _x5(3.0 * _x19); _x90 = vec4(_x19,_x20); float _x16 = 0.5 + 0.5 * _x2(1.8 * _x17 + 6.0 * _x20 + vec2(fbmSeed1,fbmSeed2)); return mix(_x16,_x16 * _x16 * _x16 * 3.5,_x16 * abs(_x20.x)); } vec4 _x7(vec4 x){ return x - floor(x *(1.0 / 289.0))* 289.0; } vec4 _x8(vec4 x){ return _x7(((x * 34.0)+ 1.0)* x); } vec2 _x9(vec2 P){ float _x21 = 0.142857142857; float _x22 = 0.428571428571; vec2 _x23 = mod(floor(P),289.0); vec2 _x24 = fract(P); vec4 _x25 = _x24.x + vec4(-0.5,-1.5,-0.5,-1.5); vec4 _x26 = _x24.y + vec4(-0.5,-0.5,-1.5,-1.5); vec4 _x27 = _x8(_x23.x + vec4(0.0,1.0,0.0,1.0)); _x27 = _x8(_x27 + _x23.y + vec4(0.0,0.0,1.0,1.0)); vec4 _x28 = mod(_x27,7.0)* _x21 + _x22; vec4 _x29 = mod(floor(_x27 * _x21),7.0)* _x21 + _x22; vec4 _x30 = _x25 + 0.5 - _x28; vec4 _x31 = _x26 + 0.5 - _x29; vec4 _x32 = _x30 * _x30 + _x31 * _x31; vec2 _x33 = vec2(1e6); for (int _x34 = 0;_x34 < 4;_x34++){ float _x35; if (_x34==0)_x35 = _x32.x; else if (_x34==1)_x35 = _x32.y; else if (_x34==2)_x35 = _x32.z; else _x35 = _x32.w; if (_x35 < _x33.x){_x33.y = _x33.x;_x33.x = _x35;} else if (_x35 < _x33.y){_x33.y = _x35;} } return sqrt(_x33); } float _x10(vec2 st){ return fract(sin(dot(st,vec2(12.9898,78.233)))* 43758.5453123); } float _x11(vec2 st){ return fract(sin(dot(st,vec2(269.5,183.3)))* 43758.5453123); } float _x12(vec2 st){ return fract(sin(dot(st,vec2(17.0,180.0)))* 2500.0); } vec2 _x13(int index){ float _x36 = sqrt(float(RS_SAMPLE_POINTS)); float _x37 = mod(float(index),_x36); float _x38 = floor(float(index)/ _x36); vec2 _x39 = vec2((_x37 + 0.5)/ _x36,(_x38 + 0.5)/ _x36); vec4 _x40 = texture2D(forceMap,_x39); vec2 _x41 = _x40.xy - vec2(0.5); vec2 _x42 = _x41 * 0.1; return (_x39 + _x42 - 0.5)* 2.0; } float _x14(int index){ float _x36 = sqrt(float(RS_SAMPLE_POINTS)); float _x37 = mod(float(index),_x36); float _x38 = floor(float(index)/ _x36); vec2 _x43 = vec2((_x37 + 0.5)/ _x36,(_x38 + 0.5)/ _x36); vec4 _x40 = texture2D(forceMap,_x43); float _x44 = length(_x40.xy - vec2(0.5)); return smoothstep(0.01,0.15,_x44); } vec2 _x15(vec2 _x45,vec2 _x77){ vec2 _x46 =(_x45 - 0.5)* 2.0; float _x47 = time; vec2 _x48 = _x46 * 0.8 + vec2(_x47 * 0.01,0.0); vec2 _x49 = _x46 * 1.2 + vec2(0.0,_x47 * 0.015); float _x50 = _x2(_x48); float _x51 = _x2(_x49); float _x16 = rsFrequency; float _x52 = rsWaveSpeed *(0.7 + 0.6 * _x50); float _x53 = rsScale *(0.6 + 0.8 * _x51); float _x54 = -1.5; float _x55 = _x47 * 0.0075; float _x32 = 1.0 / _x77.y; float _x56 = 0.0; float _x57 = 0.0; float _x58 = 0.0; float _x59 = 0.0; for (int _x34 = 0;_x34 < RS_SAMPLE_POINTS;_x34++){ vec2 _x60 = _x13(_x34); float _x61 = _x14(_x34); if (_x61 > 0.01){ _x59+=_x61; float _x62 = length(_x46 - _x60); _x56+=sin(TAU * _x16 *(_x55 -(_x62 / _x52))/ _x53)* _x61; float _x63 = length(vec2(_x46.x + _x32,_x46.y)- _x60); _x57+=sin(TAU * _x16 *(_x55 -(_x63 / _x52))/ _x53)* _x61; float _x64 = length(vec2(_x46.x,_x46.y + _x32)- _x60); _x58+=sin(TAU * _x16 *(_x55 -(_x64 / _x52))/ _x53)* _x61; } } if (_x59 < 0.01){ return vec2(0.0); } float _x65 = abs(_x57); float _x66 = abs(_x58); float _x67 = abs(_x56); float _x68 = sqrt((_x65 - _x67)*(_x65 - _x67)+(_x66 - _x67)*(_x66 - _x67)); vec2 _x69 = vec2(0.0); if (_x68 > 0.0001){ _x69 = vec2(_x54 *(_x65 - _x67)/ _x68,_x54 *(_x66 - _x67)/ _x68); } vec2 _x70 = vec2(0.0); float _x71 = _x56 / max(_x59,1.0); _x70+=vec2(_x71)* 0.008 *(1.0 - rsGradientMix); _x70+=_x69 * 0.005 * rsGradientMix; vec2 _x72 = _x46 * 1.5 + vec2(_x47 * 0.02); float _x73 = _x2(_x72); float _x74 = 0.4 + 0.6 * _x73; return _x70 * rsStrength * _x74; } void main(){ vec2 _x75 =(gl_FragCoord.xy - rect.xy)/ rect.zw; vec2 _x76 = 0.5 / rect.zw; vec2 _x77 = rect.zw; vec4 _x78 = texture2D(tex0,_x75); vec3 _x79 = _x78.rgb; vec3 _x80 = backgroundColor; float _x81 = distance(_x79,_x80); if (_x81 < 0.05){ gl_FragColor = _x78; return; } float _x82 = dot(_x78.rgb,vec3(0.299,0.587,0.114)); if (_x82 < 0.01){ gl_FragColor = _x78; return; } vec2 _x83 = _x75; vec4 _x84 = texture2D(forceMap,_x75); vec2 _x85 = _x84.xy - vec2(0.5); float _x86 = length(_x85); float _x87 = clamp(_x86 / 0.707,0.0,1.0); if (rsEnabled > 0.5){ vec2 _x88 = _x15(_x75,_x77); _x83+=_x88; } vec4 _x89; if (distortEnabled > 0.5){ vec2 _x27 =(2.0 *(gl_FragCoord.xy - rect.xy)- _x77.xy)/ _x77.y; vec4 _x90; float _x91 = pow(_x6(_x27,_x90),0.2); float _x92 = clamp(_x91,0.3,1.0); float _x93 = displacementB * _x92; float _x94 = displacementC * _x92; vec2 _x95 = _x85 * _x76 * _x93; vec2 _x96 = _x85 * _x76 * _x94; vec4 _x97 = texture2D(tex0,_x83 + _x95); vec4 _x98 = texture2D(tex0,(_x83 / 1.05)+ vec2(0.02381,0.02381)+ _x96); _x98.rgb = mix(_x98.rgb,vec3(1.0),0.75); _x89 = min(_x97,_x98); float _x99 = dot(_x89.rgb,vec3(0.299,0.587,0.114)); vec3 _x100 = _x89.rgb; if (_x99 < 0.7){ float _x101 = max(_x89.r,max(_x89.g,_x89.b)); float _x102 = min(_x89.r,min(_x89.g,_x89.b)); float _x103 = _x101 - _x102; float _x104 =(_x101 + _x102)* 0.5; float _x105 =(_x103 < 0.001)? 0.0 : _x103 /(1.0 - abs(2.0 * _x104 - 1.0)); float _x106 = 0.0; if (_x103 > 0.001){ if (_x101==_x89.r){ _x106 = mod(((_x89.g - _x89.b)/ _x103)+(_x89.g < _x89.b ? 6.0 : 0.0),6.0)/ 6.0; }else if (_x101==_x89.g){ _x106 =((_x89.b - _x89.r)/ _x103 + 2.0)/ 6.0; }else { _x106 =((_x89.r - _x89.g)/ _x103 + 4.0)/ 6.0; } } float _x107 = 1.0 + _x87 * 0.3; _x105 = clamp(_x105 * _x107,0.0,1.0); vec2 _x108 = _x75 * 0.2; vec2 _x109 = floor(_x108); vec2 _x16 = fract(_x108); _x16 = _x16 * _x16 *(3.0 - 2.0 * _x16); float _x20 = _x109.x + _x109.y * 57.0; float _x110 = fract(sin(_x20 + 0.0)* 43758.5453); float _x111 = fract(sin(_x20 + 1.0)* 43758.5453); float _x112 = fract(sin(_x20 + 57.0)* 43758.5453); float _x113 = fract(sin(_x20 + 58.0)* 43758.5453); float _x114 = mix(_x110,_x111,_x16.x); float _x115 = mix(_x112,_x113,_x16.x); float _x116 = mix(_x114,_x115,_x16.y); float _x117 = fract(sin(dot(_x85,vec2(12.9898,78.233)))* 43758.5453); float _x118 = mix(_x116,_x117,0.2); float _x119 = _x87 * 0.2; _x106 = mod(_x106 + _x118 * _x119,1.0); float _x56 =(1.0 - abs(2.0 * _x104 - 1.0))* _x105; float _x120 = _x56 *(1.0 - abs(mod(_x106 * 6.0,2.0)- 1.0)); float _x121 = _x104 - _x56 * 0.5; vec3 _x122 = vec3(0.0); if (_x106 < 1.0 / 6.0){ _x122 = vec3(_x56,_x120,0.0); }else if (_x106 < 2.0 / 6.0){ _x122 = vec3(_x120,_x56,0.0); }else if (_x106 < 3.0 / 6.0){ _x122 = vec3(0.0,_x56,_x120); }else if (_x106 < 4.0 / 6.0){ _x122 = vec3(0.0,_x120,_x56); }else if (_x106 < 5.0 / 6.0){ _x122 = vec3(_x120,0.0,_x56); }else { _x122 = vec3(_x56,0.0,_x120); } _x100 = _x122 + vec3(_x121); _x100 = clamp(_x100,vec3(0.0),vec3(1.0)); } _x89 = vec4(_x100,_x89.a); if (showFbmMask > 0.5){ vec3 _x123; if (_x92 < 0.33){ _x123 = mix(vec3(0.0,0.0,1.0),vec3(0.0,1.0,1.0),_x92 / 0.33); }else if (_x92 < 0.66){ _x123 = mix(vec3(0.0,1.0,1.0),vec3(1.0,1.0,0.0),(_x92 - 0.33)/ 0.33); }else { _x123 = mix(vec3(1.0,1.0,0.0),vec3(1.0,0.0,0.0),(_x92 - 0.66)/ 0.34); } gl_FragColor = vec4(_x123,1.0); return; } }else { _x89 = texture2D(tex0,_x83); } if (cellularEnabled > 0.5){ float _x124 = _x77.x / _x77.y; vec2 _x125 = floor(_x75 * 3.0); vec2 _x126 = fract(_x75 * 3.0); _x126 = _x126 * _x126 *(3.0 - 2.0 * _x126); float _x127 = mix( mix(_x10(_x125),_x10(_x125 + vec2(1.0,0.0)),_x126.x), mix(_x10(_x125 + vec2(0.0,1.0)),_x10(_x125 + vec2(1.0,1.0)),_x126.x), _x126.y); float _x128 = mix( mix(_x11(_x125),_x11(_x125 + vec2(1.0,0.0)),_x126.x), mix(_x11(_x125 + vec2(0.0,1.0)),_x11(_x125 + vec2(1.0,1.0)),_x126.x), _x126.y); vec2 _x129 = _x75; _x129.x*=_x124; _x129+=vec2(_x127,_x128)* 0.3 + vec2(cellularSeed * 5.0,cellularSeed * 3.0); _x129+=vec2( sin(time * 0.02 * 0.7)* 0.15, cos(time * 0.015 * 0.7)* 0.15 ); _x129*=cellularScale; vec2 _x33 = _x9(_x129); float _x130 = _x33.y - _x33.x; float _x131 = smoothstep(0.05,0.3,_x33.x); float _x132 = step(0.4,_x130)* _x131; float _x133 = 0.5 + 0.5 * _x127; float _x134 = _x132 * cellularScale * 15.0 * _x133; float _x135 = min(min(_x83.x,_x83.y),min(1.0 - _x83.x,1.0 - _x83.y)); float _x136 = smoothstep(0.0,0.10,_x135); _x134*=_x136; vec2 _x137 = _x85 * _x76 * _x134; vec4 _x138 = texture2D(tex0,clamp(_x83 + _x137,vec2(0.0),vec2(1.0))); _x89 = vec4(min(_x89.rgb,_x138.rgb),_x89.a); } if (whiteDotDensity > 0.001){ vec2 _x139 = gl_FragCoord.xy; float _x140 = 1.0 - whiteDotDensity; vec2 _x141 = floor(_x75 * 2.5 + vec2(fbmSeed1 * 0.1,fbmSeed2 * 0.1)); vec2 _x142 = fract(_x75 * 2.5 + vec2(fbmSeed1 * 0.1,fbmSeed2 * 0.1)); _x142 = _x142 * _x142 *(3.0 - 2.0 * _x142); float _x143 = mix( mix(_x10(_x141),_x10(_x141 + vec2(1.0,0.0)),_x142.x), mix(_x10(_x141 + vec2(0.0,1.0)),_x10(_x141 + vec2(1.0,1.0)),_x142.x), _x142.y); _x143 = smoothstep(0.3,0.8,_x143); if (_x143 > 0.05){ float _x144 = mix(1.0,_x140,_x143); vec2 _x145 = floor(_x139 * 0.2); float _x146 = _x10(_x145); if (_x146 > _x144){ float _x147 = smoothstep(_x144,1.0,_x146); float _x148 = 0.15 + _x10(_x145 + vec2(19.0,41.0))* 0.3; vec2 _x149 = fract(_x139 * 0.2)- 0.5; float _x150 = step(length(_x149),_x148); _x89.rgb = mix(_x89.rgb,vec3(1.0),_x147 * 0.85 * _x150); } float _x151 = 0.05 + _x10(floor(_x139 * 0.002)+ vec2(3.0,7.0))* 0.06; vec2 _x152 = floor(_x139 * _x151); float _x153 = _x11(_x152); if (_x153 > _x144 + 0.005){ float _x154 = smoothstep(_x144 + 0.005,1.0,_x153); float _x155 = 0.08 + pow(_x10(_x152 + vec2(31.0,17.0)),2.0)* 0.4; vec2 _x156 = fract(_x139 * _x151)- 0.5; float _x157 = length(_x156); float _x158 = step(_x157,_x155); _x89.rgb = mix(_x89.rgb,vec3(1.0),_x154 * 0.75 * _x158); } float _x159 = 0.008 + _x11(floor(_x139 * 0.001))* 0.016; vec2 _x160 = floor(_x139 * _x159); float _x161 = _x10(_x160 + vec2(53.0,91.0)); if (_x161 > _x144 + 0.02){ float _x162 = smoothstep(_x144 + 0.02,1.0,_x161); float _x163 = _x11(_x160 + vec2(11.0,43.0))* PI; float _x164 = 0.2 + _x10(_x160 + vec2(67.0,23.0))* 0.7; vec2 _x165 = fract(_x139 * _x159)- 0.5; float _x166 = cos(_x163),sa = sin(_x163); vec2 _x167 = vec2(_x166 * _x165.x + sa * _x165.y,-sa * _x165.x + _x166 * _x165.y); _x167.y/=_x164; float _x168 = length(_x167); float _x169 = 0.06 + pow(_x11(_x160 + vec2(5.0,9.0)),3.0)* 0.35; float _x170 = step(_x168,_x169); _x89.rgb = mix(_x89.rgb,vec3(1.0),_x162 * 0.55 * _x170); } } } if (grainAmount > 0.01){ float _x171 = dot(_x89.rgb,vec3(0.299,0.587,0.114)); float _x172 = 1.0 - smoothstep(0.2,0.85,_x171); float _x173 = smoothstep(0.01,0.15,_x86); vec2 _x174 = floor(_x75 * 3.0 + vec2(fbmSeed1 * 0.05,fbmSeed2 * 0.05)); vec2 _x175 = fract(_x75 * 3.0 + vec2(fbmSeed1 * 0.05,fbmSeed2 * 0.05)); _x175 = _x175 * _x175 *(3.0 - 2.0 * _x175); float _x176 = mix( mix(_x10(_x174 + vec2(55.0,33.0)),_x10(_x174 + vec2(56.0,33.0)),_x175.x), mix(_x10(_x174 + vec2(55.0,34.0)),_x10(_x174 + vec2(56.0,34.0)),_x175.x), _x175.y); _x176 = 0.3 + 0.7 * _x176; float _x177 = mix(0.2,1.0,_x172 * 0.5 + _x173 * 0.3 + _x176 * 0.2); vec2 _x178 = _x75 * rect.zw; float _x179 = _x12(_x178); float _x180 = _x12(floor(_x178 * 0.5)* 2.0); float _x181 = _x10(floor(_x178 * 0.15)); float _x182 = _x179 * 0.6 + _x180 * 0.3 + _x181 * 0.1; float _x183 = _x10(floor(_x178 * 0.3)+ vec2(99.0,77.0)); vec3 _x184 =(_x183 > 0.5)? vec3(_x182): vec3(_x182 * 0.8,_x182 * 0.85,_x182 * 0.9); float _x185 = grainAmount * 3.0 * _x177; _x89.rgb = mix(_x89.rgb,_x184,_x185); } gl_FragColor = _x89; }`,
    // commit: encode the finished stroke (colour + alpha) into finalBuffer
    "./shaders/encode.frag": `#ifdef GL_ES
precision highp float;
#endif
uniform vec4 rect; uniform sampler2D baseTex; uniform sampler2D strokeTex; uniform float brushColorMode; uniform float brushCategory; uniform float whiteMaxOpacity; uniform float hueShift; uniform float satShift; uniform float briShift; uniform int keyBlendMode; uniform float useSharpen; uniform vec3 canvasBackgroundColor; uniform vec3 customBrushColor; uniform sampler2D typeMapTex; uniform float useSpectralMix; uniform float useMask; uniform sampler2D maskTex; const int _x0 = 38; const float _x1 = 2.4; const float _x2 = 0.0000000000000001; float _x38(float x){ return (x < 0.04045)? x / 12.92 : pow((x + 0.055)/ 1.055,_x1); } float _x39(float x){ return (x < 0.0031308)? x * 12.92 : 1.055 * pow(x,1.0 / _x1)- 0.055; } vec3 _x40(vec3 srgb){ return vec3(_x38(srgb[0]),_x38(srgb[1]),_x38(srgb[2])); } vec3 _x41(vec3 _x49){ return clamp(vec3(_x39(_x49[0]),_x39(_x49[1]),_x39(_x49[2])),0.,1.); } void _x42(vec3 _x49,inout float R[_x0]){ float _x50 = min(_x49.r,min(_x49.g,_x49.b)); _x49-=_x50; float _x51 = min(_x49.g,_x49.b); float _x52 = min(_x49.r,_x49.b); float _x53 = min(_x49.r,_x49.g); float _x54 = min(max(0.0,_x49.r - _x49.b),max(0.0,_x49.r - _x49.g)); float _x55 = min(max(0.0,_x49.g - _x49.b),max(0.0,_x49.g - _x49.r)); float _x56 = min(max(0.0,_x49.b - _x49.g),max(0.0,_x49.b - _x49.r)); R[ 0] = max(_x2,_x50*1.0011607271876400 + _x51*0.9705850013229620 + _x52*0.9906735573199880 + _x53*0.0210523371789306 + _x54*0.0315605737777207 + _x55*0.0095560747554212 + _x56*0.9794047525020140); R[ 1] = max(_x2,_x50*1.0011606515972800 + _x51*0.9705924981434250 + _x52*0.9906715249619790 + _x53*0.0210564627517414 + _x54*0.0315520718330149 + _x55*0.0095581580120851 + _x56*0.9794007068431300); R[ 2] = max(_x2,_x50*1.0011603192274700 + _x51*0.9706253487298910 + _x52*0.9906625823534210 + _x53*0.0210746178695038 + _x54*0.0315148215513658 + _x55*0.0095673245444588 + _x56*0.9793829034702610); R[ 3] = max(_x2,_x50*1.0011586727078900 + _x51*0.9707868061190170 + _x52*0.9906181076447950 + _x53*0.0211649058448753 + _x54*0.0313318044982702 + _x55*0.0096129126297349 + _x56*0.9792943649455940); R[ 4] = max(_x2,_x50*1.0011525984455200 + _x51*0.9713686732282480 + _x52*0.9904514808787100 + _x53*0.0215027957272504 + _x54*0.0306729857725527 + _x55*0.0097837090401843 + _x56*0.9789630146085700); R[ 5] = max(_x2,_x50*1.0011325252899800 + _x51*0.9731632306212520 + _x52*0.9898710814002040 + _x53*0.0226738799041561 + _x54*0.0286480476989607 + _x55*0.0103786227058710 + _x56*0.9778144666940430); R[ 6] = max(_x2,_x50*1.0010850066332700 + _x51*0.9767402231587650 + _x52*0.9882866087596400 + _x53*0.0258235649693629 + _x54*0.0246450407045709 + _x55*0.0120026452378567 + _x56*0.9747243211338360); R[ 7] = max(_x2,_x50*1.0009968788945300 + _x51*0.9815876054913770 + _x52*0.9842906927975040 + _x53*0.0334879385639851 + _x54*0.0192960753663651 + _x55*0.0160977721473922 + _x56*0.9671984823439730); R[ 8] = max(_x2,_x50*1.0008652515227400 + _x51*0.9862802656529490 + _x52*0.9739349056253060 + _x53*0.0519069663740307 + _x54*0.0142066612220556 + _x55*0.0267061902231680 + _x56*0.9490796575305750); R[ 9] = max(_x2,_x50*1.0006962900094000 + _x51*0.9899491476891340 + _x52*0.9418178384601450 + _x53*0.1007490148334730 + _x54*0.0102942608878609 + _x55*0.0595555440185881 + _x56*0.9008501289409770); R[10] = max(_x2,_x50*1.0005049611488800 + _x51*0.9924927015384200 + _x52*0.8173903261951560 + _x53*0.2391298997068470 + _x54*0.0076191460521811 + _x55*0.1860398265328260 + _x56*0.7631504454622400); R[11] = max(_x2,_x50*1.0003080818799200 + _x51*0.9941456804052560 + _x52*0.4324728050657290 + _x53*0.5348043122727480 + _x54*0.0058980410835420 + _x55*0.5705798201161590 + _x56*0.4659221716493190); R[12] = max(_x2,_x50*1.0001196660201300 + _x51*0.9951839750332120 + _x52*0.1384539782588700 + _x53*0.7978075786430300 + _x54*0.0048233247781713 + _x55*0.8614677684002920 + _x56*0.2012632804510050); R[13] = max(_x2,_x50*0.9999527659684070 + _x51*0.9957567501108180 + _x52*0.0537347216940033 + _x53*0.9114498940673840 + _x54*0.0042298748350633 + _x55*0.9458790897676580 + _x56*0.0877524413419623); R[14] = max(_x2,_x50*0.9998218368992970 + _x51*0.9959128182867100 + _x52*0.0292174996673231 + _x53*0.9537979630045070 + _x54*0.0040599171299341 + _x55*0.9704654864743050 + _x56*0.0457176793291679); R[15] = max(_x2,_x50*0.9997386095575930 + _x51*0.9956061578345280 + _x52*0.0213136517508590 + _x53*0.9712416154654290 + _x54*0.0043533695594676 + _x55*0.9784136302844500 + _x56*0.0284706050521843); R[16] = max(_x2,_x50*0.9997095516396120 + _x51*0.9945976009618540 + _x52*0.0201349530181136 + _x53*0.9793031238075880 + _x54*0.0053434425970201 + _x55*0.9795890314112240 + _x56*0.0205271767569850); R[17] = max(_x2,_x50*0.9997319302106270 + _x51*0.9922157154923700 + _x52*0.0241323096280662 + _x53*0.9833801195075750 + _x54*0.0076917201010463 + _x55*0.9755335369086320 + _x56*0.0165302792310211); R[18] = max(_x2,_x50*0.9997994363461950 + _x51*0.9862364527832490 + _x52*0.0372236145223627 + _x53*0.9854612465677550 + _x54*0.0135969795736536 + _x55*0.9622887553978130 + _x56*0.0145135107212858); R[19] = max(_x2,_x50*0.9999003303166710 + _x51*0.9679433372645410 + _x52*0.0760506552706601 + _x53*0.9864350469766050 + _x54*0.0316975442661115 + _x55*0.9231215745131200 + _x56*0.0136003508637687); R[20] = max(_x2,_x50*1.0000204065261100 + _x51*0.8912850042449430 + _x52*0.2053754719423990 + _x53*0.9867382506701410 + _x54*0.1078611963552490 + _x55*0.7934340189431110 + _x56*0.0133604258769571); R[21] = max(_x2,_x50*1.0001447879365800 + _x51*0.5362024778620530 + _x52*0.5412689034604390 + _x53*0.9866178824450320 + _x54*0.4638126031687040 + _x55*0.4592701359024290 + _x56*0.0135488943145680); R[22] = max(_x2,_x50*1.0002599790341200 + _x51*0.1541081190018780 + _x52*0.8158416850864860 + _x53*0.9862777767586430 + _x54*0.8470554052720110 + _x55*0.1855741036663030 + _x56*0.0139594356366992); R[23] = max(_x2,_x50*1.0003557969708900 + _x51*0.0574575093228929 + _x52*0.9128177041239760 + _x53*0.9858605924440560 + _x54*0.9431854093939180 + _x55*0.0881774959955372 + _x56*0.0144434255753570); R[24] = max(_x2,_x50*1.0004275378026900 + _x51*0.0315349873107007 + _x52*0.9463398301669620 + _x53*0.9854749276762100 + _x54*0.9688621506965580 + _x55*0.0543630228766700 + _x56*0.0148854440621406); R[25] = max(_x2,_x50*1.0004762334488800 + _x51*0.0222633920086335 + _x52*0.9599276963319910 + _x53*0.9851769347655580 + _x54*0.9780306674736030 + _x55*0.0406288447060719 + _x56*0.0152254296999746); R[26] = max(_x2,_x50*1.0005072096750800 + _x51*0.0182022841492439 + _x52*0.9662605952303120 + _x53*0.9849715740141810 + _x54*0.9820436438543060 + _x55*0.0342215204316970 + _x56*0.0154592848180209); R[27] = max(_x2,_x50*1.0005251915637300 + _x51*0.0162990559732640 + _x52*0.9693259700584240 + _x53*0.9848463034157120 + _x54*0.9839236237187070 + _x55*0.0311185790956966 + _x56*0.0156018026485961); R[28] = max(_x2,_x50*1.0005350960689600 + _x51*0.0153656239334613 + _x52*0.9708545367213990 + _x53*0.9847753518111990 + _x54*0.9848454841543820 + _x55*0.0295708898336134 + _x56*0.0156824871281936); R[29] = max(_x2,_x50*1.0005402209748200 + _x51*0.0149111568733976 + _x52*0.9716050665281280 + _x53*0.9847380666252650 + _x54*0.9852942758145960 + _x55*0.0288108739348928 + _x56*0.0157248764360615); R[30] = max(_x2,_x50*1.0005427281678400 + _x51*0.0146954339898235 + _x52*0.9719627697573920 + _x53*0.9847196483117650 + _x54*0.9855072952198250 + _x55*0.0284486271324597 + _x56*0.0157458108784121); R[31] = max(_x2,_x50*1.0005438956908700 + _x51*0.0145964146717719 + _x52*0.9721272722745090 + _x53*0.9847110233919390 + _x54*0.9856050715398370 + _x55*0.0282820301724731 + _x56*0.0157556123350225); R[32] = max(_x2,_x50*1.0005444821215100 + _x51*0.0145470156699655 + _x52*0.9722094177458120 + _x53*0.9847066833006760 + _x54*0.9856538499335780 + _x55*0.0281988376490237 + _x56*0.0157605443964911); R[33] = max(_x2,_x50*1.0005447695999200 + _x51*0.0145228771899495 + _x52*0.9722495776784240 + _x53*0.9847045543930910 + _x54*0.9856776850338830 + _x55*0.0281581655342037 + _x56*0.0157629637515278); R[34] = max(_x2,_x50*1.0005448988776200 + _x51*0.0145120341118965 + _x52*0.9722676219987420 + _x53*0.9847035963093700 + _x54*0.9856883918061220 + _x55*0.0281398910216386 + _x56*0.0157640525629106); R[35] = max(_x2,_x50*1.0005449625468900 + _x51*0.0145066940939832 + _x52*0.9722765094621500 + _x53*0.9847031240775520 + _x54*0.9856936646900310 + _x55*0.0281308901665811 + _x56*0.0157645892329510); R[36] = max(_x2,_x50*1.0005449892705800 + _x51*0.0145044507314479 + _x52*0.9722802433068740 + _x53*0.9847029256150900 + _x54*0.9856958798482050 + _x55*0.0281271086805816 + _x56*0.0157648147772649); R[37] = max(_x2,_x50*1.0005449969930000 + _x51*0.0145038009464639 + _x52*0.9722813248265600 + _x53*0.9847028681227950 + _x54*0.9856965214637620 + _x55*0.0281260133612096 + _x56*0.0157648801149616); } vec3 _x43(vec3 _x58){ mat3 _x57; _x57[0] = vec3(3.2409699419045200,-1.537383177570090,-0.4986107602930030); _x57[1] = vec3(-0.9692436362808790,1.875967501507720,0.0415550574071756); _x57[2] = vec3(0.0556300796969936,-0.203976958888976,1.0569715142428700); float _x54 = dot(_x57[0],_x58); float _x55 = dot(_x57[1],_x58); float _x56 = dot(_x57[2],_x58); return _x41(vec3(_x54,_x55,_x56)); } vec3 _x44(float R[_x0]){ vec3 _x58 = vec3(0.); _x58+=R[ 0] * vec3(0.0000646919989576,0.0000018442894440,0.0003050171476380); _x58+=R[ 1] * vec3(0.0002194098998132,0.0000062053235865,0.0010368066663574); _x58+=R[ 2] * vec3(0.0011205743509343,0.0000310096046799,0.0053131363323992); _x58+=R[ 3] * vec3(0.0037666134117111,0.0001047483849269,0.0179543925899536); _x58+=R[ 4] * vec3(0.0118805536037990,0.0003536405299538,0.0570775815345485); _x58+=R[ 5] * vec3(0.0232864424191771,0.0009514714056444,0.1136516189362870); _x58+=R[ 6] * vec3(0.0345594181969747,0.0022822631748318,0.1733587261835500); _x58+=R[ 7] * vec3(0.0372237901162006,0.0042073290434730,0.1962065755586570); _x58+=R[ 8] * vec3(0.0324183761091486,0.0066887983719014,0.1860823707062960); _x58+=R[ 9] * vec3(0.0212332056093810,0.0098883960193565,0.1399504753832070); _x58+=R[10] * vec3(0.0104909907685421,0.0152494514496311,0.0891745294268649); _x58+=R[11] * vec3(0.0032958375797931,0.0214183109449723,0.0478962113517075); _x58+=R[12] * vec3(0.0005070351633801,0.0334229301575068,0.0281456253957952); _x58+=R[13] * vec3(0.0009486742057141,0.0513100134918512,0.0161376622950514); _x58+=R[14] * vec3(0.0062737180998318,0.0704020839399490,0.0077591019215214); _x58+=R[15] * vec3(0.0168646241897775,0.0878387072603517,0.0042961483736618); _x58+=R[16] * vec3(0.0286896490259810,0.0942490536184085,0.0020055092122156); _x58+=R[17] * vec3(0.0426748124691731,0.0979566702718931,0.0008614711098802); _x58+=R[18] * vec3(0.0562547481311377,0.0941521856862608,0.0003690387177652); _x58+=R[19] * vec3(0.0694703972677158,0.0867810237486753,0.0001914287288574); _x58+=R[20] * vec3(0.0830531516998291,0.0788565338632013,0.0001495555858975); _x58+=R[21] * vec3(0.0861260963002257,0.0635267026203555,0.0000923109285104); _x58+=R[22] * vec3(0.0904661376847769,0.0537414167568200,0.0000681349182337); _x58+=R[23] * vec3(0.0850038650591277,0.0426460643574120,0.0000288263655696); _x58+=R[24] * vec3(0.0709066691074488,0.0316173492792708,0.0000157671820553); _x58+=R[25] * vec3(0.0506288916373645,0.0208852059213910,0.0000039406041027); _x58+=R[26] * vec3(0.0354739618852640,0.0138601101360152,0.0000015840125870); _x58+=R[27] * vec3(0.0214682102597065,0.0081026402038399,0.0000000000000000); _x58+=R[28] * vec3(0.0125164567619117,0.0046301022588030,0.0000000000000000); _x58+=R[29] * vec3(0.0068045816390165,0.0024913800051319,0.0000000000000000); _x58+=R[30] * vec3(0.0034645657946526,0.0012593033677378,0.0000000000000000); _x58+=R[31] * vec3(0.0014976097506959,0.0005416465221680,0.0000000000000000); _x58+=R[32] * vec3(0.0007697004809280,0.0002779528920067,0.0000000000000000); _x58+=R[33] * vec3(0.0004073680581315,0.0001471080673854,0.0000000000000000); _x58+=R[34] * vec3(0.0001690104031614,0.0000610327472927,0.0000000000000000); _x58+=R[35] * vec3(0.0000952245150365,0.0000343873229523,0.0000000000000000); _x58+=R[36] * vec3(0.0000490309872958,0.0000177059860053,0.0000000000000000); _x58+=R[37] * vec3(0.0000199961492222,0.0000072209749130,0.0000000000000000); return _x58; } float _x45(float R){ return pow(1.0 - R,2.0)/(2.0 * R); } float _x46(float KS){ return 1.0 + KS - sqrt(pow(KS,2.0)+ 2.0 * KS); } vec3 _x47(vec3 _x51){ vec4 _x59 = vec4(0.0,-1.0 / 3.0,2.0 / 3.0,-1.0); vec4 _x60 = mix(vec4(_x51.bg,_x59.wz),vec4(_x51.gb,_x59.xy),step(_x51.b,_x51.g)); vec4 _x61 = mix(vec4(_x60.xyw,_x51.r),vec4(_x51.r,_x60.yzx),step(_x60.x,_x51.r)); float _x62 = _x61.x - min(_x61.w,_x61.y); float _x63 = 1.0e-10; return vec3(abs(_x61.z +(_x61.w - _x61.y)/(6.0 * _x62 + _x63)),_x62 /(_x61.x + _x63),_x61.x); } vec3 _x48(vec3 _x51){ vec3 _x64 = clamp(abs(mod(_x51.x * 6.0 + vec3(0.0,4.0,2.0),6.0)- 3.0)- 1.0,0.0,1.0); _x64 = _x64 * _x64 *(3.0 - 2.0 * _x64); return _x51.z * mix(vec3(1.0),_x64,_x51.y); } const vec3 _x3 = vec3(26.0 / 255.0,26.0 / 255.0,26.0 / 255.0); const vec3 _x4 = vec3(242.0 / 255.0,242.0 / 255.0,242.0 / 255.0); const vec3 _x5 = vec3(47.0 / 255.0,47.0 / 255.0,47.0 / 255.0); const vec3 _x6 = vec3(85.0 / 255.0,85.0 / 255.0,85.0 / 255.0); const vec3 _x7 = vec3(150.0 / 255.0,150.0 / 255.0,150.0 / 255.0); const vec3 _x8 = vec3(63.0 / 255.0,77.0 / 255.0,24.0 / 255.0); const vec3 _x9 = vec3(255.0 / 255.0,160.0 / 255.0,62.0 / 255.0); const vec3 _x10 = vec3(175.0 / 255.0,140.0 / 255.0,89.0 / 255.0); const vec3 _x11 = vec3(4.0 / 255.0,130.0 / 255.0,130.0 / 255.0); const vec3 _x12 = vec3(57.0 / 255.0,80.0 / 255.0,192.0 / 255.0); const vec3 _x13 = vec3(140.0 / 255.0,106.0 / 255.0,172.0 / 255.0); const vec3 _x14 = vec3(138.0 / 255.0,149.0 / 255.0,73.0 / 255.0); const vec3 _x15 = vec3(136.0 / 255.0,122.0 / 255.0,125.0 / 255.0); const vec3 _x16 = vec3(138.0 / 255.0,57.0 / 255.0,26.0 / 255.0); const vec3 _x17 = vec3(112.0 / 255.0,79.0 / 255.0,57.0 / 255.0); const vec3 _x18 = vec3(168.0 / 255.0,200.0 / 255.0,72.0 / 255.0); const vec3 _x19 = vec3(240.0 / 255.0,170.0 / 255.0,207.0 / 255.0); const vec3 _x20 = vec3(128.0 / 255.0,49.0 / 255.0,52.0 / 255.0); const vec3 _x21 = vec3(233.0 / 255.0,175.0 / 255.0,52.0 / 255.0); const vec3 _x22 = vec3(128.0 / 255.0,125.0 / 255.0,114.0 / 255.0); const vec3 _x23 = vec3(121.0 / 255.0,132.0 / 255.0,129.0 / 255.0); const vec3 _x24 = vec3(159.0 / 255.0,114.0 / 255.0,85.0 / 255.0); const vec3 _x25 = vec3(181.0 / 255.0,180.0 / 255.0,185.0 / 255.0); const vec3 _x26 = vec3(235.0 / 255.0,220.0 / 255.0,201.0 / 255.0); const vec3 _x27 = vec3(148.0 / 255.0,162.0 / 255.0,158.0 / 255.0); const vec3 _x28 = vec3(210.0 / 255.0,169.0 / 255.0,151.0 / 255.0); const vec3 _x29 = vec3(165.0 / 255.0,162.0 / 255.0,147.0 / 255.0); const vec3 _x30 = vec3(203.0 / 255.0,243.0 / 255.0,251.0 / 255.0); const vec3 _x31 = vec3(174.0 / 255.0,161.0 / 255.0,164.0 / 255.0); const vec3 _x32 = vec3(155.0 / 255.0,155.0 / 255.0,155.0 / 255.0); const vec3 _x33 = vec3(208.0 / 255.0,34.0 / 255.0,63.0 / 255.0); const vec3 _x34 = vec3(255.0 / 255.0,249.0 / 255.0,56.0 / 255.0); const vec3 _x35 = vec3(2.0 / 255.0,66.0 / 255.0,109.0 / 255.0); const vec3 _x36 = vec3(255.0 / 255.0,127.0 / 255.0,80.0 / 255.0); const vec3 _x37 = vec3(152.0 / 255.0,251.0 / 255.0,152.0 / 255.0); void main(){ vec2 _x65 =(gl_FragCoord.xy - rect.xy)/ rect.zw; vec4 _x66 = texture2D(baseTex,_x65); if (useMask > 0.5){ float _x67 = texture2D(maskTex,_x65).r; if (_x67 < 0.5){ gl_FragColor = _x66; return; } } vec3 _x68 = _x66.rgb; float _x69 = _x66.a; vec3 _x70 = texture2D(strokeTex,_x65).rgb; float _x71 = dot(_x70,vec3(0.299,0.587,0.114)); float _x72 = brushColorMode; int _x73 = int(brushColorMode + 0.5); vec3 _x74; if (_x73==0){ _x74 = _x3; }else if (_x73==1){ _x74 = _x4; }else if (_x73==29){ _x74 = canvasBackgroundColor; }else if (_x73==33){ _x74 = customBrushColor; }else if (_x73==2){ _x74 = _x5; }else if (_x73==3){ _x74 = _x6; }else if (_x73==4){ _x74 = _x7; }else if (_x73==12){ _x74 = _x15; }else if (_x73==22){ _x74 = _x25; }else if (_x73==13){ _x74 = _x16; }else if (_x73==19){ _x74 = _x22; }else if (_x73==26){ _x74 = _x29; }else if (_x73==20){ _x74 = _x23; }else if (_x73==24){ _x74 = _x27; }else if (_x73==28){ _x74 = _x31; }else if (_x73==23){ _x74 = _x26; }else if (_x73==25){ _x74 = _x28; }else if (_x73==14){ _x74 = _x17; }else if (_x73==21){ _x74 = _x24; }else if (_x73==7){ _x74 = _x10; }else if (_x73==8){ _x74 = _x11; }else if (_x73==5){ _x74 = _x8; }else if (_x73==15){ _x74 = _x18; }else if (_x73==11){ _x74 = _x14; }else if (_x73==9){ _x74 = _x12; }else if (_x73==32){ _x74 = _x35; }else if (_x73==10){ _x74 = _x13; }else if (_x73==17){ _x74 = _x20; }else if (_x73==27){ _x74 = _x30; }else if (_x73==16){ _x74 = _x19; }else if (_x73==30){ _x74 = _x33; }else if (_x73==18){ _x74 = _x21; }else if (_x73==6){ _x74 = _x9; }else if (_x73==31){ _x74 = _x34; }else if (_x73==34){ _x74 = _x36; }else if (_x73==35){ _x74 = _x37; }else { _x74 = _x3; } vec3 _x75; float _x76 = clamp(1.0 - _x71,0.0,1.0); float _x77 = 0.0; if (_x71 > 0.9){ _x75 = _x68; gl_FragColor = vec4(_x75,_x69); return; } if (_x76 < 0.001){ _x75 = _x68; }else { if (brushCategory > 0.5){ float _x78 = pow(_x76,0.5); float _x79 = mix(1.0,0.5,_x78); _x75 = vec3(_x79); }else { vec3 _x80 = _x74; if (_x72 > 1.0){ vec3 _x81 = _x47(_x74); if (_x72==29.0){ _x81.x = 0.0; _x81.y = 0.0; _x81.z = 1.0; _x80 = _x48(_x81); }else { float _x82 = 1.0; if (_x72==2.0||_x72==3.0||_x72==4.0){ _x82 = 0.0; } float _x83 =(_x81.z > 0.6)?(0.95 - _x81.z): briShift; _x81.x = mod(_x81.x + hueShift * _x82,1.0); _x81.y = clamp(_x81.y + satShift * _x82,0.0,1.0); _x81.z = clamp(_x81.z + _x83 * _x82,0.0,0.95); _x80 = _x48(_x81); } } if (useSharpen==3.0||useSharpen==2.0||useSharpen==1.0){ _x77 = pow(_x76,0.7); }else if (useSharpen==0.0){ _x77 = 1.02 * clamp(0.15 +(1.0 - 0.15)* pow(_x76,0.6),0.0,1.0); }else if (useSharpen==4.0||useSharpen==5.0){ if (_x72==0.0){ _x77 = pow(_x76,1.5)* 0.98; }else { _x77 = pow(_x76,0.7); } }else { _x77 = 0.0; } float _x84 = dot(_x80,vec3(0.299,0.587,0.114)); vec3 _x85; if (useSharpen==0.0&&_x72 > 1.0){ if (_x84 > 0.65){ _x85 = vec3(_x84 * 0.8); }else { _x85 = vec3(0.95); } }else { _x85 = vec3(0.95); } float _x86 = dot(_x68,vec3(0.299,0.587,0.114)); float _x87 = max(max(abs(_x68.r - _x68.g),abs(_x68.g - _x68.b)),abs(_x68.b - _x68.r)); bool _x88 = _x87 < 0.05; vec4 _x89 = texture2D(typeMapTex,_x65); bool _x90 =(_x89.r > 0.75)||(_x88&&_x86 > 0.7)||(_x86 > 0.85&&_x87 < 0.15); bool _x91 =(_x72==0.0)||(_x72!=0.0&&(_x90||keyBlendMode==0)); vec3 _x92; if (_x91){ _x92 = mix(_x85,_x80,_x77); }else { _x92 = vec3(0.0); } if (_x72==0.0){ if (useSharpen==4.0||useSharpen==0.0||useSharpen==5.0){ if (_x88){ if (_x90){ vec3 _x93 = mix(_x68,_x92,_x77); vec3 _x94 = _x47(_x93); _x94.y = clamp(_x94.z * 0.0,0.0,1.0); _x94.z = clamp(_x94.z * 1.0,0.0,1.0); _x75 = _x48(_x94); }else { _x75 = min(_x68,_x92); } }else { vec3 _x93 = min(_x68,_x92); vec3 _x94 = _x47(_x93); _x94.y = 0.0; _x94.z = clamp(_x94.z * 1.0,0.0,1.0); _x75 = _x48(_x94); } }else { if (_x88){ vec3 _x93 = mix(_x68,_x92,_x77); vec3 _x94 = _x47(_x93); _x94.y = clamp(_x94.z * 0.0,0.0,1.0); _x94.z = clamp(_x94.z * 1.0,0.0,1.0); _x75 = _x48(_x94); }else { vec3 _x93 = mix(_x68,_x92,_x77); _x93 = min(_x68,_x92); vec3 _x94 = _x47(_x93); _x94.y = clamp(_x94.y * 0.0,0.0,1.0); _x94.z = clamp(_x94.z * 1.1,0.0,1.0); _x75 = _x48(_x94); } } }else { if (_x90){ vec3 _x95 = _x92; vec3 _x94 = _x47(_x95); if (_x94.y < 0.05){ _x94.y = 0.0; }else { _x94.y = clamp(_x94.y * 0.9,0.0,1.0); } _x94.z = clamp(_x94.z * 1.02,0.0,1.0); _x75 = _x48(_x94); }else { if (useSpectralMix > 0.5){ vec3 _x96 = _x40(_x68); vec3 _x97 = _x40(_x80); float sR1[_x0];float sR2[_x0]; _x42(_x96,sR1); _x42(_x97,sR2); float sR[_x0]; for (int _x98 = 0;_x98 < _x0;_x98++){ sR[_x98] = pow(sR1[_x98],0.35)* pow(sR2[_x98],0.65); } vec3 _x99 = _x43(_x44(sR)); vec3 _x100 = _x47(_x99); _x100.y = clamp(_x100.y * 1.2,0.0,1.0); _x99 = _x48(_x100); _x75 = mix(_x68,_x99,_x77); }else if (keyBlendMode==0){ _x75 = mix(_x68,_x92,_x77); }else if (keyBlendMode==1){ vec3 _x101 = mix(vec3(1.0),_x80,_x77); _x75 = _x68 * _x101; }else if (keyBlendMode==2){ vec3 _x102 = min(_x68,_x80); _x75 = mix(_x68,_x102,_x77); } } } } } float _x103; if (_x72==0.0){ _x103 = 0.99; }else if (_x72 > 1.0){ _x103 = 0.995 + _x77 * 0.005; _x103 = clamp(_x103,0.995,1.0); }else { _x103 = 0.99; } gl_FragColor = vec4(_x75,_x103); }`,
    // per-frame ink diffusion / feedback on the stroke draft (newBufferBlack ⇄ pingPong)
    "./shaders/feedback.frag": `#ifdef GL_ES
precision highp float;
#endif
uniform vec4 rect; uniform vec2 invResolution; uniform sampler2D tex0; uniform sampler2D forceMap; uniform float force; uniform float indiffusionStrength; uniform float brushMode; uniform float baseBrushSize; uniform float useSharpen; uniform float effect3Brightness; uniform float brushColorMode; uniform float brushCategory; uniform float mouseCount; uniform float mouseCountAccumulated; uniform float strokeSeed; uniform float useMask; uniform sampler2D maskTex; float _x5(vec2 co){ return fract(sin(dot(co.xy,vec2(12.9898,78.233)))* 43758.5453); } float _x5(float _x13){ return fract(cos(_x13 * 89.42)* 343.42); } float _x6(float _x13){ return fract(sin(_x13)* 43758.5453); } float _x7(vec2 x){ vec2 _x11 = floor(x); vec2 _x12 = fract(x); _x12 = _x12 * _x12 *(3.0 - 2.0 * _x12); float _x13 = _x11.x + _x11.y * 57.0; return mix(mix(_x6(_x13 + 0.0),_x6(_x13 + 1.0),_x12.x),mix(_x6(_x13 + 57.0),_x6(_x13 + 58.0),_x12.x),_x12.y); } float _x8(float _x14,float amount){ return clamp(1.0 /(clamp(_x14,1.0 / amount,1.0)* amount),0.0,1.0); } float _x9(vec2 _x15,float _x16,float xmax){ return max(_x16 - _x15.x,_x15.x - xmax); } vec4 _x10(vec4 _x17,vec2 _x18,vec2 _x19,sampler2D tex0,float intensity){ float _x20 = dot(_x17.rgb,vec3(0.299,0.587,0.114)); float _x21 = 1.0 - _x20; if (_x21 > 0.05){ float _x22 = _x7(_x18 * 15.0); float _x23 = _x7(_x18 * 35.0 + vec2(12.3,45.7)); float _x24 =(_x22 * 0.6 + _x23 * 0.4); float _x25 = 0.6; float _x26 = smoothstep(_x25,_x25 + 0.2,_x24); float _x27 = fract(sin(dot(_x18 * 100.0,vec2(12.9898,78.233)))* 43758.5453); float _x28 = 1.5 + _x27 * 0.8; vec2 _x29 = _x19 * _x28; vec4 _x30 = texture2D(tex0,_x18 + vec2(0.0,_x29.y)); vec4 _x31 = texture2D(tex0,_x18 + vec2(0.0,-_x29.y)); vec4 _x32 = texture2D(tex0,_x18 + vec2(-_x29.x,0.0)); vec4 _x33 = texture2D(tex0,_x18 + vec2(_x29.x,0.0)); float _x34 = dot(_x30.rgb,vec3(0.299,0.587,0.114)); float _x35 = dot(_x31.rgb,vec3(0.299,0.587,0.114)); float _x3 = dot(_x32.rgb,vec3(0.299,0.587,0.114)); float _x4 = dot(_x33.rgb,vec3(0.299,0.587,0.114)); float _x36 = abs(_x20 - _x34)+ abs(_x20 - _x35)+ abs(_x20 - _x3)+ abs(_x20 - _x4); _x36 = clamp(_x36 * 0.5,0.0,1.0); float _x37 = 0.35 + _x27 * 0.2; float _x38 = smoothstep(_x37,_x37 + 0.15,_x36); float _x39 = smoothstep(0.85,0.95,_x38); float _x40 = 0.6 + _x27 * 0.8; float _x41 = smoothstep(0.3,0.8,_x21); float _x42 = _x39 * _x41 * intensity * _x26; float _x43 = 0.3 * _x40 * _x42; _x17.rgb = mix(_x17.rgb,vec3(0.0),_x43); } return clamp(_x17,0.0,1.0); } void main(void){ vec2 _x18 =(gl_FragCoord.xy - rect.xy)/ rect.zw; vec2 _x44 = 1.0 / rect.zw; if (useMask > 0.5){ float _x45 = texture2D(maskTex,_x18).r; if (_x45 < 0.5){ gl_FragColor = texture2D(tex0,_x18); return; } } bool _x46 = _x18.x < 0.002||_x18.x > 0.998||_x18.y < 0.002||_x18.y > 0.998; if (_x46){ vec4 _x17 = texture2D(tex0,_x18); gl_FragColor = _x17; return; } vec4 _x47 = texture2D(forceMap,_x18); vec2 _x48 =(_x47.xy - vec2(0.5))* force * 0.2; vec4 _x49 = texture2D(tex0,_x18); vec4 _x50 = texture2D(tex0,_x18 + _x48 * _x44); vec4 _x51 = min(_x49,_x50); vec2 _x19 = _x44; if (useSharpen < 0.5){ float _x52 = dot(_x49.rgb,vec3(0.299,0.587,0.114)); float _x53 = 1.0 - _x52; if (_x53 < 0.01){ gl_FragColor = _x49; return; } float _x54 = dot(_x51.rgb,vec3(0.299,0.587,0.114)); float _x55 = 1.0 - _x54; if (_x55 > 0.01){ vec2 _x56 = -normalize(_x48 + vec2(0.0001)); vec4 _x57 = vec4(0.0); float _x58 = 0.0; const float _x0 = 0.8; const float _x1 = 2.0; const float _x2 = 1.0; vec2 offsets[4]; offsets[0] = vec2(0.0,1.0); offsets[1] = vec2(0.0,-1.0); offsets[2] = vec2(-1.0,0.0); offsets[3] = vec2(1.0,0.0); for (int _x59 = 0;_x59 < 4;_x59++){ vec2 _x60 = offsets[_x59] * _x19 * _x0; vec4 _x61 = texture2D(tex0,_x18 + _x60); float _x62 = 1.0 - dot(_x61.rgb,vec3(0.299,0.587,0.114)); float _x63 = abs(_x55 - _x62); float _x64 = dot(offsets[_x59],_x56); float _x65 = 1.0 + max(0.0,_x64)* _x2; float _x66 =(1.0 + _x63 * _x1)* _x65; _x57+=_x61 * _x66 * 0.5; _x58+=_x66; } _x57/=_x58; if (force > 0.5){ float _x67 = smoothstep(0.05,0.6,_x55)* indiffusionStrength; _x51 = mix(_x51,_x57,_x67); float _x68 = fract(sin(dot(_x18 * 100.0,vec2(12.9898,78.233)))* 43758.5453); _x68 = _x68 * 0.17 - 0.12; float _x69 =(1.0 - _x55 * 0.5); _x51.rgb+=_x68 * _x69 * _x55; float _x70 = dot(normalize(_x48 + vec2(0.001)),vec2(1.0,1.0))* 0.5 + 0.5; float _x71 = mix(0.90,1.06,_x70); if (_x55 > 0.1){ _x51.rgb*=_x71; } if (_x55 < 0.5){ float _x72 =(0.3 - _x55)* 0.15; _x51.rgb+=_x72; } } } _x51 = clamp(_x51,0.0,1.0); vec4 _x17 = _x51; gl_FragColor = clamp(_x17,0.0,1.0); }else if (useSharpen < 1.5){ float _x73 = dot(_x49.rgb,vec3(0.299,0.587,0.114)); if (_x73 > 0.99){ gl_FragColor = _x49; return; } if (brushCategory > 0.5){ vec4 _x17 = _x51; float _x20 = dot(_x17.rgb,vec3(0.299,0.587,0.114)); float _x21 = 1.0 - _x20; if (_x21 > 0.1){ float _x74 = fract(sin(dot(_x18 * 25.0,vec2(12.9898,78.233)))* 43758.5453); float _x75 = fract(sin(dot(_x18 * 50.0,vec2(45.164,94.673)))* 19134.9521); float _x76 = _x74 * 0.6 + _x75 * 0.4; float _x77 = step(0.35,_x76); _x17.rgb+=(_x77 - 0.5)* 0.15 * _x21; float _x78 = fract(sin(dot(_x18 * 110.0,vec2(67.521,23.845)))* 31415.9265); float _x79 = fract(sin(dot(_x18 * 180.0,vec2(31.628,52.741)))* 27182.8182); float _x80 = _x78 * 0.7 + _x79 * 0.3; float _x81 = step(0.4,_x80); _x17.rgb+=(_x81 - 0.5)* 0.12 * _x21; float _x82 = fract(sin(dot(_x18 * 320.0,vec2(89.123,67.456)))* 53241.6789); float _x83 = step(0.5,_x82); _x17.rgb+=(_x83 - 0.5)* 0.10 * _x21; float _x84 = fract(sin(dot(_x18 * 480.0,vec2(23.456,91.234)))* 67890.1234); float _x85 = fract(sin(dot(_x18 * 620.0,vec2(54.321,78.901)))* 45678.9012); float _x86 = _x84 * 0.6 + _x85 * 0.4; float _x87 = step(0.55,_x86); _x17.rgb+=(_x87 - 0.5)* 0.08 * _x21; float _x88 = _x7(_x18 * 120.0); _x17.rgb+=(_x88 - 0.5)* 0.02 * _x21; } gl_FragColor = clamp(_x17,0.0,1.0); return; } vec4 _x17 = _x51; float _x20 = dot(_x17.rgb,vec3(0.299,0.587,0.114)); float _x21 = 1.0 - _x20; if (_x21 > 0.2){ float _x89 = fract(sin(dot(_x18 * 15.0,vec2(12.9898,78.233)))* 43758.5453); float _x90 = fract(sin(dot(_x18 * 35.0,vec2(45.164,94.673)))* 19134.9521); float _x91 = fract(sin(dot(_x18 * 80.0,vec2(67.521,23.845)))* 31415.9265); float _x92 = _x89 * 0.6 + _x90 * 0.3 + _x91 * 0.1; _x92 = pow(_x92,0.6); float _x93 = smoothstep(0.1,0.8,_x92); vec4 _x94 = _x17; if (brushCategory < 0.5){ vec2 _x95 = _x19 * 1.3; vec4 _x96 = vec4(0.0); _x96+=texture2D(tex0,_x18 + vec2(0.0,_x95.y))* 0.15; _x96+=texture2D(tex0,_x18 + vec2(0.0,-_x95.y))* 0.15; _x96+=texture2D(tex0,_x18 + vec2(_x95.x,0.0))* 0.15; _x96+=texture2D(tex0,_x18 + vec2(-_x95.x,0.0))* 0.15; _x94 = mix(_x17,_x96,0.7); } vec2 _x97 = _x19 * 0.8; vec4 _x34 = texture2D(tex0,_x18 + vec2(0.0,_x97.y)); vec4 _x35 = texture2D(tex0,_x18 + vec2(0.0,-_x97.y)); vec4 _x3 = texture2D(tex0,_x18 + vec2(_x97.x,0.0)); vec4 _x4 = texture2D(tex0,_x18 + vec2(-_x97.x,0.0)); vec4 _x98 = _x17 * 5.0 -(_x34 + _x35 + _x3 + _x4); float _x99 = dot(_x98.rgb,vec3(0.299,0.587,0.114)); float _x100 = clamp(abs(_x99)* 3.0,0.0,1.0); float _x101 = 0.2; vec4 _x102 = mix(_x17,_x17 + _x98 * _x101,_x100); vec4 _x103 =(_x93 > 0.5)? _x94 : _x102; float _x104 = 0.8; float _x105 =(1.0 - _x93)* _x104; float _x55 = _x21; float _x106 = 1.0 + _x55; _x105*=_x106; float _x107 = 0.1; _x103.rgb = _x103.rgb *(1.0 + _x105 * _x107); _x103 = _x10(_x103,_x18,_x19,tex0,2.0); gl_FragColor = clamp(_x103,0.0,1.0); }else { gl_FragColor = _x17; } }else if (useSharpen < 2.5){ float _x73 = dot(_x49.rgb,vec3(0.299,0.587,0.114)); if (_x73 > 0.99){ gl_FragColor = _x49; return; } vec4 _x17 = _x51; float _x20 = dot(_x17.rgb,vec3(0.299,0.587,0.114)); float _x21 = 1.0 - _x20; if (_x21 > 0.05){ float _x27 = fract(sin(dot(_x18 * 100.0,vec2(12.9898,78.233)))* 43758.5453); float _x28 = 2.0 + _x27 * 1.5; vec2 _x29 = _x19 * _x28; float _x34 = dot(texture2D(tex0,_x18 + vec2(0.0,_x29.y)).rgb,vec3(0.299,0.587,0.114)); float _x35 = dot(texture2D(tex0,_x18 + vec2(0.0,-_x29.y)).rgb,vec3(0.299,0.587,0.114)); float _x3 = dot(texture2D(tex0,_x18 + vec2(-_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114)); float _x4 = dot(texture2D(tex0,_x18 + vec2(_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114)); float _x36 = abs(_x20 - _x34)+ abs(_x20 - _x35)+ abs(_x20 - _x3)+ abs(_x20 - _x4); _x36 = clamp(_x36 * .5,0.0,1.0); float _x37 = 0.15 + _x27 * 0.3; float _x38 = smoothstep(_x37,_x37 + 0.3,_x36); float _x40 = 0.5 + _x27 * 1.5; float _x108,centerShift,shiftStrength; if (brushCategory > 0.5){ _x108 = -0.25 * _x40; centerShift = 0.15 * _x40; shiftStrength = 1.5; }else { _x108 = -0.55 * _x40; centerShift = 0.3 * _x40; shiftStrength = 0.05; } float _x109 = mix(centerShift,_x108,_x38); float _x41 = smoothstep(0.3,0.8,_x21); _x109*=_x41; _x109 = _x109 * shiftStrength; _x17.rgb+=_x109; float _x110 = _x7(_x18 *(16.3 + 5.0 *(mouseCount / 40.0))+ fract(strokeSeed / 1200.0)); _x110+=_x7(_x18 *(5.0 + 5.0 *(mouseCount / 40.0))+ fract(strokeSeed / 1300.0))* 0.2; _x110 = _x110 / 2.0; if (_x110 < 0.5){ float _x111 =(0.5 - _x110)* 0.3 *(0.8 + _x27 * 0.4); if (brushCategory > 0.5){ }else { float _x112 = _x7(_x18 * 8.5 + vec2(12.3,45.7)); _x112 = _x7(_x18 * 12.0 + vec2(23.1,67.8))* 0.7 + _x112 * 0.3; _x112 = smoothstep(0.3,0.85,_x112); float _x113 = _x21 * 0.6; float _x114 = mix(_x113 * 0.3,_x113 * 1.8,_x112); _x17.rgb-=_x111 * _x114; } } float _x115 = _x27 * 6.28318; vec2 _x116 = vec2(cos(_x115),sin(_x115)); vec2 _x117 = _x18 * 2.0 + _x116 * 20.0 + fract(strokeSeed / 1400.0); float _x118 = _x7(_x117); _x118+=_x7(_x117 * 1.8 + fract(strokeSeed / 1500.0))* 0.1; _x118 =(_x118 / 1.4 - 0.5)* 0.1 *(0.7 + _x27 * 0.6); float _x119 = _x7(_x18 * 7.2 + vec2(34.5,89.1)+ fract(strokeSeed / 1600.0)); _x119 = _x7(_x18 * 11.5 + vec2(56.7,23.4)+ fract(strokeSeed / 1700.0))* 0.6 + _x119 * 0.4; _x119 = smoothstep(0.25,0.9,_x119); float _x120 = _x21 * 0.5; float _x121 = mix(_x120 * 0.1,_x120,_x119); _x17.rgb+=_x118 * _x121 *(1.0 - _x38 * 2.4); } gl_FragColor = clamp(_x17,0.0,1.0); return; }else if (useSharpen < 3.5){ float _x73 = dot(_x49.rgb,vec3(0.299,0.587,0.114)); if (_x73 > 0.99){ gl_FragColor = _x49; return; } vec4 _x17 = _x51; float _x20 = dot(_x17.rgb,vec3(0.299,0.587,0.114)); float _x21 = 1.0 - _x20; bool _x122 = force > 0.1; if (_x122&&_x21 > 0.1){ vec2 _x15 = _x18 * 100.0; const float _x3 = 18.0; const float _x4 = 20.0; float _x123 = _x9(_x15,_x3,_x4); float _x124 = dot(normalize(_x48 + vec2(0.001)),vec2(1.0,0.0)); _x123-=_x124 * 2.0; float _x125 = 50.0 + _x5(_x15.y)* 100.0; float _x126 = _x8(_x123,_x125)* smoothstep(0.2,0.7,_x21); _x17.rgb = mix(_x17.rgb,_x17.rgb * 0.7,_x126 * 0.3); _x17.rgb+=(_x5(_x15)- 0.5)* 0.03 * _x21; } if (_x122&&_x21 > 0.1){ float _x127 = _x7(_x18 * 40.0); _x127+=_x7(_x18 * 80.0)* 0.5; _x127/=1.5; float _x128 = smoothstep(0.55,0.75,_x127); _x17.rgb+=vec3(_x128 * 0.02); float _x129 = _x7(_x18 * 200.0); _x129+=_x7(_x18 * 400.0)* 0.5; _x129/=1.5; float _x83 = smoothstep(0.78,0.95,_x129); _x17.rgb+=vec3(_x83 * 0.2); } if (_x122&&_x21 > 0.1){ float _x130 = _x7(_x18 * 50.0)* 0.5; _x130+=_x7(_x18 * 100.0)* 0.3; _x130+=_x7(_x18 * 200.0)* 0.2; float _x131 =(_x130 - 0.5)* 0.12; float _x132 = smoothstep(0.2,0.5,_x21)*(1.0 - smoothstep(0.7,0.9,_x21)); _x17.rgb+=_x131 * _x132; } gl_FragColor = clamp(_x17,0.0,1.0); }else if (useSharpen < 4.5){ float _x133 = _x7((_x18 * 32.0 * fract(strokeSeed / 100.0))+ 0.5); float _x134 = mix(0.05,2.0,_x133); _x134 = max(0.0,_x134); float _x135; if (baseBrushSize>=1.0){ _x135 = 0.75; }else if (baseBrushSize>=0.5){ _x135 = mix(0.5,1.0,(baseBrushSize - 0.5)/ 0.5); }else if (baseBrushSize>=0.25){ _x135 = mix(0.2,0.5,(baseBrushSize - 0.25)/ 0.25); }else { _x135 = 0.2; } vec2 _x44 = _x134 * invResolution * _x135; vec4 _x47 = texture2D(forceMap,_x18); float _x136 = clamp(baseBrushSize / 1.5,0.5,2.0); vec2 _x137 =(_x47.xy - vec2(0.5))* _x44 * _x136; float _x138 = _x7(_x18 * 12.0 + vec2(mouseCount * 0.1,mouseCount * 0.2)+ fract(strokeSeed / 200.0)); float _x139 =(_x138 - 0.5)* 10.0; float _x140 = _x139 * _x136; float _x141 = atan(_x137.y,_x137.x); float _x142 = _x141 + _x140; float _x143 = length(_x137); vec2 _x144 = vec2(cos(_x142),sin(_x142))* _x143; float _x145 = _x7(_x18 * 8.0 + mouseCount * 0.1 + fract(strokeSeed / 300.0))* 6.28318; float _x146 = 0.50; vec2 _x147 = vec2(cos(_x145),sin(_x145))* _x44 * _x146 * _x136; vec2 _x148 = clamp(_x18 + _x144,vec2(0.01),vec2(0.99)); vec2 _x149 = clamp(_x18 + _x144 + _x147,vec2(0.01),vec2(0.99)); vec2 _x150 = clamp(_x18 + _x144 - _x147 * 0.6,vec2(0.01),vec2(0.99)); vec4 _x151 = texture2D(tex0,_x18); vec4 _x152 = texture2D(tex0,_x148); vec4 _x153 = texture2D(tex0,_x149); vec4 _x154 = texture2D(tex0,_x150); vec4 _x155 = min(_x152,min(_x153,_x154)); vec4 _x156; if (brushColorMode==1.0){ _x156 = max(_x151,_x155); }else { _x156 = min(_x151,_x155); } float _x157 = dot(_x156.rgb,vec3(0.299,0.587,0.114)); if (_x157 > 0.99){ gl_FragColor = clamp(_x151,0.0,0.95); return; } float _x55 = 1.0 - _x157; bool _x122 = force > 0.1; float _x73 = dot(_x151.rgb,vec3(0.299,0.587,0.114)); float _x53 = 1.0 - _x73; float _x158 = dot(_x155.rgb,vec3(0.299,0.587,0.114)); float _x159 = 1.0 - _x158; vec2 _x160 = _x47.xy - vec2(0.5); float _x161 = length(_x160); float _x162 = clamp(_x161 / 0.707,0.0,1.0); vec2 _x48 = _x160 * force * 0.2; float _x163 = length(_x48); bool _x164 = _x122&&_x163 > 0.0001&&_x159 > _x53 + 0.08; float _x165 = mix(0.3,1.5,_x162); if (_x55 > 0.1){ float _x166 = _x7(_x18 * 2.0 + mouseCount * 0.02 + fract(strokeSeed / 400.0)); float _x167 = _x7(_x18 * 50.0 + mouseCount * 0.03 + fract(strokeSeed / 500.0)); float _x168 = _x7(_x18 * 400.0 + fract(strokeSeed / 600.0)); float _x169 = _x166 * 0.5 + _x167 * 0.3 + _x168 * 0.2; float _x170 = smoothstep(0.75,0.92,_x169); float _x171 = _x170 * _x55; _x156.rgb = mix(_x156.rgb,vec3(1.0),_x171); float _x172 = mix(0.80,0.95,1.0 - _x55); _x156.rgb = min(_x156.rgb,vec3(_x172)); if (_x164&&_x53 > 0.05){ float _x27 = fract(sin(dot(_x18 * 100.0,vec2(12.9898,78.233))+ strokeSeed)* 43758.5453); float _x28 = 1.0 + _x27 * 2.0; vec2 _x29 = _x19 * _x28; float _x34 = dot(texture2D(tex0,_x18 + vec2(0.0,_x29.y)).rgb,vec3(0.299,0.587,0.114)); float _x35 = dot(texture2D(tex0,_x18 + vec2(0.0,-_x29.y)).rgb,vec3(0.299,0.587,0.114)); float _x3 = dot(texture2D(tex0,_x18 + vec2(-_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114)); float _x4 = dot(texture2D(tex0,_x18 + vec2(_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114)); float _x36 = abs(_x73 - _x34)+ abs(_x73 - _x35)+ abs(_x73 - _x3)+ abs(_x73 - _x4); _x36 = clamp(_x36 * .5,0.0,1.0); float _x37 = 0.15 + _x27 * 0.3; float _x38 = smoothstep(_x37,_x37 + 0.3,_x36); float _x40 = 0.5 + _x27 * 1.5; float _x108,centerShift,shiftStrength; if (brushCategory > 0.5){ _x108 = -0.25 * _x40; centerShift = 0.15 * _x40; shiftStrength = 1.5; }else { _x108 = -0.05 * _x40; centerShift = 0.8 * _x40; shiftStrength = 0.02; } float _x109 = mix(centerShift,_x108,_x38); float _x41 = smoothstep(0.1,0.8,_x53); _x109*=_x41; _x109 = _x109 * shiftStrength; _x109*=_x165; vec3 _x173 = vec3(_x109); _x156.rgb+=_x173 * _x55; float _x110 = _x7(_x18 *(16.3 + 5.0 *(mouseCount / 40.0))+ fract(strokeSeed / 700.0)); _x110+=_x7(_x18 *(15.2 + 8.0 *(mouseCount / 40.0))+ fract(strokeSeed / 800.0))* 0.2; _x110 = _x110 / 1.5; if (_x110 < 0.5){ float _x111 =(0.5 - _x110)* 0.3 *(0.8 + _x27 * 0.4); if (brushCategory > 0.5){ }else { _x156.rgb-=_x111 * _x55 * _x165; } } float _x115 = _x27 * 6.28318; vec2 _x116 = vec2(cos(_x115),sin(_x115)); vec2 _x117 = _x18 * 50.0 + _x116 * 20.0 + fract(strokeSeed / 1000.0); float _x118 = _x7(_x117); _x118+=_x7(_x117 * 1.8 + fract(strokeSeed / 1100.0))* 0.4; _x118 =(_x118 / 1.4 - 0.5)* 0.1 *(0.7 + _x27 * 0.6); _x156.rgb+=_x118 * _x55 *(1.0 - _x38 * 0.4)* _x165; float _x74 = fract(sin(dot(_x18 * 25.0,vec2(12.9898,78.233)))* 43758.5453); float _x75 = fract(sin(dot(_x18 * 50.0,vec2(45.164,94.673)))* 19134.9521); float _x76 = _x74 * 0.6 + _x75 * 0.4; float _x77 = step(0.35,_x76); _x156.rgb+=(_x77 - 0.5)* 0.15 * _x55 * _x165; float _x78 = fract(sin(dot(_x18 * 110.0,vec2(67.521,23.845)))* 31415.9265); float _x79 = fract(sin(dot(_x18 * 180.0,vec2(31.628,52.741)))* 27182.8182); float _x80 = _x78 * 0.7 + _x79 * 0.3; float _x81 = step(0.4,_x80); _x156.rgb+=(_x81 - 0.5)* 0.2 * _x55 * _x165; float _x82 = fract(sin(dot(_x18 * 320.0,vec2(89.123,67.456)))* 53241.6789); float _x83 = step(0.5,_x82); _x156.rgb+=(_x83 - 0.5)* 0.10 * _x55 * _x165; float _x84 = fract(sin(dot(_x18 * 480.0,vec2(23.456,91.234)))* 67890.1234); float _x85 = fract(sin(dot(_x18 * 620.0,vec2(54.321,78.901)))* 45678.9012); float _x86 = _x84 * 0.6 + _x85 * 0.4; float _x87 = step(0.55,_x86); _x156.rgb+=(_x87 - 0.5)* 0.08 * _x55 * _x165; float _x88 = _x7(_x18 * 120.0); _x156.rgb+=(_x88 - 0.5)* 0.02 * _x55 * _x165; } } gl_FragColor = clamp(_x156,0.0,1.0); }else if (useSharpen < 5.5){ float _x174 = 0.3; float _x175 = 1.0; if (brushColorMode < 1.0){ _x175 = 0.7; }else { _x175 = 2.0; } float _x176 = mouseCountAccumulated; float _x177 = fract(strokeSeed / 10000.0); float _x178 = fract(strokeSeed / 1000000.0); float _x133 = _x7((_x18 * 32.0 + vec2(_x177 * 10.0,_x178 * 10.0))+ _x176 * 0.01); float _x134 = mix(0.05,2.0,_x133); _x134 = max(0.0,_x134); float _x135; if (baseBrushSize>=1.0){ _x135 = 0.75; }else if (baseBrushSize>=0.5){ _x135 = mix(0.5,1.0,(baseBrushSize - 0.5)/ 0.5); }else if (baseBrushSize>=0.25){ _x135 = mix(0.2,0.5,(baseBrushSize - 0.25)/ 0.25); }else { _x135 = 0.2; } _x135*=_x174; vec2 _x44 = _x134 * invResolution * _x135; vec4 _x47 = texture2D(forceMap,_x18); float _x136 = clamp(baseBrushSize / 1.5,0.5,2.0); vec2 _x137 =(_x47.xy - vec2(0.5))* _x44 * _x136; float _x138 = _x7(_x18 * 12.0 + vec2(_x176 * 0.1,_x176 * 0.2)+ fract(strokeSeed / 200.0)); float _x139 =(_x138 - 0.5)* 10.0; float _x140 = _x139 * _x136; float _x141 = atan(_x137.y,_x137.x); float _x142 = _x141 + _x140; float _x143 = length(_x137); vec2 _x144 = vec2(cos(_x142),sin(_x142))* _x143; float _x145 = _x7(_x18 * 8.0 + _x176 * 0.1 + fract(strokeSeed / 300.0))* 6.28318; float _x146 = 0.50; vec2 _x147 = vec2(cos(_x145),sin(_x145))* _x44 * _x146 * _x136; vec2 _x148 = clamp(_x18 + _x144,vec2(0.01),vec2(0.99)); vec2 _x149 = clamp(_x18 + _x144 + _x147,vec2(0.01),vec2(0.99)); vec2 _x150 = clamp(_x18 + _x144 - _x147 * 0.6,vec2(0.01),vec2(0.99)); vec4 _x151 = texture2D(tex0,_x18); vec4 _x152 = texture2D(tex0,_x148); vec4 _x153 = texture2D(tex0,_x149); vec4 _x154 = texture2D(tex0,_x150); vec4 _x155 = min(_x152,min(_x153,_x154)); vec4 _x156; if (brushColorMode==1.0){ _x156 = max(_x151,_x155); }else { _x156 = min(_x151,_x155); } float _x157 = dot(_x156.rgb,vec3(0.299,0.587,0.114)); if (_x157 > 0.99){ gl_FragColor = clamp(_x151,0.0,0.95); return; } float _x55 = 1.0 - _x157; bool _x122 = force > 0.1; float _x73 = dot(_x151.rgb,vec3(0.299,0.587,0.114)); float _x53 = 1.0 - _x73; float _x158 = dot(_x155.rgb,vec3(0.299,0.587,0.114)); float _x159 = 1.0 - _x158; vec2 _x160 = _x47.xy - vec2(0.5); float _x161 = length(_x160); float _x162 = clamp(_x161 / 0.707,0.0,1.0); vec2 _x48 = _x160 * force * 0.2; float _x163 = length(_x48); bool _x164 = _x122&&_x163 > 0.0001&&_x159 > _x53 + 0.08; float _x165 = mix(0.3,1.5,_x162); if (_x164&&_x55 > 0.1){ float _x179 = mix(0.80,0.70,smoothstep(0.1,0.8,_x55)); _x156.rgb*=_x179; } if (_x55 > 0.1){ float _x166 = _x7(_x18 * 2.0 + _x176 * 0.02 + fract(strokeSeed / 400.0)); float _x167 = _x7(_x18 * 50.0 + _x176 * 0.03 + fract(strokeSeed / 500.0)); float _x168 = _x7(_x18 * 400.0 + fract(strokeSeed / 600.0)); float _x169 = _x166 * 0.5 + _x167 * 0.3 + _x168 * 0.2; float _x170 = smoothstep(0.75,0.92,_x169); float _x171 = _x170 * _x55; _x156.rgb = mix(_x156.rgb,vec3(1.0),_x171); if (_x53 > 0.05){ float _x27 = fract(sin(dot(_x18 * 100.0,vec2(12.9898,78.233))+ strokeSeed)* 43758.5453); float _x180 = _x7(_x18 * 8.0 + fract(strokeSeed / 2000.0)); float _x181 = _x7(_x18 * 3.0 + fract(strokeSeed / 2100.0))* 0.6; float _x182 = _x7(_x18 * 100.0 + fract(strokeSeed / 2200.0))* 0.2; float _x183 =(_x180 + _x181 + _x182)/ 1.9; float _x184 = 1.5; float _x185 = 2.0; float _x186 = 0.6; float _x187 = _x7(_x18 * 12.0 + fract(strokeSeed / 2300.0)); float _x188 = mix(1.0,_x187,_x186); float _x189 = mix(1.0 / _x184,_x184,_x183)* _x188 * _x185; float _x190 = mix(0.5,1.5,_x183); float _x191 = mix(0.0,2.0,_x183); float _x192 = mix(0.01,2.0,_x183); float _x28 =(1.0 + _x27 * 2.0)* _x191; vec2 _x29 = _x19 * _x28; float _x34 = dot(texture2D(tex0,_x18 + vec2(0.0,_x29.y)).rgb,vec3(0.299,0.587,0.114)); float _x35 = dot(texture2D(tex0,_x18 + vec2(0.0,-_x29.y)).rgb,vec3(0.299,0.587,0.114)); float _x3 = dot(texture2D(tex0,_x18 + vec2(-_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114)); float _x4 = dot(texture2D(tex0,_x18 + vec2(_x29.x,0.0)).rgb,vec3(0.299,0.587,0.114)); float _x36 = abs(_x73 - _x34)+ abs(_x73 - _x35)+ abs(_x73 - _x3)+ abs(_x73 - _x4); _x36 = clamp(_x36 * .5,0.0,1.0); float _x37 = 0.15 + _x27 * 0.3; float _x38 = smoothstep(_x37,_x37 + 0.3,_x36); float _x40 = 0.5 + _x27 * 1.5; float _x108,centerShift,shiftStrength; if (brushCategory > 0.5){ _x108 = -0.25 * _x40; centerShift = 0.15 * _x40; shiftStrength = 1.5; }else { _x108 = -0.05 * _x40; centerShift = 0.8 * _x40; shiftStrength = 0.02; } float _x109 = mix(centerShift,_x108,_x38); float _x41 = smoothstep(0.1,0.8,_x53); _x109*=_x41; _x109 = _x109 * shiftStrength; float _x193 = _x164 ? _x165 : 0.7; _x193*=_x175; _x193*=_x190; _x109*=_x193; vec3 _x173 = vec3(_x109); _x156.rgb+=_x173 * _x55; float _x194 = mod(_x176,40.0); float _x110 = _x7(_x18 *(16.3 + 5.0 *(_x194 / 40.0))* _x191 * _x189 + fract(strokeSeed / 700.0)+ _x176 * 0.001); _x110+=_x7(_x18 *(15.2 + 8.0 *(_x194 / 40.0))* _x191 * _x189 + fract(strokeSeed / 800.0)+ _x176 * 0.001)* 0.2; _x110 = _x110 / 1.5; if (_x110 < 0.5){ float _x111 =(0.5 - _x110)* 0.3 *(0.8 + _x27 * 0.4); if (brushCategory > 0.5){ }else { _x156.rgb-=_x111 * _x55 * _x193 * _x192; } } float _x115 = _x27 * 6.28318; vec2 _x116 = vec2(cos(_x115),sin(_x115)); vec2 _x117 = _x18 * 50.0 * _x191 * _x189 + _x116 * 20.0 + fract(strokeSeed / 1000.0); float _x118 = _x7(_x117); _x118+=_x7(_x117 * 1.8 + fract(strokeSeed / 1100.0))* 0.4; _x118 =(_x118 / 1.4 - 0.5)* 0.1 *(0.7 + _x27 * 0.6); _x156.rgb+=_x118 * _x55 *(1.0 - _x38 * 0.4)* _x193 * _x192; float _x74 = fract(sin(dot(_x18 * 25.0 * _x191 * _x189,vec2(12.9898,78.233)))* 43758.5453); float _x75 = fract(sin(dot(_x18 * 50.0 * _x191 * _x189,vec2(45.164,94.673)))* 19134.9521); float _x76 = _x74 * 0.6 + _x75 * 0.4; float _x77 = step(0.35 * _x192,_x76); _x156.rgb+=(_x77 - 0.5)* 0.15 * _x55 * _x193 * _x192; float _x78 = fract(sin(dot(_x18 * 110.0 * _x191 * _x189,vec2(67.521,23.845)))* 31415.9265); float _x79 = fract(sin(dot(_x18 * 180.0 * _x191 * _x189,vec2(31.628,52.741)))* 27182.8182); float _x80 = _x78 * 0.7 + _x79 * 0.3; float _x81 = step(0.4 * _x192,_x80); _x156.rgb+=(_x81 - 0.5)* 0.2 * _x55 * _x193 * _x192; float _x82 = fract(sin(dot(_x18 * 320.0 * _x191 * _x189,vec2(89.123,67.456)))* 53241.6789); float _x83 = step(0.5 * _x192,_x82); _x156.rgb+=(_x83 - 0.5)* 0.10 * _x55 * _x193 * _x192; float _x84 = fract(sin(dot(_x18 * 480.0 * _x191 * _x189,vec2(23.456,91.234)))* 67890.1234); float _x85 = fract(sin(dot(_x18 * 620.0 * _x191 * _x189,vec2(54.321,78.901)))* 45678.9012); float _x86 = _x84 * 0.6 + _x85 * 0.4; float _x87 = step(0.55 * _x192,_x86); _x156.rgb+=(_x87 - 0.5)* 0.08 * _x55 * _x193 * _x192; float _x88 = _x7(_x18 * 120.0 * _x191 * _x189); _x156.rgb+=(_x88 - 0.5)* 0.02 * _x55 * _x193 * _x192; } } gl_FragColor = clamp(_x156,0.0,1.0); } }`,
    // flow (liquify) effect on the last stroke
    "./shaders/flow.frag": `#ifdef GL_ES
precision highp float;
#endif
uniform vec4 rect; uniform sampler2D tex0; uniform sampler2D lastStrokeTex; uniform int lastStrokeOnly; uniform int blendType; uniform float blendVol; uniform float radSeed; uniform vec4 strokeBounds; uniform float pixD; uniform float blendA; uniform float blendB; uniform float directVol; uniform float snoiseVol; uniform int gobalStyle; uniform int vline; uniform int hline; uniform float cellT; uniform float colorDeep; uniform float whiteDot; uniform float doBigShape; uniform float doMask; uniform int multiDir; uniform int drawTime; uniform float seed; uniform float iTime; uniform float pixelScale; uniform int isTypeMapMode; const int _x0 = 3; vec4 _x2(vec4 _x30){ return _x30 - floor(_x30 *(1.0 / 289.0))* 289.0; } vec3 _x2(vec3 _x30){ return _x30 - floor(_x30 *(1.0 / 289.0))* 289.0; } vec2 _x2(vec2 _x30){ return _x30 - floor(_x30 *(1.0 / 289.0))* 289.0; } vec3 _x3(vec3 _x30){ return _x2(((_x30 * 34.0)+ 1.0)* _x30); } vec4 _x3(vec4 _x30){ return _x2(((_x30 * 34.0)+ 1.0)* _x30); } float _x4(vec2 _x19){ _x19 = fract(_x19 * vec2(123.34,456.21)+ radSeed); _x19+=dot(_x19,_x19 + 45.32); return fract(_x19.x * _x19.y); } float _x5(float _x14,float _x15,float _x16,float _x17,float max2){ return _x17 +(_x14 - _x15)*(max2 - _x17)/(_x16 - _x15); } vec3 _x6(vec3 _x42){ vec4 _x18 = vec4(0.0,-1.0 / 3.0,2.0 / 3.0,-1.0); vec4 _x19 = mix(vec4(_x42.bg,_x18.wz),vec4(_x42.gb,_x18.xy),step(_x42.b,_x42.g)); vec4 _x20 = mix(vec4(_x19.xyw,_x42.r),vec4(_x42.r,_x19.yzx),step(_x19.x,_x42.r)); float _x21 = _x20.x - min(_x20.w,_x20.y); float _x22 = 1.0e-10; return vec3(abs(_x20.z +(_x20.w - _x20.y)/(6.0 * _x21 + _x22)),_x21 /(_x20.x + _x22),_x20.x); } vec3 _x7(vec3 _x42){ vec4 _x23 = vec4(1.0,2.0 / 3.0,1.0 / 3.0,3.0); vec3 _x19 = abs(fract(_x42.xxx + _x23.xyz)* 6.0 - _x23.www); return _x42.z * mix(_x23.xxx,clamp(_x19 - _x23.xxx,0.0,1.0),_x42.y); } float _x8(vec2 v){ const vec4 _x1 = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439); vec2 _x24 = floor(v + dot(v,_x1.yy)); vec2 _x25 = v - _x24 + dot(_x24,_x1.xx); vec2 _x26 =(_x25.x > _x25.y)? vec2(1.0,0.0): vec2(0.0,1.0); vec2 _x27 = _x25.xy + _x1.xx - _x26; vec2 _x28 = _x25.xy + _x1.zz; _x24 = _x2(_x24); vec3 _x19 = _x3(_x3(_x24.y + vec3(0.0,_x26.y,1.0))+ _x24.x + vec3(0.0,_x26.x,1.0)); vec3 _x29 = max(0.5 - vec3(dot(_x25,_x25),dot(_x27,_x27),dot(_x28,_x28)),0.0); _x29 = _x29 * _x29 * _x29 * _x29; vec3 _x30 = 2.0 * fract(_x19 * _x1.www)- 1.0; vec3 _x31 = abs(_x30)- 0.5; vec3 _x32 = floor(_x30 + 0.5); vec3 _x33 = _x30 - _x32; _x29*=1.79284291400159 - 0.85373472095314 *(_x33 * _x33 + _x31 * _x31); vec3 _x34 = vec3(0.0); _x34.x = _x33.x * _x25.x + _x31.x * _x25.y; _x34.yz = _x33.yz * _x27.xy + _x31.yz * _x28.xy; return snoiseVol * dot(_x29,_x34); } vec2 _x9(vec2 v){ float _x35 = _x5(_x4(vec2(0.16,0.73)),0.0,1.0,5.0,15.0); float _x36 = _x5(_x4(vec2(0.46,0.35)),0.0,1.0,15.0,24.0); float _x37 = _x5(_x4(vec2(0.24,0.95)),0.0,1.0,20.0,30.0); float _x38 = _x5(_x4(vec2(0.57,0.27)),0.0,1.0,40.0,50.0); return vec2(_x8(v)- _x8(v + vec2(_x35,_x36)),_x8(v + vec2(_x37,_x38))- _x8(v + vec2(56.7,67.8))); } float _x10(vec2 _x19){ vec2 _x24 = floor(_x19); vec2 _x39 = fract(_x19); float _x40 = _x4(_x24); float _x41 = _x4(_x24 + vec2(1.0,0.0)); float _x42 = _x4(_x24 + vec2(0.0,1.0)); float _x21 = _x4(_x24 + vec2(1.0,1.0)); vec2 _x43 = _x39 * _x39 *(3.0 - 2.0 * _x39); return mix(_x40,_x41,_x43.x)+(_x42 - _x40)* _x43.y *(1.0 - _x43.x)+(_x21 - _x41)* _x43.x * _x43.y; } float _x11(vec2 _x19){ float _x39 = 0.0; float _x44 = 0.5; for (int _x24 = 0;_x24 < 5;_x24++){ _x39+=_x44 * _x10(_x19); _x19*=2.0; _x44*=0.5; } return _x39; } vec2 _x12(vec2 P){
#define K 0.142857142857
#define K2 0.0714285714285
#define jitter 0.8
vec2 _x45 = mod(floor(P),289.0); vec2 _x46 = fract(P); vec4 _x47 = _x46.x + vec4(-0.5,-1.5,-0.5,-1.5); vec4 _x48 = _x46.y + vec4(-0.5,-0.5,-1.5,-1.5); vec4 _x49 = vec4(_x45.x,_x45.x,_x45.x + 1.0,_x45.x + 1.0); vec4 _x50 = vec4(_x45.y,_x45.y + 1.0,_x45.y,_x45.y + 1.0); vec4 _x32 = mod(_x3(mod(_x49,289.0)),7.0)* K + K2; vec4 _x51 = mod(_x3(mod(_x50,289.0)),7.0)* K + K2; vec4 _x52 = _x47 + jitter * _x32; vec4 _x53 = _x48 + jitter * _x51; vec4 _x21 = _x52 * _x52 + _x53 * _x53; vec2 _x54 = min(_x21.xy,_x21.zw); vec2 _x55 = max(_x21.xy,_x21.zw); _x54 = min(_x54,_x55.yx); return sqrt(_x54); } float _x13(float _x30){ float _x56 = 0.8; float _x57 = 0.5; return 1.0 - exp(-0.5 * pow((_x30 - _x57)/ _x56,2.0)); } void main(){ vec2 _x58 =(gl_FragCoord.xy - rect.xy)/ rect.zw; vec2 _x59 = rect.zw; float _x60 = pixelScale > 0.0 ? pixelScale : 1.0; vec2 _x61 = _x60 / _x59; vec2 _x62 = gl_FragCoord.xy / _x60; if (_x58.x < strokeBounds.x||_x58.x > strokeBounds.z|| _x58.y < strokeBounds.y||_x58.y > strokeBounds.w){ gl_FragColor = texture2D(tex0,_x58); return; } float _x63 = 1.0; float _x64 = 0.06; float _x65 = smoothstep(strokeBounds.x,strokeBounds.x + _x64,_x58.x); float _x66 = smoothstep(strokeBounds.z,strokeBounds.z - _x64,_x58.x); float _x67 = smoothstep(strokeBounds.y,strokeBounds.y + _x64,_x58.y); float _x68 = smoothstep(strokeBounds.w,strokeBounds.w - _x64,_x58.y); float _x69 = min(min(_x65,_x66),min(_x67,_x68)); float _x70 = mix(0.05,0.15,1.0 - _x69); float _x71 = _x4(_x62 * _x70 + radSeed * 0.1); _x63 = step(_x71,_x69); vec2 _x72 = _x58; vec2 _x73 = _x72; float _x74 = pixD > 0.0 ? pixD : 1.0; float _x75 = blendVol > 0.0 ? blendVol : 100.0; vec4 _x76 = texture2D(tex0,_x72); float _x77 = dot(_x76.rgb,vec3(0.299,0.587,0.114)); float _x78 = _x4(vec2(0.02,0.12 + seed)); float _x79 = _x10(_x72 * 10.1); _x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75; _x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0; if (gobalStyle==0){ if (_x79 < 0.4){ _x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75; _x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0; }else if (_x79>=0.4&&_x79 < 0.7){ _x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75 * 3.1; _x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0 * 3.1; }else if (_x79>=0.7){ _x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75 * 5.01; _x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0 * 5.01; } }else if (gobalStyle==1){ if (_x79 < 0.7){ _x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75; _x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0; }else { float _x80 = _x5(_x4(vec2(5.3,6.1)),0.0,1.0,3.0,15.0); _x73+=_x9(_x62 * 0.001 * _x74)* _x61 * _x75 * _x80; _x73+=_x9(_x62 * 0.005 * _x74)* _x61 * _x75 / 2.0 * _x80; } } float _x81 = directVol > 0.0 ? directVol : 10.0; if (multiDir==1){ float layerFrequencies[3]; float layerAmplitudes[3]; layerFrequencies[0] = 0.005; layerFrequencies[1] = 0.01; layerFrequencies[2] = 0.02; layerAmplitudes[0] = _x81 * 0.7; layerAmplitudes[1] = _x81 * 0.3; layerAmplitudes[2] = _x81 * 0.1; vec2 layerDirections[3]; layerDirections[0] = vec2(0.5,0.8); layerDirections[1] = vec2(-0.6,0.3); layerDirections[2] = vec2(0.2,-0.4); for (int _x24 = 0;_x24 < 3;_x24++){ vec2 _x82 = layerDirections[_x24]; float _x83 = layerFrequencies[_x24]; float _x84 = layerAmplitudes[_x24]; vec2 _x85 = vec2(_x8(vec2(_x62.y * _x83 * _x82.y,_x62.x * _x83 * _x82.x)),_x8(vec2(_x62.x * _x83 * _x82.x,_x62.y * _x83 * _x82.y))); float _x86 = _x13(_x72.y); _x73+=_x85 * _x61 * _x75 * _x84 *(1.0 - _x86); } }else { vec2 _x87 = vec2(_x8(vec2(_x62.y * 0.005,_x62.x * 0.002)),_x8(vec2(_x62.x * 0.01,_x62.y * 0.02))); float _x86 = _x13(_x72.y); _x73+=_x87 * _x61 * _x75 * _x81 * 0.1 *(1.0 - _x86); } if (blendType==2){ float _x88 = _x59.x / _x59.y; float _x35 = _x5(_x4(vec2(0.3,0.1)),0.0,1.0,0.2,0.8); float _x36 = _x5(_x4(vec2(0.61,0.15)),0.0,1.0,0.1,0.3); float _x38 = _x5(_x4(vec2(0.25,0.90)),0.0,1.0,0.2,0.8); float _x89 = _x5(_x4(vec2(0.31,0.75)),0.0,1.0,0.7,0.9); float _x37 = _x5(_x4(vec2(0.27,0.78)),0.0,1.0,50.0,100.0); vec2 _x90 = vec2(_x35,_x36); vec2 _x91 = vec2(_x38,_x89); vec2 _x92 = _x72 - _x90; vec2 _x93 = _x72 - _x91; _x92.x*=_x88; _x93.x*=_x88; float _x94 = length(_x92); float _x95 = length(_x93); float _x96 = _x5(sin(_x94 * _x37),-1.0,1.0,0.9,1.0); float _x97 = _x5(sin(_x95 * _x37),-1.0,1.0,0.95,1.0); float _x98 = cos(_x94 * _x37 * _x96)* 0.05; float _x99 = cos(_x95 * _x37 * _x97)* 0.03; float _x100 = _x8(_x72 * _x37); float _x101 = 0.5 + _x100 * 0.1; float _x102 = 0.4 + _x100 * 0.1; float _x103 = length(_x72 - _x90); float _x104 = length(_x72 - _x91); vec2 _x105 = _x72; float _x106 = 0.0; if (_x103 < _x101){ _x105+=_x92 * _x98; _x106 = max(_x106,smoothstep(_x101,_x101 * 0.3,_x103)); } if (_x104 < _x102){ _x105+=_x93 * _x99; _x106 = max(_x106,smoothstep(_x102,_x102 * 0.3,_x104)); } _x73 = mix(_x73,_x105,_x106 * 0.7); } else if (blendType==3){ vec2 _x107 = vec2(0.0); for (int _x24 = 0;_x24 < 5;_x24++){ if (_x24>=vline) break; float _x108 = _x5(_x4(vec2(0.3 + float(_x24),0.1)),0.0,1.0,30.0,70.0); float _x35 = _x5(_x4(vec2(0.21 + float(_x24),0.72)),0.0,1.0,3.0,10.0); float _x36 = _x5(_x4(vec2(0.87 + float(_x24),0.38)),0.0,1.0,60.0,120.0); float _x37 = _x5(_x4(vec2(0.31 + float(_x24),0.28)),0.0,1.0,30.0,50.0); float _x38 = _x5(_x4(vec2(0.27 + float(_x24),0.69)),0.0,1.0,30.0,70.0); float _x89 = _x5(_x4(vec2(0.41 + float(_x24),0.51)),0.0,1.0,0.01,0.4); float _x109 = sin(_x73.x * _x38 + _x73.y * _x36)* cos(_x73.y * _x37); float _x110 = cos(_x73.y * _x89 + _x73.x * _x108)* tan(_x73.x * _x35); _x107+=vec2(_x110,_x109); } _x73+=_x107 * 0.001; } else if (blendType==4){ vec2 _x107 = vec2(0.0); for (int _x24 = 0;_x24 < 5;_x24++){ if (_x24>=hline) break; float _x108 = _x5(_x4(vec2(0.3 + float(_x24),0.1)),0.0,1.0,30.0,70.0); float _x35 = _x5(_x4(vec2(0.21 + float(_x24),0.72)),0.0,1.0,3.0,10.0); float _x36 = _x5(_x4(vec2(0.87 + float(_x24),0.38)),0.0,1.0,60.0,120.0); float _x37 = _x5(_x4(vec2(0.31 + float(_x24),0.28)),0.0,1.0,30.0,50.0); float _x38 = _x5(_x4(vec2(0.27 + float(_x24),0.69)),0.0,1.0,30.0,70.0); float _x89 = _x5(_x4(vec2(0.41 + float(_x24),0.51)),0.0,1.0,0.01,0.4); float _x110 = sin(_x73.y * _x38 + _x73.x * _x36)* cos(_x73.x * _x37); float _x109 = cos(_x73.x * _x89 + _x73.y * _x108)* tan(_x73.y * _x35); _x107+=vec2(_x110,_x109); } _x73+=_x107 * 0.001; } else if (blendType==5){ float _x111 = blendA > 0.0 ? blendA : 0.01; float _x112 = blendB > 0.0 ? blendB : 25.0; float _x113 = _x5(_x4(vec2(0.44,0.67)),0.0,1.0,15.0,40.0); vec2 _x114 = _x72 * _x113; vec2 _x115 = _x12(_x114); float _x116 = _x115.y - _x115.x; vec2 _x117 = _x12(_x114 * 2.5); float _x118 = _x117.y - _x117.x; float _x119 = max( smoothstep(0.05,0.4,_x116), smoothstep(0.1,0.5,_x118)* 0.6 ); vec2 _x120 = _x9(_x62 * _x111 * _x74); vec2 _x121 = _x72 + _x120 * _x61 * _x112 * 3.0; _x73 = mix(_x73,_x121,_x119 * 0.8); } else if (blendType==6){ float _x122 = _x5(_x4(vec2(0.32,0.13)),0.0,1.0,0.04,0.12); float _x123 = _x5(_x4(vec2(0.21,0.55)),0.0,1.0,0.04,0.12); vec2 _x124 = floor(_x72 / vec2(_x122,_x123)); float _x125 =(_x4(_x124 + vec2(0.0,radSeed))- 0.5)* 0.03; float _x126 =(_x4(_x124 + vec2(radSeed,0.0))- 0.5)* 0.03; vec2 _x127 = _x72 + vec2(_x125,_x126); _x73 = mix(_x73,_x127,0.8); } else if (blendType==7){ float _x35 = _x5(_x4(vec2(0.32,0.12)),0.0,1.0,0.0,0.45); float _x36 = _x5(_x4(vec2(0.21,0.72)),0.0,1.0,0.0,0.45); float _x37 = _x5(_x4(vec2(0.87,0.38)),0.0,1.0,0.55,1.0); float _x38 = _x5(_x4(vec2(0.31,0.28)),0.0,1.0,0.55,1.0); vec2 _x90 = vec2(_x35,_x36); vec2 _x91 = vec2(_x37,_x38); vec2 _x92 = _x72 - _x90; vec2 _x93 = _x72 - _x91; float _x128 = atan(_x92.y,_x92.x); float _x129 = atan(_x93.y,_x93.x); float _x130 = length(_x92)* 0.995; float _x131 = length(_x93)* 0.998; float _x132 = blendA > 0.0 ? blendA : 1.0; float _x133 = blendB > 0.0 ? blendB : 1.0; float _x134 = _x130 * _x132 * 0.15; float _x135 = _x131 * _x132 * 0.08; float _x136 = _x128 + _x134 * _x133; float _x137 = _x129 + _x135 * _x133 * 0.8; vec2 _x138 = _x90 + vec2(cos(_x136),sin(_x136))* _x130; vec2 _x139 = _x91 + vec2(cos(_x137),sin(_x137))* _x131; float _x140 = 0.15; float _x141 = 0.25; float _x142 = exp(-_x130 * _x130 /(2.0 * _x140 * _x140)); float _x143 = exp(-_x131 * _x131 /(2.0 * _x141 * _x141)); float _x144 = max(_x142,_x143); vec2 _x145 = mix(_x138,_x139,_x143 /(_x142 + _x143 + 0.001)); _x73 = mix(_x73,_x145,_x144); } else if (blendType==8){ vec2 _x146 = _x73; if (_x59.y > _x59.x){ _x146.y*=_x59.y / _x59.x; _x146.y-=(_x59.y * 0.5 - _x59.x * 0.5)/ _x59.x; }else { _x146.x*=_x59.x / _x59.y; _x146.x-=(_x59.x * 0.5 - _x59.y * 0.5)/ _x59.y; } float _x89 = _x5(_x4(vec2(0.3,0.1)),0.0,1.0,-2.0,2.0); float _x147 = _x5(_x4(vec2(0.61,0.15)),0.0,1.0,-2.0,2.0); _x146+=vec2(_x89,_x147); float _x148 = cellT > 0.0 ? cellT : 1.0; float _x35 = _x5(_x4(vec2(0.16,0.73)),0.0,1.0,0.3,0.8); _x146*=_x35 / _x148; float _x36 = _x5(_x4(vec2(0.16,0.73)),0.0,1.0,30.0,70.0); vec2 _x115 = _x12(_x146 * _x36 *(0.1 + 1.0 - dot(_x146,_x146)* 2.0)); float _x37 = _x5(_x4(vec2(0.16,0.73)),0.0,1.0,0.1,0.4); float _x149 = _x37 +(_x115.y - _x115.x); float _x150 = smoothstep(0.05,0.3,_x115.x); float _x151 = step(0.4,_x149)* _x150; float _x38 = _x5(_x4(vec2(0.16,0.73)),0.0,1.0,300.1,1000.1); float _x152 = _x151 * _x38; vec2 _x153 = _x9(_x62 * 0.01 * _x74); vec2 _x154 = smoothstep(-0.2,0.2,_x153); _x73+=_x154 * _x61 * _x152; } _x73 = clamp(_x73,vec2(0.0),vec2(1.0)); float _x155 = _x5(_x4(vec2(0.22,0.72)),0.0,1.0,0.0016,0.0024); if (_x78 < 0.3){ float _x156 = _x11(_x62 * _x155)* 0.85; float _x157 = smoothstep(0.6,0.8,_x156); float _x158 = _x5(_x4(vec2(0.37,0.69)),0.0,1.0,-0.2,0.2); float _x159 = _x5(_x4(vec2(0.46,0.52)),0.0,1.0,-0.2,0.2); _x73 = mix(_x73,_x73 + vec2(_x158,_x159),_x157); }else if (_x78>=0.3&&_x78 < 0.8){ float _x156 = _x10(_x62 * _x155 + seed); if (_x156 > 0.7){ _x73*=0.7; } } if (isTypeMapMode==1){ _x73 = clamp(_x73,vec2(0.0),vec2(1.0)); vec2 _x160 =(floor(_x72 * rect.zw)+ 0.5)/ rect.zw; vec2 _x161 =(floor(_x73 * rect.zw)+ 0.5)/ rect.zw; vec4 _x162 = texture2D(tex0,_x160); vec4 _x163 = texture2D(tex0,_x161); if (lastStrokeOnly==1){ vec4 _x164 = texture2D(lastStrokeTex,_x73); float _x165 = dot(_x164.rgb,vec3(0.299,0.587,0.114)); float _x166 = 1.0 - smoothstep(0.85,0.98,_x165); float _x167 = _x166 * _x63; gl_FragColor =(_x167 > 0.01)? _x163 : _x162; return; } bool _x168 = _x162.r > 0.01; bool _x169 = _x163.r > 0.01; if (_x168&&_x169){ gl_FragColor =(_x163.r < _x162.r)? _x163 : _x162; }else { gl_FragColor =(_x163.r > _x162.r)? _x163 : _x162; } return; } vec4 _x170 = texture2D(tex0,_x72); vec4 _x171 = texture2D(tex0,_x73); vec4 _x172 = min(_x170,_x171); { float _x173 = max(max(_x170.r,_x170.g),_x170.b)- min(min(_x170.r,_x170.g),_x170.b); float _x174 = max(max(_x171.r,_x171.g),_x171.b)- min(min(_x171.r,_x171.g),_x171.b); bool _x175 = _x173 < 0.05; bool _x176 = _x174 < 0.05; if (_x175!=_x176){ vec3 _x177 = _x175 ? _x171.rgb : _x170.rgb; vec3 _x178 = _x175 ? _x170.rgb : _x171.rgb; float _x179 = dot(_x177,vec3(0.299,0.587,0.114)); float _x180 = dot(_x178,vec3(0.299,0.587,0.114)); if (_x180 < _x179&&_x179 > 0.001){ _x172.rgb = _x177 *(_x180 / _x179); }else { _x172.rgb = _x177; } _x172.a = min(_x170.a,_x171.a); }else { float _x181 = max(max(_x172.r,_x172.g),_x172.b); float _x182 = min(min(_x172.r,_x172.g),_x172.b); float _x183 = _x181 - _x182; if (_x183 > 0.0&&_x183 < 0.05){ float _x184 = dot(_x172.rgb,vec3(0.299,0.587,0.114)); _x172.rgb = vec3(_x184); } } } float _x185 = whiteDot > 0.0 ? whiteDot : 0.01; float _x186 = _x10(_x62 * _x185); if (_x186 > 0.9){ _x172.rgb+=(_x186 - 0.5)* 0.05; } float _x187 = _x5(_x4(vec2(0.21,0.95)),0.0,1.0,0.008,0.02); float _x188 = _x8(vec2(_x62 * _x187 / 100.0 + radSeed)); if (_x188 > 0.9&&doBigShape > 0.5){ vec3 _x189 = vec3(0.05); float _x190 = fract(_x186 * 10.0); float _x191 = seed * 10.0; if (_x190 < 0.3){ float _x192 = abs(sin(atan(_x62.y - 0.5,_x62.x - 0.5)* 5.0 + _x191))* 0.5 + 0.5; _x189*=_x192; }else if (_x190 < 0.6){ float _x193 = smoothstep(0.1,0.2,length(_x62 - 0.5)); _x189*=_x193; }else { float _x194 = smoothstep(0.1,0.2,abs(fract((_x62.y + _x62.x)* 10.0 + _x191)- 0.5)); _x189*=_x194; } _x172.rgb+=_x189 * 0.05; } float _x195 = colorDeep > 0.0 ? colorDeep : 0.0; if (_x195 > 0.001){ float _x196 = _x5(_x4(vec2(0.32,0.12)),0.0,1.0,0.3,0.5); float _x197 =(_x10(_x62 * _x196)- 0.5)* _x195; vec3 _x198 = _x6(_x172.rgb); float _x199 = _x5(_x4(vec2(0.22,0.72)),0.0,1.0,0.001,0.003); float _x200 = 0.0; if (_x78 > 0.6){ _x200 = _x11(_x62 * _x199); }else { _x200 = _x10(_x62 * _x199 + seed); } float _x201 = smoothstep(0.3,0.7,_x200); float _x202 = dot(_x172.rgb,vec3(0.299,0.587,0.114)); if (_x202 < 0.7){ float _x203 =(doMask > 0.05)? _x197 * _x201 : _x197; if (_x198.y < 0.1){ _x172.rgb+=_x203; }else { _x198.z+=_x203; _x172.rgb = _x7(_x198); } } } if (lastStrokeOnly==1){ vec2 _x204 = _x73; vec4 _x205 = texture2D(lastStrokeTex,_x204); float _x206 = dot(_x205.rgb,vec3(0.299,0.587,0.114)); float _x207 = 1.0 - smoothstep(0.85,0.98,_x206); vec4 _x208 = texture2D(tex0,_x73); vec4 _x209 = mix(_x170,_x208,_x207 * _x63); gl_FragColor = _x209; }else { gl_FragColor = mix(_x170,_x172,_x63); } }`,
    // procedural force map (fbm / vortex / cluster noise) that drives diffusion
    "./shaders/mapFrag.frag": `precision mediump float;
#define PROCESSING_COLOR_SHADER
uniform sampler2D tex0; uniform float _x5,randomSeed2,randomSeed3,randomSeed4; uniform float _x6,scale2,scale3; uniform float _x7,amplitude2,amplitude3; uniform float _x8,phase2,phase3; uniform float _x9,vortexScale2; uniform float _x10,clusterScale2; uniform vec2 canvasCenter; uniform float time; vec3 _x1(vec3 _x18){return _x18 - floor(_x18 *(1.0 / 289.0))* 289.0;} vec2 _x1(vec2 _x18){return _x18 - floor(_x18 *(1.0 / 289.0))* 289.0;} vec3 _x2(vec3 _x18){return _x1(((_x18*34.0)+1.0)*_x18);} float _x3(vec2 v){ const vec4 _x0 = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439); vec2 _x11 = floor(v + dot(v,_x0.yy)); vec2 _x12 = v - _x11 + dot(_x11,_x0.xx); vec2 _x13 =(_x12.x > _x12.y)? vec2(1.0,0.0):vec2(0.0,1.0); vec2 _x14 = _x12.xy + _x0.xx - _x13; vec2 _x15 = _x12.xy + _x0.zz; _x11 = _x1(_x11); vec3 _x16 = _x2(_x2(_x11.y + vec3(0.0,_x13.y,1.0))+ _x11.x + vec3(0.0,_x13.x,1.0)); vec3 _x17 = max(0.5 - vec3(dot(_x12,_x12),dot(_x14,_x14),dot(_x15,_x15)),0.0); _x17 = _x17*_x17;_x17 = _x17*_x17; vec3 _x18 = 2.0 * fract(_x16 * _x0.www)- 1.0; vec3 _x19 = abs(_x18)- 0.5; vec3 _x20 = floor(_x18 + 0.5); vec3 _x21 = _x18 - _x20; _x17*=1.79284291400159 - 0.85373472095314 *(_x21*_x21+_x19*_x19); vec3 _x22; _x22.x = _x21.x * _x12.x + _x19.x * _x12.y; _x22.yz = _x21.yz * vec2(_x14.x,_x15.x)+ _x19.yz * vec2(_x14.y,_x15.y); return 130.0 * dot(_x17,_x22); } vec2 _x4(vec2 v){ return vec2(_x3(v)- _x3(v + vec2(12.3,23.4)),_x3(v + vec2(34.5,45.6))- _x3(v + vec2(56.7,67.8))); } void main(void){ vec2 _x23 = gl_FragCoord.xy; vec2 _x24 = canvasCenter; vec2 _x25 = vec2(time * 0.1,time * 0.15); vec2 _x26 = _x4(_x23 * _x6 + vec2(_x8)+ _x25)* _x7; vec2 _x27 = _x4(_x23 * scale2 + vec2(phase2)+ _x25 * 0.7)* amplitude2; vec2 _x28 = _x4(_x23 * scale3 + vec2(phase3)+ _x25 * 0.5)* amplitude3; vec2 _x29 = vec2(sin(_x23.x*_x9+_x23.y*_x9*0.5 + time*0.5),cos(_x23.x*_x9*0.5+_x23.y*_x9 + time*0.3))*0.2; vec2 _x30 = vec2(cos(_x23.x*vortexScale2-_x23.y*vortexScale2*0.7 + time*0.4),sin(_x23.x*vortexScale2*0.7-_x23.y*vortexScale2 + time*0.6))*0.15; float _x31 = _x3(_x23*_x10+vec2(_x5,randomSeed2)); float _x32 = _x3(_x23*clusterScale2+vec2(randomSeed3,randomSeed4)); float _x33 = length(_x23 - _x24)* 0.001; vec2 _x34 = normalize(_x23 - _x24)* sin(_x33 * 2.0)* 0.3; vec2 _x35 = vec2(sin(time*3.14159),cos(time*2.71828))*0.1; vec2 _x36 = _x26 + _x27 + _x28 + _x29 + _x30 + _x34 + _x35; float _x37 =(_x31 + _x32)* 0.5; _x36*=(1.0 + _x37 * 0.5); _x36+=_x4(_x23 * 0.08 + vec2(123.4,567.8))* 0.08; gl_FragColor = vec4(_x36 * 0.5 + vec2(0.5),0.0,1.0); }`,
    // metallic "bug bite" highlight pass
    "./shaders/metallic.frag": `#ifdef GL_ES
precision highp float;
#endif
uniform vec4 rect; uniform sampler2D tex0; uniform sampler2D bugsMask; uniform sampler2D bugsData; uniform float time; uniform vec2 resolution; uniform float metallicStrength; uniform float flowSpeed; uniform vec2 lightPos; uniform float specularPower; uniform float fresnelStrength; uniform vec3 metalTint;
#define PI 3.14159265359
#define TAU 6.28318530718
const float _x0 = 2.418; const float _x1 = 2.408; const float _x2 = 2.424; const float _x3 = 2.432; const vec3 _x4 = vec3(0.98,0.95,0.9); const int _x5 = 3; vec2 _x7(vec2 _x17,float _x72){ vec2 _x18; _x18.x = sin(_x17.y * 6.0 + _x72)* 0.05; _x18.y = cos(_x17.x * 6.0 + _x72 * 0.8)* 0.05; return _x17 + _x18; } vec2 _x8(vec2 _x17,vec2 _x19,vec3 _x23){ vec2 _x20 = _x17 - _x19; vec2 _x21 = _x20 / max(_x23.z,0.1); return _x21 * 0.5 + 0.5; } vec2 _x9(vec2 _x22,vec3 _x23,float ior){ vec2 _x24 = normalize(_x23.xy); float _x25 = -dot(normalize(_x22),_x24); float _x26 = 1.0 - _x25 * _x25; float _x27 = _x26 /(ior * ior); if (_x27 > 1.0){ return reflect(_x22,_x24); } float _x28 = sqrt(1.0 - _x27); vec2 _x29 =(_x22 / ior)+ _x24 *(_x25 / ior - _x28); return normalize(_x29); } float _x10(vec2 _x22,vec3 _x23,float ior){ vec2 _x24 = normalize(_x23.xy); float _x25 = clamp(dot(-normalize(_x22),_x24),-1.0,1.0); float _x30 = pow((1.0 - ior)/(1.0 + ior),2.0); float _x31 = _x30 +(1.0 - _x30)* pow(1.0 - _x25,5.0); return clamp(_x31,0.0,0.95); } float _x11(vec2 _x65){ return fract(sin(dot(_x65,vec2(127.1,311.7)))* 43758.5453123); } float _x12(vec2 _x65){ vec2 _x32 = floor(_x65); vec2 _x33 = fract(_x65); _x33 = _x33 * _x33 *(3.0 - 2.0 * _x33); float _x34 = _x11(_x32); float _x35 = _x11(_x32 + vec2(1.0,0.0)); float _x36 = _x11(_x32 + vec2(0.0,1.0)); float _x37 = _x11(_x32 + vec2(1.0,1.0)); return mix(mix(_x34,_x35,_x33.x),mix(_x36,_x37,_x33.x),_x33.y); } float _x13(vec2 _x17,vec2 _x19,float _x72){ vec2 _x38 =(_x17 - _x19)* 20.0; float _x39 = _x12(_x38 + _x72 * 0.1); float _x40 = _x12(_x38 * 2.0 - _x72 * 0.15); float _x41 = atan(_x38.y,_x38.x); float _x42 = length(_x38); float _x43 = sin(_x41 * 8.0)* 0.5 + 0.5; _x43 = pow(_x43,2.0); float _x44 = _x39 * 0.3 + _x40 * 0.2 + _x43 * 0.5; return _x44; } vec3 _x14(vec2 _x17,vec2 _x19,float _x72){ vec2 _x38 =(_x17 - _x19)* 0.5; float _x45 = _x72 * flowSpeed * 5.0; float _x39 = _x12(_x38 * 0.3 + vec2(_x45 * 0.5,_x45 * 0.3)); float _x40 = _x12(_x38 * 0.8 + vec2(_x45 * 0.6,_x45 * 0.4)); float _x46 = _x12(_x38 * 2.0 + vec2(_x45 * 0.7,_x45 * 0.5)); float _x47 = _x11(_x38 * 5.0 + _x45 * 0.3); float _x48 = _x11(_x38 * 10.0 + _x45 * 0.2); float _x41 = atan(_x38.y,_x38.x); float _x42 = length(_x38); float _x49 = sin(_x41 * 4.0 + _x42 * 0.3 + _x45 * 0.6)* 0.5 + 0.5; _x49 = pow(_x49,2.5); float _x50 = _x12(_x38 * 1.2 + vec2(sin(_x45 * 0.8),cos(_x45 * 0.8))* 2.0); _x50 = pow(_x50,1.8); vec2 _x51 = vec2(_x11(_x38 * 1.5 + _x45 * 0.2),_x11(_x38 * 1.5 + _x45 * 0.2 + 1.0))* 2.0 - 1.0; float _x52 = _x12(_x38 * 0.8 + _x51 * 2.0); float _x53 = _x11(_x38 * 8.0 + _x45 * 0.1); _x53 = pow(_x53,0.5); float _x54 = _x39 * 0.2 + _x40 * 0.18 + _x46 * 0.15 + _x47 * 0.12 + _x48 * 0.1 + _x49 * 0.1 + _x50 * 0.08 + _x52 * 0.05 + _x53 * 0.02; _x54 = pow(_x54,0.15); _x54 = _x54 * 5.0 - 1.0; _x54 = clamp(_x54,0.0,1.0); _x54 = smoothstep(0.05,0.6,_x54); _x54 = pow(_x54,0.9); vec3 _x55 = vec3(0.12,0.08,0.06); vec3 _x56 = vec3(0.35,0.22,0.15); vec3 _x57 = vec3(0.55,0.40,0.30); vec3 _x58 = mix(_x55,_x57,_x54); _x58 = mix(_x58,_x56,0.6); float _x59 = 1.0 - _x54; _x58 = mix(_x58,vec3(0.03,0.02,0.01),_x59 * 0.9); float _x60 = _x11(_x38 * 12.0 + _x45 * 0.05); _x60 = pow(_x60,2.0); _x58 = mix(_x58,_x58 * 1.1,_x60 * _x54 * 0.3); return _x58; } float _x15(vec2 _x65){ float _x61 = _x11(_x65 * 100.0); float _x62 = _x11(_x65 * 50.0); float _x63 = _x12(_x65 * 30.0); float _x64 = _x61 * 0.5 + _x62 * 0.3 + _x63 * 0.2; _x64 = pow(_x64,0.7); _x64 = _x64 * 1.3 - 0.15; _x64 = clamp(_x64,0.0,1.0); return _x64; } float _x16(vec2 _x65,float _x72){ float _x66 = _x12(_x65 * 80.0); float _x67 = _x11(_x65 * 120.0 + _x72 * 0.0001); float _x68 = _x66 * 0.6 + _x67 * 0.4; _x68 = pow(_x68,0.65); _x68 = _x68 * 1.4 - 0.2; _x68 = clamp(_x68,0.0,1.0); return _x68; } void main(){ vec2 _x17 = gl_FragCoord.xy / resolution.xy; vec4 _x69 = texture2D(tex0,_x17); vec4 _x70 = texture2D(bugsMask,_x17); float _x71 = _x70.a; if (_x71 < 0.01){ gl_FragColor = _x69; return; } float _x72 = time * 0.0005; vec2 _x73 = 1.0 / resolution.xy; float _x74 = _x70.a; float _x75 = texture2D(bugsMask,_x17 + vec2(_x73.x,0.0)).a; float _x76 = texture2D(bugsMask,_x17 + vec2(0.0,_x73.y)).a; float _x77 =(_x75 - _x74)* resolution.x * 0.5; float _x78 =(_x76 - _x74)* resolution.y * 0.5; vec3 _x23 = normalize(vec3(_x77,_x78,sqrt(clamp(1.0 - _x77 * _x77 - _x78 * _x78,0.0,1.0)))); float _x79 = _x16(_x17 * resolution.xy,_x72); _x23.xy+=(_x79 - 0.5)* 0.06; _x23 = normalize(_x23); vec4 _x80 = texture2D(bugsData,_x17); vec2 _x81 = _x80.rg; if (_x81==vec2(0.0)){ _x81 = _x17; } float _x82 = _x11(_x81 * 100.0); float _x83 = _x11(_x81 * 100.0 + vec2(123.4,567.8)); float _x84 = abs(metalTint.r - metalTint.g); float _x85 = abs(metalTint.g - metalTint.b); float _x86 = abs(metalTint.r - metalTint.b); float _x87 = max(max(_x84,_x85),_x86); bool _x88 = _x87 < 0.05; bool _x89 = metalTint.b > metalTint.r&&metalTint.b > metalTint.g&& metalTint.r > 0.9&&metalTint.g > 0.9&&metalTint.b > 0.95; bool _x90 = metalTint.r < 0.2&&metalTint.g < 0.15&&metalTint.b < 0.1&& metalTint.r > metalTint.g&&metalTint.g > metalTint.b; float _x91 = 0.7 + _x82 * 0.6; if (_x89){ _x91 =(0.5 + _x82 * 0.3); } float _x92 = _x72 * _x91 * flowSpeed; vec2 _x93 = _x8(_x17,_x81,_x23); vec2 _x94 = _x7(_x93,_x92); vec3 _x95 = vec3(0.0,0.0,-1.0); float _x96 = 1.0 - pow(clamp(dot(_x23,-_x95),0.0,1.0),1.0); _x96*=fresnelStrength; float _x97 = 0.0; if (_x71 > 0.05){ float _x98 = texture2D(bugsMask,_x17 - vec2(_x73.x,0.0)).a; float _x99 = texture2D(bugsMask,_x17 - vec2(0.0,_x73.y)).a; float _x100 = abs(_x75 - _x74)+ abs(_x76 - _x74); float _x101 = smoothstep(0.0,0.3,_x100)* 0.4; float _x102 = texture2D(bugsMask,_x17 - vec2(_x73.x * 2.0,0.0)).a; float _x103 = texture2D(bugsMask,_x17 + vec2(_x73.x * 2.0,0.0)).a; float _x104 = texture2D(bugsMask,_x17 + vec2(0.0,_x73.y * 2.0)).a; float _x105 = texture2D(bugsMask,_x17 - vec2(0.0,_x73.y * 2.0)).a; float _x106 = abs(_x103 - _x102)+ abs(_x104 - _x105); float _x107 = smoothstep(0.0,0.4,_x106 * 0.5)* 0.25; float _x108 = texture2D(bugsMask,_x17 - vec2(_x73.x * 3.0,0.0)).a; float _x109 = texture2D(bugsMask,_x17 + vec2(_x73.x * 3.0,0.0)).a; float _x110 = texture2D(bugsMask,_x17 + vec2(0.0,_x73.y * 3.0)).a; float _x111 = texture2D(bugsMask,_x17 - vec2(0.0,_x73.y * 3.0)).a; float _x112 = abs(_x109 - _x108)+ abs(_x110 - _x111); float _x113 = smoothstep(0.0,0.5,_x112 * 0.3)* 0.15; _x97 = max(_x101,max(_x107,_x113)); } _x96 = mix(_x96,_x97,0.3); vec2 _x114 = vec2((_x82 - 0.5)* 0.3,(_x83 - 0.5)* 0.3); vec2 _x115 = lightPos + _x114; vec3 _x116 = vec3(_x115,0.5); vec3 _x117 = normalize(_x116 - vec3(_x17,0.0)); float _x118 = clamp(dot(_x23,_x117),0.0,1.0); float _x119 = 0.75 + 0.25 * _x118; vec3 _x120 = normalize((_x117 - _x95)* 0.5); float _x121 = clamp(dot(_x23,_x120),0.0,1.0); float _x122 = 0.2 + _x83 * 0.3; if (_x89){ _x122 = 0.05 + _x83 * 0.05; } float _x123 = pow(_x121,1.0 / pow(_x122 + 0.1,4.0))*(1.0 - _x122); if (_x89){ _x123 = pow(_x121,1.0 / pow(_x122 + 0.01,4.0))* 1.5; } float _x124 = 1.2 + _x82 * 0.6; if (_x90){ _x124 = 1.2 + _x82 * 0.6; } vec3 _x125; if (_x89){ vec2 _x126 = normalize(_x17 - _x81); float _x127 = _x10(_x126,_x23,_x0); vec2 _x128 = _x9(_x126,_x23,_x1); vec2 _x129 = _x9(_x126,_x23,_x2); vec2 _x130 = _x9(_x126,_x23,_x3); vec2 _x131 = reflect(_x126,normalize(_x23.xy)); vec2 _x132 = _x81 + _x128 * 0.3; vec2 _x133 = _x81 + _x129 * 0.3; vec2 _x134 = _x81 + _x130 * 0.3; vec2 _x135 = _x81 + _x131 * 0.3; vec2 _x136 = _x7(_x132,_x92); vec2 _x137 = _x7(_x133,_x92); vec2 _x138 = _x7(_x134,_x92); vec2 _x139 = _x7(_x135,_x92); float _x140 = _x12(_x136 * 15.0); float _x141 = _x12(_x137 * 15.0); float _x142 = _x12(_x138 * 15.0); float _x143 = _x12(_x139 * 15.0); _x140 = pow(_x140,1.3); _x141 = pow(_x141,1.3); _x142 = pow(_x142,1.3); _x143 = pow(_x143,1.3); vec3 _x144 = vec3(_x140,_x141,_x142)* _x4; vec3 _x145 = vec3(_x143)* _x4; float _x146 = _x13(_x17,_x81,_x92); _x146 = _x146 * 0.3 + 0.7; _x125 = mix(_x144,_x145,_x127)* _x146; _x125*=2.5; }else if (_x90){ _x124 = 1.2 + _x82 * 0.6; float _x147 = _x12(_x94 * 20.0); float _x148 = _x12(_x94 * 10.0)* 0.5; float _x149 = _x15(_x17 * resolution.xy)* 0.4; float _x150 = _x147 + _x148 + _x149; _x150 = pow(_x150,1.8); _x150 = _x150 * 1.2 - 0.1; _x150 = clamp(_x150,0.0,1.0); vec3 _x151 = vec3(_x150); float _x152 = 1.0 - _x96 * 0.4; _x125 = _x151 * _x152 * 1.5 * _x124; }else { _x124 = 1.2 + _x82 * 0.6; float _x147 = _x12(_x94 * 20.0); float _x148 = _x12(_x94 * 10.0)* 0.5; float _x149 = _x15(_x17 * resolution.xy)* 0.4; float _x150 = _x147 + _x148 + _x149; _x150 = pow(_x150,1.8); _x150 = _x150 * 1.2 - 0.1; _x150 = clamp(_x150,0.0,1.0); vec3 _x151 = vec3(_x150); float _x152 = 1.0 - _x96 * 0.4; _x125 = _x151 * _x152 * 1.5 * _x124; } vec3 _x153; vec3 _x154; if (_x88){ float _x155 = 0.95 + _x82 * 0.1; _x153 = metalTint * _x155; _x154 = _x153; }else if (_x89){ _x153 = _x4; _x154 = _x4; }else if (_x90){ _x153 = vec3(0.35,0.22,0.15); _x154 = _x153; }else { vec3 _x156 = vec3(0.95 + _x82 * 0.1,0.95 + _x83 * 0.1,0.95 + _x11(_x81 * 200.0)* 0.1); _x153 = metalTint * _x156; _x154 = mix(_x70.rgb,_x153,0.95); } vec3 _x157; if (_x89){ _x157 = _x125; vec3 _x158 = vec3(1.0,1.0,1.1)* 2.0; _x158 = clamp(_x158,vec3(0.0),vec3(1.0)); float _x159 = _x123 * 2.0; _x157 = mix(_x157,_x158,_x159); }else if (_x90){ _x157 = _x119 * _x154 * _x125; vec3 _x160 = _x153 * 1.5; _x160 = clamp(_x160,vec3(0.0),vec3(1.0)); _x157 = mix(_x157,_x160,_x123); }else { _x157 = _x119 * _x154 * _x125; vec3 _x160 = _x153 * 1.5; _x160 = clamp(_x160,vec3(0.0),vec3(1.0)); _x157 = mix(_x157,_x160,_x123); } if (!_x89){ if (_x90){ _x157 = pow(_x157,vec3(0.85)); _x157*=1.08; }else { _x157 = pow(_x157,vec3(0.85)); _x157*=1.08; } } if (_x88){ float _x161 = dot(_x157,vec3(0.299,0.587,0.114)); _x157 = vec3(_x161); }else if (_x89){ }else if (_x90){ float _x161 = dot(_x157,vec3(0.299,0.587,0.114)); vec3 _x162 = vec3(_x161); _x157 = mix(_x162,_x157,0.85); }else { float _x161 = dot(_x157,vec3(0.299,0.587,0.114)); vec3 _x162 = vec3(_x161); _x157 = mix(_x162,_x157,0.8); } float _x163 = 1.0 - _x97 * 0.5; _x157*=_x163; if (!_x88&&!_x89&&!_x90){ float _x164 = dot(_x157,vec3(0.299,0.587,0.114)); vec3 _x165 = vec3(_x164); _x157 = mix(_x157,_x165,_x97 * 0.6); } if (_x89){ float _x164 = dot(_x157,vec3(0.299,0.587,0.114)); _x157.r = mix(_x157.r,_x157.r * 1.1,_x97 * 0.3); _x157.b = mix(_x157.b,_x157.b * 1.15,_x97 * 0.3); } if (!_x89){ float _x166 = _x15(_x17 * resolution.xy); float _x167 = _x11(_x17 * resolution.xy * 2.0); _x167 = pow(_x167,0.8); float _x168 = _x166 * 0.7 + _x167 * 0.3; float _x169 = dot(_x157,vec3(0.299,0.587,0.114)); float _x170 =(_x168 - 0.5)* 2.0; float _x171 = mix(0.08,0.20,_x169); float _x172 = _x170 * _x171; _x157+=_x172; } _x157 = clamp(_x157,0.0,1.0); vec3 _x173; if (_x88||_x89||_x90){ _x173 = _x157; }else { _x173 = mix(_x70.rgb,_x157,metallicStrength * _x71); } vec3 _x174; if (_x89||_x90){ vec3 _x175 = vec3(0.0); _x174 = mix(_x175,_x173,_x71 * metallicStrength); }else { _x174 = mix(_x69.rgb,_x173,_x71); } if (_x88){ float _x176 =(_x174.r + _x174.g + _x174.b)/ 3.0; _x174 = vec3(_x176); }else if (_x89){ float _x176 =(_x174.r + _x174.g + _x174.b)/ 3.0; _x174.b = mix(_x176,_x174.b,0.1); _x174.r = mix(_x176,_x174.r,0.05); _x174.g = mix(_x176,_x174.g,0.05); } if (_x71 > 0.01&&!_x90){ float _x169 = dot(_x174,vec3(0.299,0.587,0.114)); const float _x6 = 0.3; if (_x169 < _x6){ float _x177 = _x6 / max(_x169,0.01); _x174*=_x177; _x174 = min(_x174,vec3(1.0)); } } _x174 = clamp(_x174,0.0,1.0); gl_FragColor = vec4(_x174,_x69.a); }`,
    // live preview of the wet stroke over the dry layer
    "./shaders/realtime.frag": `#ifdef GL_ES
precision highp float;
#endif
uniform vec4 rect; uniform sampler2D baseTex; uniform sampler2D addTex; uniform sampler2D encodedTex; uniform float brushColorMode; uniform float brushCategory; uniform vec3 brushColor; uniform float whiteMaxOpacity; uniform float hueShift; uniform float satShift; uniform float briShift; uniform float useSharpen; uniform float useMask; uniform sampler2D maskTex; vec3 _x0(vec3 c){ vec4 _x2 = vec4(0.0,-1.0 / 3.0,2.0 / 3.0,-1.0); vec4 _x3 = mix(vec4(c.bg,_x2.wz),vec4(c.gb,_x2.xy),step(c.b,c.g)); vec4 _x4 = mix(vec4(_x3.xyw,c.r),vec4(c.r,_x3.yzx),step(_x3.x,c.r)); float _x5 = _x4.x - min(_x4.w,_x4.y); float _x6 = 1.0e-10; return vec3(abs(_x4.z +(_x4.w - _x4.y)/(6.0 * _x5 + _x6)),_x5 /(_x4.x + _x6),_x4.x); } vec3 _x1(vec3 c){ vec3 _x7 = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0),6.0)- 3.0)- 1.0,0.0,1.0); _x7 = _x7 * _x7 *(3.0 - 2.0 * _x7); return c.z * mix(vec3(1.0),_x7,c.y); } void main(){ vec2 _x8 =(gl_FragCoord.xy - rect.xy)/ rect.zw; vec3 _x9 = texture2D(baseTex,_x8).rgb; if (useMask > 0.5){ float _x10 = texture2D(maskTex,_x8).r; if (_x10 < 0.5){ gl_FragColor = vec4(_x9,1.0); return; } } vec3 _x11 = texture2D(addTex,_x8).rgb; vec3 _x12 = texture2D(encodedTex,_x8).rgb; float _x13 = dot(_x11,vec3(0.299,0.587,0.114)); float _x14 = _x12.g; vec3 _x15 = _x9; if (brushColorMode < 0.5){ float _x16 = 1.0 - smoothstep(0.0,0.95,_x13); _x15 = mix(_x9,_x11,_x16); }else if (brushCategory > 0.5){ if (_x13 < 0.99){ float _x17 = 1.0 - _x13; _x17 = pow(_x17,0.5); _x17 = smoothstep(0.0,1.0,_x17); vec3 _x18 = mix(vec3(0.0),brushColor,_x17); vec3 _x19 = vec3(1.0)-(vec3(1.0)- _x9)*(vec3(1.0)- _x18); _x15 = mix(_x9,_x19,_x17 * whiteMaxOpacity); _x15 = min(_x15,vec3(0.99)); } }else if (brushColorMode > 28.5&&brushColorMode < 29.5){ float _x16 = 1.0 - smoothstep(0.0,0.95,_x13); if (_x16 > 0.02){ vec3 _x20 = vec3(0.0,0.82,0.25); _x15 = mix(_x9,_x20,_x16); } }else { vec3 _x21 = brushColor; if (brushColorMode > 1.5){ vec3 _x22 = _x0(brushColor); float _x23 =(_x22.z > 0.6)?(0.95 - _x22.z): briShift; _x22.x = mod(_x22.x + hueShift,1.0); _x22.y = clamp(_x22.y + satShift,0.0,1.0); _x22.z = clamp(_x22.z + _x23,0.0,0.95); _x21 = _x1(_x22); } float _x16 = 1.0 - smoothstep(0.0,0.95,_x13); float _x24 = _x0(_x9).y; float _x25 = smoothstep(0.3,0.8,_x24); float _x26 = dot(_x21,vec3(0.299,0.587,0.114)); float _x27 = clamp((1.0 - _x13)/ max(1.0 - _x26,0.01),0.0,1.0); float _x28 = _x25 * _x27; if (_x16 < 0.02){ _x15 = _x9; }else if (_x16 < 0.2){ float _x29 =(_x16 - 0.02)/ 0.18; vec3 _x30 = mix(_x9,_x9 * _x21,_x29); vec3 _x31 = mix(_x9,_x21,_x29); _x15 = mix(_x30,_x31,_x28); }else { vec3 _x32 = mix(vec3(1.0),_x21,_x16); vec3 _x30 = _x9 * _x32; vec3 _x31 = mix(_x9,_x21,_x16); _x15 = mix(_x30,_x31,_x28); } } gl_FragColor = vec4(_x15,1.0); }`,
    // commit: write per-pixel stroke type / effect id into typeMapBuffer
    "./shaders/typeMapEncode.frag": `#ifdef GL_ES
precision highp float;
#endif
uniform vec4 rect; uniform sampler2D baseTex; uniform sampler2D strokeTex; uniform float brushCategory; uniform float whiteMaxOpacity; uniform float useMask; uniform sampler2D maskTex; void main(){ vec2 _x0 =(gl_FragCoord.xy - rect.xy)/ rect.zw; vec4 _x1 = texture2D(baseTex,_x0); if (useMask > 0.5){ float _x2 = texture2D(maskTex,_x0).r; if (_x2 < 0.5){ gl_FragColor = _x1; return; } } vec3 _x3 = texture2D(strokeTex,_x0).rgb; float _x4 = dot(_x3,vec3(0.299,0.587,0.114)); if (_x4 < 0.9){ float _x5; float _x6; if (brushCategory > 0.5){ _x5 = 1.0; _x6 = whiteMaxOpacity; }else { _x5 = 0.5; _x6 = 0.0; } gl_FragColor = vec4(_x5,_x6,0.0,1.0); }else { gl_FragColor = _x1; } }`,
  };

  /** Inconsolata (OFL-1.1) — inkField used it for grid labels / on-canvas console text in WEBGL. */
  const EMBEDDED_FONT_URL = 'data:font/otf;base64,T1RUTwALAIAAAwAwQ0ZGIDSSQH0AAAoQAADVDkZGVE1G0UeeAADkpAAAABxHREVGACcBbQAA3yAAAAAeT1MvMl2WzxsAAAEgAAAAYGNtYXDPv7ZUAAAFMAAABL5oZWFk5u9VagAAALwAAAA2aGhlYQWcAlQAAAD0AAAAJGhtdHhCBEbSAADfQAAABWRtYXhwAWdQAAAAARgAAAAGbmFtZYaWWA4AAAGAAAADrnBvc3T/nwAyAAAJ8AAAACAAAQAAAAECTZsxBL5fDzz1AAsD6AAAAADC6YfTAAAAAMLph9MAAP9QAf0DQgAAAAgAAgAAAAAAAAABAAADQv9QAFoB9AAA/8QB/QABAAAAAAAAAAAAAAAAAAABSwAAUAABZwAAAAMB9AH0AAUACAKKArwAAACMAooCvAAAAeAAMQECAAACCwYJAwADAAAAgAAALwAAAWsAAAAAAAAAAFBmRWQAAAAgJCMDNP9MAAADQgCwQAAAE4XUAAAByAJvACAAIAABAAAADgCuAAEAAAAAAAAAmwE4AAEAAAAAAAEACwHsAAEAAAAAAAIABgIGAAEAAAAAAAMAJwJdAAEAAAAAAAQACwKdAAEAAAAAAAUAEALLAAEAAAAAAAYACwL0AAMAAQQJAAABNgAAAAMAAQQJAAEAFgHUAAMAAQQJAAIADAH4AAMAAQQJAAMATgINAAMAAQQJAAQAFgKFAAMAAQQJAAUAIAKpAAMAAQQJAAYAFgLcAEMAcgBlAGEAdABlAGQAIABiAHkAIABSAGEAcABoACAATABlAHYAaQBlAG4AIAB1AHMAaQBuAGcAIABoAGkAcwAgAG8AdwBuACAAdABvAG8AbABzACAAYQBuAGQAIABGAG8AbgB0AEYAbwByAGcAZQAuACAAQwBvAHAAeQByAGkAZwBoAHQAIAAyADAAMAA2ACAAUgBhAHAAaAAgAEwAZQB2AGkAZQBuAC4AIABSAGUAbABlAGEAcwBlAGQAIAB1AG4AZABlAHIAIAB0AGgAZQAgAFMASQBMACAATwBwAGUAbgAgAEYAbwBuAHQAIABMAGkAYwBlAG4AcwBlACwAIABoAHQAdABwADoALwAvAHMAYwByAGkAcAB0AHMALgBzAGkAbAAuAG8AcgBnAC8ATwBGAEwALgAAQ3JlYXRlZCBieSBSYXBoIExldmllbiB1c2luZyBoaXMgb3duIHRvb2xzIGFuZCBGb250Rm9yZ2UuIENvcHlyaWdodCAyMDA2IFJhcGggTGV2aWVuLiBSZWxlYXNlZCB1bmRlciB0aGUgU0lMIE9wZW4gRm9udCBMaWNlbnNlLCBodHRwOi8vc2NyaXB0cy5zaWwub3JnL09GTC4AAEkAbgBjAG8AbgBzAG8AbABhAHQAYQAASW5jb25zb2xhdGEAAE0AZQBkAGkAdQBtAABNZWRpdW0AAEYAbwBuAHQARgBvAHIAZwBlACAAMgAuADAAIAA6ACAASQBuAGMAbwBuAHMAbwBsAGEAdABhACAAOgAgADEANQAtADgALQAyADAAMAA3AABGb250Rm9yZ2UgMi4wIDogSW5jb25zb2xhdGEgOiAxNS04LTIwMDcAAEkAbgBjAG8AbgBzAG8AbABhAHQAYQAASW5jb25zb2xhdGEAAFYAZQByAHMAaQBvAG4AIAAwADAAMQAuADAAMAA5ACAAAFZlcnNpb24gMDAxLjAwOSAAAEkAbgBjAG8AbgBzAG8AbABhAHQAYQAASW5jb25zb2xhdGEAAAAAAAADAAAAAwAAABwAAQAAAAACtAADAAEAAAAcAAQCmAAAAEwAQAAFAAwAfgD/AQcBEQEbAR8BMQE6AT4BRAFIAUsBTQFVAVsBZQFxAX4BkgI3AscCyQLLAt0gGiAeICIgJiA6IEQgdCCsISIhkSGTIhIkI///AAAAIACgAQIBDAEYAR4BMAE4AT0BQQFHAUoBTQFQAVgBXgFuAXgBkgI3AsYCyQLLAtggGCAcICAgJiA5IEQgdCCsISIhkSGTIhIkI///AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8oAAAAAAAAAAAAA/9D/FAAA/j7+OAAAAADhMgAA4Svg2OEV4OTf+OBD38HfwN7u3TEAAQAAAEoBCAESARwBIgEkASYBKgEsATIBNAAAATQBPgFEAVIBWAAAAAABYAAAAAABXgFoAAABagAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAChAKIAowEYAKUBGQCnAQoAqQCqAKsArACtAK4ArwCwALEAsgCzAQQAtQC2ALcBDQC5ALoAuwEaARsBHAC/AMAAwQDCAMMAxADFAMYAxwDIAMkAygDLAMwAzQDOAM8A0ADRANIA0wDUANUA1gDXANgA2QDaANsA3ADdAN4A3wDgAOEA4gDjAOQA5QDmAOcA6ADpAOoA6wDsAO0A7gDvAPAA8QDyAPMA9AD1APYA9wD4APkA+gD7APwA/QD+AP8BJgE2AR0BNQEoAUEBKQE3ASwBOAEtAVsBKgE5ASsBSAFcAVYBXQEQAUoBJwE7AR8BOgEeAUcBLgE8AS8BPQFaAUwBMAE+ALwAvQElAV4BMQE/ASABQAEhAUIApgCoATQBQwEiAV8BMgFEATMBRQC+ASMBYAEkAUYAtAC4AQUBDwEIAQkBDAEOAQYBCwECAQEBTQFjAWQBYQAGAgoAAAAAAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAIQAiACMAJAAlACYAJwAoACkAKgArACwALQAuAC8AMAAxADIAMwA0ADUANgA3ADgAOQA6ADsAPAA9AD4APwBAAEEAQgBDAEQARQBGAEcASABJAEoASwBMAE0ATgBPAFAAUQBSAFMAVABVAFYAVwBYAFkAWgBbAFwAXQBeAF8AYABhAGIAYwBkAGUAZgBnAGgAaQBqAGsAbABtAG4AbwBwAHEAcgBzAHQAdQB2AHcAeAB5AHoAewB8AH0AfgAAAMQAxQDHAMkA0QDWANwA4QDgAOIA5ADjAOUA5wDpAOgA6gDrAO0A7ADuAO8A8QDzAPIA9AD2APUA+gD5APsA/AFjALAAogCjAKcBYQC2AN8ArgCpAWUBBAEKAAAAxgDYAAAAsQAAAAAApQC1AAAAAAAAAAAAAACqALoAAADmAPgAvwChAKwAAAFiAAAAAACrALsBUQCgAMAAwwDVALwAvQAAAAABTgFPAQIBAQD3AAAA/wC+AVkApAERARIAAAAAAWQAtwFNAVAAAADCAMoAwQDLAMgAzQDOAM8AzADTANQAAADSANoA2wDZARABBQEGAK8BCAEJAQwBDQELAQ4BDwAAAAMAAAAAAAD/nAAyAAAAAAAAAAAAAAAAAAAAAAAAAAABAAQEAAEBAQxJbmNvbnNvbGF0YQABAgABAEn4pgD4pwH4qAL4qQP4FwQdAEAERA2K+0X4kvnXBfqR2B1qHmc3HQCr4kEOHQAABsoPHQAAAAAQHQAACZcRHQAAACcdAACtixIAjwIAAQAJABEAGQAhACkAMQA5AEEASQBSAFsAZABtAHYAfwCIAJEAmgCjAKwAtQC+AMcA0ADZAOIA6wD0AP0BBgEPARkBIwEtATcBQQFLAVUBXwFpAXMBfQGHAZEBmwGlAa8BuQHDAc0B1wHhAesB9QH/AgkCEwIdAicCMQI7AkUCTwJZAmkCbQJ3An4ChQKKApECmAKfAq0CtgK/AsgCzwLWAtwC4gLqAvAC9gMAAwYDDAMSAxgDHgMlAysDMQM3Az0DQwNQA1YDWwNoA3ADdwN9A4MDiQOQA5YDnAOiA6gDtQO7A8EDxwPPA9cD3APpA+0D8wP9BAkEEQQUBBsEJAQwBDcEPQRNBFQEVwRdBGMEbQRzBHkEfwSLBJIFLQU4BUNOYW1lTWUuMU5hbWVNZS4yTmFtZU1lLjNOYW1lTWUuNE5hbWVNZS41TmFtZU1lLjZOYW1lTWUuN05hbWVNZS44TmFtZU1lLjlOYW1lTWUuMTBOYW1lTWUuMTFOYW1lTWUuMTJOYW1lTWUuMTNOYW1lTWUuMTROYW1lTWUuMTVOYW1lTWUuMTZOYW1lTWUuMTdOYW1lTWUuMThOYW1lTWUuMTlOYW1lTWUuMjBOYW1lTWUuMjFOYW1lTWUuMjJOYW1lTWUuMjNOYW1lTWUuMjROYW1lTWUuMjVOYW1lTWUuMjZOYW1lTWUuMjdOYW1lTWUuMjhOYW1lTWUuMjlOYW1lTWUuMzBOYW1lTWUuMzFOYW1lTWUuMTI3TmFtZU1lLjEyOE5hbWVNZS4xMjlOYW1lTWUuMTMwTmFtZU1lLjEzMU5hbWVNZS4xMzJOYW1lTWUuMTMzTmFtZU1lLjEzNE5hbWVNZS4xMzVOYW1lTWUuMTM2TmFtZU1lLjEzN05hbWVNZS4xMzhOYW1lTWUuMTM5TmFtZU1lLjE0ME5hbWVNZS4xNDFOYW1lTWUuMTQyTmFtZU1lLjE0M05hbWVNZS4xNDROYW1lTWUuMTQ1TmFtZU1lLjE0Nk5hbWVNZS4xNDdOYW1lTWUuMTQ4TmFtZU1lLjE0OU5hbWVNZS4xNTBOYW1lTWUuMTUxTmFtZU1lLjE1Mk5hbWVNZS4xNTNOYW1lTWUuMTU0TmFtZU1lLjE1NU5hbWVNZS4xNTZOYW1lTWUuMTU3TmFtZU1lLjE1OE5hbWVNZS4xNTlub25icmVha2luZ3NwYWNlZXVyb3NvZnRoeXBoZW51bmkwMEIydW5pMDBCM21pY3JvdW5pMDBCOXVuaTAyQ0J1bmkwMkM5Y2lyY3VtZmxleC5jYXBjYXJvbi5jYXBncmF2ZS5jYXBhY3V0ZS5jYXBvbWFjcm9uQW9nb25la0xjYXJvblNhY3V0ZVNjZWRpbGxhVGNhcm9uWmFjdXRlWmRvdGFjY2VudFJhY3V0ZUFicmV2ZUxhY3V0ZUNhY3V0ZUNjYXJvbkVvZ29uZWtFY2Fyb25EY2Fyb25EY3JvYXROYWN1dGVOY2Fyb25PaHVuZ2FydW1sYXV0UmNhcm9uVXJpbmdVaHVuZ2FydW1sYXV0VGNlZGlsbGFhb2dvbmVrYWJyZXZlY2Nhcm9uZGNhcm9uZW9nb25la2xjYXJvbmxhY3V0ZW5hY3V0ZW5jYXJvbm9odW5nYXJ1bWxhdXRyY2Fyb25zYWN1dGVjYWN1dGVzY2VkaWxsYXRjZWRpbGxhdXJpbmd1aHVuZ2FydW1sYXV0emRvdGVjYXJvbk5hbWVNZS4zMjlrZ3JlZW5sYW5kaWNkb3RsZXNzamVuZ3VwYXJyb3dkb3duYXJyb3d2aXNpYmxlc3BhY2VyLnNlcmlmZ2JyZXZlaHVuZ2FydW1sYXV0LmNhcHVuaTIwNzRFbmdkY3JvYXRHYnJldmVJZG90YWNjZW50cmFjdXRldGNhcm9uemFjdXRlemVyby5ub3NsYXNoMDAxLjAwOUNyZWF0ZWQgYnkgUmFwaCBMZXZpZW4gdXNpbmcgaGlzIG93biB0b29scyBhbmQgRm9udEZvcmdlLiBDb3B5cmlnaHQgMjAwNiBSYXBoIExldmllbi4gUmVsZWFzZWQgdW5kZXIgdGhlIFNJTCBPcGVuIEZvbnQgTGljZW5zZSwgaHR0cDovL3NjcmlwdHMuc2lsLm9yZy9PRkwuSW5jb25zb2xhdGFJbmNvbnNvbGF0YQAAAAGHAYgBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAAEAAgADAAQABQAGAAcAaAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAfABCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcUBxgHHAGAAYQBiAcgAZADAAGYA3QCqAIsAagCXAckApQCAAKEAnAHKAcsAxwHMAHMAcgDkAc0AjwB4AI4AlADGAHsArgCrAKwAsACtAK8AigCxALUAsgCzALQAuQC2ALcAuACaALoAvgC7ALwAvwC9AKgAjQDEAMEAwgDDAMUAnQCVAMsAyADJAM0AygDMAJAAzgDSAM8A0ADRANYA0wDUANUApwDXANsA2ADZANwA2gCfAJMA4QDeAN8A4ADiAKIA4wCmAAgAQQHOAH0AfgB/Ac8AgQCCAIMAhgCEAIUAhwCIAJEAawBsAdAB0QHSAdMB1ABnAKAAngCbAKMB1QCMAdYB1wHYAdkB2gHbAdwB3QHeAd8B4AHhAeIB4wHkAeUB5gHnAegB6QHqAesB7AHtAe4B7wHwAfEB8gHzAfQB9QH2AfcB+AH5AfoB+wH8Af0AkgH+Af8CAAIBAgIAdQBpAHcAdgB5AgMCBAIFAgYCBwIIAgkAYwIKAgsCDAINAg4CDwIQAHQAZQBwAHEAmQIRAWcCAAEAAgAFAAgACwAOABEAFAAXABoAHQAgACMAJgApACwALwAyADUAOAA7AD4AQQBEAEcASgBNAFAAUwBWAFkAXABfAGABgQGXAt0FyAdfCZEJnwpqCusLowuxC78LzQvbDAYNGg1vDsUQaBDLEeoThBQhFbQXbBeCF50X3hf5GDoZhxuBG5wdSx1ZHXQdgh28HcoecR5/H3IgOiBIIKsgtCDPIdojfCOXI6UjsyPBJAIkdyTmJPQlAiUyJV0ljSXSJe4msSbMKCkoNynTKe4rGCtALHYskSz7Ldgt5i9+L4cvojA3MU0xWzFpMXcxhTI6MxczhjOUM6I1vzXbN/k4pjipOKw4rjiwOLI4tDi2OLg4uji8OL44wDjCOMQ4xjjIOMo4zDjOONA40jjUONY42DjaONw43jjhOOQ45zjqOO048DjxOhI78j4FQC5A2EDzQ8ZD4UT5RstG5kcMRxpIREhSSQtJNEqKTCRMP03NTk1OW052TstPkU/nUXxUXVSFVdJV+lYiVkpWclanV6xYRFp4WpNarlrJWvFbDFsnW0JbaluFW6BbyFvwXBhcQFx1XPBe7l8JXyRfP19nX4Jg5mKjYsti82MbY0NjeGOtZslowmjqaRJpOmlvaYpppWnAaehriGuja8tr82wbbENseG0+btdu8m8NbyhvUG9rcBRwPHBKcFhwZnB0cIJwkHCecKxwunDIcONw/nEZch9y/nMMcxpzKHM2c0RziXOXc6VzzXV8da5143dTeRR6Q3r/e9R7737ufwl/JH8/f2d/j3+qf8V/4IECgR2BRYFggXuBloHLgfOCG4JDg3uFm4XDhd6H+omAilWKcIqLiqaK24r2ixGLLI4nkH6QppDOkOmRipGykbWSqJK2lF6UbJSClJiUrpTMlSOVepWqlpyW0Zbsl0+XXZkCmsea4pr9mxib7ZwInGWebJ6wnx2fvqEiDvgbDvgTDvgKDvgCDvf5DvfwDvfoDvffDvfWDvfODvfFDve8Dve0DverDvejDveaDveRDveJDveADvd3DvdvDvdmDvdeDvdVDvdMDvdEDvc7DvcyDvcqDvchDvcZDg7/ASqZgP8AL+OAFf8AIKCA///lfYD/ABp/gP//31+A///fXUD//+WAAP//5X4A///fYoD//99fgP8AGoKA///lgMD/ACCggP8AIKMA/wAaf8D/ABqCQP8AIJ0AHv//xmmA/wJsEwAV///urgCL///uZUD///VnAP//9xOA///qgkD///tpAP//9PLA///9xkD///KCAIv//+1EAIv//9+6gP8ABmDA///nt4D/AAN9gP//vktACP8ADqvA//7r1wD/ADIOAIv/ABIfgP8BFCkABf8AAn9A/wAmEoD/AAbJwP8AJdqAi/8AJjTAi/8AF4IA///9soD/AAs0wP///n5A/wAF6ID///hIgP8AHkeA///q9QD/AAyYQP//7TtAiwgO/wGMskD/AlypABUgCv//U2aAFiAKDv8ArXaA/wJv8wAV///r8QD//1Z0QP//kOIA///+rAD///yMQP//0IkA/wBs7MD/AAEWwP//693A//9V0gD//523QP///jeA///7r4D//9JCwP8AYSmA/wABkkD//+rIAP//TKaA/wA6r0D/AAKWwP8AFYaA/wCxtoD/AG68gP8AAcpA///qM8D//0kLwP8APGkA/wADc4D/ABYMQP8AtHuABf8AY6KA/wABnID/AAUtgP8ALpoA//+c24D///4zgP8AFI9A/wCoTkD/AFuHQP8AAOpA/wAFLYD/ADBUAP//pS1A///+6kD/ABQOwP8ApDFA///B3UD///1pQP//7KhA//9dqUD//5HXQP///q9A/wAUw4D/AKtrwAX//+VxgP//JMHAFf8AbjqA/wABGkD//+vjgP//VzQA//+RU8D///39wAUO/wDqvID/AoqzwBX//8QYgAf//6PWQP//9B4A///ArsD//8LvgIv//7gDQIv//9uWAP8AEItA///HrQD/AFQRgP//2EMAnf//934A/wASnQD///kMAP8AEkFA///548AI//8kMgAH///LbUD/AAXXQP//1BbA/wAZekD//+PswP8AHeAA///8KkD/AAQUgP8AAIXA/wACskD/AAA7wP8ABF9A/wAAEUD/AAFAgP8AAHqA/wAFwQD///sNwP8AAkGACP//1NmA///EdAAF/wAsggD//8+6QP8APcEA///k4QD/AETtgP//+7JACP//wwdA/wA6rwD/AD7RQAf/AHE7QP8ADsNA/wA1JUD/AE7LwIv/AEe4QIv/AFtQAP//sN7A/wAh6QD//+rwgP8ACQ+A///rR8D/AAjpgP//6SbA/wAHv8D//+lhwP8AB5cACP8AwJbAB/8AK1IA///5eUD/AB7MQP//7V3A/wAUyED//+bKgP8AAxyA///8OgD/AACvwP///uuA/wAAcAD///8YgP8AAXpA///88UD///9EAP///TwA/wAAOkD///0bQP8AAFoA///7iUD/AAKyQP///hdA/wACIcD///9xAAj/ACsmgP8ANl6ABf//20cA/wAr1sD//8tfwP8AGpvA///E6YD/AAX0QAj/ACZgwAeL/wAJmoD/AAbAwP8AAEnAi/8AB2iAi/8AAS6A////wgD/AAEpgP///4fA/wABEYAI///59YD//oa9ABX/ABPzgP//+bZA/wARwAD///nIwP8ADbuA///4iAD/ACn7gP//6SqA/wAHqkD//967AIv//+t3wIv//9LUAP//2w4A///S1MD//7/dQP//85dACP//xVEA/wEevAAV///zMYD/AAUdwP//9CDA/wAFaUD///WogP8ABfUA///T7MD/ABliAP//9bIA/wAd+ECL/wAV0MCL/wAikwD/ABqDQP8AJXoA/wA+40D/AAdZAAgO/wGG8ID/Am8WABX//qbMwP/9kOoA/wA/3ICL/wFcpwD/Am8WAAX//sF4gP8AC0+AFf//xJJA///MDkD//8n+gP//syAA//+1UYD/ADLoQP//x/eA/wA9XsD/ADzoQP8AMplA/wA3WoD/AEpGAP8ATEHA///MfcD/ADe2QP//wxlAH////qRA///LRQAV/wAQMkD/ACKDwP//9VpA//+4yUD//8YsQP//4sDA///wRID//+wbAP//7flA///e9gD/AAz7QP8AQ7nA/wA7SID/AB3GwP8AD25A/wATuEAf/wFYEUD//jHwgBX/AEp1QP//zS1A/wA3WED//8MgQP//w0VA///M4ID//8jYAP//tRGA//+1mgD/ADL6AP//yJ2A/wA898D/ADyogP8AMvKA/wA3HoD/AErzAB7//5ASQP8ATgaAFf8AFJIA/wAfzcD//+/iQP//v8UA///EXAD//+HiwP//7rgA///qloD//+iRAP//4oZA/wAT9AD/ADsSgP8APO3A/wAelgD/ABFQgP8AFXnAHw7/AOTiQP8CdTmAFf//s/cA///CnoD//8duAP//tV7AH4v//8kWgP8AIcdA///IM0D/ACT/gP//00yA//+zKAD//9X7gP//zp1A//+ysQCL//+y70CL//+m+YD/AEIcQP//vGxA/wBZ/sCL/wBDV0CL/wA9lID/ACUggP8AJ7GA/wAxM0AI/wA3O0D//6f5QP8AOq9A/wAsA0D//7oYwP8AWp2ABf8AHA7A/wAlEED/ABleAP8AJu7A/wAWhQD/ACiCQAj//79GQP8ALOBABf///aHA///92gD///4JQP///J9Ai///+x3Ai///++vA/wABYcD///wdAIv///wOgIv///05gP///2lA///9VwD///9AAP///aFA///4h4D//+hkgP//8lMA///i2oD//+g+wP//5GpACP//j89A/wCcNAAF/wBBO0D/ACOpAP8AKq+A/wBBWMCL/wBBaoAI/wBNBgD//8VaAP8AOBzA//+1B8Ae//+7jAD//3uHgBX/ACvagP8AH7bA/wAdUgD/ACN1gP8AJNoA/wAgj0D//+C+QP//0KOAHov//9JwwP//4k5A///QtcD//9GbgP//5ltA///OYMD/AD4WwP//9SAA/wAjjQCL/wAaTEAI/wAkVUD//zdBQBX/AH+5gP//U2aABYv//8keQP//us9A//+9WUD//8zzAP//170A/wAo18D/ADoUAB6L/wAzx0D/AB/7wP8AOKiA/wA1I0D/ACJuwAgO/wE/BsD/AlypABUgCg7/AYfNQP8CmjyAFf//ZT7A//+77MD//52ewP//Y1JAi///SPQAi///Sl1A/wBfmYD//1m+QP8AnmYA//+s24AI/wAgy0D/ADSkgAX//3dTgP8AT2xA//+vbwD/AJL0QIv/AJtdwIv/AI7XAP8ARTIA/wB/YoD/AHTVwP8AROjA/wACq0D/AAGTAP8AAmgA/wABjAD/AAP5wIv/AAODgIv/AAMswP///txA/wAD90CL/wABbsCL/wADO4D/AAAhgP8AA2NA/wAB7kAIDv8ATauA/wJbPMAV/wCEK8D//7m8AP8AU5qA//93G0CL//9rlYCL//9pgkD//6owQP//dHEA//943AD//7h4wAj/ABL8QP//w5cABf8ApdfA/wBPEMD/AGrdgP8Aph4Ai/8As6nAi/8AshMA//+W8YD/AKIAgP//XYcA/wBKxwAIDv8A1SlA/wIGqcAV/wAPiMD//08VwP//Xp6A/wBL8cD//+YcAP//v0ZA/wCsmcD//8tbgP//fa/A//9p1oD/ADZegP//0/zA/wBwMID/AKaPAP8Aa+AA//9aTcD/ADZegP8AKyaA//+CAID/AJcGgP8Aq7zA/wAzx4D//+U/QP8APUYA//9hNUD//7eCAP8AD4jA/wCWKYAF/wABSUD/AAxuwP8AAw9A/wACbQD/AAGyAP8AC+UACA7/AN3KgP8CCvqAFSEKDv8BMaJA/wATtQAVIgoO/wBGxAD/AVvKABUjCg7/ASm8gP8ALipAFSQKDv8AP9zA///zDgAV/wA6rwD//+KogP8BOiHA/wKkl4D//8R0AP8AHjSABQ7/APtZAP8Cc2bAFf//nR1A//+ZlcD//4aQAP//OJfA//82b0D/AGfgQP//i8WA/wBihsD/AFpugP8Aar+A/wBiIwD/ANYawP8A1KuA//+ZmED/AHG6QP//oB/AH/8AYVzA//9xkYAV//8kqQD//uP5AAX///c2QP8AIjsA///64gD/ACd9wIv/ACwNAIv/AJ9qAP8ASS9A/wBX/8D/AD3BgIv/ACIWwIv/ACV8AP//5djA/wAau0D//8j+wAj/ABcgAP//vS0AFf8ACEhA///c28D/AATdwP//1lZAi///z4qAi///UeCA//+03MD//73JAP//yQWAi///2v5Ai///2auA/wAeYID//+TsAP8ANqcACA7/ASm8QP8Cb/MAFf//0WXAi///YFhA//+sSgD/ABBlwP//2SpA/wB7aMD/ACNiAIv//h2VQP//jFuAi4v//8jEgP8BJkiAi4v/ADc7gP//j8+AiwUO/wBNq4D/Ag5uABX/ADLqwP//13CABf8ABfIA/wAIeUD///1xwP8ABj/A/wAFVYD/AAhKwP8ADrSA/wAW3MD/ACVpAP8AIegA/wA2a0CL/wBCY0CL/wA1SQD//8yQQIv//70HgIv//7QVwP//wAuA///JTID//9LRQP//10vA//+41sD//7/kQP//xpzA//+/skD//8uGQP//mIAACP//0/zA/wFt6UD/AEXnQAf///mCgP8AAidA///7GUD///slQP///ewA///+NUD///vxwP///IDA///97AD///9cQP//+3DAiwj//vqCwAb/ADP4wP8AWpqA/wBIr4D/AD3rgP8ALOyA/wAqFoD/AC2uAP8AKsvA/wA/84D/AEAWQIv/AFmcwIv/AGEWAP//sPuA/wBN8UD//5pHwIv//7lKwIv//70DAP//2ceA///bRwD//8E+AAgO/wGa0kD/AdMwQBX/AFUOQP//tzSA/wBI0YD//51zAB7//8fLgIv//8mWwP//6AVA///Y5ID//9VHQAj/ACbVwP//1NmABf8AHRBA/wAfJcD/ACfhAP8AEK9A/wAmh8CL/wA/8UCL/wAsX0D//9OMgIv//8teAIv//9oLAP//6K3A///W3AD//9TeQP//7Q5A///1C4D///swQP//46eA///1IMD//8TiQP///97ACP//x+fAB/8ACn5A/wABegD/AAqUgP8AAL/A/wAKlsCLCP8AVF/A/wA+AMD//9PswP//tbuA//+7kcD//8uMwP//xWiA//+3DUAf///F88CL///c8AD/ACUzQP//+5KA/wAE/QD///eCAP8ACZFA/wAEc4D/AAmxAP//9x4A/wAJF8AI///LW4D//8EAQAX/ACnKQP//0YpA/wA7icD//+eHgP8APmcAi/8Ad16Ai/8ASHrA/wBVH4CL/wBgz4CL/wBKI4D//9WcAP8APxTA//+/WwD/ABefQP8AN+lA/wAU04D/ACVTgP8ANYeAi/8APJQACA7/ATlEwP8Cb/MAFf/+9w9A//5wbkCL///MOED/APsiAIuL//9TZoD/AEh+AIuL/wCrvMD/AFBCQIuL/wA+IsD//6+9wIuL/wGGE4AF//+4XwD//5CsQBX//ulAQP//SQtABw7/AGomQP8CbxYAFf//6mzA//7DR4D/ACzgQP//7eCABf8AHhJA/wAl3sD/ACwcAP8AFOhA/wAqjMCLCP8AQZmA/wA97UD//86agP//nLNA//+gK4D//8TbQP//y4yA//+9HAAf//+8t0CL///Uh0D/ADMCgP///IiA/wAGjgD///v4wP8AB54A/wAFIgD/AAnZQP//93GA/wAGGoAI///B3UD//9FmAAX/AClSAP//wwHA/wBFTgD//90vgP8ASgwAiwj/AGu2AP8AWRpA/wBJK8D/AIcOgP8AhWNA//+r0gD/AEpggP//l6wAH///3ZcAi///3THA///37cD//9+3QP//7+VACP8ACX5A/wCzgQD/AQEsgIuL/wA+/8AFDv8BHxXA/wJ2HAAV//+1uUCL//+vVgD//9I4QP//2adA//+TD0D//+sbgP//xKSA///6PsD//7d0gIv//8Q0AIv//7cKAP8ABxqA//+yGoD/ACgFAP//w47A/wAkSMD//8kywP8AN3HA///kDcD/ADd8AIsI/wBeuAD/AFMhgP8AUCPA/wCAT4D/AIGuwP//rSYA/wBKgID//6fpwB///8mjQIv//83ZAP//42bA///keID//9FmQP8AA87A/wDVJkD/AGaPgP8AG9cA/wAsy8CL/wApbYCL/wAbjYD//+n2gP8AA9GA///8AED/AAYawP//+ZvA////zwD///ajAP8ACS0A///5QEAI/wAwVAD/ADWBgAX//9tlAP8AJBTA///OqUD/ABT/AP//zUvAiwj//+bGQP/+3tqAFf8AMhZA/wA7SgD//9jzQP//lJ3A//+ekUD//8oNAP//0qLA///LJ0Af//+z/ECL///HIAD/AFkFAP8ACEGA/wB0bAD/ABwXAP8AMxzA/wAvtsD/ACCtQP8ALkAAiwgO/wBOiID/Am8WABX//72MgP8BCqrAB///4IkA//+2A4D//+HKQP//tXrA///jD0D//7T9gP//1YzA//+R+ED//9hJQP//kOqA///bEgD//4//AAj/AE6IgAb/AB5ggP8AYh+A/wAhGUD/AGFIAP8AI8TA/wBgSkD/ACShwP8AYpyA/wAnboD/AGGSQP8AKisA/wBgX8AI/wAm1cAHDv8BAjqA/wJ258AV//+gogD//7bZwP//ulXA//+sDkAfi///wrcA/wAmukD//8gbgP8AOD4A///jRgD//7YNAP//3TxA///Ni0D//7v1gIv//7gZAAj//6MrQP8AUe1A//+1vID/AGtPQP8AbW6A/wBSXQD/AExTwP8AXu4AHov/AElcgP//zfnA/wBCgUD//7nAwP8AIGgA/wA8ZoD/AB+4QP8AJwTA/wA6esCL/wA8CEAI/wBSG0D//7k1wP8AQXMA//+kkEAe///rGMD//rgCABX/AFAqwP//5rUA/wA09ID//8jXwIv//8McQAj//8PsgP//zN8A///PJED//71jwP//vDbA///LHID/ADKfwP8APrIAHov/ADriQP8ALf0A/wA1c4D/ADtNwP8AGJ7ACP8AD4lA/wENRQAV/wA3skD/ACuLwP//1pNA///L+AAfi///0AtA///bGwD//9F7QP//z3VA///l5IAIi///klRA/wAqx0D/AFJXgP8AMR1A/wApfAD/ACfNwP8ANmGAHw7/ANkyAP//9YJAFf8ATAyAi/8AT5NA/wAtmUD/ACXAgP8AY40A/wAK74D/ABzWQP8AD76A/wA2DwCL/wBl+0CL/wBN/wD///kCgP8ANc8A///xfsD/ACqUwP//34oA/wBfTED//7hDQP8AJ+iA//++9QCLCP//nxGA//+ulsD//6peAP//h0CA//+ITED/AFB2AP//swaA/wBahMAf/wAzbACL/wAwBYD/ABk7gP8AHQsA/wAqHkD///0KwP//nx8A///wIwD//9X+wP//+W4A///weED//+VZwP//wP/A///MQQD//+llgP//0zZAi///00mAi///4eHA/wAWfYD////LAP8AACkA///3j4D/AAaJgP8AAsXA/wAKxQD///VdwP8ABsAACP//z6xA///KfkAF/wAkvUD//9uUwP8AMaAA///rU4D/ADNvQIsI/wAcwAD/ASmiwBX//8hywP//ye8A/wAtuQD/AFzCwP8AWqyA/wA0M4D/ADK6AP8AOIfAH/8ARuyAi/8AO0LA//+yEwD///TxQP//gjiA///kdID//9GTgP//0i2A///iPsD//9MggIsIDv8BKbyA/wFteYAVJAr//sCwwAQkCg7/ATGiQP8AE7UAFSIK///4GkD/AVnEgBUkCg7/AcpAwP8B8DmAFf/+pRMA//9PFcD/AV2DwP//OzyAi///tOtA//5VrYD/APiLQIv/ADBUAP8Bp7vA/wDep4AFDv8ALOBA/wG2Z0AVJQr//mU2QP//MOFAFSUKDv8AKkmA/wHwOYAV/wFa7QD//08VwP/+onxA//87PICL//+060D/AapSQP8A+ItAi/8AMFQA//5YRID/AN6ngAUO/wFALMD/ACxwQBX/AB94wP//5bmA/wAZ7QD//98gAP//3yNA///lvQD//+YTgP//4IpA///gecD/ABpKQP//5haA/wAg0QD/ACDjwP8AGkdA/wAZ78D/AB98gB7//v+wAP8CBIMAFf8AMurA///QiQAF/wAfiQD/ADS9QP8ANRQA/wAhsUD/ADKPwIv/ADvRgIv/AC1rAP//0WxAi///xOiAi///vnyA///MIQD//9coAP//4cbA///e0ED//9PSwP//z35A///9MAD//9zMAIv//9McwAj//9aTQP8AQZaA/wApbMAHi/8AIz2A/wACUsD/AB23QP8AKS0A/wAkmQD/ACEAwP8AHVWA/wBCGYD/ACYMgIv/AF33QIv/AF0zAP//v6wA/wBTN4D//46wwIv//7UfAIv//7WZgP//2pLA///Ue8D//7zzwAgO/wGy88D/AB40gBX//+U/QP8AMFQABf//4D6A///qlQD//9qUQP//9JDA///ZuUCLCP//nx6A//+NA4D/AEwxQP8Aww7A/wCz2sD/AFz3AP8AUkzA/wBWokAf/wBKvcCL/wA64wD//8NZAP8AAA2A//+2A0AI///xVEAG///Zz0CL///YIED////BQP//2ISA///wWcD//8IEwP//527A///e8gD//8rEgIv//8oXQIv//7etgP8AOlxA///F/QD/AEeXQIv/ACaLQIv/ACSVgP8AERUA/wAYw4D/AB2SQAj//9oHQP8APGkA/wDKzgAHi/8AL6cA////XMD/ADAsgP//6jbA/wAwGAD//9/cAP8ARvNA//+9RgD/ACe3AP//t4DAiwj//5LSgP//fNvA//+kJAD//x0rAP//F+HA/wCLJAD//6MBwP8AfK4AH/8AMYxAi/8AMKXA/wAOXgD/ACnjAP8AGw/ACP//4cuA/wFsL4AV///tA8AHi///2FwA/wAA8AD//9nOAP//8GZA///hr0D///CHQP//4e8A///iosD///CSgP//4yBAi///1BxAi///3McA/wAiwMCL/wArRICL/wAZlUD/AAyqAP8AGwtA/wAa7cD/ABJ8QP8AIb1A/wAXKQD/ACn+AP8AAFaA/wAjw4CLCA7/AA6rwP///yMAFSYK/wBbekD//nIoQBUnCg7/ADBUAP8CbxYAFf/9kOoA/wCwDUAH/wAqYgCL/wAq5cD/AAB+AP8AKw8A/wASTED/AEMNwP8AHH6A/wAk3ED/AD0DQIv/AEA4QIv/AEiPAP//0TNA/wBBYED//7owgP8AF4fA/wA36YD/ABbPgP8AJG3A/wA2VUCL/wA7vICL/wA3/gD//9/UgP8ANWNA///Fc0D/ABl2AP//2QOA/wAQ88D//9jnAP8AAG6A///ZrwCLCP//lCAA///EdAAV/wBiYcAG/wAanACL/wAceoD////nAP8AG7GA///00ED/AClRQP//70+A/wAV5QD//9yzgIv//9wlgIv//9xvQP//6qUA///dtQD//9jEgP//7wVA///jUQD///OWgP//4igA////4sD//+RCQIsI//+ee0AG///FUQAE/wBl1YAG/wAfecCL/wAe6oD///9kgP8AHxpA///xPMD/AC4/wP//6gyA/wAYhoD//9OIAIv//9LwAIv//9NxQP//6EtA///WUQD//9TxgP//7JlA///lF0D///PgAP//5ZfA////h0D//+USAIsI//+I6AAGDv8BFY6A/wJ0Q4AVKAoO/wA1gYD/Am8WABUpCv//sJrA///EdAAVKgoO/wA6rwD/Am/zABUrCg7/AE2rgP8Cb/MAFf/9kA0A/wBGxAD/ATJdgP8A6QLA/wA8aQD//xb9QP8Aw+aA/wEgPgD/AD1GAAcO/wEVPoD/AnUlQBUsCg7/ADZegP8CbxYAFf/9kOoA/wBIfgD/ASjfQP8A812A//7WQ8D/AEbEQP8CWYMAB4v/AApcQP8ABzGA/wAAT0CL/wAHkgCL/wABfgD///+ZwP8AAXMA////P0D/AAFBgAj//7QOQP/+9VVA//8LxYD/APKAwAaL/wAKrwD/AAZCAP8AAQJAi/8AB93Ai/8AAZxA////oUD/AAGTwP///0pA/wABawAIDv8AWAbA/wJvFgAVLQoO/wCrvMD/Am8WABX//8VRAP8Ad/UA//6blMAHi///2WxA/wAA2oD//9OGQP//6M0A///dccD//+9TwP//5yoA///k84D///EagP//4hDAi///y+DAi///2I/A/wArScD///3XgP8AAsjA///7kMD/AAW4AP8ABDAA/wAG5AD///oRAP8ABXSACP//0WYA///HCsAF/wAk6ID//9PWgP8ANWEA///nCMD/ADcZAIv/ADr+gIv/ADYDAP8AHQKA/wAc4ID/ADYKAP8AF96A/wAsqwD/AABoAP8AL1AAi/8ALR+ACP8BY46A/wBfywD/ADqvAAcO/wAqSYD/Am/zABX//ZANAP8ASjfA/wECCYAH/wAxMQD/ADWBgP8A2JzA//7EJEAFi4v/ACeIwP8AA5pA/wAxWwD////ZgAj//wQBAP8BYrGA/wDrmUD/AQ1BgP//5hxAiwX//+8SQIv//+5JQP8AANEA///u3MD/AARcgAj//vtfwP/+23GAi/8BBloABYv/AARUAP8AAFyA/wACqED/AAN+QP8ABItA/wACUcD/AAMDgP8ABG4A/wAEmED///7jwP8ABsDACA7/AEJzgP8CbxYAFS4KDv8AKI+A/wJvFgAV//2QDQD/AEGWwP8B078AB/8Aff+A//8IUcD/ABrAwIv/AIagwP8A+yIAi//+KM1A/wBCc0CLi/8CcNAA///LW4CL//9i7wD//s5/gP//ZYYA/wEwo4AFDv8AMg3AFi8KDv8B1zSA/wE2QIAVMAr//yNggP8A/iiAFTEKDv8AOq8A/wJvFgAV//2Q6gD/AEh+AP8BE0wA/wB6i8CLB/8AJtDAi/8AJVrA/wAA9sD/ACXYQP8AEz0A/wA5nwD/AB1KwP8AHlIA/wA7rYCL/wA/K0CL/wA/A8D//+GiAP8APPkA///FI8D/AB5QAP//2O3A/wAUHwD//9lYgP8AAQcA///X0cCLCP//iqHA//++aYAV/wB1XkAG/wAaCECL/wAZDID///9dAP8AGWXA///zQoD/ACbYAP//7IPA/wAUK8D//9hbgIv//9dwwIv//9hEAP//7LfA///a4AD//9vnAP//7byA///n+cD///PYQP//6D6A////akD//+dvAIsI//+CAMAGDv8A+rHA/wI2JkAV/wAr3gCL/wA16cD//+YjwP8AHgbA//+2aAD/ABWwwP//ytVA/wADzAD//8NogIv//8ucQAj//zDzwP//n0AA///ZugD//8u3AP//tsCA//+rx4D/AEXNwP8AxaCA/wC29wD/AFVHAP8APIdA/wBD7sAe/wDchED//v6zgBWL/wA7E4D///veAP8ATN2A///esED/AEJWAP//117A/wBQ6AD//7jIQP8AJfTA//+7ooCL//+jWoCL//98bwD//7fQwIv//wqSQIv//yKegP8AafUA//+r+ED/AFqggP//8cfA////J4D//8cOwP8AD16A///VBQD/AC1ogP//6XZA/wAmxkD//+zAgP8AK42A/wAEmID/AEfyQP///2IACP8AAboA/wBELYAF///gOMD///6gQP//5O+A///8HwD//+miQIv//8FgAIv///aJQP8AKPmA///+1kD/ACKSAP8AOMYA/wAKV8D/ADe+AP8AJXiA/wAiQsD/AET9AP8AIRmA/wBCpgD/AAPwgP8ATTdAi/8ANrMACA7/ADgYQP8CbxYAFTIK//+O8oD//75pgBUzCg7/AbLzwP8CJN5AFTQKDv8AHxGA/wJv8wAVNQoO/wAyDcD/Am8WABU2Cg7/ABkHAP8Cb/MAFf8A1ExA//2LvED/AB/uQIv/ANDYgP8Cc2bA//+69gCL//9o+YD//iHmAP//YFhA/wHe9wAFDv8AEUKA/wJvFgAV/wBkG8D//YyZQP8AHHqAi/8AbL0A/wGbpsD/AGsDAP/+ZFlA/wAbncCL/wBiYcD/AnNmwP//xVEAi///xwrA//5ZIUD//5sHgP8BeSGA///qbMCL//+b5ED//oiYgP//vK/A/wGlJMAFDv8BetuA/wJv8wAV//9/i4D//xMpgP//fLEA/wDs1oD//7TrQIv/AKbwwP/+zc8A//9Vm4D//sI+AP8ATM7Ai/8AhU+A/wD29AD/AIqIwP//CQwA/wBOiICL//9PVkD/AT9iAP8Ana1A/wEwkQAFDv8AHHqA/wJv8wAVNwoO/wA+IsD/Am8WABU4Cg7/AIMtAP8CnbBAFf/9CWxA/wEehED/ADj1QP//IViA/wKCEkD/AN3KgP8AO4xABw7/AbStgP//8w4AFf/+xrtA/wKldID//8R0AP//4cuA/wE6IcD//VtogAUO/wFxXUD/Ap2wQBX//uJYwP//xHPA/wDdyoD//X3twP//IViA///HCsD/AR6EQAYO/wBdNED/AW7GgBX/ADINwP//59YA/wBtmgD/AK8wQP8AYKfA//9Qz8D/ADWBwP8AGQbA//94gkD/AP9ywP//6mzAiwUO/wAihQD//+0DgBX//8K6QP8Br4AA/wA9RcAHDv8A21kA/wHM8kAV/wAdFgD//91WQP8AHgNA/wADtcD/AA8MQP8ADKCA/wAOxYD/AAxlAP8ACAeA/wAa1sD//+aagP8AHkQA///yFQD/ABCWQP//7lnA/wALScD///ILQP8AEKHA///zYsD/AA8IgP//9zZA/wARQgD///lQgP8AEFvACP//5UJA/wBBbwD//8zQgP//5xNA/wAYM8D//72QQAX/ABjowP//u6BA/wAN/QD//+IZQP8AEONA///r38AIDv8AWp2A/wGTBYAVOQr/ARXiwP//QwDAFToKDv8AO4wA/wKZX4AV//1moID/AC6aQAf/ABkGwP8APGkABf8AHgDA///TbUD/ADJnwP//5ODA/wA20gCLCP8AXa3A/wBhT8D/AE+YwP8ApbwA/wCfmcD//6ISgP8ASikA//+mNwAf///F0MCL///KYED//+EHgP//4weA///NycAI/wEAT4AHi/8ABVBA/wABFUD/AAIvwP8ABLIA/wADusD/AAGtAP8AAVUA/wAFeED/AAPeAP///kuA/wAGAoAI/wBoe4D//vyKgBX/ACruwP8AWvqA///mT0D//16zgP//dBeA//+loUD//+Z3QP//01DAH///4MEAi///uvuA/wAMfQD///R8wP8AVxhA///83AD/ABfDQP8AAFUA/wAa60CL/wAniUCL/wApUcD/AAGWgP8AHWfA/wAKYwD/ABkjAP8AEQWA/wApMQD/ACmCwP8AGZQA/wAtOMCLCA7/AciHAP8BfXJAFTsKDv8BcxcA/wGGE4AV///qCYD/AC71AP//zx2A/wAfpwD//8DfQIsI//+o6wD//5bXwP//wiPA//9RZcD//1dagP8AXVqA//+2SkD/AFhPgB//ADpsAIv/ADX8QP8AIDYA/wAcsQD/ADNHQAj//9hNQAeL///1JUD/AACngP//9EkA/wADqUD///TpgAj/AEehAAb///xlwP8ADf1A////TsD/AA54AP////rA/wAN1EAI////I0D/AlKbgAX////+AP8ABTZA/wAAc4D/AALMQP8AA5BA/wAFgkD/AAIQAP8AAzAA/wADywD/AAT3wP///6GA/wAGzgAI//+zMUAG//99X8D//wCWQBX/ACgOgIv/ADsFgP//6riA/wASE8D//7wsAP8ABanA///qwMD/AAIEQP//5oBAi///zQCAi///3Y4A///944D//+ZlQP//+JfA///o7oD//+5ngP//yTQA///Qt4D//+AmAP//0FpAiwj//8xGgP//syQA/wAoLQD/AJZ6wP8Agg/A/wBJOsD/ACPmwP8ANJCAHw7/AQKjwP8B0/sAFTwK//92MAD//z2XQBU9Cg7/AVd+QP8CnvFAFf//v89Ai///w/KA///kVQD//+ASQP//zBNA///olcD//9nrQP///laA///Z7wCL///XcsAI///TH8D//5zBQP//xwrA/wBjPsD//osvAP8ARQpA/wF00QD/AJVMgP8AOPVA//9qs4D/ACNiAAeL/wAhF4D///+QgP8AIwNA/wAREYD/AB6VwP8AEteA/wAhwoD/ACNDwP8AENWA/wAlyECL/wAr/kCL/wAkmgD//+jIAP8AEzcA///i8ED/AAM1gP//+yUA////MwD///1EQP8AAFgA///7uoD/AACNAP//+SZA/wAEfYD///4zwP8AAxQA/wAAUAAI/wAgy0D/AEJzgAX//99PgP8AJ1dA///OXkD/ABcvwP//xojAiwgO/wB99UD/ATpbwBU+Cv8AaP1A/wCdUAAVPwr//7peAP/+QL/AFUAKDv8ARedAFv8ASVrA/wEHNwAGi/8AHsSA/wADs0D/ABZZgP8AEwEA/wAZUsD/ABFqwP8AFzXA/wAr5wD/AChiAP8AME9Ai/8AFu2Ai/8AFpnA///2rgD/ABBowP//7GSA/wAYucD//+J0AP8AADTA///YywCL///fuwAI//7stAD/AEbEAP8BFQYAiweL/wAjq8D////EQP8AJbIA///vwAD/ACS5gP//6UFA/wAzZsD//9EsAP8AHTuA///L8MCL///CAQCL///HsMD//9dwQP//3nRA///NFMAI/wEI8QAHi/8AA2SA/wAAO4D/AAKcQP8AA2XA/wADlcD/AAJLwP8AAmwA/wAED8D/AAMUQIv/AAU3AIv/AAEFwP///9VA/wABA4D///+sQP8AAPYACP//rScABg7/AGomQP8ByWPAFUEK///de4D/AMZ9gBVCCg7/AH3/gP8ByWPAFUMK///cnoD/AMZ9gBX//+NdgP//6NZA///o7UD//+O2gP//47gA/wAXKQD//+jwAP8AHKCA/wAcpQD/ABcpAP8AFxKA/wAcRwD/ABxLwP//6NSA/wAXDwD//+NgQB8O/wBCc4D/ApiCgBX//WaggP8ASH4A/wCtdoAH/wA8aMD/ADgYgP8AumiA//8W/UAFi/8AJlGA/wADecD/AC/kgB7/AAJUgIv/AAJVAP////4A/wACVMD////8AAj//x+ewP8BEZJA/wDAcwD/ALU7AP//5hwAiwX//+58QIv//+26AP8AANGA///uSED/AARcAAj//xtOQP//K7PAi/8Bh81ABYv/AARTwP8AAFyA/wACqED/AAN+AP8ABIuA/wACUcD/AAMDgP8ABG4A/wAEmED///7jwP8ABsCACA7/AFSTAP8CmIKAFUQKDv8AJfjAFv8AQZaA/wEwo4AGi/8AFYNA/wABfgD/ABP0QP8ADPLA/wAYCoD/ABCHQP8AHrEA/wAUakD/AAvuwP8AEkvAi/8AEEZAi/8AEkzA///14cD/AAe+AP//5uvA/wAF5cD//+zkgP///pzA///p9YCL///tKMAI//7CaoD/AENQQP8BLgzAB4v/ABgCgP8AAlVA/wATlUD/ABDeQP8AHHMA/wAHkED/AAzCAP8AEdFA/wAcbgD/ABu9wIv/AA7IAIv/AA4agP//92PA/wAHY0D//+8bgP8ACGoA///sw0D///3FAP//5duAi///6zqACP/+u4MA/wBELUD/AUVaAAeL/wAlzkD/AAGaQP8AJqJA///ryAD/AB6GAP//7n3A/wAab4D//+O9QP8ACdyA///mTYCL///ULgCL///XM4D//+X0gP//7kDA///Xl4D///jWgP8AJbtA///fRwD/ABzEgP//1w7Ai///2ocAi///3PoA///nzYD//+r/QP//4A4ACP8AAN0A/wAs4ED//72MgIsFDv8ARC1AFkUKDv8BzBPA/wDiXkAVRgr//y+1wP8As1SAFUcKDv8AO4wA/wHIhwAV/wAA3QD//ZDqAP8ASVrAi4v/AOL4AAX/AB5/gP//0tOA/wAzIID//+SNgP8AN35Aiwj/AF1jgP8AYk3A/wBOSoD/AKeGgP8AoTtA//+gf4D/AEgLwP//ph6AH///xV3Ai///yWGA///hrUD//+D2gP//zhCACP8ARedAB/8AdeKA///NAYAVSAoO/wF1rcD/AYYTgBX///+rgP//4DBA/wBO64D//5qjAP//m+lA//+d3oD//69JwP//ZL5A//9r8kD/AFbsAP//oUwA/wBk4QAe/wA6LkCL/wA1ZQD/ACCLwP8AHJEA/wAy3oAI//8QFgD/AEehQP8CbxYA//+70oAH//99pMD//9FtQBX/ACjKAIv/ADSaAP//6jLA/wAUAcD//8f5wP8ACQJA///mxwD/AAIpwP//4zzAi///yMNAi///3dgA///97MD//+ZbAP//+ItA///o18D//+54AP//yYwA///Q6ED//9/UwP//0F0Aiwj//77VAP//vb6A/wA8lwD/AIEVgP8Ady6A/wBDWgD/AC/GAP8APUuAHw7/AGM+wP8ByIcAFUkKDv8BsF0A/wGMHgAVSgoO/wC8IkD/AkMSwBVLCg7/AD7/wP8ByIcAFUwKDv8AJ7LA/wHJY8AV/wC1OsD//jMogP8AOBiAi/8Ab1OA/wEEoEAF/wAbU0D/AD/4wP8AGabA/wBCnID/AA8zgP8ARaIACP//v0ZABv//8+kA//+9boD//+fQwP//wKXA///mI4D//8QPwAj//7alAP//Vf0A//979kD/AU37QAX///8qAP8AAh1A////XUD/AAHLgIv/AAJnwIv/AAYUwP8ABOxA/wAFUoD///5GQP8ACCwACA7/AA+IwP8ByWPAFf8AXFdA//41v0D/AEC5gIv/AFBCgP8BKAKA/wBUksD//tf9gP8AQ1CAiwX/AB7uQP8Al3kA/wAZVYD/AJiTwP8AE64A/wCZV0AI//+9jIAG/wABzYD//8jJQP//+0XA///NPsD//9ijQP/+/A6ACP//n1gA/wFDoAD//9P8wIv//7F3gP/+u4MA//+9jID/AUmqgAX///6rgP8ABpqA////ykD/AAObgP8AAnqA/wAH+oD/AAGmQP8ABVBA/wACoYD/AAazAP///V7A/wAHxQAIDv8BanXA/wHJY8AV//+N24D//1bIAP//iEUA/wCpOAD//7F3gIv/AJ3OQP//HszA//9fmwD//xfPgP8AUR9Ai/8AdyVA/wCxosD/AH3yQP//Tl1A/wBR/ECL//9YGcD/AOrnwP8AlA0A/wDefAAFDv8ALb1A/wHIhwAVTQoO/wBGxAD/AcljwBVOCg7/ADSkgP8BG+1AFf//x+fA/wAUtoAH/wAQ64CL/wAZwgD/AAA0AP8AFIKA///r5sD/ABOhAP//7MRA/wAGv8D//+LhwIv//9TRwIv//+DTAP///D+A///iMQCL///ZBsCL///bs0D/AAMOgP//u51A/wA0roD//9eSQP8AKzIA///e2cD/ADM3AP8AAwaA/wA9xcCLCP8AJD8A/wA4GED//9rkAAb//9biQIv//+DQwP///fiA///kpAD/ABLZAP//3EEA/wAYoID///rqQP8AK8dAi/8AImsAi/8AGnkA/wADKwD/ABo4gIv/AB7qQIv/AGiCQP//0XgA/wAmEAD//9oQQP8ADS/A/wAe70D/AA1FgP8AGXHA/wAXwAD/AA7EQP8AHjKA/wANO0D/ABsPQP8AAqmA/wAdkECL/wAXyQAIi/8AGG3A///9CwD/ABXnwIv/ABfxQIv/ABROwP8AAZUA/wAwrAD/ACaAAP8AGAoA/wAa5oD/ABDLwP8AHnYA///76ED/ACu3wIsI/wAihUD/ADj1gP//4cuABv//ylbAi///v7+A/wADu0D//9AFQP//1EOA///UBsD//9fqwP//+qHA///HxICL///aXECL///nPMD/AAKNAP//6VxAi///59TAi///54xA///9iAD//9wkgP//6JAA///nasD//+oqwP//6RkA///kroD/AABbwP//7j1AiwgO/wDYnQD/AoxtgBX//NyMAP8AQ1BA/wMjdAAHDv8Bv+XA/wEb7UAV///sJoAG///uPUCL///kroD///+kQP//6irA/wAW5wD//+iQAP8AGJVA///9iAD/ACPbgIv/ABhzwIv/ABgrQP8AAo0A/wAWo8CL/wAYw0CL/wAlo8D///qhwP8AODuA///UBsD/ACgVQP//0AVA/wArvID//7+/gP///ETA///KVsCLCP//4cuA///HCoD/ACKFQAb/ACu3wIv/AB52AP8ABBfA/wAa5oD//+80QP8AJoAA///n9gD/AAGVAP//z1QAi///67FAi///6A7A///9CwD//+oYQIv//+eSQIv//+g3AP8AAqmA///ib8D/AA07QP//5PDA/wAOxED//+HNgP8AGXHA///oQAD/AB7vAP//8rqA///aEID///LQQP//0XgA///Z8ACL//+XfcAIi///4RXA/wADKwD//+XHgIv//+WHAIv//92VAP//+upA///UOMD//9xBAP//51+A///kpAD//+0nAP//4NDA/wACB4D//9biQIsI///a5AD//8fnwP8AJD8ABv8APcXAi/8AMzcA///8+YD/ACsyAP8AISZA/wA0roD/AChtwP8AAw5A/wBEYsCL/wAkTMCL/wAm+UD///w/wP8AHc8Ai/8AHy0Ai/8AKy5A/wAGv8D/AB0eQP8AE6EA/wATO8D/ABSCgP8AFBlA/wAZwgD////MAP8AEOuAiwj/ABS2gAYO/wBbekD/AVW/gBX/ABlOgP8AKWjA/wAdbYD/ABRggP8AHEPAi/8APQrAi/8AFHZA//+waoD/AFENQIv/AD7dgIv/ADGQAP8ANJBA/wAaDYD/ACdzwAj//9JDAP8AJfkABf//4zfA///Y3YD//+hfAP//5miA///fM4CL///G8QCL///ly0D/AEsgQP//rXlAi///x1cAi///zNMA///YScD//+J8gP//zeqACA73EA73Bw72Du0O5A7cDtMOyg7CDrkOsQ6oDp8Olw6ODoUOfQ50DmwOYw5aDlIOSQ5ADjgOLw4nDvsADvsJDvsRDvsaDvsjDvsrDg7/ALRUQP8CYNeAFf//31+A/wAagoD//+WAgP8AIKCA/wAgosD/ABqAAP8AGoIA/wAgnYD/ACCggP//5X2A/wAaf0D//99fgP//310A///lgED//+V9wP//32MAHv8AOZaA//2T7QAV/wARUgCL/wARmsD/AAqZAP8ACOyA/wAVfcD/AASXAP8ACw1A/wACOcD/AA1+AIv/ABK8AIv/ACBFgP//+Z9A/wAYSID///yCgP8AQbTACP//8VRA/wEUKQD//83yAIv//+3ggP/+69cABf///YDA///Z7YD///k2QP//2iWAi///2ctAi///6H4A/wACTYD///TLQP8AAYHA///6F4D/AAe3gP//4biA/wAVCwD///NnwP8AEsTAiwgO/wEcykD/Am/zABX///HowP//j48ABf//egGA///5hoD//6efgP//naAAi///eeiAi///jMBA/wBBGUD//6dbQP8AYl9A///kzAAI///x1AD//47mgP8AOdJA///5GID/AA6uwP8Ab2vABf8AAnVA////7kD/AAJ4gP////dA/wACfACL/wBA0UCL/wA86UD/ABiKQP8AKuYA/wAvGUAI///bwQD/ADBUAAX//905wP//3ENA///QU0D//+ukQP//z62Aiwj///9hwP8AAABA/wAuHoD/AV32AAX/ACSlgP//9OPA/wAZJcD//+qfQP8ADOeA///wsUD/AAUkQP//+ebA///+RgD///u2gIv///pYwIv///6tgP///+pA///6mUD/AASnQP///MIACP8ALANA/wA49UAF///nn8D/ACVcwP//2AiA/wAdTAD//8mkwP8ACtuACP8ACtMA/wBSI0AF/wAA54D/AAbYwP8AAY7A/wACPQD/AAKRAP8ABJMA/wABMkD/AAIhwP8AAxNA/wAFWgD///9UgP8ABnlACP//e//A//4CsEAV///Dh0D/ABhFgP//12uA/wA+uoCL/wBXEwCL/wBomsD/AD4gQP8APleA/wBSRoD/AATpQAgO/wGhsUD/AjwrQBX//9wdQP8AIOnA///RisD/ABICQP//0FnAi///ozcAi///rTcA//+62sCL//+P2UCL///qWcD/AAL+wP//6thA/wAEQED//+sBQAj//8vwgP//xwrA/wBBbsAG/wAH4YD//9+fQP8AByFA///fSICL///duICL///S/gD///PHQP//1gbA///pw8D//91pAP//8CzA///nYYD///PiwP//+zaA///ReUD//+qBwAj/ABnjwP//xwrABf8AQBtA/wAh4sD/ACaWAP8AA8xA/wAUb0CL/wBImsCL/wAp0UD//9NFgP8AP8KAi/8AK6UAi/8AJiOA/wAXqQD/ABaEwP8AEeeACP//5T9A/wAzx8AF///rsQD//+6dQP//5fzA///1soD//+RpwIv//8a8wIv//9aowP8AKTdA//+9hACL///3AgCL///3B8D///88wP//9yeA///+dED/ABe/AP8AJmdA/wAM9oD/AC4iQIv/ADFigIv/ACI8QP//+bLA/wAgLoD///i6wP8AHvIACP8AVZnA/wA49UD//5zmgAb///tOQP8AFdjA///8mAD/ABV0QIv/ABViwIv/AFM7QP8ANPsA/wAoU4D/ADWoQIv/ACn+AIv/ABwfQP//58sA/wAEPsD///tWAP8ABdUA///5lwD///9fgP//9/bA/wAIKUD///oEQAgO/wHQS0D/Aj3lABX//91GwP8AIyhA///QUwD/ABKwQP//yzdAi///wYjAi///rQGA///l7MD//8zegP//ps/A///vJYD//+KaAP//9JVA///eoUD///ipwP//3IhACP//zNPAi///8w4A///GLcD/ADeyQIsF///+EID//+rPwP///yiA///qc4CL///qcMCL///6loD/AAARwP//+q4A/wAAI0D///rFQAj//9fRwIv///MOAP//xi3A/wA5z0CLBf8AGioA//9G3AD/AH1EgP//03lA/wBQ7cCL/wA0QcCL/wAxGUD/ABG6gP8AJj/A/wAhTEAI///jhUD/ADINwAX//+LGAP//5a/A///Z/0D///GSgP//2CmAi///0a3Ai///zSFA/wATwAD//9zOAP8AL6GA///rosD/ABuOgP//8sSA/wAhv0D///j9gP8AKKTACP8AsV0Ai/8AFnBA/wA50kD//zJ6QIsF////v8D/AAbsQP///+BA/wAHFECL/wAHPUCL/wAWj8D/AADigP8AE4tA/wABasD/ABDpgAj/AOnNAIv/ABWTQP8AOdJA//8JCICLBf8AAafA/wAHgcD/AAGsgP8ABl9A/wABjUD/AAVlQP8AHW/A/wBmY8D/AEh4AP8AIq7A/wA7tcCL/wBDXcCL/wAlM4D//9TUAP8AAPdA///+0wD/AAV4AP//+ViA///7/cD///f3AP8AByJA///6KwAIDv8AJD8A/wJv8wAV/wC7RUD//rcygIv//+tJgP//dDHAi4v//8cKwP8Ai85Ai4v//8EAQP//dDHAi4v//8fnwP8Ai85Ai4v//52eQP8ARC2Ai4v/AGJhwP8AhqDAi4v/ADgYQP//eV9AiwX/AD7/wP8AhqDA/wA49UD//3lfQP8AFLaAB/8ArlNA/wFH8ID//7XIQIv//3sZQP/+/DzA//9vBAD/AQSgQAUO/wGSKID/AvMgABVPCv8Ao/hA//+U/QAVNAoO/wGcg4D/AkdjQBX//+EsAP8ANjmA///FlwD/ACIIgP//vdfAi///olFAi///uovA//++KgCL//+zwUCL///YXoD/ABMGAP//1FzA/wAvsMD//+JhQP//0EhA///u/gD//94kQP//2W+Ai///0tRAi///3ZDA/wATMAD//9v3QP8ALGdA///lwwD/ADHhAP//4oaA/wA4xkD///xqgP8AKXPA///neMAI/wAiAcD//+vgwP8AC/JA///kfsCL///ooECL///WlkD//9qkgP//2qaA///CzACL//+0oECL///d34D/ADcUAP///PeA/wAH4AD///3VgP8ABZ9A/wABn0D/AAi3AP//+D0A/wADLQAI///LW0D//8K6QAX/ACnbAP//yTIA/wBA1QD//+FZgP8AQpTAi/8AZRlAi/8ARUIA/wBFDICL/wBN6sCL/wAqhED//+toQP8AK+CA///ULsD/AB3EwP8AK4VA/wAR0kD/AB5iQP8AJRGAi/8AKc3Ai/8AJAZA///p8MD/ACvdQP//ujQA/wAhVED//9e5QP8AEztA///afoD/AAhtwP//40wA/wAPLgAI///UUAD/ABcagP//9r1A/wAe/QCL/wAURYCL/wApoQD/ACY+gP8AIywA/wA0rgCL/wA1F4CL/wAd2UD//9vBgP8ACCMA///pbcD/AAKBwP//+QyA///+BgD///f8QP8AB1WA///6dYAI//9g/MD//3kyQBX/AB74AP//85/A/wAe/cD///kVQP8AGa9A///zUwD/AC5/QP//6Q4A/wALdED//98uwIv//+kzgIv//+X+wP//8W+A///pXYD//+oiQP//9PpA///cA4D/AA6UAP//3WBA/wAEkoD//+HWwP8ADsHA///VoMD/ABS7QP//9G0A/wAez8CL/wAWUECL/wAdEYD/ABL0gP8AGKsA/wAamQD/AAixQAgO/wF5IcD/ApJ4QBVQCv8Apo8A//+GUQAVSgoO/wEGBkD/AafPwBX//69owP//vTZA///BNsD//6qkgP//rI1A/wBAwgD//7lwwP8AUVXAH/8AMSSAi/8ALoAA/wAaSAD/ABungP8AKetACP//0/zA/wAdV4AF///xMAD//+RsgP//40IA///up4D//+CtAIsI///Lf8D//9Y6gP8AL28A/wA8esD/AD4vQP8ALhtA/wAdbsD/AC8zQB//ADFrgIv/AA+SgP//3XMA/wABy8D///itQP8AAZxA///5b0D///ysQP//+PPA/wAFmED///k4QAj/ADPHwP8AE9lABf//8xOA/wA1FMD//89BwP8AJ1bA///BEUCLCP//+bBA//5rE8AVUQr//zuZAP8A/19AFVIKDv8AeovA/wI2IMAV/wAihUD//9aTgAX/ABZ3gP8AHs3A/wAkjQD/AA06QP8AIqIAi/8AH06Ai/8AFPnA///z6UD/AAtOgP//7mFA/wAKuwD//+9GwP8AAFCA///uMkCL///vGIAI///z6wD///FUQAf//86AwIv//8jvwP8AAljA///TPMD//+gqAP//1lFA///pzcD//+4oAP//2uCAi///3tzAi///yGWA/wAwYAD//881wP8ARVEAi/8AJsUAi/8AJkDA/wAPKYD/AB2rgP8AG/1ACP//3lfA/wA+/8D/ANpWwAeL/wAaScD///7zwP8AFqPA///1c4D/ABargP//62aA/wAsRcD//9I2QP8AFZeA///JxYCL///Qy0CL///MroD///DzQP//3BIA///WtcAI/wDNZQD//3GbABX//+69QAeL///owED///9qQP//64qA///qYMD//+viwP//7j1A///vegD//+QtAP//8SWA///hR4CL///ZesCL///niQD/ABkLQIv/ABwAwIv/ABWoAP8AD0RA/wAbHgD/ACwhQP8AB9QA/wAaXcD/AAStQP8AIXGA///+IoD/ABnlAIsI//8UZsD//yaGABVTCg7/APiLQP8A/NwAFVQK//6y4gD//2xtgBVUCg7/AFt6QP8BWu0AFf//wQBA/wEC5oD//4EjwP8AP9zA/wC93AAHDv8ARsQA/wFbygAVIwoO/wD/toD/ABLjgBVRCv//O5kA/wD/X0AVUgr/AGAHgP//cqRAFf8ALb1A/wB7aID/AEGWgAb/AD4iwP//gt2A/wAvdwD/AAbngP//v0aA/wB9IoAF/wAiokD/AAm2wP8AGAzA/wAfaICL/wAjc4CL/wAe3QD//+2oQP8AHcfA///eQsD/AA5GwP//6P6A/wAJu8D//+iSAP8AACeA///pssCLCP//oe7ABv8ALb1A///XcIAV/wAxMMAG/wAQbgCL/wATd4D/AAAuQP8AECIA///27QD/AA84gP//93CA/wAG+ED///IsQIv///MAgIv///O7QP//+c/A///zBoD///KAgP//93WA///wIID///X0wP//7FhA/wAAFMD//++VwIsI///MOEAGDv8Ae2jA/wJtXEAVVQoO/wGG8ID/AfhhwBX/AEn2wP//w40A/wA8SAD//7VVgP//tVjA///DkID//8O6QP//tgyA//+2AUD/ADx2gP//w7wA/wBKoQD/AEqqgP8APHJA/wA8RoD/AEn2wB7//3nrgP8AUZiAFf8AKKCA/wAh+kD//9zmAP//0vSA///SoMD//93lQP//3OUA///XdkD//9c/QP//3gFA/wAjJsD/AC0PQP8ALUgA/wAiIAD/ACMhwP8AKKlAHw7/AC29QP8AUEJAFf//wQBA/wGbpoD/AD7/wAf//xRmwP8B7oAAFSEKDv8Ab1PA/wIqC8AV/wAumgD//+DuwAX/AAT1QP8ACWkA////SsD/AAR2gP8ABWTA/wAG0sD/ABGVwP8AFj9A/wAgpAD/ABP7wP8AJmgAi/8AL8+Ai/8AG3nA///iq8CL///gRYCL///h60D//+l1gP//59xA///i+8D//+hnQP//4g1A///npgD//7aLwP//zz0A///ISkD//7L0gAj//9P8wP8BF5yA/wA+/8AH///5goD/AAInQP//+xlA///7JYD///3sAP///jUA///78cD///yAgP///ewA////XID///twgIsI//9J6EAG/wA330D/AD5wQP8AN0wA/wAZ8oD/ACe4AP8AJJsA/wAONID/AA0XgP8AIIkA/wAgiECL/wAvWACL/wA8l4D//8nrgP8AM10A//+wZcCL///DW4CL///H3ED//+EagP//4f1A///LzMAIDv8BAaUA/wJ92kAV///NqYCL///PbQD//+l6wP//3mcA///YSgAI/wAkPwD//9rkAAX/ABgDwP8AHgNA/wAjZwD/ABCfQP8AIdKAiwj/ACz6gP8AHavA///ixgD//+IUgP//6QpA///uLYD//+OEwP//vnvAH///+WFAi///+WKA/wAAUwD///lpQP8AAKFACP//zfJAB/8ACaaA/wABLkD/AAngQP8AAKHA/wAKXUCLCP8ATIoA/wALVID//9sVgP//7ZsA///caMD//9itgP//4tjA///O+QAf///QqQCL///h0sD/ABtqwP//+rvA/wAFJED///avgP8ACRcA/wAEL4D/AAlpgP//9zAA/wAJXEAI///RZgD//8w4gAX/ACPmQP//1vtA/wAz3cD//+hJAP8ANovAi/8AT7/Ai/8AR1xA/wAyA0CL/wBBWgCL/wAqEwD//+D7wP8AJCpA///VqQD/AAd7wP8AISnA/wAKj0D/ABccwP8AHv7Ai/8AJJcAi/8AOY9A///Hn8D/ADHvwP//tX2AiwgO/wGM+wD/AvMgABVPCv//NFTA///fNMAVOAoO/wAYKgD//1lxABX/AD4iwAb/AAC+QP8AS14A/wAASsD/AEujAP///9QA/wBL9wD/ABTKAP//0/yA/wAsXwD//+RhgP8AMKTAi/8AM4EAi/8AMAWA/wAeukD/ABciAP8AL89A/wAFl0D//9T3QP8AIkZA///dRsD/ACpTAIv/ACURAIv/AB+cwP8AGhRA/wATJID/AB09gAj//+U/QP8AMurABYv//+reAP//z46A///eG0Ae///z68CL///0EcD/AAZ8gP//+IQA/wANJ4D///d0wP8ADwQA/wAAIoD/ABJHwIv/AA9bAAj/AVTiwP//wCNA//73DwAHi///4VNA///+fAD//+WPgP//9JhA///l8wD//+5WQP//16hA///cpYD//+cPAP//28+Ai///4DGAi///4B4A/wATqMD//+42QP8AJBMA///yIwD/ABwcgP///vpA/wAcjsCL/wAeAYAI/wEO+4D//75pgP//AWpAB4v//4FpwP//7PYA//+BvUD///8wwP//jFjACA7/AbPQwP8CmV+AFf//gt1ABv//0ZkAi///zi7A////zQD//8/+gP//6zbA//+9oED//+NDAP//27uA///FjACL///CosCL//+l54D/AE1WAP//ss0A/wBlWsD///lcwAj//nnsgP8AO4wA/wKkl4D/AEvxwP/9W2iA/wA50kAHDv8BKbyA/wFK9IAVJAoO/wF5IcD/ApJ4QBVQCv//PPYA///DlsAVTgoO/wEpvED/AniUQBX//9W2gIv//3v2AP//t4IA/wAQZYD//+DuwP8AX8sA/wAYKcCL//8KC8D//5zBQIuL///JoYD/AP6WAIuL/wA2XoD//6LLwIsFDv8A+9iA/wJuO4AV//+s30D//7btAP//tLgA//+NTID//5LlwP8ARsOA//+9HMD/AE8zQP8ASSeA/wBOT4D/ADqOgP8AgWsA/wB4AID//7a+wP8AOf8A//+4B0Af//+gWID//0ahQBX/AFYqQP8ALSzA/wArGcD/AC2hAP8ALggA/wAsaAD//9RtAP//qk2A//+p7gD//9B5gP//20gA///VQAD//9OPwP//0XkA/wAnEcD/AFO5wB7//6/AwP//GWUAFVMKDv8BvivA/wD83AAV//9oHMD/AJOSgP//2SpA///Wk4D/AHjRwP//icUA//+ARsD//3QxgP8AJ7LA///YTYD/AJ3twP8AqEjABf//SsVA/wAXTUAVVgoO/wD83AD/AlN4QBX//+rVQP8AFviA///iO8D/AA1HAP//4L4Ai///15KAi///ycKA///pAgD//97cAP//soFA///lMUD//8FQAP//+UKA//+3qACL//+sDYCL//+KokD/ABLxgP//wVtA/wADuYD///PSwP8AHKdA//+iU0D/ADxOgP//3qFA/wAxU8CL/wAfwsCL/wAd28D/AA3JQP8AFBxA/wAYQwAI///g7oD/AOWOwP8APiLA//9ZcQD/AOdIwP8Aj0IA/wA/3MD//3C+AP8AzIgA/wCpJcD/AD4iwP//GLeAB///THlA//7UWUAVi/8AacQA/wANWQD/AC4fQP8ABh/A/wASXQD/ABInAP8ANnDA/wAeJgD/ABjowP8AHXwAi/8ALRAAi/8AGawA///I+AD/AAqsAP//3iOACP/+nHHAB///9i7A///TpUD//+NrQP//4UJA///dcMCL///peoCL///fMMD/AA3CwP//6YTA/wA27gD//+QWAP8ARDMA/wAABYD/AGkpwIv/ABvkAAgO/wChcYD/AdIRwBX//9DYQIv//82OgP//5SCA///iUYD//8f6wP//51ZA///RckD///yIwP//ydPAi///0gjAi///y3PA/wADtoD//7/oQP8AGB9A///ObQD/AB3PwP//wrtA/wAydgD//+vCQP8AJ8JAi/8AJDYAi/8AI7/A/wAP5wD/ABr/wP8AGK5A/wAf+0D//+VwAP8AKEUA///xdYD/ACmSwIsI/wAwLICL/wAuGwD/ABOCwP8AIYlA/wAiicAI///cngD/ACsmQAX//+ZmQP//4ttA///cF4D///ZEAP//4yEAi///2rbAi///2wiA/wAQrwD//+5FAP8AKC5A///1KAD/ABiTwP///PgA/wAd3gD///95QP8APw+ACP8A49UA/wALOEAGi/8AMgTA/wACUID/ADWeAP//7+HA/wAsEQD//+lZgP8APe0A///MWkD/ABhOgP//0aqAi///2UaAi///2v7A///vgcD//+aRAP//4rFA///qYkD/AB0OAP//3cRA/wAQu8D//9q1QIsI/wBlxYD//0PRABX///8DgP8AL6KA/wAJWwD/ABngQP8AAjZA/wAF88D/AA9nQP8AKWuA/wAgUYD/AAyzwP8AGgvAi/8AGd2Ai/8AGszA///z0YD/AA9EQP//5oSA/wAPxED//+WuQP///2AA///gnECL///iawAI///3XsAH//6TwQD//+AmABWL/wAcLkD/AAHuwP8AJyfA/wAP4kD/ACJHwP8AEdnA/wAmh8D/AB5lgP8AE37A/wAcT0CL/wAaF0CL/wAWUQD//+7jAIv//+WtwIv///G1AP//9wEA///agcCL//+1lkCL//+pF8D/AAySAP//0OIAi///8wrAi///5wOA///mywD///HVgP//5wQAiwj//+HxwIv//91iQP8AE1gA///vBYD/ADXugP//84sA/wAnkYD///3xwP8AMYKAi/8AIcYACA7/ANDcgP8C4kuAFVcK/wCxw4D/AAADABVYCv/+mdqA//+NpIAVNwoO/wC1XYD/Al/2gBX//+CHQP8AGkaA///mEwD/ACDgAP8AINzA/wAaQwD/ABnsgP8AH3XA/wAfhkD//+W1wP8AGemA///fLwD//98cQP//5bjA///mEED//+CDgB7/AQBQAP/9+30AFf//zRVA/wAvdwAF///gdwD//8tCwP//yuwA///eTsD//81wQIv//8QugIv//9KVAP8ALpPAi/8AOxeAi/8AQYOA/wAz3wD/ACjYAP8AHjlA/wAhL8D/ACwtQP8AMIHA/wAC0AD/ACM0AIv/ACzjQAj/AClswP//vmmA///Wk0AHi///3MKA///9rUD//+JIwP//1tMA///bZwD//97/QP//4qqA//+95oD//9nzgIv//6IIwIv//6LNAP8AQFQA//+syID/AHFPQIv/AErhAIv/AEpmgP8AJW1A/wArhED/AEMMQAgO/wC1OwD/AxdfABVZCv/+wLCA//1BhIAVJgr/AFt6QP/+cihAFScKDv8BNBdA/wMXXwAVWgr//rLhwP/9LatAFSYK/wBbekD//nIoQBUnCg7/AGXVgP8CtCBAFVsK//8lqUD//OfEABUmCv8AW3pA//5yKEAVJwoO/wCDLQD/Aqt/ABVcCv//uF8A//0ztcAVJgr/AFt6QP/+cihAFScKDv8AyfVA/wLiS4AVVwr/ALHDgP8AAAMAFVgK//6S8wD//RzUgBUmCv8AW3pA//5yKEAVJwoO/wDHR4D/AsN3ABX/ABolwP8AEwlA/wATzAD/ABZ1AP8AFrSA/wASwQD//+v+AP//5lFA///l6QD//+0DAP//7DQA///ph4D//+k+gP//7UNA/wAUCID/ABmZgB7/AH7vQP/+KP9AFScK/wAKFgD/AJFQgBX/AC76QP8ABBuA/wAkJQD/ACYTAIv/AC2DAAj/ADAwgP//13IA/wAn18D//8z+wP//zQpA///XfcD//9gsgP//z9pAHov//9MCwP8AIzTA///aXcD/AC31QP//+w4ACP//KSOA//2T2gD/AEUKQIv/ADxpAP8AtvTA/wDFoICL/wBFCkD//0noQP8ASH4AiwUO/wDIN0D/Am/zABX//zwZgP/9kA0A/wA/3ICL/wA1gYD/AKkmAP8AglBAi4v//1baAP8A5Y7Ai4v/AD4iwP//WXEAi////kYA/wDnSMD/AJD8AIuL/wA/3MD//24nQIv///5GAP8AzIgA/wCtdoCLi/8APiLABf//F9qA///B3UAV//6xJ8D//4xbgAf/AGhsgP8BTthABQ7/ARWOgP8CdEOAFf//nxfA//9z4gD//7kYQP//BpDAH4v//xxHQP8Ad9qA//+uTYD/AGPVgP//99TACP//9gzA//+0OkD/AB1XwIsF/wALZECL/wAOagD/AAAHwP8ACsSA///5ZoD/AAfWAP//+zLA/wADDsD///lSQIv///ocQIv///dLgP//+TJA///wToD//9keQIv//+HEQIv//9pYAP8ACg/A///glsD/ABlUwAj//+b5QP//1pOABf8AJV1A///luUD/ACrIgP//9RaA/wAma0CL/wBJZICL/wAjEgD/ACacQIv/ACO5gIv/ABNjAP//9Y9A/wAR+kD//+zvwP8ACUAA///zJsD/AAY8QP//8t/A/wAAz0D///M9wP8AAKwACP//75pA/wAA3QD/AAQ6wP8AJsUABf8AQAPA/wAIC0D/ADnhQP8AJMzA/wAiZMD/ADgxQAj//8w4gP8AIahABf//40OA///Qb4D//856AP//452A///PGgCLCP//pFEA//+vXoD/AF+owP8AqGXA/wCliED/AE5iwP8AXK1A/wBYFUAf/wAwxcCL/wAtdcD//+MdgP8AGSZA///UkMD/AAH8QP///JKA/wABdYD///1qwIv///tZwIv///2FAP///5OA///9goCL///9g4CL///+1ED////hgP//+qJA/wAErgD///y4QAj/AEJzgP8AIMuABf//3n6A/wBLHgD//7U8QP8AMEqA//+tN8CLCA7/ALU7AP8DF18AFVkK//7ss8D//7JUgBUrCg7/AUVZwP8DF18AFVoK//7NooD//557QBUrCg7/AG52wP8CtCBAFVsK//9JC0D//1iUABUrCg7/ANDcgP8C4kuAFVcK/wCxw4D/AAADABVYCv/+uA8A//+NpIAVKwoO/wC1OwD/AxdfABVZCv//CguA//+xd4AVLQoO/wFFWcD/AxdfABVaCv/+6vpA//+dnkAVLQoO/wBk+ID/ArQgQBVbCv//b+FA//9XtwAVLQoO/wDNaQD/AuJLgBVXCv8AscOA/wAAAwAVWAr//tjaQP//jMeAFS0KDv8AToiA/wJvFgAVXQr//7TrQP/+vhoAFV4KDv8Ah33A/wKrfwAVXAr//9dwQP/9NJLAFS8KDv8AtTsA/wMXXwAVWQr/AIk5QP/+eKIAFTAK//8jYID/AP4ogBUxCg7/AUVZwP8DF18AFVoK/wBqKAD//mTIwBUwCv//I2CA/wD+KIAVMQoO/wBxDYD/ArQgQBVbCv8A4voA//4e4YAVMAr//yNggP8A/iiAFTEKDv8Ah33A/wKrfwAVXAr/AXyXAP/+atNAFTAK//8jYID/AP4ogBUxCg7/ANDcgP8C4kuAFVcK/wCxw4D/AAADABVYCv8AVJSA//5T8gAVMAr//yNggP8A/iiAFTEKDv8Bfk8A/wH3IQAV//+BzID//3ytQP//g+6A/wCDUsD//9CJAP//0kLA/wB9/kD//3sHQP//ggHA//985QD/ACzgQP//0/yA/wB87cD/AIDhAP8AfjRA//96zoD/AC6aAP8ALb0A//+A3YD/AIaRwP8AgbmA/wCF0wAFDv8A+pUA/wI0aQAV/wAbw8CL/wAfWAD///WhgP8AGqvA///mZQAI//80FgD//oBTgAX//+thAP8AKOTA///yh8D/ADmHwIv/AE5rQIv/ALnDQP8AVsEA/wA5CwD/AEF4wIsI/wDcn4D//wHXgBWL/wA6SsD///vTgP8ATWjA///eBAD/AEKVwP//+goA/wALrYD///lmgP8ACsWA///43YD/AAnhAAj/ADdCAP8AZz9A///KfoD/ABx6gP//0iwA//+pxgAF///cz4D/ABrFQP//1zJA/wAM2sD//9g7wIv//6MSgIv//3zBAP//t2hAi///CxtAi///kFTA/wAa7AD//7M1wP8AJlXA///NgIAI///FpcD//5I1AP8AM8fA///lP0D/ADHegP8AXS4ABf8AJY5A///jzsD/ACnhwP//9IGA/wAkzsCL/wBDQ0CL/wBHucD/ACWEQP8AKQUA/wBTAoD/ACEagP8AQv5A/wAD9AD/AE2EAIv/ADa5AAj//59CgP8AofSAFf8AAqcA///5rsAF/wAVDwD//8uewP8AAzFA///EVECL///LQoCL///XMcD///2kgP//wG3A///mdwD//8pKwP//4yrA///DWwD//8+5gP//6E3A///WEwCL///kpYCL///iOQD/AAneAP//5dvA/wAXz8AIDv8AtTsA/wMXXwAVWQr//uQSgP//sXeAFTYKDv8BRVnA/wMXXwAVWgr//sUBQP//nZ5AFTYKDv8AcQ2A/wK0IEAVWwr//z3TQP//V7cAFTYKDv8A2X4A/wLiS4AVVwr/ALHDgP8AAAMAFVgK//6mzED//4zHgBU2Cg7/AUVZwP8DF18AFVoK//6vbgD//557QBU3Cg7/ADqvAP8CbxYAFf/9kOoA/wBGxED/AJ3twP8AfEWAB/8AJtDAi/8AJVrA/wAA9sD/ACXYQP8AEz0A/wA5nwD/AB1LAP8AHlIA/wA7rUCL/wA/K0CL/wA/A8D//+GiAP8APPlA///FI8D/AB5PwP//2O/A/wAUHgD//9lcAP8AAQgA///XzECLCP//iOgA/wBZwIAGi/8AA5lA/wAAKID/AALJQP8AArSA/wAETMD/AAIowP8AA26A/wADbAD/AAPTwIv/AAWLQIv/AAFpAP///8XA/wABZQD///+MwP8AAVMACP//+DvA//9JC0AV/wB3GAAG/wAaCECL/wAZDID///9dQP8AGWXA///zQoD/ACbYAP//7IOA/wAUK8D//9hbgIv//9dwwIv//9hEAP//7LfA///a4AD//9vnAP//7byA///n+cD///PYQP//6D6A////akD//+dvAIsI//+BI8AGDv8ANzuAFv8ARC1A/wGomIAGi/8ALDCA/wAAoQD/ADMiAP8AHHhA/wApWUD/ABdugP8AIgfA/wAifQD/AA/gAP8AILyAi/8AO3HAi/8AMZhA///NWACL//++F0CL///Q6kD//+XngP//1P0A///aTwD//+8igP//70fA///4hMD///G9AP///46A///xEYCLCP//44WA///HCsD/AB40QAb/ACCUgIv/ABsHgP///bxA/wAcPED//+5QQP8AJbBA///oZID/ABwyAP//0gzAi///y3WAi///t5ZA///JboD//8ktgP//wEMAi///53xAi///6EcA/wAIPED//+zigP8ADxhACP//3J4A///H58AFqv//67HA/wAkHwD///U2gP8AJMuAi/8AZoGAi/8AUPZA/wBSYYCL/wBspMCL/wBTFsD//8+SwP8ASAsA//+1A0D/ABc7gP8AMRsA/wAZSAD/AB54wP8AMxWAi/8AOX5Ai/8AXxdA//+unYD/AFDfAP//nDtAi///u9KAi///v6YA///ZggD//+FYQP//ul1ACP//668A///R2cD///9swP//0eRAi///0m2ACA7/APNdwP8CuwfAFV8K//8POUD//2qzgBU5Cv8BFeLA//9DAMAVOgoO/wEjscD/ArsHwBVgCv/+9+wA//8CR0AVOQr/ARXiwP//QwDAFToKDv8AjKtA/wIgjYAVYQr//16egP/+5czAFTkK/wEV4sD//0MAwBU6Cg7/AJD8AP8CLX+AFVwK///2gcD//0WXwBU5Cv8BFeLA//9DAMAVOgoO/wDiH0D/AmYFwBViCv8AscOA/wAAA0AVYwr//sa6wP//LPyAFTkK/wEV4sD//0MAwBU6Cg7/AVvLAP8CXPYAFWQK//974gD/AACrgBVlCv//gvCA//81ZAAVOQr/ARXiwP//QwDAFToKDv8AHxGA/wGbpsAV/wAjYgD//9P8gAX/ABJzwP8AGofA/wAc3YD/ABCwgP8AHBbAi/8AHzjAi/8AHTXA///rEQD/AAwawP//3hOA/wAF2MD//++eAP8AALAA///vZwCL///tnoAIi///5hxA///pkAD///8jAAX//+f1wP///xNA///cWsD///6OgP//2rsA///vLgD//8FKgP//47NA///jY0D//8htAIv//8zUQIv//7TcQP8AO33A///EIoD/AEgIAIv/AC/OAIv/ACuQAP8AGsZA/wAVe0D/ACpmQP8AG0wA///VA0D/AC9ngP//5fJA/wAy7ACL/wAsKQCL/wAp3kD/ABOdgP8AHENA/wAh5EAI///cngD/AClsgAX//+7TAP//6QTA///k4wD///K5QP//4rPAi///2PwAi///2wFA/wAXTkD//+8YAP8AJoKA///2eID/ABW0gP///x5A/wAUegCL/wAXvUAIi/8ALpoA/wDP+4D/AAihQIv/ACX4wAWL/wAtBID/AABMgP8AM5IA///lYED/ACugQP//5xxA/wAoyED//9heQP8AEYxA///cBICL///VtUCL///XSgD//+hjwP//6a+A///Za8D//+pxAP8AJjuA///Wp4D/ABfwgP//z2cAi///08KAi///1R1A///sRED//+OowP//3HdACP8AvdwA//8/jQAV///aB0AHi///3T2A/wACVwD//+W9wP//90YA///oRID///S5QP//4VUA///kdUD///A3gP//5ORAi///13wAi///3hpA/wAiOICL/wArh4CL/wAckwD/AA8rAP8AHpWA/wAgrkD/ABC/QP8AGV7A/wANAED/ABpfgP8AAKIA/wAZj0D/AAEFgAj/AFLZQP8APGkAFf8AEUKAB4v/ABhlgP8AATqA/wAalID/ABGxQP8AGoCA/wAOkED/ABXQQP8AFiEA/wAPpkD/ABipQIv/ABlgQIv/ABdBgP//76AA/wAL/ID//+QnAP8ACOMA///rWgD/AABiAP//6yyAi///62LACP//7CbABw7/AciHAP8BfXJAFf//3AaA/wA0u0D//8KcQP8AH94A//+2iMCL//95vQCL//+gqMD//5tVAIv//3blAIv//33UAP8AVZSA//+d+8D/AHZ2AP//9ZxACP//9iJA//+03sD/AB1XwIsF/wALZECL/wAOagD/AAAHwP8ACsSA///5ZoD/AAfWAP//+zLA/wADDsD///lSQIv///ocQIv///dLgP//+TJA///wToD//9keQIv//+HEQIv//9pYAP8ACg/A///glsD/ABlUwAj//+b5QP//1pOABf8AJV1A///luUD/ACrIgP//9RaA/wAma0CL/wBJZICL/wAjEgD/ACacQIv/ACO5gIv/ABNjAP//9Y9A/wAR+kD//+zvwP8ACUAA///zJsD/AAY8QP//8t/A/wAAz0D///M9wP8AAKwACP//75pA/wAA3QD/AAQRwP8AJUyABf8AN4rA/wAFQED/ADQcAP8AGMBA/wAmcQD/AClwAAj//9aTgP8AMFPABf//4RzAaP//06SA///rwAD//9I2wIsI//+m+gD//7wkQP8ASplA/wBqwkD/AGgdAP8AQunA/wBA/YD/AFPzAB//AE4AQIv/ACWDwP//yYhA/wACpgD///qkgP8AA9FA///4SAD///qQAP//9ptA/wAH6wD///oGgAgO/wDzXcD/ArsHwBVfCv//tz+A//+rqQAVPAr//3YwAP//PZdAFT0KDv8BI7HA/wK7B8AVYAr//5/yQP//QzzAFTwK//92MAD//z2XQBU9Cg7/AIXDwP8CII2AFWEK/wANjED//ybCQBU8Cv//djAA//89l0AVPQoO/wDW5wD/AmYFwBViCv8AscOA/wAAA0AVYwr//3n5QP//bfIAFTwK//92MAD//z2XQBU9Cg7/AL+WAP8CuwfAFV8K//9SicD//6ERwBVBCg7/ARsQgP8CuwfAFWAK//8QFgD//zilgBVBCg7/AHENgP8CII2AFWEK//+JxQD//xwrABVBCg7/AMrSAP8CZgXAFWIK/wCxw4D/AAADQBVjCv/+7ZDA//9jWsAVQQoO/wD+yAD/AZWegBX/ADPsQP8AUMjA///dJgD//3UrwP//dR2A//+0XUD//9T/gP//x63A//+4PwD//7y5gP8AQgBA/wB0SYD/AHWkwP8ARruA/wA3osD/AEOMAB//AFwDwP8ApLsAFf8AVZFA/wAYQgD//+69gP8ALOBA//+UN0D//+KLAAX//+E5gP8AG3UA///hPwD/ABRPAP//5kaA/wAOfEAI//+u4MD//++aQAX/ACUZgP//70pA/wAiRwD//+pnQP8AHq3A///mVAAI//+YN8D//+OjQP8AEh+A///QiQD/AH9OgP8AJBcABf8AJHnA///YWUD/AB1AgP//0aXA/wAUIID//8zxgP//4ceA/wAgsQD//9TRQP8AE1sA///RdkCLCP//kQgA//+ex4D//5TCgP//dsLA//92jwD/AGQSAP//nq8A/wBzmQAf/wBCcgCL/wA+WwD/ACDAwP8AJLpA/wA86MD/ACB1gP8ANdWA/wAGOkD/AD/cgIv/ADXdwIv/AJHNAP//y8dA/wBl8AD//8LDwP8ARXmACA7/AIJQQP8CLX+AFVwK///uvUD//bKSQBVFCg7/APNdwP8CuwfAFV8K/wCAr4D//roMQBVGCv//L7XA/wCzVIAVRwoO/wEjscD/ArsHwBVgCv8AaWJA//5RoAAVRgr//y+1wP8As1SAFUcKDv8AhcPA/wIgjYAVYQr/ANb8QP/+NSWAFUYK//8vtcD/ALNUgBVHCg7/AId9wP8CLX+AFVwK/wFxdkD//pTwgBVGCv//L7XA/wCzVIAVRwoO/wDVLUD/AmYFwBViCv8AscOA/wAAA0AVYwr/AEUjAP/+fFVAFUYK//8vtcD/ALNUgBVHCg7/AEbEAP8BW8oAFSMK//99sAD/AHcWQBX/ABjDQP//6+LA/wAUIQD//+c4wP//5zqA///r4QD//+vggP//5zsA///nOwD/ABQfgP//6+CA/wAYxQD/ABjHwP8AFBzA/wAUIUD/ABjDgB7/AAACAP/+y+kAFf8AGMhA///r3cD/ABQiQP//5zfA///nNsD//+veAP//695A///nNwD//+c2wP8AFCJA///r3kD/ABjJQP8AGMiA/wAUIcD/ABQiwP8AGMiAHg7/APvJgP8BlbLAFf8AEYqAi/8AEdPA///7+MD/ABC3gP//97lACP//ZfZA//7kkgAF///rc8D/AB5lAP//8zTA/wApEoCL/wAxr4CL/wBv/cD/AEFsgP8APpdA/wBF3wCLCP8A0EpA//9Mq4AVi/8AVspA///h3ED/AEAZAP//05fA/wAoGkAI/wAn7cD/AEjTQP//yn6A/wAcesD//9riQP//u7UABf//51dA/wAK94D//+VmQP8ABY0A///lHUCL//+LkoCL//+cLwD//5slAIv//3LYwIv//7TWAP8AHPJA///A1ED/ACzLwP//1dXACP//07bA//+ugwD/ADPHgP//5T9A/wAop4D/AEolgAX/ABwtAP//8YYA/wAfX4D///gcQP8AIKwAi/8AbC8Ai/8AYVYA/wBW/oCL/wCXdMAI//+SmMD/AH9rABX/ABZDgP//4jAA/wAOsYD//9ToQIv//8aAQIv//40CwP//visA///Fp8D//71RAIv//+pmAIv//+sDwP8ABgTA///tKoD/AAtowAgO/wDzXcD/ArsHwBVfCv/+85uA//+gNQAVTAoO/wEjscD/ArsHwBVgCv/+3E5A//83yMAVTAoO/wCFw8D/AiCNgBVhCv//SehA//8bTkAVTAoO/wDVLUD/AmYFwBViCv8AscOA/wAAA0AVYwr//rgPAP//Yn4AFUwKDv8BI7HA/wK7B8AVYAr//ssLwP//N8jAFU0KDv8APGkA/wKYgoAV//zA7oD/AElawP8A4vgAB/8AHn+A///S04D/ADMggP//5I2A/wA3fkCLCP8AXWOA/wBiTcD/AE5KgP8Ap4aA/wChO0D//6B/gP8ASAvA//+mHoAf///FXcCL///JYYD//+GtQP//4PaA///OEIAI/wD1F4AHi/8AD//A/wAHXUD/AAMugP///4oA/wANnQAI/wBu+0D//v0GABVICg7/ANUtQP8CZgXAFWIK/wCxw4D/AAADQBVjCv/+psyA//9ifgAVTQoO/wAs4ED/AVd5QBUlCg7/ATGiQP8CKsRAFSIKDv8AthZA/wHBskAVZgoO/wDzXcD/ArsHwBVfCg7/ASOxwP8CuwfAFWAKDv8AhcPA/wIgjYAVYQoO/wCHfcD/Ai1/gBVcCg7/AHtowP8CbVxAFVUKDv8AiTeA/wKGYwAVZwoO/wD+loD/Ao/hQBVCCg7/ANUtQP8CZgXAFWIK/wCxw4D/AAADQBVjCg7/ANYGQP8CuwfAFWAK/wBcV0D/ACpJgBVgCg7/AVvLAP8CXPYAFWQK//974gD/AACrgBVlCg7/AQV9QBb///THwP//qpBA/wAdV8CLBf8AC2RAi/8ADmoA/wAAB8D/AArEgP//+WaA/wAH1gD///sywP8AAw7A///5UkCL///6HECL///3S4D///kyQP//8E6A///ZHkCL///hxECL///aWAD/AAoPwP//4JbA/wAZVMAI///m+UD//9aTgAX/ACVdQP//5blA/wAqyID///UWgP8AJmtAi/8ASWSAi/8AIxIA/wAmnECL/wAjuYCL/wATYwD///WPQP8AEfpA///s78D/AAlAAP//8ybA/wAGPED///LfwP8AAM9A///zPcD/AACsAAj//++aQP8AAN0A/wAFLYD/AC93AAUO/wFjjkAW///MMAD//9VBgP//5HYA///YGgCL///fyECL///epQD/ABqWQP//5CmA/wAz0QCL/wAY2oCL/wAYqkD/AAZPgP8AE5uA/wAQ/gAI/wAtvUAH///5pID///q5wP//9exA///5HgD///BhQP//+k/A///1fQD///wsAP//+KGA///+jED///nLgIv//+3KwIv///TzwP8ADRTAi/8AD1wAi/8ADsoA/wAJzsD/AAvbgP8ABwdA/wAH9gD/AAh+AP8ACZ4A/wAYuMD/ABtGQP8AIZ7A/wAeMsAIDv8BeSHA/wKSeEAVUAoO/wBqJkD/AcljwBVBCg7/AJD8AP8A/NwAFVQKDv8BVpyA/wD83AAVVgoO/wBx6oD/Aji3gBVbCg7/AYYTgP8Cd7eAFf//44WA/wAhqAD//5CsQP//u9KA//+YcID/AEbEgP//3zTA///aBwD/AHtowP//nnsA/wAVk0CLBQ7/AM8ewP8CoEcAFVkKDv8BRVnA/wKgRwAVWgoO/wB7aMD/Am1cQBVVCv8AUvJA//51AgAVRgr//y+1wP8As1SAFUcKDv8ARBdA/wHr0wAV/wA4gkD//8d9gAX//+24wP//5odA///1NoD//+DVgIv//95wAIv//96zwP8ACp4A///hD8D/ABIEgP//5qPACP//x+wA///H7AD/ACOOAP//3HHA/wA308D/ADfTgAX/ABmwwP//7TGA/wAfnoD///TfAP8AIheAi/8AIZAAi/8AHyqA/wAKyYD/ABl4wP8AEkdACP8ANvUA///JC0D/ACOOAP8AI45A///JIMD/ADbfQAX/ABKKwP8AGZVA/wAK9UD/AB9kgIv/ACHTwIv/ACIXgP//9N7A/wAfnkD//+0xgP8AGbDACP8AN08A/wA3T0D//9xyAP8AI44A///IcID//8hwgAX//+ajgP8AEgSA///hEAD/AAqeQP//3rPAi///3ixAi///4JuA///1CoD//+ZrAP//7XVACP//x5LA/wA4bQAF/wCTOoD//64kwBX/ADc6AP8ALS7A///S0QD//8jGgP//yMYA///S0UD//9LRgP//yMYA///IxoD//9LRAP8ALS6A/wA3OgD/ADc5gP8ALS8A/wAtLwD/ADc5gB8O/wDYnQD/AoxtgBX//pq4AP8AQ1BA/wFlSAAH//zcjAAE/wFa7UD//7yvwP/+pRLABw7/AEvxwP//75pAFWgK/wAGjwD//lkLQBVpCv//0x/A//+x/EAVagr//3FuwP8Cd/mAFWsKDv8AS/HA///vmkAVaAr//4GSAP/+D4pAFf8AJUgA///nJYAF/wAD94D/AAeHQP///28A/wADkgD/AARQgP8ABXVA/wAOEYD/ABHMQP8AGhzA/wAP/MD/AB65wIv/ACY/gIv/ABX7AP//6IlAi///5p4Ai///5++A///t94D//+ywQP//6MmA///tH0D//+gKgP//7ITA///FPMD//9j9wP//026A///CXUAI///cygD/AN+wgP8AMmZAB///+s7A/wABuQD///wUQP///B4A///+VkD///6QwP///MGA///9M8D///5WgP///31A///8WgCLCP//blNABv8ALLLA/wAx80D/ACw8wP8AFMIA/wAfxkD/AB1IwP8AC11A/wAKeUD/ABoHQP8AGgbAi/8AJeAAi/8AMHkA///UvID/ACkXQP//wFFAi///z3yAi///0xaA///nSID//+f9wP//1j1ACP//irgA/wH9Z8AVawoO/wBRH0D//++aQBVoCv/+9TFA/wATPoAV///XusCL///ZJAD//+37wP//5R9A///gO0AI/wAc/wD//+JQAAX/ABM2QP8AGAKA/wAcUoD/AA1MQP8AGw7Aiwj/ACP7wP8AF7yA///onoD//+gQQP//7aHA///xvgD//+k3AP//y5ZAH///+rQAi///+rVA/wAAQoD///q6wP8AAIEACP//1/UAB/8AB7hA/wAA8cD/AAfmwP8AAIGA/wAISoCLCP8APTtA/wAJEID//+J3gP//8UjA///jhwD//+CKwP//6K2A///YxwAf///aIQCL///n28D/ABXvAP//+8lA/wAEHQD///iMgP8AB0WA/wADWUD/AAeHwP//+PNA/wAHfQAI///auAD//9aTgAX/ABy4AP//3y+A/wApfkD//+0HQP8AK6MAi/8AP8zAi/8AORaA/wAoAoCL/wA0SACL/wAhqMD//+cvwP8AHO7A///eIQD/AAX8gP8AGofA/wAIcoD/ABJ9QP8AGMwAi/8AHUWAi/8ALgxA///S5kD/ACfzAP//xGSAiwj/AQwwQP/+RczAFWkK///TH8D//7H8QBVqCg7/AUY2wP8A7HZAFScK//8ge4D//iVZgBX/AEUKQIv/ADxpAP8AtvTA/wDFoICL/wBFCkD//0noQP8ABueAiwX//8wvwP//1UGA///kdgD//9gaAIv//9/IQIv//96lAP8AGpZA///kKYD/ADPRAIv/ABjawIv/ABiqAP8ABk+A/wATm4D/ABD+AAj/AC29QAf///mkgP//+rnA///17ED///keAP//8GGA///6T8D///V8wP///CwA///4oYD///6MQP//+cuAi///7crAi///9PQA/wANFMCL/wAPXACL/wAOygD/AAnOgP8AC9uA/wAHB0D/AAf2AP8ACH4A/wAJngD/ABi4wP8AG0ZA/wAhnsD/AB4ywAj///8jQIv//w85AP8Cek4A///4O8CLBQ7/AElbAP8CbxYAFYv//sG0wP//yn5A///ulkCL///CukD/ADWBwP8AESgAi///C9/A/wF00MCLi/8APGkA//7TrQCLi/8AzvYA/wC/lgD/AD1uwIv/AD/cgAX///bKgP//+9iA///4JED///2IgP//9y2A///9IMAI//9aTcD//8oTQIv/AQULgAWL/wAP6AD/AAjaAP8AAg+Ai/8ADLuAi/8AAP3A////7UD/AAD9AP///9oA/wAA+oAIDv8BprrA/wIxhUAV/wAo8ID//+TkAP8AGWeA///ji4D//+WsAP//7EeA///qisD//+fWgB6L///qfUD/AA89gP//9s1A/wAHEUD///tMgP8ABvNA///7YID/AAvKQP//+KJAi///74fAi///8sMA///4D4D///JTwP///BfA///5lQD///gvwP//8ylA///yjwD//+yIgP//7QbA///ujQAI/wAbnYD//+fWAAX/ADe4QP8AOJLA/wAdTkD/ADQrQIv/ACmmwAj//pu4wP8APZDAFS4KDv8BNBdA/wMXXwAVWgr/AFcpwP//U2aAFTQKDv8BsvPA/wIk3kAV///VzQD/ADIjgP//wVDA/wAbicD//7wTwIv//493gIv//7K1AP//tY8Ai///qsiAi///26tA/wAOQoD//9EoQP8AM/PA///Zo8D/ADm3QP//1WKA/wBZ8ID//+pwQP8ALxeA///ifED/ACjeAP//5mKA/wALaUD//990QIv//+QigIv//8nJQP//0mXA///FLcD//6WKAIsI//+7mcCL///LUoD/ACFzwP//5CPA/wAjSMD///zfAP8AA/ZA/wAAQkD/AAKHQP8AAA6A/wAEIED/AAAFwP8AAaaA/wAAOID/AAWAwP//+zgA/wACbUAI///Wk4D//7hfAAX/ACzjwP//zx1A/wA+VcD//+VGwP8ARULA///73EAI///2EsD//7RowP8AHVeAiwX/AAtkgIv/AA5pwP8AAAfA/wAKxMD///lmgP8AB9YA///7MsD/AAMOgP//+VJAi///+hxAi///90uA///5MkD///BOgP//2R6Ai///4cQAi///2lhA/wAKD8D//+CWwP8AGVTACP//5vkA///Wk4AF/wAlXUD//+W5QP8AKsjA///1FoD/ACZrAIv/AElkwIv/ACMSAP8AJpxAi/8AI7mAi/8AE2MA///1j0D/ABH6QP//7O/A/wAJQAD///MmgP8ABjxA///y4AD/AADPQP//8z2A/wAArAAI///vmoD/AADdAP8ABCQA/wAl9IAF/wCFdAD/AAo6AP8AMgOA/wBe0oCL/wBKGUCL/wAgm4D///aYQP8AK4RA///Y/wD/ACS6gP//ycyA/wAzCgD//6g2QP8AEbJA///G/ID/ACFYgP//y9rA/wAefwD///R6gP8AJPZAi/8AGXjAi/8AL8WA/wApMwD/ACuQgP8AR1TAi/8AOgvAi/8ALKBA///leQD/ABgigP//3NAACP8AAqXA///8JAD///9/QP///epA/wAAIgD///xSwP8AADMA///6dcD/AALhgP///gZA/wACL8D///9WAAgO/wGM+wD/AvMgABVPCv//FUOA///gEcAVNQoO/wE0F0D/AxdfABVaCv/+4ljA//+dnkAVOAoO/wD+loD/Aw69wBVCCv//P4xA//9gWEAVOAoO/wE0F0D/AxdfABVaCv/+3E5A//+dnkAVMgr//47ygP//vmmAFTMKDv8Af7lA/wMQd4AVZwr//47ygP/87quAFSYK/wBbekD//nIoQBUnCg7/ATQXQP8DF18AFVoK//7mqYD//52eQBUuCg7/ATQXQP8DF18AFVoK//+5xID//6LLwBUoCg7/AZ1ggP8C8yAAFU8K///7WwD//+RiQBUoCg7/ADqvAP8Cb/MAFf/9kA0A/wE3iwAH///MMAD//9VBgP//5HYA///YGgCL///fyECL///epQD/ABqWQP//5CmA/wAz0QCL/wAY2oCL/wAYqkD/AAZPgP8AE5uA/wAQ/gAI/wAtvUAH///5pID///q5wP//9exA///5HgD///BhQP//+k/A///1fQD///wsAP//+KGA///+jED///nLgIv//+3KwIv///TzwP8ADRTAi/8AD1wAi/8ADsoA/wAJzsD/AAvbgP8ABwdA/wAH9gD/AAh+AP8ACZ4A/wAYuMD/ABtGQP8AIZ7A/wAeMsAI/wABugD/AD4iwP/+xrsA/wDnSMD/AQSgQP8AP9zA//77X8D/AMyIAP8BO9vA/wA+IsAGDv8BjPsA/wLzIAAVTwr//zDhAP//4BHAFSsKDv8BcxcA/wLzIAAVTwr//0WXgP//3zTAFSkK//+wmsD//8R0ABUqCg7/AE6IgP8CbxYAFV0K//+060D//r4aABVeCg7/ATQXQP8DF18AFVoK//7WQ8D//S6IQBUvCg7/AYz7AP8C8yAAFU8K//8oP8D//XAewBUvCg7/AZrJwP8DKluAFWwK//8fnsD/AEC5wBVtCv8Av5fA//5MnsAVMAr//yNggP8A/iiAFTEKDv8BjPsA/wLzIAAVTwr//y5KQP//3zTAFTIK//+O8oD//75pgBUzCg7/AVhXQP8CwsuAFWQK//974gD/AACrgBVlCv//XdSA//+rnwAVNgoO/wGaycD/AypbgBVsCv//H57A/wBAucAVbQr//xpxAP//hXRAFTYKDv8AHxGA/wJv8wAV///BAED/ALDqQP/9zi/A/wAPa8AH///05MD//6ttQP8AHVeAiwX/AAtkgIv/AA5pwP8AAAfA/wAKxMD///lmgP8AB9YA///7MsD/AAMOgP//+VJAi///+hxAi///90uA///5MkD///BOgP//2R6Ai///4cQAi///2lhA/wAKD8D//+CWwP8AGVTACP//5vkA///Wk4AF/wAlXUD//+W5QP8AKsjA///1FoD/ACZrAIv/AElkwIv/ACMSAP8AJpxAi/8AI7mAi/8AE2MA///1j0D/ABH6QP//7O/A/wAJQAD///MmgP8ABjxA///y4AD/AADPQP//8z2A/wAArAAI///vmoD/AADdAP8ABRVA/wAumgD/AAwtQIuL/wIx0ED/ALfRwIuL/wA+/8AFDv8BcIBA/wDWBkAVOgr//vqDAP8AvP9AFf8AI2IA///SQsAF/wAlawD/ACcsgP8AM27A/wALxQD/ACo2gIv/ADZDAIv/ABrTgP//6TQA/wAM5UD//+rTQP8ADziA///nAQD///+lgP//4ptAi///58oACP//75pA///xVEAH//+8tMCL//+398D/AAC0gP//xeBA///qo8D//7fxAP//5YSA///fTUD//8qawIv//81bgIv//7z6QP8AOkBA///BuMD/AF9zAIv/ADgdQIv/ADoUgP8AFGzA/wAx2MD/ACjZgAj//83yQP8AANzAB///zDAA///VQYD//+R2AP//2BoAi///38hAi///3qUA/wAalkD//+QpgP8AM9EAi/8AGNqAi/8AGKpA/wAGT4D/ABObgP8AEP4ACP8ALb1AB///+aSA///6ucD///XsQP//+R4A///wYUD///pPwP//9X0A///8LAD///ihgP///oxA///5y4CL///tysCL///088D/AA0UwIv/AA9cAIv/AA7KAP8ACc7A/wAL24D/AAcHQP8AB/YA/wAIfgD/AAmeAP8AGLjA/wAbRkD/ACGewP8AHjLACP8AAN0A/wEbEIAGi/8AJXIA///+p8D/ACNewP//6unA/wAjJID//+IEwP8AMfeA///GBwD/ABnxAP//uRdAi///wl7Ai///xUTA///sLMD//9VRwP//0+qACA7/AJHYwP8ChmMAFWcK///IxMD//wyigBU5Cv8BFeLA//9DAMAVOgoO/wHIhwD/AX1yQBU7Cv//44WA/wFQkgAVUAoO/wE09ED/AYYTgBX//+hQQP8AMD8A///OxAD/AB58AP//yWRAiwj//6NgQP//pzLA//+qCsD//2kwwP//cy/A/wBL0oD//5poAP8AYFdAH/8AN80Ai/8AMaPA/wAj0AD/ABvmQP8AL+lACP//2E1AB4v///UlQP8AAKeA///0SQD/AAOpQP//9OmACP8AR6EABv///F0A/wAN/YD///9SQP8ADntAi/8ADdDACP8CbxYA//+70sAH//+ECMD//wCwgBX/ACSsAIv/AC5OAP//5pDA/wAT54D//9Y3AP8ADgnA///ihwD/AAFGgP//37cAi///wv/Ai///1sXA///9TsD//91bwP//7D2A///ftQD//+1SgP//4XkA///dYUD//+QCQP//2HwAiwj//7YKAP//0+NA/wBeL0D/AFz/wP8AYmPA/wAyScD/AEcWAP8AQNtAH/8BRAqA/wDCm8AV/wAo8ED//+TkAP8AGWfA///ji8D//+WrwP//7EeA///qisD//+fWgB6L///qfQD/AA89gP//9s1A/wAHEUD///tMwP8ABvNA///7YID/AAvKQP//+KJAi///74fAi///8sLA///4D4D///JTwP///BgA///5lQD///gvgP//8ymA///yjwD//+yIgP//7QbA///ujQAI/wAbncD//+fWAAX/ADe4AP8AOJLA/wAdTkD/ADQrQIv/ACmmwAgO/wECxQD/AdP8wBX//5MFwP//mupA//+x3gD//1uqwP//ad/A/wBcpsD//6o+QP8Ad/tAH/8AFw+Ai/8AFvzA/wADOAD/ABZHQP8ABkeA///bMMD//90YQP//7WzA///cwQCL///idACL///XAQD/ACDhgP//3pTA/wAx44CL/wAXoMCL/wAXZcD/AAeawP8AEstA/wAKTkAI/wAA3QD/ADExAAX//+MxgP//7Z9A///u/gD///9jAP//+sDAi///6VnAi///751A/wAQZ4CL/wAWmkCL/wAdNoD/ABwFwP8AIC3A/wAidUD/ACrdgAj/ACNiAP8ALANA///YTUD/ACbVwAX//+I5QP//3qbA///U7gD//+3zAP//0pNAi///wuGAi///p4OA/wAhsgD///qQQP8AiMxACP8BRDsABv8AArdA/wAetMD///6zgP8AHRSA///7iUD/ABrAwP//63sA/wB6+UD//6rLwP8AKCLA//+00kCLCP//dg7A//89lYAVPQoO/wHagoD/AlyrwBX/ACjwQP//5OQA/wAZZ8D//+OLgP//5avA///sR8D//+qKwP//59aAHov//+p9AP8ADz1A///2zUD/AAcRgP//+0zA/wAG80D///tggP8AC8pA///4okCL///vh8CL///ywsD///gPgP//8lPA///8F8D///mVAP//+C/A///zKYD///KPAP//7IiA///tBsD//+6NAAj/ABudgP//59YABf8AN7hA/wA4ksD/AB1OQP8ANCtAi/8AKabACP/+aM4A/wA71sAVRAoO/wBUkwD/ApiCgBVECv8AFZNA/wCqAwAVWgoO/wEjscD/ArsHwBVgCv/+4XvA//1vQcAVRQoO/wF5IcD/ApJ4QBVQCv//Ol9A//36MwAVRQoO/wDWBkD/ArsHwBVgCv8AXFdA/wAqSYAVYAr/ABu2wP/+UaAAFUYK//8vtcD/ALNUgBVHCg7/AXkhwP8CknhAFVAK//9ZcMD//8K6ABVJCg7/ASOxwP8CuwfAFWAK/wBNq4D//vtfwBVKCg7/ASOxwP8CuwfAFWAK/wBl1YD//uy0ABU7Cg7/AbBdAP8BjB4AFf//1cjA/wAuhUD//8NYgP8AGRyA//+8bICL//+V5UCL//+6fED//8S1gIv//7vDgIv//7A7AP8AVoFA///i70D/ABjMAP//9wlA/wAmo4D///IIgP8AMnIA///z3UD/ACGzgP//8DoA/wAlsMD//+5bgP8AB+VA///n8QCL///vfYCL///VNID//8vPAP//4oNA//++u8CLCP//sbCAi///zdcA/wAvMID///GLgP8AEG5A///8mAD/AAPfwP8AAHHA/wAC0ID/AAAvQP8AA//A/wAAEAD/AAFfgP8AAG/A/wAFukD///sSwP8AAk2ACP//1pOA//+4XwAF/wAxoYD//9HZwP8AP4CA///pLoD/AEAygP///NsACP//9heA//+0ikD/AB1XgIsF/wALZECL/wAOagD/AAAHwP8ACsTA///5ZoD/AAfWAP//+zLA/wADDoD///lSQIv///ocQIv///dLgP//+TJA///wToD//9kegIv//+HEAIv//9pYQP8ACg/A///glsD/ABlUwAj//+b5AP//1pOABf8AJV1A///luUD/ACrIwP//9RaA/wAmawCL/wBJZMCL/wAjEgD/ACacQIv/ACO5gIv/ABNjAP//9Y9A/wAR+kD//+zvwP8ACUAA///zJoD/AAY8QP//8uAA/wAAz0D///M9gP8AAKwACP//75qA/wAA3QD/AAQwgP8AJmaABf8Aap3A/wAKGgD/ADd+QP8AQ6JAi/8AP51Ai/8AH58Afv8AKVWA///J8UD/AB5YQP//zF/A/wAc+oD//7ZuQP8AClEA///VTID/ABSiwP//2q5A/wASCUD///gPAP8AFifAi/8AD1mAi/8AJMOA/wAsmwD/ABmfAP8AM6cAi/8AQSCAi/8ALE3A///XtQD/ABFjgP//6Y9ACP8AAtEA///8XUD///9YAP///ZnA////+gD///x8wP////YA///6BID/AAN7AP///lxA/wABxAD///+UgAgO/wC8IkD/AkMSwBX///dewP//hXRA//+TQwCL////I0D//8VQwP8AawMAiwX///mfwP//scbA///84gD//7I+gIv//7JqgIv//9cDwP8AAF7A///SF0D/ABqWwP//2omA/wASWUD//+YlwP8AHGtA///vCUD/ACSeQP//+2oACP//9cOA//+yC0D/AB1XgIsF/wALZECL/wAOagD/AAAHwP8ACsTA///5ZoD/AAfWAP//+zLA/wADDoD///lSQIv///ocQIv///dLgP//+TJA///wToD//9keQIv//+HEQIv//9pYAP8ACg/A///glsD/ABlUwAj//+b5QP//1pOABf8AJV1A///luUD/ACrIgP//9RaA/wAma0CL/wBJZICL/wAjEgD/ACacQIv/ACO5gIv/ABNjAP//9Y9A/wAR+kD//+zvwP8ACUAA///zJsD/AAY8QP//8uAA/wAAz0D///M9gP8AAKwACP//75pA/wAA3QD/AARdwP8AKAPABf8ALj8A/wAFLUD/ACvfQP8AFDsA/wAhPYD/ABhUgAj//+mPwP8AOPVABf//2TvA///jLMD//9ySgP//8x6A///j3QCL///d5gCL///cjMD/ABLewP//+K/A/wA23QD///92wP8ABAUA///9mcD/ABGUAIv/AEI4gIv/ADu3QP8AAuVA/wA7pID/AAXGAP8AO2TACP8AlimA/wA7jAD//2qzgAaLi/8ABuVA/wBSSYD/AASzgP8AGVRA/wAB/MD/AAqzwP8ABzAA/wAGK4D///x9AP8ACiPACA7/AVvLAP8CXPYAFWQK//974gD/AACrgBVlCv//Z1LA//9q5YAVTAoO/wDWBkD/ArsHwBVgCv8AXFdA/wAqSYAVYAr//o6iwP//N8jAFUwKDv8ARsQA/wHJY8AVTgr//1REAP8Axn2AFUIKDv8AVJMA/wKYgoAV///GLgD/AIFzQP/++jlAB///sXeA///kq8CL//++aYD/AE6IgP8AGozAi///I0aA//94gkCLi///xi3A/wFWnECLi/8AOdJA//95X0CLi/8A9TvA/wBbeoD/AB7tQIv/AElawAX///aBwP//+RiA///5GID///uvgP//9aUA///8jEAI//+/RkD//+l5wIv/ASZegAUO/wF5IcD/ApJ4QBVQCv//+NXA///OLgAVPAr//3YwAP//PZdAFT0KDvs0Dv8AQnOA/wHIhwAV//42nAD/AEh+AP8ArXaAB/8APGjA/wA4GID/ALpogP//Fv1ABYv/ACZRgP8AA3nA/wAv5IAe/wACVICL/wACVQD////+AP8AAlTA/////AAI//8fnsD/ARGSQP8AwHMA/wC1OwD//+YcAIsF///ufECL///tugD/AADRgP//7khA/wAEXAAI//8bTkD//yuzwIv/ALfRgAWL/wADrAD/AAAvgP8AAuBA/wADHsD/AARAgP8AAm0A/wADToD/AAPuQP8AA70Ai/8ABfkAi/8AALIA////8YD/AACxQP///+MA/wAAr4AIDv8Aff+A/wHJY8AVQwoO/wBELUAW/wBJWwD/AQc3AAaL/wAexID/AAOzAP8AFlmA/wATAQD/ABlSwP8AEWsA/wAXNcD/ACvnAP8AKGIA/wAwT0CL/wAW7YCL/wAWmcD///auAP8AEGjA///sZID/ABi5wP//4nQA/wAANMD//9jLAIv//9+7AAj//xmUQAeL///chYD////8AP//1koA///qMYD//94aAP//7UMA///i3wD//+N2AP//8nJA///kdECL///gyoCL///peID/ABFugP///ZHA/wADbwD///1QgP8AA8tA/wAA8kD/AAepQP//+SwA/wABfkAI///dewD//7yvwAX/ABv2gP//6loA/wAiV0D///RDgP8AI1BAi/8APvzAi/8APKKA/wAlQkD/ABu5wP8ARDBA/wARTgD/ACqPQP8AAGXA/wAqX4CL/wApfoAI/wDc7cAHi/8AI6vA////xAD/ACWyAP//78BA/wAkuYD//+lBQP8AM2bA///RK8D/AB07gP//y/DAi///wgFAi///x7DA///XcED//950QP//zRTACP8AUEKA//+2pQAHDv8BMaJA/wATtQAVIgoO/wEdpcD/AcGyQBVmCv//MOFAFmYKDv8AyhMA/wIqxEAVIgr/AM8egBYiCg7/AZkxgP8AE7UAFSIK//8w4YAWIgoO/wHWVgD/AC4qQBUkCv/+ps0AFiQK/wCsmYAWJAoO/wA6rwD/AZPiQBX/ACsmgP//3J4A/wB0gUD/AJB3gIv//d1gAP8AQnOAi4v/AiIfgP8AaiZA//9wCQD/ADINwP8AIahA//9SiYD/AO4wAP//6mzAiwUO/wG4/kD/AMrOQBX//9TZgP8AI2IA//+LfsD//2+IgIv/AiKgAP//vYyAi4v//d3ggP//ldnA/wCP9wD//83yQP//3lfA/wCtdoD//xHQAP8AFZNAiwUO/wAwVAD/AEXnQBX//3iCQP8Bk+JA/wCHfcD//8+sAP//pWKA//7LC8D/AFqdgAcO/wBAuYD/AciHABX//8YtwP8APv/A//6mzMD//79GgP//yaGA/wDoJcD/ADZegP//oDTA/wCw6kAHi/8AGKwA/wAAYAD/AB7kgP8AI72A/wAynoD/ACQbgP8AMyOA/wAokwD/ABGowP8AIh4Ai/8AI+GAi/8AGLYA///s8kD/AAv6gP//8CMA/wAFp4D///iDgP8AAy4A///4j4D/AAdIAP//+RfACP8AIahA/wBFCkAF///fnUD/ACBXAP//1PjA/wARR4D//9VswIv//743AIv//8bUwP//1pIA///jr8D//8aegAj/AAKXAP8AWAbABQ7/AJHYwP8ChmMAFWcK///sHID//rP4wBU+Cv8AaP1A/wCdUAAVPwr//7peAP/+QL/AFUAKDv8BmsnA/wMqW4AVbAr//x+ewP8AQLnAFW0KDv8BLgzA/wKBNYAV//83yMD//v+wgIv//9ydwP8AthfAi4v//557QP8AOPVAi4v/AGCoAP8APv/Ai4v/AC93AP//wQBAi4v/APUXgAX//8fnwP//nntAFf//bG1A//+KocAHDv8AS/HA///vmkAVaAoO/wAy6sAW/wBJWwD/AZyDgAaL/wAhKUD/AAOTAP8AGGfA/wATSoD/ABuHQP8AFj2A/wAfvAD/ADJuwP8AKgKA/wA2FgCL/wAlk0CL/wAhWwD//+u2QP8AEcVA///cjYD/AA90wP//4StA////8MD//95WAIv//+LigAj//wQBAAeL///oYUD////ogP//5RCA///084D//+iFwP//8qDA///jlYD//+aTQP//8InA///jx4CL///odUCL///tjQD/AArLQP///fRA/wABfgD///vRgP8AAw0A////N0D/AAUmQP//+kJA/wADW8AI///cngD//8HdAAX/ABrQwP//8AYA/wAeU4D///eewP8AHp3Ai/8AOcHAi/8AM+fA/wAdtsD/ABi9AP8ANJqA/wAQRUD/ACKYwP8AAJ9A/wAiMsCL/wAioEAI/wD4i0CLB4v/ACdpwP///3cA/wAn4YD//+3CQP8AJ9JA///lSMD/ADpRQP//yI6A/wAhJoD//8J3AIv//751AIv//8L2wGb//9yQAP//yKXACP8AUR9A//+2pQAHDv8A6Y+A/wGZ9cAV/wAoDkCL/wA7BUD//+q4gP8AEhQA//+8LAD/AAWqAP//6sDA/wACBED//+aAQIv//80AgIv//92OAP///eNA///mZUD///iXwP//6O6A///uZ8D//8k0AP//0LdA///gJgD//9BaQIsI///MRsD//7MjwP8AKC0A/wCWesD/AIIPwP8ASTsA/wAj5sD/ADSQgB//AMYTQP8AhbsAFf8AK+CA/wA1gYD//9QLwAb////xAP8AJ7LABf////4A/wAFNkD/AABzwP8AAsxA/wADkED/AAWCQP8AAg/A/wADMAD/AAPLQP8ABPfA////oUD/AAbOAAj//7MxQP//u9LA//+0DoD//8p+gP8AS/GA//9mYsAG///qCcD/AC71AP//zx1A/wAfpwD//8DfQIsI//+o6wD//5bXwP//wiPA//9RZcD//1dagP8AXVqA//+2SkD/AFhPgB//ADpsAIv/ADX8gP8AIDYA/wAcsQD/ADNHQAj//9hNQAeL///1JUD/AACnQP//9EkA/wADqUD///TpgAj/AEehAAb///xlwP8ADf1A////TsD/AA54AP////sA/wAN1EAIDv8AkdjA/wMWggAVZwr/AINlwP//XqNAFSwKDv8A7VQA/wMXXwAVQgr//2qywP//V7cAFS0KDv8BI7HA/wK7B8AVYAr//wCNQP//N8jAFUkKDv8B4yPA/wJ/MMAV/wAo8ID//+TkAP8AGWeA///ji4D//+WrwP//7EfA///qiwD//+fWQB6L///qfUD/AA89QP//9s1A/wAHEYD///tMgP8ABvNA///7YMD/AAvKQP//+KIAi///74gAi///8sLA///4D4D///JTwP///BfA///5lQD///gvwP//8ymA///yjwD//+yIQP//7QbA///ujQAI/wAbnYD//+fWAAX/ADe4QP8AOJLA/wAdTkD/ADQrQIv/ACmmwAj//r8awP//w+IAFUsKDv8BI7HA/wK7B8AVYAr//uQSgP//OKWAFU4KDv8BVOLA/wEocAAV/wAtxED//9oZwP8AJYRA///Q3sD//9DdAP//2iBA///aeAD//9JBwP//0jOA/wAl5wD//9p8QP8ALxkA/wAvKAD/ACXiQP8AJYsA/wAtwwAeDv8B39QA/wJsf0AV///kUED/ACFQQGL/ABNUQP//1SZAi///y2fAi///zPiA///i3oD//+SAAP//yO9A///tNED//9pdgP///MMA///ZEID///0qQP//2kcACP//+SCA//+khYD//4LVgIuL///HCsD/AHjigIv//+l/QP/+1IoABf///bmA///huID///zigP//2nqA///vLgD//+EpwP//8UzA///lDMD//+vlwP//9v2A///vlwCL///uSACL///zMsD/AAopgP//+njA/wAJAkD///1yQP8ABClA///+G0D/AAWXQP//+faA/wAC+kAI///XcID//8AjgAX/ABTJQP//6YDA/wAdecD///McwP8AHx8Ai/8AKSYAi/8ALEGA/wAWkID/ABypAP8AMNuA/wAXdMD/ACf8QP8ABVvA/wArdID/AAOSAP8ALH4ACP8AGDwA/wEuDMD/AH+nQIuL/wA49UD//4TqwIv/AAaUAP8AUfxABf8AAobA/wAffgD/AAEvwP8AJj5A/wAOIQD/AB80AP8AEF2A/wAkJAD/ABykwP8ADjaA/wAZMECL/wAhCwCL/wAYiYD//+kQAP8ACUUA///saoD/AAKBgP//+rTA////UED///0AgP8AAMkA///8GwD/AAEngP//+kdA/wAD7kD///4JwP8AAx5A/////QAIDv8A2J0A/wKMbYAV//88GYD//1iUAP//xHQA/wCnbAD//dv+gP8AQ1BA/wIkAYD/AKWyQP8AO4wA//9aTcD/AMPmgAcO/wDYnQD/AoxtgBX//zwZgP//WJQA///EdAD/AKdsAP/+69cA//9YlAD//8R0AP8Ap2wA//8rs4D/AENQQP8A1EyA/wClskD/ADuMAP//Wk3A/wEUKQAH/wClskD/ADuMAP//Wk3A/wDD5oAGDv8A7qoA/wJ6lwAV//8jJID//9gGgP8AVfHA//7tLYD/ACz4wP8BEtKA/wBZ8QAG/wA/9YD/ACf5gBX//90FwP/+xTQA/wAp+QD/ANbcgAb/ADb3AP//lRHA/wAP/YCK/wAdewD/ADV3QP8AHnrA/wA2dwCL//8pI4D/ACn5AIuL/wE6zAD//98FgIv//9qGQP//t4wA///ahkD//7eMAAUO///0w4D/AD/dAP8CAYFA/wA9RcAB/wA+18D/AEKUAP8A84DA/wBAo4AD/wG1kAD/ATTHwBX/AMQ2wP//rPjA/wB6aQD//5eygP//kqaA//+x9gD//3y2AP//NouA//87P4D/AFatAP//ktsA/wBinUD/AGzMAP8AUKIA/wCCD8D/AL30gB7//0QFgP8BAVoAFf8AGRpAi/8AJg8A///zksD/ABqVAP//wNpA/wATlcD//9F4QP8ADgMA//+uEQCL//+9fUCL///NUgD///exwP//sAaA///jzkD//8tuQP//5Y6A///OskD//92IgP//9ZJA///pJ0CL///ltACL///YfsD/AA2swP//5GoA/wBCUwD//+88QP8AKE3A///y6AD/AEKpQIv/AD/tgAiL/wBYpID/AA9PwP8AP7hA/wAUd4D/ACzQgP8AGU7A/wA3aoD/ACVPQP8ACgVA/wAVxICLCA74iBTvFX+X+F2V9zCSro8G+0CQB4sMCsoKyI0MDM0Ly40MDRwAJxMATgIAAQCWAM8BjAGdAe8CAAI4AkoDaQPeBFQEjQXOBgcGWwbTB2cH+gh6CPAK3AsBDEAMggzhDgsOkQ91EDkQbxDBEq4TiRO4FAoU5BUTFfMWRRaXFyoX8xnbGx8cSB3GHiEeWx6VHucfOR9KH4QflR/TICUgdyCXILcg8SGxIjoixCLkIwQjPiOQI+IkNCSGJUMlxCXkJiYmMiZ8JpwmvP8ALUAA///mn8D/ABBzAP//7FtA///st8D//+iZAP//8JoA///YfYAei///6lkA/wAGQ8D//+wCAIv//+pKAIv//+xgAP//+6OA///tIYD///qbQP//7ywACP//6mzA//+8r4D/ADc7gP//8jFA/wAYKgD/AEJzQAX/ABjeQP8ARGOA/wAIgUD/AB/lwIv/ABpFwAgL//9VIAD//08VwP//wrpA/wCw6kD//0S6gP8APv/A/wC7RYD/AKrfwP8APUXA//9VIED/AKrgAAcL/wAzLID//94dAP8AH8GA///cboD//98WwP//51mA///lLYD//+HMAB6L///lHID/ABMMwP//9ICA/wAI1cD///ofwP8ACLAA///6OMD/AA68wP//9srAi///62nAi///73OA///2E4D//+7owP//+x3A///3+kD///Y7gP//7/PA///vMsD//+eqgP//6EiA///qMEAI/wAihQD//+HLgAX/AEWmQP8ARreA/wAkocD/AEE2AIv/ADQQgAgL//+9jID/AWffAP8AQnOABwv/AB94wP//5bnA/wAZ7MD//98gAP//3yNA///lvQD//+YTgP//4IpA///gegD/ABpKAP//5hZA/wAg0UD/ACDjgP8AGkdA/wAZ8AD/AB98gB4L///CukD/AZrJwP8APUXABwv/AEUKQIv/ADxpAP8AtvTA/wDFoICL/wBFCkD//0noQP8ASH4Ai///DzkA/wJ6TgD///g7wIsFC///V7cAi/8AUEKA/wDtU0AFC///nxfA//9z4gD//7kYQP//BpDA//8PQwD/AIXygP//snUA/wBmo0Af/wBKT4CL/wBFc8D/ACbRgP8AJxlA/wA/4UAI///MOID/ACGoQAX//+NDgP//0G+A///OegD//+OdgP//zxoAiwj//6RRAP//r16A/wBfqMD/AKhlwP8ApYhA/wBOYsD/AFytQP8AWBVAH/8AMMXAi/8ALXYA///jHcD/ABkmAP//1JCA/wAB/ED///ySgP8AAXWA///9asCL///7WcCL///9hQD///+TgP///YKAi////YOAi////tRA////9gD///qUAP8ABJmA///8xoAI/wBCc4D/ACDLgAX//95+gP8ASx4A//+1PED/ADBKgP//rTfAiwgL//2QDQD/AIXEAAf/ADGHAIv/AClWwP8AAm0A/wAr7YD/ABaVQP8AWVPA/wAt7MD/ADC+AP8AaigAi/8AiFoAi/8Ad/gA///cboD/AGj+wP//r9xA/wA0JUD//9K6QP8AHXVA///TJsD/AAPwwP//yQwAiwgL/wBLFMAG/wAnQkCL/wAnasD///2/QP8AJpAA///gCUD/ADnnQP//0AHA/wATVkD//6dZwIv//6aEwIv//4k4wP//2JhA//+7pMD//843AP//3mhA///Y78D//+WkQP//2bwA///+QcD//9jSgIsI///AI0AGC//9kA0A/wF7uID/AD4iwP/+xrsA/wDnSMD/AQSgQP8AP9zA//77X8D/AMyIAP8BO9vA/wA+IsAHC///rSJA//9hxUD//8xYAP/+7puA//8ULMD/AIQKwP//sjGA/wBsu4Af/wA5t4CL/wBCmUD/ABWEAP8AOr2A/wArQIAI/wDzXYD//045AP//w5dA/wBxDYD//2uQQAf//90JQP//5xVA///X8UD///LxQP//2t8Ai///17BAi///07WA/wAP74D//94cgP8AJp9A///L+wD/ADtIwP//+LAA/wBXbICL/wBB0ECL/wA6BkD/AAb3gP8AN+VA/wAYYED/AC3fgP8AICYA/wA8fsD/ADeMgP8AHMTA/wA0fUCL/wA3nECL/wAsRED//+AmgP8AEw7A///WPoAI/wADEcD///lHAP8AAmyA///4FYD/AAfTQP//+vtACP8AMTDA/wAyDcAF///cYED/AECRwP//u2IA/wAn30D//7M7gIsIC///xVEA/wBzpED//gVrQP//hXRA///FUMD/AUHmQP8AOdJA//9+jMD/AftxwP8Ae2jA/wA6rwAHC//9kA0A/wF00MD/ADxpAP/+061A/wIR4cAHi/8ACQkA/wACMcD/AANJgP8AAvJA/wAFm8D/AAF6gP8AAtBA/wADF0D/AAXOAP///uuA/wAHG8AIC/8AQ1CA/wHqLwAG/wESbwD//hT0AP8ANzuAi4v/AlYPQAWL/wAG9AD/AAGXQP8AAnxA/wACZcD/AASPAP8AAR4A/wACIED/AAKZgP8ABM8A////MwD/AAXSQAj//7XIAP/+MW6ABv/++oMA/wHNtID//7vSgIsFC4v/ADpKwP//+9OA/wBNaMD//94EAP8AQpXA///XI0D/AFAOwP//uSfA/wAlZQD//7wtAIsI//+jEoD//3zBAP//t2hA//8LG0D//wsngP8AgW3A//+y1gD/AF9ewB//AENDQIv/AEe5wP8AJYRA/wApBQD/AFMCgP8AIRqA/wBC/kD/AAP0AP8ATYQAi/8ANrkACAv/ACw2AIv/ADVJAP//5bUA/wAdCgD//7fFwP8AFQ8A///LnsD/AAMxQP//xFRAi///y0KAi///1zHA///9pQD//8BtwP//5naA///KSsD//+MrAP//w1sA///PuUD//+hNwP//1hMAiwj//7npgP//qgDA/wBAyAD/AMYmgP8AucNA/wBWwQD/ADkLAP8AQXjAHwv//ZDqAP8ARsRA/wETTAD/AHjRwAf/AIoUgP/+7LQA/wBOiICL//9v4QD/ARXiwAX/AEuDAP8AFKEA/wAzeQD/AEcwgIv/AFJ9QIv/AD6SAP//4TIA/wA6PQD//8alQP8AHSEA///YhsD/ABQMgP//2KnA/wAA6AD//9e6AIsIC/8AcQ2ABv8AGghAi/8AGQyA////XQD/ABllwP//80KA/wAm18D//+yDwP8AFCwA///YW4CL///XcMCL///YRAD//+y3wP//2uAA///b5wD//+28gP//5/nA///z2ED//+g+gP///2pA///nbwCLCP//hy5ABgv//9XNAP8AMiOA///BUMD/ABuJwP//vBPAi///j3eAi///srUA//+1jwCL//+qyICL///bq0D/AA5CgP//0ShA/wAz88D//9mjwP8AObdA///VYoD/AFnwgP//6nBA/wAvF4D//+J8QP8AKN4A///mYoD/AAtpQP//33RAi///5CKAi///yclA///SZcD//8UtwP//pYoAiwj//7uZwIv//8tSQP8AIXPA///kJAD/ACNIwP///N8A/wAD9kD/AABCQP8AAodA/wAADoD/AAQgQP8AAAXA/wABpoD/AAA4gP8ABYDA///7OAD/AAJtQAj//9aTgP//uF8ABf8AMQBA///Ko0D/AEXJwP//5QtA/wBM48CL/wCXqQCL/wA4BMD/AGWiAIv/AE5rgIv/ACCbgP//9phA/wArhED//9j/AP8AJLqA///JzMD/ADMKQP//qDYA/wARsgD//8b8gP8AIViA///L2sD/AB5/AP//9HqA/wAk9kCL/wAZeMCL/wAvxYD/ACkzAP8AK5CA/wBHVMCLCP8AOgvAi/8ALKDA///leYD/ABgiAP//3M+A/wACpcD///wkAP///39A///96kD/AAAiAP///FLA/wAAMwD///p1wP8AAuGA///+BkD/AAIvwP///1YACAv//8EAQP8AsOpA//3OL8D/AEbEAP8CMdBA/wC30cD/AD7/wAcL//5nzQCLB4v//9P0AP8AATeA///VlkD/ABcRwP//1TKA/wAiiED//7/ugP8ARSKA///fKYD/AEmGQIv/AEgEQIv/AEX+wP8AIBpA/wAjcQD/AEFRgP8AF5SA/wArdgD/AAFfwP8AKyqAi/8ALZLACP8BlL9A//+9jID//mmHAAeL///fzcD///9UgP//4JVA///wrQD//+BLQP//6PjA///QW4D//9EUQP//5pvA///PX4CL///OlQCL///Q9kD/ABoBAP//6ZgA/wAv6wD///GlAP8AHrQA////ZQD/AB4xgIv/AB7yQAj/AXkhgAeL/wAEi0D/AABBgP8AA2FA/wADsID/AAUwgP8AAqQA/wADtoD/AAPxgP8ABBbAi/8ABffAi/8AAb6A////pYD/AAG4AP///1FA/wABlcAIC/8Av5ZA//6GAYCL//8KC4D/AEvxgIuL/wD19ID/ALDqQP8BeSGA//+1yECL//9164D//tHzQP//Zz/A/wEu6cAFC///wQBA/wEuDMAH//7F3kD//gA9wIv//87PAP8BnIPAi4v/AEQtgAX///OOAP8AAdiA///8K4D///gdAP//8hIAiwj//tm3gIv/ATQXQP8CAJ8A/wAA3QD/ADExAAUL/wAjYgD//9JCwAX/ACVrAP8AJyyA/wAzbsD/AAvFAP8AKjaAi/8ANkMAi/8AGtOA///pNAD/AAzlQP//6tNA/wAPOID//+cBAP///6WA///im0CL///nygAI///vmkD///FUQAf//7y0wIv//7f3wP8AALSA///F4ED//+qjwP//t/EA///lhID//99NQP//yprAi///zVuAi///vPpA/wA6QED//8G4wP8AX3MAi/8AOB1Ai/8AOhSA/wAUbMD/ADHYwP8AKNmACP//zfJA/wBELUD/ARsQgAeL/wAlcgD///6nwP8AI17A///q6cD/ACMkgP//4gTA/wAx94D//8YHAP8AGfEA//+5F0CL///CXsCL///FRMD//+wswP//1VHA///T6oAIC///4cuAB4v//+hVwP///80A///iXkD//+EuQP//3z6A///vZsD//+5bgP//1E/A///buoD//8QpwIv//8NugIv//9ybQP8AJkAAi/8AKNZAi/8AIS+A/wAXTID/ACVPgP8AOUcA/wANrID/ACl+AP8ACefA/wA9KsD///0CgP8AL3jAiwgL///cBoD/ADS7QP//wpxA/wAf3gD//7aIwIsI//95vQD//6CowP//m1UA//925QD//3ZAAP8AX9XA//+aQkD/AIE4QB//AD/IAIv/AD0fwP8AGYeA/wArkYD/AC72wAj//9aTgP8AMFPABf//4RzAaP//06SA///rwAD//9I2wIsI//+m+gD//7wkQP8ASplA/wBqwkD/AGgdAP8AQunA/wBA/YD/AFPzAB//AE4AQIv/ACWDwP//yYhA/wACpgD///qkgP8AA9FA///4SAD///qQAP//9ptA/wAH6wD///oGgAgL//+S4oD//5sPwP//sfjA//9ZOsD//2fHwP8AX0bA//+ujwD/AHwWgB//AEE1AIv/ADs6QP8AF9zA/wAnHYD/AC8HAAj//9hNQP8AJtXABf//4jlA///epsD//9TuAP//7fMA///Sk0CL///C4YCL//+ng4D/ACGyAP//+pBA/wCIzEAI/wFEOwAG/wACxYD/AB9jgP///ozA/wAdV4D///uDQP8AGoVA///rP8D/AHqmAP//qryA/wAnvgD//7UaAIsIC/8ADjqA/wBrvsD/AEWJwP8AH1gA/wAxBwCL/wBKCwCL/wA03oD//779gP//92uA//+168AIC/8AN11A/wAtFID/AC0CwP8AN4fA/wA3hwD/AC0IQP//0vzA///IrQD//8ijwP//0u3A///S/MD//8h5QP//yHeA///S9gD/AC0CAP8AN1PAHgv//6UMQP//sDDA//+3ucD//6a7QB+L///OBID/ABmsgP//0YEA/wAp3UD//+TCQP//3woA///kDgD//+07AP//4R9Ai///4qXAi///7PpA/wAHyID//+VOwP8AHN0A///w1QD//873gP//4LKA///mvED//95nwIv//9uzQAj//84xQP8ALnYA///FlkD/AKAcwP8AmrqA/wA3eoD/AE5rQP8APUbAHov/ACeMgP//6X3A/wAn7AD//895AP8AE7SA///QTwD/ABNdwP//yNEA///5k4D//8w6wIv//93kQIv//+qawP8AAxKA///2QoD/AAKtQP//7oBA/wAEzwD///XQwP8ACsWAi/8ADmZAi/8AGC1A/wAcJUD/ABc0QP8ABH2A/wADtED/ABKTgP//+R2A/wATp4D///x6wP8AE8/Aiwj/AFp6AP8ASiMA/wBIKoD/AFRTwB+L/wAbsQD///fbgP8AGuvA///w1wD/ABbRQP8AGBBA/wAOcUD/ABuUQP8AB6nA/wAcJkCL/wAI1YCL/wAI0YD///8+wP8ACLSA///+f4AI///3XoD/ADqvQAX//9IMwP8AA58A///ScID///FyQP//3KaA///iXwD//+PVQP8AHBJA///ZnkD/AA+NQP//1lZAiwgL/wARUMD///3CwP8AGD6A///+CYD/ACL1wP///rSA/wAhtwD///7AQP8AJNwA/wACiUD/ABo1QP///AzA/wAqXUD///mdQP8ADCaA///lVsCL///r4oCL///sM0D///SgAP//6BgA///goMD//+8RgP//3oYA///t70D//9ldwP///hDA///ha4CL///rJACL///ZH0D/AAEzAP//3XcA/wANuwAI///bEkD/AA6vQP//9+iA/wAZIwCL/wAP9oCL/wAg1sD/AB6pwP8AF/4A/wAaQED/AA5qQAgL///FUQD/AG52wP/+qx2A//+LfsD//8YtwP8BKAJA/wA50kD//5T9AP8Bj5GABwv//+NdQP//6NZA///o7UD//+O2gP//47gA/wAXKQD//+jwAP8AHKCA/wAcpQD/ABcpAP8AFxKA/wAcRwD/ABxLwP//6NTA/wAXDwD//+NgQB8L///EdAD/AKoCwP/+hEfAB4v//+eZQP///5EA///n/ED///S/gP//57eA///ux8D//9rXQGf//+uIQP//2VwAi///yMMAi///4h0A/wAnhMD///xRQP8ABgUA///75kD/AAazwP8AAZfA/wAGgID///nIQP8ABSIACP//0WYA///B3UAF/wAgtcD//9dqQP8AMicA///okUD/ADivAIv/AEEwwIv/AD/lQP8AHqgA/wAe+ED/ADymAP8AE4MA/wAmNcD/AAEPQP8AJXjAi/8AJ20ACP8BqXWABwv//8YuAP8AgXNA//3bIcD//3iCQP//xi3A/wFWnED/ADnSQP//eV9A/wJesEAHC/8ASVsA/wEHNwAGi/8AHsSA/wADswD/ABZZgP8AEwEA/wAZUsD/ABFrAP8AFzXA/wAr5wD/AChiAP8AME9Ai/8AFu2Ai/8AFpnA///2rgD/ABBowP//7GSA/wAYucD//+J0AP8AADTA///YywCL///fuwAI//7stAD/AEbEAP8BFQYAiweL/wAjq8D////EAP8AJbIA///vwED/ACS5gP//6UFA/wAzZsD//9ErwP8AHTuA///L8MCL///CAUCL///HsMD//9dwQP//3nRA///NFMAI/wBQQoD//7alAAcL/wCdvUD//5xxQP8AUsfA//+YLAD//4uSgP//nC8A//+bJQD//3LYwP//dQSA/wBi+AD//54FgP8AcyRA/wBsLwD/AGFWAP8AVv6A/wCXdMAeC/8AQehA/wBF78D//8cgwP//go5A//+NAsD//74rAP//xafA//+9UQD//7cxQP//vi9A/wBEYID/AHCxAP8Ab/3A/wBBbID/AD6XQP8ARd8AHwv/ACgagP8AYMaA///rCYD//1owgP//b+zA//+hd0D//+j0gP//1TSAH///1KxAi///1OlA/wAVdsD//+33AP8AKYuA///yn0D/AB7RgP8AAElA/wAlpECL/wBCK8CL/wAmiQD/AAIEAP8AG8nA/wAKDwD/ABe6AP8AEWWA/wApCMD/ACp/gP8AGSuA/wAuBkCLCAv//jacAP8ASH4A/wDep4AHi/8AG5GA/wABEUD/AB5UAP8AHw4A/wAxGYD/ACmDgP8AQaIA/wA2iAD/AAteAP8AIE2Ai/8AJnBAi/8AGCsA///uKwD/AAzTgP//750A/wAGAMD///hUwP8AA0dA///4F8D/AAeswP//+KkACP8AIahA/wBFCkAF///jQoD/AB1wwP//1fBA/wAUcYD//8ywgIv//71CwIv//7xBwP//3j2A///iFED//76vQAj/AAKWwP8AWAbABQv//9XIwP8ALoVA///DWID/ABkcgP//vGyAi///leVAi///unxA///EtYCL//+7w4CL//+wOwD/AFaBQP//4u9A/wAYzAD///cJQP8AJqOA///yCID/ADJyAP//891A/wAhs4D///A6AP8AJbDA///uW4D/AAflQP//5/EAi///732Ai///1TSA///LzwD//+KDQP//vrvAiwj//7GwgIv//83XAP8ALzCA///xi4D/ABBuQP///JgA/wAD38D/AABxwP8AAtCA/wAAL0D/AAP/wP8AABAA/wABX4D/AABvwP8ABbpA///7EsD/AAJNgAj//9aTgP//uF8ABf8ANaDA///OIkD/AEXSwP//6V/A/wBFZYCL/wB82sCL/wBBNcD/AEmuwIv/AET1gIv/AB+fAH7/AClVgP//yfFA/wAeWED//8xfwP8AHPqA//+2bkD/AApRAP//1UyA/wAUosD//9quQP8AEglA///4DwD/ABYnwIv/AA9ZgIv/ACTDgP8ALJsA/wAZnwD/ADOnAIsI/wBBIICL/wAsTcD//9e1AP8AEWOA///pj0D/AALRAP///F1A////WAD///2ZwP////oA///8fMD////2AP//+gSA/wADewD///5cQP8AAcQA////lIAIC///917A//+FdED//5NDAIv///8jQP//xVDA/wBrAwCLBf//+Z/A//+xxsD///ziAP//sj6Ai///smqAi///1wPA/wAAXsD//9IXQP8AGpbA///aiYD/ABWqAP//4XmA/wAjtED//+3egP8ALqmAi/8ANmWAi/8ANQBA/wAWvcD/ACajAP8AHEfACP//6Y/A/wA49UAF///ZO8D//+MswP//3JKA///zHoD//+PdAIv//93mAIv//9yMQP8AEt7A///4sED/ADbdAP///3bA/wAEBQD///2ZwP8AEZQAi/8AQjiAi/8AO7dA/wAC5UD/ADukgP8ABcYA/wA7ZMAI/wCWKYD/ADuMAP//arOABouL/wAG5UD/AFJJgP8ABLOA/wAZVED/AAH8wP8ACrPA/wAHMAD/AAYrgP///H0A/wAKI8AIC////yMA//8BakAF////3YD//9g3AP8AAGiA///X7YD/ABHYgP//197A/wAar0D//8P+gP8AN91A///e0UD/ADtvgIv/ADlKQIv/ADYHAP8AHrmA/wAdxED/ADJpgAj///8jAP//3XrABf///7VA///0WED/AAAfwP//9A1A/wAB5MD///Q4gAj/AEvxwAb///ucgP8ADadA////NgD/AA5iwIv/AA1igAj/AZ8agP//t4IA//8E3cAHi///3NTA///9RoD//+TcQP//8LwA///kHsD//+sQAP//2cPA///XZMD//+J+wP//0/5Ai///3D5Ai///3qPA/wATxMD//+3PAP8AJB9A///vxMD/ACA6wP8AABzA/wAjuICL/wAeowAI/wD+lcAHC/8AuYuA//45MsD///FUQP//3lgABf//+BRA///t1ED///bfwP//7IaA///xhkD///CWAP//7PtA///rv0D//+iIAP//9qkA///qmkCL///eI0CL///uuID/ABa0QP///XUA/wAE30D///1rAP8ABPMA/wAAggD/AAarQP//+hmA/wAEn4AI///a5ED//79GQAX/ABpdAP//5sHA/wAjDsD///MdwP8AJY/Ai/8AKUMAi/8AKs3A/wAPLYD/AB5xAP8AIkAA/wAT9MD/ABZ0QP8ACaYA/wAYGED/AAnDwP8AGdyACP8AjmVA/wF5IYAF/wAQbUD/ACuBgP8AD+DA/wAr3gD/AA1vAP8ALKqACP//tOtABv//+HQA///WLED///MEAP//13qA///yAwD//9iqgAj//6jWQP//CuiA//96PED/AVCRwAX///7fgP8AAtZA////QcD/AAI2wIv/AALpQIv/AAdcgP8ABQVA/wAFBsD///9wQP8ACP5ACAv//8EAQP8BBlpAB//+5O+A//6l8ACL///OzwD/AY+RwIuL/wBELYAF///zjgD/AAHYgP///CvA///4HQD///IRwIsI//7wJ8CL/wEWv8D/AVrtAIv/ADEwwAUL///jhYD/ACGoQP//kKxA//+70oD//5hwgP8ARsRA///fNMD//9oHAP8Ae2jA//+ee0D/ABWTQIsFC///2gcA/wAihQD//67gwP//miqA//+yVID/AGaygP//0WYA///desD/AG52wP//cngA/wAVk0CLBQv/AIQuQP8AbhKA/wBwqQD/AI8cgP8AjtSA//+SKAD/AHBogP//e/yA//97nwD//5HcwP//jzlA//9wxcD//3GHQP8AbcUA//+Pd0D/AIRaAB8L/wB4LkD/AFpdgP8AXSdA/wBrnsD/AGt1gP8AWg0A//+jGYD//4hUgP//iAMA//+lqoD//6MFwP//lI2A//+UOAD//6YRQP8AXQhA/wB3K4AeC///yaGA/wFdg8D/ADZegAcLi///6LLA/wCd7cD//1e3QP8AJ7LA/wAnsoD//4BGgP8Ai86A/wB40gD/AHY7AP//2SpA/wApbIAFC///x+eA/wD9uMD/ADgYgAcL//9oHID/AJOSgP//2SpA///Wk4D/AHjSAP//icUA//+ARsD//3QxgP8AJ7KA///YTYD/AJ3uAP8AqEjABQv/ABveAP//6V2A/wAWowD//+QiQP//5CJA///pXUD//+ldAP//5CIA///kIoD/ABajAP//6V2A/wAb3cD/ABvdQP8AFqLA/wAWowD/ABvdAB4L/wAb7oD//+mBQP8AFpMA///kckD//+RsAP//6YQA///paYD//+QVgP//5BMA/wAWfgD//+lrgP8AG5GA/wAbksD/ABZ6QP8AFpeA/wAb6YAeC///2E1A//+6GMD/AKkmAP//wroA/wAXTQD/AClswAUL//9nP8D//6Y/gP8AF01A///Wk0D/AKklwP8APUYABQv/ABx6gP//3lfA/wBvU8D/AEQtgP8AZ4+A//+5O8D/ACDLQP8AJfkA//+El0D/AGGEwP//6mzAiwUL/wAX9YD/ACamgP8ADwIA/wAW/sD/ABp8gIv/ACwMQIv/ABsUgP//tFWA/wA6J8CL/wAk4kCL/wAbO0D/ABvzAP8AIpGA/wArB4AI///a5AD/ACeywAX//+pAgP//4qaA///0S8D//+ilQP//51YAi///7VhAi///8PwA/wAOtoD//+/LAP8AEOQA///zJgD/AA1kQP//5SeA/wAdg8D//9eVQIv//9kDgIv//9rlgP//5ANA///bAwD//8V0wAgL//737AD//8+sAP//xi4A/wAwVAD//tHzAP8Af7lAB/8ALDXAi/8AIVgA/wACuwD/ACNgQP8AEHiA/wBf40D/ACylQP8AMwtA/wB3TICL/wCEz8CL/wBqBAD//9/0AP8AbXKA//+1AUD/ADeIQP//1I/A/wAgKkD//9TAgP8ABNUA///J8wCLCAv/AGhsQP8AOdIA//+Xk8D/AM1lAP8ARsRABv8AJoTAi/8AM0CA///+UQD/ACqQQP//xbgA/wAlhwD//8ydgP8ADwqA//+y14CL//+6jECL//+dYED//+AsgP//q4cA///DvYD//9dTwP//3MPA///oN4D//97OAP///hGA///cZQCLCP//xHQABgv//8EAQP//1baA/wBk+ID//3lfQP8AMg3A/wAeNIAFC///p/lA//9tSkD/ADINwP//4cuA/wBk+MD/AIagwAUL/wAl+QD//917AP8AUR9A/wBl1YD/AE2rgP//mU2A/wAumgD/ACKFQP//kYlA/wCNiAD//+pswIsFC/8AG94A///pXYD/ABajAP//5CJA///kIkD//+ldQP//6V0A///kIkD//+QiQP8AFqMA///pXcD/ABvdwP8AG91A/wAWosD/ABaiwP8AG90AHgv/ABvuQP//6YFA/wAWkwD//+RyQP//5GwA///phAD//+lpwP//5BVA///kE0D/ABZ+AP//6WuA/wAbkYD/ABuSwP8AFnpA/wAWl0D/ABvpwB4L/wAwMID//9dyQP8AJ9fA///M/sD//80KAP//133A///YLID//8/aQP//z7PA/wAolgD//9gtwP8AMuUA/wAzBED/ACiIAP8AJ9wA/wAwM4AeC/8AGiXA/wATD4D/ABPMAP8AFnUA/wAWtID/ABK6wP//6/4A///mUUD//+XpAP//7QMA///sNAD//+mHwP//6T6A///tQwD/ABQIgP8AGZmAHgv//8zTgP8AIeMA///gPoD/ACORgP8AIOlA/wAYpoD/ABrSgP8AHjQAHov/ABrjgP//7PNA/wALf4D///cqQP8ABeBA///3UAD/AAXHQP//8UNA/wAJNUCL/wAUlkCL/wAQjID/AAnsgP8AERdA/wAE4kD/AAgFwP8ACcSA/wAQDED/ABDNQP8AGFWA/wAXt4D/ABXPwAj//917AP8AHjSABf//ulnA//+5SID//9teQP//vsoAi///y++ACAv//9vBAP//0kMABf8AJ6sA///QQID/ADaTgP//4u1A/wA2n0CL/wA8bICL/wA04ED/ACJkwP8AIdgA/wAt4QAI///jhUD/AClswAX//93iAP//09zA///U/0D//+Y6gP//1k2Ai///zpsAi///17xA/wAitYD//+kxQP8AJBAACAv/AC6aAP//5hxA/wE6IcD/AqgLQP//0IkA/wAawMAFC///X9PA//8y84CL///jsYD/AJGswIuL//+x/ED/AC2RAIuL/wBNU0D/ADJmQIuL/wAl+MD//82ZwIuL/wDEEsAFC///ifEA//+iGwAHC///3ivAi///ll5A///GAYD/AA0eAP//5yWA/wBMooD/ABNUgIv//zs8wP//sJqAi4v//9SBQP8Ay6tAi4v/ACt+wP//tW/AiwUL//980wD//4O6QP8AH+5A///Wk4D/AJHYwP8AZPiABQv//3zTAP//g7pA/wAf7kD//9aTgP8AkdkA/wBk+IAFCwAAAAEAAAAMAAAAFgAAAAIAAQABAWYAAQAEAAAAAgAAAAAB9AAAAesAAAHjAAAB2gAAAdIAAAHJAAABwAAAAbgAAAGvAAABpgAAAZ4AAAGVAAABjAAAAYQAAAF7AAABcwAAAWoAAAFhAAABWQAAAVAAAAFHAAABPwAAATYAAAEuAAABJQAAARwAAAEUAAABCwAAAQIAAAD6AAAA8QAAAOkAAAH0AAAB9AC0AfQAbwH0ABkB9AA7AfQAHAH0ACQB9ADOAfQAigH0AEgB9AApAfQALAH0AKQB9ABGAfQAswH0AD8B9AAyAfQAWwH0AEkB9ABFAfQAMAH0AD8B9ABDAfQATgH0ADwB9ABEAfQAswH0AKQB9AAiAfQALAH0ACcB9AA/AfQAHwH0AA4B9AAwAfQAKAH0ADUB9AA6AfQATQH0ACQB9AA2AfQAUQH0ADEB9AAqAfQAQgH0ACgB9AAyAfQAHQH0ADoB9AAdAfQAOAH0ADMB9AAfAfQAMgH0ABkB9AARAfQAKAH0ABwB9AAyAfQAgwH0AD8B9ABSAfQAXQH0ACIB9ACLAfQAMQH0ADsB9AA4AfQALAH0ADAB9AA+AfQAJgH0AEUB9ABkAfQAMAH0AEIB9ABOAfQAJQH0AEQB9AAoAfQAOwH0ACoB9ABjAfQAOAH0AEUB9AA+AfQAJwH0AA8B9AAvAfQAFgH0ADIB9AA0AfQA2AH0AFwB9AApAOAAAADXAAAAzwAAAMYAAAC9AAAAtQAAAKwAAACjAAAAmwAAAJIAAACKAAAAgQAAAHgAAABwAAAAZwAAAF4AAABWAAAATQAAAEUAAAA8AAAAMwAAACsAAAAiAAAAGQAAABEAAAAIAAAAAAAA//gAAP/vAAD/5wAA/94AAP/VAAD/zQAAAfQAAAH0ALQB9AAwAfQAJgH0ACAB9AAkAfQAMwH0AEAB9AA4AfQADQH0AEsB9ABDAfQAWwH0AEYB9AANAfQAewH0AHgB9AAsAfQAbwH0AHAB9AAyAfQAGAH0AD8B9ACzAfQAMgH0AHsB9ABLAfQAQwH0AAkB9AAGAfQAHAH0AEMB9AAOAfQADgH0AA4B9AAOAfQADgH0AA4B9AAEAfQAKAH0ADoB9AA6AfQAOgH0ADoB9ABRAfQAUQH0AFEB9ABRAfQAHgH0ADIB9AAdAfQAHQH0AB0B9AAdAfQAHQH0AFQB9AAdAfQAMgH0ADIB9AAyAfQAMgH0ABwB9AA6AfQANwH0ADEB9AAxAfQAMQH0ADEB9AAxAfQAMQH0AAoB9AA4AfQAMAH0ADAB9AAwAfQAMAH0AGQB9ABkAfQAZAH0AGQB9AAoAfQARAH0ACgB9AAoAfQAKAH0ACgB9AAoAfQARgH0ACgB9AA+AfQAPgH0AD4B9AA+AfQAFgH0ADwB9AAWAfQALAH0AKQB9AC2AfQAtAH0AMsB9ACFAfQAWgH0AHsB9ABkAfQAygH0AHAB9AB9AfQApAH0AJ0B9AEUAfQAhQH0AGQB9ACQAfQAkAH0AHEB9ABxAfQApwH0AKwB9AAoAfQARAH0ANgB9AAGAfQABgH0AAsB9AAOAfQAEwH0AEIB9AAzAfQAMwH0AB8B9AAyAfQAMgH0ADgB9AAOAfQAQgH0ACgB9AAoAfQAOgH0ADoB9AA1AfQAHgH0ADIB9AAyAfQAHQH0ADgB9AAyAfQAMgH0AB8B9AAxAfQAMQH0ADgB9AAAAfQAMAH0AD0B9ABOAfQARAH0AEQB9AAoAfQAYwH0ADgB9AA4AfQAOAH0AEUB9AA+AfQAPgH0ADIB9ABOAfQAMP/EAAAB9ABCADAARACkAE4APQA9AAYAOgA6ADAAPgAmAGUAZQBLADIAJQAkAFEAYwAsADIAqgASADEAMQARAD4AAAABAAAAAMKOSbwAAAAAwVl2DgAAAADC6YfT';

  /**
   * p5.EasyCam (MIT, (c) 2018 Thomas Diewald) — bundled verbatim from inkField's lib/p5.easycam.js.
   * inkField always loaded it; once created, its 'pre' hook owns the camera, which defines the framing
   * of the layered render (without it the picture is zoomed out / centred differently).
   * Loaded lazily on first engine creation (it patches p5.prototype.createEasyCam/ortho like the original).
   */
  let _easyCam = null;
  function loadEasyCam() {
    if (_easyCam) return _easyCam;
    if (typeof window !== 'undefined' && window.Dw && window.Dw.EasyCam) return (_easyCam = window.Dw);
    /*
     * 
     * The p5.EasyCam library - Easy 3D CameraControl for p5.js and WEBGL.
     *
     *   Copyright 2018 by Thomas Diewald (https://www.thomasdiewald.com)
     *
     *   Source: https://github.com/diwi/p5.EasyCam
     *
     *   MIT License: https://opensource.org/licenses/MIT
     * 
     * 
     * explanatory notes:
     * 
     * p5.EasyCam is a derivative of the original PeasyCam Library by Jonathan Feinberg 
     * and combines new useful features with the great look and feel of its parent.
     * 
     */
    // (original file: 'use strict')
    /** @namespace  */
    var Dw = (function(ext) {
      

      
    /**
     * EasyCam Library Info
     */
    const INFO = 
    {
      /** name    */ LIBRARY : "p5.EasyCam",
      /** version */ VERSION : "1.0.9",
      /** author  */ AUTHOR  : "Thomas Diewald",
      /** source  */ SOURCE  : "https://github.com/diwi/p5.EasyCam",
      
      toString : function(){
        return this.LIBRARY+" v"+this.VERSION+" by "+this.AUTHOR+" ("+this.SOURCE+")";
      },
      
    };



    /**
     * EasyCam
     *
     * <pre>
     *
     *   new Dw.EasyCam(p5.RendererGL, {
     *     distance : z,                 // scalar
     *     center   : [x, y, z],         // vector
     *     rotation : [q0, q1, q2, q3],  // quaternion
     *     viewport : [x, y, w, h],      // array
     *   }
     *
     * </pre>
     *
     * @param {p5.RendererGL} renderer - p5 WEBGL renderer
     * @param {Object}        args     - {distance, center, rotation, viewport}
     *
     */
    class EasyCam {

      /**
       * @constructor
       */
      constructor(renderer, args) {
        

        // WEBGL renderer required
        if(!(renderer instanceof p5.RendererGL)){
          console.log("renderer needs to be an instance of p5.RendererGL");
          return;
        }
        
        // define default args
        args = args || {};
        if(args.distance === undefined) args.distance  = 500;
        if(args.center   === undefined) args.center    = [0, 0, 0];
        if(args.rotation === undefined) args.rotation  = Rotation.identity();
        if(args.viewport === undefined) args.viewport  = [0, 0, renderer.width, renderer.height];
       

        // library info
        this.INFO = INFO;

        // set renderer, graphics, p5
        // this.renderer;
        // this.graphics;
        // this.P5
        this.setCanvas(renderer);

        // self reference
        var cam = this;
        this.cam = cam;
        
        // some constants
        this.LOOK = [0, 0, 1];
        this.UP   = [0, 1, 0];

        // principal axes flags
        this.AXIS = new function() {
          this.YAW   = 0x01;
          this.PITCH = 0x02;
          this.ROLL  = 0x04;
          this.ALL   = this.YAW | this.PITCH | this.ROLL;
        };
      
        // mouse action constraints
        this.SHIFT_CONSTRAINT = 0; // applied when pressing the shift key
        this.FIXED_CONSTRAINT = 0; // applied, when set by user and SHIFT_CONSTRAINT is 0
        this.DRAG_CONSTRAINT  = 0; // depending on SHIFT_CONSTRAINT and FIXED_CONSTRAINT, default is ALL
        
        // mouse action speed
        this.scale_rotation  = 0.001;
        this.scale_pan       = 0.0002;
        this.scale_zoom      = 0.001;
        this.scale_zoomwheel = 20.0;
        
        // zoom limits
        this.distance_min_limit = 0.01;
        this.distance_min       = 1.0;
        this.distance_max       = Number.MAX_VALUE;
        
        // main state
        this.state = {
          distance : args.distance,         // scalar
          center   : args.center.slice(),   // vec3
          rotation : args.rotation.slice(), // quaternion
          
          copy : function(dst){
            dst = dst || {};
            dst.distance = this.distance;      
            dst.center   = this.center.slice(); 
            dst.rotation = this.rotation.slice();
            return dst;
          },
        };

        // backup-state at start
        this.state_reset  = this.state.copy();
        // backup-state, probably not required
        this.state_pushed = this.state.copy();
        
        // viewport for the mouse-pointer [x,y,w,h]
        this.viewport = args.viewport.slice();
        

        
        
        
        // mouse/touch/key action handler
        this.mouse = {
          
          cam : cam,
          
          curr   : [0,0,0],
          prev   : [0,0,0],
          dist   : [0,0,0],
          mwheel : 0,
          
          isPressed   : false, // true if (istouchdown || ismousedown)
          istouchdown : false, // true, if input came from a touch
          ismousedown : false, // true, if input came from a mouse
          
          BUTTON : {  LMB:0x01, MMB:0x02, RMB:0x04  },
          
          button : 0,
         
          mouseDragLeft   : cam.mouseDragRotate.bind(cam),
          mouseDragCenter : cam.mouseDragPan   .bind(cam),
          mouseDragRight  : cam.mouseDragZoom  .bind(cam),
          mouseWheelAction: cam.mouseWheelZoom .bind(cam),
          
          touchmoveSingle : cam.mouseDragRotate.bind(cam),
          touchmoveMulti  : function(){
                              cam.mouseDragPan();
                              cam.mouseDragZoom();
                            },
         
          
          insideViewport : function(x, y){
            var x0 = cam.viewport[0], x1 = x0 + cam.viewport[2];
            var y0 = cam.viewport[1], y1 = y0 + cam.viewport[3];
            return (x > x0) && (x < x1) && (y > y0) && (y < y1);
          },
          
          solveConstraint : function(){
            var dx = this.dist[0];
            var dy = this.dist[1];
            
            // YAW, PITCH
            if (this.shiftKey && !cam.SHIFT_CONSTRAINT && Math.abs(dx - dy) > 1) {
              cam.SHIFT_CONSTRAINT = Math.abs(dx) > Math.abs(dy) ? cam.AXIS.YAW : cam.AXIS.PITCH;
            }
            
            // define constraint by increasing priority
            cam.DRAG_CONSTRAINT = cam.AXIS.ALL;
            if(cam.FIXED_CONSTRAINT) cam.DRAG_CONSTRAINT = cam.FIXED_CONSTRAINT;
            if(cam.SHIFT_CONSTRAINT) cam.DRAG_CONSTRAINT = cam.SHIFT_CONSTRAINT;
          },

          updateInput : function(x,y,z){
            var mouse = cam.mouse;
            var pd = cam.P5.pixelDensity();
            
            mouse.prev[0] = mouse.curr[0];
            mouse.prev[1] = mouse.curr[1];
            mouse.prev[2] = mouse.curr[2];
            
            mouse.curr[0] = x;
            mouse.curr[1] = y;
            mouse.curr[2] = z;
            
            mouse.dist[0] = -(mouse.curr[0] - mouse.prev[0]) / pd;
            mouse.dist[1] = -(mouse.curr[1] - mouse.prev[1]) / pd;
            mouse.dist[2] = -(mouse.curr[2] - mouse.prev[2]) / pd;
          },

          
          
          //////////////////////////////////////////////////////////////////////////
          // mouseinput
          //////////////////////////////////////////////////////////////////////////

          mousedown : function(event){
            var mouse = cam.mouse;
            
            if(event.button === 0) mouse.button |= mouse.BUTTON.LMB;
            if(event.button === 1) mouse.button |= mouse.BUTTON.MMB;
            if(event.button === 2) mouse.button |= mouse.BUTTON.RMB;
            
            if(mouse.insideViewport(event.x, event.y)){
              mouse.updateInput(event.x, event.y, event.y);
              mouse.ismousedown = mouse.button > 0;
              mouse.isPressed   = mouse.ismousedown;
              cam.SHIFT_CONSTRAINT = 0;
            } 
          },
          
          mousedrag : function(){
            var pd = cam.P5.pixelDensity();
            
            var mouse = cam.mouse;
            if(mouse.ismousedown){
              
              var x = cam.P5.mouseX;
              var y = cam.P5.mouseY;
              var z = y;
              
              mouse.updateInput(x, y, z);
              mouse.solveConstraint();
              
              var LMB = mouse.button & mouse.BUTTON.LMB;
              var MMB = mouse.button & mouse.BUTTON.MMB;
              var RMB = mouse.button & mouse.BUTTON.RMB;
              
              if(LMB && mouse.mouseDragLeft  ) mouse.mouseDragLeft();
              if(MMB && mouse.mouseDragCenter) mouse.mouseDragCenter();
              if(RMB && mouse.mouseDragRight ) mouse.mouseDragRight();
            }
          },
          
          mouseup : function(event){
            var mouse = cam.mouse;
            
            if(event.button === 0) mouse.button &= ~mouse.BUTTON.LMB;
            if(event.button === 1) mouse.button &= ~mouse.BUTTON.MMB;
            if(event.button === 2) mouse.button &= ~mouse.BUTTON.RMB;
            
            mouse.ismousedown = mouse.button > 0;
            mouse.isPressed = (mouse.istouchdown || mouse.ismousedown);
            cam.SHIFT_CONSTRAINT = 0;
          },
          
          dblclick : function(event){
            var x = event.x;
            var y = event.y;
            if(cam.mouse.insideViewport(x, y)){
              cam.reset();
            }
          },
          
          wheel : function(event){
            var x = event.x;
            var y = event.y;
            var mouse = cam.mouse;
            if(mouse.insideViewport(x, y)){
              mouse.mwheel = event.deltaY * 0.01;
              if(mouse.mouseWheelAction) mouse.mouseWheelAction();
            }
          },
          
          
          
          //////////////////////////////////////////////////////////////////////////
          // touchinput
          //////////////////////////////////////////////////////////////////////////
          
          evaluateTouches : function(event){
            var touches = event.touches;
            var avg_x = 0.0;
            var avg_y = 0.0;
            var avg_d = 0.0;
            var i, dx, dy, count = touches.length;

            // center, averaged touch position
            for(i = 0; i < count; i++){
              avg_x += touches[i].clientX;
              avg_y += touches[i].clientY;
            }
            avg_x /= count;
            avg_y /= count;
            
            // offset, mean distance to center
            for(i = 0; i < count; i++){
              dx = avg_x - touches[i].clientX;
              dy = avg_y - touches[i].clientY;
              avg_d += Math.sqrt(dx*dx + dy*dy);
            }
            avg_d /= count;
            
            cam.mouse.updateInput(avg_x, avg_y, -avg_d);
          },
          

          touchstart : function(event){
            event.preventDefault();
    		    event.stopPropagation();
            
            var mouse = cam.mouse;
            
            mouse.evaluateTouches(event);
            mouse.istouchdown = mouse.insideViewport(mouse.curr[0], mouse.curr[1]);
            mouse.isPressed = (cam.mouse.istouchdown || cam.mouse.ismousedown);
        
            mouse.dbltap(event);
          },
          
          touchmove : function(event){
            event.preventDefault();
    		    event.stopPropagation();
            
            var mouse = cam.mouse;
            
            if(mouse.istouchdown){
              
              mouse.evaluateTouches(event);  
              mouse.solveConstraint();

              if(event.touches.length === 1){
                mouse.touchmoveSingle();
              } else {
                mouse.touchmoveMulti();
                mouse.tapcount = 0;
              }
            }
          },
          
          touchend : function(event){
            event.preventDefault();
    		    event.stopPropagation();
            
            var mouse = cam.mouse;
            mouse.istouchdown = false,
            mouse.isPressed = (mouse.istouchdown || mouse.ismousedown);
            cam.SHIFT_CONSTRAINT = 0;
            
            if(mouse.tapcount >= 2){
              if(mouse.insideViewport(mouse.curr[0], mouse.curr[1])){
                cam.reset();
              }
              mouse.tapcount = 0;
            }
          },

          
          tapcount : 0,
           
          dbltap : function(event) {
            if(cam.mouse.tapcount++ == 0) {
              setTimeout( function() { 
                cam.mouse.tapcount = 0; 
              }, 350 );
            } 
          },
          
          
          
          //////////////////////////////////////////////////////////////////////////
          // keyingput
          //////////////////////////////////////////////////////////////////////////
          
          // key-event for shift constraints
          shiftKey : false,
       
          keydown : function(event){
            var mouse = cam.mouse;
            if(!mouse.shiftKey){
              mouse.shiftKey   = (event.keyCode === 16);
            }
          },
          
          keyup : function(event){
            var mouse = cam.mouse;
            if(mouse.shiftKey){
              mouse.shiftKey = (event.keyCode !== 16);
              if(!mouse.shiftKey){
                cam.SHIFT_CONSTRAINT = 0;
              }
            }
          }
          
        };
        
        
        
        // camera mouse listeners
        this.attachMouseListeners();
       
        // P5 registered callbacks, TODO unregister on dispose
        this.auto_update = true;
        this.P5.registerMethod('pre', function(){
          if(cam.auto_update){
            cam.update(); 
          }
        });
     
        // damped camera transition
        this.dampedZoom = new DampedAction(function(d){ cam.zoom   (d * cam.getZoomMult    ()); }  );
        this.dampedPanX = new DampedAction(function(d){ cam.panX   (d * cam.getPanMult     ()); }  );
        this.dampedPanY = new DampedAction(function(d){ cam.panY   (d * cam.getPanMult     ()); }  );
        this.dampedRotX = new DampedAction(function(d){ cam.rotateX(d * cam.getRotationMult()); }  );
        this.dampedRotY = new DampedAction(function(d){ cam.rotateY(d * cam.getRotationMult()); }  );
        this.dampedRotZ = new DampedAction(function(d){ cam.rotateZ(d * cam.getRotationMult()); }  );
        
        // interpolated camera transition
        this.timedRot  = new Interpolation(cam.setInterpolatedRotation.bind(cam));
        this.timedPan  = new Interpolation(cam.setInterpolatedCenter  .bind(cam));
        this.timedzoom = new Interpolation(cam.setInterpolatedDistance.bind(cam));
      }
      
      

      /**
       * sets the WEBGL renderer the camera is working on
       *
       * @param {p5.RendererGL} renderer ... p5 WEBGL renderer
       */
      setCanvas(renderer){
        if(renderer instanceof p5.RendererGL){
          // p5js seems to be not very clear about this
          // ... a bit confusing, so i guess this could change in future releases
          this.renderer = renderer;
          if(renderer._pInst instanceof p5){
            this.graphics = renderer;
          } else {
            this.graphics = renderer._pInst;
          }
          this.P5 = this.graphics._pInst;
        } else {
          this.graphics = undefined;
          this.renderer = undefined;
        }
      }

      /** @return {p5.RendererGL} the currently used renderer */
      getCanvas(){
        return this.renderer;
      }
      
      
      attachListener(el, ev, fx, op){
        if(!el || (el === fx.el)){
          return;
        }
        
        this.detachListener(fx);

        fx.el = el;
        fx.ev = ev;
        fx.op = op;
        fx.el.addEventListener(fx.ev, fx, fx.op);
      }
      
      detachListener(fx){
        if(fx.el) {
          fx.el.removeEventListener(fx.ev, fx, fx.op);
          fx.el = undefined;
        }
      }
      
      /** attaches input-listeners (mouse, touch, key) to the used renderer */
      attachMouseListeners(renderer){
        var cam = this.cam;
        var mouse = cam.mouse;
        
        renderer = renderer || cam.renderer;
        if(renderer){
          
          var op = { passive:false };
          var el = renderer.elt;
          
          cam.attachListener(el    , 'mousedown' , mouse.mousedown , op);
          cam.attachListener(el    , 'mouseup'   , mouse.mouseup   , op);
          cam.attachListener(el    , 'dblclick'  , mouse.dblclick  , op);
          cam.attachListener(el    , 'wheel'     , mouse.wheel     , op);
          // Touch listeners disabled: stopPropagation() in these handlers
          // blocks p5.js touch events (registered on window), preventing
          // touchStarted/touchMoved/touchEnded from firing on mobile.
          // EasyCam pan/zoom during playback uses programmatic setCenter/setDistance.
          // cam.attachListener(el    , 'touchstart', mouse.touchstart, op);
          // cam.attachListener(el    , 'touchend'  , mouse.touchend  , op);
          // cam.attachListener(el    , 'touchmove' , mouse.touchmove , op);
          cam.attachListener(window, 'keydown'   , mouse.keydown   , op);
          cam.attachListener(window, 'keyup'     , mouse.keyup     , op);
        }
      }
      
      /** detaches all attached input-listeners */
      removeMouseListeners(){
        var cam = this.cam;
        var mouse = cam.mouse;
           
        cam.detachListener(mouse.mousedown );
        cam.detachListener(mouse.mouseup   );
        cam.detachListener(mouse.dblclick  );
        cam.detachListener(mouse.wheel     );
        cam.detachListener(mouse.keydown   );
        cam.detachListener(mouse.keyup     );
        cam.detachListener(mouse.touchstart);
        cam.detachListener(mouse.touchend  );
        cam.detachListener(mouse.touchmove );
      }
      
      /** Disposes/releases the camera. */
      dispose(){
        // TODO: p5 unregister 'pre', ... not available in 0.5.16
        removeMouseListeners();
      }
      
      /** @return {boolean} the current autoUpdate state */
      getAutoUpdate(){
        return this.auto_update;
      }
      /** 
       * If true, the EasyCam will update automatically in a pre-draw step.
       * This updates the camera state and updates the renderers 
       * modelview/camera matrix.
       *
       * If false, the update() needs to be called manually.
       *
       * @param {boolean} the new autoUpdate state 
       */
      setAutoUpdate(status){
        this.auto_update = status;
      }
      

      /** 
       * Updates the camera state (interpolated / damped animations) and updates
       * the renderers' modelview/camera matrix.
       *
       * if "auto_update" is true, this is called automatically in a pre-draw call.
       */
      update(){
        var cam = this.cam;
        var mouse = cam.mouse;
        
        mouse.mousedrag();

        var b_update = false;
        b_update |= cam.dampedZoom.update();
        b_update |= cam.dampedPanX.update();
        b_update |= cam.dampedPanY.update();
        b_update |= cam.dampedRotX.update();
        b_update |= cam.dampedRotY.update();
        b_update |= cam.dampedRotZ.update();
        
        // interpolated actions have lower priority then damped actions
        if(b_update){
          cam.timedRot .stop();
          cam.timedPan .stop();
          cam.timedzoom.stop();
        } else {
          cam.timedRot .update();
          cam.timedPan .update();
          cam.timedzoom.update();
        }
     
        cam.apply();
      }
      
      /** 
       * Applies the current camera state to the renderers' modelview/camera matrix.
       * If no argument is given, then the cameras currently set renderer is used.
       */
      apply(renderer) { 

        var cam = this.cam;
        renderer = renderer || cam.renderer;
        
        if(renderer){
          this.camEYE = this.getPosition(this.camEYE);   
          this.camLAT = this.getCenter  (this.camLAT);
          this.camRUP = this.getUpVector(this.camRUP);
          
          // 🔧 兼容性修复：p5.js 1.11+ 中 renderer.camera 可能不存在
          // 优先使用 renderer.camera()，如果不存在则使用全局 camera() 函数
          if (typeof renderer.camera === 'function') {
            // 旧版本 p5.js：使用 renderer.camera()
            renderer.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2],
                            this.camLAT[0], this.camLAT[1], this.camLAT[2],
                            this.camRUP[0], this.camRUP[1], this.camRUP[2]);
          } else if (cam.P5 && typeof cam.P5.camera === 'function') {
            // 新版本 p5.js：使用全局 camera() 函数（通过 P5 实例）
            cam.P5.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2],
                          this.camLAT[0], this.camLAT[1], this.camLAT[2],
                          this.camRUP[0], this.camRUP[1], this.camRUP[2]);
          } else {
            // 备用方案：直接操作渲染器的 uMVMatrix（视图矩阵）
            // 这适用于 p5.js 1.11+ 版本
            var eye = this.camEYE;
            var center = this.camLAT;
            var up = this.camRUP;
            
            // 计算 lookAt 矩阵
            var f = [center[0] - eye[0], center[1] - eye[1], center[2] - eye[2]];
            var fLen = Math.sqrt(f[0]*f[0] + f[1]*f[1] + f[2]*f[2]);
            if (fLen > 0.0001) {
              f[0] /= fLen;
              f[1] /= fLen;
              f[2] /= fLen;
            } else {
              f = [0, 0, 1]; // 默认向前
            }
            
            var s = [f[1]*up[2] - f[2]*up[1], f[2]*up[0] - f[0]*up[2], f[0]*up[1] - f[1]*up[0]];
            var sLen = Math.sqrt(s[0]*s[0] + s[1]*s[1] + s[2]*s[2]);
            if (sLen > 0.0001) {
              s[0] /= sLen;
              s[1] /= sLen;
              s[2] /= sLen;
            } else {
              s = [1, 0, 0]; // 默认向右
            }
            
            var u = [s[1]*f[2] - s[2]*f[1], s[2]*f[0] - s[0]*f[2], s[0]*f[1] - s[1]*f[0]];
            
            // 构建视图矩阵（lookAt）
            if (renderer.uMVMatrix) {
              renderer.uMVMatrix.set([
                s[0], u[0], -f[0], 0,
                s[1], u[1], -f[1], 0,
                s[2], u[2], -f[2], 0,
                -(s[0]*eye[0] + s[1]*eye[1] + s[2]*eye[2]),
                -(u[0]*eye[0] + u[1]*eye[1] + u[2]*eye[2]),
                -(-f[0]*eye[0] - f[1]*eye[1] - f[2]*eye[2]),
                1
              ]);
            }
          }
        }

      }
      

      /** @param {int[]} the new viewport-def, as [x,y,w,h] */
      setViewport(viewport){
        this.viewport = viewport.slice();
      }
      
      /** @returns {int[]} the current viewport-def, as [x,y,w,h] */
      getViewport(){
        return this.viewport;
      }
      
      

      //
      // mouse state changes
      //
      
      /** implemented zoom-cb for mouswheel handler.*/
      mouseWheelZoom() {
        var cam = this;
        var mouse = cam.mouse;
        cam.dampedZoom.addForce(mouse.mwheel * cam.scale_zoomwheel);
      }
      
      /** implemented zoom-cb for mousedrag/touch handler.*/
      mouseDragZoom() {
        var cam = this;
        var mouse = cam.mouse;
        cam.dampedZoom.addForce(-mouse.dist[2]);
      }
      
      /** implemented pan-cb for mousedrag/touch handler.*/
      mouseDragPan() {
        var cam = this;
        var mouse = cam.mouse;

        cam.dampedPanX.addForce((cam.DRAG_CONSTRAINT & cam.AXIS.YAW  ) ? mouse.dist[0] : 0);
        cam.dampedPanY.addForce((cam.DRAG_CONSTRAINT & cam.AXIS.PITCH) ? mouse.dist[1] : 0);
      }
      
      /** implemented rotate-cb for mousedrag/touch handler.*/
      mouseDragRotate() {
        var cam = this;
        var mouse = cam.mouse;
        
        var mx = mouse.curr[0], my = mouse.curr[1];
        var dx = mouse.dist[0], dy = mouse.dist[1];

        // mouse [-1, +1]
        var mxNdc = Math.min(Math.max((mx - cam.viewport[0]) / cam.viewport[2], 0), 1) * 2 - 1;
        var myNdc = Math.min(Math.max((my - cam.viewport[1]) / cam.viewport[3], 0), 1) * 2 - 1;

        if (cam.DRAG_CONSTRAINT & cam.AXIS.YAW) {
          cam.dampedRotY.addForce(+dx * (1.0 - myNdc * myNdc));
        }
        if (cam.DRAG_CONSTRAINT & cam.AXIS.PITCH) {
          cam.dampedRotX.addForce(-dy * (1.0 - mxNdc * mxNdc));
        }
        if (cam.DRAG_CONSTRAINT & cam.AXIS.ROLL) {
          cam.dampedRotZ.addForce(-dx * myNdc);
          cam.dampedRotZ.addForce(+dy * mxNdc);
        }
      }
      
      
      
      //
      // damped multipliers
      //
      /** (private) returns the used zoom -multiplier for damped actions. */
      getZoomMult(){
        return this.state.distance * this.scale_zoom;
      }
      /** (private) returns the used pan-multiplier for damped actions. */
      getPanMult(){
        return this.state.distance * this.scale_pan;
      }
      /** (private) returns the used rotate-multiplier for damped actions. */
      getRotationMult(){
        return Math.pow(Math.log10(1 + this.state.distance), 0.5) * this.scale_rotation;
      }
      
      
      
      //
      // damped state changes
      //
      /** Applies a change to the current zoom.  */
      zoom(dz){
        var cam = this.cam;
        var distance_tmp = cam.state.distance + dz;
        
        // check lower bound
        if(distance_tmp < cam.distance_min) {
          distance_tmp = cam.distance_min;
          cam.dampedZoom.stop();
        }
        
        // check upper bound
        if(distance_tmp > cam.distance_max) {
          distance_tmp = cam.distance_max;
          cam.dampedZoom.stop();
        }
        
        cam.state.distance = distance_tmp;
      }
      
      /** Applies a change to the current pan-xValue.  */
      panX(dx) {
        var state = this.cam.state;
        if(dx) {
          var val = Rotation.applyToVec3(state.rotation, [dx, 0, 0]);
          Vec3.add(state.center, val, state.center);
        }
      }
      
      /** Applies a change to the current pan-yValue.  */
      panY(dy) {
        var state = this.cam.state;
        if(dy) {
          var val = Rotation.applyToVec3(state.rotation, [0, dy, 0]);
          Vec3.add(state.center, val, state.center);
        }
      }
      
      /** Applies a change to the current pan-value.  */
      pan(dx, dy) {
        this.cam.panX(dx);
        this.cam.panY(dx);
      }
      
      /** Applies a change to the current xRotation.  */
      rotateX(rx) {
       this.cam.rotate([1,0,0], rx);
      }
      
      /** Applies a change to the current yRotation.  */
      rotateY(ry) {
        this.cam.rotate([0,1,0], ry);
      }
      
      /** Applies a change to the current zRotation.  */
      rotateZ(rz) {
        this.cam.rotate([0,0,1], rz);
      }
      
      /** Applies a change to the current rotation, using the given axis/angle.  */
      rotate(axis, angle) {
        var state = this.cam.state;
        if(angle) {
          var new_rotation = Rotation.create({axis:axis, angle:angle});
          Rotation.applyToRotation(state.rotation, new_rotation, state.rotation);
        }
      }
      
      
      

      // 
      // interpolated states
      //
      /** Sets the new camera-distance, interpolated (t) between given A and B. */
      setInterpolatedDistance(valA, valB, t) {
        this.cam.state.distance = Scalar.mix(valA, valB, Scalar.smoothstep(t));
      }
      /** Sets the new camera-center, interpolated (t) between given A and B. */
      setInterpolatedCenter(valA, valB, t) {
        this.cam.state.center = Vec3.mix(valA, valB, Scalar.smoothstep(t));
      }
      /** Sets the new camera-rotation, interpolated (t) between given A and B. */
      setInterpolatedRotation(valA, valB, t) {
        this.cam.state.rotation = Rotation.slerp(valA, valB, t);
      }
      
      
      
      //
      // DISTANCE
      //
      /** Sets the minimum camera distance. */
      setDistanceMin(distance_min) {
        this.distance_min = Math.max(distance_min, this.distance_min_limit);
        this.zoom(0); // update, to ensure new minimum
      }
      
      /** Sets the maximum camera distance. */
      setDistanceMax(distance_max) {
        this.distance_max = distance_max;
        this.zoom(0); // update, to ensure new maximum
      }
      
      /** 
       * Sets the new camera distance.
       *
       * @param {double} new distance.
       * @param {long} animation time in millis.
       */
      setDistance(distance, duration) {
        this.timedzoom.start(this.state.distance, distance, duration, [this.dampedZoom]);
      }
      
      /** @returns {double} the current camera distance. */
      getDistance() {
        return this.state.distance;
      }
      
      
      
      //
      // CENTER / LOOK AT
      //
      /** 
       * Sets the new camera center.
       *
       * @param {double[]} new center.
       * @param {long} animation time in millis.
       */
      setCenter(center, duration) {
        this.timedPan.start(this.state.center, center, duration, [this.dampedPanX, this.dampedPanY]);
      }
      
      /** @returns {double[]} the current camera center. */
      getCenter() {
        return this.state.center;
      }
      
      
      
      //
      // ROTATION
      //
      /** 
       * Sets the new camera rotation (quaternion).
       *
       * @param {double[]} new rotation as quat[q0,q1,q2,q3].
       * @param {long} animation time in millis.
       */
      setRotation(rotation, duration) {
        this.timedRot.start(this.state.rotation, rotation, duration, [this.dampedRotX, this.dampedRotY, this.dampedRotZ]);
      }
      
      /** @returns {double[]} the current camera rotation as quat[q0,q1,q2,q3]. */
      getRotation() {
        return this.state.rotation;
      }
      


      //
      // CAMERA POSITION/EYE
      //
      /** @returns {double[]} the current camera position, aka. the eye position. */
      getPosition(dst) {

        var cam = this.cam;
        var state = cam.state;
        
        dst = Vec3.assert(dst);
        Rotation.applyToVec3(state.rotation, cam.LOOK, dst);
        Vec3.mult(dst, state.distance, dst);
        Vec3.add(dst, state.center, dst);

        return dst;
      }

      //
      // CAMERA UP
      //
      /** @returns {double[]} the current camera up vector. */
      getUpVector(dst) {
        var cam = this.cam;
        var state = cam.state;
        dst = Vec3.assert(dst);
        Rotation.applyToVec3(state.rotation, cam.UP, dst);
        return dst;
      }
      
      
      
      
      

      //
      // STATE (rotation, center, distance)
      //
      /** @returns {Object} a copy of the camera state {distance,center,rotation} */
      getState() {
        return this.state.copy();
      }  
      /** 
       * @param {Object} a new camera state {distance,center,rotation}.
       * @param {long} animation time in millis.
       */
      setState(other, duration) {
        if(other){
          this.setDistance(other.distance, duration);
          this.setCenter  (other.center  , duration);
          this.setRotation(other.rotation, duration);
        }
      }

      pushState(){
        return (this.state_pushed = this.getState());
      }
      popState(duration){
        this.setState(this.state_pushed, duration);
      }
      
      /** sets the current state as reset-state. */
      pushResetState(){
        return (this.state_reset = this.getState());
      }
      /** resets the camera, by applying the reset-state. */
      reset(duration){
        this.setState(this.state_reset, duration);
      }
      
      
      
      
      

      
      
      /** sets the rotation scale/speed. */
      setRotationScale(scale_rotation){
        this.scale_rotation = scale_rotation;
      }
      /** sets the pan scale/speed. */
      setPanScale(scale_pan){
        this.scale_pan = scale_pan;
      }
      /** sets the zoom scale/speed. */
      setZoomScale(scale_zoom){
        this.scale_zoom = scale_zoom;
      }
      /** sets the wheel scale/speed. */
      setWheelScale(wheelScale) {
        this.scale_zoomwheel = wheelScale;
      }
      /** @returns the rotation scale/speed. */
      getRotationScale(){
        return this.scale_rotation;
      }
      /** @returns the pan scale/speed. */
      getPanScale() {
        return this.scale_pan;
      }
      /** @returns the zoom scale/speed. */
      getZoomScale() {
        return this.scale_zoom;
      }
      /** @returns the wheel scale/speed. */
      getWheelScale() {
        return this.scale_zoomwheel;
      }
      
      /** sets the default damping scale/speed. */
      setDamping(damping) {
        this.dampedZoom.damping = damping;
        this.dampedPanX.damping = damping;
        this.dampedPanY.damping = damping;
        this.dampedRotX.damping = damping;
        this.dampedRotY.damping = damping;
        this.dampedRotZ.damping = damping;
      }
      /** sets the default interpolation time in millis. */
      setDefaultInterpolationTime(duration) {
        this.timedRot .default_duration = duration;
        this.timedPan .default_duration = duration;
        this.timedzoom.default_duration = duration;
      }
      
      
      /** 
       * sets the rotation constraint for each axis separately.
       *
       * @param {boolean} yaw constraint
       * @param {boolean} pitch constraint
       * @param {boolean} roll constraint
       */
      setRotationConstraint(yaw, pitch, roll) {
        var cam = this.cam;
        cam.FIXED_CONSTRAINT  = 0;
        cam.FIXED_CONSTRAINT |= yaw   ? cam.AXIS.YAW   : 0;
        cam.FIXED_CONSTRAINT |= pitch ? cam.AXIS.PITCH : 0;
        cam.FIXED_CONSTRAINT |= roll  ? cam.AXIS.ROLL  : 0;
      }
      

     
      /**
       * 
       * begin screen-aligned 2D-drawing.
       * 
       * <pre>
       * beginHUD()
       *   disabled depth test
       *   ortho
       *   ... your code is executed here ...
       * endHUD()
       * </pre>
       * 
       */
      beginHUD(renderer, w, h) {
        var cam = this.cam;
        renderer = renderer || cam.renderer;
        
        if(!renderer) return;
        renderer.push();
        
        var gl = renderer.drawingContext;
        var w = (w !== undefined) ? w : renderer.width;
        var h = (h !== undefined) ? h : renderer.height;
        var d = Number.MAX_VALUE;
        
        gl.flush();
        // gl.finish();
        
        // 1) disable DEPTH_TEST
        gl.disable(gl.DEPTH_TEST);
        // 2) push modelview/projection
        //    p5 is not creating a push/pop stack
        this.pushed_uMVMatrix = renderer.uMVMatrix.copy();
        this.pushed_uPMatrix  = renderer.uPMatrix .copy();
        
        // 3) set new modelview (identity)
        renderer.resetMatrix();
        // 4) set new projection (ortho)
        renderer.ortho(0, w, -h, 0, -d, +d);
        // renderer.ortho();
        // renderer.translate(-w/2, -h/2);

      }
      
      

      /**
       * 
       * end screen-aligned 2D-drawing.
       * 
       */
      endHUD(renderer) {
        var cam = this.cam;
        renderer = renderer || cam.renderer;
        
        if(!renderer) return;
        
        var gl = renderer.drawingContext;
        
        gl.flush();
        // gl.finish();
          
        // 2) restore modelview/projection
        renderer.uMVMatrix.set(this.pushed_uMVMatrix);
        renderer.uPMatrix .set(this.pushed_uPMatrix );
        // 1) enable DEPTH_TEST
        gl.enable(gl.DEPTH_TEST);
        renderer.pop();
      }

      
      
    }








    /**
     * Damped callback, that accepts the resulting damped/smooth value.
     *
     * @callback dampedCallback
     * @param {double} value - the damped/smoothed value
     *
     */

     
    /**
     *
     * DampedAction, for smoothly changing a value to zero.
     *
     * @param {dampedCallback} cb - callback that accepts the damped value as argument.
     */
    class DampedAction {
      
      
      /**  @constructor */
      constructor(cb){
        this.value = 0.0;
        this.damping = 0.85;
        this.action = cb;
      }

      /** adds a value to the current value beeing damped. 
       * @param {double} force - the value beeing added.
       */
      addForce(force) {
        this.value += force;
      }

      /** updates the damping and calls {@link damped-callback}. */
      update() {
        var active = (this.value*this.value) > 0.000001;
        if (active){
          this.action(this.value);
          this.value *= this.damping;
        } else {
          this.stop();
        }
        return active;
      }
      
      /** stops the damping. */
      stop() {
        this.value = 0.0;
      }

    }




    /**
     * Interpolation callback, that implements any form of interpolation between
     * two values A and B and the interpolationparameter t.
     * <pre>
     *   linear: A * (1-t) + B * t
     *   smooth, etc...
     * </pre>
     * @callback interpolationCallback
     * @param {Object} A - First Value
     * @param {Object} B - Second Value
     * @param {double} t - interpolation parameter [0, 1]
     *
     */


    /**
     *
     * Interpolation, for smoothly changing a value by interpolating it over time.
     *
     * @param {interpolationCallback} cb - callback for interpolating between two values.
     */
    class Interpolation {
      
      /**  @constructor */
      constructor(cb){
        this.default_duration = 300;
        this.action = cb;
      }
      
      /** starts the interpolation.
       *  If the given interpolation-duration is 0, then
       * {@link interpolation-callback} is called immediately.
       */
      start(valA, valB, duration, actions) {
        for(var x in actions){
          actions[x].stop();
        }
        this.valA = valA;
        this.valB = valB;
        this.duration = (duration === undefined) ? this.default_duration : duration;
        this.timer = new Date().getTime();
        this.active = this.duration > 0;
        if(!this.active){
          this.interpolate(1);
        }
      }
      
      /** updates the interpolation and calls {@link interpolation-callback}.*/
      update() {
        if(this.active){
          var t = (new Date().getTime() - this.timer) / this.duration;
          if (t > 0.995) {
            this.interpolate(1);
            this.stop();
          } else {
            this.interpolate(t);
          }
        }
      }
      
      interpolate(t){
        this.action(this.valA, this.valB, t);
      }
      
      /** stops the interpolation. */
      stop() {
        this.active = false;
      }

    }








    ////////////////////////////////////////////////////////////////////////////////
    //
    // ROTATION (Quaternion)
    //
    ////////////////////////////////////////////////////////////////////////////////
    /**
     * Rotation as Quaternion [q0, q1, q2, q3]
     *
     * Note: Only functions that were required for the EasyCam to work are implemented.
     * 
     * @namespace
     */
    var Rotation = 
    {
      
      assert : function(dst){
        return ((dst === undefined) || (dst.constructor !== Array)) ? [1, 0, 0, 0] : dst;
      },
      
      /** @returns {Number[]} an identity rotation [1,0,0,0] */
      identity : function() {
        return [1, 0, 0, 0];
      },
      
      /** 
       * Applies the rotation to a vector and returns dst or a new vector.
       *
       * @param {Number[]} rot - Rotation (Quaternion)
       * @param {Number[]} vec - vector to be rotated by rot
       * @param {Number[]} dst - resulting vector
       * @returns {Number[]} dst- resulting vector
       */
      applyToVec3 : function(rot, vec, dst) {
        
        var [x,y,z] = vec;
        var [q0,q1,q2,q3] = rot;
        
        var s = q1 * x + q2 * y + q3 * z;
        
        dst = Vec3.assert(dst);
        dst[0] = 2 * (q0 * (x * q0 - (q2 * z - q3 * y)) + s * q1) - x; 
        dst[1] = 2 * (q0 * (y * q0 - (q3 * x - q1 * z)) + s * q2) - y; 
        dst[2] = 2 * (q0 * (z * q0 - (q1 * y - q2 * x)) + s * q3) - z;
        return dst;
      },
      
      /** 
       * Applies the rotation to another rotation and returns dst or a new rotation.
       *
       * @param {Number[]} rotA - RotationA (Quaternion)
       * @param {Number[]} rotB - RotationB (Quaternion)
       * @param {Number[]} dst - resulting rotation
       * @returns {Number[]} dst - resulting rotation
       */
      applyToRotation(rotA, rotB, dst) {
        var [a0,a1,a2,a3] = rotA;
        var [b0,b1,b2,b3] = rotB;
        
        dst = Rotation.assert(dst);
        dst[0] = b0 * a0 - (b1 * a1 +  b2 * a2 + b3 * a3);
        dst[1] = b1 * a0 +  b0 * a1 + (b2 * a3 - b3 * a2);
        dst[2] = b2 * a0 +  b0 * a2 + (b3 * a1 - b1 * a3);
        dst[3] = b3 * a0 +  b0 * a3 + (b1 * a2 - b2 * a1);
        return dst;     
      },
      
      
      /** 
       * Interpolates a rotation.
       *
       * @param {Number[]} rotA - RotationA (Quaternion)
       * @param {Number[]} rotB - RotationB (Quaternion)
       * @param {Number  } t - interpolation parameter
       * @param {Number[]} dst - resulting rotation
       * @returns {Number[]} dst - resulting rotation
       */
      slerp : function(rotA, rotB, t, dst) {
        var [a0,a1,a2,a3] = rotA;
        var [b0,b1,b2,b3] = rotB;
        
        var cosTheta = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
        if (cosTheta < 0) {
          b0 = -b0;
          b1 = -b1;
          b2 = -b2;
          b3 = -b3;
          cosTheta = -cosTheta;
        }
        
        var theta = Math.acos(cosTheta);
        var sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
        
        var w1, w2;
        if (sinTheta > 0.001) {
          w1 = Math.sin((1.0 - t) * theta) / sinTheta;
          w2 = Math.sin(t * theta) / sinTheta;
        } else {
          w1 = 1.0 - t;
          w2 = t;
        }
        
        dst = Rotation.assert(dst);
        dst[0] = w1 * a0 + w2 * b0; 
        dst[1] = w1 * a1 + w2 * b1; 
        dst[2] = w1 * a2 + w2 * b2; 
        dst[3] = w1 * a3 + w2 * b3;
        
        return Rotation.create({rotation : dst, normalize : true}, dst);
      },
      
      /** 
       * Creates/Initiates a new Rotation
       *
       * <pre>
       *
       *    1) Axis,Angle:
       *       {
       *         axis : [x, y, z],
       *         angle: double
       *       }
       *      
       *    2) Another Rotation:
       *       {
       *         rotation : [q0, q1, q2, q3],
       *         normalize: boolean
       *       }
       *      
       *    3) 3 euler angles, XYZ-order:
       *       {
       *         angles_xyz : [rX, rY, rZ]
       *       }
       *   
       * </pre>
       *
       *
       * @param {Object} def - Definition, for creating the new Rotation
       * @param {Number[]} dst - resulting rotation
       * @returns {Number[]} dst - resulting rotation
       */
      create : function(def, dst) {
        
        dst = Rotation.assert(dst);
        
        // 1) from axis and angle
        if(def.axis)
        {
          var axis = def.axis;
          var angle = def.angle;
        
          var norm = Vec3.mag(axis);
          if (norm == 0.0) return; // vector is of zero length
          
          var halfAngle = -0.5 * angle;
          var coeff = Math.sin(halfAngle) / norm;

          dst[0] = Math.cos(halfAngle);
          dst[1] = coeff * axis[0];
          dst[2] = coeff * axis[1];
          dst[3] = coeff * axis[2];
          return dst;
        }
        
        // 2) from another rotation
        if(def.rotation)
        {
          dst[0] = def.rotation[0];
          dst[1] = def.rotation[1];
          dst[2] = def.rotation[2];
          dst[3] = def.rotation[3];
          
          if(def.normalize){
            var inv = 1.0 / Math.sqrt(dst[0]*dst[0] + dst[1]*dst[1] + dst[2]*dst[2] + dst[3]*dst[3]);
            dst[0] *= inv;
            dst[1] *= inv;
            dst[2] *= inv;
            dst[3] *= inv;
          }
           
          return dst;
        }
        
        // 3) from 3 euler angles, order XYZ
        if(def.angles_xyz){
          
          var ax = -0.5 *  def.angles_xyz[0];
          var ay = -0.5 *  def.angles_xyz[1];
          var az = -0.5 *  def.angles_xyz[2];
          
          var rotX = [Math.cos(ax), Math.sin(ax), 0, 0];
          var rotY = [Math.cos(ay), 0, Math.sin(ay), 0];
          var rotZ = [Math.cos(az), 0, 0, Math.sin(az)];
          
          Rotation.applyToRotation(rotY, rotZ, dst);
          Rotation.applyToRotation(rotX, dst, dst);
     
          return dst;
        }


      }
      
      
      //
      // ... to be continued ...
      //
      
    };








    ////////////////////////////////////////////////////////////////////////////////
    //
    // SCALAR
    //
    ////////////////////////////////////////////////////////////////////////////////
    /**
     * Scalar as a simple number.
     *
     * Note: Only functions that were required for the EasyCam to work are implemented.
     *
     * @namespace
     */
    var Scalar = {
      
      /**
       * Linear interpolation between A and B using t[0,1]
       */
      mix : function(a, b, t){
        return a * (1-t) + b * t;
      },
         
      /**
       * modifying t as a function of smoothstep(0,1,t);
       */
      smoothstep : function(x) {
        return x * x * (3 - 2 * x);
      },
      
      /**
       * modifying t as a function of smootherstep(0,1,t);
       */
      smootherstep : function(t) {
        return x * x * x * (x * (x * 6 - 15) + 10);
      },
      
    };





    ////////////////////////////////////////////////////////////////////////////////
    //
    // VEC3
    //
    ////////////////////////////////////////////////////////////////////////////////
    /**
     * Vec3 as a 3D vector (Array)
     *
     * @namespace
     */
    var Vec3 = 
    {
      
      assert : function(dst){
        return ((dst === undefined) || (dst.constructor !== Array)) ? [0, 0, 0] : dst;
      },
      
      isScalar : function(arg){
        // TODO: do some profiling to figure out what fails
        return (arg !== undefined) && (arg.constructor !== Array);
        // return typeof(arg) === 'number';
      },
      
      /** addition: <pre> dst = a + b </pre>  */
      add : function(a, b, dst) {
        dst = this.assert(dst);
        if(this.isScalar(b)){
          dst[0] = a[0] + b;
          dst[1] = a[1] + b;
          dst[2] = a[2] + b;
        } else {
          dst[0] = a[0] + b[0];
          dst[1] = a[1] + b[1];
          dst[2] = a[2] + b[2];
        }
        return dst;
      },

      /** componentwise multiplication: <pre> dst = a * b </pre>  */
      mult : function(a, b, dst){
        dst = this.assert(dst);
        if(this.isScalar(b)){
          dst[0] = a[0] * b;
          dst[1] = a[1] * b;
          dst[2] = a[2] * b;
        } else {
          dst[0] = a[0] * b[0];
          dst[1] = a[1] * b[1];
          dst[2] = a[2] * b[2];
        }
        return dst;
      },

      /** squared length  */
      magSq : function(a) {
        return a[0]*a[0] + a[1]*a[1] + a[2]*a[2];
      },
      
      /** length  */
      mag : function(a) {
        return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
      },
      
      /** dot-product  */
      dot : function(a, b) {
        return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
      },
      
      /** cross-product  */
      cross : function(a, b, dst) {
        dst = this.assert(dst);
        dst[0] = a[1] * b[2] - a[2] * b[1];
        dst[1] = a[2] * b[0] - a[0] * b[2];
        dst[2] = a[0] * b[1] - a[1] * b[0];
        return dst;
      },

      /** angle  */
      angle : function(v1, v2){

        var normProduct = this.mag(v1) * this.mag(v2);
        if (normProduct === 0.0) {
          return 0.0; // at least one vector is of zero length
        }
        
        var dot = this.dot(v1, v2);
        var threshold = normProduct * 0.9999;
        if ((dot < -threshold) || (dot > threshold)) {
          // the vectors are almost aligned, compute using the sine
          var v3 = this.cross(v1, v2);
          if (dot >= 0) {
            return Math.asin(this.mag(v3) / normProduct);
          } else {
            return Math.PI - Math.asin(this.mag(v3) / normProduct);
          }
        }
        
        // the vectors are sufficiently separated to use the cosine
        return Math.acos(dot / normProduct);
      },
      
      /** linear interpolation: <pre> dst = a * (1 - t) + b * t </pre> */
      mix(a, b, t, dst) {
        dst = this.assert(dst);
        dst[0] = Scalar.mix(a[0], b[0], t); 
        dst[1] = Scalar.mix(a[1], b[1], t);
        dst[2] = Scalar.mix(a[2], b[2], t);
        return dst;
      },
      
      
      //
      // ... to be continued ...
      //
      
    };








      
    ////////////////////////////////////////////////////////////////////////////////
    //
    // public objects
    //
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * @static
     */
    EasyCam.INFO = INFO; // make static
    Object.freeze(INFO); // and constant


    ext = (ext !== undefined) ? ext : {};

    /**
     * @memberof Dw
     */
    ext.EasyCam = EasyCam;
    /**
     * @memberof Dw
     */
    ext.DampedAction = DampedAction;
    /**
     * @memberof Dw
     */
    ext.Interpolation = Interpolation;
    /**
     * @memberof Dw
     */
    ext.Rotation = Rotation;
    /**
     * @memberof Dw
     */
    ext.Vec3 = Vec3;
    /**
     * @memberof Dw
     */
    ext.Scalar = Scalar;

    return ext;
      

    })(Dw);












    ////////////////////////////////////////////////////////////////////////////////
    //
    // p5 patches, bug fixes, workarounds, ...
    //
    ////////////////////////////////////////////////////////////////////////////////


    /**
     * @submodule Camera
     * @for p5
     */




    if(p5){
      
        
      /**
       * p5.EasyCam creator function. 
       * Arguments are optional, and equal to the default EasyCam constructor.
       * @return {EasyCam} a new EasyCam
       */
      p5.prototype.createEasyCam = function(/* p5.RendererGL, {state} */){
        
        var renderer = this._renderer;
        var args     = arguments[0];
        
        if(arguments[0] instanceof p5.RendererGL){
          renderer = arguments[0];
          args     = arguments[1]; // could still be undefined, which is fine
        } 
        
        return new Dw.EasyCam(renderer, args); 
      }
      
      

      /**
       * Overriding the current p5.ortho();
       *
       * p5 v0.5.16
       * temporary bugfix for https://github.com/processing/p5.js/pull/2463.
       *
       * @param  {Number} left   camera frustum left plane
       * @param  {Number} right  camera frustum right plane
       * @param  {Number} bottom camera frustum bottom plane
       * @param  {Number} top    camera frustum top plane
       * @param  {Number} near   camera frustum near plane
       * @param  {Number} far    camera frustum far plane
       * @return {p5}            the p5 object
       */
      p5.prototype.ortho = function(){
        this._renderer.ortho.apply(this._renderer, arguments);
        return this;
      };
      

      
      p5.RendererGL.prototype.ortho = function(left, right, bottom, top, near, far) {

        if(left   === undefined) left   = -this.width  / 2;
        if(right  === undefined) right  = +this.width  / 2;
        if(bottom === undefined) bottom = -this.height / 2;
        if(top    === undefined) top    = +this.height / 2;
        if(near   === undefined) near   =  0;
        if(far    === undefined) far    =  Math.max(this.width, this.height);

        var w = right - left;
        var h = top - bottom;
        var d = far - near;

        var x = +2.0 / w;
        var y = +2.0 / h;
        var z = -2.0 / d;

        var tx = -(right + left) / w;
        var ty = -(top + bottom) / h;
        var tz = -(far + near) / d;

        this.uPMatrix = p5.Matrix.identity();
        this.uPMatrix.set(  x,  0,  0,  0,
                            0, -y,  0,  0,
                            0,  0,  z,  0,
                           tx, ty, tz,  1);

        this._curCamera = 'custom';
        
      };
        
    }















    return (_easyCam = Dw);
  }

  /**
   * Build one engine core bound to a p5 instance. Everything below the shims is the original engine
   * (renamed + de-UI'd); top-level state lives in this closure, so instances are independent.
   * @param {p5} $p p5 instance (WEBGL canvas is created in setup())
   * @param {Object} $host host services created by InkEngine (options, clock, input, events)
   */
  function createInkCore($p, $host) {
  // ------------------------------------------------------------------------------------------------
  // Per-instance stand-ins for the browser globals the original global-mode sketch relied on.
  // The original lived on `window`; here every engine instance gets its own copies, so several
  // engines can coexist on one page and nothing leaks into the real window.
  // ------------------------------------------------------------------------------------------------
  /** Feature flags and cross-file globals that the original read from `window` / index.html. */
  const $win = {
    doDemo: false, // index.html: let doDemo = false (artist mode)
    doEffect: true, // index.html: let doEffect = true (distort shader on)
    doSpotNoise: true, // index.html: let doSpotNoise = true (paper spot noise)
    loopWaitDuration: 30000, // index.html: var loopWaitDuration = 30000
    loopToggle: 0, // index.html: window.loopToggle (artist default 0 = play once)
    panelScale: 0.9,
    DEBUG_MODE: false,
    APP_MODE: 'artist',
    fxhashDebugMode: false,
    addEventListener(type, fn, opts) {
      $host.listen(window, type, fn, opts);
    },
    removeEventListener() {},
    dispatchEvent(ev) {
      $host.emit(String(ev.type).replace(/^inkfield:/, ''), ev.detail);
      return true;
    },
  };
  Object.assign($win, $host.flags || {});
  /** `document` stand-in: no site DOM exists, so lookups return null and the canvas is p5's. */
  const $doc = {
    getElementById: () => null,
    querySelector: (sel) => (sel === 'canvas' ? $p.canvas : null),
    querySelectorAll: () => [],
    createElement: (tag) => document.createElement(tag),
    body: { appendChild() {}, removeChild() {}, innerHTML: '' },
    documentElement: { style: { setProperty() {} } },
    addEventListener(type, fn, opts) {
      $host.listen(document, type, fn, opts);
    },
  };
  /** In-memory replacement for sessionStorage/localStorage (the site used them across reloads). */
  const memStorage = () => {
    const m = new Map();
    return {
      getItem: (k) => (m.has(k) ? m.get(k) : null),
      setItem: (k, v) => m.set(k, String(v)),
      removeItem: (k) => m.delete(k),
      clear: () => m.clear(),
    };
  };
  const $store = { session: memStorage(), local: memStorage() };
  /** URL flags the original parsed from location.search (e.g. "?_dist:1"); empty by default. */
  const $env = { location: { search: $host.urlFlags || '', hash: '' } };
  /** Pointer state (real p5 mouse, or synthetic points fed through the API). */
  const $in = $host.input.proxy($p);
  /** p5.EasyCam namespace (bundled); undefined when the host disabled it (options.easycam === false). */
  const Dw = $host.easycam ? loadEasyCam() : undefined;
  /** Time source; replaces p5 millis() so playback can run on a deterministic frame clock. */
  const $clock = () => $host.now();

    // ================================== restored engine ==================================
    var padfactor, dashPenDown, dashTravelled, flyBrushEnd, size, nowSize; // [restored] were implicit globals in the original
    function loadShaderFromSources(vertPath, fragPath) {
      var vertSrc = SHADER_SOURCES && SHADER_SOURCES[vertPath];
      var fragSrc = SHADER_SOURCES && SHADER_SOURCES[fragPath];
      if (vertSrc && fragSrc && typeof $p.createShader === 'function') {
        return $p.createShader(vertSrc, fragSrc);
      }
      return $win['loadShader'](vertPath, fragPath);
    }
    class Crandom {
      constructor() {
        this.globalCount = 0;
        this.callHistory = [];
        this.enableHistory = false;
        this.currentSeed = null;
      }
      reset() {
        this.globalCount = 0;
        this.callHistory = [];
      }
      getCount() {
        return this.globalCount;
      }
      setSeed(seed) {
        this.currentSeed = seed;
      }
      getHistory() {
        return this.callHistory;
      }
      setHistoryEnabled(enabled) {
        this.enableHistory = enabled;
      }
      random(...args) {
        this.globalCount++;
        if (this.enableHistory) {
          const stack = new Error().stack;
          const _j206 = stack.split('\n')[2];
          this.callHistory.push({
            count: this.globalCount,
            args: args,
            caller: _j206,
            seed: this.currentSeed,
            timestamp: Date.now(),
          });
        }
        if (args.length === 0) {
          return $p.random();
        } else if (args.length === 1) {
          if (Array.isArray(args[0])) {
            return $p.random(args[0]);
          } else {
            return $p.random(args[0]);
          }
        } else if (args.length === 2) {
          return $p.random(args[0], args[1]);
        }
      }
      printStats() {
        console.log('═══════════════════════════════════════');
        console.log('📊 Crandom 統計信息');
        console.log('═══════════════════════════════════════');
        console.log(`總調用次數: ${this.globalCount}`);
        console.log(`當前種子: ${this.currentSeed || 'N/A'}`);
        console.log(`歷史記錄: ${this.enableHistory ? '啟用' : '禁用'}`);
        if (this.enableHistory) {
          console.log(`記錄條數: ${this.callHistory.length}`);
        }
        console.log('═══════════════════════════════════════');
      }
      printRecentHistory(n = 10) {
        if (!this.enableHistory) {
          console.warn('⚠️ 歷史記錄未啟用');
          return;
        }
        const _j207 = this.callHistory.slice(-n);
        console.log('═══════════════════════════════════════');
        console.log(`📝 最近 ${_j207.length} 條 random() 調用`);
        console.log('═══════════════════════════════════════');
        _j207.forEach((_j637, _j315) => {
          console.log(`[${_j637.count}] args: [${_j637.args.join(', ')}]`);
          if (_j637.caller) {
            console.log(`    位置: ${_j637.caller.trim()}`);
          }
        });
        console.log('═══════════════════════════════════════');
      }
      static compare(count1, count2, label1 = 'Point 1', label2 = 'Point 2') {
        const _j208 = count2 - count1;
        console.log('═══════════════════════════════════════');
        console.log('🔍 Crandom 計數比較');
        console.log('═══════════════════════════════════════');
        console.log(`${label1}: ${count1}`);
        console.log(`${label2}: ${count2}`);
        console.log(`差異: ${_j208 > 0 ? '+' : ''}${_j208}`);
        console.log('═══════════════════════════════════════');
        return _j208;
      }
    }
    class RandomCheckpointDebugger {
      constructor() {
        this.checkpoints = [];
        this.currentStrokeCheckpoints = [];
        this.recordingCheckpoints = [];
        this.playbackCheckpoints = [];
        this.enabled = true;
      }
      checkpoint(name, category = 'general') {
        if (!this.enabled) return;
        const count = $win.crandom.getCount();
        const checkpoint = {
          name: name,
          category: category,
          count: count,
          timestamp: Date.now(),
        };
        this.currentStrokeCheckpoints.push(checkpoint);
      }
      resetStroke() {
        this.currentStrokeCheckpoints = [];
      }
      saveStroke(mode, strokeNumber) {
        const strokeData = {
          mode: mode,
          strokeNumber: strokeNumber,
          checkpoints: [...this.currentStrokeCheckpoints],
          totalCount: $win.crandom.getCount(),
        };
        if (mode === 'recording') {
          this.recordingCheckpoints.push(strokeData);
        } else if (mode === 'playback') {
          this.playbackCheckpoints.push(strokeData);
        }
      }
      compareStroke(strokeNumber) {
        const recording = this.recordingCheckpoints.find((s) => s.strokeNumber === strokeNumber);
        const playback = this.playbackCheckpoints.find((s) => s.strokeNumber === strokeNumber);
        if (!recording) return;
        if (!playback) {
          console.error(`❌ 找不到播放筆劃 ${strokeNumber}`);
          return;
        }
        const _j209 = playback.totalCount - recording.totalCount;
        const percent = ((_j209 / recording.totalCount) * 100).toFixed(2) + '%';
        const icon = Math.abs(_j209) < 50 ? '✅' : Math.abs(_j209) < 200 ? '⚠️' : '❌';
        console.log(`${icon} 筆劃 ${strokeNumber} | 差異: ${_j209 > 0 ? '+' : ''}${_j209} (${percent})`);
        const recDeltas = this.calculateDeltas(recording.checkpoints);
        const playDeltas = this.calculateDeltas(playback.checkpoints);
        const _j210 = new Set([...recDeltas.keys(), ...playDeltas.keys()]);
        const _j211 = Array.from(_j210).sort((a, b) => {
          const indexA = Array.from(recDeltas.keys()).indexOf(a);
          const _j212 = Array.from(recDeltas.keys()).indexOf(b);
          if (indexA === -1 && _j212 === -1) return 0;
          if (indexA === -1) return 1;
          if (_j212 === -1) return -1;
          return indexA - _j212;
        });
        let _j213 = 0;
        const _j214 = [];
        for (const stage of _j211) {
          const recCount = recDeltas.get(stage) || 0;
          const _j215 = playDeltas.get(stage) || 0;
          const _j208 = _j215 - recCount;
          _j213 += _j208;
          if (Math.abs(_j208) > 0) {
            _j214.push({
              stage: stage,
              recordingCount: recCount,
              playbackCount: _j215,
              difference: _j208,
            });
          }
        }
        if (Math.abs(playback.totalCount - recording.totalCount) > 200) {
          _j214.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
          const _j216 = _j214.filter((d) => Math.abs(d.difference) > 50);
          if (_j216.length > 0) {
            console.log('   ⚠️ 主要差異階段:');
            for (let i = 0; i < Math.min(2, _j216.length); i++) {
              const d = _j216[i];
              const icon = d.difference > 0 ? '🔺' : '🔻';
              console.log(`      ${icon} ${d.stage}: ${d.difference}`);
            }
          }
        }
      }
      calculateDeltas(checkpoints) {
        const _j217 = new Map();
        for (let i = 0; i < checkpoints.length; i++) {
          const _j218 = checkpoints[i];
          const nextPt = checkpoints[i + 1];
          if (nextPt) {
            const _j220 = `${_j218.name} → ${nextPt.name}`;
            const _j221 = nextPt.count - _j218.count;
            _j217.set(_j220, _j221);
          }
        }
        return _j217;
      }
      clear() {
        this.recordingCheckpoints = [];
        this.playbackCheckpoints = [];
        this.currentStrokeCheckpoints = [];
      }
      setEnabled(enabled) {
        this.enabled = enabled;
      }
    }
    $win.crandom = new Crandom();
    $win.crandomDebugger = new RandomCheckpointDebugger();
    const COLOR_PALETTE = [
      {
        id: 0,
        name: 'black',
        displayName: '黑色',
        rgb: [26, 26, 26],
        hex: '#1A1A1A',
      },
      {
        id: 1,
        name: 'white',
        displayName: '白色',
        rgb: [242, 242, 242],
        hex: '#F2F2F2',
      },
      {
        id: 29,
        name: 'medium_gray',
        displayName: '中灰色',
        rgb: [155, 155, 155],
        hex: '#9B9B9B',
      },
      {
        id: 2,
        name: 'dark_gray',
        displayName: '深灰色',
        rgb: [47, 47, 47],
        hex: '#2F2F2F',
      },
      {
        id: 3,
        name: 'medium_gray_new',
        displayName: '中灰色',
        rgb: [85, 85, 85],
        hex: '#555555',
      },
      {
        id: 4,
        name: 'light_gray_new',
        displayName: '浅灰色',
        rgb: [150, 150, 150],
        hex: '#969696',
      },
      {
        id: 12,
        name: 'light_gray',
        displayName: '浅灰色',
        rgb: [136, 122, 125],
        hex: '#847A7D',
      },
      {
        id: 22,
        name: 'silver',
        displayName: '银灰色',
        rgb: [181, 180, 185],
        hex: '#B5B4B9',
      },
      {
        id: 13,
        name: 'blue_gray',
        displayName: '蓝灰色',
        rgb: [138, 57, 26],
        hex: '#8A391A',
      },
      {
        id: 19,
        name: 'gray_brown',
        displayName: '灰褐色',
        rgb: [128, 125, 114],
        hex: '#807D72',
      },
      {
        id: 26,
        name: 'khaki',
        displayName: '卡其色',
        rgb: [165, 162, 147],
        hex: '#A5A293',
      },
      {
        id: 20,
        name: 'sage_gray',
        displayName: '鼠尾草灰',
        rgb: [121, 132, 129],
        hex: '#798481',
      },
      {
        id: 24,
        name: 'gray_green',
        displayName: '青灰色',
        rgb: [148, 162, 158],
        hex: '#94A29E',
      },
      {
        id: 28,
        name: 'mauve_gray',
        displayName: '淡紫灰',
        rgb: [174, 161, 164],
        hex: '#AEA1A4',
      },
      {
        id: 23,
        name: 'beige',
        displayName: '米色',
        rgb: [235, 220, 201],
        hex: '#EBDCC9',
      },
      {
        id: 25,
        name: 'tan',
        displayName: '驼色',
        rgb: [210, 169, 151],
        hex: '#D2A997',
      },
      {
        id: 14,
        name: 'terra_cotta',
        displayName: '赭石色',
        rgb: [112, 79, 57],
        hex: '#704F39',
      },
      {
        id: 21,
        name: 'brick_red',
        displayName: '砖红色',
        rgb: [159, 114, 85],
        hex: '#9F7255',
      },
      {
        id: 7,
        name: 'brown',
        displayName: '咖啡色',
        rgb: [175, 140, 89],
        hex: '#AF8C59',
      },
      {
        id: 8,
        name: 'green_dark',
        displayName: '墨綠色',
        rgb: [4, 130, 130],
        hex: '#048282',
      },
      {
        id: 5,
        name: 'green',
        displayName: '绿色',
        rgb: [63, 77, 24],
        hex: '#3F4D18',
      },
      {
        id: 15,
        name: 'olive_green',
        displayName: '橄榄绿',
        rgb: [168, 200, 72],
        hex: '#A8C848',
      },
      {
        id: 11,
        name: 'lime',
        displayName: '浅绿色',
        rgb: [138, 149, 73],
        hex: '#8A9549',
      },
      {
        id: 9,
        name: 'blue_dark',
        displayName: '深蓝色',
        rgb: [57, 80, 192],
        hex: '#3950C0',
      },
      {
        id: 32,
        name: 'blue',
        displayName: '蓝色',
        rgb: [2, 66, 109],
        hex: '#02426D',
      },
      {
        id: 10,
        name: 'purple',
        displayName: '紫色',
        rgb: [140, 106, 172],
        hex: '#8C6AAC',
      },
      {
        id: 17,
        name: 'wine_red',
        displayName: '酒红色',
        rgb: [128, 49, 52],
        hex: '#803134',
      },
      {
        id: 27,
        name: 'dusty_rose',
        displayName: '雾玫瑰色',
        rgb: [203, 243, 251],
        hex: '#CBF3FB',
      },
      {
        id: 16,
        name: 'pink',
        displayName: '粉红色',
        rgb: [240, 170, 207],
        hex: '#F0AACF',
      },
      {
        id: 30,
        name: 'red',
        displayName: '红色',
        rgb: [208, 34, 63],
        hex: '#D02340',
      },
      {
        id: 18,
        name: 'gold_orange',
        displayName: '金橙色',
        rgb: [233, 175, 52],
        hex: '#E9AF34',
      },
      {
        id: 6,
        name: 'orange',
        displayName: '橙色',
        rgb: [255, 160, 62],
        hex: '#FEA03E',
      },
      {
        id: 31,
        name: 'yellow',
        displayName: '黄色',
        rgb: [255, 249, 56],
        hex: '#FFF938',
      },
      {
        id: 34,
        name: 'coral',
        displayName: '珊瑚色',
        rgb: [255, 127, 80],
        hex: '#FF7F50',
      },
      {
        id: 35,
        name: 'mint',
        displayName: '薄荷绿',
        rgb: [152, 251, 152],
        hex: '#98FB98',
      },
    ];
    function buildColorTable() {
      const _j223 = {};
      COLOR_PALETTE.forEach((color) => {
        _j223[color.id] = {
          name: color.name,
          rgb: color.rgb,
          channel: colorChannelsOf(color.rgb),
        };
      });
      return _j223;
    }
    function colorChannelsOf(rgb) {
      const [r, g, b] = rgb;
      const hasR = r > 20;
      const hasG = g > 20;
      const hasB = b > 20;
      if (hasR && hasG && hasB) return 'rgb';
      if (hasR && hasG) return 'rg';
      if (hasR && hasB) return 'rb';
      if (hasG && hasB) return 'gb';
      if (hasR) return 'r';
      if (hasG) return 'g';
      if (hasB) return 'b';
      return 'rgb';
    }
    function listColors() {
      return COLOR_PALETTE.map((color) => ({
        id: color.id,
        name: color.name,
        displayName: color.displayName,
        hex: color.hex,
      }));
    }
    function getColorById(id) {
      return COLOR_PALETTE.find((c) => c.id === id);
    }
    function getColorByName(name) {
      return COLOR_PALETTE.find((c) => c.name === name);
    }
    let paperUnusedCache = null;
    let paperUnusedCounter = 0;
    const PAPER_MAX_SIZE = 2000;
    function generatePaperTexture(tileSize = 120, _j1535 = 12, _j1536 = 10, contrastPow = 5) {
      const paperW = Math.min($p.width, PAPER_MAX_SIZE);
      const paperH = Math.min($p.height, PAPER_MAX_SIZE);
      const _j234 = $p.width > PAPER_MAX_SIZE || $p.height > PAPER_MAX_SIZE;
      $p.randomSeed(seed);
      const tile = createPaperStampTile(tileSize, contrastPow);
      const _j236 = $p.createGraphics(paperW, paperH, $p.P2D);
      const paperGfx = $p.createGraphics(paperW, paperH, $p.P2D);
      for (let i = -tileSize; i < paperW + tileSize; i += paperW / 500) {
        for (let j = -tileSize; j < paperH + tileSize; j += _j1535) {
          _j236.image(tile, i, j + ($p.noise(i * 0.1, j * 1.0) - 0.5) * _j1536);
        }
      }
      tile.remove();
      if ($win.doSpotNoise) {
        padfactor = 300;
        paperGfx.blendMode($p.DIFFERENCE);
        for (let i = 0; i < 400; i++) {
          x = $p.random(paperW);
          y = $p.random(paperH);
          paperGfx.push();
          paperGfx.strokeWeight($p.random(1, 2));
          paperGfx.stroke(0, $p.random(10, 250));
          paperGfx.noFill();
          paperGfx.bezier(
            $p.random(-padfactor, paperW + padfactor),
            $p.random(-padfactor, paperH + padfactor),
            $p.random(-padfactor, paperW + padfactor),
            $p.random(-padfactor, paperH + padfactor),
            $p.random(-padfactor, paperW + padfactor),
            $p.random(-padfactor, paperH + padfactor),
            $p.random(-padfactor, paperW + padfactor),
            $p.random(-padfactor, paperH + padfactor),
          );
          paperGfx.pop();
        }
        _j236.blendMode($p.DIFFERENCE);
        _j236.image(paperGfx, 0, 0, paperW, paperH);
        paperGfx.remove();
      }
      if (_j234) {
        const _j238 = $p.createGraphics($p.width, $p.height);
        _j238.image(_j236, 0, 0, $p.width, $p.height);
        _j236.remove();
        return _j238;
      }
      return _j236;
    }
    function createPaperStampTile(stampSize = 64, contrastPow = 0.5) {
      const tile = $p.createGraphics(stampSize, stampSize);
      tile.pixelDensity(1);
      tile.noSmooth();
      tile.clear();
      tile.noFill();
      tile.translate(stampSize / 2, stampSize / 2);
      tile.strokeWeight(1.5);
      for (let i = 0; i < 100; i++) {
        const _j239 = 0.5 + $win.crandom.random(0, 1) * 0.5;
        const _j240 = $p.pow(_j239, contrastPow) * 255;
        tile.stroke(_j240, _j240, _j240, 255);
        const radius = $win.crandom.random() * stampSize * 0.5;
        const angle = $win.crandom.random() * $p.TWO_PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        tile.point(x, y);
      }
      tile.resetMatrix();
      return tile;
    }
    let bugPoints = [];
    function createBugShape(x, y, size, seed, shapeType = null) {
      $p.randomSeed(seed);
      $p.noiseSeed(seed);
      if (shapeType === null || shapeType === undefined) {
        shapeType = $p.floor($win.crandom.random(0, 2));
        shapeType = $p.floor($win.crandom.random(2, 4));
      } else {
        shapeType = $p.floor($p.constrain(shapeType, 0, 3));
      }
      switch (shapeType) {
        case 0:
          return bugShapeBlob(size * 1.3, seed);
        case 1:
          return bugShapeStrip(size, seed);
        case 2:
          return bugShapeLightning(size, seed);
        case 3:
          return bugShapeLightningAlt(size, seed);
        default:
          return bugShapeCluster(size, seed);
      }
    }
    function bugShapeCluster(size, seed) {
      $p.randomSeed(seed);
      $p.noiseSeed(seed);
      const circles = [];
      const _j242 = 8;
      const items = [];
      for (let i = 0; i < _j242; i++) {
        items.push({
          numCirclesRand: i === 0 ? $win.crandom.random(3, 8) : null,
          angle: $win.crandom.random($p.TWO_PI),
          distance: $win.crandom.random(0, size * 0.4),
          circleSize: $win.crandom.random(size * 0.4, size * 0.8),
        });
      }
      const _j244 = $p.floor(items[0].numCirclesRand);
      for (let i = 0; i < _j244; i++) {
        const _j245 = items[i];
        circles.push({
          x: $p.cos(_j245.angle) * _j245.distance,
          y: $p.sin(_j245.angle) * _j245.distance,
          radius: _j245.circleSize,
        });
      }
      return {
        type: 'cluster',
        circles,
      };
    }
    function bugShapeBlob(size, seed) {
      $p.randomSeed(seed);
      $p.noiseSeed(seed);
      const _j246 = [];
      const _j247 = 3;
      const _j248 = 48;
      const items = [];
      const _j249 = $win.crandom.random(1, 4);
      const _j250 = $win.crandom.random(0.4, 0.6);
      const _j251 = $p.floor(_j249);
      for (let _j252 = 0; _j252 < _j247; _j252++) {
        const blobCfg = {
          offsetX: $win.crandom.random(-size * 0.2, size * 0.2),
          offsetY: $win.crandom.random(-size * 0.2, size * 0.2),
          layerRotation: $win.crandom.random(-$p.PI / 4, $p.PI / 4),
          sizeVariation: $win.crandom.random(0.85, 1.15),
          numVerticesRand: $win.crandom.random(36, 48),
          noiseOffset: $win.crandom.random(1000) + _j252 * 500,
        };
        items.push(blobCfg);
      }
      for (let _j252 = 0; _j252 < _j251; _j252++) {
        const blobCfg = items[_j252];
        const offsetX = blobCfg.offsetX;
        const offsetY = blobCfg.offsetY;
        const layerRotation = blobCfg.layerRotation;
        const sizeVariation = blobCfg.sizeVariation;
        const blobSize = size * sizeVariation;
        const numVerts = $p.floor(blobCfg.numVerticesRand);
        const noiseOffset = blobCfg.noiseOffset;
        const vertices = [];
        for (let i = 0; i < numVerts; i++) {
          const angle = (i / numVerts) * $p.TWO_PI;
          const _j257 = $p.noise($p.cos(angle) * 1.0 + noiseOffset, $p.sin(angle) * 1.0);
          const _j258 = $p.noise($p.cos(angle) * 2.5 + noiseOffset + 100, $p.sin(angle) * 2.5);
          const _j259 = $p.noise($p.cos(angle) * 5.0 + noiseOffset + 200, $p.sin(angle) * 5.0);
          const _j260 = _j257 * 0.5 + _j258 * 0.3 + _j259 * 0.2;
          const radius = blobSize * (0.4 + _j260 * _j250);
          const _j261 = $p.cos(angle) * radius;
          const _j262 = $p.sin(angle) * radius;
          vertices.push({
            x: _j261,
            y: _j262,
          });
        }
        const _j263 = [];
        for (let i = 0; i < vertices.length; i++) {
          const prevPt = vertices[(i - 1 + vertices.length) % vertices.length];
          const curPt = vertices[i];
          const nextPt = vertices[(i + 1) % vertices.length];
          _j263.push({
            x: (prevPt.x + curPt.x * 2 + nextPt.x) / 4,
            y: (prevPt.y + curPt.y * 2 + nextPt.y) / 4,
          });
        }
        for (let v of _j263) {
          const rotatedX = v.x * $p.cos(layerRotation) - v.y * $p.sin(layerRotation);
          const _j266 = v.x * $p.sin(layerRotation) + v.y * $p.cos(layerRotation);
          _j246.push({
            x: rotatedX + offsetX,
            y: _j266 + offsetY,
          });
        }
      }
      return {
        type: 'blob',
        vertices: _j246,
      };
    }
    function bugShapeStrip(size, seed) {
      $p.randomSeed(seed);
      $p.noiseSeed(seed);
      const _j246 = [];
      const _j247 = 3;
      const items = [];
      const _j249 = $win.crandom.random(1, 4);
      const _j250 = $win.crandom.random(0.15, 0.35);
      const _j251 = $p.floor(_j249);
      let rotation = $win.crandom.random($p.TWO_PI);
      for (let _j252 = 0; _j252 < _j247; _j252++) {
        const blobCfg = {
          offsetX: $win.crandom.random(-size * 0.2, size * 0.2),
          offsetY: $win.crandom.random(-size * 0.2, size * 0.2),
          layerRotationOffset: $win.crandom.random(-0.5, 0.5),
          sizeVariation: $win.crandom.random(0.85, 1.15),
          lengthRatio: $win.crandom.random(1.0, 4.0),
          stripWidth: $win.crandom.random(0.5, 0.8),
          numVerticesRand: $win.crandom.random(32, 48),
          noiseOffset: $win.crandom.random(1000) + _j252 * 500,
        };
        items.push(blobCfg);
      }
      for (let _j252 = 0; _j252 < _j251; _j252++) {
        const blobCfg = items[_j252];
        const offsetX = blobCfg.offsetX;
        const offsetY = blobCfg.offsetY;
        const layerRotation = rotation + blobCfg.layerRotationOffset;
        const sizeVariation = blobCfg.sizeVariation;
        const blobSize = size * sizeVariation;
        const lengthRatio = blobCfg.lengthRatio;
        const _j267 = blobSize * lengthRatio;
        const stripWidth = blobSize * blobCfg.stripWidth;
        const numVerts = $p.floor(blobCfg.numVerticesRand);
        const noiseOffset = blobCfg.noiseOffset;
        const vertices = [];
        for (let i = 0; i < numVerts; i++) {
          let _j261, _j262;
          if (i < numVerts / 2) {
            const _j268 = i / (numVerts / 2);
            _j261 = (_j268 - 0.5) * _j267;
            const _j269 = $p.noise(_j268 * 1.5 + noiseOffset, _j252 * 50);
            _j262 = -stripWidth / 2 + (_j269 - 0.5) * stripWidth * _j250;
          } else {
            const _j268 = (numVerts - 1 - i) / (numVerts / 2);
            _j261 = (_j268 - 0.5) * _j267;
            const _j269 = $p.noise(_j268 * 1.5 + noiseOffset, 100 + _j252 * 50);
            _j262 = stripWidth / 2 + (_j269 - 0.5) * stripWidth * _j250;
          }
          vertices.push({
            x: _j261,
            y: _j262,
          });
        }
        const _j263 = [];
        for (let i = 0; i < vertices.length; i++) {
          const prevPt = vertices[(i - 1 + vertices.length) % vertices.length];
          const curPt = vertices[i];
          const nextPt = vertices[(i + 1) % vertices.length];
          _j263.push({
            x: (prevPt.x + curPt.x * 2 + nextPt.x) / 4,
            y: (prevPt.y + curPt.y * 2 + nextPt.y) / 4,
          });
        }
        for (let v of _j263) {
          const rotatedX = v.x * $p.cos(layerRotation) - v.y * $p.sin(layerRotation);
          const _j266 = v.x * $p.sin(layerRotation) + v.y * $p.cos(layerRotation);
          _j246.push({
            x: rotatedX + offsetX,
            y: _j266 + offsetY,
          });
        }
      }
      return {
        type: 'strip',
        vertices: _j246,
      };
    }
    function bugShapeLightning(size, seed) {
      $p.randomSeed(seed);
      $p.noiseSeed(seed);
      let _j246 = [];
      const _j270 = 2;
      const _j271 = 30;
      const _j272 = 8;
      const _j273 = 300;
      const items = [];
      const _j274 = $win.crandom.random(1, 3);
      const _j275 = $p.floor(_j274);
      for (let _j276 = 0; _j276 < _j270; _j276++) {
        const branchCfg = {
          branchAngle: $win.crandom.random($p.TWO_PI),
          branchOffsetX: $win.crandom.random(-size * 0.2, size * 0.2),
          branchOffsetY: $win.crandom.random(-size * 0.2, size * 0.2),
          numLRand: $win.crandom.random(0, 1),
          numStepsRand: $win.crandom.random(5, 15),
          stepSize: size * $win.crandom.random(0.2, 0.35),
          noiseScale: $win.crandom.random(0.1, 0.2),
          noiseStrength: $win.crandom.random(0.2, 0.4),
          thickness: size * $win.crandom.random(0.5, 0.7),
          stepRandoms: [],
          thicknessRandoms: [],
        };
        for (let step = 0; step < _j271; step++) {
          const stepRandoms = {
            stepVariation: $win.crandom.random(0.7, 1.3),
            subBranchRand: $win.crandom.random(),
            subBranchLengthRand: $win.crandom.random(3, 8),
            subBranchAngle: $win.crandom.random(-$p.PI / 3, $p.PI / 3),
          };
          branchCfg.stepRandoms.push(stepRandoms);
        }
        for (let i = 0; i < _j273; i++) {
          branchCfg.thicknessRandoms.push($win.crandom.random(0.9, 1.1));
        }
        items.push(branchCfg);
      }
      for (let _j276 = 0; _j276 < _j275; _j276++) {
        const branchCfg = items[_j276];
        let branchAngle = branchCfg.branchAngle;
        let branchOffsetX = branchCfg.branchOffsetX;
        let branchOffsetY = branchCfg.branchOffsetY;
        let _j278 = branchCfg.numLRand > 0.2 ? 1 : 2;
        let _j279 = $p.floor(branchCfg.numStepsRand) * _j278;
        let stepSize = branchCfg.stepSize;
        let noiseScale = branchCfg.noiseScale;
        let noiseStrength = branchCfg.noiseStrength;
        let thickness = branchCfg.thickness;
        let pathPoints = [];
        let _j280 = branchOffsetX;
        let _j281 = branchOffsetY;
        let angle = branchAngle;
        pathPoints.push({
          x: _j280,
          y: _j281,
        });
        for (let step = 0; step < _j279; step++) {
          const stepRandoms = branchCfg.stepRandoms[step];
          const t = step / _j279;
          const _j283 = $p.noise(step * noiseScale, seed * 0.01);
          const _j284 = $p.noise(step * noiseScale + 100, seed * 0.01);
          const angleOffset = (_j283 - 0.5) * $p.PI * noiseStrength;
          angle += angleOffset;
          const stepVariation = stepRandoms.stepVariation;
          const _j285 = stepSize * stepVariation;
          _j280 += $p.cos(angle) * _j285;
          _j281 += $p.sin(angle) * _j285;
          pathPoints.push({
            x: _j280,
            y: _j281,
          });
          if (stepRandoms.subBranchRand < 0.1 && step > 3 && step < _j279 - 3) {
            const _j286 = $p.floor(stepRandoms.subBranchLengthRand);
            const subBranchAngle = angle + stepRandoms.subBranchAngle;
            let _j287 = _j280;
            let _j288 = _j281;
            for (let _j289 = 0; _j289 < _j286; _j289++) {
              const _j290 = $p.noise(step * noiseScale + _j289 * 0.5, seed * 0.01 + 200);
              const _j291 = (_j290 - 0.5) * $p.PI * 0.5;
              const _j292 = subBranchAngle + _j291;
              _j287 += $p.cos(_j292) * stepSize * 0.6;
              _j288 += $p.sin(_j292) * stepSize * 0.6;
              pathPoints.push({
                x: _j287,
                y: _j288,
              });
            }
          }
        }
        const _j293 = [];
        const _j294 = [];
        for (let i = 0; i < pathPoints.length; i++) {
          const point = pathPoints[i];
          let _j295;
          if (i === 0) {
            const nextPt = pathPoints[i + 1];
            _j295 = $p.atan2(nextPt.y - point.y, nextPt.x - point.x) + $p.HALF_PI;
          } else if (i === pathPoints.length - 1) {
            const prevPt = pathPoints[i - 1];
            _j295 = $p.atan2(point.y - prevPt.y, point.x - prevPt.x) + $p.HALF_PI;
          } else {
            const prevPt = pathPoints[i - 1];
            const nextPt = pathPoints[i + 1];
            const _j296 = $p.atan2(point.y - prevPt.y, point.x - prevPt.x);
            const _j297 = $p.atan2(nextPt.y - point.y, nextPt.x - point.x);
            _j295 = (_j296 + _j297) / 2 + $p.HALF_PI;
          }
          const _j298 = 0.5 + 0.5 * $p.sin((i / pathPoints.length) * $p.PI);
          const _j299 = branchCfg.thicknessRandoms[Math.min(i, branchCfg.thicknessRandoms.length - 1)];
          const _j300 = thickness * _j298 * _j299;
          _j293.push({
            x: point.x + ($p.cos(_j295) * _j300) / 2,
            y: point.y + ($p.sin(_j295) * _j300) / 2,
          });
          _j294.push({
            x: point.x - ($p.cos(_j295) * _j300) / 2,
            y: point.y - ($p.sin(_j295) * _j300) / 2,
          });
        }
        for (let v of _j293) {
          _j246.push(v);
        }
        for (let i = _j294.length - 1; i >= 0; i--) {
          _j246.push(_j294[i]);
        }
      }
      return {
        type: 'lightning',
        vertices: _j246,
      };
    }
    function bugShapeLightningAlt(size, seed) {
      $p.randomSeed(seed);
      $p.noiseSeed(seed);
      let _j246 = [];
      const _j270 = 3;
      const _j271 = 75;
      const _j272 = 8;
      const _j273 = 800;
      const items = [];
      const _j274 = $win.crandom.random(1, 4);
      const _j275 = $p.floor(_j274);
      size = size * 3;
      for (let _j276 = 0; _j276 < _j270; _j276++) {
        const branchCfg = {
          branchAngle: $win.crandom.random($p.TWO_PI),
          branchOffsetX: $win.crandom.random(-size * 0.2, size * 0.2),
          branchOffsetY: $win.crandom.random(-size * 0.2, size * 0.2),
          numLRand: $win.crandom.random(0, 1),
          numStepsRand: $win.crandom.random(5, 15),
          stepSize: size * $win.crandom.random(0.2, 0.35),
          noiseScale: $win.crandom.random(0.1, 0.2) * 0.5,
          noiseStrength: $win.crandom.random(0.2, 0.4) * 0.5,
          thickness: size * $win.crandom.random(0.5, 0.7) * 0.3,
          stepRandoms: [],
          thicknessRandoms: [],
        };
        for (let step = 0; step < _j271; step++) {
          const stepRandoms = {
            stepVariation: $win.crandom.random(0.7, 1.3),
            subBranchRand: $win.crandom.random(),
            subBranchLengthRand: $win.crandom.random(3, 8),
            subBranchAngle: $win.crandom.random(-$p.PI / 3, $p.PI / 3),
          };
          branchCfg.stepRandoms.push(stepRandoms);
        }
        for (let i = 0; i < _j273; i++) {
          branchCfg.thicknessRandoms.push($win.crandom.random(0.9, 1.1));
        }
        items.push(branchCfg);
      }
      for (let _j276 = 0; _j276 < _j275; _j276++) {
        const branchCfg = items[_j276];
        let branchAngle = branchCfg.branchAngle;
        let branchOffsetX = branchCfg.branchOffsetX;
        let branchOffsetY = branchCfg.branchOffsetY;
        let _j278 = branchCfg.numLRand > 0.2 ? 1 : 5;
        let _j279 = $p.floor(branchCfg.numStepsRand) * _j278;
        let stepSize = branchCfg.stepSize;
        let noiseScale = branchCfg.noiseScale;
        let noiseStrength = branchCfg.noiseStrength;
        let thickness = branchCfg.thickness;
        let pathPoints = [];
        let _j280 = branchOffsetX;
        let _j281 = branchOffsetY;
        let angle = branchAngle;
        pathPoints.push({
          x: _j280,
          y: _j281,
        });
        for (let step = 0; step < _j279; step++) {
          const stepRandoms = branchCfg.stepRandoms[step];
          const t = step / _j279;
          const _j283 = $p.noise(step * noiseScale, seed * 0.01);
          const _j284 = $p.noise(step * noiseScale + 100, seed * 0.01);
          const angleOffset = (_j283 - 0.5) * $p.PI * noiseStrength;
          angle += angleOffset;
          const stepVariation = stepRandoms.stepVariation;
          const _j285 = stepSize * stepVariation;
          _j280 += $p.cos(angle) * _j285;
          _j281 += $p.sin(angle) * _j285;
          pathPoints.push({
            x: _j280,
            y: _j281,
          });
          if (stepRandoms.subBranchRand < 0.1 && step > 3 && step < _j279 - 3) {
            const _j286 = $p.floor(stepRandoms.subBranchLengthRand);
            const subBranchAngle = angle + stepRandoms.subBranchAngle;
            let _j287 = _j280;
            let _j288 = _j281;
            for (let _j289 = 0; _j289 < _j286; _j289++) {
              const _j290 = $p.noise(step * noiseScale + _j289 * 0.5, seed * 0.01 + 200);
              const _j291 = (_j290 - 0.5) * $p.PI * 0.5;
              const _j292 = subBranchAngle + _j291;
              _j287 += $p.cos(_j292) * stepSize * 0.6;
              _j288 += $p.sin(_j292) * stepSize * 0.6;
              pathPoints.push({
                x: _j287,
                y: _j288,
              });
            }
          }
        }
        const _j293 = [];
        const _j294 = [];
        for (let i = 0; i < pathPoints.length; i++) {
          const point = pathPoints[i];
          let _j295;
          if (i === 0) {
            const nextPt = pathPoints[i + 1];
            _j295 = $p.atan2(nextPt.y - point.y, nextPt.x - point.x) + $p.HALF_PI;
          } else if (i === pathPoints.length - 1) {
            const prevPt = pathPoints[i - 1];
            _j295 = $p.atan2(point.y - prevPt.y, point.x - prevPt.x) + $p.HALF_PI;
          } else {
            const prevPt = pathPoints[i - 1];
            const nextPt = pathPoints[i + 1];
            const _j296 = $p.atan2(point.y - prevPt.y, point.x - prevPt.x);
            const _j297 = $p.atan2(nextPt.y - point.y, nextPt.x - point.x);
            _j295 = (_j296 + _j297) / 2 + $p.HALF_PI;
          }
          const _j298 = 0.5 + 0.5 * $p.sin((i / pathPoints.length) * $p.PI);
          const _j299 = branchCfg.thicknessRandoms[Math.min(i, branchCfg.thicknessRandoms.length - 1)];
          const _j300 = thickness * _j298 * _j299;
          _j293.push({
            x: point.x + ($p.cos(_j295) * _j300) / 2,
            y: point.y + ($p.sin(_j295) * _j300) / 2,
          });
          _j294.push({
            x: point.x - ($p.cos(_j295) * _j300) / 2,
            y: point.y - ($p.sin(_j295) * _j300) / 2,
          });
        }
        for (let v of _j293) {
          _j246.push(v);
        }
        for (let i = _j294.length - 1; i >= 0; i--) {
          _j246.push(_j294[i]);
        }
      }
      return {
        type: 'lightning',
        vertices: _j246,
      };
    }
    function drawBugShape(buffer, shapeData, px, py, r, g, b, alpha) {
      buffer.fill(r, g, b, alpha);
      buffer.noStroke();
      const scale = 1 / density;
      switch (shapeData.type) {
        case 'polygon':
        case 'blob':
        case 'jagged':
        case 'strip':
        case 'lightning':
          buffer.beginShape();
          for (let v of shapeData.vertices) {
            buffer.vertex(px + v.x * scale, py + v.y * scale);
          }
          buffer.endShape($p.CLOSE);
          break;
        case 'cluster':
          for (let circle of shapeData.circles) {
            buffer.ellipse(
              px + circle.x * scale,
              py + circle.y * scale,
              circle.radius * 2 * scale,
              circle.radius * 2 * scale,
            );
          }
          break;
      }
    }
    function scanBugBites(buf = null, scanBounds = null, shapeType = null, targetPoints_ = null) {
      let _j301 = 0;
      if (typeof $win.crandom !== 'undefined' && typeof $win.crandom.getCount === 'function') {
        _j301 = $win.crandom.getCount();
      }
      const w = buf ? buf.width : $p.width;
      const h = buf ? buf.height : $p.height;
      const d = buf ? buf.pixelDensity() : $p.pixelDensity();
      const _j302 = 20;
      const _j303 = 700;
      const _j304 = 80;
      let _j305 = canvasBackgroundColor[0];
      let _j306 = canvasBackgroundColor[1];
      let _j307 = canvasBackgroundColor[2];
      let pixels = null;
      let targetPoints = [];
      const _j308 = targetPoints_ && targetPoints_.length > 0;
      if (_j308) {
        for (let i = 0; i < 10; i++) {
          $win.crandom.random(0, 1);
        }
        targetPoints = targetPoints_.map((p) => ({
          x: p.x,
          y: p.y,
          brightness: p.brightness || 0,
        }));
      } else {
        const target = buf || $p;
        target.loadPixels();
        pixels = buf ? buf.pixels : $p.pixels;
        let _j310 = [];
        const step = 4;
        let _j311 = _j302;
        let _j312 = w - _j302;
        let _j313 = _j302;
        let _j314 = h - _j302;
        for (let y = _j313; y < _j314; y += step) {
          for (let x = _j311; x < _j312; x += step) {
            let _j315 = 4 * (y * d * (w * d) + x * d);
            let r = pixels[_j315];
            let g = pixels[_j315 + 1];
            let b = pixels[_j315 + 2];
            let a = pixels[_j315 + 3];
            let brightness = r + g + b;
            let _j316 = Math.abs(r - _j305) + Math.abs(g - _j306) + Math.abs(b - _j307);
            if (a > 100 && brightness < _j303 && _j316 > _j304) {
              if (scanBounds && scanBounds.minX !== undefined) {
                if (
                  x >= scanBounds.minX &&
                  x <= scanBounds.maxX &&
                  y >= scanBounds.minY &&
                  y <= scanBounds.maxY
                ) {
                  _j310.push({
                    x: x,
                    y: y,
                    brightness: brightness,
                  });
                }
              } else {
                _j310.push({
                  x: x,
                  y: y,
                  brightness: brightness,
                });
              }
            }
          }
        }
        if (_j310.length === 0) {
          console.log('⚠️ 未找到任何筆刷繪製區域（沒有與背景色有明顯差異的深色點）');
          return;
        }
        _j310.sort((a, b) => a.brightness - b.brightness);
        if (_j310.length < 10) {
          console.log(`⚠️ 符合條件的點不足 10 個（只有 ${_j310.length} 個），無法生成蟲咬效果`);
          return;
        }
        let _j317 = [];
        for (let i = 0; i < _j310.length; i++) {
          _j317.push(i);
        }
        const _j318 = Math.floor(_j310.length * 0.5);
        const _j319 = _j317.slice(0, Math.max(_j318, 10));
        for (let i = 0; i < 10 && _j319.length > 0; i++) {
          const _j320 = [];
          let _j321 = 0;
          for (let j = 0; j < _j319.length; j++) {
            const _j322 = Math.pow(1 - j / _j319.length, 2);
            _j320.push(_j322);
            _j321 += _j322;
          }
          let _j323 = $win.crandom.random(0, _j321);
          let _j324 = 0;
          let _j325 = 0;
          for (let j = 0; j < _j320.length; j++) {
            _j325 += _j320[j];
            if (_j323 <= _j325) {
              _j324 = j;
              break;
            }
          }
          const _j326 = _j319.splice(_j324, 1)[0];
          targetPoints.push(_j310[_j326]);
        }
        if (
          typeof isRecording !== 'undefined' &&
          isRecording &&
          typeof $win !== 'undefined' &&
          $win.currentScanEvent
        ) {
          $win.currentScanEvent.targetPoints = targetPoints.map((p) => ({
            x: p.x,
            y: p.y,
            brightness: p.brightness,
          }));
        }
      }
      let _j327 = [];
      const _j328 = 30;
      const _j329 = 4;
      let _j330 = 0;
      const _j331 = 30;
      for (let target of targetPoints) {
        let numBites = $p.int($win.crandom.random(2, 5));
        let _j332 = [];
        const items = [];
        const _j333 = [];
        for (let _j334 = 0; _j334 < numBites; _j334++) {
          const _j335 = [];
          for (let _j336 = 0; _j336 < _j331; _j336++) {
            _j335.push({
              r: $win.crandom.random(0, 1),
              angle: $win.crandom.random(0, $p.TWO_PI),
              angleOffset: $win.crandom.random(-0.25, 0.25),
            });
          }
          items.push(_j335);
          _j333.push({
            colorRand1: $win.crandom.random(0, 1),
            colorRand2: $win.crandom.random(0, 1),
            colorRand3: $win.crandom.random(0, 1),
            sizeRand1: $win.crandom.random(0, 1),
            sizeRand2: $win.crandom.random(0, 1),
            sizeRand3: $win.crandom.random(0, 1),
            shapeSeedRand: $win.crandom.random(0, 10000),
          });
        }
        for (let i = 0; i < numBites; i++) {
          let _j337 = 0;
          let _j338 = false;
          let sx, sy, distance;
          const _j335 = items[i];
          const _j341 = _j333[i];
          if (_j308) {
            const _j245 = _j335[0];
            let r = $p.sqrt(_j245.r) * _j328;
            let angle = _j245.angle + _j245.angleOffset;
            distance = r;
            let offsetX = Math.cos(angle) * distance * 0;
            let offsetY = Math.sin(angle) * distance * 0;
            sx = Math.floor(target.x + offsetX);
            sy = Math.floor(target.y + offsetY);
            sx = $p.constrain(sx, _j302, w - _j302);
            sy = $p.constrain(sy, _j302, h - _j302);
            _j338 = true;
            for (let _j342 of _j332) {
              let dist = Math.sqrt(Math.pow(sx - _j342.x, 2) + Math.pow(sy - _j342.y, 2));
              if (dist < _j329) {
                _j338 = false;
                break;
              }
            }
          } else {
            while (!_j338 && _j337 < _j331) {
              const _j245 = _j335[_j337];
              let r = $p.sqrt(_j245.r) * _j328;
              let angle = _j245.angle;
              angle += _j245.angleOffset;
              distance = r;
              let offsetX = Math.cos(angle) * distance * 0;
              let offsetY = Math.sin(angle) * distance * 0;
              sx = Math.floor(target.x + offsetX);
              sy = Math.floor(target.y + offsetY);
              sx = $p.constrain(sx, _j302, w - _j302);
              sy = $p.constrain(sy, _j302, h - _j302);
              let _j326 = 4 * (sy * d * (w * d) + sx * d);
              let _j343 = pixels[_j326];
              let _j344 = pixels[_j326 + 1];
              let _j345 = pixels[_j326 + 2];
              let _j346 = pixels[_j326 + 3];
              let _j347 = _j343 + _j344 + _j345;
              let _j348 = Math.abs(_j343 - _j305) + Math.abs(_j344 - _j306) + Math.abs(_j345 - _j307);
              if (_j346 <= 100 || _j347 >= _j303 || _j348 <= _j304) {
                _j338 = false;
                _j337++;
                if (_j337 >= _j331) {
                  _j330++;
                }
                continue;
              }
              _j338 = true;
              for (let _j342 of _j332) {
                let dist = Math.sqrt(Math.pow(sx - _j342.x, 2) + Math.pow(sy - _j342.y, 2));
                if (dist < _j329) {
                  _j338 = false;
                  break;
                }
              }
              _j337++;
            }
          }
          let _j349 = typeof $win.bugsSize !== 'undefined' ? $win.bugsSize : 10.0;
          if (shapeType === 2) {
            _j349 *= 1.3;
          }
          let _j350 = $p.floor(target.x * 1000 + target.y * 333 + _j341.shapeSeedRand);
          let _j351 = 0;
          let _j352 = 0;
          if (typeof $win.crandom !== 'undefined' && typeof $win.crandom.getCount === 'function') {
            _j351 = $win.crandom.getCount();
          }
          let shapeData = createBugShape(target.x, target.y, _j349, _j350, shapeType);
          if (typeof $win.crandom !== 'undefined' && typeof $win.crandom.getCount === 'function') {
            _j352 = $win.crandom.getCount();
            if (!_j341.shapeRandomCount) {
              _j341.shapeRandomCount = _j352 - _j351;
            }
          }
          if (_j338) {
            let r, g, b;
            let _j353 = typeof $win.metallicTint !== 'undefined' ? $win.metallicTint : [0.88, 0.72, 0.52];
            if (_j353[0] < 0.2 && _j353[1] < 0.15 && _j353[2] < 0.1) {
              r = Math.floor(38 + _j341.colorRand1 * (51 - 38));
              g = Math.floor(31 + _j341.colorRand2 * (38 - 31));
              b = Math.floor(20 + _j341.colorRand3 * (26 - 20));
            } else {
              r = 230 + _j341.colorRand1 * (255 - 230);
              g = 160 + _j341.colorRand2 * (220 - 160);
              b = 0;
            }
            let point = {
              x: sx,
              y: sy,
              brightness: target.brightness,
              r: r,
              g: g,
              b: b,
              size: _j349,
              shapeData: shapeData,
            };
            _j332.push(point);
            _j327.push(point);
          }
        }
      }
      bugPoints = bugPoints.concat(_j327);
      let _j354 = 0;
      if (typeof $win.boidSpawners !== 'undefined' && $win.doBoids) {
        for (let point of _j327) {
          if ($win.crandom.random(0, 1) > 0.2) {
            continue;
          }
          _j354++;
          let _j355 = point.size || 2.5;
          let _j356 = $p.map(_j355, 1.5, 6, 0.5, 1.5);
          $win.boidSpawners.push({
            x: point.x,
            y: point.y,
            r: point.r,
            g: point.g,
            b: point.b,
            spawnRate: $win.crandom.random(0.02, 0.05),
            maxBoids: $p.floor($win.crandom.random(1, 3)),
            spawnedCount: 0,
            isActive: true,
            movementRadius: $win.crandom.random(60, 200),
            boidSizeMultiplier: _j356,
          });
        }
        let _j357 = $win.boidSpawners.slice(-_j354);
        if (_j354 > 0) {
          let sizeMultipliers = _j357.map((s) => s.boidSizeMultiplier);
          let _j358 = Math.min(...sizeMultipliers);
          let _j359 = Math.max(...sizeMultipliers);
          let _j360 = ((_j354 / _j327.length) * 100).toFixed(1);
          console.log(`🦋 創建了 ${_j354} 個 Boid Spawners (虫咬點的 ${_j360}%，節省效能)`);
          console.log(`📏 Boid 大小倍数範圍: ${_j358.toFixed(2)} ~ ${_j359.toFixed(2)} (基於虫咬洞大小)`);
        } else {
          console.log(`🦋 沒有創建 Boid Spawners`);
        }
      }
      if (_j327.length > 0) {
        let _j361 = Infinity;
        let _j362 = 0;
        for (let point of _j327) {
          let brightness = point.r + point.g + point.b;
          _j361 = Math.min(_j361, brightness);
          _j362 = Math.max(_j362, brightness);
        }
        if (_j330 > 0) {
          console.log(`⚠️ 跳過了 ${_j330} 個不在筆墨區域的點`);
        }
      }
      const _j363 = _j327.length;
      if (_j363 > 0) {
        logMessage('system', '🐛 虫咬点生成完成', {
          虫咬点总数: _j363,
          Boids功能: '已禁用',
        });
      }
      $win.bugsDataTextureCache = null;
      $win.bugsMaskTextureCache = null;
      if (typeof $win.crandom !== 'undefined' && typeof $win.crandom.getCount === 'function') {
        const _j364 = $win.crandom.getCount();
        const _j365 = _j364 - _j301;
        if (typeof isPlaying !== 'undefined' && isPlaying && typeof $win !== 'undefined') {
          const currentScanEvent = $win.currentScanEvent;
          if (
            currentScanEvent &&
            currentScanEvent.recordedRandomCount !== undefined &&
            currentScanEvent.recordedRandomCount !== null
          ) {
            const recRandomCount = currentScanEvent.recordedRandomCount;
            const _j208 = _j365 - recRandomCount;
            const percent = recRandomCount > 0 ? ((_j208 / recRandomCount) * 100).toFixed(2) + '%' : 'N/A';
            const icon = Math.abs(_j208) < 50 ? '✅' : Math.abs(_j208) < 200 ? '⚠️' : '❌';
            const action = currentScanEvent.action || 'scan';
            const _j367 =
              currentScanEvent.shapeType !== null && currentScanEvent.shapeType !== undefined
                ? `ShapeType:${currentScanEvent.shapeType}`
                : 'ShapeType:random';
            const _j368 = typeof _j363 === 'number' ? ` | Points:${_j363}` : '';
            console.log(
              `${icon} Scan [${action}] ${_j367} | 差異: ${_j208 > 0 ? '+' : ''}${_j208} (${percent})${_j368}`,
            );
          }
        } else if (typeof isRecording !== 'undefined' && isRecording) {
          if (typeof $win !== 'undefined' && $win.currentScanEvent) {
            $win.currentScanEvent.recordedRandomCount = _j365;
          }
        }
      }
    }
    function scanBugBitesRandom(_j1541 = 10, shapeType = null) {
      const _j302 = 20;
      const w = $p.width;
      const h = $p.height;
      let targetPoints = [];
      for (let i = 0; i < _j1541; i++) {
        let x = $win.crandom.random(_j302, w - _j302);
        let y = $win.crandom.random(_j302, h - _j302);
        targetPoints.push({
          x: x,
          y: y,
          brightness: 0,
        });
      }
      let _j327 = [];
      const _j328 = 30;
      const _j329 = 4;
      for (let target of targetPoints) {
        let numBites = $p.int($win.crandom.random(2, 5));
        let _j332 = [];
        for (let i = 0; i < numBites; i++) {
          let _j337 = 0;
          let _j338 = false;
          let sx, sy, distance;
          while (!_j338 && _j337 < 30) {
            let r = $p.sqrt($win.crandom.random(0, 1)) * _j328;
            let angle = $win.crandom.random(0, $p.TWO_PI);
            angle += $win.crandom.random(-0.25, 0.25);
            distance = r;
            let offsetX = Math.cos(angle) * distance;
            let offsetY = Math.sin(angle) * distance;
            sx = Math.floor(target.x + offsetX);
            sy = Math.floor(target.y + offsetY);
            sx = $p.constrain(sx, _j302, w - _j302);
            sy = $p.constrain(sy, _j302, h - _j302);
            _j338 = true;
            for (let _j342 of _j332) {
              let dist = Math.sqrt(Math.pow(sx - _j342.x, 2) + Math.pow(sy - _j342.y, 2));
              if (dist < _j329) {
                _j338 = false;
                break;
              }
            }
            _j337++;
          }
          if (_j338) {
            let r, g, b;
            let _j353 = typeof $win.metallicTint !== 'undefined' ? $win.metallicTint : [0.88, 0.72, 0.52];
            if (_j353[0] < 0.2 && _j353[1] < 0.15 && _j353[2] < 0.1) {
              r = Math.floor($win.crandom.random(38, 51));
              g = Math.floor($win.crandom.random(31, 38));
              b = Math.floor($win.crandom.random(20, 26));
            } else {
              r = $win.crandom.random(230, 255);
              g = $win.crandom.random(160, 220);
              b = 0;
            }
            let size = typeof $win.bugsSize !== 'undefined' ? $win.bugsSize : 10.0;
            size = $p.random(0, 1) > 0.05 ? size * $p.random(0.8, 1.2) : size * $p.random(1, 3);
            let _j350 = $p.floor(sx * 1000 + sy * 333 + $win.crandom.random(0, 10000));
            let shapeData = createBugShape(sx, sy, size, _j350, shapeType);
            let point = {
              x: sx,
              y: sy,
              brightness: 0,
              r: r,
              g: g,
              b: b,
              size: size,
              shapeData: shapeData,
            };
            _j332.push(point);
            _j327.push(point);
          }
        }
      }
      bugPoints = bugPoints.concat(_j327);
      let _j354 = 0;
      if (typeof $win.boidSpawners !== 'undefined' && $win.doBoids) {
        for (let point of _j327) {
          if ($win.crandom.random(0, 1) > 0.2) {
            continue;
          }
          _j354++;
          let _j355 = point.size || 2.5;
          let _j356 = $p.map(_j355, 1.5, 6, 0.5, 1.5);
          $win.boidSpawners.push({
            x: point.x,
            y: point.y,
            r: point.r,
            g: point.g,
            b: point.b,
            spawnRate: $win.crandom.random(0.02, 0.05),
            maxBoids: $p.floor($win.crandom.random(1, 3)),
            spawnedCount: 0,
            isActive: true,
            movementRadius: $win.crandom.random(60, 200),
            boidSizeMultiplier: _j356,
          });
        }
      }
      if (_j327.length > 0) {
        logMessage('system', '🎲 随机虫咬点生成完成', {
          虫咬点总数: _j327.length,
          Boids功能: '已禁用',
        });
      }
      $win.bugsDataTextureCache = null;
      $win.bugsMaskTextureCache = null;
    }
    function updateBugTextures(_j1542 = false) {
      if (typeof $win.bugsDataTexture === 'undefined' || !$win.bugsDataTexture) {
        $win.bugsDataTexture = $p.createGraphics($p.width, $p.height, $p.P2D);
        $win.bugsDataTexture.pixelDensity(density);
      }
      if (typeof $win.bugsMaskTexture === 'undefined' || !$win.bugsMaskTexture) {
        $win.bugsMaskTexture = $p.createGraphics($p.width, $p.height, $p.P2D);
        $win.bugsMaskTexture.pixelDensity(density);
      }
      const _j369 =
        _j1542 || !$win.bugsDataTextureCache || $win.bugsDataTextureCache.pointCount !== bugPoints.length;
      if (!_j369) {
        return {
          dataTexture: $win.bugsDataTexture,
          maskTexture: $win.bugsMaskTexture,
        };
      }
      $win.bugsDataTexture.clear();
      $win.bugsDataTexture.noStroke();
      $win.bugsMaskTexture.clear();
      $win.bugsMaskTexture.noStroke();
      for (let point of bugPoints) {
        const px = point.x;
        const py = point.y;
        const radius = (point.size || 5) / density;
        const cx = point.x / $p.width;
        const cy = point.y / $p.height;
        const size = (point.size || 5) / $p.width;
        const r = point.r || 255;
        const g = point.g || 0;
        const b = point.b || 0;
        if (point.shapeData) {
          drawBugShape($win.bugsDataTexture, point.shapeData, px, py, cx * 255, cy * 255, size * 255, 255);
          drawBugShape($win.bugsMaskTexture, point.shapeData, px, py, r, g, b, 255);
        } else {
          $win.bugsDataTexture.fill(cx * 255, cy * 255, size * 255, 255);
          $win.bugsDataTexture.ellipse(px, py, radius, radius);
          $win.bugsMaskTexture.fill(r, g, b, 255);
          $win.bugsMaskTexture.ellipse(px, py, radius, radius);
        }
      }
      const _j373 = {
        pointCount: bugPoints.length,
        timestamp: $clock(),
      };
      $win.bugsDataTextureCache = _j373;
      $win.bugsMaskTextureCache = _j373;
      return {
        dataTexture: $win.bugsDataTexture,
        maskTexture: $win.bugsMaskTexture,
      };
    }
    function applyMetallicPass(target, buf) {
      if (bugPoints.length === 0) {
        return;
      }
      if (typeof $win.metallicProgram === 'undefined' || !$win.metallicProgram) {
        console.warn('⚠️ Metallic shader 未加載');
        return;
      }
      const _j374 = updateBugTextures();
      let _j375 = _j374.dataTexture;
      let _j376 = _j374.maskTexture;
      target.begin();
      $p.clear();
      $p.shader($win.metallicProgram);
      $win.metallicProgram.setUniform('tex0', buf);
      $win.metallicProgram.setUniform('bugsMask', _j376);
      $win.metallicProgram.setUniform('bugsData', _j375);
      $win.metallicProgram.setUniform('time', $clock());
      $win.metallicProgram.setUniform('resolution', [$p.width * density, $p.height * density]);
      let strength = typeof $win.metallicStrength !== 'undefined' ? $win.metallicStrength : 0.85;
      let _j377 = typeof $win.metallicFlowSpeed !== 'undefined' ? $win.metallicFlowSpeed : 1.0;
      let _j378 = typeof $win.metallicSpecular !== 'undefined' ? $win.metallicSpecular : 12.0;
      let _j379 = typeof $win.metallicFresnel !== 'undefined' ? $win.metallicFresnel : 0.5;
      let _j380 = typeof $win.metallicLightX !== 'undefined' ? $win.metallicLightX : 0.5;
      let _j381 = typeof $win.metallicLightY !== 'undefined' ? $win.metallicLightY : 0.3;
      let tint = typeof $win.metallicTint !== 'undefined' ? $win.metallicTint : [0.88, 0.72, 0.52];
      $win.metallicProgram.setUniform('metallicStrength', strength);
      $win.metallicProgram.setUniform('flowSpeed', _j377);
      $win.metallicProgram.setUniform('lightPos', [_j380, _j381]);
      $win.metallicProgram.setUniform('specularPower', _j378);
      $win.metallicProgram.setUniform('fresnelStrength', _j379);
      $win.metallicProgram.setUniform('metalTint', tint);
      $p.noStroke();
      $p.rectMode($p.CENTER);
      $p.rect(0, 0, $p.width, $p.height);
      $p.resetShader();
      target.end();
    }
    let prevGridParams = null;
    let __lastGridParams = null;
    function dashedLine(x1, y1, x2, y2, dashLength, gapLength) {
      const d = $p.dist(x1, y1, x2, y2);
      if (d < 1) return;
      const dx = (x2 - x1) / d,
        dy = (y2 - y1) / d;
      let pos = 0,
        draw = true;
      while (pos < d) {
        const _j383 = draw ? dashLength : gapLength;
        const end = Math.min(pos + _j383, d);
        if (draw) $p.line(x1 + dx * pos, y1 + dy * pos, x1 + dx * end, y1 + dy * end);
        pos = end;
        draw = !draw;
      }
    }
    function gridCommitPrev() {
      if (__lastGridParams) {
        prevGridParams = {
          ...__lastGridParams,
        };
      }
    }
    function drawGridOverlay(cx, cy, cellSize, flowActive_) {
      $p.push();
      $p.noFill();
      $p.stroke(0, 0, 0, 80);
      $p.strokeWeight(1);
      const effCell = $p.constrain(cellSize || 20, 2, 400) * 0.7;
      let minX = Math.min(startX, cx);
      let maxX = Math.max(startX, cx);
      let minY = Math.min(startY, cy);
      let maxY = Math.max(startY, cy);
      if (typeof lastStrokeBounds !== 'undefined' && lastStrokeBounds !== null) {
        if (lastStrokeBounds.minX < minX) minX = lastStrokeBounds.minX;
        if (lastStrokeBounds.maxX > maxX) maxX = lastStrokeBounds.maxX;
        if (lastStrokeBounds.minY < minY) minY = lastStrokeBounds.minY;
        if (lastStrokeBounds.maxY > maxY) maxY = lastStrokeBounds.maxY;
      } else if (Array.isArray(pathPoints) && pathPoints.length > 0) {
        for (let i = 0; i < pathPoints.length; i++) {
          const px = pathPoints[i].x;
          const py = pathPoints[i].y;
          if (px < minX) minX = px;
          if (px > maxX) maxX = px;
          if (py < minY) minY = py;
          if (py > maxY) maxY = py;
        }
      }
      const _j384 = effCell * 0.3;
      const _j385 = maxX - minX + _j384 * 2;
      const _j386 = maxY - minY + _j384 * 2;
      const _j387 = (minX + maxX) * 0.5;
      const _j388 = (minY + maxY) * 0.5;
      let left = Math.max(0, Math.floor((minX - _j384) / effCell) * effCell);
      let top = Math.max(0, Math.floor((minY - _j384) / effCell) * effCell);
      const _j389 = Math.min($p.width, Math.ceil((maxX + _j384) / effCell) * effCell);
      const _j390 = Math.min($p.height, Math.ceil((maxY + _j384) / effCell) * effCell);
      let gridWidth = Math.max(effCell * 2, _j389 - left);
      let gridHeight = Math.max(effCell * 2, _j390 - top);
      const cols = Math.min(70, Math.max(1, Math.round(gridWidth / effCell)));
      const rows = Math.min(70, Math.max(1, Math.round(gridHeight / effCell)));
      left = $p.constrain(left, 0, Math.max(0, $p.width - gridWidth));
      top = $p.constrain(top, 0, Math.max(0, $p.height - gridHeight));
      const right = left + gridWidth;
      const bottom = top + gridHeight;
      if (prevGridParams && typeof isPlaying !== 'undefined' && isPlaying) {
        const pg = prevGridParams;
        $p.strokeWeight(1);
        $p.stroke(0, 0, 0, 60);
        $p.rectMode($p.CORNER);
        $p.rect(pg.left, pg.top, pg.right - pg.left, pg.bottom - pg.top);
        $p.strokeWeight(0.5);
        $p.stroke(0, 0, 0, 35);
        for (let i = 1; i < pg.cols; i++) {
          const x = pg.left + i * pg.effCell;
          $p.line(x, pg.top, x, pg.bottom);
        }
        for (let j = 1; j < pg.rows; j++) {
          const y = pg.top + j * pg.effCell;
          $p.line(pg.left, y, pg.right, y);
        }
      }
      $p.strokeWeight(1);
      if (flowActive_) {
        $p.stroke(255, 50, 50, 200);
      } else {
        $p.stroke(0, 0, 150, 120);
      }
      $p.rectMode($p.CORNER);
      $p.rect(left, top, gridWidth, gridHeight);
      if (flowActive_) {
        const _j391 = 12;
        const labelX = left + 8;
        const labelY = top + 8;
        $p.strokeWeight(2);
        $p.stroke(255, 50, 50, 255);
        $p.line(labelX - _j391 / 2, labelY, labelX + _j391 / 2, labelY);
        $p.line(labelX, labelY - _j391 / 2, labelX, labelY + _j391 / 2);
        $p.strokeWeight(1);
      }
      $p.strokeWeight(0.5);
      if (flowActive_) {
        $p.stroke(255, 50, 50, 80);
      } else {
        $p.stroke(0, 0, 150, 50);
      }
      for (let i = 1; i < cols; i++) {
        const x = left + i * effCell;
        $p.line(x, top, x, bottom);
      }
      for (let j = 1; j < rows; j++) {
        const y = top + j * effCell;
        $p.line(left, y, right, y);
      }
      $p.stroke(0, 0, 0, 180);
      $p.strokeWeight(1.2);
      if (font) $p.textFont(font);
      $p.textSize(6);
      $p.fill(0);
      $p.noStroke();
      const _j394 = typeof maxUpdates === 'number' ? maxUpdates : 0;
      const _j395 = typeof countdownFrame === 'number' ? countdownFrame : 0;
      const _j396 = typeof brushDir === 'number' ? brushDir : 0;
      const _j397 = ['原', '1X翻', '1Y翻', '1XY翻'];
      const _j398 = _j397[_j396] || '?';
      const countdownText = `Max: ${_j394} | Count: ${_j395} | Dir: ${_j396}(${_j398})`;
      $p.textAlign($p.LEFT, $p.TOP);
      $p.text(countdownText, left, top - 12);
      const _j399 = typeof strokeFrame === 'number' ? strokeFrame : 0;
      const _j400 = typeof brushMode === 'number' ? brushMode : 0;
      const _j401 =
        typeof brushSize === 'number' && brushSize > 0
          ? brushSize
          : typeof gridCellSize === 'number'
            ? gridCellSize
            : effCell;
      const _j402 = typeof phasorVel === 'number' ? phasorVel : '';
      const _j403 = `C: ${_j399} | B: ${_j400} | S: ${_j401.toFixed(1)} | P: ${_j402}`;
      const _j404 = left;
      const _j405 = Math.min($p.height - 18, bottom + 6);
      $p.textAlign($p.LEFT, $p.TOP);
      $p.text(_j403, _j404, _j405);
      drawMaskOutline();
      $p.pop();
      $win.gridWidth = gridWidth;
      $win.gridHeight = gridHeight;
      __lastGridParams = {
        left: left,
        top: top,
        right: right,
        bottom: bottom,
        effCell: effCell,
        cols: cols,
        rows: rows,
        gridWidth: gridWidth,
        gridHeight: gridHeight,
      };
      $win.__lastGridParams = __lastGridParams;
    }
    function drawPathPointsTo(buffer) {
      const isFramebuffer = typeof buffer.begin === 'function';
      if (isFramebuffer) buffer.begin();
      const g = isFramebuffer ? $p : buffer;
      g.push();
      g.translate(-hw, -hh);
      if (pathPoints.length > 1) {
        const dashOn = 5;
        const dashOff = 5;
        g.stroke(0, 0, 0, 255);
        g.strokeWeight(1);
        dashPenDown = true;
        dashTravelled = 0;
        for (let i = 0; i < pathPoints.length - 1; i++) {
          let x1 = pathPoints[i].x;
          let y1 = pathPoints[i].y;
          let x2 = pathPoints[i + 1].x;
          let y2 = pathPoints[i + 1].y;
          let segLen = $p.dist(x1, y1, x2, y2);
          let dx = (x2 - x1) / segLen;
          let dy = (y2 - y1) / segLen;
          let travelled = 0;
          while (travelled < segLen) {
            let dashLen = dashPenDown ? dashOn : dashOff;
            let stepLen = $p.min(dashLen - dashTravelled, segLen - travelled);
            if (dashPenDown) {
              let startX = x1 + dx * travelled;
              let startY = y1 + dy * travelled;
              let segX = x1 + dx * (travelled + stepLen);
              let segY = y1 + dy * (travelled + stepLen);
              g.line(startX, startY, segX, segY);
            }
            travelled += stepLen;
            dashTravelled += stepLen;
            if (dashTravelled >= (dashPenDown ? dashOn : dashOff)) {
              dashPenDown = !dashPenDown;
              dashTravelled = 0;
            }
          }
        }
      }
      g.noFill();
      g.stroke(0, 0, 0, 255);
      g.strokeWeight(1);
      g.ellipse(startX, startY, 10, 10);
      if (pathPoints.length > 0) {
        let lastPt = pathPoints[pathPoints.length - 1];
        g.stroke(0, 0, 0, 255);
        g.strokeWeight(1);
        g.ellipse(lastPt.x, lastPt.y, 10, 10);
      }
      g.pop();
      if (isFramebuffer) buffer.end();
    }
    function drawMaskOutline() {
      const inset = 10;
      if (
        typeof maskActive !== 'undefined' &&
        maskActive &&
        typeof currentMaskData !== 'undefined' &&
        currentMaskData
      ) {
        $p.noFill();
        $p.stroke(0, 180, 0, 180);
        $p.strokeWeight(1.5);
        if (currentMaskData.action === 'rect') {
          const outX1 = currentMaskData.x1 + inset,
            outY1 = currentMaskData.y1 + inset;
          const outX2 = currentMaskData.x2 + inset,
            outY2 = currentMaskData.y2 + inset;
          dashedLine(outX1, outY1, outX2, outY1, 6, 4);
          dashedLine(outX2, outY1, outX2, outY2, 6, 4);
          dashedLine(outX2, outY2, outX1, outY2, 6, 4);
          dashedLine(outX1, outY2, outX1, outY1, 6, 4);
        } else if (
          currentMaskData.action === 'polygon' &&
          currentMaskData.points &&
          currentMaskData.points.length >= 3
        ) {
          const polyPts = currentMaskData.points;
          for (let i = 0; i < polyPts.length; i++) {
            const a = polyPts[i],
              b = polyPts[(i + 1) % polyPts.length];
            dashedLine(a.x + inset, a.y + inset, b.x + inset, b.y + inset, 6, 4);
          }
        }
        $p.fill(0, 180, 0, 200);
        $p.noStroke();
        if (typeof font !== 'undefined' && font) $p.textFont(font);
        $p.textSize(7);
        $p.textAlign($p.LEFT, $p.TOP);
        const _j422 =
          (currentMaskData.action === 'rect'
            ? currentMaskData.x1
            : currentMaskData.points
              ? currentMaskData.points[0].x
              : 0) + inset;
        const _j423 =
          (currentMaskData.action === 'rect'
            ? currentMaskData.y1 - 12
            : currentMaskData.points
              ? currentMaskData.points[0].y - 12
              : 0) + inset;
        $p.text('MASK', _j422, _j423);
      }
      if (
        typeof maskDrawMode !== 'undefined' &&
        maskDrawMode &&
        typeof maskTool !== 'undefined' &&
        maskTool === 'rect' &&
        typeof maskRectDraft !== 'undefined' &&
        maskRectDraft &&
        maskRectDraft.x1 !== undefined &&
        $in.mouseIsPressed
      ) {
        $p.noFill();
        $p.stroke(0, 200, 0, 120);
        $p.strokeWeight(1);
        const draftX1 = Math.min(maskRectDraft.x1, $in.mouseX - 10) + inset;
        const draftY1 = Math.min(maskRectDraft.y1, $in.mouseY - 10) + inset;
        const draftX2 = Math.max(maskRectDraft.x1, $in.mouseX - 10) + inset;
        const draftY2 = Math.max(maskRectDraft.y1, $in.mouseY - 10) + inset;
        dashedLine(draftX1, draftY1, draftX2, draftY1, 4, 3);
        dashedLine(draftX2, draftY1, draftX2, draftY2, 4, 3);
        dashedLine(draftX2, draftY2, draftX1, draftY2, 4, 3);
        dashedLine(draftX1, draftY2, draftX1, draftY1, 4, 3);
      }
      if (
        typeof maskDrawMode !== 'undefined' &&
        maskDrawMode &&
        typeof maskTool !== 'undefined' &&
        maskTool === 'polygon' &&
        typeof maskPolygonPoints !== 'undefined' &&
        maskPolygonPoints.length > 0
      ) {
        $p.noFill();
        $p.stroke(0, 200, 0, 120);
        $p.strokeWeight(1);
        for (let i = 0; i < maskPolygonPoints.length - 1; i++) {
          const a = maskPolygonPoints[i],
            b = maskPolygonPoints[i + 1];
          dashedLine(a.x + inset, a.y + inset, b.x + inset, b.y + inset, 4, 3);
        }
        $p.noStroke();
        $p.fill(0, 200, 0, 150);
        for (let p of maskPolygonPoints) {
          $p.ellipse(p.x + inset, p.y + inset, 6, 6);
        }
      }
    }
    function cameraReturnHome() {
      if ((!isPlaying || isWaitingToLoop) && easycam !== null && doMoving) {
        const homeCenter = easycamInitialCenter || [0, 0, 0];
        const fov = $p.PI / 3;
        const _j430 = $p.height / (2 * $p.tan(fov / 2));
        const homeDist = easycamInitialDistance > 0 ? easycamInitialDistance : _j430;
        const camCenter = easycam.getCenter();
        const camDist = easycam.getDistance();
        const _j434 = 0.1;
        const _j435 = 1.0;
        const centerDiff = Math.sqrt(
          Math.pow(camCenter[0] - homeCenter[0], 2) +
            Math.pow(camCenter[1] - homeCenter[1], 2) +
            Math.pow(camCenter[2] - homeCenter[2], 2),
        );
        const distanceDiff = Math.abs(camDist - homeDist);
        if (!camResetting && (centerDiff > _j434 || distanceDiff > _j435)) {
          camResetting = true;
          camResetStart = $clock();
          camResetFromCenter = [camCenter[0], camCenter[1], camCenter[2]];
          camResetFromDist = camDist;
          camResetToCenter = homeCenter;
          camResetToDist = homeDist;
        }
        if (camResetting) {
          const elapsed = $clock() - camResetStart;
          const progress = Math.min(elapsed / CAMERA_RESET_MS, 1.0);
          const _j438 = [
            $p.lerp(camResetFromCenter[0], camResetToCenter[0], progress),
            $p.lerp(camResetFromCenter[1], camResetToCenter[1], progress),
            $p.lerp(camResetFromCenter[2], camResetToCenter[2], progress),
          ];
          const _j439 = $p.lerp(camResetFromDist, camResetToDist, progress);
          easycam.setCenter(_j438, 0);
          easycam.setDistance(_j439, 0);
          if (progress >= 1.0) {
            const curCenter = easycam.getCenter();
            const curDist = easycam.getDistance();
            const _j442 = Math.sqrt(
              Math.pow(curCenter[0] - homeCenter[0], 2) +
                Math.pow(curCenter[1] - homeCenter[1], 2) +
                Math.pow(curCenter[2] - homeCenter[2], 2),
            );
            const _j443 = Math.abs(curDist - homeDist);
            if (_j442 > _j434 || _j443 > _j435) {
              easycam.setCenter(homeCenter, 0);
              easycam.setDistance(homeDist, 0);
            }
            camResetting = false;
          }
        }
      }
    }
    function updateEasyCamAutoTracking() {
      if (
        isPlaying &&
        !isWaitingToLoop &&
        doMoving &&
        easycamEnabled &&
        easycam !== null &&
        easycamTracking &&
        !camResetting
      ) {
        const _j444 = playX;
        const _j445 = playY;
        const tipX_ = _j444 - hw;
        const tipY_ = -(_j445 - hh);
        const camCenter = easycam.getCenter();
        const _j280 = camCenter[0];
        const _j281 = camCenter[1];
        const camDist = easycam.getDistance();
        const fov = $p.PI / 3;
        const defaultCamDist = $p.height / (2 * $p.tan(fov / 2));
        const _j449 = 1.1;
        let _j450 = 1.4;
        const _j329 = defaultCamDist / _j450;
        const _j451 = defaultCamDist / _j449;
        const _j452 = defaultCamDist / camDist;
        const _j453 = 0.01;
        if (camZoomIn) {
          const _j454 = _j450;
          const _j455 = defaultCamDist / _j454;
          const distanceDiff = _j455 - camDist;
          const _j456 = camZoomLerp;
          const _j457 = camDist + distanceDiff * _j456;
          const _j458 = $p.constrain(_j457, _j329, _j451);
          easycam.setDistance(_j458, 0);
        } else {
          const _j455 = defaultCamDist / _j449;
          const distanceDiff = _j455 - camDist;
          const _j456 = camZoomLerp;
          const _j457 = camDist + distanceDiff * _j456;
          const _j458 = $p.constrain(_j457, _j329, _j451);
          easycam.setDistance(_j458, 0);
        }
        const _j459 = easycam.getDistance();
        const _j460 = defaultCamDist / _j459;
        let _j461 = 0;
        let _j462 = 0;
        if (_j460 > _j449) {
          _j461 = (_j460 - _j449) * ($p.width / 2);
          _j462 = (_j460 - _j449) * ($p.height / 2);
        }
        let offsetX = tipX_ - _j280;
        let offsetY = tipY_ - _j281;
        if (_j461 > 0 || _j462 > 0) {
          const _j463 = $p.constrain(tipX_, -_j461, _j461);
          const _j464 = $p.constrain(tipY_, -_j462, _j462);
          offsetX = _j463 - _j280;
          offsetY = _j464 - _j281;
        } else {
          offsetX = -_j280;
          offsetY = -_j281;
        }
        const _j465 = camCenterLerp;
        const sx = _j280 + offsetX * _j465;
        const sy = _j281 + offsetY * _j465;
        let _j466 = sx;
        let _j467 = sy;
        if (_j461 > 0 || _j462 > 0) {
          _j466 = $p.constrain(sx, -_j461, _j461);
          _j467 = $p.constrain(sy, -_j462, _j462);
        } else {
          _j466 = 0;
          _j467 = 0;
        }
        easycam.setCenter([_j466, _j467, 0], 0);
      }
    }
    function initEasyCam() {
      if (typeof Dw === 'undefined' || typeof Dw.EasyCam === 'undefined') {
        $host.log('system', 'EasyCam library not loaded (camera moves disabled)', {}); // [restored] was console.warn
        easycamEnabled = false;
        return;
      }
      if (easycam !== null) {
        easycamEnabled = true;
        return;
      }
      try {
        const _j468 = $p._renderer;
        if (!_j468) {
          console.error('❌ WEBGL renderer not found');
          easycamEnabled = false;
          return;
        }
        const fov = $p.PI / 3;
        const defaultCamDist = $p.height / (2 * $p.tan(fov / 2));
        easycam = new Dw.EasyCam(_j468, {
          distance: defaultCamDist,
          center: [0, 0, 0],
          rotation: [1, 0, 0, 0],
          viewport: [0, 0, $p.width, $p.height],
        });
        easycam.setRotationConstraint(0, 0, 0);
        easycam.setRotationScale(0);
        camDistMin = defaultCamDist / 2.5;
        camDistMax = defaultCamDist / 1.0;
        easycam.setDistanceMin(camDistMin);
        easycam.setDistanceMax(camDistMax);
        $doc.oncontextmenu = function () {
          return false;
        };
        easycamEnabled = true;
        logMessage('system', '🎥 EasyCam initialized', {
          Status: 'Auto camera tracking ready',
          Controls: 'Camera automatically follows grid center during playback',
        });
      } catch (error) {
        console.error('❌ Failed to initialize EasyCam:', error);
        easycamEnabled = false;
        easycam = null;
      }
    }
    function applyCameraProjection() {
      const cameraTracking = doMoving && easycamEnabled && easycam !== null && isPlaying && easycamTracking;
      if (cameraTracking) {
        const _j470 = $p.PI / 3;
        const _j471 = 0.1;
        const _j472 = 10000;
        $p.perspective(_j470, $p.width / $p.height, _j471, _j472);
        $p.push();
      } else {
        const _j473 = $p.PI / 3;
        const _j474 = 0.1;
        const _j475 = 10000;
        $p.perspective(_j473, $p.width / $p.height, _j474, _j475);
      }
    }
    let cachedRectUniform = null;
    let cachedInvResolution = null;
    let cachedRectW = 0,
      cachedRectH = 0,
      cachedRectDensity = 0;
    let uniformCache = {
      feedback: {},
      composite: {},
      realtime: {},
    };
    function setUniformCached(targetShader, shaderKey, name, value) {
      const _j482 = uniformCache[shaderKey];
      if (_j482[name] === value) return;
      _j482[name] = value;
      targetShader.setUniform(name, value);
    }
    function refreshRectCache() {
      if (cachedRectW !== $p.width || cachedRectH !== $p.height || cachedRectDensity !== density) {
        cachedRectUniform = [0, 0, $p.width * density, $p.height * density];
        cachedInvResolution = [1.0 / ($p.width * density), 1.0 / ($p.height * density)];
        cachedRectW = $p.width;
        cachedRectH = $p.height;
        cachedRectDensity = density;
      }
      if (cachedRectUniform === null) {
        cachedRectUniform = [0, 0, $p.width * density, $p.height * density];
        cachedInvResolution = [1.0 / ($p.width * density), 1.0 / ($p.height * density)];
      }
    }
    function runFeedbackPass(buffer, force_ = 1.0) {
      if (bypassFeedback) {
        compositeDirty = true;
        return;
      }
      if ($win._fxDebug) $win._fxDebug.feedbackFrames++;
      pingPongBuffer.begin();
      $p.resetShader();
      $p.blendMode($p.BLEND);
      $p.imageMode($p.CENTER);
      $p.rectMode($p.CENTER);
      $p.shader(feedbackShader);
      const colorModeFlag = brushColorMode === 1 ? 1.0 : 0.0;
      refreshRectCache();
      feedbackShader.setUniform('rect', cachedRectUniform);
      feedbackShader.setUniform('invResolution', cachedInvResolution);
      feedbackShader.setUniform('tex0', buffer);
      setUniformCached(feedbackShader, 'feedback', 'brushMode', brushMode * 1.0);
      feedbackShader.setUniform('forceMap', forceMapBuffer);
      setUniformCached(feedbackShader, 'feedback', 'baseBrushSize', baseBrushSize);
      feedbackShader.setUniform('force', force_);
      setUniformCached(feedbackShader, 'feedback', 'useSharpen', useSharpen);
      setUniformCached(feedbackShader, 'feedback', 'effect3Brightness', effect3Brightness);
      setUniformCached(feedbackShader, 'feedback', 'indiffusionStrength', indiffusionStrength);
      setUniformCached(feedbackShader, 'feedback', 'brushColorMode', $p.float(brushColorMode));
      setUniformCached(feedbackShader, 'feedback', 'brushCategory', colorModeFlag);
      const _j484 = typeof mouseCountStart !== 'undefined' ? mouseCountStart : 0;
      const _j485 = (strokeFrame + _j484) % 40;
      const _j486 = strokeFrame + _j484;
      feedbackShader.setUniform('mouseCount', $p.float(_j485));
      feedbackShader.setUniform('mouseCountAccumulated', $p.float(_j486));
      feedbackShader.setUniform('strokeSeed', $p.float(strokeSeed));
      feedbackShader.setUniform('useMask', maskActive ? 1.0 : 0.0);
      if (maskActive) feedbackShader.setUniform('maskTex', maskBuffer);
      $p.rectMode($p.CENTER);
      $p.rect(0, 0, $p.width, $p.height);
      $p.resetShader();
      pingPongBuffer.end();
      buffer.begin();
      $p.imageMode($p.CENTER);
      $p.blendMode($p.BLEND);
      $p.image(pingPongBuffer, 0, 0, $p.width, $p.height);
      buffer.end();
      compositeDirty = true;
    }
    function regeneratePaperTexture() {
      if (typeof paperTextureBuffer === 'undefined' || !paperTextureBuffer) {
        return;
      }
      const bgColor = canvasBackgroundColor;
      let paperImg = generatePaperTexture(40, 20, 15, 0.2);
      const _j489 = $p.min(255, bgColor[0] * 1.1);
      const _j490 = $p.min(255, bgColor[1] * 1.1);
      const _j491 = $p.min(255, bgColor[2] * 1.1);
      paperTextureBuffer.begin();
      $p.clear();
      $p.blendMode($p.BLEND);
      $p.noStroke();
      $p.fill(_j489, _j490, _j491);
      $p.rect(-$p.width / 2, -$p.height / 2, $p.width, $p.height);
      $p.blendMode($p.MULTIPLY);
      $p.image(paperImg, -$p.width / 2, -$p.height / 2, $p.width, $p.height);
      paperTextureBuffer.end();
      paperImg.remove();
    }
    function refreshBackgroundBuffers() {
      const bgColor = canvasBackgroundColor;
      if (typeof plainBgBuffer !== 'undefined' && plainBgBuffer) {
        plainBgBuffer.begin();
        $p.background(bgColor[0], bgColor[1], bgColor[2]);
        plainBgBuffer.end();
      }
      regeneratePaperTexture();
      if (typeof compositeDirty !== 'undefined') {
        compositeDirty = true;
      }
    }
    function updateCompositeBuffer() {
      const _j492 = compositeDirty || isDrawing || isReleasing || isPlaying || isFrameRecording;
      if (_j492) {
        screenBuffer.begin();
        $p.clear();
        $p.shader(compositeShader);
        refreshRectCache();
        compositeShader.setUniform('rect', cachedRectUniform);
        compositeShader.setUniform('baseTex', showPaperTexture ? paperTextureBuffer : plainBgBuffer);
        compositeShader.setUniform('encodedTex', finalBuffer);
        compositeShader.setUniform('typeMapTex', typeMapBuffer);
        compositeShader.setUniform('oldTex', oldBuffer);
        setUniformCached(compositeShader, 'composite', 'brushColorMode', $p.float(brushColorMode));
        setUniformCached(compositeShader, 'composite', 'whiteMaxOpacity', whiteMaxOpacity);
        setUniformCached(compositeShader, 'composite', 'hueShift', hueShift);
        setUniformCached(compositeShader, 'composite', 'satShift', satShift);
        setUniformCached(compositeShader, 'composite', 'briShift', briShift);
        setUniformCached(compositeShader, 'composite', 'brushCategory', brushColorMode === 1 ? 1.0 : 0.0);
        setUniformCached(compositeShader, 'composite', 'useSharpen', useSharpen);
        $p.noStroke();
        $p.rectMode($p.CENTER);
        $p.rect(0, 0, $p.width, $p.height);
        $p.resetShader();
        screenBuffer.end();
        if (isDrawing || isReleasing) {
          realtimeIntermediateBuffer.begin();
          $p.clear();
          $p.imageMode($p.CENTER);
          $p.image(screenBuffer, 0, 0, $p.width, $p.height);
          realtimeIntermediateBuffer.end();
          screenBuffer.begin();
          $p.shader(realtimeShader);
          const _j493 = brushColorMode === 1 ? 1.0 : 0.0;
          refreshRectCache();
          realtimeShader.setUniform('rect', cachedRectUniform);
          realtimeShader.setUniform('baseTex', realtimeIntermediateBuffer);
          realtimeShader.setUniform('addTex', newBufferBlack);
          realtimeShader.setUniform('encodedTex', finalBuffer);
          setUniformCached(realtimeShader, 'realtime', 'brushColorMode', $p.float(brushColorMode));
          setUniformCached(realtimeShader, 'realtime', 'whiteMaxOpacity', whiteMaxOpacity);
          setUniformCached(realtimeShader, 'realtime', 'hueShift', hueShift);
          setUniformCached(realtimeShader, 'realtime', 'satShift', satShift);
          setUniformCached(realtimeShader, 'realtime', 'briShift', briShift);
          setUniformCached(realtimeShader, 'realtime', 'brushCategory', _j493);
          setUniformCached(realtimeShader, 'realtime', 'useSharpen', useSharpen);
          let _j494;
          if (brushColorMode === 33 && typeof customBrushColor !== 'undefined') {
            _j494 = [customBrushColor[0] / 255, customBrushColor[1] / 255, customBrushColor[2] / 255];
          } else {
            const color = colorTable[brushColorMode] || colorTable[0];
            _j494 = [color.rgb[0] / 255, color.rgb[1] / 255, color.rgb[2] / 255];
          }
          realtimeShader.setUniform('brushColor', _j494);
          realtimeShader.setUniform('useMask', maskActive ? 1.0 : 0.0);
          if (maskActive) realtimeShader.setUniform('maskTex', maskBuffer);
          $p.noStroke();
          $p.rectMode($p.CENTER);
          $p.rect(0, 0, $p.width, $p.height);
          $p.resetShader();
          screenBuffer.end();
        }
        compositeDirty = isDrawing || isReleasing || isPlaying || isFrameRecording;
      }
    }
    if (typeof $win !== 'undefined') {
      $win.blurBuffersInitialized = $win.blurBuffersInitialized || false;
    }
    function initBlurBuffers() {
      if (typeof $win !== 'undefined' && $win.blurBuffersInitialized) return;
      if (!$win.tempBlurBuffer0) {
        $win.tempBlurBuffer0 = $p.createGraphics($p.width, $p.height, $p.P2D);
        $win.tempBlurBuffer40 = $p.createGraphics($p.width, $p.height, $p.P2D);
        $win.tempBlurBuffer80 = $p.createGraphics($p.width, $p.height, $p.P2D);
        $win.tempBlurBuffer120 = $p.createGraphics($p.width, $p.height, $p.P2D);
        if (typeof $win !== 'undefined') {
          $win.blurBuffersInitialized = true;
        }
      }
    }
    function drawCursorToBuffer() {
      const _j495 = (isDrawing || isReleasing) && countdownFrame < maxUpdates && collectPathPoints;
      const _j496 = !isPlaying || showFuturePathPreview;
      const _j497 = _j495 && showGridOverlay;
      const maskOn =
        (typeof maskActive !== 'undefined' && maskActive) ||
        (typeof maskDrawMode !== 'undefined' && maskDrawMode);
      const testModeOn = typeof $win !== 'undefined' && $win.testMode === true;
      if (_j495 || maskOn || testModeOn) {
        cursorBuffer.begin();
        $p.clear();
        $p.push();
        $p.translate(-hw, -hh);
        const tipOffset = -10;
        $p.translate(tipOffset, tipOffset);
        if (testModeOn) {
          const inset = 10;
          const margin = 4;
          $p.noFill();
          $p.stroke(255, 0, 0, 220);
          $p.strokeWeight(2);
          const frameX1 = margin + inset,
            frameY1 = margin + inset;
          const frameX2 = $p.width - margin + inset,
            frameY2 = $p.height - margin + inset;
          dashedLine(frameX1, frameY1, frameX2, frameY1, 10, 6);
          dashedLine(frameX2, frameY1, frameX2, frameY2, 10, 6);
          dashedLine(frameX2, frameY2, frameX1, frameY2, 10, 6);
          dashedLine(frameX1, frameY2, frameX1, frameY1, 10, 6);
        }
        if (_j497) {
          const _j506 = isPlaying ? playX : cursorX;
          const _j507 = isPlaying ? playY : cursorY;
          const cx = lastTipX || lastTipX === 0 ? lastTipX : _j506;
          const cy = lastTipY || lastTipY === 0 ? lastTipY : _j507;
          const cellSize = gridCellSize;
          const flowActive_ = typeof flowActive !== 'undefined' && flowActive;
          drawGridOverlay(cx, cy, cellSize, flowActive_);
        } else if (maskOn) {
          drawMaskOutline();
        }
        if (pathPoints.length > 1 && _j496) {
          const dashOn = 5;
          const dashOff = 5;
          $p.stroke(255, 0, 0, 255);
          $p.strokeWeight(1);
          dashPenDown = true;
          dashTravelled = 0;
          for (let i = 0; i < pathPoints.length - 1; i++) {
            let x1 = pathPoints[i].x;
            let y1 = pathPoints[i].y;
            let x2 = pathPoints[i + 1].x;
            let y2 = pathPoints[i + 1].y;
            let segLen = $p.dist(x1, y1, x2, y2);
            let dx = (x2 - x1) / segLen;
            let dy = (y2 - y1) / segLen;
            let travelled = 0;
            while (travelled < segLen) {
              let dashLen = dashPenDown ? dashOn : dashOff;
              let stepLen = $p.min(dashLen - dashTravelled, segLen - travelled);
              if (dashPenDown) {
                let startX = x1 + dx * travelled;
                let startY = y1 + dy * travelled;
                let segX = x1 + dx * (travelled + stepLen);
                let segY = y1 + dy * (travelled + stepLen);
                $p.line(startX, startY, segX, segY);
              }
              travelled += stepLen;
              dashTravelled += stepLen;
              if (dashTravelled >= (dashPenDown ? dashOn : dashOff)) {
                dashPenDown = !dashPenDown;
                dashTravelled = 0;
              }
            }
          }
        }
        if (_j496 && _j495) {
          $p.noFill();
          $p.stroke(255, 0, 0, 255);
          $p.strokeWeight(1);
          $p.ellipse(startX, startY, 0, 10);
          const drawX = isPlaying ? playX : cursorX;
          const drawY = isPlaying ? playY : cursorY;
          $p.stroke(255, 0, 0, 255);
          $p.strokeWeight(1);
          $p.ellipse(drawX, drawY, 10, 10);
        }
        $p.pop();
        cursorBuffer.end();
      }
    }
    let canvasW = $win._demoCanvasWidth || 900,
      canvasH = $win._demoCanvasHeight || 900,
      hw,
      hh,
      density = 1.6;
    let forceMapBuffer,
      font,
      lastFrameTime = 0;
    let canvasBackgroundColor = $win._demoCanvasBgColor || [222, 222, 222];
    var showPaperTexture = false,
      showGridOverlay = true,
      showFuturePathPreview = false;
    let mapShader, feedbackShader, realtimeShader, encodeShader, compositeShader, distortShader;
    let typeMapEncodeShader;
    let flowShader;
    const colorTable = buildColorTable();
    let colorIndex = 0,
      inkGray = 0;
    let brushColorMode = 0,
      whiteBrushMode = false,
      whiteMaxOpacity = 0.95;
    let hueShift = 0.0,
      satShift = 0.0,
      briShift = 0.0;
    let customBrushColor = [26, 26, 26];
    let interpSteps, branchTypeInit, spring, friction, sizeNow;
    let velX,
      velY,
      speed,
      strokeWidth,
      pathAngle,
      brushDir = 0;
    let initialSize = 0,
      spraySize = 0,
      brushSize = 0,
      brushSizeMin = 2,
      smoothedWidth = 0;
    let brushMode = 1,
      brushSizeName = 'large',
      baseBrushSize = 2.0,
      brushModeSP = false;
    let shapeType = 0,
      useSharpen = 0.0,
      prevInkEffect = 0.0,
      keyBlendMode = 0;
    let phasorVel = 1,
      targetflyBrushType,
      targetmainStrokeDir;
    let penSketchNoiseBase = 0.5,
      penSketchStrokeWeight = 0.8;
    let brushPaintCtlNoisebyFrame = 0.5,
      brushPaintInterpolationOffset = 0,
      brushPaintOldRInitial = 0.5;
    let flyBrushPoints = [];
    let x,
      y,
      tipX,
      tipY,
      legacyBrushX,
      legacyBrushY,
      lineWidth,
      prevTipX = 0,
      prevTipY = 0;
    let springInitialized;
    let cursorX = 0,
      cursorY = 0,
      lastTipX = 0,
      lastTipY = 0,
      gridCellSize = 20;
    let isDrawing = false,
      isReleasing = false,
      strokeActive = false,
      strokeCommitted = false;
    let pressureEnabled = true;
    let useSpectralMix = false;
    let maskBuffer;
    let maskDrawMode = false;
    $win.resetBrushPositionToMouse = function () {
      if (typeof $in.mouseX === 'undefined' || typeof $in.mouseY === 'undefined') return;
      const px = round2($in.mouseX);
      const py = round2($in.mouseY);
      cursorX = px;
      cursorY = py;
      lastTipX = px;
      lastTipY = py;
      playX = px;
      playY = py;
      playPrevX = px;
      playPrevY = py;
    };
    let maskActive = false;
    let maskTool = 'rect';
    let maskRectDraft = null;
    let maskPolygonPoints = [];
    let currentMaskData = null;
    Object.defineProperty($win, 'spectral', {
      get() {
        return useSpectralMix;
      },
      set(v) {
        useSpectralMix = !!v;
        console.log('[spectral mix]', useSpectralMix ? 'ON' : 'OFF');
      },
    });
    $win.getAgentPathData = function () {
      return {
        active: agentPathActive,
        paths: agentPaths,
        pointCount: agentPaths.filter((p) => !p.stroke).length,
        strokeCount: agentPaths.filter((p) => p.stroke).length,
        canvasSize: {
          w: typeof $p.width !== 'undefined' ? $p.width : 0,
          h: typeof $p.height !== 'undefined' ? $p.height : 0,
        },
        timestamp: Date.now(),
      };
    };
    let pressureNorm = 1.0,
      stylusDetected = false,
      penPressure = 0.0;
    let pressureHistory = [0, 0, 0];
    function pressureMedian3(v) {
      pressureHistory[0] = pressureHistory[1];
      pressureHistory[1] = pressureHistory[2];
      pressureHistory[2] = v;
      const a = pressureHistory[0],
        b = pressureHistory[1],
        c = pressureHistory[2];
      return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
    }
    let pressureBaseBrushSize = null;
    let pointerOnUI = false,
      pathToggle = false,
      compositeDirty = true;
    let agentPathActive = false;
    let agentPaths = [];
    let countdownFrame = 0,
      maxUpdates = 10,
      force = 1.0;
    let strokeFrame = 0,
      feedbackFrame = 0,
      mouseCountStart = 0;
    var doMoving = false,
      autoBugScan = false;
    let pathPoints = [],
      lastStrokeBounds = null,
      startX = 0,
      startY = 0,
      collectPathPoints = false;
    let pathRotationMode = 1,
      pathRotation = 20;
    let randStep = 1,
      step2 = 10,
      expectedStrokeLength = 100;
    let allBrushStrokes = [],
      totalStrokeCount = 0,
      MAX_STORED_STROKES = 100;
    let ctlNoise = 1.0,
      explodeStart = 0,
      explodeEnd = 0;
    let drawingSeed = 0,
      indiffusionStrength = 0.3;
    let seed = 1234567890,
      strokeSeed = 1234567890,
      demoRecording;
    var currentStrokeHighlight = null;
    let futurePathCache = {
      lastEventIndex: -1,
      cachedStrokes: [],
      lastUpdateTime: 0,
      updateInterval: 100,
    };
    let distortDisplacementB = 20.0,
      distortDisplacementC = 100.0,
      distortShowFbmMask = 0.0;
    let rsFrequency = 140.0,
      rsWaveSpeed = 0.5,
      rsStrength = 1.0,
      rsGradientMix = 0.5,
      rsScale = 60.0;
    let cellularEnabled = false,
      cellularScale = 15.0,
      cellularSeed = 0.5;
    let whiteDotEnabled = false,
      whiteDotDensity = 0.01;
    let grainEnabled = false,
      grainAmount = 0.03;
    var rsEnabled = false,
      distortShaderEnabled = false,
      bypassFeedback = false;
    let flowActive = false;
    let flowBlendType = 0;
    let flowStartMillis = 0;
    let flowIterations = 0;
    let flowUnused = 50;
    let flowSeed = 0;
    var flowEffectStrokeBounds = null;
    let flowCommitPending = false;
    let flowCommitData = null;
    let flowFrames = 0;
    var flowTargetFrames = 0;
    var flowTargetIterations = 0;
    let flowIsReplay = false;
    const FLOW_FRAMES_PER_ITERATION = 3;
    var flowParams = {
      blendVol: 100.0,
      blendA: 0.01,
      blendB: 25.0,
      directVol: 10.0,
      snoiseVol: 3.0,
      gobalStyle: 0,
      pixD: 1.0,
      colorDeep: 0.015,
      whiteDot: 0.01,
      doBigShape: 0.0,
      doMask: 0.5,
      multiDir: 0,
      drawTime: 1,
      seed: 0.0,
    };
    var flowLastStrokeOnly = false;
    let fmRandomSeeds = [0, 0, 0, 0],
      fmScales = [0, 0, 0],
      fmAmplitudes = [0, 0, 0],
      fmPhases = [0, 0, 0];
    let fmVortexScales = [0, 0],
      fmClusterScales = [0, 0],
      effect3Brightness = 0.2;
    let oldBuffer, textOverlayGfx, finalBuffer, newBufferBlack, finalOut, futurePathGfx, screenBuffer;
    let pingPongBuffer, cursorBuffer, paperTextureBuffer, plainBgBuffer;
    let realtimeIntermediateBuffer;
    let lastStrokeBuffer;
    let typeMapBuffer;
    let isRecording = false,
      recordStartMillis = 0,
      currentStrokeData = null,
      lastStrokeEndMillis = 0;
    let recordedStrokeCount = 0,
      pausedAccum = 0,
      firstStrokePending = true,
      autoFrameCapture = 0;
    let recordingData = {
      version: '1.0',
      startTime: 0,
      events: [],
      strokes: [],
    };
    let isPlaying = false,
      playbackStartMillis = 0,
      playbackEventIndex = 0,
      playbackSpeed = 1.0;
    let playX = 0,
      playY = 0,
      playPrevX = 0,
      playPrevY = 0;
    let playMouseDown = false,
      isWaitingToLoop = false,
      loopWaitStart = 0;
    let countdownPauseStart = 0,
      countdownPausing = false;
    let playbackOffsetX = 0,
      playbackOffsetY = 0;
    let easycam = null,
      easycamEnabled = false,
      easycamTracking = false;
    let camCenterLerp = 0.05,
      camZoomLerp = 0.05;
    let camStrokeCounter = 0,
      camZoomStrokeMark = 0;
    let camZoomLevel = 1,
      camZoomIn = false;
    let camDistMin = 0,
      camDistMax = 0,
      easycamInitialDistance = 0;
    let easycamInitialCenter = [0, 0, 0],
      camResetFromCenter = [0, 0, 0],
      camResetToCenter = [0, 0, 0];
    let camResetting = false,
      camResetStart = 0,
      camResetFromDist = 0,
      camResetToDist = 0,
      CAMERA_RESET_MS = 1000;
    let layerZAnimating = false,
      layerZAnimStart = 0;
    let layerZFrom = {
        0: 0,
        40: 0,
        80: 0,
        120: 0,
      },
      layerZTarget = {
        0: 0,
        40: 40,
        80: 80,
        120: 120,
      },
      layerZ = {
        0: 0,
        40: 0,
        80: 0,
        120: 0,
      };
    let layerBlurTarget = {
        0: 0,
        40: 0,
        80: 0,
        120: 0,
      },
      layerBlur = {
        0: 0,
        40: 0,
        80: 0,
        120: 0,
      };
    let blurStartMillis = 0,
      BLUR_RAMP_MS = 300;
    let blurActive = false,
      blurNeedsRegen = false;
    let isFrameRecording = false,
      frameRecordStart = 0,
      frameCount = 0,
      frameRecordList = [];
    let frameRecordSkip = 1,
      unused085 = 0.8;
    let overlayVisible = true,
      isDragging = false;
    let unused707 = 10;
    var screenText = false,
      screenTextLines = [],
      SCREEN_TEXT_MAX_LINES = 30,
      screenTextCounter = 0;
    let screenTextX = 25,
      screenTextY0 = 30,
      screenTextLineH = 16,
      screenTextAlpha = 200,
      SCREEN_TEXT_BUFFER_MAX = 200;
    let pendingBugScan = false,
      bugScanSeed = 0,
      pendingBugBounds = null;
    let pendingEffectControlScanQueue = [];
    function preload() {
      // [restored] the site loaded ./lib/inconsolata.otf; the host decides (embedded by default, or none).
      font = $host.fontUrl ? $p.loadFont($host.fontUrl) : null;
      feedbackShader = loadShaderFromSources('./shaders/base.vert', './shaders/feedback.frag');
      realtimeShader = loadShaderFromSources('./shaders/base.vert', './shaders/realtime.frag');
      mapShader = loadShaderFromSources('./shaders/base.vert', './shaders/mapFrag.frag');
      if (typeof $win.doEffect === 'undefined' || $win.doEffect !== false) {
        distortShader = loadShaderFromSources('./shaders/base.vert', './shaders/distort.frag');
      }
      try {
        $win.metallicProgram = loadShaderFromSources('./shaders/base.vert', './shaders/metallic.frag');
      } catch (e) {
        console.warn('⚠️ Metallic shader 加載失敗:', e);
      }
      try {
        flowShader = loadShaderFromSources('./shaders/base.vert', './shaders/flow.frag');
      } catch (e) {
        console.warn('⚠️ Flow shader 加載失敗:', e);
      }
      loadCommitShaders();
      // [restored] removed: site demo autoload (lib/demo.json / #N.json) and sessionStorage restore-after-reload.
      // Use engine.loadScene()/play() instead.
    }
    function setup() {
      if ($host.seed != null) seed = $host.seed; // [restored] seed is an option
      strokeSeed = seed;
      $p.randomSeed(seed);
      $p.noiseSeed(seed);
      // [restored] removed site bootstrap: phone gate, URL flags (?_pix: _w: _h:), mobile density override and
      // sessionStorage restores. Size / pixel density / background are host options now.
      canvasW = $host.width;
      canvasH = $host.height;
      density = $host.pixelDensity;
      if ($host.background) {
        canvasBackgroundColor[0] = $host.background[0];
        canvasBackgroundColor[1] = $host.background[1];
        canvasBackgroundColor[2] = $host.background[2];
      }
      $p.pixelDensity(density);
      $p.createCanvas(canvasW, canvasH, $p.WEBGL);
      if (pressureEnabled) {
        const canvasEl = $host.input.enabled ? $p.canvas : null; // [restored] only when pointer input is bound
        if (canvasEl) {
          const zenModeBtnEl = $doc.getElementById('zen-mode-btn');
          const showPressure = (pressure) => {
            if (!zenModeBtnEl) return;
            if (pressure <= 0) {
              zenModeBtnEl.style.background = 'rgba(0, 0, 0, 0.08)';
            } else {
              const r = Math.round(pressure * 255);
              const a = Math.max(0.2, pressure);
              zenModeBtnEl.style.background = `rgba(${r}, 0, 0, ${a})`;
            }
          };
          const onPenPointer = (e) => {
            if (e.pointerType === 'pen' && e.pressure > 0) {
              if (!stylusDetected) {
                stylusDetected = true;
                logMessage('system', '🖊️ Stylus pressure detected (pointer)', {
                  pressure: e.pressure,
                });
              }
              penPressure = pressureMedian3(e.pressure);
              pressureNorm = Math.min(penPressure / 0.3, 1.0);
              showPressure(penPressure);
            }
          };
          canvasEl.addEventListener('pointerdown', onPenPointer);
          canvasEl.addEventListener('pointermove', onPenPointer);
          canvasEl.addEventListener('pointerup', (e) => {
            if (e.pointerType === 'pen' || stylusDetected) {
              penPressure = 0.0;
              pressureHistory[0] = pressureHistory[1] = pressureHistory[2] = 0;
              pressureNorm = -1;
              showPressure(0);
            }
          });
          const onTouchForce = (e) => {
            if (e.touches && e.touches.length > 0) {
              const t = e.touches[0];
              const isStylus = t.touchType === 'stylus';
              if (isStylus && t.force > 0) {
                const touchForce = Math.min(t.force, 1.0);
                if (!stylusDetected) {
                  stylusDetected = true;
                  logMessage('system', '🖊️ Stylus force detected', {
                    force: t.force,
                  });
                }
                penPressure = pressureMedian3(touchForce);
                pressureNorm = Math.min(penPressure / 0.3, 1.0);
                showPressure(penPressure);
              }
            }
          };
          canvasEl.addEventListener('touchstart', onTouchForce, {
            passive: true,
          });
          canvasEl.addEventListener('touchmove', onTouchForce, {
            passive: true,
          });
          canvasEl.addEventListener(
            'touchend',
            () => {
              if (stylusDetected) {
                penPressure = 0.0;
                pressureHistory[0] = pressureHistory[1] = pressureHistory[2] = 0;
                pressureNorm = -1;
                showPressure(0);
              }
            },
            {
              passive: true,
            },
          );
        }
      }
      forceMapBuffer = $p.createFramebuffer({
        density: density,
      });
      $win.metallicStrength = 0.85;
      $win.metallicFlowSpeed = 1.0;
      $win.metallicSpecular = 12.0;
      $win.metallicFresnel = 0.5;
      $win.bugsSize = 10.0;
      $win.metallicLightX = 0.5;
      $win.metallicLightY = 0.3;
      $win.metallicTint = [0.72, 0.5, 0.35];
      // [restored] removed: panel/zen/reference-image UI initialisation and window resize hook.
      // [restored] the site's control panel applied its slider defaults (index.html) during that init:
      distortDisplacementC = 50;
      rsFrequency = 300;
      rsWaveSpeed = 1.0;
      rsStrength = 0.5;
      rsGradientMix = 0.1;
      rsScale = 100;
      whiteDotDensity = 0.1 * 0.1; // slider value 0.1 × 0.1
      logTitle('Interactive Generative Art System');
      oldBuffer = $p.createFramebuffer({
        density: density,
      });
      oldBuffer.begin();
      $p.background(255);
      oldBuffer.end();
      textOverlayGfx = $p.createGraphics($p.width, $p.height, $p.WEBGL);
      textOverlayGfx.noStroke();
      textOverlayGfx.pixelDensity(density);
      textOverlayGfx.clear();
      finalBuffer = $p.createFramebuffer({
        density: density,
      });
      finalBuffer.begin();
      $p.background(255);
      finalBuffer.end();
      newBufferBlack = $p.createFramebuffer({
        density: density,
      });
      newBufferBlack.begin();
      $p.background(255);
      newBufferBlack.end();
      finalOut = $p.createFramebuffer({
        density: density,
      });
      futurePathGfx = $p.createGraphics($p.width, $p.height, $p.WEBGL);
      futurePathGfx.noStroke();
      futurePathGfx.pixelDensity(density);
      futurePathGfx.clear();
      paperTextureBuffer = $p.createFramebuffer({
        density: density,
      });
      let paperImg = generatePaperTexture(40, 20, 15, 0.2);
      const _j489 = $p.min(255, canvasBackgroundColor[0] * 1.1);
      const _j490 = $p.min(255, canvasBackgroundColor[1] * 1.1);
      const _j491 = $p.min(255, canvasBackgroundColor[2] * 1.1);
      paperTextureBuffer.begin();
      $p.clear();
      $p.noStroke();
      $p.fill(_j489, _j490, _j491);
      $p.rect(-$p.width / 2, -$p.height / 2, $p.width, $p.height);
      $p.blendMode($p.MULTIPLY);
      $p.image(paperImg, -$p.width / 2, -$p.height / 2, $p.width, $p.height);
      paperTextureBuffer.end();
      paperImg.remove();
      plainBgBuffer = $p.createFramebuffer({
        density: density,
      });
      plainBgBuffer.begin();
      $p.background(canvasBackgroundColor[0], canvasBackgroundColor[1], canvasBackgroundColor[2]);
      plainBgBuffer.end();
      screenBuffer = $p.createFramebuffer({
        density: density,
      });
      typeMapBuffer = $p.createFramebuffer({
        density: density,
      });
      typeMapBuffer.begin();
      $p.background(0);
      typeMapBuffer.end();
      pingPongBuffer = $p.createFramebuffer({
        density: density,
      });
      realtimeIntermediateBuffer = $p.createFramebuffer({
        density: density,
      });
      cursorBuffer = $p.createFramebuffer({
        density: density,
      });
      lastStrokeBuffer = $p.createFramebuffer({
        density: density,
      });
      lastStrokeBuffer.begin();
      $p.background(255);
      lastStrokeBuffer.end();
      maskBuffer = $p.createFramebuffer({
        density: density,
      });
      maskBuffer.begin();
      $p.background(255);
      maskBuffer.end();
      if (typeof $win.tempMetallicBuffer === 'undefined') {
        $win.tempMetallicBuffer = $p.createFramebuffer({
          density: density,
        });
      }
      forceMapBuffer.begin();
      $p.background(255, 255, 255);
      forceMapBuffer.end();
      $p.background(canvasBackgroundColor[0], canvasBackgroundColor[1], canvasBackgroundColor[2]);
      hw = $p.width * 0.5;
      hh = $p.height * 0.5;
      playX = hw;
      playY = hh;
      playPrevX = hw;
      playPrevY = hh;
      updateForceMap();
      interpSteps = 10;
      step2 = 2;
      spring = 0.5;
      friction = 0.5;
      branchTypeInit = 0;
      sizeNow = 20;
      x = y = velX = velY = speed = strokeWidth = springInitialized = 0;
      tipX = hw;
      tipY = hh;
      pathAngle = 0;
      initPlaybackEnvironment();
      warmUp();
      initEasyCam();
      randomizeForceMap();
      $host.listen(window, 'mouseup', function (e) {
        if (isDrawing && !isPlaying) {
          const canvasEl = $doc.querySelector('canvas');
          if (canvasEl) {
            const bounds = canvasEl.getBoundingClientRect();
            const _j747 =
              e.clientX < bounds.left ||
              e.clientX > bounds.right ||
              e.clientY < bounds.top ||
              e.clientY > bounds.bottom;
            if (_j747) {
              logMessage('system', '🖱️ Mouse released outside canvas', {
                ClientX: e.clientX,
                ClientY: e.clientY,
              });
              if (!isReleasing) {
                isReleasing = true;
                countdownFrame = 0;
              }
            }
          }
        }
      });
      $host.listen(document, 'mousedown', function (e) {
        pointerOnUI = isPointOverUI(e.clientX, e.clientY);
      });
      $host.listen(document, 'mouseup', function (e) {
        pointerOnUI = false;
      });
      $host.listen(document, 'mousemove', function (e) {
        if (maskDrawMode) return;
        if (typeof $in.mouseX !== 'undefined' && typeof $in.mouseY !== 'undefined') {
          cursorX = round2($in.mouseX);
          cursorY = round2($in.mouseY);
        } else {
          const canvasEl = $doc.querySelector('canvas');
          if (!canvasEl) return;
          const bounds = canvasEl.getBoundingClientRect();
          const _j748 = (e.clientX - bounds.left) / bounds.width;
          const _j749 = (e.clientY - bounds.top) / bounds.height;
          cursorX = round2(_j748 * $p.width);
          cursorY = round2(_j749 * $p.height);
        }
      });
      $win._setupComplete = true;
      $host.emit('ready'); // [restored] was window 'canvasReady' + demo auto-play
    }
    let perfFrameCounter = 0;
    const PERF_SAMPLE_EVERY = 5;
    function draw() {
      // [restored] removed: fxhash debug counters and perf sampling.
      $p.background(canvasBackgroundColor[0], canvasBackgroundColor[1], canvasBackgroundColor[2]);
      if (bugPoints.length > 0 && typeof $win.metallicLightX !== 'undefined') {
        let t = $clock() * 0.0001;
        $win.metallicLightX = 0.5 + Math.sin(t * 0.7) * 0.3;
        $win.metallicLightY = 0.4 + Math.cos(t * 0.5) * 0.25;
      }
      if (isPlaying) {
        updatePlayback();
      }
      cameraReturnHome();
      if (compositeDirty || isDrawing || isReleasing || isPlaying || isFrameRecording) {
        updateCompositeBuffer();
      }
      if (doMoving && !(typeof $win !== 'undefined' && $win.blurBuffersInitialized)) {
        initBlurBuffers();
      }
      updateEasyCamAutoTracking();
      drawCursorToBuffer();
      updateLayerZ();
      updateBlurEffect();
      applyCameraProjection();
      drawLayersWithBlur();
      updateFlowEffect();
      // [restored] removed: fxhash debug overlay + preview capture, video-frame capture, perf report.
      if (isPlaying) {
        if (isReleasing && !countdownPausing) {
          countdownPauseStart = $clock();
          countdownPausing = true;
          if ($win.DEBUG_MODE) console.log(`[⏸️ Countdown 开始]`);
        } else if (!isReleasing && countdownPausing) {
          const _j777 = $clock() - countdownPauseStart;
          const _j778 = playbackStartMillis;
          playbackStartMillis += _j777;
          countdownPausing = false;
          if ($win.DEBUG_MODE) console.log(`[▶️ Countdown 结束] 补偿时间: ${_j777.toFixed(0)}ms`);
          if (playbackEventIndex < recordingData.events.length) {
            const nextEvent = recordingData.events[playbackEventIndex];
            const eventKind = nextEvent.m || nextEvent.type;
            const isPress = eventKind === 'mp' || eventKind === 'mousePressed';
            const evtTime = nextEvent.t !== undefined ? nextEvent.t : nextEvent.time;
            const playbackElapsed = ($clock() - playbackStartMillis) * playbackSpeed;
            const timeUntil = evtTime - playbackElapsed;
            if (isPress || timeUntil <= 0 || timeUntil < 100) {
              if ($win.DEBUG_MODE && isPress) {
                console.log(`[🔧 Countdown 结束后立即处理] mousePressed，时间差: ${timeUntil.toFixed(0)}ms`);
              }
              dispatchPlaybackEvent(nextEvent);
              playbackEventIndex++;
            }
          }
        }
      }
      const isDown = isPlaying
        ? playMouseDown
        : $in.mouseIsPressed || (typeof $win !== 'undefined' && $win._touchDrawing && isDrawing);
      const canDraw = brushMode == 3 || brushMode == 4 || brushMode == 5 ? isDown : isDown && brushSize > 0;
      const inBounds =
        isPlaying ||
        (cursorX >= 0 && cursorX < $p.width && cursorY >= 0 && cursorY < $p.height) ||
        (isDrawing && ($in.mouseIsPressed || (typeof $win !== 'undefined' && $win._touchDrawing)));
      if (typeof $win.drawLoopCount === 'undefined') {
        $win.drawLoopCount = 0;
        $win.drawLoopCheckpoints = [];
      }
      if (canDraw && inBounds) {
        $win.drawLoopCount++;
        if (strokeFrame === 0) {
          $win.crandomDebugger.checkpoint('draw_首次進入', 'draw');
        }
        strokeFrame++;
        let drawX, drawY;
        if (isPlaying) {
          drawX = playX;
          drawY = playY;
        } else {
          drawX = cursorX;
          drawY = cursorY;
        }
        if (strokeFrame % 2 === 0 && collectPathPoints) {
          pathPoints.push({
            x: drawX,
            y: drawY,
          });
        }
        if (agentPathActive) {
          agentPaths.push({
            x: drawX,
            y: drawY,
            t: $clock(),
            pressure: force,
          });
        }
        const frameSeed = strokeSeed + strokeFrame * 100000000;
        $p.randomSeed(frameSeed);
        if (brushMode === 3) {
          let roll = $win.crandom.random(0, 1);
          let altValue = $win.crandom.random(150, 250);
          let grayTarget = roll > 0.1 ? $p.noise(drawX * 0.01, drawY * 0.01) * 150 : altValue;
          inkGray = inkGray * 0.3 + grayTarget * 0.7;
        } else {
          let roll = $win.crandom.random(0, 1);
          let altValue = $win.crandom.random(20, 50);
          let grayTarget = roll > 0.3 ? $p.noise(drawX * 0.01, drawY * 0.01) * 10 : altValue;
          inkGray = inkGray * 0.6 + grayTarget * 0.4;
        }
        brushSize -= randStep;
        brushSize = $p.max(1, brushSize);
        sizeNow = brushSize;
        if (pressureEnabled && strokeFrame >= 8) {
          const pressure = isPlaying
            ? typeof $win._playbackPenPressure !== 'undefined'
              ? $win._playbackPenPressure
              : -1
            : penPressure;
          const prevBaseSize = baseBrushSize;
          if (pressure >= 0.3) {
            const sizeLadder = [0.1, 0.25, 0.5, 1, 2, 3, 5, 10];
            const strokeBaseSize = pressureBaseBrushSize || $win._strokeStartBaseBrushSize || 1;
            let ladderIdx = sizeLadder.indexOf(strokeBaseSize);
            if (ladderIdx === -1) {
              ladderIdx = sizeLadder.findIndex((s) => s >= strokeBaseSize);
              if (ladderIdx === -1) ladderIdx = sizeLadder.length - 1;
            }
            let ladderBoost;
            if (pressure < 0.5) ladderBoost = 1;
            else if (pressure < 0.7) ladderBoost = 2;
            else ladderBoost = 3;
            const newLadderIdx = Math.min(ladderIdx + ladderBoost, sizeLadder.length - 1);
            baseBrushSize = sizeLadder[newLadderIdx];
          } else if (pressure >= 0) {
            baseBrushSize = pressureBaseBrushSize || $win._strokeStartBaseBrushSize || baseBrushSize;
          }
          if (baseBrushSize !== prevBaseSize && prevBaseSize > 0) {
            const _j799 = Math.pow(baseBrushSize / prevBaseSize, 0.6);
            brushSize *= _j799;
            initialSize *= _j799;
          }
        }
        if (brushSize <= brushSizeMin && !isReleasing && brushMode != 3 && brushMode != 4 && brushMode != 5) {
          isReleasing = true;
          countdownFrame = 0;
        }
        tipX = drawX;
        tipY = drawY;
        pathAngle = $p.map($p.noise(tipX * 0.01, tipY * 0.01), 0, 1, -pathRotation, pathRotation);
        if (brushMode !== 3) {
          const jitterSeed = strokeSeed + strokeFrame * 10000000;
          $p.randomSeed(jitterSeed);
          const jitterX = $win.crandom.random(pathRotation * 0.5, pathRotation);
          const jitterY = $win.crandom.random(pathRotation * 0.5, pathRotation);
          const tipOffset = -10;
          tipX += jitterX * $p.cos(pathAngle) + tipOffset;
          tipY += jitterY * $p.sin(pathAngle) + tipOffset;
        }
        if (isRecording) {
          const recX = brushMode === 3 ? tipX : Math.round(tipX);
          const recY = brushMode === 3 ? tipY : Math.round(tipY);
          const mdEvent = {
            x: recX,
            y: recY,
          };
          if (pressureEnabled && stylusDetected) mdEvent.p = Math.round(penPressure * 1000) / 1000;
          recordEvent('md', mdEvent);
          if (typeof $win.recordedMouseDraggedCount !== 'undefined') {
            $win.recordedMouseDraggedCount++;
          }
        }
        lastTipX = tipX;
        lastTipY = tipY;
        let target = newBufferBlack;
        if (strokeFrame === 1) {
          $win.crandomDebugger.checkpoint('brush_首次繪製前', 'brush');
        }
        const moved = $p.dist(tipX, tipY, prevTipX, prevTipY);
        const minMove = 1;
        if (moved > minMove) {
          if (brushMode == 4 && strokeFrame < expectedStrokeLength) {
            drawDryBrush(target, tipX, tipY, prevTipX, prevTipY);
          }
          if ((brushMode == 1 || brushMode == 7) && strokeFrame < expectedStrokeLength) {
            let strokeProgress = expectedStrokeLength > 0 ? $p.min(strokeFrame / expectedStrokeLength, 1.0) : 0;
            let sprayRoll = $win.crandom.random(0, 1);
            if (sprayRoll > 0.9 && whiteBrushMode == 0 && !brushModeSP && baseBrushSize >= 1.5) {
              if (strokeFrame > 5 && baseBrushSize < 6.0) drawSprayDots(target, tipX, tipY);
            }
            drawBrushStroke(target, tipX, tipY, strokeProgress, targetflyBrushType, targetmainStrokeDir);
          }
          if (brushMode == 2 && strokeFrame < expectedStrokeLength) {
            let strokeProgress = expectedStrokeLength > 0 ? $p.min(strokeFrame / expectedStrokeLength, 1.0) : 0;
            let sprayRoll = $win.crandom.random(0, 1);
            if (sprayRoll > 0.8 && whiteBrushMode == 0 && baseBrushSize >= 1 && strokeProgress < 0.6) {
            }
            drawMarker(target, tipX, tipY, strokeProgress, targetflyBrushType, targetmainStrokeDir);
          }
          if (brushMode == 3 && strokeFrame < expectedStrokeLength) {
            drawGothic(target, tipX, tipY, prevTipX, prevTipY);
            if ($win.crandom.random(0, 1) > 0.4) drawSprayDots(target, tipX, tipY);
          }
          if (brushMode == 5 && strokeFrame < expectedStrokeLength) {
            if ($win.crandom.random(0, 1) > 0.05) drawSprayDots(target, tipX, tipY);
          }
          if (brushMode == 6 && strokeFrame < expectedStrokeLength) {
            let strokeProgress = expectedStrokeLength > 0 ? $p.min(strokeFrame / expectedStrokeLength, 1.0) : 0;
            drawFlyBrush(target, tipX, tipY, strokeProgress, targetflyBrushType, targetmainStrokeDir);
          }
        }
        if (strokeFrame === 1) {
          $win.crandomDebugger.checkpoint('brush_首次繪製後', 'brush');
        }
        prevTipX = tipX;
        prevTipY = tipY;
        if (isPlaying) {
          playPrevX = playX;
          playPrevY = playY;
        }
      }
      const isDown2 = isPlaying
        ? playMouseDown
        : $in.mouseIsPressed || (typeof $win !== 'undefined' && $win._touchDrawing && isDrawing);
      const feedbackActive =
        brushMode == 3 || brushMode == 4 || brushMode == 5 ? isDown2 : isDown2 && brushSize > 0;
      if (feedbackActive) {
        if (feedbackFrame === 0) {
          $win.crandomDebugger.checkpoint('shader_首次更新前', 'shader');
        }
        force = 1.0;
        if (brushMode == 4) force = force * 0.4;
        const target = newBufferBlack;
        runFeedbackPass(target, force);
        feedbackFrame++;
        if (feedbackFrame === 1) {
          $win.crandomDebugger.checkpoint('shader_首次更新後', 'shader');
        }
      } else if (isReleasing && countdownFrame < maxUpdates) {
        force = $p.map(countdownFrame, 0, maxUpdates, 1.0, 0.0);
        if (brushMode == 4) force = force * 0.4;
        const target = newBufferBlack;
        runFeedbackPass(target, force);
        countdownFrame++;
        feedbackFrame++;
      } else if (isReleasing && countdownFrame >= maxUpdates) {
        logMessage('art', 'Stroke complete', {
          Status: 'Countdown complete, transferred to static layer',
        });
        commitStroke();
        isReleasing = false;
      }
      if (autoFrameCapture == 1 && isPlaying && !isFrameRecording) {
        startFrameRecording();
      }
      if (autoFrameCapture == 1 && !isPlaying && isFrameRecording) {
        stopFrameRecording();
      }
      if (isFrameRecording) {
        captureFrame();
        if (autoFrameCapture == 1) {
          $p.frameRate(10);
        }
      }
      if (autoFrameCapture == 0) {
        $p.frameRate(60);
      }
      if (pendingBugScan) {
        pendingBugScan = false;
        const savedSeed = drawingSeed;
        $p.randomSeed(bugScanSeed);
        $p.noiseSeed(bugScanSeed);
        let scanBounds = pendingBugBounds
          ? {
              ...pendingBugBounds,
            }
          : null;
        if (!scanBounds) {
          if (typeof allBrushStrokes !== 'undefined' && allBrushStrokes.length > 0) {
            const lastStroke = allBrushStrokes[allBrushStrokes.length - 1];
            if (lastStroke.bounds) {
              scanBounds = {
                ...lastStroke.bounds,
              };
            } else if (lastStroke.points && lastStroke.points.length > 0) {
              let minX = lastStroke.points[0].x;
              let maxX = lastStroke.points[0].x;
              let minY = lastStroke.points[0].y;
              let maxY = lastStroke.points[0].y;
              for (let pt of lastStroke.points) {
                if (pt.x < minX) minX = pt.x;
                if (pt.x > maxX) maxX = pt.x;
                if (pt.y < minY) minY = pt.y;
                if (pt.y > maxY) maxY = pt.y;
              }
              scanBounds = {
                minX,
                maxX,
                minY,
                maxY,
              };
            }
          }
        }
        if (typeof scanBugBites === 'function') {
          scanBugBites(screenBuffer, scanBounds);
        }
        $p.randomSeed(savedSeed);
        $p.noiseSeed(savedSeed);
        bugScanSeed = 0;
        pendingBugBounds = null;
      }
      if (
        typeof $win !== 'undefined' &&
        $win.pendingEffectControlScanQueue &&
        $win.pendingEffectControlScanQueue.length > 0
      ) {
        const scanJob = $win.pendingEffectControlScanQueue.shift();
        if (scanJob && typeof scanBugBites === 'function') {
          let scanBounds = scanJob.scanBounds;
          const action = scanJob.action;
          const shapeType = scanJob.shapeType;
          const bugsSize = scanJob.bugsSize !== undefined ? scanJob.bugsSize : 10.0;
          const scanSeed = scanJob.scanSeed;
          const recordedRandomCount = scanJob.recordedRandomCount;
          const targetPoints = scanJob.targetPoints || null;
          if (typeof $win !== 'undefined') {
            $win.bugsSize = bugsSize;
            const bugsSizeEl = $doc.getElementById('bugs-size');
            const bugsSizeValueEl = $doc.getElementById('bugs-size-value');
            if (bugsSizeEl && bugsSizeValueEl) {
              bugsSizeEl.value = bugsSize;
              bugsSizeValueEl.textContent = bugsSize;
            }
            $win._scanProcessedPlaybackCount = ($win._scanProcessedPlaybackCount || 0) + 1;
          }
          if (action === 'scan-current' && !scanBounds) {
            if (typeof pendingBugBounds !== 'undefined' && pendingBugBounds !== null) {
              scanBounds = {
                ...pendingBugBounds,
              };
            } else if (typeof allBrushStrokes !== 'undefined' && allBrushStrokes.length > 0) {
              const lastStroke = allBrushStrokes[allBrushStrokes.length - 1];
              if (lastStroke.bounds) {
                scanBounds = {
                  ...lastStroke.bounds,
                };
              }
            }
          }
          if (typeof $win !== 'undefined') {
            $win.currentScanEvent = {
              action: action,
              shapeType: shapeType,
              scanSeed: scanSeed,
              recordedRandomCount: recordedRandomCount,
            };
          }
          const savedSeed = seed;
          if (scanSeed) {
            $p.randomSeed(scanSeed);
            $p.noiseSeed(scanSeed);
          }
          scanBugBites(screenBuffer, scanBounds, shapeType, targetPoints);
          if (savedSeed) {
            $p.randomSeed(savedSeed);
            $p.noiseSeed(savedSeed);
          }
          if (typeof $win !== 'undefined') {
            logMessage('playback', '🔁 Effect Control: Scan (processed)', {
              Index: $win._scanProcessedPlaybackCount || 0,
              Action: action,
              ShapeType: shapeType,
              BugsSize: bugsSize,
              HasBounds: !!scanBounds,
            });
            $win.currentScanEvent = null;
            $win.lastEffectControlProcessTime = $clock();
          }
        }
      }
    }
    function mousePressed(e) {
      if (isPlaying) {
        return;
      }
      if (pointerOnUI) {
        return;
      }
      if (maskDrawMode) {
        if (maskTool === 'rect') {
          maskRectDraft = {
            x1: $in.mouseX - 10,
            y1: $in.mouseY - 10,
          };
        } else if (maskTool === 'polygon') {
          maskPolygonPoints.push({
            x: $in.mouseX - 10,
            y: $in.mouseY - 10,
          });
          if (typeof uiMaskStatus === 'function') uiMaskStatus();
        }
        return false;
      }
      cursorX = round2($in.mouseX);
      cursorY = round2($in.mouseY);
      $in.pmouseX = $in.mouseX;
      $in.pmouseY = $in.mouseY;
      lastTipX = cursorX;
      lastTipY = cursorY;
      playX = cursorX;
      playY = cursorY;
      playPrevX = cursorX;
      playPrevY = cursorY;
      if (typeof pressureHistory !== 'undefined') {
        pressureHistory[0] = pressureHistory[1] = pressureHistory[2] = 0;
      }
      const outsideMargin = 300;
      if (
        cursorX < -outsideMargin ||
        cursorX > $p.width + outsideMargin ||
        cursorY < -outsideMargin ||
        cursorY > $p.height + outsideMargin
      ) {
        return;
      }
      $win.crandom.reset();
      $win.crandomDebugger.resetStroke();
      $win.drawLoopCount = 0;
      $win.recordedMouseDraggedCount = 0;
      if (isRecording) {
        recordedStrokeCount++;
      }
      if (isRecording) {
        console.log(`🎬 錄製開始 [第 ${recordedStrokeCount} 筆]`);
      }
      strokeSeed = $p.int($win.crandom.random(100000000, 999999999));
      $win.crandomDebugger.checkpoint('mousePressed_開始', 'mousePressed');
      commitIfPending();
      $p.randomSeed(strokeSeed);
      $p.noiseSeed(strokeSeed);
      logMessage('art', 'New stroke started', {
        Seed: strokeSeed,
        Mode: `Brush mode ${brushMode}`,
        Position: `(${cursorX.toFixed(0)}, ${cursorY.toFixed(0)})`,
      });
      camStrokeCounter++;
      mouseCountStart = strokeFrame;
      inkGray = 0;
      strokeFrame = 0;
      if (pressureEnabled && pressureBaseBrushSize !== null) {
        baseBrushSize = pressureBaseBrushSize;
      }
      if (typeof sprayParticles !== 'undefined') {
        sprayParticles = [];
      }
      if (typeof sprayParticleCounter !== 'undefined') {
        sprayParticleCounter = 0;
      }
      whiteMaxOpacity = $win.crandom.random(0.5, 0.99);
      hueShift = $win.crandom.random(-0.02, 0.02);
      satShift = $win.crandom.random(-0.05, 0.05);
      briShift = $win.crandom.random(-0.05, 0.05);
      explodeStart = $win.crandom.random(0, 1) > 0.8 ? 1 : 0;
      explodeEnd = $win.crandom.random(0, 1) > 0.8 ? 1 : 0;
      targetflyBrushType = $p.max(0, $p.int($win.crandom.random(-1, 3)));
      targetmainStrokeDir = $p.max(0, $p.int($win.crandom.random(-1, 3)));
      brushDir = $p.int($win.crandom.random(0, 4));
      indiffusionStrength = round2($win.crandom.random(0.4, 0.5));
      if (brushMode == 3 || brushMode == 4) indiffusionStrength = round2($win.crandom.random(0.2, 0.3));
      else if (brushMode == 5) indiffusionStrength = round2($win.crandom.random(0.25, 0.35));
      indiffusionStrength = 0.45;
      let _j818 = '';
      if (baseBrushSize <= 1.5) ((explodeStart = 0), (explodeEnd = 0));
      let _j819 = `頭${explodeStart === 1 ? 'E' : 'N'} ｜ 尾${explodeEnd === 1 ? 'E' : 'N'}`;
      effect3Brightness = $win.crandom.random(0.5, 0.9);
      colorIndex = $p.int($win.crandom.random(0, 4));
      shapeType = $p.int($win.crandom.random(0, 4));
      brushPaintCtlNoisebyFrame = $p.max($p.noise(0), 0, 1, 0.2, 0.8);
      brushPaintInterpolationOffset = $p.int($win.crandom.random(-2, 4));
      brushPaintOldRInitial = $win.crandom.random(0, 1) > 0.6 ? 0.5 : 0;
      if (isRecording) {
        if (firstStrokePending) {
          if (recordStartMillis === 0) {
            recordStartMillis = $clock();
            logMessage('recording', '⏱️ Start timing', {
              Status: 'First stroke recording started',
            });
          } else {
            const sinceLastStroke = $clock() - lastStrokeEndMillis;
            if (sinceLastStroke > 0) {
              pausedAccum += sinceLastStroke;
              logMessage('recording', '⏸️ Skip interval', {
                Interval: `${sinceLastStroke.toFixed(0)}ms`,
                Accumulated: `${pausedAccum.toFixed(0)}ms`,
              });
            }
          }
          firstStrokePending = false;
        } else {
          const sinceLastStroke = $clock() - lastStrokeEndMillis;
          pausedAccum += sinceLastStroke;
          logMessage('recording', '⏸️ Skip interval', {
            Interval: `${sinceLastStroke.toFixed(0)}ms`,
            Accumulated: `${pausedAccum.toFixed(0)}ms`,
          });
        }
        currentStrokeData = {
          strokeSeed: strokeSeed,
          mouseCountStart: mouseCountStart,
          colorIndex: colorIndex,
          shapeType: shapeType,
          useSharpen: useSharpen,
          brushMode: brushMode,
          indiffusionStrength: indiffusionStrength,
          whiteBrushMode: whiteBrushMode,
          brushColorMode: brushColorMode,
          customBrushColor:
            brushColorMode === 33 && typeof customBrushColor !== 'undefined'
              ? [customBrushColor[0], customBrushColor[1], customBrushColor[2]]
              : undefined,
          phasorVel: phasorVel,
          explodeStart: explodeStart,
          explodeEnd: explodeEnd,
          whiteMaxOpacity: round2(whiteMaxOpacity),
          hueShift: round2(hueShift),
          satShift: round2(satShift),
          briShift: round2(briShift),
          targetflyBrushType: targetflyBrushType,
          targetmainStrokeDir: targetmainStrokeDir,
          brushDir: brushDir,
          ctlNoise: ctlNoise,
          penSketchNoiseBase: brushMode === 4 ? penSketchNoiseBase : undefined,
          penSketchStrokeWeight: brushMode === 4 ? penSketchStrokeWeight : undefined,
          brushPaintCtlNoisebyFrame: brushPaintCtlNoisebyFrame,
          brushPaintInterpolationOffset: brushPaintInterpolationOffset,
          brushPaintOldRInitial: brushPaintOldRInitial,
          keyBlendMode: keyBlendMode,
          useSpectralMix: useSpectralMix,
          maskData: currentMaskData || undefined,
        };
      }
      if (pathRotationMode === 1) {
        pathRotation = 0;
      } else if (pathRotationMode === 2) {
        pathRotation = round2($win.crandom.random(5, 10));
      } else if (pathRotationMode === 3) {
        pathRotation = round2($win.crandom.random(10, 25));
      }
      if (brushMode === 1) {
        initialSize = round2($win.crandom.random(20, 24) * baseBrushSize);
        spraySize = 3 * baseBrushSize;
        if (baseBrushSize > 5.0) spraySize = 1.5 * baseBrushSize;
        randStep = 0.05;
        maxUpdates = 30;
        interpSteps = 15;
        step2 = 5;
        spring = 0.6;
        friction = 0.5;
      } else if (brushMode === 2) {
        initialSize = round2($win.crandom.random(20, 24) * baseBrushSize);
        spraySize = 1 * baseBrushSize;
        randStep = 0.05;
        maxUpdates = 10;
        interpSteps = 10;
        step2 = 10;
        spring = 0.3;
        friction = 0.5;
      } else if (brushMode === 3) {
        initialSize = $win.crandom.random(2, 4) * baseBrushSize;
        spraySize = 10 * baseBrushSize;
        step2 = 3;
        randStep = 0.05;
        maxUpdates = 10;
      } else if (brushMode === 4) {
        initialSize = $win.crandom.random(6, 9) * baseBrushSize;
        spraySize = 1 * baseBrushSize;
        step2 = 5;
        randStep = 0.05;
        maxUpdates = 10;
        penSketchNoiseBase = $p.noise(cursorX * 1, cursorY * 1);
        penSketchStrokeWeight = $win.crandom.random(0, 1) > 0.95 ? 1.2 : 0.8;
        expectedStrokeLength = 100;
        spring = 0.6;
        friction = 0.5;
      } else if (brushMode === 5) {
        initialSize = $win.crandom.random(10, 14) * baseBrushSize;
        spraySize = 10;
        step2 = 1;
        randStep = 0.05;
        maxUpdates = 10;
        interpSteps = 10;
        spring = 0.6;
        friction = 0.5;
      } else if (brushMode === 6) {
        initialSize = $win.crandom.random(10, 14) * baseBrushSize;
        spraySize = 10;
        step2 = 1;
        randStep = 0.05;
        maxUpdates = 10;
        interpSteps = 10;
        spring = 0.6;
        friction = 0.5;
      } else {
        initialSize = $win.crandom.random(30, 40);
        maxUpdates = 10;
        randStep = 0.05;
      }
      if (useSharpen >= 3.5) {
        maxUpdates = 20;
        logMessage('system', '⚡️ Ink Effect G active, maxUpdates set to 5', {
          Status: 'Performance Optimization',
        });
      }
      if (brushMode == 4) {
        expectedStrokeLength = 400;
      } else {
        expectedStrokeLength = 400;
      }
      if (isRecording && currentStrokeData) {
        currentStrokeData.initialSize = initialSize;
        currentStrokeData.spraySize = spraySize;
        currentStrokeData.step = interpSteps;
        currentStrokeData.step2 = step2;
        currentStrokeData.randStep = randStep;
        currentStrokeData.maxUpdates = maxUpdates;
        currentStrokeData.pathRotation = pathRotation;
        currentStrokeData.spring = spring;
        currentStrokeData.friction = friction;
        currentStrokeData.baseBrushSize = baseBrushSize;
        currentStrokeData.expectedStrokeLength = expectedStrokeLength;
        currentStrokeData.effect3Brightness = round2(effect3Brightness);
      }
      brushSize = initialSize;
      sizeNow = brushSize;
      strokeWidth = sizeNow;
      gridCellSize = initialSize;
      $win._strokeStartBaseBrushSize = baseBrushSize;
      if (pressureEnabled && pressureBaseBrushSize === null) pressureBaseBrushSize = baseBrushSize;
      springInitialized = 0;
      x = cursorX;
      y = cursorY;
      velX = 0;
      velY = 0;
      speed = 0;
      lineWidth = 0;
      smoothedWidth = 0;
      if (typeof drawMarker !== 'undefined') {
        drawMarker.lastAngle = 0;
        drawMarker.lastMovementAngle = 0;
      }
      if (typeof resetFlyBrushCaches === 'function') {
        resetFlyBrushCaches();
      }
      if (typeof drawFlyBrush !== 'undefined') {
        drawFlyBrush.lastAngle = 0;
        drawFlyBrush.lastMovementAngle = 0;
      }
      prevTipX = cursorX;
      prevTipY = cursorY;
      isDrawing = true;
      isReleasing = false;
      countdownFrame = 0;
      feedbackFrame = 0;
      strokeActive = true;
      strokeCommitted = false;
      startX = cursorX;
      startY = cursorY;
      pathPoints = [
        {
          x: cursorX,
          y: cursorY,
        },
      ];
      collectPathPoints = true;
      drawingSeed = $p.int($win.crandom.random(1000000, 9999999));
      if (brushMode == 7) brushModeSP = true;
      else brushModeSP = false;
      $p.randomSeed(drawingSeed);
      $p.noiseSeed(drawingSeed);
      $win.crandomDebugger.checkpoint('mousePressed_結束', 'mousePressed');
      if (isRecording && currentStrokeData) {
        currentStrokeData.mouseX = cursorX;
        currentStrokeData.mouseY = cursorY;
        currentStrokeData.drawingSeed = drawingSeed;
        currentStrokeData.brushModeSP = brushModeSP;
        if (pressureEnabled && stylusDetected) currentStrokeData.hasPressure = true;
        currentStrokeData.forceMapParams = {
          randomSeed1: round2(fmRandomSeeds[0]),
          randomSeed2: round2(fmRandomSeeds[1]),
          randomSeed3: round2(fmRandomSeeds[2]),
          randomSeed4: round2(fmRandomSeeds[3]),
          scale1: round2(fmScales[0]),
          scale2: round2(fmScales[1]),
          scale3: round2(fmScales[2]),
          amplitude1: round2(fmAmplitudes[0]),
          amplitude2: round2(fmAmplitudes[1]),
          amplitude3: round2(fmAmplitudes[2]),
          phase1: round2(fmPhases[0]),
          phase2: round2(fmPhases[1]),
          phase3: round2(fmPhases[2]),
          vortexScale1: round2(fmVortexScales[0]),
          vortexScale2: round2(fmVortexScales[1]),
          clusterScale1: round2(fmClusterScales[0]),
          clusterScale2: round2(fmClusterScales[1]),
        };
        const _j821 = brushMode === 3 ? cursorX : Math.round(cursorX);
        const _j822 = brushMode === 3 ? cursorY : Math.round(cursorY);
        recordEvent('mp', {
          x: _j821,
          y: _j822,
          strokeData: currentStrokeData,
        });
      }
    }
    function mouseReleased() {
      if (isPlaying) {
        return;
      }
      if (maskDrawMode && maskTool === 'rect' && maskRectDraft && maskRectDraft.x1 !== undefined) {
        const mx = $in.mouseX - 10,
          my = $in.mouseY - 10;
        const x1 = Math.min(maskRectDraft.x1, mx);
        const y1 = Math.min(maskRectDraft.y1, my);
        const x2 = Math.max(maskRectDraft.x1, mx);
        const y2 = Math.max(maskRectDraft.y1, my);
        if (Math.abs(x2 - x1) > 5 && Math.abs(y2 - y1) > 5) {
          maskRectDraft = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
          };
          drawMaskRect(x1, y1, x2, y2);
          currentMaskData = {
            action: 'rect',
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
          };
          maskDrawMode = false;
          const toggle = $doc.getElementById('mask-mode-toggle');
          if (toggle) toggle.checked = false;
          if (typeof uiMaskStatus === 'function') uiMaskStatus();
          $win.resetBrushPositionToMouse();
        }
        return;
      }
      if (!isDrawing) {
        return;
      }
      if (agentPathActive) {
        agentPaths.push({
          stroke: true,
          t: $clock(),
        });
      }
      const _j823 = $win.crandom.getCount();
      const _j824 = cursorX;
      const _j825 = cursorY;
      const _j826 = Math.round($p.constrain(_j824, 0, $p.width));
      const _j827 = Math.round($p.constrain(_j825, 0, $p.height));
      recordEvent('mr', {
        x: _j826,
        y: _j827,
      });
      $win.crandomDebugger.checkpoint('mouseReleased', 'mouseReleased');
      const randomCount = $win.crandom.getCount();
      const _j828 = randomCount - _j823;
      const _j829 = $win.drawLoopCount || 0;
      const _j830 = $win.recordedMouseDraggedCount || 0;
      if (isRecording) {
        console.log(`   Draw: ${_j829} | random(): ${randomCount}`);
      }
      $win.drawLoopCount = 0;
      $win.recordedMouseDraggedCount = 0;
      if (isRecording) {
        $win.crandomDebugger.saveStroke('recording', recordedStrokeCount);
      }
      if (isRecording) {
        lastStrokeEndMillis = $clock();
        logMessage('recording', 'Stroke ended', {
          FinalSize: brushSize.toFixed(2),
          CountdownStatus: isReleasing ? 'In progress' : 'Not started',
          brushMode: brushMode,
          OutsideCanvas: cursorX < 0 || cursorX >= $p.width || cursorY < 0 || cursorY >= $p.height,
          RandomCalls: randomCount,
        });
      }
      if (typeof sprayParticles !== 'undefined' && sprayParticles.length > 0) {
        sprayParticles = sprayParticles.filter((_j1569) => _j1569.radius > 0);
      }
      if (!isReleasing) {
        isReleasing = true;
        countdownFrame = 0;
      }
    }
    function updateLayerZ() {
      const cameraTracking = doMoving && easycamEnabled && easycam !== null && isPlaying && easycamTracking;
      const _j832 =
        (isPlaying && cameraTracking) ||
        (!isPlaying &&
          (layerZAnimating || layerZ[0] !== 0 || layerZ[40] !== 0 || layerZ[80] !== 0 || layerZ[120] !== 0));
      if (_j832) {
        if (!layerZAnimating) {
          layerZAnimating = true;
          layerZAnimStart = $clock();
          layerZFrom[0] = layerZ[0];
          layerZFrom[40] = layerZ[40];
          layerZFrom[80] = layerZ[80];
          layerZFrom[120] = layerZ[120];
        }
        const elapsed = $clock() - layerZAnimStart;
        const progress = Math.min(elapsed / CAMERA_RESET_MS, 1.0);
        const zTargets = isPlaying
          ? layerZTarget
          : {
              0: 0,
              40: 0,
              80: 0,
              120: 0,
            };
        layerZ[0] = $p.lerp(layerZFrom[0], zTargets[0], progress);
        layerZ[40] = $p.lerp(layerZFrom[40], zTargets[40], progress);
        layerZ[80] = $p.lerp(layerZFrom[80], zTargets[80], progress);
        layerZ[120] = $p.lerp(layerZFrom[120], zTargets[120], progress);
        if (progress >= 1.0) {
          layerZ[0] = zTargets[0];
          layerZ[40] = zTargets[40];
          layerZ[80] = zTargets[80];
          layerZ[120] = zTargets[120];
          if (!isPlaying) {
            layerZAnimating = false;
          }
        }
      } else if (!isPlaying && !layerZAnimating) {
        layerZ[0] = 0;
        layerZ[40] = 0;
        layerZ[80] = 0;
        layerZ[120] = 0;
      }
    }
    function updateBlurEffect() {
      const cameraTracking = doMoving && easycamEnabled && easycam !== null && isPlaying && easycamTracking;
      const _j834 = isPlaying;
      const pressedNow = _j834
        ? playMouseDown
        : $in.mouseIsPressed || (typeof $win !== 'undefined' && $win._touchDrawing && isDrawing);
      const _j836 = brushMode == 3 || brushMode == 4 || brushMode == 5 ? pressedNow : pressedNow && brushSize > 0;
      if (!doMoving) {
        layerBlur[0] = 0;
        layerBlur[40] = 0;
        layerBlur[80] = 0;
        layerBlur[120] = 0;
        return;
      }
      if (_j834) {
        if (blurNeedsRegen) {
          $win.crandomDebugger.checkpoint('updateBlurEffect_開始生成', 'blur');
          layerBlurTarget[0] = round2($p.max(0, $win.crandom.random(-5, 5)));
          layerBlurTarget[40] = round2($p.max(0, $win.crandom.random(-5, 5)));
          layerBlurTarget[80] = round2($p.max(0, $win.crandom.random(-5, 5)));
          layerBlurTarget[120] = round2($p.max(0, $win.crandom.random(-5, 5)));
          $win.crandomDebugger.checkpoint('updateBlurEffect_完成生成', 'blur');
          blurStartMillis = $clock();
          blurNeedsRegen = false;
        }
        blurActive = pressedNow;
      } else {
        blurActive = false;
        blurNeedsRegen = false;
      }
      let _j837 = 0;
      if (_j834) {
        if (_j836) {
          const elapsed = $clock() - blurStartMillis;
          const progress = $p.min(1.0, elapsed / BLUR_RAMP_MS);
          _j837 = progress;
        } else if (isReleasing) {
          const _j838 = $p.map(countdownFrame, 0, maxUpdates, 1.0, 0.0);
          _j837 = _j838;
        } else {
          _j837 = 0;
        }
        if (cameraTracking && easycam !== null) {
          const camDist = easycam.getDistance();
          const fov = $p.PI / 3;
          const defaultCamDist = $p.height / (2 * $p.tan(fov / 2));
          const _j449 = 1.1;
          const _j450 = 1.4;
          const _j452 = defaultCamDist / camDist;
          const _j839 = _j450 - _j449;
          const _j840 = (_j452 - _j449) / _j839;
          const _j841 = $p.constrain(_j840, 0.0, 1.0);
          const _j842 = $p.pow(_j841, 0.5);
          _j837 = _j837 * _j842;
        }
      }
      layerBlur[0] = layerBlurTarget[0] * _j837;
      layerBlur[40] = layerBlurTarget[40] * _j837;
      layerBlur[80] = layerBlurTarget[80] * _j837;
      layerBlur[120] = layerBlurTarget[120] * _j837;
    }
    function drawLayersWithBlur() {
      const cameraTracking = doMoving && easycamEnabled && easycam !== null && isPlaying && easycamTracking;
      const maskOn =
        (typeof maskActive !== 'undefined' && maskActive) ||
        (typeof maskDrawMode !== 'undefined' && maskDrawMode);
      const testModeOn = typeof $win !== 'undefined' && $win.testMode === true;
      const _j495 =
        ((isDrawing || isReleasing) && countdownFrame < maxUpdates && collectPathPoints) || maskOn || testModeOn;
      const _j843 = bugPoints.length > 0 && typeof applyMetallicPass === 'function';
      const _j844 = false;
      const _j845 =
        (typeof $win.doEffect === 'undefined' || $win.doEffect !== false) &&
        (distortShaderEnabled || rsEnabled || cellularEnabled || whiteDotEnabled || grainEnabled) &&
        distortShader &&
        forceMapBuffer;
      if (mapShader && forceMapBuffer) {
        updateForceMap();
      }
      finalOut.begin();
      $p.clear();
      if (_j845) {
        let _j846 = screenBuffer;
        if (_j843) {
          $win.tempMetallicBuffer.begin();
          $p.clear();
          $p.imageMode($p.CENTER);
          $p.image(screenBuffer, 0, 0, $p.width, $p.height);
          $win.tempMetallicBuffer.end();
          applyMetallicPass(realtimeIntermediateBuffer, $win.tempMetallicBuffer);
          _j846 = realtimeIntermediateBuffer;
        }
        $p.background(canvasBackgroundColor[0], canvasBackgroundColor[1], canvasBackgroundColor[2]);
        $p.shader(distortShader);
        distortShader.setUniform('rect', [0, 0, $p.width * density, $p.height * density]);
        distortShader.setUniform('tex0', _j846);
        distortShader.setUniform('forceMap', forceMapBuffer);
        distortShader.setUniform('time', $clock() * 0.005);
        distortShader.setUniform('backgroundColor', [
          canvasBackgroundColor[0] / 255.0,
          canvasBackgroundColor[1] / 255.0,
          canvasBackgroundColor[2] / 255.0,
        ]);
        if (distortShaderEnabled) {
          distortShader.setUniform('distortEnabled', 1.0);
          distortShader.setUniform('displacementB', distortDisplacementB);
          distortShader.setUniform('displacementC', distortDisplacementC);
          distortShader.setUniform('showFbmMask', distortShowFbmMask);
          distortShader.setUniform('fbmSeed1', fmRandomSeeds[0] || 100);
          distortShader.setUniform('fbmSeed2', fmRandomSeeds[1] || 200);
          distortShader.setUniform('fbmSeed3', fmRandomSeeds[2] || 300);
          distortShader.setUniform('fbmSeed4', fmRandomSeeds[3] || 400);
        } else {
          distortShader.setUniform('distortEnabled', 0.0);
        }
        if (rsEnabled) {
          distortShader.setUniform('rsEnabled', 1.0);
          distortShader.setUniform('rsFrequency', rsFrequency);
          distortShader.setUniform('rsWaveSpeed', rsWaveSpeed);
          distortShader.setUniform('rsStrength', rsStrength);
          distortShader.setUniform('rsGradientMix', rsGradientMix);
          distortShader.setUniform('rsScale', rsScale);
        } else {
          distortShader.setUniform('rsEnabled', 0.0);
        }
        distortShader.setUniform('cellularEnabled', cellularEnabled ? 1.0 : 0.0);
        distortShader.setUniform('cellularScale', cellularScale);
        distortShader.setUniform('cellularSeed', cellularSeed);
        distortShader.setUniform('whiteDotDensity', whiteDotEnabled ? whiteDotDensity : 0.0);
        distortShader.setUniform('grainAmount', grainEnabled ? grainAmount : 0.0);
        $p.noStroke();
        $p.rectMode($p.CENTER);
        $p.rect(0, 0, $p.width, $p.height);
        $p.resetShader();
      } else {
        $p.imageMode($p.CENTER);
        $p.image(screenBuffer, 0, 0, $p.width, $p.height);
        if (_j843) {
          $win.tempMetallicBuffer.begin();
          $p.clear();
          $p.imageMode($p.CENTER);
          $p.image(finalOut, 0, 0, $p.width, $p.height);
          $win.tempMetallicBuffer.end();
          applyMetallicPass(realtimeIntermediateBuffer, $win.tempMetallicBuffer);
          $p.imageMode($p.CENTER);
          $p.image(realtimeIntermediateBuffer, 0, 0, $p.width, $p.height);
        }
      }
      finalOut.end();
      if (flowCommitPending && flowCommitData) {
        const data = flowCommitData;
        const bounds = data.bounds;
        const _j847 = {
          rect: [0, 0, $p.width * density, $p.height * density],
          blendType: data.blendType,
          blendVol: flowParams.blendVol * (1 + data.iterations * 0.1),
          radSeed: data.seed * 0.001,
          strokeBounds: [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY],
          pixD: flowParams.pixD,
          blendA: flowParams.blendA,
          blendB: flowParams.blendB,
          directVol: flowParams.directVol,
          snoiseVol: flowParams.snoiseVol,
          gobalStyle: flowParams.gobalStyle,
          vline: 5,
          hline: 5,
          cellT: 1.0,
          colorDeep: flowParams.colorDeep,
          whiteDot: flowParams.whiteDot,
          doBigShape: flowParams.doBigShape,
          doMask: flowParams.doMask,
          multiDir: flowParams.multiDir,
          drawTime: flowParams.drawTime,
          seed: flowParams.seed,
          iTime: $clock() * 0.001,
        };
        if (typeMapBuffer && flowShader) {
          pingPongBuffer.begin();
          $p.clear();
          $p.shader(flowShader);
          for (const [key, val] of Object.entries(_j847)) {
            flowShader.setUniform(key, val);
          }
          flowShader.setUniform('tex0', typeMapBuffer);
          flowShader.setUniform('lastStrokeTex', lastStrokeBuffer);
          flowShader.setUniform('lastStrokeOnly', flowLastStrokeOnly ? 1 : 0);
          flowShader.setUniform('isTypeMapMode', 1);
          $p.noStroke();
          $p.rectMode($p.CENTER);
          $p.rect(0, 0, $p.width, $p.height);
          $p.resetShader();
          pingPongBuffer.end();
          typeMapBuffer.begin();
          $p.clear();
          $p.background(0);
          $p.imageMode($p.CENTER);
          $p.image(pingPongBuffer, 0, 0, $p.width, $p.height);
          typeMapBuffer.end();
        }
        if (flowShader) {
          screenBuffer.begin();
          $p.clear();
          $p.imageMode($p.CENTER);
          $p.image(oldBuffer, 0, 0, $p.width, $p.height);
          screenBuffer.end();
          oldBuffer.begin();
          $p.shader(flowShader);
          for (const [key, val] of Object.entries(_j847)) {
            flowShader.setUniform(key, val);
          }
          flowShader.setUniform('tex0', screenBuffer);
          flowShader.setUniform('lastStrokeTex', lastStrokeBuffer);
          flowShader.setUniform('lastStrokeOnly', flowLastStrokeOnly ? 1 : 0);
          flowShader.setUniform('isTypeMapMode', 0);
          $p.noStroke();
          $p.rectMode($p.CENTER);
          $p.rect(0, 0, $p.width, $p.height);
          $p.resetShader();
          oldBuffer.end();
        }
        if (flowShader) {
          screenBuffer.begin();
          $p.clear();
          $p.imageMode($p.CENTER);
          $p.image(finalBuffer, 0, 0, $p.width, $p.height);
          screenBuffer.end();
          finalBuffer.begin();
          $p.shader(flowShader);
          for (const [key, val] of Object.entries(_j847)) {
            flowShader.setUniform(key, val);
          }
          flowShader.setUniform('tex0', screenBuffer);
          flowShader.setUniform('lastStrokeTex', lastStrokeBuffer);
          flowShader.setUniform('lastStrokeOnly', flowLastStrokeOnly ? 1 : 0);
          flowShader.setUniform('isTypeMapMode', 0);
          $p.noStroke();
          $p.rectMode($p.CENTER);
          $p.rect(0, 0, $p.width, $p.height);
          $p.resetShader();
          finalBuffer.end();
        }
        if (flowShader) {
          screenBuffer.begin();
          $p.clear();
          $p.imageMode($p.CENTER);
          $p.image(finalOut, 0, 0, $p.width, $p.height);
          screenBuffer.end();
          finalOut.begin();
          $p.shader(flowShader);
          for (const [key, val] of Object.entries(_j847)) {
            flowShader.setUniform(key, val);
          }
          flowShader.setUniform('tex0', screenBuffer);
          flowShader.setUniform('lastStrokeTex', lastStrokeBuffer);
          flowShader.setUniform('lastStrokeOnly', flowLastStrokeOnly ? 1 : 0);
          flowShader.setUniform('isTypeMapMode', 0);
          $p.noStroke();
          $p.rectMode($p.CENTER);
          $p.rect(0, 0, $p.width, $p.height);
          $p.resetShader();
          finalOut.end();
        }
        flowCommitPending = false;
        flowCommitData = null;
        compositeDirty = true;
      }
      if (flowActive && flowShader && flowEffectStrokeBounds) {
        const bounds = flowEffectStrokeBounds;
        pingPongBuffer.begin();
        $p.clear();
        $p.imageMode($p.CENTER);
        $p.image(finalOut, 0, 0, $p.width, $p.height);
        pingPongBuffer.end();
        finalOut.begin();
        $p.shader(flowShader);
        flowShader.setUniform('rect', [0, 0, $p.width * density, $p.height * density]);
        flowShader.setUniform('tex0', pingPongBuffer);
        flowShader.setUniform('lastStrokeTex', lastStrokeBuffer);
        flowShader.setUniform('lastStrokeOnly', flowLastStrokeOnly ? 1 : 0);
        flowShader.setUniform('blendType', flowBlendType);
        flowShader.setUniform('blendVol', flowParams.blendVol * (1 + flowIterations * 0.1));
        flowShader.setUniform('radSeed', flowSeed * 0.001);
        flowShader.setUniform('strokeBounds', [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY]);
        flowShader.setUniform('pixD', flowParams.pixD);
        flowShader.setUniform('blendA', flowParams.blendA);
        flowShader.setUniform('blendB', flowParams.blendB);
        flowShader.setUniform('directVol', flowParams.directVol);
        flowShader.setUniform('snoiseVol', flowParams.snoiseVol);
        flowShader.setUniform('gobalStyle', flowParams.gobalStyle);
        flowShader.setUniform('vline', 5);
        flowShader.setUniform('hline', 5);
        flowShader.setUniform('cellT', 1.0);
        flowShader.setUniform('colorDeep', flowParams.colorDeep);
        flowShader.setUniform('whiteDot', flowParams.whiteDot);
        flowShader.setUniform('doBigShape', flowParams.doBigShape);
        flowShader.setUniform('doMask', flowParams.doMask);
        flowShader.setUniform('multiDir', flowParams.multiDir);
        flowShader.setUniform('drawTime', flowParams.drawTime);
        flowShader.setUniform('seed', flowParams.seed);
        flowShader.setUniform('iTime', $clock() * 0.001);
        flowShader.setUniform('isTypeMapMode', 0);
        $p.noStroke();
        $p.rectMode($p.CENTER);
        $p.rect(0, 0, $p.width, $p.height);
        $p.resetShader();
        finalOut.end();
      }
      $p.noStroke();
      $p.push();
      $p.translate(0, 0, layerZ[0]);
      $p.image(finalOut, -$p.width / 2, -$p.height / 2);
      $p.pop();
      if (_j495) {
        $p.push();
        $p.translate(0, 0, layerZ[40]);
        $p.image(cursorBuffer, -$p.width / 2, -$p.height / 2);
        $p.pop();
      }
      if (isPlaying) {
        if (showFuturePathPreview) {
          drawFuturePathPreview();
        } else {
          futurePathGfx.clear();
        }
        $p.push();
        $p.translate(0, 0, layerZ[80]);
        $p.image(futurePathGfx, -$p.width / 2, -$p.height / 2);
        $p.pop();
      }
      if (screenText && overlayVisible) {
        drawScreenText();
      } else if (currentStrokeHighlight && currentStrokeHighlight.gridParams) {
        textOverlayGfx.clear();
        textOverlayGfx.push();
        drawStrokeHighlight();
        drawStrokeDividers();
        textOverlayGfx.pop();
      } else {
        textOverlayGfx.clear();
        textOverlayGfx.push();
        drawStrokeDividers();
        textOverlayGfx.pop();
      }
      const _j848 =
        (screenText && overlayVisible) ||
        (currentStrokeHighlight && currentStrokeHighlight.gridParams) ||
        (typeof allBrushStrokes !== 'undefined' && Array.isArray(allBrushStrokes) && allBrushStrokes.length > 0);
      if (_j848) {
        $p.push();
        $p.translate(0, 0, layerZ[120]);
        $p.image(textOverlayGfx, -$p.width / 2, -$p.height / 2);
        $p.pop();
      }
      if (cameraTracking) {
        $p.pop();
      }
    }
    function drawMaskRect(x1, y1, x2, y2) {
      var _j849 = $p.height - y2;
      var _j850 = $p.height - y1;
      $p.push();
      maskBuffer.begin();
      $p.resetShader();
      $p.camera(0, 0, $p.height / 2 / $p.tan($p.PI / 6), 0, 0, 0, 0, 1, 0);
      $p.ortho(-$p.width / 2, $p.width / 2, -$p.height / 2, $p.height / 2, 0, 10000);
      $p.translate(-$p.width / 2, -$p.height / 2);
      $p.background(0);
      $p.noStroke();
      $p.fill(255);
      $p.rectMode($p.CORNER);
      $p.rect(x1, _j849, x2 - x1, _j850 - _j849);
      maskBuffer.end();
      $p.pop();
      maskActive = true;
    }
    function drawMaskPolygon(points) {
      if (points.length < 3) return;
      $p.push();
      maskBuffer.begin();
      $p.resetShader();
      $p.camera(0, 0, $p.height / 2 / $p.tan($p.PI / 6), 0, 0, 0, 0, 1, 0);
      $p.ortho(-$p.width / 2, $p.width / 2, -$p.height / 2, $p.height / 2, 0, 10000);
      $p.translate(-$p.width / 2, -$p.height / 2);
      $p.background(0);
      $p.noStroke();
      $p.fill(255);
      $p.beginShape();
      for (let p of points) {
        $p.vertex(p.x, $p.height - p.y);
      }
      $p.endShape($p.CLOSE);
      maskBuffer.end();
      $p.pop();
      maskActive = true;
    }
    function clearMask() {
      $p.push();
      maskBuffer.begin();
      $p.background(255);
      maskBuffer.end();
      $p.pop();
      maskActive = false;
      maskPolygonPoints = [];
      maskRectDraft = null;
    }
    $win.testMode = false;
    function commitStroke() {
      lastStrokeBuffer.begin();
      $p.clear();
      $p.background(255);
      $p.imageMode($p.CENTER);
      $p.image(newBufferBlack, 0, 0);
      lastStrokeBuffer.end();
      screenBuffer.begin();
      $p.clear();
      $p.shader(encodeShader);
      const colorModeFlag = brushColorMode === 1 ? 1.0 : 0.0;
      encodeShader.setUniform('rect', [0, 0, $p.width * density, $p.height * density]);
      encodeShader.setUniform('baseTex', finalBuffer);
      encodeShader.setUniform('strokeTex', newBufferBlack);
      encodeShader.setUniform('brushColorMode', $p.float(brushColorMode));
      encodeShader.setUniform('brushCategory', colorModeFlag);
      encodeShader.setUniform('whiteMaxOpacity', whiteMaxOpacity);
      encodeShader.setUniform('hueShift', hueShift);
      encodeShader.setUniform('satShift', satShift);
      encodeShader.setUniform('briShift', briShift);
      encodeShader.setUniform('keyBlendMode', keyBlendMode);
      encodeShader.setUniform('useSharpen', useSharpen);
      encodeShader.setUniform('typeMapTex', typeMapBuffer);
      const _j852 = [
        canvasBackgroundColor[0] / 255.0,
        canvasBackgroundColor[1] / 255.0,
        canvasBackgroundColor[2] / 255.0,
      ];
      encodeShader.setUniform('canvasBackgroundColor', _j852);
      const _j853 = [customBrushColor[0] / 255.0, customBrushColor[1] / 255.0, customBrushColor[2] / 255.0];
      encodeShader.setUniform('customBrushColor', _j853);
      encodeShader.setUniform('useSpectralMix', useSpectralMix ? 1.0 : 0.0);
      encodeShader.setUniform('useMask', maskActive ? 1.0 : 0.0);
      if (maskActive) encodeShader.setUniform('maskTex', maskBuffer);
      $p.noStroke();
      $p.rectMode($p.CENTER);
      $p.rect(0, 0, $p.width, $p.height);
      $p.resetShader();
      screenBuffer.end();
      if (typeMapEncodeShader && typeMapBuffer) {
        pingPongBuffer.begin();
        $p.clear();
        $p.imageMode($p.CENTER);
        $p.image(screenBuffer, 0, 0);
        pingPongBuffer.end();
        screenBuffer.begin();
        $p.clear();
        $p.shader(typeMapEncodeShader);
        typeMapEncodeShader.setUniform('rect', [0, 0, $p.width * density, $p.height * density]);
        typeMapEncodeShader.setUniform('baseTex', typeMapBuffer);
        typeMapEncodeShader.setUniform('strokeTex', newBufferBlack);
        typeMapEncodeShader.setUniform('brushCategory', colorModeFlag);
        typeMapEncodeShader.setUniform('whiteMaxOpacity', whiteMaxOpacity);
        typeMapEncodeShader.setUniform('useMask', maskActive ? 1.0 : 0.0);
        if (maskActive) typeMapEncodeShader.setUniform('maskTex', maskBuffer);
        $p.noStroke();
        $p.rectMode($p.CENTER);
        $p.rect(0, 0, $p.width, $p.height);
        $p.resetShader();
        screenBuffer.end();
        typeMapBuffer.begin();
        $p.clear();
        $p.background(0);
        $p.imageMode($p.CENTER);
        $p.image(screenBuffer, 0, 0, $p.width, $p.height);
        typeMapBuffer.end();
        screenBuffer.begin();
        $p.clear();
        $p.imageMode($p.CENTER);
        $p.image(pingPongBuffer, 0, 0);
        screenBuffer.end();
      }
      finalBuffer.begin();
      $p.clear();
      $p.background(255);
      $p.imageMode($p.CENTER);
      $p.image(screenBuffer, 0, 0);
      finalBuffer.end();
      oldBuffer.begin();
      $p.imageMode($p.CENTER);
      $p.blendMode($p.MULTIPLY);
      $p.image(newBufferBlack, 0, 0);
      $p.blendMode($p.BLEND);
      oldBuffer.end();
      if (pathToggle && collectPathPoints && pathPoints.length > 1) {
        drawPathPointsTo(oldBuffer);
      } else {
      }
      if (typeof gridCommitPrev === 'function') {
        try {
          gridCommitPrev();
        } catch (e) {}
      }
      newBufferBlack.begin();
      $p.clear();
      $p.background(255, 255, 255);
      newBufferBlack.end();
      isDrawing = false;
      isReleasing = false;
      countdownFrame = 0;
      strokeActive = false;
      strokeCommitted = true;
      let _j854 = null;
      if (pathPoints.length > 0) {
        let _j855 = 0,
          _j856 = 0;
        let minX = pathPoints[0].x;
        let maxX = pathPoints[0].x;
        let minY = pathPoints[0].y;
        let maxY = pathPoints[0].y;
        for (let pt of pathPoints) {
          _j855 += pt.x;
          _j856 += pt.y;
          if (pt.x < minX) minX = pt.x;
          if (pt.x > maxX) maxX = pt.x;
          if (pt.y < minY) minY = pt.y;
          if (pt.y > maxY) maxY = pt.y;
        }
        const cx = _j855 / pathPoints.length;
        const cy = _j856 / pathPoints.length;
        lastStrokeBounds = {
          minX,
          maxX,
          minY,
          maxY,
          _j371: cx,
          _j372: cy,
          length: pathPoints.length,
        };
        let gridParams = null;
        if (typeof $win.__lastGridParams !== 'undefined' && $win.__lastGridParams !== null) {
          gridParams = {
            left: $win.__lastGridParams.left,
            top: $win.__lastGridParams.top,
            right: $win.__lastGridParams.right,
            bottom: $win.__lastGridParams.bottom,
            effCell: $win.__lastGridParams.effCell,
            cols: $win.__lastGridParams.cols,
            rows: $win.__lastGridParams.rows,
            gridWidth: $win.__lastGridParams.gridWidth,
            gridHeight: $win.__lastGridParams.gridHeight,
          };
        }
        allBrushStrokes.push({
          points: [...pathPoints],
          center: {
            x: cx,
            y: cy,
          },
          bounds: {
            minX,
            maxX,
            minY,
            maxY,
          },
          gridParams: gridParams,
          timestamp: $clock(),
        });
        totalStrokeCount++;
        if (allBrushStrokes.length > MAX_STORED_STROKES) {
          allBrushStrokes.shift();
        }
        _j854 = {
          minX: lastStrokeBounds.minX,
          maxX: lastStrokeBounds.maxX,
          minY: lastStrokeBounds.minY,
          maxY: lastStrokeBounds.maxY,
        };
      }
      pathPoints = [];
      collectPathPoints = false;
      lastStrokeBounds = null;
      const _j857 = drawingSeed;
      let _j858 = _j854;
      if (!_j858 && allBrushStrokes.length > 0) {
        const lastStroke = allBrushStrokes[allBrushStrokes.length - 1];
        if (lastStroke.bounds) {
          _j858 = {
            ...lastStroke.bounds,
          };
        }
      }
      if (_j858) {
        pendingBugBounds = _j858;
      } else {
        if (allBrushStrokes.length > 0) {
          const lastStroke = allBrushStrokes[allBrushStrokes.length - 1];
          if (lastStroke.bounds) {
            pendingBugBounds = {
              ...lastStroke.bounds,
            };
          }
        }
      }
      if (autoBugScan && isPlaying) {
        $p.randomSeed(strokeSeed);
        $p.noiseSeed(strokeSeed);
        let _j859 = false;
        if (isPlaying && recordingData && recordingData.events) {
          let _j860 = 0;
          for (let e of recordingData.events) {
            const evtType = e.m || e.type;
            if (evtType === 'mr' || evtType === 'mouseReleased') {
              _j860++;
            }
          }
          const _j861 = totalStrokeCount;
          const _j862 = _j861 >= _j860 - 12;
          _j859 = _j862;
          if (_j859) {
            const _j863 = $win.crandom.random(0, 1) > 0.1;
            if (_j863) {
              console.log('全局扫描');
              pendingBugBounds = null;
            } else {
              if (_j858 && !pendingBugBounds) {
                console.log('局部扫描');
                pendingBugBounds = _j858;
              }
            }
          }
        } else if (!isPlaying) {
          _j859 = true;
        }
        if (_j859) {
          pendingBugScan = true;
          bugScanSeed = strokeSeed;
          if (!isPlaying && _j858 && !pendingBugBounds) {
            pendingBugBounds = _j858;
          }
        } else {
          if (_j858 && !pendingBugBounds) {
            pendingBugBounds = _j858;
          }
        }
        $p.randomSeed(_j857);
        $p.noiseSeed(_j857);
      }
      if (typeof gc !== 'undefined') {
        gc();
      }
      compositeDirty = true;
    }
    function commitIfPending() {
      if (strokeActive && !strokeCommitted) {
        if (isDrawing || isReleasing) {
          commitStroke();
        }
      }
    }
    function collectFutureStrokes() {
      if (!recordingData.events || recordingData.events.length === 0) {
        return [];
      }
      const strokes = [];
      const _j865 = 20;
      let scanIdx = playbackEventIndex;
      let _j861 = null;
      const offsetX = typeof playbackOffsetX !== 'undefined' ? playbackOffsetX : 0;
      const offsetY = typeof playbackOffsetY !== 'undefined' ? playbackOffsetY : 0;
      const _j867 = 500;
      let _j868 = 0;
      while (strokes.length < _j865 && scanIdx < recordingData.events.length && _j868 < _j867) {
        const event = recordingData.events[scanIdx];
        const evtType = event.m || event.type;
        if (evtType === 'mp' || evtType === 'mousePressed') {
          _j861 = {
            path: [
              {
                x: event.x + offsetX - hw,
                y: event.y + offsetY - hh,
                t: event.t || 0,
              },
            ],
            eventIndex: scanIdx,
            data: event.strokeData || event.d || {},
          };
        } else if ((evtType === 'md' || evtType === 'mouseDragged') && _j861) {
          _j861.path.push({
            x: event.x + offsetX - hw,
            y: event.y + offsetY - hh,
            t: event.t || 0,
          });
        } else if ((evtType === 'mr' || evtType === 'mouseReleased') && _j861) {
          _j861.path.push({
            x: event.x + offsetX - hw,
            y: event.y + offsetY - hh,
            t: event.t || 0,
          });
          strokes.push(_j861);
          _j861 = null;
        }
        scanIdx++;
        _j868++;
      }
      return strokes;
    }
    function drawFuturePathPreview() {
      if (!isPlaying || !recordingData.events || recordingData.events.length === 0) {
        futurePathGfx.clear();
        return;
      }
      const now = $clock();
      const _j870 =
        futurePathCache.lastEventIndex !== playbackEventIndex ||
        now - futurePathCache.lastUpdateTime > futurePathCache.updateInterval;
      if (_j870) {
        futurePathCache.cachedStrokes = collectFutureStrokes();
        futurePathCache.lastEventIndex = playbackEventIndex;
        futurePathCache.lastUpdateTime = now;
      }
      const strokes = futurePathCache.cachedStrokes;
      futurePathGfx.clear();
      if (strokes.length === 0) {
        return;
      }
      futurePathGfx.push();
      const time = $clock() * 0.003;
      for (let i = 0; i < strokes.length; i++) {
        const futureStroke = strokes[i];
        const path = futureStroke.path;
        if (!path || path.length < 2) continue;
        const alpha = $p.map(i, 0, strokes.length - 1, 200, 80);
        const _j872 = $p.sin(time + i * 0.8) * 0.3 + 1;
        const _j873 = futureStroke.eventIndex * 0.1;
        const _j874 = 20;
        const _j875 = $p.min($p.max($p.floor(path.length / 5), 2), _j874);
        const polyline = [];
        for (let s = 0; s < _j875; s++) {
          const t = s / (_j875 - 1);
          const _j315 = t * (path.length - 1);
          const segIdx = $p.floor(_j315);
          const nextIdx = $p.min(segIdx + 1, path.length - 1);
          const _j879 = _j315 - segIdx;
          const x1 = path[segIdx].x;
          const y1 = path[segIdx].y;
          const x2 = path[nextIdx].x;
          const y2 = path[nextIdx].y;
          const t1 = path[segIdx].t || 0;
          const t2 = path[nextIdx].t || 0;
          if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            continue;
          }
          polyline.push({
            x: $p.lerp(x1, x2, _j879),
            y: $p.lerp(y1, y2, _j879),
            t: $p.lerp(t1, t2, _j879),
          });
        }
        const _j880 = [];
        let _j881 = 0.01;
        for (let j = 1; j < polyline.length; j++) {
          const dx = polyline[j].x - polyline[j - 1].x;
          const dy = polyline[j].y - polyline[j - 1].y;
          const dt = polyline[j].t - polyline[j - 1].t;
          const speedPx = dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0;
          _j880.push(speedPx);
          if (speedPx > _j881) _j881 = speedPx;
        }
        futurePathGfx.noFill();
        futurePathGfx.strokeCap($p.ROUND);
        for (let j = 1; j < polyline.length; j++) {
          const _j799 = $p.constrain(_j880[j - 1] / _j881, 0, 1);
          const r = Math.round(_j799 * 255);
          const g = Math.round(Math.max(0, 1 - Math.abs(_j799 - 0.5) * 2) * 200);
          const b = Math.round((1 - _j799) * 255);
          futurePathGfx.stroke(r, g, b, 160);
          futurePathGfx.strokeWeight(1.0);
          futurePathGfx.line(polyline[j - 1].x, polyline[j - 1].y, polyline[j].x, polyline[j].y);
        }
        let _j883 = 0;
        for (let j = 0; j < polyline.length - 1; j++) {
          _j883 += $p.dist(polyline[j].x, polyline[j].y, polyline[j + 1].x, polyline[j + 1].y);
        }
        if (isNaN(_j883) || _j883 <= 0 || polyline.length < 2) {
          continue;
        }
        const _j884 = $p.constrain($p.floor(_j883 / 150), 1, 3);
        for (let a = 0; a < _j884; a++) {
          futurePathGfx.push();
          const _j885 = (time * 0.1 + _j873 + a * (1.0 / _j884)) % 1.0;
          const _j886 = _j885 * _j883;
          let dashTravelled_ = 0;
          let _j888 = polyline[0].x;
          let _j889 = polyline[0].y;
          let angle = 0;
          for (let j = 0; j < polyline.length - 1; j++) {
            const segDist = $p.dist(polyline[j].x, polyline[j].y, polyline[j + 1].x, polyline[j + 1].y);
            if (segDist <= 0.0001) {
              _j888 = polyline[j + 1].x;
              _j889 = polyline[j + 1].y;
              if (j + 1 < polyline.length - 1) {
                angle = $p.atan2(polyline[j + 2].y - polyline[j + 1].y, polyline[j + 2].x - polyline[j + 1].x);
              } else {
                angle = $p.atan2(polyline[j + 1].y - polyline[j].y, polyline[j + 1].x - polyline[j].x);
              }
              break;
            }
            if (dashTravelled_ + segDist >= _j886) {
              const _j879 = (_j886 - dashTravelled_) / segDist;
              const _j891 = isNaN(_j879) || !isFinite(_j879) ? 0 : $p.constrain(_j879, 0, 1);
              _j888 = $p.lerp(polyline[j].x, polyline[j + 1].x, _j891);
              _j889 = $p.lerp(polyline[j].y, polyline[j + 1].y, _j891);
              angle = $p.atan2(polyline[j + 1].y - polyline[j].y, polyline[j + 1].x - polyline[j].x);
              break;
            }
            dashTravelled_ += segDist;
          }
          const _j892 = 200 * (1 - _j885 * 0.5);
          futurePathGfx.translate(_j888, _j889);
          futurePathGfx.rotate(angle);
          const _j893 = 1.0 + $p.sin(time * 3 + i + a) * 0.2;
          futurePathGfx.fill(0, 0, 255, _j892);
          futurePathGfx.noStroke();
          futurePathGfx.triangle(0, 0, -4 * _j893, -2 * _j893, -4 * _j893, 2 * _j893);
          futurePathGfx.stroke(0, 150, 255, _j892);
          futurePathGfx.strokeWeight(0.3);
          futurePathGfx.noFill();
          futurePathGfx.triangle(0, 0, -4 * _j893, -2 * _j893, -4 * _j893, 2 * _j893);
          futurePathGfx.pop();
        }
        const firstPt = path[0];
        const lastPt = path[path.length - 1];
        futurePathGfx.noFill();
        futurePathGfx.stroke(0, 0, 255, 150);
        futurePathGfx.strokeWeight(0.8);
        futurePathGfx.ellipse(firstPt.x, firstPt.y, 5, 5);
        futurePathGfx.ellipse(lastPt.x, lastPt.y, 5, 5);
        futurePathGfx.noStroke();
        futurePathGfx.fill(0, 0, 255, 255);
        futurePathGfx.ellipse(firstPt.x, firstPt.y, 2, 2);
        futurePathGfx.ellipse(lastPt.x, lastPt.y, 2, 2);
        if (font) {
          futurePathGfx.textFont(font);
          futurePathGfx.noStroke();
          const data = futureStroke.data;
          const brushMode = data.brushMode || '?';
          const seed = data.strokeSeed ? String(data.strokeSeed).slice(-3) : '???';
          const size = data.initialSize ? data.initialSize.toFixed(0) : '?';
          const _j895 = firstPt.x - 2;
          const _j896 = firstPt.y + 8;
          futurePathGfx.textSize(6);
          futurePathGfx.fill(0, 0, 255, 255);
          futurePathGfx.textAlign($p.LEFT, $p.CENTER);
          futurePathGfx.text('#' + (i + 1), _j895, _j896);
        }
      }
      futurePathGfx.pop();
    }
    function drawScreenText() {
      textOverlayGfx.clear();
      textOverlayGfx.push();
      textOverlayGfx.noFill();
      textOverlayGfx.noStroke();
      textOverlayGfx.rectMode($p.CENTER);
      let _j799 = ($p.width * 0.05) / $p.height;
      textOverlayGfx.rect(0, 0, $p.width * 0.95, $p.height * (1 - _j799));
      textOverlayGfx.translate(-$p.width / 2 - 5, -$p.height / 2 + 20);
      textOverlayGfx.textAlign($p.LEFT, $p.TOP);
      if (font) {
        textOverlayGfx.textFont(font);
      }
      textOverlayGfx.textSize(6);
      let _j897 = $p.width - 50;
      textOverlayGfx.fill(0, 0, 0, 100);
      textOverlayGfx.noStroke();
      let visibleLines = [];
      let _j281 = screenTextY0;
      let _j899 = Math.max(0, screenTextLines.length - SCREEN_TEXT_MAX_LINES - screenTextCounter);
      let _j900 = screenTextLines.length;
      for (let i = _j899; i < _j900; i++) {
        let line = screenTextLines[i];
        let _j901 = wrapText(line.text, _j897, textOverlayGfx);
        for (let j = 0; j < _j901.length; j++) {
          if (visibleLines.length >= SCREEN_TEXT_MAX_LINES) break;
          visibleLines.push({
            type: line.type,
            text: _j901[j],
            timestamp: line.timestamp,
          });
        }
        if (visibleLines.length >= SCREEN_TEXT_MAX_LINES) break;
      }
      for (let i = 0; i < visibleLines.length; i++) {
        let line = visibleLines[i];
        let y = screenTextY0 + i * screenTextLineH;
        if (line.type === 'recording') {
          textOverlayGfx.fill(255, 0, 0, screenTextAlpha);
        } else if (line.type === 'playback') {
          textOverlayGfx.fill(0, screenTextAlpha);
        } else if (line.type === 'system') {
          textOverlayGfx.fill(0, 0, 255, screenTextAlpha);
        } else if (line.type === 'art') {
          textOverlayGfx.fill(0, screenTextAlpha);
        } else {
          textOverlayGfx.fill(0, screenTextAlpha);
        }
        textOverlayGfx.text('--', screenTextX, y);
        textOverlayGfx.text(line.text, screenTextX, y);
      }
      drawStrokeHighlight();
      textOverlayGfx.pop();
      drawStrokeDividers();
    }
    function drawStrokeDividers() {
      if ($win.showStrokeDivider === false) return;
      const strokeCount =
        typeof allBrushStrokes !== 'undefined' && Array.isArray(allBrushStrokes) ? allBrushStrokes.length : 0;
      if (strokeCount === 0) return;
      textOverlayGfx.push();
      textOverlayGfx.resetMatrix();
      textOverlayGfx.translate(0, 0);
      const dividerY = hh - 15;
      const _j903 = $p.width * 0.98;
      const _j904 = -_j903 / 2;
      const _j905 = _j903 / 2;
      const _j906 = _j905 - _j904;
      textOverlayGfx.stroke(0, 50);
      textOverlayGfx.strokeWeight(1);
      textOverlayGfx.noFill();
      textOverlayGfx.line(_j904, dividerY, _j905, dividerY);
      textOverlayGfx.strokeWeight(1.2);
      textOverlayGfx.line(_j904, dividerY + 5, _j904, dividerY - 5);
      textOverlayGfx.line(_j905, dividerY + 5, _j905, dividerY - 5);
      if (strokeCount > 0) {
        const _j907 = _j906 / strokeCount;
        textOverlayGfx.stroke(0, 70);
        textOverlayGfx.strokeWeight(0.7);
        for (let i = 1; i < strokeCount; i++) {
          const x = _j904 + i * _j907;
          textOverlayGfx.line(x, dividerY - 5, x, dividerY);
        }
        if (font) textOverlayGfx.textFont(font);
        textOverlayGfx.textAlign($p.CENTER, $p.CENTER);
        textOverlayGfx.textSize(10);
        textOverlayGfx.fill(0, 50);
        textOverlayGfx.noStroke();
        const _j895 = _j905;
        const _j896 = dividerY - 15;
        textOverlayGfx.text(strokeCount.toString(), _j895, _j896);
      }
      textOverlayGfx.pop();
    }
    function drawStrokeHighlight() {
      if (currentStrokeHighlight && currentStrokeHighlight.gridParams) {
        const _j908 = $clock();
        const elapsed = _j908 - currentStrokeHighlight.startTime;
        const highlightMs = 1000;
        const halfHighlightMs = highlightMs * 0.5;
        if (elapsed < highlightMs) {
          let alpha = 255;
          if (elapsed > halfHighlightMs) {
            const _j911 = (elapsed - halfHighlightMs) / (highlightMs - halfHighlightMs);
            alpha = 255 * (1 - _j911);
          }
          const gp = currentStrokeHighlight.gridParams;
          textOverlayGfx.push();
          textOverlayGfx.resetMatrix();
          textOverlayGfx.translate(-hw - 10, -hh - 10);
          if (currentStrokeHighlight.points && currentStrokeHighlight.points.length > 1) {
            const dashOn = 5;
            const dashOff = 5;
            textOverlayGfx.stroke(255, 0, 0, alpha);
            textOverlayGfx.strokeWeight(1);
            textOverlayGfx.noFill();
            let dashPenDown_ = true;
            let dashTravelled_ = 0;
            for (let i = 0; i < currentStrokeHighlight.points.length - 1; i++) {
              let x1 = currentStrokeHighlight.points[i].x;
              let y1 = currentStrokeHighlight.points[i].y;
              let x2 = currentStrokeHighlight.points[i + 1].x;
              let y2 = currentStrokeHighlight.points[i + 1].y;
              let segLen = $p.dist(x1, y1, x2, y2);
              let dx = (x2 - x1) / segLen;
              let dy = (y2 - y1) / segLen;
              let travelled = 0;
              while (travelled < segLen) {
                let dashLen = dashPenDown_ ? dashOn : dashOff;
                let stepLen = $p.min(dashLen - dashTravelled_, segLen - travelled);
                if (dashPenDown_) {
                  let startX = x1 + dx * travelled;
                  let startY = y1 + dy * travelled;
                  let segX = x1 + dx * (travelled + stepLen);
                  let segY = y1 + dy * (travelled + stepLen);
                  textOverlayGfx.line(startX, startY, segX, segY);
                }
                travelled += stepLen;
                dashTravelled_ += stepLen;
                if (dashTravelled_ >= (dashPenDown_ ? dashOn : dashOff)) {
                  dashPenDown_ = !dashPenDown_;
                  dashTravelled_ = 0;
                }
              }
            }
            if (currentStrokeHighlight.points.length > 0) {
              const firstPt = currentStrokeHighlight.points[0];
              const lastPt = currentStrokeHighlight.points[currentStrokeHighlight.points.length - 1];
              textOverlayGfx.fill(255, 0, 0, alpha);
              textOverlayGfx.noStroke();
              textOverlayGfx.ellipse(firstPt.x, firstPt.y, 5, 5);
              textOverlayGfx.fill(255, 0, 0, alpha);
              textOverlayGfx.ellipse(lastPt.x, lastPt.y, 5, 5);
            }
          }
          const cx = (gp.left + gp.right) / 2;
          const cy = (gp.top + gp.bottom) / 2;
          textOverlayGfx.stroke(0, 0, 200, alpha);
          textOverlayGfx.strokeWeight(1.0);
          textOverlayGfx.noFill();
          textOverlayGfx.rectMode($p.CORNER);
          textOverlayGfx.rect(gp.left, gp.top, gp.right - gp.left, gp.bottom - gp.top);
          textOverlayGfx.pop();
        } else {
          currentStrokeHighlight = null;
        }
      }
    }
    function wrapText(text, maxWidth, buffer = null) {
      let words = text.split(' ');
      let lines = [];
      let currentLine = '';
      for (let i = 0; i < words.length; i++) {
        let testLine = currentLine + (currentLine ? ' ' : '') + words[i];
        let _j916 = buffer ? buffer.textWidth(testLine) : $p.textWidth(testLine);
        if (_j916 > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
      return lines;
    }
    if (typeof $win !== 'undefined') {
      $win.pendingEffectControlScanQueue = pendingEffectControlScanQueue;
    }
    function lastStrokeBoundsNormalized() {
      if (allBrushStrokes.length === 0) return null;
      const lastStroke = allBrushStrokes[allBrushStrokes.length - 1];
      if (lastStroke && lastStroke.bounds) {
        const pad = 20;
        return {
          minX: Math.max(0, lastStroke.bounds.minX - pad) / $p.width,
          minY: Math.max(0, lastStroke.bounds.minY - pad) / $p.height,
          maxX: Math.min($p.width, lastStroke.bounds.maxX + pad) / $p.width,
          maxY: Math.min($p.height, lastStroke.bounds.maxY + pad) / $p.height,
        };
      }
      if (lastStroke && lastStroke.gridParams) {
        const gp = lastStroke.gridParams;
        const pad = 20;
        return {
          minX: Math.max(0, gp.left - pad) / $p.width,
          minY: Math.max(0, gp.top - pad) / $p.height,
          maxX: Math.min($p.width, gp.right + pad) / $p.width,
          maxY: Math.min($p.height, gp.bottom + pad) / $p.height,
        };
      }
      return null;
    }
    function startFlowEffect(blendType, seed = null, _j1549 = false) {
      if (!flowShader) return;
      flowActive = true;
      flowBlendType = blendType;
      flowStartMillis = $clock();
      flowFrames = 0;
      flowIterations = 0;
      flowIsReplay = _j1549;
      flowSeed = seed !== null ? seed : Math.floor(Math.random() * 1000000);
      flowParams.seed = flowSeed * 0.0001;
    }
    function stopFlowEffect() {
      if (!flowActive) return null;
      const duration = $clock() - flowStartMillis;
      const iterations = flowIterations;
      const frames = flowFrames;
      if (iterations > 0 && flowEffectStrokeBounds) {
        flowCommitPending = true;
        flowCommitData = {
          blendType: flowBlendType,
          iterations: iterations,
          seed: flowSeed,
          bounds: {
            ...flowEffectStrokeBounds,
          },
        };
      }
      flowActive = false;
      flowBlendType = 0;
      flowIsReplay = false;
      return {
        duration,
        iterations,
        frames,
      };
    }
    function updateFlowEffect() {
      if (!flowActive) return;
      flowFrames++;
      flowIterations = Math.floor(flowFrames / FLOW_FRAMES_PER_ITERATION);
      if (flowIsReplay && flowTargetFrames > 0) {
        if (flowFrames >= flowTargetFrames) {
          flowIterations = flowTargetIterations;
          const flowIterationCountEl_ = $doc.getElementById('flow-iteration-count');
          if (flowIterationCountEl_) {
            flowIterationCountEl_.textContent = flowIterations;
          }
          stopFlowEffect();
          flowTargetFrames = 0;
          flowTargetIterations = 0;
          return;
        }
      }
      const flowIterationCountEl = $doc.getElementById('flow-iteration-count');
      if (flowIterationCountEl) {
        flowIterationCountEl.textContent = flowIterations;
      }
    }
    function replayFlowEffect(blendType, seed, iterations) {
      console.log('🌊 replayFlowEffect called:', {
        blendType,
        seed,
        iterations,
      });
      console.log('  flowEffectStrokeBounds:', flowEffectStrokeBounds);
      if (!flowEffectStrokeBounds) {
        console.warn('Cannot replay Flow effect: bounds not available');
        return;
      }
      flowParams.seed = seed * 0.0001;
      flowCommitPending = true;
      flowCommitData = {
        blendType: blendType,
        iterations: iterations,
        seed: seed,
        bounds: {
          ...flowEffectStrokeBounds,
        },
      };
      console.log('🌊 replayFlowEffect: set pendingCommit with data:', flowCommitData);
    }
    const BRANCH_FLIP_TABLE = [
      {
        flip1stX: false,
        flip1stY: false,
      },
      {
        flip1stX: true,
        flip1stY: false,
      },
      {
        flip1stX: false,
        flip1stY: true,
      },
      {
        flip1stX: true,
        flip1stY: true,
      },
    ];
    function setInkStroke(buffer, inkValue, _j932, brushColorMode, alpha) {
      if (brushColorMode === 0) {
        $p.stroke(inkValue, alpha);
      } else if (brushColorMode === 1) {
        $p.stroke(150, alpha);
      } else {
        $p.stroke(_j932, alpha);
      }
    }
    function setInkFill(buffer, inkValue, _j932, brushColorMode, alpha) {
      if (brushColorMode === 0) {
        $p.fill(inkValue, alpha);
      } else if (brushColorMode === 1) {
        $p.fill(150, alpha);
      } else {
        $p.fill(_j932, alpha);
      }
    }
    function drawBranch(id, buffer, _j1014, x, y, curX, curY, _j968, _j969, _j989, sizeVariation, _j1008) {
      let _j921 = _j989 * sizeVariation + _j1008;
      const effBaseSize =
        pressureEnabled && typeof pressureBaseBrushSize !== 'undefined' && pressureBaseBrushSize !== null
          ? pressureBaseBrushSize
          : baseBrushSize;
      const isTinyBrush = effBaseSize < 0.25;
      let _j924 = isTinyBrush ? $p.max(2.0, effBaseSize * 10) : 15;
      if (_j921 > _j924) {
        _j921 = $win.crandom.random(isTinyBrush ? 0.6 : 1, _j924);
      }
      let sw = $p.max(isTinyBrush ? 0.6 : 1, _j921);
      if (sw < 3) sw *= 2.0;
      const offsetX = _j1014.offsetX;
      const offsetY = _j1014.offsetY;
      if (brushModeSP) {
        const clampedBase = $p.max(0.15, $p.min(1.5, effBaseSize));
        let show = $win.crandom.random(0, 1) > 0.8 ? 1 : 0;
        let _j926 =
          $win.crandom.random(0, 1) > 0.05
            ? $win.crandom.random(-6 * clampedBase, 6 * clampedBase)
            : $win.crandom.random(-16 * clampedBase, 16 * clampedBase);
        let _j927 =
          $win.crandom.random(0, 1) > 0.05
            ? $win.crandom.random(-6 * clampedBase, 6 * clampedBase)
            : $win.crandom.random(-16 * clampedBase, 16 * clampedBase);
        if (show == 1) {
          $p.strokeWeight($win.crandom.random(0.5, 1.5));
          $p.line(x + offsetX + _j968, y + offsetY + _j969, curX + offsetX + _j926, curY + offsetY + _j927);
        } else {
          sw = $p.min(1, sw);
          $p.strokeWeight(sw + 0.5);
          if (sw < 4) $p.line(x + offsetX + _j968, y + offsetY + _j969, curX + offsetX, curY + offsetY);
        }
      } else if (!brushModeSP) {
        if (effBaseSize < 4.0) {
          $p.strokeWeight(sw);
        } else {
          $p.strokeWeight($win.crandom.random(sw * 0.5, sw));
        }
        $p.line(x + offsetX + _j968, y + offsetY + _j969, curX + offsetX, curY + offsetY);
      }
    }
    const BRANCH_OFFSETS_5 = [
      {
        offsetBase: 2,
        signX: +1,
        signY: +1,
        randThreshold: 0.05,
        pathProgressEnd: 0,
        jitterIndex: 4,
      },
      {
        offsetBase: 1,
        signX: -1,
        signY: -1,
        randThreshold: 0.1,
        pathProgressEnd: 1,
        jitterIndex: 5,
      },
      {
        offsetBase: 3,
        signX: -1,
        signY: -1,
        randThreshold: 0.12,
        pathProgressEnd: 2,
        jitterIndex: 6,
      },
      {
        offsetBase: 1,
        signX: +1,
        signY: +1,
        randThreshold: 0.08,
        pathProgressEnd: 3,
        jitterIndex: 7,
      },
      {
        offsetBase: 3,
        signX: +1,
        signY: +1,
        randThreshold: 0.2,
        pathProgressEnd: 4,
        jitterIndex: 8,
      },
    ];
    const BRANCH_OFFSETS_8 = [
      {
        angle: 0,
        radius: 1.6,
        randThreshold: 0.065,
        pathProgressEnd: 0,
        jitterIndex: 9,
      },
      {
        angle: Math.PI / 4,
        radius: 1.6,
        randThreshold: 0.1,
        pathProgressEnd: 1,
        jitterIndex: 10,
      },
      {
        angle: Math.PI / 2,
        radius: 1.6,
        randThreshold: 0.125,
        pathProgressEnd: 2,
        jitterIndex: 11,
      },
      {
        angle: (3 * Math.PI) / 4,
        radius: 1.6,
        randThreshold: 0.15,
        pathProgressEnd: 3,
        jitterIndex: 12,
      },
      {
        angle: Math.PI,
        radius: 1.6,
        randThreshold: 0.1,
        pathProgressEnd: 4,
        jitterIndex: 13,
      },
      {
        angle: (5 * Math.PI) / 4,
        radius: 1.6,
        randThreshold: 0.125,
        pathProgressEnd: 0,
        jitterIndex: 14,
      },
      {
        angle: (3 * Math.PI) / 2,
        radius: 1.6,
        randThreshold: 0.15,
        pathProgressEnd: 1,
        jitterIndex: 15,
      },
      {
        angle: (7 * Math.PI) / 4,
        radius: 1.6,
        randThreshold: 0.18,
        pathProgressEnd: 2,
        jitterIndex: 16,
      },
    ];
    const BRANCH_OFFSETS_12 = [
      {
        angle: 0,
        radius: 1.0,
        randThreshold: 0.07,
        pathProgressEnd: 0,
        jitterIndex: 17,
      },
      {
        angle: Math.PI / 6,
        radius: 1.0,
        randThreshold: 0.08,
        pathProgressEnd: 1,
        jitterIndex: 18,
      },
      {
        angle: Math.PI / 3,
        radius: 1.0,
        randThreshold: 0.1,
        pathProgressEnd: 2,
        jitterIndex: 19,
      },
      {
        angle: Math.PI / 2,
        radius: 1.0,
        randThreshold: 0.13,
        pathProgressEnd: 3,
        jitterIndex: 20,
      },
      {
        angle: (2 * Math.PI) / 3,
        radius: 1.0,
        randThreshold: 0.16,
        pathProgressEnd: 4,
        jitterIndex: 21,
      },
      {
        angle: (5 * Math.PI) / 6,
        radius: 1.0,
        randThreshold: 0.1,
        pathProgressEnd: 0,
        jitterIndex: 22,
      },
      {
        angle: Math.PI,
        radius: 1.0,
        randThreshold: 0.13,
        pathProgressEnd: 1,
        jitterIndex: 23,
      },
      {
        angle: (7 * Math.PI) / 6,
        radius: 1.0,
        randThreshold: 0.16,
        pathProgressEnd: 2,
        jitterIndex: 24,
      },
      {
        angle: (4 * Math.PI) / 3,
        radius: 1.0,
        randThreshold: 0.19,
        pathProgressEnd: 3,
        jitterIndex: 25,
      },
      {
        angle: (3 * Math.PI) / 2,
        radius: 1.0,
        randThreshold: 0.13,
        pathProgressEnd: 4,
        jitterIndex: 26,
      },
      {
        angle: (5 * Math.PI) / 3,
        radius: 1.0,
        randThreshold: 0.16,
        pathProgressEnd: 0,
        jitterIndex: 27,
      },
      {
        angle: (11 * Math.PI) / 6,
        radius: 1.0,
        randThreshold: 0.19,
        pathProgressEnd: 1,
        jitterIndex: 28,
      },
    ];
    function drawSprayDots(buffer, penX, penY) {
      if (strokeFrame >= expectedStrokeLength) {
        console.log(
          'Brush not drawn: mouseCount >= expectedStrokeLength (',
          strokeFrame,
          '>=',
          expectedStrokeLength,
          ')',
        );
        return;
      }
      buffer.begin();
      $p.push();
      $p.translate(-hw, -hh);
      $p.colorMode($p.RGB, 255);
      $p.noStroke();
      let inkValue = inkJitter(inkGray);
      let _j932 = inkJitter(inkGray);
      const fromX = isPlaying ? playPrevX : $in.pmouseX;
      const fromY = isPlaying ? playPrevY : $in.pmouseY;
      let _j935 =
        0.5 * initialSize * $p.noise(penX * 0.01, penY * 0.01) * ($p.abs(penX - fromX) + $p.abs(penY - fromY));
      const effBaseSize =
        pressureEnabled && typeof pressureBaseBrushSize !== 'undefined' && pressureBaseBrushSize !== null
          ? pressureBaseBrushSize
          : baseBrushSize;
      let _j937 = 0;
      _j937 = $p.min(spraySize * effBaseSize, _j935) * $p.map($p.noise(penX, penY), 0, 1, 0.3, 1);
      let numDots = $p.max(3, _j937);
      if (strokeFrame < 5) {
        let fadeIn = $p.map(strokeFrame, 0, 5, -0.2, 1.0);
        numDots = $p.max(2, _j937 * fadeIn);
      } else if (strokeFrame >= expectedStrokeLength - 5) {
        let fadeOut = $p.map(strokeFrame, expectedStrokeLength - 5, expectedStrokeLength, 1.0, -0.2);
        numDots = $p.max(2, _j937 * fadeOut);
      }
      for (let i = 0; i < step2; i++) {
        const _j941 = $p.lerp(penX, fromX, i / step2);
        const lerpY = $p.lerp(penY, fromY, i / step2);
        for (let j = 0; j < 10; j++) {
          let _j926, _j927;
          let dotScale = $win.crandom.random(0, 1) > 0.1 ? 1 : 1.5;
          const dotAngle = $win.crandom.random($p.TWO_PI);
          const _j944 = $win.crandom.random();
          const _j945 = $win.crandom.random(-numDots * dotScale, numDots * dotScale);
          const _j946 = $win.crandom.random(-numDots * dotScale, numDots * dotScale);
          if (shapeType === 0) {
            const angle = dotAngle;
            const radius = $p.sqrt(_j944) * numDots;
            _j926 = radius * $p.cos(angle);
            _j927 = radius * $p.sin(angle);
          } else if (shapeType === 1) {
            _j926 = $p.sin(dotAngle) * _j945;
            _j927 = $p.cos(dotAngle) * _j946;
          } else if (shapeType === 2) {
            const u = dotAngle / $p.TWO_PI;
            const v = _j944;
            if (u + v > 1) {
              _j926 = numDots * (1 - u);
              _j927 = numDots * (1 - v);
            } else {
              _j926 = numDots * u;
              _j927 = numDots * v;
            }
            _j926 -= numDots * 0.5;
            _j927 -= numDots * 0.5;
          } else {
            const u = _j945 / numDots;
            const v = _j946 / numDots;
            const manhattan = $p.abs(u) + $p.abs(v);
            if (manhattan > 1) {
              _j926 = (u / manhattan) * numDots;
              _j927 = (v / manhattan) * numDots;
            } else {
              _j926 = u * numDots;
              _j927 = v * numDots;
            }
          }
          let roll = $win.crandom.random(0, 1);
          let altValue = $win.crandom.random(0.2, 1);
          let _j948 = $win.crandom.random(1, 2);
          let _j949 = effBaseSize < 0.25 ? 0.1 : 0.3;
          altValue = $p.max(_j949, altValue * effBaseSize);
          _j948 = $p.max(_j949, _j948 * effBaseSize);
          let _j950 = $win.crandom.random(100, 255);
          let ss = roll > 0.1 ? altValue : _j948;
          if (brushMode == 3 || brushMode == 5) ss = ss * 2;
          let _j951 = effBaseSize < 0.25 ? $p.max(0.3, effBaseSize * 3) : 2;
          let _j952 = effBaseSize < 0.25 ? effBaseSize * 5 : 20;
          ss = $p.max(_j951, $p.min(_j952, ss));
          setInkFill(buffer, inkValue, _j932, brushColorMode, _j950);
          $p.noStroke();
          $p.ellipse(_j941 + _j926, lerpY + _j927, ss, ss);
        }
      }
      $p.pop();
      buffer.end();
    }
    function drawBrushStroke(buffer, penX, penY, strokeProgress, flyBrushType = 0, mainStrokeDir = 0) {
      if (strokeFrame >= expectedStrokeLength) {
        console.log(
          'Brush not drawn: mouseCount >= expectedStrokeLength (',
          strokeFrame,
          '>=',
          expectedStrokeLength,
          ')',
        );
        return;
      }
      buffer.begin();
      $p.push();
      $p.translate(-hw, -hh);
      $p.colorMode($p.RGB, 255);
      let inkValue = inkJitter(inkGray);
      let _j932 = inkJitter(inkGray);
      const effBaseSize =
        pressureEnabled && typeof pressureBaseBrushSize !== 'undefined' && pressureBaseBrushSize !== null
          ? pressureBaseBrushSize
          : baseBrushSize;
      const _j954 = pressureEnabled
        ? isPlaying
          ? typeof $win._playbackPenPressure !== 'undefined'
            ? $win._playbackPenPressure
            : -1
          : penPressure
        : -1;
      const pressureScale = _j954 >= 0 ? 0.7 + 0.4 * Math.min(_j954 / 0.7, 1.0) : 1.0;
      let isTinyBrush = effBaseSize < 0.25;
      let _j956 = 0.6;
      let _j957 = isTinyBrush
        ? $win.crandom.random(0.4, 0.8)
        : $win.crandom.random(baseBrushSize * 0.8, baseBrushSize * 2.0);
      let swFloorTiny = $p.max(_j956, baseBrushSize * 2);
      let _j958 = $p.max(_j956, baseBrushSize * 1.5);
      let _j959 = isTinyBrush ? swFloorTiny : _j958;
      if (_j959 < 3) _j959 *= 2.0;
      let _j960 = isTinyBrush ? swFloorTiny : $p.max(_j956, baseBrushSize * 1.2);
      if (_j960 < 3) _j960 *= 2.0;
      let _j961;
      if (isTinyBrush) {
        _j961 = $p.max(2.0, effBaseSize * 10);
      } else if (effBaseSize < 0.5) {
        _j961 = 0.7;
      } else {
        _j961 = 9999;
      }
      lineWidth = strokeWidth * 0.5;
      let tipX_ = penX;
      let tipY_ = penY;
      if (!springInitialized) {
        springInitialized = 1;
        x = tipX_;
        y = tipY_;
      }
      velX += (tipX_ - x) * spring;
      velY += (tipY_ - y) * spring;
      velX *= friction;
      velY *= friction;
      let _j962 = $p.sqrt(velX * velX + velY * velY);
      speed += _j962 - speed;
      if (baseBrushSize <= 1.0) {
        speed *= 0.9;
      } else if (baseBrushSize <= 2.0) {
        speed *= 1.3;
      } else if (baseBrushSize <= 3.0) {
        speed *= 2.0;
      } else {
        speed *= 3.0;
      }
      strokeWidth = sizeNow - speed;
      let ctlNoiseByFrame = brushPaintCtlNoisebyFrame;
      let _j964 = 1.0 * baseBrushSize * ctlNoiseByFrame * pressureScale;
      let _j965 = 2.0 * baseBrushSize * ctlNoiseByFrame * pressureScale;
      let _j966 = 3.0 * baseBrushSize * ctlNoiseByFrame * pressureScale;
      let showMainBrush = 0.1;
      let _j967 = initialSize;
      let _j968 = 0;
      let _j969 = 0;
      if (mainStrokeDir == 0) showMainBrush = 0.08;
      else if (mainStrokeDir == 1) showMainBrush = 0.6;
      else if (mainStrokeDir == 2) showMainBrush = 0.2;
      let _j970 = 1.0;
      let interpCount = interpSteps + brushPaintInterpolationOffset;
      for (let i = 0; i < interpCount; ++i) {
        let _j972 = baseBrushSize >= 1.0 ? 5 : 3;
        let _j973 = baseBrushSize >= 1.0 ? 2 : 0;
        let _j974 = 0;
        if (baseBrushSize < 1.5)
          _j974 = $win.crandom.random(0, 1) > 0.4 ? 0 : $win.crandom.random(0, 1) > 0.4 ? 1 : 2;
        else if (baseBrushSize > 1.5 && baseBrushSize < 6.0)
          _j974 = $win.crandom.random(0, 1) > 0.4 ? 2 : $win.crandom.random(0, 1) > 0.6 ? 3 : 4;
        else if (baseBrushSize > 6.0) _j974 = $win.crandom.random(0, 1) > 0.3 ? 3 : 4;
        if (brushModeSP) _j974 = $win.crandom.random(0, 1) > 0.3 ? 3 : $win.crandom.random(0, 1) > 0.5 ? 2 : 4;
        flyBrushType = _j974;
        if (strokeFrame < 5) flyBrushType = $win.crandom.random(0, 1) > 0.2 ? 5 : flyBrushType;
        let curX = x;
        let curY = y;
        x += velX / interpCount;
        y += velY / interpCount;
        let _j977 = $win.crandom.random(0, 1);
        let _j978 = $win.crandom.random(0, 4);
        let _j979 = $win.crandom.random(0, 3);
        let _j980 = $win.crandom.random(-1, 1);
        let _j981 = $win.crandom.random(-1, 1);
        let _j982 = $win.crandom.random(-1, 1);
        let _j983 = $win.crandom.random(-1, 1);
        let _j984 = showMainBrush;
        let _j985 = 1.0;
        if (flyBrushType == 3) {
          _j984 *= 0.8;
          _j985 *= 0.8;
        } else if (flyBrushType == 4) {
          _j984 *= 0.6;
          _j985 *= 0.5;
        }
        if (effBaseSize < 0.25) {
          _j984 = 0.18;
        } else if (effBaseSize < 1.5) {
          _j984 = 0.1;
        }
        smoothedWidth = $p.lerp(smoothedWidth, strokeWidth, 0.5);
        if (brushMode == 1) {
          if (_j977 > 0.8 && lineWidth < 2 && i == 0) {
            lineWidth = round2(_j978);
          }
        } else {
          lineWidth += (smoothedWidth - lineWidth) * 0.3;
        }
        let _j986;
        if (brushMode == 1) {
          _j986 = lineWidth;
        } else {
          if (strokeFrame < 5) {
            let fadeIn = $p.map(strokeFrame, 0, 5, 0.05, 1.0);
            _j986 = $p.max(isTinyBrush ? 0.1 : 0.5, lineWidth * fadeIn);
            if (explodeStart) {
              _j968 = _j980 * $p.map(strokeFrame, 0, 5, 10, 0);
              _j969 = _j981 * $p.map(strokeFrame, 0, 5, 10, 0);
            }
          } else if (strokeFrame >= expectedStrokeLength - 5) {
            let fadeOut = $p.map(strokeFrame, expectedStrokeLength - 5, expectedStrokeLength, 1.0, 0.05);
            _j986 = $p.max(isTinyBrush ? 0.1 : 0.5, lineWidth * fadeOut);
            if (explodeEnd) {
              _j968 = _j982 * $p.map(strokeFrame, expectedStrokeLength - 5, expectedStrokeLength, 0, 10);
              _j969 = _j983 * $p.map(strokeFrame, expectedStrokeLength - 5, expectedStrokeLength, 0, 10);
            }
          } else {
            if (lineWidth > 2) {
              _j986 = $p.max(isTinyBrush ? 0.2 : 1, lineWidth);
            } else {
              let _j987 = _j979 / 3 - 0.5;
              _j986 = $p.max(isTinyBrush ? 0.1 : 0.5, lineWidth + _j987);
            }
          }
        }
        let _j988 = _j986;
        let _j989 = _j986 * 0.5;
        if (flyBrushType == 3) {
          _j988 *= 0.8;
          _j989 *= 0.8;
        } else if (flyBrushType == 4) {
          _j988 *= 0.5;
          _j989 *= 0.5;
        }
        let _j990 = $win.crandom.random(0, 1);
        let mainAlpha = $win.crandom.random(150, 255);
        let _j992 = $win.crandom.random(100, 255);
        let _j993 = $win.crandom.random(100, 255);
        let _j994 = $win.crandom.random(100, 255);
        if (isTinyBrush) {
          if (!brushModeSP && strokeFrame > 1) {
            setInkStroke(buffer, inkValue, _j932, brushColorMode, mainAlpha);
            let kk = $p.min(_j967, $p.max(_j959, _j988));
            $p.strokeWeight($p.min(_j961, kk));
            $p.line(x + _j968, y + _j969, curX, curY);
          }
        } else if (_j990 > _j984) {
          setInkStroke(buffer, inkValue, _j932, brushColorMode, mainAlpha);
          const _j995 = !brushModeSP && strokeFrame > 3 && baseBrushSize < 4.0;
          if (_j988 < 5) {
            let kk = 0;
            if (mainStrokeDir == 0) kk = 1.5 * $p.min(_j967, $p.max(_j959, _j988));
            else kk = $p.min(_j967, $p.max(_j959, _j988));
            $p.strokeWeight($p.min(_j961, kk));
            if (_j995) $p.line(x + _j968, y + _j969, curX, curY);
          } else {
            let kk = _j985 * $p.min(_j967, $p.max(_j959, _j988));
            if (kk > 15) kk = $win.crandom.random(1.5, kk);
            $p.strokeWeight($p.min(_j961, kk));
            if (_j995) $p.line(x + _j968, y + _j969, curX, curY);
          }
        }
        const _j996 = [];
        const _j997 = [];
        for (let j = 0; j < 30; j++) {
          _j996.push($win.crandom.random(0, 1));
          _j997.push($win.crandom.random(-0.5, 0.5) * _j970);
        }
        if (mainStrokeDir == 1) {
          _j996[0] = _j996[0] * 2.0;
          _j996[1] = _j996[1] * 0.5;
          _j996[2] = _j996[2] * 0.5;
        } else if (mainStrokeDir == 2) {
          _j996[0] = _j996[0] * 0.5;
          _j996[1] = _j996[1] * 0.5;
          _j996[2] = _j996[2] * 0.5;
        }
        const flipCfg = BRANCH_FLIP_TABLE[brushDir];
        if (flyBrushType == 0) {
          setInkStroke(buffer, inkValue, _j932, brushColorMode, _j992);
          if (_j996[0] > 0.2) {
            const flipX1 = flipCfg.flip1stX ? -1 : +1;
            const flipY1 = flipCfg.flip1stY ? -1 : +1;
            let sizeVariation = $p.map($p.noise(x * 0.1, y * 0.1), 0, 1, 0.8, 1.2);
            sizeVariation = $p.max(1 + _j997[0], sizeVariation);
            if (_j989 * sizeVariation < 5) {
              $p.strokeWeight(
                $p.min(_j961, $p.noise(x * 0.1, y * 0.2) + 1.5 * $p.max(_j960, _j989 * sizeVariation)),
              );
            } else {
              $p.strokeWeight($p.min(_j961, _j985 * $p.max(_j957, _j989 * sizeVariation)));
            }
            $p.line(
              x + flipX1 * _j965 + _j968,
              y + flipY1 * _j965 + _j969,
              curX + flipX1 * _j965,
              curY + flipY1 * _j965,
            );
          }
          if (_j996[1] > 0.3) {
            const flipX2 = flipCfg.flip1stX ? -1 : +1;
            const flipY2 = flipCfg.flip1stY ? +1 : -1;
            setInkStroke(buffer, inkValue, _j932, brushColorMode, _j993);
            let sizeVariation = $p.map($p.noise(x * 0.3 + 300, y * 0.3 + 300), 0, 1, 0.6, 1.5);
            sizeVariation = $p.max(1 + _j997[1], sizeVariation);
            $p.strokeWeight($p.min(_j961, _j985 * $p.max(_j957, _j989 * sizeVariation)));
            $p.line(
              x + flipX2 * _j965 + _j968,
              y + flipY2 * _j965 + _j969,
              curX + flipX2 * _j965,
              curY + flipY2 * _j965,
            );
          }
        } else if (flyBrushType == 1) {
          setInkStroke(buffer, inkValue, _j932, brushColorMode, _j992);
          if (_j996[0] > 0.1) {
            const flipX1 = flipCfg.flip1stX ? -1 : +1;
            const flipY1 = flipCfg.flip1stY ? -1 : +1;
            let sizeVariation = $p.map($p.noise(x * 0.3 + 200, y * 0.1 + 100), 0, 1, 0.8, 1.2);
            sizeVariation = $p.max(1 + _j997[0], sizeVariation);
            $p.strokeWeight($p.min(_j961, _j985 * $p.max(_j957, _j989 * sizeVariation)));
            $p.line(
              x + flipX1 * _j965 + _j968,
              y + flipY1 * _j965 + _j969,
              curX + flipX1 * _j965,
              curY + flipY1 * _j965,
            );
          }
          if (_j996[1] > 0.05) {
            const flipX2 = flipCfg.flip1stX ? -1 : +1;
            const flipY2 = flipCfg.flip1stY ? +1 : -1;
            setInkStroke(buffer, inkValue, _j932, brushColorMode, _j993);
            let sizeVariation = $p.map($p.noise(x * 0.2 + 300, y * 0.2 + 200), 0, 1, 0.8, 1.2);
            sizeVariation = $p.max(1 + _j997[1], sizeVariation);
            $p.strokeWeight($p.min(_j961, _j985 * $p.max(_j957, _j989 * sizeVariation)));
            $p.line(
              x + flipX2 * _j964 + _j968,
              y + flipY2 * _j964 + _j969,
              curX + flipX2 * _j964,
              curY + flipY2 * _j964,
            );
          }
          if (_j996[2] > 0.15) {
            const _j1003 = -1;
            const _j1004 = -1;
            setInkStroke(buffer, inkValue, _j932, brushColorMode, _j994);
            let sizeVariation = $p.map($p.noise(x * 0.1 + 400, y * 0.3 + 300), 0, 1, 0.8, 1.2);
            sizeVariation = $p.max(1 + _j997[2], sizeVariation);
            if (_j989 * sizeVariation < 5) {
              $p.strokeWeight($p.min(_j961, $p.noise(x * 1, y * 2) + 1.5 * $p.max(_j960, _j989 * sizeVariation)));
            } else {
              $p.strokeWeight($p.min(_j961, _j985 * $p.max(_j957, _j989 * sizeVariation)));
            }
            $p.line(
              x + _j1003 * _j966 + _j968,
              y + _j1004 * _j966 + _j969,
              curX + _j1003 * _j966,
              curY + _j1004 * _j966,
            );
          }
        } else if (flyBrushType == 2) {
          let sizeVariation = $p.map($p.noise(x * 0.1 + 400, y * 0.1 + 200), 0, 1, 0.8, 1.2);
          setInkStroke(buffer, inkValue, _j932, brushColorMode, _j992);
          const _j1005 = [_j996[0], _j996[1], _j996[2], _j996[3], _j996[4]];
          const _j1006 = [_j997[3], _j997[4], _j997[5], _j997[6], _j997[7]];
          for (let i = 0; i < BRANCH_OFFSETS_5.length; i++) {
            const _j276 = BRANCH_OFFSETS_5[i];
            const _j1007 = _j1005[i];
            const _j1008 = _j1006[i];
            if (_j1007 > _j276.randThreshold) {
              let _j1009;
              if (_j276.offsetBase === 1) {
                _j1009 = _j964;
              } else if (_j276.offsetBase === 2) {
                _j1009 = _j965;
              } else if (_j276.offsetBase === 3) {
                _j1009 = _j966;
              } else {
                _j1009 = _j276.offsetBase * baseBrushSize * ctlNoiseByFrame;
              }
              let _j1010, _j1011;
              if (i === 0) {
                _j1010 = flipCfg.flip1stX ? -_j276.signX : _j276.signX;
                _j1011 = flipCfg.flip1stY ? -_j276.signY : _j276.signY;
              } else {
                _j1010 = _j276.signX;
                _j1011 = _j276.signY;
              }
              let _j1012 = _j1010 * _j1009;
              let _j1013 = _j1011 * _j1009;
              const _j1014 = {
                offsetX: _j1012,
                offsetY: _j1013,
                randThreshold: _j276.randThreshold,
                pathProgressEnd: _j276.pathProgressEnd,
                jitterIndex: _j276.jitterIndex,
              };
              drawBranch(2, buffer, _j1014, x, y, curX, curY, _j968, _j969, _j989, sizeVariation, _j1008);
            }
          }
        } else if (flyBrushType == 3) {
          let sizeVariation = $p.map($p.noise(x * 0.1 + 400, y * 0.1 + 200), 0, 1, 0.85, 1.15);
          setInkStroke(buffer, inkValue, _j932, brushColorMode, _j992);
          let _j1015 = baseBrushSize * ctlNoiseByFrame;
          if (baseBrushSize > 4.0) _j1015 *= $win.crandom.random(0.5, 2.5);
          for (let i = 0; i < BRANCH_OFFSETS_8.length; i++) {
            let rotJitter = baseBrushSize > 4.0 ? $win.crandom.random(0, 6.28) : 0;
            const _j276 = BRANCH_OFFSETS_8[i];
            const _j1007 = _j996[i];
            const _j1008 = _j997[_j276.jitterIndex];
            if (_j1007 > _j276.randThreshold) {
              const _j1017 = $p.cos(_j276.angle + rotJitter) * _j276.radius * _j1015;
              const _j1018 = $p.sin(_j276.angle + rotJitter) * _j276.radius * _j1015;
              const _j1012 = (flipCfg.flip1stX ? -1 : 1) * _j1017;
              const _j1013 = (flipCfg.flip1stY ? -1 : 1) * _j1018;
              const _j1014 = {
                offsetX: _j1012,
                offsetY: _j1013,
                randThreshold: _j276.randThreshold,
                pathProgressEnd: _j276.pathProgressEnd,
                jitterIndex: _j276.jitterIndex,
              };
              drawBranch(3, buffer, _j1014, x, y, curX, curY, _j968, _j969, _j989, sizeVariation, _j1008);
            }
          }
        } else if (flyBrushType == 4) {
          let sizeVariation = $p.map($p.noise(x * 0.1 + 400, y * 0.1 + 200), 0, 1, 0.9, 1.1);
          setInkStroke(buffer, inkValue, brushColorMode, _j992);
          let _j1015 = baseBrushSize * ctlNoiseByFrame;
          if (baseBrushSize > 4.0) _j1015 *= $win.crandom.random(0.5, 2.5);
          for (let i = 0; i < BRANCH_OFFSETS_12.length; i++) {
            let rotJitter = baseBrushSize > 4.0 ? $win.crandom.random(0, 6.28) : 0;
            const _j276 = BRANCH_OFFSETS_12[i];
            const _j1007 = _j996[i];
            const _j1008 = _j997[_j276.jitterIndex];
            if (_j1007 > _j276.randThreshold) {
              const _j1017 = $p.cos(_j276.angle + rotJitter) * _j276.radius * _j1015;
              const _j1018 = $p.sin(_j276.angle + rotJitter) * _j276.radius * _j1015;
              const _j1012 = (flipCfg.flip1stX ? -1 : 1) * _j1017;
              const _j1013 = (flipCfg.flip1stY ? -1 : 1) * _j1018;
              const _j1014 = {
                offsetX: _j1012,
                offsetY: _j1013,
                randThreshold: _j276.randThreshold,
                pathProgressEnd: _j276.pathProgressEnd,
                jitterIndex: _j276.jitterIndex,
              };
              drawBranch(4, buffer, _j1014, x, y, curX, curY, _j968, _j969, _j989, sizeVariation, _j1008);
            }
          }
        }
      }
      $p.pop();
      buffer.end();
    }
    function drawDryBrush(buffer, penX, penY, prevPenX = null, prevPenY = null, n = 80, o = 2) {
      buffer.begin();
      $p.push();
      $p.translate(-hw, -hh);
      const fromX = prevPenX !== null && prevPenY !== null ? prevPenX : isPlaying ? playPrevX : $in.pmouseX;
      const fromY = prevPenX !== null && prevPenY !== null ? prevPenY : isPlaying ? playPrevY : $in.pmouseY;
      const effBaseSize =
        pressureEnabled && typeof pressureBaseBrushSize !== 'undefined' && pressureBaseBrushSize !== null
          ? pressureBaseBrushSize
          : baseBrushSize;
      const baseSizeNow = baseBrushSize;
      const _j1021 = strokeFrame;
      const _j1022 = $p.max(effBaseSize < 0.25 ? 0.3 : 1, initialSize - strokeFrame * randStep);
      o = $p.min(baseSizeNow * 2.0, 5 * _j1022 * penSketchNoiseBase * $p.map($p.sin(_j1021 * 2), 0, 1, 0.5, 1.5));
      const mouseMoved = $p.abs(penX - fromX) > 0.1 || $p.abs(penY - fromY) > 0.1;
      let inkValue = inkJitter(inkGray);
      let _j932 = inkJitter(inkGray);
      const _j1023 = [];
      for (let i = 0; i < n; i++) {
        _j1023.push({
          t: $win.crandom.random(0, 1),
          strokeWeight: $p.max(
            effBaseSize < 0.25 ? 0.1 : 0.3,
            $p.min(effBaseSize < 0.25 ? baseSizeNow * 5 : 2, baseSizeNow * $win.crandom.random(-0.5, 1)),
          ),
          angle: $win.crandom.random(0, $p.TWO_PI),
          radius: $p.sqrt($win.crandom.random(0, 1)) * o,
          alpha: $win.crandom.random(150, 255),
        });
      }
      for (let i = 0; i < n; i++) {
        const _j1024 = _j1023[i];
        let t = _j1024.t;
        $p.strokeWeight(_j1024.strokeWeight);
        const angle = _j1024.angle;
        const radius = _j1024.radius;
        let _j1025 = radius * $p.cos(angle);
        let _j1026 = radius * $p.sin(angle);
        let _j950 = _j1024.alpha;
        let x, y;
        if (mouseMoved) {
          x = $p.lerp(penX, fromX, t) + _j1025;
          y = $p.lerp(penY, fromY, t) + _j1026;
        } else {
          x = penX + _j1025;
          y = penY + _j1026;
        }
        setInkStroke(buffer, inkValue, _j932, brushColorMode, _j950);
        if (strokeFrame > 3) $p.point(x, y);
      }
      $p.pop();
      buffer.end();
    }
    if (typeof drawMarker.lastAngle === 'undefined') {
      drawMarker.lastAngle = 0;
    }
    if (typeof drawMarker.lastMovementAngle === 'undefined') {
      drawMarker.lastMovementAngle = 0;
    }
    const MARKER_LINES = [
      {
        perpOffset: 1.5,
        randThreshold: 0.7,
      },
      {
        perpOffset: -1.5,
        randThreshold: 0.75,
      },
      {
        perpOffset: 3.0,
        randThreshold: 0.8,
      },
      {
        perpOffset: -3.0,
        randThreshold: 0.85,
      },
      {
        perpOffset: 5.0,
        randThreshold: 0.9,
      },
    ];
    function inkJitter(inkValue) {
      if (brushColorMode === 0) {
        return inkValue + $win.crandom.random(10, 40);
      } else {
        return inkValue + $win.crandom.random(30, 80);
      }
    }
    function drawMarker(buffer, penX, penY, strokeProgress, flyBrushType = 0, mainStrokeDir = 0) {
      if (strokeFrame >= expectedStrokeLength) {
        console.log(
          'Marker not drawn: mouseCount >= expectedStrokeLength (',
          strokeFrame,
          '>=',
          expectedStrokeLength,
          ')',
        );
        return;
      }
      const effBaseSize =
        pressureEnabled && typeof pressureBaseBrushSize !== 'undefined' && pressureBaseBrushSize !== null
          ? pressureBaseBrushSize
          : baseBrushSize;
      let isTinyBrush = effBaseSize < 0.25;
      let _j961 = isTinyBrush ? effBaseSize * 5 : 9999;
      buffer.begin();
      $p.push();
      $p.translate(-hw, -hh);
      $p.colorMode($p.RGB, 255);
      let inkValue = inkJitter(inkGray);
      let _j932 = inkJitter(inkGray);
      let _j967 = initialSize * 0.3;
      let tipX_ = penX;
      let tipY_ = penY;
      if (!springInitialized) {
        springInitialized = 1;
        x = tipX_;
        y = tipY_;
      }
      velX += (tipX_ - x) * spring;
      velY += (tipY_ - y) * spring;
      velX *= friction;
      velY *= friction;
      speed += $p.sqrt(velX * velX + velY * velY) - speed;
      speed *= 1.2;
      if (baseBrushSize <= 1.0) {
        speed *= 0.9;
      } else if (baseBrushSize <= 2.0) {
        speed *= 1.3;
      } else {
        speed *= 1.5;
      }
      strokeWidth = sizeNow - speed;
      let _j1029 = smoothedWidth;
      let _j1030 = strokeWidth;
      let moveDx = tipX_ - x;
      let moveDy = tipY_ - y;
      let moveLen = $p.sqrt(moveDx * moveDx + moveDy * moveDy);
      let _j1034 = $p.max(isTinyBrush ? 0.1 : 0.5, _j1030 * 0.5);
      let _j1035 = 1.5 * $p.min(_j967, $p.max(isTinyBrush ? 0.5 : 4, _j1034));
      let _j1036 = _j1035 * 0.6;
      let _j1037 = 0.8;
      let _j1038 = $p.max(_j1036 * _j1037, 0.5);
      let numSteps = $p.max(1, $p.ceil(moveLen / _j1038));
      numSteps = $p.max(10, $p.min(50, numSteps));
      let _j1040 = numSteps / interpSteps;
      let _j968 = 0;
      let _j969 = 0;
      let moveFactor = $p.min(1.0, moveLen / 10);
      let _j1042 = moveFactor > 0.3;
      $p.rectMode($p.CENTER);
      let _j240 = $win.crandom.random(50, 100);
      const items = [];
      for (let i = 0; i < interpSteps; ++i) {
        items.push({
          explodeX1: $win.crandom.random(-1, 1),
          explodeY1: $win.crandom.random(-1, 1),
          explodeX2: $win.crandom.random(-1, 1),
          explodeY2: $win.crandom.random(-1, 1),
          showMainBrush: $win.crandom.random(0, 1),
          mainAlpha: $win.crandom.random(80, 200),
          rectWidthMult: $win.crandom.random(0.8, 1.2),
          flyWhiteRandoms: [
            $win.crandom.random(0, 1),
            $win.crandom.random(0, 1),
            $win.crandom.random(0, 1),
            $win.crandom.random(0, 1),
            $win.crandom.random(0, 1),
          ],
        });
      }
      for (let i = 0; i < interpSteps; ++i) {
        const item = items[i];
        let curX = x;
        let curY = y;
        x += velX / interpSteps;
        y += velY / interpSteps;
        let progress = (i + 1) / interpSteps;
        let _j1044 = $p.lerp(_j1029, _j1030, progress);
        smoothedWidth = $p.lerp(smoothedWidth, _j1044, 0.5);
        lineWidth += (smoothedWidth - lineWidth) * 0.8;
        lineWidth = $p.max(isTinyBrush ? 0.2 : 1.5, lineWidth);
        let _j986;
        let _j980 = item.explodeX1;
        let _j981 = item.explodeY1;
        let _j982 = item.explodeX2;
        let _j983 = item.explodeY2;
        if (strokeFrame < 5) {
          let fadeIn = $p.map(strokeFrame, 0, 5, 0.05, 1.0);
          _j986 = $p.max(isTinyBrush ? 0.1 : 0.5, lineWidth * fadeIn);
          if (explodeStart) {
            _j968 = _j980 * $p.map(strokeFrame, 0, 5, 10, 0);
            _j969 = _j981 * $p.map(strokeFrame, 0, 5, 10, 0);
          }
        } else if (strokeFrame >= expectedStrokeLength - 5) {
          let fadeOut = $p.map(strokeFrame, expectedStrokeLength - 5, expectedStrokeLength, 1.0, 0.05);
          _j986 = $p.max(isTinyBrush ? 0.1 : 0.5, lineWidth * fadeOut);
          if (explodeEnd) {
            _j968 = _j982 * $p.map(strokeFrame, expectedStrokeLength - 5, expectedStrokeLength, 0, 10);
            _j969 = _j983 * $p.map(strokeFrame, expectedStrokeLength - 5, expectedStrokeLength, 0, 10);
          }
        } else {
          _j986 = $p.max(isTinyBrush ? 0.1 : 0.5, lineWidth);
        }
        let _j990 = item.showMainBrush;
        let mainAlpha_ = item.mainAlpha;
        let showMainBrush = 0.3;
        let _j1045 = showMainBrush;
        if (_j1040 > 1.0) {
          _j1045 = showMainBrush / _j1040;
        } else if (_j1040 < 1.0) {
          _j1045 = showMainBrush * (2.0 - _j1040);
        }
        if (_j990 > _j1045 && strokeFrame > 5) {
          $p.noStroke();
          setInkStroke(buffer, inkValue, _j932, brushColorMode, mainAlpha_);
          let ss = $p.min(_j961, 1.2 * $p.min(_j967, $p.max(3 * effBaseSize, _j986)));
          let dx = x - curX;
          let dy = y - curY;
          let distance = $p.sqrt(dx * dx + dy * dy);
          let angle;
          const _j329 = 0.1;
          if (distance < _j329) {
            angle = drawMarker.lastAngle;
          } else {
            let heading = $p.atan2(dy, dx);
            angle = heading + $p.PI / 2;
            drawMarker.lastAngle = angle;
            drawMarker.lastMovementAngle = heading;
          }
          $p.push();
          $p.translate(x, y);
          $p.rotate(angle);
          let _j1036 = ss * item.rectWidthMult;
          $p.rect(0, 0, _j1036, _j1036 * (0.5 + $p.noise(x * 0.1, y * 0.1) * 0.5));
          $p.pop();
        }
        if (moveFactor > 0.9 && strokeFrame > 5 && strokeFrame < expectedStrokeLength - 5) {
          let _j1047 = -$p.sin(drawMarker.lastMovementAngle);
          let _j1048 = $p.cos(drawMarker.lastMovementAngle);
          for (let j = 0; j < MARKER_LINES.length; j++) {
            let markerLine = MARKER_LINES[j];
            let flyWhiteRand = item.flyWhiteRandoms[j];
            let _j1051 = markerLine.randThreshold - moveFactor * 0.3;
            if (flyWhiteRand > _j1051) {
              let offsetX = _j1047 * markerLine.perpOffset * effBaseSize;
              let offsetY = _j1048 * markerLine.perpOffset * effBaseSize;
              $p.stroke(_j240);
              $p.strokeWeight($p.min(_j961, $p.max(isTinyBrush ? 0.1 : 0.5, _j986 * 0.3)));
              $p.line(curX + offsetX, curY + offsetY, x + offsetX, y + offsetY);
            }
          }
        }
      }
      $p.pop();
      buffer.end();
    }
    let sprayParticles = [];
    let sprayParticleCounter = 0;
    function buildFlyBranchConfig(baseBrushSize, strokeSeed) {
      let _j1054, _j1055;
      if (baseBrushSize <= 0.1) {
        _j1054 = 2;
        _j1055 = 4;
      } else if (baseBrushSize <= 0.25) {
        _j1054 = 4;
        _j1055 = 7;
      } else if (baseBrushSize <= 0.5) {
        _j1054 = 6;
        _j1055 = 10;
      } else if (baseBrushSize <= 2.0) {
        _j1054 = 10;
        _j1055 = 15;
      } else if (baseBrushSize <= 3.0) {
        _j1054 = 20;
        _j1055 = 30;
      } else {
        _j1054 = 30;
        _j1055 = 50;
      }
      let count;
      if (_j1054 === _j1055) {
        count = _j1054;
      } else {
        const _j1056 = strokeSeed + 50000;
        $p.randomSeed(_j1056);
        count = Math.floor($win.crandom.random(_j1054, _j1055 + 1));
      }
      const _j1057 = [];
      const flySeed = strokeSeed + 60000;
      for (let i = 0; i < count; i++) {
        const _j1059 = flySeed + i * 1000;
        $p.randomSeed(_j1059);
        const perpOffset = $win.crandom.random(-6, 6);
        const _j1060 = flySeed + i * 2000 + 1;
        $p.randomSeed(_j1060);
        const randThreshold = $win.crandom.random(0.5, 1.0);
        const _j1061 = flySeed + i * 3000 + 2;
        $p.randomSeed(_j1061);
        const sizeMultiplier = $win.crandom.random(1.0, 2.0);
        const _j1062 = flySeed + i * 4000 + 3;
        $p.randomSeed(_j1062);
        const speedMultiplier = $win.crandom.random(0.7, 1.3);
        const _j1063 = flySeed + i * 5000 + 4;
        $p.randomSeed(_j1063);
        const minStrokeWeight = $win.crandom.random(0.8, 1.2);
        const _j1064 = flySeed + i * 6000 + 5;
        $p.randomSeed(_j1064);
        const startOffset = Math.floor($win.crandom.random(0, 6));
        const _j1065 = flySeed + i * 7000 + 6;
        $p.randomSeed(_j1065);
        const endDistanceOffset = $win.crandom.random(0, 8);
        const _j1066 = flySeed + i * 8000 + 7;
        $p.randomSeed(_j1066);
        const brushSpeedMultiplier = $win.crandom.random(1.0, 2.0);
        const _j1067 = flySeed + i * 9000 + 8;
        $p.randomSeed(_j1067);
        const widthVariationFactor = $win.crandom.random(0, 1);
        const _j1068 = flySeed + i * 10000 + 9;
        $p.randomSeed(_j1068);
        const offsetVariationFactor = $win.crandom.random(0, 1);
        _j1057.push({
          perpOffset: perpOffset,
          randThreshold: randThreshold,
          sizeMultiplier: sizeMultiplier,
          speedMultiplier: speedMultiplier,
          minStrokeWeight: minStrokeWeight,
          startOffset: startOffset,
          endDistanceOffset: endDistanceOffset,
          brushSpeedMultiplier: brushSpeedMultiplier,
          widthVariationFactor: widthVariationFactor,
          offsetVariationFactor: offsetVariationFactor,
        });
      }
      _j1057.sort((a, b) => a.perpOffset - b.perpOffset);
      return _j1057;
    }
    if (typeof drawFlyBrush.lastAngle === 'undefined') {
      drawFlyBrush.lastAngle = 0;
    }
    if (typeof drawFlyBrush.lastMovementAngle === 'undefined') {
      drawFlyBrush.lastMovementAngle = 0;
    }
    if (typeof drawFlyBrush.lastStrokeWeights === 'undefined') {
      drawFlyBrush.lastStrokeWeights = {};
    }
    if (typeof drawFlyBrush.configCache === 'undefined') {
      drawFlyBrush.configCache = {};
    }
    function resetFlyBrushCaches() {
      if (typeof drawFlyBrush !== 'undefined' && drawFlyBrush.configCache) {
        drawFlyBrush.configCache = {};
      }
      if (typeof drawFlyBrush !== 'undefined' && drawFlyBrush.lastStrokeWeights) {
        drawFlyBrush.lastStrokeWeights = {};
      }
    }
    function drawGothic(buffer, penX, penY, prevPenX = null, prevPenY = null) {
      if (strokeFrame >= expectedStrokeLength) {
        return;
      }
      buffer.begin();
      $p.push();
      $p.translate(-hw, -hh);
      $p.colorMode($p.RGB, 255);
      $p.noStroke();
      const fromX = prevPenX !== null && prevPenY !== null ? prevPenX : isPlaying ? playPrevX : $in.pmouseX;
      const fromY = prevPenY !== null && prevPenY !== null ? prevPenY : isPlaying ? playPrevY : $in.pmouseY;
      const gdx = penX - fromX;
      const gdy = penY - fromY;
      const moveDist = $p.sqrt(gdx * gdx + gdy * gdy);
      const speedMultiplier = $p.map($p.constrain(moveDist, 3, 50), 0, 50, 0.1, 5.0);
      let _j1072 = 0,
        _j1073 = 0;
      let _j1074 = 0,
        _j1075 = 0;
      let _j1076 = 0,
        _j1077 = 0;
      if (moveDist > 0.1) {
        _j1072 = gdx / moveDist;
        _j1073 = gdy / moveDist;
        _j1074 = -_j1073;
        _j1075 = _j1072;
        _j1076 = _j1073;
        _j1077 = -_j1072;
      } else {
        _j1074 = 0;
        _j1075 = 1;
        _j1076 = 0;
        _j1077 = -1;
      }
      const _j1078 = strokeFrame < expectedStrokeLength;
      const _j1079 = $p.map($p.constrain(speedMultiplier, 0.1, 5.0), 0.1, 5.0, 20, 1);
      const _j1080 = strokeSeed + strokeFrame * 10000 + 1;
      $p.randomSeed(_j1080);
      const _j1081 = _j1078 ? Math.floor($win.crandom.random(0, _j1079)) : 0;
      for (let i = 0; i < _j1081; i++) {
        const _j1082 = strokeSeed + strokeFrame * 1000 + sprayParticleCounter;
        $p.randomSeed(_j1082);
        const _j1083 = $win.crandom.random(5, 15) * baseBrushSize;
        const _j1084 = penX + $win.crandom.random(-2, 2) * baseBrushSize;
        const _j1085 = penY + $win.crandom.random(-2, 2) * baseBrushSize;
        const sideDirection = $win.crandom.random(0, 1) > 0.5 ? 1 : -1;
        let _j1086, _j1087, _j1088;
        if (brushColorMode === 0) {
          _j1086 = _j1087 = _j1088 = inkGray * 0.3;
        } else if (brushColorMode === 1) {
          _j1086 = _j1087 = _j1088 = 150;
        } else if (brushColorMode === 33 && typeof customBrushColor !== 'undefined') {
          _j1086 = customBrushColor[0];
          _j1087 = customBrushColor[1];
          _j1088 = customBrushColor[2];
        } else {
          const color = colorTable[brushColorMode];
          if (color && color.rgb) {
            _j1086 = color.rgb[0];
            _j1087 = color.rgb[1];
            _j1088 = color.rgb[2];
          } else {
            _j1086 = _j1087 = _j1088 = 26;
          }
        }
        const _j1089 = {
          id: sprayParticleCounter++,
          location: {
            x: _j1084,
            y: _j1085,
          },
          prevLocation: {
            x: _j1084,
            y: _j1085,
          },
          radius: _j1083,
          r: _j1086,
          g: _j1087,
          b: _j1088,
          xOff: 0.0,
          yOff: 0.0,
          sideDirection: sideDirection,
        };
        sprayParticles.push(_j1089);
      }
      const _j1090 = $p.map($p.constrain(baseBrushSize || 1.0, 0.1, 4.0), 0.1, 4.0, 0.01, 0.1);
      const _j1091 = $p.map($p.constrain(baseBrushSize || 1.0, 0.1, 4.0), 0.1, 4.0, 0.1, 0.5);
      for (let i = sprayParticles.length - 1; i >= 0; i--) {
        const particle = sprayParticles[i];
        if (particle.radius <= 0) {
          continue;
        }
        const _j1093 = strokeSeed + strokeFrame * 1000 + particle.id * 100;
        $p.randomSeed(_j1093);
        const _j1094 = $win.crandom.random(_j1090, _j1091) * 3.0;
        particle.radius -= _j1094;
        const _j1095 = $win.crandom.random(-0.5, 0.5) * speedMultiplier;
        const _j1096 = $win.crandom.random(-0.5, 0.5) * speedMultiplier;
        particle.xOff += _j1095;
        particle.yOff += _j1096;
        const speedScale = 2.0 * speedMultiplier;
        let _j1098 = 0,
          _j1099 = 0;
        const _j1100 = $win.crandom.random(0, 1);
        const _j1101 = particle.sideDirection !== undefined ? particle.sideDirection : _j1100 > 0.5 ? 1 : -1;
        if (_j1101 === 1) {
          _j1098 = _j1076 * speedScale;
          _j1099 = _j1077 * speedScale;
        } else {
          _j1098 = _j1074 * speedScale;
          _j1099 = _j1075 * speedScale;
        }
        const nX = $p.noise(particle.location.x) * particle.xOff;
        const nY = $p.noise(particle.location.y) * particle.yOff;
        if (!particle.prevLocation) {
          particle.prevLocation = {
            x: particle.location.x,
            y: particle.location.y,
          };
        } else {
          particle.prevLocation.x = particle.location.x;
          particle.prevLocation.y = particle.location.y;
        }
        particle.location.x += 2.0 * (_j1098 * 0.2 + nX * 0.8);
        particle.location.y += 2.0 * (_j1099 * 0.2 + nY * 0.8);
        if (brushColorMode >= 2) {
          const _j1102 = $p.noise(particle.location.x * 0.01, particle.location.y * 0.01) * 5;
          particle.r = $p.constrain(particle.r + _j1102, 0, 255);
          particle.g = $p.constrain(particle.g + _j1102, 0, 255);
          particle.b = $p.constrain(particle.b + _j1102, 0, 255);
        } else if (brushColorMode == 0) {
          const _j1102 = $p.noise(particle.location.x * 0.01, particle.location.y * 0.01) * 2;
          particle.r = $p.constrain(particle.r + _j1102, 0, 200);
          particle.g = $p.constrain(particle.g + _j1102, 0, 200);
          particle.b = $p.constrain(particle.b + _j1102, 0, 200);
        }
        const _j1103 = $win.crandom.random(0, 1) > 0.2;
        const _j1104 = $win.crandom.random(0, 1) > 0.99;
        if (particle.radius > 0) {
          $p.stroke(particle.r, particle.g, particle.b, 200);
          $p.strokeWeight($p.max(1, particle.radius * 0.5));
          if (_j1103) {
            $p.line(particle.prevLocation.x, particle.prevLocation.y, particle.location.x, particle.location.y);
          }
          if (_j1104) {
            particle.radius = -1;
          }
        } else {
          particle.radius = -1;
        }
      }
      const _j1105 = sprayParticles.length;
      let _j1106 = 0;
      for (let i = 0; i < sprayParticles.length; i++) {
        if (sprayParticles[i].radius > 0) {
          if (_j1106 !== i) {
            sprayParticles[_j1106] = sprayParticles[i];
          }
          _j1106++;
        }
      }
      sprayParticles.length = _j1106;
      const _j1107 = sprayParticles.length;
      if ($win.DEBUG_MODE && _j1105 > _j1107) {
        const _j1108 = _j1105 - _j1107;
        if (_j1108 > 50) {
          console.log(`🧹 Gothic dots cleaned: ${_j1108} dead particles removed (${_j1105} → ${_j1107})`);
        }
      }
      $p.pop();
      buffer.end();
    }
    function drawFlyBrush(buffer, penX, penY, strokeProgress, flyBrushType = 0, mainStrokeDir = 0) {
      if (strokeFrame >= expectedStrokeLength) {
        console.log(
          'Marker not drawn: mouseCount >= expectedStrokeLength (',
          strokeFrame,
          '>=',
          expectedStrokeLength,
          ')',
        );
        return;
      }
      buffer.begin();
      $p.push();
      $p.translate(-hw, -hh);
      $p.colorMode($p.RGB, 255);
      let inkValue = inkJitter(inkGray);
      let _j967 = initialSize * 0.3;
      const effBaseSize =
        pressureEnabled && typeof pressureBaseBrushSize !== 'undefined' && pressureBaseBrushSize !== null
          ? pressureBaseBrushSize
          : baseBrushSize;
      let tipX_ = penX;
      let tipY_ = penY;
      if (!springInitialized) {
        springInitialized = 1;
        x = tipX_;
        y = tipY_;
      }
      velX += (tipX_ - x) * spring;
      velY += (tipY_ - y) * spring;
      velX *= friction;
      velY *= friction;
      speed += $p.sqrt(velX * velX + velY * velY) - speed;
      speed *= 0.7;
      strokeWidth = sizeNow - speed;
      let _j1029 = smoothedWidth;
      let _j1030 = strokeWidth;
      let moveDx = tipX_ - x;
      let moveDy = tipY_ - y;
      let moveLen = $p.sqrt(moveDx * moveDx + moveDy * moveDy);
      const _j1110 = effBaseSize;
      const isTinyFly = _j1110 < 0.25;
      const isSmallFly = _j1110 < 1.0;
      let _j1034 = $p.max(isTinyFly ? 0.05 : isSmallFly ? _j1110 * 0.5 : 0.5, _j1030 * 0.5);
      let _j1035 = 1.5 * $p.min(_j967, $p.max(isSmallFly ? _j1110 * 4 : 4, _j1034));
      let _j1036 = _j1035 * 0.6;
      let _j1037 = 0.8;
      let _j1038 = $p.max(_j1036 * _j1037, 0.5);
      let numSteps = $p.max(1, $p.ceil(moveLen / _j1038));
      numSteps = $p.max(10, $p.min(50, numSteps));
      let _j1040 = numSteps / interpSteps;
      let _j968 = 0;
      let _j969 = 0;
      let moveFactor = $p.min(1.0, moveLen / 10);
      let _j1042 = moveFactor > 0.3;
      $p.rectMode($p.CENTER);
      let _j240 = $win.crandom.random(30, 70);
      const cacheKey = `flyBrush_${effBaseSize}_${strokeSeed}`;
      let _j1114;
      if (drawFlyBrush.configCache[cacheKey]) {
        _j1114 = drawFlyBrush.configCache[cacheKey];
      } else {
        _j1114 = buildFlyBranchConfig(effBaseSize, strokeSeed);
        drawFlyBrush.configCache[cacheKey] = _j1114;
      }
      const _j1115 = $p.map(_j240, 30, 70, 0, _j1114.length);
      const _j1116 = _j1114.length;
      const _j1117 = 40;
      const items = [];
      for (let i = 0; i < interpSteps; ++i) {
        const flyWhiteRandoms = [];
        const flyWhiteOffsetNoises = [];
        const flyWhiteWidthNoises = [];
        for (let j = 0; j < _j1117; j++) {
          flyWhiteRandoms.push($win.crandom.random(0.3, 1.2));
          const _j1118 = strokeFrame * 0.08 + j * 0.15;
          const _j1119 = strokeFrame * 0.08 + j * 0.15 + i * 0.01;
          flyWhiteOffsetNoises.push($p.noise(_j1118, _j1119));
          const _j1120 = strokeFrame * 0.1 + j * 0.1;
          const _j1121 = strokeFrame * 0.1 + j * 0.1 + i * 0.01;
          flyWhiteWidthNoises.push($p.noise(_j1120, _j1121));
        }
        items.push({
          explodeX1: $win.crandom.random(-1, 1),
          explodeY1: $win.crandom.random(-1, 1),
          explodeX2: $win.crandom.random(-1, 1),
          explodeY2: $win.crandom.random(-1, 1),
          showMainBrush: $win.crandom.random(0, 1),
          mainAlpha: $win.crandom.random(80, 200),
          rectWidthMult: $win.crandom.random(0.8, 1.2),
          flyWhiteRandoms: flyWhiteRandoms,
          flyWhiteOffsetNoises: flyWhiteOffsetNoises,
          flyWhiteWidthNoises: flyWhiteWidthNoises,
        });
      }
      for (let i = 0; i < interpSteps; ++i) {
        const item = items[i];
        let curX = x;
        let curY = y;
        x += velX / interpSteps;
        y += velY / interpSteps;
        let progress = (i + 1) / interpSteps;
        let _j1044 = $p.lerp(_j1029, _j1030, progress);
        smoothedWidth = $p.lerp(smoothedWidth, _j1044, 0.5);
        lineWidth += (smoothedWidth - lineWidth) * 0.8;
        lineWidth = $p.max(isSmallFly ? _j1110 * 1.5 : 1.5, lineWidth);
        let _j986;
        _j986 = $p.max(isTinyFly ? _j1110 * 0.5 : isSmallFly ? _j1110 : 0.5, lineWidth);
        let dx = x - curX;
        let dy = y - curY;
        let distance = $p.sqrt(dx * dx + dy * dy);
        let heading;
        const _j329 = 0.1;
        if (distance < _j329) {
          heading = drawFlyBrush.lastMovementAngle;
        } else {
          heading = $p.atan2(dy, dx);
          let angle = heading + $p.PI / 2;
          drawFlyBrush.lastAngle = angle;
          drawFlyBrush.lastMovementAngle = heading;
        }
        let _j990 = item.showMainBrush;
        let mainAlpha_ = item.mainAlpha;
        let showMainBrush = 0.3;
        let _j1045 = showMainBrush;
        if (_j1040 > 1.0) {
          _j1045 = showMainBrush / _j1040;
        } else if (_j1040 < 1.0) {
          _j1045 = showMainBrush * (2.0 - _j1040);
        }
        let _j1047 = -$p.sin(heading);
        let _j1048 = $p.cos(heading);
        const _j1122 = $p.max(isTinyFly ? _j1110 * 0.4 : isSmallFly ? _j1110 * 0.5 : 0.5, sizeNow * 0.5);
        const _j1123 = speed * 0.5;
        const _j1124 = strokeFrame < expectedStrokeLength - 5;
        const nearEnd = strokeFrame >= expectedStrokeLength - 5;
        const _j1126 = nearEnd ? 0.7 : 1.0;
        const _j1127 = strokeFrame >= expectedStrokeLength;
        let _j1128, _j1129, _j1130, _j1131, _j1132;
        if (nearEnd) {
          _j1128 = expectedStrokeLength - 5;
          _j1129 = strokeFrame - _j1128;
          _j1130 = $p.min(1.0, _j1129 / 5.0);
          _j1131 = $p.cos(heading);
          _j1132 = $p.sin(heading);
        }
        for (let j = 0; j < _j1114.length; j++) {
          let markerLine = _j1114[j];
          const _j1133 = strokeFrame >= markerLine.startOffset;
          if (!_j1133 || _j1127) {
            continue;
          }
          let flyWhiteRand = item.flyWhiteRandoms[j];
          let _j1051 = markerLine.randThreshold * _j1126;
          if (flyWhiteRand > _j1051) {
            const offsetNoise = item.flyWhiteOffsetNoises[j];
            const _j1015 = $p.map(offsetNoise, 0, 1, 1.0, 2.0);
            const _j1135 = 1.0 + (_j1015 - 1.0) * markerLine.offsetVariationFactor;
            const _j1136 = isSmallFly ? $p.max(0.3, _j1110 * 3) : _j1110;
            const _j1137 = markerLine.perpOffset * _j1136 * _j1135;
            let offsetX = _j1047 * _j1137;
            let offsetY = _j1048 * _j1137;
            let _j280 = x;
            let _j281 = y;
            let _j1138 = curX;
            let _j1139 = curY;
            if (nearEnd) {
              const _j1140 = markerLine.endDistanceOffset * _j1130 * effBaseSize;
              const _j1141 = _j1131 * _j1140;
              const _j1142 = _j1132 * _j1140;
              _j280 = x + _j1141;
              _j281 = y + _j1142;
              if (_j1129 === 0) {
                _j1138 = curX;
                _j1139 = curY;
              } else {
                const _j1143 = $p.min(1.0, (_j1129 - 1) / 5.0);
                const _j1144 = markerLine.endDistanceOffset * _j1143 * effBaseSize;
                const _j1145 = _j1131 * _j1144;
                const _j1146 = _j1132 * _j1144;
                _j1138 = x + _j1145;
                _j1139 = y + _j1146;
              }
            }
            const _j1147 = _j1123 * markerLine.brushSpeedMultiplier * markerLine.speedMultiplier;
            const _j1148 = $p.max(isTinyFly ? _j1110 * 0.3 : isSmallFly ? _j1110 * 0.3 : 0.5, _j1122 - _j1147);
            const _j1149 = _j1148 * 0.6;
            const widthNoise = item.flyWhiteWidthNoises[j];
            const _j1151 = $p.map(widthNoise, 0, 1, 0.8, 1.2);
            const _j1152 = 1.0 + (_j1151 - 1.0) * markerLine.widthVariationFactor;
            let _j1153 = $p.max(0, $p.map(j, 0, _j1114.length, 80, 230) - $p.noise(i * 0.5, j * 0.5) * 30);
            let kk = $p.min(200, _j1153) + $p.random(-50, 50);
            $p.stroke(inkValue, kk);
            const _j1154 = _j1149 * markerLine.sizeMultiplier * _j1152;
            const _j1155 = $p.max(1, _j1154);
            const _j1156 = `${cacheKey}_${j}`;
            let prevWeight = drawFlyBrush.lastStrokeWeights[_j1156];
            if (typeof prevWeight === 'undefined') {
              prevWeight = _j1155;
            }
            const _j1158 = prevWeight;
            let _j1159;
            if (_j1158 < 3.0) {
              _j1159 = 0.15;
            } else if (_j1158 >= 5.0) {
              _j1159 = 0.3;
            } else {
              const t = (_j1158 - 3.0) / (5.0 - 3.0);
              _j1159 = $p.lerp(0.15, 0.3, t);
            }
            const _j1160 = $p.lerp(prevWeight, _j1155, _j1159);
            drawFlyBrush.lastStrokeWeights[_j1156] = _j1160;
            $p.strokeWeight(_j1160);
            $p.line(_j1138 + offsetX, _j1139 + offsetY, _j280 + offsetX, _j281 + offsetY);
          }
        }
      }
      $p.pop();
      buffer.end();
    }
    function logMessage(type, message, data = {}) {
      $host.log(type, message, data);
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
      });
      const _j1181 = {
        recording: '🔴',
        playback: '▶️',
        system: '⚙️',
        art: '🎨',
      };
      const icon = _j1181[type] || '⚙️';
      if (Object.keys(data).length > 0) {
      } else {
      }
      if (typeof screenText !== 'undefined' && screenText) {
        uiAppendLog(type, message, data);
      }
    }
    function saveCanvasPNG() {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `artwork-${timestamp}.png`;
      $p.saveCanvas(filename);
      logTitle('💾 Canvas Saved as PNG');
    }
    function setBrushSizeName(sizeName) {
      brushSizeName = sizeName;
      switch (sizeName) {
        case 'ultra-small':
          baseBrushSize = 0.1;
          break;
        case 'extra-small':
          baseBrushSize = 0.25;
          break;
        case 'small':
          baseBrushSize = 0.5;
          break;
        case 'medium':
          baseBrushSize = 1.0;
          break;
        case 'large':
          baseBrushSize = 2.0;
          break;
        case 'extra-large':
          baseBrushSize = 3.0;
          break;
        case 'extra-extra-large':
          baseBrushSize = 5.0;
          break;
        case 'huge':
          baseBrushSize = 10.0;
          break;
      }
      if (typeof pressureBaseBrushSize !== 'undefined') pressureBaseBrushSize = baseBrushSize;
      uiSyncBrushSize();
      uiUpdateBrushStatus();
      logMessage('ui', 'Brush size changed', {
        Mode: sizeName.toUpperCase(),
        Multiplier: baseBrushSize + 'x',
      });
    }
    function setBrushModeValue(mode) {
      brushMode = parseInt(mode);
      uiSyncBrushMode();
      uiUpdateBrushStatus();
      logMessage('ui', 'Brush mode changed', {
        Mode: `Brush ${mode}`,
        Description: brushModeLabel(mode),
      });
    }
    function brushModeLabel(mode) {
      const _j1214 = {
        1: 'Large brush (20-30)',
        2: 'Small brush (5-10)',
        3: 'Extra large brush (80-120)',
        4: 'Pen sketch mode (2-4)',
        5: 'Dot paint mode (8-15)',
        6: 'Fly brush mode',
        7: 'Brush mode 7',
      };
      return _j1214[mode] || 'Unknown mode';
    }
    function setInkEffectValue(effect) {
      const newEffect = parseInt(effect);
      const _j1216 = useSharpen;
      logMessage('ui', '🎨 Ink effect switching', {
        From: _j1216,
        To: newEffect,
        Note: 'Buffer preserved to keep existing content',
      });
      useSharpen = newEffect;
      if (typeof prevInkEffect !== 'undefined') {
        prevInkEffect = _j1216;
      }
      uiSyncInkEffect();
      uiUpdateBrushStatus();
      const _j1217 = {
        0: 'Mix Diffusion',
        1: 'Sharpen Edge',
        2: 'Flying White',
        3: 'Wet Ink',
        4: 'Effect 4',
        5: 'Hair Texture',
      };
      logMessage('ui', '✨ Ink effect changed', {
        Effect: _j1217[newEffect] || 'Unknown',
        ShaderValue: useSharpen,
      });
    }
    function setBlendModeValue(mode) {
      const blendValue = parseInt(mode);
      if (blendValue === 3) {
        $win.spectral = true;
      } else {
        if (typeof keyBlendMode !== 'undefined') {
          keyBlendMode = blendValue;
        }
        $win.spectral = false;
      }
      uiSyncBlendMode();
      const _j1219 = {
        0: 'Mix',
        1: 'Multiply',
        2: 'Darken',
        3: 'Spectral',
      };
      logMessage('ui', '🎨 BlendMode changed', {
        Mode: _j1219[blendValue] || 'Unknown',
      });
    }
    function setBrushColorName(color) {
      whiteBrushMode = color === 'white';
      const _j1222 = {
        black: 0,
        white: 1,
        dark_gray: 2,
        medium_gray_new: 3,
        light_gray_new: 4,
        green: 5,
        orange: 6,
        brown: 7,
        green_dark: 8,
        blue_dark: 9,
        purple: 10,
        lime: 11,
        light_gray: 12,
        blue_gray: 13,
        terra_cotta: 14,
        olive_green: 15,
        pink: 16,
        wine_red: 17,
        gold_orange: 18,
        gray_brown: 19,
        sage_gray: 20,
        brick_red: 21,
        silver: 22,
        beige: 23,
        gray_green: 24,
        tan: 25,
        khaki: 26,
        dusty_rose: 27,
        mauve_gray: 28,
        medium_gray: 29,
        red: 30,
        yellow: 31,
        blue: 32,
        custom: 33,
        coral: 34,
        mint: 35,
      };
      brushColorMode = _j1222[color] !== undefined ? _j1222[color] : 0;
      uiSyncBrushColor();
      uiUpdateBrushStatus();
      const colorLabels = {
        black: 'Black',
        white: 'White',
        dark_gray: 'Dark Gray',
        medium_gray_new: 'Medium Gray',
        light_gray_new: 'Light Gray',
        green: 'Green',
        orange: 'Orange',
        brown: 'Brown',
        green_dark: 'Dark Green',
        blue_dark: 'Dark Blue',
        purple: 'Purple',
        lime: 'Lime',
        light_gray: 'Light Gray',
        blue_gray: 'Blue Gray',
        terra_cotta: 'Terra Cotta',
        olive_green: 'Olive Green',
        pink: 'Pink',
        wine_red: 'Wine Red',
        gold_orange: 'Gold Orange',
        gray_brown: 'Gray Brown',
        sage_gray: 'Sage Gray',
        brick_red: 'Brick Red',
        silver: 'Silver',
        beige: 'Beige',
        gray_green: 'Gray Green',
        tan: 'Tan',
        khaki: 'Khaki',
        dusty_rose: 'Dusty Rose',
        mauve_gray: 'Mauve Gray',
        medium_gray: 'Medium Gray',
        red: 'Red',
        yellow: 'Yellow',
        blue: 'Blue',
        coral: 'Coral',
        mint: 'Mint',
      };
      if (typeof getColorByName === 'function') {
        const namedColor = getColorByName(color);
        if (namedColor) {
          const customBrushColorEl = $doc.getElementById('custom-brush-color');
          const customBrushColorTextEl = $doc.getElementById('custom-brush-color-text');
          if (customBrushColorEl) customBrushColorEl.value = namedColor.hex;
          if (customBrushColorTextEl)
            customBrushColorTextEl.value = namedColor.displayName + ' ' + namedColor.hex;
          if (typeof customBrushColor !== 'undefined') {
            customBrushColor[0] = namedColor.rgb[0];
            customBrushColor[1] = namedColor.rgb[1];
            customBrushColor[2] = namedColor.rgb[2];
          }
        }
      }
      logMessage('ui', '🎨 Brush color changed', {
        Color: colorLabels[color] || color,
        Mode: `${colorLabels[color] || color} brush mode`,
        ColorCode: brushColorMode,
      });
    }
    function setPathRotationModeValue(modeValue) {
      pathRotationMode = parseInt(modeValue);
      uiSyncPathRotation();
      uiUpdateBrushStatus();
      const _j1232 = {
        1: '2-6',
        2: '10-20',
        3: '20-40',
      };
      logMessage('ui', '🔄 Path rotation changed', {
        Mode: modeValue,
        Range: _j1232[modeValue] || 'Unknown',
      });
    }
    function resetBrushSettings() {
      brushMode = 1;
      brushSizeName = 'large';
      baseBrushSize = 2.0;
      useSharpen = 0;
      whiteBrushMode = false;
      pathRotationMode = 1;
      if (typeof keyBlendMode !== 'undefined') {
        keyBlendMode = 0;
      }
      uiSyncBrushMode();
      uiSyncBrushSize();
      uiSyncInkEffect();
      uiSyncBrushColor();
      uiSyncPathRotation();
      uiSyncBlendMode();
      uiUpdateBrushStatus();
      logMessage('ui', 'Brush settings reset', {
        Status: 'All settings restored to default',
        Mode: 'Brush 1',
        Size: 'large (1.0x)',
        Effect: 'Mix Diffusion',
        Color: 'Black',
        PathRotation: '2-6',
      });
    }
    let activeFlowButton = null;
    let flowUiTimer = null;
    function flowButtonDown(btn, blendType) {
      if (activeFlowButton) return;
      const bounds = typeof lastStrokeBoundsNormalized === 'function' ? lastStrokeBoundsNormalized() : null;
      if (!bounds) {
        logMessage('warning', '🌊 No stroke to apply Flow effect', {
          Status: 'Draw a stroke first',
        });
        return;
      }
      activeFlowButton = btn;
      btn.classList.add('active', 'running');
      if (typeof flowEffectStrokeBounds !== 'undefined') {
        flowEffectStrokeBounds = bounds;
      }
      if (typeof $win !== 'undefined') {
        flowEffectStrokeBounds = bounds;
      }
      const flowSeed = Math.floor(Math.random() * 1000000);
      if (typeof startFlowEffect === 'function') {
        startFlowEffect(blendType, flowSeed);
      }
      if (typeof recordEvent === 'function' && typeof isRecording !== 'undefined' && isRecording) {
        if (
          typeof lastStrokeEndMillis !== 'undefined' &&
          lastStrokeEndMillis > 0 &&
          typeof pausedAccum !== 'undefined'
        ) {
          const sinceLastStroke = $clock() - lastStrokeEndMillis;
          if (sinceLastStroke > 0) {
            pausedAccum += sinceLastStroke;
            lastStrokeEndMillis = $clock();
            console.log('🎬 Flow recording: accumulated pause time updated', {
              _j820: sinceLastStroke,
              total: pausedAccum,
            });
          }
        }
        const _j1427 = {
          action: 'start',
          blendType: blendType,
          flowSeed: flowSeed,
          strokeBounds: bounds,
          strength: typeof flowParams !== 'undefined' ? flowParams.blendVol : 100,
          lastStrokeOnly: typeof flowLastStrokeOnly !== 'undefined' ? flowLastStrokeOnly : false,
        };
        console.log('🎬 Recording flow start event:', _j1427);
        recordEvent('flow', _j1427);
      }
      flowUiTimer = setInterval(() => {
        const flowIterationCountEl = $doc.getElementById('flow-iteration-count');
        if (flowIterationCountEl && typeof flowIterations !== 'undefined') {
          flowIterationCountEl.textContent = flowIterations;
        }
      }, 50);
      logMessage('ui', '🌊 Flow Effect Button Pressed', {
        BlendType: blendType,
        Seed: flowSeed,
      });
    }
    function flowButtonUp(btn, blendType) {
      if (activeFlowButton !== btn) return;
      btn.classList.remove('active', 'running');
      activeFlowButton = null;
      if (flowUiTimer) {
        clearInterval(flowUiTimer);
        flowUiTimer = null;
      }
      let flowResult = null;
      if (typeof stopFlowEffect === 'function') {
        flowResult = stopFlowEffect();
      }
      if (typeof recordEvent === 'function' && typeof isRecording !== 'undefined' && isRecording && flowResult) {
        const _j1429 = {
          action: 'end',
          blendType: blendType,
          flowSeed: typeof flowSeed !== 'undefined' ? flowSeed : 0,
          duration: flowResult.duration,
          iterations: flowResult.iterations,
          totalFrames: flowResult.frames,
        };
        console.log('🎬 Recording flow end event:', _j1429);
        recordEvent('flow', _j1429);
        if (typeof lastStrokeEndMillis !== 'undefined') {
          lastStrokeEndMillis = $clock();
        }
      }
      logMessage('ui', '🌊 Flow Effect Button Released', {
        BlendType: blendType,
        Duration: flowResult ? Math.round(flowResult.duration) + 'ms' : 'unknown',
        Iterations: flowResult ? flowResult.iterations : 'unknown',
        Frames: flowResult ? flowResult.frames : 'unknown',
      });
    }
    let performanceMonitor = {
      enabled: true,
      logFpsToConsole: false,
      frameRateThreshold: 30,
      checkInterval: 60,
      frameCount: 0,
      lastCheckFrame: 0,
      lastFrameTime: 0,
      _frBuf: new Float64Array(60),
      _frIdx: 0,
      _frLen: 0,
      _frSum: 0,
      _pushFR: function (_j1562) {
        if (this._frLen === 60) {
          this._frSum -= this._frBuf[this._frIdx];
        } else {
          this._frLen++;
        }
        this._frBuf[this._frIdx] = _j1562;
        this._frSum += _j1562;
        this._frIdx = (this._frIdx + 1) % 60;
      },
      _avgFR: function () {
        return this._frLen > 0 ? this._frSum / this._frLen : 0;
      },
      performanceData: {
        drawTotal: 0,
        updatePlayback: 0,
        updateCompositeBuffer: 0,
        updateEasyCamAutoTracking: 0,
        drawCursorToBuffer: 0,
        updateBlurEffect: 0,
        applyCameraProjection: 0,
        drawLayersWithBlur: 0,
        other: 0,
      },
      performanceDataAccumulated: {
        drawTotal: 0,
        updatePlayback: 0,
        updateCompositeBuffer: 0,
        updateEasyCamAutoTracking: 0,
        drawCursorToBuffer: 0,
        updateBlurEffect: 0,
        applyCameraProjection: 0,
        drawLayersWithBlur: 0,
        other: 0,
        sampleCount: 0,
      },
      lastPerformanceLog: 0,
      logCooldown: 5000,
      test: function () {
        console.log('🎯 性能监控测试');
        try {
          console.log('当前 frameRate():', $p.frameRate());
        } catch (e) {
          console.log('frameRate() 不可用:', e);
        }
        console.log('监控状态:', this.enabled ? '启用' : '禁用');
        console.log('帧计数:', this.frameCount);
        console.log('阈值:', this.frameRateThreshold);
        console.log('历史记录数量:', this._frLen);
        if (this._frLen > 0) {
          const _j1431 = this._avgFR();
          console.log('平均 frameRate:', _j1431.toFixed(2));
          console.log('是否触发警告:', _j1431 < this.frameRateThreshold ? '是' : '否');
        } else {
          console.log('⚠️ 历史记录为空，可能需要等待几秒');
        }
        console.log('性能数据:', this.performanceData);
        console.log('累积数据:', this.performanceDataAccumulated);
        const _j1432 = this.logCooldown;
        this.logCooldown = 0;
        const _j1433 =
          this._frLen > 0
            ? this._avgFR()
            : (() => {
                try {
                  return $p.frameRate();
                } catch (e) {
                  return 60;
                }
              })();
        console.log('强制触发检查，使用平均帧率:', _j1433.toFixed(2));
        perfMonitorReport(_j1433);
        this.logCooldown = _j1432;
      },
      forceLowFrameRate: function () {
        console.log('⚠️ 强制设置低帧率测试（仅用于调试）');
        this._frIdx = 0;
        this._frLen = 0;
        this._frSum = 0;
        for (let i = 0; i < 60; i++) {
          this._pushFR(20);
        }
        console.log('已设置历史记录为 20 fps');
        const _j1431 = this._avgFR();
        console.log('平均帧率:', _j1431);
        const _j1432 = this.logCooldown;
        this.logCooldown = 0;
        this.lastCheckFrame = this.frameCount - this.checkInterval - 1;
        perfMonitorReport(_j1431);
        this.logCooldown = _j1432;
      },
      triggerNow: function () {
        console.log('🎯 立即触发性能警告测试');
        const _j1432 = this.logCooldown;
        this.logCooldown = 0;
        const _j1434 = this.frameRateThreshold - 10;
        console.log('使用测试帧率:', _j1434);
        perfMonitorReport(_j1434);
        this.logCooldown = _j1432;
      },
    };
    function loadCommitShaders() {
      encodeShader = loadShaderFromSources('./shaders/base.vert', './shaders/encode.frag');
      compositeShader = loadShaderFromSources('./shaders/base.vert', './shaders/composite.frag');
      typeMapEncodeShader = loadShaderFromSources('./shaders/base.vert', './shaders/typeMapEncode.frag');
    }
    function clearCanvas() {
      const bgColor = typeof canvasBackgroundColor !== 'undefined' ? canvasBackgroundColor : [255, 255, 255];
      $p.background(bgColor[0], bgColor[1], bgColor[2]);
      if (typeof oldBuffer !== 'undefined' && oldBuffer) {
        oldBuffer.begin();
        $p.clear();
        $p.background(255);
        oldBuffer.end();
      }
      if (typeof newBufferBlack !== 'undefined' && newBufferBlack) {
        newBufferBlack.begin();
        $p.clear();
        $p.background(255);
        newBufferBlack.end();
      }
      if (typeof textOverlayGfx !== 'undefined' && textOverlayGfx) {
        textOverlayGfx.clear();
      }
      if (typeof finalBuffer !== 'undefined' && finalBuffer) {
        finalBuffer.begin();
        $p.clear();
        $p.background(255);
        finalBuffer.end();
      }
      if (typeof futurePathGfx !== 'undefined' && futurePathGfx) {
        futurePathGfx.clear();
        futurePathGfx.background(255);
      }
      if (typeof cursorBuffer !== 'undefined' && cursorBuffer) {
        cursorBuffer.begin();
        $p.clear();
        cursorBuffer.end();
      }
      if (typeof typeMapBuffer !== 'undefined' && typeMapBuffer) {
        typeMapBuffer.begin();
        $p.clear();
        $p.background(0);
        typeMapBuffer.end();
      }
      isDrawing = false;
      isReleasing = false;
      countdownFrame = 0;
      force = 1.0;
      strokeActive = false;
      strokeCommitted = false;
      springInitialized = 0;
      x = hw;
      y = hh;
      velX = 0;
      velY = 0;
      speed = 0;
      initialSize = 0;
      brushSize = 0;
      feedbackFrame = 0;
      pathPoints = [];
      collectPathPoints = false;
      if (typeof allBrushStrokes !== 'undefined') {
        allBrushStrokes = [];
      }
      if (typeof currentStrokeHighlight !== 'undefined') {
        currentStrokeHighlight = null;
      }
      if (typeof pendingBugBounds !== 'undefined') {
        pendingBugBounds = null;
      }
      if (typeof lastStrokeBounds !== 'undefined') {
        lastStrokeBounds = null;
      }
      if (typeof totalStrokeCount !== 'undefined') {
        totalStrokeCount = 0;
      }
      if (typeof $win.__lastGridParams !== 'undefined') {
        $win.__lastGridParams = null;
      }
      if (typeof prevGridParams !== 'undefined') {
        prevGridParams = null;
      }
      if (typeof $win.updateStrokeSelector === 'function') {
        $win.updateStrokeSelector();
      }
      if (typeof $win.bugsMaskTexture !== 'undefined' && $win.bugsMaskTexture) {
        $win.bugsMaskTexture.clear();
      }
      if (typeof $win.bugsDataTexture !== 'undefined' && $win.bugsDataTexture) {
        $win.bugsDataTexture.clear();
      }
      randomizeForceMap();
      primeFeedback();
      compositeDirty = true;
    }
    function initPlaybackEnvironment() {
      logMessage('system', '🎬 Initializing playback environment', {
        Status: 'Setting up shaders and buffers',
      });
      clearAllBuffers();
      primeFeedback();
      updateForceMap();
      resetBrushState();
      logMessage('system', '✅ Playback environment ready', {
        Status: 'All systems initialized',
      });
    }
    function clearAllBuffers() {
      oldBuffer.begin();
      $p.clear();
      $p.background(255);
      oldBuffer.end();
      newBufferBlack.begin();
      $p.clear();
      $p.background(255);
      newBufferBlack.end();
      textOverlayGfx.clear();
      finalBuffer.begin();
      $p.clear();
      $p.background(255);
      finalBuffer.end();
      futurePathGfx.clear();
      futurePathGfx.background(255);
      pingPongBuffer.begin();
      $p.clear();
      $p.background(255);
      pingPongBuffer.end();
      if (typeof realtimeIntermediateBuffer !== 'undefined' && realtimeIntermediateBuffer) {
        realtimeIntermediateBuffer.begin();
        $p.clear();
        realtimeIntermediateBuffer.end();
      }
      cursorBuffer.begin();
      $p.clear();
      cursorBuffer.end();
      if (typeof typeMapBuffer !== 'undefined' && typeMapBuffer) {
        typeMapBuffer.begin();
        $p.clear();
        $p.background(0);
        typeMapBuffer.end();
      }
      textOverlayGfx.blendMode($p.BLEND);
      futurePathGfx.blendMode($p.BLEND);
      compositeDirty = true;
    }
    function primeFeedback() {
      if (!pingPongBuffer || !feedbackShader) return;
      if (feedbackShader) {
        pingPongBuffer.begin();
        if (bypassFeedback) {
          $p.image(newBufferBlack, 0, 0, $p.width, $p.height);
          $p.resetShader();
          pingPongBuffer.end();
          return;
        }
        $p.shader(feedbackShader);
        feedbackShader.setUniform('rect', [0, 0, $p.width * density, $p.height * density]);
        feedbackShader.setUniform('tex0', newBufferBlack);
        feedbackShader.setUniform('brushMode', (typeof brushMode !== 'undefined' ? brushMode : 1) * 1.0);
        feedbackShader.setUniform('forceMap', forceMapBuffer);
        feedbackShader.setUniform('baseBrushSize', typeof baseBrushSize !== 'undefined' ? baseBrushSize : 1.0);
        feedbackShader.setUniform('force', 1.0);
        feedbackShader.setUniform('useSharpen', typeof useSharpen !== 'undefined' ? useSharpen : 0.0);
        feedbackShader.setUniform(
          'effect3Brightness',
          typeof effect3Brightness !== 'undefined' ? effect3Brightness : 0.2,
        );
        feedbackShader.setUniform(
          'indiffusionStrength',
          typeof indiffusionStrength !== 'undefined' ? indiffusionStrength : 0.3,
        );
        feedbackShader.setUniform(
          'brushColorMode',
          (typeof brushColorMode !== 'undefined' ? brushColorMode : 0) * 1.0,
        );
        feedbackShader.setUniform(
          'brushCategory',
          typeof brushColorMode !== 'undefined' && brushColorMode === 1 ? 1.0 : 0.0,
        );
        feedbackShader.setUniform('mouseCount', 0.0);
        $p.rectMode($p.CENTER);
        $p.rect(0, 0, $p.width, $p.height);
        $p.resetShader();
        pingPongBuffer.end();
      }
    }
    function resetBrushState() {
      isDrawing = false;
      isReleasing = false;
      countdownFrame = 0;
      force = 1.0;
      strokeActive = false;
      strokeCommitted = false;
      springInitialized = 0;
      x = hw;
      y = hh;
      velX = 0;
      velY = 0;
      speed = 0;
      initialSize = 0;
      brushSize = 0;
      strokeWidth = 0;
      inkGray = 0;
      strokeFrame = 0;
      feedbackFrame = 0;
      pathPoints = [];
      collectPathPoints = false;
      startX = hw;
      startY = hh;
      tipX = hw;
      tipY = hh;
      pathAngle = 0;
      lineWidth = 0;
      legacyBrushX = hw;
      legacyBrushY = hh;
      flyBrushPoints = [];
      flyBrushEnd = [];
      smoothedWidth = 0;
      playX = hw;
      playY = hh;
      playPrevX = hw;
      playPrevY = hh;
      playMouseDown = false;
      countdownPauseStart = 0;
      countdownPausing = false;
    }
    function updateForceMap() {
      forceMapBuffer.begin();
      $p.shader(mapShader);
      mapShader.setUniform('randomSeed1', fmRandomSeeds[0] || 100);
      mapShader.setUniform('randomSeed2', fmRandomSeeds[1] || 200);
      mapShader.setUniform('randomSeed3', fmRandomSeeds[2] || 300);
      mapShader.setUniform('randomSeed4', fmRandomSeeds[3] || 400);
      mapShader.setUniform('scale1', fmScales[0] || 0.002);
      mapShader.setUniform('scale2', fmScales[1] || 0.005);
      mapShader.setUniform('scale3', fmScales[2] || 0.015);
      mapShader.setUniform('amplitude1', fmAmplitudes[0] || 0.6);
      mapShader.setUniform('amplitude2', fmAmplitudes[1] || 0.4);
      mapShader.setUniform('amplitude3', fmAmplitudes[2] || 0.3);
      mapShader.setUniform('phase1', fmPhases[0] || 0);
      mapShader.setUniform('phase2', fmPhases[1] || 0);
      mapShader.setUniform('phase3', fmPhases[2] || 0);
      mapShader.setUniform('vortexScale1', fmVortexScales[0] || 0.008);
      mapShader.setUniform('vortexScale2', fmVortexScales[1] || 0.012);
      mapShader.setUniform('clusterScale1', fmClusterScales[0] || 0.001);
      mapShader.setUniform('clusterScale2', fmClusterScales[1] || 0.0008);
      mapShader.setUniform('canvasCenter', [hw, hh]);
      mapShader.setUniform('time', $clock() * 0.001);
      $p.rectMode($p.CENTER);
      $p.imageMode($p.CENTER);
      $p.rect(0, 0, $p.width, $p.height);
      $p.resetShader();
      forceMapBuffer.end();
    }
    function randomizeForceMap() {
      for (let i = 0; i < 4; i++) {
        fmRandomSeeds[i] = $win.crandom.random(100 + i * 100, 200 + i * 100);
      }
      for (let i = 0; i < 3; i++) {
        fmScales[i] = $win.crandom.random(0.001 + i * 0.002, 0.003 + i * 0.005);
        fmAmplitudes[i] = $win.crandom.random(0.1 + i * 0.1, 0.4 + i * 0.2);
        fmPhases[i] = $win.crandom.random(0, $p.TWO_PI);
      }
      for (let i = 0; i < 2; i++) {
        fmVortexScales[i] = $win.crandom.random(0.005 + i * 0.003, 0.015 + i * 0.003);
        fmClusterScales[i] = $win.crandom.random(0.0005 + i * 0.0003, 0.002 + i * 0.0005);
      }
      updateForceMap();
    }
    function logTitle(title = '') {}
    function warmUp() {
      warmUpStroke();
    }
    function warmUpStroke() {
      randomizeForceMap();
      const _j1435 = brushMode;
      brushMode = 1;
      initialSize = 20;
      brushSize = initialSize;
      sizeNow = brushSize;
      strokeWidth = sizeNow;
      isDrawing = true;
      isReleasing = false;
      countdownFrame = 0;
      strokeActive = true;
      strokeCommitted = false;
      mousePressed();
      for (let i = 0; i < 5; i++) {
        runFeedbackPass(newBufferBlack, 1.0);
      }
      mouseReleased();
      isReleasing = true;
      countdownFrame = 0;
      for (let i = 0; i < 10; i++) {
        force = $p.map(i, 0, 10, 1.0, 0.0);
        runFeedbackPass(newBufferBlack, force);
      }
      commitStroke();
      brushMode = _j1435;
      clearCanvas();
    }
    function round2(value) {
      return Math.round(value * 100) / 100;
    }
    function recordEvent(type, data = {}) {
      if ($win.testMode) return;
      if (!isRecording) return;
      if (recordStartMillis === 0) return;
      const _j1438 = typeof recordingData.timeOffset !== 'undefined' ? recordingData.timeOffset : 0;
      const _j1439 = _j1438 + ($clock() - recordStartMillis - pausedAccum);
      const event = {
        m: type,
        t: Math.round(_j1439),
        ...data,
      };
      recordingData.events.push(event);
      if (type !== 'md' && type !== 'mouseDragged') {
        const _j1440 = {
          mp: '🖱️',
          mousePressed: '🖱️',
          mr: '✋',
          mouseReleased: '✋',
          kp: '⌨️',
          keyPressed: '⌨️',
          ec: '✨',
          effectControl: '✨',
        };
        const _j1441 = {
          mp: 'mousePressed',
          mr: 'mouseReleased',
          md: 'mouseDragged',
          kp: 'keyPressed',
          ec: 'Effect Control',
          effectControl: 'Effect Control',
        };
        logMessage('recording', `${_j1440[type] || '📝'} Event recorded`, {
          Type: _j1441[type] || type,
          Time: `${_j1439.toFixed(0)}ms`,
          Position:
            type.includes('m') || type.includes('mouse')
              ? `(${data.x?.toFixed(0)}, ${data.y?.toFixed(0)})`
              : data.key || '',
          EffectControl: type === 'ec' || type === 'effectControl' ? `${data.action || 'Unknown'}` : undefined,
        });
      }
    }
    function startRecording() {
      isRecording = true;
      recordStartMillis = 0;
      lastStrokeEndMillis = 0;
      pausedAccum = 0;
      firstStrokePending = true;
      inkGray = 0;
      const recSeed = seed;
      const _j1443 = typeof uiGetActiveShapeType === 'function' ? uiGetActiveShapeType() : 0;
      const _j1444 = typeof $win.metallicStrength !== 'undefined' ? Math.round($win.metallicStrength * 100) : 85;
      const _j1445 =
        typeof $win.metallicFlowSpeed !== 'undefined' ? Math.round($win.metallicFlowSpeed * 100) : 200;
      const tint =
        typeof $win.metallicTint !== 'undefined' && Array.isArray($win.metallicTint)
          ? [...$win.metallicTint]
          : [0.72, 0.5, 0.35];
      const tintButtons = {
        gold: [0.88, 0.72, 0.52],
        silver: [0.75, 0.75, 0.75],
        copper: [0.72, 0.5, 0.35],
        rose: [0.88, 0.65, 0.7],
        black: [0.15, 0.12, 0.08],
        diamond: [0.95, 0.95, 1.0],
      };
      let _j1447 = 'copper';
      for (const [type, rgb] of Object.entries(tintButtons)) {
        if (
          Math.abs(tint[0] - rgb[0]) < 0.01 &&
          Math.abs(tint[1] - rgb[1]) < 0.01 &&
          Math.abs(tint[2] - rgb[2]) < 0.01
        ) {
          _j1447 = type;
          break;
        }
      }
      recordingData = {
        version: '1.0',
        engineVersion:
          typeof $win !== 'undefined' && typeof $win.__INKFIELD_ENGINE_VERSION__ === 'string'
            ? $win.__INKFIELD_ENGINE_VERSION__
            : 'dev',
        startTime: recordStartMillis,
        randomSeed: recSeed,
        initialPathToggle: pathToggle,
        initialWhiteBrushMode: whiteBrushMode,
        initialBrushColorMode: brushColorMode,
        canvasSize: {
          width: $p.width,
          height: $p.height,
        },
        canvasBackgroundColor:
          typeof canvasBackgroundColor !== 'undefined'
            ? [canvasBackgroundColor[0], canvasBackgroundColor[1], canvasBackgroundColor[2]]
            : [255, 255, 255],
        events: [],
        strokes: [],
        timeOffset: 0,
        initialEffectControl: {
          shapeType: _j1443,
          metallicStrength: _j1444,
          metallicFlow: _j1445,
          metallicTint: tint,
          metallicTintType: _j1447,
        },
      };
      $p.randomSeed(recSeed);
      $p.noiseSeed(recSeed);
      logTitle('🎬 Start Art Creation Recording');
      if (typeof uiUpdateRecordButtons === 'function') {
        uiUpdateRecordButtons();
      }
    }
    function stopRecording() {
      if (!isRecording) return;
      isRecording = false;
      $p.randomSeed(seed);
      $p.noiseSeed(seed);
      logTitle('✨ Art Creation Recording Complete');
      const lastEventT =
        recordingData.events.length > 0
          ? (recordingData.events[recordingData.events.length - 1].t ??
            recordingData.events[recordingData.events.length - 1].time ??
            0)
          : 0;
      recordingData.initialFlowEffect = {
        flowStrength: typeof flowParams !== 'undefined' ? flowParams.blendVol : 100,
        distortShaderEnabled: typeof distortShaderEnabled !== 'undefined' ? distortShaderEnabled : false,
        cellularEnabled: typeof cellularEnabled !== 'undefined' ? cellularEnabled : false,
        rsEnabled: typeof rsEnabled !== 'undefined' ? rsEnabled : false,
        whiteDotEnabled: typeof whiteDotEnabled !== 'undefined' ? whiteDotEnabled : false,
        grainEnabled: typeof grainEnabled !== 'undefined' ? grainEnabled : false,
        distortShowFbmMask: typeof distortShowFbmMask !== 'undefined' ? distortShowFbmMask : 0.0,
        distortDisplacementB: typeof distortDisplacementB !== 'undefined' ? distortDisplacementB : 20,
        distortDisplacementC: typeof distortDisplacementC !== 'undefined' ? distortDisplacementC : 100,
      };
      recordingData.initialPanelToggles = {
        showPaperTexture: typeof showPaperTexture !== 'undefined' ? showPaperTexture : false,
        showGridOverlay: typeof showGridOverlay !== 'undefined' ? showGridOverlay : true,
        showFuturePathPreview: typeof showFuturePathPreview !== 'undefined' ? showFuturePathPreview : false,
        screenText: typeof screenText !== 'undefined' ? screenText : false,
        doMoving: typeof doMoving !== 'undefined' ? doMoving : false,
        loopToggle: typeof $win.loopToggle !== 'undefined' ? $win.loopToggle : 0,
      };
      // [restored] the site downloaded recording-*.json and a PNG here; the engine hands the data to the host.
      $host.emit('recordingStopped', recordingData);
      if (typeof uiUpdateRecordButtons === 'function') {
        uiUpdateRecordButtons();
      }
    }
    function startPlayback() {
      if (
        $win._fxFastCapture &&
        typeof $win.$fx !== 'undefined' &&
        typeof $win.$fx.preview === 'function' &&
        !$win._fxPreviewTriggered
      ) {
        $win._fxPreviewTriggered = true;
        console.log('[fxhash] fast-capture: triggering $fx.preview() immediately (no GPU, 1s limit)');
        $win.$fx.preview();
        return;
      }
      $win.showStrokeDivider = true;
      if (recordingData.events.length === 0) {
        logMessage('system', '⚠️ No recording data to play', {
          Status: 'Error',
        });
        return;
      }
      if (isPlaying) {
        logMessage('system', '⚠️ Already playing', {
          Status: 'Warning',
        });
        return;
      }
      if (typeof sprayParticles !== 'undefined') {
        sprayParticles = [];
      }
      if (typeof sprayParticleCounter !== 'undefined') {
        sprayParticleCounter = 0;
      }
      if (
        recordingData.canvasBackgroundColor &&
        Array.isArray(recordingData.canvasBackgroundColor) &&
        recordingData.canvasBackgroundColor.length === 3
      ) {
        if (typeof canvasBackgroundColor !== 'undefined') {
          canvasBackgroundColor[0] = recordingData.canvasBackgroundColor[0];
          canvasBackgroundColor[1] = recordingData.canvasBackgroundColor[1];
          canvasBackgroundColor[2] = recordingData.canvasBackgroundColor[2];
        }
      }
      const _j1453 = $env.location.search || '';
      const _j1454 = (key) => _j1453.includes('_' + key + ':') || _j1453.includes('?' + key + ':');
      const _j1455 = [
        {
          jsonKey: 'showPaperTexture',
          setter: (v) => {
            showPaperTexture = v;
          },
          toggleId: 'paper-texture-toggle',
          defaultVal: false,
        },
        {
          jsonKey: 'showGridOverlay',
          setter: (v) => {
            showGridOverlay = v;
          },
          toggleId: 'grid-overlay-toggle',
          defaultVal: true,
        },
        {
          jsonKey: 'showFuturePathPreview',
          setter: (v) => {
            showFuturePathPreview = v;
          },
          toggleId: 'future-path-preview-toggle',
          defaultVal: false,
        },
        {
          jsonKey: 'screenText',
          setter: (v) => {
            screenText = v;
          },
          toggleId: 'screen-text-toggle',
          defaultVal: false,
        },
        {
          jsonKey: 'doMoving',
          setter: (v) => {
            doMoving = v;
          },
          toggleId: 'camera-moving-toggle',
          defaultVal: false,
        },
        {
          jsonKey: 'loopToggle',
          setter: (v) => {
            $win.loopToggle = v;
          },
          toggleId: 'loop-toggle',
          defaultVal: 0,
          isNumeric: true,
        },
      ];
      const _j1456 = {
        showPaperTexture: 'paper',
        showGridOverlay: 'grid',
        showFuturePathPreview: 'path',
        screenText: 'console',
        doMoving: 'camera',
        loopToggle: 'loop',
      };
      const panelToggles = recordingData.initialPanelToggles;
      for (const toggleCfg of _j1455) {
        const urlKey = _j1456[toggleCfg.jsonKey];
        if (urlKey && _j1454(urlKey)) continue;
        const value = panelToggles ? panelToggles[toggleCfg.jsonKey] : undefined;
        const toggleValue = value !== undefined ? value : toggleCfg.defaultVal;
        toggleCfg.setter(toggleValue);
        const toggleEl = $doc.getElementById(toggleCfg.toggleId);
        if (toggleEl) {
          toggleEl.checked = toggleCfg.isNumeric ? toggleValue === 1 : !!toggleValue;
        }
      }
      const _j1461 = recordingData.events.filter((e) => e.m === 'mp').length;
      const _j1462 = recordingData.events.filter((e) => e.m === 'md').length;
      if ($win.skipClearCanvasOnNextPlayback) {
        $win.skipClearCanvasOnNextPlayback = false;
        console.log('[append] ✅ skip clearCanvas, overlay playback', {
          mp: _j1461,
          md: _j1462,
          totalEvents: recordingData.events.length,
        });
      } else {
        console.log('[startPlayback] ❌ standard mode, will clear canvas', {
          mp: _j1461,
          md: _j1462,
          totalEvents: recordingData.events.length,
        });
        clearCanvas();
        if (typeof clearMask === 'function') clearMask();
      }
      if (
        recordingData.canvasBackgroundColor &&
        Array.isArray(recordingData.canvasBackgroundColor) &&
        recordingData.canvasBackgroundColor.length === 3
      ) {
        if (typeof plainBgBuffer !== 'undefined' && plainBgBuffer) {
          plainBgBuffer.begin();
          $p.background(canvasBackgroundColor[0], canvasBackgroundColor[1], canvasBackgroundColor[2]);
          plainBgBuffer.end();
        }
        if (typeof regeneratePaperTexture === 'function') {
          regeneratePaperTexture();
        }
        if (typeof compositeDirty !== 'undefined') {
          compositeDirty = true;
        }
        if (typeof uiSyncBackgroundColor === 'function') {
          uiSyncBackgroundColor();
        }
        logMessage('playback', '🎨 Background color restored', {
          RGB: `(${recordingData.canvasBackgroundColor[0]}, ${recordingData.canvasBackgroundColor[1]}, ${recordingData.canvasBackgroundColor[2]})`,
        });
      }
      if (recordingData.randomSeed) {
        $p.randomSeed(recordingData.randomSeed);
        $p.noiseSeed(recordingData.randomSeed);
        if (typeof $win.boidsSeed !== 'undefined') {
          $win.boidsSeed = $p.floor($win.crandom.random(1, 10000));
        }
        logMessage('playback', 'Random seed reset', {
          Seed: recordingData.randomSeed,
        });
      } else {
        logMessage('system', '⚠️ No seed info in recording, playback may be inaccurate', {
          Status: 'Warning',
        });
      }
      isPlaying = true;
      playbackStartMillis = $clock();
      if ($win._fxContext) {
        $win._fxVirtualTime = 0;
      }
      playbackEventIndex = 0;
      $win.playbackLastStrokeEndTime = 0;
      $win.playbackLastStrokeEndEventTime = 0;
      if (typeof totalStrokeCount !== 'undefined') {
        totalStrokeCount = 0;
      }
      $win.playbackStrokeIndex = 0;
      $win.playbackLastStrokeBrushMode = undefined;
      if (typeof camStrokeCounter !== 'undefined') {
        camStrokeCounter = 0;
      }
      playMouseDown = false;
      playX = hw;
      playY = hh;
      playPrevX = hw;
      playPrevY = hh;
      feedbackFrame = 0;
      if (typeof blurNeedsRegen !== 'undefined') {
        blurNeedsRegen = false;
      }
      if (typeof pathPoints !== 'undefined') {
        pathPoints = [];
      }
      if (typeof lastStrokeBounds !== 'undefined') {
        lastStrokeBounds = null;
      }
      if (typeof collectPathPoints !== 'undefined') {
        collectPathPoints = false;
      }
      if (typeof allBrushStrokes !== 'undefined') {
        allBrushStrokes = [];
      }
      if (typeof pendingBugBounds !== 'undefined') {
        pendingBugBounds = null;
      }
      if (typeof bugPoints !== 'undefined') {
        bugPoints = [];
      }
      if (typeof $win !== 'undefined') {
        $win.bugsDataTextureCache = null;
        $win.bugsMaskTextureCache = null;
      }
      if (typeof layerBlurTarget !== 'undefined') {
        layerBlurTarget = {
          0: 0,
          40: 0,
          80: 0,
          120: 0,
        };
      }
      if (typeof layerBlur !== 'undefined') {
        layerBlur = {
          0: 0,
          40: 0,
          80: 0,
          120: 0,
        };
      }
      inkGray = 0;
      countdownPauseStart = 0;
      countdownPausing = false;
      if (recordingData.initialPathToggle !== undefined) {
        pathToggle = recordingData.initialPathToggle;
        logMessage('playback', 'Path toggle restored', {
          Status: pathToggle ? 'ON ✅' : 'OFF ❌',
        });
      }
      if (recordingData.initialBrushColorMode !== undefined) {
        brushColorMode = recordingData.initialBrushColorMode;
        whiteBrushMode = brushColorMode === 1;
        const colorLabels = ['Black ⚫', 'White ⚪', 'Red 🔴'];
        logMessage('playback', 'Brush color restored', {
          Mode: colorLabels[brushColorMode] || 'Unknown',
        });
      } else if (recordingData.initialWhiteBrushMode !== undefined) {
        whiteBrushMode = recordingData.initialWhiteBrushMode;
        brushColorMode = whiteBrushMode ? 1 : 0;
        logMessage('playback', 'Brush color restored (legacy)', {
          Mode: whiteBrushMode ? 'White ⚪' : 'Black ⚫',
        });
      } else {
        whiteBrushMode = false;
        brushColorMode = 0;
      }
      logTitle('🎭 Start Art Reproduction');
      if (typeof $win !== 'undefined') {
        $win._scanGlobalPlaybackCount = 0;
        $win._scanCurrentPlaybackCount = 0;
      }
      if (recordingData.initialEffectControl) {
        const ec = recordingData.initialEffectControl;
        if (ec.shapeType !== undefined) {
          if (typeof uiSetActiveShapeType === 'function') {
            uiSetActiveShapeType(ec.shapeType);
          }
        }
        if (ec.metallicStrength !== undefined) {
          if (typeof $win !== 'undefined') {
            $win.metallicStrength = ec.metallicStrength / 100;
          }
          const metallicStrengthEl = $doc.getElementById('metallic-strength');
          const metallicStrengthValueEl = $doc.getElementById('metallic-strength-value');
          if (metallicStrengthEl && metallicStrengthValueEl) {
            metallicStrengthEl.value = ec.metallicStrength;
            metallicStrengthValueEl.textContent = ec.metallicStrength;
          }
        }
        if (ec.metallicFlow !== undefined) {
          if (typeof $win !== 'undefined') {
            $win.metallicFlowSpeed = ec.metallicFlow / 100;
          }
          const metallicFlowEl = $doc.getElementById('metallic-flow');
          const metallicFlowValueEl = $doc.getElementById('metallic-flow-value');
          if (metallicFlowEl && metallicFlowValueEl) {
            metallicFlowEl.value = ec.metallicFlow;
            metallicFlowValueEl.textContent = ec.metallicFlow;
          }
        }
        if (ec.metallicTintType !== undefined) {
          const tintButtons = {
            gold: [0.88, 0.72, 0.52],
            silver: [0.75, 0.75, 0.75],
            copper: [0.72, 0.5, 0.35],
            rose: [0.88, 0.65, 0.7],
            black: [0.15, 0.12, 0.08],
            diamond: [0.95, 0.95, 1.0],
          };
          if (tintButtons[ec.metallicTintType]) {
            if (typeof $win !== 'undefined') {
              $win.metallicTint = [...tintButtons[ec.metallicTintType]];
            }
            const _j1463 = `metal-${ec.metallicTintType}`;
            const btn = $doc.getElementById(_j1463);
            if (btn) {
              $doc.querySelectorAll('.metal-tint-btn').forEach((b) => b.classList.remove('active'));
              btn.classList.add('active');
            }
          }
        }
        logMessage('playback', '✨ Effect Control restored', {
          ShapeType: ec.shapeType !== undefined ? ec.shapeType : 'Unknown',
          Strength: ec.metallicStrength !== undefined ? ec.metallicStrength : 'Unknown',
          Flow: ec.metallicFlow !== undefined ? ec.metallicFlow : 'Unknown',
          Tint: ec.metallicTintType || 'Unknown',
        });
      }
      const _j1464 = [
        {
          jsonKey: 'distortShaderEnabled',
          setter: (v) => {
            distortShaderEnabled = v;
          },
          toggleId: 'distort-shader-toggle',
          urlKey: 'distort',
          slidersId: 'distort-sliders-section',
        },
        {
          jsonKey: 'cellularEnabled',
          setter: (v) => {
            cellularEnabled = v;
          },
          toggleId: 'cellular-toggle',
          urlKey: 'cl',
          slidersId: 'cellular-sliders-section',
        },
        {
          jsonKey: 'rsEnabled',
          setter: (v) => {
            rsEnabled = v;
          },
          toggleId: 'rs-toggle',
          urlKey: 'rs',
          slidersId: 'rs-sliders-section',
        },
        {
          jsonKey: 'whiteDotEnabled',
          setter: (v) => {
            whiteDotEnabled = v;
          },
          toggleId: 'white-dot-toggle',
          urlKey: 'wd',
          slidersId: 'white-dot-sliders-section',
        },
        {
          jsonKey: 'grainEnabled',
          setter: (v) => {
            grainEnabled = v;
          },
          toggleId: 'grain-toggle',
          urlKey: 'gr',
          slidersId: 'grain-sliders-section',
        },
      ];
      const _j1465 = $env.location.search || '';
      const _j1466 = (key) => _j1465.includes('_' + key + ':') || _j1465.includes('?' + key + ':');
      for (const toggleCfg of _j1464) {
        if (_j1466(toggleCfg.urlKey)) continue;
        toggleCfg.setter(false);
        const toggleEl = $doc.getElementById(toggleCfg.toggleId);
        if (toggleEl) {
          toggleEl.checked = false;
        }
        const slidersEl = $doc.getElementById(toggleCfg.slidersId);
        if (slidersEl) {
          slidersEl.style.display = 'none';
        }
      }
      if (typeof distortShowFbmMask !== 'undefined') {
        distortShowFbmMask = 0.0;
        const distortFbmPreviewToggleEl = $doc.getElementById('distort-fbm-preview-toggle');
        if (distortFbmPreviewToggleEl) distortFbmPreviewToggleEl.checked = false;
      }
      if (recordingData.initialFlowEffect) {
        const fe = recordingData.initialFlowEffect;
        const _j1469 = {
          isDistortShader: 'distortShaderEnabled',
          isCellular: 'cellularEnabled',
          isRS: 'rsEnabled',
          isWhiteDot: 'whiteDotEnabled',
          isGrain: 'grainEnabled',
        };
        for (const [oldKey, newKey] of Object.entries(_j1469)) {
          if (fe[oldKey] !== undefined && fe[newKey] === undefined) {
            fe[newKey] = fe[oldKey];
            logMessage('playback', `🔄 Legacy key ${oldKey} → ${newKey}`, {});
          }
        }
        if (fe.flowStrength !== undefined && typeof flowParams !== 'undefined') {
          flowParams.blendVol = fe.flowStrength;
          const flowStrengthEl = $doc.getElementById('flow-strength');
          const flowStrengthValueEl = $doc.getElementById('flow-strength-value');
          if (flowStrengthEl) flowStrengthEl.value = fe.flowStrength;
          if (flowStrengthValueEl) flowStrengthValueEl.textContent = fe.flowStrength;
        }
        for (const toggleCfg of _j1464) {
          const value = fe[toggleCfg.jsonKey];
          if (value === undefined) continue;
          if (_j1466(toggleCfg.urlKey)) {
            logMessage('playback', `⏭️ Flow Effect: ${toggleCfg.jsonKey} skipped (URL override)`, {});
            continue;
          }
          toggleCfg.setter(!!value);
          const toggleEl = $doc.getElementById(toggleCfg.toggleId);
          if (toggleEl) {
            toggleEl.checked = !!value;
          }
          const slidersEl = $doc.getElementById(toggleCfg.slidersId);
          if (slidersEl) {
            slidersEl.style.display = value ? 'flex' : 'none';
          }
        }
        if (fe.distortShowFbmMask !== undefined) {
          distortShowFbmMask = fe.distortShowFbmMask;
          const distortFbmPreviewToggleEl = $doc.getElementById('distort-fbm-preview-toggle');
          if (distortFbmPreviewToggleEl) distortFbmPreviewToggleEl.checked = fe.distortShowFbmMask > 0.5;
        }
        if (fe.distortDisplacementB !== undefined) {
          distortDisplacementB = fe.distortDisplacementB;
          const distortDisplacementBEl = $doc.getElementById('distort-displacement-b');
          const distortDisplacementBValueEl = $doc.getElementById('distort-displacement-b-value');
          if (distortDisplacementBEl) distortDisplacementBEl.value = fe.distortDisplacementB;
          if (distortDisplacementBValueEl) distortDisplacementBValueEl.textContent = fe.distortDisplacementB;
        }
        if (fe.distortDisplacementC !== undefined) {
          distortDisplacementC = fe.distortDisplacementC;
          const distortDisplacementCEl = $doc.getElementById('distort-displacement-c');
          const distortDisplacementCValueEl = $doc.getElementById('distort-displacement-c-value');
          if (distortDisplacementCEl) distortDisplacementCEl.value = fe.distortDisplacementC;
          if (distortDisplacementCValueEl) distortDisplacementCValueEl.textContent = fe.distortDisplacementC;
        }
        logMessage('playback', '✨ Flow Effect restored', {
          Strength: fe.flowStrength,
          Distort: !!fe.distortShaderEnabled ? 'ON' : 'OFF',
          Cellular: !!fe.cellularEnabled ? 'ON' : 'OFF',
          RS: !!fe.rsEnabled ? 'ON' : 'OFF',
          WhiteDot: !!fe.whiteDotEnabled ? 'ON' : 'OFF',
          Grain: !!fe.grainEnabled ? 'ON' : 'OFF',
        });
      } else {
        logMessage('playback', '🔄 Flow Effect: reset to defaults (no initialFlowEffect in JSON)', {});
      }
      if (panelToggles) {
        logMessage('playback', '✨ Panel toggles restored', {
          Paper: panelToggles.showPaperTexture ? 'ON' : 'OFF',
          Grid: panelToggles.showGridOverlay ? 'ON' : 'OFF',
          Path: panelToggles.showFuturePathPreview ? 'ON' : 'OFF',
          Console: panelToggles.screenText ? 'ON' : 'OFF',
          Camera: panelToggles.doMoving ? 'ON' : 'OFF',
          Loop: panelToggles.loopToggle === 1 ? 'ON' : 'OFF',
        });
      } else {
        logMessage('playback', '🔄 Panel toggles: reset to defaults (no initialPanelToggles in JSON)', {});
      }
      randomizeForceMap();
      primeFeedback();
      const firstEvent = recordingData.events[0];
      if (firstEvent && firstEvent.strokeData) {
        const strokeData = firstEvent.strokeData;
        brushSize = strokeData.initialSize || 20;
        initialSize = strokeData.initialSize || 20;
        size = brushSize;
        nowSize = size;
      }
      runFeedbackPass(newBufferBlack, 1.0);
      if (typeof doMoving !== 'undefined' && doMoving) {
        if (typeof easycamEnabled === 'undefined' || !easycamEnabled) {
          easycamEnabled = true;
        }
        easycamTracking = true;
        if (easycamEnabled && easycam !== null) {
          easycamInitialCenter = [0, 0, 0];
          const fov = Math.PI / 3;
          easycamInitialDistance = $p.height / (2 * Math.tan(fov / 2));
          easycam.setAutoUpdate(true);
          if (typeof easycam.setPanScale === 'function') {
            easycam.setPanScale(0);
          }
          if (typeof easycam.setZoomScale === 'function') {
            easycam.setZoomScale(0);
          }
          easycam.setCenter([0, 0, 0], 0);
          easycam.setDistance(easycamInitialDistance, 0);
          if (typeof camZoomLevel !== 'undefined') {
            camZoomLevel = 1;
          }
          logMessage('system', '🎥 EasyCam ready', {
            Status: 'Auto-tracking enabled',
            Controls: 'Camera automatically follows grid center',
          });
        }
      } else {
        easycamTracking = false;
        easycamEnabled = false;
      }
      if (typeof uiUpdateRecordButtons === 'function') {
        uiUpdateRecordButtons();
      }
    }
    function stopPlayback() {
      if (!isPlaying) return;
      isPlaying = false;
      playMouseDown = false;
      playbackEventIndex = 0;
      isWaitingToLoop = false;
      countdownPauseStart = 0;
      countdownPausing = false;
      $p.randomSeed(seed);
      $p.noiseSeed(seed);
      logTitle('⏹️ Playback Ended');
      afterPlaybackEnded();
      easycamTracking = false;
      if (easycamEnabled && easycam !== null) {
        try {
          const homeCenter =
            typeof easycamInitialCenter !== 'undefined' && easycamInitialCenter
              ? easycamInitialCenter
              : [0, 0, 0];
          const homeDist =
            typeof easycamInitialDistance !== 'undefined' && easycamInitialDistance > 0
              ? easycamInitialDistance
              : Math.max($p.width, $p.height) * 1.0;
          const camCenter = easycam.getCenter();
          const camDist = easycam.getDistance();
          logMessage('system', '📊 Playback complete - Camera position logged', {
            Current: `Center: [${camCenter[0].toFixed(2)}, ${camCenter[1].toFixed(2)}, ${camCenter[2].toFixed(2)}], Distance: ${camDist.toFixed(2)}`,
            Target: `Center: [${homeCenter[0].toFixed(2)}, ${homeCenter[1].toFixed(2)}, ${homeCenter[2].toFixed(2)}], Distance: ${homeDist.toFixed(2)}`,
          });
          camResetting = true;
          camResetStart = $clock();
          camResetFromCenter = [camCenter[0], camCenter[1], camCenter[2]];
          camResetFromDist = camDist;
          camResetToCenter = homeCenter;
          camResetToDist = homeDist;
          setTimeout(() => {
            if (easycam !== null) {
              easycam.setAutoUpdate(false);
              const curCenter = easycam.getCenter();
              const curDist = easycam.getDistance();
              const _j434 = 0.1;
              const _j435 = 1.0;
              const centerDiff = Math.sqrt(
                Math.pow(curCenter[0] - homeCenter[0], 2) +
                  Math.pow(curCenter[1] - homeCenter[1], 2) +
                  Math.pow(curCenter[2] - homeCenter[2], 2),
              );
              const distanceDiff = Math.abs(curDist - homeDist);
              logMessage('system', '📊 After 2s animation - Camera position logged', {
                Final: `Center: [${curCenter[0].toFixed(2)}, ${curCenter[1].toFixed(2)}, ${curCenter[2].toFixed(2)}], Distance: ${curDist.toFixed(2)}`,
                Target: `Center: [${homeCenter[0].toFixed(2)}, ${homeCenter[1].toFixed(2)}, ${homeCenter[2].toFixed(2)}], Distance: ${homeDist.toFixed(2)}`,
                Diff: `Center: ${centerDiff.toFixed(3)}, Distance: ${distanceDiff.toFixed(3)}`,
                Status: centerDiff <= _j434 && distanceDiff <= _j435 ? '✅ At target' : '❌ Not at target',
              });
              if (centerDiff > _j434 || distanceDiff > _j435) {
                console.warn('⚠️ Camera not at initial position after 2s, forcing reset:', {
                  centerDiff: centerDiff.toFixed(3),
                  distanceDiff: distanceDiff.toFixed(3),
                  beforeReset: {
                    center: `[${curCenter[0].toFixed(3)}, ${curCenter[1].toFixed(3)}, ${curCenter[2].toFixed(3)}]`,
                    distance: curDist.toFixed(3),
                  },
                });
                easycam.setCenter(homeCenter, 0);
                easycam.setDistance(homeDist, 0);
                const _j1477 = easycam.getCenter();
                const _j1478 = easycam.getDistance();
                logMessage('system', '📊 After force reset - Camera position logged', {
                  Center: `[${_j1477[0].toFixed(2)}, ${_j1477[1].toFixed(2)}, ${_j1477[2].toFixed(2)}]`,
                  Distance: _j1478.toFixed(2),
                });
              }
              camResetting = false;
            }
            easycamEnabled = false;
          }, 2100);
          logMessage('system', '🎥 EasyCam disabled', {
            Status: 'Playback stopped, camera reset and disabled',
            Center: homeCenter,
            Distance: homeDist.toFixed(2),
          });
        } catch (error) {
          console.warn('⚠️ EasyCam cleanup error:', error);
          easycamEnabled = false;
        }
      } else {
        easycamEnabled = false;
      }
      if (typeof uiUpdateRecordButtons === 'function') {
        uiUpdateRecordButtons();
      }
      try {
        $win.dispatchEvent(
          new CustomEvent('inkfield:playbackEnded', {
            detail: {
              strokeCount: recordingData && recordingData.events ? recordingData.events.length : 0,
            },
          }),
        );
      } catch (e) {}
    }
    function dispatchPlaybackEvent(event) {
      const evtType = event.m || event.type;
      switch (evtType) {
        case 'mp':
        case 'mousePressed':
          $win.crandom.reset();
          $win.crandomDebugger.resetStroke();
          $win.drawLoopCount = 0;
          $win.playbackMouseDraggedCount = 0;
          $win.playbackMultiEventFrames = 0;
          $win.playbackDelayedReleaseCount = 0;
          $win.crandomDebugger.checkpoint('playback_mousePressed_start', 'mousePressed');
          const _j1479 = isReleasing;
          const _j1480 = event.t !== undefined ? event.t : event.time;
          if (isReleasing) {
            const _j778 = playbackStartMillis;
            if ($win._fxVirtualTime === undefined) {
              playbackStartMillis = $clock() - _j1480 / playbackSpeed;
            }
            const _j1481 = _j778 - playbackStartMillis;
            const _j777 =
              typeof countdownPauseStart !== 'undefined' && countdownPauseStart > 0
                ? $clock() - countdownPauseStart
                : 0;
            if (typeof countdownPausing !== 'undefined') {
              countdownPausing = false;
            }
            if (typeof countdownPauseStart !== 'undefined') {
              countdownPauseStart = 0;
            }
            commitStroke();
            isReleasing = false;
            countdownFrame = 0;
          }
          if (
            typeof $win.playbackLastStrokeEndEventTime !== 'undefined' &&
            $win.playbackLastStrokeEndEventTime > 0
          ) {
            const _j1482 = _j1480 - $win.playbackLastStrokeEndEventTime;
            const _j1483 = event.strokeData ? event.strokeData.brushMode : brushMode;
            const _j1484 =
              typeof $win.playbackLastStrokeBrushMode !== 'undefined'
                ? $win.playbackLastStrokeBrushMode
                : 'unknown';
          }
          commitIfPending();
          if (typeof sprayParticles !== 'undefined') {
            sprayParticles = [];
          }
          if (typeof sprayParticleCounter !== 'undefined') {
            sprayParticleCounter = 0;
          }
          if (typeof camStrokeCounter !== 'undefined') {
            camStrokeCounter++;
            if (typeof camZoomIn !== 'undefined' && typeof camZoomStrokeMark !== 'undefined') {
              camZoomIn = $p.random(0, 1) > 0.7;
              camZoomStrokeMark = camStrokeCounter;
            }
          }
          playX = event.x + (typeof playbackOffsetX !== 'undefined' ? playbackOffsetX : 0);
          playY = event.y + (typeof playbackOffsetY !== 'undefined' ? playbackOffsetY : 0);
          playPrevX = playX;
          playPrevY = playY;
          if (false) {
            playMouseDown = true;
          } else {
            playMouseDown = false;
          }
          if (typeof blurNeedsRegen !== 'undefined') {
            blurNeedsRegen = true;
          }
          if (event.strokeData) {
            const sd = event.strokeData;
            if (typeof $win.playbackLastStrokeBrushMode !== 'undefined') {
              $win.playbackLastStrokeBrushMode = sd.brushMode;
            }
            if (sd.strokeSeed) {
              strokeSeed = sd.strokeSeed;
              $p.randomSeed(sd.strokeSeed);
              $p.noiseSeed(sd.strokeSeed);
              if (sd.mouseCountStart !== undefined) {
                mouseCountStart = sd.mouseCountStart;
              } else {
                mouseCountStart = 0;
              }
              strokeFrame = 0;
              const offsetX = typeof playbackOffsetX !== 'undefined' ? playbackOffsetX : 0;
              const offsetY = typeof playbackOffsetY !== 'undefined' ? playbackOffsetY : 0;
              const _j1485 = event.x + offsetX;
              const _j1486 = event.y + offsetY;
              logMessage('playback', 'Reproducing', {
                Seed: sd.strokeSeed,
                Mode: `Brush mode ${sd.brushMode}`,
                Color: whiteBrushMode ? 'White ⚪' : 'Black ⚫',
                Position: `(${_j1485.toFixed(0)}, ${_j1486.toFixed(0)})`,
              });
              logMessage('system', '|--------------------------------', {});
            } else {
              logMessage('system', '⚠️ Warning: No strokeSeed found!', {
                Status: 'Error',
              });
              strokeFrame = 0;
            }
            inkGray = 0;
            springInitialized = 0;
            x = playX;
            y = playY;
            velX = 0;
            velY = 0;
            speed = 0;
            lineWidth = 0;
            smoothedWidth = 0;
            feedbackFrame = 0;
            countdownFrame = 0;
            isReleasing = false;
            if (sd.brushModeSP !== undefined) {
              brushModeSP = sd.brushModeSP;
            }
            if (typeof sprayParticles !== 'undefined') {
              sprayParticles = [];
            }
            if (typeof prevTipX !== 'undefined') {
              prevTipX = playX;
              prevTipY = playY;
            }
            colorIndex = sd.colorIndex;
            shapeType = sd.shapeType;
            useSharpen = sd.useSharpen;
            brushMode = sd.brushMode;
            if (sd.brushColorMode !== undefined) {
              brushColorMode = sd.brushColorMode;
              whiteBrushMode = brushColorMode === 1;
            } else {
              whiteBrushMode = sd.whiteBrushMode !== undefined ? sd.whiteBrushMode : false;
              brushColorMode = whiteBrushMode ? 1 : 0;
            }
            if (
              sd.customBrushColor &&
              Array.isArray(sd.customBrushColor) &&
              sd.customBrushColor.length >= 3 &&
              typeof customBrushColor !== 'undefined'
            ) {
              customBrushColor[0] = sd.customBrushColor[0];
              customBrushColor[1] = sd.customBrushColor[1];
              customBrushColor[2] = sd.customBrushColor[2];
            }
            phasorVel = sd.phasorVel !== undefined ? sd.phasorVel : 0;
            explodeStart = sd.explodeStart !== undefined ? sd.explodeStart : 0;
            explodeEnd = sd.explodeEnd !== undefined ? sd.explodeEnd : 0;
            targetflyBrushType = sd.targetflyBrushType !== undefined ? sd.targetflyBrushType : 0;
            targetmainStrokeDir = sd.targetmainStrokeDir !== undefined ? sd.targetmainStrokeDir : 0;
            brushDir = sd.brushDir !== undefined ? sd.brushDir : 0;
            ctlNoise = sd.ctlNoise !== undefined ? sd.ctlNoise : 1.0;
            if (sd.brushMode === 4) {
              penSketchNoiseBase = sd.penSketchNoiseBase !== undefined ? sd.penSketchNoiseBase : 0.5;
              penSketchStrokeWeight = sd.penSketchStrokeWeight !== undefined ? sd.penSketchStrokeWeight : 0.8;
            }
            brushPaintCtlNoisebyFrame =
              sd.brushPaintCtlNoisebyFrame !== undefined ? sd.brushPaintCtlNoisebyFrame : 0.5;
            brushPaintInterpolationOffset =
              sd.brushPaintInterpolationOffset !== undefined ? sd.brushPaintInterpolationOffset : 0;
            brushPaintOldRInitial = sd.brushPaintOldRInitial !== undefined ? sd.brushPaintOldRInitial : 0.5;
            initialSize = sd.initialSize !== undefined ? sd.initialSize : sd.baseBrushSize || 20;
            spraySize = sd.spraySize !== undefined ? sd.spraySize : 10;
            interpSteps = sd.step !== undefined ? sd.step : 4;
            step2 = sd.step2 !== undefined ? sd.step2 : 2;
            randStep = sd.randStep !== undefined ? sd.randStep : 0;
            maxUpdates = sd.maxUpdates !== undefined ? sd.maxUpdates : 30;
            pathRotation = sd.pathRotation !== undefined ? sd.pathRotation : 0;
            spring = sd.spring !== undefined ? sd.spring : 0.6;
            friction = sd.friction !== undefined ? sd.friction : 0.5;
            baseBrushSize = sd.baseBrushSize || 1.0;
            if (pressureEnabled) {
              pressureBaseBrushSize = baseBrushSize;
              $win._strokeStartBaseBrushSize = baseBrushSize;
            }
            if (sd.expectedStrokeLength !== undefined) {
              expectedStrokeLength = sd.expectedStrokeLength;
            } else {
              if (brushMode === 3) {
                expectedStrokeLength = 100;
              } else {
                expectedStrokeLength = 100;
              }
            }
            if (sd.effect3Brightness !== undefined) {
              effect3Brightness = sd.effect3Brightness;
            } else {
              effect3Brightness = 0.7;
            }
            if (sd.indiffusionStrength !== undefined) {
              indiffusionStrength = sd.indiffusionStrength;
            } else {
              indiffusionStrength = 0.3;
            }
            if (sd.whiteMaxOpacity !== undefined) {
              whiteMaxOpacity = sd.whiteMaxOpacity;
            } else {
              whiteMaxOpacity = 0.95;
            }
            if (sd.hueShift !== undefined) {
              hueShift = sd.hueShift;
            } else {
              hueShift = 0.0;
            }
            if (sd.satShift !== undefined) {
              satShift = sd.satShift;
            } else {
              satShift = 0.0;
            }
            if (sd.briShift !== undefined) {
              briShift = sd.briShift;
            } else {
              briShift = 0.0;
            }
            if (sd.keyBlendMode !== undefined) {
              keyBlendMode = sd.keyBlendMode;
            } else {
              keyBlendMode = 0;
            }
            if (sd.useSpectralMix !== undefined) {
              useSpectralMix = sd.useSpectralMix;
            } else {
              useSpectralMix = false;
            }
            if (sd.maskData) {
              currentMaskData = sd.maskData;
              if (sd.maskData.action === 'rect') {
                drawMaskRect(sd.maskData.x1, sd.maskData.y1, sd.maskData.x2, sd.maskData.y2);
              } else if (sd.maskData.action === 'polygon') {
                drawMaskPolygon(sd.maskData.points);
              }
            } else {
              currentMaskData = null;
              if (maskActive) clearMask();
            }
            if (brushMode === 4) {
            }
            if (brushColorMode > 1) {
            } else if (brushColorMode === 1) {
            }
            if (sd.forceMapParams) {
              const fm = sd.forceMapParams;
              fmRandomSeeds[0] = fm.randomSeed1;
              fmRandomSeeds[1] = fm.randomSeed2;
              fmRandomSeeds[2] = fm.randomSeed3;
              fmRandomSeeds[3] = fm.randomSeed4;
              fmScales[0] = fm.scale1;
              fmScales[1] = fm.scale2;
              fmScales[2] = fm.scale3;
              fmAmplitudes[0] = fm.amplitude1;
              fmAmplitudes[1] = fm.amplitude2;
              fmAmplitudes[2] = fm.amplitude3;
              fmPhases[0] = fm.phase1;
              fmPhases[1] = fm.phase2;
              fmPhases[2] = fm.phase3;
              fmVortexScales[0] = fm.vortexScale1;
              fmVortexScales[1] = fm.vortexScale2;
              fmClusterScales[0] = fm.clusterScale1;
              fmClusterScales[1] = fm.clusterScale2;
              updateForceMap();
            } else {
              if (typeof randomizeForceMap === 'function') {
                randomizeForceMap();
              }
            }
            if (sd.drawingSeed) {
              drawingSeed = sd.drawingSeed;
              $p.randomSeed(sd.drawingSeed);
              $p.noiseSeed(sd.drawingSeed);
            } else {
            }
          }
          brushSize = initialSize;
          sizeNow = brushSize;
          strokeWidth = sizeNow;
          springInitialized = 0;
          x = playX;
          y = playY;
          velX = 0;
          velY = 0;
          speed = 0;
          lineWidth = 0;
          smoothedWidth = 0;
          isDrawing = true;
          isReleasing = false;
          countdownFrame = 0;
          strokeActive = true;
          strokeCommitted = false;
          feedbackFrame = 0;
          startX = playX;
          startY = playY;
          pathPoints = [
            {
              x: playX,
              y: playY,
            },
          ];
          collectPathPoints = true;
          playMouseDown = true;
          if (pressureEnabled) $win._playbackPenPressure = -1;
          runFeedbackPass(newBufferBlack, 1.0);
          $win.crandomDebugger.checkpoint('playback_mousePressed_end', 'mousePressed');
          break;
        case 'md':
        case 'mouseDragged':
          if (typeof $win.playbackMouseDraggedCount !== 'undefined') {
            $win.playbackMouseDraggedCount++;
          }
          playX = event.x + (typeof playbackOffsetX !== 'undefined' ? playbackOffsetX : 0);
          playY = event.y + (typeof playbackOffsetY !== 'undefined' ? playbackOffsetY : 0);
          if (pressureEnabled && event.p !== undefined) {
            $win._playbackPenPressure = event.p;
          }
          break;
        case 'mr':
        case 'mouseReleased':
          if (pressureEnabled) $win._playbackPenPressure = -1;
          const _j823 = $win.crandom.getCount();
          const _j1487 = event.t !== undefined ? event.t : event.time;
          if (typeof $win.playbackLastStrokeEndTime !== 'undefined') {
            $win.playbackLastStrokeEndTime = $clock();
          }
          if (typeof $win.playbackLastStrokeEndEventTime !== 'undefined') {
            $win.playbackLastStrokeEndEventTime = _j1487;
          }
          if (typeof $win.playbackStrokeIndex !== 'undefined') {
            $win.playbackStrokeIndex++;
          }
          $win.crandomDebugger.checkpoint('playback_mouseReleased', 'mouseReleased');
          const _j1488 = $win.crandom.getCount();
          const _j828 = _j1488 - _j823;
          const strokeIdxLabel = typeof $win.playbackStrokeIndex !== 'undefined' ? $win.playbackStrokeIndex : '?';
          const _j860 =
            recordingData && recordingData.events
              ? recordingData.events.filter((e) => {
                  const evtType_ = e.m || e.type;
                  return evtType_ === 'mr' || evtType_ === 'mouseReleased';
                }).length
              : '?';
          const _j829 = $win.drawLoopCount || 0;
          const _j1490 = $win.playbackMouseDraggedCount || 0;
          console.log(`🎬 playback [stroke ${strokeIdxLabel}/${_j860}] | Draw: ${_j829} | Seed: ${_j1488}`);
          $win.drawLoopCount = 0;
          $win.playbackMouseDraggedCount = 0;
          $win.playbackMultiEventFrames = 0;
          $win.playbackDelayedReleaseCount = 0;
          $win.crandomDebugger.saveStroke('playback', strokeIdxLabel);
          $win.crandomDebugger.compareStroke(strokeIdxLabel);
          playX = event.x + (typeof playbackOffsetX !== 'undefined' ? playbackOffsetX : 0);
          playY = event.y + (typeof playbackOffsetY !== 'undefined' ? playbackOffsetY : 0);
          playMouseDown = false;
          if (!isReleasing) {
            isReleasing = true;
            countdownFrame = 0;
            if (typeof countdownPauseStart !== 'undefined') {
              countdownPauseStart = $clock();
            }
            if (typeof countdownPausing !== 'undefined') {
              countdownPausing = true;
            }
            logMessage('playback', 'Starting countdown', {
              MaxUpdates: maxUpdates,
            });
          }
          logMessage('playback', 'Stroke reproduction complete', {
            FinalSize: brushSize.toFixed(2),
            CountdownStatus: isReleasing ? 'In progress' : 'Not started',
          });
          break;
        case 'md':
        case 'mouseDragged':
          if (!playMouseDown) {
            playMouseDown = true;
          } else {
            playPrevX = playX;
            playPrevY = playY;
          }
          playX = event.x + (typeof playbackOffsetX !== 'undefined' ? playbackOffsetX : 0);
          playY = event.y + (typeof playbackOffsetY !== 'undefined' ? playbackOffsetY : 0);
          break;
        case 'kp':
        case 'keyPressed':
          const k = event.key;
          if (k === ' ') {
          } else if (k === '1' || k === 'ㄅ') {
            brushMode = 1;
          } else if (k === '2' || k === 'ㄉ') {
            brushMode = 2;
          } else if (k === '3' || k === 'ˇ') {
            brushMode = 3;
          } else if (k === '4') {
            brushMode = 4;
          } else if (k === 'r' || k === 'R') {
            useSharpen = 3;
            uiSyncAllBrushButtons();
            logMessage('playback', '⌨️ Simulate key: R', {
              Effect: 'Wet Ink',
            });
          } else if (k === 'p' || k === 'P') {
          } else if (k === 'o' || k === 'O') {
            logMessage('playback', '⌨️ Simulate key: O', {
              'Loop toggle': 'Ignored during playback',
            });
          }
          break;
        case 'ec':
        case 'effectControl':
          const action = event.action;
          if (action === 'scan-global' || action === 'scan-current') {
            const _j1491 = action === 'scan-global' ? 'GLOBAL' : 'EACH';
            const evShapeType = event.shapeType !== undefined ? event.shapeType : null;
            const scanSeed = event.scanSeed !== undefined ? event.scanSeed : null;
            const bugsSizeValue = event.bugsSize !== undefined ? event.bugsSize : 10.0;
            if (typeof $win !== 'undefined') {
              $win.bugsSize = bugsSizeValue;
              const bugsSizeEl = $doc.getElementById('bugs-size');
              const bugsSizeValueEl = $doc.getElementById('bugs-size-value');
              if (bugsSizeEl && bugsSizeValueEl) {
                bugsSizeEl.value = bugsSizeValue;
                bugsSizeValueEl.textContent = bugsSizeValue;
              }
            }
            const scanJob = {
              action: action,
              shapeType: evShapeType,
              bugsSize: bugsSizeValue,
              scanBounds:
                action === 'scan-current' && event.scanBounds
                  ? {
                      ...event.scanBounds,
                    }
                  : null,
              scanSeed: scanSeed,
              recordedRandomCount: event.randomCount !== undefined ? event.randomCount : null,
              targetPoints: event.targetPoints || null,
              eventTime: event.t,
            };
            let _j1493 = null;
            let _j1494 = null;
            if (typeof $win !== 'undefined') {
              if (!$win.pendingEffectControlScanQueue) {
                $win.pendingEffectControlScanQueue = [];
              }
              $win.pendingEffectControlScanQueue.push(scanJob);
              $win.lastEffectControlProcessTime = $clock();
              if (action === 'scan-global') {
                $win._scanGlobalPlaybackCount = ($win._scanGlobalPlaybackCount || 0) + 1;
              } else if (action === 'scan-current') {
                $win._scanCurrentPlaybackCount = ($win._scanCurrentPlaybackCount || 0) + 1;
              }
              _j1493 = $win._scanGlobalPlaybackCount || 0;
              _j1494 = $win._scanCurrentPlaybackCount || 0;
            } else {
              if (typeof $win !== 'undefined') {
                $win.bugsSize = bugsSizeValue;
              }
              const savedSeed = seed;
              if (scanSeed) {
                $p.randomSeed(scanSeed);
                $p.noiseSeed(scanSeed);
              }
              if (typeof scanBugBites === 'function') {
                if (action === 'scan-global') {
                  scanBugBites(null, null, evShapeType);
                } else if (action === 'scan-current') {
                  const scanBounds = event.scanBounds || null;
                  scanBugBites(null, scanBounds, evShapeType);
                }
              }
              if (savedSeed) {
                $p.randomSeed(savedSeed);
                $p.noiseSeed(savedSeed);
              }
            }
            logMessage('playback', '✨ Effect Control: Scan (queued)', {
              Mode: _j1491,
              ShapeType: evShapeType !== null ? evShapeType : 'Unknown',
              BugsSize: bugsSizeValue,
              Action: action,
              Status:
                typeof $win !== 'undefined' && $win.pendingEffectControlScanQueue
                  ? `Queued (${$win.pendingEffectControlScanQueue.length} in queue)`
                  : 'Immediate',
              GlobalCount: _j1493,
              CurrentCount: _j1494,
            });
          } else if (action === 'scan-random') {
            const evShapeType = event.shapeType !== undefined ? event.shapeType : null;
            const bugsSizeValue = event.bugsSize !== undefined ? event.bugsSize : 10.0;
            if (typeof $win !== 'undefined') {
              $win.bugsSize = bugsSizeValue;
              const bugsSizeEl = $doc.getElementById('bugs-size');
              const bugsSizeValueEl = $doc.getElementById('bugs-size-value');
              if (bugsSizeEl && bugsSizeValueEl) {
                bugsSizeEl.value = bugsSizeValue;
                bugsSizeValueEl.textContent = bugsSizeValue;
              }
            }
            if (typeof scanBugBitesRandom === 'function') {
              scanBugBitesRandom(10, evShapeType);
            }
            logMessage('playback', '✨ Effect Control: Scan RANDOM', {
              ShapeType: evShapeType !== null ? evShapeType : 'Unknown',
              BugsSize: bugsSizeValue,
            });
          } else if (action === 'metallic-strength') {
            const metallicStrengthPct = event.value !== undefined ? event.value : 85;
            if (typeof $win !== 'undefined') {
              $win.metallicStrength = metallicStrengthPct / 100;
            }
            const metallicStrengthEl = $doc.getElementById('metallic-strength');
            const metallicStrengthValueEl = $doc.getElementById('metallic-strength-value');
            if (metallicStrengthEl && metallicStrengthValueEl) {
              metallicStrengthEl.value = metallicStrengthPct;
              metallicStrengthValueEl.textContent = metallicStrengthPct;
            }
            logMessage('playback', '✨ Effect Control: Metallic Strength', {
              Value: metallicStrengthPct,
            });
          } else if (action === 'bugs-size') {
            const bugsSizeValue = event.value !== undefined ? event.value : 10;
            const bugsSizeEl = $doc.getElementById('bugs-size');
            const bugsSizeValueEl = $doc.getElementById('bugs-size-value');
            if (bugsSizeEl && bugsSizeValueEl) {
              bugsSizeEl.value = bugsSizeValue;
              $win.bugsSize = bugsSizeValue;
              bugsSizeValueEl.textContent = bugsSizeValue;
              logMessage('system', '🐛 Bugs Size updated during playback', {
                Value: bugsSizeValue,
              });
            }
          } else if (action === 'metallic-flow') {
            const metallicFlowPct = event.value !== undefined ? event.value : 200;
            if (typeof $win !== 'undefined') {
              $win.metallicFlowSpeed = metallicFlowPct / 100;
            }
            const metallicFlowEl = $doc.getElementById('metallic-flow');
            const metallicFlowValueEl = $doc.getElementById('metallic-flow-value');
            if (metallicFlowEl && metallicFlowValueEl) {
              metallicFlowEl.value = metallicFlowPct;
              metallicFlowValueEl.textContent = metallicFlowPct;
            }
            logMessage('playback', '✨ Effect Control: Metallic Flow', {
              Value: metallicFlowPct,
            });
          } else if (action === 'metal-tint') {
            const tintType = event.tintType || 'copper';
            const tintButtons = {
              gold: [0.88, 0.72, 0.52],
              silver: [0.75, 0.75, 0.75],
              copper: [0.72, 0.5, 0.35],
              rose: [0.88, 0.65, 0.7],
              black: [0.15, 0.12, 0.08],
              diamond: [0.95, 0.95, 1.0],
            };
            if (typeof $win !== 'undefined' && typeof $win.metallicTint === 'undefined') {
              $win.metallicTint = [0.72, 0.5, 0.35];
            }
            if (tintButtons[tintType]) {
              if (typeof $win !== 'undefined') {
                $win.metallicTint = [...tintButtons[tintType]];
              }
              const _j1463 = `metal-${tintType}`;
              const btn = $doc.getElementById(_j1463);
              if (btn) {
                $doc.querySelectorAll('.metal-tint-btn').forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
              }
              logMessage('playback', '✨ Effect Control: Metal Tint', {
                Tint: tintType,
                RGB: `[${tintButtons[tintType].join(', ')}]`,
                Applied: true,
              });
            } else {
              logMessage('playback', '⚠️ Effect Control: Metal Tint (Unknown)', {
                Tint: tintType,
                Status: 'Unknown tint type, skipped',
              });
            }
          }
          break;
        case 'flow':
          if (event.action === 'start') {
            if (typeof flowActive !== 'undefined' && flowActive) {
              if (typeof stopFlowEffect === 'function') {
                stopFlowEffect();
              }
              logMessage('playback', '🌊 Flow Effect: previous effect forced to complete');
            }
            $win.pendingFlowEvent = {
              blendType: event.blendType,
              flowSeed: event.flowSeed,
              strokeBounds: event.strokeBounds,
              strength: event.strength,
              totalFrames: 0,
              iterations: 0,
            };
            flowEffectStrokeBounds = event.strokeBounds;
            if (event.strength !== undefined && typeof flowParams !== 'undefined') {
              flowParams.blendVol = event.strength;
            }
            if (typeof flowLastStrokeOnly !== 'undefined') {
              flowLastStrokeOnly = event.lastStrokeOnly || false;
            }
            if (typeof startFlowEffect === 'function') {
              startFlowEffect(event.blendType, event.flowSeed, true);
            }
            logMessage('playback', '🌊 Flow Effect: Start (preview)', {
              BlendType: event.blendType,
              Seed: event.flowSeed,
              Bounds: event.strokeBounds
                ? `[${event.strokeBounds.minX.toFixed(2)}, ${event.strokeBounds.minY.toFixed(2)}, ${event.strokeBounds.maxX.toFixed(2)}, ${event.strokeBounds.maxY.toFixed(2)}]`
                : 'None',
            });
          } else if (event.action === 'end') {
            const _j1497 = $win.pendingFlowEvent;
            if (_j1497) {
              if (typeof flowTargetFrames !== 'undefined') {
                flowTargetFrames = event.totalFrames || event.iterations * 3 || 30;
                flowTargetIterations = event.iterations || 10;
              }
              logMessage('playback', '🌊 Flow Effect: End (target set, wait for preview)', {
                BlendType: _j1497.blendType,
                TargetFrames: event.totalFrames,
                TargetIterations: event.iterations,
              });
            }
            $win.pendingFlowEvent = null;
          }
          break;
        case 'mask':
          if (event.action === 'rect') {
            drawMaskRect(event.x1, event.y1, event.x2, event.y2);
            logMessage('playback', '🎭 Mask rect applied', {
              Region: `(${event.x1.toFixed(0)},${event.y1.toFixed(0)})→(${event.x2.toFixed(0)},${event.y2.toFixed(0)})`,
            });
          } else if (event.action === 'polygon') {
            drawMaskPolygon(event.points);
            logMessage('playback', '🎭 Mask polygon applied', {
              Points: event.points.length,
            });
          } else if (event.action === 'clear') {
            clearMask();
            logMessage('playback', '🎭 Mask cleared');
          }
          break;
      }
    }
    function updatePlayback() {
      if (!isPlaying) return;
      const _j1498 = 200;
      if (typeof $win !== 'undefined') {
        const _j1499 = $win.pendingEffectControlScanQueue && $win.pendingEffectControlScanQueue.length > 0;
        if ($win.lastEffectControlProcessTime) {
          const _j1500 = $clock() - $win.lastEffectControlProcessTime;
          if (_j1500 < _j1498) {
            return;
          } else {
            $win.lastEffectControlProcessTime = null;
          }
        }
        if (_j1499 && !$win.lastEffectControlProcessTime) {
        }
      }
      if (isWaitingToLoop) {
        const _j1501 = $clock() - loopWaitStart;
        const _j1502 = Math.floor(_j1501 / 1000);
        if (!$win._lastLoggedWaitSecond || $win._lastLoggedWaitSecond !== _j1502) {
        }
        if (_j1501 >= $win.loopWaitDuration) {
          if ($win.DEBUG_MODE) console.log('✅ Countdown finished, preparing replay');
          $win._lastLoggedWaitSecond = null;
          if ($win.loopToggle === 1) {
            logMessage('playback', 'Loop playback', {
              Status: 'Restarting',
            });
            if (easycamEnabled && easycam !== null) {
              const homeCenter =
                typeof easycamInitialCenter !== 'undefined' && easycamInitialCenter
                  ? easycamInitialCenter
                  : [0, 0, 0];
              const homeDist =
                typeof easycamInitialDistance !== 'undefined' && easycamInitialDistance > 0
                  ? easycamInitialDistance
                  : Math.max($p.width, $p.height) * 1.0;
              easycam.setCenter(homeCenter, 0);
              easycam.setDistance(homeDist, 0);
              camResetting = false;
              logMessage('system', '🎥 Camera reset for loop', {
                Center: `[${homeCenter[0].toFixed(2)}, ${homeCenter[1].toFixed(2)}, ${homeCenter[2].toFixed(2)}]`,
                Distance: homeDist.toFixed(2),
              });
            }
            clearCanvas();
            if (typeof sprayParticles !== 'undefined') {
              sprayParticles = [];
            }
            if (typeof sprayParticleCounter !== 'undefined') {
              sprayParticleCounter = 0;
            }
            if (recordingData.randomSeed) {
              $p.randomSeed(recordingData.randomSeed);
              $p.noiseSeed(recordingData.randomSeed);
              if (typeof $win.boidsSeed !== 'undefined') {
                $win.boidsSeed = $p.floor($win.crandom.random(1, 10000));
              }
            }
            playbackStartMillis = $clock();
            if ($win._fxVirtualTime !== undefined) {
              $win._fxVirtualTime = 0;
            }
            playbackEventIndex = 0;
            playMouseDown = false;
            playX = hw;
            playY = hh;
            playPrevX = hw;
            playPrevY = hh;
            isWaitingToLoop = false;
            feedbackFrame = 0;
            inkGray = 0;
            countdownPauseStart = 0;
            countdownPausing = false;
            if (typeof pathPoints !== 'undefined') {
              pathPoints = [];
            }
            if (typeof lastStrokeBounds !== 'undefined') {
              lastStrokeBounds = null;
            }
            if (typeof collectPathPoints !== 'undefined') {
              collectPathPoints = false;
            }
            if (typeof layerBlurTarget !== 'undefined') {
              layerBlurTarget = {
                0: 0,
                40: 0,
                80: 0,
                120: 0,
              };
            }
            if (typeof layerBlur !== 'undefined') {
              layerBlur = {
                0: 0,
                40: 0,
                80: 0,
                120: 0,
              };
            }
            if (typeof totalStrokeCount !== 'undefined') {
              totalStrokeCount = 0;
            }
            if ($win._initialConsoleFromURL === true && typeof screenText !== 'undefined') {
              screenText = true;
              const screenTextToggle =
                typeof $doc !== 'undefined' && $doc.getElementById
                  ? $doc.getElementById('screen-text-toggle')
                  : null;
              if (screenTextToggle) {
                screenTextToggle.checked = true;
              }
            }
            $win.showStrokeDivider = true;
            logMessage('playback', '🔁 Loop restart', {
              Status: 'New round playback',
            });
          } else {
            logMessage('playback', '⏹️ Playback ended', {
              Status: 'Single playback complete, no more loops',
            });
            stopPlayback();
          }
        }
        return;
      }
      if (playbackEventIndex >= recordingData.events.length && !isWaitingToLoop) {
        if (playMouseDown) {
          playMouseDown = false;
          if (!isReleasing) {
            isReleasing = true;
            countdownFrame = 0;
            compositeDirty = true;
          }
        }
        if (isReleasing) {
          if (countdownFrame < maxUpdates) {
            return;
          }
        }
        if (isDrawing) {
          return;
        }
        console.log('🔍 Playback end check:', {
          loopToggle: $win.loopToggle,
          loopToggleType: typeof $win.loopToggle,
          loopWaitDuration: $win.loopWaitDuration,
          loopWaitDurationType: typeof $win.loopWaitDuration,
          isWaitingToLoop: isWaitingToLoop,
        });
        if ($win._fxDebug) {
          $win._fxDebug.playbackEndFrame = $win._fxDebug.totalFrames;
          $win._fxDebug.playbackEndVirtualTime = $win._fxVirtualTime || 0;
          $win._fxDebug.playbackEndRealTime = performance.now() - $win._fxDebug.startTime;
          $win._fxDebug.eventsProcessed = playbackEventIndex;
          $win._fxDebug.totalEvents = recordingData ? recordingData.events.length : 0;
        }
        if ($win.loopToggle === 1) {
          if (typeof screenText !== 'undefined') {
            screenText = false;
          }
          const screenTextToggle =
            typeof $doc !== 'undefined' && $doc.getElementById ? $doc.getElementById('screen-text-toggle') : null;
          if (screenTextToggle) {
            screenTextToggle.checked = false;
          }
          $win.showStrokeDivider = false;
          if (
            typeof $win.$fx !== 'undefined' &&
            typeof $win.$fx.preview === 'function' &&
            !$win._fxPreviewTriggered
          ) {
            $win._fxPreviewTriggered = true;
            function _j196() {
              console.log('[fxhash] Forcing final composite + capture...');
              compositeDirty = true;
              setTimeout(function () {
                $win._fxCapturePhase = 1;
                console.log(
                  '[fxhash] _fxCapturePhase=1 set, waiting for next draw frame | context:',
                  $win._fxContext || 'unknown',
                );
              }, 500);
            }
            if (easycamEnabled && easycam !== null) {
              camResetting = true;
              camResetStart = $clock();
              camResetFromCenter = [easycam.getCenter()[0], easycam.getCenter()[1], easycam.getCenter()[2]];
              camResetFromDist = easycam.getDistance();
              camResetToCenter =
                typeof easycamInitialCenter !== 'undefined' && easycamInitialCenter
                  ? easycamInitialCenter
                  : [0, 0, 0];
              camResetToDist =
                typeof easycamInitialDistance !== 'undefined' && easycamInitialDistance > 0
                  ? easycamInitialDistance
                  : Math.max($p.width, $p.height) * 1.0;
              var _j1503 = CAMERA_RESET_MS + 500;
              console.log('[fxhash] Waiting ' + _j1503 + 'ms for camera reset before capture...');
              setTimeout(_j196, _j1503);
            } else {
              _j196();
            }
          }
          logMessage('playback', 'Playback complete', {
            Status: 'Waiting 30 seconds before loop',
          });
          if ($win.DEBUG_MODE)
            console.log('✅ Starting countdown:', {
              loopWaitDuration: $win.loopWaitDuration,
              startTime: $clock(),
            });
          isWaitingToLoop = true;
          loopWaitStart = $clock();
        } else {
          logMessage('playback', 'Playback complete', {
            Status: 'Single playback complete, stopping immediately',
          });
          if ($win.DEBUG_MODE) console.log('❌ loopToggle is not 1, stopping playback');
          stopPlayback();
        }
        return;
      }
      var playbackElapsed;
      if ($win._fxVirtualTime !== undefined) {
        $win._fxVirtualTime += 16.67;
        playbackElapsed = $win._fxVirtualTime * playbackSpeed;
      } else {
        playbackElapsed = ($clock() - playbackStartMillis) * playbackSpeed;
      }
      let _j1504 = 0;
      const _j1505 = 100;
      let _j1506 = 0;
      const _j1507 = 1;
      if (typeof $win.playbackMultiEventFrames === 'undefined') {
        $win.playbackMultiEventFrames = 0;
      }
      let _j1508 = false;
      while (playbackEventIndex < recordingData.events.length && _j1504 < _j1505) {
        if (
          typeof flowActive !== 'undefined' &&
          flowActive &&
          typeof flowTargetFrames !== 'undefined' &&
          flowTargetFrames > 0
        ) {
          break;
        }
        const event = recordingData.events[playbackEventIndex];
        const eventTime = event.t !== undefined ? event.t : event.time;
        const evtType = event.m || event.type;
        const _j1509 = evtType === 'mp' || evtType === 'mousePressed';
        const isRelease = evtType === 'mr' || evtType === 'mouseReleased';
        const isEc = evtType === 'ec' || evtType === 'effectControl';
        const _j1512 = evtType === 'flow';
        const isMask = evtType === 'mask';
        const timeUntil = eventTime - playbackElapsed;
        if (
          !isEc &&
          !_j1512 &&
          !isMask &&
          eventTime > playbackElapsed &&
          playbackEventIndex + 1 < recordingData.events.length
        ) {
          const nextEvent = recordingData.events[playbackEventIndex + 1];
          const eventKind = nextEvent.m || nextEvent.type;
          const isPress = eventKind === 'mp' || eventKind === 'mousePressed';
          if (isPress) {
            if (isRelease) {
              if (_j1508) {
                break;
              }
              dispatchPlaybackEvent(event);
              playbackEventIndex++;
              _j1504++;
              continue;
            } else {
              playbackEventIndex++;
              continue;
            }
          }
        }
        if (eventTime <= playbackElapsed) {
          const isDrag = evtType === 'md' || evtType === 'mouseDragged';
          if (isDrag && _j1506 >= _j1507) {
            break;
          }
          if (isRelease && _j1508) {
            if (typeof $win.playbackDelayedReleaseCount === 'undefined') {
              $win.playbackDelayedReleaseCount = 0;
            }
            $win.playbackDelayedReleaseCount++;
            break;
          }
          if (isEc || isMask || !isReleasing || (isReleasing && playMouseDown)) {
            if (isEc) {
              const action = event.action;
              if (action === 'scan-global' || action === 'scan-current') {
                if (typeof $win !== 'undefined') {
                  $win.lastEffectControlProcessTime = $clock();
                }
              }
            }
            dispatchPlaybackEvent(event);
            playbackEventIndex++;
            _j1504++;
            if (isDrag) {
              _j1506++;
              _j1508 = true;
            }
          } else {
            break;
          }
        } else {
          const isDrag = evtType === 'md' || evtType === 'mouseDragged';
          if (isDrag && _j1506 >= _j1507) {
            break;
          }
          if (isRelease && _j1508) {
            break;
          }
          if (isEc || _j1512 || isMask || (_j1509 && !isReleasing) || timeUntil < 100) {
            if (isEc) {
              const action = event.action;
              if (action === 'scan-global' || action === 'scan-current') {
                if (typeof $win !== 'undefined') {
                  $win.lastEffectControlProcessTime = $clock();
                }
              }
            }
            dispatchPlaybackEvent(event);
            playbackEventIndex++;
            _j1504++;
            if (isDrag) {
              _j1506++;
              _j1508 = true;
            }
          } else {
            break;
          }
        }
        if (_j1506 > 1) {
          $win.playbackMultiEventFrames++;
        }
      }
    }
    // [restored] UI-only functions removed from the engine; kept as no-op stubs because engine code still calls them.
    function uiLoadPanelVisibility() {}
    function uiLoadPanelPositions() {}
    function uiAppendLog() {}
    function uiUpdateRecordButtons() {}
    function uiSyncBrushSize() {}
    function uiSyncBrushMode() {}
    function uiSyncBlendMode() {}
    function uiSyncInkEffect() {}
    function uiSyncBrushColor() {}
    function uiSyncPathRotation() {}
    function uiUpdateBrushStatus() {}
    function uiSyncBackgroundColor() {}
    function uiSyncCanvasSize() {}
    function uiInitControlPanel() {}
    function uiUpdateRecordingStatus() {}
    function uiInit() {}
    function uiSyncAllBrushButtons() {}
    function uiGetActiveShapeType() {
      return 0;
    }
    function uiSetActiveShapeType() {}
    function startFrameRecording() {}
    function stopFrameRecording() {}
    function captureFrame() {}
    function downloadRecording() {}
    function afterPlaybackEnded() {}
    function captureVideoFrame() {}
    function perfMonitorTick() {}
    function perfMonitorReport() {}
    function updateReferenceImageSize() {}
    function isPointOverUI() {
      return false;
    }
    function uiMaskStatus() {}

    // =====================================================================================
    return {
      preload, setup, draw, mousePressed, mouseReleased,
      win: $win,
      state: {
        get padfactor() { return padfactor; },
        set padfactor(v) { padfactor = v; },
        get dashPenDown() { return dashPenDown; },
        set dashPenDown(v) { dashPenDown = v; },
        get dashTravelled() { return dashTravelled; },
        set dashTravelled(v) { dashTravelled = v; },
        get flyBrushEnd() { return flyBrushEnd; },
        set flyBrushEnd(v) { flyBrushEnd = v; },
        get size() { return size; },
        set size(v) { size = v; },
        get nowSize() { return nowSize; },
        set nowSize(v) { nowSize = v; },
        get paperUnusedCache() { return paperUnusedCache; },
        set paperUnusedCache(v) { paperUnusedCache = v; },
        get paperUnusedCounter() { return paperUnusedCounter; },
        set paperUnusedCounter(v) { paperUnusedCounter = v; },
        get bugPoints() { return bugPoints; },
        set bugPoints(v) { bugPoints = v; },
        get prevGridParams() { return prevGridParams; },
        set prevGridParams(v) { prevGridParams = v; },
        get __lastGridParams() { return __lastGridParams; },
        set __lastGridParams(v) { __lastGridParams = v; },
        get cachedRectUniform() { return cachedRectUniform; },
        set cachedRectUniform(v) { cachedRectUniform = v; },
        get cachedInvResolution() { return cachedInvResolution; },
        set cachedInvResolution(v) { cachedInvResolution = v; },
        get cachedRectW() { return cachedRectW; },
        set cachedRectW(v) { cachedRectW = v; },
        get cachedRectH() { return cachedRectH; },
        set cachedRectH(v) { cachedRectH = v; },
        get cachedRectDensity() { return cachedRectDensity; },
        set cachedRectDensity(v) { cachedRectDensity = v; },
        get uniformCache() { return uniformCache; },
        set uniformCache(v) { uniformCache = v; },
        get canvasW() { return canvasW; },
        set canvasW(v) { canvasW = v; },
        get canvasH() { return canvasH; },
        set canvasH(v) { canvasH = v; },
        get hw() { return hw; },
        set hw(v) { hw = v; },
        get hh() { return hh; },
        set hh(v) { hh = v; },
        get density() { return density; },
        set density(v) { density = v; },
        get forceMapBuffer() { return forceMapBuffer; },
        set forceMapBuffer(v) { forceMapBuffer = v; },
        get font() { return font; },
        set font(v) { font = v; },
        get lastFrameTime() { return lastFrameTime; },
        set lastFrameTime(v) { lastFrameTime = v; },
        get canvasBackgroundColor() { return canvasBackgroundColor; },
        set canvasBackgroundColor(v) { canvasBackgroundColor = v; },
        get showPaperTexture() { return showPaperTexture; },
        set showPaperTexture(v) { showPaperTexture = v; },
        get showGridOverlay() { return showGridOverlay; },
        set showGridOverlay(v) { showGridOverlay = v; },
        get showFuturePathPreview() { return showFuturePathPreview; },
        set showFuturePathPreview(v) { showFuturePathPreview = v; },
        get mapShader() { return mapShader; },
        set mapShader(v) { mapShader = v; },
        get feedbackShader() { return feedbackShader; },
        set feedbackShader(v) { feedbackShader = v; },
        get realtimeShader() { return realtimeShader; },
        set realtimeShader(v) { realtimeShader = v; },
        get encodeShader() { return encodeShader; },
        set encodeShader(v) { encodeShader = v; },
        get compositeShader() { return compositeShader; },
        set compositeShader(v) { compositeShader = v; },
        get distortShader() { return distortShader; },
        set distortShader(v) { distortShader = v; },
        get typeMapEncodeShader() { return typeMapEncodeShader; },
        set typeMapEncodeShader(v) { typeMapEncodeShader = v; },
        get flowShader() { return flowShader; },
        set flowShader(v) { flowShader = v; },
        get colorIndex() { return colorIndex; },
        set colorIndex(v) { colorIndex = v; },
        get inkGray() { return inkGray; },
        set inkGray(v) { inkGray = v; },
        get brushColorMode() { return brushColorMode; },
        set brushColorMode(v) { brushColorMode = v; },
        get whiteBrushMode() { return whiteBrushMode; },
        set whiteBrushMode(v) { whiteBrushMode = v; },
        get whiteMaxOpacity() { return whiteMaxOpacity; },
        set whiteMaxOpacity(v) { whiteMaxOpacity = v; },
        get hueShift() { return hueShift; },
        set hueShift(v) { hueShift = v; },
        get satShift() { return satShift; },
        set satShift(v) { satShift = v; },
        get briShift() { return briShift; },
        set briShift(v) { briShift = v; },
        get customBrushColor() { return customBrushColor; },
        set customBrushColor(v) { customBrushColor = v; },
        get interpSteps() { return interpSteps; },
        set interpSteps(v) { interpSteps = v; },
        get branchTypeInit() { return branchTypeInit; },
        set branchTypeInit(v) { branchTypeInit = v; },
        get spring() { return spring; },
        set spring(v) { spring = v; },
        get friction() { return friction; },
        set friction(v) { friction = v; },
        get sizeNow() { return sizeNow; },
        set sizeNow(v) { sizeNow = v; },
        get velX() { return velX; },
        set velX(v) { velX = v; },
        get velY() { return velY; },
        set velY(v) { velY = v; },
        get speed() { return speed; },
        set speed(v) { speed = v; },
        get strokeWidth() { return strokeWidth; },
        set strokeWidth(v) { strokeWidth = v; },
        get pathAngle() { return pathAngle; },
        set pathAngle(v) { pathAngle = v; },
        get brushDir() { return brushDir; },
        set brushDir(v) { brushDir = v; },
        get initialSize() { return initialSize; },
        set initialSize(v) { initialSize = v; },
        get spraySize() { return spraySize; },
        set spraySize(v) { spraySize = v; },
        get brushSize() { return brushSize; },
        set brushSize(v) { brushSize = v; },
        get brushSizeMin() { return brushSizeMin; },
        set brushSizeMin(v) { brushSizeMin = v; },
        get smoothedWidth() { return smoothedWidth; },
        set smoothedWidth(v) { smoothedWidth = v; },
        get brushMode() { return brushMode; },
        set brushMode(v) { brushMode = v; },
        get brushSizeName() { return brushSizeName; },
        set brushSizeName(v) { brushSizeName = v; },
        get baseBrushSize() { return baseBrushSize; },
        set baseBrushSize(v) { baseBrushSize = v; },
        get brushModeSP() { return brushModeSP; },
        set brushModeSP(v) { brushModeSP = v; },
        get shapeType() { return shapeType; },
        set shapeType(v) { shapeType = v; },
        get useSharpen() { return useSharpen; },
        set useSharpen(v) { useSharpen = v; },
        get prevInkEffect() { return prevInkEffect; },
        set prevInkEffect(v) { prevInkEffect = v; },
        get keyBlendMode() { return keyBlendMode; },
        set keyBlendMode(v) { keyBlendMode = v; },
        get phasorVel() { return phasorVel; },
        set phasorVel(v) { phasorVel = v; },
        get targetflyBrushType() { return targetflyBrushType; },
        set targetflyBrushType(v) { targetflyBrushType = v; },
        get targetmainStrokeDir() { return targetmainStrokeDir; },
        set targetmainStrokeDir(v) { targetmainStrokeDir = v; },
        get penSketchNoiseBase() { return penSketchNoiseBase; },
        set penSketchNoiseBase(v) { penSketchNoiseBase = v; },
        get penSketchStrokeWeight() { return penSketchStrokeWeight; },
        set penSketchStrokeWeight(v) { penSketchStrokeWeight = v; },
        get brushPaintCtlNoisebyFrame() { return brushPaintCtlNoisebyFrame; },
        set brushPaintCtlNoisebyFrame(v) { brushPaintCtlNoisebyFrame = v; },
        get brushPaintInterpolationOffset() { return brushPaintInterpolationOffset; },
        set brushPaintInterpolationOffset(v) { brushPaintInterpolationOffset = v; },
        get brushPaintOldRInitial() { return brushPaintOldRInitial; },
        set brushPaintOldRInitial(v) { brushPaintOldRInitial = v; },
        get flyBrushPoints() { return flyBrushPoints; },
        set flyBrushPoints(v) { flyBrushPoints = v; },
        get x() { return x; },
        set x(v) { x = v; },
        get y() { return y; },
        set y(v) { y = v; },
        get tipX() { return tipX; },
        set tipX(v) { tipX = v; },
        get tipY() { return tipY; },
        set tipY(v) { tipY = v; },
        get legacyBrushX() { return legacyBrushX; },
        set legacyBrushX(v) { legacyBrushX = v; },
        get legacyBrushY() { return legacyBrushY; },
        set legacyBrushY(v) { legacyBrushY = v; },
        get lineWidth() { return lineWidth; },
        set lineWidth(v) { lineWidth = v; },
        get prevTipX() { return prevTipX; },
        set prevTipX(v) { prevTipX = v; },
        get prevTipY() { return prevTipY; },
        set prevTipY(v) { prevTipY = v; },
        get springInitialized() { return springInitialized; },
        set springInitialized(v) { springInitialized = v; },
        get cursorX() { return cursorX; },
        set cursorX(v) { cursorX = v; },
        get cursorY() { return cursorY; },
        set cursorY(v) { cursorY = v; },
        get lastTipX() { return lastTipX; },
        set lastTipX(v) { lastTipX = v; },
        get lastTipY() { return lastTipY; },
        set lastTipY(v) { lastTipY = v; },
        get gridCellSize() { return gridCellSize; },
        set gridCellSize(v) { gridCellSize = v; },
        get isDrawing() { return isDrawing; },
        set isDrawing(v) { isDrawing = v; },
        get isReleasing() { return isReleasing; },
        set isReleasing(v) { isReleasing = v; },
        get strokeActive() { return strokeActive; },
        set strokeActive(v) { strokeActive = v; },
        get strokeCommitted() { return strokeCommitted; },
        set strokeCommitted(v) { strokeCommitted = v; },
        get pressureEnabled() { return pressureEnabled; },
        set pressureEnabled(v) { pressureEnabled = v; },
        get useSpectralMix() { return useSpectralMix; },
        set useSpectralMix(v) { useSpectralMix = v; },
        get maskBuffer() { return maskBuffer; },
        set maskBuffer(v) { maskBuffer = v; },
        get maskDrawMode() { return maskDrawMode; },
        set maskDrawMode(v) { maskDrawMode = v; },
        get maskActive() { return maskActive; },
        set maskActive(v) { maskActive = v; },
        get maskTool() { return maskTool; },
        set maskTool(v) { maskTool = v; },
        get maskRectDraft() { return maskRectDraft; },
        set maskRectDraft(v) { maskRectDraft = v; },
        get maskPolygonPoints() { return maskPolygonPoints; },
        set maskPolygonPoints(v) { maskPolygonPoints = v; },
        get currentMaskData() { return currentMaskData; },
        set currentMaskData(v) { currentMaskData = v; },
        get pressureNorm() { return pressureNorm; },
        set pressureNorm(v) { pressureNorm = v; },
        get stylusDetected() { return stylusDetected; },
        set stylusDetected(v) { stylusDetected = v; },
        get penPressure() { return penPressure; },
        set penPressure(v) { penPressure = v; },
        get pressureHistory() { return pressureHistory; },
        set pressureHistory(v) { pressureHistory = v; },
        get pressureBaseBrushSize() { return pressureBaseBrushSize; },
        set pressureBaseBrushSize(v) { pressureBaseBrushSize = v; },
        get pointerOnUI() { return pointerOnUI; },
        set pointerOnUI(v) { pointerOnUI = v; },
        get pathToggle() { return pathToggle; },
        set pathToggle(v) { pathToggle = v; },
        get compositeDirty() { return compositeDirty; },
        set compositeDirty(v) { compositeDirty = v; },
        get agentPathActive() { return agentPathActive; },
        set agentPathActive(v) { agentPathActive = v; },
        get agentPaths() { return agentPaths; },
        set agentPaths(v) { agentPaths = v; },
        get countdownFrame() { return countdownFrame; },
        set countdownFrame(v) { countdownFrame = v; },
        get maxUpdates() { return maxUpdates; },
        set maxUpdates(v) { maxUpdates = v; },
        get force() { return force; },
        set force(v) { force = v; },
        get strokeFrame() { return strokeFrame; },
        set strokeFrame(v) { strokeFrame = v; },
        get feedbackFrame() { return feedbackFrame; },
        set feedbackFrame(v) { feedbackFrame = v; },
        get mouseCountStart() { return mouseCountStart; },
        set mouseCountStart(v) { mouseCountStart = v; },
        get doMoving() { return doMoving; },
        set doMoving(v) { doMoving = v; },
        get autoBugScan() { return autoBugScan; },
        set autoBugScan(v) { autoBugScan = v; },
        get pathPoints() { return pathPoints; },
        set pathPoints(v) { pathPoints = v; },
        get lastStrokeBounds() { return lastStrokeBounds; },
        set lastStrokeBounds(v) { lastStrokeBounds = v; },
        get startX() { return startX; },
        set startX(v) { startX = v; },
        get startY() { return startY; },
        set startY(v) { startY = v; },
        get collectPathPoints() { return collectPathPoints; },
        set collectPathPoints(v) { collectPathPoints = v; },
        get pathRotationMode() { return pathRotationMode; },
        set pathRotationMode(v) { pathRotationMode = v; },
        get pathRotation() { return pathRotation; },
        set pathRotation(v) { pathRotation = v; },
        get randStep() { return randStep; },
        set randStep(v) { randStep = v; },
        get step2() { return step2; },
        set step2(v) { step2 = v; },
        get expectedStrokeLength() { return expectedStrokeLength; },
        set expectedStrokeLength(v) { expectedStrokeLength = v; },
        get allBrushStrokes() { return allBrushStrokes; },
        set allBrushStrokes(v) { allBrushStrokes = v; },
        get totalStrokeCount() { return totalStrokeCount; },
        set totalStrokeCount(v) { totalStrokeCount = v; },
        get MAX_STORED_STROKES() { return MAX_STORED_STROKES; },
        set MAX_STORED_STROKES(v) { MAX_STORED_STROKES = v; },
        get ctlNoise() { return ctlNoise; },
        set ctlNoise(v) { ctlNoise = v; },
        get explodeStart() { return explodeStart; },
        set explodeStart(v) { explodeStart = v; },
        get explodeEnd() { return explodeEnd; },
        set explodeEnd(v) { explodeEnd = v; },
        get drawingSeed() { return drawingSeed; },
        set drawingSeed(v) { drawingSeed = v; },
        get indiffusionStrength() { return indiffusionStrength; },
        set indiffusionStrength(v) { indiffusionStrength = v; },
        get seed() { return seed; },
        set seed(v) { seed = v; },
        get strokeSeed() { return strokeSeed; },
        set strokeSeed(v) { strokeSeed = v; },
        get demoRecording() { return demoRecording; },
        set demoRecording(v) { demoRecording = v; },
        get currentStrokeHighlight() { return currentStrokeHighlight; },
        set currentStrokeHighlight(v) { currentStrokeHighlight = v; },
        get futurePathCache() { return futurePathCache; },
        set futurePathCache(v) { futurePathCache = v; },
        get distortDisplacementB() { return distortDisplacementB; },
        set distortDisplacementB(v) { distortDisplacementB = v; },
        get distortDisplacementC() { return distortDisplacementC; },
        set distortDisplacementC(v) { distortDisplacementC = v; },
        get distortShowFbmMask() { return distortShowFbmMask; },
        set distortShowFbmMask(v) { distortShowFbmMask = v; },
        get rsFrequency() { return rsFrequency; },
        set rsFrequency(v) { rsFrequency = v; },
        get rsWaveSpeed() { return rsWaveSpeed; },
        set rsWaveSpeed(v) { rsWaveSpeed = v; },
        get rsStrength() { return rsStrength; },
        set rsStrength(v) { rsStrength = v; },
        get rsGradientMix() { return rsGradientMix; },
        set rsGradientMix(v) { rsGradientMix = v; },
        get rsScale() { return rsScale; },
        set rsScale(v) { rsScale = v; },
        get cellularEnabled() { return cellularEnabled; },
        set cellularEnabled(v) { cellularEnabled = v; },
        get cellularScale() { return cellularScale; },
        set cellularScale(v) { cellularScale = v; },
        get cellularSeed() { return cellularSeed; },
        set cellularSeed(v) { cellularSeed = v; },
        get whiteDotEnabled() { return whiteDotEnabled; },
        set whiteDotEnabled(v) { whiteDotEnabled = v; },
        get whiteDotDensity() { return whiteDotDensity; },
        set whiteDotDensity(v) { whiteDotDensity = v; },
        get grainEnabled() { return grainEnabled; },
        set grainEnabled(v) { grainEnabled = v; },
        get grainAmount() { return grainAmount; },
        set grainAmount(v) { grainAmount = v; },
        get rsEnabled() { return rsEnabled; },
        set rsEnabled(v) { rsEnabled = v; },
        get distortShaderEnabled() { return distortShaderEnabled; },
        set distortShaderEnabled(v) { distortShaderEnabled = v; },
        get bypassFeedback() { return bypassFeedback; },
        set bypassFeedback(v) { bypassFeedback = v; },
        get flowActive() { return flowActive; },
        set flowActive(v) { flowActive = v; },
        get flowBlendType() { return flowBlendType; },
        set flowBlendType(v) { flowBlendType = v; },
        get flowStartMillis() { return flowStartMillis; },
        set flowStartMillis(v) { flowStartMillis = v; },
        get flowIterations() { return flowIterations; },
        set flowIterations(v) { flowIterations = v; },
        get flowUnused() { return flowUnused; },
        set flowUnused(v) { flowUnused = v; },
        get flowSeed() { return flowSeed; },
        set flowSeed(v) { flowSeed = v; },
        get flowEffectStrokeBounds() { return flowEffectStrokeBounds; },
        set flowEffectStrokeBounds(v) { flowEffectStrokeBounds = v; },
        get flowCommitPending() { return flowCommitPending; },
        set flowCommitPending(v) { flowCommitPending = v; },
        get flowCommitData() { return flowCommitData; },
        set flowCommitData(v) { flowCommitData = v; },
        get flowFrames() { return flowFrames; },
        set flowFrames(v) { flowFrames = v; },
        get flowTargetFrames() { return flowTargetFrames; },
        set flowTargetFrames(v) { flowTargetFrames = v; },
        get flowTargetIterations() { return flowTargetIterations; },
        set flowTargetIterations(v) { flowTargetIterations = v; },
        get flowIsReplay() { return flowIsReplay; },
        set flowIsReplay(v) { flowIsReplay = v; },
        get flowParams() { return flowParams; },
        set flowParams(v) { flowParams = v; },
        get flowLastStrokeOnly() { return flowLastStrokeOnly; },
        set flowLastStrokeOnly(v) { flowLastStrokeOnly = v; },
        get fmRandomSeeds() { return fmRandomSeeds; },
        set fmRandomSeeds(v) { fmRandomSeeds = v; },
        get fmScales() { return fmScales; },
        set fmScales(v) { fmScales = v; },
        get fmAmplitudes() { return fmAmplitudes; },
        set fmAmplitudes(v) { fmAmplitudes = v; },
        get fmPhases() { return fmPhases; },
        set fmPhases(v) { fmPhases = v; },
        get fmVortexScales() { return fmVortexScales; },
        set fmVortexScales(v) { fmVortexScales = v; },
        get fmClusterScales() { return fmClusterScales; },
        set fmClusterScales(v) { fmClusterScales = v; },
        get effect3Brightness() { return effect3Brightness; },
        set effect3Brightness(v) { effect3Brightness = v; },
        get oldBuffer() { return oldBuffer; },
        set oldBuffer(v) { oldBuffer = v; },
        get textOverlayGfx() { return textOverlayGfx; },
        set textOverlayGfx(v) { textOverlayGfx = v; },
        get finalBuffer() { return finalBuffer; },
        set finalBuffer(v) { finalBuffer = v; },
        get newBufferBlack() { return newBufferBlack; },
        set newBufferBlack(v) { newBufferBlack = v; },
        get finalOut() { return finalOut; },
        set finalOut(v) { finalOut = v; },
        get futurePathGfx() { return futurePathGfx; },
        set futurePathGfx(v) { futurePathGfx = v; },
        get screenBuffer() { return screenBuffer; },
        set screenBuffer(v) { screenBuffer = v; },
        get pingPongBuffer() { return pingPongBuffer; },
        set pingPongBuffer(v) { pingPongBuffer = v; },
        get cursorBuffer() { return cursorBuffer; },
        set cursorBuffer(v) { cursorBuffer = v; },
        get paperTextureBuffer() { return paperTextureBuffer; },
        set paperTextureBuffer(v) { paperTextureBuffer = v; },
        get plainBgBuffer() { return plainBgBuffer; },
        set plainBgBuffer(v) { plainBgBuffer = v; },
        get realtimeIntermediateBuffer() { return realtimeIntermediateBuffer; },
        set realtimeIntermediateBuffer(v) { realtimeIntermediateBuffer = v; },
        get lastStrokeBuffer() { return lastStrokeBuffer; },
        set lastStrokeBuffer(v) { lastStrokeBuffer = v; },
        get typeMapBuffer() { return typeMapBuffer; },
        set typeMapBuffer(v) { typeMapBuffer = v; },
        get isRecording() { return isRecording; },
        set isRecording(v) { isRecording = v; },
        get recordStartMillis() { return recordStartMillis; },
        set recordStartMillis(v) { recordStartMillis = v; },
        get currentStrokeData() { return currentStrokeData; },
        set currentStrokeData(v) { currentStrokeData = v; },
        get lastStrokeEndMillis() { return lastStrokeEndMillis; },
        set lastStrokeEndMillis(v) { lastStrokeEndMillis = v; },
        get recordedStrokeCount() { return recordedStrokeCount; },
        set recordedStrokeCount(v) { recordedStrokeCount = v; },
        get pausedAccum() { return pausedAccum; },
        set pausedAccum(v) { pausedAccum = v; },
        get firstStrokePending() { return firstStrokePending; },
        set firstStrokePending(v) { firstStrokePending = v; },
        get autoFrameCapture() { return autoFrameCapture; },
        set autoFrameCapture(v) { autoFrameCapture = v; },
        get recordingData() { return recordingData; },
        set recordingData(v) { recordingData = v; },
        get isPlaying() { return isPlaying; },
        set isPlaying(v) { isPlaying = v; },
        get playbackStartMillis() { return playbackStartMillis; },
        set playbackStartMillis(v) { playbackStartMillis = v; },
        get playbackEventIndex() { return playbackEventIndex; },
        set playbackEventIndex(v) { playbackEventIndex = v; },
        get playbackSpeed() { return playbackSpeed; },
        set playbackSpeed(v) { playbackSpeed = v; },
        get playX() { return playX; },
        set playX(v) { playX = v; },
        get playY() { return playY; },
        set playY(v) { playY = v; },
        get playPrevX() { return playPrevX; },
        set playPrevX(v) { playPrevX = v; },
        get playPrevY() { return playPrevY; },
        set playPrevY(v) { playPrevY = v; },
        get playMouseDown() { return playMouseDown; },
        set playMouseDown(v) { playMouseDown = v; },
        get isWaitingToLoop() { return isWaitingToLoop; },
        set isWaitingToLoop(v) { isWaitingToLoop = v; },
        get loopWaitStart() { return loopWaitStart; },
        set loopWaitStart(v) { loopWaitStart = v; },
        get countdownPauseStart() { return countdownPauseStart; },
        set countdownPauseStart(v) { countdownPauseStart = v; },
        get countdownPausing() { return countdownPausing; },
        set countdownPausing(v) { countdownPausing = v; },
        get playbackOffsetX() { return playbackOffsetX; },
        set playbackOffsetX(v) { playbackOffsetX = v; },
        get playbackOffsetY() { return playbackOffsetY; },
        set playbackOffsetY(v) { playbackOffsetY = v; },
        get easycam() { return easycam; },
        set easycam(v) { easycam = v; },
        get easycamEnabled() { return easycamEnabled; },
        set easycamEnabled(v) { easycamEnabled = v; },
        get easycamTracking() { return easycamTracking; },
        set easycamTracking(v) { easycamTracking = v; },
        get camCenterLerp() { return camCenterLerp; },
        set camCenterLerp(v) { camCenterLerp = v; },
        get camZoomLerp() { return camZoomLerp; },
        set camZoomLerp(v) { camZoomLerp = v; },
        get camStrokeCounter() { return camStrokeCounter; },
        set camStrokeCounter(v) { camStrokeCounter = v; },
        get camZoomStrokeMark() { return camZoomStrokeMark; },
        set camZoomStrokeMark(v) { camZoomStrokeMark = v; },
        get camZoomLevel() { return camZoomLevel; },
        set camZoomLevel(v) { camZoomLevel = v; },
        get camZoomIn() { return camZoomIn; },
        set camZoomIn(v) { camZoomIn = v; },
        get camDistMin() { return camDistMin; },
        set camDistMin(v) { camDistMin = v; },
        get camDistMax() { return camDistMax; },
        set camDistMax(v) { camDistMax = v; },
        get easycamInitialDistance() { return easycamInitialDistance; },
        set easycamInitialDistance(v) { easycamInitialDistance = v; },
        get easycamInitialCenter() { return easycamInitialCenter; },
        set easycamInitialCenter(v) { easycamInitialCenter = v; },
        get camResetFromCenter() { return camResetFromCenter; },
        set camResetFromCenter(v) { camResetFromCenter = v; },
        get camResetToCenter() { return camResetToCenter; },
        set camResetToCenter(v) { camResetToCenter = v; },
        get camResetting() { return camResetting; },
        set camResetting(v) { camResetting = v; },
        get camResetStart() { return camResetStart; },
        set camResetStart(v) { camResetStart = v; },
        get camResetFromDist() { return camResetFromDist; },
        set camResetFromDist(v) { camResetFromDist = v; },
        get camResetToDist() { return camResetToDist; },
        set camResetToDist(v) { camResetToDist = v; },
        get CAMERA_RESET_MS() { return CAMERA_RESET_MS; },
        set CAMERA_RESET_MS(v) { CAMERA_RESET_MS = v; },
        get layerZAnimating() { return layerZAnimating; },
        set layerZAnimating(v) { layerZAnimating = v; },
        get layerZAnimStart() { return layerZAnimStart; },
        set layerZAnimStart(v) { layerZAnimStart = v; },
        get layerZFrom() { return layerZFrom; },
        set layerZFrom(v) { layerZFrom = v; },
        get layerZTarget() { return layerZTarget; },
        set layerZTarget(v) { layerZTarget = v; },
        get layerZ() { return layerZ; },
        set layerZ(v) { layerZ = v; },
        get layerBlurTarget() { return layerBlurTarget; },
        set layerBlurTarget(v) { layerBlurTarget = v; },
        get layerBlur() { return layerBlur; },
        set layerBlur(v) { layerBlur = v; },
        get blurStartMillis() { return blurStartMillis; },
        set blurStartMillis(v) { blurStartMillis = v; },
        get BLUR_RAMP_MS() { return BLUR_RAMP_MS; },
        set BLUR_RAMP_MS(v) { BLUR_RAMP_MS = v; },
        get blurActive() { return blurActive; },
        set blurActive(v) { blurActive = v; },
        get blurNeedsRegen() { return blurNeedsRegen; },
        set blurNeedsRegen(v) { blurNeedsRegen = v; },
        get isFrameRecording() { return isFrameRecording; },
        set isFrameRecording(v) { isFrameRecording = v; },
        get frameRecordStart() { return frameRecordStart; },
        set frameRecordStart(v) { frameRecordStart = v; },
        get frameCount() { return frameCount; },
        set frameCount(v) { frameCount = v; },
        get frameRecordList() { return frameRecordList; },
        set frameRecordList(v) { frameRecordList = v; },
        get frameRecordSkip() { return frameRecordSkip; },
        set frameRecordSkip(v) { frameRecordSkip = v; },
        get unused085() { return unused085; },
        set unused085(v) { unused085 = v; },
        get overlayVisible() { return overlayVisible; },
        set overlayVisible(v) { overlayVisible = v; },
        get isDragging() { return isDragging; },
        set isDragging(v) { isDragging = v; },
        get unused707() { return unused707; },
        set unused707(v) { unused707 = v; },
        get screenText() { return screenText; },
        set screenText(v) { screenText = v; },
        get screenTextLines() { return screenTextLines; },
        set screenTextLines(v) { screenTextLines = v; },
        get SCREEN_TEXT_MAX_LINES() { return SCREEN_TEXT_MAX_LINES; },
        set SCREEN_TEXT_MAX_LINES(v) { SCREEN_TEXT_MAX_LINES = v; },
        get screenTextCounter() { return screenTextCounter; },
        set screenTextCounter(v) { screenTextCounter = v; },
        get screenTextX() { return screenTextX; },
        set screenTextX(v) { screenTextX = v; },
        get screenTextY0() { return screenTextY0; },
        set screenTextY0(v) { screenTextY0 = v; },
        get screenTextLineH() { return screenTextLineH; },
        set screenTextLineH(v) { screenTextLineH = v; },
        get screenTextAlpha() { return screenTextAlpha; },
        set screenTextAlpha(v) { screenTextAlpha = v; },
        get SCREEN_TEXT_BUFFER_MAX() { return SCREEN_TEXT_BUFFER_MAX; },
        set SCREEN_TEXT_BUFFER_MAX(v) { SCREEN_TEXT_BUFFER_MAX = v; },
        get pendingBugScan() { return pendingBugScan; },
        set pendingBugScan(v) { pendingBugScan = v; },
        get bugScanSeed() { return bugScanSeed; },
        set bugScanSeed(v) { bugScanSeed = v; },
        get pendingBugBounds() { return pendingBugBounds; },
        set pendingBugBounds(v) { pendingBugBounds = v; },
        get pendingEffectControlScanQueue() { return pendingEffectControlScanQueue; },
        set pendingEffectControlScanQueue(v) { pendingEffectControlScanQueue = v; },
        get perfFrameCounter() { return perfFrameCounter; },
        set perfFrameCounter(v) { perfFrameCounter = v; },
        get sprayParticles() { return sprayParticles; },
        set sprayParticles(v) { sprayParticles = v; },
        get sprayParticleCounter() { return sprayParticleCounter; },
        set sprayParticleCounter(v) { sprayParticleCounter = v; },
        get activeFlowButton() { return activeFlowButton; },
        set activeFlowButton(v) { activeFlowButton = v; },
        get flowUiTimer() { return flowUiTimer; },
        set flowUiTimer(v) { flowUiTimer = v; },
        get performanceMonitor() { return performanceMonitor; },
        set performanceMonitor(v) { performanceMonitor = v; },
        get COLOR_PALETTE() { return COLOR_PALETTE; },
        get PAPER_MAX_SIZE() { return PAPER_MAX_SIZE; },
        get colorTable() { return colorTable; },
        get FLOW_FRAMES_PER_ITERATION() { return FLOW_FRAMES_PER_ITERATION; },
        get PERF_SAMPLE_EVERY() { return PERF_SAMPLE_EVERY; },
        get BRANCH_FLIP_TABLE() { return BRANCH_FLIP_TABLE; },
        get BRANCH_OFFSETS_5() { return BRANCH_OFFSETS_5; },
        get BRANCH_OFFSETS_8() { return BRANCH_OFFSETS_8; },
        get BRANCH_OFFSETS_12() { return BRANCH_OFFSETS_12; },
        get MARKER_LINES() { return MARKER_LINES; },
      },
      fn: { loadShaderFromSources, buildColorTable, colorChannelsOf, listColors, getColorById, getColorByName, generatePaperTexture, createPaperStampTile, createBugShape, bugShapeCluster, bugShapeBlob, bugShapeStrip, bugShapeLightning, bugShapeLightningAlt, drawBugShape, scanBugBites, scanBugBitesRandom, updateBugTextures, applyMetallicPass, dashedLine, gridCommitPrev, drawGridOverlay, drawPathPointsTo, drawMaskOutline, cameraReturnHome, updateEasyCamAutoTracking, initEasyCam, applyCameraProjection, setUniformCached, refreshRectCache, runFeedbackPass, regeneratePaperTexture, refreshBackgroundBuffers, updateCompositeBuffer, initBlurBuffers, drawCursorToBuffer, pressureMedian3, preload, setup, draw, mousePressed, mouseReleased, updateLayerZ, updateBlurEffect, drawLayersWithBlur, drawMaskRect, drawMaskPolygon, clearMask, commitStroke, commitIfPending, collectFutureStrokes, drawFuturePathPreview, drawScreenText, drawStrokeDividers, drawStrokeHighlight, wrapText, lastStrokeBoundsNormalized, startFlowEffect, stopFlowEffect, updateFlowEffect, replayFlowEffect, setInkStroke, setInkFill, drawBranch, drawSprayDots, drawBrushStroke, drawDryBrush, inkJitter, drawMarker, buildFlyBranchConfig, resetFlyBrushCaches, drawGothic, drawFlyBrush, logMessage, saveCanvasPNG, setBrushSizeName, setBrushModeValue, brushModeLabel, setInkEffectValue, setBlendModeValue, setBrushColorName, setPathRotationModeValue, resetBrushSettings, flowButtonDown, flowButtonUp, loadCommitShaders, clearCanvas, initPlaybackEnvironment, clearAllBuffers, primeFeedback, resetBrushState, updateForceMap, randomizeForceMap, logTitle, warmUp, warmUpStroke, round2, recordEvent, startRecording, stopRecording, startPlayback, stopPlayback, dispatchPlaybackEvent, updatePlayback, uiLoadPanelVisibility, uiLoadPanelPositions, uiAppendLog, uiUpdateRecordButtons, uiSyncBrushSize, uiSyncBrushMode, uiSyncBlendMode, uiSyncInkEffect, uiSyncBrushColor, uiSyncPathRotation, uiUpdateBrushStatus, uiSyncBackgroundColor, uiSyncCanvasSize, uiInitControlPanel, uiUpdateRecordingStatus, uiInit, uiSyncAllBrushButtons, uiGetActiveShapeType, uiSetActiveShapeType, startFrameRecording, stopFrameRecording, captureFrame, downloadRecording, afterPlaybackEnded, captureVideoFrame, perfMonitorTick, perfMonitorReport, updateReferenceImageSize, isPointOverUI, uiMaskStatus },
    };
  }

  // ================================================================================================
  // Public API
  // ================================================================================================

  /** Brush modes of the original (`brushMode`). Names are descriptive aliases added by the restoration. */
  const BRUSH_MODES = {
    brush: 1, // 大筆 / main bristle brush (drawBrushStroke + spray dots)
    marker: 2, // 小筆 / marker (drawMarker)
    gothic: 3, // 特大筆 / particle "gothic" brush (drawGothic + spray)
    pen: 4, // 速寫筆 / dry pen sketch (drawDryBrush)
    dots: 5, // 點畫 / spray dots only (drawSprayDots)
    fly: 6, // 飛白筆 / flying-white brush (drawFlyBrush)
    brushSP: 7, // brush mode 7 = mode 1 with brushModeSP (no spray)
  };
  /** Size presets → baseBrushSize multiplier (setBrushSizeName). */
  const SIZE_NAMES = {
    'ultra-small': 0.1, 'extra-small': 0.25, small: 0.5, medium: 1.0, large: 2.0,
    'extra-large': 3.0, 'extra-extra-large': 5.0, huge: 10.0,
  };
  /** Ink effects (`useSharpen`, a feedback/composite shader switch). */
  const INK_EFFECTS = { mix: 0, sharpen: 1, flyingWhite: 2, wet: 3, effect4: 4, hair: 5 };
  /** Pigment blend modes (`keyBlendMode`; 3 = spectral.js-style mixing via the `spectral` flag). */
  const BLEND_MODES = { mix: 0, multiply: 1, darken: 2, spectral: 3 };
  /** Brush colour names accepted by setColor() (index = `brushColorMode`; 33 = custom RGB). */
  const COLOR_NAMES = ['black', 'white', 'dark_gray', 'medium_gray_new', 'light_gray_new', 'green', 'orange',
    'brown', 'green_dark', 'blue_dark', 'purple', 'lime', 'light_gray', 'blue_gray', 'terra_cotta', 'olive_green',
    'pink', 'wine_red', 'gold_orange', 'gray_brown', 'sage_gray', 'brick_red', 'silver', 'beige', 'gray_green',
    'tan', 'khaki', 'dusty_rose', 'mauve_gray', 'medium_gray', 'red', 'yellow', 'blue', 'custom', 'coral', 'mint'];
  /** Option → internal toggle variable (also the keys of a recording's `initialPanelToggles`). */
  const TOGGLES = {
    paper: 'showPaperTexture', grid: 'showGridOverlay', futurePath: 'showFuturePathPreview',
    console: 'screenText', camera: 'doMoving',
  };

  function makeInput(enabled) {
    const s = { enabled: !!enabled, synthetic: !enabled, x: 0, y: 0, px: 0, py: 0, down: false };
    s.proxy = (p) => ({
      get mouseX() { return s.synthetic ? s.x : p.mouseX; },
      set mouseX(v) { if (s.synthetic) s.x = v; else p.mouseX = v; },
      get mouseY() { return s.synthetic ? s.y : p.mouseY; },
      set mouseY(v) { if (s.synthetic) s.y = v; else p.mouseY = v; },
      get pmouseX() { return s.synthetic ? s.px : p.pmouseX; },
      set pmouseX(v) { if (s.synthetic) s.px = v; else p.pmouseX = v; },
      get pmouseY() { return s.synthetic ? s.py : p.pmouseY; },
      set pmouseY(v) { if (s.synthetic) s.py = v; else p.pmouseY = v; },
      // Only presses that started a stroke on the ink canvas count (the site used isPointOverUI()).
      get mouseIsPressed() { return s.down; },
      set mouseIsPressed(v) { s.down = !!v; },
      get key() { return p.key; },
    });
    return s;
  }

  function toRGB(c) {
    if (Array.isArray(c)) return c.slice(0, 3).map(Number);
    if (typeof c === 'string' && /^#?[0-9a-f]{6}$/i.test(c)) {
      const h = c.replace('#', '');
      return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    }
    return null;
  }

  /**
   * @typedef {Object} InkEngineOptions
   * @property {HTMLElement|string} [container] Parent element (or id) for the canvas (standalone mode).
   * @property {number} [width=800] Canvas width in CSS px.
   * @property {number} [height=600] Canvas height in CSS px.
   * @property {number} [pixelDensity=1.6] Framebuffer density (inkField desktop default was 1.6).
   * @property {number} [seed=1234567890] Global seed (strokes reseed from it; recordings carry their own).
   * @property {number[]|string} [background=[222,222,222]] Paper colour.
   * @property {boolean|string} [font=true] true = embedded Inconsolata (needed for grid labels / console
   *   text in WEBGL), false = no text, or a font URL.
   * @property {boolean} [easycam=true] Use the bundled p5.EasyCam like inkField did (camera framing/moves).
   * @property {boolean} [input=true] Bind mouse/pen input of the p5 canvas (standalone mode).
   * @property {'realtime'|'frame'} [clock='realtime'] 'frame' = deterministic 1000/60 ms per drawn frame.
   * @property {boolean} [loop=true] Run p5's draw loop. false = drive frames yourself with step().
   * @property {Object} [toggles] Initial toggles: {paper, grid, futurePath, console, camera}.
   * @property {Object} [flags] Overrides for site globals (doEffect, doSpotNoise, loopWaitDuration…).
   * @property {string} [urlFlags] Emulated location.search for URL-driven effect toggles (e.g. "?_dist:1").
   * @property {function(string,string,Object):void} [onLog] Receives the engine's internal log messages.
   */

  /**
   * inkField ink engine (restored). One instance = one p5 WEBGL canvas with its own state.
   *
   * Standalone:  `const ink = InkEngine.create({ container: 'app', width: 800, height: 600 }); await ink.ready;`
   * Attach:      `const ink = InkEngine.create(p, opts)` inside a p5 instance sketch, then call
   *              ink.preload()/ink.setup()/ink.draw()/ink.mousePressed()/ink.mouseReleased() from the sketch.
   */
  class InkEngine {
    /**
     * @param {p5|InkEngineOptions} [p5OrOptions]
     * @param {InkEngineOptions} [maybeOptions]
     * @returns {InkEngine}
     */
    static create(p5OrOptions, maybeOptions) {
      return new InkEngine(p5OrOptions, maybeOptions);
    }

    constructor(p5OrOptions, maybeOptions) {
      const P5 = typeof p5 !== 'undefined' ? p5 : null;
      const attached = !!(p5OrOptions && (P5 ? p5OrOptions instanceof P5 : typeof p5OrOptions.createCanvas === 'function'));
      const o = Object.assign({}, attached ? maybeOptions : p5OrOptions);
      this.options = o;
      this.mode = attached ? 'attach' : 'standalone';
      this._listeners = {};
      this._domListeners = [];
      this._queue = [];
      this._frame = 0;
      this._destroyed = false;
      const font = o.font === undefined ? true : o.font;
      const self = this;
      this._input = makeInput(o.input === undefined ? !attached || o.input : o.input);
      this._host = {
        width: o.width || 800,
        height: o.height || 600,
        pixelDensity: o.pixelDensity || 1.6,
        seed: o.seed != null ? o.seed : null,
        background: o.background ? toRGB(o.background) : null,
        fontUrl: font === true ? EMBEDDED_FONT_URL : font || null,
        easycam: o.easycam !== false,
        flags: o.flags || null,
        urlFlags: o.urlFlags || '',
        input: this._input,
        now: () => (o.clock === 'frame' ? (self._frame * 1000) / 60 : self.p ? self.p.millis() : 0),
        listen: (target, type, fn, opts) => {
          if (!self._input.enabled) return;
          target.addEventListener(type, fn, opts);
          self._domListeners.push([target, type, fn, opts]);
        },
        emit: (type, detail) => self._emit(type, detail),
        log: (type, msg, data) => {
          if (o.onLog) o.onLog(type, msg, data);
        },
      };
      if (attached) {
        this.ready = new Promise((res) => (this._resolveReady = res));
        this.p = p5OrOptions;
        this.core = createInkCore(this.p, this._host);
      } else {
        if (!P5) throw new Error('InkEngine: p5.js (v1.11.x) must be loaded first');
        this._boot();
      }
    }

    /** (standalone) create the p5 instance + a fresh engine core. */
    _boot() {
      const o = this.options;
      const P5 = p5;
      /** Resolves (with the engine) once setup() finished and the engine can draw. */
      this.ready = new Promise((res) => (this._resolveReady = res));
      this._frame = 0;
      this._queue = [];
      this._destroyed = false;
      this._isReady = false;
      const container = typeof o.container === 'string' ? document.getElementById(o.container) : o.container;
      this._p5 = new P5((p) => {
        this.p = p;
        this.core = createInkCore(p, this._host);
        p.preload = () => this.preload();
        p.setup = () => {
          this.setup();
          if (o.loop === false) p.noLoop();
        };
        p.draw = () => this.draw();
        p.mousePressed = (e) => this.mousePressed(e);
        p.mouseReleased = (e) => this.mouseReleased(e);
      }, container || undefined);
    }

    // ---------------------------------------------------------------- p5 lifecycle (attach mode) --
    /** Load shaders (+ font). Call from p5 preload() in attach mode. */
    preload() {
      this.core.preload();
    }
    /** Create the WEBGL canvas, framebuffers, paper and force map. Call from p5 setup() in attach mode. */
    setup() {
      this.core.setup();
      const t = this.options.toggles;
      if (t) this.setOptions(t);
      this._isReady = true;
      this._resolveReady(this);
    }
    /** Render one frame (brush step → feedback → composite → layers). Call from p5 draw() in attach mode. */
    draw() {
      if (this._destroyed) return;
      this._frame++;
      this._drainQueue();
      this.core.draw();
      this._emit('frame', this._frame);
    }
    /** Forward a p5 mousePressed; presses outside the ink canvas are ignored. */
    mousePressed(e) {
      if (!this._input.enabled || this._input.synthetic) return;
      if (e && e.target && e.target !== this.p.canvas) return;
      this._input.down = true;
      this.core.mousePressed(e);
    }
    /** Forward a p5 mouseReleased. */
    mouseReleased(e) {
      if (!this._input.enabled || this._input.synthetic || !this._input.down) return;
      this._input.down = false;
      this.core.mouseReleased(e);
    }

    // ------------------------------------------------------------------------------ stroke input --
    /**
     * Start a stroke at canvas coordinates (queued; applied before the next frame).
     * @param {number} x @param {number} y
     * @param {{pressure?: number}} [opts] pressure 0..1 enables the original pen-pressure path.
     */
    beginStroke(x, y, opts) {
      this._queue.push({ t: 'down', x, y, pressure: opts && opts.pressure });
      return this;
    }
    /** Move the brush to (x, y). The engine samples one position per frame, like the original. */
    addPoint(x, y, opts) {
      this._queue.push({ t: 'move', x, y, pressure: opts && opts.pressure });
      return this;
    }
    /** Lift the brush; the stroke keeps diffusing for `maxUpdates` frames and is then committed. */
    endStroke(x, y) {
      this._queue.push({ t: 'up', x, y });
      return this;
    }
    /**
     * Queue a whole stroke: one point per frame (points are [x, y] or {x, y, pressure}).
     * In manual mode follow with step(points.length + 40) to let it finish diffusing.
     */
    strokePath(points, opts) {
      const pts = points.map((q) => (Array.isArray(q) ? { x: q[0], y: q[1] } : q));
      if (!pts.length) return this;
      this.beginStroke(pts[0].x, pts[0].y, { pressure: pts[0].pressure });
      for (let i = 1; i < pts.length; i++) this.addPoint(pts[i].x, pts[i].y, { pressure: pts[i].pressure });
      this._queue.push({ t: 'wait' });
      this.endStroke();
      return this;
    }
    _drainQueue() {
      const s = this.core.state;
      const inp = this._input;
      while (this._queue.length) {
        const ev = this._queue.shift();
        if (ev.t === 'wait') break; // hold the last point for one frame before releasing
        if (ev.t === 'down') {
          inp.synthetic = true;
          inp.x = inp.px = ev.x;
          inp.y = inp.py = ev.y;
          this._applyPressure(ev.pressure);
          inp.down = true;
          this.core.mousePressed();
          break; // one input event per frame, like real pointer events between draws
        } else if (ev.t === 'move') {
          inp.px = inp.x;
          inp.py = inp.y;
          inp.x = ev.x;
          inp.y = ev.y;
          s.cursorX = this.core.fn.round2(ev.x);
          s.cursorY = this.core.fn.round2(ev.y);
          this._applyPressure(ev.pressure);
          break;
        } else if (ev.t === 'up') {
          if (ev.x != null) {
            inp.x = ev.x;
            inp.y = ev.y;
          }
          inp.down = false;
          this.core.mouseReleased();
          if (s.stylusDetected) {
            s.penPressure = 0;
            s.pressureNorm = -1;
          }
          if (this._input.enabled) inp.synthetic = false;
          break;
        }
      }
    }
    _applyPressure(p) {
      if (p == null) return;
      const s = this.core.state;
      s.stylusDetected = true;
      s.penPressure = this.core.fn.pressureMedian3(p);
      s.pressureNorm = Math.min(s.penPressure / 0.3, 1.0);
    }

    // ---------------------------------------------------------------------------- brush & colour --
    /**
     * Change brush settings (applies to the next stroke, like the original panel).
     * @param {Object} b
     * @param {number|string} [b.mode] 1-7 or a BRUSH_MODES name.
     * @param {string|number} [b.size] SIZE_NAMES key, or a raw baseBrushSize multiplier.
     * @param {number|string} [b.effect] 0-5 or an INK_EFFECTS name.
     * @param {number|string} [b.blend] 0-3 or a BLEND_MODES name (3 = spectral).
     * @param {number} [b.rotation] path rotation mode 1-3.
     */
    setBrush(b) {
      const f = this.core.fn;
      if (b.mode != null) f.setBrushModeValue(typeof b.mode === 'string' ? BRUSH_MODES[b.mode] : b.mode);
      if (b.size != null) {
        if (typeof b.size === 'string') f.setBrushSizeName(b.size);
        else {
          this.core.state.baseBrushSize = b.size;
          if (this.core.state.pressureBaseBrushSize !== null) this.core.state.pressureBaseBrushSize = b.size;
        }
      }
      if (b.effect != null) f.setInkEffectValue(typeof b.effect === 'string' ? INK_EFFECTS[b.effect] : b.effect);
      if (b.blend != null) f.setBlendModeValue(typeof b.blend === 'string' ? BLEND_MODES[b.blend] : b.blend);
      if (b.rotation != null) f.setPathRotationModeValue(b.rotation);
      return this;
    }
    /** Restore the original panel defaults (brush 1, large, mix, black, rotation 1, blend mix). */
    resetBrush() {
      this.core.fn.resetBrushSettings();
      return this;
    }
    /**
     * Set the ink colour: a COLOR_NAMES name, an index (brushColorMode), or an RGB array / "#rrggbb" (custom).
     */
    setColor(c) {
      const rgb = toRGB(c);
      if (rgb) {
        const cb = this.core.state.customBrushColor;
        cb[0] = rgb[0];
        cb[1] = rgb[1];
        cb[2] = rgb[2];
        this.core.state.brushColorMode = 33;
        this.core.state.whiteBrushMode = false;
      } else if (typeof c === 'number') this.core.fn.setBrushColorName(COLOR_NAMES[c] || 'black');
      else this.core.fn.setBrushColorName(c);
      return this;
    }
    /** Current brush/colour state (read-only snapshot). */
    getBrush() {
      const s = this.core.state;
      return {
        mode: s.brushMode, size: s.baseBrushSize, sizeName: s.brushSizeName, effect: s.useSharpen,
        blend: this.core.win.spectral ? 3 : s.keyBlendMode, rotation: s.pathRotationMode, colorMode: s.brushColorMode,
        color: COLOR_NAMES[s.brushColorMode], customColor: s.customBrushColor.slice(), white: s.whiteBrushMode,
      };
    }

    // ------------------------------------------------------------------------------- toggles etc --
    /**
     * Toggle display features: {paper, grid, futurePath, console, camera} (booleans), background (RGB).
     */
    setOptions(t) {
      const s = this.core.state;
      for (const k in TOGGLES) if (t[k] !== undefined) s[TOGGLES[k]] = !!t[k];
      if (t.background) {
        const rgb = toRGB(t.background);
        const bg = s.canvasBackgroundColor;
        bg[0] = rgb[0];
        bg[1] = rgb[1];
        bg[2] = rgb[2];
        this.core.fn.refreshBackgroundBuffers();
      }
      s.compositeDirty = true;
      return this;
    }

    // ------------------------------------------------------------------------- scenes & playback --
    /**
     * Load a recording/scene (inkField JSON: {randomSeed, canvasSize, canvasBackgroundColor, events:[mp|md|mr|flow|ec]}).
     * Rejects (and emits 'error') when the URL cannot be fetched — e.g. fetch() from a page opened via file:// —
     * or when the data is not an inkField recording.
     * @param {Object|string} scene JSON object, JSON text or URL.
     * @returns {Promise<Object>} the scene object.
     */
    async loadScene(scene) {
      try {
        if (typeof scene === 'string') {
          const txt = scene.trim();
          if (txt.startsWith('{')) scene = JSON.parse(txt);
          else {
            let r;
            try {
              r = await fetch(scene);
            } catch (e) {
              throw new Error(`InkEngine.loadScene: cannot fetch "${scene}" (${e.message})` +
                (typeof location !== 'undefined' && location.protocol === 'file:' ? ' — pages opened via file:// cannot fetch(); pass the JSON object instead or serve the folder over http' : ''));
            }
            if (!r.ok) throw new Error(`InkEngine.loadScene: HTTP ${r.status} for "${scene}"`);
            scene = await r.json();
          }
        }
        if (!scene || !Array.isArray(scene.events)) throw new Error('InkEngine.loadScene: not an inkField recording (missing events[])');
        await this.ready;
        this.core.state.recordingData = scene;
        return scene;
      } catch (err) {
        this._emit('error', err);
        throw err;
      }
    }
    /**
     * Play the loaded (or given) recording through the engine's original playback path.
     * Waits for `ready`; rejects + emits 'error' if the scene cannot be loaded.
     * Coordinates are absolute canvas pixels, exactly like inkField (no scaling). inkField's artist mode
     * reloaded the page at the recording's canvasSize; `fitCanvas: true` does the equivalent (standalone only,
     * via resize()), otherwise the recording plays in place like inkField's collector mode.
     * @param {Object|string} [scene]
     * @param {{loop?: boolean, speed?: number, toggles?: Object, fitCanvas?: boolean}} [opts] `toggles` are re-applied
     *   after the recording's own initialPanelToggles (the original resets them to panel defaults).
     */
    async play(scene, opts) {
      opts = opts || {};
      await this.ready;
      if (scene) await this.loadScene(scene);
      const rec = this.core.state.recordingData;
      if (!rec || !rec.events || !rec.events.length) {
        const err = new Error('InkEngine.play: no recording loaded');
        this._emit('error', err);
        throw err;
      }
      const cs = rec.canvasSize;
      if (opts.fitCanvas && this.mode === 'standalone' && cs && cs.width && cs.height && (cs.width !== this.p.width || cs.height !== this.p.height)) {
        await this.resize(cs.width, cs.height);
        this.core.state.recordingData = rec;
      }
      const s = this.core.state;
      if (opts.speed) s.playbackSpeed = opts.speed;
      this._input.synthetic = true;
      this._input.down = false;
      this.core.fn.startPlayback();
      if (opts.loop !== undefined) this.core.win.loopToggle = opts.loop ? 1 : 0;
      if (opts.toggles) this.setOptions(opts.toggles);
      this._emit('playbackStarted', rec);
      return this;
    }
    /** Stop playback. */
    stop() {
      if (this.core.state.isPlaying) this.core.fn.stopPlayback();
      if (this._input.enabled) this._input.synthetic = false;
      return this;
    }
    /** @returns {boolean} */
    get isPlaying() {
      return !!this.core.state.isPlaying;
    }
    /** Start recording strokes (same JSON format the site exported). */
    record() {
      this.core.fn.startRecording();
      return this;
    }
    /** Stop recording. @returns {Object} the recording (deep copy), also emitted as 'recordingStopped'. */
    stopRecording() {
      this.core.fn.stopRecording();
      return JSON.parse(JSON.stringify(this.core.state.recordingData));
    }

    // ----------------------------------------------------------------------------- frame control --
    /** Advance n frames synchronously (works with loop:false; uses p5 redraw()). */
    step(n) {
      n = n == null ? 1 : n;
      for (let i = 0; i < n && !this._destroyed; i++) {
        if (this.mode === 'standalone') this.p.redraw();
        else this.draw();
      }
      return this;
    }
    /** Alias of step(1). */
    render() {
      return this.step(1);
    }
    /** Clear the paper (original clearCanvas: buffers, typeMap, bug masks, stroke list). */
    clear() {
      if (!this._isReady) return this; // nothing to clear before setup() created the buffers
      this.core.fn.clearCanvas();
      this.core.state.compositeDirty = true;
      return this;
    }
    /** Change canvas size. Standalone only: recreates the engine (canvas content is lost). */
    async resize(width, height) {
      if (this.mode !== 'standalone') throw new Error('InkEngine.resize: only in standalone mode');
      this._teardown();
      this.options.width = this._host.width = width;
      this.options.height = this._host.height = height;
      this._input.down = false;
      this._boot();
      return this.ready;
    }
    /** PNG data URL of the current canvas. */
    snapshot(type) {
      return this.p.canvas.toDataURL(type || 'image/png');
    }
    /** Start the flow (liquify) effect on the last stroke's bounds. blendType as in the site's Flow buttons. */
    flowStart(blendType) {
      this._flowBtn = this._flowBtn || { classList: { add() {}, remove() {} } };
      this.core.fn.flowButtonDown(this._flowBtn, blendType == null ? 0 : blendType);
      return this;
    }
    /** End the flow effect. */
    flowEnd(blendType) {
      if (this._flowBtn) this.core.fn.flowButtonUp(this._flowBtn, blendType == null ? 0 : blendType);
      return this;
    }

    // ------------------------------------------------------------------------------------ events --
    /** Events: 'ready', 'frame', 'playbackStarted', 'playbackEnded', 'recordingStopped', 'error'. */
    on(type, fn) {
      (this._listeners[type] = this._listeners[type] || []).push(fn);
      return this;
    }
    off(type, fn) {
      const l = this._listeners[type];
      if (l) this._listeners[type] = l.filter((f) => f !== fn);
      return this;
    }
    _emit(type, detail) {
      (this._listeners[type] || []).slice().forEach((f) => f(detail, this));
    }
    /** Remove the canvas, p5 instance (standalone) and every DOM listener the engine added. */
    destroy() {
      this._teardown();
      this._listeners = {};
    }
    _teardown() {
      this._destroyed = true;
      this._domListeners.forEach(([t, ty, fn, op]) => t.removeEventListener(ty, fn, op));
      this._domListeners = [];
      if (this._p5) this._p5.remove();
      this._p5 = null;
    }
  }
  InkEngine.BRUSH_MODES = BRUSH_MODES;
  InkEngine.SIZE_NAMES = SIZE_NAMES;
  InkEngine.INK_EFFECTS = INK_EFFECTS;
  InkEngine.BLEND_MODES = BLEND_MODES;
  InkEngine.COLOR_NAMES = COLOR_NAMES;
  InkEngine.SHADERS = SHADER_SOURCES;
  InkEngine.createCore = createInkCore;
  InkEngine.version = '1.0.0-restored';

  return InkEngine;
});
