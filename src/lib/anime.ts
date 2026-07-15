import { animate, stagger } from "animejs";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function animateHeroIntro(containerId: string) {
  if (prefersReducedMotion()) return;

  animate(`${containerId} .hero-badge`, {
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    ease: "outExpo",
  });

  // Letter-by-letter name reveal
  const titleEl = document.querySelector(`${containerId} .hero-title`);
  if (titleEl) {
    const text = titleEl.textContent || "";
    titleEl.innerHTML = text
      .split("")
      .map(
        (char) =>
          char === " "
            ? " "
            : `<span class="hero-letter" style="display:inline-block">${char}</span>`
      )
      .join("");

    animate(`${containerId} .hero-letter`, {
      opacity: [0, 1],
      y: [25, 0],
      rotateX: [-80, 0],
      duration: 500,
      delay: stagger(30, { start: 150 }),
      ease: "outExpo",
    });
  }

  animate(`${containerId} .hero-subtitle`, {
    opacity: [0, 1],
    y: [20, 0],
    duration: 600,
    ease: "outExpo",
    delay: 500,
  });

  animate(`${containerId} .hero-cta`, {
    opacity: [0, 1],
    y: [15, 0],
    duration: 500,
    ease: "outExpo",
    delay: 650,
  });

  animate(`${containerId} .hero-meta`, {
    opacity: [0, 1],
    y: [15, 0],
    duration: 500,
    ease: "outExpo",
    delay: 800,
  });

  animate(`${containerId} .hero-hint`, {
    opacity: [0, 1],
    duration: 500,
    ease: "outExpo",
    delay: 1000,
  });
}

export function animateHeroParallax(containerId: string) {
  if (prefersReducedMotion()) return;

  const hero = document.querySelector(containerId);
  if (!hero) return;

  const targets = [
    { selector: ".hero-bg", speed: 0.4 },
    { selector: ".hero-badge", speed: 0.3 },
    { selector: ".hero-title", speed: 0.25 },
    { selector: ".hero-subtitle", speed: 0.2 },
    { selector: ".hero-cta", speed: 0.15 },
    { selector: ".hero-meta", speed: 0.1 },
  ];

  function onScroll() {
    const scrollY = window.scrollY;
    const maxScroll = hero!.clientHeight;
    const progress = Math.min(scrollY / maxScroll, 1);

    targets.forEach(({ selector, speed }) => {
      const el = hero!.querySelector(selector) as HTMLElement;
      if (!el) return;
      el.style.transform = `translateY(${scrollY * speed}px)`;
      el.style.opacity = `${1 - progress * 1.5}`;
    });

    // Scroll indicator fade-out
    const scrollIndicator = hero!.querySelector(".hero-scroll") as HTMLElement;
    if (scrollIndicator) {
      scrollIndicator.style.opacity = `${Math.max(0, 1 - progress * 4)}`;
      scrollIndicator.style.transform = `translate(-50%, ${scrollY * 0.4}px)`;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

export function animateProjectCards(selector: string) {
  if (prefersReducedMotion()) return;

  animate(selector, {
    opacity: [0, 1],
    y: [40, 0],
    rotateX: [10, 0],
    rotateY: [-10, 0],
    scale: [0.96, 1],
    duration: 700,
    delay: stagger(120),
    ease: "outExpo",
  });
}

export function animateSkills(selector: string) {
  if (prefersReducedMotion()) return;

  animate(selector, {
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 500,
    delay: stagger(60, { start: 200 }),
    ease: "outBack",
  });
}

export function animateTimeline(
  lineSelector: string,
  nodeSelector: string
) {
  if (prefersReducedMotion()) return;

  animate(lineSelector, {
    scaleX: [0, 1],
    duration: 800,
    ease: "outExpo",
  });

  animate(nodeSelector, {
    opacity: [0, 1],
    scale: [0, 1],
    duration: 400,
    delay: stagger(100, { start: 400 }),
    ease: "outExpo",
  });
}

export function animateSectionEntry(selector: string) {
  if (prefersReducedMotion()) return;

  animate(selector, {
    opacity: [0, 1],
    y: [40, 0],
    duration: 700,
    ease: "outExpo",
  });
}

export function animateCounter(
  el: HTMLElement,
  target: number,
  duration: number = 1500,
  suffix: string = ""
) {
  if (prefersReducedMotion()) {
    el.textContent = `${target}${suffix}`;
    return;
  }

  const startTime = performance.now();
  const startValue = 0;

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startValue + (target - startValue) * eased);
    el.textContent = `${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

export function animateTyping(
  el: HTMLElement,
  strings: string[],
  typeSpeed: number = 80,
  deleteSpeed: number = 40,
  pauseDuration: number = 2000
) {
  if (prefersReducedMotion()) {
    el.textContent = strings[0] || "";
    return () => {};
  }

  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  function tick() {
    const currentString = strings[stringIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = currentString.substring(0, charIndex);
    } else {
      charIndex++;
      el.textContent = currentString.substring(0, charIndex);
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentString.length) {
      delay = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % strings.length;
      delay = 400;
    }

    timeoutId = setTimeout(tick, delay);
  }

  tick();

  return () => clearTimeout(timeoutId);
}

export function animateFilterChange(
  showSelector: string,
  hideSelector: string
) {
  if (prefersReducedMotion()) {
    document.querySelectorAll(hideSelector).forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });
    document.querySelectorAll(showSelector).forEach((el) => {
      (el as HTMLElement).style.display = "";
    });
    return;
  }

  document.querySelectorAll(hideSelector).forEach((el) => {
    animate(el, {
      opacity: [1, 0],
      scale: [1, 0.95],
      duration: 200,
      ease: "inExpo",
      onComplete: () => {
        (el as HTMLElement).style.display = "none";
      },
    });
  });

  setTimeout(() => {
    document.querySelectorAll(showSelector).forEach((el) => {
      (el as HTMLElement).style.display = "";
      animate(el, {
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 300,
        ease: "outExpo",
      });
    });
  }, 200);
}
