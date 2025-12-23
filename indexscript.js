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
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        overlay.addEventListener('click', () => {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            if (menuToggle.querySelector('i')) {
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

    // --- 2. RANDOMIZATION UTILITY ---
    function shuffleArray(array) {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // --- 3. DATA POPULATION & CAROUSELS ---
    let fuse;
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    async function initializeDramaSite() {
        try {
            const response = await fetch('dramas.json');
            const data = await response.json();

            fuse = new Fuse(data, {
                keys: ['title'],
                threshold: 0.4
            });

            // TRENDING: Keep as is (Standard Order)
            populateGrid('trending-grid', data.filter(d => d.Trend === "T").slice(0, 15)); 

            // CATEGORIES: Random Selection (Change 2)
            populateGrid('kdrama-grid', shuffleArray(data.filter(d => d.type === "K-Drama")).slice(0, 15));
            populateGrid('cdrama-grid', shuffleArray(data.filter(d => d.type === "C-Drama")).slice(0, 15));
            populateGrid('jdrama-grid', shuffleArray(data.filter(d => d.type === "J-Drama")).slice(0, 15));
            populateGrid('pdrama-grid', shuffleArray(data.filter(d => d.type === "P-Drama")).slice(0, 15));

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

    // --- 4. SEARCH LOGIC ---
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            if (query.length < 1 || !fuse) {
                searchResults.style.display = 'none';
                return;
            }
            const results = fuse.search(query, { limit: 10 });
            searchResults.innerHTML = results.map(({ item }) => `
                <a href="${item.link}" class="search-result-item">
                    <img src="${item.img}" width="40" height="55">
                    <div>
                        <div style="color:#fff; font-weight:600;">${item.title}</div>
                        <small style="color:#aaa;">${item.type}</small>
                    </div>
                </a>
            `).join('');
            searchResults.style.display = 'block';
        });
    }

    // --- 5. HERO SLIDER ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
        let slideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        setInterval(() => {
            slideIndex = (slideIndex + 1) % slides.length;
            sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
        }, 5000);
    }

    // --- 6. MODAL LOGIC (Change 3) ---
    const requestBtn = document.getElementById('floatingRequestBtn');
    const modal = document.getElementById('requestModal');
    const closeModal = document.querySelector('.close-modal');

    if (requestBtn && modal) {
        requestBtn.addEventListener('click', () => modal.classList.add('active'));
        closeModal.addEventListener('click', () => modal.classList.remove('active'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    initializeDramaSite();
});