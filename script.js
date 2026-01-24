// Fetch all Surahs for the sidebar
async function loadSidebar() {
    const listContainer = document.getElementById('surah-list');
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        const surahs = data.data;

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
