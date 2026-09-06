import { db } from "./firebase.js";

import {
	collection,
	getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
	getAuth,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const auth = getAuth();


const $ = (selector) => document.querySelector(selector);


// --------------------------------------------------
// LOGIN
// --------------------------------------------------

$("#loginForm").addEventListener("submit", async (event) => {

	event.preventDefault();

	const email = $("#email").value.trim();
	const password = $("#password").value;

	$("#loginError").textContent = "";

	try {

		await signInWithEmailAndPassword(
			auth,
			email,
			password
		);

	} catch (error) {

		console.error(error);

		$("#loginError").textContent =
			"Неверный email или пароль.";

	}

});


// --------------------------------------------------
// LOGOUT
// --------------------------------------------------

$("#logoutButton").addEventListener("click", async () => {

	await signOut(auth);

});


// --------------------------------------------------
// AUTH STATE
// --------------------------------------------------

onAuthStateChanged(auth, async (user) => {

	if (user) {

		$("#loginSection").classList.add("hidden");
		$("#adminSection").classList.remove("hidden");

		await loadResponses();

	} else {

		$("#loginSection").classList.remove("hidden");
		$("#adminSection").classList.add("hidden");

	}

});


// --------------------------------------------------
// LOAD RESPONSES
// --------------------------------------------------

async function loadResponses() {

	try {

		const snapshot = await getDocs(
			collection(db, "responses")
		);

		const responses = {};

		snapshot.forEach((document) => {

			responses[document.id] = document.data();

		});


		updateGeneralStats(responses);
		updateChoiceStats(responses);
		renderGuests(responses);

	} catch (error) {

		console.error("Ошибка загрузки ответов:", error);

		alert(
			"Не удалось загрузить ответы. Проверь правила Firestore."
		);

	}

}


// --------------------------------------------------
// GENERAL STATS
// --------------------------------------------------

function updateGeneralStats(responses) {

	const totalGuests = Object.keys(GUESTS).length;
	const accepted = Object.keys(responses).length;
	const pending = Math.max(totalGuests - accepted, 0);

	$("#acceptedCount").textContent = accepted;
	$("#pendingCount").textContent = pending;

}


// --------------------------------------------------
// CHOICE STATS
// --------------------------------------------------

function updateChoiceStats(responses) {

	const drinks = {};
	const food = {};
	const smoking = {};


	Object.values(responses).forEach((response) => {

		countChoices(response.drinks, drinks);
		countChoices(response.food, food);
		countChoices(response.smoking, smoking);

	});


	renderStats(
		"#drinksStats",
		drinks,
		{
			koniak: "Коньяк",
			leker: "Лекёр",
			whiskey: "Виски",
			beer: "Пиво",
			wine: "Вино",
			slaboalkogolka: "Слабо-алкоголка",
			none: "Не пью алкоголь"
		}
	);


	renderStats(
		"#foodStats",
		food,
		{
			pizza: "Пицца",
			meat: "Шашлык",
			sausages: "Сосиски",
			potato: "Картошка",
			salad1: "Салат Цезарь",
			salad2: "Салат с сухариками",
			salad3: "Крабовый салат",
			vegetables: "Овощи",
			fruits: "Фрукти",
			anything: "Мне без разницы"
		}
	);


	renderStats(
		"#smokingStats",
		smoking,
		{
			kalik: "Кальян",
			sigi: "Сигареты",
			iqos: "Айкос",
			none: "Ничего"
		}
	);

}


function countChoices(values, target) {

	if (!Array.isArray(values)) {
		return;
	}

	values.forEach((value) => {

		target[value] = (target[value] || 0) + 1;

	});

}


function renderStats(selector, stats, labels) {

	const container = $(selector);

	container.innerHTML = "";


	Object.entries(labels).forEach(([key, label]) => {

		const count = stats[key] || 0;

		const row = document.createElement("div");

		row.className = "stats-row";

		row.innerHTML = `
            <span>${label}</span>
            <strong>${count}</strong>
        `;

		container.appendChild(row);

	});

}


// --------------------------------------------------
// GUESTS
// --------------------------------------------------

function renderGuests(responses) {

	const container = $("#guestsList");

	container.innerHTML = "";


	Object.entries(GUESTS).forEach(([guestKey, guest]) => {

		const response = responses[guestKey];

		const card = document.createElement("div");

		card.className = "guest-card";


		if (response) {

			card.innerHTML = `
                <button class="guest-header">

                    <span class="guest-name">
                        ${guest.name}
                    </span>

                    <span class="guest-status accepted">
                        Принял
                    </span>

                    <span class="guest-arrow">
                        ▼
                    </span>

                </button>

                <div class="guest-details">

                    <div>
                        <strong>Напитки</strong>
                        <p>${formatChoices(
				response.drinks,
				{
					koniak: "Коньяк",
					leker: "Лекёр",
					whiskey: "Виски",
					beer: "Пиво",
					wine: "Вино",
					slaboalkogolka: "Слабо-алкоголка",
					none: "Не пью алкоголь"
				}
			)}</p>
                    </div>

                    <div>
                        <strong>Еда</strong>
                        <p>${formatChoices(
				response.food,
				{
					pizza: "Пицца",
					meat: "Шашлык",
					sausages: "Сосиски",
					potato: "Картошка",
					salad1: "Салат Цезарь",
					salad2: "Салат с сухариками",
					salad3: "Крабовый салат",
					vegetables: "Овощи",
					fruits: "Фрукти",
					anything: "Мне без разницы"
				}
			)}</p>
                    </div>

                    <div>
                        <strong>Курение</strong>
                        <p>${formatChoices(
				response.smoking,
				{
					kalik: "Кальян",
					sigi: "Сигареты",
					iqos: "Айкос",
					none: "Ничего"
				}
			)}</p>
                    </div>

                </div>
            `;

		} else {

			card.innerHTML = `
                <div class="guest-header">

                    <span class="guest-name">
                        ${guest.name}
                    </span>

                    <span class="guest-status pending">
                         Не ответил
                    </span>

                </div>
            `;

		}


		container.appendChild(card);

	});


	setupGuestCards();

}


// --------------------------------------------------
// EXPAND GUEST
// --------------------------------------------------

function setupGuestCards() {

	document
		.querySelectorAll(".guest-card")
		.forEach((card) => {

			const button =
				card.querySelector(".guest-header");

			const details =
				card.querySelector(".guest-details");


			if (!details) {
				return;
			}


			button.addEventListener("click", () => {

				card.classList.toggle("open");

			});

		});

}


// --------------------------------------------------
// FORMAT CHOICES
// --------------------------------------------------

function formatChoices(values, labels) {

	if (!Array.isArray(values) || values.length === 0) {
		return "—";
	}

	return values
		.map((value) => labels[value] || value)
		.join(", ");

}