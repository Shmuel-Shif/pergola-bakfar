document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1, // האנימציה תתחיל כשהאלמנט נראה ב-10% מגובהו
        rootMargin: '0px 0px -50px 0px' // מתחיל את האנימציה קצת לפני שהאלמנט נראה במלואו
    });

    // מוצא את כל כרטיסיות השירותים ומוסיף אותן למעקב
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });

    // הוספת Observer לתמונה
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });

    // מוצא את תמונת האודות ומוסיף אותה למעקב
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        imageObserver.observe(aboutImage);
    }
}); 