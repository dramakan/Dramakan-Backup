document.addEventListener('DOMContentLoaded', function () {

    // --- 1. MOBILE MENU LOGIC ---
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        overlay.addEventListener('click', () => {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // --- 2. RANDOMIZATION UTILITY ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- 3. SEARCH & DATA POPULATION ---
    let fuse;
    async function initializeDramaSite() {
        try {
            const response = await fetch('dramas.json');
            const data = await response.json();

            fuse = new Fuse(data, { keys: ['title'], threshold: 0.4 });

            // Trending stays fixed (or sorted by trend)
            populateGrid('trending-grid', data.filter(d => d.Trend === "T").slice(0, 15)); 

            // Other sections get randomized
            const kdramas = shuffleArray(data.filter(d => d.type === "K-Drama")).slice(0, 15);
            const cdramas = shuffleArray(data.filter(d => d.type === "C-Drama")).slice(0, 15);
            const jdramas = shuffleArray(data.filter(d => d.type === "J-Drama")).slice(0, 15);
            const pdramas = shuffleArray(data.filter(d => d.type === "P-Drama")).slice(0, 15);

            populateGrid('kdrama-grid', kdramas);
            populateGrid('cdrama-grid', cdramas);
            populateGrid('jdrama-grid', jdramas);
            populateGrid('pdrama-grid', pdramas);

        } catch (err) {
            console.error("Data Load Error:", err);
        }
    }

    function populateGrid(elementId, items) {
        const grid = document.getElementById(elementId);
        if (!grid) return;
        grid.innerHTML = items.map(drama => `
            <a href="${drama.link}" class="drama-card">
                <div class="drama-card-img"><img src="${drama.img}" alt="${drama.title}"></div>
                <div class="drama-card-info">
                    <h3 class="drama-card-title">${drama.title}</h3>
                    <p class="drama-card-meta">${drama.type}</p>
                </div>
            </a>
        `).join('');
    }

    // --- 4. FLOATING BUTTON LOGIC ---
    const floatBtn = document.getElementById('floatingRequestBtn');
    const modal = document.getElementById('requestModal');
    const closeBtn = document.querySelector('.close-modal');

    floatBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); });

    initializeDramaSite();
});