import React from 'react';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary-100 p-4 rounded-2xl">
          <Shield className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">개인정보처리방침</h1>
      </div>

      <div className="prose prose-slate max-w-none bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 space-y-6 text-slate-600 font-medium leading-relaxed">
        <p>이음스탁(이하 '회사')은 고객의 개인정보를 소중하게 생각하며, '개인정보 보호법' 등 관련 법령을 준수하고 있습니다.</p>
        
        <h3 className="text-xl font-black text-slate-900 mt-8">1. 개인정보의 수집 및 이용 목적</h3>
        <p>회사는 다음의 목적을 위하여 개인정보를 수집하고 이용합니다. 수집된 개인정보는 정해진 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경될 시에는 사전 동의를 구할 예정입니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>서비스 제공 및 관리: 본인 확인, 서비스 공지사항 전달 등</li>
          <li>콘텐츠 제공: 뉴스레터 발송, 투자 정보 제공</li>
          <li>통계 및 분석: 서비스 이용 기록 분석을 통한 서비스 개선</li>
        </ul>

        <h3 className="text-xl font-black text-slate-900 mt-8">2. 수집하는 개인정보의 항목</h3>
        <p>회사는 뉴스레터 구독 및 문의 응대를 위해 아래와 같은 개인정보를 수집할 수 있습니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>필수항목: 이메일 주소</li>
          <li>자동 수집 항목: IP 주소, 쿠키, 서비스 이용 기록, 접속 로그</li>
        </ul>

        <h3 className="text-xl font-black text-slate-900 mt-8">3. 개인정보의 보유 및 이용 기간</h3>
        <p>회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.</p>
      </div>
    </div>
  );
};

export default Privacy;
