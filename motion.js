/* Плавное появление разделов при прокрутке: заголовок, затем содержимое, по очереди.
   Скрываются только блоки, которые ниже экрана, и только этим скриптом — поэтому
   без JavaScript, в старом браузере и при настройке «уменьшить движение» всё видно сразу.
   Оформление — классы .reveal / .is-in в styles.css. */
(function () {
  "use strict";

  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Подвал не трогаем: он в самом низу, ниже него не прокрутить — он должен быть виден всегда.
  var selector = [
    ".section .section__grid > *",      // заголовок раздела и его содержимое
    ".section .feed > .post-card",      // карточки новостей
    ".post__body > *"                   // фото и текст на странице новости
  ].join(",");

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0 }); // появляется, как только хоть краешек блока на экране

  var screenBottom = window.innerHeight;
  var order = new Map(); // порядковый номер блока внутри родителя — для задержки по очереди

  Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
    var box = el.getBoundingClientRect();
    if (box.height === 0 || box.top < screenBottom) return; // уже на экране или скрыт — не трогаем

    var parent = el.parentElement;
    var n = order.get(parent) || 0;
    order.set(parent, n + 1);

    el.classList.add("reveal");
    if (n > 0) el.classList.add("reveal--d" + Math.min(n, 3));
    observer.observe(el);
  });
})();
