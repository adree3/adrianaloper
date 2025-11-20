/* GESTIÓN DE NAVEGACIÓN Y ESTADO INICIAL */
const links = [...document.querySelectorAll('.nav-links a')];
const currentPath = window.location.pathname;

// Detección automática de página activa
links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && href !== '/' && currentPath.includes(href)) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }
});

// Determinar si estamos en la Home (SPA)
const inicioSection = document.querySelector('#inicio');

initCommonLogic();

if (inicioSection) {
    initHomeLogic();
}

/* Logica para el home SPA*/
function initHomeLogic() {
    // Scroll Spy (Marcado de menú al hacer scroll)
    const internalLinks = links.filter(a => {
      const href = a.getAttribute('href');
      return href && href.startsWith('#');
    });    
    const sections = internalLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                internalLinks.forEach(l => l.classList.remove('active'));
                const id = '#' + e.target.id;
                const active = internalLinks.find(l => l.getAttribute('href') === id);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(s => io.observe(s));

    // Efecto de Escritura (Typewriter)
    initTypeEffect();

    // Formulario de Contacto
    const form = document.getElementById('contact-form');
    if (form) initContactForm(form);
}

/* LÓGICA COMÚN (HOME + BLOG + PROYECTOS) */
function initCommonLogic() {
    const yearEl = document.getElementById('y');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Animaciones "Reveal" al hacer scroll
    const rev = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('show');
                rev.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => rev.observe(el));

    // Menú Lateral Móvil
    const toggle = document.querySelector(".nav-toggle");
    const closeBtn = document.querySelector(".close-menu");
    const sideMenu = document.querySelector(".side-menu");
    const overlay = document.querySelector(".overlay");
    const fab = document.querySelector(".fab-cv");

    function toggleMenu(open) {
        if (!sideMenu || !overlay) return;
        sideMenu.classList.toggle("active", open);
        overlay.classList.toggle("active", open);
        document.body.classList.toggle("no-scroll", open);
        if (fab) fab.classList.toggle("hidden", open);
    }

    if (toggle) {
        toggle.addEventListener("click", () => toggleMenu(true));
        if (closeBtn) closeBtn.addEventListener("click", () => toggleMenu(false));
        if (overlay) overlay.addEventListener("click", () => toggleMenu(false));
        
        if (sideMenu) {
            sideMenu.querySelectorAll("a").forEach(link =>
                link.addEventListener("click", () => toggleMenu(false))
            );
        }
    }

    // Esconder Topbar en Móvil al hacer Scroll
    const headerEl = document.querySelector('.nav') || document.querySelector('.project-header');
    let lastScroll = 0;
    if (headerEl) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth > 780) return;
            const current = window.pageYOffset;
            if (current > lastScroll && current > 80) {
                nav.classList.add("hide");
            } else {
                nav.classList.remove("hide");
            }
            lastScroll = current;
        });
    }

    // Copiar Email al Portapapeles
    const emailText = document.getElementById("email-text");
    const copyBtn = document.getElementById("copy-email");
    if (emailText && copyBtn) {
        emailText.setAttribute("aria-live", "polite");
        copyBtn.addEventListener("click", () => {
            const email = "adrianalonso200@gmail.com";
            navigator.clipboard.writeText(email);
            emailText.textContent = "¡Correo copiado!";
            setTimeout(() => { emailText.textContent = email; }, 1800);
        });
    }

    // Inicializar Lazy Loading Real
    initRealLazyLoading();
}

/* FUNCIONES AUXILIARES */
// Lazy Loading con IntersectionObserver
function initRealLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const fullSrc = img.dataset.full;

                if (fullSrc) {
                    const fullImage = new Image();
                    fullImage.src = fullSrc;
                    fullImage.onload = () => {
                        img.src = fullSrc;
                        img.classList.add("loaded");
                    };
                }
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "50px" });

    document.querySelectorAll(".blur-load").forEach(img => imageObserver.observe(img));
}

// Efecto de Escritura
function initTypeEffect() {
    const textElement = document.getElementById("typing-text");
    if (!textElement) return;

    const isMobile = window.matchMedia("(max-width: 1020px)").matches;
    const roles = isMobile ?
        ["Desarrollador Backend", "Desarrollador Software"] :
        ["Desarrollador Backend", "Desarrollador de Aplicaciones", "Desarrollador Software"];

    const emptyChar = "\u00A0";
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
        const current = roles[roleIndex];
        const visible = current.substring(0, charIndex);
        textElement.textContent = visible.length === 0 ? emptyChar : visible;

        if (!deleting && charIndex < current.length) {
            charIndex++;
            setTimeout(typeEffect, 50);
        } else if (deleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeEffect, 35);
        } else if (!deleting && charIndex === current.length) {
            setTimeout(() => { deleting = true; typeEffect(); }, 1500);
        } else if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeEffect, 300);
        }
    }

    textElement.textContent = emptyChar;
    typeEffect();
}

//  Formulario de Contacto y EmailJS
function initContactForm(form) {
    const PUBLIC_KEY = "GeqxUY2IrRxe9-K1X";
    const SERVICE_ID = "service_gvbw2at";
    const TEMPLATE_ID = "template_78k8i9a";
    const btn = document.getElementById('send');
    const okMsg = document.getElementById('ok');

    let emailJSReady = false;

    function loadEmailJS() {
        return new Promise(resolve => {
            if (emailJSReady) return resolve();
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
            script.onload = () => {
                emailjs.init({ publicKey: PUBLIC_KEY });
                emailJSReady = true;
                resolve();
            };
            document.body.appendChild(script);
        });
    }

    if (btn && okMsg) {
        btn.addEventListener('click', () => {
            if (!form.reportValidity()) return;

            btn.disabled = true;
            btn.textContent = "Enviando…";

            const data = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value,
                sent_at: new Date().toLocaleString()
            };

            loadEmailJS().then(() => {
                return emailjs.send(SERVICE_ID, TEMPLATE_ID, data);
            })
            .then(() => {
                okMsg.classList.add("show");
                form.reset();
                setTimeout(() => okMsg.classList.remove("show"), 2800);
            })
            .catch(err => {
                alert("No se pudo enviar el mensaje. Verifica EmailJS.\n\n" + JSON.stringify(err));
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = "Enviar";
            });
        });
    }
}