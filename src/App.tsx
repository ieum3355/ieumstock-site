import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dictionary from './pages/Dictionary';
import BrainOff from './pages/BrainOff';
import Insights from './pages/Insights';
import PostDetail from './pages/PostDetail';
import Tools from './pages/Tools';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { BrainCircuit, Menu, X, TrendingUp, BookOpen, Calculator, PenTool, Shield, FileText } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: '홈', path: '/', icon: TrendingUp },
    { name: '인사이트', path: '/insights', icon: PenTool },
    { name: '용어 사전', path: '/dictionary', icon: BookOpen },
    { name: '투자 도구', path: '/tools', icon: Calculator },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-primary-100 selection:text-primary-900">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-primary-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary-200">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-primary-600 transition-colors">
                  IEUMSTOCK <span className="text-primary-600">PRO</span>
                </span>
              </Link>
              
              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center gap-10">
                {navigation.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path} 
                    className="text-slate-500 hover:text-primary-600 font-black text-sm uppercase tracking-widest transition-all hover:translate-y-[-1px]"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="h-4 w-px bg-slate-200 mx-2"></div>
                <Link to="/brain-off" className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest hover:bg-primary-600 shadow-xl shadow-slate-200 hover:shadow-primary-200 transition-all flex items-center gap-2 uppercase">
                  <BrainCircuit className="w-4 h-4" />
                  YMG 레이더
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className={`p-3 rounded-2xl transition-all ${isMenuOpen ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-600'}`}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 py-8 px-6 space-y-4 animate-in slide-in-from-top duration-300 shadow-2xl">
              {navigation.map((item) => (
                <Link 
                  key={item.name}
                  to={item.path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center gap-4 text-xl font-black text-slate-900 p-4 hover:bg-slate-50 rounded-2xl transition-colors"
                >
                  <item.icon className="w-6 h-6 text-primary-600" />
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/brain-off" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center gap-4 text-xl font-black text-primary-600 p-4 bg-primary-50 rounded-2xl transition-colors"
              >
                <BrainCircuit className="w-6 h-6" />
                YMG 레이더
              </Link>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:id" element={<PostDetail />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/dictionary/:term" element={<Dictionary />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/brain-off" element={<BrainOff />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="space-y-4 max-w-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                  <span className="text-xl font-black tracking-tighter text-slate-900">IEUMSTOCK PRO</span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  이음스탁은 데이터 지향적 투자 환경을 구축합니다. 
                  모든 데이터는 정밀한 검증을 통해 투명하게 공개됩니다.
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Platform</h4>
                  <ul className="space-y-2 text-slate-500 font-medium">
                    <li><Link to="/insights" className="hover:text-primary-600 transition-colors">인사이트</Link></li>
                    <li><Link to="/dictionary" className="hover:text-primary-600 transition-colors">용어 사전</Link></li>
                    <li><Link to="/tools" className="hover:text-primary-600 transition-colors">투자 도구</Link></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Legal</h4>
                  <ul className="space-y-2 text-slate-500 font-medium">
                    <li><Link to="/privacy" className="hover:text-primary-600 transition-colors">개인정보처리방침</Link></li>
                    <li><Link to="/terms" className="hover:text-primary-600 transition-colors">이용약관</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs font-black tracking-widest uppercase">
              <p>&copy; 2026 IEUMSTOCK PRO. ALL DATA VERIFIED.</p>
              <div className="flex gap-6">
                <Link to="/privacy" className="hover:text-primary-600">개인정보처리방침</Link>
                <Link to="/terms" className="hover:text-primary-600">이용약관</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
