import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

const Register = () => {
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    agreed: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const usernamePattern = /^[a-zA-Z0-9]+$/;

    if (!formData.name.trim()) {
      tempErrors.name = "Name field cannot be empty";
    }
    if (!formData.username.trim()) {
      tempErrors.username = "Username field cannot be empty";
    } else if (!usernamePattern.test(formData.username)) {
      tempErrors.username = "Username must be alphanumeric with no spaces";
    }
    if (!emailPattern.test(formData.email)) {
      tempErrors.email = "Please enter a valid email format";
    }
    if (!phonePattern.test(formData.mobile)) {
      tempErrors.mobile = "Mobile field must encompass exactly 10 digits";
    }
    if (!formData.agreed) {
      tempErrors.agreed = "You must agree to share your registration data";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      setUser({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile
      });
      navigate("/categories");
    }
  };

  return (
    <div className="flex min-h-screen bg-black font-sans text-slate-200">
      {/* Side Art Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-500 to-teal-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-black rounded-sm flex items-center justify-center font-black text-emerald-500 text-2xl">S</div>
            <h1 className="text-3xl font-light tracking-widest text-white">SUPER<span className="font-bold">APP</span></h1>
          </div>
          <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Discover new things on<br/>Super App</h2>
          <p className="text-xl text-slate-300">Your single dashboard for entertainment, productivity, and live updates.</p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black">
        <div className="w-full max-w-md space-y-8 bg-zinc-900 border border-white/5 p-8 rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-light tracking-widest text-white mb-2">CREATE <span className="font-bold">ACCOUNT</span></h2>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Super App Dashboard</p>
          </div>

          <form onSubmit={handleFormSubmission} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                className={`w-full p-4 rounded bg-black border ${errors.name ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600 text-sm`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="Username"
                className={`w-full p-4 rounded bg-black border ${errors.username ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600 text-sm`}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                className={`w-full p-4 rounded bg-black border ${errors.email ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600 text-sm`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="Mobile Number"
                className={`w-full p-4 rounded bg-black border ${errors.mobile ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600 text-sm`}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1 ml-1">{errors.mobile}</p>}
            </div>

            <div className="pt-2 flex items-start gap-3">
              <div className="flex items-center h-5">
                <input
                  id="agreed"
                  type="checkbox"
                  className="w-4 h-4 rounded bg-black border-white/10 accent-emerald-500"
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                />
              </div>
              <label htmlFor="agreed" className="text-xs text-slate-400 mt-0.5">
                Share my registration data with Super App
              </label>
            </div>
            {errors.agreed && <p className="text-red-500 text-xs ml-7">{errors.agreed}</p>}

            <button
              type="submit"
              className="w-full py-4 mt-6 bg-emerald-500 text-black text-xs uppercase font-bold tracking-widest rounded hover:bg-emerald-400 transition-colors focus:outline-none"
            >
              Sign Up
            </button>
            
            <p className="text-[10px] text-slate-500 text-center px-4 mt-4 leading-relaxed uppercase tracking-wide">
              By clicking Sign up, you agree to Superapp <span className="text-emerald-400 cursor-pointer">Terms and Conditions</span>
              <br/>
              Please read our <span className="text-emerald-400 cursor-pointer">Privacy Policy</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
