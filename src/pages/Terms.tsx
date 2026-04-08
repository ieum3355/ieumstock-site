import React from 'react';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary-100 p-4 rounded-2xl">
          <FileText className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">서비스 이용약관</h1>
      </div>

      <div className="prose prose-slate max-w-none bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 space-y-6 text-slate-600 font-medium leading-relaxed">
        <p>이음스탁(이하 '서비스')을 이용해 주셔서 감사합니다. 본 약관은 이음스탁이 제공하는 서비스의 이용 조건 및 절차를 규정합니다.</p>
        
        <h3 className="text-xl font-black text-slate-900 mt-8">제1조 (목적)</h3>
        <p>본 약관은 회사가 제공하는 이음스탁 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>

        <h3 className="text-xl font-black text-slate-900 mt-8">제2조 (회원의 의무 및 책임)</h3>
        <p>회원은 서비스를 이용함에 있어 관계 법령 및 본 약관을 준수하여야 하며, 다음의 행위를 해서는 안 됩니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>타인의 개인정보를 무단으로 도용하는 행위</li>
          <li>회사의 명시적 동의 없이 서비스의 정보를 영리 목적으로 사용하는 행위</li>
          <li>시스템에 과부하를 주거나 서비스를 방해하는 행위</li>
        </ul>

        <h3 className="text-xl font-black text-slate-900 mt-8">제3조 (투자 결과에 대한 책임)</h3>
        <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-2xl">
          <p className="text-rose-700 font-black mb-2">중요 공지:</p>
          <p className="text-rose-600">이음스탁이 제공하는 모든 정보(인사트, 데이터 등)는 투자 참고용이며, 투자 결과에 대한 최종 책임은 이용자 본인에게 있습니다. 회사는 투자로 인한 어떠한 금전적 손실에 대해서도 책임을 지지 않습니다.</p>
        </div>

        <h3 className="text-xl font-black text-slate-900 mt-8">제4조 (약관의 개정)</h3>
        <p>회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있습니다. 개정된 약관은 서비스 내 공지사항을 통해 효력이 발생합니다.</p>
      </div>
    </div>
  );
};

export default Terms;
