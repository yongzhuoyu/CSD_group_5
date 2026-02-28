import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, FileText, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ContentItem {
  id: string;
  title: string;
  term: string;
  body: string;
  categoryName: string;
  categorySlug: string;
  categoryDescription: string;
  status: string;
  rejectionReason?: string;
  rejectionComment?: string;
}

const statusColorMap: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING: "bg-primary/15 text-primary",
  APPROVED: "bg-lime/15 text-lime",
  REJECTED: "bg-coral/15 text-coral",
};

const statusIconMap: Record<string, any> = {
  DRAFT: FileText,
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
};

const MyContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/content/my-submissions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setContent);
  }, []);

  const deleteDraft = async (id: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;

    await fetch(`/api/content/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setContent((prev) => prev.filter((c) => c.id !== id));
  };

  const grouped = {
    DRAFT: content.filter((c) => c.status === "DRAFT"),
    PENDING: content.filter((c) => c.status === "PENDING"),
    APPROVED: content.filter((c) => c.status === "APPROVED"),
    REJECTED: content.filter((c) => c.status === "REJECTED"),
  };

  const renderSection = (title: string, items: ContentItem[]) => (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {items.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No items in this section.
        </p>
      )}

      <div className="space-y-4">
        {items.map((item) => {
          const Icon = statusIconMap[item.status];
          const parsed = item.body ? JSON.parse(item.body) : null;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-xl p-5 bg-card hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3
                    className={`font-semibold ${
                      item.status === "APPROVED" ?
                        "cursor-pointer hover:underline"
                      : ""
                    }`}
                    onClick={() => {
                      if (item.status === "APPROVED") {
                        navigate(`/lesson/${item.id}`);
                      }
                    }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">{item.term}</p>
                </div>

                <Badge className={statusColorMap[item.status]}>
                  <Icon className="w-3 h-3 mr-1 inline" />
                  {item.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                Category: {item.categoryName}
              </p>

              {parsed?.description && (
                <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                  {parsed.description}
                </p>
              )}

              {/* 🔴 REJECTION FEEDBACK */}
              {item.status === "REJECTED" && (
                <div className="bg-coral/10 border border-coral/20 rounded-lg p-4 mb-4 space-y-2">
                  <p className="text-coral font-medium">
                    This content was rejected.
                  </p>

                  {item.rejectionReason && (
                    <p className="text-sm">
                      <span className="font-semibold">Reason:</span>{" "}
                      {item.rejectionReason}
                    </p>
                  )}

                  {item.rejectionComment && (
                    <p className="text-sm">
                      <span className="font-semibold">Admin Feedback:</span>{" "}
                      {item.rejectionComment}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-2">
                {item.status === "DRAFT" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/edit/${item.id}`)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteDraft(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}

                {item.status === "REJECTED" && (
                  <Button
                    size="sm"
                    onClick={() => navigate(`/edit/${item.id}`)}
                  >
                    Edit & Resubmit
                  </Button>
                )}

                {item.status === "PENDING" && (
                  <span className="text-sm text-muted-foreground">
                    Waiting for admin approval.
                  </span>
                )}

                {item.status === "APPROVED" && (
                  <Button
                    size="sm"
                    onClick={() => navigate(`/lesson/${item.id}`)}
                  >
                    View Lesson
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">My Content</h1>

          {renderSection("Drafts", grouped.DRAFT)}
          {renderSection("Pending Approval", grouped.PENDING)}
          {renderSection("Approved", grouped.APPROVED)}
          {renderSection("Rejected", grouped.REJECTED)}
        </div>
      </div>
    </div>
  );
};

export default MyContent;
