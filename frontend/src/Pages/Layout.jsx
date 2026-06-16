import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import axios from "axios";
import { BookOpen, PlusCircle, LogOut, LogIn, UserPlus, User } from "lucide-react";

export default function Layout() {
  const { token, setToken, user } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Always clear tokens locally even if API request fails
      setToken(null);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 text-xl font-bold font-display tracking-tight text-white group">
                <BookOpen className="h-6 w-6 text-violet-500 group-hover:scale-110 transition-transform duration-200" />
                <span>
                  Muslim<span className="text-violet-500">Blog</span>
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                Home
              </Link>

              {token ? (
                <>
                  <Link
                    to="/create"
                    className="flex items-center space-x-1 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md shadow-violet-900/20 active:scale-95"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Create Post</span>
                  </Link>

                  <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                    <span className="flex items-center space-x-1.5 text-sm font-medium text-gray-300">
                      <User className="h-4 w-4 text-violet-400" />
                      <span className="max-w-[120px] truncate">{user ? user.name : "User"}</span>
                    </span>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-gray-400 hover:text-red-400 px-2 py-1 rounded text-sm font-medium transition-colors duration-150 active:scale-95"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2 pl-4 border-l border-white/10">
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                  >
                    <LogIn className="h-4 w-4 text-gray-400" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95"
                  >
                    <UserPlus className="h-4 w-4 text-violet-400" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 bg-black/20 text-center text-sm text-gray-500 font-sans">
        <p>&copy; {new Date().getFullYear()} MuslimBlog. All rights reserved.</p>
      </footer>
    </div>
  );
}
