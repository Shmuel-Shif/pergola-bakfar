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

    // טיפול בטופס יצירת קשר
    const serviceSelect = document.getElementById('serviceSelect');
    const dimensionsFields = document.getElementById('dimensionsFields');
    const contactForm = document.getElementById('contactForm');
    
    // מילון שדות מידה לפי סוג שירות
    const dimensionsConfig = {
        pergola: [
            { id: 'length', label: 'אורך פרגולה', unit: 'מטר' },
            { id: 'width', label: 'רוחב פרגולה', unit: 'מטר' },
            { id: 'height', label: 'גובה פרגולה', unit: 'מטר' }
        ],
        grass: [
            { id: 'length', label: 'שטח לאורך', unit: 'מטר' },
            { id: 'width', label: 'שטח לרוחב', unit: 'מטר' }
        ],
        concrete: [
            { id: 'length', label: 'שטח לאורך', unit: 'מטר' },
            { id: 'width', label: 'שטח לרוחב', unit: 'מטר' },
        ],
        fence: [
            { id: 'length', label: 'אורך הגדר', unit: 'מטר' },
            { id: 'height', label: 'גובה הגדר', unit: 'מטר' },
        ],
        trees: [
            { id: 'quantity', label: 'כמות עצים', unit: 'יחידות' },
        ],
        storage: [
            { id: 'length', label: 'אורך מחסן', unit: 'מטר' },
            { id: 'width', label: 'רוחב מחסן', unit: 'מטר' },
            { id: 'height', label: 'גובה מחסן', unit: 'מטר' }
        ],
        furniture: [
            { id: 'tables', label: 'שולחנות', unit: 'יחידות' },
            { id: 'benches', label: 'ספסלים', unit: 'יחידות' },
        ],
        paths: [
            { id: 'length', label: 'אורך השביל', unit: 'מטר' },
            { id: 'width', label: 'רוחב השביל', unit: 'מטר' }
        ],
        deck: [
            { id: 'length', label: 'אורך הדק', unit: 'מטר' },
            { id: 'width', label: 'רוחב הדק', unit: 'מטר' },
        ]
    };

    // טיפול בשינוי בחירת שירות
    serviceSelect.addEventListener('change', () => {
        const selectedService = serviceSelect.value;
        dimensionsFields.innerHTML = '';
        
        if (dimensionsConfig[selectedService]) {
            dimensionsFields.style.display = 'grid';
            dimensionsConfig[selectedService].forEach(field => {
                const fieldHtml = `
                    <div class="dimension-field">
                        <input type="number" 
                               id="${field.id}" 
                               placeholder="${field.label}"
                               step="0.1"
                               min="0">
                        <span class="unit">${field.unit}</span>
                    </div>
                `;
                dimensionsFields.innerHTML += fieldHtml;
            });
        } else {
            dimensionsFields.style.display = 'none';
        }
    });

    // טיפול בהעלאת תמונות
    const uploadOptionsBtn = document.getElementById('uploadOptionsBtn');
    const uploadOptionsMenu = document.getElementById('uploadOptionsMenu');
    const cameraOption = document.getElementById('cameraOption');
    const galleryOption = document.getElementById('galleryOption');
    const fileUpload = document.getElementById('fileUpload');
    const cameraInput = document.getElementById('cameraInput');
    const imagePreview = document.getElementById('imagePreview');

    // פתיחה/סגירה של תפריט האפשרויות
    uploadOptionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // בדיקה אם כבר יש 4 תמונות
        if (imagePreview.children.length >= 4) {
            showErrorModal('ניתן להעלות עד 4 תמונות בלבד');
            return;
        }
        
        uploadOptionsMenu.classList.toggle('show');
    });

    // סגירת התפריט בלחיצה מחוץ אליו
    document.addEventListener('click', (e) => {
        if (!uploadOptionsMenu.contains(e.target) && !uploadOptionsBtn.contains(e.target)) {
            uploadOptionsMenu.classList.remove('show');
        }
    });

    // טיפול בבחירת אפשרות צילום
    cameraOption.addEventListener('click', async () => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // במובייל - משתמשים ב-cameraInput
            cameraInput.click();
        } else {
            // במחשב - פותח את המצלמה ישירות
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: true 
                });
                
                // יצירת אלמנט וידאו זמני
                const video = document.createElement('video');
                video.srcObject = stream;
                video.style.display = 'none';
                document.body.appendChild(video);
                
                // המתנה שהוידאו יטען
                await video.play();
                
                // יצירת קנבס לצילום
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                
                // המרה לקובץ
                canvas.toBlob((blob) => {
                    const file = new File([blob], "camera_photo.jpg", { 
                        type: "image/jpeg" 
                    });
                    addImagePreview(file);
                    
                    // ניקוי
                    stream.getTracks().forEach(track => track.stop());
                    video.remove();
                    canvas.remove();
                }, 'image/jpeg');
                
            } catch (err) {
                console.error('שגיאה בפתיחת המצלמה:', err);
                alert('לא הצלחנו לגשת למצלמה. אנא ודא שיש לך מצלמה זמינה ושאישרת גישה אליה.');
            }
        }
        uploadOptionsMenu.classList.remove('show');
    });

    // טיפול בבחירת אפשרות גלריה
    galleryOption.addEventListener('click', () => {
        fileUpload.click();
        uploadOptionsMenu.classList.remove('show');
    });

    // עדכון הטיפול בהעלאת תמונות מהמצלמה
    cameraInput.addEventListener('change', async () => {
        if (imagePreview.children.length < 4) {
            const files = Array.from(cameraInput.files);
            for (const file of files.slice(0, 1)) {
                try {
                    // דחיסת התמונה לפני התצוגה המקדימה
                    const compressedFile = await compressImage(file);
                    addImagePreview(compressedFile);
                } catch (error) {
                    console.error('שגיאה בדחיסת תמונה:', error);
                    showErrorModal('שגיאה בהעלאת התמונה, אנא נסה שוב');
                }
            }
        }
    });

    // עדכון הטיפול בהעלאת תמונות מהגלריה
    fileUpload.addEventListener('change', async () => {
        const files = Array.from(fileUpload.files);
        const remainingSlots = 4 - imagePreview.children.length;
        
        for (const file of files.slice(0, remainingSlots)) {
            try {
                // דחיסת התמונה לפני התצוגה המקדימה
                const compressedFile = await compressImage(file);
                addImagePreview(compressedFile);
            } catch (error) {
                console.error('שגיאה בדחיסת תמונה:', error);
                showErrorModal('שגיאה בהעלאת התמונה, אנא נסה שוב');
            }
        }
    });

    // עדכון פונקציית דחיסת התמונה
    async function compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    // חישוב המידות החדשות תוך שמירה על יחס התמונה
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // הגדלת הדחיסה לתמונות גדולות
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg'
                        }));
                    }, 'image/jpeg', 0.5); // הקטנת האיכות ל-50%
                };
            };
            reader.readAsDataURL(file);
        });
    }

    // הגבלת כמות התמונות בעת ההעלאה
    const addImagePreview = (file) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewDiv = document.createElement('div');
                previewDiv.className = 'image-preview';
                previewDiv.innerHTML = `
                    <img src="${e.target.result}" alt="תמונה מהשטח">
                    <span class="remove-image">&times;</span>
                `;
                
                previewDiv.querySelector('.remove-image').addEventListener('click', () => {
                    previewDiv.remove();
                });
                
                imagePreview.appendChild(previewDiv);
            };
            reader.readAsDataURL(file);
        }
    };

    // הוספת פונקציה להצגת מודל השגיאה
    function showErrorModal(message) {
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        const closeBtn = errorModal.querySelector('.error-modal-close');
        
        errorMessage.textContent = message;
        errorModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // מונע גלילה ברקע
        
        // סגירת המודל בלחיצה על הכפתור
        const closeModal = () => {
            errorModal.classList.remove('show');
            document.body.style.overflow = '';
            closeBtn.removeEventListener('click', closeModal);
        };
        
        closeBtn.addEventListener('click', closeModal);
        
        // סגירת המודל בלחיצה מחוץ למודל
        errorModal.addEventListener('click', (e) => {
            if (e.target === errorModal) {
                closeModal();
            }
        });
        
        // סגירה עם מקש ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    // עדכון הטיפול בשליחת הטופס
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('show');

        try {
            // איסוף הנתונים בצורה פשוטה
            let dimensionsText = '';
            const selectedService = serviceSelect.value;
            if (dimensionsConfig[selectedService]) {
                dimensionsText = dimensionsConfig[selectedService]
                    .map(field => {
                        const value = document.getElementById(field.id).value;
                        return `${field.label}: ${value} ${field.unit}`;
                    })
                    .join('\n');
            }

            // יצירת אובייקט לשליחה - בלי תמונות בינתיים
            const emailData = {
                to_name: 'פרגולה בכפר',
                from_name: document.querySelector('input[name="name"]').value,
                phone_number: document.querySelector('input[name="phone"]').value,
                city: document.querySelector('input[name="city"]').value,
                service_type: serviceSelect.options[serviceSelect.selectedIndex].text,
                dimensions_info: dimensionsText,
                message_text: document.querySelector('textarea[name="message"]').value,
                send_time: new Date().toLocaleString('he-IL')
            };

            // שליחת המייל הראשי
            await emailjs.send('service_fmjqu8i', 'template_8nwuv0m', emailData);

            // טיפול בתמונות - שליחה בנפרד
            const images = Array.from(imagePreview.querySelectorAll('img'));
            if (images.length > 0) {
                for (let i = 0; i < Math.min(images.length, 4); i++) {
                    try {
                        // שינוי בדרך הטיפול בתמונות
                        const response = await fetch(images[i].src);
                        const blob = await response.blob();
                        
                        // דחיסה חזקה יותר של התמונה
                        const compressedImage = await compressImage(new File([blob], `image${i}.jpg`, { type: 'image/jpeg' }));
                        
                        // המרה ל-base64 עם דחיסה נוספת
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const img = new Image();
                        
                        await new Promise((resolve) => {
                            img.onload = resolve;
                            img.src = URL.createObjectURL(compressedImage);
                        });

                        // הקטנה נוספת של התמונה
                        const MAX_SIZE = 600;
                        let width = img.width;
                        let height = img.height;
                        
                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // המרה ל-base64 עם דחיסה מקסימלית
                        const base64 = canvas.toDataURL('image/jpeg', 0.3); // דחיסה ל-30% איכות

                        await emailjs.send('service_fmjqu8i', 'template_wq680nv', {
                            to_name: 'פרגולה בכפר',
                            from_name: emailData.from_name,
                            phone_number: emailData.phone_number,
                            city: emailData.city,
                            image_data: base64,
                        });

                    } catch (error) {
                        console.error('שגיאה בשליחת תמונה:', error);
                    }
                }
            }

            // ניקוי וסיום
            contactForm.reset();
            imagePreview.innerHTML = '';
            dimensionsFields.innerHTML = '';
            dimensionsFields.style.display = 'none';
            window.location.href = 'thanks.html';

        } catch (error) {
            console.error('Error:', error);
            alert('אירעה שגיאה בשליחת הטופס. אנא נסה שוב.');
        } finally {
            loadingOverlay.classList.remove('show');
        }
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
            
            // הגדרות מותאמות למסכים שונים
            breakpoints: {
                // מובייל
                0: {
                    slidesPerView: "auto",
                    centeredSlides: true,
                    spaceBetween: 15,
                    effect: "slide",  // אפקט רגיל במקום coverflow
                },
                // טאבלט
                640: {
                    slidesPerView: 2,
                    centeredSlides: false,
                    spaceBetween: 20,
                    effect: "slide",
                },
                // דסקטופ
                1024: {
                    slidesPerView: 3,
                    centeredSlides: false,
                    spaceBetween: 30,
                    effect: "slide",
                }
            }
        });
    };

    // הפעלה ראשונית
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

    const customSelect = document.querySelector('.custom-select');
    const selectSelected = customSelect.querySelector('.select-selected');
    const selectItems = customSelect.querySelector('.select-items');
    const originalSelect = customSelect.querySelector('select');

    selectSelected.addEventListener('click', function(e) {
        e.stopPropagation();
        selectItems.classList.toggle('select-hide');
        this.classList.toggle('active');
    });

    selectItems.querySelectorAll('div').forEach(item => {
        item.addEventListener('click', function(e) {
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            
            selectSelected.textContent = text;
            selectSelected.classList.add('active');
            // מסיר את המאפיין data-placeholder כשיש בחירה
            selectSelected.removeAttribute('data-placeholder');
            originalSelect.value = value;
            selectItems.classList.add('select-hide');
            
            // הפעלת אירוע change על הסלקט המקורי
            const event = new Event('change');
            originalSelect.dispatchEvent(event);
        });
    });

    document.addEventListener('click', function() {
        selectItems.classList.add('select-hide');
        selectSelected.classList.remove('active');
    });
}); 