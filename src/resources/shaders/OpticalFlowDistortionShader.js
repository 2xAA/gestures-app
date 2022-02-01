import { Vector4 } from "three/src/Three"

var OpticalFlowDistortionShader = {
  uniforms: {
    resolution: { type: "v2", value: null },

    PASSINDEX: {
      type: "i",
      value: 0,
      name: "PASSINDEX",
    },
    RENDERSIZE: {
      type: "v2",
      value: null,
      name: "RENDERSIZE",
    },
    TIME: {
      type: "f",
      value: 0,
      name: "TIME",
    },
    TIMEDELTA: {
      type: "f",
      value: 0,
      name: "TIMEDELTA",
    },
    FRAMEINDEX: {
      type: "i",
      value: 0,
      name: "FRAMEINDEX",
    },
    DATE: {
      type: "v4",
      value: new Vector4(0, 0, 0, 0),
      name: "DATE",
    },
    inputImage: {
      type: "t",
      value: null,
      name: "inputImage",
    },
    _inputImage_imgRect: {
      type: "v4",
      value: new Vector4(0, 0, 1, 1),
      name: "_inputImage_imgRect",
    },
    // _inputImage_imgSize: {
    //   type: "v2",
    //   value: [0, 0],
    //   name: "_inputImage_imgSize",
    // },
    _inputImage_flip: {
      type: "i",
      value: 0,
      name: "_inputImage_flip",
    },
    amt: {
      type: "f",
      value: 0.9,
      name: "amt",
    },
    maskHold: {
      type: "f",
      value: 0.99,
      name: "maskHold",
    },
    inputScale: {
      type: "f",
      value: 2,
      name: "inputScale",
    },
    inputOffset: {
      type: "f",
      value: 0.1,
      name: "inputOffset",
    },
    inputLambda: {
      type: "f",
      value: 1,
      name: "inputLambda",
    },
    maskBuffer: {
      type: "t",
      value: null,
      name: "maskBuffer",
    },
    _maskBuffer_imgRect: {
      type: "v4",
      value: new Vector4(0, 0, 1, 1),
      name: "_maskBuffer_imgRect",
    },
    // _maskBuffer_imgSize: {
    //   type: "v2",
    //   value: [0, 0],
    //   name: "_maskBuffer_imgSize",
    // },
    _maskBuffer_flip: {
      type: "i",
      value: 0,
      name: "_maskBuffer_flip",
    },
    delayBuffer: {
      type: "t",
      value: null,
      name: "delayBuffer",
    },
    _delayBuffer_imgRect: {
      type: "v4",
      value: new Vector4(0, 0, 1, 1),
      name: "_delayBuffer_imgRect",
    },
    // _delayBuffer_imgSize: {
    //   type: "v2",
    //   value: [0, 0],
    //   name: "_delayBuffer_imgSize",
    // },
    _delayBuffer_flip: {
      type: "i",
      value: 0,
      name: "_delayBuffer_flip",
    },
  },

  vertexShader: `precision highp float;
    precision highp int;
    void isf_vertShaderInit();
    
    attribute vec2 isf_position; // -1..1
    
    uniform int     PASSINDEX;
    // uniform vec2    RENDERSIZE;
    uniform vec2    resolution;
    vec2 RENDERSIZE = resolution;

    varying vec2    isf_FragNormCoord; // 0..1
    vec2    isf_fragCoord; // Pixel Space
    
    uniform sampler2D inputImage;
    uniform vec4 _inputImage_imgRect;
    // uniform vec2 _inputImage_imgSize;
    vec2 _inputImage_imgSize = resolution;
    uniform bool _inputImage_flip;
    varying vec2 _inputImage_normTexCoord;
    varying vec2 _inputImage_texCoord;
    
    
    uniform float amt;
    uniform float maskHold;
    uniform float inputScale;
    uniform float inputOffset;
    uniform float inputLambda;
    uniform sampler2D maskBuffer;
    uniform vec4 _maskBuffer_imgRect;
    // uniform vec2 _maskBuffer_imgSize;
    vec2 _maskBuffer_imgSize = resolution;
    uniform bool _maskBuffer_flip;
    varying vec2 _maskBuffer_normTexCoord;
    varying vec2 _maskBuffer_texCoord;
    
    
    uniform sampler2D delayBuffer;
    uniform vec4 _delayBuffer_imgRect;
    // uniform vec2 _delayBuffer_imgSize;
    vec2 _delayBuffer_imgSize = resolution;
    uniform bool _delayBuffer_flip;
    varying vec2 _delayBuffer_normTexCoord;
    varying vec2 _delayBuffer_texCoord;
    
    
    
    
    varying vec2 left_coord;
    varying vec2 right_coord;
    varying vec2 above_coord;
    varying vec2 below_coord;
    
    varying vec2 lefta_coord;
    varying vec2 righta_coord;
    varying vec2 leftb_coord;
    varying vec2 rightb_coord;

    varying vec2 vUv;
    
    void main()
    {
      isf_vertShaderInit();
      vec2 texc = vec2(isf_FragNormCoord[0],isf_FragNormCoord[1]);
      vec2 d = 4.0/RENDERSIZE;
    
      left_coord = clamp(vec2(texc.xy + vec2(-d.x , 0)),0.0,1.0);
      right_coord = clamp(vec2(texc.xy + vec2(d.x , 0)),0.0,1.0);
      above_coord = clamp(vec2(texc.xy + vec2(0,d.y)),0.0,1.0);
      below_coord = clamp(vec2(texc.xy + vec2(0,-d.y)),0.0,1.0);
    
      lefta_coord = clamp(vec2(texc.xy + vec2(-d.x , d.x)),0.0,1.0);
      righta_coord = clamp(vec2(texc.xy + vec2(d.x , d.x)),0.0,1.0);
      leftb_coord = clamp(vec2(texc.xy + vec2(-d.x , -d.x)),0.0,1.0);
      rightb_coord = clamp(vec2(texc.xy + vec2(d.x , -d.x)),0.0,1.0);
    }
    void isf_vertShaderInit(void)  {
      // gl_Position = vec4( isf_position, 0.0, 1.0 );

      vUv = uv; 
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
      
      isf_FragNormCoord = vec2((gl_Position.x+1.0)/2.0, (gl_Position.y+1.0)/2.0);
      isf_fragCoord = floor(isf_FragNormCoord * RENDERSIZE);
      
    _inputImage_texCoord =
        vec2(((isf_fragCoord.x / _inputImage_imgSize.x * _inputImage_imgRect.z) + _inputImage_imgRect.x), 
              (isf_fragCoord.y / _inputImage_imgSize.y * _inputImage_imgRect.w) + _inputImage_imgRect.y);
    
    _inputImage_normTexCoord =
      vec2((((isf_FragNormCoord.x * _inputImage_imgSize.x) / _inputImage_imgSize.x * _inputImage_imgRect.z) + _inputImage_imgRect.x),
              ((isf_FragNormCoord.y * _inputImage_imgSize.y) / _inputImage_imgSize.y * _inputImage_imgRect.w) + _inputImage_imgRect.y);
    
    }`,

  fragmentShader: `precision highp float;
    precision highp int;
    
    uniform int PASSINDEX;
    // uniform vec2 RENDERSIZE;
    uniform vec2    resolution;
    vec2 RENDERSIZE = resolution;

    varying vec2 isf_FragNormCoord;
    varying vec2 isf_FragCoord;
    uniform float TIME;
    uniform float TIMEDELTA;
    uniform int FRAMEINDEX;
    uniform vec4 DATE;
    
    uniform sampler2D inputImage;
    uniform vec4 _inputImage_imgRect;
    // uniform vec2 _inputImage_imgSize;
    vec2 _inputImage_imgSize = resolution;
    uniform bool _inputImage_flip;
    varying vec2 _inputImage_normTexCoord;
    varying vec2 _inputImage_texCoord;
    
    
    uniform float amt;
    uniform float maskHold;
    uniform float inputScale;
    uniform float inputOffset;
    uniform float inputLambda;
    uniform sampler2D maskBuffer;
    uniform vec4 _maskBuffer_imgRect;
    // uniform vec2 _maskBuffer_imgSize;
    vec2 _maskBuffer_imgSize = resolution;
    uniform bool _maskBuffer_flip;
    varying vec2 _maskBuffer_normTexCoord;
    varying vec2 _maskBuffer_texCoord;
    
    
    uniform sampler2D delayBuffer;
    uniform vec4 _delayBuffer_imgRect;
    // uniform vec2 _delayBuffer_imgSize;
    vec2 _delayBuffer_imgSize = resolution;
    uniform bool _delayBuffer_flip;
    varying vec2 _delayBuffer_normTexCoord;
    varying vec2 _delayBuffer_texCoord;
    
    // We don't need 2DRect functions since we control all inputs.  Don't need flip either, but leaving
    // for consistency sake.
    vec4 VVSAMPLER_2DBYPIXEL(sampler2D sampler, vec4 samplerImgRect, vec2 samplerImgSize, bool samplerFlip, vec2 loc) {
      return (samplerFlip)
        ? texture2D   (sampler,vec2(((loc.x/samplerImgSize.x*samplerImgRect.z)+samplerImgRect.x), (samplerImgRect.w-(loc.y/samplerImgSize.y*samplerImgRect.w)+samplerImgRect.y)))
        : texture2D   (sampler,vec2(((loc.x/samplerImgSize.x*samplerImgRect.z)+samplerImgRect.x), ((loc.y/samplerImgSize.y*samplerImgRect.w)+samplerImgRect.y)));
    }
    vec4 VVSAMPLER_2DBYNORM(sampler2D sampler, vec4 samplerImgRect, vec2 samplerImgSize, bool samplerFlip, vec2 normLoc)  {
      vec4    returnMe = VVSAMPLER_2DBYPIXEL(   sampler,samplerImgRect,samplerImgSize,samplerFlip,vec2(normLoc.x*samplerImgSize.x, normLoc.y*samplerImgSize.y));
      return returnMe;
    }
    
    
    
    
    varying vec2 left_coord;
    varying vec2 right_coord;
    varying vec2 above_coord;
    varying vec2 below_coord;
    
    varying vec2 lefta_coord;
    varying vec2 righta_coord;
    varying vec2 leftb_coord;
    varying vec2 rightb_coord;
    
    
    //	based on v002 Optical Flow which is itself a port of Andrew Bensons HS Flow implementation on the GPU.
    //	https://github.com/v002/v002-Optical-Flow
    
    
    const vec4 coeffs = vec4(0.2126, 0.7152, 0.0722, 1.0);
    
    float gray(vec4 n)
    {
      return (n.r + n.g + n.b)/3.0;
    }
    
    void main()
    {
      //	on the first pass generate the mask using the previous delayBuffer and inputImage
      //	on the 2nd pass update the delayBuffer to hold inputImage
      //	on the 3rd pass output the new mask
      if (PASSINDEX == 0)	{
        if ((FRAMEINDEX == 0))	{
          gl_FragColor = vec4(0.5);
        }
        //	convert to grayscale
        vec4 a = texture2D(inputImage, isf_FragNormCoord) * coeffs;
        float brightness = gray(a);
        a = vec4(brightness);
        vec4 b = texture2D(delayBuffer, isf_FragNormCoord) * coeffs;
        brightness = gray(b);
        b = vec4(brightness);
        
        vec2 x1 = vec2(inputOffset * RENDERSIZE.x, 0.0);
        vec2 y1 = vec2(0.0,inputOffset * RENDERSIZE.y);
        vec2 texcoord0 = isf_FragNormCoord.xy * RENDERSIZE;
        vec2 texcoord1 = isf_FragNormCoord.xy * RENDERSIZE;
        
        //get the difference
        vec4 curdif = b-a;
      
        //calculate the gradient
        vec4 gradx = texture2D(delayBuffer, (texcoord1+x1) / RENDERSIZE)-texture2D(delayBuffer, (texcoord1-x1) / RENDERSIZE);
        gradx += texture2D(inputImage, (texcoord0+x1) / RENDERSIZE)-texture2D(inputImage, (texcoord0-x1) / RENDERSIZE);
      
        vec4 grady = texture2D(delayBuffer, (texcoord1+y1) / RENDERSIZE)-texture2D(delayBuffer, (texcoord1-y1) / RENDERSIZE);
        grady += texture2D(inputImage, (texcoord0+y1) / RENDERSIZE)-texture2D(inputImage, (texcoord0-y1) / RENDERSIZE);
      
        vec4 gradmag = sqrt((gradx*gradx)+(grady*grady)+vec4(inputLambda));
    
        vec4 vx = curdif*(gradx/gradmag);
        float vxd = gray(vx);//assumes greyscale
        //format output for flowrepos, out(-x,+x,-y,+y)
        vec2 xout = vec2(max(vxd,0.),abs(min(vxd,0.)))*inputScale;
    
        vec4 vy = curdif*(grady/gradmag);
        float vyd = gray(vy);//assumes greyscale
        //format output for flowrepos, out(-x,+x,-y,+y)
        vec2 yout = vec2(max(vyd,0.),abs(min(vyd,0.)))*inputScale;
      
        vec4 mask = clamp(vec4(xout.xy,yout.xy), 0.0, 1.0);
        
        vec4 color = texture2D(maskBuffer, isf_FragNormCoord);
        vec4 colorL = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, left_coord);
        vec4 colorR = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, right_coord);
        vec4 colorA = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, above_coord);
        vec4 colorB = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, below_coord);
    
        vec4 colorLA = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, lefta_coord);
        vec4 colorRA = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, righta_coord);
        vec4 colorLB = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, leftb_coord);
        vec4 colorRB = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, rightb_coord);
    
        //	blur the feedback buffer
        vec4 blurVector = (color + colorL + colorR + colorA + colorB + colorLA + colorRA + colorLB + colorRB) / 9.0;
        gl_FragColor = mask + maskHold * blurVector;
      }
      else if (PASSINDEX == 1)	{	
        //	here we just buffer the current frame for next time
        gl_FragColor = texture2D(inputImage, isf_FragNormCoord);
      }
      else	{
        //	NOW DO SOMETHING WITH THE MASK - BLUR THE IMAGE AND THE MASK IMAGE
        
        //	blur the mask image
        vec2 texcoord0 = isf_FragNormCoord.xy;
        
        vec4 color = texture2D(maskBuffer, isf_FragNormCoord);
        vec4 colorL = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, left_coord);
        vec4 colorR = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, right_coord);
        vec4 colorA = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, above_coord);
        vec4 colorB = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, below_coord);
    
        vec4 colorLA = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, lefta_coord);
        vec4 colorRA = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, righta_coord);
        vec4 colorLB = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, leftb_coord);
        vec4 colorRB = VVSAMPLER_2DBYNORM(maskBuffer, _maskBuffer_imgRect, _maskBuffer_imgSize, _maskBuffer_flip, rightb_coord);
        
        vec4 blurVector = (color + colorL + colorR + colorA + colorB + colorLA + colorRA + colorLB + colorRB) / 9.0;
        //vec4 blurVector = texture2D(maskBuffer, isf_FragNormCoord);
        
        vec2 blurAmount = vec2(blurVector.y-blurVector.x, blurVector.w-blurVector.z);
        vec2 tmp = texcoord0 + blurAmount * amt;
        tmp.x = clamp(tmp.x,0.0,1.0);
        tmp.y = clamp(tmp.y,0.0,1.0);
        vec4 sample0 = VVSAMPLER_2DBYNORM(inputImage, _inputImage_imgRect, _inputImage_imgSize, _inputImage_flip, tmp);
        tmp = (1.02 + texcoord0) + blurAmount * amt * amt;
        tmp.x = clamp(tmp.x,0.0,1.0);
        tmp.y = clamp(tmp.y,0.0,1.0);
        vec4 sample1 = VVSAMPLER_2DBYNORM(inputImage, _inputImage_imgRect, _inputImage_imgSize, _inputImage_flip, tmp);
        gl_FragColor = (sample0 * 3.0 + sample1) / 4.0;
      }
    }
    `,
}

export { OpticalFlowDistortionShader }
