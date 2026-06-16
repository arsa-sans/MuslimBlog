import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import axios from "axios";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/login", formData);
      setToken(response.data.token);
      navigate("/");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
        } else if (error.response.status === 401) {
          setGeneralError(error.response.data.message || "Invalid credentials");
        } else {
          setGeneralError("An error occurred during login. Please try again.");
        }
      } else {
        console.error("Login error:", error);
        setGeneralError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-violet-500/10 text-violet-500 mb-3">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white">Sign In to your account</h2>
          <p className="text-sm text-gray-400 mt-1">Welcome back to MuslimBlog</p>
        </div>

        {generalError && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-sm mb-5">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white"
                placeholder="your.email@example.com"
              />
            </div>
            {errors.email && (
              <span className="flex items-center text-xs text-red-400 mt-1">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                {errors.email[0]}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <span className="flex items-center text-xs text-red-400 mt-1">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                {errors.password[0]}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
