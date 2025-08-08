// 轮播功能变量
let currentSlide = 0;
let totalSlides = 0;
let slidesPerView = 3;
let autoPlayInterval = null;

// 初始化轮播
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-track .use-case-card');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track || !cards.length) return;
    
    totalSlides = cards.length;
    
    // 固定每屏显示3个卡片
    slidesPerView = 3;
    
    // 创建指示点
    createDots(dotsContainer);
    
    // 更新轮播状态
    setTimeout(() => {
        updateCarousel();
    }, 200);
    
    // 启动自动播放
    startAutoPlay();
    
    // 添加窗口大小改变监听
    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
}

// 创建指示点
function createDots(container) {
    if (!container) return;
    
    container.innerHTML = '';
    const totalDots = Math.ceil(totalSlides / slidesPerView);
    
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', () => {
            goToSlide(i, true);
        });
        container.appendChild(dot);
    }
}

// 更新轮播状态
function updateCarousel() {
    const track = document.querySelector('.carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!track) return;
    
    // 计算偏移量
    const cardWidth = track.querySelector('.use-case-card').offsetWidth;
    const gap = 20; // 卡片间距（与CSS中的margin一致）
    const offset = currentSlide * (cardWidth + gap) * slidesPerView;
    
    // 应用变换
    track.style.transform = `translateX(-${offset}px)`;
    
    // 更新指示点
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // 更新按钮状态
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentSlide >= Math.ceil(totalSlides / slidesPerView) - 1;
    }
}

// 下一张幻灯片
function nextSlide(isManual = false) {
    const maxSlide = Math.ceil(totalSlides / slidesPerView) - 1;
    if (currentSlide < maxSlide) {
        currentSlide++;
    } else {
        // 循环播放：回到第一屏
        currentSlide = 0;
    }
    updateCarousel();
    
    // 如果是用户手动操作，重新启动自动播放
    if (isManual) {
        stopAutoPlay();
        startAutoPlay();
    }
}

// 上一张幻灯片
function prevSlide(isManual = false) {
    const maxSlide = Math.ceil(totalSlides / slidesPerView) - 1;
    if (currentSlide > 0) {
        currentSlide--;
    } else {
        // 循环播放：跳转到最后一屏
        currentSlide = maxSlide;
    }
    updateCarousel();
    
    // 如果是用户手动操作，重新启动自动播放
    if (isManual) {
        stopAutoPlay();
        startAutoPlay();
    }
}

// 跳转到指定幻灯片
function goToSlide(slideIndex, isManual = false) {
    currentSlide = slideIndex;
    updateCarousel();
    
    // 如果是用户手动操作，重新启动自动播放
    if (isManual) {
        stopAutoPlay();
        startAutoPlay();
    }
}

