const links = [...document.querySelectorAll('.nav-links a')];

const internalLinks = links.filter(a => a.getAttribute('href').startsWith('#'));
const sections = internalLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      internalLinks.forEach(l=>l.classList.remove('active'));
      const id = '#'+e.target.id;
      const active = internalLinks.find(l=>l.getAttribute('href')===id);
      if(active) active.classList.add('active');
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });

sections.forEach(s=>io.observe(s));

const rev = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('show');
      rev.unobserve(e.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>rev.observe(el));

document.getElementById('y').textContent = new Date().getFullYear();

// ==== EmailJS (configura tus IDs)
const PUBLIC_KEY  = "PON_AQUI_TU_PUBLIC_KEY";
const SERVICE_ID  = "PON_AQUI_TU_SERVICE_ID";
const TEMPLATE_ID = "PON_AQUI_TU_TEMPLATE_ID";

emailjs.init({ publicKey: PUBLIC_KEY });

const btn = document.getElementById('send');
const form = document.getElementById('contact-form');
const okMsg = document.getElementById('ok');

btn.addEventListener('click', ()=>{
  if(!form.reportValidity()) return;

  btn.disabled = true;
  btn.textContent = "Enviando…";

  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
    sent_at: new Date().toLocaleString()
  };

  emailjs.send(SERVICE_ID, TEMPLATE_ID, data)
    .then(()=>{
      okMsg.style.display = 'block';
      form.reset();
    })
    .catch(err=>{
      alert("No se pudo enviar el mensaje. Verifica EmailJS.\n\n" + JSON.stringify(err));
    })
    .finally(()=>{
      btn.disabled = false;
      btn.textContent = "Enviar";
    });
});
// ==== ANIMACIÓN DE TEXTO ====
const isMobile= window.matchMedia("(max-width: 768px)").matches;

const roles = isMobile ? [
  "Desarrollador Backend",
  "Desarrollador Software"
] : [
  "Desarrollador Backend",
  "Desarrollador de Aplicaciones",
  "Desarrollador de Software"
];

const textElement = document.getElementById("typing-text");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  const current = roles[roleIndex];
  const visible = current.substring(0, charIndex);
  textElement.textContent = visible;

  if (!deleting && charIndex < current.length) {
    charIndex++;
    setTimeout(typeEffect, 50);
  } 
  else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 35); 
  } 
  else if (!deleting && charIndex === current.length) {
    setTimeout(() => { deleting = true; typeEffect(); }, 1500);
  } 
  else if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeEffect, 300);
  }
}

if (textElement) typeEffect();

// ===== MENÚ LATERAL =====
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const closeBtn = document.querySelector(".close-menu");
  const sideMenu = document.querySelector(".side-menu");
  const overlay = document.querySelector(".overlay");

  function toggleMenu(open) {
    sideMenu.classList.toggle("active", open);
    overlay.classList.toggle("active", open);
  }

  if (toggle && sideMenu && overlay) {
    toggle.addEventListener("click", () => toggleMenu(true));
    closeBtn.addEventListener("click", () => toggleMenu(false));
    overlay.addEventListener("click", () => toggleMenu(false));

    // Cierra el menú al hacer clic en un enlace
    sideMenu.querySelectorAll("a").forEach(link =>
      link.addEventListener("click", () => toggleMenu(false))
    );
  }
});