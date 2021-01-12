export default class Canvas {

    constructor(
        private canvas: HTMLCanvasElement,
        private width: number,
        private height: number) {
        canvas.setAttribute('width', width.toString());
        canvas.setAttribute('height', height.toString());
    }

    public get getWidth(): number {
        return this.width;
    }

    public get getHeight(): number {
        return this.height;
    }

    public drawImage(image: any): void {
        this.canvas!.getContext('2d')!.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }

    public drawImageCenter(image: any): void {
        const centerX = this.width / 2 - image.width / 2;
        const centerY = this.height / 2 - image.height / 2;
        this.canvas!.getContext('2d')!.drawImage(image, centerX, centerY, image.width, image.height);
    }

    public clearRect(): void {
        const canvas = this.canvas!.getContext('2d')!;
        canvas.fillStyle = '#000';
        canvas.fillRect(0, 0, this.width, this.height);
    }

    public toDataURL(): string {
        return this.canvas.toDataURL();
    }
}