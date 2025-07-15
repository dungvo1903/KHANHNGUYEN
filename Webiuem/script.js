
const PASSWORD = "03062006";

function checkPassword() {
  const input = document.getElementById('passwordInput').value;
  if (input === PASSWORD) {
    document.getElementById('passwordScreen').style.display = "none";
    document.getElementById('mainContent').style.display = "block";
    startCounter();
    loadAllLetters();
  } else {
    document.getElementById('errorMsg').innerText = "Sai mật khẩu rồi bbi 😢";
  }
}

function startCounter() {
  const startDate = new Date("2025-07-14");
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
    emailjs.send("service_me8uzxc", "template_4mz4cr9", {
      bcc: "laichaukhanhnguyen@gmail.com",
      content: content,
      timestamp: new Date().toLocaleString(),
      to_email: "votridungdh1903@gmail.com"
    }).then(() => {
      console.log("✅ Email đã được gửi!");
    }).catch((err) => {
      console.error("❌ Lỗi gửi email:", err);
    });
  });
});

function loadAllLetters() {
  firebase.firestore().collection("love_letters")
    .orderBy("timestamp", "desc")
    .get()
    .then((snapshot) => {
      const display = document.getElementById("latestLetter");
      display.innerHTML = "<h3>📜 Tất cả thư đã gửi:</h3>";
      snapshot.forEach((doc) => {
        const data = doc.data();
        display.innerHTML += `
          <div class="letter-box">
            <p>${data.content}</p>
            <small>🕒 Gửi lúc: ${new Date(data.timestamp).toLocaleString()}</small>
          </div>
        `;
      });
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
  const startDate = new Date("2025-07-14T00:00:00");
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
let modalImages = [];
let currentIndex = 0;

function showModal(src) {
  modalImages = Array.from(document.querySelectorAll(".thumb")).map(img => img.src);
  currentIndex = modalImages.indexOf(src);
  document.getElementById("modalImage").src = src;
  document.getElementById("imageModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

function changeModalImage(step) {
  if (modalImages.length === 0) return;
  currentIndex = (currentIndex + step + modalImages.length) % modalImages.length;
  document.getElementById("modalImage").src = modalImages[currentIndex];
}
