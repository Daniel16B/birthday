import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyCpRM6bXIxiipCJjHFjyvptZvM6XI8MpLA",
	authDomain: "birthdayinvitee.firebaseapp.com",
	projectId: "birthdayinvitee",
	storageBucket: "birthdayinvitee.firebasestorage.app",
	messagingSenderId: "866595863097",
	appId: "1:866595863097:web:43661d8d288921bd986be8",
	measurementId: "G-CGQZEFVTJC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };