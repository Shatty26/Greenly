import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

export default function EmployeeLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!");

      navigate("/employee-dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-emerald-500 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <User size={45} className="text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white">
            Employee Login
          </h1>

          <p className="text-green-100 mt-3">
            Access your sustainability dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Email
            </label>

            <div className="flex items-center bg-white rounded-xl px-4">
              <Mail className="text-green-700" size={20} />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-4 outline-none rounded-xl text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Password
            </label>

            <div className="flex items-center bg-white rounded-xl px-4">
              <Lock className="text-green-700" size={20} />

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-4 outline-none rounded-xl text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white py-4 rounded-xl font-semibold shadow-lg"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-green-100 text-sm">
            Greenly Employee Access
          </p>
        </div>
      </div>
    </div>
  );
}