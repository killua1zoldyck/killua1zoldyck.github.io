const canvas = document.getElementById('snowfall');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';

const snowflakes = [];
const maxSnowflakes = Math.round((canvas.width / 1920) * 100);

const snowLayer = [];
let accumulatedTime = 0;
let isSnowLayerIncreasing = false;

for (let i = 0; i < maxSnowflakes; i++) {
    snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 2,
        speedY: Math.random() * 1 + 0.5,
        speedX: Math.random() * 0.5 - 0.25
    });
}


const stars = [];
const maxStars = 50;

for (let i = 0; i < maxStars; i++) {
    const star = {
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.25),
        radius: Math.random() * 2,
        opacity: Math.random() * 0.5 + 0.5
    };
    stars.push(star);
}

function drawStars() {
    for (let i = 0; i < maxStars; i++) {
        const star = stars[i];

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        ctx.restore();
    }
}

function drawSnowflake(x, y, size) {
  ctx.beginPath();
  ctx.strokeStyle = '#FFFFFF';
  ctx.fillStyle = '#fff';
  const angleStep = (Math.PI / 180) * 60;

  for (let i = 0; i < 6; i++) {
    const angle = angleStep * i;
    const newX = x + size * Math.cos(angle);
    const newY = y + size * Math.sin(angle);

    const extendedX = newX + size * Math.cos(angle) * 0.6;
    const extendedY = newY + size * Math.sin(angle) * 0.6;

    if (i === 0) {
        ctx.moveTo(newX, newY);
    } else {
        ctx.lineTo(newX, newY);
    }
    ctx.lineTo(extendedX, extendedY);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawComet() {
    const startY = 50;
    const cometSpeed = 2;
    let alpha = 1.0;
    const cometWidth = 40;
    const cometHeight = 20;
    let endX = canvas.width;
    let startX = endX + cometWidth;

    function draw() {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(startX - cometWidth / 2, startY + cometHeight / 2, startX - cometWidth / 2, startY - cometHeight / 2, endX, startY - cometHeight);
        ctx.strokeStyle = `rgba(255, 165, 0, ${alpha})`;
        ctx.stroke();

        endX -= cometSpeed;
        alpha -= 0.01;

        // if (alpha > 0 && endX > -cometWidth) {
        //     requestAnimationFrame(draw);
        // }
    }

    draw();
}

function reanimate() {
    drawSnowflakes();
    drawStars();
    
    drawComet();
}

function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    
    for (let i = 0; i < snowflakes.length; i++) {
        const flake = snowflakes[i];
        ctx.beginPath();

        drawSnowflake(flake.x, flake.y, flake.size);

        flake.y += flake.speedY;
        flake.x += flake.speedX;

        if (flake.y > canvas.height) {
            if (flake.y - flake.size < canvas.height) {
                snowLayer.push({ x: flake.x, size: flake.size });
                if (!isSnowLayerIncreasing && accumulatedTime >= 5000) {
                    isSnowLayerIncreasing = true;
                }
            }
            flake.y = 0;
            flake.x = Math.random() * canvas.width;
        }
    }

    for (let i = 0; i < snowLayer.length; i++) {
        const flake = snowLayer[i];
        ctx.beginPath();
        ctx.arc(flake.x, canvas.height, flake.size, 0, Math.PI * 2);
        ctx.fill();
    }

    accumulatedTime += 1000 / 60;
    requestAnimationFrame(reanimate);
}

drawSnowflakes();
drawStars();