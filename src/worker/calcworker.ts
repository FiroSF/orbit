importScripts("../obj/objBase.js");
onmessage = function (e: MessageEvent) {
    e.data[0].posCalc(e.data[1], e.data[2], e.data[3]);
};
