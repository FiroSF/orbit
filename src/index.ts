console.log("test");

import {SolidPlanet, Ship, Planet, MovingPlanet, SolidInvertedPlanet} from "./obj/objs";
import {Board} from "./board";

function draw() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const board = new Board(1, 10, 1);

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