// 启动自动播放
function startAutoPlay() {
    // 清除之前的定时器
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
    
    // 设置5秒自动播放
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

// 停止自动播放
function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// 处理窗口大小改变
function handleResize() {
    // 保持每屏显示2个卡片，不随窗口大小改变
    // 只重新初始化轮播
    currentSlide = 0;
    initCarousel();
}

// 平滑滚动功能
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 滚动到演示区域
function scrollToDemo() {
    smoothScroll('#demo');
}

// 滚动到功能特性区域
function scrollToFeatures() {
    smoothScroll('#features');
}

// 滚动到使用场景区域
function scrollToUseCases() {
    smoothScroll('#use-cases');
    // 高亮显示解决方案菜单项
    highlightNavItem('nav-solutions');
}

// 高亮显示导航菜单项（仅在用户主动点击时使用）
function highlightNavItem(itemId) {
    // 只在特定情况下清除高亮，保持菜单样式稳定
    // 这个函数现在主要用于页面跳转时的状态设置
    const targetItem = document.getElementById(itemId);
    if (targetItem) {
        // 只设置目标项的高亮，不清除其他项
        targetItem.classList.add('active');
    }
}

// 提交任务功能
function submitTask() {
    const userInput = document.getElementById('userInput').value.trim();
    const modelSelect = document.getElementById('modelSelect').value;
    const outputContent = document.getElementById('outputContent');
    
    if (!userInput) {
        alert('请输入您的指令');
        return;
    }
    
    // 显示加载状态
    outputContent.innerHTML = `
        <div class="ai-message">
            <div class="ai-avatar">AI</div>
            <div class="ai-text">
                正在使用 ${modelSelect} 模型处理您的请求...<br>
                <span class="typing-indicator">▋</span>
            </div>
        </div>
    `;
    
    // 模拟AI处理过程
    setTimeout(() => {
        simulateAIResponse(userInput, modelSelect, outputContent);
    }, 2000);
}

// 模拟AI响应
function simulateAIResponse(userInput, model, outputContent) {
    const responses = {
        'claude': [
            'I have analyzed your code and found several areas for optimization:',
            '1. Performance Optimization: Consider using caching to reduce redundant calculations.',
            '2. Memory Management: Make sure to release unused resources in time.',
            '3. Error Handling: It is recommended to add more comprehensive exception handling.',
            '',
            'These improvements can significantly enhance the performance and stability of your code.'
        ],
        'kimi': [
            'Based on your requirements, I have generated the following solution:',
            '',
            '```python',
            'def optimized_function():',
            '    # Use caching to optimize performance',
            '    cache = {}',
            '    def wrapper(*args):',
            '        if args not in cache:',
            '            cache[args] = compute_result(*args)',
            '        return cache[args]',
            '    return wrapper',
            '```',
            '',
            'This implementation can effectively improve performance.'
        ],
        'qwen': [
            'I understand your needs. Here is a detailed code analysis:',
            '',
            '**Code Quality Assessment:**',
            '- Readability: Good',
            '- Performance: Needs optimization',
            '- Security: Should be enhanced',
            '',
            '**Specific Suggestions:**',
            '1. Add input validation',
            '2. Optimize algorithm complexity',
            '3. Add unit tests'
        ],
        'glm': [
            'Based on your code, I provide the following improvement plan:',
            '',
            '**Main Issues:**',
            '1. Lack of error handling',
            '2. Obvious performance bottlenecks',
            '3. Code structure can be optimized',
            '',
            '**Solution:**',
            'It is recommended to refactor the code structure and use design patterns to improve maintainability.'
        ]
    };
    
    const response = responses[model] || responses['claude'];
    let fullResponse = '';
    
    // Show response line by line, simulating typing effect
    let lineIndex = 0;
    const typeInterval = setInterval(() => {
        if (lineIndex < response.length) {
            fullResponse += response[lineIndex] + '<br>';
            outputContent.innerHTML = `
                <div class="ai-message">
                    <div class="ai-avatar">AI</div>
                    <div class="ai-text">
                        ${fullResponse}
                        <span class="typing-indicator">▋</span>
                    </div>
                </div>
            `;
            lineIndex++;
        } else {
            clearInterval(typeInterval);
            // Remove typing indicator
            outputContent.innerHTML = `
                <div class="ai-message">
                    <div class="ai-avatar">AI</div>
                    <div class="ai-text">
                        ${fullResponse}
                    </div>
                </div>
            `;
            
            // Add save result button
            setTimeout(() => {
                outputContent.innerHTML += `
                    <div style="margin-top: 20px; text-align: center;">
                        <button class="btn-primary" onclick="saveResult()">
                            <i class="fas fa-download"></i>
                            Save result to local
                        </button>
                    </div>
                `;
            }, 1000);
        }
    }, 300);
}

// 保存结果功能
function saveResult() {
    const outputContent = document.getElementById('outputContent');
    const text = outputContent.innerText;
    
    // 创建下载链接
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codesphere-result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('结果已保存到本地！');
}

// 任务列表交互
document.addEventListener('DOMContentLoaded', function() {
    // 任务项点击事件
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他活动状态
            taskItems.forEach(i => i.classList.remove('active'));
            // 添加当前活动状态
            this.classList.add('active');
            
            // 模拟加载任务详情
            const taskName = this.querySelector('.task-name').textContent;
            loadTaskDetails(taskName);
        });
    });
    
    // 模型选择变化事件
    const modelSelect = document.getElementById('modelSelect');
    modelSelect.addEventListener('change', function() {
        const selectedModel = this.value;
        console.log('选择的模型:', selectedModel);
    });
    
    // 文件上传按钮事件
    const uploadButtons = document.querySelectorAll('.upload-btn');
    uploadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = this.textContent.includes('图片') ? 'image/*' : '*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    alert(`文件 "${file.name}" 上传成功！`);
                }
            };
            input.click();
        });
    });
});

