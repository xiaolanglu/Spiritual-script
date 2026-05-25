# 🧭 灵界时辰天道罗盘 (Heavenly Chrono Compass)

[![Greasy Fork](https://img.shields.io/badge/GreasyFork-%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85-red?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/xiaolanglu/Spiritual-script/refs/heads/main/ling-time-dot.user.js)
[![Version](https://img.shields.io/badge/Version-20.7.5--至尊大成版-gold?style=for-the-badge)](https://github.com/xiaolanglu/Spiritual-script)

> **天道有常，轮回有序。**
> 本脚本是专为《想不想修真》页游风格挂机网页（`ling.muge.info`）淬炼的**殿堂级拟物化 UI 增强法宝**。突破传统脚本死板的界面限制，引入全动态物理光影、修仙美学及四象界域法则，将游戏内的时辰文本凝聚为一枚蕴含天道律动的灵珠罗盘。

---

## 🚀 仙路指引：一键炼入体内

点击下方法阵，即可通过 Tampermonkey / Violentmonkey 等主流油猴扩展将法宝一键引入体内：

<p align="center">
  <a href="https://raw.githubusercontent.com/xiaolanglu/Spiritual-script/refs/heads/main/ling-time-dot.user.js" target="_blank">
    <img src="https://img.shields.io/badge/%E2%9C%A8%20%5B%20%E5%BC%B9%E5%87%BA%E5%A5%91%E7%BA%A6%20%C2%B7%20%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85%20%5D%20%E2%9C%A8-orange?style=for-the-badge&logo=git&logoColor=white" alt="Install Button" height="60"/>
  </a>
</p>


---

## 💎 至尊法宝：四大核心神通

### 1. 玉骨冰肌 · 拟物真玉核心 🧪
* **羊脂冰裂纹理**：采用微观网格叠加技术，在灵珠内部还原了天然翡翠、羊脂白玉独有的若隐若现的晶体冰裂与棉旭结构。
* **45°镜面掠影**：每隔 6 秒，一道仙界流光会轻柔掠过灵珠表面，产生真·玻璃种玉石的“起刚感”与镜面反射光泽。
* **压铸真言内陷**：核心时辰篆体真言采用“一正一反”双层阴影雕琢，文字不再漂浮，而是生生**镌刻内陷**入玉石深处。

### 2. 四象运转 · 界域动态流光 🌗
依托游戏实时时辰（地支），罗盘自动判定并轮转四大天道界域：
* 🌅 **【破晓 · 寅时】**：化为**冰种翡翠**，泛出高饱和度的清冷青翠流光。
* ☀️ **【白昼 · 卯/辰/巳/午/未/申】**：化为**羊脂白玉**，配合星轨顺时针缓缓自转。
* 🌇 **【夕照 · 酉时】**：化为**血珀灵玉**，边缘激荡起晚霞般的赤橙华彩。
* 🌙 **【黑夜 · 戌/亥/子/丑】**：化为**深邃墨翠**，黑金交织，星轨双向交错回旋。

### 3. 神识随行 · 三维悬浮升腾投影 ⚡
* **神识避光莹光**：灵珠内嵌 `mix-blend-mode: screen` 滤色流体层。当鼠标（神识）在罗盘附近划过时，玉石内部的莹光会跟随坐标动态聚拢折射，产生通透的水头感。
* **3D 腾空错觉**：鼠标 Hover 或手指触碰时，外部物理阴影（Shadow Blur & Y轴）瞬间向下、向外拉大延展 1.5 倍，法宝视觉上仿佛活生生**脱离屏幕、拔地升腾**。

### 4. 纳芥半隐 · 移动端虚体扩容 📱
* **纳芥折叠**：无交互 3 秒后，罗盘收敛锋芒，自动优雅地向最近的屏幕边缘**折叠横移切出 68%**，且抹平阴影，绝不遮挡修仙视线。
* **虚体扩容（神识盾牌）**：针对手机端特制。折叠后，面向屏幕内侧自动生成一块 **24px 宽的绝对透明感应带**。手机大拇指无需精准定位，对着边缘盲戳即可 100% 唤醒唤出，完美解决移动端误触与失联天劫。

---

## 🛠️ 淬炼材料 (技术架构)

* **前沿表现层**：纯原生 CSS3（径向渐变、混合模式 `mix-blend-mode`、骨骼形变 `skewX`、自定义动画）。
* **感知中枢层**：JavaScript 高性能监听矩阵（动态绑定 CSS 变量、鼠标/触控双轨事件拦截）。
* **天道监听**：`MutationObserver` 毫米级异步追踪游戏时辰节点，非传统死循环轮询，零内存泄漏，不斩凡尘网速。

---

## 📜 宗门法条 (License)

基于 **MIT License** 授权发布。诸位道友可自由化用、熔炼、闭关二次创作，唯愿在修仙界发扬光大！