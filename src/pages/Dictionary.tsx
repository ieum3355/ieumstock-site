import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Search, Book, ArrowRight, ChevronRight } from 'lucide-react';

const DICTIONARY_DATA = [
  { id: 'per', name: 'PER (주가수익비율)', desc: '주가를 주당순이익(EPS)으로 나눈 값으로, 주가가 1주당 수익의 몇 배가 되는지를 나타냅니다.' },
  { id: 'pbr', name: 'PBR (주가순자산비율)', desc: '주가를 1주당 순자산가치로 나눈 비율로, 주가와 1주당 순자산을 비교한 수치입니다.' },
  { id: 'roe', name: 'ROE (자기자본이익률)', desc: '기업이 투입한 자기자본이 얼마만큼의 이익을 냈는지를 나타내는 지표입니다.' },
  { id: 'eps', name: 'EPS (주당순이익)', desc: '기업이 벌어들인 순이익을 그 기업이 발행한 총 주식수로 나눈 값입니다.' },
];

const Dictionary = () => {
  const { term } = useParams<{ term?: string }>();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const selectedTerm = term ? DICTIONARY_DATA.find(t => t.id === term) : null;
  const filteredTerms = DICTIONARY_DATA.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">금융 용어 백과사전</h1>
        <p className="text-slate-500 text-lg">성공적인 투자를 위한 필수 금융 용어를 마스터하세요.</p>
        
        {/* Search Bar */}
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="용어 검색 (예: PER, ROE...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Term List */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest pl-2 mb-4">용어 목록</h3>
          {filteredTerms.map((t) => (
            <Link 
              key={t.id} 
              to={`/dictionary/${t.id}`}
              className={`flex items-center justify-between p-4 rounded-xl transition-all group ${term === t.id ? 'bg-primary-600 text-white shadow-md' : 'hover:bg-white hover:shadow-sm text-slate-600 border border-transparent hover:border-slate-100'}`}
            >
              <span className="font-bold">{t.name.split(' ')[0]}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${term === t.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
            </Link>
          ))}
        </div>

        {/* Term Detail */}
        <div className="md:col-span-2">
          {selectedTerm ? (
            <div className="premium-card bg-white p-8">
              <div className="flex items-center gap-2 text-primary-600 mb-4">
                <Book className="w-6 h-6" />
                <span className="font-bold tracking-wider">이음스탁 용어 정의</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">{selectedTerm.name}</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  {selectedTerm.desc}
                </p>
                <div className="mt-8 pt-8 border-t border-slate-100 text-slate-500">
                  <h4 className="font-bold text-slate-900 mb-4">전문가 팁</h4>
                  <p className="italic">
                    "{selectedTerm.name} 지표는 단독으로 보기보다 업종 평균 및 과거 데이터와 비교하는 것이 중요합니다. 
                    이음스탁 Pro 대시보드에서 해당 지표의 실시간 변동 추이를 확인하실 수 있습니다."
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="premium-card bg-slate-50 border-dashed border-2 flex flex-col items-center justify-center py-20 text-slate-400">
              <Book className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">왼쪽에서 용어를 선택하여 상세 내용을 확인하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dictionary;
