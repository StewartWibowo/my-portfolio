// Menunggu hingga seluruh halaman (termasuk gambar dan stylesheet) selesai dimuat
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    
    // Menambahkan kelas 'fade-out' untuk memicu transisi CSS
    preloader.classList.add('fade-out');

    // === Navigation Comet Effect ===
    const navItems = document.querySelectorAll('nav ul li');
    const sparkle = document.getElementById('nav-sparkle-underline');

    let currentActiveItem = document.querySelector('nav ul li[data-active="true"]');

    // Fungsi untuk memposisikan sparkle di bawah item tertentu
    function setSparklePosition(item) {
        sparkle.style.width = `${item.offsetWidth}px`;
        sparkle.style.transform = `translateX(${item.offsetLeft}px)`;
    }

    // Atur posisi awal saat halaman dimuat
    if (currentActiveItem) {
        setSparklePosition(currentActiveItem);
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const oldActiveItem = currentActiveItem;
            
            // Jika mengklik item yang sudah aktif, jangan lakukan apa-apa
            if (oldActiveItem === item) return;
            
            // Hapus status aktif dari item lama
            if (oldActiveItem) {
                oldActiveItem.removeAttribute('data-active');
            }
            
            // Tentukan item baru dan posisinya
            const newItem = item;
            newItem.setAttribute('data-active', 'true');
            currentActiveItem = newItem;
            
            const oldRect = oldActiveItem.getBoundingClientRect();
            const newRect = newItem.getBoundingClientRect();

            // --- INI ADALAH LOGIKA ANIMASI KOMET ---

            // 1. Peregangan (Stretch)
            // Tentukan titik awal dan lebar peregangan
            const startPoint = Math.min(oldRect.left, newRect.left) - oldRect.left + oldActiveItem.offsetLeft;
            const stretchWidth = Math.abs(newRect.left - oldRect.left) + (newRect.left > oldRect.left ? newRect.width : oldRect.width);

            sparkle.style.width = `${stretchWidth}px`;
            sparkle.style.transform = `translateX(${startPoint}px)`;

            // 2. Menyusut (Shrink)
            // Setelah animasi peregangan dimulai, langsung set ke posisi akhir.
            // CSS transition akan mengurus animasinya menjadi halus.
            setTimeout(() => {
                setSparklePosition(newItem);
            }, 50); // Delay kecil untuk memastikan transisi berjalan
        });
    });
});