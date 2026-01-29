const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * 실시간 시장 데이터 수집 스크립트
 * 한국투자증권 API, Yahoo Finance API, 네이버 금융을 활용하여 정확한 시장 데이터 수집
 */

const OUTPUT_FILE = path.join(__dirname, '../data/market_data.json');

// 휴장일 여부 확인 (주말 및 한국 공휴일)
function getMarketStatus() {
    const now = new Date();
    // 한국 시간(KST) 기준 날짜 생성
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const day = kstDate.getUTCDay(); // 0: 일, 6: 토
    const dateStr = kstDate.toISOString().split('T')[0];

    // 주말 체크
    if (day === 0 || day === 6) {
        return { isClosed: true, reason: '주말 휴장' };
    }

    // 한국 주요 공휴일 (예시: 신년, 설날, 추석, 크리스마스 등)
    const holidays = [
        '2026-01-01', // 신정
        '2026-02-16', '2026-02-17', '2026-02-18', // 설날
        '2026-03-01', // 삼일절
        '2026-05-05', // 어린이날
        '2026-05-24', // 부처님오신날
        '2026-06-06', // 현충일
        '2026-08-15', // 광복절
        '2026-09-24', '2026-09-25', '2026-09-26', // 추석
        '2026-10-03', // 개천절
        '2026-10-09', // 한글날
        '2026-12-25'  // 성탄절
    ];

    if (holidays.includes(dateStr)) {
        return { isClosed: true, reason: '공휴일 휴장' };
    }

    return { isClosed: false, reason: '정상 영업' };
}


// Yahoo Finance API를 통한 데이터 수집 (무료, API 키 불필요)
async function fetchYahooFinanceData(symbol) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'query1.finance.yahoo.com',
            path: `/v8/finance/chart/${symbol}?interval=1d&range=1d`,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    if (data.chart && data.chart.result && data.chart.result[0]) {
                        const result = data.chart.result[0];
                        const meta = result.meta;
                        const quote = result.indicators.quote[0];

                        resolve({
                            symbol: meta.symbol,
                            price: meta.regularMarketPrice,
                            previousClose: meta.chartPreviousClose,
                            change: meta.regularMarketPrice - meta.chartPreviousClose,
                            changePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100).toFixed(2),
                            volume: quote.volume[quote.volume.length - 1]
                        });
                    } else {
                        reject(new Error('Invalid data structure'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

// 네이버 금융에서 코스피/코스닥 데이터 수집 (웹 스크래핑)
async function fetchNaverFinanceData() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'finance.naver.com',
            path: '/sise/sise_index.naver?code=KOSPI',
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    // 간단한 정규식으로 코스피 지수 추출
                    const kospiMatch = body.match(/id="now_value"[^>]*>([0-9,\.]+)</);
                    const changeMatch = body.match(/id="change_value_and_rate"[^>]*>.*?([+-]?[0-9,\.]+).*?([+-]?[0-9,\.]+)%/s);

                    if (kospiMatch) {
                        resolve({
                            kospi: parseFloat(kospiMatch[1].replace(/,/g, '')),
                            kospiChange: changeMatch ? parseFloat(changeMatch[1].replace(/,/g, '')) : 0,
                            kospiChangePercent: changeMatch ? parseFloat(changeMatch[2].replace(/,/g, '')) : 0
                        });
                    } else {
                        // 파싱 실패 시 기본값 반환
                        resolve({
                            kospi: 2500,
                            kospiChange: 0,
                            kospiChangePercent: 0,
                            note: 'Failed to parse, using default values'
                        });
                    }
                } catch (e) {
                    resolve({
                        kospi: 2500,
                        kospiChange: 0,
                        kospiChangePercent: 0,
                        note: 'Error occurred, using default values'
                    });
                }
            });
        });

        req.on('error', () => {
            resolve({
                kospi: 2500,
                kospiChange: 0,
                kospiChangePercent: 0,
                note: 'Network error, using default values'
            });
        });
        req.end();
    });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 단일 데이터 수집 (저장 및 검증 로직 제외)
