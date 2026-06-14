import "../styles/main.scss";

import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

// Reveal animation
gsap.utils.toArray(".reveal").forEach((section) => {
  gsap.to(section, {
    opacity: 1,
    y: 0,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 82%",
    },
  });
});

// Language switch
const langBtn = document.getElementById("langBtn");
let currentLang = "zh";
if (langBtn) {
  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";

    document.querySelectorAll(".lang").forEach((item) => {
      item.textContent = item.dataset[currentLang];
    });

    document.documentElement.lang = currentLang;
    langBtn.textContent = currentLang === "zh" ? "EN" : "ZH";

    updateOpenedCaseImage();
  });
}

// Hero 3D model
const mount = document.getElementById("heroCube");

if (mount) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    mount.clientWidth / mount.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  mount.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 9);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);

  const sideLight = new THREE.DirectionalLight(0xffffff, 6);
  sideLight.position.set(-4, 3, 4);
  scene.add(sideLight);

  const loader = new GLTFLoader();

  let model = null;
  let isDragging = false;
  let previousX = 0;
  let previousY = 0;

  loader.load(
    "models/chrome-cube.glb",
    (gltf) => {
      model = gltf.scene;
  
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
  
      model.position.sub(center);
  
      const maxSize = Math.max(size.x, size.y, size.z);
      const scale = 2.8 / maxSize;
  
      model.scale.set(1.2, 1.2, 1.2);
  
      model.rotation.set(0.35, -0.55, 0);
  
      scene.add(model);
      console.log("GLB loaded and centered");
      gsap.to(mount, {
        left: "78%",
        top: "38%",
        scale: 1.5,
        scrollTrigger: {
          trigger: ".about",
          start: "top bottom",
          end: "bottom center",
          scrub: true,
        },
      });
      
      gsap.to(mount, {
        left: "22%",
        top: "68%",
        scale: 1,
        scrollTrigger: {
          trigger: ".skill",
          start: "top bottom",
          end: "bottom center",
          scrub: true,
        },
      });
      
      gsap.to(mount, {
        left: "98%",
        top: "55%",
        scale: 0.9,
        scrollTrigger: {
          trigger: ".projects",
          start: "top bottom",
          end: "bottom center",
          scrub: true,
        },
      });
      
      gsap.to(mount, {
        left: "18%",
        top: "20%",
        scale: 0.8,
        scrollTrigger: {
          trigger: ".graphic",
          start: "top bottom",
          end: "bottom center",
          scrub: true,
        },
      });
      gsap.to(mount, {
        left: "98%",
        top: "30%",
        scale: 1.5,
        scrollTrigger: {
          trigger: ".footer",
          start: "top bottom",
          end: "bottom center",
          scrub: true,
        },
      });
    },
    undefined,
    (error) => {
      console.error("GLB load error:", error);
    }
  );

  mount.addEventListener("pointerdown", (e) => {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
    mount.setPointerCapture(e.pointerId);
  });

  mount.addEventListener("pointermove", (e) => {
    if (!isDragging || !model) return;

    const deltaX = e.clientX - previousX;
    const deltaY = e.clientY - previousY;

    model.rotation.y += deltaX * 0.01;
    model.rotation.x += deltaY * 0.01;

    previousX = e.clientX;
    previousY = e.clientY;
  });

  mount.addEventListener("pointerup", () => {
    isDragging = false;
  });

  mount.addEventListener("pointerleave", () => {
    isDragging = false;
  });

  function animate() {
    if (model && !isDragging) {
      model.rotation.x += 0.001;
      model.rotation.y += 0.002;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  });
}
/* ================================
   PROJECT CASE IMAGE MODAL
================================ */
const basePath = import.meta.env.BASE_URL;

const caseData = {
  good: {
    zh: `${basePath}./images/good.jpg`,
    en: `${basePath}images/good-en.jpg`,
    alt: "Goodmodel project case study"
  },
  music: {
    zh: `${basePath}images/music.jpg`,
    en: `${basePath}images/music-en.jpg`,
    alt: "If Music Remembers project case study"
  },
  mochi: {
    zh: `${basePath}images/mochi.jpg`,
    en: `${basePath}images/mochi-en.jpg`,
    alt: "Mochi Mochi project case study"
  },
  food: {
    zh: `${basePath}images/food.jpg`,
    en: `${basePath}images/food-en.jpg`,
    alt: "Foodie Friends project case study"
  }
};

