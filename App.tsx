
import React, { useState } from 'react';
import { 
  Compass, 
  Watch as WatchIcon, 
  Settings2, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Calendar,
  Timer,
  Moon,
  Zap,
  Eye,
  Globe
} from 'lucide-react';
import { Step, UserPreferences, RecommendationResponse } from './types.ts';
import { getWatchRecommendations } from './geminiService.ts';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Intro);
  const [preferences, setPreferences] = useState<UserPreferences>({
    style: [],
    complications: [],
    budget: '',
    movement: 'Mécanique (Auto/Manuel)',
    usage: 'Quotidien',
    wristSize: 'Moyen (17-18cm)',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResponse | null>(null);

  const stylesOptions = ['Diver (Plongée)', 'Dress (Habillée)', 'Chronographe', 'Field (Terrain)', 'GMT (Voyage)', 'Minimaliste', 'Vintage', 'Je ne sais pas encore'];
  const budgetOptions = ['Moins de 500€', '500€ - 2000€', '2000€ - 5000€', '5000€ - 10000€', 'Plus de 10000€'];
  const movementOptions = ['Mécanique (Auto/Manuel)', 'Quartz (Piles)'];
  const usageOptions = ['Quotidien', 'Occasions spéciales', 'Sport / Aventure', 'Investissement'];
  const wristOptions = ['Fin (< 16cm)', 'Moyen (17-18cm)', 'Large (> 19cm)'];

  const complicationsOptions = [
    { name: 'Date / Jour', icon: <Calendar className="w-6 h-6" />, desc: "L'affichage classique du jour du mois." },
    { name: 'Chronographe', icon: <Timer className="w-6 h-6" />, desc: "Pour mesurer des durées (comme un chrono)." },
    { name: 'Phase de lune', icon: <Moon className="w-6 h-6" />, desc: "Affiche l'aspect de la lune dans le ciel." },
    { name: 'GMT / 2nd Fuseau', icon: <Globe className="w-6 h-6" />, desc: "Pratique pour suivre deux fuseaux horaires." },
    { name: 'Réserve de marche', icon: <Zap className="w-6 h-6" />, desc: "Indique l'énergie restante dans le ressort." },
    { name: 'Squelette / Coeur ouvert', icon: <Eye className="w-6 h-6" />, desc: "Permet de voir le mécanisme en mouvement." },
    { name: 'Pas de préférence', icon: <Search className="w-6 h-6" />, desc: "Un cadran épuré ou n'importe quelle option." }
  ];

  const movementExplanations = {
    'Mécanique (Auto/Manuel)': "L'âme de l'horlogerie traditionnelle. Fonctionne sans pile grâce à un complexe assemblage de ressorts et de rouages. Le mouvement est perpétuel tant que la montre est portée ou remontée.",
    'Quartz (Piles)': "La précision et la simplicité. Une pile fait vibrer un cristal de quartz pour une régularité parfaite. Idéal pour une montre toujours à l'heure sans entretien quotidien."
  };

  const toggleStyle = (style: string) => {
    setPreferences(prev => {
      if (style === 'Je ne sais pas encore') return { ...prev, style: ['Je ne sais pas encore'] };
      const newStyles = prev.style.filter(s => s !== 'Je ne sais pas encore');
      return {
        ...prev,
        style: newStyles.includes(style) ? newStyles.filter(s => s !== style) : [...newStyles, style]
      };
    });
  };

  const toggleComplication = (comp: string) => {
    setPreferences(prev => {
      if (comp === 'Pas de préférence') return { ...prev, complications: ['Pas de préférence'] };
      const newComps = prev.complications.filter(c => c !== 'Pas de préférence');
      return {
        ...prev,
        complications: newComps.includes(comp) ? newComps.filter(c => c !== comp) : [...newComps, comp]
      };
    });
  };

  const handleNext = () => {
    if (currentStep === Step.Intro) setCurrentStep(Step.Style);
    else if (currentStep === Step.Style) setCurrentStep(Step.Complications);
    else if (currentStep === Step.Complications) setCurrentStep(Step.Specs);
    else if (currentStep === Step.Specs) setCurrentStep(Step.Context);
    else if (currentStep === Step.Context) findWatches();
  };

  const handleBack = () => {
    if (currentStep === Step.Style) setCurrentStep(Step.Intro);
    else if (currentStep === Step.Complications) setCurrentStep(Step.Style);
    else if (currentStep === Step.Specs) setCurrentStep(Step.Complications);
    else if (currentStep === Step.Context) setCurrentStep(Step.Specs);
    else if (currentStep === Step.Result) {
      setResults(null);
      setCurrentStep(Step.Intro);
    }
  };

  const findWatches = async () => {
    setLoading(true);
    setCurrentStep(Step.Result);
    try {
      const data = await getWatchRecommendations(preferences);
      setResults(data);
    } catch (error) {
      alert("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
      setCurrentStep(Step.Context);
    } finally {
      setLoading(false);
    }
  };

  const getProgressWidth = () => {
    switch(currentStep) {
      case Step.Style: return '20%';
      case Step.Complications: return '40%';
      case Step.Specs: return '60%';
      case Step.Context: return '80%';
      default: return '100%';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -ml-48 -mb-48 pointer-events-none"></div>

      <header className="py-4 px-8 border-b border-slate-800 flex justify-center items-center z-10 backdrop-blur-md bg-slate-900/50 sticky top-0">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-500" />
          <span className="text-xl font-serif font-bold tracking-tight">
            Montres<span className="text-amber-500 font-normal">Passion</span> <span className="text-slate-500 font-light text-sm ml-2">Finder</span>
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-10 z-10">
        {currentStep === Step.Intro && (
          <div className="flex flex-col items-center text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-4 bg-amber-500/10 rounded-full mb-6">
              <Compass className="w-12 h-12 text-amber-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 gold-gradient leading-tight">Trouvez votre prochaine montre.</h1>
            <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
              Répondez à quelques questions pour trouver la montre qui vous correspond
            </p>
            <button onClick={handleNext} className="btn-gold px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-amber-900/20 flex items-center gap-2 group">
              Trouver ma montre
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {(currentStep === Step.Style || currentStep === Step.Complications || currentStep === Step.Specs || currentStep === Step.Context) && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-2">
              <button onClick={handleBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: getProgressWidth() }}></div>
              </div>
            </div>

            {currentStep === Step.Style && (
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Quel univers vous attire ?</h2>
                <p className="text-slate-400 mb-6">Sélectionnez vos styles préférés ou laissez-vous guider.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stylesOptions.map(style => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center text-sm font-medium ${
                        preferences.style.includes(style) 
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-900/10' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/30 text-slate-400'
                      }`}
                    >
                      {style === 'Je ne sais pas encore' ? <Search className="w-7 h-7" /> : <WatchIcon className="w-7 h-7" />}
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === Step.Complications && (
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Complications et affichage</h2>
                <p className="text-slate-400 mb-6">Que souhaitez-vous voir apparaître sur le cadran de votre montre ?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {complicationsOptions.map(opt => (
                    <button
                      key={opt.name}
                      onClick={() => toggleComplication(opt.name)}
                      className={`p-5 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${
                        preferences.complications.includes(opt.name) 
                        ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-900/10' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/30'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${preferences.complications.includes(opt.name) ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <p className={`font-bold text-sm mb-1 ${preferences.complications.includes(opt.name) ? 'text-amber-500' : 'text-slate-100'}`}>{opt.name}</p>
                        <p className="text-[10px] text-slate-500 leading-tight">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === Step.Specs && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Budget maximum</label>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setPreferences(p => ({...p, budget: opt}))}
                          className={`px-4 py-2 rounded-lg border transition-all text-xs font-medium ${
                            preferences.budget === opt ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Type de mouvement</label>
                    <div className="flex flex-col gap-2">
                      {movementOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setPreferences(p => ({...p, movement: opt}))}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            preferences.movement === opt ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-bold text-sm ${preferences.movement === opt ? 'text-amber-500' : 'text-slate-200'}`}>{opt}</span>
                            {preferences.movement === opt && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed pr-8">
                            {movementExplanations[opt as keyof typeof movementExplanations]}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/20 p-6 rounded-3xl border border-slate-800 h-fit">
                  <h3 className="text-lg font-serif font-bold mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-500" />
                    Bon à savoir
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed italic">
                    "Un mouvement mécanique est le choix des puristes. C'est une pièce de micro-ingénierie qui bat comme un coeur. Le quartz est lui imbattable sur la précision pure et le prix."
                  </p>
                </div>
              </div>
            )}

            {currentStep === Step.Context && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Quel sera son usage principal ?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {usageOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setPreferences(p => ({...p, usage: opt}))}
                        className={`p-4 rounded-xl border text-left transition-all text-sm font-medium ${
                          preferences.usage === opt ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Circonférence de votre poignet</label>
                  <select 
                    value={preferences.wristSize}
                    onChange={(e) => setPreferences(p => ({...p, wristSize: e.target.value}))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-100 outline-none text-sm"
                  >
                    {wristOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Commentaires ou envies libres</label>
                  <textarea 
                    value={preferences.additionalInfo}
                    onChange={(e) => setPreferences(p => ({...p, additionalInfo: e.target.value}))}
                    placeholder="Ex: Je cherche spécifiquement une Seiko, ou un cadran vert..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-100 min-h-[80px] outline-none text-sm"
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleNext}
                disabled={(currentStep === Step.Style && preferences.style.length === 0) || (currentStep === Step.Complications && preferences.complications.length === 0)}
                className="btn-gold px-12 py-4 rounded-full text-lg font-bold flex items-center gap-2"
              >
                {currentStep === Step.Context ? 'Générer mon profil' : 'Continuer'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse text-center">
            <div className="relative mb-6 text-amber-500">
              <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
              <Search className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="text-xl font-serif italic mb-2">Analyse horlogère en cours...</h2>
            <p className="text-slate-500 text-sm">Nous recherchons les pièces les plus adaptées à votre profil...</p>
          </div>
        )}

        {currentStep === Step.Result && !loading && results && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-1">Votre Sélection sur Mesure</h2>
                <p className="text-slate-400 text-sm">4 pièces sélectionnées pour votre profil.</p>
              </div>
              <button onClick={handleBack} className="flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors bg-amber-500/10 px-6 py-3 rounded-full text-sm">
                <RefreshCcw className="w-4 h-4" /> Relancer le test
              </button>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <h3 className="text-lg font-bold text-amber-500 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Le Conseil Expert Passion
              </h3>
              <p className="text-slate-300 leading-relaxed text-base italic">"{results.expertAdvice}"</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {results.watches.map((watch, idx) => (
                <div key={idx} className={`group bg-slate-800/40 rounded-[2rem] border transition-all duration-500 overflow-hidden hover:shadow-2xl ${watch.isPromoted ? 'border-amber-500/50' : 'border-slate-800 hover:border-slate-700'}`}>
                  <div className="relative h-56 overflow-hidden">
                    <img src={watch.imageUrl} alt={watch.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent text-white p-6 flex flex-col justify-end">
                      <p className="text-amber-500 font-bold text-[10px] uppercase tracking-widest">{watch.brand}</p>
                      <h4 className="text-xl font-serif font-bold leading-tight">{watch.model}</h4>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400"><Settings2 className="w-4 h-4 text-slate-500" />{watch.movement}</div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400"><Compass className="w-4 h-4 text-slate-500" />{watch.diameter}</div>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3">{watch.description}</p>
                    <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                      <div className="text-lg font-bold gold-gradient">{watch.priceRange}</div>
                      <button className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:text-amber-500 transition-colors group/btn">
                        Fiche technique <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 px-8 border-t border-slate-800 text-center text-slate-600 text-[10px] tracking-widest uppercase">
        <p>&copy; {new Date().getFullYear()} Montres-Passion.fr</p>
      </footer>
    </div>
  );
};

export default App;
