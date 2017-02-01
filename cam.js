document.addEventListener('DOMContentLoaded', function () {



    var v = document.getElementById('v');
    var canvas = document.getElementById('cam_vas');
    var context = canvas.getContext('2d');
    //v.onload = function () {

    //draw(v, context, cw, ch);
    v.addEventListener('play', function () {
        // canvas.width = v.width;
        // canvas.height = v.height;

        var cw = canvas.clientWidth;
        var ch = canvas.clientHeight;
        canvas.width = cw;
        canvas.height = ch;
        draw(this, context, cw, ch);
    }, false);
    // }

    var text = "Place check withing the box";
    // var filters = new Filters();
    function draw(v, c, w, h) {
        if (!v.paused || !v.ended) {
            //var img=  Filters.filterImage('grayscale', v, {});
            c.drawImage(v, 0, 0, w, h);
        }
        drawBox(c, w, h);
        drawText(c, text, w, h);
        setTimeout(draw, 20, v, c, w, h);
    }


    function drawBox(ctx, width, height) {
        var pad = 30;
        var rectWidth = 4;
        ctx.beginPath();
        ctx.lineWidth = rectWidth;
        ctx.strokeStyle = "green";
        ctx.rect(pad, pad, width - (2 * pad) - (rectWidth * 2), height - (2 * pad) - (rectWidth * 2));
        ctx.stroke();
    }
    function drawText(ctx, text, width, height) {
        // var pad = 30;
        // var rectWidth = 4;
        // ctx.beginPath();
        // ctx.lineWidth = rectWidth;
        // ctx.strokeStyle = "green";
        // ctx.rect(pad, pad, width - (2 * pad) - (rectWidth * 2), height - (2 * pad) - (rectWidth * 2));
        // ctx.stroke();

        ctx.font = "1rem Verdana";
        // Create gradient
        // var gradient = ctx.createLinearGradient(0, 0, width, height);
        // gradient.addColorStop("0", "magenta");
        // gradient.addColorStop("0.5", "blue");
        // gradient.addColorStop("1.0", "red");
        // // Fill with gradient
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2);
    }


    initializeCamera();
}, false);


function initializeCamera() {
    // navigator.getUserMedia = navigator.getUserMedia ||
    //     navigator.webkitGetUserMedia ||
    //     navigator.mozGetUserMedia ||
    //     navigator.msGetUserMedia;

    // var video = document.querySelector('#v');

    // if (navigator.getUserMedia) {
    //     navigator.getUserMedia({ audio: true, video: true }, function (stream) {
    //         video.src = window.URL.createObjectURL(stream);
    //     }, errorCallback);
    // } else {
    //     video.src = 'somevideo.webm'; // fallback.
    // }
    // Grab elements, create settings, etc.
var video = document.getElementById('v');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}
}
