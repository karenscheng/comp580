document.addEventListener('keydown', keyPressed);
document.getElementById("record").addEventListener('click', startRecording);
//document.getElementById("select").addEventListener('onchange', checkTempo);

var keys = document.querySelector('.keys');
var recordedSounds = [];
var record = false;
var firstKeyPressed = true;
var playbackDone = false;
var loop = false;

function keyPressed(e){
  var myDiv = document.querySelector('div[data-key="' + e.keyCode + '"]');
  myDiv.addEventListener('transitionend', removeClass);
  myDiv.classList.add('playing');

  console.log("Just pressed key: " + e.keyCode);

  var audio = document.querySelector('audio[data-key="' + e.keyCode + '"]');
  audio.currentTime = 0;
  audio.play();

  if(record){
    console.log("start timer!");
    var tempo = document.getElementById("select").value;
    var recordTime = getRecordTime();

    if(firstKeyPressed){
      setTimeout(function(){
        record = false;
        //call to function that takes in an array and a tempo in order to set the time stamps correctly and set firstKeyPressed to true
        quantize(recordedSounds, tempo);
        firstKeyPressed = true;
        console.log("end timer!");
      }, recordTime); //value from selector
      firstKeyPressed = false;
    }

    var newDate = new Date().getTime();
    var newSound = {date: newDate, key: e.keyCode};

    recordedSounds.push(newSound);
    console.table(recordedSounds);
  }
}

function removeClass(e){
  e.target.classList.remove('playing');
}

function startRecording(e){
    //check value of selector here, if it's default, set record to false, otherwise set record to true
    var tempo = document.getElementById("select").value;
    if(tempo === 'default'){
      //document.getElementById('pressRecord').css('visibility', 'hidden')
      record = false;
      console.log("can't record now");
    }else{
      console.log("recording!");
      record = true;
    }
}

function quantize(recordedSounds, tempo){
  var subdivision = 60/tempo;
  subdivision = subdivision/4; //subdivision is how much time between each 16th note
  subdivision = subdivision*1000; //convert subdivision to milliseconds

  console.log("tempo is " + tempo);
  console.log("subdivision is: " + subdivision);

  var initialTime = recordedSounds[0].date; //sets the time of the first hit to adjust time of other hits to be relative
  var toSubtract = 0;

  var i;
  for (i = 0; i < recordedSounds.length; i++){
    console.log("initial time: " + recordedSounds[i].date);
    if(i == 0){
      recordedSounds[i].date -= initialTime;
      toSubtract += recordedSounds[i].date;
    } else{
      recordedSounds[i].date -= initialTime;
      recordedSounds[i].date -= toSubtract;
      toSubtract += recordedSounds[i].date;
    }
    console.log("new initial time: " + recordedSounds[i].date);
  }

  var j;
  for(j = 0; j < recordedSounds.length; j++){
    var numSubdivisions = recordedSounds[j].date / subdivision; //how many subdivisions fit in the raw time
    numSubdivisions = Math.round(numSubdivisions); //round to the nearest 16th note
    console.log("number of subdivisions: " + numSubdivisions);
    recordedSounds[j].date = numSubdivisions*subdivision; //adjust new time to the time of a 16th note
    console.log("this key plays this many milliseconds after playback starts: " + recordedSounds[j].date);
  }

  //playRecording(recordedSounds, 1);
  loopIt(recordedSounds);
}

function playRecording(recordedSounds, index){
  var playback;
  console.log("time to play the " + index + "sound in array");

  if(recordedSounds[index] === undefined){
    console.log("stopping playback on index: " + index);
    clearTimeout(playback);
    playbackDone = true;
  }

  playSound(recordedSounds, index-1);

  if(!playbackDone){
    playback = setTimeout(function() {
      console.log("in timeout function");
      playRecording(recordedSounds, index+1);
    }, recordedSounds[index].date);
  }else{
    playbackDone = false;
  }

  // var i;
  // for(i = 0; i < recordedSounds.length; i++){
  //   console.log("wait " + recordedSounds[i].date + "until play");
  //   setTimeout(playSound(recordedSounds[i]), 2000);
  // }
}

function playSound(sound, index){
  var audioString = 'audio[data-key="' + sound[index].key + '"]';
  var audio = document.querySelector(audioString);
  audio.currentTime = 0;
  audio.play();
}

function loopIt(recordedSounds){
    var recordTime = getRecordTime();

    var loop = setTimeout(function() {
      playRecording(recordedSounds, 1);
      loopIt(recordedSounds);
    }, recordTime);

}

function getRecordTime(){
  var tempo = document.getElementById("select").value;
  tempo = (60/tempo)*8000;
  return tempo;
}
