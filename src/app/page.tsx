'use client';

import { useAuth } from './contexts/AuthContext';
import FinanceCard from './components/FinanceCard';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-gray-600">Administra tus finanzas de manera simple</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <FinanceCard />
              </div>
              <div style={{ width: "50%" }}>
                <button className="h-[400px] bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 border-2 border-dashed border-gray-300">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span className="mt-2 text-gray-500">Agregar Nueva Tarjeta</span>
                </button>
              </div>
            </div>

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
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bienvenido a Mi App de Finanzas
            </h2>
            <p className="text-gray-600 mb-8">
              Inicia sesión para comenzar a administrar tus finanzas
            </p>
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
