document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const applicationModal = document.getElementById('applicationModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModalBtn = document.getElementById('closeModal');
    const applicationForm = document.getElementById('applicationForm');
    
    let currentInternship = '';

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    });
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const highlightNavLink = () => {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNavLink);

    // Apply Now Button Handler
    const applyButtons = document.querySelectorAll('.internship-card .btn-outline');
    applyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.internship-card');
            currentInternship = card.querySelector('h3').textContent;
            modalTitle.textContent = `Apply for ${currentInternship}`;
            applicationModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Modal
    closeModalBtn.addEventListener('click', function() {
        applicationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        applicationForm.reset();
    });

    // Close Modal when clicking outside
    applicationModal.addEventListener('click', function(e) {
        if (e.target === applicationModal) {
            applicationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            applicationForm.reset();
        }
    });

    // Application Form Handler (Backend Simulation with LocalStorage)
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            internship: currentInternship,
            name: document.getElementById('applicantName').value,
            email: document.getElementById('applicantEmail').value,
            phone: document.getElementById('applicantPhone').value,
            education: document.getElementById('applicantEducation').value,
            resume: document.getElementById('applicantResume').value,
            coverLetter: document.getElementById('applicantCoverLetter').value,
            timestamp: new Date().toISOString()
        };

        // Simulate Backend - Save to LocalStorage
        let applications = JSON.parse(localStorage.getItem('nesf_applications') || '[]');
        applications.push(formData);
        localStorage.setItem('nesf_applications', JSON.stringify(applications));
        
        console.log('Application Submitted:', formData);
        console.log('Total Applications:', applications.length);

        alert(`Application for "${currentInternship}" submitted successfully! We will review your application and get back to you soon.`);

        applicationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        applicationForm.reset();
    });

    // Contact Form Handler (Backend Simulation with LocalStorage)
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Simulate Backend - Save to LocalStorage
        let messages = JSON.parse(localStorage.getItem('nesf_messages') || '[]');
        messages.push(formData);
        localStorage.setItem('nesf_messages', JSON.stringify(messages));
        
        console.log('Message Sent:', formData);
        console.log('Total Messages:', messages.length);

        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });

    // Fade In Animation for Cards
    const fadeElements = document.querySelectorAll('.program-card, .internship-card, .about-content, .about-image');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });
});
