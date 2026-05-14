import { useNavigate } from "react-router-dom";
import { Building2, User } from "lucide-react";

export default function SelectProfile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-emerald-500 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Welcome to Greenly
          </h1>

          <p className="text-green-100 mt-4 text-base md:text-lg max-w-2xl mx-auto">
            Choose the type of profile you want to access in the platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Admin Card */}
          <button
            onClick={() => navigate("/logincompany")}
            className="group bg-white rounded-3xl p-8 shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            <p>You don't have a business account yet? <button onClick={(e) => {
              e.preventDefault();
              navigate("/companyregister");
            }} className="text-green-600 hover:text-green-700 font-semibold">
              Create one
            </button></p>
            <div className="flex flex-col items-center text-center">
              
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 group-hover:bg-green-200 transition">
                <Building2 size={45} className="text-green-700" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                Business Administrator
              </h2>

              <p className="text-gray-500 mt-4 leading-relaxed">
                Manage company sustainability metrics, employee activity,
                reports, and environmental impact.
              </p>

              <div className="mt-6 bg-green-600 text-white px-6 py-3 rounded-full font-semibold group-hover:bg-green-700 transition">
                Continue
              </div>
            </div>
          </button>

          {/* Employee Card */}
          <button
            onClick={() => navigate("/employeeLogin")}
            className="group bg-white rounded-3xl p-8 shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            <p>You don't have an employee account yet? <button onClick={(e) => {
              e.preventDefault();
              navigate("/registeremployee");
            }} className="text-green-600 hover:text-green-700 font-semibold">
              Create one
            </button></p>
            <div className="flex flex-col items-center text-center">
              
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition">
                <User size={45} className="text-emerald-700" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                Employee
              </h2>

              <p className="text-gray-500 mt-4 leading-relaxed">
                Access your personal dashboard, track eco-friendly habits,
                and participate in company sustainability goals.
              </p>

              <div className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold group-hover:bg-emerald-700 transition">
                Continue
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

