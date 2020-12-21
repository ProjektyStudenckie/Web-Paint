// Tobiasz Witalis, Wojciech Wielochowski, Jakub Sosna

var canvas;
var context;
var brush = {
    x: 0,
    y: 0,
    color: '#000000',
    alpha: 'ff',
    lineWidth: 30,
}
var strokes = [];
var currentStroke = null;

var removedStrokes = [];
var lastWasUndo = false;

var posX = 0;
var posY = 0;

var backgroundImage = null

init();


function init() {
    canvas = document.getElementById("main_canvas");
    context = canvas.getContext("2d");

    setCanvasSize();
    setCanvasBackground();
    setStrokeProperties();
    setupSlidersLabels();

    window.addEventListener("resize", handleWindowResize);

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

    document.getElementById("opacity_picker").addEventListener("input", function() {
        var alpha = parseInt(this.value).toString(16);
        if (alpha.length == 1) alpha = "0" + alpha;
        brush.alpha = alpha;
    });
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (backgroundImage)
        context.drawImage(backgroundImage, 0, 0);

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
    if (currentStroke)
        currentStroke.points.push({
            x: posX,
            y: posY
        });
}

function mouseDown(e) {
    if (lastWasUndo) {
        removedStrokes = [];
        lastWasUndo = false;
    }

    currentStroke = {
        color: brush.color + brush.alpha,
        lineWidth: brush.lineWidth,
        points: []
    }

    strokes.push(currentStroke)

    setPosition(e);
    addCurrentStrokePoint(e);
}

function mouseMove(e) {
    if (e.buttons !== 1) return;

    addCurrentStrokePoint(posX, posY);
    setPosition(e);
    addCurrentStrokePoint(posX, posY);

    draw();
}

function mouseUp(e) {
    addCurrentStrokePoint(posX, posY);
    addCurrentStrokePoint(posX - 0.01, posY);

    draw();
}

function setStrokeProperties() {
    context.lineWidth = brush.lineWidth;
    context.strokeStyle = brush.color;

    context.lineCap = "round";
    context.lineJoin = "round";
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
        backgroundImage = img;
    }

    function imageLoaded() {
        context.drawImage(img, 0, 0);
        draw();
    }
}

function setupSlidersLabels() {
    document.getElementById("line_width_label").innerHTML = document.getElementById("line_width_picker").value;

    document.getElementById("line_width_picker").oninput = function() {
        document.getElementById("line_width_label").innerHTML = this.value;
    }

    document.getElementById("opacity_label").innerHTML = document.getElementById("opacity_picker").value;

    document.getElementById("opacity_picker").oninput = function() {
        document.getElementById("opacity_label").innerHTML = this.value;
    }
}

function handleWindowResize() {
    setCanvasSize();
    setStrokeProperties();
    draw();
}

function undo() {
    if (strokes.length > 0)
        removedStrokes.push(strokes.pop())
    draw();
    lastWasUndo = true;
}

function redo() {
    if (removedStrokes.length > 0)
        strokes.push(removedStrokes.pop())
    draw();
}

function clearCanvas() {
    strokes = []
    removedStrokes = []
    backgroundImage = null
    draw();
}