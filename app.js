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

    // Get today's date in YYYY-MM-DD format (User's local time)
    const today = new Date().toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD

    // Filter posts: show if no publishDate (legacy) OR publishDate is today or past
    const visiblePosts = CONTENT_DB.blog_posts.filter(post => {
        if (!post.publishDate) return true;
        return post.publishDate <= today;
    });

    const sortedPosts = [...visiblePosts].sort((a, b) => b.date.localeCompare(a.date));

    if (sortedPosts.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem; color: var(--text-secondary);">아직 등록된 게시글이 없습니다.</p>';
        return;
    }

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


// ========================================
// Trading Journal Feature
// ========================================

const JOURNAL_STORAGE_KEY = 'trading_journal_data';

// Initialize Journal on page load
document.addEventListener('DOMContentLoaded', () => {
    initTradingJournal();
});

function initTradingJournal() {
    const form = document.getElementById('journal-form');
    if (!form) return;

    // Set default date to today
    const dateInput = document.getElementById('trade-date');
    if (dateInput) {
        dateInput.value = new Date().toLocaleDateString('en-CA');
    }

    // Form submit handler
    form.addEventListener('submit', handleJournalSubmit);

    // Load existing data
    loadJournalData();
}

function handleJournalSubmit(e) {
    e.preventDefault();

    const date = document.getElementById('trade-date').value;
    const stockName = document.getElementById('stock-name').value.trim();
    const tradeType = document.getElementById('trade-type').value;
    const quantity = parseInt(document.getElementById('trade-quantity').value);
    const price = parseInt(document.getElementById('trade-price').value);
    const memo = document.getElementById('trade-memo').value.trim();

    if (!date || !stockName || !quantity || !price) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }

    const trade = {
        id: Date.now(),
        date,
        stockName,
        tradeType,
        quantity,
        price,
        total: quantity * price,
        memo
    };

    // Save to localStorage
    const trades = getJournalData();
    trades.push(trade);
    saveJournalData(trades);

    // Reset form
    document.getElementById('journal-form').reset();
    document.getElementById('trade-date').value = new Date().toLocaleDateString('en-CA');

    // Refresh display
    loadJournalData();

    // Show success feedback
    showJournalFeedback('✅ 매매 기록이 추가되었습니다!');
}

function getJournalData() {
    const data = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveJournalData(trades) {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(trades));
}

function loadJournalData() {
    const trades = getJournalData();
    renderJournalTable(trades);
    updateJournalStats(trades);
}

