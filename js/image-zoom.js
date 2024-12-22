(function() {
    try {
        console.log('Image zoom script starting...');

        function initImageZoom() {
            try {
                console.log('Initializing image zoom...');
                
                // 获取所有图片（排除带有 no-zoom 类的图片）
                const images = document.querySelectorAll('img:not([class*="no-zoom"])');
                console.log('Found images:', images.length);
                
                if (images.length === 0) {
                    console.log('No images found on page');
                    return;
                }
                
                images.forEach(img => {
                    try {
                        // 添加点击样式
                        img.style.cursor = 'zoom-in';
                        
                        // 添加点击事件
                        img.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // 如果已经在预览状态，直接返回
                            if (document.querySelector('.image-zoom-overlay')) {
                                return;
                            }
                            
                            // 创建遮罩层
                            const overlay = document.createElement('div');
                            overlay.className = 'image-zoom-overlay';
                            overlay.style.cssText = `
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: rgba(0, 0, 0, 0.9);
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                z-index: 1000;
                                cursor: zoom-out;
                                opacity: 0;
                                transition: opacity 0.3s ease;
                            `;
                            
                            // 创建大图
                            const bigImg = document.createElement('img');
                            bigImg.src = this.src;
                            bigImg.style.cssText = `
                                max-width: 90%;
                                max-height: 90%;
                                object-fit: contain;
                                transform: scale(0.95);
                                transition: transform 0.3s ease;
                            `;
                            
                            // 添加关闭事件（点击任意位置关闭）
                            function closeOverlay() {
                                overlay.style.opacity = '0';
                                setTimeout(() => {
                                    document.body.removeChild(overlay);
                                }, 300);
                            }
                            
                            overlay.addEventListener('click', closeOverlay);
                            
                            // ESC 键关闭
                            document.addEventListener('keydown', function(e) {
                                if (e.key === 'Escape') {
                                    closeOverlay();
                                }
                            });
                            
                            overlay.appendChild(bigImg);
                            document.body.appendChild(overlay);
                            
                            // 触发重排以启用过渡动画
                            setTimeout(() => {
                                overlay.style.opacity = '1';
                                bigImg.style.transform = 'scale(1)';
                            }, 50);
                        });
                    } catch (imgError) {
                        console.error('Error processing image:', imgError);
                    }
                });
            } catch (initError) {
                console.error('Error in initImageZoom:', initError);
            }
        }

        // 在 DOMContentLoaded 和 load 事件中都尝试初始化
        document.addEventListener('DOMContentLoaded', initImageZoom);
        window.addEventListener('load', initImageZoom);
        
        // 立即尝试初始化一次
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initImageZoom();
        }
    } catch (error) {
        console.error('Fatal error in image-zoom script:', error);
    }
})();

// 添加一个全局标记
window.imageZoomLoaded = true;
console.log('Image zoom script loaded completely');