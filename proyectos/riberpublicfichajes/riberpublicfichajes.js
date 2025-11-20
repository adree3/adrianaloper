// Carrusel de imágenes con autoplay y controles manuales
(function () {
  const AUTOPLAY_MS = 5000;

  function initCarousel(root) {
    const track = root.querySelector('.carousel-track');
    const prevBtn = root.querySelector('.carousel-btn.prev');
    const nextBtn = root.querySelector('.carousel-btn.next');
    const dotsWrap = root.querySelector('.carousel-dots');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('img'));
    if (slides.length === 0) return;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.setAttribute('data-clone', 'first');
    lastClone.setAttribute('data-clone', 'last');
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const total = slides.length;
    let index = 1;
    let autoplayId = null;
    let isTransitioning = false;

    track.style.display = 'flex';
    track.style.willChange = 'transform';
    Array.from(track.children).forEach((el) => {
      el.style.minWidth = '100%';
      el.style.flex = '0 0 100%';
    });

    function goToIndex(i, withTransition = true) {
      track.style.transition = withTransition ? 'transform 0.6s ease-in-out' : 'none';
      track.style.transform = `translateX(-${i * 100}%)`;
    }
    function next() {
      if (isTransitioning) return;
      index++;
      update();
    }
    function prev() {
      if (isTransitioning) return;
      index--;
      update();
    }
    function update() {
      isTransitioning = true;
      goToIndex(index, true);
      updateDots();
    }
    const dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
        btn.addEventListener('click', () => {
          index = i + 1;
          update();
        });
        dotsWrap.appendChild(btn);
        dots.push(btn);
      }
    }
    function updateDots() {
      if (!dots.length) return;
      const realIndex = (index - 1 + total) % total;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === realIndex));
    }
    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      const children = track.children;
      if (children[index] && children[index].getAttribute('data-clone') === 'first') {
        index = 1;
        goToIndex(index, false);
      } else if (children[index] && children[index].getAttribute('data-clone') === 'last') {
        index = total;
        goToIndex(index, false);
      }
    });

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (autoplayId) clearInterval(autoplayId);
      autoplayId = null;
    }

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);

    requestAnimationFrame(() => goToIndex(index, false));
    updateDots();
    startAutoplay();
  }

  document.querySelectorAll('.project-hero[data-carousel="desktop"] .carousel').forEach(initCarousel);
  document.querySelectorAll('.mobile-gallery .carousel').forEach(initCarousel);
})();
