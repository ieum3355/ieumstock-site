import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dictionary from './pages/Dictionary';
import BrainOff from './pages/BrainOff';
import { LayoutDashboard, BookOpen, BrainCircuit, Menu, X, TrendingUp } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-primary-600" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                  IEUMSTOCK PRO
                </span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">홈</Link>
                <Link to="/dictionary" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">용어 사전</Link>
                <Link to="/brain-off" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 shadow-sm transition-all flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" />
                  BRAIN-OFF
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                  {isMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-4 animate-in slide-in-from-top duration-200">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-slate-700">홈</Link>
              <Link to="/dictionary" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-slate-700">용어 사전</Link>
              <Link to="/brain-off" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-primary-600">BRAIN-OFF</Link>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/dictionary/:term" element={<Dictionary />} />
            <Route path="/brain-off" element={<BrainOff />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            &copy; 2026 이음스탁 Pro. 모든 권통찰은 데이터 무결성 검증을 거칩니다.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
