import { useState, useEffect } from "react";
import { Trash2, ArrowLeft, MessageCircle, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppSidebar from "@/components/AppSidebar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface Comment {
  id: number;
  userName: string;
  body: string;
  createdAt: string;
}

interface Post {
  id: number;
  userName: string;
  title: string;
  body: string;
  createdAt: string;
  comments: Comment[];
}

const ForumPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const deletePost = async () => {
    if (!id) return;
    try {
      await api.delete(`/forum/posts/${id}`);
      toast({ title: "Post deleted successfully" });
      navigate("/forum");
    } catch {
      toast({ title: "Failed to delete post", variant: "destructive" });
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await api.delete(`/forum/comments/${commentId}`);
      toast({ title: "Comment deleted successfully" });
      fetchPost();
    } catch {
      toast({ title: "Failed to delete comment", variant: "destructive" });
    }
  };
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/forum/posts/${id}`);
      setPost(res.data);
    } catch {
      toast({ title: "Post not found", variant: "destructive" });
      navigate("/forum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPost(); }, [id]);

  const handleComment = async () => {
    if (!commentBody.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/forum/posts/${id}/comments`, { body: commentBody });
      setCommentBody("");
      fetchPost();
    } catch {
      toast({ title: "Failed to post comment", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar activePage="forum" />
        <div className="flex-1 ml-72 pt-12 px-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activePage="forum" />

      <div className="flex-1 ml-72 pt-12 pb-16 px-8">
        <div className="max-w-3xl mx-auto">

          <button
            onClick={() => navigate("/forum")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Forum
          </button>

          {/* Post */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-6 mb-6"
          >
            <h1 className="font-display text-2xl font-bold text-card-foreground mb-2">{post.title}</h1>
            <p className="text-xs text-muted-foreground mb-4">
              by {post.userName} · {new Date(post.createdAt).toLocaleDateString()}
            </p>
            {isAdmin && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 absolute top-4 right-4 hover:bg-destructive/20 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the entire post and all its comments. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={deletePost}
                    >
                      Delete Post
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">{post.body}</p>
          </motion.div>

          {/* Comments */}
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
          </h2>

          <div className="space-y-3 mb-6">
            {post.comments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No comments yet. Be the first!</p>
            ) : (
              post.comments.map((comment, i) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-card rounded-xl border border-border px-5 py-4"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {comment.userName} · {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">{comment.body}</p>
                  {isAdmin && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs ml-auto shrink-0 hover:bg-destructive/20 p-0"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this comment. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex gap-2">
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteComment(comment.id)}
                          >
                            Delete Comment
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Add Comment */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <p className="text-sm font-semibold text-card-foreground mb-3">Add a comment</p>
            <Textarea
              placeholder="Write your comment..."
              rows={3}
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              className="mb-3"
            />
            <div className="flex justify-end">
              <Button onClick={handleComment} disabled={submitting || !commentBody.trim()} className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForumPostDetail;
