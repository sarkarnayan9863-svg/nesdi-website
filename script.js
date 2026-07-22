document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const viewApplicationsBtn = document.getElementById('viewApplicationsBtn');
    const adminModal = document.getElementById('adminModal');
    const closeAdminModalBtn = document.getElementById('closeAdminModal');
    const messagesList = document.getElementById('messagesList');
    const collabsList = document.getElementById('collabsList');
    const detailsModal = document.getElementById('detailsModal');
    const detailsModalTitle = document.getElementById('detailsModalTitle');
    const detailsModalBody = document.getElementById('detailsModalBody');
    const closeDetailsModalBtn = document.getElementById('closeDetailsModal');
    const clickableCards = document.querySelectorAll('.clickable-card');
    
    // Feedback selectors
    const feedbackModal = document.getElementById('feedbackModal');
    const openFeedbackBtn = document.getElementById('openFeedbackBtn');
    const closeFeedbackModalBtn = document.getElementById('closeFeedbackModal');
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbacksList = document.getElementById('feedbacksList');
    
    let secretCode = '';
    const targetSecretCode = 'nesfghyone';

    // Secret code listener to show admin button
    document.addEventListener('keydown', function(e) {
        if (e.key.length !== 1) return; // Ignore modifier keys like Shift, Control, etc.
        secretCode += e.key.toLowerCase();
        // Keep only the last N characters where N is length of target code
        secretCode = secretCode.slice(-targetSecretCode.length);
        
        if (secretCode === targetSecretCode) {
            secretCode = ''; // Reset the code
            const password = prompt("Enter Admin Password:");
            if (!password) return;

            fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            }).then(async response => {
                if (!response.ok) throw new Error('Incorrect password');
                const data = await response.json();
                localStorage.setItem('nesf_admin_token', data.token);
                viewApplicationsBtn.style.display = 'block';
                document.body.classList.add('admin-mode-active');
                alert('Admin mode activated! Scroll to footer to see the button.');
                if (adminModal && adminModal.style.display === 'flex') {
                    renderAdminData();
                }
            }).catch(() => {
                alert("Incorrect password!");
            });
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



    // Contact Form Handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Network error');
            alert('Thank you for reaching out! We will get back to you soon.');
            contactForm.reset();
        } catch (err) {
            alert('Error submitting message. Please try again later.');
            console.error(err);
        }
    });

    // Collaboration Form Handler
    const collaborationForm = document.getElementById('collaborationForm');
    if (collaborationForm) {
        collaborationForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const collabData = {
                orgName: document.getElementById('collabOrgName').value,
                email: document.getElementById('collabEmail').value,
                phone: document.getElementById('collabPhone').value,
                type: document.getElementById('collabType').value,
                message: document.getElementById('collabMessage').value,
                timestamp: new Date().toISOString()
            };

            try {
                const res = await fetch('/api/collaborations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(collabData)
                });
                if (!res.ok) throw new Error('Network error');
                alert('Thank you for your collaboration request! Our team will reach out to you shortly.');
                collaborationForm.reset();
            } catch (err) {
                alert('Error submitting request.');
                console.error(err);
            }
        });
    }

    // Select Collaboration Type on card click
    const collabDetails = {
        'Academic Institution': {
            icon: 'fas fa-university',
            color: 'linear-gradient(135deg, #0f3460, #1e5f9c)',
            tagline: 'Partner with us for academic excellence and student growth',
            description: 'NESF welcomes partnerships with universities, colleges, and educational institutions across India and beyond. Together, we can bridge the gap between academic learning and real-world skills.',
            benefits: [
                'Student internship placement & mentorship programs',
                'Joint curriculum development and guest lectures',
                'Research collaborations and academic publications',
                'Faculty exchange and development programs (FDP)',
                'Co-branded skill certification programs',
                'Campus outreach and awareness drives'
            ],
            whoCanJoin: 'Universities, colleges, polytechnics, schools, coaching institutes, and ed-tech platforms.',
            process: 'Submit a collaboration request → NESF team will connect within 48 hours → MOU signing → Program launch'
        },
        'Corporate & Industry': {
            icon: 'fas fa-building',
            color: 'linear-gradient(135deg, #e94560, #f472b6)',
            tagline: 'Build your talent pipeline and fulfill CSR goals with NESF',
            description: 'NESF partners with corporate organizations and industry leaders to bridge the skill gap between trained youth and industry requirements, while also fulfilling meaningful CSR commitments.',
            benefits: [
                'Access to a trained talent pool for recruitment',
                'CSR project implementation under Schedule VIII',
                'Customized corporate training and upskilling programs',
                'Co-branded workshops and industry mentorship sessions',
                'Brand visibility at NESF events and platforms',
                'Impact reports and CSR documentation support'
            ],
            whoCanJoin: 'Private companies, MNCs, industry associations, trade bodies, and industry chambers.',
            process: 'Submit a collaboration request → Discussion with NESF team → Agreement → Program design & delivery'
        },
        'NGO & Nonprofit': {
            icon: 'fas fa-hands-helping',
            color: 'linear-gradient(135deg, #0d9488, #14b8a6)',
            tagline: 'Together we can create deeper grassroots impact',
            description: 'NESF collaborates with NGOs, nonprofits, and civil society organizations to amplify community outreach, skill development at the grassroots level, and social impact programs across North East India.',
            benefits: [
                'Joint community skill development programs',
                'Shared resources and training infrastructure',
                'Co-implementation of government-funded social schemes',
                'Women empowerment and livelihood programs',
                'Disaster relief and humanitarian initiatives',
                'Collaborative grant writing and project proposals'
            ],
            whoCanJoin: 'Registered NGOs, Section 8 companies, trusts, charitable societies, and community-based organizations.',
            process: 'Submit a collaboration request → Partnership discussion → MOU → Joint program design & execution'
        },
        'International Organization': {
            icon: 'fas fa-globe',
            color: 'linear-gradient(135deg, #f39c12, #fbbf24)',
            tagline: 'Global partnerships for local transformation',
            description: 'NESF actively seeks partnerships with international organizations, development agencies, and global foundations to bring world-class skill development, certifications, and knowledge to the youth of North East India.',
            benefits: [
                'International certification and recognition programs',
                'Cross-border education and student exchange',
                'SDG-aligned programs and impact measurement',
                'Access to global funding and development grants',
                'Knowledge transfer and best practices sharing',
                'Participation in global conferences and forums'
            ],
            whoCanJoin: 'UN agencies, international NGOs, bilateral organizations, global foundations, and foreign universities.',
            process: 'Submit collaboration request → Initial consultation → Partnership framework → MOU → Program launch'
        },
        'Government Body': {
            icon: 'fas fa-landmark',
            color: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            tagline: 'Empowering national missions through skill development',
            description: 'NESF works closely with government bodies at the state and central level to implement skill development schemes, national missions, and community welfare programs across North East India.',
            benefits: [
                'Implementation of Skill India, PMKVY and other national schemes',
                'Training and placement under government skill missions',
                'Community mobilization and awareness programs',
                'Policy implementation support and ground-level execution',
                'Assessment and certification under national frameworks',
                'Reporting, documentation, and compliance support'
            ],
            whoCanJoin: 'Central ministries, state government departments, public sector bodies, district administrations, and municipal corporations.',
            process: 'Submit collaboration request → Government liaison → MOU/Agreement → Scheme implementation → Impact reporting'
        },
        'Startup & Entrepreneur': {
            icon: 'fas fa-lightbulb',
            color: 'linear-gradient(135deg, #10b981, #34d399)',
            tagline: 'Grow your startup with NESF\'s network and talent',
            description: 'NESF provides a strong launchpad for startups and entrepreneurs by connecting them with trained talent, mentorship networks, co-working opportunities, and collaborative program development.',
            benefits: [
                'Access to NESF\'s trained intern and fresher talent pool',
                'Co-creation of training and upskilling content',
                'Mentorship and motivational workshop partnerships',
                'Incubation support and startup visibility at NESF events',
                'Joint entrepreneurship workshop organization',
                'Networking with NESF\'s corporate and institutional partners'
            ],
            whoCanJoin: 'Registered startups, early-stage companies, entrepreneurs, freelancers, and solopreneurs.',
            process: 'Submit collaboration request → Startup onboarding discussion → Partnership plan → Execution'
        },
        'PSU (Public Sector Undertaking)': {
            icon: 'fas fa-industry',
            color: 'linear-gradient(135deg, #0f766e, #14b8a6)',
            tagline: 'Partner with NESF to build a skilled national workforce',
            description: 'NESF welcomes tie-ups with Public Sector Undertakings (PSUs) across India to deliver skill development, CSR-funded training, campus recruitment, and workforce upskilling aligned with national missions and industry requirements.',
            benefits: [
                'CSR-funded skill development under Schedule VIII of Companies Act',
                'Campus recruitment from NESF\'s trained talent pool',
                'Workforce upskilling and reskilling programs for PSU employees',
                'Apprenticeship and on-the-job training tie-ups',
                'Community development programs in PSU operational areas',
                'Brand visibility and social impact documentation'
            ],
            whoCanJoin: 'Navratna, Miniratna, and other Central & State PSUs across sectors including energy, infrastructure, finance, and manufacturing.',
            process: 'Submit collaboration request → PSU liaison → MOU/Agreement → CSR program design → Delivery & impact reporting'
        }
    };

    window.selectCollabType = function(type) {
        const e = window.event;
        const details = collabDetails[type];
        if (!details) return;

        // Build modal content
        const benefitsList = details.benefits.map(b => `<li><i class="fas fa-check-circle" style="color:#10b981; margin-right:8px;"></i>${b}</li>`).join('');

        detailsModalTitle.innerHTML = `<span style="display:inline-flex;align-items:center;gap:12px;">
            <span style="width:44px;height:44px;border-radius:12px;background:${details.color};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="${details.icon}" style="color:white;font-size:20px;"></i>
            </span>
            ${type}
        </span>`;

        detailsModalBody.innerHTML = `
            <p style="color:var(--primary-light);font-weight:600;font-size:16px;margin-bottom:16px;font-style:italic;">${details.tagline}</p>
            <p style="margin-bottom:24px;font-size:16px;line-height:1.8;">${details.description}</p>
            <h3><i class="fas fa-star"></i> Key Benefits</h3>
            <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:10px;margin-bottom:24px;">${benefitsList}</ul>
            <h3><i class="fas fa-users"></i> Who Can Join</h3>
            <p style="margin-bottom:24px;">${details.whoCanJoin}</p>
            <h3><i class="fas fa-route"></i> Collaboration Process</h3>
            <p style="margin-bottom:28px;">${details.process}</p>
            <button onclick="document.getElementById('detailsModal').style.display='none'; document.getElementById('collabType').value='${type}'; document.getElementById('collaborationForm').scrollIntoView({behavior:'smooth',block:'center'});" 
                class="btn btn-primary" style="background:var(--primary-color);color:white;width:100%;justify-content:center;">
                <i class="fas fa-paper-plane" style="margin-right:8px;"></i> Send Collaboration Request as ${type}
            </button>
        `;

        detailsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Also highlight the card
        document.querySelectorAll('.collab-type-card').forEach(card => card.classList.remove('collab-card-active'));
        if (e && e.currentTarget) e.currentTarget.classList.add('collab-card-active');
    };


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
        feedbackForm.addEventListener('submit', async function(e) {
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

            try {
                const res = await fetch('/api/feedbacks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (!res.ok) throw new Error('Network error');
                
                alert('Thank you for sharing your feedback and suggestions! Your experience helps us grow.');
                feedbackModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                feedbackForm.reset();
                if (adminModal && adminModal.style.display === 'flex') {
                    renderAdminData();
                }
            } catch (err) {
                alert('Error submitting feedback.');
                console.error(err);
            }
        });
    }

    // View Applications (Admin) Button Handler
    viewApplicationsBtn.addEventListener('click', function() {
        // Now using token from local storage that was set when typing secret code
        const token = localStorage.getItem('nesf_admin_token');
        if (token) {
            adminModal.style.display = 'flex';
            renderAdminData();
        } else {
            alert("Not authorized. Please type secret code again.");
        }
    });

    closeAdminModalBtn.addEventListener('click', function() {
        adminModal.style.display = 'none';
    });

    // Close admin modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target == adminModal) {
            adminModal.style.display = 'none';
        }
    });

    // Function to render admin data
    async function renderAdminData() {
        const token = localStorage.getItem('nesf_admin_token');
        if (!token) return;

        try {
            const res = await fetch('/api/admin/data', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            
            if (!res.ok) {
                if (res.status === 401) {
                    alert('Session expired or unauthorized. Please re-enter admin mode.');
                    localStorage.removeItem('nesf_admin_token');
                    viewApplicationsBtn.style.display = 'none';
                    document.body.classList.remove('admin-mode-active');
                    adminModal.style.display = 'none';
                }
                return;
            }

            const data = await res.json();
            const { messages, collaborations, feedbacks } = data;

            // Render Messages
            if (messages.length === 0) {
                messagesList.innerHTML = '<p style="color: #6b7280; font-size: 16px;">No messages received yet!</p>';
            } else {
                messagesList.innerHTML = messages.reverse().map(msg => `
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #059669; position: relative;">
                        <button onclick="deleteAdminMessage(${msg.id})" style="position: absolute; top: 16px; right: 16px; background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">Delete</button>
                        <h4 style="font-size: 18px; margin-bottom: 8px; color: #0f172a; padding-right: 70px;">${msg.name} - ${msg.subject || 'General Inquiry'}</h4>
                        <p style="margin-bottom: 4px;"><strong>Email:</strong> ${msg.email}</p>
                        ${msg.phone ? `<p style="margin-bottom: 4px;"><strong>Phone:</strong> ${msg.phone}</p>` : ''}
                        <p style="margin-top: 8px; margin-bottom: 4px;"><strong>Message:</strong> ${msg.message}</p>
                        <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">Received on: ${new Date(msg.timestamp).toLocaleString()}</p>
                    </div>
                `).join('');
            }

            // Render Collaborations
            if (collaborations.length === 0) {
                collabsList.innerHTML = '<p style="color: #6b7280; font-size: 16px;">No collaboration requests received yet!</p>';
            } else {
                collabsList.innerHTML = collaborations.reverse().map(collab => `
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6; position: relative;">
                        <button onclick="deleteAdminCollab(${collab.id})" style="position: absolute; top: 16px; right: 16px; background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">Delete</button>
                        <h4 style="font-size: 18px; margin-bottom: 8px; color: #0f172a; padding-right: 70px;">${collab.orgName}</h4>
                        <p style="margin-bottom: 4px;"><strong>Partner Type:</strong> ${collab.type}</p>
                        <p style="margin-bottom: 4px;"><strong>Email:</strong> ${collab.email}</p>
                        ${collab.phone ? `<p style="margin-bottom: 4px;"><strong>Phone:</strong> ${collab.phone}</p>` : ''}
                        <p style="margin-top: 8px; margin-bottom: 4px;"><strong>Message/Proposal:</strong> ${collab.message}</p>
                        <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">Received on: ${new Date(collab.timestamp).toLocaleString()}</p>
                    </div>
                `).join('');
            }

            // Render Feedbacks
            if (feedbacks.length === 0) {
                feedbacksList.innerHTML = '<p style="color: #6b7280; font-size: 16px;">No student feedbacks submitted yet!</p>';
            } else {
                feedbacksList.innerHTML = feedbacks.reverse().map(fb => `
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; display: flex; flex-direction: column; gap: 6px; position: relative;">
                        <button onclick="deleteAdminFeedback(${fb.id})" style="position: absolute; top: 16px; right: 16px; background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">Delete</button>
                        <h4 style="font-size: 18px; margin-bottom: 4px; color: #0f172a; padding-right: 70px;">${fb.name} - ${fb.course}</h4>
                        <p style="margin-bottom: 0;"><strong>Placement:</strong> ${fb.internship || 'N/A'} (${fb.duration})</p>
                        <p style="margin-bottom: 0;"><strong>Rating:</strong> ${'⭐'.repeat(parseInt(fb.rating))}</p>
                        <p style="margin-bottom: 0; color: #1e3a8a; background: rgba(59, 130, 246, 0.05); padding: 8px 12px; border-radius: 6px;"><strong>What went well:</strong> ${fb.text}</p>
                        <p style="margin-bottom: 0; color: #dc2626; background: rgba(220, 38, 38, 0.05); padding: 8px 12px; border-radius: 6px;"><strong>Kya kami/Suggestions:</strong> ${fb.drawbacks}</p>
                        <p style="margin-top: 4px; font-size: 11px; color: #6b7280;">Submitted on: ${new Date(fb.timestamp).toLocaleString()}</p>
                    </div>
                `).join('');
            }
        } catch (err) {
            console.error(err);
            alert('Error fetching admin data.');
        }
    }

    // Deletion Functions (Global scope)
    window.deleteAdminFeedback = async function(id) {
        if (confirm('Are you sure you want to delete this feedback?')) {
            const token = localStorage.getItem('nesf_admin_token');
            await fetch(`/api/admin/feedbacks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            renderAdminData();
        }
    };

    window.deleteAdminMessage = async function(id) {
        if (confirm('Are you sure you want to delete this message?')) {
            const token = localStorage.getItem('nesf_admin_token');
            await fetch(`/api/admin/messages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            renderAdminData();
        }
    };

    window.deleteAdminCollab = async function(id) {
        if (confirm('Are you sure you want to delete this collaboration request?')) {
            const token = localStorage.getItem('nesf_admin_token');
            await fetch(`/api/admin/collaborations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            renderAdminData();
        }
    };

    // Function to load dynamic testimonials from localStorage
    function loadDynamicTestimonials() {
        // Disabled completely: Feedback only goes to admin panel now.
        return;
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

    // Details Modal Functionality
    clickableCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Allow Learn More button on program cards to open modal
            // But if it's Apply Now on internship cards, open application modal instead
            if (e.target.closest('.btn')) {
                const btn = e.target.closest('.btn');
                if (btn.textContent.includes('Apply')) {
                    return; // Let the existing Apply Now handler take over
                }
                // Otherwise, continue to open details modal for Learn More
            }

            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const features = this.getAttribute('data-features');
            const company = this.getAttribute('data-company');
            const location = this.getAttribute('data-location');
            const duration = this.getAttribute('data-duration');

            let bodyContent = '';
            let subheaderContent = '';

            // Build subheader
            if (company) {
                subheaderContent += `<span class="modal-tag"><i class="fas fa-building"></i> ${company}</span>`;
            }
            if (location) {
                subheaderContent += `<span class="modal-tag"><i class="fas fa-map-marker-alt"></i> ${location}</span>`;
            }
            if (duration) {
                subheaderContent += `<span class="modal-tag"><i class="fas fa-clock"></i> ${duration}</span>`;
            }

            // Build main body
            bodyContent += `<p style="font-size: 17px; margin-bottom: 24px; line-height: 1.9;">${description}</p>`;

            if (features) {
                const featuresList = features.split(', ');
                bodyContent += `
                    <h4><i class="fas fa-check-circle"></i> What You'll Learn</h4>
                    <ul>
                        ${featuresList.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                `;
            }

            // Combine everything
            let fullContent = '';
            if (subheaderContent) {
                fullContent += `<div class="modal-subheader">${subheaderContent}</div>`;
            }
            fullContent += bodyContent;

            detailsModalTitle.textContent = title;
            detailsModalBody.innerHTML = fullContent;
            detailsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Details Modal
    if (closeDetailsModalBtn) {
        closeDetailsModalBtn.addEventListener('click', function() {
            detailsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (detailsModal) {
        detailsModal.addEventListener('click', function(e) {
            if (e.target === detailsModal) {
                detailsModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Auto-scroll for mobile card grids
(function() {
    const autoScrollGrids = [
        '.programs-grid',
        '.internships-grid',
        '.objectives-grid',
        '.collab-types-grid',
        '.success-stories-grid'
    ];

    autoScrollGrids.forEach(function(selector) {
        const grid = document.querySelector(selector);
        if (!grid) return;

        let scrollInterval = null;
        let isPaused = false;
        let scrollDirection = 1;

        function startAutoScroll() {
            clearInterval(scrollInterval);
            
            // Check if there is actual scrollable overflow
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            if (maxScroll <= 5) return;

            grid.classList.add('auto-scrolling');

            scrollInterval = setInterval(function() {
                if (isPaused) {
                    grid.classList.remove('auto-scrolling');
                    return;
                }

                grid.classList.add('auto-scrolling');

                const currentMaxScroll = grid.scrollWidth - grid.clientWidth;
                if (currentMaxScroll <= 5) {
                    grid.classList.remove('auto-scrolling');
                    return;
                }

                if (grid.scrollLeft >= currentMaxScroll - 2) {
                    scrollDirection = -1;
                } else if (grid.scrollLeft <= 2) {
                    scrollDirection = 1;
                }

                grid.scrollLeft += scrollDirection * 1.5;
            }, 20);
        }

        // Pause on touch
        grid.addEventListener('touchstart', function() { 
            isPaused = true; 
            grid.classList.remove('auto-scrolling');
        }, { passive: true });
        
        grid.addEventListener('touchend', function() {
            setTimeout(function() { isPaused = false; }, 2500);
        }, { passive: true });

        // Pause on mouse hover
        grid.addEventListener('mouseover', function() { 
            isPaused = true; 
            grid.classList.remove('auto-scrolling');
        });
        
        grid.addEventListener('mouseout', function(e) { 
            if (!grid.contains(e.relatedTarget)) {
                isPaused = false; 
            }
        });

        // Start when section visible
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    startAutoScroll();
                } else {
                    clearInterval(scrollInterval);
                    grid.classList.remove('auto-scrolling');
                }
            });
        }, { threshold: 0.2 });

        observer.observe(grid);

        // Handle resize
        window.addEventListener('resize', function() {
            clearInterval(scrollInterval);
            grid.classList.remove('auto-scrolling');
            startAutoScroll();
        });
    });
})();
