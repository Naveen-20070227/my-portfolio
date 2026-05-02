/* ============================================================
   Portfolio JS
   · Navbar scroll float
   · Mobile menu
   · Hero image pointer parallax
   · Skill card neighbour push effect
   · Pointer drag color trail
   · Scroll reveal
   ============================================================ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     1. NAVBAR — float on scroll
  ───────────────────────────────────────────── */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ─────────────────────────────────────────────
     2. MOBILE MENU
  ───────────────────────────────────────────── */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () =>
      navLinks.classList.toggle("open"),
    );
    navLinks
      .querySelectorAll("a")
      .forEach((a) =>
        a.addEventListener("click", () => navLinks.classList.remove("open")),
      );
  }

  /* ─────────────────────────────────────────────
     3. HERO IMAGE — pointer parallax (3D tilt)
        Tracks mouse over the entire hero section
  ───────────────────────────────────────────── */
  const heroSection = document.querySelector(".hero");
  const heroImg = document.querySelector(".hero-image img");

  if (heroSection && heroImg) {
    heroSection.addEventListener(
      "mousemove",
      (e) => {
        const rect = heroSection.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        heroImg.style.transform = `
        perspective(800px)
        rotateY(${dx * 14}deg)
        rotateX(${-dy * 10}deg)
        scale(1.04)
      `;
      },
      { passive: true },
    );

    heroSection.addEventListener("mouseleave", () => {
      heroImg.style.transform =
        "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    });
  }

  /* ─────────────────────────────────────────────
     4. SKILL CARDS — neighbour push effect
        JS handles what CSS siblings cannot:
        push in ALL directions based on geometry
  ───────────────────────────────────────────── */
  document.querySelectorAll(".skills-container").forEach((container) => {
    const cards = Array.from(container.querySelectorAll(".skill-card"));

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        const hoveredRect = card.getBoundingClientRect();
        const cx = hoveredRect.left + hoveredRect.width / 2;
        const cy = hoveredRect.top + hoveredRect.height / 2;

        cards.forEach((other) => {
          if (other === card) return;
          const oRect = other.getBoundingClientRect();
          const ox = oRect.left + oRect.width / 2;
          const oy = oRect.top + oRect.height / 2;
          const dx = ox - cx;
          const dy = oy - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200 && dist > 0) {
            const force = (1 - dist / 200) * 18;
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * force;
            const pushY = Math.sin(angle) * force;
            other.style.transition =
              "transform 0.35s cubic-bezier(0.34,1.06,0.64,1), box-shadow 0.35s ease";
            other.style.transform = `translate(${pushX}px, ${pushY}px) scale(0.94)`;
            other.style.filter = "brightness(0.92)";
          }
        });
      });

      card.addEventListener("mouseleave", () => {
        cards.forEach((other) => {
          if (other === card) return;
          other.style.transform = "";
          other.style.filter = "";
        });
      });
    });
  });

  /* ─────────────────────────────────────────────
     5. POINTER DRAG COLOR TRAIL
        Spawns orbs that follow the cursor and
        fade out, leaving a purple/violet streak
  ───────────────────────────────────────────── */
  const TRAIL_COUNT = 22;
  const COLORS = [
    "rgba(124,58,237,0.72)",
    "rgba(155,114,245,0.62)",
    "rgba(167,139,250,0.68)",
    "rgba(196,160,255,0.55)",
    "rgba(109,40,217,0.60)",
    "rgba(194,176,255,0.50)",
  ];

  const trailDots = [];
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement("div");
    dot.style.cssText = [
      "position:fixed",
      "top:0",
      "left:0",
      "pointer-events:none",
      "border-radius:50%",
      "z-index:9999",
      "opacity:0",
      "transform:translate(-50%,-50%) scale(0)",
      "will-change:transform,opacity",
      "mix-blend-mode:multiply",
    ].join(";");
    document.body.appendChild(dot);
    trailDots.push(dot);
  }

  let trailHead = 0;
  let lastSpawn = 0;

  document.addEventListener(
    "mousemove",
    (e) => {
      const now = Date.now();
      if (now - lastSpawn < 25) return;
      lastSpawn = now;

      const dot = trailDots[trailHead];
      const size = 7 + Math.random() * 12;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.background = color;
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      dot.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      dot.style.transition = "none";
      dot.style.opacity = "1";
      dot.style.transform = "translate(-50%,-50%) scale(1)";

      // Fade out after brief delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          dot.style.transition = "opacity 0.55s ease, transform 0.55s ease";
          dot.style.opacity = "0";
          dot.style.transform = "translate(-50%,-50%) scale(0.15)";
        });
      });

      trailHead = (trailHead + 1) % TRAIL_COUNT;
    },
    { passive: true },
  );

  /* ─────────────────────────────────────────────
     6. SCROLL REVEAL — staggered fade-in
  ───────────────────────────────────────────── */
  const revealStyle = document.createElement("style");
  revealStyle.textContent = [
    ".rv-pending{opacity:0;transform:translateY(28px)}",
    ".rv-done{opacity:1!important;transform:none!important}",
  ].join("");
  document.head.appendChild(revealStyle);

  const revealEls = document.querySelectorAll(
    ".project-card, .skill-card, .contact-card",
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.replace("rv-pending", "rv-done");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  revealEls.forEach((el, i) => {
    el.classList.add("rv-pending");
    el.style.transition = `opacity 0.5s ease ${i * 0.055}s, transform 0.5s cubic-bezier(0.34,1.06,0.64,1) ${i * 0.055}s`;
    revealObserver.observe(el);
  });
})();
