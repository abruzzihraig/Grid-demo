import { domReady } from './utils';
import Point from './Point';
import Line from './Line';
import Rect from './Rect';
import { MATRIX, CANVAS } from './Constant';

const gap = MATRIX.GAP;
const length = MATRIX.CUBE.SIZE;
const lineWidth = 1;

class Panel {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public bgCanvas: HTMLCanvasElement;
    public bgCtx: CanvasRenderingContext2D;
    private isDrawing: boolean;
    private selectionFrameStart: Point;
    private cubesMatrix: Rect[][];
    private coverings: Rect[];

    constructor() {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.bgCanvas = document.createElement('canvas');
        this.bgCtx = this.bgCanvas.getContext('2d');
        this.canvas.width = CANVAS.WIDTH;
        this.canvas.height = CANVAS.HEIGHT;
        this.bgCanvas.width = CANVAS.WIDTH;
        this.bgCanvas.height = CANVAS.HEIGHT;

        this.isDrawing = false;
        this.selectionFrameStart = null;
        this.cubesMatrix = [[]] as Rect[][];
        this.coverings = [] as Rect[];

        this.drawCubes(this.bgCtx);
        this.drawBackground(this.ctx);
        this.initEventHandlers();
    }

    public initEventHandlers() {
        this.canvas.addEventListener('mousemove', (evt: MouseEvent) => {
            if (!this.isDrawing) return;
            const { offsetX: x, offsetY: y } = evt;
            const endPoint = new Point(x, y);

            this.drawSelectionFrame(this.ctx, this.selectionFrameStart, endPoint);
            this.drawSelection(this.ctx, this.selectionFrameStart, endPoint);
        });

        this.canvas.addEventListener('mousedown', (evt: MouseEvent) => {
            const { offsetX: x, offsetY: y } = evt;

            this.selectionFrameStart = new Point(x, y);
            this.isDrawing = true;
        });

        this.canvas.addEventListener('mouseup', (evt: MouseEvent) => {
            const { offsetX: x, offsetY: y } = evt;
            const endPoint = new Point(x, y);

            this.reset(this.ctx);
            this.drawCovering(this.ctx, this.selectionFrameStart, endPoint);
            this.isDrawing = false;
        });
    }

    public drawSelectionFrame(ctx: CanvasRenderingContext2D, start: Point, end: Point) {
        this.reset(ctx);

        const line = new Line(ctx, {
            offset: 0.5,
            lineWidth: 1,
            lineJoin: 'round',
            strokeStyle: 'red'
        });
        const rect = new Rect({ start, end });
        rect.drawRectFrame(this.ctx, line);
    }

    public drawSelection(ctx: CanvasRenderingContext2D, start: Point, end: Point) {
        const rectSelection = new Rect({ start, end });
        const { startIndex, endIndex } = this.calcMatrixIndexes(rectSelection);

        for (let i = startIndex[1], iLength = endIndex[1]; i <= iLength; i++) {
            for (let j = startIndex[0], jLength = endIndex[0]; j <= jLength; j++) {
                const curRect = this.cubesMatrix[i][j];
                curRect.fillRect(this.ctx);
            }
        }
    }

    public drawCovering(ctx: CanvasRenderingContext2D, start: Point, end: Point) {
        const rectSelection = new Rect({ start, end });
        if (this.isCoveringConflict(rectSelection)) return;

        const { startIndex, endIndex } = this.calcMatrixIndexes(rectSelection);

        const coveringStart = new Point(startIndex[0] * (length + gap), startIndex[1] * (length + gap));
        const coveringEnd = new Point(endIndex[0] * (length + gap) + length + lineWidth, endIndex[1] * (length + gap) + length + lineWidth);

        const covering = new Rect({ start: coveringStart, end: coveringEnd });
        this.coverings.push(covering);
        covering.fillRect(this.ctx, 'yellow', 1);
    }

    public drawCoverings(ctx: CanvasRenderingContext2D) {
        this.coverings.forEach(covering => {
            covering.fillRect(ctx, 'yellow', 1);
        });
    }

    public isCoveringConflict(rect: Rect) {
        return this.coverings.some(covering => covering.isRectCrossed(rect));
    }

    public isPointXAxisInGutter(point: Point) {
        return point.x % (length + gap) > length;
    }

    public isPointYAxisInGutter(point: Point) {
        return point.y % (length + gap) > length;
    }

    public calcMatrixIndex(point: Point, isLT = true) {
        const { x, y } = point;
        const index = [Math.floor(x / (length + gap)), Math.floor(y / (length + gap))];

        if (this.isPointXAxisInGutter(point) && isLT) index[0]++;
        if (this.isPointYAxisInGutter(point) && isLT) index[1]++;

        return index;
    }

    public calcMatrixIndexes(rect: Rect) {
        const LT = new Point(rect.left, rect.top);
        const RB = new Point(rect.right, rect.bottom);

        const startIndex = this.calcMatrixIndex(LT);
        const endIndex = this.calcMatrixIndex(RB, false);

        return { startIndex, endIndex };
    }

    public drawBackground(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.bgCanvas, 0, 0, this.bgCanvas.width, this.bgCanvas.height);
    }

    public drawCubes(ctx: CanvasRenderingContext2D) {
        const line = new Line(ctx, {
            offset: 0.5,
            lineWidth: 1,
            lineJoin: 'round',
            strokeStyle: 'black'
        });

        const matrix: Rect[][] = [[]];

        for (let i = 0; i < 200; i++) {
            for (let j = 0; j < 200; j++) {
                const start = new Point(j * (length + gap), i * (length + gap));
                const end = new Point(j * (length + gap) + length, i * (length + gap) + length);
                const rect = new Rect({ start, end });

                rect.drawRectFrame(ctx, line);

                matrix[i] = matrix[i] || [];
                matrix[i][j] = rect;
            }
        }

        this.cubesMatrix = matrix;
    }

    public clear(ctx: CanvasRenderingContext2D) {
        const { width, height } = ctx.canvas;
        ctx.clearRect(0, 0, width, height);
    }

    public reset(ctx: CanvasRenderingContext2D) {
        this.clear(ctx);
        this.drawBackground(ctx);
        this.drawCoverings(ctx);
    }
}

domReady(() => {
    const panel = new Panel();
});
