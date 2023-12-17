// data
data = [5, 3, 2, 7, 3, 2, 6, -3];

const cvs = document.getElementById("cvs");
const ctx = cvs.getContext("2d");

cvs.height = window.innerHeight;
cvs.width = window.innerWidth;

// mouse position
mx = 0;
my = 0;

function draw() {
  const pad = 50;
  const chartInnerWidth = cvs.width - 2 * pad;
  const chartInnerHeight = cvs.height - 2 * pad;

  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, pad + chartInnerHeight);
  ctx.stroke();

  ctx.moveTo(pad, pad + chartInnerHeight);
  ctx.lineTo(pad + chartInnerWidth, pad + chartInnerHeight);
  ctx.stroke();

  max = Math.max(...data);
  min = Math.min(...data);
  nX = data.length;
  nY = max - min + 1;

  blockWidth = chartInnerWidth / (nX + 1);
  blockHeight = chartInnerHeight / (nY + 1);

  // drawing ticks
  const ticklenhalf = 5;
  for (i = 1; i < nX + 1; ++i) {
    ctx.moveTo(pad + i * blockWidth, pad + chartInnerHeight - ticklenhalf);
    ctx.lineTo(pad + i * blockWidth, pad + chartInnerHeight + ticklenhalf);
    ctx.stroke();
  }

  for (i = 1; i < nY + 1; ++i) {
    ctx.moveTo(pad - ticklenhalf, pad + chartInnerHeight - i * blockHeight);
    ctx.lineTo(pad + ticklenhalf, pad + chartInnerHeight - i * blockHeight);
    ctx.stroke();
    ctx.font = "15px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(
      (min + i - 1).toString(),
      pad - 20,
      pad + chartInnerHeight - i * blockHeight
    );
  }

  xOnCvs = [];
  yOnCvs = [];

  // where to draw
  x = pad + blockWidth;
  y = pad + chartInnerHeight - blockHeight * (data[0] - min + 1);

  xOnCvs.push(x);
  yOnCvs.push(y);

  for (i = 1; i < nX; ++i) {
    xOnCvs.push(pad + (i + 1) * blockWidth);
    yOnCvs.push(pad + chartInnerHeight - blockHeight * (data[i] - min + 1));
  }

  function drawlines() {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    x = xOnCvs[0];
    y = yOnCvs[0];

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    for (i = 1; i < nX; ++i) {
      nextx = xOnCvs[i];
      nexty = yOnCvs[i];

      ctx.moveTo(x, y);
      ctx.lineTo(nextx, nexty);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(nextx, nexty, 5, 0, 2 * Math.PI);
      ctx.fill();

      x = nextx;
      y = nexty;
    }
  }

  for (i = 0; i < nX; ++i) {
    dx = xOnCvs[i] - mx;
    dy = yOnCvs[i] - my;
    ctx.font = "30px Arial";
    if (dx * dx + dy * dy < 100) {
      ctx.fillStyle = "rgba(77, 82, 82,100)";
      ctx.fillRect(xOnCvs[i], yOnCvs[i] - 40, 40, 40);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgb(213, 219, 219)";
      ctx.fillText(data[i].toString(), xOnCvs[i] + 20, yOnCvs[i] + 20 - 40);
    }
  }
  drawlines();
}

window.addEventListener("resize", function () {
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;

  draw();
});

cvs.addEventListener(
  "mousemove",
  function (event) {
    cvsrect = this.getBoundingClientRect();
    ctx.clearRect(0, 0, cvsrect.width, cvsrect.height);
    mx = event.offsetX;
    my = event.offsetY;
    draw();
  },
  false
);

draw();