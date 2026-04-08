import React, { useState, useEffect } from 'react';
import { Lock, Crown, Zap, ShieldCheck, Info, ChevronRight, BarChart3, Target, KeyRound, AlertTriangle } from 'lucide-react';

const PREMIUM_STOCKS = [
  { id: 1, name: '기업 A', price: '45,200', target: '52,000', lock: false },
  { id: 2, name: '기업 B', price: '128,500', target: '150,000', lock: false },
  { id: 3, name: '기업 C', price: '9,430', target: '12,500', lock: false },
];

const BrainOff = () => {
  const [data, setData] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/dashboard_data.json');
        const result = await response.json();
        if (result.system.status === "Verified") setData(result);
      } catch (e) {
        console.error("Data load failed");
      }
    };
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0000') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 md:p-16 text-white text-center">
        <div className="absolute top-0 right-0 p-4">
          <Crown className="w-12 h-12 text-yellow-400 opacity-20" />
        </div>
        <div className="relative z-20 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs font-black tracking-widest uppercase">
            Premium AI Strategy
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
            BRAIN-OFF <span className="text-secondary-400">Zero-Stress</span> 투자 시스템
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
            감정에 휘둘리지 마세요. 고수들만 사용하는 알고리즘이 <br className="hidden md:block" /> 
            지금 가장 유망한 상위 1% 종목을 추출합니다.
          </p>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary-600/20 blur-[100px] rounded-full"></div>
      </div>

      {/* Algorithm Strategy Description */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-50 p-3 rounded-2xl">
            <Target className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">이음스탁 종목 선정 기준</h2>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Selection Methodology</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { tag: 'RSI', title: '과매도 기술적 반등', desc: 'RSI 지표가 30 이하로 주가가 단기 바닥권을 형성한 종목' },
            { tag: 'MA', title: '이동평균선 정배열', desc: '주가가 5, 20, 60일 이평선 위에서 지지를 받는 추세 전환' },
            { tag: 'Vol', title: '거래량 급증 포착', desc: '평균 거래량 대비 300% 이상 폭증하며 수급이 몰린 종목' },
            { tag: 'Gap', title: '내재가치 괴리율', desc: '기업 실적 대비 주가가 지나치게 저평가된 딥-밸류 종목' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
              <span className="text-[10px] font-black bg-primary-600 text-white px-2 py-0.5 rounded-md uppercase tracking-widest">{item.tag}</span>
              <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Screening Logic Visuals */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-600" />
            Live Engine Status
          </h3>
          <div className="space-y-4">
            {[
              { icon: <Zap />, title: '실시간 괴리율 필터', desc: '전일 대비 5% 이상의 변동성을 실시간 감시합니다.', status: 'Active' },
              { icon: <Target />, title: '수급 집중도 분석', desc: '외인/기관의 대량 매집 흔적을 추적합니다.', status: 'Active' },
              { icon: <BarChart3 />, title: '지수 무결성 체크', desc: '시장 왜곡 현상을 필터링하여 오차를 줄입니다.', status: 'Verified' },
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-100 flex gap-4 hover:shadow-lg transition-shadow">
                <div className="text-primary-600 bg-primary-50 p-3 rounded-xl h-fit">
                  {React.cloneElement(item.icon as any, { size: 20 })}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <span className="text-[10px] font-black text-emerald-500 px-1.5 py-0.5 bg-emerald-50 rounded uppercase">{item.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Stock Cards or Password Gate */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black">AI 선별 종목 리스트</h3>
            <div className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-widest">
              Real-time Analysis
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="bg-slate-900 rounded-[2rem] p-12 text-center space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 to-transparent"></div>
              <div className="relative z-10 space-y-6 max-w-sm mx-auto">
                <div className="inline-flex p-5 bg-white/5 rounded-[2rem] border border-white/10 mb-4 group-hover:scale-110 transition-transform">
                  <KeyRound className="w-10 h-10 text-primary-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white">비공개 프리미엄 데이터</h4>
                  <p className="text-slate-400 text-sm font-medium">관리자가 부여한 4자리 비밀번호를 입력해주세요.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center text-2xl tracking-[1em] text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-white/20"
                    maxLength={4}
                  />
                  {error && <p className="text-rose-400 text-xs font-bold flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" /> {error}</p>}
                  <button 
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-900/50 transition-all active:scale-95"
                  >
                    데이터 분석결과 확인
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in zoom-in-95 duration-500">
              {PREMIUM_STOCKS.map((stock) => (
                <div key={stock.id} className="premium-card group relative p-8 bg-white overflow-hidden border-2 border-primary-50">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-primary-600 tracking-widest uppercase bg-primary-50 px-2 py-0.5 rounded">High Probability</span>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{stock.name}</h4>
                    </div>
                    <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-100">
                      <Target className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Entry Price</span>
                      <span className="text-slate-900 font-black">{stock.price}원</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Target Price</span>
                      <span className="text-emerald-600 font-black">{stock.target}원</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Pot. Yield</span>
                      <span className="text-primary-600 font-black text-lg">+15.4%</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-colors">
                    상세분석 리포트 보기
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrainOff;