const caseModal = document.querySelector("#caseModal");
const caseModalImage = document.querySelector("#caseModalImage");
const caseModalScroll = document.querySelector(".case-modal-scroll");
const caseOpenBtns = document.querySelectorAll("[data-case]");
const caseCloseBtns = document.querySelectorAll("[data-close-case]");
function openCaseModal(caseName) {
  if (!caseModal || !caseModalImage) return;

  const targetCase = caseData[caseName];
  if (!targetCase) return;

  const lang = document.documentElement.lang === "en" ? "en" : "zh";

  caseModalImage.src = targetCase[lang];
  caseModalImage.alt = targetCase.alt;

  caseModal.classList.add("is-open");
  caseModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  if (caseModalScroll) {
    caseModalScroll.scrollTop = 0;
  }
}
function updateOpenedCaseImage() {
  if (!caseModal || !caseModalImage) return;
  if (!caseModal.classList.contains("is-open")) return;

  const openedCaseName = caseModal.dataset.currentCase;
  const targetCase = caseData[openedCaseName];
  if (!targetCase) return;

  const lang = document.documentElement.lang === "en" ? "en" : "zh";

  caseModalImage.src = targetCase[lang];
  caseModalImage.alt = targetCase.alt;
}
function closeCaseModal() {
  if (!caseModal || !caseModalImage) return;

  caseModal.classList.remove("is-open");
  caseModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  // 關掉後清空圖片，避免大圖繼續佔記憶體
  caseModalImage.removeAttribute("src");
  caseModalImage.alt = "";
}

caseOpenBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const caseName = btn.dataset.case;
    openCaseModal(caseName);
  });
});

caseCloseBtns.forEach((btn) => {
  btn.addEventListener("click", closeCaseModal);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && caseModal?.classList.contains("is-open")) {
    closeCaseModal();
  }
});
/* ================================
   INTRO ANIMATION
================================ */

function finishIntro() {
  const intro = document.querySelector("#introLoader");
  const heroCube = document.querySelector("#heroCube");

  document.body.classList.remove("intro-playing");
  document.body.classList.add("intro-finished");

  if (heroCube) {
    gsap.set(heroCube, {
      clearProps: "width,height,xPercent,yPercent,opacity"
    });

    gsap.set(heroCube, {
      position: "fixed",
      left: "78%",
      top: "38%",
      scale: 1.5
    });
  }

  if (intro) {
    intro.remove();
  }

  ScrollTrigger.refresh();
}

function playIntroAnimation() {
  const intro = document.querySelector("#introLoader");
  const heroCube = document.querySelector("#heroCube");
  const introTexts = document.querySelectorAll(".intro-left, .intro-right, .intro-bottom");

  if (!intro || !heroCube || typeof gsap === "undefined") {
    finishIntro();
    return;
  }

  gsap.set(intro, {
    autoAlpha: 1
  });

  gsap.set(heroCube, {
    position: "fixed",
    left: "50%",
    top: "50%",
    width: 160,
    height: 160,
    xPercent: -50,
    yPercent: -50,
    scale: 1.6,
    opacity: 0
  });

  gsap.set(introTexts, {
    autoAlpha: 0,
    y: 14
  });

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out"
    },
    onComplete: finishIntro
  });

  tl
    .to([".intro-left", ".intro-right"], {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.12
    })
    .to(".intro-bottom", {
      autoAlpha: 1,
      y: 0,
      duration: 0.75
    }, "-=0.45")
    .to(heroCube, {
      opacity: 1,
      duration: 0.9
    }, "-=0.45")
    .to({}, {
      duration: 0.75
    })
    .to(heroCube, {
      width: 600,
      height: 600,
      top: "60%",
      duration: 1.15,
      ease: "power4.inOut"
    })
    .to(introTexts, {
      autoAlpha: 0,
      y: -12,
      duration: 0.45,
      stagger: 0.04
    }, "-=0.8")
    .to(intro, {
      autoAlpha: 0,
      duration: 0.75,
      ease: "power2.out"
    }, "-=0.35");
}

document.addEventListener("DOMContentLoaded", playIntroAnimation);

