/* Плавное раскрытие ответов в «Если вы идёте впервые».
   Без JavaScript работают встроенные <details> (name="faq" — открыт один ответ за раз):
   ответ открывается сразу, текст мягко проявляется (styles.css).
   Со скриптом высота раскрывается и сворачивается плавно: анимация сетки 0fr ↔ 1fr
   (Web Animations). Обычный CSS-переход тут не годится: только что открытый <details>
   браузер показывает без перехода. «Один ответ за раз» тогда держит сам скрипт — иначе
   браузер закрывал бы соседний ответ мгновенно, и его нельзя было бы плавно свернуть.
   Длительности и плавность — переменные --acc-* в styles.css.
   При настройке «уменьшить движение» скрипт ничего не меняет. */
(function () {
  "use strict";

  var items = Array.prototype.slice.call(document.querySelectorAll(".faq__item"));
  if (!items.length || !("open" in items[0]) || !items[0].animate) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.documentElement.classList.add("has-js");

  var css = getComputedStyle(document.documentElement);
  var expand = parseFloat(css.getPropertyValue("--acc-expand")) || 300;
  var collapse = parseFloat(css.getPropertyValue("--acc-collapse")) || 250;
  var ease = css.getPropertyValue("--acc-ease").trim() || "ease-out";

  function play(item, opening) {
    var run = item.faqRun;
    if (run) {
      // Нажали, пока ответ ещё двигается: разворачиваем движение с того же места
      if (run.opening !== opening) {
        run.opening = opening;
        item.classList.toggle("is-closing", !opening);
        run.anims.forEach(function (a) { a.reverse(); });
      }
      return;
    }

    var panel = item.querySelector(".faq__panel");
    var inner = item.querySelector(".faq__panel-inner");
    var options = { duration: opening ? expand : collapse, easing: ease, fill: "forwards" };
    if (opening) item.open = true;
    item.classList.toggle("is-closing", !opening);

    run = item.faqRun = {
      opening: opening,
      anims: [
        panel.animate({ gridTemplateRows: opening ? ["0fr", "1fr"] : ["1fr", "0fr"] }, options),
        inner.animate(opening
          ? { opacity: [0, 1], filter: ["blur(2px)", "blur(0px)"] }
          : { opacity: [1, 0], filter: ["blur(0px)", "blur(2px)"] }, options)
      ]
    };

    run.anims[0].onfinish = function () {
      // Каждый разворот меняет и направление, и цель, поэтому итог — последняя цель
      if (!run.opening) item.open = false;
      item.classList.remove("is-closing");
      run.anims.forEach(function (a) { a.cancel(); });
      item.faqRun = null;
    };
  }

  items.forEach(function (item) {
    var group = item.getAttribute("name");
    if (group) {
      item.setAttribute("data-group", group);
      item.removeAttribute("name");
    }

    item.querySelector("summary").addEventListener("click", function (event) {
      event.preventDefault();
      var run = item.faqRun;
      var isOpen = run ? run.opening : item.open;
      if (isOpen) {
        play(item, false);
        return;
      }
      items.forEach(function (other) {
        var otherOpen = other.faqRun ? other.faqRun.opening : other.open;
        if (other !== item && otherOpen && other.getAttribute("data-group") === item.getAttribute("data-group")) {
          play(other, false);
        }
      });
      play(item, true);
    });
  });
})();
