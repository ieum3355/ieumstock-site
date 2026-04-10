export interface Term {
  keyword: string;
  description: string;
  tags?: string[];
}

export interface Mistake {
  title: string;
  problem: string;
  solution: string;
}

export interface Guide {
  step: string;
  title: string;
  content: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Book {
  title: string;
  author: string;
  desc: string;
}

export interface BlogPost {
  article_info: {
    id: number;
    slug: string;
    title: string;
    author: string;
    date: string;
    publishDate: string;
    category: string;
    tags?: string[];
  };
  seo_metadata: {
    meta_title: string;
    meta_description: string;
    og_image: string;
  };
  content_body: {
    introduction: {
      heading: string;
      text: string;
    };
    core_analysis: {
      sub_heading: string;
      text: string;
      insight_tip?: string;
      icon_type?: 'trend' | 'risk' | 'volume' | 'analysis' | 'psychology' | 'strategy' | 'discipline' | 'market';
    }[];
    practical_guide: {
      heading: string;
      items: {
        title: string;
        description: string;
      }[];
    };
    conclusion: {
      text: string;
      closing_statement: string;
    };
  };
  system_link: {
    target_tool: string;
    related_ticker: string[];
  };
}


export interface QuizOption {
  text: string;
  score: number;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export const CONTENT_DB: {
  terms: Term[];
  mistakes: Mistake[];
  guides: Guide[];
  faqs: FAQ[];
  books: Book[];
  quotes: string[];
  quiz: QuizQuestion[];
  blog_posts: BlogPost[];
} = {
  terms: [
    {
      keyword: "PER (주가수익비율)",
      description: "현재 주가가 1주당 순이익의 몇 배인지 나타내는 지표입니다. 낮을수록 저평가되었다고 봅니다."
    },
    {
      keyword: "PBR (주가순자산비율)",
      description: "주가를 1주당 순자산으로 나눈 값입니다. 1 미만이면 회사의 자산 가치보다 주가가 낮다는 뜻입니다."
    },
    {
      keyword: "매수 vs 매도",
      description: "매수는 주식을 사는 것, 매도는 주식을 파는 것입니다. 붉은색은 상승, 파란색은 하락을 의미합니다."
    },
    {
      keyword: "ROE (자기자본이익률)",
      description: "기업이 자본을 이용해 얼만큼의 이익을 냈는지 나타내는 지표입니다. 높을수록 성장성이 높은 기업일 가능성이 큽니다."
    },
    {
      keyword: "EPS (주당순이익)",
      description: "기업이 벌어들인 순이익을 주식 수로 나눈 값입니다. EPS가 꾸준히 증가하는 기업은 건강한 성장을 하고 있다는 증거입니다."
    },
    {
      keyword: "시가총액 (Market Cap)",
      description: "상장된 주식을 모두 합친 가치입니다. '주가 × 발행주식수'로 계산하며, 기업의 현재 시장 가치를 나타냅니다."
    },
    {
      keyword: "배당수익률",
      description: "주가 대비 배당금을 얼마나 주는지를 나타냅니다. 은행 이자처럼 안정적인 현금 흐름을 중시하는 투자자에게 중요합니다."
    },
    {
      keyword: "ETF (상장지수펀드)",
      description: "특정 지수(예: 코스피, 나스닥)나 테마를 추종하도록 설계된 펀드로, 주식처럼 실시간으로 거래할 수 있어 분산 투자에 유리합니다."
    },
    {
      keyword: "유상증자 (Capital Increase)",
      description: "회사가 주식을 새로 발행하여 주주들에게 돈을 받고 파는 것입니다.",
      tags: ["유상", "증자", "유상 증자"]
    },
    {
      keyword: "무상증자 (Bonus Issue)",
      description: "회사의 돈을 주식으로 바꿔 주주들에게 공짜로 나눠주는 것입니다.",
      tags: ["무상", "증자", "무상 증자"]
    },
    {
      keyword: "유상청약",
      description: "유상증자에 참여하여 새로 발행되는 주식을 사겠다고 신청하는 절차입니다.",
      tags: ["청약", "유상 청약"]
    },
    {
      keyword: "무상청약 (자동 배정)",
      description: "무상증자 시 별도의 신청 없이도 받을 수 있으나, 계좌에 들어오기까지의 확인 절차를 의미하기도 합니다.",
      tags: ["청약", "무상 청약"]
    },
    {
      keyword: "신주인수권 (Preemptive Right)",
      description: "유상증자 시 새로 발행되는 주식을 우선적으로 살 수 있는 권리입니다. 이 권리를 포기하면 '실권'이 됩니다.",
      tags: ["신주인수권", "인수권", "신주"]
    },
    {
      keyword: "실권주 (Forfeited Shares)",
      description: "기존 주주가 신주인수권을 포기하여 남게 된 주식입니다. 주인을 잃은 주식으로 이해하면 쉽습니다.",
      tags: ["실권주", "실권"]
    },
    {
      keyword: "실권주청약",
      description: "주주들이 포기한 신주(실권주)를 일반 투자자들에게 다시 판매하여 청약을 받는 절차입니다.",
      tags: ["실권주청약", "청약"]
    },
    {
      keyword: "레버리지 (Leverage)",
      description: "타인의 자본(빚)을 지렛대 삼아 자기 자본 이익률을 높이는 것입니다. 수익이 클 수 있지만, 손실 역시 비례해서 커지는 양날의 검입니다.",
      tags: ["레버리지", "지렛대", "빚투"]
    },
    {
      keyword: "공매도 (Short Selling)",
      description: "주가 하락이 예상될 때 주식을 빌려서 팔았다가, 나중에 싼 가격에 사서 갚아 차익을 얻는 기법입니다.",
      tags: ["공매도", "숏", "Short"]
    },
    {
      keyword: "손절매 (Stop Loss)",
      description: "추가 손실을 막기 위해 현재 가격이 매수가보다 낮더라도 손해를 감수하고 주식을 파는 것입니다.",
      tags: ["손절", "손절매", "Stop Loss"]
    },
    {
      keyword: "신용융자",
      description: "증권사로부터 돈을 빌려 주식을 사는 거래입니다. 레버리지 투자의 전형적인 방법 중 하나입니다.",
      tags: ["신용", "융자", "빚투"]
    },
    {
      keyword: "미수거래",
      description: "가진 돈보다 더 많은 주식을 3일(결제일) 안에 갚는 조건으로 미리 사는 것입니다. 단기 레버리지 거래입니다.",
      tags: ["미수", "카드"]
    },
    {
      keyword: "금리 (Interest Rate)",
      description: "돈의 가치, 즉 이자율입니다. 일반적으로 금리가 오르면 주식 시장의 자금이 예적금으로 이동하여 주가에 하향 압력을 줍니다.",
      tags: ["금리", "이자", "기준금리"]
    }
  ],
  mistakes: [
    {
      title: "내가 팔면 오르는 이유?",
      problem: "주가가 조금만 떨어져도 불안해서 팔았더니, 다시 급등하는 경험.",
      solution: "이는 '손실 회피 심리' 때문입니다. 단기 등락에 일희일비하지 말고, 처음 세운 매매 원칙을 끝까지 지키는 연습이 필요합니다."
    },
    {
      title: "떨어지는 칼날 잡기",
      problem: "급락하는 주식을 싸다고 덜컥 샀다가, 더 큰 하락을 맞이하는 상황.",
      solution: "바닥은 아무도 알 수 없습니다. 하락 추세가 멈추고 반등하는 신호가 보일 때 분할 매수하는 것이 안전합니다."
    },
    {
      title: "추격 매수 (FOMO)",
      problem: "남들이 다 돈 번다는 소식에 뒤늦게 급등주에 올라타서 고점에 물리는 상황.",
      solution: "이미 떠난 버스는 보내주세요. 다음 기회를 기다리며 저평가된 종목을 미리 공부하는 것이 낫습니다."
    },
    {
      title: "무리한 빚투 (Leverage)",
      problem: "빨리 부자가 되고 싶은 마음에 감당할 수 없는 빚을 내어 투자했다가, 하락장에서 강제 청산당하는 위험.",
      solution: "투자는 여유 자금으로 해야 합니다. 레버리지는 양날의 검이므로, 경험이 부족한 초보 시기에는 절대 금물입니다."
    },
    {
      title: "근거 없는 '몰빵' 투자",
      problem: "한 종목에 전 재산을 투자했다가, 그 기업에 악재가 터져 회복 불가능한 손실을 입는 경우.",
      solution: "계란을 한 바구니에 담지 마세요. 섹터와 자산을 적절히 나누는 포트폴리오 분산 투자가 필수입니다."
    }
  ],
  guides: [
    {
      step: "Step 1",
      title: "투자 기초 및 계좌 개설",
      content: "가장 먼저 증권사를 선택하고 비대면 계좌를 개설하세요. 최근에는 수수료 혜택이 많은 이벤트를 확인하는 것이 좋습니다."
    },
    {
      step: "Step 2",
      title: "종목 선정 방법 배우기",
      content: "자신이 잘 아는 회사의 제품이나 서비스부터 살펴보세요. 재무제표의 매출액과 영업이익이 꾸준한지 확인하는 것이 첫걸음입니다."
    },
    {
      step: "Step 3",
      title: "소액으로 실전 경험하기",
      content: "처음부터 큰 돈을 넣지 마세요. 1주라도 사보면서 시장의 흐름과 자신의 감정이 어떻게 변하는지 관찰하는 과정이 필요합니다."
    },
    {
      step: "Step 4",
      title: "분산 투자 원칙 세우기",
      content: "한 종목에만 몰입하지 말고, 업종이 다른 여러 종목이나 ETF를 섞어서 리스크를 관리하는 습관을 들이세요."
    },
    {
      step: "Step 5",
      title: "지속적인 공부와 기록",
      content: "매매 일지를 써보세요. 왜 샀는지, 왜 팔았는지를 기록하면 나중에 똑같은 실수를 반복하지 않게 됩니다."
    }
  ],
  faqs: [
    {
      question: "주식 투자는 언제 시작하는 것이 좋은가요?",
      answer: "투자의 거장들은 '오늘이 가장 빠른 날'이라고 말합니다. 여유 자금을 가지고 시장을 경험하며 공부를 병행하는 것이 가장 좋습니다."
    },
    {
      question: "분산 투자는 왜 중요한가요?",
      answer: "계란을 한 바구니에 담지 말라는 격언처럼, 한 종목의 위기가 내 자산 전체의 파멸로 이어지는 것을 막기 위한 가장 핵심적인 리스크 관리법입니다."
    },
    {
      question: "상장 폐지란 무엇인가요?",
      answer: "거래소에서 더 이상 주식을 거래할 수 없게 되는 상태를 말합니다. 기업의 재무 상태가 극도로 악화되거나 공시 의무를 위반했을 때 발생하며 투자자에게 큰 손실을 줄 수 있습니다."
    },
    {
      question: "금리와 주가는 어떤 관계인가요?",
      answer: "일반적으로 금리가 오르면 기업의 이자 부담이 커지고 시장의 자금이 예금으로 쏠려 주가는 하락하는 경향이 있습니다. 반대로 금리가 내리면 주가는 부양되는 경우가 많습니다."
    },
    {
      question: "배당금은 언제 입금되나요?",
      answer: "배당기준일에 주식을 보유하고 있어야 하며, 실제 입금은 보통 주주총회 이후 1개월 이내에 계좌로 자동 입금됩니다. 국내 기업은 주로 4월에 배당금을 지급합니다."
    },
    {
      question: "공매도란 무엇인가요?",
      answer: "주식이 없는 상태에서 주식을 빌려 매도한 뒤, 주가가 떨어지면 다시 사서 갚아 차익을 노리는 투자법입니다. 주가 하락 시 수익이 나므로 개인 투자자들이 경계하는 지표이기도 합니다."
    },
    {
      question: "ETF와 펀드의 차이점은 무엇인가요?",
      answer: "펀드는 실시간 거래가 불가능하고 환매에 시간이 걸리지만, ETF는 주식처럼 실시간으로 시장에서 사고팔 수 있어 접근성과 수수료 면에서 유리한 경우가 많습니다."
    },
    {
      question: "PER가 낮으면 무조건 좋은 건가요?",
      answer: "낮을수록 저평가된 것으로 보지만, 기업의 성장이 멈췄거나 산업 자체가 사양길에 접어들어 낮은 경우(가치 함정)도 있으므로 미래 성장성과 함께 봐야 합니다."
    },
    {
      question: "주식 양도소득세는 누구나 내나요?",
      answer: "현재 한국 주식의 경우 대주주(일반적으로 단일 종목 10억 이상 소유) 위주로 과세되지만, 제도 변화가 잦으므로 수시로 확인해야 합니다. 미국 주식은 연 250만원 수익 초과 시 과세됩니다."
    },
    {
      question: "우선주와 보통주의 차이는?",
      answer: "보통주는 경영권을 행사할 수 있는 의결권이 있지만, 우선주는 의결권이 없는 대신 배당금을 보통주보다 조금 더 많이 받는 특징이 있습니다."
    },
    {
      question: "예수금과 증거금의 차이는?",
      answer: "예수금은 계좌에 있는 현금 자체를 의미하며, 증거금은 주식을 사기 위해 담보로 잡힌 일종의 계약금을 말합니다."
    },
    {
      question: "선물과 옵션은 무엇인가요?",
      answer: "미래의 특정 시점에 미리 정한 가격으로 상품을 사거나 팔기로 약속하는 파생상품입니다. 레버리지가 매우 높아 초보자가 접근하기엔 위험도가 극도로 높습니다."
    },
    {
      question: "손절매(Stop-loss)의 기준은?",
      answer: "보통 원금 대비 -10% 등 본인만의 기계적인 규칙을 정하는 것이 좋습니다. 감정에 휘둘려 손실을 방치하면 회복 불가능한 자금 손실로 이어질 수 있습니다."
    },
    {
      question: "재무제표에서 가장 먼저 봐야 할 것은?",
      answer: "매출액의 성장 여부, 영업이익의 흑자 유지, 그리고 빚이 얼마나 있는지 보여주는 부채비율을 가장 먼저 확인하는 것이 기초입니다."
    },
    {
      question: "미국 주식 시장의 거래 시간은?",
      answer: "한국 시간 기준 밤 11시 30분(서머타임 시 10시 30분)에 시작하여 다음 날 새벽 6시(서머타임 시 5시)까지 운영됩니다."
    }
  ],
  books: [
    {
      title: "현명한 투자자",
      author: "벤저민 그레이엄",
      desc: "가치 투자의 아버지 그레이엄의 고전입니다. 투자의 기본 원칙과 안전 마진에 대해 배울 수 있습니다."
    },
    {
      title: "주식 투자자의 인문학",
      author: "박경철",
      desc: "단순한 기술이 아닌 시대의 흐름과 인문학적 관점에서 시장을 바라보는 법을 제시합니다."
    },
    {
      title: "돈의 속성",
      author: "김승호",
      desc: "돈에 대한 철학과 자산가로서의 마음가짐을 다룬 책으로, 초보자들이 경제적 자유를 꿈꿀 수 있게 도와줍니다."
    },
    {
      title: "돈, 뜨겁게 사랑하고 차갑게 다루어라",
      author: "앙드레 코스톨라니",
      desc: "유럽의 워런 버핏이라 불리는 코스톨라니의 투자 철학. 심칠기삼(수익의 90%는 심리)을 강조합니다."
    },
    {
      title: "전설로 떠나는 월가의 영웅",
      author: "피터 린치",
      desc: "생활 속에서 텐배거(10배 수익) 종목을 찾는 법. '아는 것에 투자하라'는 명언을 남긴 실전 투자서입니다."
    },
    {
      title: "재무제표 모르면 주식투자 절대로 하지마라",
      author: "사경인",
      desc: "복합한 숫자가 아닌, 투자자가 꼭 봐야 할 핵심 지표를 쉽게 풀어서 설명해주는 필독서입니다."
    }
  ],
  quotes: [
    "지출하고 남은 돈을 저축하지 말고, 저축하고 남은 돈을 지출하라. - 워런 버핏",
    "투자의 핵심은 시장이 아니라 기업이다. - 피터 린치",
    "인플레이션은 세금 없이 부를 빼앗는 장치다. - 밀턴 프리드먼",
    "가장 위험한 투자는 리스크가 없는 투자다. - 익명",
    "달걀을 한 바구니에 담지 마라. - 분산 투자의 격언",
    "주식 시장은 인내심 없는 사람의 돈을 인내심 있는 사람에게 옮기는 장치다. - 워런 버핏"
  ],
  quiz: [
    {
      question: "투자 원금이 10% 하락했습니다. 당신의 행동은?",
      options: [
        { text: "추가 하락이 무서워 즉시 판다", score: 1 },
        { text: "반등을 기다리며 일단 지켜본다", score: 2 },
        { text: "더 싸게 살 기회라 생각하고 더 산다", score: 3 }
      ]
    },
    {
      question: "어떤 수익률을 목표로 하시나요?",
      options: [
        { text: "예금보다 조금 더 높은 3-5%", score: 1 },
        { text: "시장 평균인 7-10%", score: 2 },
        { text: "큰 수익을 노리는 20% 이상", score: 3 }
      ]
    },
    {
      question: "당신의 여유 자금 규모는?",
      options: [
        { text: "당장 사용해야 할 수도 있는 돈", score: 1 },
        { text: "1~2년 정도는 묶어둘 수 있는 돈", score: 2 },
        { text: "5년 이상 없어도 지장 없는 돈", score: 3 }
      ]
    },
    {
      question: "주식 투자를 하는 주된 목적은 무엇인가요?",
      options: [
        { text: "노후 및 미래를 위한 자산 보호", score: 1 },
        { text: "내 집 마련 등 중단기 목돈 마련", score: 2 },
        { text: "빠른 수익을 통한 자산 증식", score: 3 }
      ]
    },
    {
      question: "최근 1년간 주식 시장의 흐름에 대해 얼마나 알고 계신가요?",
      options: [
        { text: "거의 모른다 (이제 시작하려 함)", score: 1 },
        { text: "유명한 뉴스 정도는 챙겨본다", score: 2 },
        { text: "매일 주가지수와 환율을 체크한다", score: 3 }
      ]
    },
    {
      question: "원금 손실이 발생했을 때 느끼는 감정은?",
      options: [
        { text: "잠을 못 잘 정도로 고통스럽다", score: 1 },
        { text: "속상하지만 투자의 과정이라 생각한다", score: 2 },
        { text: "오히려 저가 매수의 기회라 설렌다", score: 3 }
      ]
    },
    {
      question: "자산의 몇 %를 위험 자산(주식 등)에 배분하고 싶나요?",
      options: [
        { text: "20% 미만", score: 1 },
        { text: "20% ~ 50% 사이", score: 2 },
        { text: "50% 이상 공격적으로", score: 3 }
      ]
    },
    {
      question: "종목을 고를 때 가장 중요하게 보는 것은?",
      options: [
        { text: "재무제표와 안정적인 배당", score: 1 },
        { text: "앞으로의 성장성과 산업 전망", score: 2 },
        { text: "차트 패턴과 실시간 수급", score: 3 }
      ]
    },
    {
      question: "주식 계좌를 얼마나 자주 확인하시나요?",
      options: [
        { text: "한 달에 한두 번", score: 1 },
        { text: "일주일에 한두 번", score: 2 },
        { text: "매일 수시로 확인한다", score: 3 }
      ]
    },
    {
      question: "본인의 투자 성향을 한 마디로 정의한다면?",
      options: [
        { text: "잃지 않는 것이 최우선인 보수주의자", score: 1 },
        { text: "적절한 위험을 감수하는 중도파", score: 2 },
        { text: "높은 수익을 위해 위험을 즐기는 공격수", score: 3 }
      ]
    }
  ],
  blog_posts: [
    {
      article_info: {
        id: 21,
        slug: "truth-of-upper-limit-price-trading",
        title: "상한가 따라잡기(상따), 세력의 설거지를 피하는 3가지 필승 전략",
        author: "ieumstock AI Lab",
        date: "2026.04.10",
        publishDate: "2026-04-10",
        category: "Investment Insight",
        tags: ["상한가매매", "상따전략", "세력패턴", "기술적분석", "리스크관리"]
      },
      seo_metadata: {
        meta_title: "상한가 따라잡기 성공 확률 높이는 법 | 이음스탁 투자 인사이트",
        meta_description: "상한가 도달 종목의 수급 패턴을 분석하여 가짜 상한가와 진짜 주도주를 구분하는 3가지 체크리스트를 공개합니다.",
        og_image: "/assets/images/insight/upper-limit-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "탐욕과 공포가 교차하는 상한가, 당신은 준비되었습니까?",
          text: "주식 시장에서 상한가는 모든 투자자의 시선을 사로잡는 화려한 불꽃과 같습니다. '내일도 상승할 것'이라는 탐욕과 '나만 소외될지 모른다'는 공포가 개미 투자자들을 상한가 잔량 속으로 끌어들입니다. 하지만 준비되지 않은 상한가 매매(상따)는 세력의 차익 실현을 돕는 '설거지'의 희생양이 되기 십상입니다. 변동성의 정점인 상한가에서 살아남기 위한 전략적 접근이 필요합니다."
        },
        core_analysis: [
          {
            sub_heading: "세력은 왜 상한가를 '설계'하는가?",
            text: "세력에게 상한가는 단순한 상승 이상의 의미를 가집니다. 대량의 물량을 개인에게 넘기기 위해 시장의 관심을 극대화하는 '꽃길'을 까는 작업입니다. 특히 거래량이 실리지 않은 채 장 막판에 억지로 문을 닫는 상한가는 익일 갭하락 가능성이 매우 높은 위험 신호입니다. 수급의 균형이 무너지는 순간을 포착해야 합니다.",
            insight_tip: "상한가는 개미를 가두기 위한 가장 화려한 감옥이 될 수 있음을 명심하십시오.",
            icon_type: "strategy"
          },
          {
            sub_heading: "기회비용의 증발: 보이지 않는 손실",
            text: "잘못된 상따로 계좌가 묶이는 순간, 진짜 주도주가 터질 때 진입할 수 있는 '자금의 유동성'이 사라집니다. 글로벌 경제의 불확실성이 커지는 시기에 개별 테마주에 자금이 묶이는 것은 단순 손실을 넘어 투자 기회 자체를 박탈당하는 결과를 초래합니다. 현금 비중이 곧 실력인 이유입니다.",
            icon_type: "risk"
          }
        ],
        practical_guide: {
          heading: "진짜 주도주를 선별하는 '상따' 체크리스트",
          items: [
            {
              title: "오전 10시 이전의 결단",
              description: "오전 10시 이전에 강력하게 상한가에 안착한 종목일수록 익일 상승 확률이 비약적으로 높습니다. 늦은 시간의 상한가는 피로도가 높습니다."
            },
            {
              title: "테마 대장주의 정석",
              description: "단독 종목의 호재보다 해당 업종 전체가 함께 움직이는 주도 테마의 1등주(대장주)여야 합니다. 2등주 이하는 변동성에 취약합니다."
            },
            {
              title: "거래량 잠금 상태 확인",
              description: "상한가 안착 후 잔량이 줄어들지 않고 거래량이 눈에 띄게 소멸되어야 진정한 '매수 대기' 상태입니다."
            }
          ]
        },
        conclusion: {
          text: "상한가는 부의 지름길이 될 수도 있지만, 누군가에겐 파산의 덫입니다. 세력이 파놓은 구덩이에 스스로 걸어 들어가지 마십시오. 투자는 원칙의 산물이며, 상한가라는 강력한 에너지 속에서도 냉정을 유지하는 자만이 승리합니다.",
          closing_statement: "이음스탁이 당신의 흔들리지 않는 매매 원칙이 되겠습니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["KOSPI", "KOSDAQ"]
      }
    },
    {
      article_info: {
        id: 20,
        slug: "patience-in-trading",
        title: "성공적인 투자의 90%는 기다림이다: 낚시꾼의 심리학",
        author: "ieumstock Team",
        date: "2026.04.09",
        publishDate: "2026-04-09",
        category: "Mindset",
        tags: ["투자심리", "인내심", "트레이딩", "마인드컨트롤", "뇌동매매방지"]
      },
      seo_metadata: {
        meta_title: "투자의 90%는 기다림 | 이음스탁 투자 마인드셋",
        meta_description: "충동적인 매매를 멈추고 자신만의 타점이 올 때까지 기다리는 법. 기다림도 실력임을 증명하는 투자 심리학 노트를 공유합니다.",
        og_image: "/assets/images/insight/patience-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "매수 버튼을 누르기 전, 10초의 정적이 당신을 구합니다.",
          text: "초보 투자자와 프로 트레이더를 가르는 결정적인 차이는 '매매 횟수'가 아니라 '기다리는 능력'입니다. 시장은 1년 365일 쉬지 않고 돌아가지만, 당신의 자금은 유한합니다. 낚시꾼이 월척을 기다리듯, 투자자 역시 최고의 확률이 보장되는 순간까지 복지부동(伏地不動)할 수 있어야 합니다."
        },
        core_analysis: [
          {
            sub_heading: "자금은 유한하고 기회는 무한하다",
            text: "시장은 항상 열려 있고 기회는 매일 오지만, 실패한 한 번의 매매로 인해 기회를 잡을 자금이 사라지면 그것으로 끝입니다. 준비되지 않은 상태에서 자금을 투입하는 것은 기회비용을 날리는 지름길입니다. 현금을 보유하는 것도 하나의 강력한 포지션임을 잊지 마십시오.",
            insight_tip: "현금 100% 상태는 가장 완벽한 방어이자, 가장 공격적인 대기 상태입니다.",
            icon_type: "psychology"
          },
          {
            sub_heading: "기다림이 주는 '선별적' 복리의 마법",
            text: "좋은 진입 타점을 기다리는 행위 자체가 손실 확률을 줄이는 가장 강력한 필터링입니다. 무분별한 매매로 인한 수수료와 세금, 그리고 정신적 피로도를 계산하십시오. 가장 유리한 전장에서만 싸우는 장수가 승리하듯, 차트의 응축이 완료된 시점까지 기다리는 인내는 곧 수익으로 연결됩니다.",
            icon_type: "trend"
          }
        ],
        practical_guide: {
          heading: "인내심을 기르는 3단계 행동 강령",
          items: [
            {
              title: "HTS/MTS 거리두기",
              description: "자신의 매수 구간이 아니면 화면을 끄십시오. 시시각각 변하는 호가창은 당신의 충동 시스템을 자극합니다."
            },
            {
              title: "기계적 알람 설정",
              description: "원하는 지지선이나 저항선에 가격이 도달할 때만 휴대폰 알람이 울리도록 하십시오. 알람이 울리지 않는 시간은 공부의 시간입니다."
            },
            {
              title: "매매 일지 복기",
              description: "과거에 뇌동매매로 손실을 보았던 기록을 매일 아침 읽으십시오. 고통을 기억하는 뇌는 실수를 반복하지 않으려 노력합니다."
            }
          ]
        },
        conclusion: {
          text: "시장에서 가장 강한 자는 단기 수익률이 높은 자가 아니라, 끝까지 살아남아 기회를 현실로 만드는 인내심 있는 자입니다. 오늘 하루 매수를 참았다면, 당신은 이미 훌륭한 수익을 낸 것입니다.",
          closing_statement: "기다림은 지루함이 아니라, 승리를 위한 정교한 설계입니다."
        }
      },
      system_link: {
        target_tool: "BrainOff",
        related_ticker: ["NVDA", "TSLA"]
      }
    },
    {
      article_info: {
        id: 19,
        slug: "mental-health-for-investors",
        title: "폭락장, 멘탈이 흔들릴 때 반드시 읽어야 할 비상 연락망",
        author: "ieumstock Team",
        date: "2026.04.08",
        publishDate: "2026-04-08",
        category: "Psychology",
        tags: ["멘탈관리", "폭락장대응", "가치투자", "심리회복", "손실관리"]
      },
      seo_metadata: {
        meta_title: "폭락장 멘탈 관리법 | 이음스탁 투자 심리",
        meta_description: "주가가 떨어져도 기업의 본질적 가치가 변하지 않았다면 흔들릴 이유가 없습니다. 하락장에서 마음을 다스리는 3가지 철학적 접근.",
        og_image: "/assets/images/insight/mental-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "당신이 보유한 것은 '숫자'가 아니라 '기업의 지분'입니다.",
          text: "계좌의 파란색 숫자를 보며 밤을 지새우고 계신가요? 주가가 하락했다고 해서 당신이 보유한 기업의 공장이 멈추거나 직원이 모두 퇴사한 것이 아닙니다. 가격은 시장 참여자들의 일시적인 공포가 만들어낸 '환상'일 수 있습니다. 본질을 꿰뚫어 보는 통찰만이 당신의 멘탈을 지켜줍니다."
        },
        core_analysis: [
          {
            sub_heading: "하락의 원인을 해부하십시오: 시스템인가 개별인가?",
            text: "현재의 하락이 기업 내부의 횡령, 배임과 같은 치명적 결함 때문인지, 아니면 전 세계적인 금리 인상이나 지학적 리스크 때문인지 구분해야 합니다. 시장 전체가 무너지는 하락은 시간이 해결해 주지만, 기업 자체가 무너지는 하락은 결단이 필요합니다.",
            insight_tip: "전체 시장의 하락으로 인한 우량주 투매는 신이 주신 쇼핑 기회입니다.",
            icon_type: "analysis"
          },
          {
            sub_heading: "숫자에서 의미를 거두어 내는 법",
            text: "평가 손익을 '오늘의 손실'이라 생각하지 마십시오. 당신은 헐값에 주식을 넘기기 전까지는 아무것도 잃지 않았습니다. 화면을 끄고 현실 세계로 돌아가 가족과 시간을 보내거나 운동을 하십시오. 뇌가 공포 시스템에 장악되지 않도록 의도적으로 환기시켜야 합니다.",
            icon_type: "psychology"
          }
        ],
        practical_guide: {
          heading: "공포를 다스리는 하락장 체크리스트",
          items: [
            {
              title: "BM 재점검",
              description: "내가 산 기업이 여전히 돈을 잘 벌고 있는가? 미래에도 사람들은 이 기업의 서비스를 이용할 것인가?에 답해 보십시오."
            },
            {
              title: "현금 흐름 확보",
              description: "생활비로 주식 투자를 하고 있지는 않습니까? 투자 자금이 삶을 침범하지 않을 때 멘탈은 견고해집니다."
            },
            {
              title: "역발상적 관점",
              description: "모두가 공포에 질려 팔 때가 가장 싼 가격이라는 역사가 증명한 사실을 되새기십시오."
            }
          ]
        },
        conclusion: {
          text: "폭풍우는 영원히 지속되지 않습니다. 비가 그친 뒤 더 단단해진 땅 위에서 진짜 주도주는 다시 싹을 틔웁니다. 당신의 기업을 믿는다면, 시간을 믿으십시오.",
          closing_statement: "당신의 신념이 곧 당신의 미래 계좌 잔고가 됩니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["SPY", "QQQ"]
      }
    },
    {
      article_info: {
        id: 18,
        slug: "tragedy-of-upper-limit-trading",
        title: "상한가 따라잡기(상따)의 비극: 준비되지 않은 자의 최후",
        author: "ieumstock Team",
        date: "2026.04.07",
        publishDate: "2026-04-07",
        category: "Risk Management",
        tags: ["리스크관리", "매매실수", "세력주", "급등주주의", "손실경고"]
      },
      seo_metadata: {
        meta_title: "상따의 위험성과 경고 | 이음스탁 리스크 관리",
        meta_description: "화려한 상한가 뒷면에 숨겨진 잔혹한 갭하락 패턴. 개미 투자자들이 상따로 파산하는 기술적 이유를 심층 분석합니다.",
        og_image: "/assets/images/insight/tragedy-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "타오르는 불꽃 속으로 뛰어드는 나방이 되지 마십시오.",
          text: "상한가에 따라붙어 큰 수익을 냈다는 누군가의 전설은 당신에게도 그 행운이 올 것이라는 착각을 심어줍니다. 하지만 통계적으로 개인 투자자의 상따 성공 확률은 20% 미만입니다. 특히 장 마감 직전의 '억지 상한가'는 다음 날 당신의 계좌를 도려낼 칼날이 되어 돌아옵니다."
        },
        core_analysis: [
          {
            sub_heading: "잔량의 함정: 허매수 수법의 실체",
            text: "상한가 매수 잔량에 쌓여 있는 수백만 주는 진짜 매수 의지가 아니라, 개인들을 안심시켜 매물을 떠넘기기 위한 세력의 '전시용 물량'일 때가 많습니다. 장 종료 후 시간외 거래에서 이 물량이 사라지는 순간, 지옥의 문이 열립니다.",
            insight_tip: "잔량이 많다고 안심하지 마십시오. 취소 버튼 하나에 사라지는 신기루일 수 있습니다.",
            icon_type: "risk"
          },
          {
            sub_heading: "공포의 갭하락과 연속 투매",
            text: "상한가 다음 날 시초가가 낮게 형성되면, 전일 상한가에서 추격 매수했던 모든 자금이 한꺼번에 '손실 상태'가 됩니다. 이때 패닉 셀이 나오며 주가는 순식간에 -10%, -20%로 곤두박질칩니다. 이것이 상따가 무서운 이유입니다.",
            icon_type: "trend"
          }
        ],
        practical_guide: {
          heading: "상따 시 반드시 피해야 할 '워스트 3' 신호",
          items: [
            {
              title: "거래량 없는 상한가",
              description: "충분한 손바뀜 없이 적은 거래량으로 문을 닫은 상한가는 지지력이 매우 약합니다."
            },
            {
              title: "뉴스 재료 소멸",
              description: "이미 공시가 나왔거나 뉴스가 포털 메인에 뜬 상태에서 도달한 상한가는 '재료 소속'입니다."
            },
            {
              title: "2등, 3등주의 추격",
              description: "대장주는 이미 상한가인데 뒤늦게 따라오는 동종 업종 주식을 상따하는 것은 가장 위험한 도박입니다."
            }
          ]
        },
        conclusion: {
          text: "화려함을 쫓기보다 안전함을 선택하십시오. 한 번의 상한가 수익보다 잃지 않는 매매 10번이 당신을 더 빨리 부자로 만들어 줍니다.",
          closing_statement: "시장은 똑똑한 자가 아니라 살아남는 자의 편입니다."
        }
      },
      system_link: {
        target_tool: "BrainOff",
        related_ticker: ["KOSDAQ"]
      }
    },
    {
      article_info: {
        id: 17,
        slug: "secret-of-per-10",
        title: "PER 10배의 함정과 진실: 숫자의 마법에서 벗어나기",
        author: "ieumstock Team",
        date: "2026.04.06",
        publishDate: "2026-04-06",
        category: "Technical Analysis",
        tags: ["가치평가", "PER분석", "재무제표", "저평가종목", "투자지표"]
      },
      seo_metadata: {
        meta_title: "PER 10배의 진짜 의미 | 이음스탁 투자 분석",
        meta_description: "무조건 PER가 낮다고 좋은 주식일까요? 업종별, 성장 단계별 PER 해석의 차이를 통해 진짜 저평가 우량주를 찾는 법을 공개합니다.",
        og_image: "/assets/images/insight/per-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "PER 10배는 '정답'이 아니라 '질문'이어야 합니다.",
          text: "주식 초보자들이 가장 먼저 배우는 지표는 PER(주가수익비율)입니다. 보통 'PER 10배 이하면 저평가'라는 공식이 통용되지만, 현실은 그렇게 단순하지 않습니다. 어떤 기업은 PER 5배에서도 계속 추락하고, 어떤 기업은 PER 50배에서도 폭등합니다. 숫자의 이면을 읽는 눈이 필요합니다."
        },
        core_analysis: [
          {
            sub_heading: "업종별 '멀티플'의 극명한 차이를 인정하십시오",
            text: "굴뚝 산업(제조업, 철강)은 시장의 기대치가 낮아 PER 5~8배가 보통인 반면, 플랫폼이나 바이오 기업은 30~50배를 받아도 저평가 소리를 들을 때가 있습니다. 산업의 성장 속도가 곧 PER의 기준점이 됩니다.",
            insight_tip: "동종 업계 평균 PER(Peer Group)과 비교하지 않는 수치는 의미가 없습니다.",
            icon_type: "analysis"
          },
          {
            sub_heading: "순이익의 '질'을 따지는 기술",
            text: "영업이익이 아니라 일시적인 자산 매각이나 환차익으로 인해 PER가 급격히 낮아진 것은 아닌지 확인해야 합니다. 지속 가능한 이익만이 주가를 밀어 올리는 진정한 힘입니다.",
            icon_type: "volume"
          }
        ],
        practical_guide: {
          heading: "산업별 적정 PER 판단 가이드",
          items: [
            {
              title: "반도체/신재생",
              description: "미래 수요가 확정적인 섹터는 15~25배 수준의 멀티플을 허용하는 경향이 있습니다."
            },
            {
              title: "전통 금융/지주사",
              description: "성장 정체기로 인해 3~6배의 낮은 자산 가치 위주로 평가받습니다."
            },
            {
              title: "엔터/플랫폼",
              description: "확장성이 무한대인 무형 자산 기업은 30배 이상의 프리미엄을 정당화하곤 합니다."
            }
          ]
        },
        conclusion: {
          text: "지표는 참고서일 뿐, 성적표가 아닙니다. 기업이 돈을 버는 '구조'가 견고한지 먼저 확인하고 지표를 대입하십시오.",
          closing_statement: "가치 투자는 낮은 숫자를 사는 것이 아니라, 높은 가치를 사는 것입니다."
        }
      },
      system_link: {
        target_tool: "BrainOff",
        related_ticker: ["삼성전자", "SK하이닉스"]
      }
    },
    {
      article_info: {
        id: 16,
        slug: "interest-rate-strategies",
        title: "금리 사이클 투자 생존기: 긴축과 완화 사이의 돈의 흐름",
        author: "ieumstock Team",
        date: "2026.04.05",
        publishDate: "2026-04-05",
        category: "Market Strategy",
        tags: ["금리투자", "거시경제", "섹터전략", "유동성", "연준방향"]
      },
      seo_metadata: {
        meta_title: "금리 주기별 투자 전략 | 이음스탁 시장 리포트",
        meta_description: "금리가 오를 때와 내릴 때, 내 계좌를 지켜줄 종목군은 무엇인가? 중앙은행의 통화 정책에 따른 포트폴리오 재구축 전략.",
        og_image: "/assets/images/insight/rate-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "돈의 가격이 결정될 때, 모든 자산의 서열이 변합니다.",
          text: "금리는 경제의 '기온'입니다. 금리가 오르면 경제는 수축하며 열기를 식히고, 금리가 내리면 팽창하며 성장을 촉진합니다. 성공한 투자자는 연준(Fed)의 입에 귀를 기울이며 온도 변화에 맞춰 옷을 갈아입는 사람입니다."
        },
        core_analysis: [
          {
            sub_heading: "금리 인상기: 견고한 현금 흐름의 가치",
            text: "돈의 가치가 비싸지면 빚이 많은 기업부터 무너집니다. 대신 현금을 많이 보유한 대형 우량주와 고금리 혜택을 직접 받는 금융 섹터가 방어막 역할을 해줍니다.",
            insight_tip: "금리 인상 초기에는 금융주가 우세하지만, 후기에는 오히려 경기 침체 우려로 가치주가 빛납니다.",
            icon_type: "risk"
          },
          {
            sub_heading: "금리 인하기: 꿈을 먹고 사는 성장주의 시대",
            text: "이자 비용 부담이 줄어들면 혁신적인 기술에 대한 투자가 다시 활발해집니다. IT, 헬스케어, 로봇 등 미래 지향적인 종목군들이 유동성의 힘으로 리레이팅(Re-rating)됩니다.",
            icon_type: "trend"
          }
        ],
        practical_guide: {
          heading: "금리 변동에 따른 포트폴리오 리밸런싱",
          items: [
            {
              title: "인상기 배분",
              description: "은행, 보험, 원자재 관련주 및 배당 수익률이 높은 우량 통신/유틸리티 종목."
            },
            {
              title: "인하기 배분",
              description: "나스닥 우량주, 2차전지, 제약바이오 및 경기 소비재 섹터."
            },
            {
              title: "변곡점 대응",
              description: "단기 채권 비중을 높여 변동성에 대비하고 현금 비중을 20% 이상 유지하십시오."
            }
          ]
        },
        conclusion: {
          text: "금리와 맞서지 마십시오. 파도를 이기려 하기보다 파도에 몸을 싣는 서퍼처럼 시장의 흐름을 인정해야 합니다.",
          closing_statement: "거시 경제적 흐름은 개인의 신념보다 훨씬 강력합니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["KODEX 200", "TIGER 미국나스닥100"]
      }
    },
    {
      article_info: {
        id: 15,
        slug: "risks-of-morning-trading",
        title: "마의 09:00분: 시초가 매매의 치명적 매력과 위험",
        author: "ieumstock Team",
        date: "2026.04.04",
        publishDate: "2026-04-04",
        category: "Trading Setup",
        tags: ["시초가매매", "단기매매", "변동성주의", "데이트레이딩", "실전매매팁"]
      },
      seo_metadata: {
        meta_title: "시초가 30분의 비밀 | 이음스탁 트레이딩 교실",
        meta_description: "장 시작과 동시에 발생하는 폭발적 수급의 명과 암. 초보 트레이더가 시초가에 전 재산을 잃는 이유와 안전한 대응법을 설명합니다.",
        og_image: "/assets/images/insight/morning-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "하루의 승부가 결정되는 골든타임, 혹은 데스타임.",
          text: "오전 9시부터 9시 30분 사이의 거래량은 하루 전체 거래량의 30%를 차지할 때가 많습니다. 밤사이 쌓인 뉴스들이 한꺼번에 분출되는 이 시간에 살아남으려면 철저한 시나리오가 필요합니다. 대책 없는 진입은 곧 투매를 받아주는 '물량받이'가 될 뿐입니다."
        },
        core_analysis: [
          {
            sub_heading: "허수 주문과 가격 왜곡의 시간",
            text: "장 시작 전 동시호가에서 세력들은 허수 주문을 통해 주가를 띄웠다 빼는 기만 전술을 자주 사용합니다. 시초가가 너무 높게 형성된 종목은 '음봉'으로 전환될 확률이 매우 높으니 주의하십시오.",
            insight_tip: "전일 대비 5% 이상의 갭 상승 종목은 3분봉 두 개를 확인한 뒤 진입해도 늦지 않습니다.",
            icon_type: "volume"
          },
          {
            sub_heading: "슬리피지와 체결 오차의 위험",
            text: "변동성이 너무 클 때는 내가 원하는 가격에 팔지 못하는 '슬리피지' 현상이 발생합니다. -3%가 순식간에 -10%가 되는 마법이 시초가에는 일어납니다.",
            icon_type: "risk"
          }
        ],
        practical_guide: {
          heading: "시초가 매매의 3대 철칙",
          items: [
            {
              title: "준비된 종목만 거래",
              description: "장전 관심 종목 리스트(Watchlist)에 없던 종목이 튀어 오른다고 따라붙지 마십시오."
            },
            {
              title: "지수 하락 시 관망",
              description: "코스피, 코스닥 지수가 갭 하락으로 시작하는 날의 시초가 매매는 자살 행위입니다."
            },
            {
              title: "칼 같은 손절",
              description: "시초가 매매는 방향성이 틀렸을 때 1% 이내에서 즉시 빠져나올 수 있는 순발력이 필수입니다."
            }
          ]
        },
        conclusion: {
          text: "시장과 싸워 이기려 하지 말고, 시장이 에너지를 쏟아낸 뒤의 잔물결을 이용하십시오. 9시 30분 이후의 평온함이 더 큰 수익을 가져다줄 수 있습니다.",
          closing_statement: "첫 단추를 잘못 끼웠다면 즉시 다시 끼워야 합니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["KOSDAQ150 선물"]
      }
    },
    {
      article_info: {
        id: 14,
        slug: "economic-moat-companies",
        title: "경제적 해자: 무너지지 않는 성(Castle)을 가진 기업들",
        author: "ieumstock Team",
        date: "2026.04.03",
        publishDate: "2026-04-03",
        category: "Fundamental",
        tags: ["경제적해자", "가치투자", "브랜드파워", "독과점", "장기투자"]
      },
      seo_metadata: {
        meta_title: "워런 버핏의 경제적 해자 찾기 | 이음스탁 투자 분석",
        meta_description: "경쟁자가 침범할 수 없는 독점적 지위를 가진 기업을 찾는 법. 네트워크 효과, 브랜드 가치, 교체 비용 등 해자의 유형별 심층 분석.",
        og_image: "/assets/images/insight/moat-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "진짜 부를 가져다주는 것은 '어닝 서프라이즈'가 아닌 '독점력'입니다.",
          text: "단기적인 실적은 속임수가 있을 수 있지만, 시장을 지배하는 '구조적 경쟁 우위'는 거짓말을 하지 않습니다. 워런 버핏은 이를 '경제적 해자(Economic Moat)'라 불렀습니다. 주변에 깊은 연못을 파서 적군이 성을 공격하지 못하게 하듯, 경쟁자의 진입을 원천 차단하는 기업을 찾아야 합니다."
        },
        core_analysis: [
          {
            sub_heading: "브랜드와 무형 자산의 강력한 힘",
            text: "애플(Apple)이나 코카콜라처럼 고객이 더 비싼 값을 지불하더라도 기꺼이 선택하는 브랜드는 불황에도 살아남습니다. 브랜드가 곧 가격 결정력(Pricing Power)이기 때문입니다.",
            insight_tip: "가격 결정력이 있는 기업은 인플레이션 시기에도 비용 상승분을 고객에게 전가할 수 있습니다.",
            icon_type: "analysis"
          },
          {
            sub_heading: "높은 교체 비용(Switching Costs)의 늪",
            text: "한 번 쓰기 시작하면 다른 서비스로 옮기기 너무 고통스럽거나 비용이 많이 드는 기업들이 있습니다. 마이크로소프트의 윈도우나 어도비의 포토샵이 대표적입니다. 고객을 락인(Lock-in)시키는 능력이 해자의 정수입니다.",
            icon_type: "discipline"
          }
        ],
        practical_guide: {
          heading: "내 종목에 해자가 있는지 확인하는 3가지 질문",
          items: [
            {
              title: "가격 결정력",
              description: "제품 가격을 10% 올렸을 때 고객들이 대거 이탈할 것인가, 아니면 그대로 유지될 것인가?"
            },
            {
              title: "대체 불가능성",
              description: "이 기업의 서비스가 사라졌을 때 당장 내일의 시장이나 내 삶이 마비되는가?"
            },
            {
              title: "압도적 비용 우위",
              description: "규모의 경제를 통해 그 누구도 따라올 수 없는 낮은 가격으로 제품을 공급할 수 있는가?"
            }
          ]
        },
        conclusion: {
          text: "해자는 고정된 것이 아니라 시간이 흐르며 넓어지거나 좁아집니다. 기업의 실적표보다 기업이 파놓은 연못이 여전히 깊은지를 먼저 살피십시오.",
          closing_statement: "해자가 있는 기업과 함께 잠드는 것은 투자의 축복입니다."
        }
      },
      system_link: {
        target_tool: "BrainOff",
        related_ticker: ["AAPL", "MSFT", "GOOGL"]
      }
    },
    {
      article_info: {
        id: 13,
        slug: "tracking-foreign-investors",
        title: "외국인 수급의 비밀: 그들이 사는 종목에는 이유가 있다",
        author: "ieumstock Team",
        date: "2026.04.01",
        publishDate: "2026-04-01",
        category: "Flow Analysis",
        tags: ["외국인수급", "수급분석", "기관매매", "스마트머니", "시장주도주"]
      },
      seo_metadata: {
        meta_title: "외국인 매수세 분석과 활용법 | 이음스탁 투자 리포트",
        meta_description: "한국 시장의 주도권을 쥔 외국인 투자자들의 매수 패턴을 분석합니다. 연속 순매수와 환율의 상관관계를 통한 필승 전략.",
        og_image: "/assets/images/insight/foreign-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "코스피의 진짜 주인은 누구인가?",
          text: "우리나라 증시는 '외국인의 현금 인출기'라는 오명을 듣기도 하지만, 역설적으로 외국인이 사지 않는 장에서 큰 수익을 기대하기는 어렵습니다. 그들은 우리보다 더 많은 정보와 자금력을 바탕으로 '길게 보고' 매집합니다. 외국인의 장바구니에 무엇이 담기는지 추적하는 것은 생존의 필수 조건입니다."
        },
        core_analysis: [
          {
            sub_heading: "패시브 vs 액티브: 자금의 성격을 구분하십시오",
            text: "지수를 추종해서 기계적으로 들어오는 패시브 자금은 시장 전체를 들어 올리지만, 개별 기업의 밸류에이션을 보고 들어오는 액티브 자금은 진짜 주도주를 만들어냅니다. 거래량 대비 외국인 비중이 비정상적으로 높아지는 종목을 주목하십시오.",
            insight_tip: "환율이 꺾이는 시점에 대형 우량주로 유입되는 외국인 자금은 대세 상승장의 신호탄입니다.",
            icon_type: "volume"
          },
          {
            sub_heading: "환차익을 노리는 스마트 머니",
            text: "외국인은 주가 수익뿐만 아니라 '환율 수익'을 동시에 고려합니다. 원화 강세(환율 하락) 국면에서 그들의 매수세가 강해지는 이유입니다. 거시 경제 지표와 수급의 연결 고리를 이해해야 합니다.",
            icon_type: "analysis"
          }
        ],
        practical_guide: {
          heading: "외국인 수급 분석 3대 체크 포인트",
          items: [
            {
              title: "5일 연속 순매수",
              description: "단발성 매수는 의미가 없습니다. 최소 5영업일 이상 연속적으로 '순매수'가 찍히는 종목을 리스트업 하십시오."
            },
            {
              title: "공매도 숏커버링 확인",
              description: "주가는 오르는데 공매도 잔고가 줄어든다면, 외국인이 손실을 확정 짓고 주식을 되사는 '숏커버링' 랠리가 펼쳐질 수 있습니다."
            },
            {
              title: "창구 분석의 함정",
              description: "검은 머리 외국인(한국계 자금)의 페이크 주문에 속지 않으려면 모건스탠리, 골드만삭스 등 주요 외인 창구의 매매를 동시에 확인하십시오."
            }
          ]
        },
        conclusion: {
          text: "외국인의 뒤를 쫓기보다 그들이 선호할 만한 우량주를 길목에서 먼저 잡고 기다리는 지혜가 필요합니다. 큰 돈의 흐름에 몸을 맡길 때 비로소 계좌는 성장합니다.",
          closing_statement: "스마트 머니의 흐름을 읽는 자가 시장을 지배합니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["KOSPI 200", "MSCI Korea"]
      }
    },
    {
      article_info: {
        id: 12,
        slug: "cash-is-also-a-position",
        title: "현금도 종목이다: 폭풍우가 칠 때 항구에 머무는 용기",
        author: "ieumstock Team",
        date: "2026.03.31",
        publishDate: "2026-03-31",
        category: "Portfolio",
        tags: ["포트폴리오", "현금비중", "자산배분", "하락장대응", "투자심리"]
      },
      seo_metadata: {
        meta_title: "현금 비중 조절의 중요성 | 이음스탁 투자 마인드셋",
        meta_description: "주식 100% 보유가 정답이 아닌 이유. 하락장에서 현금이 왜 가장 강력한 무기가 되는지, 그리고 적정 현금 비중 유지법을 설명합니다.",
        og_image: "/assets/images/insight/cash-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "쉬는 것도 투자입니다. 아니, 가장 위대한 투자일 수 있습니다.",
          text: "많은 투자자가 계좌에 현금이 남아 있는 것을 불안해합니다. 마치 일을 하지 않고 노는 기분을 느끼기 때문입니다. 하지만 시장은 1년 내내 수익을 주지 않습니다. 하락장에서 현금을 쥐고 있는 것은 단순한 '대기'가 아니라, 남들이 절망할 때 최고의 기회를 낚아챌 수 있는 '가장 강력한 종목'을 보유한 것과 같습니다."
        },
        core_analysis: [
          {
            sub_heading: "기회비용의 보존과 심리적 우위",
            text: "모든 자금이 주식에 묶여 있으면 폭락장의 바닥에서 아무것도 할 수 없습니다. 반면 현금이 있는 투자자는 하락을 '위기'가 아닌 '바겐세일'로 받아들입니다. 하락장에서 미소를 지을 수 있는 유일한 방법은 오직 현금 비중뿐입니다.",
            insight_tip: "현금 비중이 30%만 있어도 시장의 하락을 객관적으로 바라볼 수 있는 심리적 여유가 생깁니다.",
            icon_type: "psychology"
          },
          {
            sub_heading: "복리의 마법을 지키는 방어막",
            text: "투자는 돈을 버는 것보다 '안 잃는 것'이 중요합니다. -50% 손실을 복구하려면 +100%의 수익이 필요합니다. 하락장에서 현금으로 손실 폭을 줄이는 것은, 상승장에서 수익률을 극대화하는 것보다 복리 시스템을 유지하는 데 훨씬 효과적입니다.",
            icon_type: "strategy"
          }
        ],
        practical_guide: {
          heading: "시장 상황별 '황금' 현금 비중 가이드",
          items: [
            {
              title: "강세장 (Bull Market)",
              description: "추가 매수를 위해 항상 10~20%의 현금은 남겨두십시오. 과열권 신호가 보이면 점진적으로 30%까지 높입니다."
            },
            {
              title: "횡보장 (Sideways Market)",
              description: "방향성이 나오기 전까지 40~50%의 현금을 유지하며 짧은 방망이 매매를 지향하십시오."
            },
            {
              title: "약세장 (Bear Market)",
              description: "70% 이상의 현금을 확보하고 바닥 신호(거래량 폭발, 투매)가 확연히 나타날 때까지 철저히 관망하십시오."
            }
          ]
        },
        conclusion: {
          text: "계좌에 현금이 있는 순간, 당신은 시장의 '을'이 아니라 '갑'이 됩니다. 조급함은 가난을 부르고, 현금은 부를 부릅니다.",
          closing_statement: "현금은 가장 확실한 수익률의 안전판입니다."
        }
      },
      system_link: {
        target_tool: "BrainOff",
        related_ticker: ["KOSDAQ", "S&P 500"]
      }
    },
    {
      article_info: {
        id: 11,
        slug: "news-vs-rumors",
        title: "소문에 사서 뉴스에 팔아라: 선반영의 심리학",
        author: "ieumstock Team",
        date: "2026.03.30",
        publishDate: "2026-03-30",
        category: "Psychology",
        tags: ["투자심리", "재료소멸", "선반영", "공시분석", "매도타이밍"]
      },
      seo_metadata: {
        meta_title: "뉴스에 팔아야 하는 이유 | 이음스탁 투자 심리",
        meta_description: "왜 좋은 뉴스가 떴는데 주가는 떨어질까요? 시장의 기대감이 주가에 녹아드는 과정과 '재료 소멸'의 기술적 신호를 분석합니다.",
        og_image: "/assets/images/insight/rumor-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "당신이 뉴스를 확인했을 때는 이미 모두가 알고 있습니다.",
          text: "주식 시장의 가장 오래된 격언 중 하나인 '소문에 사서 뉴스에 팔아라'는 단순히 유행어가 아닙니다. 이는 정보가 주가에 반영되는 속도와 인간의 탐욕이 결합된 본질적인 현상입니다. 개미 투자자들이 가장 많이 하는 실수 중 하나는 '호재 공시'를 보고 추격 매수를 하는 것입니다. 왜 이것이 위험한지 심층적으로 파헤쳐 봅니다."
        },
        core_analysis: [
          {
            sub_heading: "기대감이 주가를 밀어 올리는 원리",
            text: "주가는 현재가 아니라 미래를 먹고 자랍니다. 실적이 좋아질 것이라는 소문은 주가를 선제적으로 끌어올립니다. 하지만 막상 실적이 발표되는 순간, 더 이상 '기대할 미래'가 사라지며 차익 실현 매물이 쏟아지게 됩니다.",
            insight_tip: "주가가 바닥 대비 30% 이상 오른 상태에서 나온 호재 뉴스는 십중팔구 '설거지'용입니다.",
            icon_type: "analysis"
          },
          {
            sub_heading: "재료 소멸의 차트 신호",
            text: "강력한 호재 뉴스와 함께 대량 거래가 터진 날 '윗꼬리 음봉'이 발생한다면 이는 완벽한 재료 소멸 신호입니다. 세력이 마지막 남은 개인들의 수급을 이용해 물량을 털고 나간 흔적이기 때문입니다.",
            icon_type: "risk"
          }
        ],
        practical_guide: {
          heading: "뉴스를 이기는 스마트한 대응 전략",
          items: [
            {
              title: "뉴스 발생 전 주가 위치 확인",
              description: "호재가 떴을 때 주가가 이미 전고점 부근이거나 과열권이라면 무조건 매도로 대응하십시오."
            },
            {
              title: "지속성 여부 판단",
              description: "이 뉴스가 일회성(공급 계약 등)인지, 아니면 패러다임 변화(신기술 개발)인지 구분해야 합니다."
            },
            {
              title: "역발상 매매법",
              description: "악재 뉴스가 떴는데 주가가 더 이상 빠지지 않는다면, 이미 선반영된 것으로 보고 매수를 고려하십시오."
            }
          ]
        },
        conclusion: {
          text: "시장은 팩트보다 '기대'에 민감하게 반응합니다. 정보의 확정성보다는 정보의 불확실성이 주는 에너지를 이용하는 트레이더가 되십시오.",
          closing_statement: "모두가 확신할 때가 가장 위험한 순간입니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["TSLA", "NVDA"]
      }
    },
    {
      article_info: {
        id: 10,
        slug: "triple-bottom-pattern",
        title: "3중 바닥 패턴: 시장이 바닥임을 외치는 가장 강력한 외침",
        author: "ieumstock Team",
        date: "2026.03.29",
        publishDate: "2026-03-29",
        category: "Technical Analysis",
        tags: ["기술적분석", "차트패턴", "3중바닥", "매수타점", "추세전환"]
      },
      seo_metadata: {
        meta_title: "3중 바닥(역헤드앤숄더) 완벽 가이드 | 이음스탁",
        meta_description: "주가 하락의 끝을 알리는 3중 바닥 패턴의 분석법과 실전 매매 전략. 넥라인 돌파와 거래량의 상관관계를 심층 분석합니다.",
        og_image: "/assets/images/insight/bottom-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "지지가 반복될수록 바닥은 견고해집니다.",
          text: "주가가 하락을 멈추고 반등하기 위해서는 충분한 에너지가 응축되어야 합니다. 그중에서도 '3중 바닥(Triple Bottom)' 혹은 '역헤드앤숄더' 패턴은 시장의 매수세와 매도세가 처절하게 싸운 끝에 매수세가 승리했음을 보여주는 가장 신뢰도 높은 신호입니다. 세 번이나 특정 가격을 지켜냈다는 것은 그 아래로 보낼 의지가 시장에 없다는 뜻입니다."
        },
        core_analysis: [
          {
            sub_heading: "시간의 마법: 다지는 기간이 길수록 좋다",
            text: "바닥을 하루아침에 만드는 V자 반등보다, 수개월에 걸쳐 저점을 확인하는 3중 바닥이 훨씬 더 멀리 갑니다. 다지는 기간이 길수록 이전의 매도 물량(매물대)이 충분히 소화되기 때문입니다.",
            insight_tip: "각 바닥의 저점이 소폭 높아지는 추세가 보인다면 반등의 강도는 더욱 세집니다.",
            icon_type: "volume"
          },
          {
            sub_heading: "넥라인(Neckline) 돌파의 기술",
            text: "3중 바닥은 단순히 세 번의 저점 확인으로 완성되지 않습니다. 이전 고점들을 연결한 '넥라인'을 강력하게 뚫고 올라갈 때 비로소 패턴이 완성됩니다. 이때 거래량이 전일 대비 200% 이상 동반되어야 진짜 돌파입니다.",
            icon_type: "trend"
          }
        ],
        practical_guide: {
          heading: "3중 바닥 실전 진입 시나리오",
          items: [
            {
              title: "공격적 1차 매수",
              description: "세 번째 바닥에서 캔들 꼬리가 길게 달리며 지지받는 모습이 보일 때 비중의 20~30%를 진입합니다."
            },
            {
              title: "안전한 2차 매수",
              description: "넥라인 돌파 후 주가가 밀리지 않고 안착하는 리테스트(Retest) 구간에서 본격적으로 비중을 싣습니다."
            },
            {
              title: "이익 실현 목표",
              description: "일반적으로 바닥권에서 넥라인까지의 높이만큼 추가 상승을 1차 목표가로 설정합니다."
            }
          ]
        },
        conclusion: {
          text: "성급하게 바닥을 예단하여 물타기를 하기보다, 차트가 그려주는 명확한 지지 신호를 기다리십시오. 인내가 수익을 만듭니다.",
          closing_statement: "바닥은 머리가 아니라 무릎에서 확인하고 들어가는 것입니다."
        }
      },
      system_link: {
        target_tool: "ChartPro",
        related_ticker: ["KOSPI"]
      }
    },
    {
      article_info: {
        id: 9,
        slug: "dividend-investing-timing",
        title: "배당주 투자의 정석: 찬바람 불 때 사면 이미 늦습니다",
        author: "ieumstock Team",
        date: "2026.03.28",
        publishDate: "2026-03-28",
        category: "Income Strategy",
        tags: ["배당주", "배당투자", "배당락", "연말투자", "패시브인컴"]
      },
      seo_metadata: {
        meta_title: "배당주 매수/매도 적정 시기 분석 | 이음스탁",
        meta_description: "시세 차익과 배당 수익이라는 두 마리 토끼를 잡는 법. 배당락일 활용법과 계절별 배당주 매매 시나리오를 공개합니다.",
        og_image: "/assets/images/insight/dividend-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "배당금은 '보너스'가 아니라 '안전 마진'입니다.",
          text: "주식 시장이 흔들릴 때 우리를 지켜주는 가장 든든한 버팀목은 '현금 흐름'입니다. 많은 이들이 배당을 받기 위해 12월 말에 서둘러 배당주를 사지만, 이는 고수들의 매물을 받아주는 행위가 될 수 있습니다. 배당주 투자의 진정한 묘미는 남들이 배당에 관심 없을 때 미리 사고, 관심이 폭발할 때 파는 것입니다."
        },
        core_analysis: [
          {
            sub_heading: "배당 수익률의 역설",
            text: "배당을 10% 준다고 무조건 좋은 것이 아닙니다. 주가가 20% 빠지면 배당 수익률은 의미가 없어집니다. 핵심은 '배당 성향'이 일정하고 '이익'이 늘어나는 기업을 고르는 것입니다. 성장이 동반된 배당주만이 주가 방어력을 가집니다.",
            insight_tip: "배당락일 이후 주가가 과도하게 하락했을 때가 장기 투자자에게는 최고의 진입 시점입니다.",
            icon_type: "strategy"
          },
          {
            sub_heading: "배당락(Ex-Dividend)과 회복 탄력성",
            text: "배당 기준일이 지나면 주가는 배당금만큼 하락합니다. 하지만 실적이 우량한 기업은 이 '배당락' 구간을 수 거래일 내에 회복합니다. 이 회복 탄력성을 이용해 짧은 시세 차익을 노리는 것도 좋은 전략입니다.",
            icon_type: "trend"
          }
        ],
        practical_guide: {
          heading: "성공하는 배당주 매매 캘린더",
          items: [
            {
              title: "1~2분기: 씨뿌리기",
              description: "작년 배당이 끝나고 주가가 조정을 받았을 때, 내년 배당을 기약하며 저렴하게 매집하는 최적기입니다."
            },
            {
              title: "3분기: 분기 배담의 활용",
              description: "최근 늘어나고 있는 분기/반기 배당주를 통해 현금 흐름을 다각화하십시오."
            },
            {
              title: "4분기: 수확 또는 대피",
              description: "배당 기대감으로 주가가 과도하게 올랐다면, 배당락 전 시세 차익을 확정 짓고 나오는 것이 수익률 측면에서 유리할 수 있습니다."
            }
          ]
        },
        conclusion: {
          text: "배당주는 지루함과의 싸움입니다. 하지만 그 지루함의 끝에는 따뜻한 배당금과 함께 견고해진 당신의 자산이 기다리고 있을 것입니다.",
          closing_statement: "인내는 배당을 낳고, 배당은 자유를 낳습니다."
        }
      },
      system_link: {
        target_tool: "IncomeTrack",
        related_ticker: ["맥쿼리인프라", "신한지주"]
      }
    },
    {
      article_info: {
        id: 8,
        slug: "averaging-down-tips",
        title: "물타기의 기술: 손실 회복을 위한 밧줄인가, 자폭용 폭탄인가?",
        author: "ieumstock Team",
        date: "2026.03.27",
        publishDate: "2026-03-27",
        category: "Risk Management",
        tags: ["물타기", "추가매수", "손실관리", "비중조절", "투자전략"]
      },
      seo_metadata: {
        meta_title: "성공하는 물타기 vs 망하는 물타기 구분법 | 이음스탁",
        meta_description: "무분별한 평단가 낮추기가 계좌를 망칩니다. 기술적 반등 지점을 이용한 전략적 물타기 공식과 리스크 관리법을 제시합니다.",
        og_image: "/assets/images/insight/averaging-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "추가 매수는 '희망'으로 하는 것이 아니라 '데이터'로 하는 것입니다.",
          text: "물타기(Averaging Down)는 주식 투자에서 가장 흔하면서도 위험한 행위입니다. 단순히 마이너스 수익률을 보기 괴로워 평단가를 낮추려다가는, 한 종목에 자금이 모두 묶여 시장의 다른 기회를 모두 놓치는 '기회비용의 지옥'에 빠지게 됩니다. 진짜 고수는 물을 타는 시점과 타지 말아야 할 시점을 명확히 구분합니다."
        },
        core_analysis: [
          {
            sub_heading: "하락의 원인이 무엇인지 자문하십시오",
            text: "기업의 펀더멘털(실적 악화, 횡령 등)에 문제가 생겨 주가가 빠진다면 물타기가 아니라 즉시 '손절'해야 합니다. 하지만 기업은 멀쩡한데 시장 전체의 투매나 일시적인 수급 불안으로 빠진다면, 그때 비로소 물타기는 '자산 확대'의 기회가 됩니다.",
            insight_tip: "한 종목의 비중이 내 전체 자산의 25%를 넘어서는 순간부터는 물타기가 아닌 '도박'이 됩니다.",
            icon_type: "risk"
          },
          {
            sub_heading: "바닥 확인 없는 물타기는 전멸의 지름길",
            text: "떨어지는 칼날을 잡지 마십시오. 주가가 하락을 멈추고 최소한 5일 이동평균선이 횡보로 돌아서거나, 바닥권에서 '망치형' 캔들이 출현하며 지지가 확인될 때 추가 자금을 투입해야 합니다.",
            icon_type: "trend"
          }
        ],
        practical_guide: {
          heading: "실전 물타기 3단계 프로세스",
          items: [
            {
              title: "1단계: 가격 기준 설정",
              description: "애초에 매수한 가격 대비 -10% 혹은 -20% 등 의미 있는 낙폭이 발생했을 때만 검토하십시오."
            },
            {
              title: "2단계: 물량 배분",
              description: "한꺼번에 큰 자금을 넣지 말고, 계획했던 추가 자금을 3회에 걸쳐 분할하여 진입하십시오."
            },
            {
              title: "3단계: 탈출 시나리오",
              description: "평단가가 낮아졌을 때 본전 근처에서 비중을 다시 줄일 것인지, 아니면 수익권까지 홀딩할 것인지 미리 정해야 합니다."
            }
          ]
        },
        conclusion: {
          text: "물타기는 계좌의 평단가를 낮추는 도구일 뿐, 기업의 가치를 바꾸지는 못합니다. 내가 이 기업과 끝까지 갈 확신이 있을 때만 밧줄을 던지십시오.",
          closing_statement: "가장 좋은 물타기는 '안 해도 되는 자리'에서 처음부터 잘 사는 것입니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["KODEX 레버리지", "KODEX 인버스"]
      }
    },
    {
      article_info: {
        id: 7,
        slug: "finding-leader-stocks",
        title: "주도주 판별법: 시대의 주인공을 찾는 3가지 통찰",
        author: "ieumstock Team",
        date: "2026.03.26",
        publishDate: "2026-03-26",
        category: "Market Leaders",
        tags: ["주도주", "대장주", "트렌드분석", "시장주도섹터", "성장주"]
      },
      seo_metadata: {
        meta_title: "시장을 이끄는 진짜 주도주 선별법 | 이음스탁",
        meta_description: "단순한 급등주와 역사적 주도주는 어떻게 다를까요? 업종의 성장성, 수급의 집중도, 그리고 신고가 돌파를 통한 주도주 포착 전략.",
        og_image: "/assets/images/insight/leader-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "자금의 파도가 어디로 몰려오는지 감지하십시오.",
          text: "주식 시장에는 수천 개의 종목이 있지만, 시장을 실질적으로 끌어올리는 종목은 단 몇 퍼센트에 불과합니다. 이를 '주도주'라고 부릅니다. 주도주를 잡는 투자자는 하락장에서도 견고하고 상승장에서는 폭발적인 수익을 누립니다. 주도주는 단순히 운이 좋아서 오르는 것이 아니라, 시대의 요구와 막대한 자금이 만나는 지점에서 탄생합니다."
        },
        core_analysis: [
          {
            sub_heading: "사회 구조적 변화와 메가 트렌드",
            text: "인구 구조의 변화, 기술적 혁신(AI, 로봇), 혹은 에너지 패러다임의 전환처럼 거역할 수 없는 흐름이 주도주를 만듭니다. '현상이 아니라 본질'에 집중하십시오. 지금 세상이 가장 간절히 원하는 기술이 무엇인지 파악하는 것이 첫걸음입니다.",
            insight_tip: "주도주는 보통 대중이 의심할 때 오르기 시작하여, 대중이 확신할 때 정점을 찍습니다.",
            icon_type: "strategy"
          },
          {
            sub_heading: "기관과 외국인의 공격적 '싹쓸이'",
            text: "개인이 만드는 급등은 신기루 같지만, 메이저 수급이 만드는 상승은 추세를 형성합니다. 특정 섹터에 기관과 외국인의 매수세가 쏠리며 '지수보다 강한 종목'이 나타날 때, 그것이 바로 주도주의 출현 신호입니다.",
            icon_type: "volume"
          }
        ],
        practical_guide: {
          heading: "주도주 선별을 위한 3대 핵심 질문",
          items: [
            {
              title: "신고가 부근에서 노는가?",
              description: "위에 매물벽이 없는 역사적 신고가 혹은 52주 신고가 근처에서 거래량이 터지고 있는 종목이 우선순위입니다."
            },
            {
              title: "섹터 전체가 강한가?",
              description: "나홀로 급등하는 종목보다 같은 업종의 종목들이 동반 상승하며 테마를 형성하는 섹터가 주도 섹터일 확률이 높습니다."
            },
            {
              title: "하락장에서도 버티는가?",
              description: "지수가 폭락할 때 하락폭이 작거나 오히려 강보합을 유지하는 종목은 다음 반등장에서 대장이 될 준비가 된 종목입니다."
            }
          ]
        },
        conclusion: {
          text: "주도주는 한 번 정해지면 생각보다 오랫동안 그 지위를 유지합니다. 잔파동에 흔들려 대장주를 일찍 팔고 소외주로 옮겨가는 실수를 범하지 마십시오.",
          closing_statement: "시대의 흐름을 타는 자가 가장 큰 부를 얻습니다."
        }
      },
      system_link: {
        target_tool: "BrainOff",
        related_ticker: ["NVDA", "TSMC", "삼성전자"]
      }
    },
    {
      article_info: {
        id: 6,
        slug: "buy-fear-sell-greed",
        title: "공포에 사서 환희에 팔아라: 역발상 투자의 실전 미학",
        author: "ieumstock Team",
        date: "2026.03.25",
        publishDate: "2026-03-25",
        category: "Psychology",
        tags: ["역발상투자", "공포탐욕지수", "시장심리", "매수타이밍", "워런버핏"]
      },
      seo_metadata: {
        meta_title: "대중의 심리와 반대로 수익 내는 법 | 이음스탁",
        meta_description: "모두가 공포에 질려 시장을 떠날 때가 최고의 기회인 이유. 역발상 투자를 위한 심리적 무장과 구체적인 지표 활용법을 공개합니다.",
        og_image: "/assets/images/insight/fear-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "가장 고통스러운 순간이 가장 달콤한 수익의 시작입니다.",
          text: "주식 시장에서 돈을 버는 사람은 대중과 반대로 움직이는 사람입니다. 모두가 환희에 차서 수익을 자랑할 때 조용히 현금을 챙기고, 모두가 공포에 질려 비명을 지르며 주식을 던질 때 그 물량을 받아내는 용기가 필요합니다. 아는 것과 행동하는 것은 다릅니다. 당신의 본능을 거스르는 기술을 배워야 합니다."
        },
        core_analysis: [
          {
            sub_heading: "광기와 공포의 사이클 이해",
            text: "시장은 이성의 영역이 아니라 감정의 영역입니다. 과도한 낙관론이 지배할 때는 이미 모든 호재가 주가에 반영된 상태입니다. 반대로 과도한 비관론이 덮칠 때는 기업의 가치와 상관없이 '투매'가 발생하며 비정상적인 저평가 구간이 형성됩니다.",
            insight_tip: "지인들이 주식 이야기를 시작하면 팔 때고, 뉴스에서 주식 시장 파산을 연일 보도하면 살 때입니다.",
            icon_type: "psychology"
          },
          {
            sub_heading: "가치와 가격의 괴리를 보십시오",
            text: "폭락장에서는 '좋은 주식'도 함께 빠집니다. 이것은 실력이 없는 투자자에게는 위기지만, 준비된 투자자에게는 부를 점프시킬 유일한 통로입니다. 기업의 돈 버는 능력이 변하지 않았다면, 떨어진 가격은 선물과 같습니다.",
            icon_type: "analysis"
          }
        ],
        practical_guide: {
          heading: "역발상 투자를 위한 3대 지표",
          items: [
            {
              title: "CNN 공포와 탐욕 지수",
              description: "지수가 20 이하인 극도의 공포(Extreme Fear) 구간에 진입했는지 모니터링하십시오."
            },
            {
              title: "신용융자 잔고 급감",
              description: "견디다 못한 개인들의 신용 물량이 반대매매로 털려나가며 잔고가 급격히 줄어들 때가 바닥의 징조입니다."
            },
            {
              title: "역사적 PBR 밴드",
              description: "코스피 전체 PBR이 0.9배 이하로 내려가는 등 역사적 저평가 구간인지 체크하십시오."
            }
          ]
        },
        conclusion: {
          text: "역발상 투자는 외로운 길입니다. 하지만 그 고독함을 견딘 자만이 시장이 주는 가장 큰 전리품을 챙길 수 있습니다.",
          closing_statement: "대중이 예(Yes)라고 할 때 아니오(No)라고 할 수 있는 용기가 투자의 전부입니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["KOSPI", "NASDAQ"]
      }
    },
    {
      article_info: {
        id: 5,
        slug: "power-of-compound-interest",
        title: "복리의 마법: 당신의 시간을 부로 바꾸는 연금술",
        author: "ieumstock Team",
        date: "2026.03.24",
        publishDate: "2026-03-24",
        category: "Mindset",
        tags: ["복리효과", "장기투자", "재테크기초", "투자마인드", "부의축적"]
      },
      seo_metadata: {
        meta_title: "시간을 내 편으로 만드는 복리 투자 원칙 | 이음스탁",
        meta_description: "아인슈타인이 말한 세계 8대 불가사의, 복리의 마법을 누리는 3가지 핵심 전략. 왜 장기 투자가 결국 승리하는지 과학적으로 분석합니다.",
        og_image: "/assets/images/insight/compound-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "천재 과학자 아인슈타인이 가장 경이로워했던 것은 원자폭탄이 아니라 '복리'였습니다.",
          text: "복리는 눈덩이를 굴리는 것과 같습니다. 처음에는 아주 작고 보잘것없어 보이지만, 임계점을 넘어서는 순간 기하급수적으로 커지며 상상할 수 없는 결과를 만들어냅니다. 투자는 단순히 종목을 잘 고르는 기술이 아니라, 이 복리의 시스템을 얼마나 오랫동안 깨뜨리지 않고 유지하느냐의 싸움입니다."
        },
        core_analysis: [
          {
            sub_heading: "복리의 가장 강력한 연료: 시간",
            text: "복리 곡선은 초반에는 완만하다가 후반부에 가파르게 치솟는 '하키 스틱' 모양을 띱니다. 20대부터 시작한 10만 원이 40대에 시작한 100만 원보다 더 큰 자산이 되는 이유가 바로 여기에 있습니다. 단 하루라도 먼저 시작하는 것이 투자의 필승법입니다.",
            insight_tip: "복리는 곱셈의 연산입니다. 한 번이라도 0(원금 손실)이 곱해지면 모든 시스템이 멈춥니다.",
            icon_type: "trend"
          },
          {
            sub_heading: "손실율이 복리에 미치는 치명적 영향",
            text: "10% 수익을 내는 것보다 10% 손실을 방어하는 것이 복리 관점에서 훨씬 중요합니다. 손실을 복구하기 위해서는 그 이상의 수익률이 필요하기 때문입니다. 안정적인 수익률을 꾸준히 유지하는 자가 결국 시장의 최종 승자가 됩니다.",
            icon_type: "risk"
          }
        ],
        practical_guide: {
          heading: "복리의 마법을 부리는 3대 원칙",
          items: [
            {
              title: "수익금 전액 재투자",
              description: "배당금이나 실현 손익을 소비로 소진하지 말고, 다시 원금에 합쳐 몸집을 불리십시오."
            },
            {
              title: "인플레이션을 이기는 수익률",
              description: "단순 저축이 아닌, 복리 효과를 누릴 수 있는 자산(주식, 부동산 등)에 자금을 배치해야 합니다."
            },
            {
              title: "중도 해지 방지",
              description: "급전이 필요해 주식을 파는 일이 없도록, 반드시 여유 자금으로만 투자하여 복리의 시간을 확보하십시오."
            }
          ]
        },
        conclusion: {
          text: "복리는 똑똑한 사람보다 인내심 있는 사람을 사랑합니다. 당신의 계좌가 폭발적으로 늘어나는 그날까지 시간을 당신의 편으로 만드십시오.",
          closing_statement: "투자는 기다림의 대가로 받는 선물입니다."
        }
      },
      system_link: {
        target_tool: "IncomeTrack",
        related_ticker: ["SPY", "QQQ"]
      }
    },
    {
      article_info: {
        id: 4,
        slug: "stop-impulsive-trading",
        title: "뇌동매매 멈추기: 탐욕과 공포를 이기는 3단계 제어 시스템",
        author: "ieumstock Team",
        date: "2026.03.23",
        publishDate: "2026-03-23",
        category: "Discipline",
        tags: ["뇌동매매", "투자원칙", "심리제어", "포모증후군", "자기통제"]
      },
      seo_metadata: {
        meta_title: "충동적인 매수(뇌동매매)를 멈추는 법 | 이음스탁",
        meta_description: "급등주를 보고 무작정 추격 매수하고 계신가요? 도파민의 유혹을 뿌리치고 이성적인 투자자로 거듭나는 심리 훈련법과 실전 체크리스트.",
        og_image: "/assets/images/insight/impulse-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "매수 버튼을 누르기 전, 당신의 심박수를 체크하십시오.",
          text: "장 시작 후 모니터가 빨갛게 물들고 뉴스 헤드라인이 쏟아질 때, 우리의 뇌는 공격적인 상태로 변합니다. 이때 발생하는 '뇌동매매(Impulsive Trading)'는 대부분의 개미 투자자들이 파산하는 가장 큰 이유입니다. 세력은 당신의 급한 마음을 이용해 물량을 떠넘깁니다. 이제 그들의 설계에서 벗어나야 합니다."
        },
        core_analysis: [
          {
            sub_heading: "FOMO(포모) 증후군과 도파민",
            text: "나만 소외될지 모른다는 공포(FOMO)는 우리의 판단력을 흐리게 만듭니다. 이미 급등한 종목은 내 영역이 아니라고 선을 긋는 훈련이 필요합니다. 뇌동매매는 한 번 시작하면 중독처럼 반복됩니다.",
            insight_tip: "사고 싶어 죽을 것 같을 때가 가장 팔기 좋은 시점일 수 있음을 명심하십시오.",
            icon_type: "psychology"
          },
          {
            sub_heading: "준비되지 않은 매수는 도박입니다",
            text: "단순히 거래량이 터지고 누가 추천한다고 사는 것은 투자가 아닌 홀짝 게임입니다. 내가 왜 이 가격에 사야 하는지, 논리적 근거가 세 줄 이상 나오지 않는다면 그 매매는 포기하는 것이 정답입니다.",
            icon_type: "analysis"
          }
        ],
        practical_guide: {
          heading: "내 계좌를 지키는 '30초 중단' 체크리스트",
          items: [
            {
              title: "이격도 확인 (20일선 기준)",
              description: "주가가 이동평균선과 너무 멀리 떨어져 있다면 무조건 눌림목을 기다리십시오."
            },
            {
              title: "손익비 계산",
              description: "지금 사서 기대할 수 있는 수익 폭보다 하락했을 때의 손실 폭이 더 크다면 진입하지 마십시오."
            },
            {
              title: "거래량의 진위 판별",
              description: "단순히 거래량이 많은 것이 아니라, 고점에서 물량을 떠넘기는 거래량인지 바닥권에서 매집하는 거래량인지 구분하십시오."
            }
          ]
        },
        conclusion: {
          text: "매매 횟수를 줄이는 것만으로도 계좌의 수익률은 눈에 띄게 개선됩니다. 시장은 내일도 열리고, 기회는 매일 옵니다.",
          closing_statement: "차분한 매매가 복리의 길로 안내합니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["KOSDAQ", "KODEX 레버리지"]
      }
    },
    {
      article_info: {
        id: 3,
        slug: "importance-of-stop-loss",
        title: "손절매의 철학: 패배가 아닌 다음 기회를 사는 비용",
        author: "ieumstock Team",
        date: "2026.03.22",
        publishDate: "2026-03-22",
        category: "Risk Management",
        tags: ["손절매", "리스크관리", "자금관리", "투자철학", "계좌방어"]
      },
      seo_metadata: {
        meta_title: "파산을 막는 최후의 보루, 손절 원칙 | 이음스탁",
        meta_description: "왜 초보자는 손절을 못 하고 고수는 손절을 즐길까요? 손실 복구의 수학적 원리와 기계적인 손절 시스템 구축법을 상세히 설명합니다.",
        og_image: "/assets/images/insight/stoploss-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "손절하지 못하는 투자자는 결국 시장에서 퇴출당하게 되어 있습니다.",
          text: "모든 투자가 성공할 수는 없습니다. 투자의 본질은 '맞췄을 때 많이 벌고, 틀렸을 때 적게 잃는 것'입니다. 하지만 대다수의 투자자들은 반대로 행동합니다. 수익은 짧게 챙기고, 손실은 '언젠가 오르겠지'라며 방치합니다. 손절매(Stop Loss)는 당신의 자산을 지키는 유일한 방패이자 최고의 공격 무기입니다."
        },
        core_analysis: [
          {
            sub_heading: "-50%를 복구하기 위해 필요한 것은 100%입니다",
            text: "손실은 산술급수가 아니라 기하급수로 우리를 공격합니다. 10% 손실을 메꾸는 데는 11.1%의 수익이 필요하지만, 50% 손실을 메꾸려면 원금의 두 배인 100% 수익이 필요합니다. 이것이 바로 손절을 '빠르게' 해야 하는 수학적 이유입니다.",
            insight_tip: "물타기를 하기 전, 지금 이 종목을 지금 가격에 신규로 사고 싶은지 자문하십시오.",
            icon_type: "risk"
          },
          {
            sub_heading: "희망이라는 독약을 버리십시오",
            text: "주식 시장은 차갑고 비정합니다. 내가 물렸다고 해서 시장이 사정을 봐주지 않습니다. 기계적인 손절 라인을 설정하고 이를 준수하는 것만이 감정의 소용돌이에서 당신을 구해줄 것입니다.",
            icon_type: "psychology"
          }
        ],
        practical_guide: {
          heading: "생존율을 높이는 3가지 손절 전략",
          items: [
            {
              title: "고정 비율 손절",
              description: "본인의 공격 성향에 따라 -3%, -5%, -10% 등 명확한 비율을 정하고 기계적으로 매도하십시오."
            },
            {
              title: "추세 이탈 손절",
              description: "주요 이평선(20일선, 60일선)이나 직전 저점을 이탈할 때, 시세의 균형이 무너진 것으로 보고 정리하십시오."
            },
            {
              title: "시간 제한 손절",
              description: "매수한 이유가 며칠 내 시세 분출이었는데 일주일 이상 기어간다면, 그 기회비용을 위해 종목을 교체하십시오."
            }
          ]
        },
        conclusion: {
          text: "손절할 때의 아픔은 잠시지만, 손절하지 못해 겪는 고통은 인생을 파괴할 수도 있습니다. 시장에서 살아남으십시오. 살아남으면 반드시 기회는 옵니다.",
          closing_statement: "손절을 잘하는 사람이 결국 큰돈을 법니다."
        }
      },
      system_link: {
        target_tool: "ChartPro",
        related_ticker: ["TQQQ", "SOXL"]
      }
    },
    {
      article_info: {
        id: 2,
        slug: "market-maker-signals",
        title: "세력의 지문 찾기: 거래량 뒤에 숨은 매집의 정석",
        author: "ieumstock Team",
        date: "2026.03.21",
        publishDate: "2026-03-21",
        category: "Flow Analysis",
        tags: ["세력매집", "거래량분석", "캔들패턴", "스마트머니", "차트공부"]
      },
      seo_metadata: {
        meta_title: "기관과 외인의 매집 시그널 포착법 | 이음스탁",
        meta_description: "주가는 속여도 거래량은 못 속입니다. 바닥권에서의 매집봉과 대량 거래를 통해 세력의 등 위로 올라타는 실전 노하우를 공개합니다.",
        og_image: "/assets/images/insight/market-maker-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "주식 시장의 거대한 고래들이 남기는 흔적을 읽을 수 있습니까?",
          text: "자금력이 부족한 개미들은 결코 시세를 주도할 수 없습니다. 우리가 큰 수익을 얻기 위해서는 소위 '세력'이라 불리는 거대 자금의 움직임을 미리 포착하고 길목을 지켜야 합니다. 그들은 은밀하게 움직이려 하지만, 결코 숨길 수 없는 유일한 지표가 있습니다. 바로 '거래량'입니다."
        },
        core_analysis: [
          {
            sub_heading: "매집의 제1원칙: 바닥권 대량 거래",
            text: "긴 하락 끝에 주가가 더 이상 빠지지 않는 횡보 구간에서 평소의 몇 배에 달하는 거래량이 터진다면, 이는 누군가 물량을 싹쓸이하고 있다는 가장 강력한 신호입니다. 시세 분출을 위한 에너지를 응축하는 단계입니다.",
            insight_tip: "고점에서 터지는 대량 거래는 사망 신호지만, 바닥에서 터지는 대량 거래는 탄생 신호입니다.",
            icon_type: "volume"
          },
          {
            sub_heading: "윗꼬리 캔들(매집봉)의 비밀",
            text: "장중에 강하게 끌어올렸다가 종가에 밀어버리는 캔들은 개미들의 물량을 테스트하고 빼앗는 과정입니다. 이런 '매집봉'이 반복적으로 출현한다면 주포의 매집이 거의 끝나가고 있다는 뜻입니다.",
            icon_type: "analysis"
          }
        ],
        practical_guide: {
          heading: "세력주 탑승 전 필독 가이드",
          items: [
            {
              title: "저점 우상향 패턴 체크",
              description: "옆으로 횡보하는 것 같으면서도 미세하게 저점이 높아지고 있는지 확인하십시오. 이는 매도세를 매수세가 이기고 있다는 증거입니다."
            },
            {
              title: "거래량 없는 하락을 견뎌라",
              description: "매집 이후 거래량 없이 주가를 툭 떨어뜨리는 '개미 털기' 구간에서 절대로 물량을 뺏기지 마십시오."
            },
            {
              title: "특수 창구의 집중 매입",
              description: "특정 외국계 증권사나 기관 창구를 통해 꾸준히 들어오는 수급 주체를 추적하십시오."
            }
          ]
        },
        conclusion: {
          text: "세력은 우리의 적이 아니라, 우리가 활용해야 할 가장 든든한 파트너입니다. 그들의 움직임을 읽는 눈만 있다면 주식 시장은 황금어장이 될 것입니다.",
          closing_statement: "차트는 거래량이 그리고, 거래량은 돈이 그립니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["KOSPI", "삼성전자", "SK하이닉스"]
      }
    },
    {
      article_info: {
        id: 1,
        slug: "escaping-human-indicator",
        title: "인간 지표 탈출하기: 왜 내가 사면 고점이고 팔면 저점일까?",
        author: "ieumstock Team",
        date: "2026.03.20",
        publishDate: "2026-03-20",
        category: "Psychology",
        tags: ["투자심리", "인간지표", "대중심리", "매매타이밍", "개미탈출"]
      },
      seo_metadata: {
        meta_title: "개미 투자자의 심리적 오류 극복법 | 이음스탁",
        meta_description: "항상 시장의 뒷북만 치고 계신가요? 대중과 반대로 생각하고 행동하는 고수들의 역발상 관찰력을 기르는 3가지 심리 솔루션.",
        og_image: "/assets/images/insight/indicator-cover.jpg"
      },
      content_body: {
        introduction: {
          heading: "당신의 본능은 주식 투자에 적합하지 않게 설계되어 있습니다.",
          text: "주식 투자는 고도의 심리 게임입니다. 하지만 인간의 뇌는 수만 년 동안 위험을 피하고 무리와 함께할 때 안정감을 느끼도록 진화했습니다. 주식 시장에서는 이 생존 본능이 오히려 독이 됩니다. 남들이 살 때 사고 싶고, 남들이 던질 때 무서워 도망치는 당신의 주관을 버리고 객관적인 수치에 집중해야 합니다."
        },
        core_analysis: [
          {
            sub_heading: "확신이라는 이름의 함정",
            text: "뉴스가 대대적으로 보도되고 주변 사람들이 모두 수익을 내며 환호할 때 당신은 '확신'을 느낍니다. 하지만 그때가 바로 세력이 환호하며 물량을 넘기는 마지막 파티 타임입니다. 당신이 가장 사고 싶어 견딜 수 없을 때가 바로 고점임을 명심하십시오.",
            insight_tip: "모두가 예(Yes)라고 할 때 아니오(No)라고 말할 수 있는 것, 그것이 수익의 시작입니다.",
            icon_type: "psychology"
          },
          {
            sub_heading: "추격 매수와 뇌동 매매의 끝은 파멸입니다",
            text: "올라가는 주식은 아름다워 보입니다. 하지만 그 뒤에는 가파른 절벽이 기다리고 있을 확률이 높습니다. 이미 시장의 에너지가 모두 소비된 종목에 올라타는 것은 자살 행위입니다. 기다림은 고통스럽지만, 매수 버튼을 누른 후의 고통보다는 훨씬 덜합니다.",
            icon_type: "risk"
          }
        ],
        practical_guide: {
          heading: "인간 지표를 넘어서는 3가지 훈련법",
          items: [
            {
              title: "감정 일기 작성",
              description: "매수 버튼을 누르기 직전의 감정 상태를 기록하십시오. '불안'이나 '조급함'이 섞여 있다면 즉시 손을 떼십시오."
            },
            {
              title: "객관적 지표 신봉하기",
              description: "자신의 느낌보다 거래량, 이격도, 수급 주체 등 숫자가 보여주는 데이터만을 믿고 기계적으로 대응하십시오."
            },
            {
              title: "오답 노트의 습관화",
              description: "뇌동매매로 손실을 본 경험을 상세히 기록하고, 같은 패턴의 유혹이 올 때마다 꺼내보며 경각심을 가지십시오."
            }
          ]
        },
        conclusion: {
          text: "부자는 대중과 다른 길을 걷는 사람입니다. 오늘부터 당신도 그 외로운, 하지만 풍요로운 길로 들어서십시오.",
          closing_statement: "당신의 가장 큰 적은 시장이 아니라 바로 당신 자신입니다."
        }
      },
      system_link: {
        target_tool: "FearAndGreed",
        related_ticker: ["KOSPI", "KOSDAQ"]
      }
    }
  ]
}
