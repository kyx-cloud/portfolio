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