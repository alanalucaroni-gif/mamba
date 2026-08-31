(() => {
  const doc = document;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  doc.getElementById("year").textContent = new Date().getFullYear();

  const header = doc.getElementById("siteHeader");
  const onScrollHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  const navToggle = doc.getElementById("navToggle");
  const siteNav = doc.getElementById("siteNav");
  const toggleNav = (force) => {
    const isOpen = typeof force === "boolean" ? force : !siteNav.classList.contains("open");
    siteNav.classList.toggle("open", isOpen);
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    doc.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) {
      setTimeout(() => siteNav.querySelector(".nav-link")?.focus(), 320);
    }
  };
  navToggle.addEventListener("click", () => toggleNav());

  siteNav.querySelectorAll(".nav-link, .btn-cta-nav").forEach((link) => {
    link.addEventListener("click", () => toggleNav(false));
  });

  doc.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && siteNav.classList.contains("open")) toggleNav(false);
  });

  const revealEls = doc.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  const initCarousel = (trackId, prevId, nextId, dotsId, perView) => {
    const track = doc.getElementById(trackId);
    const cards = Array.from(track.children);
    const prevBtn = doc.getElementById(prevId);
    const nextBtn = doc.getElementById(nextId);
    const dotsWrap = doc.getElementById(dotsId);
    const cardCount = cards.length;
    let index = 0;

    dotsWrap.innerHTML = "";
    for (let i = 0; i < cardCount; i++) {
      const dot = doc.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Item ${i + 1}`);
      dot.addEventListener("click", () => {
        index = i;
        update();
      });
      dotsWrap.appendChild(dot);
    }
    const dots = Array.from(dotsWrap.children);

    const visibleCount = () => {
      if (typeof perView === "function") return perView();
      return perView;
    };

    const maxIndex = () => Math.max(0, cardCount - visibleCount());

    const update = () => {
      index = Math.max(0, Math.min(index, maxIndex()));
      const step = cards[0].getBoundingClientRect().width + 22;
      track.style.transform = `translateX(${-index * step}px)`;
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    };

    prevBtn.addEventListener("click", () => {
      index = index === 0 ? maxIndex() : index - 1;
      update();
    });
    nextBtn.addEventListener("click", () => {
      index = index === maxIndex() ? 0 : index + 1;
      update();
    });

    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    requestAnimationFrame(update);
  };

  const flavorCardsPerView = () => {
    const w = doc.body.clientWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  };
  initCarousel("flavorTrack", "prevBtn", "nextBtn", "flavorDots", flavorCardsPerView);

  const testimonialCardsPerView = () => {
    const w = doc.body.clientWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  };
  initCarousel("testimonialTrack", "testPrevBtn", "testNextBtn", "testimonialDots", testimonialCardsPerView);

  const faqItems = doc.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      faqItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-answer").style.maxHeight = null;
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  const form = doc.getElementById("newsletterForm");
  const emailInput = doc.getElementById("newsletterEmail");
  const msg = doc.getElementById("newsletterMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    emailInput.classList.toggle("error", !valid);
    if (!valid) {
      msg.textContent = "Por favor, informe um e-mail válido.";
      msg.classList.add("error");
      emailInput.focus();
      return;
    }
    msg.classList.remove("error");
    msg.textContent = "Inscrição confirmada! Em breve você recebe novidades da Mamba Water Protein.";
    form.reset();
  });
})();

