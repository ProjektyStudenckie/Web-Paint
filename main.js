// Tobiasz Witalis, Wojciech Wielochowski, Jakub Sosna

document.addEventListener("mousemove", drawPath);
document.addEventListener("mousedown", setPosition);
document.addEventListener("mouseup", drawPoint);
document.addEventListener("mouseenter", setPosition);


var canvas = document.getElementById("main_canvas").getContext("2d");

var posX = 0;
var posY = 0;

setCanvasSize();
setCanvasProperties();

function setPosition(e) {
    posX = e.offsetX;
    posY = e.offsetY;
}

function drawPath(e) {
    if (e.buttons !== 1) return;

    canvas.beginPath();

    canvas.moveTo(posX, posY);
    setPosition(e);
    canvas.lineTo(posX, posY);

    canvas.stroke();
}

function drawPoint(e) {
    canvas.beginPath();

    canvas.moveTo(posX, posY);
    canvas.lineTo(posX - 1, posY);

    canvas.stroke();
}

function setCanvasProperties() {
    canvas.lineWidth = 10;
    canvas.strokeStyle = "#000";
    canvas.lineCap = "round";
}


function setCanvasSize() {
    canvas.canvas.height = window.innerHeight;
    canvas.canvas.width = window.innerWidth;
}