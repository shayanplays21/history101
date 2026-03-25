/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Maximize2, X, Play, Info, History, LayoutGrid, GraduationCap, Heart } from 'lucide-react';
import gamesData from './games.json';

interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  category: string;
  allow?: string;
  sandbox?: string;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showDonateModal, setShowDonateModal] = useState(false);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0f0e0c] text-[#e2e2d5] font-sans selection:bg-amber-500 selection:text-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-amber-900/20 bg-[#0f0e0c]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedGame(null); setActiveCategory('All'); }}>
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                <History className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase serif">History101</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button className="text-sm font-medium text-amber-100/60 hover:text-amber-100 transition-colors">Eras</button>
              <button className="text-sm font-medium text-amber-100/60 hover:text-amber-100 transition-colors">Timelines</button>
              <button className="text-sm font-medium text-amber-100/60 hover:text-amber-100 transition-colors">Resources</button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-100/40 group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search history..."
                  className="bg-white/5 border border-amber-900/20 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all w-48 sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowDonateModal(true)}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold py-2 px-4 rounded-full transition-all shadow-[0_0_15px_rgba(217,119,6,0.2)]"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Donate</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simplified Header */}
        {!selectedGame && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Interactive Archives</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-black leading-tight uppercase">
                Historical <span className="text-amber-500 italic">Simulations</span>
              </h1>
            </div>
            <div className="flex gap-3">
              <button className="bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold py-2 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(217,119,6,0.2)]">
                Newest
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-amber-900/20 text-amber-100 text-xs font-bold py-2 px-6 rounded-lg transition-all">
                Popular
              </button>
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        {!selectedGame && gamesData.length > 0 && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            <LayoutGrid className="w-4 h-4 text-amber-100/40 mr-2 shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-amber-600 text-black' 
                    : 'bg-white/5 text-amber-100/60 hover:bg-white/10 hover:text-amber-100 border border-amber-900/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-serif font-bold uppercase">{selectedGame.title}</h2>
                    <p className="text-sm text-amber-100/40">{selectedGame.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden border border-amber-900/20 shadow-2xl relative group">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none fnae-game-iframe"
                  title={selectedGame.title}
                  allow={selectedGame.allow || "autoplay; fullscreen"}
                  scrolling="no"
                  sandbox={selectedGame.sandbox}
                  allowFullScreen
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredGames.length > 0 ? (
                filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedGame(game)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-amber-900/10">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform">
                          <Play className="w-6 h-6 text-black fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-lg group-hover:text-amber-500 transition-colors uppercase">{game.title}</h3>
                    <p className="text-sm text-amber-100/40 line-clamp-1">{game.description}</p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-amber-900/20">
                  <BookOpen className="w-12 h-12 text-amber-900/40 mx-auto mb-4" />
                  <p className="text-amber-100/40 text-lg font-serif italic">The archives are currently being updated. Check back soon for new historical content.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-900/20 mt-20 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center">
                  <History className="w-4 h-4 text-black" />
                </div>
                <span className="text-lg font-bold tracking-tighter uppercase serif">History101</span>
              </div>
              <p className="text-amber-100/40 text-sm max-w-sm leading-relaxed">
                Dedicated to making history accessible and engaging through interactive technology and storytelling.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-amber-500">Curriculum</h4>
              <ul className="space-y-4 text-sm text-amber-100/40">
                <li><a href="#" className="hover:text-amber-100 transition-colors">Ancient Civilizations</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Modern History</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">World Wars</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Industrial Revolution</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-amber-500">Support</h4>
              <ul className="space-y-4 text-sm text-amber-100/40">
                <li><a href="#" className="hover:text-amber-100 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-100 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-900/20 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-amber-100/20 text-xs">© 2026 History101. Education through exploration.</p>
          </div>
        </div>
      </footer>
      {/* Donate Modal */}
      <AnimatePresence>
        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDonateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#1a1917] border border-amber-900/20 rounded-3xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowDonateModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-amber-100/40" />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-amber-600 fill-current" />
                </div>
                <h3 className="text-2xl font-serif font-black uppercase mb-2">Support the Archives</h3>
                <p className="text-amber-100/40 text-sm mb-8">
                  Your contribution helps us maintain and expand our historical simulations for students worldwide.
                </p>
                
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {['$5', '$10', '$25'].map((amount) => (
                    <button 
                      key={amount}
                      className="py-3 rounded-xl border border-amber-900/20 hover:border-amber-600 hover:bg-amber-600/5 transition-all font-bold text-amber-100"
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setShowDonateModal(false)}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)]"
                >
                  Continue to Payment
                </button>
                
                <p className="mt-6 text-[10px] uppercase tracking-widest text-amber-100/20 font-bold">
                  Secure transaction powered by History101
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
