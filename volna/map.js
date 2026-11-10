// Карта: сначала лёгкая картинка, по нажатию — настоящая карта Яндекса на том же месте.
// Так страница не грузит ~1–2 МБ скриптов карты, пока человек сам не захочет её подвигать,
// и на телефоне палец не «залипает» на карте при прокрутке страницы.
// Без JavaScript картинка — обычная ссылка на Яндекс Карты.
document.querySelectorAll('.map[data-map-src]').forEach(map => {
  const link = map.querySelector('.map__static');
  link.addEventListener('click', event => {
    event.preventDefault();
    const frame = document.createElement('iframe');
    frame.src = map.dataset.mapSrc;
    frame.title = map.dataset.mapTitle || 'Карта';
    frame.allowFullscreen = true;
    map.replaceChildren(frame);
  });
});
