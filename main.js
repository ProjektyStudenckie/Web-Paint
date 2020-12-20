// Tobiasz Witalis, Wojciech Wielochowski, Jakub Sosna

var canvas = document.getElementById("main_canvas");

canvas.addEventListener("mousemove", drawPath);
canvas.addEventListener("mousedown", setPosition);
canvas.addEventListener("mouseup", drawPoint);
canvas.addEventListener("mouseenter", setPosition);


var context = canvas.getContext("2d");

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

    setCanvasProperties();

    context.beginPath();

    context.moveTo(posX, posY);
    setPosition(e);
    context.lineTo(posX, posY);

    context.stroke();
}

function drawPoint(e) {
    context.beginPath();

    context.moveTo(posX, posY);
    context.lineTo(posX - 1, posY);

    context.stroke();
}

function setCanvasProperties() {
    context.lineWidth = document.getElementById("line_width_picker").value;
    context.strokeStyle = document.getElementById("color_picker").value;
    context.lineCap = "round";
}


function setCanvasSize() {
    context.canvas.height = window.innerHeight;
    context.canvas.width = window.innerWidth;
}

var slider = document.getElementById("line_width_picker");
var output = document.getElementById("line_width_label");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
}