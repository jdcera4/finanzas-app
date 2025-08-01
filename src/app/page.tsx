'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  Users,
  ArrowRight,
  Star,
  DollarSign,
  Home as HomeIcon,
  PiggyBank,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleLogin = () => {
    router.push('/login');
  };

  const features = [
    {
      icon: <HomeIcon className="w-8 h-8" />,
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
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Madre de familia",
      content: "Desde que uso FinanceApp, mi familia ahorra 30% más cada mes.",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Carlos Rodríguez",
      role: "Freelancer",
      content: "Como trabajador independiente, necesitaba control total de mis ingresos variables.",
      rating: 5,
      image: "👨‍💻"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {showDemo && (
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
      )}

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center animate-slide-up">
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
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              La única plataforma que necesitas para gestionar tanto tus finanzas personales
              como las del hogar. Ahorra más, gasta mejor y alcanza tus metas familiares.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              <div key={index} className="card-modern p-8 text-center group cursor-pointer">
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

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Resultados que hablan por sí solos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "25,000+", label: "Familias Activas", icon: <Users className="w-8 h-8" /> },
              { number: "$50M+", label: "Dinero Gestionado", icon: <DollarSign className="w-8 h-8" /> },
              { number: "35%", label: "Ahorro Promedio", icon: <TrendingUp className="w-8 h-8" /> },
              { number: "4.9★", label: "Calificación App", icon: <Star className="w-8 h-8" /> }
            ].map((stat, index) => (
              <div key={index} className="animate-float bg-white/10 backdrop-blur-sm rounded-2xl p-6">
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

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Historias reales de éxito financiero
            </h2>
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
                &ldquo;{testimonials[currentTestimonial].content}&rdquo;
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Tu libertad financiera empieza hoy
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Únete a miles de familias que ya están construyendo un futuro financiero sólido.
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Producto</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Características</li>
                <li className="hover:text-white transition-colors cursor-pointer">Precios</li>
                <li className="hover:text-white transition-colors cursor-pointer">Seguridad</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Soporte</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Centro de Ayuda</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contacto</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 FinanceHome. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}