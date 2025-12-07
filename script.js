// ============================================
// CONFIGURATION
// ============================================
const GITHUB_USERNAME = 'L0veNote';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USER_URL = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;
const GITHUB_REPOS_URL = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

// Last.fm Configuration
const LASTFM_USERNAME = 'Yurikae';
const LASTFM_API_KEY = 'c2e897dc040648bc531cc14bd862067f';
const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';

// ============================================
// LANGUAGE COLORS
// ============================================
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#239120',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'SCSS': '#c6538c',
    'Sass': '#a53b70',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#fa7343',
    'Kotlin': '#A97BFF',
    'Dart': '#00B4AB',
    'Shell': '#89e051',
    'PowerShell': '#012456',
    'Vue': '#42b883',
    'Svelte': '#ff3e00',
    'Lua': '#000080',
    'Dockerfile': '#384d54',
    'Markdown': '#083fa1',
    'JSON': '#292929',
    'YAML': '#cb171e',
    'Jupyter Notebook': '#DA5B0B'
};

// ============================================
// STATE
// ============================================
let allRepos = [];
let userLanguages = new Set();

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    loadingContainer: () => document.getElementById('loading-container'),
    errorContainer: () => document.getElementById('error-container'),
    errorMessage: () => document.getElementById('error-message'),
    projectsGrid: () => document.getElementById('projects-grid'),
    profileAvatar: () => document.getElementById('profile-avatar'),
    profilePlaceholder: () => document.getElementById('profile-placeholder'),
    profileName: () => document.getElementById('profile-name'),
    profileBio: () => document.getElementById('profile-bio'),
    profileLocation: () => document.getElementById('profile-location'),
    profileJoined: () => document.getElementById('profile-joined'),
    statRepos: () => document.getElementById('stat-repos'),
    statStars: () => document.getElementById('stat-stars'),
    statLanguages: () => document.getElementById('stat-languages'),
    skillsGrid: () => document.getElementById('skills-grid'),
    currentYear: () => document.getElementById('current-year')
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set current year
    const yearEl = elements.currentYear();
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Initialize features
    initNavigation();
    initMobileMenu();
    initCursorGlow();
    initParticles();
    initScrollAnimations();
    
    // Fetch GitHub data
    fetchGitHubData();
    
    // Fetch Last.fm data
    fetchLastFmData();
    // Refresh Last.fm every 30 seconds
    setInterval(fetchLastFmData, 30000);
}

// ============================================
// GITHUB API
// ============================================
async function fetchGitHubData() {
    showLoading();
    
    try {
        const [userResponse, reposResponse] = await Promise.all([
            fetch(GITHUB_USER_URL),
            fetch(GITHUB_REPOS_URL)
        ]);

        if (!userResponse.ok) {
            throw new Error(`Failed to fetch user data: ${userResponse.status}`);
        }
        
        if (!reposResponse.ok) {
            throw new Error(`Failed to fetch repositories: ${reposResponse.status}`);
        }

        const user = await userResponse.json();
        const repos = await reposResponse.json();

        // Filter repos that only contain README.md
        const filteredRepos = await filterReadmeOnlyRepos(repos);
        allRepos = filteredRepos;

        displayUserProfile(user);
        displayStats(user, filteredRepos);
        displayProjects(filteredRepos);
        displaySkills(filteredRepos);
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        showError(error.message);
    }
}

// ============================================
// FILTER README-ONLY REPOS
// ============================================
async function filterReadmeOnlyRepos(repos) {
    // First pass: filter out obvious non-code repos
    const candidateRepos = repos.filter(repo => {
        // Exclude forks
        if (repo.fork) return false;
        
        // Exclude the user's profile README repo (username/username)
        if (repo.name.toLowerCase() === GITHUB_USERNAME.toLowerCase()) return false;
        
        // Exclude repos with no language detected (likely README-only)
        // But we'll do a more thorough check for repos with size > 0
        return true;
    });

    // For repos without a language, check if they're README-only
    const reposWithContent = [];
    
    for (const repo of candidateRepos) {
        // If repo has a language, it has code
        if (repo.language) {
            reposWithContent.push(repo);
            continue;
        }
        
        // If repo size is very small (< 5KB) and no language, likely README-only
        if (repo.size < 5) {
            continue;
        }
        
        // For edge cases, we could check the contents API, but to avoid rate limits,
        // we'll use a heuristic: if size > 10KB and no language, include it
        // (could be config files, data, etc.)
        if (repo.size >= 10) {
            reposWithContent.push(repo);
        }
    }

    return reposWithContent;
}

