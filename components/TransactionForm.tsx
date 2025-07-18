"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { Calendar as HeroCalendar } from "@heroui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Skeleton } from "@heroui/skeleton";
import {
  today,
  getLocalTimeZone,
  parseDate,
  CalendarDate,
} from "@internationalized/date";
import {
  ArrowLeft,
  Save,
  Plus,
  Edit3,
  Wallet,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

// Define types for category
interface CategoryIcon {
  name: string;
  icon: string;
}

// Define dummy categories locally to avoid import issues
const categories: CategoryIcon[] = [
  { name: "Food & Dining", icon: "🍽️" },
  { name: "Transportation", icon: "🚗" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Bills & Utilities", icon: "💡" },
  { name: "Healthcare", icon: "🏥" },
  { name: "Education", icon: "📚" },
  { name: "Travel", icon: "✈️" },
  { name: "Groceries", icon: "🛒" },
  { name: "Salary", icon: "💰" },
  { name: "Investment", icon: "📈" },
  { name: "Gift", icon: "🎁" },
  { name: "Other", icon: "📄" },
];

import { RootState, AppDispatch } from "@/lib/redux/store";
import {
  createTransaction,
  updateTransaction,
  fetchTransactionById,
  clearCurrentTransaction,
  clearCurrentTransactionError,
} from "@/lib/redux/transactionSlice";
import { fetchCategories } from "@/lib/redux/categorySlice";

interface TransactionForm {
  transaction_id?: string;
  type: "income" | "expense";
  amount: string;
  category_id: string;
  description: string;
  date: CalendarDate;
  source: string;
  confirmed?: boolean;
  discount?: string;
  payment_method: string;
}

interface TransactionFormProps {
  mode: "add" | "update";
  transactionId?: string;
  onSuccess?: () => void;
}

export default function TransactionForm({
  mode,
  transactionId,
  onSuccess,
}: TransactionFormProps) {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const {
    currentTransaction,
    currentTransactionLoading,
    currentTransactionError,
  } = useSelector((state: RootState) => state.transactions);
  const { categories: apiCategories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(mode === "update");
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Use a consistent date that works for both server and client
  const getInitialDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return parseDate(`${year}-${month}-${day}`);
  };

  const [formData, setFormData] = useState<TransactionForm>({
    type: "expense",
    amount: "",
    category_id: "",
    description: "",
    date: getInitialDate(),
    source: "",
    confirmed: true,
    discount: "0",
    payment_method: "",
  });

  // Set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const paymentMethods = [
    { key: "cash", label: "Cash", icon: "💵" },
    { key: "debit", label: "Debit Card", icon: "💳" },
    { key: "credit", label: "Credit Card", icon: "🏦" },
    { key: "bank_transfer", label: "Bank Transfer", icon: "🏛️" },
    { key: "e_wallet", label: "E-Wallet", icon: "📱" },
    { key: "other", label: "Other", icon: "📝" },
  ];

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

  // Function to fetch categories
  const fetchCategoriesData = () => {
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
  };

  // Load data on component mount
  useEffect(() => {
    // Fetch categories if not loaded
    if (token && apiCategories.length === 0) {
      fetchCategoriesData();
    }

    // Load transaction data for update mode
    if (mode === "update" && transactionId && token) {
      const loadTransaction = async () => {
        try {
          setIsDataLoading(true);
          dispatch(clearCurrentTransaction());
          dispatch(clearCurrentTransactionError());

          await dispatch(
            fetchTransactionById({ token, id: transactionId }),
          ).unwrap();
        } catch (err) {
          setError(`Failed to load transaction: ${err}`);
        } finally {
          setIsDataLoading(false);
        }
      };

      if (!currentTransaction && !currentTransactionLoading) {
        loadTransaction();
      }
    }

    // Set initial loading to false for add mode
    if (mode === "add") {
      setIsDataLoading(false);
    }
  }, [
    mode,
    transactionId,
    token,
    apiCategories.length,
    currentTransaction,
    currentTransactionLoading,
    dispatch,
  ]);

  // Update form data when currentTransaction is available (update mode)
  useEffect(() => {
    if (mode === "update" && currentTransaction) {
      setFormData({
        transaction_id: currentTransaction.transaction_id,
        type: currentTransaction.type,
        amount: currentTransaction.amount.toString(),
        category_id: currentTransaction.category_id,
        description: currentTransaction.description,
        date: parseDate(currentTransaction.transaction_date.split("T")[0]),
        source: currentTransaction.source || "",
        payment_method: currentTransaction.payment_method || "cash",
        confirmed: true,
        discount: "0",
      });
    }
  }, [mode, currentTransaction]);

  // Handle current transaction error
  useEffect(() => {
    if (currentTransactionError) {
      setError(currentTransactionError);
      setIsDataLoading(false);
    }
  }, [currentTransactionError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("No authentication token available");

      return;
    }

    // Validate required fields
    if (!formData.amount || !formData.category_id || !formData.description) {
      setError("Please fill all required fields");

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === "add") {
        // Prepare transaction data for creation
        const transactionData = {
          category_id: formData.category_id,
          type: formData.type,
          description: formData.description,
          amount: parseInt(formData.amount) || 0,
          source: formData.source || "manual",
          is_auto_categorized: false,
          confirmed: formData.confirmed || true,
          discount: parseInt(formData.discount || "0") || 0,
          transaction_date: isClient
            ? formData.date.toDate(getLocalTimeZone()).toISOString()
            : `${formData.date.toString()}T00:00:00.000Z`,
          ai_category_confidence: 0.0,
          payment_method: formData.payment_method || "manual",
        };

        await dispatch(
          createTransaction({
            token,
            transaction: transactionData,
          }),
        ).unwrap();

        // Reset form for add mode
        setFormData({
          type: "expense",
          amount: "",
          category_id: "",
          description: "",
          date: getInitialDate(),
          source: "",
          confirmed: true,
          discount: "0",
          payment_method: "",
        });
      } else {
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
            id: transactionId!,
            transaction: updateData,
          }),
        ).unwrap();
      }

      // Call success callback or navigate
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/transaction");
      }
    } catch (error) {
      setError(
        `Failed to ${mode === "add" ? "create" : "update"} transaction: ${error}`,
      );
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
        newData.category_id = "";
      }

      return newData;
    });
  };

  const filteredCategories = apiCategories.filter((cat) => {
    return cat.type === formData.type;
  });

  // Effect to validate selected category when categories or type changes
  useEffect(() => {
    if (formData.category_id && apiCategories.length > 0) {
      const isValidCategory = filteredCategories.some(
        (cat) => cat.category_id === formData.category_id,
      );

      if (!isValidCategory) {
        setFormData((prev) => ({
          ...prev,
          category_id: "",
        }));
      }
    }
  }, [formData.type, formData.category_id, apiCategories, filteredCategories]);

  const isFormValid =
    formData.amount && formData.category_id && formData.description;

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen w-full p-6 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div>
            <Skeleton className="h-8 w-48 rounded-lg mb-2" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
        </div>

        {/* Form Skeleton */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="h-6 w-40 rounded-lg" />
            </div>
          </CardHeader>

          <CardBody className="space-y-6">
            {/* Transaction Type Skeleton */}
            <div>
              <Skeleton className="h-4 w-32 rounded-lg mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Amount Skeleton */}
            <div>
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Category Skeleton */}
            <div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Date Skeleton */}
            <div>
              <Skeleton className="h-4 w-32 rounded-lg mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Payment Method Skeleton */}
            <div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Description Skeleton */}
            <div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </CardBody>

          <CardFooter className="pt-4 flex gap-3 justify-end">
            <Skeleton className="h-10 w-20 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  // Show loading skeleton when data is loading
  if (isDataLoading || currentTransactionLoading) {
    return <LoadingSkeleton />;
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
              {mode === "add" ? "Add Transaction" : "Edit Transaction"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === "add"
                ? "Record your income or expense manually"
                : "Update transaction details"}
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
                    {mode === "add"
                      ? "Error Creating Transaction"
                      : "Error Loading Transaction"}
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
                {mode === "add" ? (
                  <Plus className="text-blue-500" size={24} />
                ) : (
                  <Edit3 className="text-blue-500" size={24} />
                )}
                <h2 className="text-xl font-semibold">Transaction Details</h2>
                {mode === "update" && formData.transaction_id && (
                  <div className="ml-auto">
                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      ID: {formData.transaction_id}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardBody className="space-y-6">
              {/* Transaction Type */}
              <div>
                <div className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Transaction Type
                </div>
                <Tabs
                  classNames={{
                    tabList: "grid w-full grid-cols-2",
                  }}
                  color="primary"
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
                  label="Amount"
                  min="0"
                  placeholder="0"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">Rp</span>
                    </div>
                  }
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
                  isLoading={categoriesLoading}
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
                    <SelectItem key="no-categories">
                      No categories available
                    </SelectItem>
                  )}
                </Select>
              </div>

              {/* Date */}
              <div>
                <div className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Transaction Date *
                </div>
                <Popover placement="bottom" showArrow={true}>
                  <PopoverTrigger>
                    <Button
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
                      maxValue={
                        isClient ? today(getLocalTimeZone()) : getInitialDate()
                      }
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
                    formData.payment_method
                      ? [formData.payment_method]
                      : formData.source
                        ? [formData.source]
                        : []
                  }
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    handleInputChange("payment_method", selected);
                    if (mode === "add") {
                      handleInputChange("source", selected);
                    }
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

              {/* Source (for update mode) */}
              {mode === "update" && (
                <div>
                  <Input
                    label="Source"
                    placeholder="Transaction source (manual, auto, etc.)"
                    value={formData.source}
                    variant="bordered"
                    onValueChange={(value) =>
                      handleInputChange("source", value)
                    }
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <Input
                  isRequired
                  label="Description"
                  placeholder="Add any additional notes or details..."
                  value={formData.description}
                  variant="bordered"
                  onValueChange={(value) =>
                    handleInputChange("description", value)
                  }
                />
              </div>

              {/* Discount (for add mode only) */}
              {mode === "add" && (
                <div>
                  <Input
                    label="Discount (Optional)"
                    placeholder="0"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">Rp</span>
                      </div>
                    }
                    type="number"
                    value={formData.discount || "0"}
                    variant="bordered"
                    onValueChange={(value) =>
                      handleInputChange("discount", value)
                    }
                  />
                </div>
              )}
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
                isDisabled={!isFormValid || isLoading || isDataLoading}
                isLoading={isLoading}
                startContent={!isLoading && <Save size={18} />}
                type="submit"
              >
                {isLoading
                  ? mode === "add"
                    ? "Saving..."
                    : "Updating..."
                  : mode === "add"
                    ? "Save Transaction"
                    : "Update Transaction"}
              </Button>
            </CardFooter>
          </Card>
        </form>

        {/* Preview Card */}
        {(formData.amount || formData.category_id) && (
          <Card
            className={`mt-6 border-2 border-dashed ${
              mode === "add"
                ? "border-gray-300 dark:border-gray-600"
                : "border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950"
            }`}
          >
            <CardHeader>
              <h3
                className={`text-lg font-semibold flex items-center gap-2 ${
                  mode === "add"
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {mode === "add" ? <Plus size={20} /> : <Edit3 size={20} />}
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
                {(formData.payment_method || formData.source) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Payment Method:
                    </span>
                    <span className="font-medium">
                      {paymentMethods.find(
                        (method) =>
                          method.key ===
                          (formData.payment_method || formData.source),
                      )?.label ||
                        formData.payment_method ||
                        formData.source}
                    </span>
                  </div>
                )}
                {formData.description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Description:
                    </span>
                    <span className="font-medium">{formData.description}</span>
                  </div>
                )}
                {mode === "add" &&
                  formData.discount &&
                  parseFloat(formData.discount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Discount:
                      </span>
                      <span className="font-medium text-green-600">
                        -Rp{" "}
                        {parseFloat(formData.discount).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                {mode === "update" && formData.source && (
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
