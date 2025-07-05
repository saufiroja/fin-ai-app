"use client";
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
  const { transactions, overview, loading, error, overviewError } = useSelector(
    (state: RootState) => state.transactions,
  );

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
      setIsInitialLoading(true);

      const { startDate, endDate } = getLastWeekDateRange();

      dispatch(
        fetchOverview({
          token,
          params: {
            startDate,
            endDate,
          },
        }),
      );

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
      setIsInitialLoading(false);
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
        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {!transactions || transactions.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Belum ada transaksi
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Mulai tambahkan transaksi pertama Anda
              </p>
              <button
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                onClick={() => router.push("/transaction/add")}
              >
                + Tambah Transaksi
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {transactions.map((item, _index) => (
                <div
                  key={item.transaction_id}
                  className="group relative p-5 transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-gray-50 hover:via-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:via-gray-700 dark:hover:to-gray-800 cursor-pointer transform hover:-translate-y-0.5 hover:shadow-lg"
                  role="button"
                  onClick={() =>
                    router.push(`/transaction/view/${item.transaction_id}`)
                  }
                >
                  <div className="flex items-center space-x-4">
                    {/* Transaction Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                            {item.description}
                          </h4>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {formatTransactionDate(item.transaction_date)}
                            </span>
                            <div
                              className={`
                              inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                              transition-all duration-200 group-hover:scale-105
                              ${
                                item.type === "income"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
                              }
                            `}
                            >
                              <div
                                className={`
                                w-1.5 h-1.5 rounded-full mr-1.5
                                ${item.type === "income" ? "bg-emerald-500" : "bg-rose-500"}
                              `}
                              />
                              {item.type === "income"
                                ? "Pemasukan"
                                : "Pengeluaran"}
                            </div>
                          </div>
                        </div>

                        {/* Amount with Modern Styling */}
                        <div className="text-right ml-4">
                          <div
                            className={`
                            font-bold text-xl transition-all duration-200 group-hover:scale-105
                            ${
                              item.type === "income"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }
                          `}
                          >
                            {item.type === "income" ? "+" : "-"}Rp{" "}
                            {item.amount.toLocaleString("id-ID")}
                          </div>

                          {/* Modern hover indicator */}
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                            <div className="inline-flex items-center text-xs text-blue-500 dark:text-blue-400 font-medium mt-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                              <span>Lihat detail</span>
                              <svg
                                className="w-3 h-3 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M9 5l7 7-7 7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modern accent border */}
                  <div
                    className={`
                    absolute left-0 top-0 bottom-0 w-1 transition-all duration-300
                    ${
                      item.type === "income"
                        ? "bg-gradient-to-b from-emerald-400 to-green-500"
                        : "bg-gradient-to-b from-rose-400 to-red-500"
                    }
                    opacity-0 group-hover:opacity-100 transform scale-y-0 group-hover:scale-y-100
                  `}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
