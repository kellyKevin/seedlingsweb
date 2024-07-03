import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBUZJDLktz7qBHUPj_XtPybxz3vkz5cYlQ",
        authDomain: "seedlingsweb-b6e5e.firebaseapp.com",
        projectId: "seedlingsweb-b6e5e",
        storageBucket: "seedlingsweb-b6e5e.appspot.com",
        messagingSenderId: "1042431917002",
        appId: "1:1042431917002:web:ebea14cb0326379967ed33",
        measurementId: "G-JVWHZPDJX7"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check if user is signed in
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
        document.getElementById('signoutButton').style.display = 'block';
    } else {
        console.log('No user signed in');
        document.getElementById('signoutButton').style.display = 'none';
    }
});

// Handle form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from submitting

    // Check if terms are agreed
    if (!document.getElementById('termsCheckbox').checked) {
        document.getElementById('errorMessage').textContent = 'Please agree to the Terms and Conditions.';
        return;
    }

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        // Create user with email, password, and username
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username }); // Set display name (username)
        alert('Sign up successful!');
        window.location.href = 'login.html'; // Redirect to login page
    } catch (error) {
        console.error('Error registering user:', error);
        errorMessage.textContent = 'Error registering user: ' + error.message;
    }
});

// Sign out button functionality
document.getElementById('signOut').addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log('User signed out');
        window.location.href = 'login.html'; // Redirect to login page after sign out
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Modal functionality (open, close, agree terms)
function openPopup() {
    document.getElementById("termsModal").style.display = "block";
}

function closePopup() {
    document.getElementById("termsModal").style.display = "none";
}

document.getElementById("termsLink").addEventListener("click", function (event) {
    event.preventDefault();
    openPopup();
});

document.getElementById("closeTermsModal").addEventListener("click", function () {
    closePopup();
});

document.getElementById("agreeTerms").addEventListener("click", function () {
    document.getElementById("termsCheckbox").checked = true;
    document.getElementById("termsCheckbox").disabled = false;
    closePopup();
});
