class AudioPlayer {
  constructor() {
    this.audio = new Audio();
    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    this.playBtn = document.getElementById("playbtn");
    this.pauseBtn = document.getElementById("pausebtn");
    this.volumeSlider = document.getElementById("volumeslider");
    this.volumeBtn = document.getElementById("volumebtn");
    this.muteBtn = document.getElementById("mutebtn");
    this.progressBar = document.getElementById("seekslider");
    this.currentTimeDisplay = document.getElementById("curtimetext");
    this.durationTimeDisplay = document.getElementById("durtimetext");
    this.allSongs = document.querySelectorAll(".trelem");
  }

  setupEventListeners() {
    this.allSongs.forEach(song => {
      song.addEventListener("click", (e) => this.selectSong(e));
    });

    [this.playBtn, this.pauseBtn].forEach(btn => 
      btn.addEventListener("click", () => this.playPause())
    );

    [this.volumeBtn, this.muteBtn].forEach(btn => 
      btn.addEventListener("click", () => this.toggleMute())
    );

    this.volumeSlider.addEventListener("input", () => this.updateVolume());
    this.progressBar.addEventListener("change", () => this.seek());
    
    this.audio.addEventListener("timeupdate", () => {
      this.updateProgressBar();
      this.updateTimeDisplay();
    });
  }

  selectSong(e) {
    const selectedSong = e.currentTarget.querySelector('source').src.split("/").pop();
    this.audio.src = `songs/${selectedSong}`;
  }

  playPause() {
    if (!this.audio.src) {
      alert("You should add a song!");
      return;
    }
    
    if (this.audio.paused) {
      this.audio.play();
      this.playBtn.style.display = "none";
      this.pauseBtn.style.display = "block";
    } else {
      this.audio.pause();
      this.playBtn.style.display = "block";
      this.pauseBtn.style.display = "none";
    }
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.updateVolumeDisplay();
  }

  updateVolume() {
    this.audio.volume = this.volumeSlider.value / 100;
    this.audio.muted = this.audio.volume === 0;
    this.updateVolumeDisplay();
  }

  updateVolumeDisplay() {
    if (this.audio.muted || this.audio.volume === 0) {
      this.volumeBtn.style.display = "none";
      this.muteBtn.style.display = "block";
      this.volumeSlider.value = 0;
    } else {
      this.volumeBtn.style.display = "block";
      this.muteBtn.style.display = "none";
      this.volumeSlider.value = this.audio.volume * 100;
    }
  }

  seek() {
    const seekTo = this.audio.duration * (this.progressBar.value / 100);
    this.audio.currentTime = seekTo;
  }

  updateProgressBar() {
    this.progressBar.value = (this.audio.currentTime / this.audio.duration) * 100;
  }

  updateTimeDisplay() {
    this.currentTimeDisplay.textContent = this.formatTime(this.audio.currentTime);
    this.durationTimeDisplay.textContent = this.formatTime(this.audio.duration);
  }

  formatTime(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const parts = [
      hours > 0 ? hours : null,
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].filter(Boolean);

    return parts.join(':');
  }
}

const player = new AudioPlayer();

