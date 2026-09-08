// Song Data List
const songs = [
  {
    id: 1,
    title: "Acoustic Breeze",
    artist: "Bensound",
    cover: "https://picsum.photos/id/1018/200/200",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Summer Vibes",
    artist: "Bensound",
    cover: "https://picsum.photos/id/1025/200/200",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Midnight Drive",
    artist: "ChillHop",
    cover: "https://picsum.photos/id/1039/200/200",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "Lofi Beats",
    artist: "Producer X",
    cover: "https://picsum.photos/id/1043/200/200",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
];

let currentSongIndex = 0;
let isPlaying = false;

// DOM Elements
const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const seekBar = document.getElementById("seek-bar");
const volumeBar = document.getElementById("volume-bar");

const currentCover = document.getElementById("current-cover");
const currentTitle = document.getElementById("current-title");
const currentArtist = document.getElementById("current-artist");
const currentTimeLabel = document.getElementById("current-time");
const totalDurationLabel = document.getElementById("total-duration");
const songsGrid = document.getElementById("songs-grid");
const searchInput = document.getElementById("search-input");
const likeBtn = document.getElementById("like-btn");

// Render Music Cards
function renderSongs(songList) {
  songsGrid.innerHTML = "";
  songList.forEach((song, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${song.cover}" alt="${song.title}">
      <h4>${song.title}</h4>
      <p>${song.artist}</p>
      <button class="play-card-btn" onclick="playSong(${index})">
        <i class="fa-solid fa-play"></i>
      </button>
    `;
    songsGrid.appendChild(card);
  });
}

// Play Selected Song
function playSong(index) {
  currentSongIndex = index;
  const song = songs[currentSongIndex];

  audio.src = song.src;
  currentCover.src = song.cover;
  currentTitle.textContent = song.title;
  currentArtist.textContent = song.artist;

  audio.play();
  isPlaying = true;
  updatePlayButton();
}

// Toggle Play / Pause
function togglePlay() {
  if (!audio.src) {
    playSong(0);
    return;
  }
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }
  updatePlayButton();
}

function updatePlayButton() {
  playBtn.innerHTML = isPlaying
    ? '<i class="fa-solid fa-pause"></i>'
    : '<i class="fa-solid fa-play"></i>';
}

// Audio Time Update Event
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress;
    currentTimeLabel.textContent = formatTime(audio.currentTime);
    totalDurationLabel.textContent = formatTime(audio.duration);
  }
});

// Seek Bar Change
seekBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  }
});

// Volume Control
volumeBar.addEventListener("input", (e) => {
  audio.volume = e.target.value / 100;
});

// Previous / Next Buttons
prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(currentSongIndex);
});

nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
});

// Like Button Toggle
likeBtn.addEventListener("click", () => {
  const icon = likeBtn.querySelector("i");
  icon.classList.toggle("fa-regular");
  icon.classList.toggle("fa-solid");
  icon.style.color = icon.classList.contains("fa-solid") ? "#1db954" : "#b3b3b3";
});

// Search Filter Functionality
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(query) ||
      s.artist.toLowerCase().includes(query)
  );
  renderSongs(filtered);
});

// Helper Function: Format Seconds to mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Initial Setup
playBtn.addEventListener("click", togglePlay);
renderSongs(songs);
