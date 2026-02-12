// CONSTANTS

const pi = Math.PI;
const px = 3.5;
const g = 9.81;

// POSITION AND MOTION FUNCTIONS

function sin(x) 
{
    return Math.sin(x);
};

function cos(x) 
{
    return Math.cos(x);
};

function sqrt(x) 
{
    return Math.sqrt(x);
};

// get arch width of a specific moment
function s(in_t, start_s, len)
{
    return start_s * sin(sqrt(g/len) * in_t); // it starts from s_max here
}

function s_cos(in_t, start_s, len)
{
    return start_s * cos(sqrt(g/len) * in_t); // it starts from s_max here
}

// get angle from a specific arch width
function angle(in_s, len)
{
    return in_s/len * (180 / pi); // output in degrees
};

// get s from specific angle and length
function get_s(alpha, len)
{
    return alpha * (pi / 180) * len; // working with radians
}

// ds/dt from piskunov's passages (inaccurate/wrong euler method)

function s_prime(s_max, len, value_s)
{
    return 2 * sqrt(g * len) * sqrt(sin((value_s + s_max)/(2 * len)) * sin((s_max - value_s)/(2 * len)));
}

// complete euler method

function v_prime(in_s)
{
    return g * sin(in_s/l);
}

// s'' formula

function acceleration(start_s, len)
{
    return -g  * sin(start_s/len);
}

// small angle period formula

function get_exPeriod(len) 
{
    return 2 * pi * sqrt(len/g);
}


// start pendulum's motion and eventually draw graph

let elapsed_time;
let current_angle;
let interval;
let isInterval = false;

const canvas = document.getElementById('graphCanvas') // get canvas to draw graph


function start(start_s, len, eulerMode) 
{
    isInterval = true;
    let dt = 16;
    dt = dt / 1000;

    let euler_state1 = {s : 0}; // starts at bottom
    let euler_state2 = {s : start_s, v : 0}; // starts at top

    // period variables
    let last_zero = null;
    let period = 0;
    let is_zero = false;

    let last_zero_e = null;
    let period_e = 0;
    let is_zero_e = false;

    interval = setInterval(function() {
        // time for analytic pendulum
        elapsed_time = (Date.now() - start_time) / 1000;

        let current_angle_e;
        let euler_s;

        if (eulerMode == 1) {
            // first pendulum

            current_s = s(elapsed_time, start_s, len); // both start at bottom

            current_angle = angle(current_s, len);

            // Update rope's rotation
            document.querySelector('.pendulum-e2 .rope').style.transform = `translateX(-50%) rotate(${current_angle}deg)`;

            // euler pendulum

            euler_state1.s += dt * s_prime(start_s, len, euler_state1.s); // get s_k+1 from s_k

            euler_s = euler_state1.s;

            current_angle_e = angle(euler_state1.s, len)

        } else if (eulerMode == 2) {
            // first pendulum

            current_s = s_cos(elapsed_time, start_s, len); // both start at top

            current_angle = angle(current_s, len);

            // Update rope's rotation
            document.querySelector('.pendulum-e2 .rope').style.transform = `translateX(-50%) rotate(${current_angle}deg)`;

            // period
            if (Math.abs(current_s) < 0.5) {
                if (!is_zero) {
                    if (last_zero !== null) {
                        period = (Date.now() - last_zero) / 1000;
                        periodBox1.textContent = "Period: " + 2 * period.toFixed(3) + " s";
                    }
                    last_zero = Date.now();
                    is_zero = true;
                }
            } else {
                is_zero = false;
            }

            // euler pendulum

            let accel = acceleration(euler_state2.s, len); // get s''
            euler_state2.v += dt * accel; // from s'' find s'
            euler_state2.s += dt * euler_state2.v; // from s' find s'

            euler_s = euler_state2.s;

            current_angle_e = angle(euler_state2.s, len);

            // period
            if (Math.abs(euler_s) < 0.5) {
                if (!is_zero_e) {
                    if (last_zero_e !== null) {
                        period_e = (Date.now() - last_zero_e) / 1000;
                        periodBox2.textContent = "Period: " + 2 * period_e.toFixed(3) + " s";
                    }
                    last_zero_e = Date.now();
                    is_zero_e = true;
                }
            } else {
                is_zero_e = false;
            }
        }

        document.querySelector('.pendulum-e1 .rope').style.transform = `translateX(-50%) rotate(${current_angle_e}deg)`;

        // draw graph
        if (graphBox.style.display == 'block') {
            // analytic pendulum graph
            let point_x1 = pointToFunction(canvas, start_s, current_s, elapsed_time).x;
            let point_y1 = pointToFunction(canvas, start_s, current_s, elapsed_time).y;
            drawGraph(canvas, point_x1, point_y1, 1);

            // euler pendulum graph
            let point_x2 = pointToFunction(canvas, start_s, euler_s, elapsed_time).x;
            let point_y2 = pointToFunction(canvas, start_s, euler_s, elapsed_time).y;
            drawGraph(canvas, point_x2, point_y2, 4);
        }
    }, dt * 1000);
}

