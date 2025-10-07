// Menunggu hingga seluruh halaman (termasuk gambar dan stylesheet) selesai dimuat
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    
    // Menambahkan kelas 'fade-out' untuk memicu transisi CSS
    preloader.classList.add('fade-out');

    // === Navigation Highlighter Effect ===
    const navLinks = document.querySelectorAll('nav ul li');
    const highlighter = document.getElementById('nav-highlighter');
    const navList = document.querySelector('nav ul');

    // Fungsi untuk memindahkan highlighter
    function moveHighlighter(element) {
        highlighter.style.width = `${element.offsetWidth}px`;
        highlighter.style.transform = `translateX(${element.offsetLeft}px)`;
    }

    // Posisikan highlighter di item 'active' saat halaman dimuat
    const initialActiveLink = document.querySelector('nav ul li.active');
    if (initialActiveLink) {
        moveHighlighter(initialActiveLink);
    }

    // Tambahkan event listener untuk setiap item navigasi
    navLinks.forEach(link => {
        // Saat mouse masuk ke item
        link.addEventListener('mouseenter', () => {
            moveHighlighter(link);
        });

        // Saat item diklik
        link.addEventListener('click', () => {
            // Hapus class 'active' dari semua item
            navLinks.forEach(item => item.classList.remove('active'));
            // Tambahkan class 'active' ke item yang diklik
            link.classList.add('active');
            moveHighlighter(link);
        });
    });

    // Saat mouse keluar dari area navigasi, kembalikan highlighter ke item 'active'
    navList.addEventListener('mouseleave', () => {
        const activeLink = document.querySelector('nav ul li.active');
        if (activeLink) {
            moveHighlighter(activeLink);
        }
    });
});