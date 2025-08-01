'use client';

import { useAuth } from './contexts/AuthContext';
import FinanceCardList from './components/FinanceCard';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  TrendingUp,
  Shield,
  BarChart3,
  Wallet,
  Target,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  DollarSign,
  Home,
  PiggyBank,
  CreditCard,
  Receipt,
  Calculator,
  Bell,
  Smartphone,
  Globe,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileText,
  TrendingDown,
  AlertCircle,
  Zap
} from 'lucide-react';

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Demo modal component
  const DemoModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-900">Demo Interactivo</h3>
          <button
            onClick={() => setShowDemo(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ingresos</p>
                    <p className="text-xl font-bold text-gray-900">$4,250</p>
                  </div>
                </div>
                <div className="text-sm text-green-600">+8.2% vs mes anterior</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gastos</p>
                    <p className="text-xl font-bold text-gray-900">$2,890</p>
                  </div>
                </div>
                <div className="text-sm text-red-600">+2.1% vs mes anterior</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PiggyBank className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ahorros</p>
                    <p className="text-xl font-bold text-gray-900">$1,360</p>
                  </div>
                </div>
                <div className="text-sm text-blue-600">Meta: $2,000</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Esta es una vista previa de tu dashboard personalizado
            </p>
            <button
              onClick={handleLogin}
              className="btn-primary"
            >
              Crear mi cuenta gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (user) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Mi App de Finanzas</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-600">Administra tus finanzas de manera simple</p>
          </div>

          <FinanceCardList />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Resumen General</h3>
              <p className="text-gray-600">Próximamente: Gráficos y estadísticas</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Categorías</h3>
              <p className="text-gray-600">Próximamente: Análisis por categorías</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const features = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Finanzas del Hogar",
      description: "Gestiona gastos familiares, servicios, hipoteca y presupuesto doméstico",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Gastos Personales",
      description: "Controla tus gastos diarios, compras y entretenimiento de forma inteligente",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <PiggyBank className="w-8 h-8" />,
      title: "Metas de Ahorro",
      description: "Define objetivos financieros y sigue tu progreso hacia la libertad económica",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Análisis Avanzado",
      description: "Reportes detallados con gráficos y tendencias de tus hábitos financieros",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Tarjetas y Deudas",
      description: "Monitorea tarjetas de crédito, préstamos y planifica pagos estratégicos",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Alertas Inteligentes",
      description: "Notificaciones personalizadas para vencimientos, límites y oportunidades",
      color: "from-teal-500 to-green-600"
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Madre de familia",
      content: "Desde que uso FinanceApp, mi familia ahorra 30% más cada mes. Los reportes me ayudan a identificar gastos innecesarios.",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Carlos Rodríguez",
      role: "Freelancer",
      content: "Como trabajador independiente, necesitaba control total de mis ingresos variables. Esta app es perfecta para eso.",
      rating: 5,
      image: "👨‍💻"
    },
    {
      name: "Ana y Pedro Martínez",
      role: "Pareja joven",
      content: "Planificamos nuestra boda y casa nueva con las metas de ahorro. ¡Logramos ahorrar $15,000 en 8 meses!",
      rating: 5,
      image: "👫"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {showDemo && <DemoModal />}
      
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FinanceHome
                </h1>
                <p className="text-xs text-gray-500">Finanzas Personales & Hogar</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDemo(true)}
                className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Play className="w-4 h-4" />
                Ver Demo
              </button>
              <button
                onClick={handleLogin}
                className="btn-primary"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-animated animate-gradient opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Nuevo: Análisis con IA
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Domina las{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  finanzas
                </span>{' '}
                de tu{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  hogar
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                La única plataforma que necesitas para gestionar tanto tus finanzas personales 
                como las del hogar. Ahorra más, gasta mejor y alcanza tus metas familiares.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleLogin}
                  className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
                >
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDemo(true)}
                  className="bg-white text-gray-700 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Ver Demo Interactivo
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Sin tarjeta de crédito
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Configuración en 2 minutos
                </div>
              </div>
            </div>
            
            {/* Interactive Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">Mi Dashboard</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Hogar</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">$2,450</div>
                    <div className="text-sm text-green-600">-5% este mes</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Personal</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">$890</div>
                    <div className="text-sm text-blue-600">+2% este mes</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Supermercado</p>
                        <p className="text-sm text-gray-500">Hace 2 horas</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">-$127.50</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Electricidad</p>
                        <p className="text-sm text-gray-500">Ayer</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">-$89.20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades diseñadas para tu vida real
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde gastos del hogar hasta metas personales, tenemos todo lo que necesitas 
              para una gestión financiera completa y familiar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-modern p-8 text-center group cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:animate-pulse-glow transform group-hover:scale-110 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Resultados que hablan por sí solos
            </h2>
            <p className="text-xl text-blue-100">
              Miles de familias ya están transformando sus finanzas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "25,000+", label: "Familias Activas", icon: <Users className="w-8 h-8" /> },
              { number: "$50M+", label: "Dinero Gestionado", icon: <DollarSign className="w-8 h-8" /> },
              { number: "35%", label: "Ahorro Promedio", icon: <TrendingUp className="w-8 h-8" /> },
              { number: "4.9★", label: "Calificación App", icon: <Star className="w-8 h-8" /> }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="animate-float bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300" 
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex justify-center mb-4 text-white/80">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Así de fácil es empezar
            </h2>
            <p className="text-xl text-gray-600">
              En menos de 5 minutos tendrás el control total de tus finanzas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Crea tu cuenta",
                description: "Regístrate gratis y configura tu perfil familiar en 2 minutos",
                icon: <Smartphone className="w-8 h-8" />
              },
              {
                step: "02", 
                title: "Conecta tus cuentas",
                description: "Sincroniza bancos y tarjetas de forma segura o ingresa datos manualmente",
                icon: <CreditCard className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Toma el control",
                description: "Visualiza gastos, define metas y recibe insights personalizados",
                icon: <BarChart3 className="w-8 h-8" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Historias reales de éxito financiero
            </h2>
            <p className="text-xl text-gray-600">
              Descubre cómo otras familias han transformado sus finanzas
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="card-modern p-8 text-center">
              <div className="text-6xl mb-6">{testimonials[currentTestimonial].image}</div>
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div>
                <div className="font-bold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</div>
                <div className="text-gray-500">{testimonials[currentTestimonial].role}</div>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-animated animate-gradient opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Tu libertad financiera empieza hoy
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Únete a miles de familias que ya están construyendo un futuro financiero sólido. 
            Sin compromisos, sin tarjeta de crédito, solo resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLogin}
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg flex items-center justify-center gap-2"
            >
              Comenzar Ahora - Es Gratis
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Ver Demo
            </button>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Datos 100% seguros
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Disponible 24/7
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Soporte en español
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">FinanceHome</h3>
                  <p className="text-sm text-gray-400">Finanzas Personales & Hogar</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                La plataforma más completa para gestionar las finanzas de tu hogar y personales. 
                Diseñada por familias, para familias.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">📱</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">📧</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">💬</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Producto</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Características</li>
                <li className="hover:text-white transition-colors cursor-pointer">Precios</li>
                <li className="hover:text-white transition-colors cursor-pointer">Seguridad</li>
                <li className="hover:text-white transition-colors cursor-pointer">Integraciones</li>
                <li className="hover:text-white transition-colors cursor-pointer">API</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Recursos</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Centro de Ayuda</li>
                <li className="hover:text-white transition-colors cursor-pointer">Tutoriales</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">Webinars</li>
                <li className="hover:text-white transition-colors cursor-pointer">Comunidad</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Empresa</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Acerca de</li>
                <li className="hover:text-white transition-colors cursor-pointer">Carreras</li>
                <li className="hover:text-white transition-colors cursor-pointer">Prensa</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contacto</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacidad</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2024 FinanceHome. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="hover:text-white transition-colors cursor-pointer">Términos de Servicio</span>
                <span className="hover:text-white transition-colors cursor-pointer">Política de Privacidad</span>
                <span className="hover:text-white transition-colors cursor-pointer">Cookies</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}