import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const CreateContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [term, setTerm] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [duration, setDuration] = useState("5 min");

  const [sections, setSections] = useState([{ heading: "", body: "" }]);
  const [keyTerms, setKeyTerms] = useState([{ term: "", definition: "" }]);
  const [examples, setExamples] = useState<string[]>([""]);

  // =========================
  // LOAD CATEGORIES
  // =========================
  useEffect(() => {
    fetch("/api/content/approved")
      .then((res) => res.json())
      .then((data) => {
        const uniqueCategories = Array.from(
          new Map(
            data.map((item: any) => [
              item.categorySlug,
              {
                slug: item.categorySlug,
                name: item.categoryName,
              },
            ]),
          ).values(),
        );
        setCategories(uniqueCategories);
      });
  }, []);

  // =========================
  // LOAD EXISTING CONTENT (EDIT MODE)
  // =========================
  useEffect(() => {
    if (!isEdit) return;

    fetch("/api/content/my-submissions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const existing = data.find((c: any) => c.id === id);
        if (!existing) return;

        const parsed = JSON.parse(existing.body);

        setTitle(existing.title);
        setTerm(existing.term);
        setCategorySlug(existing.categorySlug);
        setDescription(parsed.description || "");
        setDuration(parsed.duration || "5 min");
        setDifficulty(parsed.difficulty || "Beginner");

        setSections(
          parsed.sections?.length ?
            parsed.sections
          : [{ heading: "", body: "" }],
        );

        setKeyTerms(
          parsed.keyTerms?.length ?
            parsed.keyTerms
          : [{ term: "", definition: "" }],
        );

        setExamples(parsed.examples?.length ? parsed.examples : [""]);
      });
  }, [id]);

  // =========================
  // BUILD BODY JSON
  // =========================
  const buildBodyJSON = () => {
    return JSON.stringify({
      description,
      duration,
      difficulty,
      sections,
      keyTerms,
      examples,
    });
  };

  // =========================
  // SUBMIT HANDLER
  // =========================
  const submitContent = async (type: "draft" | "submit") => {
    let endpoint = "";
    let method = "POST";

    if (isEdit) {
      endpoint = `/api/content/${id}`;
      method = "PUT";
    } else {
      endpoint = `/api/content/${type}`;
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        term,
        categorySlug,
        body: buildBodyJSON(),
        submit: type === "submit", // 🔥 critical
      }),
    });

    if (response.ok) {
      alert(
        isEdit ?
          type === "submit" ?
            "Submitted for review!"
          : "Changes saved!"
        : type === "draft" ? "Saved as draft!"
        : "Submitted for review!",
      );

      navigate("/my-content");
    } else {
      alert("Something went wrong.");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold mb-6">
              {isEdit ? "Edit Content" : "Create Content"}
            </h1>

            {/* TITLE */}
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4"
            />

            {/* TERM */}
            <Input
              placeholder="Term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="mb-4"
            />

            {/* CATEGORY */}
            <div className="mb-4">
              <Select value={categorySlug} onValueChange={setCategorySlug}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* DESCRIPTION */}
            <Textarea
              placeholder="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-4"
            />

            {/* DURATION + DIFFICULTY */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Duration (e.g. 5 min)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />

              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SECTIONS */}
            <h2 className="font-semibold mt-6 mb-2">Sections</h2>
            {sections.map((sec, i) => (
              <div key={i} className="mb-3">
                <Input
                  placeholder="Heading"
                  value={sec.heading}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[i].heading = e.target.value;
                    setSections(updated);
                  }}
                  className="mb-2"
                />
                <Textarea
                  placeholder="Body"
                  value={sec.body}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[i].body = e.target.value;
                    setSections(updated);
                  }}
                />
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() =>
                setSections([...sections, { heading: "", body: "" }])
              }
              className="mb-6"
            >
              Add Section
            </Button>

            {/* KEY TERMS */}
            <h2 className="font-semibold mb-2">Key Terms</h2>
            {keyTerms.map((kt, i) => (
              <div key={i} className="mb-3">
                <Input
                  placeholder="Term"
                  value={kt.term}
                  onChange={(e) => {
                    const updated = [...keyTerms];
                    updated[i].term = e.target.value;
                    setKeyTerms(updated);
                  }}
                  className="mb-2"
                />
                <Input
                  placeholder="Definition"
                  value={kt.definition}
                  onChange={(e) => {
                    const updated = [...keyTerms];
                    updated[i].definition = e.target.value;
                    setKeyTerms(updated);
                  }}
                />
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() =>
                setKeyTerms([...keyTerms, { term: "", definition: "" }])
              }
              className="mb-6"
            >
              Add Key Term
            </Button>

            {/* EXAMPLES */}
            <h2 className="font-semibold mb-2">Examples</h2>
            {examples.map((ex, i) => (
              <Textarea
                key={i}
                placeholder="Example"
                value={ex}
                onChange={(e) => {
                  const updated = [...examples];
                  updated[i] = e.target.value;
                  setExamples(updated);
                }}
                className="mb-3"
              />
            ))}

            <Button
              variant="outline"
              onClick={() => setExamples([...examples, ""])}
              className="mb-6"
            >
              Add Example
            </Button>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => submitContent("draft")}
              >
                {isEdit ? "Save Changes" : "Save Draft"}
              </Button>

              <Button onClick={() => submitContent("submit")}>
                Submit for Review
              </Button>

              {isEdit && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/my-content")}
                >
                  Discard Changes
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;
