import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function getGuestKey() {
  const path = window.location.pathname.split("/").filter(Boolean);
  const inviteIndex = path.indexOf("invite");

  if (inviteIndex !== -1 && path[inviteIndex + 1]) {
    return path[inviteIndex + 1].toLowerCase();
  }

  const params = new URLSearchParams(window.location.search);
  return (params.get("guest") || "dima").toLowerCase();
}

function loadGuest() {
  const key = getGuestKey();
  const guest = GUESTS[key] || GUESTS.dima;
 
  $("#guestPhoto").style.backgroundImage = `url("${guest.photo}")`;
  $("#guestGreeting").textContent = guest.greeting || "Будем ждать тебя ❤️";
  $("#guestName").textContent = guest.name;
  

  document.title = `Ты приглашён, ${guest.name} — День рождения`;
}

function loadPartyInfo() {
  $("#venueName").textContent = PARTY_CONFIG.venueName;
  $("#venueAddress").textContent = PARTY_CONFIG.venueAddress;
  $("#telegramLink").href = PARTY_CONFIG.telegramUrl;
}

const selections = {
  drinks: [],
  food: [],
  smoking: []
};

function setupChoices() {
  $$("[data-choice-group]").forEach((group) => {
    const groupName = group.dataset.choiceGroup;
    const single = group.dataset.single === "true";

    group.querySelectorAll(".choice").forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.value;

        if (single) {
          group.querySelectorAll(".choice").forEach((item) => {
            item.classList.remove("is-selected");
          });

          button.classList.add("is-selected");
          selections[groupName] = value;
          return;
        }

        button.classList.toggle("is-selected");

        if (button.classList.contains("is-selected")) {
          if (!selections[groupName].includes(value)) {
            selections[groupName].push(value);
          }
        } else {
          selections[groupName] = selections[groupName].filter(
            (item) => item !== value
          );
        }
      });
    });
  });
}

function validateForm() {
  if (selections.drinks.length === 0) {
    alert("Выбери, что ты будешь пить");
    return false;
  }

  if (selections.food.length === 0) {
    alert("Выбери хотя бы один вариант еды");
    return false;
  }

  if (selections.smoking.length === 0) {
    alert("Выбери вариант по курению");
    return false;
  }

  return true;
}

function openModal() {
  const modal = $("#successModal");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = $("#successModal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

async function confirmInvitation() {
  if (!validateForm()) return;

  const guestKey = getGuestKey();
  const guest = GUESTS[guestKey] || GUESTS.dima;

  try {
    await setDoc(doc(db, "responses", guestKey), {
      guestKey: guestKey,
      name: guest.name,
      drinks: selections.drinks,
      food: selections.food,
      smoking: selections.smoking,
      status: "confirmed",
      submittedAt: serverTimestamp()
    });

    console.log("Ответ сохранён!");

    openModal();

  } catch (error) {
    console.error("Ошибка сохранения:", error);

    alert("Не удалось отправить ответ. Попробуй ещё раз.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadGuest();
  loadPartyInfo();
  setupChoices();

  $("#confirmButton").addEventListener("click", confirmInvitation);
  $("#closeModal").addEventListener("click", closeModal);

  $(".modal__backdrop").addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
});
