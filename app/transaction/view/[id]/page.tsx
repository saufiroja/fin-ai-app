"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Tag,
  MapPin,
  FileText,
  TrendingUp,
  TrendingDown,
  Copy,
  Share2,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import Loading from "./loading";
import Error from "./error";

import { RootState, AppDispatch } from "@/lib/redux/store";
import {
  fetchTransactionById,
  clearCurrentTransaction,
  clearCurrentTransactionError,
  deleteTransaction,
} from "@/lib/redux/transactionSlice";
import { fetchCategories } from "@/lib/redux/categorySlice";

const getPaymentMethodDisplay = (method: string) => {
  const methods: Record<
    string,
    { label: string; icon: string; color: string }
  > = {
    cash: { label: "Cash", icon: "💵", color: "success" },
    debit: { label: "Debit Card", icon: "💳", color: "primary" },
    credit: { label: "Credit Card", icon: "🏦", color: "secondary" },
    bank_transfer: { label: "Bank Transfer", icon: "🏛️", color: "warning" },
    e_wallet: { label: "E-Wallet", icon: "📱", color: "danger" },
  };

  return methods[method] || { label: method, icon: "💰", color: "default" };
};

export default function TransactionViewPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const transactionId = params.id as string;

  // Redux state
  const { token } = useSelector((state: RootState) => state.auth);
  const {
    currentTransaction: transaction,
    currentTransactionLoading: isLoading,
    currentTransactionError: error,
  } = useSelector((state: RootState) => state.transactions);

  const { categories } = useSelector((state: RootState) => state.categories);

  // Load transaction data on component mount
  useEffect(() => {
    if (transactionId && token) {
      dispatch(fetchTransactionById({ token, id: transactionId }));
      // Also fetch categories for display
      dispatch(
        fetchCategories({
          token,
          params: {
            search: "",
            limit: 1000,
            offset: 1,
          },
        }),
      );
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentTransaction());
      dispatch(clearCurrentTransactionError());
    };
  }, [dispatch, transactionId, token]);

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((cat) => cat.category_id === categoryId);

    if (category) {
      return {
        name: category.name,
        icon: "📝", // Default icon since API doesn't have icons
        color: "#6B7280", // Default color since API doesn't have colors
        description: category.type,
      };
    }

    return {
      name: "Unknown Category",
      icon: "📝",
      color: "#6B7280",
      description: "Category not found",
    };
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(transactionId);
    // You could add a toast notification here
  };

  const handleEdit = () => {
    router.push(`/transaction/update/${transactionId}`);
  };

  const handleDelete = async () => {
    // You could add a confirmation modal here
    if (confirm("Are you sure you want to delete this transaction?")) {
      if (token) {
        await dispatch(
          deleteTransaction({ token, id: transactionId }),
        ).unwrap();
        router.push("/transaction");
        // You could add a toast notification here
      }
    }
  };

  // Loading state - use the same skeleton as loading.tsx
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (error || !transaction) {
    return (
      <Error
        error={
          {
            message: error || "Transaction not found",
            name: "TransactionError",
          } as Error
        }
        reset={() => {
          dispatch(clearCurrentTransactionError());
          dispatch(clearCurrentTransaction());
        }}
      />
    );
  }

  const categoryInfo = getCategoryInfo(transaction.category_id);
  const paymentInfo = getPaymentMethodDisplay(
    transaction.payment_method || transaction.source || "cash",
  );

  // Format transaction date
  const transactionDate = new Date(transaction.transaction_date);
  const formattedDate = transactionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-3 sm:p-6 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              isIconOnly
              className="text-gray-600 hover:text-gray-800 shrink-0"
              size="sm"
              variant="light"
              onPress={() => router.push("/transaction")}
            >
              <ArrowLeft size={18} />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">
                Transaction Details
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hidden sm:block">
                View transaction information
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 sm:gap-2 overflow-x-auto">
            <Button
              className="text-gray-600 shrink-0"
              size="sm"
              startContent={
                <Share2 className="sm:w-[18px] sm:h-[18px]" size={16} />
              }
              variant="light"
            >
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              className="text-blue-600 hover:text-blue-800 shrink-0"
              size="sm"
              startContent={
                <Edit3 className="sm:w-[18px] sm:h-[18px]" size={16} />
              }
              variant="light"
              onPress={handleEdit}
            >
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              className="text-red-600 hover:text-red-800 shrink-0"
              size="sm"
              startContent={
                <Trash2 className="sm:w-[18px] sm:h-[18px]" size={16} />
              }
              variant="light"
              onPress={handleDelete}
            >
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Main Transaction Info */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-6">
            {/* Overview Card */}
            <Card className="shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3 sm:gap-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 sm:p-3 rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-red-100 dark:bg-red-900"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="text-green-600" size={20} />
                      ) : (
                        <TrendingDown className="text-red-600" size={20} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-semibold truncate">
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                  <Chip
                    className="self-start sm:self-center"
                    color={transaction.type === "income" ? "success" : "danger"}
                    size="sm"
                    variant="flat"
                  >
                    {transaction.type.toUpperCase()}
                  </Chip>
                </div>
              </CardHeader>

              <CardBody className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                {/* Amount */}
                <div className="text-center py-4 sm:py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
                    Amount
                  </p>
                  <p
                    className={`text-2xl sm:text-4xl font-bold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    } break-all`}
                  >
                    {transaction.type === "income" ? "+" : "-"}Rp{" "}
                    {parseFloat(transaction.amount.toString()).toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </div>

                {/* Category */}
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-xl sm:text-2xl shrink-0">
                    {categoryInfo.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {categoryInfo.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {categoryInfo.description}
                    </p>
                  </div>
                  <Chip
                    className="shrink-0"
                    size="sm"
                    style={{
                      backgroundColor: categoryInfo.color,
                      color: "white",
                    }}
                  >
                    <span className="hidden sm:inline">Category</span>
                    <span className="sm:hidden">Cat</span>
                  </Chip>
                </div>

                {/* Payment Method */}
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-xl sm:text-2xl shrink-0">
                    {paymentInfo.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {paymentInfo.label}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      Payment method used
                    </p>
                  </div>
                  <Chip
                    className="shrink-0"
                    color={paymentInfo.color as any}
                    size="sm"
                  >
                    <span className="hidden sm:inline">
                      {paymentInfo.label}
                    </span>
                    <span className="sm:hidden text-xs">
                      {paymentInfo.label.split(" ")[0]}
                    </span>
                  </Chip>
                </div>
              </CardBody>
            </Card>

            {/* Details Card */}
            <Card className="shadow-lg">
              <CardHeader className="px-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-500" size={18} />
                  <h3 className="text-base sm:text-lg font-semibold">
                    Transaction Details
                  </h3>
                </div>
              </CardHeader>

              <CardBody className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                {/* Description */}
                {transaction.description && (
                  <div className="flex items-start gap-3">
                    <FileText
                      className="text-gray-400 mt-1 shrink-0"
                      size={14}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Description
                      </p>
                      <p className="font-medium text-sm sm:text-base break-words">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Source */}
                {transaction.source && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1 shrink-0" size={14} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Payment Source
                      </p>
                      <p className="font-medium text-sm sm:text-base break-words">
                        {transaction.source}
                      </p>
                    </div>
                  </div>
                )}

                {/* Auto Categorized Status */}
                {transaction.is_auto_categorized !== undefined && (
                  <div className="flex items-start gap-3">
                    <Tag className="text-gray-400 mt-1 shrink-0" size={14} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Categorization
                      </p>
                      <Chip
                        color={
                          transaction.is_auto_categorized
                            ? "warning"
                            : "success"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {transaction.is_auto_categorized
                          ? "Auto-categorized"
                          : "Manual"}
                      </Chip>
                    </div>
                  </div>
                )}

                {/* Confirmation Status */}
                {transaction.confirmed !== undefined && (
                  <div className="flex items-start gap-3">
                    <Tag className="text-gray-400 mt-1 shrink-0" size={14} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Status
                      </p>
                      <Chip
                        color={transaction.confirmed ? "success" : "warning"}
                        size="sm"
                        variant="flat"
                      >
                        {transaction.confirmed ? "Confirmed" : "Pending"}
                      </Chip>
                    </div>
                  </div>
                )}

                {/* Discount */}
                <div className="flex items-start gap-3">
                  <Tag className="text-gray-400 mt-1 shrink-0" size={14} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Discount
                    </p>
                    <p className="font-medium text-green-600 text-sm sm:text-base break-all">
                      Rp{" "}
                      {parseFloat(
                        transaction.discount.toString(),
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-6">
            {/* Transaction ID */}
            <Card className="shadow-lg">
              <CardHeader className="px-4 sm:px-6">
                <h3 className="text-base sm:text-lg font-semibold">
                  Transaction ID
                </h3>
              </CardHeader>
              <CardBody className="px-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs sm:text-sm flex-1 overflow-hidden">
                    <span className="block truncate">
                      {transaction.transaction_id}
                    </span>
                  </code>
                  <Button
                    isIconOnly
                    className="shrink-0"
                    size="sm"
                    variant="light"
                    onPress={handleCopyId}
                  >
                    <Copy size={12} />
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Timestamps */}
            <Card className="shadow-lg">
              <CardHeader className="px-4 sm:px-6">
                <h3 className="text-base sm:text-lg font-semibold">Timeline</h3>
              </CardHeader>
              <CardBody className="space-y-2 sm:space-y-3 px-4 sm:px-6">
                {transaction.created_at && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Created
                    </p>
                    <p className="font-medium text-xs sm:text-sm break-all">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                )}
                {transaction.updated_at && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Last Updated
                    </p>
                    <p className="font-medium text-xs sm:text-sm break-all">
                      {new Date(transaction.updated_at).toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Transaction Date
                  </p>
                  <p className="font-medium text-xs sm:text-sm">
                    {formattedDate}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader className="px-4 sm:px-6">
                <h3 className="text-base sm:text-lg font-semibold">
                  Quick Actions
                </h3>
              </CardHeader>
              <CardBody className="space-y-1 sm:space-y-2 px-4 sm:px-6">
                <Button
                  className="w-full justify-start text-sm"
                  startContent={<Edit3 size={14} />}
                  variant="light"
                  onPress={handleEdit}
                >
                  Edit Transaction
                </Button>
                <Button
                  className="w-full justify-start text-sm"
                  startContent={<Copy size={14} />}
                  variant="light"
                  onPress={() => {
                    // Duplicate transaction functionality
                    router.push(
                      `/transaction/add?duplicate=${transaction.transaction_id}`,
                    );
                  }}
                >
                  Duplicate
                </Button>
                <Divider />
                <Button
                  className="w-full justify-start text-red-600 text-sm"
                  startContent={<Trash2 size={14} />}
                  variant="light"
                  onPress={handleDelete}
                >
                  Delete Transaction
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
