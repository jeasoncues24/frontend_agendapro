import LoginForm from "./_components/LoginForm";


export default function AuthPage() {
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background blur effects - línea horizontal suave */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-96 bg-gradient-to-b from-transparent via-emerald-300/30 to-transparent blur-3xl"></div>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-80 bg-gradient-to-b from-transparent via-teal-200/25 to-transparent blur-2xl"></div>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-64 bg-gradient-to-b from-transparent via-green-300/20 to-transparent blur-xl"></div>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-48 bg-gradient-to-b from-transparent via-emerald-200/35 to-transparent blur-lg"></div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-8 space-y-6">
            {/* Logo */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-xl font-semibold text-gray-900">AgendaYa</span>
                <span className="text-sm text-gray-500 font-medium">cloud</span>
              </div>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
