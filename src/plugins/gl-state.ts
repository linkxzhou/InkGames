export function withGLState<T>(gl: WebGL2RenderingContext, action: () => T): T {
  const get = (name: number) => gl.getParameter(name);
  const state = {
    program: get(gl.CURRENT_PROGRAM) as WebGLProgram | null,
    framebuffer: get(gl.FRAMEBUFFER_BINDING) as WebGLFramebuffer | null,
    readFramebuffer: get(gl.READ_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null,
    vertexArray: get(gl.VERTEX_ARRAY_BINDING) as WebGLVertexArrayObject | null,
    arrayBuffer: get(gl.ARRAY_BUFFER_BINDING) as WebGLBuffer | null,
    activeTexture: get(gl.ACTIVE_TEXTURE) as number,
    textures: [] as Array<WebGLTexture | null>,
    textureActive: get(gl.TEXTURE_BINDING_2D) as WebGLTexture | null,
    viewport: get(gl.VIEWPORT) as Int32Array,
    scissorBox: get(gl.SCISSOR_BOX) as Int32Array,
    scissor: gl.isEnabled(gl.SCISSOR_TEST),
    blend: gl.isEnabled(gl.BLEND),
    depth: gl.isEnabled(gl.DEPTH_TEST),
    stencil: gl.isEnabled(gl.STENCIL_TEST),
    blendRgb: get(gl.BLEND_EQUATION_RGB) as number,
    blendAlpha: get(gl.BLEND_EQUATION_ALPHA) as number,
    blendSrcRgb: get(gl.BLEND_SRC_RGB) as number,
    blendDstRgb: get(gl.BLEND_DST_RGB) as number,
    blendSrcAlpha: get(gl.BLEND_SRC_ALPHA) as number,
    blendDstAlpha: get(gl.BLEND_DST_ALPHA) as number,
    colorMask: get(gl.COLOR_WRITEMASK) as boolean[],
    clearColor: get(gl.COLOR_CLEAR_VALUE) as Float32Array,
    unpackFlip: get(gl.UNPACK_FLIP_Y_WEBGL) as boolean,
    unpackPremultiply: get(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL) as boolean,
    depthFunc: get(gl.DEPTH_FUNC) as number,
  };
  for (let unit = 0; unit < 3; unit++) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    state.textures.push(get(gl.TEXTURE_BINDING_2D) as WebGLTexture | null);
  }
  gl.activeTexture(state.activeTexture);
  try { return action(); }
  finally {
    // 上下文丢失后 getParameter 会返回 null（plan/09 §10 冒烟暴露）：
    // 此时任何恢复调用都无效，跳过以免抛出 "viewport is not iterable" 这类误导弹错。
    if (!gl.isContextLost()) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, state.framebuffer);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, state.readFramebuffer);
    gl.useProgram(state.program);
    gl.bindVertexArray(state.vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, state.arrayBuffer);
    for (let unit = 0; unit < state.textures.length; unit++) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, state.textures[unit]);
    }
    gl.activeTexture(state.activeTexture);
    gl.bindTexture(gl.TEXTURE_2D, state.textureActive);
    gl.viewport(...state.viewport as unknown as [number, number, number, number]);
    gl.scissor(...state.scissorBox as unknown as [number, number, number, number]);
    gl.blendEquationSeparate(state.blendRgb, state.blendAlpha);
    gl.blendFuncSeparate(state.blendSrcRgb, state.blendDstRgb, state.blendSrcAlpha, state.blendDstAlpha);
    gl.colorMask(...state.colorMask as [boolean, boolean, boolean, boolean]);
    gl.clearColor(...state.clearColor as unknown as [number, number, number, number]);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, state.unpackFlip);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, state.unpackPremultiply);
    gl.depthFunc(state.depthFunc);
    for (const [cap, enabled] of [[gl.SCISSOR_TEST, state.scissor], [gl.BLEND, state.blend], [gl.DEPTH_TEST, state.depth], [gl.STENCIL_TEST, state.stencil]] as const) {
      if (enabled) gl.enable(cap); else gl.disable(cap);
    }
    }
  }
}
