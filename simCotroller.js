window.spoutActive = false;
    
window.addEventListener("load", () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.getElementById("blackout").style.display = "none";
    }, 50);
});

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let on = false;
let mousePos = { x: 0, y: 0 };

function resizeCanvas() {
    const portfolio = document.querySelector('.portfolio-container');
    
    let bottomPosition = window.innerHeight;
    
    if (portfolio) {
      const rect = portfolio.getBoundingClientRect();
      bottomPosition = Math.max(bottomPosition, rect.bottom + window.scrollY);
    }
    
    canvas.width = window.innerWidth;
    canvas.height = bottomPosition;
  }
  
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let lastTime = performance.now();
let currentTime = 0;
let deltaTime = 0;
let playground = new Playground();

function clear() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updatePlayground(dt) {
    clear();
    playground.update(dt);
    playground.draw();
}

function mainLoop() {
    window.requestAnimationFrame(mainLoop);
    currentTime = performance.now();
    deltaTime = (currentTime - lastTime) / 1000;
    updatePlayground(deltaTime);
    lastTime = currentTime;
}
mainLoop();


function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
    };
}

document.addEventListener("mousemove", function(event) {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
});

setInterval(() => {
    let rect = canvas.getBoundingClientRect();
    let canvasX = mousePos.x - rect.left;
    let canvasY = mousePos.y - rect.top;

    playground.onMouseMove(new Vector2(canvasX, canvasY));
}, 32);

canvas.addEventListener("mousemove", function(event) {
    let mouse = getMousePos(canvas, event);
    playground.onMouseMove(new Vector2(mouse.x, mouse.y));
});
canvas.addEventListener("mousedown", function(event) {
    playground.onMouseDown(event.button);
});
canvas.addEventListener("mouseup", function(event) {
    playground.onMouseUp(event.button);
});

$(document).ready(function() {
    $("#cog-container").on("click", function() {
        let cogIcon = $(this).find("i");
        cogIcon[0].style.animation = 'spin 2s linear infinite';
        setTimeout(function() {
            $("html, body").animate({
                scrollTop: window.innerHeight
            }, 1000, function() {
                playground.startSpout();
                window.spoutActive = true;
            });
        }, 1000);
    });
});


window.onload = () => {
    const spout = document.querySelector('.spout');
    const rand = Math.random();

    if (rand < 0.45) {
        spout.classList.add('type1');
    } else if (rand < 0.90) {
        spout.classList.add('type2');
    } else {
        spout.classList.add('type3');
    }

    resizeCanvas();
};
