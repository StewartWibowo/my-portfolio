// === LOGIKA UNTUK HEADER SAAT SCROLL ===
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// === LOGIKA UNTUK PRELOADER & EFEK NAVIGASI ===
window.addEventListener('load', () => {
    // Preloader fade out
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('fade-out');

    // Navigation Sparkle/Comet Animation
    const navItems = document.querySelectorAll('nav ul li');
    const sparkle = document.getElementById('nav-sparkle-underline');
    let currentActiveItem = document.querySelector('nav ul li[data-active="true"]');

    function setSparklePosition(item) {
        const link = item.querySelector('a');
        sparkle.style.width = `${link.offsetWidth}px`;
        sparkle.style.transform = `translateX(${link.offsetLeft}px)`;
    }

    if (currentActiveItem) {
        setSparklePosition(currentActiveItem);
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const oldActiveItem = currentActiveItem;
            if (oldActiveItem === item) return;

            if (oldActiveItem) {
                oldActiveItem.removeAttribute('data-active');
            }
            
            const newItem = item;
            newItem.setAttribute('data-active', 'true');
            currentActiveItem = newItem;

            const oldLink = oldActiveItem.querySelector('a');
            const newLink = newItem.querySelector('a');

            const startPoint = Math.min(oldLink.offsetLeft, newLink.offsetLeft);
            const stretchWidth = Math.abs(newLink.offsetLeft - oldLink.offsetLeft) + (newLink.offsetLeft > oldLink.offsetLeft ? newLink.offsetWidth : oldLink.offsetWidth);

            sparkle.style.width = `${stretchWidth}px`;
            sparkle.style.transform = `translateX(${startPoint}px)`;
            
            setTimeout(() => {
                setSparklePosition(newItem);
            }, 50);
        });
    });
});