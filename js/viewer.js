// 预览功能实现

// 创建PDF预览
function createPdfViewer(container, resourcePath) {
    // 使用iframe嵌入PDF文件，设置为响应式
    container.innerHTML = `
        <div class="pdf-viewer">
            <iframe src="${resourcePath}" style="width:100%; height:100%; border:none; overflow:hidden;" frameborder="0"></iframe>
        </div>
    `;

    // 更新控制按钮状态
    updateViewerControls('pdf');
}

// 创建PPT预览
function createPptViewer(container, resourcePath) {
    // 由于浏览器不能直接预览PPT，提供下载链接
    container.innerHTML = `
        <div class="ppt-viewer">
            <div class="preview-message">
                <p>PowerPoint文件无法在浏览器中直接预览</p>
                <a href="${resourcePath}" class="download-btn" download>
                    <img src="./images/viewer-icons/download.svg" alt="下载图标">
                    下载查看
                </a>
            </div>
            <div class="preview-image">
                <img src="./images/ppt-preview.png" alt="PPT预览图">
            </div>
        </div>
    `;

    // 更新控制按钮状态
    updateViewerControls('ppt');
}

// 创建Word文档预览
function createWordViewer(container, resourcePath) {
    // 由于浏览器不能直接预览Word，提供下载链接
    container.innerHTML = `
        <div class="word-viewer">
            <div class="preview-message">
                <p>Word文件无法在浏览器中直接预览</p>
                <a href="${resourcePath}" class="download-btn" download>
                    <img src="./images/viewer-icons/download.svg" alt="下载图标">
                    下载查看
                </a>
            </div>
            <div class="preview-image">
                <img src="./images/word-preview.png" alt="Word预览图">
            </div>
        </div>
    `;

    // 更新控制按钮状态
    updateViewerControls('word');
}

// 创建图片预览
function createImageViewer(container, resourcePath) {
    container.innerHTML = `
        <div class="image-viewer">
            <img src="${resourcePath}" alt="教材图片" class="preview-image">
        </div>
    `;

    // 更新控制按钮状态
    updateViewerControls('image');

    // 由于控制按钮已被移除，不再添加缩放事件监听
    // 图片将通过CSS的响应式设计自适应显示
}

// 更新预览控制按钮状态
function updateViewerControls(type) {
    // 控制按钮已被移除，此函数保留以兼容现有代码
    // 但不再执行任何操作
    
    // 根据不同类型的预览调整控制按钮的显示状态
    // 由于控制按钮已被移除，此部分代码不再需要执行
    // 保留函数结构以兼容现有代码调用
    switch (type) {
        case 'pdf':
            // PDF有翻页和缩放功能
            prevPage.style.display = 'block';
            nextPage.style.display = 'block';
            zoomIn.style.display = 'block';
            zoomOut.style.display = 'block';
            pageInfo.style.display = 'block';
            break;
        case 'image':
            // 图片只有缩放功能，没有翻页
            prevPage.style.display = 'none';
            nextPage.style.display = 'none';
            zoomIn.style.display = 'block';
            zoomOut.style.display = 'block';
            pageInfo.style.display = 'none';
            break;
        case 'ppt':
        case 'word':
        default:
            // 其他格式没有预览控制功能
            prevPage.style.display = 'none';
            nextPage.style.display = 'none';
            zoomIn.style.display = 'none';
            zoomOut.style.display = 'none';
            pageInfo.style.display = 'none';
    }
}