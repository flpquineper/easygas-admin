import { AdminLoginForm } from '@/components/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            EasyGas Admin
          </h1>
        </div>

        <div className="bg-white p-8 shadow-lg rounded-xl">
          <div className="mb-6 text-left">
            <h2 className="text-2xl font-semibold text-gray-700">Login</h2>
            <p className="text-sm text-gray-500 mt-1">Preencha os campos com os seus dados.</p>
          </div>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}