// Blur Loading
document.querySelectorAll(".blur-load").forEach(img => {
  const fullSrc = img.dataset.full;
  if (!fullSrc) return;

  const fullImage = new Image();
  fullImage.src = fullSrc;
  fullImage.onload = () => {
    img.src = fullSrc;
    img.classList.add("loaded");
  };
});