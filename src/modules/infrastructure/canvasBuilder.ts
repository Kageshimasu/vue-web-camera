import Canvas from "@/modules/infrastructure/canvas";

class CanvasBuilder {

    private static instance: CanvasBuilder;

    private canvas!: HTMLCanvasElement;
    private width!: number;
    private height!: number;

    private constructor() {
        // NOP
    }

    public static get getInstance(): CanvasBuilder {
        if (!this.instance) {
            this.instance = new CanvasBuilder();
        }
        return this.instance;
    }

    public withCanvas(canvas: HTMLCanvasElement): CanvasBuilder {
        this.canvas = canvas;
        return this;
    }

    public withWidth(width: number): CanvasBuilder {
        this.width = width;
        return this;
    }

    public withHeight(height: number): CanvasBuilder {
        this.height = height;
        return this;
    }

    public build(): Canvas {
        return new Canvas(this.canvas, this.width, this.height);
    }
}

export default CanvasBuilder.getInstance;