// ==UserScript==
// @name         灵界时辰天道罗盘
// @namespace    http://tampermonkey.net/
// @version      20.7.3
// @description  拟物交互视觉终极圆满版。小圆内部史诗级重构：引入玉骨冰肌（羊脂灵玉冰裂纹理）与神识避光动态玉莹，真言真·压铸刻印入玉，质感臻至化境。
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

    // ================= 1. 殿堂级天道美化 CSS (小圆内部玉质大重构) =================
    const STYLES = `
        :root {
            /* 交互联动变量 */
            --ling-light-x: 45%;
            --ling-light-y: 45%;
            --ling-shadow-x: 0px;
            --ling-shadow-y: 10px;
            --ling-shadow-blur: 30px;
            
            /* 天道界域变量 */
            --ling-inset-border-color: rgba(255, 255, 255, 0.4);
            --ling-jade-bg-color: #f4f3f0;
            --ling-jade-glint: rgba(255, 255, 255, 0.7);
        }

        /* 1. 法宝主体 —— 罗盘仙金外壳大圆 */
        #ling-time-dot {
            position: fixed;
            top: 85px; right: 20px; z-index: 10000;
            width: 44px; height: 44px; border-radius: 50%;
            cursor: move; user-select: none; box-sizing: border-box;
            backdrop-filter: blur(10px) saturate(180%);
            -webkit-backdrop-filter: blur(10px) saturate(180%);
            
            box-shadow: 
                var(--ling-shadow-x) var(--ling-shadow-y) var(--ling-shadow-blur) rgba(0, 0, 0, 0.5),
                inset -2px -2px 6px rgba(0, 0, 0, 0.4),
                inset 0px 0px 0px 1px rgba(255, 255, 255, 0.2),
                inset 0px 0px 4px 3px rgba(0, 0, 0, 0.35),               /* 斜坡暗面 */
                inset 0px 0px 2px 3px var(--ling-inset-border-color);   /* 斜坡光晕 */

            border: 1px dashed rgba(255, 255, 255, 0.1); 
            transition: box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1),
                        opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1),
                        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* 2. 【20.7.3 进化：小圆·灵玉核心层】 —— 注入玉骨冰肌纹理与温润反光 */
        #ling-jade-core {
            position: absolute;
            top: 6px; left: 6px; right: 6px; bottom: 6px;
            border-radius: 50%;
            z-index: 5;
            box-sizing: border-box;
            overflow: hidden;
            
            /* 基础灵玉色 */
            background-color: var(--ling-jade-bg-color);
            
            /* 【20.7.3 核心纹理叠加：古法羊脂玉冰裂纹模拟】 */
            background-image: 
                linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%), 
                linear-gradient(-45deg, rgba(255,255,255,0.08) 25%, transparent 25%),
                linear-gradient(135deg, rgba(0,0,0,0.03) 25%, transparent 25%);
            background-size: 6px 6px; /* 极小微雕维度的晶体结构 */
            
            /* 玉石本身的3D内凹与边缘金丝锁灵 */
            box-shadow: 
                /* 玉石顶部迎光面的高透微翘 */
                inset 1.5px 1.5px 3px var(--ling-jade-glint), 
                /* 玉石底部下沉的厚重暗影 */
                inset -1.5px -1.5px 3px rgba(0, 0, 0, 0.3),   
                /* 锁灵金丝 */
                inset 0 0 0 1px var(--ling-inset-border-color); 
            
            transition: background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1),
                        box-shadow 0.3s ease;
        }

        /* [大圆与小圆之间的夹层·金属装饰圈] */
        #ling-time-dot::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 50%; z-index: 1; border: 1px dashed rgba(255, 255, 255, 0.15);
            pointer-events: none; transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        #ling-time-dot::after {
            content: ''; position: absolute; top: -6px; left: -6px; right: -6px; bottom: -6px;
            border-radius: 50%; background: transparent; border: 1px dashed rgba(255, 255, 255, 0); z-index: 0;
            transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* 【20.7.3 独立界域·常态天道描边与玉质色彩法则】 */
        #ling-time-dot.state-day    { --ling-inset-border-color: rgba(44, 53, 62, 0.2);   --ling-jade-bg-color: #f5f4f0; --ling-jade-glint: rgba(255, 255, 255, 0.8); }   /* 白昼：羊脂白玉 */
        #ling-time-dot.state-night  { --ling-inset-border-color: rgba(197, 160, 89, 0.25); --ling-jade-bg-color: #14161a; --ling-jade-glint: rgba(255, 255, 255, 0.15); } /* 黑夜：深邃墨翠 */
        #ling-time-dot.state-sunset { --ling-inset-border-color: rgba(255, 78, 80, 0.35);  --ling-jade-bg-color: #2b1212; --ling-jade-glint: rgba(255, 120, 120, 0.3); }  /* 夕照：血珀灵玉 */
        #ling-time-dot.state-sky    { --ling-inset-border-color: rgba(6, 182, 212, 0.35);  --ling-jade-bg-color: #0f1826; --ling-jade-glint: rgba(100, 220, 255, 0.4); }  /* 破晓：冰种翡翠 */

        /* 【20.7.3 进化：小圆内部·四象神识动态玉莹图层】 —— 强加避光动态与高饱和度 */
        .ling-aura-layer {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; opacity: 0; z-index: 1;
            /* 采用径向渐变，动态绑定 --ling-light-x / y 达成神识避光莹光流转 */
            background-image: radial-gradient(circle at var(--ling-light-x) var(--ling-light-y), var(--aura-color) 0%, transparent 75%);
            mix-blend-mode: screen; /* 莹光图层与玉石肌理完美融合，产生通透水头感 */
            transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .aura-day    { --aura-color: rgba(147, 197, 253, 0.65); }
        .aura-night  { --aura-color: rgba(167, 139, 250, 0.55); }
        .aura-sunset { --aura-color: rgba(249, 115, 22, 0.7); }
        .aura-sky    { --aura-color: rgba(34, 211, 238, 0.7); }

        .ling-aura-layer.active { opacity: 1; }

        /* 3. 【20.7.3 进化：古法真言层】 —— 从“漂浮”进化为“真·压铸雕刻内陷” */
        #ling-time-text {
            position: relative; z-index: 10; 
            font-family: "ShuowenZuan", "LiSu", "KaiTi", serif; 
            font-size: 13px; font-weight: 700; text-align: center;
            line-height: 32px; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
            padding-top: 1px; box-sizing: border-box;
            transition: color 0.2s ease-in-out, text-shadow 0.2s ease-in-out;
        }

        /* 通过一正一反两层阴影，模拟光线照进玉石雕刻凹槽内的边缘反光与内侧投影，达成绝对真·内陷雕刻 */
        .text-day-style    { color: #232a30; text-shadow: -0.5px -0.5px 0.5px rgba(0,0,0,0.4), 0.5px 0.5px 0.5px rgba(255,255,255,0.9); }
        .text-night-style  { color: #cbd5e1; text-shadow: -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px 0.5px 0.5px rgba(255,255,255,0.2); }
        .text-sunset-style { color: #ffe4e6; text-shadow: -0.5px -0.5px 1px rgba(0,0,0,0.9), 0.5px 0.5px 0.5px rgba(255,78,80,0.4); }
        .text-sky-style    { color: #ecfeff; text-shadow: -0.5px -0.5px 1px rgba(0,0,0,0.9), 0.5px 0.5px 0.5px rgba(6,182,212,0.4); }

        /* 4. 悬浮激活态 */
        #ling-time-dot:hover { transform: scale(1.12); opacity: 1 !important; }
        #ling-time-dot:hover::before { border: 1px dashed rgba(197, 160, 89, 0.6); transform: rotate(180deg); }
        
        #ling-time-dot.state-day:hover    { --ling-inset-border-color: rgba(0, 0, 0, 0.7); }
        #ling-time-dot.state-night:hover  { --ling-inset-border-color: rgba(197, 160, 89, 0.75); }
        #ling-time-dot.state-sunset:hover { --ling-inset-border-color: rgba(255, 78, 80, 0.85); }
        #ling-time-dot.state-sky:hover    { --ling-inset-border-color: rgba(6, 182, 212, 0.85); }

        /* Hover时神识爆发，真言内凹槽仿佛被灵光注满，向外溢出强反光 */
        #ling-time-dot.state-day:hover #ling-time-text {
            color: #000000 !important; font-weight: 900 !important;
            text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.9), 0px 0px 4px rgba(147, 197, 253, 0.6);
        }
        #ling-time-dot.state-night:hover #ling-time-text {
            color: #111317 !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #c5a059; 
            text-shadow: 0 0 6px rgba(167, 139, 250, 0.85), 0px 1px 2px rgba(255,255,255,0.1);
        }
        #ling-time-dot.state-sunset:hover #ling-time-text {
            color: #2b0000 !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #ff4e50;
            text-shadow: 0 0 6px rgba(249, 115, 22, 0.9), 0px 1px 2px rgba(255,255,255,0.1);
        }
        #ling-time-dot.state-sky:hover #ling-time-text {
            color: #000c1f !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #06b6d4;
            text-shadow: 0 0 6px rgba(34, 211, 238, 0.9), 0px 1px 2px rgba(255,255,255,0.1);
        }

        #ling-time-dot:active { transform: scale(0.95); }

        /* 星轨自转动画 */
        .run-rotate-day::before { animation: starRotateClockwise 25s linear infinite; }
        .run-rotate-night::before { animation: starRotateClockwise 30s linear infinite; }
        .run-rotate-night::after { border: 1px dashed rgba(255, 255, 255, 0.05); opacity: 0.5; animation: starRotateCounter 40s linear infinite; }

        /* 时辰突变震荡 */
        .ling-pulse-trigger { animation: lingShock 0.45s cubic-bezier(0.25, 1, 0.5, 1) !important; }
        @keyframes lingShock {
            0% { transform: scale(1); }
            30% { transform: scale(1.15); box-shadow: 0 0 35px rgba(255,255,255,0.5); }
            100% { transform: scale(1); }
        }

        @keyframes starRotateClockwise { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes starRotateCounter { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }

        @media screen and (max-width: 768px) {
            #ling-time-dot { width: 40px; height: 40px; }
            #ling-time-text { font-size: 12px; line-height: 28px; }
            #ling-jade-core { top: 5.5px; left: 5.5px; right: 5.5px; bottom: 5.5px; }
        }
    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = STYLES;
    document.head.appendChild(styleNode);

    // ================= 2. 创建拟物复合 DOM 架构 =================
    const dot = document.createElement('div');
    dot.id = 'ling-time-dot';

    const jadeCore = document.createElement('div');
    jadeCore.id = 'ling-jade-core';

    const auraLayers = {
        'day': createAuraLayer('aura-day'),
        'night': createAuraLayer('aura-night'),
        'sunset': createAuraLayer('aura-sunset'),
        'sky': createAuraLayer('aura-sky')
    };
    Object.values(auraLayers).forEach(layer => jadeCore.appendChild(layer));

    const textLayer = document.createElement('div');
    textLayer.id = 'ling-time-text';
    textLayer.textContent = '---';
    jadeCore.appendChild(textLayer);

    dot.appendChild(jadeCore);
    document.body.appendChild(dot);

    function createAuraLayer(className) {
        const layer = document.createElement('div');
        layer.className = `ling-aura-layer ${className}`;
        return layer;
    }

    // ================= 3. 神识随行：鼠标坐标联动算法 (玉质内部莹光流转) =================
    document.addEventListener('mousemove', (e) => {
        if (isDragging) return; 
        
        const rect = dot.getBoundingClientRect();
        const dotCenterX = rect.left + rect.width / 2;
        const dotCenterY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - dotCenterX;
        const deltaY = e.clientY - dotCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 250) {
            const influence = (250 - distance) / 250; 
            
            // 20.7.3 拟物联动：光源坐标会影响内部灵玉层 .ling-aura-layer 的渲染位置，达成真·避光莹光流转手感
            const lightX = 45 - (deltaX / distance) * 16 * influence;
            const lightY = 45 - (deltaY / distance) * 16 * influence;
            
            const shadowX = (deltaX / distance) * 16 * influence;
            const shadowY = 10 + (deltaY / distance) * 16 * influence;
            const shadowBlur = 30 + influence * 15;

            dot.style.setProperty('--ling-light-x', `${lightX}%`);
            dot.style.setProperty('--ling-light-y', `${lightY}%`);
            dot.style.setProperty('--ling-shadow-x', `${shadowX}px`);
            dot.style.setProperty('--ling-shadow-y', `${shadowY}px`);
            dot.style.setProperty('--ling-shadow-blur', `${shadowBlur}px`);
        } else {
            dot.style.setProperty('--ling-light-x', '45%');
            dot.style.setProperty('--ling-light-y', '45%');
            dot.style.setProperty('--ling-shadow-x', '0px');
            dot.style.setProperty('--ling-shadow-y', '10px');
            dot.style.setProperty('--ling-shadow-blur', '30px');
        }
    });

    // ================= 4. 纳芥收敛：3秒无交互自适应半隐 =================
    let fadeTimer = null;
    function resetFadeTimer() {
        clearTimeout(fadeTimer);
        dot.style.opacity = '1'; 
        fadeTimer = setTimeout(() => {
            if (!isDragging) dot.style.opacity = '0.35'; 
        }, 3000);
    }
    
    dot.addEventListener('mouseenter', resetFadeTimer);
    dot.addEventListener('mousemove', resetFadeTimer);

    // ================= 5. 核心时辰监听逻辑 =================
    let lastKey = ""; 

    function triggerShockwave() {
        dot.classList.add('ling-pulse-trigger');
        setTimeout(() => { dot.classList.remove('ling-pulse-trigger'); }, 450); 
    }

    function updateDotStyle() {
        const headerNode = document.getElementById('headerGameTime');
        if (!headerNode || !headerNode.textContent) return;

        const rawText = headerNode.textContent.trim();
        const hourMatch = rawText.match(/([子丑寅卯辰巳午未申酉戌亥])时/);
        if (!hourMatch) return;
        
        const hour = hourMatch[1];
        if (textLayer.textContent !== hour) textLayer.textContent = hour; 

        let currentKey = ""; let textStyle = ""; let shellState = ""; 

        switch (hour) {
            case '寅': currentKey = "sky"; textStyle = "text-sky-style"; shellState = "state-sky"; break;
            case '酉': currentKey = "sunset"; textStyle = "text-sunset-style"; shellState = "state-sunset"; break;
            case '卯': case '辰': case '巳': case '午': case '未': case '申':
                currentKey = "day"; textStyle = "text-day-style"; shellState = "state-day"; break;
            case '戌': case '亥': case '子': case '丑':
                currentKey = "night"; textStyle = "text-night-style"; shellState = "state-night"; break;
        }

        if (lastKey !== currentKey) {
            Object.keys(auraLayers).forEach(key => {
                if (key === currentKey) auraLayers[key].classList.add('active');
                else auraLayers[key].classList.remove('active');
            });
            
            dot.className = shellState;
            dot.classList.remove('run-rotate-day', 'run-rotate-night');
            if (currentKey === 'day') dot.classList.add('run-rotate-day');
            if (currentKey === 'night') dot.classList.add('run-rotate-night');
            textLayer.className = textStyle;
            if (lastKey !== "") triggerShockwave();
            lastKey = currentKey;
        }
    }

    const observer = new MutationObserver(() => {
        if (window.dotTimer) clearTimeout(window.dotTimer);
        window.dotTimer = setTimeout(updateDotStyle, 100);
    });
    const targetNode = document.getElementById('headerGameTime');
    if (targetNode) observer.observe(targetNode, { childList: true, characterData: true, subtree: true, attributes: true });

    // ================= 6. 拟物化严格拖拽与智能磁力吸附 =================
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

        dot.style.transition = 'box-shadow 0.25s cubic-bezier(0.25, 1, 0.5, 1), left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s, opacity 0.6s';
        dot.style.left = finalLeft + 'px';
        dot.style.top = finalTop + 'px';

        localStorage.setItem('ling_time_dot_position', JSON.stringify({ left: finalLeft, top: finalTop }));
        resetFadeTimer(); 
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
        resetFadeTimer();
    }

    const startDrag = (clientX, clientY) => {
        isDragging = true;
        clearTimeout(fadeTimer);
        dot.style.opacity = '1';
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
        snapToEdges(parseFloat(dot.style.left), parseFloat(dot.style.top));
    });

    loadSavedPosition();
    setTimeout(updateDotStyle, 500);

})();
