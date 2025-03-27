// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDc0BUeALmpsHyhA28ZvMrccMUIDhsd0cs",
    authDomain: "kisan-89ab2.firebaseapp.com",
    projectId: "kisan-89ab2",
    storageBucket: "kisan-89ab2.firebasestorage.app",
    messagingSenderId: "946744645154",
    appId: "1:946744645154:web:db65576d908d5370c21c7b",
    measurementId: "G-1HD0X1TD7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get elements
const loginNav = document.getElementById("loginNav");
const navList = document.querySelector("#mainNav ul");

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in, hide login button and show logout button
        loginNav.style.display = "none";

        const logoutButton = document.createElement("li");
        logoutButton.innerHTML = `<a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>`;
        navList.appendChild(logoutButton);

        document.getElementById("logoutBtn").addEventListener("click", () => {
            signOut(auth).then(() => {
                window.location.reload(); // Reload the page to reflect changes
            }).catch((error) => {
                console.error("Logout Error:", error);
            });
        });
    } else {
        // User is not logged in, show login button
        loginNav.style.display = "block";
    }
});

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in, hide the login button
        const loginNav = document.getElementById("loginNav");
        if (loginNav) {
            loginNav.style.display = "none";
        }
    }
});
// Login Function
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const loginMessage = document.getElementById('loginMessage');
    const loginButton = document.getElementById('loginButton');

    if (!email || !password) {
        displayMessage('Please enter email and password.', 'red');
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            displayMessage('Login successful! Redirecting...', '#058e69');
            setTimeout(() => {
                window.location.href = 'deep.html';
            }, 2000);
        })
        .catch((error) => {
            displayMessage(`Login failed: ${error.message}`, 'red');
            loginButton.disabled = false;
            loginButton.textContent = "Login";
        });
}

// Display message function
function displayMessage(message, color) {
    const loginMessage = document.getElementById('loginMessage');
    loginMessage.style.color = color;
    loginMessage.textContent = message;
}


// Attach event listener
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("loginButton").addEventListener("click", login);
});