// ============================================
// DISPLAY USER PROFILE
// ============================================
function displayUserProfile(user) {
    // Avatar
    const avatarEl = elements.profileAvatar();
    if (avatarEl && user.avatar_url) {
        const img = new Image();
        img.onload = () => {
            avatarEl.src = user.avatar_url;
            avatarEl.classList.add('loaded');
        };
        img.src = user.avatar_url;
    }

    // Name
    const nameEl = elements.profileName();
    if (nameEl) {
        nameEl.textContent = user.name || user.login || GITHUB_USERNAME;
        nameEl.style.opacity = '0';
        requestAnimationFrame(() => {
            nameEl.style.transition = 'opacity 0.6s ease';
            nameEl.style.opacity = '1';
        });
    }

    // Bio
    const bioEl = elements.profileBio();
    if (bioEl) {
        bioEl.textContent = user.bio || 'Developer';
    }

    // Location
    const locationEl = elements.profileLocation();
    if (locationEl && user.location) {
        locationEl.querySelector('span:last-child').textContent = user.location;
    }

    // Joined date
    const joinedEl = elements.profileJoined();
    if (joinedEl && user.created_at) {
        const year = new Date(user.created_at).getFullYear();
        joinedEl.textContent = `Since ${year}`;
    }
}

// ============================================
// DISPLAY STATS
// ============================================
function displayStats(user, repos) {
    const totalRepos = repos.length;
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    
    // Collect unique languages
    userLanguages = new Set(repos.filter(r => r.language).map(r => r.language));
    const languageCount = userLanguages.size;

    // Animate counters
    animateCounter(elements.statRepos(), totalRepos);
    animateCounter(elements.statStars(), totalStars);
    animateCounter(elements.statLanguages(), languageCount);
}

function animateCounter(element, target) {
    if (!element) return;
    
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ============================================
// DISPLAY PROJECTS
// ============================================
function displayProjects(repos) {
    const grid = elements.projectsGrid();
    if (!grid) return;

    grid.innerHTML = '';

    // Sort: non-archived first (by updated date), then archived (by updated date)
    const sortedRepos = repos
        .sort((a, b) => {
            // Archived repos go last
            if (a.archived !== b.archived) {
                return a.archived ? 1 : -1;
            }
            // Within same archived status, sort by updated date
            return new Date(b.updated_at) - new Date(a.updated_at);
        })
        .slice(0, 12);

    if (sortedRepos.length === 0) {
        grid.innerHTML = `
            <div class="no-projects" style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                <p style="color: var(--text-secondary);">No projects found</p>
            </div>
        `;
        return;
    }

    sortedRepos.forEach((repo, index) => {
        const card = createProjectCard(repo, index);
        grid.appendChild(card);
    });
}

function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const language = repo.language || 'Unknown';
    const languageColor = LANGUAGE_COLORS[language] || '#6b7280';
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    const updatedDate = formatRelativeDate(repo.updated_at);
    const description = repo.description || 'No description available';

    // Get emoji based on repo name/description
    const emoji = getRepoEmoji(repo);
    
    // Archived tag
    const archivedTag = repo.archived ? '<span class="project-archived-tag">Archived</span>' : '';
    
    // Live preview link (from repo homepage/about section)
    const livePreviewLink = repo.homepage ? `
        <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link-icon project-live-link" title="Live Preview">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
        </a>
    ` : '';

    card.innerHTML = `
        <div class="project-header">
            <div class="project-icon">${emoji}</div>
            ${archivedTag}
            <div class="project-links">
                ${livePreviewLink}
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link-icon" title="View on GitHub">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                </a>
            </div>
        </div>
        <h3 class="project-name">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                ${escapeHtml(repo.name)}
            </a>
        </h3>
        <p class="project-description">${escapeHtml(description)}</p>
        <div class="project-meta">
            <span class="project-language">
                <span class="language-dot" style="background-color: ${languageColor};"></span>
                ${language}
            </span>
            <span class="project-stat" title="Stars">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                ${stars}
            </span>
            <span class="project-stat" title="Forks">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="18" r="3"/>
                    <circle cx="6" cy="6" r="3"/>
                    <circle cx="18" cy="6" r="3"/>
                    <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/>
                    <path d="M12 12v3"/>
                </svg>
                ${forks}
            </span>
            <span class="project-updated">${updatedDate}</span>
        </div>
    `;

    return card;
}

