let allTerms = [];
let allMistakes = [];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    if (typeof CONTENT_DB !== 'undefined') {
        allTerms = CONTENT_DB.terms;
        allMistakes = CONTENT_DB.mistakes;
    } else {
        console.error('CONTENT_DB not found.');
    }

    renderTerms(allTerms);
    renderMistakes(allMistakes);
    renderGuides(CONTENT_DB.guides || []);
    renderFAQs(CONTENT_DB.faqs || []);
    renderBooks(CONTENT_DB.books || []);
    renderQuotes();
    loadChecklist();
    setupSearch();
    initiateNewsletter();
    renderBlog();
}



function initiateNewsletter() {
    const savedEmail = localStorage.getItem('newsletter_email');
    const form = document.getElementById('newsletter-form');
    const subscribedMsg = document.getElementById('newsletter-subscribed');
    const emailDisplay = document.getElementById('subscribed-email');

    if (savedEmail) {
        if (form) form.style.display = 'none';
        if (subscribedMsg) subscribedMsg.style.display = 'block';
        if (emailDisplay) emailDisplay.textContent = savedEmail;
    } else {
        if (form) form.style.display = 'flex';
        if (subscribedMsg) subscribedMsg.style.display = 'none';
    }
}

function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        alert('이메일 주소를 입력해주세요.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('올바른 이메일 형식이 아닙니다.');
        return;
    }

    // Mock API Call UX
    const btn = document.querySelector('button[onclick="subscribeNewsletter()"]');
    const originalText = btn.textContent;
    btn.textContent = "잠금 해제 중...";
    btn.disabled = true;

    setTimeout(() => {
        // Save to LocalStorage
        localStorage.setItem('newsletter_email', email);

        // Update UI
        alert(`🔓 잠금 해제 성공!\n'${email}'님을 위한 시크릿 링크가 생성되었습니다.`);
        initiateNewsletter(); // Refresh UI State

        btn.textContent = originalText;
        btn.disabled = false;
        emailInput.value = ''; // Clear input
    }, 1000);
}

function unsubscribeNewsletter() {
    if (confirm("알림 신청을 취소하시겠습니까? (오픈 소식을 놓치실 수 있어요 😢)")) {
        localStorage.removeItem('newsletter_email');
        alert("알림 신청이 취소되었습니다.");
        initiateNewsletter(); // Refresh UI State
    }
}

// --- Search Engine ---
let searchDebounceTimer;

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const wikiTrigger = document.getElementById('wiki-search-trigger');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const rawInput = e.target.value.toLowerCase().trim();

        if (rawInput === '') {
            renderTerms(allTerms);
            if (wikiTrigger) wikiTrigger.style.display = 'none';
            return;
        }

        const tokens = rawInput.split(/\s+/).filter(t => t.length > 0);

        const scoredResults = allTerms.map(term => {
            const lowKeyword = term.keyword.toLowerCase();
            const lowDesc = term.description.toLowerCase();
            const lowTags = (term.tags || []).join(" ").toLowerCase();

            let score = 0;
            if (lowKeyword.includes(rawInput)) score += 200;

            tokens.forEach(token => {
                if (lowKeyword.includes(token)) score += 100;
                else if (lowTags.includes(token)) score += 50;
                else if (lowDesc.includes(token)) score += 20;
            });

            return { ...term, localScore: score };
        }).filter(item => item.localScore > 0);

        scoredResults.sort((a, b) => b.localScore - a.localScore);

        if (scoredResults.length > 0) {
            renderTerms(scoredResults, rawInput);
            if (wikiTrigger) wikiTrigger.style.display = 'none';
        } else {
            const grid = document.getElementById('terms-grid');
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 20px;">'${rawInput}'에 대한 내부 검색 결과가 없습니다.</div>`;
            if (wikiTrigger) wikiTrigger.style.display = 'block';
        }
    });
}

