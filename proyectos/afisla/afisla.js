let lastScroll = 0;
const header = document.querySelector('.project-header');

window.addEventListener('scroll', () => {
    let current = window.scrollY;
    let isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    if (current > lastScroll && current > 60) {
        header.style.transform = "translateY(-100%)";
    } else {
        header.style.transform = "translateY(0)";
    }
    
    lastScroll = current;
});
// Blur Loading
document.querySelectorAll('.blur-load').forEach(img => {
  const full = img.dataset.full;
  const fullImg = new Image();
  fullImg.src = full;
  fullImg.onload = () => {
    img.src = full;
    img.classList.add('loaded');
  };
});