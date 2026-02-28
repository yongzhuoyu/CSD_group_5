import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Content {
  id: string;
  title: string;
  term: string;
}

export default function AdminRejected() {
  const [rejected, setRejected] = useState<Content[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/content/admin/rejected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setRejected);
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-6xl mx-auto px-6 pb-10">
        <h1 className="text-3xl font-bold mb-8">Rejected By Me</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {rejected.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <Badge variant="destructive" className="mb-3">
                    Rejected
                  </Badge>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {item.term}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