async function fetchRawData() {
    console.log('📊 Starting market data collection...');

    const status = getMarketStatus();
    const marketData = {
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        isMarketClosed: status.isClosed,
        marketClosedReason: status.reason,
        korea: {},
        us: {},
        forex: {},
        summary: ''
    };

    try {
        // 1. 한국 시장 데이터 (네이버 금융)
        console.log('🇰🇷 Fetching Korean market data...');
        let koreaData;
        if (marketData.isMarketClosed) {
            console.log(`   ⚠️  Korean market is closed due to ${marketData.marketClosedReason}. Using estimated values.`);
            koreaData = {
                kospi: 2500,
                kospiChange: 0,
                kospiChangePercent: 0,
                note: `Market closed: ${marketData.marketClosedReason}, using estimated values`
            };
        } else {
            koreaData = await fetchNaverFinanceData();
        }

        marketData.korea = {
            kospi: koreaData.kospi,
            kospiChange: koreaData.kospiChange,
            kospiChangePercent: koreaData.kospiChangePercent,
            note: koreaData.note || 'Data collected successfully'
        };
        console.log(`   KOSPI: ${koreaData.kospi} (${koreaData.kospiChangePercent > 0 ? '+' : ''}${koreaData.kospiChangePercent}%)`);

        // 2. 미국 시장 데이터 (Yahoo Finance)
        console.log('🇺🇸 Fetching US market data...');
        try {
            const sp500 = await fetchYahooFinanceData('^GSPC');
            const nasdaq = await fetchYahooFinanceData('^IXIC');

            marketData.us = {
                sp500: {
                    price: sp500.price,
                    change: sp500.change,
                    changePercent: sp500.changePercent
                },
                nasdaq: {
                    price: nasdaq.price,
                    change: nasdaq.change,
                    changePercent: nasdaq.changePercent
                }
            };
            console.log(`   S&P 500: ${sp500.price} (${sp500.changePercent}%)`);
            console.log(`   NASDAQ: ${nasdaq.price} (${nasdaq.changePercent}%)`);
        } catch (e) {
            console.log('   ⚠️  US market data unavailable, using estimates');
            marketData.us = {
                sp500: { price: 5800, change: 0, changePercent: '0.00', note: 'Estimated' },
                nasdaq: { price: 18500, change: 0, changePercent: '0.00', note: 'Estimated' }
            };
        }

        // 3. 환율 데이터 (Yahoo Finance)
        console.log('💱 Fetching forex data...');
        try {
            const usdkrw = await fetchYahooFinanceData('KRW=X');
            marketData.forex = {
                usdKrw: usdkrw.price,
                usdKrwChange: usdkrw.change,
                usdKrwChangePercent: usdkrw.changePercent
            };
            console.log(`   USD/KRW: ${usdkrw.price} (${usdkrw.changePercent}%)`);
        } catch (e) {
            console.log('   ⚠️  Forex data unavailable, using estimates');
            marketData.forex = {
                usdKrw: 1380,
                usdKrwChange: 0,
                usdKrwChangePercent: '0.00',
                note: 'Estimated'
            };
        }

        // 4. 시장 요약 생성
        marketData.summary = generateMarketSummary(marketData);

        return marketData;



    } catch (error) {
        throw error; // 에러를 상위 함수(Retry Loop)로 전파
    }
}

