import { domReady } from './utils';
import Point from './Point';
import Line from './Line';
import Rect from './Rect';

class Panel {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public bgCanvas: HTMLCanvasElement;
    public bgCtx: CanvasRenderingContext2D;
    private isDrawing: boolean;
    private selectionFrameStart: Point;
    private cubesMatrix: Rect[][];

    constructor() {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.bgCanvas = document.createElement('canvas');
        this.bgCtx = this.bgCanvas.getContext('2d');
        this.canvas.width = 801;
        this.canvas.height = 801;
        this.bgCanvas.width = 801;
        this.bgCanvas.height = 801;

        this.isDrawing = false;
        this.selectionFrameStart = null;
        this.cubesMatrix = [[]] as Rect[][];

        this.drawPanel(this.bgCtx);
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
            this.reset(this.ctx);
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

        for (let i = 0, iLeng = this.cubesMatrix.length; i < iLeng; i++) {
            for (let j = 0, jLeng = this.cubesMatrix[i].length; j < jLeng; j++) {
                const curRect = this.cubesMatrix[i][j];

                if (rectSelection.isRectCrossed(curRect)) {
                    curRect.activate();
                    curRect.fillRect(this.ctx);
                } else {
                    curRect.deactivate();
                }
            }
        }
    }

    public drawBackground(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.bgCanvas, 0, 0, this.bgCanvas.width, this.bgCanvas.height);
    }

    public drawPanel(ctx: CanvasRenderingContext2D) {
        const line = new Line(ctx, {
            offset: 0.5,
            lineWidth: 1,
            lineJoin: 'round',
            strokeStyle: 'black'
        });

        const matrix: Rect[][] = [[]];

        for (let i = 0; i < 200; i++) {
            for (let j = 0; j < 200; j++) {
                const length = 10;
                const gap = 5;
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
    }
}

domReady(() => {
    const panel = new Panel();
});
