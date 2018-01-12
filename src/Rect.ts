import Point from './Point';
import Line from './Line';

interface IRectCorners {
    start: Point;
    end: Point;
}

export default class Rect {
    public LT: Point;
    public LB: Point;
    public RT: Point;
    public RB: Point;
    public isSelected: boolean;

    get width() {
        return Math.abs(this.RT.x - this.LT.x);
    }

    get height() {
        return Math.abs(this.RT.y - this.RB.y);
    }

    get top() {
        return Math.min(this.LT.y, this.LB.y);
    }

    get bottom() {
        return Math.max(this.LT.y, this.LB.y);
    }

    get left() {
        return Math.min(this.LT.x, this.RT.x);
    }

    get right() {
        return Math.max(this.LT.x, this.RT.x);
    }

    constructor(corners: IRectCorners) {
        const { start, end } = corners;

        this.LT = new Point(start.x, start.y);
        this.LB = new Point(start.x, end.y);
        this.RT = new Point(end.x, start.y);
        this.RB = new Point(end.x, end.y);
    }

    public isRectCrossed(rect: Rect) {
        return !(rect.left > this.right || rect.right < this.left || rect.top > this.bottom || rect.bottom < this.top);
    }

    public activate() {
        this.isSelected = true;
    }

    public deactivate() {
        this.isSelected = false;
    }

    public drawRectFrame(ctx: CanvasRenderingContext2D, line: Line) {
        ctx.beginPath();
        line.moveTo(this.LT.x, this.LT.y);
        line.lineTo(this.RT.x, this.RT.y);
        line.lineTo(this.RB.x, this.RB.y);
        line.lineTo(this.LB.x, this.LB.y);
        ctx.closePath();
        ctx.stroke();
    }

    public fillRect(ctx: CanvasRenderingContext2D, color = 'red', opacity = 0.5) {
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.fillRect(this.LT.x, this.LT.y, this.width, this.height);
    }
}
