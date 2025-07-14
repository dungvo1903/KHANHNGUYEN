// Cấu hình Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqhS0JVz9zTMRBkGbrP2DVJIfOnk0S9o64ww4Ueod9ph_d5enPMEQZImvRuu5VQ445/exec";

// Biến toàn cục
let isMusicPlaying = false;
const PASSWORD = "03062006";
const STORAGE_KEY = "love_letters";
const BACKUP_EMAIL = "votridungdh0305@gmail.com"; // Thay bằng email của bạn

// Hàm khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    checkPassword();
    initEvents();
    setInterval(createPetal, 300);
});

function checkPassword() {
    const savedPassword = localStorage.getItem('love_site_password');
    if (savedPassword === PASSWORD) {
        unlockWebsite();
    } else {
        document.getElementById('passwordScreen').style.display = 'flex';
        document.getElementById('content').classList.add('hidden');
    }
}

function unlockWebsite() {
    localStorage.setItem('love_site_password', PASSWORD);
    document.getElementById('passwordScreen').style.display = 'none';
    document.getElementById('content').classList.remove('hidden');
    initApp();
    document.body.addEventListener('click', handleFirstInteraction, { once: true });
}

function handleFirstInteraction() {
    const bgMusic = document.getElementById('bgMusic');
    document.querySelector('.music-control').style.display = 'block';
    
    bgMusic.volume = 0.3;
    bgMusic.play()
        .then(() => {
            isMusicPlaying = true;
            document.getElementById('musicBtn').innerHTML = '<i class="fas fa-pause"></i>';
        })
        .catch(error => {
            console.error("Không thể phát nhạc:", error);
            document.getElementById('musicAlert').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('musicAlert').classList.add('hidden');
            }, 5000);
        });
}

function initEvents() {
    document.getElementById('unlockBtn').addEventListener('click', function(e) {
        e.preventDefault();
        const input = document.getElementById('passwordInput').value;
        if (input === PASSWORD) {
            unlockWebsite();
        } else {
            const errorElement = document.getElementById('passwordError');
            errorElement.textContent = "Sai rùi bbi à hãy nhập lại điiiiii";
            errorElement.style.opacity = 1;
            setTimeout(() => errorElement.style.opacity = 0, 2000);
        }
    });

    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('unlockBtn').click();
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('love_site_password');
        location.reload();
    });

    document.getElementById('backupBtn').addEventListener('click', backupLettersToEmail);
}

function initApp() {
    startLoveCounter();
    initMusicPlayer();
    initPhotoGallery();
    initLoveLetter();
    showSavedLetter();
}

function startLoveCounter() {
    const loveDate = new Date('2025-7-14');
    
    function updateCounter() {
        const now = new Date();
        const diff = now - loveDate;
        
        document.getElementById('years').textContent = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        document.getElementById('days').textContent = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
        document.getElementById('hours').textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById('minutes').textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    }
    
    updateCounter();
    setInterval(updateCounter, 60000);
}

function initMusicPlayer() {
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    
    musicBtn.addEventListener('click', function() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            bgMusic.play()
                .then(() => {
                    musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
                })
                .catch(error => {
                    alert('🎵 Hãy nhấn cho phép phát nhạc nếu trình duyệt yêu cầu!');
                });
        }
        isMusicPlaying = !isMusicPlaying;
    });
}

function initPhotoGallery() {
    const photos = [
        { url: 'assets/images/photo1.jpg', caption: 'Ngày đầu tiên gặp nhau' },
        { url: 'assets/images/photo2.jpg', caption: 'Kỷ niệm 1 năm' },
        { url: 'assets/images/photo3.jpg', caption: 'Du lịch cùng nhau' },
        { url: 'assets/images/thuguiem.jpg', caption: 'Lá thư đầu anh viết cho em' }
    ];
    
    const gallery = document.getElementById('photoGallery');
    
    photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.caption;
        img.addEventListener('click', () => alert(photo.caption));
        gallery.appendChild(img);
    });
}

function initLoveLetter() {
    const form = document.getElementById('loveLetterForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const letterContent = document.getElementById('letterContent').value;
        
        if (letterContent.trim()) {
            saveLetterToLocal(letterContent);
            alert('💌 Thư của bạn đã được lưu!');
            form.reset();
            showSavedLetter();
        } else {
            alert('Vui lòng viết nội dung thư trước khi gửi!');
        }
    });
}
function getLettersFromLocal() {
    const letters = localStorage.getItem(STORAGE_KEY);
    return letters ? JSON.parse(letters) : [];
}

function saveLetterToLocal(content) {
    const letters = getLettersFromLocal();
    const newLetter = {
        content: content,
        timestamp: new Date().toISOString()
    };
    letters.unshift(newLetter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));

    // 🔥 Lưu vào Firebase
    firebase.firestore().collection("love_letters").add(newLetter)
        .then(() => {
            console.log("✅ Đã lưu thư vào Firebase");
        })
        .catch((error) => {
            console.error("❌ Lỗi khi lưu vào Firebase:", error);
        });
}



function showSavedLetter() {
  const displayElement = document.getElementById('savedLetter');

  firebase.firestore().collection("love_letters")
    .orderBy("timestamp", "desc")
    .limit(1)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const letter = doc.data();
        displayElement.innerHTML = `
          <h3>Thư gần nhất:</h3>
          <p>${letter.content}</p>
          <small>Gửi lúc: ${new Date(letter.timestamp).toLocaleString()}</small>
        `;
      } else {
        displayElement.innerHTML = '<p>Chưa có thư được lưu...</p>';
      }
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thư từ Firebase:", error);
      displayElement.innerHTML = '<p class="error-text">Không thể tải thư từ server.</p>';
    });
}

async function backupLettersToEmail() {
  const letters = getLettersFromLocal();
  if (letters.length === 0) {
    alert('Không có thư nào để backup!');
    return;
  }

  try {
    // 1. Gửi request đến Google Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ 
        action: "backup", 
        email: BACKUP_EMAIL, // Thay bằng email của bạn
        letters: letters 
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    // 2. Kiểm tra lỗi HTTP (404, 500...)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Lỗi server');
    }

    // 3. Xử lý kết quả thành công
    const data = await response.json();
    alert('✅ Backup thành công!');
  } catch (error) {
    // 4. Xử lý lỗi
    console.error('Lỗi khi backup:', error);
    alert('❌ Lỗi: ' + error.message);
  }
}

function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.innerHTML = ['🌸', '🌹', '💐', '🌺', '🌷'][Math.floor(Math.random() * 5)];
    petal.style.left = Math.random() * window.innerWidth + 'px';
    petal.style.fontSize = (Math.random() * 20 + 10) + 'px';
    petal.style.opacity = Math.random() * 0.7 + 0.3;
    petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), 5000);
}
