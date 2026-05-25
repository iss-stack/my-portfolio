/**
 * ACE Portfolio Animations & Interactions
 */

// --- Background Animation (Canvas) ---
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let lines = [];
const lineCount = 22;
const segmentCount = 100;

function init() {
    resize();
    createLines();
    animate();
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function createLines() {
    lines = [];
    for (let i = 0; i < lineCount; i++) {
        lines.push({
            y: height * 0.35 + (i * 22),
            amplitude: 25 + (i * 2.5),
            frequency: 0.004 + (i * 0.0001),
            phase: i * 0.5,
            speed: 0.008 + (Math.random() * 0.01),
            opacity: 0.15 + (i / lineCount) * 0.5
        });
    }
}

function drawLine(line) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${line.opacity})`;
    ctx.lineWidth = 3.0;

    for (let x = 0; x <= width; x += width / segmentCount) {
        const yOffset = Math.sin(x * line.frequency + line.phase) * line.amplitude;
        const yOffset2 = Math.sin(x * line.frequency * 2 + line.phase * 0.5) * (line.amplitude * 0.3);
        const finalY = line.y + yOffset + yOffset2;

        if (x === 0) {
            ctx.moveTo(x, finalY);
        } else {
            ctx.lineTo(x, finalY);
        }
    }
    ctx.stroke();
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    lines.forEach(line => {
        line.phase += line.speed;
        drawLine(line);
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resize();
    createLines();
});

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// --- Smooth Scrolling & Nav Highlight with Scroll Spy ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const target = document.querySelector(targetId);
            if (target) {
                // Determine a slight offset so the section titles are clearly visible below navigation
                const offset = window.innerWidth <= 768 ? 100 : 60;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Scroll Spy implementation
const sections = document.querySelectorAll('section, main.hero');
const navLinks = document.querySelectorAll('.nav-links a');

function scrollSpy() {
    let currentSectionId = '';
    // Adjust trigger position to be about 40% from top of viewport for perfect UX activation
    const scrollPosition = window.scrollY + window.innerHeight * 0.4;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            if (section.classList.contains('hero')) {
                currentSectionId = '#';
            } else if (section.id) {
                currentSectionId = '#' + section.id;
            }
        }
    });

    if (currentSectionId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

window.addEventListener('scroll', scrollSpy);
window.addEventListener('load', scrollSpy);
window.addEventListener('resize', scrollSpy);


// --- Project Modal Logic ---
const modal = document.getElementById("projectModal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.querySelector(".close-modal");

const projectData = {
    "Graphic Designs": {
        title: "Graphic Designs Showcase",
        tags: "ADVOCACY • VISUAL IDENTITY • POSTER DESIGN",
        images: [
            "assets/graphic-equal-opportunities.jpg",
            "assets/rooted-rising-filipina.jpg"
        ],
        desc: "A showcase of premium graphic design works featuring:<br><br>1. <strong>Equal Talent, Unequal Opportunities</strong>: A conceptual advocacy poster highlighting social hierarchy, opportunity access, and structural equality.<br><br>2. <strong>Rooted.Rising.Filipina</strong>: A cultural leadership campaign poster honoring pre-colonial Babaylan leaders and advocating for modern gender equality and inclusive representation."
    },
    "Video Editing": {
        title: "Video Editing & Motion",
        tags: "STORYTELLING • MOTION DESIGN",
        videos: [
            "https://youtu.be/OoEJThOqneI"
        ],
        desc: "Expertise in high-end video production, motion graphics, and rhythmic storytelling. Creating cinematic experiences that capture and hold the audience’s attention."
    },
    "UI Designs": {
        title: "EcoServe UI/UX Case Study",
        tags: "DIGITAL • INTERACTIVE • SYSTEMS",
        images: [
            "assets/ui-designs/ui_dashboard.png",
            "assets/ui-designs/ui_login.png",
            "assets/ui-designs/ui_profile.png",
            "assets/ui-designs/ui_report.png"
        ],
        desc: "EcoServe is a comprehensive environmental management platform. This UI/UX case study includes the dashboard for officers, a nature-themed login experience, detailed user profiles with performance metrics, and a streamlined incident reporting system."
    }
};

let currentGalleryIndex = 0;

let galleryTimer;

function startAutoPlay() {
    stopAutoPlay();
    galleryTimer = setInterval(() => moveGallery(1), 2000);
}

function stopAutoPlay() {
    if (galleryTimer) clearInterval(galleryTimer);
}

document.querySelectorAll(".project-item, .skill-item").forEach(item => {
    item.addEventListener("click", (e) => {
        // If it's a skill-item, prevent default navigation (scrolling)
        if (item.classList.contains('skill-item')) {
            e.preventDefault();
        }

        const projectNameElement = item.querySelector(".project-name") || item.querySelector("h3");
        let projectName = projectNameElement.textContent;
        
        // Normalize names to match projectData keys
        if (projectName === "Graphic Design") projectName = "Graphic Designs";
        if (projectName === "UI Design") projectName = "UI Designs";

        const data = projectData[projectName];
        
        if (data) {
            let mediaHtml = "";
            if (data.videos) {
                currentGalleryIndex = 0;
                mediaHtml = `
                    <div class="modal-gallery video-gallery">
                        <div class="gallery-container" id="galleryContainer">
                            ${data.videos.map((vid, i) => {
                                const isYouTube = vid.includes('youtube.com') || vid.includes('youtu.be');
                                let embedUrl = vid;
                                if (isYouTube) {
                                    const videoId = vid.split('v=')[1] || vid.split('/').pop();
                                    embedUrl = `https://www.youtube.com/embed/${videoId.split('&')[0]}?autoplay=1&mute=1&loop=1&playlist=${videoId.split('&')[0]}`;
                                }
                                
                                return `
                                    <div class="gallery-item ${i === 0 ? 'active' : ''}">
                                        ${isYouTube ? `
                                            <iframe class="modal-video" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                                        ` : `
                                            <video class="modal-video" controls ${i === 0 ? 'autoplay' : ''} muted loop playsinline>
                                                <source src="${vid}" type="video/mp4">
                                                Your browser does not support the video tag.
                                            </video>
                                        `}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        ${data.videos.length > 1 ? `
                            <div class="gallery-nav prev" onclick="moveGallery(-1)">‹</div>
                            <div class="gallery-nav next" onclick="moveGallery(1)">›</div>
                            <div class="gallery-dots" id="galleryDots">
                                ${data.videos.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" onclick="setGallery(${i})"></div>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
                if (data.videos.length > 1) {
                    // We don't necessarily want to auto-play a gallery of videos as it might be jarring
                    // but we can if you want. Let's disable auto-play for video galleries.
                    stopAutoPlay();
                }
            } else if (data.video) {
                mediaHtml = `
                    <video class="modal-video" controls autoplay muted loop playsinline>
                        <source src="${data.video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
            } else if (data.images) {
                currentGalleryIndex = 0;
                mediaHtml = `
                    <div class="modal-gallery">
                        <div class="gallery-container" id="galleryContainer">
                            ${data.images.map((img, i) => `
                                <div class="gallery-item ${i === 0 ? 'active' : ''}">
                                    <img src="${img}" alt="${data.title}">
                                </div>
                            `).join('')}
                        </div>
                        <div class="gallery-nav prev" onclick="moveGallery(-1)">‹</div>
                        <div class="gallery-nav next" onclick="moveGallery(1)">›</div>
                        <div class="gallery-dots" id="galleryDots">
                            ${data.images.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" onclick="setGallery(${i})"></div>`).join('')}
                        </div>
                    </div>
                `;
                startAutoPlay();
            } else {
                mediaHtml = `<img src="${data.img}" alt="${data.title}" class="modal-img">`;
            }

            modalBody.innerHTML = `
                ${mediaHtml}
                <span class="modal-tags">${data.tags}</span>
                <h2 class="modal-title">${data.title}</h2>
                <p class="modal-desc">${data.desc}</p>
            `;
            modal.style.display = "flex";
            setTimeout(() => modal.classList.add("active"), 10);
            document.body.style.overflow = "hidden";
        }
    });
});

window.moveGallery = function(direction) {
    const projectName = document.querySelector(".modal-title").textContent;
    let data;
    for (let key in projectData) {
        if (projectData[key].title === projectName) {
            data = projectData[key];
            break;
        }
    }
    
    if (data && (data.images || data.videos)) {
        const totalItems = data.images ? data.images.length : data.videos.length;
        currentGalleryIndex = (currentGalleryIndex + direction + totalItems) % totalItems;
        updateGallery();
        if (data.images) startAutoPlay(); // Reset timer on manual move for images
    }
};

window.setGallery = function(index) {
    currentGalleryIndex = index;
    updateGallery();
    startAutoPlay(); // Reset timer on manual move
};

function updateGallery() {
    const items = document.querySelectorAll(".gallery-item");
    const dots = document.querySelectorAll(".dot");
    
    items.forEach((item, i) => {
        const isActive = i === currentGalleryIndex;
        item.classList.toggle("active", isActive);
        
        // Handle video playback
        const video = item.querySelector("video");
        if (video) {
            if (isActive) {
                video.play().catch(() => {}); // Autoplay might be blocked
            } else {
                video.pause();
            }
        }
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentGalleryIndex);
    });
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        closeModal();
        stopAutoPlay();
    });
}

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
        stopAutoPlay();
    }
});

function closeModal() {
    modal.classList.remove("active");
    
    // Stop all video playback
    const videos = modal.querySelectorAll("video");
    videos.forEach(v => v.pause());
    
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }, 500);
}

// --- Formspree Handling is now managed by the Formspree AJAX SDK in index.html ---

init();