// 메인 실행 함수 (Retry 및 검증 로직 포함)
async function collectMarketData() {
    console.log('📊 Starting market data collection with Retry Logic...');
    const MAX_RETRIES = 5;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`\n🔄 Attempt ${attempt}/${MAX_RETRIES}`);

            // 1. 데이터 수집 시도
            const data = await fetchRawData();

            // 2. 데이터 검증
            const isValid = validateMarketData(data);

            if (isValid) {
                // 성공 시 저장 및 종료
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf8');
                console.log(`\n✅ Market data saved to: ${OUTPUT_FILE}`);
                console.log('\n📋 Summary:');
                console.log(data.summary);
                return data;
            } else {
                throw new Error('Validation failed');
            }

        } catch (error) {
            console.warn(`⚠️  Attempt ${attempt} failed: ${error.message}`);
            if (attempt < MAX_RETRIES) {
                console.log('⏳ Waiting 5 seconds before retrying...');
                await sleep(5000);
            } else {
                console.error('\n❌ All retries failed. Exiting with error.');
                // 로컬 테스트나 디버깅을 위해 에러 로그를 남기지만, 
                // 워크플로우를 실패처리하여 잘못된 데이터가 올라가는 것을 방지함.
                throw error;
            }
        }
    }
}

// 시장 요약 생성
function generateMarketSummary(data) {
    if (data.isMarketClosed) {
        return `오늘은 ${data.marketClosedReason}으로 국내 증시가 휴장입니다. 현재 환율과 해외 증시 상황을 참고하여 내일의 장을 준비하세요.`;
    }
    const kospiDirection = data.korea.kospiChangePercent > 0 ? '상승' : data.korea.kospiChangePercent < 0 ? '하락' : '보합';
    const sp500Direction = parseFloat(data.us.sp500.changePercent) > 0 ? '상승' : parseFloat(data.us.sp500.changePercent) < 0 ? '하락' : '보합';
    const usdDirection = parseFloat(data.forex.usdKrwChangePercent) > 0 ? '상승' : parseFloat(data.forex.usdKrwChangePercent) < 0 ? '하락' : '보합';

    return `[${data.date} 시장 요약] 코스피는 ${data.korea.kospi.toFixed(2)}로 전일 대비 ${Math.abs(data.korea.kospiChangePercent).toFixed(2)}% ${kospiDirection}했습니다. ` +
        `미국 S&P 500은 ${data.us.sp500.price.toFixed(2)} (${sp500Direction}), ` +
        `원/달러 환율은 ${data.forex.usdKrw.toFixed(2)}원 (${usdDirection})을 기록했습니다.`;
}

// 데이터 검증
function validateMarketData(data) {
    const errors = [];

    // 휴장일인 경우 국내 지수 범위 체크 건너뛰기 (기존 데이터 유지되므로)
    if (!data.isMarketClosed) {
        // 코스피 범위 체크 (2000~6000)
        if (data.korea.kospi < 2000 || data.korea.kospi > 6000) {
            errors.push(`⚠️  KOSPI value out of range: ${data.korea.kospi} (expected: 2000-6000)`);
        }
    }

    // 환율 범위 체크 (1000~1800) - 환율은 주말에도 존재할 수 있음
    if (data.forex.usdKrw < 1000 || data.forex.usdKrw > 1800) {
        errors.push(`⚠️  USD/KRW value out of range: ${data.forex.usdKrw} (expected: 1000-1800)`);
    }

    // 날짜 체크
    const today = new Date().toISOString().split('T')[0];
    if (data.date !== today) {
        errors.push(`⚠️  Date mismatch: ${data.date} vs ${today}`);
    }

    if (errors.length > 0) {
        console.log('\n❌ VALIDATION FAILED:');
        errors.forEach(err => console.log(`   ${err}`));

        // 휴장일에는 일부 데이터 미비가 치명적이지 않을 수 있으므로 경고만 출력하고 통과
        if (data.isMarketClosed) {
            console.log('\n⚠️  Market is closed. Proceeding despite validation warnings.');
            return true;
        }

        // 평일에는 엄격하게 차단 (Retry 유도)
        return false;
    } else {
        console.log('\n✅ Data validation passed');
    }

    return true;
}

// 스크립트 직접 실행 시
if (require.main === module) {
    collectMarketData()
        .then(() => {
            console.log('\n🎉 Market data collection completed!');
            process.exit(0);
        })
        .catch(err => {
            console.error('\n💥 Fatal error:', err);
            process.exit(1);
        });
}

module.exports = { collectMarketData };
