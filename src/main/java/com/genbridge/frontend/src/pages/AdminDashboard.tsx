import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/content/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setStats);
  }, []);

  const cards = [
    { label: "Pending", value: stats?.pending ?? 0 },
    { label: "Approved", value: stats?.approved ?? 0 },
    { label: "Rejected", value: stats?.rejected ?? 0 },
  ];

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-6xl mx-auto px-6 pb-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">{card.label}</h3>
                  <p className="text-2xl mt-2">{card.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
