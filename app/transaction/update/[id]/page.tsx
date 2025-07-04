"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { Calendar as HeroCalendar } from "@heroui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import {
  today,
  getLocalTimeZone,
  parseDate,
  CalendarDate,
} from "@internationalized/date";
import {
  ArrowLeft,
  Save,
  Edit3,
  Wallet,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import Loading from "../../loading";

import { categories } from "@/dummy/categories";
import { RootState, AppDispatch } from "@/lib/redux/store";
import {
  updateTransaction,
  fetchTransactionById,
  clearCurrentTransaction,
  clearCurrentTransactionError,
} from "@/lib/redux/transactionSlice";
import { fetchCategories } from "@/lib/redux/categorySlice";

interface TransactionForm {
  transaction_id: string;
  type: "income" | "expense";
  amount: string;
  category_id: string;
  description: string;
  date: CalendarDate;
  payment_method: string;
  source: string;
}

export default function TransactionUpdatePage() {
  const router = useRouter();
  const params = useParams();
  const dispatch: AppDispatch = useDispatch();
  const transactionId = params.id as string;

  console.log("URL Params:", params);
  console.log("Extracted Transaction ID:", transactionId);

  const { token } = useSelector((state: RootState) => state.auth);
  const {
    currentTransaction,
    currentTransactionLoading,
    currentTransactionError,
    loading,
  } = useSelector((state: RootState) => state.transactions);
  const { categories: apiCategories } = useSelector(
    (state: RootState) => state.categories,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TransactionForm>({
    transaction_id: "",
    type: "expense",
    amount: "",
    category_id: "",
    description: "",
    date: today(getLocalTimeZone()),
    payment_method: "cash",
    source: "",
  });

  // Helper function to get category display name
  const getCategoryDisplay = (categoryId: string) => {
    const category = apiCategories.find(
      (cat) => cat.category_id === categoryId,
    );

    return category?.name || categoryId;
  };

  // Helper function to get category icon
  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);

    return cat?.icon || "📄";
  };

  const paymentMethods = [
    { key: "cash", label: "Cash", icon: "💵" },
    { key: "debit", label: "Debit Card", icon: "💳" },
    { key: "credit", label: "Credit Card", icon: "🏦" },
    { key: "bank_transfer", label: "Bank Transfer", icon: "🏛️" },
    { key: "e_wallet", label: "E-Wallet", icon: "📱" },
  ];

  // Load transaction data on component mount
  useEffect(() => {
    console.log("Transaction ID:", transactionId);
    console.log("Current Transaction:", currentTransaction);
    console.log("API Categories length:", apiCategories.length);

    // Fetch categories if not loaded
    if (token && apiCategories.length === 0) {
      console.log("Fetching categories...");
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
    }

    const loadTransaction = async () => {
      try {
        setIsDataLoading(true);

        // Clear any previous transaction data and errors
        dispatch(clearCurrentTransaction());
        dispatch(clearCurrentTransactionError());

        if (!token) {
          setError("No authentication token");

          return;
        }

        // Fetch transaction details from API
        await dispatch(
          fetchTransactionById({ token, id: transactionId }),
        ).unwrap();
      } catch (err) {
        setError(`Failed to load transaction: ${err}`);
      } finally {
        setIsDataLoading(false);
      }
    };

    // Update form data when currentTransaction is available
    if (currentTransaction) {
      console.log(
        "Setting form data from currentTransaction:",
        currentTransaction,
      );
      setFormData({
        transaction_id: currentTransaction.transaction_id,
        type: currentTransaction.type,
        amount: currentTransaction.amount.toString(),
        category_id: currentTransaction.category_id,
        description: currentTransaction.description,
        date: parseDate(currentTransaction.transaction_date.split("T")[0]), // Extract date part
        payment_method: currentTransaction.payment_method || "cash",
        source: currentTransaction.source || "",
      });
      setIsDataLoading(false);
    }

    // Handle current transaction error
    if (currentTransactionError) {
      setError(currentTransactionError);
      setIsDataLoading(false);
    }

    if (
      transactionId &&
      token &&
      !currentTransaction &&
      !currentTransactionLoading
    ) {
      loadTransaction();
    }
  }, [
    transactionId,
    currentTransaction,
    currentTransactionError,
    currentTransactionLoading,
    token,
    apiCategories.length,
    dispatch,
  ]);

  // Separate effect to monitor categories loading
  useEffect(() => {
    console.log("Categories state changed:", {
      categories: apiCategories,
      count: apiCategories.length,
      token: !!token,
    });
  }, [apiCategories, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("No authentication token");
      }

      // Prepare update data
      const updateData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category_id: formData.category_id,
        description: formData.description,
        transaction_date: `${formData.date.toString()}T00:00:00Z`,
        payment_method: formData.payment_method,
        source: formData.source,
      };

      await dispatch(
        updateTransaction({
          token,
          id: transactionId,
          transaction: updateData,
        }),
      ).unwrap();

      // Navigate back to transaction list
      router.push("/transaction");
    } catch (error) {
      setError(`Failed to update transaction: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TransactionForm, value: any) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // If transaction type changes, reset category_id to ensure it's valid for the new type
      if (field === "type" && value !== prev.type) {
        console.log(
          "Transaction type changed from",
          prev.type,
          "to",
          value,
          "- resetting category",
        );
        newData.category_id = "";
      }

      return newData;
    });
  };

  const filteredCategories = apiCategories.filter((cat) => {
    // Filter categories based on transaction type
    return cat.type === formData.type;
  });

  // Effect to validate selected category when categories or type changes
  useEffect(() => {
    if (formData.category_id && apiCategories.length > 0) {
      const isValidCategory = filteredCategories.some(
        (cat) => cat.category_id === formData.category_id,
      );

      if (!isValidCategory) {
        console.log(
          "Current category_id",
          formData.category_id,
          "is not valid for type",
          formData.type,
          "- clearing selection",
        );
        setFormData((prev) => ({
          ...prev,
          category_id: "",
        }));
      }
    }
  }, [formData.type, formData.category_id, apiCategories, filteredCategories]);

  // Debug logging
  console.log("API Categories:", apiCategories);
  console.log("Filtered Categories:", filteredCategories);
  console.log("Current form type:", formData.type);
  console.log("Current form category_id:", formData.category_id);

  // Loading state - use detailed skeleton
  if (isDataLoading || currentTransactionLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full p-6 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            isIconOnly
            className="text-gray-600 hover:text-gray-800"
            variant="light"
            onPress={() => router.push("/transaction")}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Edit Transaction
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update transaction details
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error Loading Transaction
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setError(null)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="text-blue-500" size={24} />
                <h2 className="text-xl font-semibold">Transaction Details</h2>
                <div className="ml-auto">
                  <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    ID: {formData.transaction_id}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardBody className="space-y-6">
              {/* Transaction Type */}
              <div>
                <label
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  htmlFor="transaction-type"
                >
                  Transaction Type
                </label>
                <Tabs
                  classNames={{
                    tabList: "grid w-full grid-cols-2",
                  }}
                  color="primary"
                  id="transaction-type"
                  selectedKey={formData.type}
                  variant="bordered"
                  onSelectionChange={(key) => handleInputChange("type", key)}
                >
                  <Tab
                    key="expense"
                    title={
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        <span>Expense</span>
                      </div>
                    }
                  />
                  <Tab
                    key="income"
                    title={
                      <div className="flex items-center gap-2">
                        <Wallet size={16} />
                        <span>Income</span>
                      </div>
                    }
                  />
                </Tabs>
              </div>

              {/* Amount */}
              <div>
                <Input
                  isRequired
                  classNames={{
                    input: "text-lg font-semibold",
                  }}
                  label="Amount"
                  min="0"
                  placeholder="0.00"
                  size="lg"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">Rp</span>
                    </div>
                  }
                  step="0.01"
                  type="number"
                  value={formData.amount}
                  variant="bordered"
                  onValueChange={(value) => handleInputChange("amount", value)}
                />
              </div>

              {/* Category */}
              <div>
                <Select
                  isRequired
                  isDisabled={filteredCategories.length === 0}
                  label="Category"
                  placeholder={
                    filteredCategories.length > 0
                      ? `Select ${formData.type} category`
                      : apiCategories.length > 0
                        ? `No ${formData.type} categories available`
                        : "Loading categories..."
                  }
                  selectedKeys={
                    formData.category_id ? [formData.category_id] : []
                  }
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    console.log("Category selected:", selected);
                    handleInputChange("category_id", selected);
                  }}
                >
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        startContent={
                          <span className="text-lg">
                            {getCategoryIcon(category.name)}
                          </span>
                        }
                      >
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-categories" isDisabled>
                      No categories available
                    </SelectItem>
                  )}
                </Select>
                {/* Debug info */}
                <div className="text-xs text-gray-500 mt-1">
                  <p>
                    Debug: {filteredCategories.length} {formData.type}{" "}
                    categories loaded (total: {apiCategories.length}), current:{" "}
                    {formData.category_id}
                  </p>
                  {filteredCategories.length === 0 &&
                    apiCategories.length > 0 && (
                      <p className="text-orange-500">
                        No {formData.type} categories found!
                      </p>
                    )}
                  {filteredCategories.length === 0 && token && (
                    <Button
                      size="sm"
                      variant="light"
                      onPress={() => {
                        console.log("Manually fetching categories...");
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
                      }}
                    >
                      Reload Categories
                    </Button>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <Popover placement="bottom" showArrow={true}>
                  <PopoverTrigger>
                    <Button
                      aria-label="Transaction Date"
                      className="w-full justify-start text-left font-normal"
                      startContent={<Calendar size={16} />}
                      variant="bordered"
                    >
                      {formData.date ? formData.date.toString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <HeroCalendar
                      showMonthAndYearPickers
                      maxValue={today(getLocalTimeZone())}
                      value={formData.date}
                      onChange={(date) => handleInputChange("date", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Payment Method */}
              <div>
                <Select
                  isRequired
                  label="Payment Method"
                  placeholder="Select payment method"
                  selectedKeys={
                    formData.payment_method ? [formData.payment_method] : []
                  }
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    handleInputChange("payment_method", selected);
                  }}
                >
                  {paymentMethods.map((method) => (
                    <SelectItem
                      key={method.key}
                      startContent={
                        <span className="text-lg">{method.icon}</span>
                      }
                    >
                      {method.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Source */}
              <div>
                <Input
                  label="Source"
                  placeholder="Transaction source (manual, auto, etc.)"
                  value={formData.source}
                  variant="bordered"
                  onValueChange={(value) => handleInputChange("source", value)}
                />
              </div>

              {/* Description */}
              <div>
                <Input
                  label="Description"
                  placeholder="Add any additional notes or details..."
                  value={formData.description}
                  variant="bordered"
                  onValueChange={(value) =>
                    handleInputChange("description", value)
                  }
                />
              </div>
            </CardBody>

            <CardFooter className="pt-4 flex gap-3 justify-end">
              <Button
                disabled={isLoading}
                variant="light"
                onPress={() => router.push("/transaction")}
              >
                Cancel
              </Button>
              <Button
                className="font-medium"
                color="primary"
                isLoading={isLoading}
                startContent={!isLoading && <Save size={18} />}
                type="submit"
              >
                {isLoading ? "Updating..." : "Update Transaction"}
              </Button>
            </CardFooter>
          </Card>
        </form>

        {/* Changes Preview Card */}
        {(formData.amount || formData.category_id) && (
          <Card className="mt-6 border-2 border-dashed border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950">
            <CardHeader>
              <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <Edit3 size={20} />
                Transaction Preview
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Type:
                  </span>
                  <span
                    className={`font-medium capitalize ${
                      formData.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formData.type}
                  </span>
                </div>
                {formData.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Amount:
                    </span>
                    <span className="font-semibold">
                      Rp{" "}
                      {parseFloat(formData.amount || "0").toLocaleString(
                        "id-ID",
                      )}
                    </span>
                  </div>
                )}
                {formData.category_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Category:
                    </span>
                    <span className="font-medium">
                      {getCategoryDisplay(formData.category_id)}
                    </span>
                  </div>
                )}
                {formData.date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Date:
                    </span>
                    <span className="font-medium">
                      {formData.date.toString()}
                    </span>
                  </div>
                )}
                {formData.source && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Source:
                    </span>
                    <span className="font-medium">{formData.source}</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
