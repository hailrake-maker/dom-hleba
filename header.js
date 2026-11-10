/* Шапка-панель: шапка закреплена вверху экрана, а после небольшой прокрутки становится
   сплошной тёмной полосой с логотипом поменьше — разделы сайта всегда под рукой.
   Без JavaScript шапка, как раньше, просто остаётся в начале страницы.
   Оформление — классы .is-sticky и .is-scrolled в styles.css. */
(function () {
  "use strict";

  // В файле-превью для Telegram шапок несколько (у каждой страницы своя) — обслуживаем все
  var headers = Array.prototype.slice.call(document.querySelectorAll(".site-header"));
  if (!headers.length || !window.requestAnimationFrame) return;

  // Скрипт работает — запасной режим панели на одних стилях (styles.css, «Панель без JavaScript») не нужен
  document.documentElement.classList.add("has-js");

  var SCROLLED = 24; // через сколько пикселей прокрутки шапка становится панелью
  var waiting = false;

  function update() {
    waiting = false;
    var scrolled = (window.scrollY || window.pageYOffset || 0) > SCROLLED;
    headers.forEach(function (header) {
      header.classList.toggle("is-scrolled", scrolled);
    });
  }

  headers.forEach(function (header) {
    header.classList.add("is-sticky");
  });
  update();

  // Не чаще одного раза за кадр
  window.addEventListener("scroll", function () {
    if (waiting) return;
    waiting = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
})();
