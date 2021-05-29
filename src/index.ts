console.log('test');

import { CONSTANTS, SELECTED_TYPES } from './static/constants';
import { MovingObj, Obj } from './obj/objBase';
import { SolidPlanet, Ship, Planet, MovingPlanet, SolidInvertedPlanet } from './obj/objs';

class Board {
    objs: Obj[] = [];
    ships: MovingObj[] = [];
    dt: number;
    ratio: number;
    renderdt: number;

    currentSelected: SELECTED_TYPES = SELECTED_TYPES.SHIP;
    startX: number = 0;
    startY: number = 0;
    endX: number = 0;
    endY: number = 0;
    planetSize: number = CONSTANTS.PLANET_DEFAULT_SIZE;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    isAdding: boolean = false;

    isSpacebar: boolean = false;
    isCtrl: boolean = false;
    isShift: boolean = false;

    ctrlInterval: number = 0;
    shiftInterval: number = 0;

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

        this.canvas.width = window.innerWidth - 40;
        this.canvas.height = window.innerHeight - 150;

        this.dt = dt;
        this.renderdt = renderdt;
        this.ratio = ratio;
    }

    private createUserEvents() {
        let canvas = this.canvas as HTMLCanvasElement;

        canvas.addEventListener('mousedown', this.pressEventHandler);
        canvas.addEventListener('mousemove', this.dragEventHandler);
        canvas.addEventListener('mouseup', this.releaseEventHandler);
        canvas.addEventListener('mouseout', this.cancelEventHandler);

        canvas.addEventListener('touchstart', this.pressEventHandler);
        canvas.addEventListener('touchmove', this.dragEventHandler);
        canvas.addEventListener('touchend', this.releaseEventHandler);
        canvas.addEventListener('touchcancel', this.cancelEventHandler);

        canvas.addEventListener('wheel', this.scrollEventHandler);
        window.addEventListener('keypress', this.keyDownEventHandler);
        window.addEventListener('keyup', this.keyUpEventHandler);

        (document.getElementById('solidPlanet') as HTMLElement).addEventListener('click', () => {
            this.setSelected(SELECTED_TYPES.SOLID_PLANET);
        });

        (document.getElementById('solidInvertedPlanet') as HTMLElement).addEventListener('click', () => {
            this.setSelected(SELECTED_TYPES.SOLID_INVERTED_PLANET);
        });

        (document.getElementById('movingPlanet') as HTMLElement).addEventListener('click', () => {
            this.setSelected(SELECTED_TYPES.MOVING_PLANET);
        });

        (document.getElementById('ship') as HTMLElement).addEventListener('click', () => {
            this.setSelected(SELECTED_TYPES.SHIP);
        });

        (document.getElementById('move') as HTMLElement).addEventListener('click', () => {
            this.setSelected(SELECTED_TYPES.MOVE);
        });

        (document.getElementById('clear') as HTMLElement).addEventListener('click', this.clearEventHandler);

        window.addEventListener('resize', this.resizeEventHandler);
    }

    // https://github.com/kernhanda/kernhanda.github.io/blob/master/demos/canvas/main.ts

    private clearEventHandler = () => {
        this.clearCanvas();
    };

    private addClick(mouseX: number, mouseY: number, isFirstClick: boolean) {
        if (isFirstClick) {
            this.startX = mouseX;
            this.startY = mouseY;
        }
        this.endX = mouseX;
        this.endY = mouseY;
    }

    private scrollEventHandler = (e: WheelEvent) => {
        if (this.currentSelected == SELECTED_TYPES.MOVING_PLANET) {
            if (e.deltaY < 0 || this.planetSize > 10000) {
                this.planetSize -= e.deltaY * 100;
                (document.getElementById('size') as HTMLElement).innerText = 'current moving planet size = ' + this.planetSize.toString();
            }
        }
    };

    private releaseEventHandler = () => {
        this.isAdding = false;
        this.addByPlayer();
    };

    private cancelEventHandler = () => {
        this.isAdding = false;
    };

    private pressEventHandler = (e: MouseEvent | TouchEvent) => {
        let mouseX = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].pageX : (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].pageY : (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;

        this.isAdding = true;
        this.addClick(mouseX, mouseY, true);
    };

    private dragEventHandler = (e: MouseEvent | TouchEvent) => {
        let mouseX = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].pageX : (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].pageY : (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;

        this.dragProcess(e, mouseX, mouseY);
        e.preventDefault();
    };

    private keyDownEventHandler = (e: KeyboardEvent) => {};

    private keyUpEventHandler = (e: KeyboardEvent) => {
        this.keyUpProcess(e);
    };
    private resizeEventHandler() {
        this.canvas.width = window.innerWidth - 40;
        this.canvas.height = window.innerHeight - 150;
    }

    clearCanvas() {
        this.objs = [];
        this.ships = [];
    }

    setSelected(t: SELECTED_TYPES) {
        this.currentSelected = t;
    }

    addByPlayer() {
        switch (this.currentSelected) {
            case SELECTED_TYPES.SHIP:
                this.addObj(new Ship(this.startX, this.startY, this.startX - this.endX, this.startY - this.endY));
                break;
            case SELECTED_TYPES.MOVING_PLANET:
                this.addObj(new MovingPlanet(this.startX, this.startY, this.planetSize, this.startX - this.endX, this.startY - this.endY));
                break;
            case SELECTED_TYPES.SOLID_PLANET:
                this.addObj(new SolidPlanet(this.startX, this.startY, ((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2) ** 0.5 * 10000));
                break;
            case SELECTED_TYPES.SOLID_INVERTED_PLANET:
                this.addObj(new SolidInvertedPlanet(this.startX, this.startY, ((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2) ** 0.5 * 10000));
                break;
            default:
                break;
        }
    }

    dragProcess(e: MouseEvent | TouchEvent, mouseX: number, mouseY: number) {
        if (this.isAdding) {
            if (e.shiftKey) {
                if (!this.isShift) {
                    this.isShift = true;
                    this.addClick(mouseX, mouseY, false);

                    let dx = this.endX - this.startX;
                    let dy = this.endY - this.startY;

                    this.shiftInterval = window.setInterval(() => {
                        this.startX = mouseX;
                        this.startY = mouseY;
                        this.endX = mouseX + dx;
                        this.endY = mouseY + dy;
                        this.addByPlayer();
                    }, CONSTANTS.SHIFT_RATE);
                }
            } else if (e.ctrlKey) {
                if (!this.isCtrl) {
                    this.isCtrl = true;
                    this.ctrlInterval = window.setInterval(() => {
                        this.addClick(mouseX, mouseY, false);
                        this.addByPlayer();
                    }, CONSTANTS.CTRL_RATE);
                }
            }

            if (!this.isShift && !this.isCtrl) {
                this.addClick(mouseX, mouseY, false);
            }
        }
    }

    keyUpProcess(e: KeyboardEvent) {
        switch (e.key) {
            case 'Control':
                this.isCtrl = false;

                clearInterval(this.ctrlInterval);

                break;
            case 'Shift':
                this.isShift = false;

                clearInterval(this.shiftInterval);

                break;
            default:
                break;
        }
    }

    run() {
        setInterval(() => {
            this.ships.forEach((s) => {
                s.posCalc(this.dt, this.ratio, this.objs);
            });
        }, this.dt);

        setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width * 2, this.canvas.height * 2);
            this.ctx.beginPath();

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
            this.objs.splice(index, 1);
            console.log('deleted', id);
            return true;
        }
    }
}

function draw() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const board = new Board(1, 10, 10);

    board.addObj(new MovingPlanet(900, 500, 300000));
    // board.addObj(new SolidPlanet(1700, 700, 200000));
    // board.addObj(new MovingPlanet(1700, 400, 200000, 35, 30));
    // board.addObj(new MovingPlanet(1400, 700, 200000, 10, 50));

    for (let i = 0; i < 10; i++) {
        board.addObj(new Ship(700 - 10 * i, 500, 20, 20));
    }
    // board.addObj(new MovingPlanet(1000, 500, 30000, 5, 10));

    board.run();

    //ctx.scale(0.5, 0.5);
}

window.onload = () => {
    draw();
};
