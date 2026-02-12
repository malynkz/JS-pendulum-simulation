// CONSTANTS

const pi = Math.PI;
const px = 3.5;
const g = 9.81;

// POSITION AND MOTION FUNCTIONS

function sin(x) 
{
    res = Math.sin(x);
    return res
};

function cos(x) 
{
    res = Math.cos(x);
    return res
};

function sqrt(x) 
{
    res = Math.sqrt(x);
    return res
};

// get arch width of a specific moment
function s(in_t, start_s, len)
{
    res = start_s * sin(sqrt(g/len) * in_t);
    return res
}

// get angle from a specific arch width
function angle(in_s, len)
{
    res = in_s/len * (180 / pi); // output in degrees
    return res
};

// get s from specific angle and length
function get_s(alpha, len)
{
    res = alpha * (pi / 180) * len; // working with radians
    return res
}

// start pendulum's motion and eventually draw graph

let elapsed_time;
let current_angle;
let interval;
let isInterval = false;

const canvas = document.getElementById('graphCanvas') // get canvas to draw graph

function start(start_s, len) 
{
    // draw s0 on the graph if the function is being shown
    if (graphBox.style.display == 'block') {drawGraph(canvas, 0, pointToFunction(canvas, start_s, start_s, 0).y, 2)}
    isInterval = true;

    let last_zero = null;
    let period = 0;
    let is_zero = false;
    interval = setInterval(function() {
        elapsed_time = (Date.now() - start_time) / 1000;

        current_s = s(elapsed_time, start_s, len);

        current_angle = angle(current_s, len);

        // Update rope's rotation
        document.querySelector('.rope').style.transform = `translateX(-50%) rotate(${current_angle}deg)`;


        // period
        if (Math.abs(current_s) < 0.5) {
            if (!is_zero) {
                if (last_zero !== null) {
                    period = (Date.now() - last_zero) / 1000;
                    periodBox.textContent = "Period: " + 2 * period.toFixed(3) + " s";
                }
                last_zero = Date.now();
                is_zero = true;
            }
        } else {
            is_zero = false;
        }

        // draw graph
        if (graphBox.style.display == 'block') {
            // pendulum graph
            let point_x = pointToFunction(canvas, start_s, current_s, elapsed_time).x;
            let point_y = pointToFunction(canvas, start_s, current_s, elapsed_time).y;
            drawGraph(canvas, point_x, point_y, 1);

            // period graph
            let p_point_x = pointToFunction(canvas, 50, period, elapsed_time).x;
            let p_point_y = pointToFunction(canvas, 50, period, elapsed_time).y;
            drawGraph(canvas, p_point_x, p_point_y, 3);
        }
    }, 16);
}

// update arch's amplitude
function angleToClip(alpha) {
    const theta = alpha * Math.PI / 180; // radians
    const visible = sin(theta);
    const margin = (1 - visible) / 2 * 100;
    return `polygon(${margin}% 0, ${95-margin}% 0, ${100-margin}% 100%, ${margin}% 100%)`;
}


// REAL TIME FUNCTION FUNCTIONS

function pointToFunction(graph, max, in_y, in_x) {
    const width = graph.width;
    const height = graph.height;

    const x_max = 80; // time the function is gonna be shown
    
    const x = (in_x / x_max) * width;
    
    const centerY = height / 2;
    const amplitude = (max / (Math.PI * 10)) * (height / 2);
    
    const y = centerY - ((in_y / max) * amplitude) * 0.7;

    const coordinates = { x: x, y: y };
    return coordinates
}

