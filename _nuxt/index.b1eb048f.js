var k={},M={},p={};Object.defineProperty(p,"__esModule",{value:!0});p.output=p.exists=p.hash=p.bytes=p.bool=p.number=void 0;function S(t){if(!Number.isSafeInteger(t)||t<0)throw new Error(`Wrong positive integer: ${t}`)}p.number=S;function W(t){if(typeof t!="boolean")throw new Error(`Expected boolean, not ${t}`)}p.bool=W;function N(t,...n){if(!(t instanceof Uint8Array))throw new Error("Expected Uint8Array");if(n.length>0&&!n.includes(t.length))throw new Error(`Expected Uint8Array of length ${n}, not of length=${t.length}`)}p.bytes=N;function z(t){if(typeof t!="function"||typeof t.create!="function")throw new Error("Hash should be wrapped by utils.wrapConstructor");S(t.outputLen),S(t.blockLen)}p.hash=z;function $(t,n=!0){if(t.destroyed)throw new Error("Hash instance has been destroyed");if(n&&t.finished)throw new Error("Hash#digest() has already been called")}p.exists=$;function G(t,n){N(t);const s=n.outputLen;if(t.length<s)throw new Error(`digestInto() expects output buffer of length at least ${s}`)}p.output=G;const P={number:S,bool:W,bytes:N,hash:z,exists:$,output:G};p.default=P;var D={},V={};Object.defineProperty(V,"__esModule",{value:!0});V.crypto=void 0;V.crypto=typeof globalThis=="object"&&"crypto"in globalThis?globalThis.crypto:void 0;(function(t){/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */Object.defineProperty(t,"__esModule",{value:!0}),t.randomBytes=t.wrapXOFConstructorWithOpts=t.wrapConstructorWithOpts=t.wrapConstructor=t.checkOpts=t.Hash=t.concatBytes=t.toBytes=t.utf8ToBytes=t.asyncLoop=t.nextTick=t.hexToBytes=t.bytesToHex=t.isLE=t.rotr=t.createView=t.u32=t.u8=void 0;const n=V,s=e=>e instanceof Uint8Array,o=e=>new Uint8Array(e.buffer,e.byteOffset,e.byteLength);t.u8=o;const a=e=>new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4));t.u32=a;const u=e=>new DataView(e.buffer,e.byteOffset,e.byteLength);t.createView=u;const i=(e,r)=>e<<32-r|e>>>r;if(t.rotr=i,t.isLE=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68,!t.isLE)throw new Error("Non little-endian hardware is not supported");const h=Array.from({length:256},(e,r)=>r.toString(16).padStart(2,"0"));function b(e){if(!s(e))throw new Error("Uint8Array expected");let r="";for(let l=0;l<e.length;l++)r+=h[e[l]];return r}t.bytesToHex=b;function y(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);const r=e.length;if(r%2)throw new Error("padded hex string expected, got unpadded hex of length "+r);const l=new Uint8Array(r/2);for(let d=0;d<l.length;d++){const L=d*2,H=e.slice(L,L+2),F=Number.parseInt(H,16);if(Number.isNaN(F)||F<0)throw new Error("Invalid byte sequence");l[d]=F}return l}t.hexToBytes=y;const A=async()=>{};t.nextTick=A;async function f(e,r,l){let d=Date.now();for(let L=0;L<e;L++){l(L);const H=Date.now()-d;H>=0&&H<r||(await(0,t.nextTick)(),d+=H)}}t.asyncLoop=f;function B(e){if(typeof e!="string")throw new Error(`utf8ToBytes expected string, got ${typeof e}`);return new Uint8Array(new TextEncoder().encode(e))}t.utf8ToBytes=B;function c(e){if(typeof e=="string"&&(e=B(e)),!s(e))throw new Error(`expected Uint8Array, got ${typeof e}`);return e}t.toBytes=c;function w(...e){const r=new Uint8Array(e.reduce((d,L)=>d+L.length,0));let l=0;return e.forEach(d=>{if(!s(d))throw new Error("Uint8Array expected");r.set(d,l),l+=d.length}),r}t.concatBytes=w;class x{clone(){return this._cloneInto()}}t.Hash=x;const v=e=>Object.prototype.toString.call(e)==="[object Object]"&&e.constructor===Object;function E(e,r){if(r!==void 0&&(typeof r!="object"||!v(r)))throw new Error("Options should be object or undefined");return Object.assign(e,r)}t.checkOpts=E;function U(e){const r=d=>e().update(c(d)).digest(),l=e();return r.outputLen=l.outputLen,r.blockLen=l.blockLen,r.create=()=>e(),r}t.wrapConstructor=U;function g(e){const r=(d,L)=>e(L).update(c(d)).digest(),l=e({});return r.outputLen=l.outputLen,r.blockLen=l.blockLen,r.create=d=>e(d),r}t.wrapConstructorWithOpts=g;function _(e){const r=(d,L)=>e(L).update(c(d)).digest(),l=e({});return r.outputLen=l.outputLen,r.blockLen=l.blockLen,r.create=d=>e(d),r}t.wrapXOFConstructorWithOpts=_;function O(e=32){if(n.crypto&&typeof n.crypto.getRandomValues=="function")return n.crypto.getRandomValues(new Uint8Array(e));throw new Error("crypto.getRandomValues must be defined")}t.randomBytes=O})(D);Object.defineProperty(M,"__esModule",{value:!0});M.SHA2=void 0;const I=p,j=D;function X(t,n,s,o){if(typeof t.setBigUint64=="function")return t.setBigUint64(n,s,o);const a=BigInt(32),u=BigInt(4294967295),i=Number(s>>a&u),h=Number(s&u),b=o?4:0,y=o?0:4;t.setUint32(n+b,i,o),t.setUint32(n+y,h,o)}class q extends j.Hash{constructor(n,s,o,a){super(),this.blockLen=n,this.outputLen=s,this.padOffset=o,this.isLE=a,this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.buffer=new Uint8Array(n),this.view=(0,j.createView)(this.buffer)}update(n){I.default.exists(this);const{view:s,buffer:o,blockLen:a}=this;n=(0,j.toBytes)(n);const u=n.length;for(let i=0;i<u;){const h=Math.min(a-this.pos,u-i);if(h===a){const b=(0,j.createView)(n);for(;a<=u-i;i+=a)this.process(b,i);continue}o.set(n.subarray(i,i+h),this.pos),this.pos+=h,i+=h,this.pos===a&&(this.process(s,0),this.pos=0)}return this.length+=n.length,this.roundClean(),this}digestInto(n){I.default.exists(this),I.default.output(n,this),this.finished=!0;const{buffer:s,view:o,blockLen:a,isLE:u}=this;let{pos:i}=this;s[i++]=128,this.buffer.subarray(i).fill(0),this.padOffset>a-i&&(this.process(o,0),i=0);for(let f=i;f<a;f++)s[f]=0;X(o,a-8,BigInt(this.length*8),u),this.process(o,0);const h=(0,j.createView)(n),b=this.outputLen;if(b%4)throw new Error("_sha2: outputLen should be aligned to 32bit");const y=b/4,A=this.get();if(y>A.length)throw new Error("_sha2: outputLen bigger than state");for(let f=0;f<y;f++)h.setUint32(4*f,A[f],u)}digest(){const{buffer:n,outputLen:s}=this;this.digestInto(n);const o=n.slice(0,s);return this.destroy(),o}_cloneInto(n){n||(n=new this.constructor),n.set(...this.get());const{blockLen:s,buffer:o,length:a,finished:u,destroyed:i,pos:h}=this;return n.length=a,n.pos=h,n.finished=u,n.destroyed=i,a%s&&n.buffer.set(o),n}}M.SHA2=q;Object.defineProperty(k,"__esModule",{value:!0});k.sha224=k.sha256=void 0;const K=M,m=D,J=(t,n,s)=>t&n^~t&s,Q=(t,n,s)=>t&n^t&s^n&s,Y=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),C=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),T=new Uint32Array(64);class R extends K.SHA2{constructor(){super(64,32,8,!1),this.A=C[0]|0,this.B=C[1]|0,this.C=C[2]|0,this.D=C[3]|0,this.E=C[4]|0,this.F=C[5]|0,this.G=C[6]|0,this.H=C[7]|0}get(){const{A:n,B:s,C:o,D:a,E:u,F:i,G:h,H:b}=this;return[n,s,o,a,u,i,h,b]}set(n,s,o,a,u,i,h,b){this.A=n|0,this.B=s|0,this.C=o|0,this.D=a|0,this.E=u|0,this.F=i|0,this.G=h|0,this.H=b|0}process(n,s){for(let f=0;f<16;f++,s+=4)T[f]=n.getUint32(s,!1);for(let f=16;f<64;f++){const B=T[f-15],c=T[f-2],w=(0,m.rotr)(B,7)^(0,m.rotr)(B,18)^B>>>3,x=(0,m.rotr)(c,17)^(0,m.rotr)(c,19)^c>>>10;T[f]=x+T[f-7]+w+T[f-16]|0}let{A:o,B:a,C:u,D:i,E:h,F:b,G:y,H:A}=this;for(let f=0;f<64;f++){const B=(0,m.rotr)(h,6)^(0,m.rotr)(h,11)^(0,m.rotr)(h,25),c=A+B+J(h,b,y)+Y[f]+T[f]|0,x=((0,m.rotr)(o,2)^(0,m.rotr)(o,13)^(0,m.rotr)(o,22))+Q(o,a,u)|0;A=y,y=b,b=h,h=i+c|0,i=u,u=a,a=o,o=c+x|0}o=o+this.A|0,a=a+this.B|0,u=u+this.C|0,i=i+this.D|0,h=h+this.E|0,b=b+this.F|0,y=y+this.G|0,A=A+this.H|0,this.set(o,a,u,i,h,b,y,A)}roundClean(){T.fill(0)}destroy(){this.set(0,0,0,0,0,0,0,0),this.buffer.fill(0)}}class Z extends R{constructor(){super(),this.A=-1056596264,this.B=914150663,this.C=812702999,this.D=-150054599,this.E=-4191439,this.F=1750603025,this.G=1694076839,this.H=-1090891868,this.outputLen=28}}k.sha256=(0,m.wrapConstructor)(()=>new R);k.sha224=(0,m.wrapConstructor)(()=>new Z);function tt(t){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var o=0;o<t.length;o++){var a=t.charAt(o),u=a.charCodeAt(0);if(n[u]!==255)throw new TypeError(a+" is ambiguous");n[u]=o}var i=t.length,h=t.charAt(0),b=Math.log(i)/Math.log(256),y=Math.log(256)/Math.log(i);function A(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var w=0,x=0,v=0,E=c.length;v!==E&&c[v]===0;)v++,w++;for(var U=(E-v)*y+1>>>0,g=new Uint8Array(U);v!==E;){for(var _=c[v],O=0,e=U-1;(_!==0||O<x)&&e!==-1;e--,O++)_+=256*g[e]>>>0,g[e]=_%i>>>0,_=_/i>>>0;if(_!==0)throw new Error("Non-zero carry");x=O,v++}for(var r=U-x;r!==U&&g[r]===0;)r++;for(var l=h.repeat(w);r<U;++r)l+=t.charAt(g[r]);return l}function f(c){if(typeof c!="string")throw new TypeError("Expected String");if(c.length===0)return new Uint8Array;for(var w=0,x=0,v=0;c[w]===h;)x++,w++;for(var E=(c.length-w)*b+1>>>0,U=new Uint8Array(E);c[w];){var g=n[c.charCodeAt(w)];if(g===255)return;for(var _=0,O=E-1;(g!==0||_<v)&&O!==-1;O--,_++)g+=i*U[O]>>>0,U[O]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-zero carry");v=_,w++}for(var e=E-v;e!==E&&U[e]===0;)e++;for(var r=new Uint8Array(x+(E-e)),l=x;e!==E;)r[l++]=U[e++];return r}function B(c){var w=f(c);if(w)return w;throw new Error("Non-base"+i+" character")}return{encode:A,decodeUnsafe:f,decode:B}}var et=tt;const nt=et,rt="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";var ot=nt(rt);export{ot as b,k as s};