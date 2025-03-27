// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Register Function
async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const location = document.getElementById('registerLocation').value;
    const registerMessage = document.getElementById('registerMessage');
    const registerButton = document.getElementById('registerButton');

    if (!name || !email || !password || !location) {
        registerMessage.style.color = 'red';
        registerMessage.textContent = 'All fields are required!';
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = "Registering...";

    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            location: location,
            uid: user.uid
        });

        registerMessage.style.color = 'green';
        registerMessage.textContent = 'Registration successful! Redirecting...';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        registerMessage.style.color = 'red';
        registerMessage.textContent = `Error: ${error.message}`;
        registerButton.disabled = false;
        registerButton.textContent = "Register";
    }
}

// Attach event listener
document.getElementById("registerButton").addEventListener("click", register);
