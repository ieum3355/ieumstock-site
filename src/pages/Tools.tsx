import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Percent, ArrowRight, RefreshCw } from 'lucide-react';

const Tools = () => {
  const [calcType, setCalcType] = useState<'compound' | 'dividend' | 'average'>('compound');

  // States for Compound Interest
  const [principal, setPrincipal] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(10);
  const [years, setYears] = useState<number>(5);
  
  // States for Dividend
  const [stockPrice, setStockPrice] = useState<number>(50000);
  const [dividendPerShare, setDividendPerShare] = useState<number>(2000);
  const [targetIncome, setTargetIncome] = useState<number>(1000000);

  // States for Average (물타기)
  const [currentPrice, setCurrentPrice] = useState<number>(10000);
  const [currentShares, setCurrentShares] = useState<number>(100);
  const [buyPrice, setBuyPrice] = useState<number>(8000);
  const [buyShares, setBuyShares] = useState<number>(50);

  const calculateCompound = () => {
    return Math.floor(principal * Math.pow(1 + rate / 100, years));
  };

  const calculateDividend = () => {
    const yield_pct = (dividendPerShare / stockPrice) * 100;
    const requiredShares = Math.ceil(targetIncome / dividendPerShare);
    const requiredCapital = requiredShares * stockPrice;
    return { yield_pct, requiredShares, requiredCapital };
  };

  const calculateAverage = () => {
    const totalCost = (currentPrice * currentShares) + (buyPrice * buyShares);
    const totalShares = currentShares + buyShares;
    return Math.floor(totalCost / totalShares);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight md:text-5xl">
          똑똑한 <span className="text-primary-600">투자 계산기</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          수익률, 배당금, 평단가를 미리 계산하여 전략적인 투자를 계획하세요.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { id: 'compound', name: '복리 계산기', icon: TrendingUp },
          { id: 'dividend', name: '배당 금전수', icon: DollarSign },
          { id: 'average', name: '물타기 계산기', icon: RefreshCw },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCalcType(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${
              calcType === tab.id 
                ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 scale-105' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Calculator Content */}
      <div className="premium-card bg-white p-8 md:p-12 shadow-2xl shadow-slate-100 relative overflow-hidden">
        {/* Compound Interest Calculator */}
        {calcType === 'compound' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">초기 투자금 (원)</label>
                <input 
                  type="number" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-2xl font-black focus:ring-4 focus:ring-primary-500/10 outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">연간 수익률 (%)</label>
                <input 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-2xl font-black focus:ring-4 focus:ring-primary-500/10 outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">투자 기간 (년)</label>
                <input 
                  type="number" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-2xl font-black focus:ring-4 focus:ring-primary-500/10 outline-none"
                />
              </div>
            </div>
            
            <div className="bg-primary-50 rounded-[3rem] p-10 text-center space-y-6 border border-primary-100">
              <div className="inline-block bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-black mb-4">예상 최종 금액</div>
              <div className="text-4xl md:text-5xl font-black text-primary-700 tracking-tighter">
                {calculateCompound().toLocaleString()}원
              </div>
              <p className="text-primary-600/70 font-medium leading-relaxed">
                {years}년 동안 매년 {rate}%씩 자란다면,<br />
                원금 대비 <span className="font-black text-primary-700">{Math.floor((calculateCompound() / principal) * 100)}%</span>의 수익을 얻게 됩니다.
              </p>
            </div>
          </div>
        )}

        {/* Dividend Calculator */}
        {calcType === 'dividend' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">보유 종목 주가 (원)</label>
                <input 
                  type="number" 
                  value={stockPrice} 
                  onChange={(e) => setStockPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-2xl font-black outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">주당 배당금 (원)</label>
                <input 
                  type="number" 
                  value={dividendPerShare} 
                  onChange={(e) => setDividendPerShare(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-2xl font-black outline-none"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">목표 배당 소득 (원)</label>
                <input 
                  type="number" 
                  value={targetIncome} 
                  onChange={(e) => setTargetIncome(Number(e.target.value))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-2xl font-black outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8">
              <div className="space-y-1">
                <p className="text-slate-400 text-sm font-bold">배당 수익률</p>
                <p className="text-3xl font-black text-primary-400">{calculateDividend().yield_pct.toFixed(2)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-sm font-bold">필요한 주식 수</p>
                <p className="text-3xl font-black">{calculateDividend().requiredShares.toLocaleString()}주</p>
              </div>
              <div className="pt-6 border-t border-slate-800 space-y-1">
                <p className="text-slate-400 text-sm font-bold">필요 계좌 총액</p>
                <p className="text-4xl font-black text-white">{calculateDividend().requiredCapital.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        )}

        {/* Average Price Calculator */}
        {calcType === 'average' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">현재 평단가</label>
                  <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} className="w-full bg-slate-50 border-none rounded-xl p-4 font-black" />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">보유 수량</label>
                  <input type="number" value={currentShares} onChange={(e) => setCurrentShares(Number(e.target.value))} className="w-full bg-slate-50 border-none rounded-xl p-4 font-black" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">추가 매수가</label>
                  <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} className="w-full bg-slate-50 border-none rounded-xl p-4 font-black" />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">추가 수량</label>
                  <input type="number" value={buyShares} onChange={(e) => setBuyShares(Number(e.target.value))} className="w-full bg-slate-50 border-none rounded-xl p-4 font-black" />
                </div>
              </div>
            </div>

            <div className="bg-primary-600 rounded-[3rem] p-12 text-white text-center space-y-6 shadow-2xl shadow-primary-200">
              <div className="text-xl font-bold opacity-80">최종 예상 평단가</div>
              <div className="text-5xl font-black tracking-tighter">
                {calculateAverage().toLocaleString()}원
              </div>
              <div className="pt-6 flex justify-between text-sm font-bold opacity-70">
                <span>총 수량: {(currentShares + buyShares).toLocaleString()}주</span>
                <span>총 투자금: {((currentPrice * currentShares) + (buyPrice * buyShares)).toLocaleString()}원</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tip Card */}
      <div className="bg-slate-50 rounded-3xl p-8 flex items-start gap-6 border border-slate-100">
        <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-50">
          <Calculator className="w-8 h-8 text-primary-600" />
        </div>
        <div className="space-y-2">
          <h4 className="font-black text-slate-900">계산기는 도구일 뿐입니다</h4>
          <p className="text-slate-500 font-medium leading-relaxed">
            모든 투자의 책임은 본인에게 있습니다. 수치상의 이익보다 중요한 것은 시장의 흐름과 기업의 펀더멘털을 이해하는 것입니다. 
            계산기로 전략을 세웠다면, 이제 <span className="text-primary-600 font-bold">인사이트</span> 메뉴에서 실전 노하우를 확인해보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tools;
