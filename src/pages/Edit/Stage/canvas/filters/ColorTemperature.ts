import { fabric } from 'fabric';
import { IBaseFilter } from 'fabric/fabric-impl';

interface ColorTemperatureFilter extends IBaseFilter {
    temperature: number;
}

interface TemperatureProps {
    new (options?: {
        /**
         * 色温调节
         * @default 0
         */
        temperature: number;
    }): ColorTemperatureFilter;
    /**
     * Returns filter instance from an object representation
     * @param object Object to create an instance from
     */
    fromObject(object: any): ColorTemperatureFilter;
}

/**
 * @description 自定义色温滤镜（不可用）
 * @todo 应该自定义webgl的滤镜
 */
fabric.Image.filters.Temperature = fabric.util.createClass(
    fabric.Image.filters.BaseFilter,
    {
        type: 'Temperature',

        fragmentSource: `
        precision highp float;
        uniform sampler2D uTexture;
        uniform vec2 uTextureSize;
        uniform float uTemperature;
        varying vec2 vTexCoord;

        void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        vec3 temp = vec3(1.0, 1.0, 1.0);
        if (uTemperature > 0.0) {
            temp.b = 1.0 - (uTemperature / 100.0);
        } else {
            temp.r = 1.0 + (uTemperature / 100.0);
        }
        gl_FragColor = vec4(color.rgb * temp, color.a);
        }
    `,

        temperature: 0,

        mainParameter: 'temperature',

        initialize: function (options: any) {
            this.callSuper('initialize', options);
            this.temperature = options.temperature;
        },

        // applyTo: function(option) {
        //     if(option?.webgl) {
        //         console.log('options', option);
        //         // let program = this.createWebGLProgram(gl, this.fragmentSource);

        //         // gl.useProgram(program);
        //         // gl.uniform1f(gl.getUniformLocation(program, 'uTemperature'), this.temperature);
        //     }
        // },

        applyToWebGL: function (options) {
            let gl = options.context;
            let program = this.createProgram(gl, this.fragmentSource);

            gl.useProgram(program);
            gl.uniform1f(
                gl.getUniformLocation(program, 'uTemperature'),
                this.temperature,
            );
            this.callSuper('applyToWebGL', gl, options);
        },

        /**
         * Return WebGL uniform locations for this filter's shader.
         *
         * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
         * @param {WebGLShaderProgram} program This filter's compiled shader program.
         */
        getUniformLocations: function (gl, program) {
            return {
                uBrightness: gl.getUniformLocation(program, 'uTemperature'),
            };
        },

        /**
         * Send data from this filter to its shader program's uniforms.
         *
         * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
         * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
         */
        sendUniformData: function (gl, uniformLocations) {
            gl.uniform1f(uniformLocations.uTemperature, this.temperature);
        },

        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                type: this.type,
                temperature: this.temperature,
            });
        },
    },
);

fabric.Image.filters.Temperature.fromObject =
    fabric.Image.filters.BaseFilter.fromObject;

//   // 调用方式
//   let filter = new fabric.Image.filters.Temperature({
//     temperature: 50 // 设置色温调整值
//   });

//   // 将滤镜应用到 Image 实例
//   imageInstance.filters.push(filter);
//   imageInstance.applyFilters();
