/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ship = exports.MovingPlanet = exports.SolidInvertedPlanet = exports.SolidPlanet = void 0;
const objBase_1 = __webpack_require__(2);
class SolidPlanet extends objBase_1.Obj {
    constructor(x, y, g = 100000) {
        super(x, y, g);
    }
    posCalc() { }
    renderCalc(dt, ctx) {
        var radgrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.g ** 0.5 / 5);
        radgrad.addColorStop(0, "#000000");
        radgrad.addColorStop(0.1, "#000000");
        radgrad.addColorStop(0.1, "#E7AC0C");
        radgrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, 100000, 100000);
        // console.log(this.x, this.y);
        this.isModified = false;
    }
}
exports.SolidPlanet = SolidPlanet;
class SolidInvertedPlanet extends SolidPlanet {
    constructor(x, y, g = 100000) {
        super(x, y, -g);
    }
    posCalc() { }
    renderCalc(dt, ctx) {
        var radgrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, (0 - this.g) ** 0.5 / 5);
        radgrad.addColorStop(0, "#000000");
        radgrad.addColorStop(0.1, "#000000");
        radgrad.addColorStop(0.1, "#1853F3");
        radgrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, 100000, 100000);
        // console.log(this.x, this.y);
    }
}
exports.SolidInvertedPlanet = SolidInvertedPlanet;
class MovingPlanet extends objBase_1.MovingObj {
    constructor(x, y, g = 100000, vx = 0, vy = 0) {
        super(x, y, g, vx, vy);
    }
    renderCalc(dt, ctx) {
        var radgrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.g ** 0.5 / 5);
        radgrad.addColorStop(0, "#000000");
        radgrad.addColorStop(0.1, "#000000");
        radgrad.addColorStop(0.1, "#A7D30C");
        radgrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, 100000, 100000);
    }
}
exports.MovingPlanet = MovingPlanet;
class Ship extends objBase_1.MovingObj {
    constructor(x, y, vx, vy) {
        super(x, y, 0, vx, vy);
    }
    renderCalc(dt, ctx) {
        if (this.isModified) {
            let rectangle = new Path2D();
            rectangle.rect(this.x, this.y, 3, 3);
            // this.trails.push(rectangle);
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fill(rectangle);
            this.isModified = false;
        }
        // while (1) {
        //     // console.log(this.trails[0]);
        //     if (this.trails.length != 0 && this.trails[0].createdDate + StaticValues.trailLifetime < Date.now()) {
        //         this.trails.shift();
        //     } else {
        //         break;
        //     }
        // }
        // ctx.fillStyle = "rgb(0, 0, 0)";
        // console.log(this.trails);
        // const myWorker = new Worker("../dist/worker/renderworker.js");
        // this.trails.forEach(f => {
        //     myWorker.postMessage([ctx, f]);
        //     // ctx.fill(f);
        // });
    }
}
exports.Ship = Ship;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MovingObj = exports.Obj = void 0;
// export class Trail extends Path2D {
//     createdDate: number;
//     constructor() {
//         super();
//         this.createdDate = Date.now();
//     }
// }
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
    // trails: Trail[] = [];
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
        planets.forEach(p => {
            if (p.g != 0 && p.ID != this.ID) {
                dx = p.x - this.x;
                dy = p.y - this.y;
                rsquare = dx ** 2 + dy ** 2;
                if (rsquare == 0)
                    rsquare = 0.00001;
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
                if (p.g < 0) {
                    axsum -= ax;
                    aysum -= ay;
                }
                else {
                    axsum += ax;
                    aysum += ay;
                }
            }
        });
        // move
        this.vx += axsum * dt;
        this.vy += aysum * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        if (this.vx != 0 || this.vy != 0) {
            this.isModified = true;
        }
    }
}
exports.MovingObj = MovingObj;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Board = void 0;
const constants_1 = __webpack_require__(4);
const objBase_1 = __webpack_require__(2);
const objs_1 = __webpack_require__(1);
class Board {
    constructor(dt, renderdt, ratio) {
        this.objs = [];
        this.ships = [];
        this.currentSelected = constants_1.SELECTED_TYPES.SHIP;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.planetSize = constants_1.CONSTANTS.PLANET_DEFAULT_SIZE;
        this.isAdding = false;
        this.isSpacebar = false;
        this.isCtrl = false;
        this.isShift = false;
        this.ctrlInterval = 0;
        this.shiftInterval = 0;
        //worker
        this.calcWorker = new Worker("../dist/worker/calcworker.js");
        //render realtime checker
        this.renderFinishedTime = window.performance.now();
        this.renderFinishedCount = 0;
        // https://github.com/kernhanda/kernhanda.github.io/blob/master/demos/canvas/main.ts
        this.inputEventHandler = (e) => {
            let target = e.target;
            switch (target.id) {
                case "ctrlRate":
                    this.ctrlRateModify(target);
                    break;
                case "trailRate":
                    this.trailRateModify(target);
                    break;
                case "dtRate":
                    this.dtRateModify(target);
                    break;
                default:
                    break;
            }
            document.getElementById(target.id + "Viewer").innerText = target.value;
        };
        this.clearEventHandler = () => {
            this.clearCanvas();
        };
        this.scrollEventHandler = (e) => {
            if (this.currentSelected == constants_1.SELECTED_TYPES.MOVING_PLANET) {
                if (e.deltaY < 0 || this.planetSize > 10000) {
                    this.planetSize -= e.deltaY * 100;
                    document.getElementById("size").innerText =
                        "current moving planet size = " + this.planetSize.toString();
                }
            }
        };
        this.releaseEventHandler = () => {
            this.isAdding = false;
            this.addByPlayer();
        };
        this.cancelEventHandler = () => {
            this.isAdding = false;
        };
        this.pressEventHandler = (e) => {
            let mouseX = e.changedTouches
                ? e.changedTouches[0].pageX
                : e.pageX;
            let mouseY = e.changedTouches
                ? e.changedTouches[0].pageY
                : e.pageY;
            mouseX -= this.canvas.offsetLeft;
            mouseY -= this.canvas.offsetTop;
            this.isAdding = true;
            this.addClick(mouseX, mouseY, true);
        };
        this.dragEventHandler = (e) => {
            let mouseX = e.changedTouches
                ? e.changedTouches[0].pageX
                : e.pageX;
            let mouseY = e.changedTouches
                ? e.changedTouches[0].pageY
                : e.pageY;
            mouseX -= this.canvas.offsetLeft;
            mouseY -= this.canvas.offsetTop;
            this.dragProcess(e, mouseX, mouseY);
            e.preventDefault();
        };
        this.keyDownEventHandler = (e) => { };
        this.keyUpEventHandler = (e) => {
            this.keyUpProcess(e);
        };
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "black";
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
    createUserEvents() {
        let canvas = this.canvas;
        canvas.addEventListener("mousedown", this.pressEventHandler);
        canvas.addEventListener("mousemove", this.dragEventHandler);
        canvas.addEventListener("mouseup", this.releaseEventHandler);
        canvas.addEventListener("mouseout", this.cancelEventHandler);
        canvas.addEventListener("touchstart", this.pressEventHandler);
        canvas.addEventListener("touchmove", this.dragEventHandler);
        canvas.addEventListener("touchend", this.releaseEventHandler);
        canvas.addEventListener("touchcancel", this.cancelEventHandler);
        canvas.addEventListener("wheel", this.scrollEventHandler);
        window.addEventListener("keypress", this.keyDownEventHandler);
        window.addEventListener("keyup", this.keyUpEventHandler);
        document.getElementById("solidPlanet").addEventListener("click", () => {
            this.setSelected(constants_1.SELECTED_TYPES.SOLID_PLANET);
        });
        document.getElementById("solidInvertedPlanet").addEventListener("click", () => {
            this.setSelected(constants_1.SELECTED_TYPES.SOLID_INVERTED_PLANET);
        });
        document.getElementById("movingPlanet").addEventListener("click", () => {
            this.setSelected(constants_1.SELECTED_TYPES.MOVING_PLANET);
        });
        document.getElementById("ship").addEventListener("click", () => {
            this.setSelected(constants_1.SELECTED_TYPES.SHIP);
        });
        document.getElementById("move").addEventListener("click", () => {
            this.setSelected(constants_1.SELECTED_TYPES.MOVE);
        });
        document.getElementById("clear").addEventListener("click", this.clearEventHandler);
        let t = document.getElementsByClassName("range");
        for (let i = 0; i < t.length; i++) {
            t.item(i).addEventListener("input", this.inputEventHandler);
        }
        window.addEventListener("resize", this.resizeEventHandler);
    }
    ctrlRateModify(target) {
        constants_1.StaticValues.ctrlRate = 1000 / Number(target.value);
        constants_1.StaticValues.shiftRate = 1000 / Number(target.value);
        console.log(constants_1.StaticValues.ctrlRate);
    }
    trailRateModify(target) {
        constants_1.StaticValues.trailLifetime = Number(target.value);
    }
    dtRateModify(target) {
        this.ratio = Number(target.value);
    }
    addClick(mouseX, mouseY, isFirstClick) {
        if (isFirstClick) {
            this.startX = mouseX;
            this.startY = mouseY;
        }
        this.endX = mouseX;
        this.endY = mouseY;
    }
    resizeEventHandler() {
        this.canvas.width = window.innerWidth - 40;
        this.canvas.height = window.innerHeight - 150;
    }
    clearCanvas() {
        this.objs = [];
        this.ships = [];
    }
    setSelected(t) {
        this.currentSelected = t;
    }
    addByPlayer() {
        switch (this.currentSelected) {
            case constants_1.SELECTED_TYPES.SHIP:
                this.addObj(new objs_1.Ship(this.startX, this.startY, this.startX - this.endX, this.startY - this.endY));
                break;
            case constants_1.SELECTED_TYPES.MOVING_PLANET:
                this.addObj(new objs_1.MovingPlanet(this.startX, this.startY, this.planetSize, this.startX - this.endX, this.startY - this.endY));
                break;
            case constants_1.SELECTED_TYPES.SOLID_PLANET:
                this.addObj(new objs_1.SolidPlanet(this.startX, this.startY, ((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2) ** 0.5 * 10000));
                break;
            case constants_1.SELECTED_TYPES.SOLID_INVERTED_PLANET:
                this.addObj(new objs_1.SolidInvertedPlanet(this.startX, this.startY, ((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2) ** 0.5 * 10000));
                break;
            default:
                break;
        }
    }
    dragProcess(e, mouseX, mouseY) {
        if (this.isAdding) {
            if (e.shiftKey) {
                let dx = this.endX - this.startX;
                let dy = this.endY - this.startY;
                this.startX = mouseX;
                this.startY = mouseY;
                this.endX = mouseX + dx;
                this.endY = mouseY + dy;
                if (!this.isShift) {
                    this.isShift = true;
                    this.shiftInterval = window.setInterval(() => {
                        this.addByPlayer();
                    }, constants_1.StaticValues.shiftRate);
                }
            }
            else if (e.ctrlKey) {
                if (!this.isCtrl) {
                    this.isCtrl = true;
                    this.ctrlInterval = window.setInterval(() => {
                        this.addByPlayer();
                    }, constants_1.StaticValues.ctrlRate);
                }
            }
            if (!this.isShift) {
                this.addClick(mouseX, mouseY, false);
            }
        }
    }
    keyUpProcess(e) {
        switch (e.key) {
            case "Control":
                this.isCtrl = false;
                clearInterval(this.ctrlInterval);
                break;
            case "Shift":
                this.isShift = false;
                clearInterval(this.shiftInterval);
                break;
            default:
                break;
        }
    }
    run() {
        setInterval(() => {
            this.ships.forEach(s => {
                // this.calcWorker.postMessage([s, this.dt, this.ratio, this.objs]);
                s.posCalc(this.dt, this.ratio, this.objs);
            });
            if (this.renderFinishedCount > 200 / this.dt) {
                document.getElementById("timeRatio").innerText =
                    "Current simulation time ratio = x" +
                        this.dt / ((window.performance.now() - this.renderFinishedTime) / (200 / this.dt));
                this.renderFinishedCount = 0;
                this.renderFinishedTime = window.performance.now();
            }
            this.renderFinishedCount++;
        }, this.dt);
        setInterval(() => {
            this.ctx.fillStyle = "rgba(255, 255, 255, " + (1 / constants_1.StaticValues.trailLifetime) ** 0.5 + ")";
            this.ctx.fillRect(0, 0, this.canvas.width * 2, this.canvas.height * 2);
            this.ctx.beginPath();
            this.objs.forEach(s => {
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
            console.log("there is no planet has id", id);
            return false;
        }
        else {
            this.objs.splice(index, 1);
            console.log("deleted", id);
            return true;
        }
    }
}
exports.Board = Board;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StaticValues = exports.CONSTANTS = exports.SELECTED_TYPES = void 0;
var SELECTED_TYPES;
(function (SELECTED_TYPES) {
    SELECTED_TYPES[SELECTED_TYPES["SOLID_PLANET"] = 1] = "SOLID_PLANET";
    SELECTED_TYPES[SELECTED_TYPES["MOVING_PLANET"] = 2] = "MOVING_PLANET";
    SELECTED_TYPES[SELECTED_TYPES["SHIP"] = 3] = "SHIP";
    SELECTED_TYPES[SELECTED_TYPES["SOLID_INVERTED_PLANET"] = 4] = "SOLID_INVERTED_PLANET";
    SELECTED_TYPES[SELECTED_TYPES["MOVE"] = 0] = "MOVE";
})(SELECTED_TYPES = exports.SELECTED_TYPES || (exports.SELECTED_TYPES = {}));
var CONSTANTS;
(function (CONSTANTS) {
    CONSTANTS[CONSTANTS["PLANET_DEFAULT_SIZE"] = 100000] = "PLANET_DEFAULT_SIZE";
})(CONSTANTS = exports.CONSTANTS || (exports.CONSTANTS = {}));
class StaticValues {
}
exports.StaticValues = StaticValues;
// update rates
StaticValues.ctrlRate = 100;
StaticValues.shiftRate = 100;
StaticValues.trailLifetime = 3000;


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
console.log("test");
const objs_1 = __webpack_require__(1);
const board_1 = __webpack_require__(3);
function draw() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    const board = new board_1.Board(1, 10, 1);
    board.addObj(new objs_1.MovingPlanet(900, 500, 300000));
    // board.addObj(new SolidPlanet(1700, 700, 200000));
    // board.addObj(new MovingPlanet(1700, 400, 200000, 35, 30));
    // board.addObj(new MovingPlanet(1400, 700, 200000, 10, 50));
    for (let i = 0; i < 10; i++) {
        board.addObj(new objs_1.Ship(700 - 10 * i, 500, 20, 20));
    }
    // board.addObj(new MovingPlanet(1000, 500, 30000, 5, 10));
    board.run();
    //ctx.scale(0.5, 0.5);
}
window.onload = () => {
    draw();
};

})();

/******/ })()
;