// 加载任务详情
function loadTaskDetails(taskName) {
    const outputContent = document.getElementById('outputContent');
    
    const taskDetails = {
        '代码分析任务': {
            status: '已完成',
            result: '代码分析完成，发现3个潜在问题，已生成优化建议。'
        },
        'Bug 修复': {
            status: '运行中',
            result: '正在分析错误日志，预计5分钟后完成修复。'
        },
        '功能开发': {
            status: '等待中',
            result: '任务已加入队列，等待资源分配。'
        }
    };
    
    const task = taskDetails[taskName];
    if (task) {
        outputContent.innerHTML = `
            <div class="ai-message">
                <div class="ai-avatar">AI</div>
                <div class="ai-text">
                    <strong>任务：${taskName}</strong><br>
                    <strong>状态：${task.status}</strong><br><br>
                    ${task.result}
                </div>
            </div>
        `;
    }
}

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        smoothScroll(target);
    });
});

// 添加页面加载动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 功能卡片悬停效果增强
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// 添加键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter 提交任务
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        submitTask();
    }
    
    // Escape 清空输入
    if (e.key === 'Escape') {
        const userInput = document.getElementById('userInput');
        if (userInput === document.activeElement) {
            userInput.value = '';
        }
    }
});

// 添加输入框自动调整高度
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 300) + 'px';
    });
});

// 添加页面可见性检测
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('页面已隐藏');
    } else {
        console.log('页面已显示');
    }
});

// 添加错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 添加性能监控
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('页面加载时间:', loadTime + 'ms');
    }
}); 

