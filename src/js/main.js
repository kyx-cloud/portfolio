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
   FOODIE FRIENDS MODAL
================================ */

const foodModal = document.querySelector("#foodModal");
const openFoodBtns = document.querySelectorAll("[data-open-food]");
const closeFoodBtns = document.querySelectorAll("[data-close-food]");

function openFoodModal() {
  if (!foodModal) return;

  foodModal.classList.add("is-open");
  foodModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  const foodCase = foodModal.querySelector(".food-case");
  if (foodCase) {
    foodCase.scrollTop = 0;
  }
}

function closeFoodModal() {
  if (!foodModal) return;

  foodModal.classList.remove("is-open");
  foodModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

openFoodBtns.forEach((btn) => {
  btn.addEventListener("click", openFoodModal);
});

closeFoodBtns.forEach((btn) => {
  btn.addEventListener("click", closeFoodModal);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && foodModal?.classList.contains("is-open")) {
    closeFoodModal();
  }
});
/* ================================
   IF MUSIC REMEMBERS MODAL
================================ */

const musicModal = document.querySelector("#musicModal");
const openMusicBtns = document.querySelectorAll("[data-open-music]");
const closeMusicBtns = document.querySelectorAll("[data-close-music]");

function openMusicModal() {
  if (!musicModal) return;

  musicModal.classList.add("is-open");
  musicModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  const musicPage = musicModal.querySelector(".music-page");
  if (musicPage) {
    musicPage.scrollTop = 0;
  }
}

function closeMusicModal() {
  if (!musicModal) return;

  musicModal.classList.remove("is-open");
  musicModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

openMusicBtns.forEach((btn) => {
  btn.addEventListener("click", openMusicModal);
});

closeMusicBtns.forEach((btn) => {
  btn.addEventListener("click", closeMusicModal);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && musicModal?.classList.contains("is-open")) {
    closeMusicModal();
  }
});
/* ================================
   MOCHI MOCHI MODAL
================================ */

(() => {
  const mochiModal = document.querySelector("#mochiModal");
  const openMochiBtns = document.querySelectorAll("[data-open-mochi]");
  const closeMochiBtns = document.querySelectorAll("[data-close-mochi]");

  if (!mochiModal || openMochiBtns.length === 0) return;

  function openMochiModal() {
    mochiModal.classList.add("is-open");
    mochiModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const mochiPage = mochiModal.querySelector(".mochi-page");
    if (mochiPage) {
      mochiPage.scrollTop = 0;
    }
  }

  function closeMochiModal() {
    mochiModal.classList.remove("is-open");
    mochiModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openMochiBtns.forEach((btn) => {
    btn.addEventListener("click", openMochiModal);
  });

  closeMochiBtns.forEach((btn) => {
    btn.addEventListener("click", closeMochiModal);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mochiModal.classList.contains("is-open")) {
      closeMochiModal();
    }
  });
})();
/* ================================
   GOODMODEL MODAL
================================ */

(() => {
  const goodmodelModal = document.querySelector("#goodmodelModal");
  const openGoodmodelBtns = document.querySelectorAll("[data-open-goodmodel]");
  const closeGoodmodelBtns = document.querySelectorAll("[data-close-goodmodel]");

  if (!goodmodelModal || openGoodmodelBtns.length === 0) return;

  function openGoodmodelModal() {
    goodmodelModal.classList.add("is-open");
    goodmodelModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const goodmodelPage = goodmodelModal.querySelector(".goodmodel-page");
    if (goodmodelPage) {
      goodmodelPage.scrollTop = 0;
    }
  }

  function closeGoodmodelModal() {
    goodmodelModal.classList.remove("is-open");
    goodmodelModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openGoodmodelBtns.forEach((btn) => {
    btn.addEventListener("click", openGoodmodelModal);
  });

  closeGoodmodelBtns.forEach((btn) => {
    btn.addEventListener("click", closeGoodmodelModal);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && goodmodelModal.classList.contains("is-open")) {
      closeGoodmodelModal();
    }
  });
})();
/* ================================
   INTRO ANIMATION
================================ */

