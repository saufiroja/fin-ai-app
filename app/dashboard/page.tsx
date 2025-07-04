"use client";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TrendingDown, TrendingUp } from "lucide-react";

import Loading from "./loading";

import StatisticsCard from "@/components/StatisticsCard";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { fetchTransactions, fetchOverview } from "@/lib/redux/transactionSlice";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Redux state
  const { token } = useSelector((state: RootState) => state.auth);
  const {
    transactions,
    overview,
    loading,
    overviewLoading,
    error,
    overviewError,
  } = useSelector((state: RootState) => state.transactions);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Helper function to get date range for last week
  const getLastWeekDateRange = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now);

    oneWeekAgo.setDate(now.getDate() - 7);

    // Format dates for API (YYYY-MM-DD format)
    const startDate = `${oneWeekAgo.getFullYear()}-${String(oneWeekAgo.getMonth() + 1).padStart(2, "0")}-${String(oneWeekAgo.getDate()).padStart(2, "0")}`;
    const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    return { startDate, endDate };
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) return;

      try {
        setIsInitialLoading(true);

        const { startDate, endDate } = getLastWeekDateRange();

        console.log("Fetching data for:", { startDate, endDate });

        // Fetch overview data for last week
        dispatch(
          fetchOverview({
            token,
            params: {
              startDate,
              endDate,
            },
          }),
        );

        // Fetch recent transactions for last week (limit to 10 most recent)
        dispatch(
          fetchTransactions({
            token,
            params: {
              limit: 10,
              offset: 1,
              startDate,
              endDate,
            },
          }),
        );
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadDashboardData();
  }, [token, dispatch]);

  // Helper function to parse currency string to number for balance calculation
  const parseCurrency = (currencyStr: string): number => {
    if (!currencyStr) return 0;

    // Remove "Rp " and any spaces, then parse as number
    return parseInt(currencyStr.replace(/[^\d]/g, "")) || 0;
  };

  // Calculate balance from API data
  const totalIncome = overview ? parseCurrency(overview.total_income) : 0;
  const totalExpense = overview ? parseCurrency(overview.total_expense) : 0;
  const balance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format transaction date for display
  const formatTransactionDate = (dateStr: string) => {
    const today = new Date();
    const itemDate = new Date(dateStr);
    const diffTime = today.getTime() - itemDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays > 1) return `${diffDays} hari yang lalu`;

    return itemDate.toLocaleDateString("id-ID");
  };

  // Show loading skeleton while initial data is being fetched
  if (isInitialLoading || (loading && transactions.length === 0)) {
    return <Loading />;
  }

  return (
    <div className="space-y-2">
      {/* Error Messages */}
      {error && (
        <div className="p-4 bg-orange-100 border border-orange-400 text-orange-700 rounded">
          ⚠️ Using mock transaction data (API: {error})
        </div>
      )}
      {overviewError && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          ⚠️ Using mock overview data (API: {overviewError})
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatisticsCard
          icon={<TrendingDown className="w-6 h-6 text-red-600" />}
          iconBg="bg-red-100 dark:bg-red-900"
          label="Total Pengeluaran (7 hari)"
          value={overview?.total_expense || "Rp 0"}
          valueColor="text-red-500"
        />
        <StatisticsCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-100 dark:bg-green-900"
          label="Total Pemasukan (7 hari)"
          value={overview?.total_income || "Rp 0"}
          valueColor="text-green-500"
        />
        <StatisticsCard
          icon={<div className="w-6 h-6 rounded-full bg-blue-600" />}
          iconBg="bg-blue-100 dark:bg-blue-900"
          label="Sisa Budget (7 hari)"
          value={formatCurrency(balance)}
          valueColor={balance >= 0 ? "text-blue-500" : "text-orange-500"}
        />
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Recent Transactions (7 hari terakhir)
          </h2>
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
                    key={item.transaction_id}
                    className="py-2 flex justify-between items-center"
                  >
                    <div>
                      <span>{item.description}</span>
                      <div className="text-xs text-gray-400">
                        {formatTransactionDate(item.transaction_date)}
                      </div>
                    </div>
                    <span
                      className={
                        item.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {item.type === "income" ? "+" : "-"}Rp{" "}
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
