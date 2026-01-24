// Fetch all Surahs for the sidebar
async function loadSidebar() {
    const listContainer = document.getElementById('surah-list');
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        const surahs = data.data;// State management for settings
let currentSettings = {
    fontSize: localStorage.getItem('quranFontSize') || '32',
    reciter: localStorage.getItem('quranReciter') || 'ar.alafasy'
};

// Update Font Size instantly
function updateFontSize(size) {
    currentSettings.fontSize = size;
    localStorage.setItem('quranFontSize', size);
    
    // Apply to all Arabic text elements
    const arabicTexts = document.querySelectorAll('.arabic-text');
    arabicTexts.forEach(el => {
        el.style.fontSize = `${size}px`;
        el.style.lineHeight = `${size * 1.8}px`; // Maintain spacing
    });
}
function copyAyah(text, translation, surah, ayah) {
    const fullText = `"${text}"\n\n(${translation})\n\n[Quran ${surah}:${ayah}]`;
    
    navigator.clipboard.writeText(fullText).then(() => {
        const toast = document.getElementById("toast");
        toast.className = "show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    });
}

// In your fetchSurah function, add this button next to the Play button:
// ... inside the .map loop ...
`
<div class="flex gap-2">
    <button onclick="playVerse('${audio.ayahs[i].audio}')" class="...">▶</button>
    <button onclick="copyAyah(\`${ayah.text}\`, \`${english.ayahs[i].text}\`, ${number}, ${ayah.numberInSurah})" 
            class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="Copy Ayah">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
    </button>
</div>
`
// Change Reciter and reload the current Surah
function changeReciter(reciterId) {
    currentSettings.reciter = reciterId;
    localStorage.setItem('quranReciter', reciterId);
    
    // Refresh the current Surah content to get new audio links
    const currentSurah = localStorage.getItem('lastReadSurah') || 1;
    fetchSurah(currentSurah);
}

// Update your fetchSurah function to use the selected reciter
async function fetchSurah(number) {
    // ... previous code ...
    // Use currentSettings.reciter in the API URL
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,en.sahih,${currentSettings.reciter}`);
    // ... rest of the logic ...
}

        listContainer.innerHTML = surahs.map(surah => `
            <li>
                <button onclick="fetchSurah(${surah.number})" 
                        class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors flex justify-between items-center group">
                    <div>
                        <span class="text-xs text-gray-400 font-mono mr-2">${surah.number}</span>
                        <span class="text-sm font-medium text-gray-700 group-hover:text-emerald-700">${surah.englishName}</span>
                    </div>
                    <span class="arabic-text text-lg text-emerald-600">${surah.name}</span>
                </button>
            </li>
        `).join('');
    } catch (error) {
        console.error("Error loading sidebar:", error);
    }
}

// Run this when the page loads
loadSidebar();
