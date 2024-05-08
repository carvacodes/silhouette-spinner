/////////////////////
//     globals     //
/////////////////////
let circleSize = 30;
let pathWidth = 60;
let hue = 240;
let lightness = 50;
let compositeOperation = 'destination-out';
let compiledColor = `hsl(${hue}, 100%, ${lightness}$)`;
let shifting = false;

let compSelect = document.getElementById('compositeOperationSelect'); 
let descriptionTicker = document.getElementById('descriptionTicker');

let centerX = innerWidth / 2,
    centerY = 2 * innerHeight / 3,
    x, y, r = 0;

/////////////////////
//      canvas     //
/////////////////////

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

///////////////////////
//     listeners     //
///////////////////////

// on resize, recenter the animation within the canvas
window.addEventListener('resize', function(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  centerX = innerWidth / 2;
  centerY = 2 * innerHeight / 3;
})

// handle clicks on the window and pick actions based on the element that was clicked
window.addEventListener('click', (e) => {
  let t = e.target;

  if (t.id == 'defaultColor') {
    // resets to the default color
    shifting = false;
    hue = 240;
    lightness = 50;
    document.getElementById('shiftingColor').classList.remove('active');

  } else if (t.id == 'randomColor') {
    // chooses a random, non-shifting color
    shifting = false;
    hue = Math.round(Math.random() * 360);
    lightness = 40 + Math.round(Math.random() * 50);
    document.getElementById('shiftingColor').classList.remove('active');

  } else if (t.id == 'shiftingColor') {
    // sets the color to shift one degree on the hue wheel every frame
    shifting = shifting ? false : true;
    t.classList.toggle('active');
  }
});

// change the drawing context's globalCompositeOperation based on this dropdown's selections
compSelect.addEventListener('change', ()=>{
  if (compSelect.value != 'selectComposite') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    compositeOperation = compSelect.value;
    // pull the description out of the selected option's custom "data-description" attribute
    descriptionTicker.innerText = compSelect.options[compSelect.selectedIndex].getAttribute('data-description');
    descriptionTicker.getAnimations()[0].currentTime = 0;
  }
})

///////////////////////
//     animation     //
///////////////////////

let currentTime = Date.now();

function animate() {
  // cap at 60fps
  let frameTime = Date.now()
  if (frameTime - currentTime < 16.666667) {
    window.requestAnimationFrame(animate);
    return;
  }
  
  currentTime = frameTime;

  // if shifting, update the hue
  if (shifting) {
    hue = hue <= 360 ? hue + 1 : 1;
  }

  // set the composite operation and draw the default "blank" (not really blank) canvas background rect
  ctx.globalCompositeOperation = compositeOperation;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  
  // get the ellipse's radius and current position in its orbit
  r = r < 360 ? r + 4.5 : 4.5;
  x = centerX + Math.cos((Math.PI * 2) * (r / 360) - Math.PI / 3) * pathWidth;
  y = centerY - Math.sin((Math.PI * 2) * (r / 360)) * pathWidth;

  // general canvas drawing ops
  ctx.globalCompositeOperation = 'multiply';
  ctx.shadowColor = `hsl(${hue}, 100%, ${lightness}%)`;
  ctx.shadowBlur = 30;
  ctx.fillStyle = `hsl(${hue - 180}, 100%, ${lightness}%)`;
  ctx.beginPath();
  ctx.arc(x, y, circleSize, 0, Math.PI * 2);
  ctx.fill()
  
  window.requestAnimationFrame(animate);
}

// init!
animate();