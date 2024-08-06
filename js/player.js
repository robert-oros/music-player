let audio = new Audio();

// allSongs = document.querySelectorAll(".trelem");
// allSongs.forEach(song => {


//   song.addEventListener("click", function(e){
//     selectedSong = song.children[3].childNodes[1].src.split("/")[4]

    

//     audio.src = "songs/"+selectedSong

//     console.log(audio.src)
//   })
// });


playBtn = document.getElementById("playbtn");
pauseBtn = document.getElementById("pausebtn");
volumeSlider = document.getElementById("volumeslider");
volumeBtn = document.getElementById("volumebtn");
muteBtn = document.getElementById("mutebtn");
progresBar = document.getElementById("seekslider");
curtime = document.getElementById("curtimetext");
durtime = document.getElementById("durtimetext");


playBtn.addEventListener("click", playPause);
pauseBtn.addEventListener("click", playPause);
volumeSlider.addEventListener("mousemove", volumeProgres);
volumeBtn.addEventListener("click", volumeMute);
muteBtn.addEventListener("click", volumeMute);
audio.addEventListener("timeupdate", function(){
  progresBar.value = (audio.currentTime / audio.duration) * 100;
});
audio.addEventListener("timeupdate", timeBox);
progresBar.addEventListener("change", function() {
  progresBarTg(audio, seekslider)
});


function playPause() {
  if (audio.src == "") {
    alert("You should add a song!")
  } else if (audio.paused) {
    audio.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "block";
  } else {
    audio.pause();
    playBtn.style.display = "block";
    pauseBtn.style.display = "none";
  }
}

muteBtn.style.display = "none";
function volumeMute() {
  if (audio.muted) {
    audio.muted = false;
    volumeBtn.style.display = "block";
    muteBtn.style.display = "none";
    volumeSlider.value = 100;
  } else {
    audio.muted = true;
    muteBtn.style.display =  "block";
    volumeBtn.style.display = "none";
    volumeSlider.value = 0;
  }
}

function volumeProgres() {
  audio.volume = volumeSlider.value / 100;
  if(audio.volume > 0.01) {
    volumeBtn.style.display = "block";
    muteBtn.style.display = "none";
    audio.muted = false;
  } else {
    volumeBtn.style.display = "none";
    muteBtn.style.display = "block";
    audio.muted = true;
  }
}

function progresBarTg(audio,seekslider) {
  var seekto = audio.duration * (seekslider.value / 100);
  audio.currentTime =  seekto;
}

function timeBox() {
  var curhour = Math.floor(audio.currentTime / 3600);
  var curmin = Math.floor(audio.currentTime / 60);
  var cursec = Math.floor(audio.currentTime - curmin * 60);
  var durhour = Math.floor(audio.duration / 3600);
  var durmin = Math.floor(audio.duration / 60);
  var dursec = Math.floor(audio.duration - durmin * 60);

  if(curhour > 0){ curhour = curhour + ":"; }
  else if(curhour === 0){ curhour = ""; }
  if(durhour > 0){ durhour = durhour + ":"; }
  else if(durhour === 0){ durhour = ""; }
  if(curmin < 10){ curmin = "0" + curmin; }
  if(cursec < 10){ cursec = "0" + cursec; }
  if(durmin < 10){ durmin = "0" + durmin; }
  if(dursec < 10){ dursec = "0" + dursec; }

  curtime.innerHTML = curhour + curmin + ":" + cursec;
  durtime.innerHTML = durhour + durmin + ":" + dursec;
}
    