setTimeout(() => {
  if (document.body.classList.contains("intro-playing")) {
    finishIntro();
  }
}, 7000);
/* ================================
   CUSTOM DIAMOND CURSOR
================================ */

(() => {
  const cursor = document.querySelector("#customCursor");
  if (!cursor) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.32;
    cursorY += (mouseY - cursorY) * 0.32;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  }

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const hoverTargets = document.querySelectorAll(
    "a, button, article, [data-case]"
  );

  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("is-hover");
    });

    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hover");
    });
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
  });

  animateCursor();
})();
/* ================================
   MULTI SECTION INK EFFECT
   Hero + Graphic 平面區水墨
================================ */

(() => {
  const inkAreas = [
    {
      section: document.querySelector(".hero"),
      canvas: document.querySelector("#heroInkCanvas")
    },
    {
      section: document.querySelector(".graphic"),
      canvas: document.querySelector("#graphicInkCanvas")
    }
  ].filter((item) => item.section && item.canvas);

  if (inkAreas.length === 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  const MAX_PARTICLES = 42;

  const states = inkAreas
    .map(({ section, canvas }) => {
      const ctx = canvas.getContext("2d");

      return {
        section,
        canvas,
        ctx,
        width: 0,
        height: 0,
        particles: [],
        lastX: null,
        lastY: null
      };
    })
    .filter((state) => state.ctx);

  function resizeCanvas(state) {
    const rect = state.section.getBoundingClientRect();

    state.width = rect.width;
    state.height = rect.height;

    state.canvas.width = state.width * dpr;
    state.canvas.height = state.height * dpr;

    state.canvas.style.width = `${state.width}px`;
    state.canvas.style.height = `${state.height}px`;

    state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resizeAll() {
    states.forEach(resizeCanvas);
  }

  function addInk(state, x, y, speed) {
    if (!document.body.classList.contains("intro-finished")) return;
    if (window.innerWidth <= 760) return;

    const count = Math.min(3, 1 + Math.floor(speed * 0.08));

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 24;

      state.particles.push({
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: 48 + Math.random() * 72,
        life: 1,

        // 數字越小，水墨停留越久
        decay: 0.014 + Math.random() * 0.008,

        wobble: Math.random() * Math.PI * 2,
        points: 9 + Math.floor(Math.random() * 4)
      });
    }

    if (state.particles.length > MAX_PARTICLES) {
      state.particles.splice(0, state.particles.length - MAX_PARTICLES);
    }
  }

  function drawInkShape(state, p) {
    const ctx = state.ctx;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.wobble);

    const pts = [];

    for (let i = 0; i < p.points; i++) {
      const angle = (i / p.points) * Math.PI * 2;

      const noise =
        0.86 +
        Math.sin(angle * 2.1 + p.wobble) * 0.08 +
        Math.cos(angle * 3.2 - p.wobble) * 0.05;

      const r = p.radius * noise * (0.88 + p.life * 0.12);

      pts.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r
      });
    }

    ctx.beginPath();

    const first = pts[0];
    const second = pts[1];

    ctx.moveTo(
      (first.x + second.x) / 2,
      (first.y + second.y) / 2
    );

    for (let i = 1; i < pts.length; i++) {
      const current = pts[i];
      const next = pts[(i + 1) % pts.length];

      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;

      ctx.quadraticCurveTo(current.x, current.y, midX, midY);
    }

    ctx.closePath();

    // 透明度 0.98：比較實，但還保留一點水墨感
    ctx.fillStyle = `rgba(255, 255, 255, ${0.98 * Math.max(p.life, 0.9)})`;
    ctx.fill();

    ctx.restore();
  }

  function animateInk() {
    states.forEach((state) => {
      const ctx = state.ctx;

      ctx.clearRect(0, 0, state.width, state.height);

      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.radius *= 0.996;
        p.wobble += 0.01;

        drawInkShape(state, p);
      });

      state.particles = state.particles.filter((p) => p.life > 0);
    });

    requestAnimationFrame(animateInk);
  }

  window.addEventListener("mousemove", (e) => {
    if (!document.body.classList.contains("intro-finished")) return;
    if (window.innerWidth <= 760) return;

    states.forEach((state) => {
      const rect = state.section.getBoundingClientRect();

      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) {
        state.lastX = null;
        state.lastY = null;
        return;
      }

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (state.lastX === null || state.lastY === null) {
        state.lastX = x;
        state.lastY = y;
        return;
      }

      const dx = x - state.lastX;
      const dy = y - state.lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 2) {
        addInk(state, x, y, speed);
      }

      state.lastX = x;
      state.lastY = y;
    });
  });

  window.addEventListener("resize", resizeAll);

  resizeAll();
  animateInk();
})();
/* ================================
   MOUSE REACTIVE GRID LINES
   黑色區域連續版
================================ */

