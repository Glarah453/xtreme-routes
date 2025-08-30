import '@/app/ui/global.css'
import { inter, lusitana } from '@/app/ui/fonts'
import { AuthProvider } from '../context/AuthContext';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | Xtremes Routes',
    default: 'Xtremes Routes',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.className} antialiased`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
