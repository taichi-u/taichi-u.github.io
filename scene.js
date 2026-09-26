// Original Blender assets; Three.js and its loader are served locally.
import * as THREE from "./assets/vendor/three/three.module.min.js";
import { GLTFLoader } from "./assets/vendor/three/GLTFLoader.js";
import { RoomEnvironment } from "./assets/vendor/three/RoomEnvironment.js";

const stage = document.querySelector("[data-scene]");
const canvas = stage.querySelector("canvas");
const controls = document.querySelector(".scene-controls");
const choices = [...controls.querySelectorAll("[data-model]")];
const status = document.querySelector(".scene-status");
const isJapanese = document.documentElement.lang === "ja";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const assets = {
  satellite: new URL("./assets/models/satellite.glb", import.meta.url),
  planet: new URL("./assets/models/planet.glb", import.meta.url),
  robot: new URL("./assets/models/robot.glb", import.meta.url),
};

async function init() {
  const context = canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "low-power" });
  if (!context) return; // The original CSS planet remains visible.
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  // Neutral studio reflections reveal foil creases, anodized metal and paint.
  // The environment is generated from geometry; no external HDRI is used.
  let environmentTarget;
  let environmentNeedsUpdate = true;
  function createEnvironment() {
    environmentTarget?.dispose();
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    environmentTarget = pmrem.fromScene(environment, 0.04);
    scene.environment = environmentTarget.texture;
    environment.dispose();
    pmrem.dispose();
    environmentNeedsUpdate = false;
  }
  scene.environmentIntensity = 0.75;
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 0.45, 8.5);
  camera.lookAt(0, 0, 0);
  const fill = new THREE.HemisphereLight(0xf1f6ff, 0x53565e, 0.5);
  scene.add(fill);
  const lamps = [];
  for (const [color, intensity, x, y, z] of [
    [0xfff2e4, 3.2, -3, 5, 4], [0xb9d5ff, 0.7, 4, 1, 2], [0xffffff, 2, 0, 3, -4],
  ]) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
    lamps.push(light);
  }
  lamps[0].castShadow = true;
  lamps[0].shadow.mapSize.set(1024, 1024);
  Object.assign(lamps[0].shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.1, far: 20 });
  lamps[0].shadow.normalBias = 0.018;
  lamps[0].shadow.bias = -0.00015;
  const pivot = new THREE.Group();
  pivot.rotation.z = -0.13;
  scene.add(pivot);
  const loader = new GLTFLoader();
  const models = new Map();
  let activeModel;
  let selection = 0;
  let frame = 0;
  let lastTime = 0;
  let nextDrawTime = 0;
  let visible = false;
  let contextLost = false;
  let needsRender = true;
  let presented = false;
  let renderWidth = 0;
  let renderHeight = 0;
  let renderPixelRatio = 0;
  let angle = 0.45;
  const frameInterval = 1000 / 30;

  const motionAllowed = () => !reducedMotion.matches && document.documentElement.dataset.motion !== "off";
  const canDraw = () => activeModel && visible && !document.hidden && !contextLost;
  const canAnimate = () => canDraw() && motionAllowed();
  const draw = () => {
    if (!canDraw()) return;
    if (environmentNeedsUpdate) createEnvironment();
    pivot.rotation.y = angle;
    renderer.render(scene, camera);
    needsRender = false;
    if (!presented) {
      presented = true;
      stage.classList.add("is-ready");
      controls.hidden = false;
    }
  };
  function animate(time) {
    frame = 0;
    if (!canAnimate()) return;
    // Rotation follows elapsed time even when we skip a display refresh.
    if (lastTime) angle += (time - lastTime) / 1000 * (Math.PI * 2 / 65);
    lastTime = time;
    // The small tolerance accommodates submillisecond RAF timestamp rounding.
    if (time >= nextDrawTime - 0.5) {
      draw();
      // Keep the deadline phase, so a 32/60/120Hz display does not halve the rate.
      if (!nextDrawTime) nextDrawTime = time;
      nextDrawTime += frameInterval * Math.max(1, Math.floor((time - nextDrawTime) / frameInterval) + 1);
    }
    frame = requestAnimationFrame(animate);
  }
  function syncAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    nextDrawTime = 0;
    stage.dataset.animating = String(Boolean(canAnimate()));
    if (canAnimate()) frame = requestAnimationFrame(animate);
    else if (needsRender) draw();
  }
  function resize() {
    const bounds = stage.getBoundingClientRect();
    const width = bounds.width, height = bounds.height;
    if (!width || !height) return false;
    const pixelRatio = Math.min(devicePixelRatio, 1.5);
    if (width === renderWidth && height === renderHeight && pixelRatio === renderPixelRatio) return false;
    renderWidth = width;
    renderHeight = height;
    renderPixelRatio = pixelRatio;
    renderer.setDrawingBufferSize(width, height, pixelRatio);
    camera.aspect = width / height;
    // Preserve model framing even at narrow tablet aspect ratios.
    camera.position.z = 8.5 / Math.min(camera.aspect, 1);
    camera.updateProjectionMatrix();
    needsRender = true;
    return true;
  }

  async function loadModelAsset(url) {
    // Serve compressed files directly on static hosts without custom headers.
    if (typeof DecompressionStream !== "function") return loader.loadAsync(url.href);
    const response = await fetch(`${url.href}.gz`);
    if (!response.ok || !response.body) throw new Error(`Model request failed (${response.status}): ${url.pathname}`);
    const stream = response.body.pipeThrough(new DecompressionStream("gzip"));
    const data = await new Response(stream).arrayBuffer();
    return loader.parseAsync(data, new URL(".", url).href);
  }

  function reportSelection(name) {
    const label = choices.find(button => button.dataset.model === name).textContent;
    status.textContent = isJapanese ? `${label}を表示しています。` : `Showing ${label.toLowerCase()}.`;
  }

  async function selectModel(name) {
    const request = ++selection;
    // Also supersede any pending selection, without resetting this model's angle.
    if (name === activeModel) {
      controls.setAttribute("aria-busy", "false");
      reportSelection(name);
      return;
    }
    controls.setAttribute("aria-busy", "true");
    status.textContent = isJapanese ? "モデルを読み込んでいます。" : "Loading model.";
    try {
      if (!models.has(name)) {
        const pending = loadModelAsset(assets[name]).then(({ scene: model }) => {
          model.traverse(object => {
            if (object.isMesh) {
              object.castShadow = name !== "planet";
              object.receiveShadow = name !== "planet";
            }
            if (object.name === "Atmosphere" && object.isMesh) {
              object.material.dispose();
              object.material = new THREE.ShaderMaterial({
                transparent: true, depthWrite: false,
                vertexShader: `varying vec3 vNormal; varying vec3 vView;
                  void main() { vec4 p = modelViewMatrix * vec4(position, 1.0);
                    vNormal = normalize(normalMatrix * normal); vView = -p.xyz;
                    gl_Position = projectionMatrix * p; }`,
                fragmentShader: `varying vec3 vNormal; varying vec3 vView;
                  void main() { float edge = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 3.5);
                    gl_FragColor = vec4(0.18, 0.46, 0.95, edge * 0.55); }`,
              });
            }
          });
          const bounds = new THREE.Box3().setFromObject(model);
          const center = bounds.getCenter(new THREE.Vector3());
          const size = bounds.getSize(new THREE.Vector3());
          model.position.sub(center);
          const wrapper = new THREE.Group();
          wrapper.add(model);
          const extent = { robot: 3.65, planet: 3.65, satellite: 4.3 }[name];
          wrapper.scale.setScalar(extent / Math.max(size.x, size.y, size.z));
          // Blender's GLB export converts Z-up to the browser's Y-up.
          wrapper.rotation.x = name === "satellite" ? 0.3 : 0.12;
          return wrapper;
        });
        models.set(name, pending);
        pending.catch(() => models.delete(name));
      }
      const model = await models.get(name);
      if (request !== selection) return;
      pivot.clear();
      pivot.add(model);
      activeModel = name;
      scene.environmentIntensity = name === "planet" ? 0.08 : 0.75;
      fill.intensity = name === "planet" ? 0.1 : 0.5;
      lamps[1].intensity = name === "planet" ? 0 : 0.7;
      lamps[2].intensity = name === "planet" ? 0.2 : 2;
      // The planet neither casts nor receives shadows; rotating hardware does.
      lamps[0].shadow.autoUpdate = name !== "planet";
      lamps[0].shadow.needsUpdate = name !== "planet";
      angle = name === "robot" ? -0.45 : 0.45;
      for (const button of choices) button.setAttribute("aria-pressed", String(button.dataset.model === name));
      stage.dataset.model = name;
      resize();
      needsRender = true;
      reportSelection(name);
      syncAnimation();
    } catch (error) {
      if (request !== selection) return;
      status.textContent = isJapanese ? "モデルを読み込めませんでした。もう一度選択してください。" : "Unable to load this model. Please select it again.";
      if (!activeModel) controls.hidden = false;
      console.warn("Background model unavailable:", error);
    } finally {
      if (request === selection) controls.setAttribute("aria-busy", "false");
    }
  }
  for (const choice of choices) {
    choice.addEventListener("click", () => selectModel(choice.dataset.model));
  }
  const resizeAndDraw = () => { if (resize()) syncAnimation(); };
  const resizeObserver = new ResizeObserver(resizeAndDraw);
  resizeObserver.observe(stage);
  window.addEventListener("resize", resizeAndDraw);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncAnimation();
  });
  visibilityObserver.observe(stage);
  const preferenceObserver = new MutationObserver(syncAnimation);
  preferenceObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  reducedMotion.addEventListener("change", syncAnimation);
  document.addEventListener("visibilitychange", syncAnimation);
  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    nextDrawTime = 0;
  });
  window.addEventListener("pageshow", syncAnimation);
  canvas.addEventListener("webglcontextlost", event => {
    event.preventDefault();
    contextLost = true;
    needsRender = true;
    presented = false;
    stage.classList.remove("is-ready");
    controls.hidden = true;
    syncAnimation();
  });
  canvas.addEventListener("webglcontextrestored", () => {
    contextLost = false;
    environmentNeedsUpdate = true;
    renderWidth = 0;
    resize();
    syncAnimation();
  });
  await selectModel("satellite");
}

init().catch(error => console.warn("3D background unavailable:", error));
