import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, Crown, Zap, ShieldCheck, Info, ChevronRight, BarChart3, 
  Target, KeyRound, AlertTriangle, TrendingUp, Sparkles, Activity
} from 'lucide-react';

const BrainOff = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Check persistence
      const savedAuth = localStorage.getItem('ieumstock_auth');
      if (savedAuth === 'true') setIsAuthenticated(true);

      try {
        const [dashRes, histRes] = await Promise.all([
          fetch('/dashboard_data.json'),
          fetch('/history_data.json').catch(() => null)
        ]);

        const dashResult = await dashRes.json();
        if (dashResult.generation_info) setData(dashResult);

        if (histRes && histRes.ok) {
          const histResult = await histRes.json();
          setHistory(histResult);
        }
      } catch (e) {
        console.error("Data load failed");
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0000') {
      setIsAuthenticated(true);
      localStorage.setItem('ieumstock_auth', 'true');
      setError('');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ieumstock_auth');
    setPassword('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-20 text-white text-center">
        <div className="absolute top-0 right-0 p-8">
          <Crown className="w-16 h-16 text-primary-500 opacity-20 animate-pulse" />
        </div>
        <div className="relative z-20 max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 text-primary-400 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-primary-600/30">
            <Sparkles className="w-4 h-4" />
            Brain-Off Hybrid 2.1 Engine
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
            감정은 빼고, <span className="text-primary-500">데이터</span>로 승부하세요
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            상위 0.1% 알고리즘이 실시간 수급과 차트 패턴을 분석하여<br className="hidden md:block" /> 
            가장 승률 높은 타점만을 정밀하게 추출합니다.
          </p>
          
          {data?.generation_info && (
            <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Engine Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <span className="text-sm font-black text-emerald-500 uppercase">Verified Active</span>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Condition</p>
                <p className="text-sm font-black text-white">{data.generation_info.market_condition}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Market Summary Tiles */}
      {data?.market_summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.market_summary.map((m: any) => (
            <div key={m.name} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{m.name} Index</h4>
                <p className="text-3xl font-black text-slate-900">{m.value}</p>
              </div>
              <div className={`px-4 py-2 rounded-2xl font-black text-sm ${m.rate.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {m.rate}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Screening Logic Visuals */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-600" />
            Core Analytics Engine
          </h3>
          <div className="space-y-4">
            {[
              { icon: <Zap />, title: 'Real-time Breakout', desc: '직전 고점 돌파 및 매물대 소화 과정을 실시간 추적합니다.', status: 'SCANNING' },
              { icon: <Target />, title: 'Institutional Flow', desc: '기관과 외국인의 집중 매집 구간을 정밀 분석합니다.', status: 'TRACKING' },
              { icon: <BarChart3 />, title: 'Volatility Filter', desc: '시장의 노이즈를 제거하고 순수 에너지를 측정합니다.', status: 'VERIFIED' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-[2rem] bg-white border border-slate-100 flex gap-5 group hover:border-primary-200 transition-all duration-300">
                <div className="text-primary-600 bg-primary-50 p-4 rounded-2xl h-fit group-hover:scale-110 transition-transform">
                  {React.cloneElement(item.icon as any, { size: 22 })}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-900 text-sm">{item.title}</h4>
                    <span className="text-[9px] font-black text-emerald-500 px-2 py-0.5 bg-emerald-50 rounded uppercase tracking-widest">{item.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오늘의 맥점 돌파주 (Swing Engine Results) */}
        {data?.swing_candidates && data.swing_candidates.length > 0 && (
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-primary-600 fill-primary-600" />
                  오늘의 맥점 돌파주
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Swing Breakout Candidates (A·B·D·!E)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.swing_candidates.map((swing: any) => (
                <div key={swing.ticker} className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Target className="w-12 h-12 text-white" />
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white text-xl font-black tracking-tight">{swing.name}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{swing.ticker}</p>
                      </div>
                      <span className="text-emerald-400 font-black text-sm">{swing.rate}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500 uppercase">Breakout Level</span>
                        <span className="text-primary-400 font-black">{swing.breakout_level.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500 uppercase">Current Price</span>
                        <span className="text-white font-black">{swing.price.toLocaleString()}원</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full inline-block">
                        <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest">{swing.logic}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">AI 선별 종목</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Selected Recommendations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[10px] font-black text-primary-600 bg-primary-50 px-4 py-2 rounded-full uppercase tracking-widest border border-primary-100 animate-pulse">
                Live Feed Active
              </div>
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  Logout
                </button>
              ) : (
                <button 
                  onClick={() => {
                    const pass = prompt('Enter 4-digit Admin Code:');
                    if (pass === '0000') {
                      setIsAuthenticated(true);
                      localStorage.setItem('ieumstock_auth', 'true');
                    } else if (pass) {
                      alert('Invalid password');
                    }
                  }}
                  className="text-[10px] font-black text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  Admin Login
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : !data || !data.recommendations || data.recommendations.length === 0 ? (
            <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-600/20 to-transparent"></div>
              <div className="relative z-10 space-y-6 max-w-lg mx-auto">
                <div className="inline-flex p-6 bg-white/5 rounded-[2.5rem] border border-white/10 mb-2">
                  <AlertTriangle className="w-12 h-12 text-rose-400" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-3xl font-black text-white tracking-tight">시장 관망 권고</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    {data?.generation_info?.status_msg || "현재 알고리즘 기준을 충족하는 고득점 종목이 포착되지 않았습니다."}
                    <br />무리한 매매보다 현금 비중 확대를 권장합니다.
                  </p>
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  AI Engine is constantly re-scanning for setups...
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-6 duration-700">
              {data.recommendations.map((rec: any) => {
                const isCardLocked = rec.metadata.tier === 'Premium' && !isAuthenticated;
                return (
                  <Link 
                    key={rec.metadata.id} 
                    to={isCardLocked ? '#' : `/insights/${rec.metadata.slug}`}
                    onClick={(e) => {
                      if (isCardLocked) {
                        e.preventDefault();
                        const pass = prompt('Premium access password required:');
                        if (pass === '0000') {
                          setIsAuthenticated(true);
                          localStorage.setItem('ieumstock_auth', 'true');
                          // Navigate immediately after successful auth
                          setTimeout(() => {
                            navigate(`/insights/${rec.metadata.slug}`);
                          }, 100);
                        }
                      }
                    }}
                    className="group bg-white border border-slate-100 hover:border-primary-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-primary-100/30 transition-all duration-500 relative overflow-hidden"
                  >
                    {isCardLocked && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center shadow-xl">
                          <Lock className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900">Premium 분석 잠금</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Click to Unlock</p>
                        </div>
                      </div>
                    )}
                    
                    {rec.metadata.tier === 'Premium' && (
                      <div className="absolute top-0 right-0 p-4">
                        <Crown className="w-5 h-5 text-amber-400 opacity-30 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                          rec.metadata.tier === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-primary-50 text-primary-600'
                        }`}>
                          {rec.metadata.tier}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rec.stock_info.sector}</span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-3xl font-black text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight">
                          {isAuthenticated || rec.metadata.tier === 'Standard' ? rec.stock_info.real_name : rec.stock_info.name}
                        </h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                          {isAuthenticated || rec.metadata.tier === 'Standard' ? rec.stock_info.ticker : '*******'} / {rec.stock_info.market}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Target</p>
                          <p className="text-sm font-black text-slate-900">
                            {isCardLocked ? '***,***원' : `${rec.trading_strategy.entry_price.toLocaleString()}원`}
                          </p>
                        </div>
                        <div className="p-4 bg-primary-50 rounded-2xl space-y-1">
                          <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest">AI Score</p>
                          <p className="text-sm font-black text-slate-900">{rec.score_card.total_score}</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${rec.live_status.profit_pct.startsWith('+') ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                          <span className={`text-sm font-black ${rec.live_status.profit_pct.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {rec.live_status.profit_pct}
                          </span>
                        </div>
                        <span className="text-primary-600 font-black text-[11px] flex items-center gap-1 group-hover:translate-x-1 transition-transform uppercase tracking-widest">
                          View Analysis <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {isAuthenticated && history.length > 0 && (
        <div className="space-y-8 pt-10 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">추천 성과 기록</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Performance History</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map((h) => (
                    <tr key={h.slug} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="text-xs font-black text-slate-900">{h.date}</p>
                        <p className="text-[9px] font-bold text-slate-400">{h.id}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-base font-black text-slate-900">{h.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{h.ticker}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          h.tier === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-primary-50 text-primary-600'
                        }`}>
                          {h.tier}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600">
                        {h.entry_price.toLocaleString()}원
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-900">
                        {h.current_price.toLocaleString()}원
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                            h.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 
                            h.status === 'FAILED' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {h.status}
                          </span>
                          <span className={`text-sm font-black ${h.profit_pct.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {h.profit_pct}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainOff;
