document.addEventListener('DOMContentLoaded', function() {
    const accessibilityBtn = document.getElementById('accessibility-btn');
    const accessibilityMenu = document.getElementById('accessibility-menu');
    let textSizeLevel = 0; // 0 = normal, 1 = bigger, 2 = biggest, -1 = smaller, -2 = smallest
    
    // שמירת ההעדפות ב-localStorage
    const savedSettings = {
        highContrast: localStorage.getItem('accessibility_highContrast') === 'true',
        keyboardNav: localStorage.getItem('accessibility_keyboardNav') === 'true',
        noAnimations: localStorage.getItem('accessibility_noAnimations') === 'true',
        readableFont: localStorage.getItem('accessibility_readableFont') === 'true',
        textSizeLevel: parseInt(localStorage.getItem('accessibility_textSizeLevel')) || 0
    };

    // החלת ההגדרות השמורות
    if (savedSettings.highContrast) document.body.classList.add('high-contrast');
    if (savedSettings.keyboardNav) document.body.classList.add('keyboard-navigation');
    if (savedSettings.noAnimations) document.body.classList.add('no-animations');
    if (savedSettings.readableFont) document.body.classList.add('readable-font');
    if (savedSettings.textSizeLevel !== 0) {
        applyTextSize(savedSettings.textSizeLevel);
    }

    // פתיחה וסגירה של התפריט
    accessibilityBtn.addEventListener('click', function() {
        const isExpanded = accessibilityBtn.getAttribute('aria-expanded') === 'true';
        accessibilityBtn.setAttribute('aria-expanded', !isExpanded);
        accessibilityMenu.style.display = isExpanded ? 'none' : 'block';
        accessibilityMenu.setAttribute('aria-hidden', isExpanded);
    });

    // ניגודיות שחור-לבן
    document.getElementById('high-contrast').addEventListener('click', function() {
        document.body.classList.remove('high-contrast-color');
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        localStorage.setItem('accessibility_highContrast', isHighContrast);
        localStorage.setItem('accessibility_highContrastColor', false);
        announceChange(isHighContrast ? 'מצב ניגודיות שחור-לבן הופעל' : 'מצב ניגודיות כובה');
    });

    // ניגודיות צבעונית
    document.getElementById('high-contrast-color').addEventListener('click', function() {
        document.body.classList.remove('high-contrast');
        document.body.classList.toggle('high-contrast-color');
        const isHighContrastColor = document.body.classList.contains('high-contrast-color');
        localStorage.setItem('accessibility_highContrastColor', isHighContrastColor);
        localStorage.setItem('accessibility_highContrast', false);
        announceChange(isHighContrastColor ? 'מצב ניגודיות צבעונית הופעל' : 'מצב ניגודיות כובה');
    });

    // ניווט מקלדת
    document.getElementById('keyboard-navigation').addEventListener('click', function() {
        document.body.classList.toggle('keyboard-navigation');
        const isKeyboardNav = document.body.classList.contains('keyboard-navigation');
        localStorage.setItem('accessibility_keyboardNav', isKeyboardNav);
        announceChange(isKeyboardNav ? 'מצב ניווט מקלדת הופעל' : 'מצב ניווט מקלדת כובה');
    });

    // ביטול אנימציות
    document.getElementById('disable-animations').addEventListener('click', function() {
        document.body.classList.toggle('no-animations');
        const isNoAnimations = document.body.classList.contains('no-animations');
        localStorage.setItem('accessibility_noAnimations', isNoAnimations);
        announceChange(isNoAnimations ? 'אנימציות בוטלו' : 'אנימציות הופעלו מחדש');
    });

    // פונט קריא
    document.getElementById('readable-font').addEventListener('click', function() {
        document.body.classList.toggle('readable-font');
        const isReadableFont = document.body.classList.contains('readable-font');
        localStorage.setItem('accessibility_readableFont', isReadableFont);
        announceChange(isReadableFont ? 'פונט קריא הופעל' : 'פונט קריא כובה');
    });

    // הגדלת טקסט
    document.getElementById('increase-text').addEventListener('click', function() {
        if (textSizeLevel < 2) {
            textSizeLevel++;
            applyTextSize(textSizeLevel);
            localStorage.setItem('accessibility_textSizeLevel', textSizeLevel);
            announceChange('גודל הטקסט הוגדל');
        } else {
            announceChange('הגעת לגודל הטקסט המקסימלי');
        }
    });

    // הקטנת טקסט
    document.getElementById('decrease-text').addEventListener('click', function() {
        if (textSizeLevel > -2) {
            textSizeLevel--;
            applyTextSize(textSizeLevel);
            localStorage.setItem('accessibility_textSizeLevel', textSizeLevel);
            announceChange('גודל הטקסט הוקטן');
        } else {
            announceChange('הגעת לגודל הטקסט המינימלי');
        }
    });

    // איפוס הגדרות - עדכון
    document.getElementById('reset-accessibility').addEventListener('click', function() {
        document.body.classList.remove('high-contrast', 'high-contrast-color', 'keyboard-navigation', 'no-animations', 'readable-font');
        
        // ניקוי localStorage
        localStorage.removeItem('accessibility_highContrast');
        localStorage.removeItem('accessibility_highContrastColor');
        localStorage.removeItem('accessibility_keyboardNav');
        localStorage.removeItem('accessibility_noAnimations');
        localStorage.removeItem('accessibility_readableFont');
        localStorage.removeItem('accessibility_textSizeLevel');
        
        textSizeLevel = 0;
        document.body.classList.remove(
            'text-size-increased',
            'text-size-increased-more',
            'text-size-decreased',
            'text-size-decreased-more'
        );
        
        announceChange('כל הגדרות הנגישות אופסו');
    });

    // סגירת התפריט בלחיצה מחוץ לתפריט
    document.addEventListener('click', function(event) {
        if (!accessibilityMenu.contains(event.target) && !accessibilityBtn.contains(event.target)) {
            accessibilityMenu.style.display = 'none';
            accessibilityBtn.setAttribute('aria-expanded', 'false');
            accessibilityMenu.setAttribute('aria-hidden', 'true');
        }
    });

    // פונקציה להכרזה על שינויים עבור קוראי מסך
    function announceChange(message) {
        let announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('role', 'status');
        announcement.style.position = 'absolute';
        announcement.style.clip = 'rect(0,0,0,0)';
        announcement.style.overflow = 'hidden';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // פונקציה להחלת גודל טקסט
    function applyTextSize(level) {
        // קודם מסירים את כל הקלאסים הקודמים
        document.body.classList.remove(
            'text-size-increased',
            'text-size-increased-more',
            'text-size-decreased',
            'text-size-decreased-more'
        );

        // מחילים את הקלאס המתאים
        switch(level) {
            case 1:
                document.body.classList.add('text-size-increased');
                break;
            case 2:
                document.body.classList.add('text-size-increased-more');
                break;
            case -1:
                document.body.classList.add('text-size-decreased');
                break;
            case -2:
                document.body.classList.add('text-size-decreased-more');
                break;
        }
    }
}); 