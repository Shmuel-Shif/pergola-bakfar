document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-desktop');
    const navLinks = nav.querySelectorAll('a');

    // פתיחה/סגירה של התפריט
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('show');
        // משנה את האייקון של ההמבורגר
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // סגירת התפריט כשלוחצים על קישור
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('show');
            // מחזיר את אייקון ההמבורגר למצב הרגיל
            const icon = hamburger.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // סגירת התפריט כשלוחצים מחוץ לתפריט
    document.addEventListener('click', (event) => {
        if (!nav.contains(event.target) && !hamburger.contains(event.target) && nav.classList.contains('show')) {
            nav.classList.remove('show');
            const icon = hamburger.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // טיפול בפורמט מספר טלפון
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // משאיר רק מספרים
        
        if (value.length >= 9) {
            if (value.length === 9) {
                // מספר בפורמט 02/03/08/09 וכו'
                value = value.slice(0, 2) + '-' + value.slice(2);
            } else if (value.length === 10) {
                // מספר בפורמט 050/052/054 וכו'
                value = value.slice(0, 3) + '-' + value.slice(3);
            }
            
            // מגביל את האורך המקסימלי
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
        }
        
        e.target.value = value;
    });

    // טיפול בלחיצה על Enter בתיבת ההודעה
    const messageTextarea = document.querySelector('.contact-form textarea');
    
    messageTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // מונע שליחת הטופס
            const start = messageTextarea.selectionStart;
            const end = messageTextarea.selectionEnd;
            const value = messageTextarea.value;
            
            messageTextarea.value = value.substring(0, start) + '\n' + value.substring(end);
            messageTextarea.selectionStart = messageTextarea.selectionEnd = start + 1;
        }
    });

    // אתחול EmailJS - חשוב שיהיה בהתחלה
    emailjs.init("STrvJthFs7ZwF3HDM");

    // טיפול בשליחת הטופס
    const contactForm = document.querySelector('.contact-form');
    const loadingOverlay = document.getElementById('loadingOverlay');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // מציג את אנימציית הטעינה
        loadingOverlay.classList.add('show');
        
        // שליחת המייל
        emailjs.send(
            'service_fmjqu8i',
            'template_8nwuv0m',
            {
                name: contactForm.querySelector('input[placeholder="שם מלא"]').value,
                phone: contactForm.querySelector('#phone').value,
                message: contactForm.querySelector('textarea').value,
                time: new Date().toLocaleString('he-IL')
            }
        )
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            contactForm.reset();
            
            setTimeout(() => {
                loadingOverlay.classList.remove('show');
                window.location.href = 'thanks.html';
            }, 500);
        }, function(error) {
            console.error('FAILED...', error.text);
            loadingOverlay.classList.remove('show');
            alert('אירעה שגיאה בשליחת הטופס: ' + error.text);
        });
    });

    // ולידציה משופרת למספר טלפון ישראלי
    function validateIsraeliPhone(phone) {
        // מסיר תווים שאינם מספרים
        const cleanPhone = phone.replace(/\D/g, '');
        
        // בודק אם המספר מתחיל ב-05 ואורכו 10 ספרות
        // או מתחיל ב-02/03/04/08/09 ואורכו 9 ספרות
        const mobilePattern = /^05\d{8}$/;
        const landlinePattern = /^0(?:[234689])\d{7}$/;
        
        return mobilePattern.test(cleanPhone) || landlinePattern.test(cleanPhone);
    }

    phoneInput.addEventListener('input', (e) => {
        const isValid = validateIsraeliPhone(e.target.value.replace(/\D/g, ''));
        phoneInput.setCustomValidity(isValid ? '' : 'אנא הזן מספר טלפון ישראלי תקין');
    });

    // אתחול הקרוסלה
    const initSwiper = () => {
        new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    };

    // הפעלת הקרוסלה אחרי טעינת העמוד
    window.addEventListener('load', initSwiper);

    // הוספת הקוד למודל התמונות
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');

    // הוספת מאזין לכל התמונות בסליידר
    document.querySelectorAll('.swiper-slide img').forEach(img => {
        img.addEventListener('click', function() {
            modal.classList.add('show');
            modalImg.src = this.src;
            document.body.style.overflow = 'hidden'; // מונע גלילה ברקע
        });
    });

    // סגירת המודל
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // מחזיר את הגלילה
    }

    // סגירה עם מקש ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // הוספת קוד לחץ הגלילה
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        // מסתיר את החץ כשגוללים למטה
        if (window.scrollY > 100) {
            scrollIndicator.classList.add('hide');
        } else {
            scrollIndicator.classList.remove('hide');
        }
    });

    // הוספת אפשרות ללחוץ על החץ לגלילה חלקה
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
}); 