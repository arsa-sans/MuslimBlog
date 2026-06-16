import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import axios from "axios";
import {
  Eye, Pencil, Trash2, BookOpen, AlertCircle, PlusCircle, Loader2, Calendar, User
} from "lucide-react";

export default function Home() {
  const { user, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/post");
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeletingId(postId);
    try {
      await axios.delete(`/api/post/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.response?.data?.message || "Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
        <p className="text-sm font-medium">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl">
          <AlertCircle className="h-6 w-6 shrink-0" />
          <span>{error}</span>
        </div>
        <button
          onClick={fetchPosts}
          className="text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-white tracking-tight">
            Latest Posts
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {posts.length} {posts.length === 1 ? "post" : "posts"} published
          </p>
        </div>
        {token && (
          <Link
            to="/create"
            className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-900/20 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Post</span>
          </Link>
        )}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="p-4 rounded-full bg-white/5">
            <BookOpen className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-gray-400 text-sm">No posts yet. Be the first to share your thoughts!</p>
          {token && (
            <Link
              to="/create"
              className="text-violet-400 hover:text-violet-300 text-sm font-medium underline underline-offset-4"
            >
              Create first post
            </Link>
          )}
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const isOwner = user && post.user_id === user.id;
          return (
            <div
              key={post.id}
              className="glass-panel rounded-2xl p-6 flex flex-col space-y-4 group hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-900/10"
            >
              {/* Post Title */}
              <h2 className="text-lg font-bold font-display text-white line-clamp-2 group-hover:text-violet-300 transition-colors duration-200">
                {post.title}
              </h2>

              {/* Post Body Preview */}
              <p className="text-gray-400 text-sm line-clamp-3 flex-grow">
                {post.body}
              </p>

              {/* Meta Info */}
              <div className="flex items-center space-x-4 text-xs text-gray-500 pt-2 border-t border-white/5">
                <span className="flex items-center space-x-1">
                  <User className="h-3.5 w-3.5 text-violet-500/60" />
                  <span className="truncate max-w-[100px]">
                    {post.user?.name || "Unknown"}
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3.5 w-3.5 text-violet-500/60" />
                  <span>{formatDate(post.created_at)}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-1">
                <Link
                  to={`/posts/${post.id}`}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-2 px-3 rounded-lg text-xs font-medium transition-all duration-150"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View</span>
                </Link>

                {isOwner && (
                  <>
                    <button
                      onClick={() => navigate(`/posts/update/${post.id}`)}
                      className="flex-1 flex items-center justify-center space-x-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-150"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="flex-1 flex items-center justify-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-50"
                    >
                      {deletingId === post.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
