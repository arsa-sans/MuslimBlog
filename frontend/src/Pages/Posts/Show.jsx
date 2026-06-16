import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AppContext } from "../../AppContext";
import axios from "axios";
import {
  ArrowLeft, Calendar, User, Pencil, Trash2, Loader2, AlertCircle
} from "lucide-react";

export default function Show() {
  const { id } = useParams();
  const { user, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/post/${id}`);
        setPost(res.data);
      } catch (err) {
        setError("Post not found or could not be loaded.");
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/post/${id}`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.response?.data?.message || "Failed to delete post.");
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
        <p className="text-sm font-medium">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
          <AlertCircle className="h-6 w-6 shrink-0" />
          <span>{error || "Post not found."}</span>
        </div>
        <Link to="/" className="text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4">
          Back to Home
        </Link>
      </div>
    );
  }

  const isOwner = user && post.user_id === user.id;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-150 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
        <span className="text-sm font-medium">Back to posts</span>
      </button>

      {/* Post Card */}
      <article className="glass-panel rounded-2xl overflow-hidden">
        {/* Gradient Header Banner */}
        <div className="h-2 bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500" />

        <div className="p-8 md:p-10 space-y-6">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-6 border-b border-white/5">
            <span className="flex items-center space-x-2">
              <div className="p-1 rounded-full bg-violet-500/10">
                <User className="h-3.5 w-3.5 text-violet-400" />
              </div>
              <span className="font-medium text-gray-300">{post.user?.name || "Unknown Author"}</span>
            </span>
            <span className="flex items-center space-x-2">
              <div className="p-1 rounded-full bg-violet-500/10">
                <Calendar className="h-3.5 w-3.5 text-violet-400" />
              </div>
              <span>{formatDate(post.created_at)}</span>
            </span>
          </div>

          {/* Body Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
              {post.body}
            </p>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex items-center space-x-3 pt-6 border-t border-white/5">
              <button
                onClick={() => navigate(`/posts/update/${post.id}`)}
                className="flex items-center space-x-2 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 hover:text-violet-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit Post</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Delete Post</span>
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
