export class Obj {
    static count: number = 0;
    ID: number;
    isModified: boolean = true;
    x: number;
    y: number;
    g: number = 0;
    constructor(x: number, y: number, g: number) {
        this.x = x;
        this.y = y;
        this.g = g;
        Obj.count++;
        this.ID = Obj.count;
    }
    renderCalc(dt: number, ctx: CanvasRenderingContext2D): void {}
}

export class MovingObj extends Obj {
    vx: number;
    vy: number;

    constructor(x: number, y: number, g: number = 0, vx: number, vy: number) {
        super(x, y, g);

        this.vx = vx;
        this.vy = vy;
    }
    posCalc(dt: number, ratio: number, planets: Obj[]) {
        // acceleration
        dt *= ratio / 1000;
        let ax: number;
        let ay: number;
        let axsum: number = 0;
        let aysum: number = 0;
        let dx: number;
        let dy: number;
        let a: number;
        let rsquare: number;
        planets.forEach((p) => {
            if (p.g != 0 && p.ID != this.ID) {
                dx = p.x - this.x;
                dy = p.y - this.y;
                rsquare = dx ** 2 + dy ** 2;
                // ax += (p.g / rsquare) * (dx * Math.abs(dx));
                // ay += (p.g / rsquare) * (dy * Math.abs(dy));
                a = p.g / rsquare;

                ax = ((a ** 2 / rsquare) * dx ** 2) ** 0.5;
                if (dx < 0) {
                    ax = 0 - ax;
                }

                ay = ((a ** 2 / rsquare) * dy ** 2) ** 0.5;
                if (dy < 0) {
                    ay = 0 - ay;
                }

                // console.log(ax, ay);
                axsum += ax;
                aysum += ay;
            }
        });

        // move
        this.vx += axsum * dt;
        this.vy += aysum * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.isModified = true;
    }
}
