"use client";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import Loading from "./loading";

import { dummyResponseHistory, dummyResponseHistory2 } from "@/dummy/history";
import StatisticsCard from "@/components/StatisticsCard";

const summaryCards = [
  {
    label: "Total Pengeluaran",
    value: "Rp 95.000",
    color: "text-red-500",
  },
  {
    label: "Total Pemasukan",
    value: "Rp 3.000.000",
    color: "text-green-500",
  },
  {
    label: "Sisa Budget",
    value: "Rp 2.905.000",
    color: "text-blue-500",
  },
];

interface Transaction {
  id: number;
  type: string;
  desc: string;
  category: string;
  amount: number;
  date: string;
}

function getRecentTransactions() {
  const all = [...dummyResponseHistory.data, ...dummyResponseHistory2.data];
  const now = new Date();
  const oneWeekAgo = new Date(now);

  oneWeekAgo.setDate(now.getDate() - 7);
  // Filter 1 minggu terakhir
  const filtered = all.filter((item) => {
    const itemDate = new Date(item.date);

    return itemDate >= oneWeekAgo && itemDate <= now;
  });

  // Sort terbaru
  filtered.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return dateB - dateA;
  });

  // Ambil 10 terbaru
  return filtered.slice(0, 10);
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Load transaction data
        const recentTransactions = getRecentTransactions();

        setTransactions(recentTransactions);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Show loading skeleton
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatisticsCard
          icon={<TrendingDown className="w-6 h-6 text-red-600" />}
          iconBg="bg-red-100 dark:bg-red-900"
          label="Total Pengeluaran"
          value={summaryCards[0].value}
          valueColor="text-red-500"
        />
        <StatisticsCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-100 dark:bg-green-900"
          label="Total Pemasukan"
          value={summaryCards[1].value}
          valueColor="text-green-500"
        />
        <StatisticsCard
          icon={<div className="w-6 h-6 rounded-full bg-blue-600" />}
          iconBg="bg-blue-100 dark:bg-blue-900"
          label="Sisa Budget"
          value={summaryCards[2].value}
          valueColor="text-blue-500"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <button
            className="text-sm text-blue-600 hover:underline font-medium px-2 py-1 rounded transition-colors"
            onClick={() => router.push("/transaction")}
          >
            See all transaction
          </button>
        </div>
        <Card>
          <CardBody>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-sm">
                  No transactions in the last 7 days
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {transactions.map((item) => (
                  <li
                    key={item.id}
                    className="py-2 flex justify-between items-center"
                  >
                    <div>
                      <span>{item.desc}</span>
                      <div className="text-xs text-gray-400">
                        {(() => {
                          const today = new Date();
                          const itemDate = new Date(item.date);
                          const diffTime = today.getTime() - itemDate.getTime();
                          const diffDays = Math.floor(
                            diffTime / (1000 * 60 * 60 * 24),
                          );

                          if (diffDays === 0) return "Hari ini";
                          if (diffDays === 1) return "Kemarin";
                          if (diffDays > 1) return `${diffDays} hari yang lalu`;

                          return item.date;
                        })()}
                      </div>
                    </div>
                    <span
                      className={
                        item.type === "Pemasukan"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {item.type === "Pemasukan" ? "+" : "-"}Rp{" "}
                      {item.amount.toLocaleString("id-ID")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
