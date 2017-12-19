import Point from './Point';

interface ILineOptions {
    offset: number;
    lineWidth: number;
    lineJoin: 'round'|'bevel'|'miter';
    strokeStyle: string;
}

export default class Line {
    private ctx: CanvasRenderingContext2D;
    private offset: number;

    constructor(ctx: CanvasRenderingContext2D, options: ILineOptions) {
        this.ctx = ctx;
        this.offset = options.offset;

        this.ctx.lineWidth = options.lineWidth;
        this.ctx.lineJoin = options.lineJoin;
        this.ctx.strokeStyle = options.strokeStyle;
    }

    public lineTo(x: number, y: number) {
        this.ctx.lineTo(x + this.offset, y + this.offset);
    }

    public moveTo(x: number, y: number) {
        this.ctx.moveTo(x + this.offset, y + this.offset);
    }
}
