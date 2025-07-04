"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { Calendar as HeroCalendar } from "@heroui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import {
  ArrowLeft,
  Save,
  Plus,
  Wallet,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import Loading from "./loading";

import { RootState, AppDispatch } from "@/lib/redux/store";
import { createTransaction } from "@/lib/redux/transactionSlice";
import { fetchCategories } from "@/lib/redux/categorySlice";

interface TransactionForm {
  type: "income" | "expense";
  amount: string;
  category_id: string;
  description: string;
  date: CalendarDate;
  source: string;
  confirmed: boolean;
  discount: string;
  payment_method: string;
}

export default function TransactionAddPage() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { categories: apiCategories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories,
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [formData, setFormData] = useState<TransactionForm>({
    type: "expense",
    amount: "",
    category_id: "",
    description: "",
    date: today(getLocalTimeZone()),
    source: "",
    confirmed: true,
    discount: "0",
    payment_method: "",
  });

  const paymentMethods = [
    { key: "cash", label: "Cash", icon: "💵" },
    { key: "debit", label: "Debit Card", icon: "💳" },
    { key: "credit", label: "Credit Card", icon: "🏦" },
    { key: "bank_transfer", label: "Bank Transfer", icon: "🏛️" },
    { key: "e_wallet", label: "E-Wallet", icon: "📱" },
    { key: "other", label: "Other", icon: "📝" },
  ];

  // Function to fetch categories
  const fetchCategoriesData = () => {
    if (!token) return;
    dispatch(
      fetchCategories({
        token,
        params: {
          limit: 100, // Get all categories
          offset: 1,
          search: "",
        },
      }),
    );
  };

  // Simulate initial loading when component mounts
  useEffect(() => {
    const initializeForm = async () => {
      // Fetch categories from API
      if (token) {
        fetchCategoriesData();
      }
      
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsInitialLoading(false);
    };

    initializeForm();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      console.error("No authentication token available");
      return;
    }

    // Validate required fields
    if (!formData.amount || !formData.category_id || !formData.description) {
      console.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare transaction data for API
      const transactionData = {
        category_id: formData.category_id,
        type: formData.type,
        description: formData.description,
        amount: parseInt(formData.amount) || 0,
        source: formData.source || "manual",
        is_auto_categorized: false,
        confirmed: formData.confirmed,
        discount: parseInt(formData.discount) || 0,
        transaction_date: formData.date.toDate(getLocalTimeZone()).toISOString(),
        ai_category_confidence: 0.0, // Default since this is manual entry
        payment_method: formData.source || "manual",
      };

      console.log("Submitting transaction:", transactionData);

      // Dispatch create transaction action
      await dispatch(createTransaction({ 
        token, 
        transaction: transactionData 
      })).unwrap();

      console.log("Transaction saved successfully");

      // Reset form
      setFormData({
        type: "expense",
        amount: "",
        category_id: "",
        description: "",
        date: today(getLocalTimeZone()),
        source: "",
        confirmed: true,
        discount: "0",
        payment_method: "",
      });

      // Navigate back to transaction list
      router.push("/transaction");
    } catch (error) {
      console.error("Error saving transaction:", error);
      // You could add a toast notification here
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

  const filteredCategories = apiCategories.filter((cat) => {
    return cat.type === formData.type;
  });

  // Show skeleton when submitting the form
  if (isLoading) {
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
              Add Transaction
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Record your income or expense manually
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Plus className="text-blue-500" size={24} />
                <h2 className="text-xl font-semibold">Transaction Details</h2>
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
                  isLoading={categoriesLoading}
                  label="Category"
                  placeholder="Select a category"
                  selectedKeys={formData.category_id ? [formData.category_id] : []}
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    handleInputChange("category_id", selected);
                  }}
                >
                  {filteredCategories.map((category) => (
                    <SelectItem
                      key={category.category_id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
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
                    formData.source ? [formData.source] : []
                  }
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    handleInputChange("source", selected);
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

              {/* Description */}
              <div>
                <Input
                  label="Description"
                  placeholder="Add any additional notes or details..."
                  value={formData.description}
                  variant="bordered"
                  onValueChange={(value: any) =>
                    handleInputChange("description", value)
                  }
                />
              </div>

              {/* Discount (optional) */}
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
                  value={formData.discount}
                  variant="bordered"
                  onValueChange={(value) => handleInputChange("discount", value)}
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
                isDisabled={!formData.amount || !formData.category_id || !formData.description || isLoading}
                isLoading={isLoading}
                startContent={!isLoading && <Save size={18} />}
                type="submit"
              >
                {isLoading ? "Saving..." : "Save Transaction"}
              </Button>
            </CardFooter>
          </Card>
        </form>

        {/* Preview Card */}
        {(formData.amount || formData.category_id) && (
          <Card className="mt-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
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
                      {apiCategories.find(cat => cat.category_id === formData.category_id)?.name || formData.category_id}
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
                      Payment Method:
                    </span>
                    <span className="font-medium">
                      {paymentMethods.find(method => method.key === formData.source)?.label || formData.source}
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
                {formData.discount && parseFloat(formData.discount) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Discount:
                    </span>
                    <span className="font-medium text-green-600">
                      -Rp {parseFloat(formData.discount).toLocaleString("id-ID")}
                    </span>
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
