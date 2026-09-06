/*
  Здесь находятся данные праздника.
  Позже их можно заменить на данные из Firebase.
*/

const PARTY_CONFIG = {
  date: "26-27 сентября",
  time: "14:00",
  venueName: "Шумахеры",
  venueAddress: "",
  mapUrl: "https://maps.google.com/",
  telegramUrl: "https://t.me/"
};

/*
  Пока персональные данные находятся здесь только для демонстрации.
  Позже этот объект можно заменить на загрузку данных из базы.
*/
const GUESTS = {
  dima: {
    name: "Дима",
    photo: "images/dima.jpg",
    greeting: "Будем ждать тебя ❤️"
  },
  sasha: {
    name: "Саша",
    photo: "../images/guest-placeholder.svg",
    greeting: "Без тебя этот праздник точно будет не таким 😎"
  },
  andrey: {
    name: "Андрей",
    photo: "../images/guest-placeholder.svg",
    greeting: "Надеемся увидеть тебя на празднике ❤️"
  }
};