// Language translations
const translations = {
  en: {
    "nav-home": "Product",
    "nav-use-cases": "Solutions",
    "nav-pricing": "Pricing",
    "nav-login": "Login/Register",
    "nav-docs": "Docs",
    "nav-console": "Console",
    "hero-badge-text": "General AI Assistant",
    "hero-title": "CodeSphere is a general-purpose AI assistant",
    "hero-desc": "<p>Zero-deployment access to full Claude Code capabilities,</p><p class=\"hero-desc-line2\">a cloud development platform that supports parallel collaboration of multiple intelligent agents</p>",
    "try-btn": "Get Started",
    "learn-btn": "Watch Demo",
    "docs-btn": "View Docs",
    "use-cases-title": "Solutions",
    "pricing-title": "Pricing Plans",
    "pricing1-title": "Free Trial",
    "pricing1-price": "¥0",
    "pricing1-feature1": "Basic sandbox computing",
    "pricing1-feature2": "Standard model invocation",
    "pricing1-feature3": "Basic task support",
    "pricing1-feature4": "Community support",
    "get-started-btn": "Get Started",
    "pricing2-title": "Professional",
    "pricing2-price": "Pay as you go",
    "pricing2-feature1": "Advanced sandbox computing",
    "pricing2-feature2": "All model support",
    "pricing2-feature3": "Parallel AI agents",
    "pricing2-feature4": "Priority tech support",
    "pricing2-feature5": "Advanced features",
    "learn-more-btn": "Learn More",
    "pricing3-title": "Enterprise",
    "pricing3-price": "Custom",
    "pricing3-feature1": "Dedicated cloud resources",
    "pricing3-feature2": "Custom model deployment",
    "pricing3-feature3": "Advanced security controls",
    "pricing3-feature4": "24/7 dedicated support",
    "pricing3-feature5": "SLA guarantee",
    "contact-sales-btn": "Contact Sales",
    "pricing-note": "Free for early users, only pay for LLM usage. Later, sandbox computing will be charged.",
    "footer-product-title": "Product",
    "footer-use-cases": "Solutions",
    "footer-pricing": "Pricing",
    "footer-support-title": "Support",
    "footer-help": "Help Docs",
    "footer-tech": "Tech Support",
    "footer-contact": "Contact Us",
    "footer-copyright": "© 2024 CodeSphere. All rights reserved.",
    "login-title": "Login to CodeSphere",
    "login-subtitle": "Welcome back! Please enter your details.",
    "email-label": "Email",
    "password-label": "Password",
    "remember-text": "Remember me",
    "forgot-password": "Forgot password?",
    "login-btn": "Login",
    "or-text": "or",
    "google-login-text": "Continue with Google",
    "no-account-text": "Don't have an account?",
    "signup-link": "Sign up",
    "register-title": "Create Account",
    "register-subtitle": "Join CodeSphere and start coding in the cloud!",
    "name-label": "Full Name",
    "reg-email-label": "Email",
    "reg-password-label": "Password",
    "confirm-label": "Confirm Password",
    "agree-text": "I agree to the Terms of Service and Privacy Policy",
    "register-btn": "Create Account",
    "or-reg-text": "or",
    "google-register-text": "Sign up with Google",
    "have-account-text": "Already have an account?",
    "login-link": "Log in",
    "features-title": "Core Features",
    "feature1-title": "Out-of-the-box Claude Code Capability",
    "feature1-desc": "Built-in enterprise-grade security sandbox environment eliminates API key management burdens; achieves unified development efficiency and risk control through compliance-enhanced frameworks and SLA-backed guarantees.",
    "feature2-title": "Parallel Intelligent Agent Collaboration",
    "feature2-desc": "Enables parallel scheduling of heterogeneous workflows and collaborative decision-making across multiple agents, achieving end-to-end automation for complex tasks to significantly enhance engineering throughput and delivery quality.",
    "feature3-title": "Revolutionary Interaction Experience",
    "feature3-desc": "Native cloud chat window supporting natural language-driven task orchestration. Provides multi-modal visual result output such as tables, charts, and documents.",
    "feature4-title": "Multi-platform support",
    "feature4-desc": "Cloud-based development, accessible anywhere,Operate visual workflows via browser or mobile app, enabling non-technical users to build automated tasks effortlessly.",
    "feature5-title": "Flexible Integration Architecture",
    "feature5-desc": "Developer Ecosystem, Empower productivity surges through deeply integrated SDK/CLI toolchains; Enterprise Systems: Seamlessly integrate CRM/ERP/data warehouses via the MCP protocol, building a unified data collaboration hub.",
    "feature6-title": "Secure Isolated Environment",
    "feature6-desc": "Task-level containerized sandbox isolation,Enables end-to-end automation of dependency installation, test execution, code building, and quality scanning. Achieves zero-configuration environments with sub-second resource provisioning, ensuring security reinforcement and performance leap in development workflows."
  },
  zh: {
    "nav-home": "产品",
    "nav-use-cases": "解决方案",
    "nav-pricing": "计费",
    "nav-login": "登录/注册",
    "nav-docs": "文档",
    "nav-console": "控制台",
    "hero-badge-text": "通用型 AI 助手",
    "hero-title": "CodeSphere是一款通用型 AI 助手",
    "hero-desc": "零部署调用 Claude Code全能力，支持多智能体并行协作的云端开发平台",
    "try-btn": "开始使用",
    "learn-btn": "观看演示",
    "docs-btn": "查看文档",
    "use-cases-title": "解决方案",
    "pricing-title": "计费方案",
    "pricing1-title": "免费版",
    "pricing1-price": "¥0",
    "pricing1-feature1": "并发项目数量上限 1",
    "pricing1-feature2": "标准模型调用",
    "pricing1-feature3": "项目磁盘空间上限 10GB",
    "pricing1-feature4": "项目 CPU 上限 2vCPU",
    "pricing1-feature5": "项目内存上限 512MB",
    "get-started-btn": "立即开始",
    "pricing2-title": "专业版",
    "pricing2-price": "$9.9/月",
    "pricing2-feature1": "并发项目数量上限 50",
    "pricing2-feature2": "所有模型支持",
    "pricing2-feature3": "项目磁盘空间上限 20GB",
    "pricing2-feature4": "项目 CPU 上限 4vCPU",
    "pricing2-feature5": "项目内存上限 4GB",
    "pricing2-feature6": "自定义CPU/内存资源",
    "learn-more-btn": "了解更多",
    "pricing3-title": "企业版",
    "pricing3-price": "定制",
    "pricing3-feature1": "专用云资源",
    "pricing3-feature2": "自定义模型部署",
    "pricing3-feature3": "高级安全控制",
    "pricing3-feature4": "7×24专属支持",
    "pricing3-feature5": "SLA保障",
    "contact-sales-btn": "联系销售",
    "pricing-note": "前期免费，用户只负担大模型的费用。后期会收取沙箱算力的费用。",
    "footer-product-title": "产品",
    "footer-use-cases": "解决方案",
    "footer-pricing": "计费方案",
    "footer-support-title": "支持",
    "footer-help": "帮助文档",
    "footer-tech": "技术支持",
    "footer-contact": "联系我们",
    "footer-copyright": "© 2024 CodeSphere. 保留所有权利。",
    "login-title": "登录 CodeSphere",
    "login-subtitle": "欢迎回来！请输入您的详细信息。",
    "email-label": "邮箱",
    "password-label": "密码",
    "remember-text": "记住我",
    "forgot-password": "忘记密码？",
    "login-btn": "登录",
    "or-text": "或",
    "google-login-text": "使用 Google 继续",
    "no-account-text": "还没有账户？",
    "signup-link": "注册",
    "register-title": "创建账户",
    "register-subtitle": "加入 CodeSphere，开始在云端编程！",
    "name-label": "姓名",
    "reg-email-label": "邮箱",
    "reg-password-label": "密码",
    "confirm-label": "确认密码",
    "agree-text": "我同意服务条款和隐私政策",
    "register-btn": "创建账户",
    "or-reg-text": "或",
    "google-register-text": "使用 Google 注册",
    "have-account-text": "已有账户？",
    "login-link": "登录",
    "features-title": "产品优势",
    "feature1-title": "开箱即用Claude Code能力",
    "feature1-desc": "内置企业级安全沙箱环境，消除API密钥管理负担；通过合规强化框架与SLA保障体系，实现开发效率与风险控制的统一。",
    "feature2-title": "并行智能体协作",
    "feature2-desc": "支持异构工作流并行调度与多智能体协同决策，实现复杂任务的全链路自动化处理，显著提升工程吞吐量与交付质量。",
    "feature3-title": "革命性交互体验",
    "feature3-desc": "原生云端聊天窗口支持自然语言驱动的任务编排。提供多模态可视化结果输出，如表格、图表和文档。",
    "feature4-title": "多端支持",
    "feature4-desc": "云上开发，随处访问：通过浏览器或手机App即可操作可视化工作流，让非技术人员轻松搭建自动化任务。",
    "feature5-title": "灵活的集成架构",
    "feature5-desc": "开发者生态：通过深度集成的SDK/CLI工具链实现开发效率跃升；企业系统：依托MCP协议打通CRM/ERP/数据仓库，构建全域数据协同中枢。",
    "feature6-title": "安全隔离环境",
    "feature6-desc": "任务级容器化沙箱隔离，支持依赖安装、测试执行、代码构建与质量扫描的全流程自动化，实现环境零配置与资源秒级调度，保障开发过程的安全性与效能跃升。"
  }
};

