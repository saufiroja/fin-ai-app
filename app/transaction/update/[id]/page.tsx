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

import Loading from "./loading";

import { categories } from "@/dummy/categories";

interface TransactionForm {
  id: string;
  type: "income" | "expense";
  amount: string;
  category: string;
  description: string;
  date: CalendarDate;
  paymentMethod: string;
  recipient: string;
  tags: string;
}

// Mock function to get transaction by ID
const getTransactionById = (id: string): TransactionForm | null => {
  // In a real app, this would fetch from your API
  const mockTransactions: TransactionForm[] = [
    {
      id: "1",
      type: "expense",
      amount: "25000",
      category: "Food",
      description: "Lunch at restaurant",
      date: parseDate("2025-06-25"),
      paymentMethod: "cash",
      recipient: "Restaurant ABC",
      tags: "lunch, restaurant",
    },
    {
      id: "2",
      type: "income",
      amount: "5000000",
      category: "Salary",
      description: "Monthly salary",
      date: parseDate("2025-06-01"),
      paymentMethod: "bank_transfer",
      recipient: "Company XYZ",
      tags: "salary, monthly",
    },
  ];

  return mockTransactions.find((t) => t.id === id) || null;
};

export default function TransactionUpdatePage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TransactionForm>({
    id: "",
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: today(getLocalTimeZone()),
    paymentMethod: "cash",
    recipient: "",
    tags: "",
  });

  const paymentMethods = [
    { key: "cash", label: "Cash", icon: "💵" },
    { key: "debit", label: "Debit Card", icon: "💳" },
    { key: "credit", label: "Credit Card", icon: "🏦" },
    { key: "bank_transfer", label: "Bank Transfer", icon: "🏛️" },
    { key: "e_wallet", label: "E-Wallet", icon: "📱" },
  ];

  // Load transaction data on component mount
  useEffect(() => {
    const loadTransaction = async () => {
      try {
        setIsDataLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const transaction = getTransactionById(transactionId);

        if (transaction) {
          setFormData(transaction);
        } else {
          setError("Transaction not found");
        }
      } catch (err) {
        setError(`Failed to load transaction: ${err}`);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (transactionId) {
      loadTransaction();
    }
  }, [transactionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to transaction list
      router.push("/transaction");
    } catch (error) {
      setError(`Failed to update transaction: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TransactionForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredCategories = categories.filter((cat) => {
    if (formData.type === "income") {
      return cat.name === "Salary" || cat.name === "Gift";
    }

    return cat.name !== "Salary";
  });

  // Loading state - use detailed skeleton
  if (isDataLoading) {
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
                    ID: {formData.id}
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
                  label="Category"
                  placeholder="Select a category"
                  selectedKeys={formData.category ? [formData.category] : []}
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    handleInputChange("category", selected);
                  }}
                >
                  {filteredCategories.map((category) => (
                    <SelectItem
                      key={category.name}
                      startContent={
                        <span className="text-lg">{category.icon}</span>
                      }
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </Select>
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
                    formData.paymentMethod ? [formData.paymentMethod] : []
                  }
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    handleInputChange("paymentMethod", selected);
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

              {/* Recipient/Payer */}
              <div>
                <Input
                  label={
                    formData.type === "income"
                      ? "From (Payer)"
                      : "To (Recipient)"
                  }
                  placeholder={
                    formData.type === "income"
                      ? "Who paid you?"
                      : "Where did you spend?"
                  }
                  value={formData.recipient}
                  variant="bordered"
                  onValueChange={(value) =>
                    handleInputChange("recipient", value)
                  }
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

              {/* Tags */}
              <div>
                <Input
                  description="Separate multiple tags with commas"
                  label="Tags"
                  placeholder="grocery, lunch, work (comma separated)"
                  value={formData.tags}
                  variant="bordered"
                  onValueChange={(value) => handleInputChange("tags", value)}
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
        {(formData.amount || formData.category) && (
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
                {formData.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Category:
                    </span>
                    <span className="font-medium">{formData.category}</span>
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
                {formData.recipient && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formData.type === "income" ? "From:" : "To:"}
                    </span>
                    <span className="font-medium">{formData.recipient}</span>
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
