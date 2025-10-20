import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EasyGas Admin",
  description: "Painel de administração do EasyGas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>

        <AuthProvider>
          {children}
        </AuthProvider>
      
        <ToastContainer 
          position="top-right"
          autoClose={3000} 
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}