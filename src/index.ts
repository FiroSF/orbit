console.log('test');

import { MovingObj, Obj } from './obj/objBase';
import { SolidPlanet, Ship, Planet, MovingPlanet } from './obj/objs';

class Board {
    objs: Obj[] = [];
    ships: MovingObj[] = [];
    dt: number;
    ratio: number;
    renderdt: number;

    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D;

    private clickX: number[] = [];
    private clickY: number[] = [];
    private clickDrag: boolean[] = [];

    constructor(dt: number, renderdt: number, ratio: number) {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        this.canvas = canvas;
        this.ctx = ctx;

        this.createUserEvents();

        this.dt = dt;
        this.renderdt = renderdt;
        this.ratio = ratio;
    }

    private createUserEvents() {
        let canvas = this.canvas as HTMLCanvasElement;

        // canvas.addEventListener('mousedown', this.pressEventHandler);
        // canvas.addEventListener('mousemove', this.dragEventHandler);
        // canvas.addEventListener('mouseup', this.releaseEventHandler);
        // canvas.addEventListener('mouseout', this.cancelEventHandler);

        // canvas.addEventListener('touchstart', this.pressEventHandler);
        // canvas.addEventListener('touchmove', this.dragEventHandler);
        // canvas.addEventListener('touchend', this.releaseEventHandler);
        // canvas.addEventListener('touchcancel', this.cancelEventHandler);

        // document.getElementById('clear').addEventListener('click', this.clearEventHandler);
    }

    // clearEventHandler() {
    //     throw new Error('Method not implemented.');
    // }

    // cancelEventHandler() {
    //     throw new Error('Method not implemented.');
    // }

    // releaseEventHandler() {
    //     throw new Error('Method not implemented.');
    // }

    // dragEventHandler() {
    //     throw new Error('Method not implemented.');
    // }

    // pressEventHandler() {
    //     throw new Error('Method not implemented.');
    // }

    run() {
        setInterval(() => {
            this.ships.forEach((s) => {
                s.posCalc(this.dt, this.ratio, this.objs);
            });
        }, this.dt);

        setInterval(() => {
            this.objs.forEach((s) => {
                s.renderCalc(this.renderdt, this.ctx);
            });
        }, this.renderdt);
    }

    findId(l: Planet[] | Ship[], id: number): number {
        let start = 0;
        let end = l.length;
        let curr: number;

        while (1) {
            curr = Math.floor((start + end) / 2);
            if (l[curr].ID == id) {
                return curr;
            } else if (l[curr].ID > id) {
                end = curr;
            } else {
                start = curr;
            }

            if (start == end) {
                break;
            }
        }
        return -1;
    }

    addObj(p: Obj) {
        this.objs.push(p);
        if (p instanceof MovingObj) {
            this.ships.push(p);
        }
    }

    deleteObj(id: number): boolean {
        let index: number | boolean = this.findId(this.objs, id);

        if (index == -1) {
            console.log('there is no planet has id', id);
            return false;
        } else {
            delete this.objs[index];
            console.log('deleted', id);
            return true;
        }
    }
}

function draw() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const board = new Board(0.01, 1, 1000);

    board.addObj(new MovingPlanet(1500, 800, 300000));
    // board.addObj(new SolidPlanet(1700, 700, 200000));
    // board.addObj(new MovingPlanet(1700, 400, 200000, 35, 30));
    // board.addObj(new MovingPlanet(1400, 700, 200000, 10, 50));

    for (let i = 0; i < 50; i++) {
        board.addObj(new Ship(1300 - 10 * i, 800, 20, 20));
    }
    // board.addObj(new MovingPlanet(1000, 500, 30000, 5, 10));

    board.run();

    ctx.scale(0.5, 0.5);
}

window.onload = () => {
    draw();
};
