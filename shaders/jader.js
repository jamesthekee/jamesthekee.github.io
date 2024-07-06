const defaultVertex = `
 attribute vec2 position;
 void main() {
 gl_Position = vec4(position, 1.0, 1.0);
 }
`;


const vertices = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1]);

class ShaderViewer {
    constructor(canvas, fragmentShaderSource) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl');
        this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, defaultVertex);
        this.program = this.createProgram(this.vertexShader, this.fragmentShader);

        // Create and bind buffer
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        // Set up attribute and uniforms
        const positionAttribute = this.gl.getAttribLocation(this.program, 'position');
        this.gl.enableVertexAttribArray(positionAttribute);
        this.gl.vertexAttribPointer(positionAttribute, 2, this.gl.FLOAT, false, 0, 0);

        this.resolutionUniform = this.gl.getUniformLocation(this.program, 'iResolution');
        this.mouseUniform = this.gl.getUniformLocation(this.program, 'iMouse');
        this.timeUniform = this.gl.getUniformLocation(this.program, 'iTime');

        this.mousePosition = { x: 0, y: 0 };

        this.isMouseOver = false;
        this.lastTime = 0;

        // Bind the render method to the class instance
        this.render = this.render.bind(this);
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = event.clientX - rect.left;
        this.mousePosition.y = rect.height - (event.clientY - rect.top); // Flip Y coordinate
    }

    start() {
        requestAnimationFrame(this.render);
    }

    render(time) {
        if (this.isMouseOver || this.lastTime === 0) {
            this.gl.uniform4f(this.mouseUniform, 
                this.mousePosition.x, this.mousePosition.y, 
                this.isMouseOver ? 1 : 0, // z component: 1 if mouse is pressed, 0 otherwise
                0 // w component: not used in this example
            );

            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.useProgram(this.program);
            this.gl.uniform2f(this.resolutionUniform, this.canvas.width, this.canvas.height);
            this.gl.uniform1f(this.timeUniform, time * 0.001);
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
            this.lastTime = time;
        }
        requestAnimationFrame(this.render);
    }

    setActive(val) {
        this.isMouseOver = val;
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        return shader;
    }

    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        return program;
    }
}

