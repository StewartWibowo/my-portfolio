import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-background-canvas');
    const heroSection = document.querySelector('.hero');
    if (!canvas || !heroSection) return;

    // --- Konfigurasi Utama ---
    const config = {
        count: 200,
        friction: 0.985, // Gesekan agar bola melambat dengan halus
        followCursor: true,
        colors: ["#00aaff", "#4f5bd5", "#ffffff", "#a0a0a0"]
    };

    // --- Setup Three.js Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, heroSection.offsetWidth / heroSection.offsetHeight, 0.1, 1000);
    camera.position.set(0, 0, 18);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(heroSection.offsetWidth, heroSection.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const environment = new RoomEnvironment(renderer);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envMap = pmremGenerator.fromScene(environment).texture;
    const material = new THREE.MeshPhysicalMaterial({
        envMap: envMap, metalness: 0.1, roughness: 0.05,
        clearcoat: 1, clearcoatRoughness: 0.1
    });

    const geometry = new THREE.SphereGeometry(1, 28, 28);
    const spheres = new THREE.InstancedMesh(geometry, material, config.count);
    scene.add(spheres);

    // --- Inisialisasi Fisika ---
    const positions = Array.from({ length: config.count }, () => new THREE.Vector3());
    const velocities = Array.from({ length: config.count }, () => new THREE.Vector3());
    const sizes = Array.from({ length: config.count }, () => 0.6 + Math.random() * 0.9);

    // Fisika individual untuk setiap bola
    const ballPhysics = Array.from({ length: config.count }, () => ({
        gravity: 0.02 + Math.random() * 0.03, // Gravitasi acak yang sangat rendah
        wallBounce: 0.6 + Math.random() * 0.3, // Pantulan acak
    }));

    // Spawn semua bola di tengah
    for (let i = 0; i < config.count; i++) {
        positions[i].set(
            (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2
        );
    }

    const color = new THREE.Color();
    for (let i = 0; i < config.count; i++) {
        spheres.setColorAt(i, color.set(config.colors[i % config.colors.length]));
    }
    spheres.instanceColor.needsUpdate = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 150);
    scene.add(pointLight);

    // --- Interaksi Mouse ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(999, 999);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    const mouseForceCenter = new THREE.Vector3();

    // Dengar event di seluruh jendela agar lebih akurat
    window.addEventListener('pointermove', (event) => {
        const rect = heroSection.getBoundingClientRect();
        // Cek jika mouse berada di dalam area hero section
        if (event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom) {

            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(plane, intersection);
            mouseForceCenter.copy(intersection);
        } else {
            // Jika di luar, pindahkan mouse force ke tempat yang jauh
            mouse.set(999, 999);
            mouseForceCenter.set(999, 999, 999);
        }
    });

    window.addEventListener('resize', () => {
        const width = heroSection.offsetWidth;
        const height = heroSection.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    const clock = new THREE.Clock();
    const matrix = new THREE.Object3D();

    function animate() {
        const delta = Math.min(clock.getDelta(), 0.1);

        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const height = 2 * Math.tan(vFov / 2) * camera.position.z;
        const width = height * camera.aspect;
        const worldBounds = { x: width / 2, y: height / 2, z: 6 }; // PERBAIKAN: Ruang Z lebih dalam
        const topDisappearLimit = worldBounds.y * 1.5;

        for (let i = 0; i < config.count; i++) {
            const physics = ballPhysics[i];

            velocities[i].y -= physics.gravity * delta; // Gravitasi disederhanakan
            velocities[i].multiplyScalar(config.friction);
            positions[i].add(velocities[i]);

            // PERBAIKAN: Gaya tolak mouse yang lebih kuat
            const distToMouse2D = Math.sqrt(Math.pow(positions[i].x - mouseForceCenter.x, 2) + Math.pow(positions[i].y - mouseForceCenter.y, 2));
            const mouseRadius = 4; // Jangkauan dorongan diperluas
            if (distToMouse2D < mouseRadius) {
                const repulsion = new THREE.Vector3().subVectors(positions[i], mouseForceCenter).normalize();
                // Kita tetap menggunakan vektor 3D untuk arah dorongan agar natural

                const strength = (mouseRadius - distToMouse2D) / mouseRadius;
                velocities[i].add(repulsion.multiplyScalar(strength * 0.25)); // Gaya dorong diperkuat
            }

            const radius = sizes[i];
            if (positions[i].x < -worldBounds.x + radius) { positions[i].x = -worldBounds.x + radius; velocities[i].x *= -physics.wallBounce; }
            if (positions[i].x > worldBounds.x - radius) { positions[i].x = worldBounds.x - radius; velocities[i].x *= -physics.wallBounce; }
            if (positions[i].y < -worldBounds.y + radius) { positions[i].y = -worldBounds.y + radius; velocities[i].y *= -physics.wallBounce; }

            if (positions[i].y > topDisappearLimit) {
                positions[i].y = worldBounds.y + radius;
                positions[i].x = (Math.random() - 0.5) * worldBounds.x * 0.8;
                velocities[i].y = -0.1;
                velocities[i].x = 0;
            }

            if (positions[i].z < -worldBounds.z + radius) { positions[i].z = -worldBounds.z + radius; velocities[i].z *= -physics.wallBounce; }
            if (positions[i].z > worldBounds.z - radius) { positions[i].z = worldBounds.z - radius; velocities[i].z *= -physics.wallBounce; }

            for (let j = i + 1; j < config.count; j++) {
                const dist = positions[i].distanceTo(positions[j]);
                const sumRadii = sizes[i] + sizes[j];
                if (dist < sumRadii) {
                    const normal = new THREE.Vector3().subVectors(positions[i], positions[j]).normalize();
                    const overlap = sumRadii - dist;
                    positions[i].add(normal.clone().multiplyScalar(overlap / 2));
                    positions[j].sub(normal.clone().multiplyScalar(overlap / 2));
                }
            }
        }

        for (let i = 0; i < config.count; i++) {
            matrix.position.copy(positions[i]);
            matrix.scale.setScalar(sizes[i]);
            matrix.updateMatrix();
            spheres.setMatrixAt(i, matrix.matrix);
        }
        spheres.instanceMatrix.needsUpdate = true;

        pointLight.position.copy(mouseForceCenter);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
});