import { AuthProvider } from './contexts/AuthContext';
import './globals.css';

export const metadata = {
  title: 'App de Finanzas',
  description: 'Administra tus finanzas personales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