function getRepoEmoji(repo) {
    const name = repo.name.toLowerCase();
    const desc = (repo.description || '').toLowerCase();
    const combined = name + ' ' + desc;

    // Cute/aesthetic patterns to emojis
    const patterns = [
        { match: /portfolio/, emoji: '✨' },
        { match: /josee|moe|personal|landing/, emoji: '🌸' },
        { match: /webstore|store|shop|ecommerce|vendor/, emoji: '🛍️' },
        { match: /website|site|page|neon|particle/, emoji: '💫' },
        { match: /api|backend|server/, emoji: '⚡' },
        { match: /bot|discord|telegram/, emoji: '🤖' },
        { match: /game|gaming|mod/, emoji: '🎮' },
        { match: /music|audio|sound/, emoji: '🎵' },
        { match: /video|stream/, emoji: '🎬' },
        { match: /ai|ml|machine|learning|neural/, emoji: '🧠' },
        { match: /crypto|blockchain|web3/, emoji: '💎' },
        { match: /security|auth|password/, emoji: '🔐' },
        { match: /data|analytics|dashboard/, emoji: '📊' },
        { match: /mobile|ios|android|app/, emoji: '📱' },
        { match: /cli|terminal|command/, emoji: '💻' },
        { match: /tool|util|helper/, emoji: '🔧' },
        { match: /template|starter|boilerplate/, emoji: '🎀' },
        { match: /ui|component|design|pretty|beautiful/, emoji: '🎨' },
        { match: /chat|message|social/, emoji: '💬' },
        { match: /weather/, emoji: '🌤️' },
        { match: /map|location|geo/, emoji: '🗺️' },
        { match: /calendar|schedule|time/, emoji: '📅' },
        { match: /email|mail/, emoji: '📧' },
        { match: /image|photo|gallery/, emoji: '🖼️' },
        { match: /download|upload|file/, emoji: '📁' },
        { match: /clean|sleek|dark/, emoji: '🌙' }
    ];

    for (const { match, emoji } of patterns) {
        if (match.test(combined)) {
            return emoji;
        }
    }

    // Default based on language - cuter versions
    const langEmojis = {
        'JavaScript': '💛',
        'TypeScript': '💙',
        'Python': '🐍',
        'Java': '☕',
        'C++': '⚙️',
        'C#': '💜',
        'Go': '🐹',
        'Rust': '🦀',
        'Ruby': '💎',
        'PHP': '🐘',
        'Swift': '🍎',
        'Kotlin': '🟣',
        'HTML': '🧡',
        'CSS': '💜'
    };

    return langEmojis[repo.language] || '✨';
}

// ============================================
// DISPLAY SKILLS
// ============================================
function displaySkills(repos) {
    const grid = elements.skillsGrid();
    if (!grid) return;

    // Count language usage
    const languageCounts = {};
    repos.forEach(repo => {
        if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        }
    });

    // Always include C# even if not in repos
    if (!languageCounts['C#']) {
        languageCounts['C#'] = 1;
    }

    // Sort by usage
    const sortedLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    grid.innerHTML = '';

    sortedLanguages.forEach(([language, count]) => {
        const color = LANGUAGE_COLORS[language] || '#6b7280';
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.innerHTML = `
            <span class="skill-dot" style="background-color: ${color};"></span>
            ${language}
        `;
        grid.appendChild(tag);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// LOADING & ERROR STATES
// ============================================
function showLoading() {
    const loading = elements.loadingContainer();
    const error = elements.errorContainer();
    const grid = elements.projectsGrid();

    if (loading) loading.classList.remove('hidden');
    if (error) error.classList.add('hidden');
    if (grid) grid.innerHTML = '';
}

function hideLoading() {
    const loading = elements.loadingContainer();
    if (loading) loading.classList.add('hidden');
}

function showError(message) {
    const loading = elements.loadingContainer();
    const error = elements.errorContainer();
    const errorMsg = elements.errorMessage();

    if (loading) loading.classList.add('hidden');
    if (error) error.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = message;
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Active state on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-section') === id);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const links = menu?.querySelectorAll('.mobile-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    links?.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ============================================
// CURSOR GLOW EFFECT
// ============================================
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    // Only on desktop
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!glow.classList.contains('active')) {
            glow.classList.add('active');
        }
    });

    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
    });

    function animate() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;
        
        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================
