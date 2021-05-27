"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovingObj = exports.Obj = void 0;
class Obj {
    constructor(x, y, g) {
        this.isModified = true;
        this.g = 0;
        this.x = x;
        this.y = y;
        this.g = g;
        Obj.count++;
        this.ID = Obj.count;
    }
    renderCalc(dt, ctx) { }
}
exports.Obj = Obj;
Obj.count = 0;
class MovingObj extends Obj {
    constructor(x, y, g = 0, vx, vy) {
        super(x, y, g);
        this.vx = vx;
        this.vy = vy;
    }
    posCalc(dt, ratio, planets) {
        // acceleration
        dt *= ratio / 1000;
        let ax;
        let ay;
        let axsum = 0;
        let aysum = 0;
        let dx;
        let dy;
        let a;
        let rsquare;
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
exports.MovingObj = MovingObj;