function switchLanguage(lang) {
  for (const id in translations[lang]) {
    const el = document.getElementById(id);
    if (el) el.textContent = translations[lang][id];
  }
  localStorage.setItem('lang', lang);
  
  // Update auth UI after language switch
  updateAuthUI();
}

window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  const langSwitcher = document.getElementById('langSwitcher');
  if (langSwitcher) langSwitcher.value = savedLang;
  switchLanguage(savedLang);
}); 

// Authentication Modal Functions
function openAuthModal() {
    document.getElementById('authModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Handle Login Form Submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Show loading state
    const loginBtn = document.getElementById('login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes, accept any valid email format
        if (email && password) {
            // Store user info in localStorage
            const userInfo = {
                email: email,
                name: email.split('@')[0], // Use email prefix as name
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };
            
            if (rememberMe) {
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            } else {
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
            }
            
            // Update UI
            updateAuthUI();
            closeAuthModal();
            
            // Show success message
            showNotification('Login successful! Welcome to CodeSphere.', 'success');
        } else {
            showNotification('Please enter valid email and password.', 'error');
        }
        
        // Reset button
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    }, 1500);
}

// Handle Register Form Submission
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms of Service and Privacy Policy.', 'error');
        return;
    }
    
    // Show loading state
    const registerBtn = document.getElementById('register-btn');
    const originalText = registerBtn.textContent;
    registerBtn.textContent = 'Creating Account...';
    registerBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store user info
        const userInfo = {
            email: email,
            name: name,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // Update UI
        updateAuthUI();
        closeAuthModal();
        
        // Show success message
        showNotification('Account created successfully! Welcome to CodeSphere.', 'success');
        
        // Reset button
        registerBtn.textContent = originalText;
        registerBtn.disabled = false;
    }, 2000);
}

