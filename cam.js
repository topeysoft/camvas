var audioSources = []; 
        var videoSources = []; 
        var selectedVideoSource = {}; 
        var defaultVideoSource = {}; 
        var selectedAudioSource = {}; 
        var defaultAudioSource = {}; 
        
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
        if ( ! v.paused ||  ! v.ended) {
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
    


    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia( {video:true }).then(function (stream) {
            video.src = window.URL.createObjectURL(stream); 
            video.play(); 
        }); 
    }


}

function getDevices() {

    navigator.mediaDevices.enumerateDevices().then(function (sourceInfos) {
        
        console.debug("DEVICES", sourceInfos); 
        sourceInfos.forEach(function (sourceInfo) {
           try {
                if (sourceInfo.kind === 'audioinput') {
                    audioSources.push( {sourceInfo:sourceInfo }); 
                }else if (sourceInfo.kind === 'videoinput') {

                    videoSources.push( {sourceInfo:sourceInfo }); 
                }else {
                    try {
                    }catch (e) {console.log('Error occured: ', e); }
                }


            }catch (e) {console.log('Error occured: ', e); }
            defaultAudioSource = getDefaultSource(audioSources);
            defaultVideoSource = getDefaultSource(videoSources);
            
        }); 
      
        
       // videoSources = filterDefault(videoSources); 
       // audioSources = filterDefault(audioSources); 
        initializeVideoDeviceList(videoSources); 
    }); 
}


function getDefaultSource(sources){
   return sources.find(function (s) {
            return s.sourceInfo.label.toLowerCase() == "default"; 
        }) ||  {}
}
    function filterDefault(sources) {
        var defaultSource = getDefaultSource(sources); 
        sources = sources.filter(function (s, i) {
            if (s.sourceInfo.label.toLowerCase() == "default") {
                return false; 
            }else {
                try {
                    if (s.sourceInfo.groupId == defaultSource.sourceInfo.groupId) {
                    s.isDefault = true; 
                }

                }catch (e) {}
                return true; 
            }
        }); 
        return sources; 
    }
    function sourcesSelected(sources) {
        console.log("SOURCES", sources);
        var videoSource = sources.videoSource; 
        var audioSource = sources.audioSource; 

        var constraints =  {}; 
        if (audioSource) {
            constraints.audio =  {
                optional:[ {sourceId:audioSource.deviceId }]
            }; 
        }
        if (videoSource) {
            constraints.video =  {
                optional:[ {sourceId:videoSource.deviceId }]
            }; 
        }
        console.debug("VIDEO SRC", navigator.mediaDevices.videoSource); //.getUserMedia(constraints); 
        navigator.mediaDevices.videoSource; //.getUserMedia(constraints); 
    }


    function addListItem(parentUl, classList, text, data) {
        var node = document.createElement('li'); 
        classList.forEach(function (c) {
            node.classList.add(c); 
        }); 
        node.innerHTML = text; 
        node.dataset.itemData = data; 
        parentUl.appendChild(node); 
        return node; 
    }

    function initializeVideoDeviceList(sources) {
        var camSourceSelector = document.getElementById('cam-sources'); 
        bindEvent(camSourceSelector, 'click', '.video-source-select-item', function(e) {
            selectedVideoSource=videoSources[e.srcElement.dataset.itemData].source;
            var sources =  {
                videoSource:selectedVideoSource,
                audioSource:selectedAudioSource
                }
          sourcesSelected(sources); 
        })
        camSourceSelector.innerHTML = ""; 
        var node = document.createElement('li'); 
        node.classList.add('list-header'); 
        node.innerText = 'Select source'; 
        camSourceSelector.appendChild(node); 
        sources.forEach(function (s, index) {
            var source = s.sourceInfo; 
            var text = ''; 
            var classes = ['active-effect', 'video-source-select-item']; 
            if (s.isDefault) {
                classes.push('active'); 
            }
            text += source.label; 
           var node = addListItem(camSourceSelector, classes, text, index); 
        }); 

    }

function isDescendant(parent, child) {
    var node = child.parentNode; 
    while (node != null) {
        if (node == parent) {
            return true; 
        }
        node = node.parentNode; 
    }
    return false; 
}

function bindEvent(parent, event, selector, callback) {
    parent.addEventListener(event, function(e) {
           var target = parent.querySelector(selector); 
            if (isDescendant(parent, e.srcElement)) {
                if (e.srcElement == target) {
                    callback(e); 
                }
            }
        }); 
}
