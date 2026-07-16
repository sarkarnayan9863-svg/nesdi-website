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
    
    // Feedback selectors
    const feedbackModal = document.getElementById('feedbackModal');
    const openFeedbackBtn = document.getElementById('openFeedbackBtn');
    const closeFeedbackModalBtn = document.getElementById('closeFeedbackModal');
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbacksList = document.getElementById('feedbacksList');
    
    let currentInternship = '';
    let secretCode = '';
    const targetSecretCode = 'nesf';

    // Secret code listener to show admin button
    document.addEventListener('keydown', function(e) {
        secretCode += e.key.toLowerCase();
        // Keep only the last N characters where N is length of target code
        secretCode = secretCode.slice(-targetSecretCode.length);
        
        if (secretCode === targetSecretCode) {
            viewApplicationsBtn.style.display = 'block';
            secretCode = ''; // Reset the code
            alert('Admin mode activated! Scroll to footer to see the button.');
        }
    });

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

    // Open Feedback Modal
    if (openFeedbackBtn) {
        openFeedbackBtn.addEventListener('click', function() {
            feedbackModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close Feedback Modal
    if (closeFeedbackModalBtn) {
        closeFeedbackModalBtn.addEventListener('click', function() {
            feedbackModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            feedbackForm.reset();
        });
    }

    if (feedbackModal) {
        feedbackModal.addEventListener('click', function(e) {
            if (e.target === feedbackModal) {
                feedbackModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                feedbackForm.reset();
            }
        });
    }

    // Feedback Form Handler
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('feedbackStudentName').value,
                course: document.getElementById('feedbackCourse').value,
                internship: document.getElementById('feedbackInternship').value,
                duration: document.getElementById('feedbackDuration').value,
                rating: document.getElementById('feedbackRating').value,
                text: document.getElementById('feedbackText').value,
                drawbacks: document.getElementById('feedbackDrawbacks').value,
                avatar: document.getElementById('feedbackAvatar').value || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
                timestamp: new Date().toISOString()
            };

            let feedbacks = JSON.parse(localStorage.getItem('nesf_feedbacks') || '[]');
            feedbacks.push(formData);
            localStorage.setItem('nesf_feedbacks', JSON.stringify(feedbacks));
            
            console.log('Feedback Submitted:', formData);
            alert('Thank you for sharing your feedback and suggestions! Your experience helps us grow.');

            feedbackModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            feedbackForm.reset();
            
            loadDynamicTestimonials();
        });
    }

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

        // Render Feedbacks
        const feedbacks = JSON.parse(localStorage.getItem('nesf_feedbacks') || '[]');
        if (feedbacks.length === 0) {
            feedbacksList.innerHTML = '<p style="color: #6b7280; font-size: 16px;">No student feedbacks submitted yet!</p>';
        } else {
            feedbacksList.innerHTML = feedbacks.reverse().map(fb => `
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; display: flex; flex-direction: column; gap: 6px;">
                    <h4 style="font-size: 18px; margin-bottom: 4px; color: #0f172a;">${fb.name} - ${fb.course}</h4>
                    <p style="margin-bottom: 0;"><strong>Placement:</strong> ${fb.internship} (${fb.duration})</p>
                    <p style="margin-bottom: 0;"><strong>Rating:</strong> ${'⭐'.repeat(parseInt(fb.rating))}</p>
                    <p style="margin-bottom: 0; color: #1e3a8a; background: rgba(59, 130, 246, 0.05); padding: 8px 12px; border-radius: 6px;"><strong>What went well:</strong> ${fb.text}</p>
                    <p style="margin-bottom: 0; color: #dc2626; background: rgba(220, 38, 38, 0.05); padding: 8px 12px; border-radius: 6px;"><strong>Kya kami/Suggestions:</strong> ${fb.drawbacks}</p>
                    <p style="margin-top: 4px; font-size: 11px; color: #6b7280;">Submitted on: ${new Date(fb.timestamp).toLocaleString()}</p>
                </div>
            `).join('');
        }
    }

    // Function to load dynamic testimonials from localStorage
    function loadDynamicTestimonials() {
        const feedbacks = JSON.parse(localStorage.getItem('nesf_feedbacks') || '[]');
        if (feedbacks.length === 0) return;
        
        const successGrid = document.querySelector('.success-stories-grid');
        if (!successGrid) return;
        
        // Clear previously added dynamic cards to prevent duplication
        const existingDynamic = successGrid.querySelectorAll('.dynamic-card');
        existingDynamic.forEach(el => el.remove());

        // Prepend new feedbacks
        feedbacks.reverse().forEach((fb) => {
            const card = document.createElement('div');
            card.className = 'success-card dynamic-card';
            
            // Create rating stars
            let stars = '';
            const ratingNum = parseInt(fb.rating) || 5;
            for (let i = 0; i < 5; i++) {
                if (i < ratingNum) {
                    stars += '<i class="fas fa-star" style="color: var(--accent-color); margin-right: 2px;"></i>';
                } else {
                    stars += '<i class="far fa-star" style="color: var(--border-color); margin-right: 2px;"></i>';
                }
            }

            card.innerHTML = `
                <div class="success-card-quote">
                    <i class="fas fa-quote-right"></i>
                </div>
                <div class="success-card-header">
                    <img src="${fb.avatar}" alt="${fb.name}">
                    <div>
                        <h3>${fb.name}</h3>
                        <p style="color: var(--primary-light); font-weight: 600;">${fb.course} Graduate</p>
                        <div style="font-size: 11px; margin-top: 4px; display: flex; gap: 2px;">${stars}</div>
                    </div>
                </div>
                <div class="success-card-company">
                    <i class="fas fa-briefcase"></i> Placement: ${fb.internship}
                </div>
                <div class="success-card-achievements" style="display: flex; flex-direction: column; gap: 8px;">
                    <p style="color: var(--text-dark); font-weight: 500; font-style: normal; line-height: 1.6;">"${fb.text}"</p>
                    <p style="font-size: 13px; color: #dc2626; font-style: normal; background: rgba(220, 38, 38, 0.05); padding: 8px 12px; border-radius: 6px;"><strong style="color: var(--text-dark);">Kami / Suggestions:</strong> "${fb.drawbacks}"</p>
                </div>
                <div class="success-card-stats" style="margin-top: 12px; border-top: 1px solid var(--border-color); padding-top: 12px;">
                    <div>
                        <div style="color: var(--primary-color); font-weight: 800; font-size: 20px;">${fb.duration}</div>
                        <div>Duration</div>
                    </div>
                    <div>
                        <div style="color: var(--secondary-color); font-weight: 800; font-size: 20px;">Feedback</div>
                        <div>Type</div>
                    </div>
                </div>
            `;
            
            // Prepend to the grid
            successGrid.insertBefore(card, successGrid.firstChild);
            
            // Observe the new element for fade-in animation
            if (typeof fadeObserver !== 'undefined' && fadeObserver) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                fadeObserver.observe(card);
            }
        });
    }

    // Fade In Animation for Cards
    const fadeElements = document.querySelectorAll('.program-card, .internship-card, .about-content, .about-image, .success-card');
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

    // Call dynamic testimonials load on startup (after fadeObserver is declared)
    loadDynamicTestimonials();

    // Course Search Bar Functionality
    const courseSearchInput = document.getElementById('courseSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const searchNoResults = document.getElementById('searchNoResults');
    const programCards = document.querySelectorAll('.program-card');

    if (courseSearchInput) {
        courseSearchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            // Show/hide clear button
            if (query.length > 0) {
                clearSearchBtn.style.display = 'block';
            } else {
                clearSearchBtn.style.display = 'none';
            }

            let visibleCount = 0;

            programCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const desc = card.querySelector('p').textContent.toLowerCase();
                const features = Array.from(card.querySelectorAll('.program-features li'))
                                     .map(li => li.textContent.toLowerCase())
                                     .join(' ');

                if (title.includes(query) || desc.includes(query) || features.includes(query)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Show no results message if count is 0
            if (visibleCount === 0) {
                searchNoResults.style.display = 'block';
            } else {
                searchNoResults.style.display = 'none';
            }
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            courseSearchInput.value = '';
            // Trigger input event to update list
            courseSearchInput.dispatchEvent(new Event('input'));
        });
    }
});
