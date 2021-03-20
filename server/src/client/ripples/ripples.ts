class WebGlConfig
{
    public readonly extension: any;
    public readonly linearExtension: any;
    public readonly glType: number;
    public readonly arrayType: Float32ArrayConstructor | null

    constructor (extension: any, linearExtension: any | null, glType: number, arrayType: Float32ArrayConstructor | null)
    {
        this.extension = extension;
        this.linearExtension = linearExtension;
        this.glType = glType;
        this.arrayType = arrayType;
    }
}

/**
 *  Load a configuration of GL settings which the browser supports.
 *  For example:
 *  - not all browsers support WebGL
 *  - not all browsers support floating point textures
 *  - not all browsers support linear filtering for floating point textures
 *  - not all browsers support rendering to floating point textures
 *  - some browsers *do* support rendering to half-floating point textures instead.
 */
function loadConfig(gl: WebGLRenderingContext)
{
    // Load extensions
    const textureFloat = gl.getExtension('OES_texture_float');
    const textureHalfFloat = gl.getExtension('OES_texture_half_float');
    const textureFloatLinear = gl.getExtension('OES_texture_float_linear');
    const textureHalfFloatLinear = gl.getExtension('OES_texture_half_float_linear');

    // If no floating point extensions are supported we can bail out early.
    if (!textureFloat)
    {
        return null;
    }

    const configs: WebGlConfig[] = [
        new WebGlConfig(textureFloat, textureFloatLinear, gl.FLOAT, Float32Array)
    ];

    if (textureHalfFloat)
    {
        configs.push(
            // Array type should be Uint16Array, but at least on iOS that breaks. In that case we
            // just initialize the textures with data=null, instead of data=new Uint16Array(...).
            // This makes initialization a tad slower, but it's still negligible.
            new WebGlConfig(textureHalfFloat, textureHalfFloatLinear, textureHalfFloat.HALF_FLOAT_OES, null)
        );
    }

    // Setup the texture and framebuffer
    const texture = gl.createTexture();
    const framebuffer = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Check for each supported texture type if rendering to it is supported
    let config: WebGlConfig | null = null;

    for (const testConfig of configs)
    {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, testConfig.glType, null);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE)
        {
            config = testConfig;
            break;
        }
    }

    return config;
}

export default class Ripples
{
    private readonly canvas: HTMLCanvasElement;
    private readonly gl: WebGLRenderingContext;
    private readonly textureDelta: Float32Array;
    private readonly resolution: number;
    private readonly config: WebGlConfig | null;

    private dropRadius: number = 20;
    private perturbance: number = 0.03;
    private interactive: boolean = true;

    constructor (canvas: HTMLCanvasElement, resolution: number = 256)
    {
        this.canvas = canvas;
        const gl = canvas.getContext('webgl');
        if (!gl)
        {
            throw new Error('Unable to get webgl context');
        }

        this.gl = gl;
        this.resolution = resolution;
        this.textureDelta = new Float32Array([1 / this.resolution, 1 / this.resolution]);

        this.config = loadConfig(gl);
        if (this.config == null)
        {
            throw new Error('Unable to get webgl config');
        }

        const textureData = this.config.arrayType ? new this.config.arrayType(this.resolution * this.resolution * 4) : null;

        for (var i = 0; i < 2; i++)
        {
            var texture = gl.createTexture();
            var framebuffer = gl.createFramebuffer();

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, config.linearSupport ? gl.LINEAR : gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, config.linearSupport ? gl.LINEAR : gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.resolution, this.resolution, 0, gl.RGBA, config.type, textureData);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

            this.textures.push(texture);
            this.framebuffers.push(framebuffer);
        }
    }
}