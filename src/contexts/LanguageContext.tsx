import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar' | 'fr' | 'es' | 'de' | 'it' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Complete translation object with all missing keys
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.signals': 'Signals',
    'nav.history': 'History',
    'nav.settings': 'Settings',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.getStarted': 'Get Started',
    
    // Language names - Display in their native script
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',
    
    // Landing page
    'landing.hero.title': 'AI-Powered Trading Signals',
    'landing.hero.subtitle': 'Get intelligent trading recommendations powered by advanced AI analysis. Make smarter trading decisions with our cutting-edge signal generation platform.',
    'landing.hero.startTrial': 'Start Free Trial',
    'landing.features.title': 'Why Choose AI Trader?',
    'landing.features.subtitle': 'Advanced AI technology meets professional trading expertise',
    'landing.features.ai.title': 'Advanced AI Analysis',
    'landing.features.ai.desc': 'Powered by GPT-4 and cutting-edge machine learning algorithms for precise market predictions',
    'landing.features.secure.title': 'Secure & Reliable',
    'landing.features.secure.desc': 'Bank-level security with 99.9% uptime guarantee and enterprise-grade infrastructure',
    'landing.features.schools.title': 'Multiple Trading Schools',
    'landing.features.schools.desc': 'Technical, fundamental, momentum, and swing trading strategies from expert analysts',
    'landing.pricing.title': 'Choose Your Plan',
    'landing.pricing.subtitle': 'Start free, upgrade when you need more signals',
    'landing.pricing.getStarted': 'Get Started',
    'landing.cta.title': 'Ready to Start Trading Smarter?',
    'landing.cta.subtitle': 'Join thousands of traders using AI-powered signals',
    'landing.cta.startTrial': 'Start Free Trial',
    
    // Authentication
    'auth.login.title': 'Welcome Back',
    'auth.login.subtitle': 'Sign in to your AI Trader account',
    'auth.register.title': 'Create Account',
    'auth.register.subtitle': 'Join thousands of successful traders',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.createAccount': 'Create Account',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signInHere': 'Sign in here',
    'auth.signUpHere': 'Sign up here',
    'auth.orSignInWith': 'or sign in with email',
    'auth.orCreateWith': 'or create account with email',
    
    // Dashboard
    'dashboard.title': 'Trading Dashboard',
    'dashboard.subtitle': 'Generate AI-powered trading signals and manage your account',
    'dashboard.currentPlan': 'Current Plan',
    'dashboard.signalsToday': 'Signals Today',
    'dashboard.remaining': 'Remaining',
    'dashboard.needMoreSignals': 'Need More Signals?',
    'dashboard.upgradeDesc': 'Upgrade to Pro or Elite for more daily signals and advanced features',
    'dashboard.viewPlans': 'View Plans',
    
    // Signal generation
    'signal.title': 'Generate Trading Signal',
    'signal.tradingPair': 'Trading Pair',
    'signal.tradingSchool': 'Trading School',
    'signal.advancedSettings': 'Advanced Settings',
    'signal.candleCount': 'Candle Count',
    'signal.aiProvider': 'AI Provider',
    'signal.generateSignal': 'Generate Signal',
    'signal.fetchMarketData': 'Fetch Market Data',
    'signal.marketDataReady': 'Market Data Ready',
    'signal.demoData': 'Demo Data',
    'signal.fetchingData': 'Fetching Data...',
    'signal.analyzingMarket': 'Analyzing Market...',
    'signal.dailyLimitReached': 'Daily limit reached. Upgrade your plan for more signals.',
    
    // Market data
    'market.symbol': 'Symbol',
    'market.candles5min': '5min Candles',
    'market.candles15min': '15min Candles',
    'market.candles1h': '1h Candles',
    'market.candles4h': '4h Candles',
    
    // Stats
    'stats.accountType': 'Account Type',
    'stats.dailyLimit': 'Daily Limit',
    'stats.usedToday': 'Used Today',
    'stats.selectedPair': 'Selected Pair',
    'stats.dataSource': 'Data Source',
    'stats.live': 'Live',
    'stats.demo': 'Demo',
    
    // API status
    'api.connected': 'API Connected',
    'api.disconnected': 'API Disconnected',
    'api.checking': 'Checking...',
    'api.demoDataUsed': 'Demo data in use',
    'api.retry': 'Retry',
    
    // Errors
    'error.apiNotConfigured': 'API key not configured',
    'error.rateLimitReached': 'Rate limit reached',
    'error.symbolNotFound': 'Symbol not found',
    'error.marketDataUnavailable': 'Market data unavailable',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.refresh': 'Refresh',
  },
  
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.signals': 'الإشارات',
    'nav.history': 'التاريخ',
    'nav.settings': 'الإعدادات',
    'nav.admin': 'المدير',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',
    'nav.getStarted': 'ابدأ الآن',
    
    // Language names - Keep native scripts for all languages
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',
    
    // Landing page
    'landing.hero.title': 'إشارات التداول المدعومة بالذكاء الاصطناعي',
    'landing.hero.subtitle': 'احصل على توصيات تداول ذكية مدعومة بتحليل الذكاء الاصطناعي المتقدم. اتخذ قرارات تداول أذكى مع منصة توليد الإشارات المتطورة.',
    'landing.hero.startTrial': 'ابدأ التجربة المجانية',
    'landing.features.title': 'لماذا تختار AI Trader؟',
    'landing.features.subtitle': 'تقنية الذكاء الاصطناعي المتقدمة تلتقي بخبرة التداول المهنية',
    'landing.features.ai.title': 'تحليل ذكي متقدم',
    'landing.features.ai.desc': 'مدعوم بـ GPT-4 وخوارزميات التعلم الآلي المتطورة للتنبؤ الدقيق بالسوق',
    'landing.features.secure.title': 'آمن وموثوق',
    'landing.features.secure.desc': 'أمان على مستوى البنوك مع ضمان وقت تشغيل 99.9% وبنية تحتية على مستوى المؤسسات',
    'landing.features.schools.title': 'مدارس تداول متعددة',
    'landing.features.schools.desc': 'استراتيجيات التحليل الفني والأساسي والزخم والتداول المتأرجح من المحللين الخبراء',
    'landing.pricing.title': 'اختر خطتك',
    'landing.pricing.subtitle': 'ابدأ مجاناً، ترقى عندما تحتاج المزيد من الإشارات',
    'landing.pricing.getStarted': 'ابدأ الآن',
    'landing.cta.title': 'مستعد لبدء التداول بذكاء؟',
    'landing.cta.subtitle': 'انضم إلى آلاف المتداولين الذين يستخدمون الإشارات المدعومة بالذكاء الاصطناعي',
    'landing.cta.startTrial': 'ابدأ التجربة المجانية',
    
    // Authentication
    'auth.login.title': 'مرحباً بعودتك',
    'auth.login.subtitle': 'سجل الدخول إلى حساب AI Trader الخاص بك',
    'auth.register.title': 'إنشاء حساب',
    'auth.register.subtitle': 'انضم إلى آلاف المتداولين الناجحين',
    'auth.email': 'عنوان البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.signIn': 'تسجيل الدخول',
    'auth.signUp': 'التسجيل',
    'auth.createAccount': 'إنشاء حساب',
    'auth.dontHaveAccount': 'ليس لديك حساب؟',
    'auth.alreadyHaveAccount': 'لديك حساب بالفعل؟',
    'auth.signInHere': 'سجل الدخول هنا',
    'auth.signUpHere': 'سجل هنا',
    'auth.orSignInWith': 'أو سجل الدخول بالبريد الإلكتروني',
    'auth.orCreateWith': 'أو أنشئ حساباً بالبريد الإلكتروني',
    
    // Dashboard
    'dashboard.title': 'لوحة التداول',
    'dashboard.subtitle': 'قم بتوليد إشارات التداول المدعومة بالذكاء الاصطناعي وإدارة حسابك',
    'dashboard.currentPlan': 'الخطة الحالية',
    'dashboard.signalsToday': 'الإشارات اليوم',
    'dashboard.remaining': 'المتبقي',
    'dashboard.needMoreSignals': 'تحتاج المزيد من الإشارات؟',
    'dashboard.upgradeDesc': 'ترقى إلى Pro أو Elite للحصول على المزيد من الإشارات اليومية والميزات المتقدمة',
    'dashboard.viewPlans': 'عرض الخطط',
    
    // Signal generation
    'signal.title': 'توليد إشارة التداول',
    'signal.tradingPair': 'زوج التداول',
    'signal.tradingSchool': 'مدرسة التداول',
    'signal.advancedSettings': 'الإعدادات المتقدمة',
    'signal.candleCount': 'عدد الشموع',
    'signal.aiProvider': 'مزود الذكاء الاصطناعي',
    'signal.generateSignal': 'توليد الإشارة',
    'signal.fetchMarketData': 'جلب بيانات السوق',
    'signal.marketDataReady': 'بيانات السوق جاهزة',
    'signal.demoData': 'بيانات تجريبية',
    'signal.fetchingData': 'جلب البيانات...',
    'signal.analyzingMarket': 'تحليل السوق...',
    'signal.dailyLimitReached': 'تم الوصول للحد اليومي. ترقى خطتك للحصول على المزيد من الإشارات.',
    
    // Market data
    'market.symbol': 'الرمز',
    'market.candles5min': 'شموع 5 دقائق',
    'market.candles15min': 'شموع 15 دقيقة',
    'market.candles1h': 'شموع ساعة',
    'market.candles4h': 'شموع 4 ساعات',
    
    // Stats
    'stats.accountType': 'نوع الحساب',
    'stats.dailyLimit': 'الحد اليومي',
    'stats.usedToday': 'المستخدم اليوم',
    'stats.selectedPair': 'الزوج المختار',
    'stats.dataSource': 'مصدر البيانات',
    'stats.live': 'مباشر',
    'stats.demo': 'تجريبي',
    
    // API status
    'api.connected': 'API متصل',
    'api.disconnected': 'API منقطع',
    'api.checking': 'فحص...',
    'api.demoDataUsed': 'بيانات تجريبية قيد الاستخدام',
    'api.retry': 'إعادة المحاولة',
    
    // Errors
    'error.apiNotConfigured': 'مفتاح API غير مكون',
    'error.rateLimitReached': 'تم الوصول لحد المعدل',
    'error.symbolNotFound': 'الرمز غير موجود',
    'error.marketDataUnavailable': 'بيانات السوق غير متاحة',
    
    // Common
    'common.loading': 'تحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.refresh': 'تحديث',
  },
  
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.signals': 'Signaux',
    'nav.history': 'Historique',
    'nav.settings': 'Paramètres',
    'nav.admin': 'Admin',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    'nav.getStarted': 'Commencer',
    
    // Language names - Keep native scripts
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',
    
    // Landing page
    'landing.hero.title': 'Signaux de Trading IA',
    'landing.hero.subtitle': 'Obtenez des recommandations de trading intelligentes alimentées par une analyse IA avancée. Prenez des décisions de trading plus intelligentes avec notre plateforme de génération de signaux de pointe.',
    'landing.hero.startTrial': 'Essai Gratuit',
    'landing.features.title': 'Pourquoi Choisir AI Trader?',
    'landing.features.subtitle': 'Technologie IA avancée rencontre expertise de trading professionnelle',
    'landing.features.ai.title': 'Analyse IA Avancée',
    'landing.features.ai.desc': 'Alimenté par GPT-4 et des algorithmes d\'apprentissage automatique de pointe pour des prédictions de marché précises',
    'landing.features.secure.title': 'Sécurisé et Fiable',
    'landing.features.secure.desc': 'Sécurité de niveau bancaire avec garantie de disponibilité de 99,9% et infrastructure de niveau entreprise',
    'landing.features.schools.title': 'Écoles de Trading Multiples',
    'landing.features.schools.desc': 'Stratégies d\'analyse technique, fondamentale, momentum et swing trading d\'analystes experts',
    'landing.pricing.title': 'Choisissez Votre Plan',
    'landing.pricing.subtitle': 'Commencez gratuitement, mettez à niveau quand vous avez besoin de plus de signaux',
    'landing.pricing.getStarted': 'Commencer',
    'landing.cta.title': 'Prêt à Trader Plus Intelligemment?',
    'landing.cta.subtitle': 'Rejoignez des milliers de traders utilisant des signaux alimentés par l\'IA',
    'landing.cta.startTrial': 'Essai Gratuit',
    
    // Authentication
    'auth.login.title': 'Bon Retour',
    'auth.login.subtitle': 'Connectez-vous à votre compte AI Trader',
    'auth.register.title': 'Créer un Compte',
    'auth.register.subtitle': 'Rejoignez des milliers de traders prospères',
    'auth.email': 'Adresse Email',
    'auth.password': 'Mot de Passe',
    'auth.confirmPassword': 'Confirmer le Mot de Passe',
    'auth.signIn': 'Se Connecter',
    'auth.signUp': 'S\'inscrire',
    'auth.createAccount': 'Créer un Compte',
    'auth.dontHaveAccount': 'Vous n\'avez pas de compte?',
    'auth.alreadyHaveAccount': 'Vous avez déjà un compte?',
    'auth.signInHere': 'Connectez-vous ici',
    'auth.signUpHere': 'Inscrivez-vous ici',
    'auth.orSignInWith': 'ou connectez-vous avec email',
    'auth.orCreateWith': 'ou créez un compte avec email',
    
    // Dashboard
    'dashboard.title': 'Tableau de Bord Trading',
    'dashboard.subtitle': 'Générez des signaux de trading alimentés par l\'IA et gérez votre compte',
    'dashboard.currentPlan': 'Plan Actuel',
    'dashboard.signalsToday': 'Signaux Aujourd\'hui',
    'dashboard.remaining': 'Restant',
    'dashboard.needMoreSignals': 'Besoin de Plus de Signaux?',
    'dashboard.upgradeDesc': 'Passez à Pro ou Elite pour plus de signaux quotidiens et des fonctionnalités avancées',
    'dashboard.viewPlans': 'Voir les Plans',
    
    // Signal generation
    'signal.title': 'Générer Signal de Trading',
    'signal.tradingPair': 'Paire de Trading',
    'signal.tradingSchool': 'École de Trading',
    'signal.advancedSettings': 'Paramètres Avancés',
    'signal.candleCount': 'Nombre de Bougies',
    'signal.aiProvider': 'Fournisseur IA',
    'signal.generateSignal': 'Générer Signal',
    'signal.fetchMarketData': 'Récupérer Données Marché',
    'signal.marketDataReady': 'Données Marché Prêtes',
    'signal.demoData': 'Données Démo',
    'signal.fetchingData': 'Récupération des Données...',
    'signal.analyzingMarket': 'Analyse du Marché...',
    'signal.dailyLimitReached': 'Limite quotidienne atteinte. Mettez à niveau votre plan pour plus de signaux.',
    
    // Market data
    'market.symbol': 'Symbole',
    'market.candles5min': 'Bougies 5min',
    'market.candles15min': 'Bougies 15min',
    'market.candles1h': 'Bougies 1h',
    'market.candles4h': 'Bougies 4h',
    
    // Stats
    'stats.accountType': 'Type de Compte',
    'stats.dailyLimit': 'Limite Quotidienne',
    'stats.usedToday': 'Utilisé Aujourd\'hui',
    'stats.selectedPair': 'Paire Sélectionnée',
    'stats.dataSource': 'Source de Données',
    'stats.live': 'En Direct',
    'stats.demo': 'Démo',
    
    // API status
    'api.connected': 'API Connectée',
    'api.disconnected': 'API Déconnectée',
    'api.checking': 'Vérification...',
    'api.demoDataUsed': 'Données démo en cours d\'utilisation',
    'api.retry': 'Réessayer',
    
    // Errors
    'error.apiNotConfigured': 'Clé API non configurée',
    'error.rateLimitReached': 'Limite de taux atteinte',
    'error.symbolNotFound': 'Symbole non trouvé',
    'error.marketDataUnavailable': 'Données de marché indisponibles',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.close': 'Fermer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.export': 'Exporter',
    'common.import': 'Importer',
    'common.refresh': 'Actualiser',
  },
  
  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.signals': 'Señales',
    'nav.history': 'Historial',
    'nav.settings': 'Configuración',
    'nav.admin': 'Admin',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'nav.getStarted': 'Comenzar',
    
    // Language names - Keep native scripts
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',
    
    // Landing page
    'landing.hero.title': 'Señales de Trading con IA',
    'landing.hero.subtitle': 'Obtén recomendaciones de trading inteligentes impulsadas por análisis avanzado de IA. Toma decisiones de trading más inteligentes con nuestra plataforma de generación de señales de vanguardia.',
    'landing.hero.startTrial': 'Prueba Gratuita',
    'landing.features.title': '¿Por Qué Elegir AI Trader?',
    'landing.features.subtitle': 'Tecnología IA avanzada se encuentra con experiencia profesional en trading',
    'landing.features.ai.title': 'Análisis IA Avanzado',
    'landing.features.ai.desc': 'Impulsado por GPT-4 y algoritmos de aprendizaje automático de vanguardia para predicciones precisas del mercado',
    'landing.features.secure.title': 'Seguro y Confiable',
    'landing.features.secure.desc': 'Seguridad de nivel bancario con garantía de tiempo de actividad del 99.9% e infraestructura de nivel empresarial',
    'landing.features.schools.title': 'Múltiples Escuelas de Trading',
    'landing.features.schools.desc': 'Estrategias de análisis técnico, fundamental, momentum y swing trading de analistas expertos',
    'landing.pricing.title': 'Elige Tu Plan',
    'landing.pricing.subtitle': 'Comienza gratis, actualiza cuando necesites más señales',
    'landing.pricing.getStarted': 'Comenzar',
    'landing.cta.title': '¿Listo para Operar Más Inteligentemente?',
    'landing.cta.subtitle': 'Únete a miles de traders usando señales impulsadas por IA',
    'landing.cta.startTrial': 'Prueba Gratuita',
    
    // Authentication
    'auth.login.title': 'Bienvenido de Vuelta',
    'auth.login.subtitle': 'Inicia sesión en tu cuenta de AI Trader',
    'auth.register.title': 'Crear Cuenta',
    'auth.register.subtitle': 'Únete a miles de traders exitosos',
    'auth.email': 'Dirección de Email',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.signIn': 'Iniciar Sesión',
    'auth.signUp': 'Registrarse',
    'auth.createAccount': 'Crear Cuenta',
    'auth.dontHaveAccount': '¿No tienes una cuenta?',
    'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
    'auth.signInHere': 'Inicia sesión aquí',
    'auth.signUpHere': 'Regístrate aquí',
    'auth.orSignInWith': 'o inicia sesión con email',
    'auth.orCreateWith': 'o crea cuenta con email',
    
    // Dashboard
    'dashboard.title': 'Panel de Trading',
    'dashboard.subtitle': 'Genera señales de trading impulsadas por IA y gestiona tu cuenta',
    'dashboard.currentPlan': 'Plan Actual',
    'dashboard.signalsToday': 'Señales Hoy',
    'dashboard.remaining': 'Restante',
    'dashboard.needMoreSignals': '¿Necesitas Más Señales?',
    'dashboard.upgradeDesc': 'Actualiza a Pro o Elite para más señales diarias y características avanzadas',
    'dashboard.viewPlans': 'Ver Planes',
    
    // Signal generation
    'signal.title': 'Generar Señal de Trading',
    'signal.tradingPair': 'Par de Trading',
    'signal.tradingSchool': 'Escuela de Trading',
    'signal.advancedSettings': 'Configuración Avanzada',
    'signal.candleCount': 'Número de Velas',
    'signal.aiProvider': 'Proveedor de IA',
    'signal.generateSignal': 'Generar Señal',
    'signal.fetchMarketData': 'Obtener Datos del Mercado',
    'signal.marketDataReady': 'Datos del Mercado Listos',
    'signal.demoData': 'Datos Demo',
    'signal.fetchingData': 'Obteniendo Datos...',
    'signal.analyzingMarket': 'Analizando Mercado...',
    'signal.dailyLimitReached': 'Límite diario alcanzado. Actualiza tu plan para más señales.',
    
    // Market data
    'market.symbol': 'Símbolo',
    'market.candles5min': 'Velas 5min',
    'market.candles15min': 'Velas 15min',
    'market.candles1h': 'Velas 1h',
    'market.candles4h': 'Velas 4h',
    
    // Stats
    'stats.accountType': 'Tipo de Cuenta',
    'stats.dailyLimit': 'Límite Diario',
    'stats.usedToday': 'Usado Hoy',
    'stats.selectedPair': 'Par Seleccionado',
    'stats.dataSource': 'Fuente de Datos',
    'stats.live': 'En Vivo',
    'stats.demo': 'Demo',
    
    // API status
    'api.connected': 'API Conectada',
    'api.disconnected': 'API Desconectada',
    'api.checking': 'Verificando...',
    'api.demoDataUsed': 'Datos demo en uso',
    'api.retry': 'Reintentar',
    
    // Errors
    'error.apiNotConfigured': 'Clave API no configurada',
    'error.rateLimitReached': 'Límite de velocidad alcanzado',
    'error.symbolNotFound': 'Símbolo no encontrado',
    'error.marketDataUnavailable': 'Datos de mercado no disponibles',
    
    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.refresh': 'Actualizar',
  },
  
  de: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.signals': 'Signale',
    'nav.history': 'Verlauf',
    'nav.settings': 'Einstellungen',
    'nav.admin': 'Admin',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    'nav.getStarted': 'Loslegen',
    
    // Language names - Keep native scripts
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',
    
    // Landing page
    'landing.hero.title': 'KI-gestützte Trading-Signale',
    'landing.hero.subtitle': 'Erhalten Sie intelligente Trading-Empfehlungen durch fortschrittliche KI-Analyse. Treffen Sie intelligentere Trading-Entscheidungen mit unserer hochmodernen Signal-Generierungsplattform.',
    'landing.hero.startTrial': 'Kostenlose Testversion',
    'landing.features.title': 'Warum AI Trader Wählen?',
    'landing.features.subtitle': 'Fortschrittliche KI-Technologie trifft auf professionelle Trading-Expertise',
    'landing.features.ai.title': 'Fortschrittliche KI-Analyse',
    'landing.features.ai.desc': 'Angetrieben von GPT-4 und modernsten Machine-Learning-Algorithmen für präzise Marktvorhersagen',
    'landing.features.secure.title': 'Sicher und Zuverlässig',
    'landing.features.secure.desc': 'Banken-Level-Sicherheit mit 99,9% Verfügbarkeitsgarantie und Unternehmens-Infrastruktur',
    'landing.features.schools.title': 'Mehrere Trading-Schulen',
    'landing.features.schools.desc': 'Technische, fundamentale, Momentum- und Swing-Trading-Strategien von Experten-Analysten',
    'landing.pricing.title': 'Wählen Sie Ihren Plan',
    'landing.pricing.subtitle': 'Starten Sie kostenlos, upgraden Sie wenn Sie mehr Signale benötigen',
    'landing.pricing.getStarted': 'Loslegen',
    'landing.cta.title': 'Bereit für Smarteres Trading?',
    'landing.cta.subtitle': 'Schließen Sie sich Tausenden von Tradern an, die KI-gestützte Signale nutzen',
    'landing.cta.startTrial': 'Kostenlose Testversion',
    
    // Authentication
    'auth.login.title': 'Willkommen Zurück',
    'auth.login.subtitle': 'Melden Sie sich bei Ihrem AI Trader Konto an',
    'auth.register.title': 'Konto Erstellen',
    'auth.register.subtitle': 'Schließen Sie sich Tausenden erfolgreicher Trader an',
    'auth.email': 'E-Mail-Adresse',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort Bestätigen',
    'auth.signIn': 'Anmelden',
    'auth.signUp': 'Registrieren',
    'auth.createAccount': 'Konto Erstellen',
    'auth.dontHaveAccount': 'Haben Sie kein Konto?',
    'auth.alreadyHaveAccount': 'Haben Sie bereits ein Konto?',
    'auth.signInHere': 'Hier anmelden',
    'auth.signUpHere': 'Hier registrieren',
    'auth.orSignInWith': 'oder mit E-Mail anmelden',
    'auth.orCreateWith': 'oder Konto mit E-Mail erstellen',
    
    // Dashboard
    'dashboard.title': 'Trading Dashboard',
    'dashboard.subtitle': 'Generieren Sie KI-gestützte Trading-Signale und verwalten Sie Ihr Konto',
    'dashboard.currentPlan': 'Aktueller Plan',
    'dashboard.signalsToday': 'Signale Heute',
    'dashboard.remaining': 'Verbleibend',
    'dashboard.needMoreSignals': 'Benötigen Sie Mehr Signale?',
    'dashboard.upgradeDesc': 'Upgraden Sie auf Pro oder Elite für mehr tägliche Signale und erweiterte Funktionen',
    'dashboard.viewPlans': 'Pläne Anzeigen',
    
    // Signal generation
    'signal.title': 'Trading-Signal Generieren',
    'signal.tradingPair': 'Trading-Paar',
    'signal.tradingSchool': 'Trading-Schule',
    'signal.advancedSettings': 'Erweiterte Einstellungen',
    'signal.candleCount': 'Kerzen-Anzahl',
    'signal.aiProvider': 'KI-Anbieter',
    'signal.generateSignal': 'Signal Generieren',
    'signal.fetchMarketData': 'Marktdaten Abrufen',
    'signal.marketDataReady': 'Marktdaten Bereit',
    'signal.demoData': 'Demo-Daten',
    'signal.fetchingData': 'Daten Abrufen...',
    'signal.analyzingMarket': 'Markt Analysieren...',
    'signal.dailyLimitReached': 'Tageslimit erreicht. Upgraden Sie Ihren Plan für mehr Signale.',
    
    // Market data
    'market.symbol': 'Symbol',
    'market.candles5min': '5min Kerzen',
    'market.candles15min': '15min Kerzen',
    'market.candles1h': '1h Kerzen',
    'market.candles4h': '4h Kerzen',
    
    // Stats
    'stats.accountType': 'Kontotyp',
    'stats.dailyLimit': 'Tageslimit',
    'stats.usedToday': 'Heute Verwendet',
    'stats.selectedPair': 'Ausgewähltes Paar',
    'stats.dataSource': 'Datenquelle',
    'stats.live': 'Live',
    'stats.demo': 'Demo',
    
    // API status
    'api.connected': 'API Verbunden',
    'api.disconnected': 'API Getrennt',
    'api.checking': 'Überprüfung...',
    'api.demoDataUsed': 'Demo-Daten in Verwendung',
    'api.retry': 'Wiederholen',
    
    // Errors
    'error.apiNotConfigured': 'API-Schlüssel nicht konfiguriert',
    'error.rateLimitReached': 'Rate-Limit erreicht',
    'error.symbolNotFound': 'Symbol nicht gefunden',
    'error.marketDataUnavailable': 'Marktdaten nicht verfügbar',
    
    // Common
    'common.loading': 'Laden...',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.close': 'Schließen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Vorherige',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.export': 'Exportieren',
    'common.import': 'Importieren',
    'common.refresh': 'Aktualisieren',
  },
  
  it: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.signals': 'Segnali',
    'nav.history': 'Cronologia',
    'nav.settings': 'Impostazioni',
    'nav.admin': 'Admin',
    'nav.login': 'Accedi',
    'nav.logout': 'Esci',
    'nav.getStarted': 'Inizia',
    
    // Language names - Keep native scripts
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',
    
    // Landing page
    'landing.hero.title': 'Segnali di Trading AI',
    'landing.hero.subtitle': 'Ottieni raccomandazioni di trading intelligenti alimentate da analisi AI avanzata. Prendi decisioni di trading più intelligenti con la nostra piattaforma di generazione segnali all\'avanguardia.',
    'landing.hero.startTrial': 'Prova Gratuita',
    'landing.features.title': 'Perché Scegliere AI Trader?',
    'landing.features.subtitle': 'Tecnologia AI avanzata incontra esperienza di trading professionale',
    'landing.features.ai.title': 'Analisi AI Avanzata',
    'landing.features.ai.desc': 'Alimentato da GPT-4 e algoritmi di machine learning all\'avanguardia per previsioni di mercato precise',
    'landing.features.secure.title': 'Sicuro e Affidabile',
    'landing.features.secure.desc': 'Sicurezza di livello bancario con garanzia di uptime del 99,9% e infrastruttura di livello aziendale',
    'landing.features.schools.title': 'Scuole di Trading Multiple',
    'landing.features.schools.desc': 'Strategie di analisi tecnica, fondamentale, momentum e swing trading da analisti esperti',
    'landing.pricing.title': 'Scegli il Tuo Piano',
    'landing.pricing.subtitle': 'Inizia gratis, aggiorna quando hai bisogno di più segnali',
    'landing.pricing.getStarted': 'Inizia',
    'landing.cta.title': 'Pronto a Fare Trading Più Intelligentemente?',
    'landing.cta.subtitle': 'Unisciti a migliaia di trader che usano segnali alimentati da AI',
    'landing.cta.startTrial': 'Prova Gratuita',
    
    // Authentication
    'auth.login.title': 'Bentornato',
    'auth.login.subtitle': 'Accedi al tuo account AI Trader',
    'auth.register.title': 'Crea Account',
    'auth.register.subtitle': 'Unisciti a migliaia di trader di successo',
    'auth.email': 'Indirizzo Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Conferma Password',
    'auth.signIn': 'Accedi',
    'auth.signUp': 'Registrati',
    'auth.createAccount': 'Crea Account',
    'auth.dontHaveAccount': 'Non hai un account?',
    'auth.alreadyHaveAccount': 'Hai già un account?',
    'auth.signInHere': 'Accedi qui',
    'auth.signUpHere': 'Registrati qui',
    'auth.orSignInWith': 'o accedi con email',
    'auth.orCreateWith': 'o crea account con email',
    
    // Dashboard
    'dashboard.title': 'Dashboard Trading',
    'dashboard.subtitle': 'Genera segnali di trading alimentati da AI e gestisci il tuo account',
    'dashboard.currentPlan': 'Piano Attuale',
    'dashboard.signalsToday': 'Segnali Oggi',
    'dashboard.remaining': 'Rimanenti',
    'dashboard.needMoreSignals': 'Hai Bisogno di Più Segnali?',
    'dashboard.upgradeDesc': 'Aggiorna a Pro o Elite per più segnali giornalieri e funzionalità avanzate',
    'dashboard.viewPlans': 'Visualizza Piani',
    
    // Signal generation
    'signal.title': 'Genera Segnale di Trading',
    'signal.tradingPair': 'Coppia di Trading',
    'signal.tradingSchool': 'Scuola di Trading',
    'signal.advancedSettings': 'Impostazioni Avanzate',
    'signal.candleCount': 'Numero di Candele',
    'signal.aiProvider': 'Provider AI',
    'signal.generateSignal': 'Genera Segnale',
    'signal.fetchMarketData': 'Recupera Dati di Mercato',
    'signal.marketDataReady': 'Dati di Mercato Pronti',
    'signal.demoData': 'Dati Demo',
    'signal.fetchingData': 'Recupero Dati...',
    'signal.analyzingMarket': 'Analisi Mercato...',
    'signal.dailyLimitReached': 'Limite giornaliero raggiunto. Aggiorna il tuo piano per più segnali.',
    
    // Market data
    'market.symbol': 'Simbolo',
    'market.candles5min': 'Candele 5min',
    'market.candles15min': 'Candele 15min',
    'market.candles1h': 'Candele 1h',
    'market.candles4h': 'Candele 4h',
    
    // Stats
    'stats.accountType': 'Tipo di Account',
    'stats.dailyLimit': 'Limite Giornaliero',
    'stats.usedToday': 'Usato Oggi',
    'stats.selectedPair': 'Coppia Selezionata',
    'stats.dataSource': 'Fonte Dati',
    'stats.live': 'Live',
    'stats.demo': 'Demo',
    
    // API status
    'api.connected': 'API Connessa',
    'api.disconnected': 'API Disconnessa',
    'api.checking': 'Controllo...',
    'api.demoDataUsed': 'Dati demo in uso',
    'api.retry': 'Riprova',
    
    // Errors
    'error.apiNotConfigured': 'Chiave API non configurata',
    'error.rateLimitReached': 'Limite di velocità raggiunto',
    'error.symbolNotFound': 'Simbolo non trovato',
    'error.marketDataUnavailable': 'Dati di mercato non disponibili',
    
    // Common
    'common.loading': 'Caricamento...',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.close': 'Chiudi',
    'common.back': 'Indietro',
    'common.next': 'Avanti',
    'common.previous': 'Precedente',
    'common.search': 'Cerca',
    'common.filter': 'Filtra',
    'common.export': 'Esporta',
    'common.import': 'Importa',
    'common.refresh': 'Aggiorna',
  },
  
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.signals': 'सिग्नल',
    'nav.history': 'इतिहास',
    'nav.settings': 'सेटिंग्स',
    'nav.admin': 'एडमिन',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    'nav.getStarted': 'शुरू करें',
    
    // Language names - Keep native scripts
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.french': 'Français',
    'language.spanish': 'Español',
    'language.german': 'Deutsch',
    'language.italian': 'Italiano',
    'language.hindi': 'हिन्दी',
    
    // Landing page
    'landing.hero.title': 'AI-संचालित ट्रेडिंग सिग्नल',
    'landing.hero.subtitle': 'उन्नत AI विश्लेषण द्वारा संचालित बुद्धिमान ट्रेडिंग सिफारिशें प्राप्त करें। हमारे अत्याधुनिक सिग्नल जेनरेशन प्लेटफॉर्म के साथ स्मार्ट ट्रेडिंग निर्णय लें।',
    'landing.hero.startTrial': 'मुफ्त ट्रायल',
    'landing.features.title': 'AI Trader क्यों चुनें?',
    'landing.features.subtitle': 'उन्नत AI तकनीक पेशेवर ट्रेडिंग विशेषज्ञता से मिलती है',
    'landing.features.ai.title': 'उन्नत AI विश्लेषण',
    'landing.features.ai.desc': 'GPT-4 और अत्याधुनिक मशीन लर्निंग एल्गोरिदम द्वारा संचालित सटीक बाजार भविष्यवाणियों के लिए',
    'landing.features.secure.title': 'सुरक्षित और विश्वसनीय',
    'landing.features.secure.desc': 'बैंक-स्तरीय सुरक्षा के साथ 99.9% अपटाइम गारंटी और एंटरप्राइज़-ग्रेड इन्फ्रास्ट्रक्चर',
    'landing.features.schools.title': 'कई ट्रेडिंग स्कूल',
    'landing.features.schools.desc': 'विशेषज्ञ विश्लेषकों से तकनीकी, मौलिक, मोमेंटम और स्विंग ट्रेडिंग रणनीतियां',
    'landing.pricing.title': 'अपना प्लान चुनें',
    'landing.pricing.subtitle': 'मुफ्त में शुरू करें, जब आपको अधिक सिग्नल की आवश्यकता हो तो अपग्रेड करें',
    'landing.pricing.getStarted': 'शुरू करें',
    'landing.cta.title': 'स्मार्ट ट्रेडिंग शुरू करने के लिए तैयार?',
    'landing.cta.subtitle': 'AI-संचालित सिग्नल का उपयोग करने वाले हजारों ट्रेडर्स से जुड़ें',
    'landing.cta.startTrial': 'मुफ्त ट्रायल',
    
    // Authentication
    'auth.login.title': 'वापस स्वागत है',
    'auth.login.subtitle': 'अपने AI Trader खाते में साइन इन करें',
    'auth.register.title': 'खाता बनाएं',
    'auth.register.subtitle': 'हजारों सफल ट्रेडर्स से जुड़ें',
    'auth.email': 'ईमेल पता',
    'auth.password': 'पासवर्ड',
    'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'साइन अप',
    'auth.createAccount': 'खाता बनाएं',
    'auth.dontHaveAccount': 'खाता नहीं है?',
    'auth.alreadyHaveAccount': 'पहले से खाता है?',
    'auth.signInHere': 'यहां साइन इन करें',
    'auth.signUpHere': 'यहां साइन अप करें',
    'auth.orSignInWith': 'या ईमेल से साइन इन करें',
    'auth.orCreateWith': 'या ईमेल से खाता बनाएं',
    
    // Dashboard
    'dashboard.title': 'ट्रेडिंग डैशबोर्ड',
    'dashboard.subtitle': 'AI-संचालित ट्रेडिंग सिग्नल जेनरेट करें और अपना खाता प्रबंधित करें',
    'dashboard.currentPlan': 'वर्तमान प्लान',
    'dashboard.signalsToday': 'आज के सिग्नल',
    'dashboard.remaining': 'शेष',
    'dashboard.needMoreSignals': 'अधिक सिग्नल चाहिए?',
    'dashboard.upgradeDesc': 'अधिक दैनिक सिग्नल और उन्नत सुविधाओं के लिए Pro या Elite में अपग्रेड करें',
    'dashboard.viewPlans': 'प्लान देखें',
    
    // Signal generation
    'signal.title': 'ट्रेडिंग सिग्नल जेनरेट करें',
    'signal.tradingPair': 'ट्रेडिंग जोड़ी',
    'signal.tradingSchool': 'ट्रेडिंग स्कूल',
    'signal.advancedSettings': 'उन्नत सेटिंग्स',
    'signal.candleCount': 'कैंडल संख्या',
    'signal.aiProvider': 'AI प्रदाता',
    'signal.generateSignal': 'सिग्नल जेनरेट करें',
    'signal.fetchMarketData': 'मार्केट डेटा प्राप्त करें',
    'signal.marketDataReady': 'मार्केट डेटा तैयार',
    'signal.demoData': 'डेमो डेटा',
    'signal.fetchingData': 'डेटा प्राप्त कर रहे हैं...',
    'signal.analyzingMarket': 'मार्केट का विश्लेषण...',
    'signal.dailyLimitReached': 'दैनिक सीमा पहुंच गई। अधिक सिग्नल के लिए अपना प्लान अपग्रेड करें।',
    
    // Market data
    'market.symbol': 'प्रतीक',
    'market.candles5min': '5मिनट कैंडल',
    'market.candles15min': '15मिनट कैंडल',
    'market.candles1h': '1घंटा कैंडल',
    'market.candles4h': '4घंटे कैंडल',
    
    // Stats
    'stats.accountType': 'खाता प्रकार',
    'stats.dailyLimit': 'दैनिक सीमा',
    'stats.usedToday': 'आज उपयोग',
    'stats.selectedPair': 'चयनित जोड़ी',
    'stats.dataSource': 'डेटा स्रोत',
    'stats.live': 'लाइव',
    'stats.demo': 'डेमो',
    
    // API status
    'api.connected': 'API कनेक्टेड',
    'api.disconnected': 'API डिस्कनेक्टेड',
    'api.checking': 'जांच रहे हैं...',
    'api.demoDataUsed': 'डेमो डेटा उपयोग में',
    'api.retry': 'पुनः प्रयास',
    
    // Errors
    'error.apiNotConfigured': 'API की कॉन्फ़िगर नहीं',
    'error.rateLimitReached': 'दर सीमा पहुंच गई',
    'error.symbolNotFound': 'प्रतीक नहीं मिला',
    'error.marketDataUnavailable': 'मार्केट डेटा उपलब्ध नहीं',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.close': 'बंद करें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.search': 'खोजें',
    'common.filter': 'फ़िल्टर',
    'common.export': 'निर्यात',
    'common.import': 'आयात',
    'common.refresh': 'रीफ्रेश',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Update document direction and language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update body classes for styling
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
    document.body.classList.add(isRTL ? 'rtl' : 'ltr');
  }, [language, isRTL]);

  // Enhanced translation function with better error handling
  const t = (key: string): string => {
    try {
      // Get current language translations
      const currentTranslations = translations[language];
      if (!currentTranslations) {
        console.warn(`No translations found for language: ${language}`);
        return key;
      }

      // Direct key lookup first (for simple keys)
      if (currentTranslations[key]) {
        return currentTranslations[key];
      }

      // Nested key lookup (for dot notation keys like 'nav.dashboard')
      const keys = key.split('.');
      let value: any = currentTranslations;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }
      
      // If found, return the value
      if (typeof value === 'string') {
        return value;
      }
      
      // Fallback to English if translation not found
      const englishTranslations = translations.en;
      if (englishTranslations[key]) {
        return englishTranslations[key];
      }

      // Nested fallback to English
      let englishValue: any = englishTranslations;
      for (const k of keys) {
        if (englishValue && typeof englishValue === 'object' && k in englishValue) {
          englishValue = englishValue[k];
        } else {
          englishValue = undefined;
          break;
        }
      }
      
      if (typeof englishValue === 'string') {
        return englishValue;
      }
      
      // If all else fails, return the key itself
      console.warn(`Translation not found for key: ${key} in language: ${language}`);
      return key;
      
    } catch (error) {
      console.error(`Error in translation function for key: ${key}`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};