// Handle Google Login
function handleGoogleLogin() {
    const googleBtn = document.querySelector('#loginForm .btn-google');
    const originalText = googleBtn.querySelector('span').textContent;
    googleBtn.querySelector('span').textContent = 'Connecting...';
    googleBtn.disabled = true;
    
    // Simulate Google OAuth
    setTimeout(() => {
        // For demo, create a mock Google user
        const userInfo = {
            email: 'user@gmail.com',
            name: 'Google User',
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
            provider: 'google'
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        updateAuthUI();
        closeAuthModal();
        showNotification('Google login successful! Welcome to CodeSphere.', 'success');
        
        // Reset button
        googleBtn.querySelector('span').textContent = originalText;
        googleBtn.disabled = false;
    }, 2000);
}

// Handle Google Register
function handleGoogleRegister() {
    const googleBtn = document.querySelector('#registerForm .btn-google');
    const originalText = googleBtn.querySelector('span').textContent;
    googleBtn.querySelector('span').textContent = 'Connecting...';
    googleBtn.disabled = true;
    
    // Simulate Google OAuth
    setTimeout(() => {
        // For demo, create a mock Google user
        const userInfo = {
            email: 'newuser@gmail.com',
            name: 'New Google User',
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
            provider: 'google'
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        updateAuthUI();
        closeAuthModal();
        showNotification('Google registration successful! Welcome to CodeSphere.', 'success');
        
        // Reset button
        googleBtn.querySelector('span').textContent = originalText;
        googleBtn.disabled = false;
    }, 2000);
}

// Update Authentication UI
function updateAuthUI() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo') || '{}');
    const loginBtn = document.querySelector('.login-btn');
    
    if (userInfo.isLoggedIn) {
        loginBtn.innerHTML = `
            <i class="fas fa-user"></i>
            <span>${userInfo.name}</span>
        `;
        loginBtn.onclick = showUserMenu;
    } else {
        // Get current language
        const currentLang = localStorage.getItem('lang') || 'en';
        const loginText = translations[currentLang]['nav-login'] || 'Login/Register';
        loginBtn.innerHTML = loginText;
        loginBtn.onclick = openAuthModal;
    }
}

// Show User Menu
function showUserMenu() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo') || '{}');
    
    // Create user menu
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-header">
            <i class="fas fa-user-circle"></i>
            <div>
                <div class="user-name">${userInfo.name}</div>
                <div class="user-email">${userInfo.email}</div>
            </div>
        </div>
        <div class="user-menu-items">
            <a href="#" onclick="showUserProfile()">
                <i class="fas fa-user"></i>
                Profile
            </a>
            <a href="#" onclick="showUserSettings()">
                <i class="fas fa-cog"></i>
                Settings
            </a>
            <a href="#" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </a>
        </div>
    `;
    
    // Position menu
    const loginBtn = document.querySelector('.login-btn');
    const rect = loginBtn.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = rect.bottom + 10 + 'px';
    menu.style.right = '20px';
    menu.style.zIndex = '1001';
    
    // Add to page
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !loginBtn.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Logout Function
function logout() {
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    updateAuthUI();
    showNotification('Logged out successfully.', 'info');
}

// Show User Profile (placeholder)
function showUserProfile() {
    showNotification('Profile page coming soon!', 'info');
}

// Show User Settings (placeholder)
function showUserSettings() {
    showNotification('Settings page coming soon!', 'info');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeAuthModal();
    }
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .user-menu {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            min-width: 200px;
            overflow: hidden;
        }
        
        .user-menu-header {
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .user-menu-header i {
            font-size: 2rem;
            color: #2563eb;
        }
        
        .user-name {
            font-weight: 600;
            color: #1e293b;
        }
        
        .user-email {
            font-size: 0.8rem;
            color: #6b7280;
        }
        
        .user-menu-items a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            color: #374151;
            text-decoration: none;
            transition: background-color 0.3s ease;
        }
        
        .user-menu-items a:hover {
            background-color: #f3f4f6;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 15px 20px;
            z-index: 3000;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-info {
            border-left: 4px solid #2563eb;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification-success .notification-content i {
            color: #10b981;
        }
        
        .notification-error .notification-content i {
            color: #ef4444;
        }
        
        .notification-info .notification-content i {
            color: #2563eb;
        }
    `;
    document.head.appendChild(style);
    
    // 初始化炫酷背景效果
    initParticles();
    initCursorGlow();
    
    // 初始化轮播
    initCarousel();
});

