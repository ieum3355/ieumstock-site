import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, Crown, Zap, ShieldCheck, Info, ChevronRight, BarChart3, 
  Target, KeyRound, AlertTriangle, TrendingUp, Sparkles, Activity,
  Search, Bell, ArrowRight, MousePointer2, Percent, CheckCircle2,
  Calendar, Layers, LineChart, Shield
} from 'lucide-react';

const BrainOff = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [alertStock, setAlertStock] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const savedAuth = localStorage.getItem('ieumstock_auth');
      if (savedAuth === 'true') setIsAuthenticated(true);

      try {
        const v = new Date().getTime();
        const res = await fetch(`/dashboard_data.json?v=${v}`);
        const result = await res.json();
        if (result.generation_info) {
          setData(result);
          // Check for action required items
          const actionable = result.recommendations?.find((r: any) => r.metadata.action_required);
          if (actionable) {
            setAlertStock(actionable);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 8000);
          }
        }

        // Load History
        const hRes = await fetch(`/recommendation_history.json?v=${v}`);
        const hResult = await hRes.json();
        if (Array.isArray(hResult)) {
          setHistory(hResult);
        }
      } catch (e) {
        console.error("Data load failed");
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ieumstock_auth');
  };

  const handleUnlock = (slug: string) => {
    const pass = prompt('Premium 멤버십 비밀번호를 입력하세요 (MVP: 0000):');
    if (pass === '0000') {
      setIsAuthenticated(true);
      localStorage.setItem('ieumstock_auth', 'true');
      setTimeout(() => navigate(`/insights/${slug}`), 100);
    } else if (pass) {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const YMGStep = ({ icon: Icon, title, desc, isActive }: any) => (
    <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${
      isActive 
        ? 'bg-emerald-500/10 border-emerald-500/30' 
        : 'bg-white/5 border-white/10 grayscale opacity-50'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
        isActive ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-white/10 text-white/40'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-white font-black text-sm mb-1">{title}</h4>
      <p className="text-slate-400 text-[11px] leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 space-y-12 animate-in fade-in duration-1000">
      
      {/* Action Point Toast */}
      {showToast && alertStock && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in slide-in-from-top-12 duration-500">
          <div className="bg-emerald-500 text-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] border border-emerald-400/30 flex items-center gap-5">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">수익 실현 타이밍!</p>
              <p className="text-sm font-black leading-tight">
                [{alertStock.stock_info.real_name}] 종목이 1차 목표가에 도달했습니다. 50% 분할 익절을 권고합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Radar Concept */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-[3.5rem] p-8 md:p-24 border border-white/5">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Activity className="w-32 h-32 text-emerald-500 animate-pulse" />
        </div>
        
        {/* Radar Animation Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
          <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-ping duration-3000"></div>
          <div className="absolute inset-0 border border-emerald-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent -translate-y-1/2 rotate-45"></div>
        </div>

        <div className="relative z-10 max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-4 h-4" />
            BRAIN-OFF RADAR 1.0 (Live)
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white">
            바닥에서 잡는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">브레인 오프</span> 시스템
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            장기 이평선 역배열을 뚫고 올라오는 '상승 초입' 종목을 정밀 스캔합니다. 
            감정에 휘둘리지 않는 기계적인 익절 시스템을 경험하세요.
          </p>
          
          {data?.generation_info && (
            <div className="flex flex-wrap gap-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">엔진 상태</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                  <span className="text-sm font-black text-emerald-400 uppercase tracking-tighter">브레인 오프 스캔 중</span>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10 hidden md:block"></div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">분석 로직</p>
                <p className="text-sm font-black text-white">영매공파 (Y-M-G-P) 알고리즘</p>
              </div>
              <div className="w-px h-8 bg-white/10 hidden md:block"></div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">최종 갱신</p>
                <p className="text-sm font-black text-white">{data.generation_info.timestamp}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* YMG Logic Visualization */}
      <div className="space-y-8">
        <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-3">
          <div className="w-6 h-px bg-emerald-500/30"></div>
          Core Scanning Logic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <YMGStep 
            icon={Layers} 
            title="역배열 (Reverse)" 
            desc="448 > 224 > 112일선 순서의 저평가 구간 포착"
            isActive={true}
          />
          <YMGStep 
            icon={Zap} 
            title="매집봉 (Gathering)" 
            desc="세력 수급을 상징하는 대량 거래량 흔적 확인"
            isActive={true}
          />
          <YMGStep 
            icon={Shield} 
            title="공구리 (Concrete)" 
            desc="하방 경직성을 확보한 튼튼한 바닥 지지 라인"
            isActive={true}
          />
          <YMGStep 
            icon={Percent} 
            title="파란점선 (Signal)" 
            desc="에너지 응축 후 112일선 돌파의 결정적 타이밍"
            isActive={true}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Today's Free Swing YMG */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                오늘의 무료 스윙 타점
                <span className="text-sm font-black text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 uppercase tracking-widest">Free</span>
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">단기 기술적 파동 및 수급 분석 완료</p>
            </div>
          </div>

          {!loading && data?.recommendations?.some((r: any) => r.metadata.tier === 'Standard') ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.recommendations.filter((r: any) => r.metadata.tier === 'Standard').map((rec: any) => (
                <div key={rec.metadata.slug} className="group bg-slate-900 border border-white/5 p-8 rounded-[3rem] hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
                  {rec.metadata.action_required && (
                    <div className="absolute top-6 right-6">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_10px_#f43f5e]"></span>
                      </span>
                    </div>
                  )}
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{rec.stock_info.name}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mt-1">{rec.stock_info.ticker}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-black ${rec.live_status.profit_pct.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {rec.live_status.profit_pct}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">오늘의 등락</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">진입가/목표가</p>
                        <p className="text-xs font-black text-white">
                          <span className="text-slate-400">{rec.trading_strategy.entry_price.toLocaleString()}</span>
                          <ArrowRight className="inline w-3 h-3 mx-2 text-emerald-500" />
                          <span className="text-emerald-400">{rec.trading_strategy.target_price.toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">손절라인</p>
                        <p className="text-xs font-black text-rose-400">{rec.trading_strategy.stop_loss.toLocaleString()}원</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 italic">
                      " {rec.analysis_report.summary} "
                    </p>

                    <button 
                      onClick={() => navigate(`/insights/${rec.metadata.slug}`)}
                      className="w-full py-4 bg-white/5 border border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40 rounded-2xl text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                    >
                      전략 시나리오 상세 보기 <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white/5 rounded-[3rem] border border-dashed border-white/10 text-center">
              <p className="text-slate-500 font-black uppercase tracking-widest">스윙 조건 부합 종목 탐색 중...</p>
            </div>
          )}
        </div>

        {/* Profit Management Guide Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 rounded-[3rem] space-y-8 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <ShieldCheck className="w-40 h-40 text-emerald-400" />
            </div>
            <div className="space-y-2 relative z-10">
              <h4 className="text-2xl font-black text-emerald-400 tracking-tight">익절 자동화 가이드</h4>
              <p className="text-xs text-emerald-400/60 font-bold uppercase tracking-widest font-mono">Profit Management Protocol</p>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500 text-slate-950 rounded-xl flex items-center justify-center font-black shrink-0">1차</div>
                <div className="space-y-1">
                  <p className="font-black text-white text-sm">224/448일 기계적 익절</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    강력한 저항대인 장기 이평선 도달 시 <span className="text-white font-bold underline">물량의 50%를 무조건 수익실현</span>합니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-cyan-500 text-slate-950 rounded-xl flex items-center justify-center font-black shrink-0">2차</div>
                <div className="space-y-1">
                  <p className="font-black text-white text-sm">반익반본 (Trailing Stop)</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    절반 수익 확보 후, 주가가 꺾여 <span className="text-white font-bold underline">본절가 위협 시 남은 물량 전량 정리</span>로 수익 보존.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-3 text-emerald-400/80 font-black text-[10px] uppercase tracking-widest">
                <Info className="w-3 h-3" />
                감정을 버려야 계좌가 불어납니다
              </div>
            </div>
          </div>

          {/* AI Status Card */}
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] space-y-4">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-emerald-500/10 rounded-2xl">
                 <LineChart className="w-6 h-6 text-emerald-400" />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Brain-Off Win-Rate</p>
                 <p className="text-xl font-black text-white tracking-tighter">84.2% <span className="text-[10px] text-emerald-400 ml-1">▲2.1%</span></p>
               </div>
             </div>
             <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
               과거 시뮬레이션 데이터 기준, 브레인 오프 타점 진입 시 한 달 내 수익 달성 확률입니다.
             </p>
          </div>
        </div>

        {/* Premium Mid-long term - Dual Track Lower Section */}
        <div className="lg:col-span-12 space-y-8 pt-10 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                프리미엄 중장기 가치주
                <Crown className="w-8 h-8 text-amber-500 fill-amber-500/20" />
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">영매공파 타점 + 퀀트/어라운드 분석 리포트 결합</p>
            </div>
            {isAuthenticated ? (
               <button onClick={handleLogout} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-400 transition-colors">멤버십 로그아웃</button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!loading && data?.recommendations?.some((r: any) => r.metadata.tier === 'Premium') ? (
              data.recommendations.filter((r: any) => r.metadata.tier === 'Premium').map((rec: any) => (
                <div key={rec.metadata.slug} className="group relative">
                  {!isAuthenticated && (
                    <div className="absolute inset-x-2 inset-y-2 bg-slate-950/60 backdrop-blur-xl z-20 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center p-8 text-center space-y-6">
                      <div className="w-16 h-16 bg-white/5 text-amber-500 rounded-3xl flex items-center justify-center shadow-2xl border border-amber-500/20">
                        <Lock className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-black text-white tracking-tight">Premium 분석 리포트 잠금</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                          영매공파 타점은 기본, 실시간 업황 분석까지<br />결합된 최상위 0.1% 정보를 확인하세요.
                        </p>
                      </div>
                      <button 
                        onClick={() => handleUnlock(rec.metadata.slug)}
                        className="px-8 py-3 bg-amber-500 text-slate-950 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(245,158,11,0.3)]"
                      >
                        Unlock Now
                      </button>
                    </div>
                  )}
                  
                  <div className={`bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] hover:border-amber-500/30 transition-all duration-700 space-y-8 ${!isAuthenticated ? 'blur-sm select-none grayscale' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[8px] font-black uppercase tracking-widest border border-amber-500/20">
                          AI Turnaround Point
                        </div>
                        <h4 className="text-3xl font-black text-white">{rec.stock_info.name}</h4>
                        <p className="text-xs font-black text-slate-500 font-mono italic">{rec.stock_info.ticker}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-amber-500">{rec.analysis_report.fundamental_score}점</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Fundamental Score</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5 space-y-3">
                         <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI 시세 전망</p>
                            <Sparkles className="w-3 h-3 text-amber-500" />
                         </div>
                         <p className="text-xs text-slate-300 font-medium leading-relaxed">
                           {rec.analysis_report.ai_insight}
                         </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">목표 수익률</p>
                          <p className="text-xl font-black text-emerald-400">+50.0% ~ +100.0%</p>
                       </div>
                       <button className="p-4 bg-white/5 rounded-2xl text-slate-400 group-hover:text-amber-500 transition-colors">
                          <MousePointer2 className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white/5 h-80 rounded-[3rem] animate-pulse"></div>
              ))
            )}
          </div>
        </div>

        {/* --- NEW: Performance History Section --- */}
        <div className="lg:col-span-12 space-y-8 pt-10 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                과거 추천 성과 아카이브
                <BarChart3 className="w-8 h-8 text-cyan-500" />
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">날짜별 브레인 오프 엔진 포착 내역 (최근 100건)</p>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-white/5 rounded-[3rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">추천일</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">종목명</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">등급</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">포착가</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">목표가</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">상태</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.length > 0 ? history.map((item: any) => (
                    <tr key={item.metadata.slug} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-slate-600" />
                          <span className="text-xs font-bold text-slate-400">{item.metadata.date}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-0.5">
                          <p className="text-sm font-black text-white">{item.stock_info.real_name}</p>
                          <p className="text-[10px] font-bold text-slate-500 font-mono">{item.stock_info.ticker}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          item.metadata.tier === 'Premium' 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {item.metadata.tier}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-slate-300">{item.trading_strategy.entry_price.toLocaleString()}원</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-emerald-400">{item.trading_strategy.target_price.toLocaleString()}원</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.metadata.action_required ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                            {item.metadata.action_required ? '수익실현 권고' : '추세 유지'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => navigate(`/insights/${item.metadata.slug}`)}
                          className="p-3 bg-white/5 rounded-xl text-slate-500 group-hover:text-emerald-400 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-8 py-20 text-center text-slate-500 font-black uppercase tracking-widest">
                        히스토리 데이터를 불러오는 중이거나 데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Admin Quick Login Footnote */}
      {!isAuthenticated && (
        <div className="flex justify-center pt-10">
          <button 
            onClick={() => handleUnlock('admin')}
            className="text-[10px] font-black text-slate-700 hover:text-emerald-500 transition-colors uppercase tracking-[0.3em] flex items-center gap-2"
          >
            <KeyRound className="w-3 h-3" />
            Premium Access Portal
          </button>
        </div>
      )}

    </div>
  );
};

export default BrainOff;
