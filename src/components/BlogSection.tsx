export default function BlogSection() {
  const articles = [
    {
      id: 1,
      title: "5 méthodes pour améliorer votre notation en mathématiques",
      excerpt: "Découvrez les stratégies efficaces utilisées par les meilleurs élèves pour exceller en mathématiques et obtenir d'excellentes notes.",
      author: "Marie Tchameni",
      date: "15 Mars 2024",
      readTime: "8 min",
      category: "Méthodologie",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop&crop=center",
      featured: true,
      tags: ["Mathématiques", "Étude", "Performance"]
    },
    {
      id: 2,
      title: "L'importance du soutien scolaire dans le système éducatif camerounais",
      excerpt: "Analyse complète du rôle crucial du soutien scolaire pour combler les lacunes et garantir la réussite des étudiants au Cameroun.",
      author: "Dr. Paul Nkoulou",
      date: "12 Mars 2024",
      readTime: "12 min",
      category: "Éducation",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&crop=center",
      featured: false,
      tags: ["Éducation", "Cameroun", "Soutien"]
    },
    {
      id: 3,
      title: "Comment préparer efficacement le Baccalauréat",
      excerpt: "Guide complet pour une préparation optimale du Baccalauréat : planning, révisions, gestion du stress et astuces de dernière minute.",
      author: "Sophie Mbarga",
      date: "10 Mars 2024",
      readTime: "15 min",
      category: "Examens",
      image: "https://images.unsplash.com/photo-1436491865332-7a61da5f387b?w=600&h=400&fit=crop&crop=center",
      featured: false,
      tags: ["Baccalauréat", "Examens", "Révision"]
    },
    {
      id: 4,
      title: "Les avantages du tutorat en ligne pour les étudiants camerounais",
      excerpt: "Pourquoi le tutorat en ligne devient la solution privilégiée des étudiants : flexibilité, accès aux meilleurs professeurs et résultats prouvés.",
      author: "Jean-Pierre Essomba",
      date: "8 Mars 2024",
      readTime: "6 min",
      category: "Digital",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center",
      featured: false,
      tags: ["Tutorat", "Ligne", "Technologie"]
    },
    {
      id: 5,
      title: "Gérer son temps pendant les périodes d'examens",
      excerpt: "Techniques de gestion du temps et méthodes d'organisation pour maximiser votre productivité pendant les sessions d'examens.",
      author: "Catherine Fotso",
      date: "5 Mars 2024",
      readTime: "10 min",
      category: "Productivité",
      image: "https://images.unsplash.com/photo-1606143222024-77b1894f830b?w=600&h=400&fit=crop&crop=center",
      featured: false,
      tags: ["Temps", "Organisation", "Examens"]
    },
    {
      id: 6,
      title: "Les matières scientifiques : clés de la réussite professionnelle",
      excerpt: "Comment les compétences en sciences ouvrent des portes vers des carrières prometteuses et pourquoi il faut investir dans ces matières.",
      author: "Dr. Michel Biloa",
      date: "3 Mars 2024",
      readTime: "9 min",
      category: "Carrière",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop&crop=center",
      featured: false,
      tags: ["Sciences", "Carrière", "Avenir"]
    }
  ]

  const categories = ["Tous", "Méthodologie", "Éducation", "Examens", "Digital", "Productivité", "Carrière"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full text-sm font-medium">
                📚 Blog Kmertude
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 tracking-tight">
              Ressources et conseils pour l'excellence académique
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez nos articles d'experts pour améliorer vos performances scolaires, 
              préparer vos examens et développer vos compétences
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un article, une thématique..."
                  className="w-full px-6 py-4 pl-14 text-gray-900 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all text-lg"
                />
                <svg className="absolute left-5 top-4.5 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <button className="absolute right-2 top-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-lg">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Categories Filter */}
      <div className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-3">Catégories:</span>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === "Tous" 
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Article */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="text-2xl">⭐</span> Article en vedette
          </h2>
          {articles.filter(article => article.featured).map((article) => (
            <div key={article.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-bold rounded-full">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {article.readTime} de lecture
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 hover:text-purple-600 transition-colors cursor-pointer">
                    {article.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                        {article.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{article.author}</p>
                        <p className="text-sm text-gray-500">{article.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-lg">
                    Lire l'article complet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Articles */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Articles récents</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.filter(article => !article.featured).map((article) => (
            <article key={article.id} className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-bold rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime} de lecture</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors cursor-pointer line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {article.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{article.author.split(' ')[0]}</span>
                  </div>
                </div>
                
                <button className="w-full px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                  Lire la suite
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4">Recevez nos meilleurs articles</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Abonnez-vous à notre newsletter pour recevoir chaque semaine des conseils exclusifs, 
              des ressources pédagogiques et les dernières tendances en éducation
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
            />
            <button className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-all font-bold shadow-xl">
              S'abonner
            </button>
          </div>
          
          <p className="text-sm text-blue-200 mt-4">
            Pas de spam. Promis. Vous pouvez vous désinscrire à tout moment.
          </p>
        </div>
      </div>
    </div>
  )
}
