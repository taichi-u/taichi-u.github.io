// Project data
const projects = [
    {
        id: 1,
        title: 'Metagenomics Analysis',
        description: 'Researching microbial communities in Savannah River Site sediments through advanced DNA sequencing and computational analysis.',
        image: 'https://via.placeholder.com/600x400?text=Metagenomics',
        categories: ['research'],
        tags: ['Genomics', 'Big Data', 'Environmental Science'],
        links: [
            { name: 'View Project', url: '#' },
            { name: 'GitHub', url: '#' }
        ]
    },
    {
        id: 2,
        title: 'Robotic Arm Control',
        description: 'Developing control systems for a 7-DOF robotic arm designed for spacecraft capture and maintenance operations in orbit.',
        image: 'https://via.placeholder.com/600x400?text=Robotics',
        categories: ['robotics'],
        tags: ['Robotics', 'Control Theory', 'Space Tech'],
        links: [
            { name: 'View Project', url: '#' }
        ]
    },
    {
        id: 3,
        title: 'Sustainable Tourism Project',
        description: 'Organized SDGs-focused initiatives to reduce food waste and support local tourism economies through digital innovation.',
        image: 'https://via.placeholder.com/600x400?text=Sustainability',
        categories: ['sustainability'],
        tags: ['SDGs', 'Tourism', 'Waste Reduction'],
        links: [
            { name: 'View Project', url: '#' },
            { name: 'Case Study', url: '#' }
        ]
    },
    {
        id: 4,
        title: 'Space Debris Monitoring System',
        description: 'Developing an AI-powered system to track and categorize space debris for satellite collision avoidance.',
        image: 'https://via.placeholder.com/600x400?text=Space+Debris',
        categories: ['research', 'robotics'],
        tags: ['AI', 'Space Tech', 'Orbital Mechanics'],
        links: [
            { name: 'View Project', url: '#' },
            { name: 'GitHub', url: '#' }
        ]
    }
];

// Function to render projects
function renderProjects(projectsToRender = projects) {
    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.innerHTML = '';
    
    projectsToRender.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-card fade-in';
        projectElement.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.links.map(link => `<a href="${link.url}" class="project-link" target="_blank">${link.name}</a>`).join('')}
                </div>
            </div>
        `;
        projectsContainer.appendChild(projectElement);
    });

    // Trigger animation for newly added elements
    setTimeout(() => {
        document.querySelectorAll('.project-card.fade-in').forEach(card => {
            card.classList.add('visible');
        });
    }, 100);
}

// Filter projects
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter projects
            if (filter === 'all') {
                renderProjects();
            } else {
                const filteredProjects = projects.filter(project => 
                    project.categories.includes(filter)
                );
                renderProjects(filteredProjects);
            }
        });
    });
}

// Initialize once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    setupProjectFilters();
});