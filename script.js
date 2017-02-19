document.addEventListener('keydown', keyPressed);

var keys = document.querySelector('.keys');

function keyPressed(e){
  var myDiv = document.querySelector('div[data-key="' + e.keyCode + '"]');
  myDiv.addEventListener('transitionend', removeClass);
  myDiv.classList.add('playing');

  var audio = document.querySelector('audio[data-key="' + e.keyCode + '"]');
  audio.currentTime = 0;
  audio.play();
  //var sound = new Audio(audio);
  //sound.play();
}

function removeClass(e){
  e.target.classList.remove('playing');
}
