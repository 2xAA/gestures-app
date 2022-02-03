import { ShaderMaterial, WebGLRenderTarget } from "three/src/Three"

class Buffer {
  constructor(name, width = 256, height = 256, options = {}) {
    this.name = name

    this.writeBuffer = new WebGLRenderTarget(width, height, {
      ...options,
    })

    this.readBuffer = this.writeBuffer.clone()
  }

  swap() {
    this.setBuffers(...[this.writeBuffer, this.readBuffer].reverse())
  }

  setBuffers(read, write) {
    this.readBuffer = read
    this.writeBuffer = write
  }
}

// {
//   passIndexUniform: "PASSINDEX",
//
//   uniforms: {
//     ...
//   },

//   passes: [
//     { fragmentShader?, vertexShader?, buffer?: {name:'', width?, height?, options?}, uniforms? ...shaderMaterialProperties },
//     () => ({frag?, vert?, bufferName? })
//   ],
// }

export class MultiPassShaderPass {
  constructor(args) {
    this.uniforms = {}
    this.buffers = {}
    this.shaders = []
    this.passesLength = 0
    this.passes = []
    this.passIndexUniform = ""

    this.setup(args)
  }

  setup({ passIndexUniform = "PASSINDEX", uniforms = {}, passes = [] }) {
    this.uniforms = uniforms
    this.passesLength = passes.length
    this.passIndexUniform = passIndexUniform

    let lastPassWithShaders = 0
    for (let i = 0; i < this.passesLength; i += 1) {
      const pass = passes[i]
      let passData

      if (typeof pass === "function") {
        passData = pass()
      } else {
        passData = { ...pass }
      }

      if (passData.fragmentShader && passData.vertexShader) {
        const material = new ShaderMaterial(pass)
        passData.material = material
        lastPassWithShaders = i
      } else if (i === 0) {
        throw new Error("First pass must have fragmentShader and vertexShader")
      } else {
        passData.useShaderFromPass = lastPassWithShaders
      }

      if (passData.buffer) {
        const bufferOptions = passData.buffer
        const buffer = new Buffer(
          bufferOptions.name,
          bufferOptions.width,
          bufferOptions.height,
          bufferOptions.options
        )
        this.buffers[bufferOptions.name] = buffer
      }

      this.passes.push(passData)
    }
  }

  render(
    { scene, camera },
    { renderer, writeBuffer, readBuffer, deltaTime, maskActive }
  ) {
    for (let i = 0; i < this.passesLength; i += 1) {
      this.uniforms[this.passIndexUniform].value = i
      const passData = this.passes[i]

      if (passData.buffer) {
        const { name } = passData.buffer
        this.buffers[name].swap()
        this.uniforms[name] = this.buffers[name].read
        renderer.setRenderTarget(this.buffers[name].write)
      }

      renderer.setRenderTarget(writeBuffer)
      renderer.render(scene, camera)
    }
  }
}
