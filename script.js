// ============================================
// GITHUB API CONFIGURATION
// ============================================
// ⚙️ CONFIGURATION: Change this to your GitHub username
const GITHUB_USERNAME = 'L0veNote';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

// ============================================
// LANGUAGE COLORS MAPPING
// ============================================
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#239120',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#fa7343',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'Shell': '#89e051',
    'Vue': '#42b883',
    'React': '#61dafb',
    'Angular': '#dd0031',
    'Svelte': '#ff3e00',
    'SCSS': '#c6538c',
    'Sass': '#c6538c',
    'Less': '#1d365d',
    'Dockerfile': '#384d54',
    'Markdown': '#083fa1'
};

// ============================================
// FETCH GITHUB DATA
// ============================================
async function fetchGitHubData() {
    try {
        // Show loading state
        showLoadingState();
        
        // Fetch user and repos in parallel
        const [userResponse, reposResponse] = await Promise.all([
            fetch(GITHUB_API_URL),
            fetch(GITHUB_REPOS_URL)
        ]);
        
        if (!userResponse.ok) {
            throw new Error(`GitHub API error: ${userResponse.status}`);
        }
        
        if (!reposResponse.ok) {
            throw new Error(`GitHub API error: ${reposResponse.status}`);
        }
        
        const user = await userResponse.json();
        const repos = await reposResponse.json();
        
        // Process and display data
        displayUserStats(user, repos);
        displayRepos(repos);
        
        // Hide loading state
        hideLoadingState();
        
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        displayError(error);
    }
}

// ============================================
// DISPLAY USER STATISTICS
// ============================================
function displayUserStats(user, repos) {
    // Calculate statistics (excluding the username's own repo if it exists)
    const filteredRepos = repos.filter(repo => !repo.fork && repo.name !== GITHUB_USERNAME);
    const totalRepos = filteredRepos.length;
    const totalStars = filteredRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const languages = new Set(filteredRepos.filter(repo => repo.language).map(repo => repo.language));
    const uniqueLanguages = languages.size;
    
    // Update stats with animation
    animateCounter('stat-repos', totalRepos);
    animateCounter('stat-stars', totalStars);
    animateCounter('stat-languages', uniqueLanguages);
    
    // Load profile avatar
    loadProfileAvatar(user.avatar_url || `https://github.com/${GITHUB_USERNAME}.png`);
    
    // Display profile name
    const profileNameEl = document.getElementById('profile-name');
    if (profileNameEl) {
        const displayName = user.name || user.login || GITHUB_USERNAME;
        profileNameEl.textContent = displayName;
        profileNameEl.style.opacity = '0';
        setTimeout(() => {
            profileNameEl.style.transition = 'opacity 0.6s ease-out';
            profileNameEl.style.opacity = '1';
        }, 200);
    }
}

// ============================================
// LOAD PROFILE AVATAR
// ============================================
function loadProfileAvatar(avatarUrl) {
    const avatarImg = document.getElementById('profile-avatar');
    if (!avatarImg) return;
    
    const img = new Image();
    img.onload = function() {
        avatarImg.src = avatarUrl;
        avatarImg.classList.add('loaded');
    };
    img.onerror = function() {
        // If image fails to load, keep placeholder
        console.warn('Failed to load profile avatar');
    };
    img.src = avatarUrl;
}

// ============================================
// ANIMATE COUNTER
// ============================================
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1500;
    const startValue = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ============================================
// DISPLAY REPOSITORIES
// ============================================
function displayRepos(repos) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    // Clear grid
    grid.innerHTML = '';
    
    // Filter out forks, archived repos, and the username's own repo (README-only repo)
    const filteredRepos = repos
        .filter(repo => !repo.fork && !repo.archived && repo.name !== GITHUB_USERNAME)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 20); // Limit to 20 most recent repos
    
    if (filteredRepos.length === 0) {
        grid.innerHTML = '<div class="no-repos">No repositories found</div>';
        return;
    }
    
    // Create project cards with staggered animation
    filteredRepos.forEach((repo, index) => {
        const card = createProjectCard(repo);
        card.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(card);
    });
}

