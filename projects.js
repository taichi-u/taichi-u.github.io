// Project data
const projects = [
    {
        id: 1,
        title: "Metagenomic Analysis of Heavy Metal Contamination",
        description: "Research on heavy metal contaminant stabilization through metagenomic analysis at Georgia Tech, using computational approaches with R, Linux, and Python.",
        image: "photo/metagenomic.jpg",
        categories: ["research", "space"],
        tags: ["Genomics", "Bioinformatics", "Environmental Science"],
        links: [
            { name: "Details", url: "#" }
        ]
    },
    {
        id: 2,
        title: "Hydrogen Metabolism in Microorganisms",
        description: "Research on microorganisms with unique metabolic pathways for hydrogen and oxygen, with potential applications for sustainable energy and space life support systems.",
        image: "photo/hydrogen-metabolism.jpeg",
        categories: ["research"],
        tags: ["Microbiology", "Biochemistry", "Sustainability"],
        links: [
            { name: "Details", url: "#" }
        ]
    },
    {
        id: 3,
        title: "Extreme Halophiles in Rock Salt",
        description: "Three-year research project identifying halophilic archaea from worldwide rock salt samples, contributing to our understanding of extremophiles and astrobiology.",
        image: "photo/halophiles-research.jpg",
        categories: ["research", "space"],
        tags: ["Extremophiles", "Astrobiology", "Molecular Biology"],
        links: [
            { name: "Publication", url: "#" },
            { name: "Details", url: "#" }
        ]
    },
    {
        id: 4,
        title: "Artificial Gravity Method Development",
        description: "Developed and evaluated a new method for artificial gravity generation, using Arduino to sense forces and evaluate the prototype.",
        image: "photo/artificial-gravity-prototype.jpeg",
        categories: ["space"],
        tags: ["Space Technology", "Engineering", "Arduino"],
        links: [
            { name: "Details", url: "#" }
        ]
    },
    {
        id: 5,
        title: "Intelligent Water Rocket System",
        description: "Award-winning rocket design with structural controls, computer-controlled functions, and automated parachute deployment systems.",
        image: "photo/water-rocket-system.jpeg",
        categories: ["space"],
        tags: ["Rocketry", "Control Systems", "Engineering"],
        links: [
            { name: "Details", url: "#" },
            { name: "Gallery", url: "#" }
        ]
    },
    {
        id: 6,
        title: "Seiko SDGs Food Initiative",
        description: "Founded a volunteer program focused on sustainable food practices and reducing food waste in alignment with UN Sustainable Development Goals.",
        image: "photo/sdgs-food-initiative.jpg",
        categories: ["social"],
        tags: ["SDGs", "Sustainability", "Food Security"],
        links: [
            { name: "Details", url: "#" }
        ]
    },
    {
        id: 7,
        title: "Light-Up Safety Slippers",
        description: "Designed illuminated slippers for safety during nighttime emergencies and power outages, with functional prototype development.",
        image: "photo/safety-slippers-prototype.jpg",
        categories: ["social"],
        tags: ["Product Design", "Safety", "Innovation"],
        links: [
            { name: "Details", url: "#" }
        ]
    },
    {
        id: 8,
        title: "International Space Technology Discussion",
        description: "Organized an online forum connecting students from India and Japan to discuss next-generation space technologies and collaborative opportunities.",
        image: "photo/space-tech-forum.jpg",
        categories: ["space", "social"],
        tags: ["International Collaboration", "Space Education", "Innovation"],
        links: [
            { name: "Details", url: "#" }
        ]
    }
];

// Function to render projects
function renderProjects(projectsToRender = projects) {
    const projectsContainer = document.getElementById('projects-container');
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
        document.querySelectorAll('#projects-container .fade-in').forEach(card => {
            card.classList.add('visible');
        });
    }, 100);
}

// Initialize once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    
    // Setup filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Filter projects
            const filter = button.getAttribute('data-filter');
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
});