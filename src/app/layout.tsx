import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ChatDemo from '@/components/ChatDemo';

export const metadata: Metadata = {
  title: 'Pastelería 3D Moderna',
  description: 'Descubre nuestros exquisitos pasteles con un diseño espectacular.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
        <ChatDemo />
      </body>
    </html>
  );
}
