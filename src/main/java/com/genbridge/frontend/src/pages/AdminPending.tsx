import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface PendingContent {
  id: string;
  title: string;
  term: string;
  body: string;
  categoryName: string;
  categorySlug: string;
  status: string;
}

const rejectionReasons = [
  "Inaccurate",
  "Inappropriate",
  "Poor Quality",
  "Other",
];

export default function AdminPending() {
  const token = localStorage.getItem("token");

  const [pending, setPending] = useState<PendingContent[]>([]);
  const [selected, setSelected] = useState<PendingContent | null>(null);

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  // Load pending content
  const loadPending = () => {
    fetch("/api/content/pending", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPending(data));
  };

  useEffect(() => {
    loadPending();
  }, []);

  // Approve
  const approve = async (id: string) => {
    await fetch(`/api/content/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    setSelected(null);
    setReason("");
    setComment("");
    loadPending();
  };

  // Reject
  const reject = async (id: string) => {
    if (!reason) return;

    await fetch(`/api/content/${id}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reason,
        comment,
      }),
    });

    setSelected(null);
    setReason("");
    setComment("");
    loadPending();
  };

  // Parse & Render structured content
  const renderParsedContent = (body: string) => {
    let parsed;

    try {
      parsed = JSON.parse(body);
    } catch {
      return <p className="text-sm">{body}</p>;
    }

    return (
      <div className="space-y-6">
        {parsed.description && (
          <p className="text-muted-foreground">{parsed.description}</p>
        )}

        {(parsed.duration || parsed.difficulty) && (
          <div className="flex gap-4 text-sm">
            {parsed.duration && <Badge>{parsed.duration}</Badge>}
            {parsed.difficulty && (
              <Badge variant="secondary">{parsed.difficulty}</Badge>
            )}
          </div>
        )}

        {parsed.sections?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Sections</h3>
            {parsed.sections.map((sec: any, i: number) => (
              <div key={i} className="mb-4">
                <h4 className="font-medium">{sec.heading}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>
        )}

        {parsed.keyTerms?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Key Terms</h3>
            {parsed.keyTerms.map((kt: any, i: number) => (
              <div key={i} className="text-sm mb-2">
                <strong>{kt.term}:</strong> {kt.definition}
              </div>
            ))}
          </div>
        )}

        {parsed.examples?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Examples</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {parsed.examples.map((ex: string, i: number) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 px-6 pb-16 container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Pending Content</h1>

        {pending.length === 0 && (
          <p className="text-muted-foreground">No pending submissions 🎉</p>
        )}

        {/* Pending List */}
        <div className="space-y-4">
          {pending.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-xl p-5 bg-card hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.term} • {item.categoryName}
                  </p>
                </div>

                <Button size="sm" onClick={() => setSelected(item)}>
                  Review
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Review Panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 border rounded-xl p-6 bg-card"
            >
              <h2 className="text-2xl font-semibold mb-2">{selected.title}</h2>

              <p className="text-muted-foreground mb-6">
                Term: {selected.term} • Category: {selected.categoryName}
              </p>

              {renderParsedContent(selected.body)}

              {/* Moderation Section */}
              <div className="mt-10 space-y-6">
                <h3 className="font-semibold text-lg">Moderation Decision</h3>

                {/* Rejection Reason */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Rejection Reason (required only if rejecting)
                  </label>

                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {rejectionReasons.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Admin Feedback */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Admin Feedback (optional)
                  </label>

                  <Textarea
                    placeholder="Add feedback for contributor..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 flex-wrap pt-2">
                  <Button onClick={() => approve(selected.id)}>Approve</Button>

                  <Button
                    variant="destructive"
                    disabled={!reason}
                    onClick={() => reject(selected.id)}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelected(null);
                      setReason("");
                      setComment("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
