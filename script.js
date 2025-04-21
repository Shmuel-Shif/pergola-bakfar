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

    // נוסיף את הקוד הבא בסוף הקובץ
    const whatsappToggle = document.getElementById('whatsappToggle');
    const whatsappPopup = document.getElementById('whatsappPopup');
    const closePopup = document.getElementById('closePopup');

    whatsappToggle.addEventListener('click', () => {
        whatsappPopup.classList.toggle('show');
    });

    closePopup.addEventListener('click', () => {
        whatsappPopup.classList.remove('show');
    });

    // סגירת הפופאפ כשלוחצים מחוץ אליו
    document.addEventListener('click', (event) => {
        if (!whatsappPopup.contains(event.target) && 
            !whatsappToggle.contains(event.target) && 
            whatsappPopup.classList.contains('show')) {
            whatsappPopup.classList.remove('show');
        }
    });

    // אתחול EmailJS - חשוב שיהיה בהתחלה
    emailjs.init("DLrJv93pOQmrmW3UE");

    // טיפול בשליחת הטופס
    const contactForm = document.querySelector('.contact-form');
    const loadingOverlay = document.getElementById('loadingOverlay');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // מציג את אנימציית הטעינה
        loadingOverlay.classList.add('show');
        
        // שליחת המייל
        emailjs.send(
            'service_x2s8qnf',
            'template_96b5i0j',
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
            
            // מעבר לדף תודה אחרי חצי שנייה
            setTimeout(() => {
                loadingOverlay.classList.remove('show');
                window.location.href = 'thanks.html';
            }, 500);
        }, function(error) {
            console.error('FAILED...', error);
            loadingOverlay.classList.remove('show');
            alert('אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.');
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
}); 