function startWikiSearch() {
    const searchInput = document.getElementById('search-input');
    const rawInput = searchInput.value.trim();
    if (!rawInput) return;

    const grid = document.getElementById('terms-grid');
    const wikiTrigger = document.getElementById('wiki-search-trigger');

    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 20px;">위키백과에서 검색 중... 🌐</div>';
    if (wikiTrigger) wikiTrigger.style.display = 'none';

    fetchWikipedia(rawInput);
}

const FINANCE_KEYWORDS = ['주식', '투자', '증권', '금융', '경제', '상장', '지수', '코스피', '코스닥', '매매', '자산', '펀드', '배당', '수익', '이자', '가격', '화폐', '금리', '환율', '재무', '회계', '부채', '자본', '공매도', '선물', '옵션', '청약', '채권', '증자', '감자', '재무제표', '상한가', '하한가', '매수', '매도'];

async function fetchWikipedia(keyword) {
    try {
        const url = `https://ko.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&gsrlimit=10&prop=extracts&exintro&explaintext&exlimit=10&format=json&origin=*`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.query || !data.query.pages) {
            document.getElementById('terms-grid').innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">결과를 찾을 수 없습니다.</div>';
            return;
        }

        const finalResults = Object.values(data.query.pages)
            .map(page => ({
                keyword: page.title,
                description: page.extract || "내용 없음",
                isExternal: true,
                score: FINANCE_KEYWORDS.some(k => (page.title + page.extract).includes(k)) ? 100 : 0
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        renderTerms(finalResults, keyword);
    } catch (e) {
        console.error(e);
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderTerms(terms, highlight = '') {
    const grid = document.getElementById('terms-grid');
    if (!grid) return;

    const escapedHighlight = highlight ? escapeRegExp(highlight.trim()) : '';
    const tokens = escapedHighlight ? escapedHighlight.split(/\s+/) : [];

    grid.innerHTML = terms.map(term => {
        let keyword = term.keyword;
        let desc = term.description;
        if (tokens.length > 0) {
            tokens.forEach(t => {
                const re = new RegExp(`(${t})`, 'gi');
                keyword = keyword.replace(re, '<span class="highlight">$1</span>');
                desc = desc.replace(re, '<span class="highlight">$1</span>');
            });
        }
        const badge = term.isExternal ? '<span class="wiki-badge">위키백과</span>' : '';
        return `<article class="term-card"><h3>${keyword}${badge}</h3><p>${desc}</p></article>`;
    }).join('');
}

// --- New Interactive Features ---

function renderQuotes() {
    const quotes = CONTENT_DB.quotes || [];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteEl = document.getElementById('today-quote');
    if (quoteEl) quoteEl.textContent = `"${randomQuote}"`;
}

let currentQuestionIndex = 0;
let quizScore = 0;

function startQuiz() {
    document.getElementById('start-quiz-btn').style.display = 'none';
    document.getElementById('quiz-question-box').style.display = 'block';
    currentQuestionIndex = 0;
    quizScore = 0;
    showQuestion();
}

function showQuestion() {
    const question = CONTENT_DB.quiz[currentQuestionIndex];
    document.getElementById('quiz-question').textContent = `${currentQuestionIndex + 1}. ${question.question}`;
    const optionsGrid = document.getElementById('quiz-options');
    optionsGrid.innerHTML = question.options.map(opt => `
        <button class="quiz-option-btn" onclick="selectOption(${opt.score})">${opt.text}</button>
    `).join('');
}

function selectOption(score) {
    quizScore += score;
    currentQuestionIndex++;
    if (currentQuestionIndex < CONTENT_DB.quiz.length) showQuestion();
    else showQuizResult();
}

function showQuizResult() {
    document.getElementById('quiz-question-box').style.display = 'none';
    const resultBox = document.getElementById('quiz-result-box');
    resultBox.style.display = 'block';

    const typeEl = document.getElementById('quiz-result-type');
    const descEl = document.getElementById('quiz-result-desc');

    const avgScore = quizScore / CONTENT_DB.quiz.length;
    if (avgScore <= 1.3) {
        typeEl.textContent = "신중한 거북이 🐢";
        descEl.textContent = "원금 보장을 최우선으로 생각하시네요! 안전한 자산 위주로 시작하세요.";
    } else if (avgScore <= 2.3) {
        typeEl.textContent = "꾸준한 일벌 🐝";
        descEl.textContent = "위험과 수익의 균형을 아는 투자자입니다! ETF와 배당주가 제격입니다.";
    } else {
        typeEl.textContent = "용감한 사자 🦁";
        descEl.textContent = "공격적인 투자가 체질이시군요! 하지만 리스크 관리도 잊지 마세요.";
    }
}

function resetQuiz() {
    document.getElementById('quiz-result-box').style.display = 'none';
    document.getElementById('start-quiz-btn').style.display = 'block';
    document.getElementById('quiz-question-box').style.display = 'none'; // Reset to initial state
}

function copyQuizResult() {
    const type = document.getElementById('quiz-result-type').textContent;
    const text = `[투자 MBTI 결과] 저는 '${type}' 유형입니다! 📈\n확인하기: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => alert("결과가 복사되었습니다!"));
}

const checklistIds = ['check-news', 'check-indices', 'check-holdings', 'check-plan', 'check-diary'];

function getTodayKey() {
    const now = new Date();
    return `routine_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function saveChecklist() {
    const status = {};
    let count = 0;
    checklistIds.forEach(id => {
        const checked = document.getElementById(id).checked;
        status[id] = checked;
        if (checked) count++;
    });

    // Save today's progress
    const todayKey = getTodayKey();
    localStorage.setItem(todayKey, JSON.stringify(status));

    // Also update history list
    updateProgress(count);
    renderChecklistHistory();
}

function loadChecklist() {
    const todayKey = getTodayKey();
    const saved = localStorage.getItem(todayKey);

    let count = 0;
    if (saved) {
        const status = JSON.parse(saved);
        checklistIds.forEach(id => {
            if (status[id]) {
                const el = document.getElementById(id);
                if (el) el.checked = true;
                count++;
            }
        });
    }

    updateProgress(count);
    renderChecklistHistory();
}

function updateProgress(count) {
    const total = checklistIds.length;
    const countEl = document.getElementById('check-count');
    const fillEl = document.getElementById('progress-fill');
    if (countEl) countEl.textContent = `완료: ${count}/${total}`;
    if (fillEl) fillEl.style.width = `${(count / total) * 100}%`;
}

function renderChecklistHistory() {
    const historyList = document.getElementById('routine-history-list');
    if (!historyList) return;

    const historyData = [];
    const now = new Date();

    // Get last 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const key = `routine_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const label = i === 0 ? "오늘" : `${date.getMonth() + 1}/${date.getDate()}`;

        const saved = localStorage.getItem(key);
        let completedCount = 0;
        if (saved) {
            const status = JSON.parse(saved);
            Object.values(status).forEach(v => { if (v) completedCount++; });
        }
        historyData.push({ label, count: completedCount });
    }

    historyList.innerHTML = historyData.map(item => {
        const percent = (item.count / 5) * 100;
        const color = percent === 100 ? 'var(--accent-color)' : (percent >= 60 ? '#a78bfa' : '#4b5563');
        return `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="width: 50px; font-size: 0.85rem; color: var(--text-secondary);">${item.label}</span>
                <div style="flex: 1; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${percent}%; height: 100%; background: ${color}; transition: width 0.3s;"></div>
                </div>
                <span style="font-size: 0.85rem; font-weight: 600; color: ${item.count > 0 ? 'var(--text-primary)' : 'var(--text-secondary)'}">${item.count}/5</span>
            </div>
        `;
    }).join('');
}

// --- Content Rendering ---

function renderMistakes(mistakes) {
    const container = document.getElementById('mistakes-list');
    if (!container) return;
    container.innerHTML = mistakes.map((m, i) => `
        <article class="mistake-item">
            <div class="mistake-header" id="mistake-header-${i}" onclick="toggleMistake(${i})">
                <h3>${m.title}</h3><span class="toggle-icon">+</span>
            </div>
            <div class="mistake-body" id="mistake-${i}">
                <p><strong>Problem:</strong> ${m.problem}</p>
                <p><strong>Solution:</strong> ${m.solution}</p>
            </div>
        </article>
    `).join('');
}

function toggleMistake(i) {
    const header = document.getElementById(`mistake-header-${i}`);
    if (header) {
        header.classList.toggle('active');
    }
}

function renderGuides(guides) {
    const container = document.getElementById('guide-roadmap');
    if (!container) return;
    container.innerHTML = guides.map(g => `
        <article class="roadmap-step">
            <span class="step-number">${g.step}</span>
            <h3>${g.title}</h3><p>${g.content}</p>
        </article>
    `).join('');
}

function renderFAQs(faqs) {
    const container = document.getElementById('faq-list');
    if (!container) return;
    container.innerHTML = faqs.map((f, i) => `
        <article class="faq-item" id="faq-${i}">
            <div class="faq-question" onclick="toggleFAQ(${i})">
                <span>${f.question}</span><span class="toggle-icon">+</span>
            </div>
            <div class="faq-answer"><p>${f.answer}</p></div>
        </article>
    `).join('');
}

function toggleFAQ(i) {
    const el = document.getElementById(`faq-${i}`);
    el.classList.toggle('active');
}

function renderBooks(books) {
    const grid = document.getElementById('books-grid');
    if (!grid) return;
    grid.innerHTML = books.map(b => `<article class="book-card"><span>${b.author}</span><h3>${b.title}</h3><p>${b.desc}</p></article>`).join('');
}

// --- Calculators ---
function switchTab(type) {
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.calc-card');

    // Remove active class from all tabs and hide all cards
    tabs.forEach(tab => tab.classList.remove('active'));
    cards.forEach(card => card.style.display = 'none');

    // Find the correct button and show corresponding card
    // Use the onclick attribute to find the matching button for better reliability
    tabs.forEach(tab => {
        if (tab.getAttribute('onclick').includes(`'${type}'`)) {
            tab.classList.add('active');
        }
    });

    const targetCard = document.getElementById(`${type}-calc`);
    if (targetCard) targetCard.style.display = 'block';
}

let myChart = null;

function calculateCompound() {
    const P = parseFloat(document.getElementById('principal').value) || 0;
    const PMT = parseFloat(document.getElementById('monthly-add').value) || 0;
    const rate = (parseFloat(document.getElementById('rate').value) || 0) / 100 / 12;
    const years = parseFloat(document.getElementById('years').value) || 0;
    const months = years * 12;

    let chartData = [];
    let labels = [];
    for (let y = 0; y <= years; y++) {
        const m = y * 12;
        const amount = rate === 0 ? P + (PMT * m) : P * Math.pow(1 + rate, m) + PMT * ((Math.pow(1 + rate, m) - 1) / rate);
        chartData.push(Math.round(amount));
        labels.push(`${y}년`);
    }

    const final = chartData[chartData.length - 1];
    document.getElementById('compound-result').style.display = 'block';
    document.getElementById('compound-result').querySelector('.result-text').innerHTML = `
        <h4>최종 예상 자산</h4>
        <div class="amount">${final.toLocaleString()}원</div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 5px;">${years}년 후 복리 효과가 적용된 금액입니다.</p>
    `;

    // Expert Tip Logic
    const tipEl = document.getElementById('compound-tip');
    if (tipEl) {
        let tipMsg = "꾸준한 적립과 시간의 힘이 만나 큰 자산을 만듭니다.";
        if (rate * 12 > 0.15) tipMsg = "연 15% 이상의 수익률은 매우 공격적인 목표입니다. 리스크 관리가 필수입니다!";
        else if (years < 5) tipMsg = "복리의 마법은 시간이 흐를수록 커집니다. 5년 이상의 장기 투자를 고려해보세요.";
        tipEl.textContent = `💡 전문가 조언: ${tipMsg}`;
        tipEl.style.display = 'block';
    }

    renderChart(labels, chartData);
}

function renderChart(labels, data) {
    const ctx = document.getElementById('compoundChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: '자산', data, borderColor: '#d4af37', fill: true, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function calculateDividend() {
    const count = parseFloat(document.getElementById('stock-count').value) || 0;
    const div = parseFloat(document.getElementById('div-per-share').value) || 0;
    const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
    const tax = (count * div) * (taxRate / 100);
    const final = (count * div) - tax;

    const resultDiv = document.getElementById('dividend-result');
    resultDiv.style.display = 'block';
    resultDiv.querySelector('.result-text').innerHTML = `
        <h4>세후 실수령액</h4>
        <div class="amount">${Math.round(final).toLocaleString()}원</div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 5px;">세금 약 ${Math.round(tax).toLocaleString()}원이 공제되었습니다.</p>
    `;

    const tipEl = document.getElementById('dividend-tip');
    if (tipEl) {
        tipEl.textContent = final < 100000 ? "💡 전문가 조언: 적은 배당금이라도 재투자하면 훗날 큰 복리 효과를 불러옵니다." : "💡 전문가 조언: 정기적인 현금 흐름은 투자 심리를 안정시키는 좋은 무기가 됩니다.";
        tipEl.style.display = 'block';
    }
}

function calculateWatering() {
    const p1 = parseFloat(document.getElementById('current-price').value) || 0;
    const c1 = parseFloat(document.getElementById('current-count').value) || 0;
    const p2 = parseFloat(document.getElementById('new-price').value) || 0;
    const c2 = parseFloat(document.getElementById('new-count').value) || 0;

    const totalCost = (p1 * c1) + (p2 * c2);
    const totalCount = c1 + c2;
    const avg = totalCount > 0 ? totalCost / totalCount : 0;

    const resultDiv = document.getElementById('water-result');
    resultDiv.style.display = 'block';
    resultDiv.querySelector('.result-text').innerHTML = `
        <h4>최종 평단가</h4>
        <div class="amount">${Math.round(avg).toLocaleString()}원</div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 5px;">총 ${totalCount.toLocaleString()}주 보유 (총 매수금액: ${Math.round(totalCost).toLocaleString()}원)</p>
    `;

    const tipEl = document.getElementById('water-tip');
    if (tipEl) {
        const dropRate = ((p1 - p2) / p1) * 100;
        tipEl.textContent = dropRate > 10 ? "💡 전문가 조언: 하락폭이 큽니다. 기업의 펀더멘털에 문제가 없다면 평단가를 낮출 좋은 기회입니다." : "💡 전문가 조언: 하락폭이 크지 않을 때는 물타기 효과가 미미할 수 있으니 주의하세요.";
        tipEl.style.display = 'block';
    }
}

function renderBlog() {
    const container = document.getElementById('blog-posts-container');
    if (!container || !CONTENT_DB.blog_posts) return;

    const sortedPosts = [...CONTENT_DB.blog_posts].sort((a, b) => b.date.localeCompare(a.date));
    const latestPostId = sortedPosts[0].id;

    container.innerHTML = sortedPosts.map(post => {
        const isNew = post.id === latestPostId;
        const newBadge = isNew ? '<span class="new-badge">NEW</span>' : '';

        return `
        <article class="post-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                    <span class="tag">Secret TIP #${post.id}</span>
                    ${newBadge}
                </div>
                <span class="blog-meta">${post.date}</span>
            </div>
            <h2 class="post-title">${post.title}</h2>
            <div class="post-content">
                ${post.content}
            </div>
        </article>
    `}).join('');
}



