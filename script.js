// Custom project data
// Add your custom project info and screenshots here
const customProjects = {
    'portfolio': {
        name: 'Portfolio Website',
        description: 'A modern, responsive portfolio website built with HTML, CSS, and JavaScript. Features dark theme, GitHub API integration, and smooth animations.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'GitHub API'],
        screenshots: [
            'screenshots/portfolio-main.png',
            'screenshots/portfolio-projects.png',
            'screenshots/portfolio-mobile.png'
        ]
    },
    'react-portfolio': {
        name: 'React Portfolio',
        description: 'A React-based portfolio with TypeScript, featuring modern UI components and GitHub integration.',
        technologies: ['React', 'TypeScript', 'CSS', 'GitHub API'],
        screenshots: [
            'screenshots/react-portfolio-main.png',
            'screenshots/react-portfolio-projects.png'
        ]
    },
    'website': {
        screenshots: [
            'screenshots/website.png'
        ]
    },
    'WebStore': {
        screenshots: [
            'screenshots/webbstore.png'
        ]
    },
    'Josee.moe': {
        screenshots: [
            'screenshots/joseemoe.png'
        ]
    }
};

// Fetch and display GitHub projects
// Fetches repos from GitHub API and merges with customProjects
async function fetchProjects() {
    try {
        const response = await fetch('https://api.github.com/users/L0veNote/repos?sort=updated&per_page=100');
        const repos = await response.json();
        
        const projects = repos
            .filter(repo => !repo.fork && !repo.archived && !repo.disabled && repo.name !== 'L0veNote')
            .map(repo => {
                const customData = customProjects[repo.name];
                return {
                    id: repo.id,
                    name: repo.name,
                    description: customData?.description || repo.description || 'No description available',
                    technologies: customData?.technologies || repo.topics || [repo.language || 'Unknown'].filter(Boolean),
                    githubUrl: repo.html_url,
                    liveUrl: repo.homepage || null,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    updatedAt: repo.updated_at,
                    screenshots: customData?.screenshots || []
                };
            })
            .sort((a, b) => b.stars - a.stars || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        displayProjects(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        document.getElementById('projects-container').innerHTML = `
            <div style="text-align: center; grid-column: 1 / -1; padding: 4rem 0;">
                <p style="color: var(--text-secondary); font-size: 1.1rem;">Failed to load projects</p>
                <button onclick="fetchProjects()" class="btn btn-primary" style="margin-top: 1rem;">Try Again</button>
            </div>
        `;
    }
}

// Animated hearts background
// Handles drawing and animating cute hearts in the background

function randomPastel() {
    const colors = [
        '#ff8ebf', '#b5e0ff', '#ffb6e6', '#b48ea7', '#ff6b9d', '#8ec5ff', '#ff9ed2', '#a8d5ff', '#ff7bb3', '#9bcaff'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function drawHearts() {
    const canvas = document.getElementById('cuteHearts');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < window._hearts.length; i++) {
        const heart = window._hearts[i];
        ctx.save();
        ctx.globalAlpha = heart.alpha;
        ctx.translate(heart.x, heart.y);
        ctx.rotate(heart.angle);
        ctx.scale(heart.size, heart.size);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0, -0.5, -1, -0.8, -1, -1.5);
        ctx.bezierCurveTo(-1, -2.2, 0, -2, 0, -1.2);
        ctx.bezierCurveTo(0, -2, 1, -2.2, 1, -1.5);
        ctx.bezierCurveTo(1, -0.8, 0, -0.5, 0, 0);
        ctx.closePath();
        ctx.fillStyle = heart.color;
        ctx.shadowColor = heart.color;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.restore();
        heart.y -= heart.speed;
        heart.alpha -= 0.0015 + Math.random() * 0.001;
        heart.angle += 0.002 * (Math.random() - 0.5);
        if (heart.alpha <= 0) {
            window._hearts[i] = makeHeart(w, h);
        }
    }
    requestAnimationFrame(drawHearts);
}

function makeHeart(w, h) {
    return {
        x: Math.random() * w,
        y: h + 40 + Math.random() * 80,
        size: 0.8 + Math.random() * 1.6,
        color: randomPastel(),
        alpha: 0.18 + Math.random() * 0.22,
        speed: 0.18 + Math.random() * 0.22,
        angle: Math.random() * Math.PI * 2
    };
}

function initHearts() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    window._hearts = [];
    for (let i = 0; i < 22; i++) {
        window._hearts.push(makeHeart(w, h));
    }
    drawHearts();
}

window.addEventListener('resize', () => setTimeout(initHearts, 200));
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHearts, 100);
});

