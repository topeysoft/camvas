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
    getDevices();
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
    // console.log("MEDIA DEVICES: ", navigator.mediaDevices);

    // navigator.mediaDevices.enumerateDevices().then(function (data) {
    //     console.log("DEVICES: ", data);

    // });
    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        });
    }


}

function getDevices() {

    navigator.mediaDevices.enumerateDevices().then(function (sourceInfos) {
        var audioSources = [];
        var videoSources = [];

        for (var i = 0; i != sourceInfos.length; ++i) {
            try {
                var sourceInfo = sourceInfos[i];
                if (sourceInfo.kind === 'audioinput') {
                    audioSources.push({ sourceInfo: sourceInfo });
                } else if (sourceInfo.kind === 'videoinput') {

                    videoSource.push({ sourceInfo: sourceInfo });
                } else {
                    try {
                    } catch (e) { console.log('Error occured: ', e); }
                }


            } catch (e) { console.log('Error occured: ', e); }
        }

        videoSources = filterDefault(videoSources);
        audioSources = filterDefault(audioSources);
        initializeVideoDeviceList(audioSources);
        // sourceSelected(audioSource, videoSource);
    });

    function filterDefault(sources) {
        var defaultSource = sources.find(function (s) {
            return s.sourceInfo.label.toLowerCase() == "default";
        });
        sources = sources.filter(function (s, i) {
            if (s.sourceInfo.label.toLowerCase() == "default") {
                return false;
            } else {
                if (s.sourceInfo.groupId == defaultSource.sourceInfo.groupId) {
                    s.isDefault = true;
                }

                return true;
            }
        });
        return sources;
    }
    function sourcesSelected(sources) {
        var videoSource = sources.videoSource;
        var audioSource = sources.audioSource;

        var constraints = {};
        if (audioSource) {
            constraints.audio = {
                optional: [{ sourceId: audioSource.deviceId }]
            };
        }
        if (videoSource) {
            constraints.video = {
                optional: [{ sourceId: videoSource.deviceId }]
            };
        }
        navigator.mediaDevices.getUserMedia(constraints);
    }


    function addListItem(parentUl, classList, text, data) {
        var node = document.createElement('li');
        classList.forEach(function(c) {
            node.classList.add(c);
        }); 
        node.innerHTML = text;
        parentUl.appendChild(node);
    }

    function initializeVideoDeviceList(sources) {
        var camSourceSelector = document.getElementById('cam-sources');
        camSourceSelector.innerHTML = "";
        var node = document.createElement('li');
        node.classList.add('list-header');
        node.innerText = 'Select source';
        camSourceSelector.appendChild(node);
        console.log('Sources: ', sources);
        sources.forEach(function (s, index) {
            var source = s.sourceInfo;
            var text = '';
            var classes = ['active-effect'];
            if (s.isDefault) {
               // text =  '<span class="bubble">★</span>';
                classes.push('active');
            }
            text += source.label;
            addListItem(camSourceSelector, classes, text, source);
        });

    }
}