// PARTICLES ANIMATION
// ============================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticleArray();
    }

    function initParticleArray() {
        particles = [];
        const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
        
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? 
                `rgba(249, 115, 22, ${this.opacity})` : 
                `rgba(251, 191, 36, ${this.opacity})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function connectParticles() {
        const maxDistance = 120;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = 0.15 * (1 - distance / maxDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    animate();

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 200);
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.section-header, .about-content, .about-visual, .contact-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// LAST.FM API
// ============================================
async function fetchLastFmData() {
    try {
        // Fetch recent tracks and user info in parallel
        const [recentResponse, userResponse] = await Promise.all([
            fetch(`${LASTFM_API_BASE}?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`),
            fetch(`${LASTFM_API_BASE}?method=user.getinfo&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json`)
        ]);

        if (!recentResponse.ok || !userResponse.ok) {
            throw new Error('Failed to fetch Last.fm data');
        }

        const recentData = await recentResponse.json();
        const userData = await userResponse.json();

        displayLastFmData(recentData, userData);
    } catch (error) {
        console.error('Error fetching Last.fm data:', error);
        displayLastFmError();
    }
}

function displayLastFmData(recentData, userData) {
    const track = recentData?.recenttracks?.track?.[0];
    const user = userData?.user;

    if (!track) {
        displayLastFmError();
        return;
    }

    // Check if currently playing
    const isNowPlaying = track['@attr']?.nowplaying === 'true';
    
    // Update playing status
    const statusEl = document.getElementById('playing-status');
    const indicatorEl = document.getElementById('playing-indicator');
    
    if (statusEl) {
        statusEl.textContent = isNowPlaying ? 'Now Playing' : 'Last Played';
    }
    
    if (indicatorEl) {
        if (isNowPlaying) {
            indicatorEl.classList.remove('paused');
        } else {
            indicatorEl.classList.add('paused');
        }
    }

    // Update track info
    const trackNameEl = document.getElementById('track-name');
    const artistNameEl = document.getElementById('artist-name');
    const albumNameEl = document.getElementById('album-name');

    if (trackNameEl) trackNameEl.textContent = track.name || 'Unknown Track';
    if (artistNameEl) artistNameEl.textContent = track.artist?.['#text'] || track.artist || 'Unknown Artist';
    if (albumNameEl) albumNameEl.textContent = track.album?.['#text'] || '';

    // Update album art
    const albumArtEl = document.getElementById('album-art');
    const albumPlaceholderEl = document.getElementById('album-placeholder');
    
    // Get the largest image available
    const images = track.image || [];
    const largeImage = images.find(img => img.size === 'extralarge') || 
                       images.find(img => img.size === 'large') || 
                       images[images.length - 1];
    const imageUrl = largeImage?.['#text'];

    if (albumArtEl && imageUrl && imageUrl.trim() !== '') {
        const img = new Image();
        img.onload = () => {
            albumArtEl.src = imageUrl;
            albumArtEl.classList.add('loaded');
        };
        img.onerror = () => {
            albumArtEl.classList.remove('loaded');
        };
        img.src = imageUrl;
    } else if (albumArtEl) {
        albumArtEl.classList.remove('loaded');
    }

    // Update total scrobbles
    const scrobblesEl = document.getElementById('total-scrobbles');
    if (scrobblesEl && user?.playcount) {
        const count = parseInt(user.playcount).toLocaleString();
        scrobblesEl.textContent = `${count} scrobbles total`;
    }
}

function displayLastFmError() {
    const trackNameEl = document.getElementById('track-name');
    const artistNameEl = document.getElementById('artist-name');
    const statusEl = document.getElementById('playing-status');
    const indicatorEl = document.getElementById('playing-indicator');

    if (trackNameEl) trackNameEl.textContent = 'Unable to load';
    if (artistNameEl) artistNameEl.textContent = 'Check Last.fm';
    if (statusEl) statusEl.textContent = 'Offline';
    if (indicatorEl) indicatorEl.classList.add('paused');
}

// ============================================
// EXPOSE GLOBAL FUNCTION FOR RETRY
// ============================================
window.fetchGitHubData = fetchGitHubData;
