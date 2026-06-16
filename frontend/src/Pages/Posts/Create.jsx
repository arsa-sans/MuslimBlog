import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import axios from "axios";
import { PlusCircle, FileText, AlignLeft, AlertCircle, ArrowLeft } from "lucide-react";

export default function Create() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", body: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setLoading(true);

    try {
      await axios.post("/api/post", formData);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        setGeneralError(error.response?.data?.message || "Failed to publish post. Please try again.");
        console.error("Error creating post:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">Create New Post</h1>
          <p className="text-sm text-gray-400 mt-0.5">Share your thoughts with the community</p>
        </div>
      </div>

      {/* General Error Banner */}
      {generalError && (
        <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-6">
        {/* Title Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Post Title
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <FileText className="h-5 w-5" />
            </span>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white"
              placeholder="Enter your post title..."
            />
          </div>
          {errors.title && (
            <span className="flex items-center text-xs text-red-400 mt-1.5">
              <AlertCircle className="h-3.5 w-3.5 mr-1 shrink-0" />
              {errors.title[0]}
            </span>
          )}
        </div>

        {/* Body Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Content
          </label>
          <div className="relative">
            <span className="absolute top-3 left-0 pl-3 flex items-start text-gray-500">
              <AlignLeft className="h-5 w-5" />
            </span>
            <textarea
              required
              rows={8}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white resize-none"
              placeholder="Write your post content here..."
            />
          </div>
          {errors.body && (
            <span className="flex items-center text-xs text-red-400 mt-1.5">
              <AlertCircle className="h-3.5 w-3.5 mr-1 shrink-0" />
              {errors.body[0]}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                <span>Publish Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
