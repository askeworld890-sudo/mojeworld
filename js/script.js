

// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('fade-out');
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 0);
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Testimonial slider
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Auto slide change
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Portfolio filter
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Filter items
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});






/***** 3D BACKGROUND INSIDE HERO *****/
const hero = document.querySelector('.hero');
const bgCanvas = document.getElementById('bg');

const renderer = new THREE.WebGLRenderer({
  canvas: bgCanvas,
  alpha: true,
  antialias: true
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
camera.position.set(0, 0, 30);

const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue('--primary').trim();

// Torus (2nd portfolio style)
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color(primaryColor),
  transparent: true,
  opacity: 0.7,
  wireframe: true
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);
torus.position.x = 6;        // right side (try 5–10 as you like)
torus.scale.set(0.7, 0.7, 0.7); // 70% of original size

// Lights
const pointLight = new THREE.PointLight(0x00ffff, 0.7);
pointLight.position.set(20, 20, 20);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(pointLight, ambientLight);



// Size renderer to HERO (not full window)
function sizeToHero() {
  const rect = hero.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = (rect.width / rect.height) || 1;
  camera.updateProjectionMatrix();
}
window.addEventListener('load', sizeToHero);
window.addEventListener('resize', sizeToHero);
new ResizeObserver(sizeToHero).observe(hero);

// Animate
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  renderer.render(scene, camera);
}
animate();

/***** CUSTOM CURSOR *****/
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
  }, 80);
});

document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorFollower.style.opacity = '1';
});
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorFollower.style.opacity = '0';
});

// Optional hover effects
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.backgroundColor = 'transparent';
    cursor.style.border = '2px solid ' + getComputedStyle(el).color;
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '8px';
    cursor.style.height = '8px';
    cursor.style.backgroundColor = '#0ef';
    cursor.style.border = 'none';
  });
});


// Add this to your script.js file (before the closing </script> tag if in HTML)

// Typewriter Effect for Hero Section
const heroHeading = document.querySelector('.hero h1');
const originalText = heroHeading.innerHTML;
const dynamicWords = ["Oil Paintings",
  "Pencil Sketches",
  "Watercolor Art",
  "Digital Illustrations",
  "Portraits",
  "Abstract Art",
  "Custom Commissions"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 200;

function typeWriterEffect() {
    const currentWord = dynamicWords[wordIndex];
    const currentText = originalText.replace('Oil Paintings', 
        `<span class="typewriter">${currentWord.substring(0, charIndex)}</span>`);
    
    heroHeading.innerHTML = currentText;
    
    if (!isDeleting && charIndex < currentWord.length) {
        // Typing
        charIndex++;
        typeSpeed = 100;
    } else if (isDeleting && charIndex > 0) {
        // Deleting
        charIndex--;
        typeSpeed = 50;
    } else {
        // Switch words
        isDeleting = !isDeleting;
        if (!isDeleting) {
            wordIndex = (wordIndex + 1) % dynamicWords.length;
        }
        typeSpeed = isDeleting ? 1500 : 500;
    }
    
    setTimeout(typeWriterEffect, typeSpeed);
}

// Start the effect when page loads
window.addEventListener('load', function() {
    // Wait for preloader to finish
    setTimeout(typeWriterEffect, 1000);
});

/* 3D Tilt for Service Cards */
// Services card moving sheen (optional)
(function(){
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--x', x + '%');
      card.style.setProperty('--y', y + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--x');
      card.style.removeProperty('--y');
    });
  });
})();
