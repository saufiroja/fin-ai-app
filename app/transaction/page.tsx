"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Edit3,
  Trash2,
  Download,
  Eye,
  Calendar,
} from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { RangeCalendar } from "@heroui/calendar";
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Pagination } from "@heroui/pagination";
import NextLink from "next/link";
import { useSelector, useDispatch } from "react-redux";

import Loading from "./loading";

import StatisticsCard from "@/components/StatisticsCard";
import { categories } from "@/dummy/categories";
import { RootState, AppDispatch } from "@/lib/redux/store";
import {
  fetchTransactions,
  fetchOverview,
  deleteTransaction,
} from "@/lib/redux/transactionSlice";
import { fetchCategories } from "@/lib/redux/categorySlice";

export default function TransactionPage() {
  const dispatch: AppDispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const {
    transactions,
    pagination,
    overview,
    loading,
    overviewLoading,
    error,
    overviewError,
  } = useSelector((state: RootState) => state.transactions);
  const { categories: apiCategories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories,
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [isMobile, setIsMobile] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: any; end: any } | null>(
    null,
  );
  const [page, setPage] = useState(1);

  const pageSize = viewMode === "card" || isMobile ? 12 : 10;

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // Reduced delay for more responsive feel

    return () => clearTimeout(timer);
  }, [search]);

  // Memoized function to fetch transactions using Redux
  const fetchTransactionsData = useCallback(() => {
    if (!token) return;

    // Format date range for API with proper time formatting
    let startDate = "";
    let endDate = "";

    if (dateRange && dateRange.start && dateRange.end) {
      startDate = formatDateForAPI(dateRange.start, false); // 00:00:00
      endDate = formatDateForAPI(dateRange.end, true); // 23:59:59
    }

    const params = {
      limit: pageSize,
      offset: page,
      category_id: category || undefined,
      search: debouncedSearch || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    console.log("Fetching transactions with params:", params);

    // Dispatch fetchTransactions with parameters
    dispatch(
      fetchTransactions({
        token,
        params,
      }),
    );
  }, [token, debouncedSearch, category, dateRange, page, pageSize, dispatch]);

  // Memoized function to fetch overview data
  const fetchOverviewData = useCallback(() => {
    if (!token) return;

    // Format date range for API with proper time formatting
    let startDate = "";
    let endDate = "";

    if (dateRange && dateRange.start && dateRange.end) {
      startDate = formatDateForAPI(dateRange.start, false);
      endDate = formatDateForAPI(dateRange.end, true);
    }

    // Build params object for overview
    const params: any = {};

    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    if (category) {
      params.category_id = category;
    }

    console.log("Fetching overview with params:", params);

    dispatch(
      fetchOverview({
        token,
        params: Object.keys(params).length > 0 ? params : undefined,
      }),
    );
  }, [token, dateRange, category, dispatch]);

  // Memoized function to fetch categories
  const fetchCategoriesData = useCallback(() => {
    if (!token) return;
    dispatch(
      fetchCategories({
        token,
        params: {
          limit: 100,
          offset: 1,
          search: "",
        },
      }),
    );
  }, [token, dispatch]);

  // Function to handle delete transaction
  const handleDeleteTransaction = async (transactionId: string) => {
    if (!token) return;

    try {
      await dispatch(deleteTransaction({ token, id: transactionId })).unwrap();
      // Refresh both transactions and overview data after deletion
      fetchTransactionsData();
      fetchOverviewData();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setViewMode("card");
  }, [isMobile]);

  // Fetch transactions when filters change
  useEffect(() => {
    fetchTransactionsData();
  }, [fetchTransactionsData]);

  // Fetch overview data when token is available or date range changes
  useEffect(() => {
    if (token) {
      fetchOverviewData();
      if (!apiCategories.length) {
        fetchCategoriesData();
      }
    }
  }, [token, fetchOverviewData, fetchCategoriesData, apiCategories.length]);

  // Reset to page 1 when filters change (except page changes)
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, dateRange, viewMode]);

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to format date for API
  const formatDateForAPI = (date: any, isEndDate: boolean = false) => {
    // Get the date in local timezone without time conversion issues
    const year = date.year;
    const month = String(date.month).padStart(2, "0");
    const day = String(date.day).padStart(2, "0");

    const dateString = `${year}-${month}-${day}`;

    if (isEndDate) {
      return `${dateString} 23:59:59`;
    } else {
      return `${dateString} 00:00:00`;
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);

    return cat?.icon || "📄";
  };

  // Helper function to get transaction type display
  const getTypeDisplay = (type: string) => {
    return type === "income" ? "Pemasukan" : "Pengeluaran";
  };

  // Helper function to get category display from category_id
  const getCategoryDisplay = (categoryId: string) => {
    const category = apiCategories.find(
      (cat) => cat.category_id === categoryId,
    );

    return category?.name || categoryId;
  };

  // Create category options for select, including API categories
  const categoryOptions = useMemo(
    () => [
      { category_id: "", name: "All Categories", icon: "📂" },
      ...apiCategories.map((cat) => ({
        ...cat,
        icon: getCategoryIcon(cat.name),
      })),
    ],
    [apiCategories],
  );

  const totalPages = pagination.total_pages || 1;

  // Handle search input change with immediate UI feedback
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  // Handle category change with immediate feedback
  const handleCategoryChange = (keys: any) => {
    const val = Array.from(keys)[0] as string;

    setCategory(val === "" ? "" : val || "");
  };

  // Handle date range change with immediate feedback
  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
  };

  // Determine if we should show loading state
  const isDataLoading = loading && transactions.length === 0;

  // Show loading skeleton while initial data is being fetched
  if (isDataLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Transaction Management
              </h1>
              {error && (
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  ⚠️ Using mock data (API: {error})
                </p>
              )}
              {overviewError && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ Using mock overview data (API: {overviewError})
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <NextLink href="/transaction/add">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <Plus className="w-4 h-4" />
                  Add Transaction
                </Button>
              </NextLink>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatisticsCard
              icon={<TrendingDown className="w-6 h-6 text-red-600" />}
              iconBg="bg-red-100 dark:bg-red-900"
              label={`Total Pengeluaran${dateRange && dateRange.start && dateRange.end ? " (Filtered)" : ""}`}
              value={overview?.total_expense || "Rp 0"}
              valueColor="text-red-500"
            />
            <StatisticsCard
              icon={<TrendingUp className="w-6 h-6 text-green-600" />}
              iconBg="bg-green-100 dark:bg-green-900"
              label={`Total Pemasukan${dateRange && dateRange.start && dateRange.end ? " (Filtered)" : ""}`}
              value={overview?.total_income || "Rp 0"}
              valueColor="text-green-500"
            />
            <StatisticsCard
              icon={
                <div
                  className={`w-6 h-6 rounded-full ${balance >= 0 ? "bg-blue-600" : "bg-orange-600"}`}
                />
              }
              iconBg={
                balance >= 0
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "bg-orange-100 dark:bg-orange-900"
              }
              label={`Sisa Budget${dateRange && dateRange.start && dateRange.end ? " (Filtered)" : ""}`}
              value={formatCurrency(balance)}
              valueColor={balance >= 0 ? "text-blue-500" : "text-orange-500"}
            />
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardBody>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex gap-4 flex-1">
                <Input
                  isClearable
                  classNames={{
                    label: "text-black/50 dark:text-white/90",
                    input: [
                      "bg-transparent",
                      "text-black/90 dark:text-white/90",
                      "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                      "bg-default-200/50",
                      "dark:bg-default/60",
                      "backdrop-blur-xl",
                      "backdrop-saturate-200",
                      "hover:bg-default-200/70",
                      "dark:hover:bg-default/70",
                      "group-data-[focus=true]:bg-default-200/50",
                      "dark:group-data-[focus=true]:bg-default/60",
                      "!cursor-text",
                    ],
                  }}
                  placeholder="Search transactions..."
                  startContent={<Search className="text-gray-400 w-5 h-5" />}
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onClear={() => handleSearchChange("")}
                />
              </div>
              <div className="flex gap-4 flex-1">
                <Select
                  className="min-w-[180px]"
                  label="Category"
                  selectedKeys={category ? [category] : []}
                  onSelectionChange={handleCategoryChange}
                >
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.category_id} textValue={cat.name}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </Select>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      className="flex items-center gap-2 min-w-[180px] h-[44px] px-4 py-2 border rounded-xl shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:border-gray-300 transition-colors duration-200"
                      variant="bordered"
                    >
                      <Calendar className="w-5 h-5 text-gray-400" />
                      {dateRange && dateRange.start && dateRange.end
                        ? `${dateRange.start.day}/${dateRange.start.month}/${dateRange.start.year} - ${dateRange.end.day}/${dateRange.end.month}/${dateRange.end.year}`
                        : "Semua Tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                    <RangeCalendar
                      aria-label="Date Range (Controlled)"
                      value={dateRange}
                      onChange={handleDateRangeChange}
                    />
                  </PopoverContent>
                </Popover>
                {!isMobile && (
                  <Tabs
                    className="min-w-[180px]"
                    selectedKey={viewMode}
                    onSelectionChange={(key) =>
                      setViewMode(key as "table" | "card")
                    }
                  >
                    <Tab key="table" title="Table" />
                    <Tab key="card" title="Cards" />
                  </Tabs>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Transactions Display */}
        <div className="transition-all duration-300 ease-in-out">
          {viewMode === "table" && !isMobile ? (
            <>
              <div className="rounded-2xl overflow-hidden transition-all duration-300 ease-in-out">
                <div className="overflow-x-auto">
                  <Table
                    aria-label="Daftar Transaksi"
                    bottomContent={
                      // Pagination controls
                      <div className="flex justify-center items-center p-4">
                        <Pagination
                          isCompact
                          showControls
                          showShadow
                          className="flex items-center gap-2"
                          page={page}
                          size="md"
                          total={totalPages}
                          onChange={setPage}
                        />
                      </div>
                    }
                  >
                    <TableHeader>
                      <TableColumn>Date</TableColumn>
                      <TableColumn>Description</TableColumn>
                      <TableColumn>Category</TableColumn>
                      <TableColumn>Amount</TableColumn>
                      <TableColumn>Type</TableColumn>
                      <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No transactions found."}>
                      {transactions.map((tx) => (
                        <TableRow key={tx.transaction_id}>
                          <TableCell className="text-foreground">
                            {formatDate(tx.transaction_date)}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {tx.description}
                          </TableCell>
                          <TableCell>
                            <Chip
                              color="primary"
                              startContent={
                                <span>
                                  {getCategoryIcon(
                                    getCategoryDisplay(tx.category_id),
                                  )}
                                </span>
                              }
                              variant="flat"
                            >
                              {getCategoryDisplay(tx.category_id)}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                tx.type === "income"
                                  ? "text-green-600 dark:text-green-400 font-semibold"
                                  : "text-red-500 dark:text-red-400 font-semibold"
                              }
                            >
                              {tx.type === "income" ? "+" : "-"}
                              {formatCurrency(tx.amount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={
                                tx.type === "income" ? "success" : "danger"
                              }
                              variant="flat"
                            >
                              {getTypeDisplay(tx.type)}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Tooltip content="View">
                                <NextLink
                                  href={`/transaction/view/${tx.transaction_id}`}
                                >
                                  <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-150">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </NextLink>
                              </Tooltip>
                              <Tooltip content="Edit">
                                <NextLink
                                  href={`/transaction/update/${tx.transaction_id}`}
                                >
                                  <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors duration-150">
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                </NextLink>
                              </Tooltip>
                              <Tooltip content="Delete">
                                <button
                                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-150"
                                  onClick={() =>
                                    handleDeleteTransaction(tx.transaction_id)
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ease-in-out">
                {transactions.map((tx) => (
                  <Card
                    key={tx.transaction_id}
                    className="hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fadeIn"
                  >
                    <CardHeader className="flex items-start justify-between mb-2 pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-lg">
                          {getCategoryIcon(getCategoryDisplay(tx.category_id))}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {tx.description}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(tx.transaction_date)}
                          </p>
                        </div>
                      </div>
                      <Chip
                        color={tx.type === "income" ? "success" : "danger"}
                        variant="flat"
                      >
                        {getTypeDisplay(tx.type)}
                      </Chip>
                    </CardHeader>
                    <CardBody className="mb-2">
                      <Chip
                        color="primary"
                        startContent={
                          <span>
                            {getCategoryIcon(
                              getCategoryDisplay(tx.category_id),
                            )}
                          </span>
                        }
                        variant="flat"
                      >
                        {getCategoryDisplay(tx.category_id)}
                      </Chip>
                    </CardBody>
                    <CardFooter className="flex items-center justify-between pt-0">
                      <span
                        className={`text-xl font-bold ${tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                      <div className="flex gap-1">
                        <Tooltip content="View">
                          <NextLink
                            href={`/transaction/view/${tx.transaction_id}`}
                          >
                            <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-150">
                              <Eye className="w-4 h-4" />
                            </button>
                          </NextLink>
                        </Tooltip>
                        <Tooltip content="Edit">
                          <NextLink
                            href={`/transaction/update/${tx.transaction_id}`}
                          >
                            <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors duration-150">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </NextLink>
                        </Tooltip>
                        <Tooltip content="Delete">
                          <button
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-150"
                            onClick={() =>
                              handleDeleteTransaction(tx.transaction_id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>{" "}
              <div className="flex justify-center mt-6">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  className="flex items-center gap-2"
                  page={page}
                  size="md"
                  total={totalPages}
                  onChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
