import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MarketData {
  name: string;
  value: string;
  rate: string;
}

interface DashboardData {
  system: {
    status: string;
    date: string;
  };
  market: MarketData[];
  stocks: any[];
}

const Home = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('./dashboard_data.json');
        if (!response.ok) throw new Error('Data not found');
        const result = await response.json();
        
        if (result.system.status === "Verified") {
          setData(result);
        } else {
          setError('데이터 무결성 검증 실패');
        }
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">오늘의 시장 인사이트</h1>
          <p className="text-slate-500 mt-2">전문가 수준의 데이터 분석과 실시간 시장 지표를 확인하세요.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-100">
          <CheckCircle2 className="w-4 h-4" />
          {data ? `검증됨: ${data.system.date}` : '검증 중...'}
        </div>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="premium-card animate-pulse h-32 bg-slate-100"></div>
          ))
        ) : error ? (
          <div className="col-span-full premium-card border-red-200 bg-red-50 text-red-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        ) : (
          data?.market.map((item, idx) => {
            const isUp = !item.rate.startsWith('-');
            return (
              <div key={idx} className="premium-card group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-bold text-slate-500 tracking-wider uppercase">{item.name}</span>
                    <div className="text-3xl font-black mt-2 text-slate-900">{item.value}</div>
                  </div>
                  <div className={`flex items-center gap-1 font-bold ${isUp ? 'text-rose-500' : 'text-blue-500'}`}>
                    {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {item.rate}%
                  </div>
                </div>
                <div className="mt-4 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${isUp ? 'bg-rose-400 w-2/3' : 'bg-blue-400 w-1/3'}`}></div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Featured Insights */}
      <div className="premium-card border-l-4 border-l-primary-600 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <Newspaper className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold">주요 마켓 브리핑</h2>
        </div>
        <div className="space-y-6">
          <div className="group cursor-pointer">
            <div className="text-lg font-bold group-hover:text-primary-600 transition-colors">
              [분석] 현재 지수 5,000대 진입을 위한 기술적 조건과 거시경제적 전망
            </div>
            <p className="text-slate-600 mt-2 leading-relaxed">
              최근 지수 변동성이 확대됨에 따라 데이터 무결성에 기반한 정밀한 분석이 요구되고 있습니다. 
              이음스탁 Pro의 엔진은 실시간 시세와 전일 대비 괴리율을 분석하여 최적의 진입 시점을 도출합니다...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
