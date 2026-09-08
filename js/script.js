const defaultCover = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60";

// Song Data List connected to local 'songs' folder
const songs = [
  {
    id: 1,
    title: "It's Your Birthday",
    artist: "Monk Turner",
    cover: defaultCover,
    src: "songs/01-Monk-Turner-Fascinoma-Its-Your-Birthday(chosic.com).mp3"
  },
  {
    id: 2,
    title: "Maiya Ka Chola",
    artist: "Devotional",
    cover: defaultCover,
    src: "songs/maiya_ka_chola.mp3"
  },
  {
    id: 3,
    title: "Are Dwaar Paalo",
    artist: "Devotional",
    cover: defaultCover,
    src: "songs/are_dwaar_paalo.mp3"
  },
  {
    id: 4,
    title: "Keejo Kesari",
    artist: "Devotional",
    cover: defaultCover,
    src: "songs/keejo_kesari.mp3"
  },
  {
    id: 5,
    title: "Pyara Saja Hai",
    artist: "Devotional",
    cover: defaultCover,
    src: "songs/pyara_saja_hai.mp3"
  },
  {
    id: 6,
    title: "Ram Na Milenge",
    artist: "Devotional",
    cover: defaultCover,
    src: "songs/ram_na_milenge.mp3"
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
const playerDownloadBtn = document.getElementById("player-download-btn");

// Render Songs Grid with Download Button on each card
function renderSongs(songList) {
  songsGrid.innerHTML = "";
  songList.forEach((song, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-img-container" onclick="playSong(${index})">
        <img src="${song.cover}" alt="${song.title}">
        <div class="audio-logo-overlay">
          <i class="fa-solid fa-compact-disc"></i>
        </div>
      </div>
      <div class="card-footer-info">
        <div class="card-text" onclick="playSong(${index})">
          <h4>${song.title}</h4>
          <p>${song.artist}</p>
        </div>
        <a href="${song.src}" class="card-download-btn" title="Download Song" download onclick="event.stopPropagation()">
          <i class="fa-solid fa-download"></i>
        </a>
      </div>
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
  
  // Set link for download button in player bar
  playerDownloadBtn.href = song.src;

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

// Update Play/Pause Button Icon
function updatePlayButton() {
  playBtn.innerHTML = isPlaying
    ? '<i class="fa-solid fa-pause"></i>'
    : '<i class="fa-solid fa-play"></i>';
}

// Update Progress Bar
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress;
    currentTimeLabel.textContent = formatTime(audio.currentTime);
    totalDurationLabel.textContent = formatTime(audio.duration);
  }
});

// Auto-play Next Song when current ends
audio.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
});

// Seek Bar Input
seekBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  }
});

// Volume Bar Input
volumeBar.addEventListener("input", (e) => {
  audio.volume = e.target.value / 100;
});

// Controls (Prev / Next)
prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(currentSongIndex);
});

nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
});

// Like Button
likeBtn.addEventListener("click", () => {
  const icon = likeBtn.querySelector("i");
  icon.classList.toggle("fa-regular");
  icon.classList.toggle("fa-solid");
  icon.style.color = icon.classList.contains("fa-solid") ? "#1db954" : "#b3b3b3";
});

// Real-time Search
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(query) ||
      s.artist.toLowerCase().includes(query)
  );
  renderSongs(filtered);
});

// Format Seconds to mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Initialization
playBtn.addEventListener("click", togglePlay);
renderSongs(songs);
// Set initial player download link to the first song
playerDownloadBtn.href = songs[0].src;
