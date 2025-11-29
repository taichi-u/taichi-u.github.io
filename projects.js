// Project data
const projects = [
    {
        id: 1,
        title: "Outer Planetary Mission Design - JAXA ISAS",
        description: "Designing and optimizing trajectories for future outer planetary exploration missions. Applying astrodynamics principles to analyze interplanetary transfer orbits and gravity assists.",
        image: "photo/jaxa_mission.jpg",
        categories: ["space", "research"],
        tags: ["Astrodynamics", "Mission Design", "JAXA"],
        links: [
            { name: "Details", url: "#research" }
        ]
    },
    {
        id: 2,
        title: "Lunar Robot RL Control - Kyoto University",
        description: "Designing reward functions and curriculum learning strategies for reinforcement learning of a hybrid three-wheeled-legged lunar robot with 8-DOF arm and 8-DOF legs.",
        image: "photo/lunar_robot.jpg",
        categories: ["robotics", "research"],
        tags: ["Reinforcement Learning", "Isaac Lab", "Space Robotics"],
        links: [
            { name: "Details", url: "#research" }
        ]
    },
    {
        id: 3,
        title: "7-DOF Robot Arm Control - DFKI Bremen",
        description: "Developed control algorithms for 7-DOF robotic arms for space debris capture. Implemented impedance and position controllers using Drake physics simulation.",
        image: "photo/robot_arm.jpg",
        categories: ["robotics", "space", "research"],
        tags: ["Drake", "Control Systems", "Space Robotics"],
        links: [
            { name: "Details", url: "#research" }
        ]
    },
    {
        id: 4,
        title: "Metagenomic Analysis - Georgia Tech",
        description: "Computational analysis of microbial communities for heavy metal contaminant stabilization using Python, R, and Linux-based bioinformatics pipelines.",
        image: "photo/metagenomic.jpg",
        categories: ["research"],
        tags: ["Bioinformatics", "Python", "Metagenomics"],
        links: [
            { name: "Details", url: "#research" }
        ]
    },
    {
        id: 5,
        title: "Extreme Halophiles Research - Tokyo Tech",
        description: "Three-year research project identifying halophilic archaea from worldwide rock salt samples using PCR, sequencing, and phylogenetic analysis.",
        image: "photo/halophiles.jpg",
        categories: ["research"],
        tags: ["Astrobiology", "Molecular Biology", "ELSI"],
        links: [
            { name: "Details", url: "#research" }
        ]
    },
    {
        id: 6,
        title: "Artificial Gravity Mechanism",
        description: "Developed and evaluated a novel artificial gravity generation method with Arduino-based force sensors for real-time data acquisition.",
        image: "photo/artificial_gravity.jpg",
        categories: ["space"],
        tags: ["Arduino", "Space Technology", "Prototyping"],
        links: [
            { name: "Details", url: "#research" }
        ]
    },
    {
        id: 7,
        title: "Intelligent Water Rocket System",
        description: "Award-winning rocket design with structural controls, computer-controlled functions, and automated parachute deployment systems.",
        image: "photo/water_rocket.jpg",
        categories: ["space"],
        tags: ["Rocketry", "Control Systems", "Competition"],
        links: [
            { name: "Details", url: "#achievements" }
        ]
    },
    {
        id: 8,
        title: "NLP for Russian Language Learning",
        description: "Developing AI-based Grammatical Error Correction systems for Russian language learning using NLP libraries at Tleez Inc.",
        image: "photo/nlp_project.jpg",
        categories: ["research"],
        tags: ["NLP", "Python", "Machine Learning"],
        links: [
            { name: "Details", url: "#education" }
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