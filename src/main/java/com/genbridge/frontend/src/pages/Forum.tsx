import { useState, useEffect } from "react";
import { Trash2, MessageCircle, Plus, ChevronRight } from "lucide-react";
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
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface ForumPost {
  id: number;
  userName: string;
  title: string;
  body: string;
  createdAt: string;
}

const Forum = () => {
  const { toast } = useToast();
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const deletePost = async (postId: number) => {
    try {
      await api.delete(`/forum/posts/${postId}`);
      toast({ title: "Post deleted successfully" });
      fetchPosts();
    } catch {
      toast({ title: "Failed to delete post", variant: "destructive" });
    }
  };
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/forum/posts");
      setPosts(res.data);
    } catch {
      toast({ title: "Failed to load posts", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast({ title: "Title and body are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await api.post("/forum/posts", form);
      toast({ title: "Post created!" });
      setModalOpen(false);
      setForm({ title: "", body: "" });
      fetchPosts();
    } catch {
      toast({ title: "Failed to create post", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activePage="forum" />

      <div className="flex-1 ml-72 pt-12 pb-16 px-8">
        <div className="max-w-3xl mx-auto">

          <div className="flex items-center justify-between mb-6">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl font-bold text-foreground"
            >
              Forum
            </motion.h1>
            <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Post
            </Button>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading posts...</p>
          ) : posts.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No posts yet. Be the first to start a conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={`/forum/${post.id}`}
                    className="flex items-center gap-4 bg-card rounded-2xl border border-border px-6 py-4 hover:border-primary/30 transition-colors group"
                  >
                    <MessageCircle className="w-5 h-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-card-foreground text-sm group-hover:text-primary transition-colors truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        by {post.userName} · {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {isAdmin && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-auto shrink-0 hover:bg-destructive/20 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the post and all its comments. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="flex gap-2">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deletePost(post.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="What's on your mind?"
              rows={5}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Forum;