// Button squish effect
// Adds a squish animation to all buttons and social links

function addSquishEffect() {
    document.querySelectorAll('.btn, .social-link').forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform += ' scale(0.93)';
        });
        btn.addEventListener('mouseup', function() {
            this.style.transform = this.style.transform.replace(' scale(0.93)', '');
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(0.93)', '');
        });
    });
}
document.addEventListener('DOMContentLoaded', addSquishEffect);

// Easter egg: confetti on avatar click
// Shows confetti animation when the avatar is clicked
function showRandomMessage() {
    const messages = [
        { text: "You're amazing! 💖", emoji: "✨" },
        { text: "Have a wonderful day! 🌸", emoji: "💕" },
        { text: "You're doing great! 🚀", emoji: "⭐" },
        { text: "Keep being awesome! 🎨", emoji: "💫" },
        { text: "You're a star! ⭐", emoji: "🌟" },
        { text: "Sending you good vibes! 🍀", emoji: "🌈" },
        { text: "You're incredible! 💎", emoji: "💖" },
        { text: "Stay positive! 🌺", emoji: "💝" },
        { text: "You're beautiful! 🌸", emoji: "💗" },
        { text: "Keep shining! ✨", emoji: "💫" }
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Creating cute popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--bg-secondary);
        border: 3px solid var(--text-accent);
        border-radius: 2rem;
        padding: 2rem;
        text-align: center;
        z-index: 10000;
        box-shadow: var(--shadow-lg);
        animation: popupIn 0.5s cubic-bezier(.68,-0.55,.27,1.55);
        max-width: 300px;
        width: 90%;
    `;
    
    popup.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem; animation: sparkle 2s ease-in-out infinite;">${randomMessage.emoji}</div>
        <h3 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.3rem;">${randomMessage.text}</h3>
        <button onclick="this.parentElement.remove()" style="
            background: var(--gradient-primary);
            border: none;
            border-radius: 1.5rem;
            padding: 0.8rem 1.5rem;
            color: white;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.2s;
        ">Close 💖</button>
    `;
    
    // Adding popup animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popupIn {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(popup);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.style.animation = 'popupOut 0.5s ease-in-out forwards';
            const popupOutStyle = document.createElement('style');
            popupOutStyle.textContent = `
                @keyframes popupOut {
                    to {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.5) rotate(10deg);
                    }
                }
            `;
            document.head.appendChild(popupOutStyle);
            setTimeout(() => popup.remove(), 500);
        }
    }, 5000);
}

// Project card rendering
// Renders project cards with screenshots, description, tech tags, and stats

function pastelStatIcon(type) {
    if (type === 'stars') return '<span title="Likes" style="cursor: help;">⭐</span>';
    if (type === 'forks') return '<span title="Forks (project copies)" style="cursor: help;">🍰</span>';
    if (type === 'date') return '<span title="Last update" style="cursor: help;">📅</span>';
    return '';
}

