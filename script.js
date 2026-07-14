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
    const viewApplicationsBtn = document.getElementById('viewApplicationsBtn');
    const adminModal = document.getElementById('adminModal');
    const closeAdminModalBtn = document.getElementById('closeAdminModal');
    const applicationsList = document.getElementById('applicationsList');
    const messagesList = document.getElementById('messagesList');
    
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

    // Close Application Modal
    closeModalBtn.addEventListener('click', function() {
        applicationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        applicationForm.reset();
    });

    applicationModal.addEventListener('click', function(e) {
        if (e.target === applicationModal) {
            applicationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            applicationForm.reset();
        }
    });

    // Application Form Handler
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

    // Contact Form Handler
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

        let messages = JSON.parse(localStorage.getItem('nesf_messages') || '[]');
        messages.push(formData);
        localStorage.setItem('nesf_messages', JSON.stringify(messages));
        
        console.log('Message Sent:', formData);
        console.log('Total Messages:', messages.length);

        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });

    // View Applications (Admin) Button Handler
    viewApplicationsBtn.addEventListener('click', function() {
        // Optional: Add simple password protection
        const password = prompt("Enter Admin Password to view applications (default: nesf@123):");
        if (password === "nesf@123" || password === null) {
            renderAdminData();
            adminModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            alert("Incorrect password!");
        }
    });

    // Close Admin Modal
    closeAdminModalBtn.addEventListener('click', function() {
        adminModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    adminModal.addEventListener('click', function(e) {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Function to render applications and messages in admin modal
    function renderAdminData() {
        const applications = JSON.parse(localStorage.getItem('nesf_applications') || '[]');
        const messages = JSON.parse(localStorage.getItem('nesf_messages') || '[]');

        // Render Applications
        if (applications.length === 0) {
            applicationsList.innerHTML = '<p style="color: #6b7280; font-size: 16px;">No applications submitted yet!</p>';
        } else {
            applicationsList.innerHTML = applications.reverse().map(app => `
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #1e3a8a;">
                    <h4 style="font-size: 18px; margin-bottom: 8px; color: #0f172a;">${app.name} - ${app.internship}</h4>
                    <p style="margin-bottom: 4px;"><strong>Email:</strong> ${app.email}</p>
                    ${app.phone ? `<p style="margin-bottom: 4px;"><strong>Phone:</strong> ${app.phone}</p>` : ''}
                    <p style="margin-bottom: 4px;"><strong>Education:</strong> ${app.education}</p>
                    <p style="margin-bottom: 4px;"><strong>Resume:</strong> <a href="${app.resume}" target="_blank" style="color: #1e3a8a; text-decoration: underline;">View Resume</a></p>
                    ${app.coverLetter ? `<p style="margin-bottom: 4px; margin-top: 8px;"><strong>Cover Letter:</strong> ${app.coverLetter}</p>` : ''}
                    <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">Submitted on: ${new Date(app.timestamp).toLocaleString()}</p>
                </div>
            `).join('');
        }

        // Render Messages
        if (messages.length === 0) {
            messagesList.innerHTML = '<p style="color: #6b7280; font-size: 16px;">No messages received yet!</p>';
        } else {
            messagesList.innerHTML = messages.reverse().map(msg => `
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #059669;">
                    <h4 style="font-size: 18px; margin-bottom: 8px; color: #0f172a;">${msg.name} - ${msg.subject || 'General Inquiry'}</h4>
                    <p style="margin-bottom: 4px;"><strong>Email:</strong> ${msg.email}</p>
                    ${msg.phone ? `<p style="margin-bottom: 4px;"><strong>Phone:</strong> ${msg.phone}</p>` : ''}
                    <p style="margin-top: 8px; margin-bottom: 4px;"><strong>Message:</strong> ${msg.message}</p>
                    <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">Received on: ${new Date(msg.timestamp).toLocaleString()}</p>
                </div>
            `).join('');
        }
    }

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