function drawGraph(graph, in_x, in_y, mode)
{
    const width = graph.width;
    const height = graph.height;

    const ctx = graph.getContext('2d');

    if (mode == 1) { // normal black graph for pendulum motion
        ctx.beginPath();
        ctx.arc(in_x, in_y, 1, 0, pi * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
    } else if (mode == 2) { // black lines for s0
        // upper line
        ctx.beginPath();
        ctx.moveTo(0, in_y);
        ctx.lineTo(width, in_y); 
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        // lower line
        ctx.beginPath();
        ctx.moveTo(0, height - in_y);
        ctx.lineTo(width, height - in_y); 
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    } else if (mode == 3) { // green graph for period
        ctx.beginPath();
        ctx.arc(in_x, in_y, 1, 0, pi * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
    }
}


// USER INTERACTION

// variables

let a = 15; // default start angle
let l = 70; // default start rope length
let s0 = get_s(a, l); // starting s0 from a and l


// rope's rotation

const ropeSlider = document.getElementById('ropeSlider');

document.getElementById('ropeValue').textContent = ropeSlider.value;

ropeSlider.addEventListener('input', function() {
    const arch = document.querySelector('.arch');
    const r = l * px;
    l = parseInt(this.value); // set the length to the value of the slider
    document.getElementById('ropeValue').textContent = l; // set the label to the value of the slider
    
    // Update the rope's height
    document.querySelector('.rope').style.height = `${l * px}px`;

    // Update ball
    document.querySelector('.ball').style.top = `${l * px}px`;

    // Update s0
    s0 = get_s(a, l);

    // Update arch
    arch.style.height = `${r}px`;
    arch.style.width = `${2 * r}px`;
    arch.style.borderRadius = `0 0 ${r}px ${r}px`;
});

const angleSlider = document.getElementById('angleSlider');

document.getElementById('angleValue').textContent = angleSlider.value;

angleSlider.addEventListener('input', function() {
    a = parseInt(this.value) // set the angle to the value of the slider
    document.getElementById('angleValue').textContent = a; // set the label to the value of the slider
    
    // Update the rope's rotation
    document.querySelector('.rope').style.transform = `translateX(-50%) rotate(${a}deg)`;

    // Update s0
    s0 = get_s(a, l);

    // Update arch
    document.querySelector('.arch').style.clipPath = angleToClip(a);
});


// BUTTONS


// start button
let start_time;

const startButton = document.getElementById('startbutton');
let isStartPressed = false;

startButton.addEventListener('click', function() {
    isStartPressed = true;
    start_time = Date.now(); // set the starting time as when the user pressed the button
    start(s0, l);
})

// refresh button

const refreshButton = document.getElementById('refreshbutton');

refreshButton.addEventListener('click', function() {
    window.location.reload(); // refresh the page to stop simulation
    isStartPressed = false;
})

// stop button

const stopButton = document.getElementById('stopbutton');

stopButton.addEventListener('click', function () {
    if (isInterval == true) {
        clearInterval(interval);
        interval = false;
    }
})

// function button

const functionButton = document.getElementById('showFunction');
let isFunctionPressed = false;

const graphBox = document.querySelector('.graph-box');

// show/hide graph

graphBox.style.display = 'none';

functionButton.addEventListener('change', function() {
    isFunctionPressed = !isFunctionPressed; 
    
    if (isFunctionPressed) {
        graphBox.style.display = 'block'; // Show
    } else {
        graphBox.style.display = 'none'; // Hide
    }
});

// go to euler page

const eulerButton = document.getElementById('euler');

eulerButton.addEventListener('click', function() {
    window.location.href = "euler.html";
})

// period

const periodButton = document.getElementById('showPeriod');
let isPeriodPressed = false;

const periodBox = document.getElementById('period');

periodBox.style.display = 'none';

periodButton.addEventListener('change', function() {
    isPeriodPressed = !isPeriodPressed; 
    
    if (isPeriodPressed) {
        periodBox.style.display = 'block'; // Show
    } else {
        periodBox.style.display = 'none'; // Hide
    }
});

// documentation

const docButton = document.getElementById('docbutton');

docButton.addEventListener('click', function() {
    window.location.href = "docs.html";
})

// help

const helpButton = document.getElementById('help');

helpButton.addEventListener('click', function() {
    window.location.href = "https://github.com/malynkz/JS-pendulum-simulation"
})
