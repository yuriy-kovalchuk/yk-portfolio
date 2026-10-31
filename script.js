document.addEventListener('DOMContentLoaded', () => {
    const dashboardView = document.getElementById('dashboard-view');
    const detailsView = document.getElementById('details-view');
    
    try {
        const sections = PORTFOLIO_CONTENT;

        const themeSelect = document.getElementById('theme-select');
        let currentTheme = localStorage.getItem('portfolio-theme') || 'dracula';
        
        const applyTheme = (theme) => {
            document.body.setAttribute('data-theme', theme);
            themeSelect.value = theme;
            localStorage.setItem('portfolio-theme', theme);
        };

        applyTheme(currentTheme);

        themeSelect.addEventListener('change', (e) => {
            currentTheme = e.target.value;
            applyTheme(currentTheme);
        });

        const updateSection = (id, sectionName, isMarkdown = true) => {
            const el = document.getElementById(id);
            if (el && sections[sectionName]) {
                if (isMarkdown && typeof marked !== 'undefined') {
                    const rawHtml = marked.parse(sections[sectionName]);
                    el.innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(rawHtml) : rawHtml;
                } else {
                    el.innerText = sections[sectionName];
                }
                return true;
            }
            return false;
        };

        if (sections['PROFILE_NAME']) {
            document.getElementById('name').innerText = `[ ${sections['PROFILE_NAME']} ]`;
            document.title = `${sections['PROFILE_NAME']} | Portfolio`;
        }
        if (sections['PROFILE_TITLE']) {
            document.getElementById('title').innerText = sections['PROFILE_TITLE'];
        }
        if (sections['PROFILE_PICTURE']) {
            const userName = sections['PROFILE_NAME'] || 'User';
            document.getElementById('profile-pic-container').innerHTML = 
                `<img src="${sections['PROFILE_PICTURE']}" class="profile-pic" alt="Profile photograph of ${userName}" onerror="this.style.display='none'">`;
        }
        if (sections['GITHUB_LINK']) document.getElementById('github-link').href = sections['GITHUB_LINK'];
        if (sections['LINKEDIN_LINK']) document.getElementById('linkedin-link').href = sections['LINKEDIN_LINK'];

        updateSection('bio-content', 'BIO');
        updateSection('experiences-content', 'EXPERIENCES');
        updateSection('research-content', 'RESEARCH_PHASE');

        // Skills Categorized
        if (sections['SKILLS_CATEGORIZED']) {
            const container = document.getElementById('skills-content');
            container.innerHTML = '';
            
            for (const [category, skills] of Object.entries(sections['SKILLS_CATEGORIZED'])) {
                const catTitle = document.createElement('div');
                catTitle.style.cssText = 'font-size: 0.8em; color: #888; margin-top: 10px; margin-bottom: 5px; text-transform: uppercase;';
                catTitle.innerText = `[ ${category} ]`;
                container.appendChild(catTitle);

                const skillGroup = document.createElement('div');
                skills.forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'skill-tag';
                    span.innerText = skill;
                    skillGroup.appendChild(span);
                });
                container.appendChild(skillGroup);
            }
        }

        if (sections['PET_PROJECTS']) {
            const list = document.getElementById('projects-list');
            list.innerHTML = '';
            sections['PET_PROJECTS'].forEach(project => {
                const li = document.createElement('li');
                li.className = 'project-item';
                li.style.marginBottom = '15px';
                li.style.padding = '5px';
                li.innerHTML = `
                    <a href="#" class="project-link" data-id="${project.id}" style="font-weight: bold;">[ ${project.title} ]</a>
                    <p style="font-size: 0.85em; margin: 5px 0 0 0; color: #888;">${project.short}</p>
                `;
                list.appendChild(li);
            });

            // Add event listeners to project links
            list.querySelectorAll('.project-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.showProject(link.dataset.id);
                });
            });
        }

        // Add event listener for back button
        const backBtn = document.getElementById('back-to-dashboard');
        if (backBtn) {
            backBtn.addEventListener('click', window.showDashboard);
        }

        // Deep linking support
        const hash = window.location.hash;
        if (hash.startsWith('#project/')) {
            const projectId = hash.replace('#project/', '');
            window.showProject(projectId, false);
        } else {
            history.replaceState({ view: 'dashboard' }, "", window.location.pathname);
        }

        initVimNavigation();

    } catch (err) {
        console.error('FATAL ERROR:', err.message);
    }
});