// ============================================
// CREATE PROJECT CARD
// ============================================
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const language = repo.language || 'N/A';
    const languageColor = LANGUAGE_COLORS[language] || '#9ca3af';
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    const updatedDate = formatDate(repo.updated_at);
    
    card.innerHTML = `
        <div class="project-header">
            <div>
                <h3 class="project-name">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                        ${escapeHtml(repo.name)}
                    </a>
                </h3>
            </div>
            <div class="project-stats">
                <div class="stat-badge" title="Stars">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>${stars}</span>
                </div>
                <div class="stat-badge" title="Forks">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="6" cy="6" r="3"></circle>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="18" r="3"></circle>
                        <path d="M9 6v12M15 12V6"></path>
                    </svg>
                    <span>${forks}</span>
                </div>
            </div>
        </div>
        <p class="project-description">
            ${repo.description ? escapeHtml(repo.description) : 'No description available'}
        </p>
        <div class="project-footer">
            <div class="project-language">
                <span class="language-dot" style="background-color: ${languageColor};"></span>
                <span>${language}</span>
            </div>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                <span>View</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        </div>
        <div class="project-updated">Updated ${updatedDate}</div>
    `;
    
    return card;
}

// ============================================
// FORMAT DATE
// ============================================
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'today';
    } else if (diffDays === 1) {
        return 'yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
}

// ============================================
// ESCAPE HTML
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// LOADING STATE
// ============================================
function showLoadingState() {
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
        loadingState.style.display = 'flex';
    }
    
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        projectsGrid.innerHTML = '';
    }
}

function hideLoadingState() {
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
        loadingState.style.display = 'none';
    }
}

// ============================================
// ERROR DISPLAY
// ============================================
function displayError(error) {
    const grid = document.getElementById('projects-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #ef4444;">
                <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">⚠️ Error loading repositories</p>
                <p style="color: #9ca3af; font-size: 0.95rem;">${error.message}</p>
            </div>
        `;
    }
    
    hideLoadingState();
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// NAVIGATION ACTIVE STATE
// ============================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all project cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// ============================================
// UPDATE GITHUB LINKS DYNAMICALLY
// ============================================
function updateGitHubLinks() {
    const githubLinks = document.querySelectorAll('a[href*="github.com/L0veNote"]');
    githubLinks.forEach(link => {
        link.href = GITHUB_PROFILE_URL;
    });
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    updateGitHubLinks();
    fetchGitHubData();
    initCursorFollower();
    initParticles();
});

// ============================================
// INTERACTIVE BACKGROUND
// ============================================

// Cursor Follower Effect
let cursorFollower = null;
let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

function initCursorFollower() {
    cursorFollower = document.getElementById('cursor-follower');
    if (!cursorFollower) return;
    
    // Only enable on desktop (not touch devices)
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!cursorFollower.classList.contains('active')) {
                cursorFollower.classList.add('active');
            }
        });
        
        // Smooth follow animation
        function animate() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            if (cursorFollower) {
                cursorFollower.style.left = `${followerX}px`;
                cursorFollower.style.top = `${followerY}px`;
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
}

// Particles Canvas Animation
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = createParticles();
    });
    
    // Particle system
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));
    
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.colorIndex = Math.floor(Math.random() * 3);
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            const colors = [
                'rgba(102, 126, 234, ' + this.opacity + ')',
                'rgba(118, 75, 162, ' + this.opacity + ')',
                'rgba(249, 147, 251, ' + this.opacity + ')'
            ];
            
            ctx.fillStyle = colors[this.colorIndex];
            ctx.fill();
        }
    }
    
    let particles = [];
    
    function createParticles() {
        const newParticles = [];
        for (let i = 0; i < particleCount; i++) {
            newParticles.push(new Particle());
        }
        return newParticles;
    }
    
    particles = createParticles();
    
    // Connect nearby particles with lines
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// HANDLE MOBILE MENU (if needed)
// ============================================
if (window.innerWidth <= 768) {
    // Mobile menu toggle could be added here if needed
}