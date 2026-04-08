import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTENT_DB } from '../data/content_db';
import { BookOpen, Calendar, Clock, ChevronRight, Lock } from 'lucide-react';

const Insights = () => {
  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchDynamic = async () => {
      try {
        const res = await fetch('/daily_insights.json');
        if (res.ok) {
          const data = await res.json();
          setDynamicPosts(data);
        }
      } catch (e) {
        console.error("Failed to load daily insights");
      }
    };
    fetchDynamic();
  }, []);

  const allPosts = [...dynamicPosts, ...CONTENT_DB.blog_posts].sort((a, b) => {
    // Basic ID/Date sorting (assuming newest first)
    return b.id - a.id;
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight md:text-5xl">
          프리미엄 <span className="text-primary-600">투자 인사이트</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          시장 어디에서도 들을 수 없는 실전 투자 전략과 심리학 노트를 공개합니다.
          매주 새로운 고수의 비밀이 업데이트됩니다.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {allPosts.map((post) => (
          <Link 
            key={post.id} 
            to={`/insights/${post.id}`}
            className="premium-card bg-white group hover:border-primary-200 transition-all cursor-pointer flex flex-col h-full overflow-hidden"
          >
            <article className="p-0 flex flex-col h-full"> {/* Remove internal padding if premium-card handled it */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black text-primary-600 tracking-widest uppercase">Secret TIP #{post.id}</span>
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-primary-50 transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 transition-all" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary-700 transition-colors">
                {post.title}
              </h2>
              
              <div 
                className="text-slate-600 leading-relaxed mb-6 line-clamp-3 prose prose-slate prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400">#투자심리 #실전전략</span>
                <span className="text-primary-600 font-black text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  자세히 읽기 <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-primary-600 rounded-[2rem] p-10 text-white text-center space-y-6 shadow-2xl shadow-primary-200">
        <h2 className="text-3xl font-black">더 많은 인사이트를 원하시나요?</h2>
        <p className="text-primary-100 max-w-xl mx-auto font-medium">
          뉴스레터를 구독하시면 매주 월요일 아침, 시장을 이기는 0.1%의 전략을 이메일로 보내드립니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="이메일 주소를 입력하세요" 
            className="flex-grow px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
          <button className="px-8 py-4 bg-white text-primary-600 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-lg whitespace-nowrap">
            무료 구독하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Insights;
