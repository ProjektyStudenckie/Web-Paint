// Tobiasz Witalis, Wojciech Wielochowski, Jakub Sosna

var canvas;
var context;
var brush = {
    x: 0,
    y: 0,
    color: '#000',
    lineWidth: 30
}
var strokes = []
var currentStroke = null;

var posX = 0;
var posY = 0;

init();


function init() {
    canvas = document.getElementById("main_canvas");
    context = canvas.getContext("2d");

    setCanvasSize();
    setCanvasBackground();
    setStrokeProperties();
    setupSliderLabel();

    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mouseenter", setPosition);

    document.getElementById("color_picker").addEventListener("input", function() {
        brush.color = this.value;
    });

    document.getElementById("line_width_picker").addEventListener("input", function() {
        brush.lineWidth = this.value;
    });

    context.lineCap = "round";
    context.lineJoin = "round";
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < strokes.length; i++) {
        var s = strokes[i];
        context.strokeStyle = s.color;
        context.lineWidth = s.lineWidth;
        context.beginPath();
        context.moveTo(s.points[0].x, s.points[0].y);

        for (var j = 0; j < s.points.length; j++) {
            var p = s.points[j];
            context.lineTo(p.x, p.y);
        }

        context.stroke();
    }
}


function setPosition(e) {
    posX = e.offsetX;
    posY = e.offsetY;
}

function addCurrentStrokePoint(posX, posY) {
    currentStroke.points.push({
        x: posX,
        y: posY
    });
    console.log(posX + " " + posY);
}

function mouseDown(e) {
    currentStroke = {
        color: brush.color,
        lineWidth: brush.lineWidth,
        points: []
    }

    setStrokeProperties();

    strokes.push(currentStroke)

    setPosition(e);
    addCurrentStrokePoint(e);
}

function mouseMove(e) {
    if (e.buttons !== 1) return;

    context.beginPath();

    context.moveTo(posX, posY);
    addCurrentStrokePoint(posX, posY);
    setPosition(e);
    context.lineTo(posX, posY);
    addCurrentStrokePoint(posX, posY);

    context.stroke();
}

function mouseUp(e) {

    context.beginPath();

    context.moveTo(posX, posY);
    context.lineTo(posX - 1, posY);
    addCurrentStrokePoint(posX, posY);
    addCurrentStrokePoint(posX - 1, posY);

    context.stroke();
}

function setStrokeProperties() {
    context.lineWidth = brush.lineWidth;
    context.strokeStyle = brush.color;
}


function setCanvasSize() {
    context.canvas.height = window.innerHeight;
    context.canvas.width = window.innerWidth;
}


function setCanvasBackground() {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
}


function saveImage() {
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    var a = document.createElement('a');
    a.href = image;
    a.download = "test.png";
    document.body.appendChild(a);
    a.click();
}


function loadImage() {
    var input, file, fr, img;

    input = document.getElementById('file_picker');

    if (input.files[0]) {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = createImage;
        fr.readAsDataURL(file);
    }

    function createImage() {
        img = new Image();
        img.onload = imageLoaded;
        img.src = fr.result;
    }

    function imageLoaded() {
        context.drawImage(img, 0, 0);
    }
}

function setupSliderLabel() {
    var slider = document.getElementById("line_width_picker");
    var output = document.getElementById("line_width_label");
    output.innerHTML = slider.value;

    slider.oninput = function() {
        output.innerHTML = this.value;
    }
}