(() => {
  const body = document.body;

  const normalSections = document.querySelectorAll(
    ".hero, .graphic, .food-block.grid-bg, .music-block.music-grid-bg, .mochi-block.mochi-grid-bg, .goodmodel-block.goodmodel-grid-bg"
  );

  const darkStart = document.querySelector(".about");
  const darkEnd = document.querySelector(".projects");

  function createGridWrap(className = "mouse-grid-wrap") {
    const wrap = document.createElement("div");
    wrap.className = className;

    for (let i = 0; i < 5; i++) {
      const line = document.createElement("span");
      line.className = "mouse-grid-line";
      wrap.appendChild(line);
    }

    return wrap;
  }

  function setupMouseMove(target, lines) {
    let targetX = 0;
    let currentX = 0;

    target.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 760) return;

      const rect = target.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseRatio = (mouseX / rect.width - 0.5) * 2;

      targetX = mouseRatio * 34;
    });

    target.addEventListener("mouseleave", () => {
      targetX = 0;
    });

    function animateLines() {
      currentX += (targetX - currentX) * 0.08;

      lines.forEach((line, index) => {
        const depth = 1 + index * 0.18;
        line.style.transform = `translateX(${currentX * depth}px)`;
      });

      requestAnimationFrame(animateLines);
    }

    animateLines();
  }

  /* 一般區塊：hero / graphic / modal 各自一組 */
  normalSections.forEach((section) => {
    if (section.querySelector(".mouse-grid-wrap")) return;

    const wrap = createGridWrap("mouse-grid-wrap");
    section.prepend(wrap);

    const lines = wrap.querySelectorAll(".mouse-grid-line");
    setupMouseMove(section, lines);
  });

  /* 黑色主區域：about + skill + projects 共用一整組線，不會斷 */
  if (darkStart && darkEnd && !document.querySelector(".dark-continuous-grid")) {
    const darkWrap = createGridWrap("mouse-grid-wrap dark-continuous-grid");
    body.appendChild(darkWrap);

    function updateDarkGridPosition() {
      const startTop = darkStart.offsetTop;
      const endBottom = darkEnd.offsetTop + darkEnd.offsetHeight;

      darkWrap.style.top = `${startTop}px`;
      darkWrap.style.height = `${endBottom - startTop}px`;
    }

    updateDarkGridPosition();
    window.addEventListener("resize", updateDarkGridPosition);
    window.addEventListener("load", updateDarkGridPosition);

    const darkLines = darkWrap.querySelectorAll(".mouse-grid-line");

    let targetX = 0;
    let currentX = 0;

    window.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 760) return;

      const rect = darkWrap.getBoundingClientRect();

      const insideDark =
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!insideDark) {
        targetX = 0;
        return;
      }

      const mouseRatio = (e.clientX / window.innerWidth - 0.5) * 2;
      targetX = mouseRatio * 34;
    });

    function animateDarkLines() {
      currentX += (targetX - currentX) * 0.08;

      darkLines.forEach((line, index) => {
        const depth = 1 + index * 0.18;
        line.style.transform = `translateX(${currentX * depth}px)`;
      });

      requestAnimationFrame(animateDarkLines);
    }

    animateDarkLines();
  }
})();

(() => {
  const titleLineGroups = document.querySelectorAll(
    ".hero-top-lines, .hero-title-lines, .line-group, .food-title-lines, .music-title-lines, .mochi-title-lines, .goodmodel-title-lines"
  );

  if (!titleLineGroups.length) return;

  titleLineGroups.forEach((group) => {
    const lines = group.querySelectorAll("span");
    if (!lines.length) return;

    gsap.to(lines, {
      scaleX: 1,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.16,
      scrollTrigger: {
        trigger: group,
        start: "top 88%",
        once: true
      }
    });
  });
})();