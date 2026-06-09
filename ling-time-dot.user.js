// ==UserScript==
// @name         灵界时辰天道罗盘
// @namespace    http://tampermonkey.net/
// @version      21.2.0
// @description  高阶进化的流光折射磨砂玻璃椭圆按钮。引入动态视角折射光斑、双层高阶环境阴影与天道融霜过渡。
// @author       修仙道友
// @match        https://ling.muge.info/game.html
// @match        http://ling.muge.info/game.html
// @icon         https://ling.muge.info/favicon.svg
// @updateURL    https://raw.githubusercontent.com/xiaolanglu/Spiritual-script/main/ling-pet-compass.user.js
// @downloadURL  https://raw.githubusercontent.com/xiaolanglu/Spiritual-script/main/ling-pet-compass.user.js
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

    // ================= 1. 终极磨砂折射 CSS 大阵 =================
    const STYLES = `
        :root {
            /* 双层高阶环境投影变量 */
            --glass-umbra-y: 4px;
            --glass-umbra-blur: 12px;
            --glass-penumbra-y: 12px;
            --glass-penumbra-blur: 28px;
            --glass-shadow-opacity: 0.16;
            
            /* 核心光学材质因子 */
            --glass-aurora-bg: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 60%);
            --glass-border-color: rgba(255, 255, 255, 0.45);
            --glass-text-color: #2c353e;
            --glass-text-shadow: 0 1px 1px rgba(255,255,255,0.8);
            --glass-rim-glow: rgba(255, 255, 255, 0.65);
            --glass-specular-move: translate(0, 0);
        }

        /* 1. 椭圆磨砂玻璃按钮核心框 */
        .ling-pet-compass {
            position: fixed;
            top: 85px; right: 20px; z-index: 10000;
            
            /* 黄金微型椭圆比例 */
            width: 64px; height: 34px; 
            border-radius: 17px; 
            
            cursor: move; user-select: none; box-sizing: border-box;
            
            /* 渲染防御与性能加速 */
            contain: layout style;
            will-change: transform, box-shadow, left, top;
            
            /* 14px 醇厚毛玻璃高斯模糊 */
            backdrop-filter: blur(14px) saturate(155%) contrast(98%);
            -webkit-backdrop-filter: blur(14px) saturate(155%) contrast(98%);
            
            background: var(--glass-aurora-bg);
            
            /* 分层投影：接触级阴影(Umbra) + 扩散级阴影(Penumbra) + 双重物理内嵌光 */
            box-shadow: 
                0px var(--glass-umbra-y) var(--glass-umbra-blur) rgba(0, 0, 0, calc(var(--glass-shadow-opacity) * 1.2)),
                0px var(--glass-penumbra-y) var(--glass-penumbra-blur) rgba(0, 0, 0, var(--glass-shadow-opacity)),
                inset 0px 1px 2px rgba(255, 255, 255, 0.5),   
                inset 0px -1px 2.5px rgba(0, 0, 0, 0.06);         

            /* 极致纤细的白玉反光边缘线 */
            border: 0.5px solid var(--glass-border-color); 
            
            opacity: 1 !important; 
            transform: scale(1);
            
            /* 高级阻尼弹性过渡曲线 */
            transition: border-color 0.4s ease,
                        box-shadow 0.45s cubic-bezier(0.25, 1, 0.5, 1),
                        backdrop-filter 0.5s ease,
                        transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* 2. 物理边缘对流光 (Rim Light) */
        .ling-pet-compass::before {
            content: ''; position: absolute; top: 0.5px; left: 0.5px; right: 0.5px; bottom: 0.5px;
            border-radius: 16.5px; pointer-events: none; z-index: 1;
            box-shadow: inset 0px 1px 1px var(--glass-rim-glow);
            opacity: 0.85;
            transition: box-shadow 0.4s ease, opacity 0.4s ease;
        }

        /* 3. 动态视角折射光斑层 (Specular Shifting) */
        .ling-pet-compass::after {
            content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 17px; pointer-events: none; z-index: 3;
            background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.35) 0%, transparent 40%);
            mix-blend-mode: overlay;
            transform: var(--glass-specular-move);
            transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* 4. 内部微晶噪点与天道极光层 */
        .ling-pet-compass__aurora-core {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 17px; z-index: 2; pointer-events: none;
            
            /* 极淡的物理噪点感，赋予模糊物理实体厚度 */
            background-image: var(--glass-aurora-bg), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.012'/%3E%3C/svg%3E");
            
            mix-blend-mode: normal;
            opacity: 0.95;
            animation: glassAuroraBreathe 12s ease-in-out infinite alternate;
            transition: background 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 5. __text 真言层（视差与深层微雕） */
        .ling-pet-compass__text {
            position: relative; z-index: 10; 
            font-family: "ShuowenZuan", "LiSu", "KaiTi", serif; 
            font-size: 15px; font-weight: 700; 
            letter-spacing: 1.5px;
            text-align: center; 
            width: 100%; height: 100%; 
            display: flex; align-items: center; justify-content: center; 
            padding-left: 1.5px; box-sizing: border-box;
            
            color: var(--glass-text-color);
            text-shadow: var(--glass-text-shadow);
            
            transition: color 0.3.5s ease, text-shadow 0.35s ease, transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* ==================== DATA-STATE 状态机 · 四象磨砂极光 ==================== */
        
        /* [白昼：昆仑耀白] */
        .ling-pet-compass[data-state="day"] { 
            --glass-border-color: rgba(255, 255, 255, 0.6);
            --glass-text-color: #1a2126;
            --glass-rim-glow: rgba(255, 255, 255, 0.85);
            --glass-text-shadow: 0px 1px 1px rgba(255,255,255,0.95), 0px -0.5px 0px rgba(0,0,0,0.03);
            --glass-aurora-bg: radial-gradient(circle at 15% 20%, rgba(219, 234, 254, 0.65) 0%, rgba(255, 255, 255, 0.3) 55%, rgba(245, 244, 240, 0.1) 100%);
        }

        /* [夜间：幽玄冥海] */
        .ling-pet-compass[data-state="night"] { 
            --glass-border-color: rgba(56, 189, 248, 0.35);
            --glass-text-color: #f8fafc;
            --glass-rim-glow: rgba(56, 189, 248, 0.4);
            --glass-text-shadow: 0px 1px 3px rgba(0,0,0,0.95), 0px 0px 5px rgba(56,189,248,0.45);
            --glass-aurora-bg: radial-gradient(circle at 20% 15%, rgba(14, 165, 233, 0.4) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(8, 10, 15, 0.65) 100%);
        }

        /* [黄昏：烈火熔金] */
        .ling-pet-compass[data-state="sunset"] { 
            --glass-border-color: rgba(251, 146, 60, 0.5);
            --glass-text-color: #fff1f2;
            --glass-rim-glow: rgba(253, 186, 116, 0.45);
            --glass-text-shadow: 0px 1.5px 2.5px rgba(45, 10, 10, 0.9), 0px 0px 4.5px rgba(249, 115, 22, 0.5);
            --glass-aurora-bg: radial-gradient(circle at 25% 20%, rgba(249, 115, 22, 0.52) 0%, rgba(185, 28, 28, 0.28) 60%, rgba(40, 10, 10, 0.45) 100%);
        }

        /* [破晓：九天青冥] */
        .ling-pet-compass[data-state="sky"] { 
            --glass-border-color: rgba(34, 211, 238, 0.5);
            --glass-text-color: #f0fdfa;
            --glass-rim-glow: rgba(165, 243, 252, 0.45);
            --glass-text-shadow: 0px 1.5px 2.5px rgba(10, 25, 47, 0.9), 0px 0px 4.5px rgba(6, 182, 212, 0.5);
            --glass-aurora-bg: radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.52) 0%, rgba(30, 64, 175, 0.28) 60%, rgba(10, 15, 30, 0.45) 100%);
        }

        /* ==================== ⚡ 智能拟物交互响应 ==================== */
        
        /* 悬停（Hover）：阻尼弹起、阴影双层扩散、折射高光微调 */
        .ling-pet-compass:hover { 
            transform: scale(1.1) cubic-bezier(0.34, 1.56, 0.64, 1) !important; 
            --glass-umbra-y: 8px !important;
            --glass-umbra-blur: 20px !important;
            --glass-penumbra-y: 20px !important;
            --glass-penumbra-blur: 40px !important;
            --glass-shadow-opacity: 0.22 !important;
            --glass-rim-glow: rgba(255, 255, 255, 0.95);
            /* 折射光斑随视角反向微移，产生凸透镜视差 */
            --glass-specular-move: translate(-2px, -1px) scale(1.05);
        }
        
        .ling-pet-compass:hover .ling-pet-compass__text { 
            transform: scale(1.06);
        }

        /* 四象悬停边框色彩共振 */
        .ling-pet-compass[data-state="day"]:hover    { border-color: rgba(59, 130, 246, 0.85); }
        .ling-pet-compass[data-state="night"]:hover  { border-color: rgba(56, 189, 248, 0.85); } 
        .ling-pet-compass[data-state="sunset"]:hover { border-color: rgba(249, 115, 22, 0.85); }
        .ling-pet-compass[data-state="sky"]:hover    { border-color: rgba(34, 211, 238, 0.85); }

        /* 点击/拖拽（Active）：向内机械沉降 */
        .ling-pet-compass:active { 
            transform: scale(0.93) !important; 
            --glass-umbra-y: 2px !important;
            --glass-umbra-blur: 5px !important;
            --glass-penumbra-y: 4px !important;
            --glass-penumbra-blur: 10px !important;
            --glass-shadow-opacity: 0.28 !important;
            --glass-specular-move: translate(1px, 1px) scale(0.95);
        }
        .ling-pet-compass:active .ling-pet-compass__text { 
            transform: translateY(0.5px) scale(0.92) !important; 
        }

        /* 时辰切换瞬间：“融霜”光晕冲击波 */
        .ling-pulse-trigger { animation: glassShockwave 0.55s cubic-bezier(0.16, 1, 0.3, 1) !important; }
        @keyframes glassShockwave {
            0% { 
                box-shadow: 0 0 0 0px var(--glass-border-color), 0px var(--glass-penumbra-y) var(--glass-penumbra-blur) rgba(0, 0, 0, var(--glass-shadow-opacity));
                backdrop-filter: blur(8px) saturate(120%);
            }
            40% {
                backdrop-filter: blur(18px) saturate(180%);
            }
            100% { 
                box-shadow: 0 0 0 16px rgba(255,255,255,0), 0px var(--glass-penumbra-y) var(--glass-penumbra-blur) rgba(0, 0, 0, var(--glass-shadow-opacity));
                backdrop-filter: blur(14px) saturate(155%);
            }
        }

        /* 内部极光舒张动态 */
        @keyframes glassAuroraBreathe {
            0% { transform: scale(1) translate(0px, 0px) rotate(0deg); filter: brightness(0.98); }
            50% { transform: scale(1.08) translate(2px, -1px) rotate(1.5deg); filter: brightness(1.06); }
            100% { transform: scale(0.94) translate(-1.5px, 1.5px) rotate(-1deg); filter: brightness(0.94); }
        }

        @media screen and (max-width: 768px) {
            .ling-pet-compass { width: 58px; height: 30px; border-radius: 15px; }
            .ling-pet-compass__text { font-size: 13px; }
        }
    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = STYLES;
    document.head.appendChild(styleNode);

    // ================= 2. 铸造全新 DOM 架构 =================
    const dot = document.createElement('div');
    dot.className = 'ling-pet-compass';
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-live', 'polite');
    dot.setAttribute('data-state', 'day'); 
    dot.setAttribute('data-system-drag', '1'); 

    // 晶莹极光内心
    const auroraCore = document.createElement('div');
    auroraCore.className = 'ling-pet-compass__aurora-core';
    dot.appendChild(auroraCore);

    // 文字层
    const textLayer = document.createElement('div');
    textLayer.className = 'ling-pet-compass__text';
    textLayer.textContent = '---';
    dot.appendChild(textLayer);

    document.body.appendChild(dot);

    // ================= 3. 时辰监听与天道气象切换 =================
    let lastState = ""; 

    function triggerShockwave() {
        dot.classList.add('ling-pulse-trigger');
        setTimeout(() => { dot.classList.remove('ling-pulse-trigger'); }, 550); 
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
    if (targetNode) observer.observe(targetNode, { childList: true, characterData: true, subtree: true, attributes: true });

    // ================= 4. 物理拖拽与智能阻尼边界吸附 =================
    let isDragging = false;
    let offsetX, offsetY;

    function snapToEdges(currentLeft, currentTop) {
        const dotWidth = dot.offsetWidth;
        const dotHeight = dot.offsetHeight;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        const distLeft = currentLeft;
        const distRight = winWidth - (currentLeft + dotWidth);
        const distTop = currentTop;
        const distBottom = winHeight - (currentTop + dotHeight);

        let finalLeft = currentLeft;
        let finalTop = currentTop;
        const snapThreshold = 120; 

        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

        if (minDist < snapThreshold) {
            if (minDist === distLeft) finalLeft = 0;
            else if (minDist === distRight) finalLeft = winWidth - dotWidth;
            else if (minDist === distTop) finalTop = 0;
            else if (minDist === distBottom) finalTop = winHeight - dotHeight;
        }

        finalLeft = Math.max(0, Math.min(winWidth - dotWidth, finalLeft));
        finalTop = Math.max(0, Math.min(winHeight - dotHeight, finalTop));

        // 吸附回弹：享受丝滑贝塞尔
        dot.style.transition = 'box-shadow 0.25s ease, transform 0.3s ease, left 0.48s cubic-bezier(0.25, 1, 0.5, 1), top 0.48s cubic-bezier(0.25, 1, 0.5, 1)';
        dot.offsetHeight; 

        dot.style.left = finalLeft + 'px';
        dot.style.top = finalTop + 'px';

        localStorage.setItem('ling_time_dot_position', JSON.stringify({ left: finalLeft, top: finalTop }));
    }

    function loadSavedPosition() {
        const savedPos = localStorage.getItem('ling_time_dot_position');
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                dot.style.left = pos.left + 'px';
                dot.style.top = pos.top + 'px';
                dot.style.right = 'auto'; 
            } catch (e) {}
        }
    }

    const startDrag = (clientX, clientY) => {
        isDragging = true;
        offsetX = clientX - dot.getBoundingClientRect().left;
        offsetY = clientY - dot.getBoundingClientRect().top;
        dot.style.transition = 'none'; 
    };

    const moveDrag = (clientX, clientY) => {
        if (!isDragging) return;
        let targetLeft = clientX - offsetX;
        let targetTop = clientY - offsetY;
        dot.style.left = targetLeft + 'px';
        dot.style.top = targetTop + 'px';
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        snapToEdges(parseFloat(dot.style.left), parseFloat(dot.style.top));
    };

    dot.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    dot.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    dot.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    dot.addEventListener('touchend', endDrag);

    window.addEventListener('resize', () => {
        if (!dot.style.left) return;
        dot.style.transition = 'none';
        snapToEdges(parseFloat(dot.style.left), parseFloat(dot.style.top));
    });

    loadSavedPosition();
    setTimeout(updateDotStyle, 500);

})();