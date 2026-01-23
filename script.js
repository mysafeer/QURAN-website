document.addEventListener('DOMContentLoaded', function() {
    // Audio player functionality
    const audio = document.getElementById('quranAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const continuousBtn = document.getElementById('continuousBtn');
    const surahSelector = document.getElementById('surahSelector');
    
    let currentSurah = 1;
    const totalSurahs = 114;
    let isContinuous = true;
    
    // Update audio source
    function updateAudioSource(surahNumber) {
        currentSurah = surahNumber;
        const surahUrl = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${String(surahNumber).padStart(3, '0')}.mp3`;
        audio.src = surahUrl;
        audio.load();
        
        // Update selector
        surahSelector.value = surahNumber;
        
        // Play automatically
        if (!audio.paused) {
            audio.play();
        }
    }
    
    // Play next surah
    function playNextSurah() {
        if (currentSurah < totalSurahs) {
            updateAudioSource(currentSurah + 1);
        } else if (isContinuous) {
            // Loop back to first surah
            updateAudioSource(1);
        }
    }
    
    // Play previous surah
    function playPrevSurah() {
        if (currentSurah > 1) {
            updateAudioSource(currentSurah - 1);
        }
    }
    
    // Event listeners
    playPauseBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    nextBtn.addEventListener('click', playNextSurah);
    prevBtn.addEventListener('click', playPrevSurah);
    
    continuousBtn.addEventListener('click', function() {
        isContinuous = !isContinuous;
        continuousBtn.classList.toggle('active', isContinuous);
        continuousBtn.innerHTML = isContinuous ? 
            '<i class="fas fa-infinity"></i> Continuous' : 
            '<i class="fas fa-times-circle"></i> Single';
    });
    
    surahSelector.addEventListener('change', function() {
        updateAudioSource(parseInt(this.value));
    });
    
    // Audio ended event
    audio.addEventListener('ended', function() {
        if (isContinuous) {
            playNextSurah();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Play state change
    audio.addEventListener('play', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
    
    audio.addEventListener('pause', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    // Language switching functionality
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
            
            // Update all translatable elements
            langElements.forEach(element => {
                if (lang === 'en') {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = element.dataset.en;
                    } else {
                        element.textContent = element.dataset.en;
                    }
                } else if (lang === 'ur') {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = element.dataset.ur;
                    } else {
                        element.textContent = element.dataset.ur;
                    }
                }
            });
            
            // Change audio player direction for Urdu
            if (lang === 'ur') {
                audio.style.direction = 'rtl';
            } else {
                audio.style.direction = 'ltr';
            }
        });
    });
    
    // Smooth scrolling for navigation links
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
    
    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
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
    
    // Initialize with first surah
    updateAudioSource(1);
    
    // Auto-play on user interaction (for browsers that require it)
    document.addEventListener('click', function initAudio() {
        if (audio.paused) {
            audio.play().catch(e => console.log("Auto-play prevented:", e));
        }
        document.removeEventListener('click', initAudio);
    });
    
    // Add visual feedback for current playing surah
    audio.addEventListener('timeupdate', function() {
        const progress = (audio.currentTime / audio.duration) * 100;
        if (!isNaN(progress)) {
            document.documentElement.style.setProperty('--audio-progress', `${progress}%`);
        }
    });
});// Additional Quran facts for expansion
const quranFacts = {
    scientific: [
        {
            title: "Embryology",
            en: "Quran 23:14 describes embryonic development stages accurately: 'Then We made the sperm-drop into a clinging clot...' matching modern embryology.",
            ur: "قرآن 23:14 جنین کی نشوونما کے مراحل درست طور پر بیان کرتا ہے: 'پھر ہم نے نطفہ کو ایک لوتھڑے میں تبدیل کیا...' جدید علم اجنہ سے میل کھاتا ہے۔",
            reference: "Quran 23:14"
        },
        {
            title: "Expanding Universe",
            en: "Quran 51:47: 'And the heaven We constructed with strength, and indeed, We are [its] expander.' Described 1400 years before Hubble's discovery.",
            ur: "قرآن 51:47: 'اور آسمان ہم نے مضبوطی سے بنایا، اور ہم اس کو وسعت دینے والے ہیں۔' ہبل کی دریافت سے 1400 سال پہلے بیان کیا گیا۔",
            reference: "Quran 51:47"
        },
        {
            title: "Iron Came From Space",
            en: "Quran 57:25: '...And We sent down iron, wherein is great military might and benefits for the people...' Modern science confirms iron came from meteorites.",
            ur: "قرآن 57:25: '...اور ہم نے لوہا اتارا، جس میں سخت قوت ہے اور لوگوں کے لیے فوائد...' جدید سائنس تصدیق کرتی ہے کہ لوہا شہابِ ثاقب سے آیا۔",
            reference: "Quran 57:25"
        }
    ],
    historical: [
        {
            title: "People of the Cave",
            en: "Quran 18:9-26 tells about the People of the Cave (Ashab al-Kahf) who slept for 309 years. Multiple historical sites match this description.",
            ur: "قرآن 18:9-26 میں اصحاب کہف کا ذکر ہے جو 309 سال سوئے رہے۔ متعدد تاریخی مقامات اس وضاحت سے میل کھاتے ہیں۔",
            reference: "Quran 18:9-26"
        },
        {
            title: "Dead Sea Scrolls",
            en: "The Quran's description of the destruction of Sodom and Gomorrah (Quran 15:74) matches archaeological findings near the Dead Sea.",
            ur: "قرآن میں قوم لوط کے تباہ ہونے کی وضاحت (قرآن 15:74) بحیرہ مردار کے قریب آثار قدیمہ کے نتائج سے میل کھاتی ہے۔",
            reference: "Quran 15:74"
        }
    ],
    numerical: [
        {
            title: "Word Repetition Miracles",
            en: "The word 'day' (yawm) appears 365 times, 'month' (shahr) 12 times, 'sea' (bahr) 32 times, 'land' (bar) 13 times - matching actual ratios (71% water, 29% land).",
            ur: "لفظ 'دن' 365 بار، 'مہینہ' 12 بار، 'سمندر' 32 بار، 'زمین' 13 بار آتا ہے - اصل تناسب سے میل کھاتا ہے (71% پانی، 29% زمین)",
            reference: "Numerical Miracle"
        }
    ]
};

// Function to add more facts dynamically
function loadMoreFacts() {
    // You can use this function to dynamically add more facts
    console.log("Available facts loaded:", quranFacts);
}