// 粒子效果
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机大小
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // 随机位置
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // 随机动画延迟
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    
    container.appendChild(particle);
    
    // 粒子消失后重新创建
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createParticle(container);
        }
    }, 8000);
}

// 鼠标跟随光效
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面，但不添加滚动监听器
    // 菜单样式将保持固定不变
    
    // 为导航菜单项添加点击事件监听器
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 清除所有菜单项的高亮
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // 为当前点击的菜单项添加高亮
            this.classList.add('active');
        });
    });
    
    // 初始化聊天输入框功能
    initChatInput();
    
    // 初始化项目列表交互
    initProjectList();
    
    // 初始化媒体查看器功能
    initMediaViewer();
});

// 初始化聊天输入框
function initChatInput() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    // 自动调整高度
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });
    
    // 处理键盘事件
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // 这里可以添加发送消息的逻辑
            console.log('发送消息:', this.value);
            this.value = '';
            this.style.height = 'auto';
        }
    });
    
    // 发送按钮事件
    const sendBtn = document.querySelector('.chat-action-btn[title="发送"]');
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            if (chatInput.value.trim()) {
                console.log('发送消息:', chatInput.value);
                chatInput.value = '';
                chatInput.style.height = 'auto';
            }
        });
    }
    
    // 撤销按钮事件
    const undoBtn = document.querySelector('.chat-action-btn[title="撤销"]');
    if (undoBtn) {
        undoBtn.addEventListener('click', function() {
            chatInput.value = '';
            chatInput.style.height = 'auto';
        });
    }
}

// 初始化媒体查看器功能
function initMediaViewer() {
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            console.log('下载文件: /home/ubuntu/smiling_cat.png');
            // 这里可以添加实际的下载逻辑
        });
    }
}

// 初始化项目列表交互
function initProjectList() {
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他项目的选中状态
            projectItems.forEach(project => {
                project.classList.remove('active');
            });
            
            // 添加当前项目的选中状态
            this.classList.add('active');
            
            // 这里可以添加加载项目详情的逻辑
            const projectTitle = this.querySelector('.project-title').textContent;
            console.log('选择项目:', projectTitle);
        });
    });
    
    // 创建项目按钮事件
    const createProjectBtn = document.querySelector('.create-project-btn');
    if (createProjectBtn) {
        createProjectBtn.addEventListener('click', function() {
            console.log('创建新项目');
            // 这里可以添加创建项目的逻辑
        });
    }
} 