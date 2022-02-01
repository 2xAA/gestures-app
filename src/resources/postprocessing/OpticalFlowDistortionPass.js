import {
  Mesh,
  OrthographicCamera,
  PlaneBufferGeometry,
  GLSL1,
  Scene,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  RGBAFormat,
  LinearFilter,
  NearestFilter,
  WebGLRenderTarget,
} from "three/src/Three"

import { OpticalFlowDistortionShader } from "../shaders/OpticalFlowDistortionShader.js"
import { Pass } from "./Pass.js"

var OpticalFlowDistortionPass = function (dt_size) {
  Pass.call(this)
  if (OpticalFlowDistortionShader === undefined)
    console.error(
      "THREE.OpticalFlowDistortionPass relies on THREE.OpticalFlowDistortion"
    )
  var shader = OpticalFlowDistortionShader

  this.uniforms = UniformsUtils.clone(shader.uniforms)

  if (dt_size === undefined) dt_size = 64

  this.maskBufferWrite = new WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
      minFilter: LinearFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
    }
  )

  this.maskBufferRead = this.maskBufferWrite.clone()

  this.delayBufferWrite = new WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
      minFilter: LinearFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
    }
  )

  this.delayBufferRead = this.delayBufferWrite.clone()

  this.uniforms["maskBuffer"].value = this.maskBufferRead.texture
  this.uniforms["delayBuffer"].value = this.delayBufferRead.texture

  this.uniforms["resolution"].value = new Vector2(
    window.innerWidth,
    window.innerHeight
  )

  this.material = new ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    glslVersion: GLSL1,
  })

  this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  this.scene = new Scene()
  this.quad = new Mesh(new PlaneBufferGeometry(2, 2), null)
  this.quad.frustumCulled = false // Avoid getting clipped
  this.scene.add(this.quad)
  this.factor = 0
  this.time = 0
}

OpticalFlowDistortionPass.prototype = Object.assign(
  Object.create(Pass.prototype),
  {
    constructor: OpticalFlowDistortionPass,

    render: function (
      renderer,
      writeBuffer,
      readBuffer,
      deltaTime,
      maskActive
    ) {
      this.uniforms["inputImage"].value = readBuffer.texture

      this.uniforms["TIME"].value = this.time
      this.uniforms["TIMEDELTA"].value = deltaTime

      this.time += 0.05
      this.quad.material = this.material
      if (this.renderToScreen) {
        renderer.setRenderTarget(null)
        renderer.render(this.scene, this.camera)
      } else {
        for (let i = 0; i < 3; i += 1) {
          this.uniforms["PASSINDEX"].value = i
          let temp

          temp = this.maskBufferRead
          this.maskBufferRead = this.maskBufferWrite
          this.maskBufferWrite = temp

          temp = this.delayBufferRead
          this.delayBufferRead = this.delayBufferWrite
          this.delayBufferWrite = temp

          this.uniforms["maskBuffer"].value = this.maskBufferRead.texture
          this.uniforms["delayBuffer"].value = this.delayBufferRead.texture

          if (i === 0) {
            this.uniforms["resolution"].value = new Vector2(
              readBuffer.width,
              readBuffer.height
            )
            renderer.setRenderTarget(this.maskBufferWrite)
          } else if (i === 1) {
            this.uniforms["resolution"].value = new Vector2(
              readBuffer.width,
              readBuffer.height
            )
            renderer.setRenderTarget(this.delayBufferWrite)
          } else if (i === 2) {
            this.uniforms["resolution"].value = new Vector2(
              readBuffer.width,
              readBuffer.height
            )
            renderer.setRenderTarget(writeBuffer)
          }

          // if (this.clear) renderer.clear()
          renderer.render(this.scene, this.camera)
        }
      }
    },
  }
)

export { OpticalFlowDistortionPass }
