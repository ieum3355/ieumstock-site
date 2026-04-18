import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CONTENT_DB } from '../data/content_db';
import { 
  ArrowLeft, Calendar, Clock, Share2, Bookmark, BookmarkCheck, 
  Lock, AlertCircle, ChevronRight, TrendingUp, Target, ShieldAlert,
  Zap, Lightbulb, CheckCircle2, MessageSquareQuote, Info,
  ShieldCheck, BookOpen
} from 'lucide-react';

const AnalysisIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case 'trend': return <TrendingUp className="w-6 h-6 text-emerald-500" />;
    case 'risk': return <ShieldAlert className="w-6 h-6 text-rose-500" />;
    case 'volume': return <Zap className="w-6 h-6 text-amber-500" />;
    case 'analysis': return <Target className="w-6 h-6 text-blue-500" />;
    case 'psychology': return <Info className="w-6 h-6 text-purple-500" />;
    case 'strategy': return <Lightbulb className="w-6 h-6 text-primary-500" />;
    default: return <AlertCircle className="w-6 h-6 text-slate-400" />;
  }
};

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passError, setPassError] = useState(false);

  useEffect(() => {
    // Check auth persistence
    const savedAuth = localStorage.getItem('ieumstock_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);
    
    const findPost = async () => {
      setLoading(true);
      
      // 1. Try finding in dynamic recommendations first (Prioritize latest AI data)
      try {
        const v = new Date().getTime();
        const [dashRes, insightRes] = await Promise.all([
          fetch(`/dashboard_data.json?v=${v}`),
          fetch(`/daily_insights.json?v=${v}`).catch(() => null)
        ]);

        if (dashRes && dashRes.ok) {
          try {
            const data = await dashRes.json();
            const dynamicRec = (data.recommendations || []).find((p: any) => 
              p.metadata?.id?.toString() === id || 
              p.metadata?.slug === id ||
              p.stock_info?.ticker === id
            );
            if (dynamicRec) {
              setPost({ ...dynamicRec, type: 'recommendation' });
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error("Dashboard JSON parse failed", err);
          }
        }

        if (insightRes && insightRes.ok) {
          try {
            const insights = await insightRes.json();
            const dynamicInsight = (Array.isArray(insights) ? insights : []).find((p: any) => 
              p.article_info?.id?.toString() === id || 
              p.article_info?.slug === id
            );
            if (dynamicInsight) {
              setPost({ ...dynamicInsight, type: 'article' });
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error("Insights JSON parse failed", err);
          }
        }
        // 3. Fallback to static articles from CONTENT_DB
        const staticPost = CONTENT_DB.blog_posts.find(p => p.article_info.id.toString() === id || p.article_info.slug === id);
        if (staticPost) {
          setPost({ ...staticPost, type: 'article' });
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (e) {
        console.error("Dynamic data fetch failed", e);
        
        // Final fallback even on error
        const staticPost = CONTENT_DB.blog_posts.find(p => p.article_info.id.toString() === id || p.article_info.slug === id);
        if (staticPost) {
          setPost({ ...staticPost, type: 'article' });
        }
        setLoading(false);
      }
    };

    findPost();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">데이터 정밀 분석 중...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 space-y-6">
        <h2 className="text-2xl font-black text-slate-900">찾으시는 리포트가 없습니다.</h2>
        <p className="text-slate-500">삭제되었거나 잘못된 경로입니다.</p>
        <button 
          onClick={() => navigate('/insights')}
          className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-100 hover:bg-primary-500 transition-all"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const isLocked = post?.type === 'recommendation' && post?.metadata?.tier === 'Premium' && !isAuthenticated;
  const seo = post?.type === 'recommendation' ? {
    page_title: post?.seo_content?.page_title || `${post?.stock_info?.real_name} 분석 리포트`,
    meta_description: post?.seo_content?.meta_description || "이음스탁 AI 정밀 종목 분석 결과",
    keywords: post?.seo_content?.keywords || ["이음스탁", "주식분석"]
  } : {
    page_title: post?.seo_metadata?.meta_title || post?.article_info?.title || "투자 인사이트",
    meta_description: post?.seo_metadata?.meta_description || "",
    keywords: post?.article_info?.tags || ["이음스탁", "주식분석", "투자전략"]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Helmet>
        <title>{seo.page_title} | IEUMSTOCK PRO</title>
        <meta name="description" content={seo.meta_description} />
        <meta name="keywords" content={seo.keywords.join(', ')} />
        {post.type === 'article' && post.seo_metadata?.og_image && (
          <meta property="og:image" content={post.seo_metadata.og_image} />
        )}
      </Helmet>

      {/* Navigation Header */}
      <div className="flex items-center justify-between py-6 border-b border-slate-100">
        <button 
          onClick={() => navigate('/insights')}
          className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-black text-xs uppercase tracking-tight transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          목록으로 돌아가기
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2.5 rounded-xl transition-all ${isBookmarked ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
          <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {post.type === 'recommendation' ? (
        // Recommendation View (AI Dashboard Flow)
        <div className="space-y-12">
          <header className="space-y-6">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-md ${
                post.metadata?.tier === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-primary-50 text-primary-600'
              }`}>
                {post.metadata?.tier || post.article_info?.category || 'Premium'} 추천 리포트
              </span>
              <div className="h-px flex-grow bg-slate-100"></div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  {isAuthenticated ? (post?.stock_info?.real_name || 'Stock') : (post?.stock_info?.name || 'Stock')} <span className="text-slate-300">({post?.stock_info?.ticker || 'TICKER'})</span>
                </h1>
                <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">{post?.stock_info?.sector || '기술적 분석 모델'}</p>
              </div>
              <div className="bg-slate-900 text-white p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">현재가</p>
                  <p className="text-2xl font-black">{post.live_status.current_price.toLocaleString()}원</p>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">수익률(배당)</p>
                  <p className={`text-xl font-black ${post.live_status.profit_pct.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {post.live_status.profit_pct}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                정밀 매매 전략
              </h3>
              
              <div className={`space-y-6 transition-all duration-700 ${isLocked ? 'blur-md select-none pointer-events-none' : ''}`}>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">기술적 분석 (TECHNICAL)</p>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {post.trading_strategy?.scenario || post.trading_strategy?.technical_analysis || '분석 데이터를 불러오는 중입니다.'}
                  </p>
                </div>

                {/* YMG Specific Conditions Indicators */}
                {post.live_status?.ymg_flags && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    {Object.entries(post.live_status.ymg_flags).map(([key, value]) => (
                      <div key={key} className="flex flex-col items-center gap-2 group/flag">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          value ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200/50 scale-110' : 'bg-slate-200 text-slate-400 opacity-40 grayscale'
                        }`}>
                          {value ? <Zap className="w-6 h-6 animate-pulse" /> : <AlertCircle className="w-6 h-6" />}
                        </div>
                        <div className="text-center">
                          <span className={`text-[10px] font-black uppercase tracking-tight block ${value ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {key}
                          </span>
                          <span className="text-[8px] font-bold text-slate-300 uppercase">{value ? 'Detected' : 'Wait'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-primary-50 rounded-3xl border border-primary-100 group hover:bg-primary-600 transition-all duration-500">
                    <p className="text-[10px] font-black text-primary-600 group-hover:text-primary-200 uppercase mb-1">목표가 (Target)</p>
                    <p className="text-xl font-black text-slate-900 group-hover:text-white">
                      {post.trading_strategy?.target_price?.toLocaleString() || '0'}원
                    </p>
                  </div>
                  <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 group hover:bg-rose-600 transition-all duration-500">
                    <p className="text-[10px] font-black text-rose-600 group-hover:text-rose-200 uppercase mb-1">맥점(손절선)</p>
                    <p className="text-xl font-black text-slate-900 group-hover:text-white">
                      {(post.live_status?.breakout_level || post.trading_strategy?.stop_loss || 0).toLocaleString()}원
                    </p>
                  </div>
                </div>

                {post.live_status.breakout_level && (
                  <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10">
                      <Zap className="w-16 h-16 text-white" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Core Signal</p>
                        <h4 className="text-white text-lg font-black">무주공산 맥점 돌파가</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">{post.live_status.breakout_level.toLocaleString()}원</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Breakout Level</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isLocked && (
                <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[2rem] text-center space-y-8 animate-in zoom-in-95 duration-500 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 blur-3xl rounded-full"></div>
                  <Lock className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black">심층 분석 데이터가 잠겨 있습니다</h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">프리미엄 회원이 되시면 AI 정밀 타점과<br />기술적 분석을 실시간으로 확인하실 수 있습니다.</p>
                  </div>
                  
                  <div className="max-w-xs mx-auto space-y-4">
                    <div className="relative">
                      <input 
                        type="password" 
                        placeholder="프리미엄 비밀번호"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (passwordInput === '0000') {
                              setIsAuthenticated(true);
                              localStorage.setItem('ieumstock_auth', 'true');
                            } else {
                              setPassError(true);
                              setTimeout(() => setPassError(false), 2000);
                            }
                          }
                        }}
                        className={`w-full bg-white/5 border ${passError ? 'border-rose-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-center text-xl font-black tracking-[0.5em] focus:outline-none focus:border-primary-500 transition-all`}
                      />
                      {passError && <p className="text-rose-500 text-[10px] font-black uppercase mt-2 tracking-widest">Invalid Password</p>}
                    </div>
                    <button 
                      onClick={() => {
                        if (passwordInput === '0000') {
                          setIsAuthenticated(true);
                          localStorage.setItem('ieumstock_auth', 'true');
                        } else {
                          setPassError(true);
                          setTimeout(() => setPassError(false), 2000);
                        }
                      }}
                      className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-500 transition-all flex items-center justify-center gap-2 group"
                    >
                      리포트 잠금 해제
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      문의: 텔레그램 @ieumstock_pro
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-8">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary-600" />
                  정밀 분석 점수
                </h3>
                {/* Scoring Logic - Keep original */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-500">종합 분석 점수</span>
                    <span className="text-3xl font-black text-primary-600">{post.score_card.total_score} <span className="text-xs text-slate-300">/ 100</span></span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { label: '돌파 에너지 (Breakout)', value: post.score_card.breakout, max: 40 },
                      { label: '매집 강도 (Accumulation)', value: post.score_card.accumulation, max: 30 },
                      { label: '변동성 응축 (Volatility Tight)', value: post.score_card.volatility_tight, max: 20 },
                      { label: '기관/외인 수급 (Institutional)', value: post.score_card.institutional_buy, max: 10 }
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>{item.label}</span>
                          <span>{item.value} / {item.max}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-600 rounded-full transition-all duration-1000"
                            style={{ width: `${(item.value / item.max) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Financial Data Section */}
              {post.financial_data && (
                <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary-600" />
                    재무 분석 요약
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'PER (주가수익비율)', value: post.financial_data.per },
                      { label: 'PBR (주가순자산비율)', value: post.financial_data.pbr },
                      { label: 'EPS (주당순이익)', value: post.financial_data.eps + '원' },
                      { label: '배당수익률', value: post.financial_data.dividend }
                    ].map((f) => (
                      <div key={f.label} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{f.label}</p>
                        <p className="text-lg font-black text-slate-900">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Analysis Report Section */}
          {post.analysis_report && (
            <div className="space-y-12">
              <div className="h-px bg-slate-100"></div>
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <MessageSquareQuote className="w-10 h-10 text-primary-600" />
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">AI 정밀 추천 사유 (DETAILED REPORT)</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="p-10 md:p-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                      <p className="text-2xl md:text-3xl font-bold leading-relaxed whitespace-pre-line relative z-10">
                        "{post.analysis_report.summary}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      브레인 오프 핵심 타점 근거
                    </h4>
                    <div className="space-y-4">
                      {post.analysis_report.why_recommended && post.analysis_report.why_recommended.length > 0 ? (
                        post.analysis_report.why_recommended.map((reason: string, idx: number) => (
                          <div key={idx} className="flex gap-4 items-start p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 transition-all hover:bg-white hover:shadow-xl group">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                              {idx + 1}
                            </div>
                            <p className="text-sm font-bold text-slate-700 leading-snug group-hover:text-emerald-900">{reason}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-5 bg-slate-50 rounded-3xl border border-dotted border-slate-200 text-center">
                          <p className="text-xs font-bold text-slate-400 uppercase italic">상세 텍스트 분석 대기 중...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* AI Trading Guide Section (NEW) */}
          <div className="space-y-12">
            <div className="h-px bg-slate-100"></div>
            <section className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <BookOpen className="w-24 h-24" />
              </div>
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <h3 className="text-3xl font-black tracking-tight">AI 돌파 매매 실전 전략 가이드</h3>
                  <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
                    "이미 10% 이상 오른 종목, 지금 들어가도 될까요?"<br />
                    이음스탁 AI 엔진의 추천은 **상승의 끝이 아닌 에너지가 폭발하는 시작점**을 포착한 것입니다. 아래 가이드를 따라 안전하게 수익을 극대화하세요.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { 
                      icon: <Zap className="text-primary-400" />, 
                      title: "왜 상승 중에 사나요?", 
                      desc: "강력한 매물대를 뚫어낸 종목은 그 관성으로 추가 상승할 확률이 매우 높습니다. 10% 상승은 매수세가 승리했다는 증거입니다." 
                    },
                    { 
                      icon: <Target className="text-primary-400" />, 
                      title: "분할 매수 타이밍", 
                      desc: "추천 당일 비중의 50%를 진입하고, 다음 날 살짝 눌림목(조정)을 줄 때 나머지 50%를 채우는 전략이 리스크 관리에 유리합니다." 
                    },
                    { 
                      icon: <ShieldCheck className="text-primary-400" />, 
                      title: "손절가 칼준수", 
                      desc: "AI가 제시한 손절가(-7% 내외)를 반드시 지키세요. 손실은 짧게 끊고 수익은 목표가(15%+)까지 길게 가져가는 것이 핵심입니다." 
                    }
                  ].map((guide, i) => (
                    <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4 hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        {guide.icon}
                      </div>
                      <h4 className="text-lg font-black">{guide.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">{guide.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-primary-600/20 border border-primary-600/30 rounded-2xl inline-block">
                  <p className="text-sm font-black text-primary-400">💡 Tip: 실시간 시장 상황에 따라 목표가 도달 전이라도 5~7% 수익 구간에서 절반 익절을 권장합니다.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        // Premium Article View
        <div className="space-y-12">
          <header className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-md">
                {post.article_info.category} 인사이트
              </span>
              <div className="h-px flex-grow bg-slate-100"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05]">
              {post.article_info.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-slate-400 font-bold text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-300" />
                <span>{post.article_info.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-300" />
                <span>프리미엄 리포트</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>검증된 인사이트</span>
              </div>
            </div>
          </header>

          {/* Ad Slot: Top */}
          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Advertisement</p>
            <div id="adsense-top" className="w-full min-h-[120px] bg-slate-50/50 border border-slate-100 rounded-3xl flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Google AdSense 광고 (Top)
            </div>
          </div>

          <article className="space-y-20">
            {/* Introduction */}
            <section className="space-y-6 relative">
              <div className="absolute -left-4 top-0 w-1.5 h-full bg-primary-600/30 rounded-full hidden md:block"></div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {post?.content_body?.introduction?.heading || post?.article_info?.title}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                {post?.content_body?.introduction?.text || post?.content}
              </p>
            </section>

            {/* Core Analysis */}
            <div className="space-y-12">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
                심층 분석 <div className="h-px flex-grow bg-slate-100"></div>
              </h3>
              
              <div className="grid grid-cols-1 gap-12">
                {post?.content_body?.core_analysis?.map((analysis: any, idx: number) => (
                  <div key={idx} className="group space-y-6">
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm group-hover:shadow-xl group-hover:border-primary-100 transition-all group-hover:-translate-y-1">
                        <AnalysisIcon type={analysis?.icon_type} />
                      </div>
                      <div className="space-y-5 flex-grow">
                        <h4 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight">
                          {analysis?.sub_heading}
                        </h4>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                          {analysis?.text}
                        </p>
                        {analysis?.insight_tip && (
                          <div className="bg-primary-50/50 p-6 rounded-[2rem] border border-primary-100 flex gap-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-primary-100/30 rounded-full -mr-8 -mt-8"></div>
                            <Lightbulb className="w-7 h-7 text-primary-500 flex-shrink-0" />
                            <p className="text-base font-bold text-primary-900 italic leading-relaxed">
                              "{analysis?.insight_tip}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Slot: Middle */}
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">Advertisement</p>
              <div id="adsense-middle" className="w-full min-h-[250px] bg-slate-50/30 border border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                Google AdSense In-Article Ad Unit (Middle)
              </div>
            </div>

            {/* Practical Guide */}
            <section className="bg-slate-900 rounded-[3.5rem] p-10 md:p-16 text-white space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/20 blur-[120px] -z-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10"></div>
              
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-black">
                  {post?.content_body?.practical_guide?.heading || '실전 대응 가이드'}
                </h3>
                <p className="text-primary-400 font-black uppercase tracking-[0.3em] text-[10px]">실전 매매 가이드라인 (EXECUTION)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {post?.content_body?.practical_guide?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-primary-600/30 text-primary-400 rounded-full flex items-center justify-center font-black text-lg border border-primary-600/50 group-hover:bg-primary-600 group-hover:text-white transition-all">
                        {idx + 1}
                      </div>
                      <h5 className="font-black text-xl">{item?.title}</h5>
                    </div>
                    <p className="text-slate-400 text-base font-medium leading-relaxed">
                      {item?.description}
                    </p>
                  </div>
                ))}
              </div>

              {post.system_link && (
                <div className="pt-8 border-t border-white/10 space-y-8">
                  {post.system_link.cta_text && (
                    <div className="flex justify-center">
                      <Link 
                        to="/brain-off"
                        className="group relative px-10 py-6 bg-primary-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-primary-500/30 hover:bg-primary-500 hover:scale-105 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative flex items-center gap-3">
                          {post.system_link.cta_text}
                          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  )}
                  
                  {post.system_link.related_ticker && post.system_link.related_ticker.length > 0 && (
                    <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">관련 종목</span>
                      <div className="flex flex-wrap gap-2">
                        {post.system_link.related_ticker.map((ticker: string) => (
                          <span 
                            key={ticker} 
                            className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100 hover:border-primary-200 hover:text-primary-600 transition-all cursor-default"
                          >
                            ${ticker}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Conclusion */}
            <section className="space-y-8 pt-6">
              <div className="flex items-center gap-4">
                <MessageSquareQuote className="w-10 h-10 text-primary-600" />
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">전략적 결론</h3>
              </div>
              <div className="space-y-8">
                <p className="text-2xl text-slate-600 font-bold leading-relaxed whitespace-pre-line">
                  {post?.content_body?.conclusion?.text || '풍부한 인사이트 결과가 곧 제공될 예정입니다.'}
                </p>
                <div className="p-10 md:p-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                  <p className="text-3xl md:text-4xl font-black italic tracking-tight leading-snug">
                    "{post?.content_body?.conclusion?.closing_statement || '이음스탁이 함께합니다.'}"
                  </p>
                </div>
              </div>
            </section>
          </article>

          {/* Ad Slot: Bottom */}
          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Advertisement</p>
            <div id="adsense-bottom" className="w-full min-h-[150px] bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-[10px] font-black text-slate-400/50 uppercase tracking-widest">
              Google AdSense Responsive Unit (Bottom)
            </div>
          </div>

          <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-200/50 space-y-6">
            <h4 className="text-base font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
              <ShieldAlert className="w-5 h-5 text-primary-600" />
              Investment Transparency & Disclaimer
            </h4>
            <p className="text-sm text-slate-500 font-bold leading-relaxed whitespace-pre-line">
              이음스탁 리서치팀의 모든 콘텐츠는 객관적인 데이터 통계와 거시 경제 흐름을 바탕으로 작성된 고부가가치 정보입니다. 
              본 리포트는 특정 종목의 매수/매도를 권유하지 않으며, 최종적인 투자 결정에 대한 모든 책임은 투자자 본인에게 있습니다. 
              시장의 변동성은 예측 불가능하며, 과거의 성과가 미래의 수익을 보장하지 않음을 유의하십시오.
            </p>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center font-black text-white shadow-lg shadow-primary-100">IS</div>
          <div>
            <p className="text-sm font-black text-slate-900">IEUMSTOCK Research Center</p>
            <p className="text-xs text-slate-400 font-bold">Data Engineering & Market Insight</p>
          </div>
        </div>
        <Link 
          to="/insights"
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 shadow-xl transition-all"
        >
          더 많은 인사이트 보기
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;
