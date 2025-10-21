// ==== NAV scroll spy & reveal animations
const links = [...document.querySelectorAll('.nav-links a')];

// solo enlaces internos (#)
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

// reveal animation
const rev = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('show');
      rev.unobserve(e.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>rev.observe(el));

// año footer
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
