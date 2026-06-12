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
    zh: `${basePath}images/good.jpg`,
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