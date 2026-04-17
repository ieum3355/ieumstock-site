import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Book, ChevronRight, Hash } from 'lucide-react';
import { CONTENT_DB } from '../data/content_db';

const Dictionary = () => {
  const { term } = useParams<{ term?: string }>();
  const [search, setSearch] = useState('');

  // Normalize term ID for lookup (e.g. "per" -> "PER (주가수익비율)")
  const selectedTerm = term 
    ? CONTENT_DB.terms.find(t => t.keyword.toLowerCase().startsWith(term.toLowerCase())) 
    : null;

  const filteredTerms = CONTENT_DB.terms.filter(t => 
    t.keyword.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    (t.tags && t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-bottom duration-700">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-black tracking-widest uppercase mb-4">
          Investment Encyclopedia
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">금융 용어 백과사전</h1>
        <p className="text-slate-500 text-lg font-medium leading-relaxed">
          성공적인 투자를 위한 필수 금융 용어를 마스터하세요. 
          {CONTENT_DB.terms.length}개의 전문 용어가 등록되어 있습니다.
        </p>
        
        {/* Search Bar */}
        <div className="relative mt-8 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-primary-600 transition-colors" />
          <input 
            type="text" 
            placeholder="용어 검색 (예: PER, ROE, 공매도...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-xl font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Term List */}
        <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest pl-3 mb-6 flex items-center gap-2">
            <Hash className="w-4 h-4 text-primary-600" />
            TERMS LIST
          </h3>
          {filteredTerms.length > 0 ? (
            filteredTerms.map((t) => {
              const termId = t.keyword.split(' ')[0].toLowerCase();
              const isActive = selectedTerm?.keyword === t.keyword;
              return (
                <Link 
                  key={t.keyword} 
                  to={`/dictionary/${termId}`}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${isActive ? 'bg-primary-600 text-white shadow-xl shadow-primary-200' : 'hover:bg-white hover:shadow-lg text-slate-600 border border-transparent hover:border-slate-50'}`}
                >
                  <span className="font-bold tracking-tight">{t.keyword.split(' (')[0]}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                </Link>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400 font-medium">검색 결과가 없습니다.</div>
          )}
        </div>

        {/* Term Detail */}
        <div className="lg:col-span-3">
          {selectedTerm ? (
            <div className="premium-card bg-white p-10 md:p-16 relative overflow-hidden h-full">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 p-8">
                <Book className="w-32 h-32 text-slate-50 opacity-50" />
              </div>

              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-2 text-primary-600">
                  <div className="bg-primary-50 p-3 rounded-2xl">
                    <Book className="w-6 h-6" />
                  </div>
                  <span className="font-black tracking-widest text-sm">IEUMSTOCK DEFINITION</span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{selectedTerm.keyword}</h2>
                  <div className="flex gap-2">
                    {selectedTerm.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-2xl text-slate-600 leading-relaxed font-medium border-l-4 border-primary-100 pl-8">
                    {selectedTerm.description}
                  </p>
                  
                  <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h4 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-2 uppercase tracking-tight">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      전문가 분석 팁
                    </h4>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      "{selectedTerm.keyword} 지표는 단순히 수치만 보기보다 기업의 업종 평균(Peer Group) 및 과거 추세와 비교하는 것이 필수적입니다. 
                      이음스탁 Pro의 YMG 레이더 대시보드에서는 해당 지표가 반영된 실시간 종목 분석을 제공하고 있습니다."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="premium-card bg-slate-50 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center py-32 text-slate-400 text-center space-y-6">
              <div className="bg-white p-8 rounded-full shadow-2xl shadow-slate-200">
                <Book className="w-16 h-16 opacity-20" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-slate-900 tracking-tight">용어를 선택하세요</p>
                <p className="text-lg font-medium">왼쪽 목록이나 검색을 통해 궁금한 금융 용어를 찾아보세요.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dictionary;
