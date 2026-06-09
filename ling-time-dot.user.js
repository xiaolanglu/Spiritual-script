// ==UserScript==
// @name         灵界时辰天道罗盘
// @namespace    http://tampermonkey.net/
// @version      22.2.0
// @description  内部美化天花板！注入常驻巡航仙气流光、字体内嵌灵力呼吸、双层水墨氤氲色变，保留双击障眼法。
// @author       修仙道友
// @match        https://ling.muge.info/game.html
// @match        http://ling.muge.info/game.html
// @icon         https://ling.muge.info/favicon.svg
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 引入云端古法篆书字体
    const FONT_LINK = document.createElement('link');
    FONT_LINK.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght=700;900&display=swap'; 
    document.head.appendChild(FONT_LINK);

    const AMBIENT_FONT = `
        @font-face {
            font-family: 'ShuowenZuan';
            src: url('https://cdn.jsdelivr.net/gh/scandrial/scandrial.github.io/fonts/Shuowen.ttf') format('truetype'),
                 local('FZShuTi'), local('LiSu'), local('KaiTi');
            font-display: swap;
        }
    `;
    const fontStyleNode = document.createElement('style');
    fontStyleNode.textContent = AMBIENT_FONT;
    document.head.appendChild(fontStyleNode);

    // ================= 1. 终极视觉工艺 CSS 大阵 =================
    const STYLES = `
        :root {
            --glass-umbra-y: 5px;
            --glass-umbra-blur: 15px;
            --glass-penumbra-y: 12px;
            --glass-penumbra-blur: 30px;
            --glass-shadow-opacity: 0.15;
            
            /* 材质基础因子 */
            --glass-border-color: rgba(255, 255, 255, 0.45);
            --glass-text-color: #2c353e;
            --glass-text-shadow: 0 1px 1px rgba(255,255,255,0.8);
            --glass-rim-glow: rgba(255, 255, 255, 0.7);
            
            /* 动态极光底色 */
            --glass-aurora-bg: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45) 0%, transparent 65%);
        }

        /* 椭圆法宝主体 - 强化3D立体浮雕质感 */
        .ling-pet-compass {
            position: fixed;
            top: 85px; right: 20px; z-index: 10000;
            width: 64px; height: 34px; border-radius: 17px; 
            cursor: move; user-select: none; box-sizing: border-box;
            contain: layout style;
            will-change: transform, box-shadow, left, top, opacity;
            
            /* 高阶毛玻璃物理参数 */
            backdrop-filter: blur(16px) saturate(160%) contrast(96%);
            -webkit-backdrop-filter: blur(16px) saturate(160%) contrast(96%);
            
            background: var(--glass-aurora-bg);
            
            /* 增加立体浮雕感的四层复合阴影：顶部高光边、底部托底暗影、以及外部双层扩散阴影 */
            box-shadow: 
                0px var(--glass-umbra-y) var(--glass-umbra-blur) rgba(0, 0, 0, calc(var(--glass-shadow-opacity) * 1.3)),
                0px var(--glass-penumbra-y) var(--glass-penumbra-blur) rgba(0, 0, 0, var(--glass-shadow-opacity)),
                inset 0px 1.5px 2px rgba(255, 255, 255, 0.6),   
                inset 0px -2px 3px rgba(0, 0, 0, 0.08);         

            border: 0.5px solid var(--glass-border-color); 
            opacity: 1 !important; 
            transform: scale(1);
            
            /* 丝滑墨化色变曲线 */
            transition: border-color 0.6s cubic-bezier(0.25, 1, 0.5, 1),
                        box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1),
                        background 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                        opacity 0.4s ease,
                        transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* 障眼法匿迹状态 */
        .ling-pet-compass.ling-anqi-hidden { opacity: 0.04 !important; }
        .ling-pet-compass.ling-anqi-hidden:hover { opacity: 0.75 !important; }

        /* 物理边缘极光内衬 */
        .ling-pet-compass::before {
            content: ''; position: absolute; top: 0.5px; left: 0.5px; right: 0.5px; bottom: 0.5px;
            border-radius: 16.5px; pointer-events: none; z-index: 1;
            box-shadow: inset 0px 1px 1.5px var(--glass-rim-glow);
            opacity: 0.9;
        }

        /* ✨ 美化进化：常驻无人巡航流光带（玉面游龙） */
        .ling-pet-compass::after {
            content: ''; position: absolute; top: 0; left: -150%; right: 0; bottom: 0;
            width: 300%; height: 100%; border-radius: 17px; pointer-events: none; z-index: 3;
            /* 倾斜的极晶反光带 */
            background: linear-gradient(
                90deg, 
                transparent 30%, 
                rgba(255, 255, 255, 0.0) 40%, 
                rgba(255, 255, 255, 0.45) 50%, 
                rgba(255, 255, 255, 0.0) 60%, 
                transparent 70%
            );
            transform: skewX(-25deg);
            mix-blend-mode: overlay;
            animation: lingSweepingLight 7s ease-in-out infinite;
        }

        @keyframes lingSweepingLight {
            0% { left: -150%; opacity: 0; }
            10% { opacity: 1; }
            40% { left: 50%; opacity: 0; }
            100% { left: 50%; opacity: 0; }
        }

        /* 内部微晶噪点层 */
        .ling-pet-compass__aurora-core {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 17px; z-index: 2; pointer-events: none;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.015'/%3E%3C/svg%3E");
            opacity: 0.8;
            animation: glassAuroraBreathe 16s ease-in-out infinite alternate;
        }

        /* ✨ 美化进化：真言文字内嵌灵力呼吸 */
        .ling-pet-compass__text {
            position: relative; z-index: 10; 
            font-family: "ShuowenZuan", "LiSu", "KaiTi", serif; 
            font-size: 15.5px; font-weight: 900; 
            letter-spacing: 1.5px; text-align: center; 
            width: 100%; height: 100%; 
            display: flex; align-items: center; justify-content: center; 
            padding-left: 1.5px; box-sizing: border-box;
            
            color: var(--glass-text-color);
            text-shadow: var(--glass-text-shadow);
            
            /* 文字自体微微呼吸，犹如阵法运转 */
            animation: lingTextGlowBreathe 4s ease-in-out infinite alternate;
            transition: color 0.5s ease, text-shadow 0.5s ease, transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
        }

        @keyframes lingTextGlowBreathe {
            0% { filter: drop-shadow(0 0 0px transparent); opacity: 0.93; }
            100% { filter: drop-shadow(0 0 1px var(--glass-border-color)); opacity: 1; }
        }

        /* ==================== DATA-STATE 四象氤氲墨变 ==================== */
        /* 白昼：羊脂白玉 */
        .ling-pet-compass[data-state="day"] { 
            --glass-border-color: rgba(255, 255, 255, 0.65);
            --glass-text-color: #1e252b;
            --glass-rim-glow: rgba(255, 255, 255, 0.9);
            --glass-text-shadow: 0px 1px 1px rgba(255,255,255,0.95);
            --glass-aurora-bg: radial-gradient(circle at 15% 20%, rgba(224, 242, 254, 0.7) 0%, rgba(255, 255, 255, 0.4) 60%, rgba(250, 249, 246, 0.15) 100%);
        }

        /* 玄夜：幽冥寒晶 */
        .ling-pet-compass[data-state="night"] { 
            --glass-border-color: rgba(56, 189, 248, 0.4);
            --glass-text-color: #f8fafc;
            --glass-rim-glow: rgba(56, 189, 248, 0.5);
            --glass-text-shadow: 0px 1px 3px rgba(0,0,0,0.9), 0px 0px 6px rgba(56,189,248,0.6);
            --glass-aurora-bg: radial-gradient(circle at 20% 15%, rgba(14, 165, 233, 0.45) 0%, rgba(15, 23, 42, 0.82) 55%, rgba(6, 9, 14, 0.7) 100%);
        }

        /* 暮色：熔金烈火 */
        .ling-pet-compass[data-state="sunset"] { 
            --glass-border-color: rgba(251, 146, 60, 0.55);
            --glass-text-color: #fff1f2;
            --glass-rim-glow: rgba(2fd, 186, 116, 0.5);
            --glass-text-shadow: 0px 1.5px 3px rgba(45, 10, 10, 0.95), 0px 0px 6px rgba(249, 115, 22, 0.6);
            --glass-aurora-bg: radial-gradient(circle at 25% 20%, rgba(249, 115, 22, 0.55) 0%, rgba(185, 28, 28, 0.32) 60%, rgba(30, 8, 8, 0.55) 100%);
        }

        /* 破晓：太荒青气 */
        .ling-pet-compass[data-state="sky"] { 
            --glass-border-color: rgba(34, 211, 238, 0.55);
            --glass-text-color: #f0fdfa;
            --glass-rim-glow: rgba(165, 243, 252, 0.5);
            --glass-text-shadow: 0px 1.5px 3px rgba(10, 25, 47, 0.95), 0px 0px 6px rgba(6, 182, 212, 0.6);
            --glass-aurora-bg: radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.55) 0%, rgba(30, 64, 175, 0.32) 60%, rgba(8, 12, 26, 0.55) 100%);
        }

        /* 触碰交互反馈 */
        .ling-pet-compass:hover { 
            transform: scale(1.08) cubic-bezier(0.34, 1.56, 0.64, 1) !important; 
            --glass-umbra-y: 8px !important; --glass-umbra-blur: 22px !important;
            --glass-penumbra-y: 22px !important; --glass-penumbra-blur: 45px !important;
            --glass-shadow-opacity: 0.20 !important;
        }

        .ling-pet-compass:active { 
            transform: scale(0.94) !important; 
            --glass-umbra-y: 2px !important; --glass-umbra-blur: 6px !important;
            --glass-penumbra-y: 5px !important; --glass-penumbra-blur: 12px !important;
        }

        /* 时辰跃迁：“融雪”涟漪冲击波 */
        .ling-pulse-trigger { animation: glassShockwave 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important; }
        @keyframes glassShockwave {
            0% { box-shadow: 0 0 0 0px var(--glass-border-color), 0px var(--glass-penumbra-y) var(--glass-penumbra-blur) rgba(0, 0, 0, var(--glass-shadow-opacity)); backdrop-filter: blur(8px); }
            30% { backdrop-filter: blur(20px) saturate(190%); }
            100% { box-shadow: 0 0 0 18px rgba(255,255,255,0), 0px var(--glass-penumbra-y) var(--glass-penumbra-blur) rgba(0, 0, 0, var(--glass-shadow-opacity)); backdrop-filter: blur(16px); }
        }

        @keyframes glassAuroraBreathe {
            0% { transform: scale(1) rotate(0deg); }
            100% { transform: scale(1.1) rotate(3deg); }
        }
    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = STYLES;
    document.head.appendChild(styleNode);

    // ================= 2. 铸造 DOM 架构 =================
    const dot = document.createElement('div');
    dot.className = 'ling-pet-compass';
    dot.setAttribute('data-state', 'day'); 

    const auroraCore = document.createElement('div');
    auroraCore.className = 'ling-pet-compass__aurora-core';
    dot.appendChild(auroraCore);

    const textLayer = document.createElement('div');
    textLayer.className = 'ling-pet-compass__text';
    textLayer.textContent = '---';
    dot.appendChild(textLayer);

    document.body.appendChild(dot);

    // ================= 3. 时辰天道驱动 =================
    let lastState = ""; 

    function triggerShockwave() {
        dot.classList.add('ling-pulse-trigger');
        setTimeout(() => { dot.classList.remove('ling-pulse-trigger'); }, 600); 
    }

    function updateDotStyle() {
        const headerNode = document.getElementById('headerGameTime');
        if (!headerNode || !headerNode.textContent) return;

        const rawText = headerNode.textContent.trim();
        const hourMatch = rawText.match(/([子丑寅卯辰巳午未申酉戌亥])时/);
        if (!hourMatch) return;
        
        const hour = hourMatch[1];
        if (textLayer.textContent !== hour) textLayer.textContent = hour; 

        let currentState = "";
        switch (hour) {
            case '寅': currentState = "sky"; break;
            case '酉': currentState = "sunset"; break;
            case '卯': case '辰': case '巳': case '午': case '未': case '申':
                currentState = "day"; break;
            case '戌': case '亥': case '子': case '丑':
                currentState = "night"; break;
        }

        if (lastState !== currentState) {
            dot.setAttribute('data-state', currentState);
            if (lastState !== "") triggerShockwave();
            lastState = currentState;
        }
    }

    const observer = new MutationObserver(() => {
        if (window.dotTimer) clearTimeout(window.dotTimer);
        window.dotTimer = setTimeout(updateDotStyle, 100);
    });
    const targetNode = document.getElementById('headerGameTime');
    if (targetNode) observer.observe(targetNode, { childList: true, characterData: true, subtree: true });

    // ================= 4. 双击障眼法与物理拖拽 =================
    let isDragging = false;
    let offsetX, offsetY;

    // 双击障眼法隐藏
    dot.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        dot.classList.toggle('ling-anqi-hidden');
    });

    function snapToEdges(currentLeft, currentTop) {
        const dotWidth = dot.offsetWidth;
        const dotHeight = dot.offsetHeight;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        let finalLeft = Math.max(0, Math.min(winWidth - dotWidth, currentLeft));
        let finalTop = Math.max(0, Math.min(winHeight - dotHeight, currentTop));
        const snapThreshold = 120; 

        if (finalLeft < snapThreshold) finalLeft = 0;
        else if (winWidth - (finalLeft + dotWidth) < snapThreshold) finalLeft = winWidth - dotWidth;

        if (finalTop < snapThreshold) finalTop = 0;
        else if (winHeight - (finalTop + dotHeight) < snapThreshold) finalTop = winHeight - dotHeight;

        dot.style.transition = 'box-shadow 0.25s ease, transform 0.3s ease, opacity 0.4s ease, left 0.45s cubic-bezier(0.25, 1, 0.5, 1), top 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
        dot.style.left = finalLeft + 'px';
        dot.style.top = finalTop + 'px';

        localStorage.setItem('ling_time_dot_position', JSON.stringify({ left: finalLeft, top: finalTop }));
    }

    const startDrag = (clientX, clientY) => {
        isDragging = true;
        offsetX = clientX - dot.getBoundingClientRect().left;
        offsetY = clientY - dot.getBoundingClientRect().top;
        dot.style.transition = 'none'; 
    };

    const moveDrag = (clientX, clientY) => {
        if (!isDragging) return;
        dot.style.left = (clientX - offsetX) + 'px';
        dot.style.top = (clientY - offsetY) + 'px';
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        snapToEdges(parseFloat(dot.style.left), parseFloat(dot.style.top));
    };

    dot.addEventListener('mousedown', (e) => { if(e.button === 0) startDrag(e.clientX, e.clientY); });
    document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    dot.addEventListener('touchstart', (e) => { if(e.touches.length > 0) startDrag(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    dot.addEventListener('touchmove', (e) => { if(e.touches.length > 0) moveDrag(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    dot.addEventListener('touchend', endDrag);

    const savedPos = localStorage.getItem('ling_time_dot_position');
    if (savedPos) {
        try {
            const pos = JSON.parse(savedPos);
            dot.style.left = pos.left + 'px'; dot.style.top = pos.top + 'px'; dot.style.right = 'auto';
        } catch (e) {}
    }

    setTimeout(updateDotStyle, 500);
})();