import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CONTENT_DB } from '../data/content_db';
import { 
  ArrowLeft, Calendar, Clock, Share2, Bookmark, BookmarkCheck, 
  Lock, AlertCircle, ChevronRight, TrendingUp, Target, ShieldAlert
} from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findPost = async () => {
      setLoading(true);
      
      // 1. Check static posts
      const staticPost = CONTENT_DB.blog_posts.find(p => p.id.toString() === id || p.slug === id);
      if (staticPost) {
        setPost({ ...staticPost, type: 'article' });
        setLoading(false);
        return;
      }

      // 2. Check dynamic recommendations from dashboard_data.json
      try {
        const res = await fetch('/dashboard_data.json');
        if (res.ok) {
          const data = await res.json();
          const dynamicPost = data.recommendations.find((p: any) => p.metadata.slug === id);
          if (dynamicPost) {
            setPost({ ...dynamicPost, type: 'recommendation' });
          }
        }
      } catch (e) {
        console.error("Dashboard data fetch failed", e);
      }
      setLoading(false);
    };

    findPost();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">분석 데이터를 불러오는 중...</p>
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

  const isLocked = post.type === 'recommendation' && post.metadata.is_locked;
  const seo = post.type === 'recommendation' ? post.seo_content : {
    page_title: post.title,
    meta_description: post.excerpt || post.title,
    keywords: ["이음스탁", "주식분석"]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Helmet>
        <title>{seo.page_title} | IEUMSTOCK PRO</title>
        <meta name="description" content={seo.meta_description} />
        <meta name="keywords" content={seo.keywords.join(', ')} />
      </Helmet>

      {/* Navigation Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <button 
          onClick={() => navigate('/insights')}
          className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-black text-sm uppercase tracking-tight transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl transition-all ${isBookmarked ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
          <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {post.type === 'recommendation' ? (
        // Recommendation View
        <div className="space-y-12">
          <header className="space-y-6">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-md ${
                post.metadata.tier === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-primary-50 text-primary-600'
              }`}>
                {post.metadata.tier} Recommendation
              </span>
              <div className="h-px flex-grow bg-slate-100"></div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  {post.stock_info.name} <span className="text-slate-300">({post.stock_info.ticker})</span>
                </h1>
                <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">{post.stock_info.sector}</p>
              </div>
              <div className="bg-slate-900 text-white p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current</p>
                  <p className="text-2xl font-black">{post.live_status.current_price.toLocaleString()}원</p>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
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
                Trading Strategy
              </h3>
              
              <div className={`space-y-6 transition-all duration-700 ${isLocked ? 'blur-md select-none pointer-events-none' : ''}`}>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Technical Analysis</p>
                  <p className="text-slate-600 font-medium leading-relaxed">{post.trading_strategy.technical_analysis}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-primary-50 rounded-3xl border border-primary-100">
                    <p className="text-[10px] font-black text-primary-600 uppercase mb-1">Target Price</p>
                    <p className="text-xl font-black text-slate-900">{post.trading_strategy.target_price.toLocaleString()}원</p>
                  </div>
                  <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                    <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Stop Loss</p>
                    <p className="text-xl font-black text-slate-900">{post.trading_strategy.stop_loss.toLocaleString()}원</p>
                  </div>
                </div>
              </div>

              {isLocked && (
                <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center space-y-4 animate-in zoom-in-95 duration-500">
                  <Lock className="w-10 h-10 text-amber-400 mx-auto" />
                  <div className="space-y-2">
                    <h4 className="text-xl font-black">심층 분석 데이터가 잠겨 있습니다</h4>
                    <p className="text-slate-400 text-sm font-medium">프리미엄 회원이 되시면 AI 정밀 타점과<br />기술적 분석을 실시간으로 확인하실 수 있습니다.</p>
                  </div>
                  <button 
                    onClick={() => alert('프리미엄 구독 문의: 텔레그램 @ieumstock_pro')}
                    className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-500 transition-all flex items-center justify-center gap-2"
                  >
                    프리미엄 등업 신청하기
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-8">
              <h3 className="text-lg font-black flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary-600" />
                Quick Analysis Score
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-500">Overall Score</span>
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
          </div>
        </div>
      ) : (
        // Standard Article View
        <div className="space-y-10">
          <header className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-md">
                Secret Tip #{post.id}
              </span>
              <div className="h-px flex-grow bg-slate-100"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-400 font-bold text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-emerald-500">Premium Analysis Verified</span>
              </div>
            </div>
          </header>

          <article className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-li:text-slate-600">
            <div 
              className="insights-content"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
            
            <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white space-y-4">
              <h4 className="text-xl font-black flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                이음스탁 리서치팀 제언
              </h4>
              <p className="text-slate-400 font-medium leading-relaxed">
                위 인사이트는 시장의 극심한 공포와 환희 사이에서 객관적인 데이터를 바탕으로 작성되었습니다. 
                투자의 최종 결정은 투자자 본인에게 있으며, 시장의 파동보다 기업의 본질적 가치와 본인의 원칙에 집중하시기 바랍니다.
              </p>
            </div>
          </article>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center font-black text-white">IS</div>
          <div>
            <p className="text-sm font-black text-slate-900">IEUMSTOCK Research Center</p>
            <p className="text-xs text-slate-400 font-bold">Data Scientist & Market Analyst</p>
          </div>
        </div>
        <Link 
          to="/insights"
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-primary-50 hover:text-primary-600 transition-all"
        >
          다른 인사이트 더보기
        </Link>
      </div>

      {/* Subscription Banner */}
      <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-[2rem] p-8 mt-12 text-center space-y-4">
        <h3 className="text-xl font-black text-slate-900">놓치기 아까운 투자 팁, 이메일로 받아보세요.</h3>
        <p className="text-slate-500 text-sm font-medium">뉴스레터 구독자에게만 공개되는 비공개 리포트를 보내드립니다.</p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
          <input 
            type="email" 
            placeholder="example@email.com"
            className="flex-grow px-5 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
          />
          <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-black text-sm hover:bg-primary-500 shadow-lg shadow-primary-100 transition-all">
            구독하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
