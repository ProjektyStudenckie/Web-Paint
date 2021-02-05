// Tobiasz Witalis, Wojciech Wielochowski, Jakub Sosna

var canvas;
var context;
var brush = {
    x: 0,
    y: 0,
    color: '#000000',
    alpha: 'ff',
    lineWidth: 30,
    shadowBlur: 0
}
var strokes = [];
var currentStroke = null;

var shapePositions = [];
var removedStrokes = [];
var lastWasUndo = false;

var posX = 0;
var posY = 0;

var starCircleX;
var startCircleY;

var backgroundImage = null;

var opened = false;
var newY = 0;

const state = {
    mousedown: false
}

var type = Object.freeze({ "Drawing": 1, "Square": 2, "Circle": 3 })

init();


function init() {
    canvas = document.getElementById("main_canvas");
    context = canvas.getContext("2d");

    setCanvasSize();
    setCanvasBackground();
    setStrokeProperties();
    setupSlidersLabels();

    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("orientationchange", function (event) { 
        w = window.innerWidth;
        h = window.innerHeight;

        window.innerWidth = h;
        window.innerHeight = w;

        setCanvasSize();
        setStrokeProperties();
        draw();
    });

    type = 0;

    // toggleSidebar("sss");

    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mouseenter", setMousePosition);

    canvas.addEventListener("touchmove", mouseMove);
    canvas.addEventListener("touchstart", mouseDown);
    canvas.addEventListener("touchend", mouseUp);

    document.getElementById("glow_effect").addEventListener("input", function () {
        brush.shadowBlur = this.value;
    });

    

    document.getElementById("color_picker").addEventListener("input", function () {
        brush.color = this.value;
    });

    document.getElementById("line_width_picker").addEventListener("input", function () {
        brush.lineWidth = this.value;
    });

    document.getElementById("opacity_picker").addEventListener("input", function () {
        var alpha = parseInt(this.value).toString(16);
        if (alpha.length == 1) alpha = "0" + alpha;
        brush.alpha = alpha;
    });
}

function changeSelect() {

    var selector = document.getElementById("selector");
    type = parseInt(selector.value);
    console.log(type.toString())
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (backgroundImage)
        context.drawImage(backgroundImage, 0, 0);

    for (var i = 0; i < strokes.length; i++) {
        var s = strokes[i];
        context.strokeStyle = s.color;
        context.lineWidth = s.lineWidth;
        context.shadowColor = s.shadowColor;
        context.shadowBlur = s.shadowBlur;
        context.beginPath();
        context.moveTo(s.points[0].x, s.points[0].y);

        for (var j = 0; j < s.points.length; j++) {
            var p = s.points[j];
            context.lineTo(p.x, p.y);
        }

        context.stroke();
    }
}

function setMousePosition(event) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const { offsetLeft, offsetTop } = event.target;
    const canvasX = clientX - offsetLeft;
    const canvasY = clientY - offsetTop;

    posX = canvasX;
    posY = canvasY;

    var size = window.screen.availWidth;

    if (size < 850 && size >= 600)
        newY = 150;
    else if (size < 600 && size > 450)
        newY = 180;
    else if (size <= 450 && size > 400)
        newY = 250;
    else if (size <= 400)
        newY = 300;
    else 
        newY = 120;

    if (!opened){
        posY += newY;
    }
}

function addCurrentStrokePoint(posX, posY) {
    if (currentStroke)
        currentStroke.points.push({
            x: posX,
            y: posY
        });
}

function ClearCurrenStrokePionts() {
    if (currentStroke) {
        currentStroke.points = [];
    }
}


function mouseDown(e) {
    switch (type) {
        case 0:
            state.mousedown = true;

            if (lastWasUndo) {
                removedStrokes = [];
                lastWasUndo = false;
            }

            currentStroke = {
                color: brush.color + brush.alpha,
                lineWidth: brush.lineWidth,
                shadowColor: brush.color,
                shadowBlur: brush.shadowBlur,
                points: []
            }

            strokes.push(currentStroke)

            setMousePosition(e);
            addCurrentStrokePoint(posX, posY);
            break;
        case 1:
            state.mousedown = true;
            setMousePosition(e);
            startCircle(posX, posY)
            break;
        case 2:
            state.mousedown = true;
            setMousePosition(e);
            startCircle(posX, posY)
            break;
    }
}

function mouseMove(e) {
    console.log(type.toString())
    if (!state.mousedown) return;

    switch (type) {
        case 0:
            setMousePosition(e);
            addCurrentStrokePoint(posX, posY);
            break;
        case 1:
            setMousePosition(e);
            refreshShape(posX, posY);
            break;
        case 2:
            setMousePosition(e);
            refreshShape(posX, posY);
            break;
    }
    draw();
}

function mouseUp(e) {

    console.log(type.toString())
    switch (type) {
        case 0:
            addCurrentStrokePoint(posX, posY);
            addCurrentStrokePoint(posX - 0.01, posY);
            break;
        case 1:
            refreshShape(posX, posY);
            break;
        case 2:
            refreshShape(posX, posY);
            break;
    }
    state.mousedown = false;
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

    document.getElementById("line_width_picker").oninput = function () {
        document.getElementById("line_width_label").innerHTML = this.value;
    }

    document.getElementById("opacity_label").innerHTML = document.getElementById("opacity_picker").value;

    document.getElementById("opacity_picker").oninput = function () {
        document.getElementById("opacity_label").innerHTML = this.value;
    }

    document.getElementById("glow_label").innerHTML = document.getElementById("glow_effect").value;

    document.getElementById("glow_effect").oninput = function () {
        document.getElementById("glow_label").innerHTML = this.value;
    }
}

function handleWindowResize() {
    setCanvasSize();
    setStrokeProperties();
    draw();
}

function startCircle(posX, posY) {
    startCircleX = posX;
    startCircleY = posY;

    currentStroke = {
        color: brush.color + brush.alpha,
        lineWidth: brush.lineWidth,
        shadowColor: brush.color,
        shadowBlur: brush.shadowBlur,
        points: []
    }
    strokes.push(currentStroke);
}

function refreshShape(posX, posY) {

    ClearCurrenStrokePionts();
    switch (type) {
        case 1:
            calculateBox(startCircleX, startCircleY, posX, posY);
            break;
        case 2:
            calculateCircle(startCircleX, startCircleY, posX, posY);
            break;
    }

}
function calculateBox(posX, posY, posX2, posY2) {

    addCurrentStrokePoint(posX, posY);
    addCurrentStrokePoint(posX2, posY);
    addCurrentStrokePoint(posX2, posY2);
    addCurrentStrokePoint(posX, posY2);
    addCurrentStrokePoint(posX, posY);
}



function calculateCircle(posX, posY, posX2, posY2) {
    var midX = (posX + posX2) / 2;
    var midY = (posY + posY2) / 2;

    var radius = Math.sqrt(Math.pow(posX - posX2, 2) + Math.pow(posY - posY2, 2)) / 2;

    for (var i = 0; i < 360; i++) {

        var x = midX + radius * Math.cos(2 * Math.PI * i / 360);
        var y = midY + radius * Math.sin(2 * Math.PI * i / 360);

        addCurrentStrokePoint(x, y);
    }
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

function toggleSidebar(ref){
    document.getElementById("sidebar").classList.toggle('active');
    
    opened = !opened;
}