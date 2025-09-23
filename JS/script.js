// Menunggu hingga seluruh halaman (termasuk gambar dan stylesheet) selesai dimuat
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    
    // Menambahkan kelas 'fade-out' untuk memicu transisi CSS
    preloader.classList.add('fade-out');
});