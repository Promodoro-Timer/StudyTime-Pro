let defaultMinutes = 25;
let timeLeft = defaultMinutes * 60;
let timer = null;
let isPaused = true;
let isBreak = false;
let sessionCount = 0;

const display = document.getElementById('timeDisplay');
const input = document.getElementById('timeInput');
const rainSound = document.getElementById('rainSound');
let rainEnabled = false;

function updateDisplay() {
  const hrs = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  const hDisplay = hrs > 0 ? String(hrs).padStart(2, '0') + ':' : '';
  const mDisplay = String(mins).padStart(2, '0');
  const sDisplay = String(secs).padStart(2, '0');

  display.textContent = hDisplay + mDisplay + ':' + sDisplay;
}

function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      if (!isPaused) {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
          document.getElementById('alarmSound').play();
          clearInterval(timer);
          timer = null;
          isBreak = !isBreak;
          timeLeft = (isBreak ? 5 : defaultMinutes) * 60;
          if (!isBreak) {
            sessionCount++;
            document.getElementById('sessionCount').textContent = sessionCount;
          }
          startTimer();
        }
      }
    }, 1000);
  }
  isPaused = false;
}

function pauseTimer() {
  isPaused = true;
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  isPaused = true;
  isBreak = false;
  timeLeft = defaultMinutes * 60;
  updateDisplay();
  sessionCount = 0;
  document.getElementById('sessionCount').textContent = 0;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function toggleRain() {
  rainEnabled = !rainEnabled;
  if (rainEnabled) {
    rainSound.play();
  } else {
    rainSound.pause();
    rainSound.currentTime = 0;
  }
}

function editTime() {
  input.classList.remove("hidden");
  display.classList.add("hidden");
  input.value = display.textContent;
  input.focus();
}

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const raw = input.value.trim();
    const parts = raw.split(":").map(x => parseInt(x));

    let h = 0, m = 0, s = 0;

    if (parts.length === 3) {
      [h, m, s] = parts;
    } else if (parts.length === 2) {
      [m, s] = parts;
    } else if (parts.length === 1) {
      [m] = parts;
    }

    if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
      const totalSeconds = h * 3600 + m * 60 + s;
      if (totalSeconds > 0) {
        defaultMinutes = Math.floor(totalSeconds / 60);
        timeLeft = totalSeconds;
        updateDisplay();
      }
    }

    input.classList.add("hidden");
    display.classList.remove("hidden");
  }
});

updateDisplay();
