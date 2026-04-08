import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CONTENT_DB } from '../data/content_db';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, BookmarkCheck } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findPost = async () => {
      setLoading(true);
      const postId = parseInt(id || '0');
      
      // 1. Check static posts
      let found = CONTENT_DB.blog_posts.find(p => p.id === postId);
      
      if (found) {
        setPost(found);
        setLoading(false);
        return;
      }

      // 2. Check dynamic posts from JSON
      try {
        const res = await fetch('/daily_insights.json');
        if (res.ok) {
          const dynamicData = await res.json();
          found = dynamicData.find((p: any) => p.id === postId);
          if (found) {
            setPost(found);
          }
        }
      } catch (e) {
        console.error("Dynamic post fetch failed");
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
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest">분석 리포트를 불러오는 중...</p>
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

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

      {/* Article Header */}
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

      {/* Main Content */}
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