function renderJournalTable(trades) {
    const tbody = document.getElementById('journal-tbody');
    if (!tbody) return;

    if (trades.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="8">아직 기록된 매매 내역이 없습니다. 위에서 첫 기록을 추가해보세요!</td>
            </tr>
        `;
        return;
    }

    // Sort by date (newest first)
    const sortedTrades = [...trades].sort((a, b) => b.date.localeCompare(a.date));

    tbody.innerHTML = sortedTrades.map(trade => {
        const isSell = trade.tradeType === 'sell';
        const profitDisplay = (isSell && trade.realizedProfit !== undefined)
            ? `<div class="trade-profit ${trade.realizedProfit >= 0 ? 'up' : 'down'}">
                ${trade.realizedProfit >= 0 ? '+' : ''}${Math.round(trade.realizedProfit).toLocaleString()}원 
                (${trade.realizedRate >= 0 ? '+' : ''}${trade.realizedRate.toFixed(1)}%)
               </div>`
            : '';

        return `
            <tr data-id="${trade.id}">
                <td>${formatDate(trade.date)}</td>
                <td><strong>${trade.stockName}</strong></td>
                <td><span class="trade-type ${trade.tradeType}">${trade.tradeType === 'buy' ? '매수' : '매도'}</span></td>
                <td>${trade.quantity.toLocaleString()}주</td>
                <td>${trade.price.toLocaleString()}원</td>
                <td>
                    <strong>${trade.total.toLocaleString()}원</strong>
                    ${profitDisplay}
                </td>
                <td style="color: var(--text-secondary); font-size: 0.9rem;">${trade.memo || '-'}</td>
                <td><button class="delete-btn" onclick="deleteJournalEntry(${trade.id})">삭제</button></td>
            </tr>
        `;
    }).join('');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

function updateJournalStats(trades) {
    // Calculate stats
    const totalTrades = trades.length;

    // Group by stock to calculate realized P&L
    const stockGroups = {};
    trades.forEach(trade => {
        if (!stockGroups[trade.stockName]) {
            stockGroups[trade.stockName] = { buys: [], sells: [] };
        }
        if (trade.tradeType === 'buy') {
            stockGroups[trade.stockName].buys.push(trade);
        } else {
            stockGroups[trade.stockName].sells.push(trade);
        }
    });

    let totalProfit = 0;
    let winCount = 0;
    let completedTrades = 0;

    Object.keys(stockGroups).forEach(stock => {
        const group = stockGroups[stock];
        // Sort by date to process chronologically
        const allEvents = [...group.buys, ...group.sells].sort((a, b) => a.date.localeCompare(b.date));

        let inventoryQty = 0;
        let inventoryCost = 0;

        allEvents.forEach(event => {
            if (event.tradeType === 'buy') {
                inventoryQty += event.quantity;
                inventoryCost += event.total;
            } else {
                if (inventoryQty > 0) {
                    const avgBuyPrice = inventoryCost / inventoryQty;
                    const profit = (event.price - avgBuyPrice) * event.quantity;
                    const profitRate = ((event.price / avgBuyPrice) - 1) * 100;

                    event.realizedProfit = profit;
                    event.realizedRate = profitRate;

                    totalProfit += profit;
                    if (profit > 0) winCount++;
                    completedTrades++;

                    // Reduce inventory proportionally
                    const ratio = event.quantity / inventoryQty;
                    inventoryCost -= (inventoryCost * ratio);
                    inventoryQty -= event.quantity;
                }
            }
        });
    });

    const winRate = completedTrades > 0 ? Math.round((winCount / completedTrades) * 100) : 0;
    const avgProfitRate = completedTrades > 0 ? (totalProfit / (trades.filter(t => t.tradeType === 'buy').reduce((sum, t) => sum + t.total, 0) || 1) * 100).toFixed(1) : 0;

    // Update DOM
    const profitEl = document.getElementById('stat-total-profit');
    const winRateEl = document.getElementById('stat-win-rate');
    const totalTradesEl = document.getElementById('stat-total-trades');
    const avgProfitEl = document.getElementById('stat-avg-profit');

    if (profitEl) {
        profitEl.textContent = `${totalProfit >= 0 ? '+' : ''}${Math.round(totalProfit).toLocaleString()}원`;
        profitEl.className = `stat-value ${totalProfit >= 0 ? 'positive' : 'negative'}`;
    }
    if (winRateEl) winRateEl.textContent = `${winRate}%`;
    if (totalTradesEl) totalTradesEl.textContent = `${totalTrades}건`;
    if (avgProfitEl) {
        avgProfitEl.textContent = `${avgProfitRate}%`;
        avgProfitEl.className = `stat-value ${parseFloat(avgProfitRate) >= 0 ? 'positive' : 'negative'}`;
    }
}

function deleteJournalEntry(id) {
    if (!confirm('이 매매 기록을 삭제하시겠습니까?')) return;

    const trades = getJournalData().filter(t => t.id !== id);
    saveJournalData(trades);
    loadJournalData();
    showJournalFeedback('🗑️ 기록이 삭제되었습니다.');
}

function clearAllJournalData() {
    if (!confirm('⚠️ 모든 매매 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;

    localStorage.removeItem(JOURNAL_STORAGE_KEY);
    loadJournalData();
    showJournalFeedback('🗑️ 모든 기록이 삭제되었습니다.');
}

function showJournalFeedback(message) {
    // Simple alert for now, can be upgraded to toast notification
    const btn = document.querySelector('.journal-submit-btn');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = message;
        btn.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    }
}

// Download Functions
function downloadJournalCSV() {
    const trades = getJournalData();
    if (trades.length === 0) {
        alert('다운로드할 매매 기록이 없습니다.');
        return;
    }

    const headers = ['거래일', '종목명', '유형', '수량', '단가', '총액', '메모'];
    const rows = trades.map(t => [
        t.date,
        t.stockName,
        t.tradeType === 'buy' ? '매수' : '매도',
        t.quantity,
        t.price,
        t.total,
        t.memo || ''
    ]);

    // Add BOM for Korean characters in Excel
    const BOM = '\uFEFF';
    const csvContent = BOM + [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');

    downloadFile(csvContent, `주식매매일지_${new Date().toLocaleDateString('en-CA')}.csv`, 'text/csv;charset=utf-8');
}

function downloadJournalExcel() {
    const trades = getJournalData();
    if (trades.length === 0) {
        alert('다운로드할 매매 기록이 없습니다.');
        return;
    }

    // Create HTML table for Excel
    const headers = ['거래일', '종목명', '유형', '수량', '단가', '총액', '메모'];
    const rows = trades.map(t => [
        t.date,
        t.stockName,
        t.tradeType === 'buy' ? '매수' : '매도',
        t.quantity,
        t.price,
        t.total,
        t.memo || ''
    ]);

    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8">
        <style>
            table { border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #d4af37; color: white; font-weight: bold; }
            .buy { background-color: #fee2e2; color: #dc2626; }
            .sell { background-color: #dcfce7; color: #16a34a; }
        </style>
        </head>
        <body>
        <h2>📊 주식 매매일지</h2>
        <p>생성일: ${new Date().toLocaleString('ko-KR')}</p>
        <table>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            ${rows.map(r => `<tr>${r.map((cell, i) => {
        if (i === 2) return `<td class="${cell === '매수' ? 'buy' : 'sell'}">${cell}</td>`;
        return `<td>${cell}</td>`;
    }).join('')}</tr>`).join('')}
        </table>
        </body></html>
    `;

    downloadFile(html, `주식매매일지_${new Date().toLocaleDateString('en-CA')}.xls`, 'application/vnd.ms-excel;charset=utf-8');
}

function downloadEmptyTemplate() {
    const headers = ['거래일', '종목명', '유형(매수/매도)', '수량', '단가', '메모'];
    const exampleRow = ['2026-01-10', '삼성전자', '매수', '10', '70000', '실적 발표 전 매수'];

    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8">
        <style>
            body { font-family: 'Malgun Gothic', sans-serif; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            th { background-color: #6366f1; color: white; font-weight: bold; font-size: 14px; }
            .header-info { background: #f8fafc; padding: 20px; border-radius: 8px; border-bottom: 3px solid #6366f1; }
            .title { color: #1e293b; font-size: 24px; font-weight: bold; margin: 0; }
            .subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }
            .example { background-color: #f1f5f9; color: #475569; font-style: italic; }
            .guide-box { margin-top: 30px; padding: 15px; background: #fffbeb; border-left: 4px solid #f59e0b; font-size: 13px; color: #92400e; }
        </style>
        </head>
        <body>
        <div class="header-info">
            <h1 class="title">📈 Smart Guide 주식 매매일지 템플릿</h1>
            <p class="subtitle">체계적인 기록이 성공적인 투자의 시작입니다.</p>
        </div>
        <table>
            <thead>
                <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
                <tr class="example">${exampleRow.map(cell => `<td>${cell}</td>`).join('')}</tr>
                ${Array(30).fill('<tr>' + headers.map(() => '<td></td>').join('') + '</tr>').join('')}
            </tbody>
        </table>
        <div class="guide-box">
            <strong>💡 작성 가이드</strong><br>
            • 거래일: YYYY-MM-DD 형식으로 입력하세요 (예: 2026-01-13)<br>
            • 유형: '매수' 또는 '매도'라고 정확히 입력하세요.<br>
            • 단가: 숫자만 입력하세요 (콤마 제외).<br>
            • 메모: 매매 이유나 당시 심리 상태를 적으면 복기에 큰 도움이 됩니다.
        </div>
        </body></html>
    `;

    downloadFile(html, `SmartGuide_매매일지_템플릿.xls`, 'application/vnd.ms-excel;charset=utf-8');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
