import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTENT_DB } from '../data/content_db';
import { BookOpen, Calendar, Clock, ChevronRight, Lock, Sparkles } from 'lucide-react';

const Insights = () => {
  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDynamic = async () => {
      setLoading(true);
      try {
        const v = new Date().getTime();
        const [dashRes, insightRes] = await Promise.all([
          fetch(`/dashboard_data.json?v=${v}`),
          fetch(`/daily_insights.json?v=${v}`).catch(() => null)
        ]);

        let allDynamic: any[] = [];

        if (dashRes.ok) {
          const data = await dashRes.json();
          const dashPosts = (data.recommendations || []).map((rec: any) => ({
            id: rec.metadata?.id || 'N/A',
            slug: rec.metadata?.slug || 'error',
            title: rec.seo_content?.page_title || rec.stock_info?.name || '분석 리포트',
            content: rec.analysis_report?.summary || rec.trading_strategy?.technical_analysis || 'AI 정밀 분석 결과입니다.',
            date: rec.metadata?.date || '',
            isLocked: rec.metadata?.is_locked || false,
            tier: rec.metadata?.tier || 'Standard',
            type: 'recommendation'
          }));
          allDynamic = [...allDynamic, ...dashPosts];
        }

        if (insightRes && insightRes.ok) {
          const insights = await insightRes.json();
          const insightPosts = (insights || []).map((i: any) => ({
            id: i.article_info?.id || 'N/A',
            slug: i.article_info?.slug || 'error',
            title: i.article_info?.title || '투자 인사이트',
            content: i.content_body?.introduction?.text || '시장 분석 인사이트 결과입니다.',
            date: i.article_info?.date || '',
            type: 'article',
            isDynamic: true,
            raw: i 
          }));
          allDynamic = [...allDynamic, ...insightPosts];
        }

        setDynamicPosts(allDynamic);
      } catch (e) {
        console.error("Failed to load dynamic data", e);
      }
      setLoading(false);
    };
    fetchDynamic();
  }, []);

  const allPosts = [...dynamicPosts, ...CONTENT_DB.blog_posts.map(p => ({ 
    ...p, 
    id: p.article_info.id,
    slug: p.article_info.slug,
    title: p.article_info.title,
    date: p.article_info.date,
    type: 'article' 
  }))];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight md:text-5xl">
          프리미엄 <span className="text-primary-600">투자 인사이트</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          시장 어디에서도 들을 수 없는 실전 투자 전략과 심리학 노트를 공개합니다.
          매일 업데이트되는 AI 정밀 분석 리포트를 확인하세요.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-[2.5rem] h-64 animate-pulse border border-slate-100"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/insights/${post.slug || post.id}`}
              className="group bg-white border border-slate-100 hover:border-primary-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-primary-100/20 transition-all duration-500"
            >
              <article className="flex flex-col h-full space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {post.type === 'recommendation' && (
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                          post.tier === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-primary-50 text-primary-600'
                        }`}>
                          {post.tier}
                        </span>
                      )}
                      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                        {post.type === 'recommendation' ? 'AI 분석 리포트' : `콘텐츠 #${post.id}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 약 5분 소요</span>
                    </div>
                  </div>
                  {post.isLocked ? (
                    <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-600">
                      <Lock className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-2.5 rounded-2xl text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className={`text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 ${post.isLocked ? 'blur-[3px] select-none' : ''}`}>
                    {post.type === 'article' ? (post.content_body?.introduction?.text || post.content) : (post.content)}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex gap-2">
                    {post.type === 'article' ? (
                      (post as any).article_info.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">#{tag}</span>
                      ))
                    ) : (
                      <>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">#실전전략</span>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md">#데이터분석</span>
                      </>
                    )}
                  </div>
                  <span className="text-primary-600 font-black text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {post.isLocked ? '프리미엄 읽기' : '자세히 읽기'} <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

      )}

      {/* Bottom CTA */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 text-primary-400 rounded-full text-xs font-black uppercase tracking-widest border border-primary-600/30">
            <Sparkles className="w-4 h-4" />
            뉴스레터 구독하기
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black">시장의 파동을 이기는 인사이트</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">
              뉴스레터를 구독하시면 매일 아침 AI가 선정한 핵심 테마와<br />주요 종목 리포트를 무료로 보내드립니다.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="이메일 주소를 입력하세요" 
              className="flex-grow px-7 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
            />
            <button className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/40 whitespace-nowrap text-sm">
              구독하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
