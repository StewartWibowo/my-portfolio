import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// 1. Inisialisasi Dasar
const canvas = document.getElementById('timeline-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 5; // Posisi awal kamera

// === TAMBAHAN: SETUP EFEK GLOW (BLOOM) & PENCAHAYAAN ===
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0d0d2b, 1); // Warna dasar langit malam

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.5, 0.1);
composer.addPass(bloomPass);

// Lampu untuk siklus siang/malam
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
sunLight.position.set(5, 5, -10); // Arahkan dari belakang menjauh
scene.add(sunLight);

// Partikel Bintang untuk malam hari
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const posArray = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 200; // Sebar bintang di area yang luas
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);
// =======================================================

// 2. Buat Konten Timeline (TITIK BERCAHAYA)
const timelineEvents = [
    { year: 2019, label: "Mulai Kuliah", zPos: 15 },
    { year: 2022, label: "Asisten Lab", zPos: 5 },
    { year: 2020, label: "Instruktur Musik", zPos: -5 },
    { year: 2023, label: "Fokus Data & AI", zPos: -15 }
];

timelineEvents.forEach(event => {
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    // Warna dasar material dibuat sedikit gelap agar efek bloom lebih terlihat
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xff44ff,
        emissive: 0xff44ff, // Warna cahaya yang dipancarkan
        emissiveIntensity: 2
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, event.zPos);
    sphere.userData = { year: event.year, label: event.label };
    scene.add(sphere);
});


// 3. Buat Efek Gelombang (Wave) - Konsep Sederhana
const waveGeometry = new THREE.PlaneGeometry(100, 100, 100, 100); 
const waveParticlesMaterial = new THREE.PointsMaterial({
    size: 0.1, // Ukuran setiap titik. Anda bisa ubah nilai ini.
    color: 0x00aaff, // Warna titik
    transparent: true, // Aktifkan transparansi
    blending: THREE.AdditiveBlending // Efek glow saat titik bertumpuk
});
const waveParticles = new THREE.Points(waveGeometry, waveParticlesMaterial);

waveParticles.rotation.x = -Math.PI / 2; 
waveParticles.position.y = -3; 
scene.add(waveParticles);


// 4. Logika Scroll untuk Menggerakkan Kamera
let scrollY = 0;
window.addEventListener('wheel', (event) => {
    scrollY += event.deltaY * 0.005; // Kecepatan scroll
});


// 5. Animation Loop (untuk me-render scene & update)
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Gerakkan kamera maju/mundur berdasarkan scroll
    camera.position.z = 5 - scrollY;

    // Animasikan gelombang dengan memanipulasi vertices
    const positions = waveParticles.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        const x = positions.getX(i);
        const z = Math.sin(x * 0.5 + elapsedTime) * 0.5 + Math.sin(y * 0.5 + elapsedTime) * 0.5;
        positions.setZ(i, z);
    }
    positions.needsUpdate = true;


    renderer.render(scene, camera);
}

animate();