window.showProject = function(id, pushState = true) {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('details-view').style.display = 'block';
    const project = PORTFOLIO_CONTENT.PET_PROJECTS.find(p => p.id === id);
    if (project) {
        document.getElementById('detail-title').innerText = `PROJECT: ${project.title}`;
        if (typeof marked !== 'undefined') {
            const rawHtml = marked.parse(project.description);
            document.getElementById('detail-content').innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(rawHtml) : rawHtml;
        } else {
            document.getElementById('detail-content').innerText = project.description;
        }
        document.getElementById('detail-repo-link').href = project.repo;
        
        if (pushState) {
            history.pushState({ view: 'project', projectId: id }, "", `#project/${id}`);
        }
    }
    window.scrollTo(0, 0);
}

window.showDashboard = function(pushState = true) {
    document.getElementById('dashboard-view').style.display = 'grid';
    document.getElementById('details-view').style.display = 'none';
    
    if (pushState) {
        history.pushState({ view: 'dashboard' }, "", " ");
    }
}

// Handle Browser Back/Forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view === 'project') {
        window.showProject(event.state.projectId, false);
    } else {
        window.showDashboard(false);
    }
});

function initVimNavigation() {
    let currentPanel = 'main'; // 'main' or 'side'
    let mainIndex = 0;
    let sideIndex = 0;
    let projectSubIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('details-view').style.display === 'block') {
            if (e.key === 'h' || e.key === 'Escape') showDashboard();
            return;
        }

        const mainCards = Array.from(document.querySelectorAll('.main-col .card'));
        const sideCards = Array.from(document.querySelectorAll('.side-col .card'));
        const projectItems = Array.from(document.querySelectorAll('.project-item'));
        
        // Horizontal Movement
        if (e.key === 'l') {
            currentPanel = 'side';
        } else if (e.key === 'h') {
            currentPanel = 'main';
        } 
        // Vertical Movement
        else if (e.key === 'j') {
            if (currentPanel === 'main') {
                mainIndex = Math.min(mainIndex + 1, mainCards.length - 1);
            } else {
                if (sideIndex === 1) {
                    projectSubIndex = Math.min(projectSubIndex + 1, projectItems.length - 1);
                } else {
                    sideIndex = Math.min(sideIndex + 1, sideCards.length - 1);
                }
            }
        } else if (e.key === 'k') {
            if (currentPanel === 'main') {
                mainIndex = Math.max(mainIndex - 1, 0);
            } else {
                if (sideIndex === 1 && projectSubIndex > 0) {
                    projectSubIndex--;
                } else {
                    sideIndex = Math.max(sideIndex - 1, 0);
                    if (sideIndex === 0) projectSubIndex = 0;
                }
            }
        }
        else if (e.key === 'Enter') {
            if (currentPanel === 'side' && sideIndex === 1) {
                const targetProject = projectItems[projectSubIndex];
                if (targetProject) {
                    const link = targetProject.querySelector('.project-link');
                    if (link) link.click();
                }
            } else {
                const activeCard = currentPanel === 'main' ? mainCards[mainIndex] : sideCards[sideIndex];
                const link = activeCard.querySelector('a');
                if (link) link.click();
            }
            return;
        } else {
            return;
        }

        [...mainCards, ...sideCards].forEach(c => c.classList.remove('focused'));
        const targetCard = currentPanel === 'main' ? mainCards[mainIndex] : sideCards[sideIndex];
        if (targetCard) {
            targetCard.classList.add('focused');
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Apply sub-focus to projects
        projectItems.forEach((item, idx) => {
            if (currentPanel === 'side' && sideIndex === 1 && idx === projectSubIndex) {
                item.classList.add('sub-focused');
            } else {
                item.classList.remove('sub-focused');
            }
        });
    });
}
