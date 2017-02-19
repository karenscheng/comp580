document.addEventListener('keydown', keyPressed);

var keys = document.querySelector('.keys');
var recordedSounds = [];

function keyPressed(e){
  var myDiv = document.querySelector('div[data-key="' + e.keyCode + '"]');
  myDiv.addEventListener('transitionend', removeClass);
  myDiv.classList.add('playing');

  var audio = document.querySelector('audio[data-key="' + e.keyCode + '"]');
  audio.currentTime = 0;
  audio.play();

  var newDate = new Date().getTime();
  var newSound = {date: newDate, key: e.keyCode};

  recordedSounds.push(newSound);
  console.table(recordedSounds);
}

function removeClass(e){
  e.target.classList.remove('playing');
}
