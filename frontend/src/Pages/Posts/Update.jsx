import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../AppContext";
import axios from "axios";
import { Save, FileText, AlignLeft, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function Update() {
  const { id } = useParams();
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", body: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Load the existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/post/${id}`);
        setFormData({ title: res.data.title, body: res.data.body });
      } catch (err) {
        console.error("Error fetching post for edit:", err);
        if (err.response?.status === 404) {
          setFetchError("Post not found.");
        } else {
          setFetchError("Failed to load post data.");
        }
      } finally {
        setFetching(false);
      }
    };

    if (!token) {
      navigate("/login");
      return;
    }
    fetchPost();
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await axios.put(`/api/post/${id}`, formData);
      navigate(`/posts/${id}`);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
        } else if (error.response.status === 403) {
          alert("You are not authorized to edit this post.");
          navigate("/");
        } else if (error.response.status === 401) {
          navigate("/login");
        } else {
          console.error("Error updating post:", error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
        <p className="text-sm font-medium">Loading post data...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
          <AlertCircle className="h-6 w-6 shrink-0" />
          <span>{fetchError}</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4"
        >
          Go back
        </button>
      </div>
    );
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
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">Edit Post</h1>
          <p className="text-sm text-gray-400 mt-0.5">Update your post content below</p>
        </div>
      </div>

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
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
