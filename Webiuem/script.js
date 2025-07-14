
const PASSWORD = "03062006";

function checkPassword() {
  const input = document.getElementById('passwordInput').value;
  if (input === PASSWORD) {
    document.getElementById('passwordScreen').style.display = "none";
    document.getElementById('mainContent').style.display = "block";
    startCounter();
    loadLatestLetter();
  } else {
    document.getElementById('errorMsg').innerText = "Sai mật khẩu rồi bbi 😢";
  }
}

function startCounter() {
  const startDate = new Date("2025-14-07");
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById("daysTogether").innerText = diffDays;
}

document.getElementById("letterForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const content = document.getElementById("letterContent").value;
  if (!content.trim()) return alert("Nhập gì đó đi bbi 😘");
  const data = {
    content: content,
    timestamp: new Date().toISOString()
  };
  firebase.firestore().collection("love_letters").add(data).then(() => {
    alert("Đã gửi thư 💌");
    document.getElementById("letterContent").value = "";
    loadLatestLetter();
  });
});

function loadLatestLetter() {
  firebase.firestore().collection("love_letters")
    .orderBy("timestamp", "desc")
    .limit(1)
    .get()
    .then((snapshot) => {
      const letter = snapshot.docs[0]?.data();
      if (letter) {
        document.getElementById("latestLetter").innerHTML = `
          <h3>📩 Thư gần nhất:</h3>
          <p>${letter.content}</p>
          <small>Gửi lúc: ${new Date(letter.timestamp).toLocaleString()}</small>
        `;
      }
    });
}

// Tự động chuyển ảnh trong slider
setInterval(() => {
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach(slider => {
    const slides = slider.querySelectorAll(".slide");
    let current = Array.from(slides).findIndex(s => s.classList.contains("show"));
    slides[current].classList.remove("show");
    const next = (current + 1) % slides.length;
    slides[next].classList.add("show");
  });
}, 3000);

document.getElementById("musicToggle").addEventListener("click", function() {
  const music = document.getElementById("bgMusic");
  if (music.paused) {
    music.play();
    this.innerText = "🔊 Đang phát nhạc";
  } else {
    music.pause();
    this.innerText = "🔈 Bật nhạc";
  }
});

function startCounter() {
  const startDate = new Date("2025-14-07T00:00:00");
  setInterval(() => {
    const now = new Date();
    let diff = Math.floor((now - startDate) / 1000);

    const years = Math.floor(diff / (365 * 24 * 60 * 60));
    diff %= (365 * 24 * 60 * 60);
    const months = Math.floor(diff / (30 * 24 * 60 * 60));
    diff %= (30 * 24 * 60 * 60);
    const days = Math.floor(diff / (24 * 60 * 60));
    diff %= (24 * 60 * 60);
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    document.getElementById("years").innerText = years;
    document.getElementById("months").innerText = months;
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
  }, 1000);
}

// Tạo hiệu ứng trái tim bay ở màn hình mật khẩu
setInterval(() => {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = (Math.random() * 3 + 3) + "s";
  document.getElementById("passwordScreen").appendChild(heart);
  setTimeout(() => heart.remove(), 6000);
}, 300);
