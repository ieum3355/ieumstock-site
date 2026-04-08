import React, { useState, useEffect } from 'react';
import { Lock, Crown, Zap, ShieldCheck, Info, ChevronRight, BarChart3, Target } from 'lucide-react';

const PREMIUM_STOCKS = [
  { id: 1, name: '기업 A', price: '45,200', target: '52,000', lock: false },
  { id: 2, name: '기업 B', price: '128,500', target: '150,000', lock: true },
  { id: 3, name: '기업 C', price: '9,430', target: '12,500', lock: true },
];

const BrainOff = () => {
  const [data, setData] = useState<any>(null);

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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Screening Logic */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-black flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary-600" />
            작동 중인 알고리즘
          </h3>
          <div className="space-y-4">
            {[
              { icon: <Zap />, title: '실시간 괴리율 필터', desc: '전일 대비 5% 이상의 변동성을 감시합니다.' },
              { icon: <Target />, title: '수급 집중도 분석', desc: '외인/기관의 대량 매집 흔적을 추적합니다.' },
              { icon: <BarChart3 />, title: '지수 무결성 체크', desc: '시장 왜곡 현상을 필터링하여 오차를 줄입니다.' },
            ].map((item, idx) => (
              <div key={idx} className="premium-card bg-white p-5 flex gap-4">
                <div className="text-primary-600 bg-primary-50 p-3 rounded-xl h-fit">
                  {React.cloneElement(item.icon as any, { size: 20 })}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Stock Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black">AI 선별 종목 리스트</h3>
            <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              총 {PREMIUM_STOCKS.length}개 종목 포착
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREMIUM_STOCKS.map((stock) => (
              <div key={stock.id} className="premium-card group relative p-6 bg-white overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-primary-600 tracking-wider">TOP PICK</span>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{stock.name}</h4>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-primary-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 transition-all" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">현재 가격</span>
                    <span className="text-slate-900 font-black">{stock.price}원</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">목표 가격</span>
                    <span className="text-primary-600 font-black">{stock.target}원</span>
                  </div>
                </div>

                {/* PREMIUM LOCK OVERLAY */}
                {stock.lock && (
                  <div className="premium-lock-overlay">
                    <div className="bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-6 text-center border border-white max-w-[200px] transform scale-90 md:scale-100">
                      <div className="bg-slate-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6 text-yellow-400" />
                      </div>
                      <p className="text-slate-900 font-black text-sm mb-3 underline decoration-yellow-400 underline-offset-4">
                        프리미엄 전용
                      </p>
                      <button className="w-full bg-slate-900 text-white text-xs py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                        지금 열어보기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainOff;