function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; grid-column: 1 / -1; padding: 4rem 0;">
                <p style="color: var(--text-secondary); font-size: 1.1rem;">No projects found. Check out my GitHub profile for more!</p>
                <a href="https://github.com/L0veNote" target="_blank" class="btn btn-primary" style="margin-top: 1rem;"><span class='emoji-btn'>🐾</span>View GitHub Profile</a>
            </div>
        `;
        return;
    }

    container.innerHTML = projects.map((project, index) => `
        <div class="card fade-in" style="height: 100%; display: flex; flex-direction: column; position: relative; overflow: hidden; animation-delay: ${index * 0.1}s;">
            <div class="project-image">
                ${project.screenshots.length > 0 ? 
                    `<img src="${project.screenshots[0]}" alt="${project.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 1.2rem 1.2rem 0 0; background: #181828;">`
                    : `${project.name.charAt(0).toUpperCase()}`
                }
            </div>
            
            <div style="flex: 1; display: flex; flex-direction: column;">
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">
                    <span class="emoji-title">💎</span>${project.name}
                </h3>
                
                <p style="color: var(--text-secondary); margin-bottom: 1rem; flex: 1; line-height: 1.6;">
                    ${project.description}
                </p>
                
                <div style="margin-bottom: 1rem;">
                    ${project.technologies.slice(0, 5).map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                    ${project.technologies.length > 5 ? 
                        `<span class="tech-tag" style="color: var(--text-secondary);">+${project.technologies.length - 5}</span>` : ''
                    }
                </div>
                
                <div class="project-stats">
                    <span>
                        <span class="emoji-btn">${pastelStatIcon('stars')}</span>${project.stars}
                    </span>
                    <span>
                        <span class="emoji-btn">${pastelStatIcon('forks')}</span>${project.forks}
                    </span>
                    <span>
                        <span class="emoji-btn">${pastelStatIcon('date')}</span>${new Date(project.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                </div>
                
                <div style="display: flex; gap: 0.5rem; margin-top: auto;">
                    <a href="${project.githubUrl}" target="_blank" class="btn btn-secondary" style="flex: 1; justify-content: center;">
                        <span class="emoji-btn">🐱</span>Code
                    </a>
                    ${project.liveUrl ? `
                        <a href="${project.liveUrl}" target="_blank" class="btn btn-primary" style="flex: 1; justify-content: center;">
                            <span class="emoji-btn">🚀</span>Live
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// (Optional) Modal functions (not used)

// Modal functions
function openScreenshotModal(projectName, screenshots) {
    if (!screenshots || screenshots.length === 0) {
        return;
    }

    const modal = document.getElementById('screenshotModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2 style="color: var(--text-primary); margin-bottom: 1rem;">${projectName} Screenshots</h2>
        <div class="gallery-grid">
            ${screenshots.map((screenshot, index) => `
                <div class="gallery-item" onclick="showFullImage('${screenshot}')">
                    <img src="${screenshot}" alt="Screenshot ${index + 1}" onerror="this.style.display='none'; this.parentElement.style.display='none';">
                </div>
            `).join('')}
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showFullImage(imageSrc) {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <img src="${imageSrc}" alt="Full screenshot" class="modal-image">
    `;
}

function closeModal() {
    const modal = document.getElementById('screenshotModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('screenshotModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Add hover effects to social links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--text-accent)';
            this.style.transform = 'translateY(-2px)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.borderColor = 'var(--border-color)';
            this.style.transform = 'translateY(0)';
        });
    });

    // Fetch projects when page loads
    fetchProjects();

    // Add scroll animations
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

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

// Easter egg: tylko konfetti po kliknięciu w avatar
function triggerEasterEgg() {
    showConfetti();
}

document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.getElementById('easterEggAvatar');
    if (avatar) {
        avatar.style.cursor = 'pointer';
        avatar.title = 'Pssst... click me!';
        avatar.addEventListener('click', triggerEasterEgg);
    }
});

function showConfetti() {
    for (let i = 0; i < 30; i++) {
        const conf = document.createElement('div');
        conf.textContent = ['🎉','✨','💥','🎊','🥳'][Math.floor(Math.random()*5)];
        conf.style.position = 'fixed';
        conf.style.left = Math.random()*100 + 'vw';
        conf.style.top = '-3vh';
        conf.style.fontSize = (Math.random()*1.5+1.5) + 'rem';
        conf.style.zIndex = 9999;
        conf.style.pointerEvents = 'none';
        conf.style.opacity = 1;
        document.body.appendChild(conf);
        // Animacja spadania
        let start = null;
        const duration = 1800 + Math.random()*400;
        const startTop = -3;
        const endTop = 100 + Math.random()*10;
        function animateConfetti(ts) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            conf.style.top = (startTop + (endTop - startTop) * progress) + 'vh';
            conf.style.opacity = 1 - progress;
            if (progress < 1) {
                requestAnimationFrame(animateConfetti);
            } else {
                conf.remove();
            }
        }
        requestAnimationFrame(animateConfetti);
    }
} 