function pointToFunction(graph, max, in_y, in_x) {
    const width = graph.width;
    const height = graph.height;

    const x_max = 120; // time the function is gonna be shown
    
    const x = (in_x / x_max) * width;
    
    const centerY = height / 2;
    const amplitude = (max / (Math.PI * 10)) * (height / 2);
    
    const y = centerY - ((in_y / max) * amplitude) * 0.5;

    const coordinates = { x: x, y: y };
    return coordinates
}

function drawGraph(graph, in_x, in_y, mode)
{
    const width = graph.width;
    const height = graph.height;

    const ctx = graph.getContext('2d');

    if (mode == 1) {
        ctx.beginPath();
        ctx.arc(in_x, in_y, 1, 0, pi * 2);
        ctx.fillStyle = 'brown';
        ctx.fill();
    } else if (mode == 2) {
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
    } else if (mode == 3) {
        ctx.beginPath();
        ctx.arc(in_x, in_y, 1, 0, pi * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
    } else if (mode == 4) {
        ctx.beginPath();
        ctx.arc(in_x, in_y, 1, 0, pi * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }
}

// CONSTANTS AND VARIABLES

let a = 15; // default start angle
let l = 70; // default start rope length
let s0 = get_s(a, l); // starting s0 from a and l

const exPeriod = document.getElementById('experiod');
exPeriod.textContent = "T = 2π √(l/g): " + get_exPeriod(l).toFixed(3) + " s";

// rope's rotation

const ropeSlider = document.getElementById('ropeSlider-e');

document.getElementById('ropeValue-e').textContent = ropeSlider.value;

ropeSlider.addEventListener('input', function() {
    l = parseInt(this.value); // set the length to the value of the slider
    document.getElementById('ropeValue-e').textContent = l; // set the label to the value of the slider
    
    // Update the rope's height (both)
    document.querySelector('.pendulum-e1 .rope').style.height = `${l * px}px`;
    document.querySelector('.pendulum-e2 .rope').style.height = `${l * px}px`;

    // Update ball (both)
    document.querySelector('.pendulum-e1 .ball2').style.top = `${l * px}px`;
    document.querySelector('.pendulum-e2 .ball').style.top = `${l * px}px`;

    // Update s0
    s0 = get_s(a, l);

    // Update period
    exPeriod.textContent = "T = 2π √(l/g): " + get_exPeriod(l).toFixed(3) + " s";
});

const angleSlider = document.getElementById('angleSlider-e');

document.getElementById('angleValue-e').textContent = angleSlider.value;

angleSlider.addEventListener('input', function() {
    a = parseInt(this.value) // set the angle to the value of the slider
    document.getElementById('angleValue-e').textContent = a; // set the label to the value of the slider
    
    // Update the rope's rotation (both)
    document.querySelector('.pendulum-e1 .rope').style.transform = `translateX(-50%) rotate(${a}deg)`;
    document.querySelector('.pendulum-e2 .rope').style.transform = `translateX(-50%) rotate(${a}deg)`;

    // Update s0
    s0 = get_s(a, l);
});

// BUTTONS

// euler mode

let eulerMode = 1;

const eulerModeButton = document.getElementById('eulermode');

eulerModeButton.addEventListener('change', function() {
    eulerMode = 2;
})

// start button

let start_time;

const startButton = document.getElementById('startbutton');
let isStartPressed = false;

startButton.addEventListener('click', function() {
    isStartPressed = true;
    start_time = Date.now(); // set the starting time as when the user pressed the button
    start(s0, l, eulerMode);
})

// refresh button

const refreshButton = document.getElementById('refreshbutton');

refreshButton.addEventListener('click', function() {
    window.location.reload(); // refresh the page to stop simulation
    isStartPressed = false;
})

// exit button

const exitButton = document.getElementById('exitbutton');

exitButton.addEventListener('click', function() {
    window.location.href = "index.html";
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

const graphBox = document.querySelector('.graph-box-e');

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

// period

const periodButton = document.getElementById('showPeriod');
let isPeriodPressed = false;

const periodBox1 = document.getElementById('period1');
const periodBox2 = document.getElementById('period2');

periodBox1.style.display = 'none';
periodBox2.style.display = 'none';

periodButton.addEventListener('change', function() {
    isPeriodPressed = !isPeriodPressed; 
    
    if (isPeriodPressed) {
        periodBox1.style.display = 'block'; // Show
        periodBox2.style.display = 'block';
    } else {
        periodBox1.style.display = 'none'; // Hide
        periodBox2.style.display = 'none';
    }
});