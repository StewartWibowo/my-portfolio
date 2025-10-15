// ==================================
// 1. LOGIKA UNTUK HEADER SAAT SCROLL
// ==================================
const header = document.querySelector('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}


// ==================================
// 2. LOGIKA SAAT HALAMAN SELESAI DIMUAT
// ==================================
window.addEventListener('load', () => {
    
    // --- Bagian Preloader ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.querySelector('header').classList.add('show-animate');
        }, 2000); // Delay 2 detik
    }

    // --- Bagian Animasi Navigasi ---
    const navItems = document.querySelectorAll('nav ul li');
    const sparkle = document.getElementById('nav-sparkle-underline');
    let currentActiveItem = document.querySelector('nav ul li[data-active="true"]');

    if (sparkle && navItems.length > 0) {
        function setSparklePosition(item) {
            const link = item.querySelector('a');
            if (link) {
                sparkle.style.width = `${link.offsetWidth}px`;
                sparkle.style.transform = `translateX(${link.offsetLeft}px)`;
            }
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

                const oldLink = oldActiveItem ? oldActiveItem.querySelector('a') : null;
                const newLink = newItem.querySelector('a');

                if (oldLink && newLink) {
                    const startPoint = Math.min(oldLink.offsetLeft, newLink.offsetLeft);
                    const stretchWidth = Math.abs(newLink.offsetLeft - oldLink.offsetLeft) + (newLink.offsetLeft > oldLink.offsetLeft ? newLink.offsetWidth : oldLink.offsetWidth);

                    sparkle.style.width = `${stretchWidth}px`;
                    sparkle.style.transform = `translateX(${startPoint}px)`;
                    
                    setTimeout(() => {
                        setSparklePosition(newItem);
                    }, 50);
                }
            });
        });
    }


    // ==================================
    // 3. LOGIKA FORM KONTAK (VERSI PALING STABIL)
    // ==================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const allInputs = [
            document.getElementById('form-name'),
            document.getElementById('form-email'),
            document.getElementById('form-company'),
            document.getElementById('form-message')
        ];
        const messageInput = document.getElementById('form-message');
        const charCounter = document.getElementById('char-counter');
        const limit = 2000;
        const phoneNumber = '6289675902791'; // Ganti dengan nomor Anda

        // Template dasar pesan (hanya teks, tanpa nilai input)
        const baseTemplate = `
*Pesan dari Website Portofolio*

*Nama:* *Email:* *Nama Perusahaan:* *Pesan:* `;
        const templateLength = baseTemplate.replace(/\s/g, '').length;

        function handleInput(event) {
            const userTypedLength = allInputs.reduce((total, input) => total + input.value.length, 0);
            const totalLength = templateLength + userTypedLength;
            const remaining = limit - totalLength;
            
            // Logika untuk membatasi input
            if (remaining < 0) {
                const targetInput = event.target;
                const overLimit = totalLength - limit;
                targetInput.value = targetInput.value.substring(0, targetInput.value.length - overLimit);
                // Setelah memotong, panggil fungsi ini lagi untuk update tampilan counter
                handleInput(event); 
                return; // Hentikan eksekusi lebih lanjut
            }

            // Logika untuk menampilkan pesan di counter
            if (remaining <= 100) {
                charCounter.textContent = `Sisa ${remaining} karakter.`;
                if (remaining <= 0) {
                    charCounter.classList.add('limit-reached');
                } else {
                    charCounter.classList.remove('limit-reached');
                }
            } else {
                charCounter.textContent = "";
                charCounter.classList.remove('limit-reached');
            }
        }

        allInputs.forEach(input => {
            input.addEventListener('input', handleInput);
        });

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = allInputs[0].value;
            const email = allInputs[1].value;
            const company = allInputs[2].value;
            const message = allInputs[3].value;

            if (!name && !email && !company && !message) {
                alert("Harap isi form terlebih dahulu sebelum mengirim.");
                return;
            }
            
            const finalMessageTemplate = `
*Pesan dari Website Portofolio*

*Nama:* ${name}
*Email:* ${email}
*Nama Perusahaan:* ${company}
*Pesan:* ${message}
            `.trim();

            const encodedMessage = encodeURIComponent(finalMessageTemplate);
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
        });
    }
});