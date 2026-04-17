import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight, Quote, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTENT_DB } from '../data/content_db';

interface MarketData {
  name: string;
  value: string;
  rate: string;
}

interface DashboardData {
  generation_info: {
    engine: string;
    timestamp: string;
    market_condition: string;
  };
  market_summary: MarketData[];
  recommendations: any[];
}

const Home = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [dynamicInsight, setDynamicInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get daily quote based on date
  const today = new Date();
  const quoteIndex = today.getDate() % CONTENT_DB.quotes.length;
  const dailyQuote = CONTENT_DB.quotes[quoteIndex];
  const [quoteText, quoteAuthor] = dailyQuote.includes(' - ') 
    ? dailyQuote.split(' - ') 
    : [dailyQuote, '익명'];

  // Clear emphasis on dynamic data
  const recentInsight = dynamicInsight;

  useEffect(() => {
    const loadData = async () => {
      try {
        const v = new Date().getTime();
        const [dashRes, insightRes] = await Promise.all([
          fetch(`/ieumstock-site/dashboard_data.json?v=${v}`),
          fetch(`/ieumstock-site/daily_insights.json?v=${v}`).catch(() => null)
        ]);

        if (dashRes.ok) {
          const dashResult = await dashRes.json();
          if (dashResult.generation_info) setData(dashResult);
          else setError('데이터 구조가 올바르지 않습니다.');
        }

        if (insightRes && insightRes.ok) {
          const insightResult = await insightRes.json();
          if (insightResult.length > 0) {
            setDynamicInsight(insightResult[0]);
          }
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
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-black tracking-widest uppercase mb-2">
            실시간 시장 보드
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">오늘의 시장 인사이트</h1>
          <p className="text-slate-500 text-lg font-medium">데이터 무결성 기반의 정밀 분석 결과를 확인하세요.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 bg-white shadow-xl shadow-slate-100 rounded-[2rem] border border-slate-50">
          <div className={`p-2 rounded-full ${data ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">시스템 상태</p>
            <p className="text-sm font-bold text-slate-900">{data ? `점검완료: ${data.generation_info.timestamp}` : '데이터 수집 중'}</p>
          </div>
        </div>
      </div>

      {/* Market Indices Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="premium-card animate-pulse h-40 bg-slate-50"></div>
          ))
        ) : error ? (
          <div className="col-span-full premium-card border-red-100 bg-red-50 text-red-700 flex items-center gap-4 p-8">
            <AlertCircle className="w-8 h-8 opacity-50" /> 
            <div>
              <p className="font-black text-lg">데이터 연결 오류</p>
              <p className="font-medium opacity-80">{error}</p>
            </div>
          </div>
        ) : (
          data?.market_summary.map((item, idx) => {
            const isUp = !item.rate.startsWith('-');
            return (
              <div key={idx} className="premium-card bg-white hover:border-primary-100 transition-all group overflow-hidden relative">
                {/* Decorative background element */}
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] transition-transform group-hover:scale-150 ${isUp ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-xs font-black text-slate-400 tracking-widest uppercase">{item.name}</span>
                    <div className="text-3xl font-black mt-2 text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">{item.value}</div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-sm ${isUp ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                    {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {item.rate}%
                  </div>
                </div>
                
                <div className="mt-8 space-y-2 relative z-10">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>하락장 (BEAR)</span>
                    <span>상승장 (BULL)</span>
                  </div>
                  <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out shadow-sm ${isUp ? 'bg-rose-400' : 'bg-blue-400'}`}
                      style={{ width: isUp ? '65%' : '35%' }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Quote Section */}
        <div className="premium-card !bg-slate-900 text-white !p-10 flex flex-col justify-center relative overflow-hidden group">
          <Quote className="absolute top-8 left-8 w-20 h-20 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-primary-400 border border-white/10">
              오늘의 명언
            </div>
            <p className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
              "{quoteText}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-primary-500"></div>
              <p className="text-lg font-bold text-slate-400">{quoteAuthor}</p>
            </div>
          </div>
        </div>

        {/* Recent Insight Section */}
        {recentInsight ? (
          <Link to="/insights" className="premium-card bg-white p-10 border-l-4 border-l-primary-600 hover:shadow-2xl hover:shadow-primary-100 transition-all group">
            <div className="space-y-6 h-full flex flex-col">
              <div className="flex justify-between items-start">
                <div className="bg-primary-50 p-4 rounded-[1.5rem] group-hover:bg-primary-600 transition-colors">
                  <BookOpen className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex items-center gap-2 text-slate-300 group-hover:text-primary-600 transition-all font-black text-sm uppercase tracking-widest">
                  최신 인사이트 <ChevronRight className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 leading-snug group-hover:text-primary-700 transition-colors">
                  {recentInsight.article_info.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">
                  {recentInsight.content_body.introduction.text}
                </p>
              </div>
              <div className="mt-auto pt-6 flex items-center gap-4 text-xs font-black text-slate-400 tracking-widest uppercase">
                <span>{recentInsight.article_info.date}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span className="text-primary-500">Must Read</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="premium-card bg-slate-50 p-10 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-slate-200">
            <div className="p-4 bg-white rounded-full text-slate-300 shadow-sm">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="font-black text-slate-900">최신 인사이트를 분석 중입니다</p>
              <p className="text-sm text-slate-500 font-medium">잠시 후 오늘의 정밀 분석 리포트를 확인하세요.</p>
            </div>
          </div>
        )}
      </div>

      {/* Featured Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {[
          { name: '용어 사전', desc: '필수 투자 상식', path: '/dictionary', color: 'bg-indigo-50 text-indigo-600' },
          { name: '투자 도구', desc: '수익률/복리 계산', path: '/tools', color: 'bg-amber-50 text-amber-600' },
          { name: '브레인 오프', desc: 'AI 급등주 탐지', path: '/brain-off', color: 'bg-emerald-50 text-emerald-600' },
          { name: '비밀 노트', desc: '고수의 투자 전략', path: '/insights', color: 'bg-rose-50 text-rose-600' }
        ].map((item, idx) => (
          <Link key={idx} to={item.path} className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-primary-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-primary-100/20 transition-all text-center space-y-4">
            <div className={`inline-flex p-4 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 group-hover:text-primary-600 transition-colors">{item.name}</h4>
              <p className="text-sm font-medium text-slate-400">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

