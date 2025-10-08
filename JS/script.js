// Menunggu hingga seluruh halaman (termasuk gambar dan stylesheet) selesai dimuat
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    
    // Menambahkan kelas 'fade-out' untuk memicu transisi CSS
    preloader.classList.add('fade-out');

    // === Navigation Comet Effect ===
    const navItems = document.querySelectorAll('nav ul li');
    const comet = document.getElementById('nav-comet');

    // Fungsi untuk menggerakkan komet ke posisi item yang dituju
    function moveComet(targetItem) {
        // Atur lebar komet sesuai lebar item
        comet.style.width = `${targetItem.offsetWidth}px`;
        // Gerakkan komet menggunakan transform untuk animasi yang halus
        comet.style.transform = `translateX(${targetItem.offsetLeft}px)`;
    }

    // Posisikan komet di item pertama saat halaman pertama kali dimuat
    if (navItems.length > 0) {
        moveComet(navItems[0]);
    }

    // Tambahkan event listener untuk setiap item menu
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            moveComet(item); // Pindahkan komet ke item yang di-klik
        });
    });
});