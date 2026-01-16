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
    renderMarketBrief();
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
        const detailBtn = term.detail_link ? `<a href="${term.detail_link}" class="detail-link-btn">심화 분석 읽어보기 →</a>` : '';
        return `
            <article class="term-card">
                <h3>${keyword}${badge}</h3>
                <p>${desc}</p>
                ${detailBtn}
            </article>
        `;
    }).join('');
}

// --- New Interactive Features ---

function renderMarketBrief() {
    const brief = CONTENT_DB.market_brief || "오늘도 차분한 마음으로 시장을 바라보며 원칙 투자를 이어가세요.";
    const briefEl = document.getElementById('market-brief-text');
    if (briefEl) {
        briefEl.textContent = brief;
    }
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
                <div class="mistake-title-group">
                    <span class="error-badge">CAUTION</span>
                    <h3>${m.title}</h3>
                </div>
                <span class="toggle-icon">+</span>
            </div>
            <div class="mistake-body" id="mistake-${i}">
                <div class="mistake-inner">
                    <p class="mistake-prob"><strong>❌ 문제 상황:</strong> ${m.problem}</p>
                    <p class="mistake-sol"><strong>✅ 선배의 조언:</strong> ${m.solution}</p>
                    ${m.detail_link ? `<a href="${m.detail_link}" class="hub-link-text">관련 실전 사례 보기 →</a>` : ''}
                </div>
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
            <div class="step-label">STEP ${g.step}</div>
            <div class="roadmap-content">
                <h3>${g.title}</h3>
                <p>${g.content}</p>
                ${g.detail_link ? `<a href="${g.detail_link}" class="hub-link-text">상세 가이드 보기 →</a>` : ''}
            </div>
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
    grid.innerHTML = books.map(b => `
        <article class="book-card">
            <div class="book-tag">MUST READ</div>
            <span class="book-author">${b.author}</span>
            <h3>${b.title}</h3>
            <p>${b.desc}</p>
            <div class="book-footer">주린이 필독서  추천 ⭐⭐⭐⭐⭐</div>
        </article>
    `).join('');
}

