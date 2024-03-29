try {
  /*create canvas's element then append to body */
  var __canvas_DOM = document.createElement('canvas'),
    __content = document.getElementsByTagName('body')[0];
  if (window.getComputedStyle(__content).getPropertyValue('position') != 'relative') {
    __content.style.position = 'relative';
  }
  __canvas_DOM.setAttribute('style', 'position: fixed; top: 0; left: 0;');
  __content.appendChild(__canvas_DOM);
} catch (e) {
  console.info('Exception occur: ' + e);
}

/*canvas basic setting*/
__canvas_DOM.width = window.innerWidth;
__canvas_DOM.height = window.innerHeight;

/*story starts here*/
if (__canvas_DOM.getContext) {
  var c = __canvas_DOM.getContext('2d'),
    w = __canvas_DOM.width,
    h = __canvas_DOM.height;

  var centerPoint = {
    x: w / 2,
    y: h / 2,
  };

  var mousePosition = {
    x: centerPoint.x,
    y: centerPoint.y,
  };

  var gradient_color = {
    first: 'rgba(0,0,0,0.8)',
    second: 'rgba(0,0,0,0)',
  };

  var gradient;

  function draw() {
    c.save();
    c.clearRect(0, 0, w, h);

    var flashlight_size = {
      center: h / 10,
      outside: h / 5,
    };

    /*flashlight color*/
    gradient = c.createRadialGradient(
      mousePosition.x,
      mousePosition.y,
      flashlight_size.center,
      mousePosition.x,
      mousePosition.y,
      flashlight_size.outside
    );
    gradient.addColorStop(0, gradient_color.first);
    gradient.addColorStop(1, gradient_color.second);

    c.fillStyle = '#000';
    c.fillRect(0, 0, w, h);

    c.globalCompositeOperation = 'destination-out';
    c.fillStyle = gradient;
    c.arc(mousePosition.x, mousePosition.y, flashlight_size.outside, 0, Math.PI * 2, false);

    c.fill();
    c.restore();
  }

  draw();
}

/**
 * Handle flashlight move for desktop and mobile.
 */
__canvas_DOM.addEventListener('mousemove', handleFlashlightMove);
__canvas_DOM.addEventListener('touchmove', handleFlashlightMove, false);

function handleFlashlightMove(e) {
  if (e.type === 'mousemove') {
    mousePosition.x = e.offsetX;
    mousePosition.y = e.offsetY;
  } else if (e.type === 'touchmove') {
    e.preventDefault();
    mousePosition.x = e.touches[0].clientX;
    mousePosition.y = e.touches[0].clientY;
  }
  draw();
}

/**
 * Force fullscreen on mobile devices.
 */
__canvas_DOM.addEventListener('touchstart', openFullscreen, false);
__canvas_DOM.addEventListener('touchend', openFullscreen, false);
__canvas_DOM.addEventListener('touchcancel', openFullscreen, false);

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

/**
 * Handle element when resize and change orientation.
 */
window.addEventListener('resize', function(event) {
  updateCanvas(event);
  setShareButtonsArea()
  setSwitchArea();
  updateFrontTextSize(frontTitle, styleTitle);
  updateFrontTextSize(frontSubTitle, styleSubTitle);
});

/**
 * Fix issue for Chrome on iOS.
 */
window.addEventListener('orientationchange', function (event) {
  updateCanvas(event);
  setShareButtonsArea()
  setSwitchArea();
  updateFrontTextSize(frontTitle, styleTitle);
  updateFrontTextSize(frontSubTitle, styleSubTitle);
})

function updateCanvas(event) {
  __canvas_DOM.width = event.target.innerWidth;
  __canvas_DOM.height = event.target.innerHeight;
  (w = __canvas_DOM.width), (h = __canvas_DOM.height);
  draw();
}

/**
 * Update font-size relative to canvas size.
 */
var frontTitle = document.querySelector('.front-title');
var styleTitle = parseFloat(window.getComputedStyle(frontTitle, null).getPropertyValue('font-size'));
var frontSubTitle = document.querySelector('.front-subtitle');
var styleSubTitle = parseFloat(window.getComputedStyle(frontSubTitle, null).getPropertyValue('font-size'));

updateFrontTextSize(frontTitle, styleTitle);
updateFrontTextSize(frontSubTitle, styleSubTitle);

function updateFrontTextSize(el, fontSize) {
  var newWidth = document.querySelector('#background_1_').getBoundingClientRect().width;
  var scale = (newWidth / 1366) * fontSize;
  el.style.fontSize = scale + 'px';
}

/**
 * Switch
 */
setSwitchArea();

var switchOn = false;

document.querySelector('#switch').addEventListener('click', function () {
  if (!switchOn) {
    toggleAudio(audioButton);
    document.querySelectorAll('svg > g:not([id="switch-off"]), svg > path').forEach(function (e) {
      e.classList.add('show');
    });
    document.querySelector('canvas').classList.add('hide');
    document.querySelector('[id="switch-off"]').style.display = 'none';
    document.querySelector('.front-text').style.display = 'none';
    document.querySelector('.share-container').classList.add('show');
    switchOn = true;
  } else {
    toggleAudio(audioButton, true);
    document.querySelectorAll('svg > g:not([id="switch-off"]), svg > path').forEach(function (e) {
      e.classList.remove('show');
    });
    document.querySelector('canvas').classList.remove('hide');
    document.querySelector('[id="switch-off"]').style.display = 'block';
    document.querySelector('.front-text').style.display = 'block';
    document.querySelector('.share-container').classList.remove('show');
    switchOn = false;
  }
});

function setSwitchArea() {
  var switchSVG = document.querySelector('#switch-on').getBoundingClientRect();
  var switchHTML = document.querySelector('#switch');

  switchHTML.style.width = switchSVG.width + 'px';
  switchHTML.style.height = switchSVG.height + 'px';
  switchHTML.style.top = (switchSVG.top + window.scrollY - 10) + 'px';
  switchHTML.style.left = (switchSVG.left + window.scrollX - 10) + 'px';
}

/**
 * Share Container
 */

setShareButtonsArea();

function setShareButtonsArea() {
  var bgSVG = document.querySelector('#background_1_').getBoundingClientRect();
  var shareContainer = document.querySelector('.share-container');

  shareContainer.style.bottom = (bgSVG.top + window.scrollY + 20) + 'px';
  shareContainer.style.left = (bgSVG.left + window.scrollX + 20) + 'px';
}


/**
 * Audio
 */
var audioButton = document.querySelector('[id="sound-on"]');

var audio = new Audio('audio/christmas-cheer.wav');
audio.loop = true;
function toggleAudio(btn, muted) {
  if (!muted) {
    if (audio.paused) {
      btn.classList.add('show');
      audio.play();
    } else {
      btn.classList.remove('show');
      audio.pause();
    }
  } else {
    audio.pause();
  }
}

document.querySelectorAll('[id*="sound-"]').forEach(function(el){
  el.addEventListener('click', function(){
    toggleAudio(audioButton);
  });
});
