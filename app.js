// ========== FIREBASE CONFIGURATION ==========
// Firebase config - Buraya kendi Firebase bilgilerinizi ekleyin
const firebaseConfig = {
    apiKey: "AIzaSyDyGNrzw1a55LHv-LP5gjuPpFWmHu1a6yU",
    authDomain: "ali23-cfd02.firebaseapp.com",
    projectId: "ali23-cfd02",
    storageBucket: "ali23-cfd02.firebasestorage.app",
    messagingSenderId: "759021285078",
    appId: "1:759021285078:web:f7673f89125ff3dad66377"
};

// Firebase initialization - Bu kısım Firebase SDK'sı yüklendikten sonra çalışacak
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// ========== DOM ELEMENTS ==========
const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const registerModal = document.getElementById('registerModal');
const registerSubmitBtn = document.getElementById('registerSubmitBtn');
const logoutBtn = document.getElementById('logoutBtn');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messagesContainer');
const channelElements = document.querySelectorAll('.channel');
const currentChannelName = document.getElementById('currentChannelName');
const currentUsername = document.getElementById('currentUsername');
const currentMemberName = document.getElementById('currentMemberName');

// ========== STATE MANAGEMENT ==========
let currentUser = null;
let currentChannel = 'genel';
let messages = [];

// ========== AUTHENTICATION FUNCTIONS ==========

// Login fonksiyonu
loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Lütfen tüm alanları doldurun!', 'error');
        return;
    }
    
    // Firebase Authentication ile giriş yapma
    // try {
    //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //     currentUser = userCredential.user;
    //     showMainApp();
    // } catch (error) {
    //     showNotification('Giriş başarısız: ' + error.message, 'error');
    // }
    
    // Demo için direkt giriş
    currentUser = {
        email: email,
        displayName: email.split('@')[0]
    };
    showMainApp();
});

// Register modal açma/kapama
registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
    registerModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// Kayıt fonksiyonu
registerSubmitBtn.addEventListener('click', async () => {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!username || !email || !password) {
        showNotification('Lütfen tüm alanları doldurun!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Şifre en az 6 karakter olmalı!', 'error');
        return;
    }
    
    // Firebase Authentication ile kayıt olma
    // try {
    //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //     await updateProfile(userCredential.user, { displayName: username });
    //     currentUser = userCredential.user;
    //     registerModal.style.display = 'none';
    //     showMainApp();
    // } catch (error) {
    //     showNotification('Kayıt başarısız: ' + error.message, 'error');
    // }
    
    // Demo için direkt kayıt
    currentUser = {
        email: email,
        displayName: username
    };
    registerModal.style.display = 'none';
    showMainApp();
    showNotification('Başarıyla kayıt oldunuz!', 'success');
});

// Çıkış fonksiyonu
logoutBtn.addEventListener('click', async () => {
    // await signOut(auth);
    currentUser = null;
    showLoginScreen();
    showNotification('Başarıyla çıkış yaptınız!', 'success');
});

// ========== UI FUNCTIONS ==========

function showMainApp() {
    loginScreen.style.display = 'none';
    mainApp.style.display = 'flex';
    
    if (currentUser) {
        currentUsername.textContent = currentUser.displayName || currentUser.email.split('@')[0];
        currentMemberName.textContent = currentUser.displayName || 'Sen';
    }
    
    loadMessages();
}

function showLoginScreen() {
    loginScreen.style.display = 'flex';
    mainApp.style.display = 'none';
}

// ========== CHANNEL SWITCHING ==========

channelElements.forEach(channel => {
    channel.addEventListener('click', () => {
        // Aktif kanal değiştirme
        channelElements.forEach(ch => ch.classList.remove('active'));
        channel.classList.add('active');
        
        currentChannel = channel.dataset.channel;
        currentChannelName.textContent = currentChannel;
        
        // Mesajları temizle ve yeni kanalın mesajlarını yükle
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">
                    <i class="fas fa-hashtag"></i>
                </div>
                <h2>#${currentChannel} kanalına hoş geldin!</h2>
                <p>Bu kanalın başlangıcı. Sohbete başla!</p>
            </div>
        `;
        
        loadMessages();
    });
});

// ========== MESSAGE FUNCTIONS ==========

// Enter tuşu ile mesaj gönderme
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    if (!currentUser) {
        showNotification('Mesaj göndermek için giriş yapmalısınız!', 'error');
        return;
    }
    
    // Firebase Firestore'a mesaj kaydetme
    // try {
    //     await addDoc(collection(db, 'channels', currentChannel, 'messages'), {
    //         text: messageText,
    //         author: currentUser.displayName || currentUser.email,
    //         timestamp: serverTimestamp(),
    //         uid: currentUser.uid
    //     });
    // } catch (error) {
    //     showNotification('Mesaj gönderilemedi!', 'error');
    // }
    
    // Demo için lokal mesaj ekleme
    const message = {
        text: messageText,
        author: currentUser.displayName || currentUser.email.split('@')[0],
        timestamp: new Date(),
        uid: currentUser.email
    };
    
    displayMessage(message);
    messageInput.value = '';
}

function displayMessage(message) {
    // Hoş geldin mesajını kaldır
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    const time = new Date(message.timestamp);
    const timeString = time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-author">${message.author}</span>
                <span class="message-timestamp">${timeString}</span>
            </div>
            <div class="message-text">${escapeHtml(message.text)}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function loadMessages() {
    // Firebase'den mesajları dinleme
    // const q = query(
    //     collection(db, 'channels', currentChannel, 'messages'),
    //     orderBy('timestamp', 'asc')
    // );
    
    // onSnapshot(q, (snapshot) => {
    //     snapshot.docChanges().forEach((change) => {
    //         if (change.type === 'added') {
    //             displayMessage(change.doc.data());
    //         }
    //     });
    // });
    
    // Demo mesajlar
    if (currentChannel === 'genel') {
        setTimeout(() => {
            displayMessage({
                text: 'Sahikali\'ye hoş geldin! 🎉',
                author: 'Sahikali Bot',
                timestamp: new Date()
            });
        }, 500);
    }
}

// ========== UTILITY FUNCTIONS ==========

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f04747' : type === 'success' ? '#43b581' : '#5865f2'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== SERVER SWITCHING ==========
document.querySelectorAll('.server-icon').forEach(server => {
    server.addEventListener('click', function() {
        document.querySelectorAll('.server-icon').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
        
        const serverName = this.dataset.server === 'home' ? 'Sahikali' : `Sunucu ${this.dataset.server}`;
        document.getElementById('serverNameTitle').textContent = serverName;
    });
});

// ========== INITIALIZATION ==========
console.log('🎮 Sahikali Discord Clone başlatıldı!');
console.log('💡 Firebase yapılandırması için firebaseConfig objesini doldurun');