// --- Calculators ---
function switchTab(type) {
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.lab-card');

    // Remove active class from all tabs and hide all cards
    tabs.forEach(tab => tab.classList.remove('active'));
    cards.forEach(card => card.style.display = 'none');

    // Find the correct button and show corresponding card
    tabs.forEach(tab => {
        if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(`'${type}'`)) {
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

// --- AI Analysis Functions ---

function handleWaterfallAnalysis() {
    const p1 = parseFloat(document.getElementById('current_avg').value);
    const c1 = parseFloat(document.getElementById('current_qty').value);
    const p2 = parseFloat(document.getElementById('buy_price').value);
    const c2 = parseFloat(document.getElementById('buy_qty').value);

    if (!p1 || !c1 || !p2 || !c2) {
        alert("모든 값을 입력해주세요.");
        return;
    }

    const totalCost = (p1 * c1) + (p2 * c2);
    const totalCount = c1 + c2;
    const newAvg = totalCost / totalCount;
    const weightIncrease = (c2 / totalCount) * 100;

    const mathResult = document.getElementById('waterfall-math-result');
    mathResult.innerHTML = `
        <div class="math-summary">
            <h3>📈 분석 결과: 평단가 ${Math.round(newAvg).toLocaleString()}원</h3>
            <p>보유 비중이 <strong>${weightIncrease.toFixed(1)}%</strong> 증가하며, 기존 평단가 대비 <strong>${(((p1 - newAvg) / p1) * 100).toFixed(1)}%</strong> 낮아집니다.</p>
        </div>
    `;

    const resultBox = document.getElementById('water-fall-result');
    const aiText = document.getElementById('ai-waterfall-text');

    resultBox.style.display = 'block';
    aiText.innerHTML = "이음스탁 AI 연구원이 리포트를 작성 중입니다. 잠시만 기다려주세요...";

    setTimeout(() => {
        const report = generateWaterfallReport(p1, newAvg, weightIncrease);
        aiText.innerHTML = report;
        saveSimulation('WATERFALL', { p1, c1, p2, c2 }, `평단가 ${Math.round(newAvg).toLocaleString()}원 (비중 ${weightIncrease.toFixed(1)}% 증가)`);
    }, 1500);
}

function generateWaterfallReport(oldAvg, newAvg, weightInc) {
    return `
        <h3>🛡️ 수석 전략가의 물타기 조언</h3>
        본 분석은 <strong>이음스탁 수석 투자 전략가</strong>의 관점에서 작성되었습니다. 현재 추가 매수를 통한 평단가는 ${Math.round(newAvg).toLocaleString()}원으로 산출되었습니다.

        <h3>1. 비중 조절 및 심리 관리</h3>
        평단가를 낮추는 것도 중요하지만, 이번 매수로 인해 전체 포트폴리오에서 해당 종목이 차지하는 <strong>비중이 ${weightInc.toFixed(1)}% 급증</strong>한다는 점에 주목해야 합니다. 하락장에서의 추가 매수는 심리적 압박을 가중시킬 수 있습니다. "평단가가 낮아졌으니 괜찮다"는 안도감보다는, 내가 감당할 수 있는 자산 배분 원칙을 지키고 있는지 냉정하게 검토해야 합니다.

        <h3>2. 기술적 반등과 지지선 확인</h3>
        현재 주가가 주요 <strong>지지선</strong>을 이탈하지 않았는지 확인하십시오. 지지선 근처에서의 <strong>분할 매수 원칙</strong>은 손실을 최소화하는 가장 강력한 무기입니다. 무지성 매수가 아닌, 거래량이 동반된 하락 멈춤 신호를 포착한 뒤 실행하는 것이 중요합니다. <strong>기술적 반등</strong>이 나올 때 비중을 다시 줄여 현금을 확보할 것인지, 아니면 장기 보유할 것인지 시나리오를 미리 세우십시오.

        <h3>3. 체크리스트 및 요약</h3>
        <ul>
            <li>이번 매수 후 전체 자산 중 종목 비중이 30%를 넘지 않습니까?</li>
            <li>추가 매수 자금은 최소 3개월 이내에 쓰지 않아도 되는 여유 자금입니까?</li>
            <li>해당 기업의 실적 악화 등 펀더멘털 이슈가 아닌 시장 전체의 하락입니까?</li>
        </ul>

        <p class="expert-conclusion">이 전략과 함께 <strong><a href="guide-waterfall.html" style="color:var(--accent-color);">물타기 완벽 가이드</a></strong>도 반드시 확인하여 리스크를 관리하세요.</p>
        <p style="font-size: 0.8rem; opacity: 0.7; margin-top:20px;">※ 본 리포트는 입력된 데이터를 기반으로 생성된 참고용이며, 투자의 최종 책임은 본인에게 있습니다.</p>
    `;
}

function handleDividendAnalysis() {
    const P = parseFloat(document.getElementById('invest_p').value);
    const PMT = parseFloat(document.getElementById('monthly_p').value);
    const yieldP = parseFloat(document.getElementById('yield_p').value) / 100;
    const years = parseFloat(document.getElementById('years_p').value);

    if (!P || isNaN(yieldP) || !years) {
        alert("값을 입력해주세요 (초기 투자금, 배당률, 기간은 필수입니다).");
        return;
    }

    // Simplified Compound Dividend calculation
    let totalValue = P;
    const monthlyRate = 1 + (yieldP / 12);
    for (let i = 0; i < years * 12; i++) {
        totalValue = (totalValue + PMT) * monthlyRate;
    }

    const annualDiv = totalValue * yieldP;
    const monthlyDiv = annualDiv / 12;

    const mathResult = document.getElementById('dividend-math-result');
    mathResult.innerHTML = `
        <div class="math-summary">
            <h3>📅 ${years}년 후 시나리오 결과</h3>
            <p>예상 월 배당금: <strong>${Math.round(monthlyDiv).toLocaleString()}원</strong></p>
            <p>예상 총 자산 가치: ${Math.round(totalValue).toLocaleString()}원</p>
        </div>
    `;

    const resultBox = document.getElementById('dividend-result');
    const aiText = document.getElementById('ai-dividend-text');

    resultBox.style.display = 'block';
    aiText.innerHTML = "당신의 경제적 자유 시나리오를 작성 중입니다. 복리의 마법을 계산하는 중...";

    setTimeout(() => {
        const report = generateDividendReport(years, monthlyDiv, yieldP);
        aiText.innerHTML = report;
        saveSimulation('DIVIDEND', { P, PMT, yieldP, years }, `월 배당 ${Math.round(monthlyDiv).toLocaleString()}원 달성 시나리오`);
    }, 1500);
}

function generateDividendReport(years, monthlyDiv, yieldP) {
    const utilityText = monthlyDiv > 1000000 ? "월세를 대체할 수 있는 수준" : (monthlyDiv > 300000 ? "통신비와 식비를 해결하고 남는 수준" : "매월 치킨 몇 마리를 무료로 즐기는 수준");

    return `
        <h3>🌟 수석 전략가의 경제적 자유 리포트</h3>
        ${years}년 동안 꾸준히 투자했을 때, 당신은 매달 <strong>${Math.round(monthlyDiv).toLocaleString()}원</strong>의 현금 흐름을 확보하게 됩니다. 이는 실생활에서 <strong>${utilityText}</strong>입니다.

        <h3>1. 복리의 마법과 배당 재투자(DRIP)</h3>
        단순히 배당금을 받는 것에 그치지 않고, 이를 다시 주식에 투자하는 <strong>배당 재투자(DRIP)</strong> 전략을 실행할 경우 자산의 증가 속도는 기하급수적으로 빨라집니다. 시간은 배당 투자자의 가장 강력한 아군입니다. 초기에 적어 보이는 배당금이 눈덩이처럼 불어나는 과정을 믿으십시오.

        <h3>2. 배당 귀족주와 배당 성향의 중요성</h3>
        성공적인 배당 투자를 위해서는 단순히 배당률이 높은 종목보다는 25년 이상 배당을 늘려온 <strong>배당 귀족주</strong>에 주목해야 합니다. 또한 기업이 이익 중 얼마를 배당으로 주는지 나타내는 <strong>배당 성향</strong>이 지나치게 높지는 않은지 확인하여 배당 삭감 리스크를 관리해야 합니다.

        <h3>3. 경제적 자유를 향한 전략</h3>
        <ul>
            <li>배당 성장률이 물가 상승률보다 높은 기업을 선별했습니까?</li>
            <li> ISA/연금저축 등 절세 계좌를 최대한 활용하고 계십니까?</li>
            <li>주가 하락 시기를 오히려 배당 수익률을 높이는 '세일 기간'으로 보고 계십니까?</li>
        </ul>

        <p class="expert-conclusion">이 전략과 함께 <strong><a href="guide-dividend.html" style="color:var(--accent-color);">배당주 투자 완벽 가이드</a></strong>를 읽고 당신만의 머니트리를 꾸준히 키워가세요.</p>
        <p style="font-size: 0.8rem; opacity: 0.7; margin-top:20px;">※ 본 리포트는 입력된 데이터를 기반으로 생성된 시뮬레이션이며, 실제 투자 결과와 다를 수 있습니다.</p>
    `;
}

function saveSimulation(type, input, summary) {
    const history = JSON.parse(localStorage.getItem('ieum_simulation_history') || '[]');
    history.unshift({
        id: Date.now(),
        type,
        input,
        summary,
        date: new Date().toLocaleString()
    });
    // Keep last 5 only
    localStorage.setItem('ieum_simulation_history', JSON.stringify(history.slice(0, 5)));
}

function renderBlog() {
    const container = document.getElementById('blog-posts-container');
    if (!container || !CONTENT_DB.blog_posts) return;

    // 1. Get URL ID if exists
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = parseInt(urlParams.get('id'));

    // 2. Filter by date (today or past)
    const today = new Date().toLocaleDateString('en-CA');
    const visiblePosts = CONTENT_DB.blog_posts.filter(post => {
        if (!post.publishDate) return true;
        return post.publishDate <= today;
    });

    // 3. Find target post if ID is provided
    let postsToRender = [];
    if (targetId) {
        const found = visiblePosts.find(p => p.id === targetId);
        if (found) {
            postsToRender = [found];
            // Update Title for SEO/UI
            document.title = `${found.title} | 이음스탁 인사이트`;
        } else {
            // If target post not found or not published yet
            container.innerHTML = `<div style="text-align:center; padding: 4rem;"><h3>죄송합니다. 찾으시는 글이 아직 공개되지 않았거나 없는 페이지입니다.</h3><br><a href="blog.html" class="calc-btn">전체 글 보기</a></div>`;
            return;
        }
    } else {
        // Sort descending: newest ID first
        postsToRender = [...visiblePosts].sort((a, b) => b.id - a.id);
    }

    if (postsToRender.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem; color: var(--text-secondary);">아직 등록된 게시글이 없습니다. 곧 찾아옵니다!</p>';
        return;
    }

    const maxIdInDb = Math.max(...visiblePosts.map(p => p.id));

    container.innerHTML = postsToRender.map(post => {
        const isLatest = post.id === maxIdInDb;
        const newBadge = isLatest ? '<span class="new-badge">NEW</span>' : '';

        return `
        <article class="post-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <div>
                    <span class="tag">Insight #${post.id}</span>
                    ${newBadge}
                </div>
                <span class="blog-meta">${post.date}</span>
            </div>
            <h2 class="post-title">${post.title}</h2>
            <div class="post-content">
                ${post.content}
            </div>
            ${targetId ? `<div style="margin-top: 3rem; text-align: center; border-top: 1px solid var(--border-color); padding-top: 2rem;">
                <a href="blog.html" class="calc-btn" style="display: inline-block; width: auto; padding: 0.8rem 2rem;">다른 글 더 읽어보기</a>
            </div>` : ''}
        </article>
    `}).join('');

    if (targetId) {
        window.scrollTo(0, 0);
    }
}


// ========================================
// Trading Journal Feature
// ========================================

const JOURNAL_STORAGE_KEY = 'trading_journal_data';

// Initialize Journal on page load
document.addEventListener('DOMContentLoaded', () => {
    initTradingJournal();
    // Also render blog if on blog page
    if (document.getElementById('blog-posts-container')) {
        renderBlog();
    }
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
    // Calculate stats and attach P/L data to trade objects first
    const updatedTrades = updateJournalStats(trades);
    // Then render the table with the updated data
    renderJournalTable(updatedTrades || trades);
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
                <span class="profit-label">${trade.realizedProfit >= 0 ? '▲' : '▼'}</span>
                ${Math.round(trade.realizedProfit).toLocaleString()}원 
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
    if (!trades || trades.length === 0) {
        // Clear stats if no trades
        updateDOMStats(0, 0, 0, 0);
        return trades;
    }
    const totalTrades = trades.length;

    // Group by stock to calculate realized P&L
    const stockGroups = {};
    trades.forEach(trade => {
        // Normalize stock name for matching (trim and remove extra spaces)
        const normalizedName = trade.stockName.trim().replace(/\s+/g, ' ');
        if (!stockGroups[normalizedName]) {
            stockGroups[normalizedName] = [];
        }
        stockGroups[normalizedName].push(trade);
    });

    let totalProfit = 0;
    let winCount = 0;
    let completedTrades = 0;

    Object.keys(stockGroups).forEach(stock => {
        const events = stockGroups[stock];
        // Sort chronologically: Oldest first. 
        // Tie-break same day: Buy before Sell to ensure inventory is calculated correctly.
        events.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            if (a.tradeType === b.tradeType) return 0;
            return a.tradeType === 'buy' ? -1 : 1;
        });

        let inventoryQty = 0;
        let inventoryCost = 0;

        events.forEach(event => {
            const qty = Number(event.quantity);
            const price = Number(event.price);
            const total = qty * price;

            if (event.tradeType === 'buy') {
                inventoryQty += qty;
                inventoryCost += total;
            } else {
                if (inventoryQty > 0) {
                    const avgBuyPrice = inventoryCost / inventoryQty;
                    // Realized P&L calculation
                    const profit = (price - avgBuyPrice) * qty;
                    const profitRate = ((price / avgBuyPrice) - 1) * 100;

                    // Attach results to the event object
                    event.realizedProfit = profit;
                    event.realizedRate = profitRate;

                    totalProfit += profit;
                    if (profit > 0) winCount++;
                    completedTrades++;

                    // Proportional inventory reduction
                    const sellRatio = Math.min(1, qty / inventoryQty);
                    inventoryCost -= (inventoryCost * sellRatio);
                    inventoryQty -= qty;
                }
            }
        });
    });

    const winRate = completedTrades > 0 ? Math.round((winCount / completedTrades) * 100) : 0;
    const avgProfitRate = completedTrades > 0 ? (totalProfit / (trades.filter(t => t.tradeType === 'buy').reduce((sum, t) => sum + t.total, 0) || 1) * 100).toFixed(1) : 0;

    updateDOMStats(totalProfit, winRate, totalTrades, avgProfitRate);

    return trades;
}

function updateDOMStats(totalProfit, winRate, totalTrades, avgProfitRate) {
    const profitEl = document.getElementById('stat-total-profit');
    const winRateEl = document.getElementById('stat-win-rate');
    const totalTradesEl = document.getElementById('stat-total-trades');
    const avgProfitEl = document.getElementById('stat-avg-profit');

    if (profitEl) {
        profitEl.textContent = `${totalProfit >= 0 ? '+' : ''}${Math.round(totalProfit).toLocaleString()}원`;
        profitEl.className = `stat-value ${totalProfit > 0 ? 'positive' : (totalProfit < 0 ? 'negative' : '')}`;
    }
    if (winRateEl) winRateEl.textContent = `${winRate}%`;
    if (totalTradesEl) totalTradesEl.textContent = `${totalTrades}건`;
    if (avgProfitEl) {
        avgProfitEl.textContent = `${avgProfitRate}%`;
        avgProfitEl.className = `stat-value ${parseFloat(avgProfitRate) > 0 ? 'positive' : (parseFloat(avgProfitRate) < 0 ? 'negative' : '')}`;
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

function downloadJournalExcel() {
    const trades = getJournalData();
    if (trades.length === 0) {
        alert('다운로드할 매매 기록이 없습니다.');
        return;
    }

    // Process trades and get stats
    const stockGroups = {};
    trades.forEach(trade => {
        const normalizedName = trade.stockName.trim().replace(/\s+/g, ' ');
        if (!stockGroups[normalizedName]) stockGroups[normalizedName] = [];
        stockGroups[normalizedName].push(trade);
    });

    let totalProfit = 0;
    let winCount = 0;
    let completedTrades = 0;
    let totalInvestment = 0;

    Object.values(stockGroups).forEach(events => {
        events.sort((a, b) => a.date.localeCompare(b.date));
        let inventoryQty = 0;
        let inventoryCost = 0;
        events.forEach(event => {
            if (event.tradeType === 'buy') {
                inventoryQty += event.quantity;
                inventoryCost += event.total;
                totalInvestment += event.total;
            } else if (inventoryQty > 0) {
                const avgBuyPrice = inventoryCost / inventoryQty;
                const profit = (event.price - avgBuyPrice) * event.quantity;
                event.realizedProfit = profit;
                event.realizedRate = ((event.price / avgBuyPrice) - 1) * 100;
                totalProfit += profit;
                if (profit > 0) winCount++;
                completedTrades++;
                const sellRatio = Math.min(1, event.quantity / inventoryQty);
                inventoryCost -= (inventoryCost * sellRatio);
                inventoryQty -= event.quantity;
            }
        });
    });

    const winRate = completedTrades > 0 ? (winCount / completedTrades * 100).toFixed(1) : 0;
    const avgProfitRate = totalInvestment > 0 ? (totalProfit / totalInvestment * 100).toFixed(1) : 0;

    const headers = ['번호', '거래일', '종목명', '유형', '수량', '단가', '거래금액', '실현수익', '수익률', '메모'];
    const rows = trades.map((t, i) => [
        i + 1,
        t.date,
        t.stockName,
        t.tradeType === 'buy' ? '매수' : '매도',
        t.quantity,
        t.price,
        t.total,
        t.realizedProfit !== undefined ? Math.round(t.realizedProfit) : '-',
        t.realizedRate !== undefined ? t.realizedRate.toFixed(2) + '%' : '-',
        t.memo || ''
    ]);

    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
        <meta charset="UTF-8">
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>투자매매내역</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
            .header-main { background-color: #1e293b; color: #ffffff; font-weight: bold; text-align: center; height: 50pt; font-size: 20pt; font-family: 'Malgun Gothic'; }
            .summary-bar { background-color: #f8fafc; border: 1pt solid #cbd5e1; height: 30pt; font-weight: bold; }
            .summary-label { color: #64748b; font-size: 10pt; text-align: center; }
            .summary-val { font-size: 12pt; text-align: center; }
            .col-header { background-color: #d4af37; color: #ffffff; font-weight: bold; border: 0.5pt solid #000000; text-align: center; height: 25pt; }
            td { border: 0.5pt solid #cbd5e1; padding: 8px; font-family: 'Malgun Gothic'; }
            .buy { color: #ef4444; font-weight: bold; }
            .sell { color: #3b82f6; font-weight: bold; }
            .profit-up { color: #ef4444; background-color: #fef2f2; font-weight: bold; }
            .profit-down { color: #3b82f6; background-color: #eff6ff; font-weight: bold; }
            .positive { color: #ef4444; }
            .negative { color: #3b82f6; }
        </style>
        </head>
        <body>
            <table>
                <tr><td colspan="10" class="header-main">📊 IEUMSTOCK 투자 성과 보고서</td></tr>
                <tr class="summary-bar">
                    <td colspan="2" class="summary-label">총 실현손익</td>
                    <td colspan="3" class="summary-val ${totalProfit >= 0 ? 'positive' : 'negative'}">${Math.round(totalProfit).toLocaleString()}원</td>
                    <td colspan="2" class="summary-label">평균 수익률 / 승률</td>
                    <td colspan="3" class="summary-val">${avgProfitRate}% / ${winRate}%</td>
                </tr>
                <tr><td colspan="10" style="text-align: right; color: #64748b; font-size: 9pt;">출력 일시: ${new Date().toLocaleString('ko-KR')}</td></tr>
                <tr height="25">
                    ${headers.map(h => `<td class="col-header">${h}</td>`).join('')}
                </tr>
                ${rows.map((r, rowIndex) => {
        const trade = trades[rowIndex];
        const profitClass = trade.realizedProfit > 0 ? 'profit-up' : (trade.realizedProfit < 0 ? 'profit-down' : '');
        return `<tr height="20">
                    ${r.map((cell, i) => {
            let styleClass = '';
            if (i === 3) styleClass = trade.tradeType === 'buy' ? 'buy' : 'sell';
            if (i === 7 || i === 8) styleClass = profitClass;
            const displayValue = (typeof cell === 'number' && i !== 0) ? cell.toLocaleString() : cell;
            return `<td class="${styleClass}" style="${(i >= 4 && i <= 7) ? "text-align: right; mso-number-format: '#,##0';" : 'text-align: center;'}">${displayValue}${i === 5 || i === 6 || (i === 7 && cell !== '-') ? '원' : ''}</td>`;
        }).join('')}
                    </tr>`
    }).join('')}
            </table>
        </body></html>
    `;

    // Visual feedback
    const btn = document.querySelector('.excel-btn');
    if (btn && !btn.dataset.loading) {
        btn.dataset.loading = 'true';
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span>⏳</span> 생성 중...';
        setTimeout(() => {
            btn.innerHTML = originalContent;
            delete btn.dataset.loading;
        }, 1200);
    }

    downloadFile(html, `주식매매일지_${new Date().toLocaleDateString('en-CA')}.xls`, 'application/vnd.ms-excel');
}

function downloadEmptyTemplate() {
    const headers = ['번호', '거래일', '종목명', '유형(매수/매도)', '수량', '거래단가', '거래금액(자동)', '매수평단가(매도시)', '참고수익금(자동)', '참고수익률(자동)', '메모'];

    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
        <meta charset="UTF-8">
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Template</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
            .header-main { background-color: #1e293b; color: #ffffff; font-weight: bold; text-align: center; height: 40pt; font-size: 18pt; font-family: 'Malgun Gothic'; }
            .info-bar { background-color: #f1f5f9; color: #475569; font-size: 10pt; height: 25pt; }
            .col-header { background-color: #d4af37; color: #ffffff; font-weight: bold; border: 0.5pt solid #000000; text-align: center; height: 25pt; }
            td { border: 0.5pt solid #cbd5e1; padding: 8px; font-family: 'Malgun Gothic'; }
            .guide-box { background-color: #fffbeb; border: 1pt solid #fde68a; color: #92400e; padding: 15px; }
            .example { color: #94a3b8; font-style: italic; background-color: #f8fafc; }
            .formula-cell { background-color: #fafafa; }
        </style>
        </head>
        <body>
            <table>
                <tr><td colspan="11" class="header-main">📈 IEUMSTOCK 스마트 매매일지 템플릿</td></tr>
                <tr><td colspan="11" class="info-bar">체계적인 기록이 성공적인 투자의 시작입니다. 본 템플릿은 ieumstock.site 서비스와 호환됩니다.</td></tr>
                <tr><td colspan="11"></td></tr>
                
                <tr height="30">
                    ${headers.map(h => `<td class="col-header">${h}</td>`).join('')}
                </tr>

                <!-- Example Row (Row 5) -->
                <tr class="example" height="22">
                    <td>예시</td>
                    <td>2026-01-13</td>
                    <td>삼성전자</td>
                    <td>매도</td>
                    <td>10</td>
                    <td>80000</td>
                    <td x:fmla="=E5*F5">800000</td>
                    <td>75000</td>
                    <td x:fmla="=IF(D5=&quot;매도&quot;,(F5-H5)*E5,0)">50000</td>
                    <td x:fmla="=IF(AND(D5=&quot;매도&quot;,H5>0),(F5-H5)/H5,0)">6.67%</td>
                    <td>전고점 돌파 확인 후 수익실현</td>
                </tr>

                <!-- Empty Rows with formulas (Starting Row 6) -->
                ${Array(100).fill(0).map((_, i) => {
        const row = i + 6;
        return `
                    <tr height="22">
                        <td style="text-align: center; color: #94a3b8;">${i + 1}</td>
                        <td style="mso-number-format: 'yyyy-mm-dd';"></td>
                        <td></td>
                        <td style="text-align: center;"></td>
                        <td style="text-align: right; mso-number-format: '#,##0';"></td>
                        <td style="text-align: right; mso-number-format: '#,##0';"></td>
                        <td class="formula-cell" x:fmla="=E${row}*F${row}" style="text-align: right; mso-number-format: '#,##0'; background-color: #fcfcfc;"></td>
                        <td style="text-align: right; mso-number-format: '#,##0'; color: #64748b;"></td>
                        <td class="formula-cell" x:fmla="=IF(D${row}=&quot;매도&quot;,(F${row}-H${row})*E${row},0)" style="text-align: right; mso-number-format: '#,##0'; color: #ef4444;"></td>
                        <td class="formula-cell" x:fmla="=IF(AND(D${row}=&quot;매도&quot;,H${row}&gt;0),(F${row}-H${row})/H${row},0)" style="text-align: right; mso-number-format: '0.00%'; color: #ef4444;"></td>
                        <td></td>
                    </tr>
                    `;
    }).join('')}
                
                <tr><td colspan="11"></td></tr>
                <tr>
                    <td colspan="11" class="guide-box">
                        <strong>💡 이용 가이드</strong><br>
                        1. <strong>유형:</strong> '매수' 또는 '매도'를 직접 입력하세요.<br>
                        2. <strong>자동 계산:</strong> '거래금액'은 실시간 계산됩니다.<br>
                        3. <strong>수익률/평균단가:</strong> 복잡한 이동평균가 계산은 <strong>IEUMSTOCK.SITE 웹 서비스</strong>가 자동으로 수행합니다. 엑셀에서는 '매수평단가'를 직접 입력할 경우에만 간이 수익을 보여줍니다.
                    </td>
                </tr>
            </table>
        </body></html>
    `;

    // Visual feedback
    const btn = document.querySelector('.template-btn');
    if (btn && !btn.dataset.loading) {
        btn.dataset.loading = 'true';
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span>⏳</span> 다운로드 중...';
        setTimeout(() => {
            btn.innerHTML = originalContent;
            delete btn.dataset.loading;
        }, 1200);
    }

    downloadFile(html, 'IEUMSTOCK_Smart_Template.xls', 'application/vnd.ms-excel');
}

function downloadFile(content, filename, mimeType) {
    try {
        console.log(`[v23:40] Initiating download: \${filename}`);
        const blob = new Blob(['\uFEFF', content], { type: mimeType + ';charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 200);
    } catch (e) {
        console.error('Download execution error:', e);
        alert('다운로드 중 오류가 발생했습니다.');
    }
}
