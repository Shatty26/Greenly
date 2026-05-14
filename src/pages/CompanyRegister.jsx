import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Lock,
  User,
} from "lucide-react";

export default function CompanyRegister() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // SAVE DATA IN FIRESTORE
      await setDoc(doc(db, "employes", user.uid), {
        companyName,
        adminName,
        email,
        role: "business_admin",
        createdAt: new Date(),
      });

      alert("Company registered successfully!");

      navigate("/business-dashboard");

    } catch (error) {
      console.error(error);
      alert("Error creating account.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-emerald-500 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <Building2 size={45} className="text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white">
            Company Register
          </h1>

          <p className="text-green-100 mt-3">
            Create your Greenly business account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          {/* Company Name */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Company Name
            </label>

            <div className="flex items-center bg-white rounded-xl px-4">
              <Building2
                className="text-green-700"
                size={20}
              />

              <input
                type="text"
                placeholder="Enter company name"
                className="w-full p-4 outline-none rounded-xl text-gray-700"
                value={companyName}
                onChange={(e) =>
                  setCompanyName(e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Admin Name */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Administrator Name
            </label>

            <div className="flex items-center bg-white rounded-xl px-4">
              <User
                className="text-green-700"
                size={20}
              />

              <input
                type="text"
                placeholder="Enter administrator name"
                className="w-full p-4 outline-none rounded-xl text-gray-700"
                value={adminName}
                onChange={(e) =>
                  setAdminName(e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Business Email
            </label>

            <div className="flex items-center bg-white rounded-xl px-4">
              <Mail
                className="text-green-700"
                size={20}
              />

              <input
                type="email"
                placeholder="Enter business email"
                className="w-full p-4 outline-none rounded-xl text-gray-700"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
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
              <Lock
                className="text-green-700"
                size={20}
              />

              <input
                type="password"
                placeholder="Create a password"
                className="w-full p-4 outline-none rounded-xl text-gray-700"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-white py-4 rounded-xl font-semibold shadow-lg"
          >
            Create Company Account
          </button>
        </form>
      </div>
    </div>
  );
}