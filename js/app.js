// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 主题切换功能
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
        });
    }
    
    // 筛选按钮和遮罩层功能
    const filterToggle = document.getElementById('filter-toggle');
    const filterOverlay = document.getElementById('filter-overlay');
    const filterCancel = document.getElementById('filter-cancel');
    const filterApply = document.getElementById('filter-apply');
    
    if (filterToggle && filterOverlay) {
        // 点击筛选按钮显示遮罩层
        filterToggle.addEventListener('click', function() {
            filterOverlay.classList.add('active');
        });
        
        // 点击取消按钮关闭遮罩层
        if (filterCancel) {
            filterCancel.addEventListener('click', function() {
                filterOverlay.classList.remove('active');
            });
        }
        
        // 点击确定按钮应用筛选并关闭遮罩层
        if (filterApply) {
            filterApply.addEventListener('click', function() {
                filterOverlay.classList.remove('active');
                // 筛选逻辑在各自页面的初始化函数中实现
            });
        }
        
        // 点击遮罩层背景关闭遮罩层
        filterOverlay.addEventListener('click', function(e) {
            if (e.target === filterOverlay) {
                filterOverlay.classList.remove('active');
            }
        });
    }

    // 获取URL参数
    // 通用函数：从URL获取参数
    function getUrlParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    }

    // 通用函数：加载JSON数据
    async function loadJsonData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error loading JSON data:', error);
            return null;
        }
    }

    // 初始化首页
    async function initHomePage() {
        if (!document.getElementById('main-content')) return;
    
        try {
            const data = await loadJsonData('./data/subjects.json');
            if (!data) return;
            
            // 初始化教育阶段筛选器
            const levelOptionsElement = document.getElementById('level-options');
            if (levelOptionsElement) {
                // 添加"全部"选项
                let filterHtml = `<button class="filter-btn active" data-level="all">全部</button>`;
                
                // 添加各个教育阶段选项
                for (const [level, levelData] of Object.entries(data)) {
                    filterHtml += `<button class="filter-btn" data-level="${level}">${levelData.title}</button>`;
                }
                
                levelOptionsElement.innerHTML = filterHtml;
                
                // 添加筛选事件监听
                const filterButtons = levelOptionsElement.querySelectorAll('.filter-btn');
                filterButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        // 移除所有按钮的active类
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        // 给当前点击的按钮添加active类
                        this.classList.add('active');
                        
                        const selectedLevel = this.getAttribute('data-level');
                        filterSubjectsByLevel(selectedLevel, data);
                    });
                });
            }
            
            // 初始显示所有教育阶段
            filterSubjectsByLevel('all', data);
        } catch (error) {
            console.error('Error initializing home page:', error);
        }
    }
    
    // 按教育阶段筛选学科
    function filterSubjectsByLevel(level, data) {
        const mainContent = document.getElementById('main-content');
        let html = '';
        
        if (level === 'all') {
            // 显示所有教育阶段
            for (const [levelKey, levelData] of Object.entries(data)) {
                html += `
                    <section class="education-level">
                        <h2>${levelData.title}</h2>
                        <div class="subject-grid">
                            ${levelData.subjects.map(subject => `
                                <a href="./textbooks.html?level=${levelKey}&subject=${subject.id}" class="subject-item">
                                    <div class="subject-icon ${subject.icon}"></div>
                                    <span>${subject.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    </section>
                `;
            }
        } else {
            // 只显示选中的教育阶段
            const levelData = data[level];
            if (levelData) {
                html += `
                    <section class="education-level">
                        <h2>${levelData.title}</h2>
                        <div class="subject-grid">
                            ${levelData.subjects.map(subject => `
                                <a href="./textbooks.html?level=${level}&subject=${subject.id}" class="subject-item">
                                    <div class="subject-icon ${subject.icon}"></div>
                                    <span>${subject.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    </section>
                `;
            }
        }
        
        mainContent.innerHTML = html;
    }

    // 初始化教材列表页面
    async function initTextbooksPage() {
        if (!document.querySelector('.textbook-list')) return;
    
        const params = getUrlParams();
        const { level, subject } = params;
    
        // 从拆分后的文件加载数据
        const data = await loadJsonData(`./data/textbooks/${level}/${subject}.json`);
        if (!data) return;
    
        const subjectData = data;
        const titleElement = document.querySelector('.textbook-list h2');
        const versionOptionsElement = document.getElementById('version-options');
        const textbooksContainer = document.getElementById('textbooks-container');
        const subjectNameElement = document.getElementById('subject-name');
        const levelNameElement = document.getElementById('level-name');
        const levelSeparatorElement = document.getElementById('level-separator');
    
        // 移除h2标题显示
        if (titleElement) titleElement.style.display = 'none';
        if (subjectNameElement) {
            const subjectsData = await loadJsonData('./data/subjects.json');
            const subjectInfo = subjectsData[level].subjects.find(s => s.id === subject);
            if (subjectInfo) subjectNameElement.textContent = subjectInfo.name;
        }
        
        // 处理level-name和分隔符的显示
        if (levelNameElement && level) {
            const levelDisplayNames = {
                'primary': '小学',
                'junior': '初中',
                'high': '高中',
                'vocational': '职业教育',
                'intellectual': '智力障碍',
                'blind': '盲校',
                'deaf': '聋校'
            };
            levelNameElement.textContent = levelDisplayNames[level] || level;
            levelNameElement.style.display = 'inline';
            if (levelSeparatorElement) levelSeparatorElement.style.display = 'inline';
        }
    
        // 按版本分组教材
        const booksByVersion = {};
        const allVersions = [];
        
        // 收集所有版本并按版本分组教材
        subjectData.books.forEach(book => {
            if (!booksByVersion[book.version]) {
                booksByVersion[book.version] = [];
                allVersions.push(book.version);
            }
            booksByVersion[book.version].push(book);
        });
        
        // 渲染版本筛选器
        if (versionOptionsElement) {
            // 添加"全部"选项
            let filterHtml = `<button class="filter-btn active" data-version="all">全部</button>`;
            
            // 添加各个版本选项
            allVersions.forEach(version => {
                filterHtml += `<button class="filter-btn" data-version="${version}">${version}</button>`;
            });
            
            versionOptionsElement.innerHTML = filterHtml;
            
            // 添加筛选事件监听
            const filterButtons = versionOptionsElement.querySelectorAll('.filter-btn');
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // 移除所有按钮的active类
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // 给当前点击的按钮添加active类
                    this.classList.add('active');
                    
                    const selectedVersion = this.getAttribute('data-version');
                    filterTextbooksByVersion(selectedVersion, booksByVersion, allVersions, textbooksContainer);
                });
            });
        }
        
        // 初始显示所有版本的教材
        if (textbooksContainer) {
            filterTextbooksByVersion('all', booksByVersion, allVersions, textbooksContainer);
        }
    }

    // 按版本筛选教材
    function filterTextbooksByVersion(version, booksByVersion, allVersions, container) {
        let html = '';
        
        if (version === 'all') {
            // 显示所有版本，按版本分组
            allVersions.forEach(ver => {
                html += `
                    <div class="version-group">
                        <h3>${ver}</h3>
                        <div class="ios-card">
                            <div class="textbook-grid">
                                ${booksByVersion[ver].map(book => `
                                    <a href="./viewer.html?book=${book.id}" class="textbook-item">
                                        <div class="textbook-cover">
                                            <img src="${book.cover}" alt="${book.name}">
                                        </div>
                                        <div class="textbook-info">
                                            <h4>${book.name}</h4>
                                            <p>${book.version}</p>
                                        </div>
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            // 只显示选中的版本
            html = `
                <div class="version-group">
                    <h3>${version}</h3>
                    <div class="ios-card">
                        <div class="textbook-grid">
                            ${booksByVersion[version].map(book => `
                                <a href="./viewer.html?book=${book.id}" class="textbook-item">
                                    <div class="textbook-cover">
                                        <img src="${book.cover}" alt="${book.name}">
                                    </div>
                                    <div class="textbook-info">
                                        <h3>${book.name}</h3>
                                        <p>${book.version}</p>
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

    // 初始化教材预览页面
    async function initViewerPage() {
        if (!document.querySelector('.viewer-container')) return;
    
        const params = getUrlParams();
        const { book } = params;
        
        if (!book) return;
        
        // 解析book ID获取学科信息
        const [subject, gradeInfo] = book.split('_');
        if (!subject) return;
        
        // 在各个教育阶段中查找对应的教材
        let bookData = null;
        let level = null;
        
        // 尝试在各个教育阶段中查找教材
        for (const lvl of ['primary', 'junior', 'high', 'vocational', 'intellectual', 'blind', 'deaf']) {
            try {
                // 从拆分后的文件加载数据
                const data = await loadJsonData(`./data/textbooks/${lvl}/${subject}.json`);
                if (data) {
                    const found = data.books.find(b => b.id === book);
                    if (found) {
                        bookData = found;
                        level = lvl;
                        break;
                    }
                }
            } catch (error) {
                // 如果文件不存在或加载失败，继续尝试下一个教育阶段
                continue;
            }
        }
        
        if (!bookData) return;
        
        // 更新面包屑导航
        const subjectLink = document.getElementById('subject-link');
        const bookName = document.getElementById('book-name');
        
        if (subjectLink) {
            const subjectsData = await loadJsonData('./data/subjects.json');
            const subjectInfo = subjectsData[level].subjects.find(s => s.id === subject);
            if (subjectInfo) {
                subjectLink.textContent = subjectInfo.name;
                subjectLink.href = `./textbooks.html?level=${level}&subject=${subject}`;
            }
        }
        
        if (bookName) {
            bookName.textContent = bookData.name;
        }
        
        // 根据资源类型创建不同的预览界面
        const pageContainer = document.getElementById('page-container');
        if (!pageContainer) return;
        
        if (!bookData.resource || bookData.resource === '') {
            pageContainer.innerHTML = '<div class="no-resource">暂无教材资源</div>';
            return;
        }
        
        // 根据资源类型创建不同的预览界面
        switch (bookData.resource_type.toLowerCase()) {
            case 'pdf':
                createPdfViewer(pageContainer, bookData.resource);
                break;
            case 'pptx':
            case 'ppt':
                createPptViewer(pageContainer, bookData.resource);
                break;
            case 'docx':
            case 'doc':
                createWordViewer(pageContainer, bookData.resource);
                break;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                createImageViewer(pageContainer, bookData.resource);
                break;
            default:
                pageContainer.innerHTML = `<div class="unsupported-format">暂不支持${bookData.resource_type}格式的预览</div>`;
        }
    }

    // 直接调用初始化函数，而不是添加另一个DOMContentLoaded事件监听器
    initHomePage();
    initTextbooksPage();
    initViewerPage();

    // 更新面包屑导航
    function updateBreadcrumb() {
        const params = getUrlParams();
        const subjectName = document.getElementById('subject-name');
        const subjectLink = document.getElementById('subject-link');
        const bookName = document.getElementById('book-name');

        if (params.subject && subjectName) {
            const subjectDisplayNames = {
                'chinese': '语文',
                'math': '数学',
                'english': '英语',
                'physics': '物理',
                'chemistry': '化学',
                'biology': '生物',
                'history': '历史',
                'geography': '地理',
                'politics': '政治',
                'moral': '德法',
                'science': '科学',
                'music': '音乐',
                'drawing': '美术',
                'art': '艺术',
                'gymnastics': '体育',
                'calligraphy': '书法',
                'rehabilitation': '康复',
                'communication': '沟通',
                'general ': '通用',
                'information': '信息',
                'walking': '行走',
                'japanese': '日语',
                'russian': '俄语',
                'humanities': '人地',
                'adapt': '适应'
            };
            subjectName.textContent = subjectDisplayNames[params.subject] || params.subject;
        }

        if (params.subject && subjectLink) {
            subjectLink.textContent = subjectName.textContent;
            subjectLink.href = `./textbooks.html?level=${params.level}&subject=${params.subject}`;
        }

        if (params.book && bookName) {
            const bookInfo = params.book.split('_');
            if (bookInfo.length >= 3) {
                const grade = bookInfo[1].replace('grade', '');
                const term = bookInfo[2];
                bookName.textContent = `${grade}年级${term === '1' ? '上' : '下'}册`;
            }
        }
    }

    // 教材预览页面功能
    function initViewer() {
        const prevPage = document.getElementById('prev-page');
        const nextPage = document.getElementById('next-page');
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        const pageContainer = document.getElementById('page-container');
        const currentPageSpan = document.getElementById('current-page');
        const totalPagesSpan = document.getElementById('total-pages');

        if (!pageContainer) return;

        let currentPage = 1;
        let totalPages = 100; // 这里应该从教材数据中获取实际页数
        let currentZoom = 1;

        // 更新页码显示
        function updatePageInfo() {
            if (currentPageSpan) currentPageSpan.textContent = currentPage;
            if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
        }

        // 加载页面内容
        function loadPage(pageNumber) {
            // 这里应该从后端API获取实际的页面内容
            pageContainer.innerHTML = `<div class="page-content">第 ${pageNumber} 页内容</div>`;
        }

        // 绑定翻页事件
        if (prevPage) {
            prevPage.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    loadPage(currentPage);
                    updatePageInfo();
                }
            });
        }

        if (nextPage) {
            nextPage.addEventListener('click', function() {
                if (currentPage < totalPages) {
                    currentPage++;
                    loadPage(currentPage);
                    updatePageInfo();
                }
            });
        }

        // 绑定缩放事件
        if (zoomIn) {
            zoomIn.addEventListener('click', function() {
                if (currentZoom < 2) {
                    currentZoom += 0.1;
                    pageContainer.style.transform = `scale(${currentZoom})`;
                }
            });
        }

        if (zoomOut) {
            zoomOut.addEventListener('click', function() {
                if (currentZoom > 0.5) {
                    currentZoom -= 0.1;
                    pageContainer.style.transform = `scale(${currentZoom})`;
                }
            });
        }

        // 初始化加载
        loadPage(currentPage);
        updatePageInfo();
    }

    // 根据当前页面执行相应的初始化
    updateBreadcrumb();
    if (window.location.pathname.includes('viewer.html')) {
        initViewer();
    }
});