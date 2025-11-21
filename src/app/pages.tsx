import { redirect } from 'next/navigation';

// Esta página serve apenas para redirecionar acessos à raiz do admin para o dashboard
export default function Home() {
  redirect('/admin/dashboard');
}