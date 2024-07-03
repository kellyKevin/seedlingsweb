// app.js

// Import auth from firebase-config.js
import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Add event listener to the form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from submitting

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Display user information
        document.getElementById('userName').textContent = user.displayName || user.email;
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('signoutButton').style.display = 'block';

        alert('Login successful!');
        // Redirect to home page or desired page
        window.location.href = 'new.html'; 

    } catch (error) {
        console.error('Error logging in:', error);
        errorMessage.textContent = 'Login failed: ' + error.message;
    }
});

// Sign out button functionality
document.getElementById('signOut').addEventListener('click', async () => {
    try {
        await signOut(auth);
        // Reset UI
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('signoutButton').style.display = 'none';
        console.log('User signed out');
        // Redirect to login page after sign out
        window.location.href = 'login.html'; 
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Check if user is already signed in on page load
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        document.getElementById('userName').textContent = user.displayName || user.email;
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('signoutButton').style.display = 'block';
    } else {
        // No user is signed in
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('signoutButton').style.display = 'none';
    }
});
