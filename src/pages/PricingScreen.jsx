import {
  Check,
  Leaf,
  Menu,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import SelectProfile from "./SelectProfile";

export default function PricingScreen() {

  const navigate = useNavigate();

  const plans = [
    {
      title: "Basic",
      price: "Free",
      popular: false,
      path: "/basic-plan",
    },
    {
      title: "Green Monthly",
      price: "$4.99/month",
      popular: true,
      path: "/green-monthly",
    },
    {
      title: "Eco Annual",
      price: "$49/year",
      popular: false,
      path: "/eco-annual",
    },
  ];

  const features = [
    "Detailed carbon footprint",
    "Unlimited waste classifier",
    "Daily eco challenges",
    "Monthly sustainability reports",
    "Community access",
    "Personalized eco tips",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecfff1] via-[#dfffe7] to-[#c8ffd8] overflow-hidden relative">

      {/* Background Blur */}
      <div className="absolute top-[-100px] left-[-80px] w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-30"></div>

      <div className="absolute bottom-[-100px] right-[-80px] w-72 h-72 bg-lime-300 rounded-full blur-3xl opacity-30"></div>

      {/* Main Container */}
      <div className="relative z-10 px-5 py-8 md:px-10">

        {/* Navbar */}
        <div className="flex items-center justify-between mb-12">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Leaf className="text-green-700" size={34} />

            <h1 className="text-3xl font-black text-green-950">
              Greenly
            </h1>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-5xl md:text-6xl font-black text-green-950 leading-tight">
            Join the
            <br />
            Greenly Movement
          </h2>

          <p className="text-green-800 mt-5 text-lg max-w-xl mx-auto">
            Choose the perfect plan to reduce your environmental impact and create a greener future.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8">

          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative w-full max-w-sm rounded-[35px] p-8 transition-all duration-300 hover:scale-105 shadow-2xl
              ${
                plan.popular
                  ? "bg-gradient-to-br from-green-700 to-emerald-900 lg:scale-110 border-4 border-lime-300"
                  : "bg-gradient-to-br from-green-600 to-emerald-800"
              }`}
            >

              {/* Recommended Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-lime-300 text-green-950 font-bold px-6 py-2 rounded-full shadow-lg">
                  Recommended
                </div>
              )}

              {/* Title */}
              <div className="text-center mb-8">
                <h3 className="text-4xl font-black text-white">
                  {plan.title}
                </h3>

                <p className="text-green-100 text-xl mt-3">
                  {plan.price}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-5">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4"
                  >
                    <div className="min-w-[32px] min-h-[32px] bg-lime-300 rounded-full flex items-center justify-center mt-1">
                      <Check
                        size={18}
                        className="text-green-950"
                      />
                    </div>

                    <p className="text-white text-lg leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={() => navigate("/selectprofile")}
                className={`w-full mt-10 py-4 rounded-2xl text-xl font-bold transition-all duration-300
                ${
                  plan.popular
                    ? "bg-lime-300 hover:bg-lime-200 text-green-950"
                    : "bg-white hover:bg-green-50 text-green-900"
                }`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}