function playIntroAnimation() {
  const intro = document.querySelector("#introLoader");
  const heroCube = document.querySelector("#heroCube");

  if (!intro || !heroCube || typeof gsap === "undefined") return;

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out"
    },
    onComplete: () => {
      document.body.classList.remove("intro-playing");
      document.body.classList.add("intro-finished");
      intro.remove();
    }
  });

  // 一開始：3D 物件在畫面中央、小一點
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

  gsap.set([".intro-left", ".intro-right", ".intro-bottom"], {
    opacity: 0,
    y: 12
  });

  // 動畫流程
  tl
    // 文字淡入
    .to([".intro-left", ".intro-right"], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.08
    })

    .to(".intro-bottom", {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, "-=0.45")

    // 中間 3D 出現
    .to(heroCube, {
      opacity: 1,
      duration: 0.9
    }, "-=0.5")

    // 停一下，讓它旋轉展示
    .to({}, {
      duration: 1.2
    })

    // 3D 放大，準備進入首頁
    .to(heroCube, {
      width: 600,
      height: 600,
      top: "60%",
      duration: 1.15,
      ease: "power4.inOut"
    })

    // 白色 intro 畫面淡出
    .to(intro, {
      opacity: 0,
      duration: 0.75,
      ease: "power2.out"
    }, "-=0.45");
}

window.addEventListener("load", playIntroAnimation);
/* ================================
   CUSTOM CURSOR + HERO INK TRAIL
================================ */

(() => {
  const cursor = document.querySelector("#customCursor");
  const hero = document.querySelector(".hero");
  const canvas = document.querySelector("#heroInkCanvas");

  if (!cursor || !hero || !canvas) return;

  const ctx = canvas.getContext("2d");

  let dpr = window.devicePixelRatio || 1;
  let particles = [];

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  let lastHeroX = 0;
  let lastHeroY = 0;
  let isInHero = false;

  function resizeCanvas() {
    const rect = hero.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addInkParticles(x, y, speed = 1) {
    const count = Math.min(4, 1 + Math.floor(speed * 0.15));
  
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 22;
  
      particles.push({
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: 38 + Math.random() * 58,
        life: 1,
        decay: 0.035 + Math.random() * 0.015,
        wobble: Math.random() * Math.PI * 2,
        points: 8 + Math.floor(Math.random() * 4)
      });
    }
  }
  function drawInkShape(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.wobble);
  
    const pts = [];
  
    for (let i = 0; i < p.points; i++) {
      const angle = (i / p.points) * Math.PI * 2;
  
      const noise =
        0.82 +
        Math.sin(angle * 2.2 + p.wobble) * 0.08 +
        Math.cos(angle * 3.4 - p.wobble) * 0.06;
  
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
  
    ctx.fillStyle = `rgba(255, 255, 255, ${0.98 * Math.max(p.life, 0.72)})`;
    ctx.fill();
  
    ctx.restore();
  }
  function animate() {
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.radius *= 0.995;
      p.life -= p.decay;
      p.wobble += 0.01;

      drawInkShape(p);
    });

    particles = particles.filter((p) => p.life > 0);

    requestAnimationFrame(animate);
  }

  window.addEventListener("mousemove", (e) => {
    if (!document.body.classList.contains("intro-finished")) return;
    mouseX = e.clientX;
    mouseY = e.clientY;

    const rect = hero.getBoundingClientRect();

    const insideHero =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (insideHero) {
      const heroX = e.clientX - rect.left;
      const heroY = e.clientY - rect.top;

      const dx = heroX - lastHeroX;
      const dy = heroY - lastHeroY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (!isInHero || speed > 4) {
        addInkParticles(heroX, heroY, speed);
      }

      lastHeroX = heroX;
      lastHeroY = heroY;
      isInHero = true;
    } else {
      isInHero = false;
    }
  });

  const hoverTargets = document.querySelectorAll(
    "a, button, article, [data-open-goodmodel], [data-open-music], [data-open-mochi], [data-open-food]"
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

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  animate();
})();