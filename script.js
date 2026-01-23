// Audio Player Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Audio elements
    const audio = document.getElementById('quranAudio');
    const fullSurahBtn = document.getElementById('fullSurahBtn');
    const continuousBtn = document.getElementById('continuousBtn');
    const surahSelector = document.getElementById('surahSelector');
    const listenSurahSelector = document.getElementById('listenSurahSelector');
    const fullSurahOption = document.getElementById('fullSurahOption');
    const continuousOption = document.getElementById('continuousOption');
    const currentSurahDisplay = document.getElementById('currentSurahDisplay');
    const currentModeDisplay = document.getElementById('currentModeDisplay');

    // State variables
    let currentSurah = 1;
    let currentMode = 'full'; // 'full' or 'continuous'
    const totalSurahs = 114;

    // Surah names for display
    const surahNames = {
        1: "Al-Fatihah (1)",
        2: "Al-Baqarah (2)",
        36: "Ya-Sin (36)",
        55: "Ar-Rahman (55)",
        67: "Al-Mulk (67)"
    };

    // Update audio source
    function updateAudioSource(surahNumber) {
        currentSurah = surahNumber;
        const surahUrl = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${String(surahNumber).padStart(3, '0')}.mp3`;
        audio.src = surahUrl;
        audio.load();
        
        // Update displays
        updateSurahSelector(surahNumber);
        updateDisplay();
    }

    // Update surah selector
    function updateSurahSelector(surahNumber) {
        surahSelector.value = surahNumber;
        listenSurahSelector.value = surahNumber;
    }

    // Update display information
    function updateDisplay() {
        const surahName = surahNames[currentSurah] || `Surah ${currentSurah}`;
        currentSurahDisplay.innerHTML = `
            <span>${document.documentElement.lang === 'ur' ? 'سورہ:' : 'Surah:'}</span>
            <strong>${surahName}</strong>
        `;
        
        const modeText = currentMode === 'full' ? 
            (document.documentElement.lang === 'ur' ? 'مکمل سورہ' : 'Full Surah') :
            (document.documentElement.lang === 'ur' ? 'مسلسل' : 'Continuous');
        currentModeDisplay.innerHTML = `
            <span>${document.documentElement.lang === 'ur' ? 'موڈ:' : 'Mode:'}</span>
            <strong>${modeText}</strong>
        `;
    }

    // Set mode
    function setMode(mode) {
        currentMode = mode;
        
        // Update button states
        fullSurahBtn.classList.toggle('active', mode === 'full');
        continuousBtn.classList.toggle('active', mode === 'continuous');
        
        // Update display
        updateDisplay();
        
        // If in continuous mode, set up auto-play next
        if (mode === 'continuous') {
            audio.onended = playNextSurah;
        } else {
            audio.onended = null;
        }
    }

    // Play next surah (for continuous mode)
    function playNextSurah() {
        if (currentSurah < totalSurahs) {
            updateAudioSource(currentSurah + 1);
            audio.play();
        } else {
            // Loop back to first surah
            updateAudioSource(1);
            audio.play();
        }
    }

    // Play previous surah
    function playPrevSurah() {
        if (currentSurah > 1) {
            updateAudioSource(currentSurah - 1);
            audio.play();
        }
    }

    // Event Listeners
    fullSurahBtn.addEventListener('click', function() {
        setMode('full');
    });

    continuousBtn.addEventListener('click', function() {
        setMode('continuous');
    });

    fullSurahOption.addEventListener('click', function() {
        setMode('full');
        updateDisplay();
    });

    continuousOption.addEventListener('click', function() {
        setMode('continuous');
        updateDisplay();
        if (currentSurah < totalSurahs) {
            updateAudioSource(currentSurah + 1);
        } else {
            updateAudioSource(1);
        }
        audio.play();
    });

    surahSelector.addEventListener('change', function() {
        const surahNumber = parseInt(this.value);
        if (surahNumber) {
            updateAudioSource(surahNumber);
            audio.play();
        }
    });

    listenSurahSelector.addEventListener('change', function() {
        const surahNumber = parseInt(this.value);
        if (surahNumber) {
            updateAudioSource(surahNumber);
            audio.play();
            setMode('full');
        }
    });

    // Audio event listeners
    audio.addEventListener('play', function() {
        updateDisplay();
    });

    // Language Switching
    const langButtons = document.querySelectorAll('.lang-btn');
    const langElements = document.querySelectorAll('[data-en], [data-ur]');

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.dataset.lang;
            
            // Update active button
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update document language
            document.documentElement.lang = lang;
            
            // Update direction
            document.body.dir = lang === 'ur' ? 'rtl' : 'ltr';
            
            // Update all translatable elements
            langElements.forEach(element => {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                    if (lang === 'en') {
                        element.innerHTML = element.dataset.en;
                    } else if (lang === 'ur') {
                        element.innerHTML = element.dataset.ur;
                    }
                } else {
                    if (lang === 'en') {
                        element.textContent = element.dataset.en;
                    } else if (lang === 'ur') {
                        element.textContent = element.dataset.ur;
                    }
                }
            });
            
            // Update select options for language
            updateSelectOptions(lang);
            
            // Update display
            updateDisplay();
        });
    });

    // Update select options based on language
    function updateSelectOptions(lang) {
        const selectElements = document.querySelectorAll('select');
        selectElements.forEach(select => {
            Array.from(select.options).forEach(option => {
                if (option.dataset.en && option.dataset.ur) {
                    option.textContent = lang === 'en' ? option.dataset.en : option.dataset.ur;
                }
            });
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 150,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navigation active state
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Initialize
    updateAudioSource(1);
    setMode('full');
    updateDisplay();
    
    // Auto-play on user interaction
    document.addEventListener('click', function initAudio() {
        if (audio.paused) {
            audio.play().catch(e => console.log("Auto-play prevented:", e));
        }
        document.removeEventListener('click', initAudio);
    });
});
