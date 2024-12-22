(function() {
    try {
        let initialized = false;

        function initImageZoom() {
            if (initialized) return;
            initialized = true;

            try {
                // 获取所有图片
                const images = document.querySelectorAll('img');
                
                if (images.length === 0) {
                    return;
                }
                
                images.forEach(img => {
                    try {
                        // 检查是否应该禁用缩放
                        const shouldDisableZoom = 
                            // 检查类名
                            img.classList.contains('no-zoom') ||
                            // 检查父元素类名
                            (img.parentElement && img.parentElement.classList.contains('no-zoom')) ||
                            // 检查 alt 文本是否包含特定标记
                            img.alt.includes('{.no-zoom}') ||
                            // 检查 title 属性
                            img.title === 'no-zoom';

                        if (shouldDisableZoom) {
                            // 移除 {.no-zoom} 文本显示
                            if (img.alt.includes('{.no-zoom}')) {
                                img.alt = img.alt.replace('{.no-zoom}', '').trim();
                            }
                            return;
                        }

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
                            const escHandler = function(e) {
                                if (e.key === 'Escape') {
                                    closeOverlay();
                                    document.removeEventListener('keydown', escHandler);
                                }
                            };
                            document.addEventListener('keydown', escHandler);
                            
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

        // 在 DOMContentLoaded 时初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initImageZoom);
        } else {
            // 如果 DOM 已经加载完成，直接初始化
            initImageZoom();
        }
    } catch (error) {
        console.error('Fatal error in image-zoom script:', error);
    }
})();