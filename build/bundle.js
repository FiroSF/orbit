/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ship = exports.MovingPlanet = exports.SolidPlanet = void 0;
const objBase_1 = __webpack_require__(1);
class SolidPlanet extends objBase_1.Obj {
    constructor(x, y, g = 100000) {
        super(x, y, g);
    }
    posCalc() { }
    renderCalc(dt, ctx) {
        if (this.isModified) {
            ctx.fillStyle = 'orange';
            ctx.fillRect(this.x - this.g / 20000, this.y - this.g / 20000, this.g / 10000, this.g / 10000);
            // console.log(this.x, this.y);
            this.isModified = false;
        }
    }
}
exports.SolidPlanet = SolidPlanet;
class MovingPlanet extends objBase_1.MovingObj {
    constructor(x, y, g = 100000, vx = 0, vy = 0) {
        super(x, y, g, vx, vy);
    }
    renderCalc(dt, ctx) {
        if (this.isModified) {
            ctx.fillStyle = 'rgb(0, 255, 0)';
            ctx.fillRect(this.x - this.g / 20000, this.y - this.g / 20000, this.g / 10000, this.g / 10000);
            this.isModified = false;
        }
    }
}
exports.MovingPlanet = MovingPlanet;
class Ship extends objBase_1.MovingObj {
    constructor(x, y, vx, vy) {
        super(x, y, 0, vx, vy);
    }
    renderCalc(dt, ctx) {
        if (this.isModified) {
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(this.x, this.y, 3, 3);
            this.isModified = false;
        }
    }
}
exports.Ship = Ship;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
console.log('test');
const objBase_1 = __webpack_require__(1);
const objs_1 = __webpack_require__(2);
class Board {
    constructor(dt, renderdt, ratio) {
        this.objs = [];
        this.ships = [];
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
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
    createUserEvents() {
        let canvas = this.canvas;
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
    findId(l, id) {
        let start = 0;
        let end = l.length;
        let curr;
        while (1) {
            curr = Math.floor((start + end) / 2);
            if (l[curr].ID == id) {
                return curr;
            }
            else if (l[curr].ID > id) {
                end = curr;
            }
            else {
                start = curr;
            }
            if (start == end) {
                break;
            }
        }
        return -1;
    }
    addObj(p) {
        this.objs.push(p);
        if (p instanceof objBase_1.MovingObj) {
            this.ships.push(p);
        }
    }
    deleteObj(id) {
        let index = this.findId(this.objs, id);
        if (index == -1) {
            console.log('there is no planet has id', id);
            return false;
        }
        else {
            delete this.objs[index];
            console.log('deleted', id);
            return true;
        }
    }
}
function draw() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    const board = new Board(0.01, 1, 1000);
    board.addObj(new objs_1.MovingPlanet(1500, 800, 300000));
    // board.addObj(new SolidPlanet(1700, 700, 200000));
    // board.addObj(new MovingPlanet(1700, 400, 200000, 35, 30));
    // board.addObj(new MovingPlanet(1400, 700, 200000, 10, 50));
    for (let i = 0; i < 50; i++) {
        board.addObj(new objs_1.Ship(1300 - 10 * i, 800, 20, 20));
    }
    // board.addObj(new MovingPlanet(1000, 500, 30000, 5, 10));
    board.run();
    ctx.scale(0.5, 0.5);
}
window.onload = () => {
    draw();
};

})();

/******/ })()
;