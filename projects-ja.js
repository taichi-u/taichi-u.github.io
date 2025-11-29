// プロジェクトデータ（日本語版）
const projects = [
    {
        id: 1,
        title: "外惑星ミッション設計 - JAXA ISAS",
        description: "将来の外惑星探査ミッションのための軌道設計・最適化を担当。宇宙機軌道力学の原理を適用し、惑星間遷移軌道と重力アシストを解析。",
        image: "photo/jaxa_mission.jpg",
        categories: ["space", "research"],
        tags: ["軌道力学", "ミッション設計", "JAXA"],
        links: [{ name: "詳細", url: "#research" }]
    },
    {
        id: 2,
        title: "月面ロボットRL制御 - 京都大学",
        description: "8自由度アーム・8自由度脚を持つハイブリッド三輪脚月面ロボットのための強化学習の報酬関数とカリキュラム学習戦略の設計。",
        image: "photo/lunar_robot.jpg",
        categories: ["robotics", "research"],
        tags: ["強化学習", "Isaac Lab", "宇宙ロボティクス"],
        links: [{ name: "詳細", url: "#research" }]
    },
    {
        id: 3,
        title: "7自由度ロボットアーム制御 - DFKIブレーメン",
        description: "宇宙デブリ捕獲のための7自由度ロボットアームの制御アルゴリズムを開発。Drake物理シミュレーションを用いてインピーダンス・位置制御器を実装。",
        image: "photo/robot_arm.jpg",
        categories: ["robotics", "space", "research"],
        tags: ["Drake", "制御システム", "宇宙ロボティクス"],
        links: [{ name: "詳細", url: "#research" }]
    },
    {
        id: 4,
        title: "メタゲノム解析 - ジョージア工科大学",
        description: "Python、R、Linuxベースのバイオインフォマティクスパイプラインを用いた重金属汚染物質安定化のための微生物群集の計算解析。",
        image: "photo/metagenomic.jpg",
        categories: ["research"],
        tags: ["バイオインフォマティクス", "Python", "メタゲノミクス"],
        links: [{ name: "詳細", url: "#research" }]
    },
    {
        id: 5,
        title: "極限環境好塩菌研究 - 東京工業大学",
        description: "PCR、シーケンシング、系統解析を用いて、世界各地の岩塩サンプルから好塩古細菌を同定する3年間の研究プロジェクト。",
        image: "photo/halophiles.jpg",
        categories: ["research"],
        tags: ["宇宙生物学", "分子生物学", "ELSI"],
        links: [{ name: "詳細", url: "#research" }]
    },
    {
        id: 6,
        title: "人工重力機構",
        description: "リアルタイムデータ取得のためのArduino搭載力センサーを用いた新規人工重力発生方法の開発と評価。",
        image: "photo/artificial_gravity.jpg",
        categories: ["space"],
        tags: ["Arduino", "宇宙技術", "プロトタイピング"],
        links: [{ name: "詳細", url: "#research" }]
    },
    {
        id: 7,
        title: "知能化水ロケットシステム",
        description: "構造制御、コンピュータ制御機能、自動パラシュート展開システムを備えた受賞歴のあるロケット設計。",
        image: "photo/water_rocket.jpg",
        categories: ["space"],
        tags: ["ロケット工学", "制御システム", "競技会"],
        links: [{ name: "詳細", url: "#achievements" }]
    },
    {
        id: 8,
        title: "ロシア語学習向けNLP",
        description: "Tleez Inc.でPythonとNLPライブラリを用いたロシア語学習用AI文法エラー訂正システムの開発。",
        image: "photo/nlp_project.jpg",
        categories: ["research"],
        tags: ["NLP", "Python", "機械学習"],
        links: [{ name: "詳細", url: "#education" }]
    }
];

// プロジェクトを描画する関数
function renderProjects(projectsToRender = projects) {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '';
    
    projectsToRender.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-card fade-in';
        projectElement.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.src='photo/placeholder.jpg'">
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.links.map(link => `<a href="${link.url}" class="project-link">${link.name}</a>`).join('')}
                </div>
            </div>
        `;
        projectsContainer.appendChild(projectElement);
    });

    setTimeout(() => {
        document.querySelectorAll('#projects-container .fade-in').forEach(card => {
            card.classList.add('visible');
        });
    }, 100);
}

// DOMロード時に初期化
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
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
