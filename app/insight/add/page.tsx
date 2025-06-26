"use client";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  TrendingUp,
  Target,
  AlertTriangle,
  Lightbulb,
  Calendar,
  DollarSign,
  ArrowLeft,
  Save,
  Plus,
  BarChart3,
  Bell,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function InsightsAddPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "target",
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    priority: "medium",
    category: "",
    reminderEnabled: true,
    customIcon: "target",
  });

  const insightTypes = [
    {
      key: "target",
      label: "Financial Target",
      description: "Set and track financial goals",
      icon: <Target className="w-5 h-5" />,
      color: "success",
    },
    {
      key: "analysis",
      label: "Spending Analysis",
      description: "Analyze spending patterns",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "primary",
    },
    {
      key: "alert",
      label: "Budget Alert",
      description: "Set budget warning alerts",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "warning",
    },
    {
      key: "recommendation",
      label: "Smart Recommendation",
      description: "Custom financial advice",
      icon: <Lightbulb className="w-5 h-5" />,
      color: "secondary",
    },
  ];

  const categories = [
    { key: "savings", label: "Savings & Investment" },
    { key: "debt", label: "Debt Management" },
    { key: "budget", label: "Budget & Expenses" },
    { key: "income", label: "Income Growth" },
    { key: "emergency", label: "Emergency Fund" },
    { key: "retirement", label: "Retirement Planning" },
    { key: "education", label: "Education Fund" },
    { key: "housing", label: "Housing & Property" },
  ];

  const priorities = [
    { key: "low", label: "Low Priority", color: "default" },
    { key: "medium", label: "Medium Priority", color: "primary" },
    { key: "high", label: "High Priority", color: "warning" },
    { key: "urgent", label: "Urgent", color: "danger" },
  ];

  const icons = [
    { key: "target", icon: <Target className="w-5 h-5" />, label: "Target" },
    {
      key: "trending",
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Trending",
    },
    {
      key: "alert",
      icon: <AlertTriangle className="w-5 h-5" />,
      label: "Alert",
    },
    {
      key: "lightbulb",
      icon: <Lightbulb className="w-5 h-5" />,
      label: "Idea",
    },
    { key: "dollar", icon: <DollarSign className="w-5 h-5" />, label: "Money" },
    {
      key: "calendar",
      icon: <Calendar className="w-5 h-5" />,
      label: "Schedule",
    },
    { key: "chart", icon: <BarChart3 className="w-5 h-5" />, label: "Chart" },
    {
      key: "sparkles",
      icon: <Sparkles className="w-5 h-5" />,
      label: "Special",
    },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("New insight created:", formData);

      // Navigate back to insights list
      router.push("/insight");
    } catch (error) {
      console.error("Error creating insight:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedTypeData = () => {
    return insightTypes.find((type) => type.key === formData.type);
  };

  const calculateProgress = () => {
    if (!formData.targetAmount || !formData.currentAmount) return 0;
    const current = parseFloat(formData.currentAmount);
    const target = parseFloat(formData.targetAmount);

    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen w-full p-6 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            isIconOnly
            className="text-gray-600 hover:text-gray-800"
            variant="light"
            onPress={() => router.push("/insight")}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Create New Insight
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add a custom financial insight or goal to track
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type Selection */}
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Plus className="text-blue-500" size={24} />
                <h2 className="text-xl font-semibold">Insight Type</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insightTypes.map((type) => (
                  <Card
                    key={type.key}
                    isPressable
                    className={`p-4 transition-all duration-200 ${
                      formData.type === type.key
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onPress={() => handleInputChange("type", type.key)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-${type.color}-100 text-${type.color}-600`}
                      >
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{type.label}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Basic Information */}
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                isRequired
                label="Title"
                placeholder="Enter insight title"
                startContent={getSelectedTypeData()?.icon}
                value={formData.title}
                variant="bordered"
                onValueChange={(value) => handleInputChange("title", value)}
              />

              <Input
                label="Description"
                placeholder="Describe your financial goal or insight..."
                value={formData.description}
                variant="bordered"
                onValueChange={(value) =>
                  handleInputChange("description", value)
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  placeholder="Select category"
                  selectedKeys={formData.category ? [formData.category] : []}
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    handleInputChange("category", selected);
                  }}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.key}>{category.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Priority Level"
                  placeholder="Select priority"
                  selectedKeys={[formData.priority]}
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    handleInputChange("priority", selected);
                  }}
                >
                  {priorities.map((priority) => (
                    <SelectItem key={priority.key}>{priority.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </CardBody>
          </Card>

          {/* Financial Details */}
          {(formData.type === "target" || formData.type === "alert") && (
            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <h2 className="text-xl font-semibold">Financial Details</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    isRequired={formData.type === "target"}
                    label={
                      formData.type === "target"
                        ? "Target Amount"
                        : "Budget Limit"
                    }
                    placeholder="0"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">Rp</span>
                      </div>
                    }
                    type="number"
                    value={formData.targetAmount}
                    variant="bordered"
                    onValueChange={(value) =>
                      handleInputChange("targetAmount", value)
                    }
                  />

                  <Input
                    label={
                      formData.type === "target"
                        ? "Current Amount"
                        : "Current Spending"
                    }
                    placeholder="0"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">Rp</span>
                      </div>
                    }
                    type="number"
                    value={formData.currentAmount}
                    variant="bordered"
                    onValueChange={(value) =>
                      handleInputChange("currentAmount", value)
                    }
                  />
                </div>

                {formData.targetAmount && formData.currentAmount && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{calculateProgress().toFixed(1)}%</span>
                    </div>
                    <Progress
                      className="w-full"
                      color={formData.type === "target" ? "success" : "warning"}
                      value={calculateProgress()}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>
                        Rp{" "}
                        {parseFloat(
                          formData.currentAmount || "0",
                        ).toLocaleString("id-ID")}
                      </span>
                      <span>
                        Rp{" "}
                        {parseFloat(
                          formData.targetAmount || "0",
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}

                <Input
                  label="Target Deadline"
                  placeholder="e.g., December 2024, Next 6 months"
                  startContent={<Calendar className="w-4 h-4 text-gray-400" />}
                  value={formData.deadline}
                  variant="bordered"
                  onValueChange={(value) =>
                    handleInputChange("deadline", value)
                  }
                />
              </CardBody>
            </Card>
          )}

          {/* Customization */}
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <h2 className="text-xl font-semibold">Customization</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <div className="block text-sm font-medium mb-3">
                  Choose Icon
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {icons.map((iconItem) => (
                    <Button
                      key={iconItem.key}
                      isIconOnly
                      className="h-12 w-12"
                      color={
                        formData.customIcon === iconItem.key
                          ? "primary"
                          : "default"
                      }
                      variant={
                        formData.customIcon === iconItem.key
                          ? "solid"
                          : "bordered"
                      }
                      onPress={() =>
                        handleInputChange("customIcon", iconItem.key)
                      }
                    >
                      {iconItem.icon}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Enable Reminders</p>
                  <p className="text-sm text-gray-500">
                    Get notifications about this insight
                  </p>
                </div>
                <Button
                  color={formData.reminderEnabled ? "success" : "default"}
                  size="sm"
                  startContent={<Bell className="w-4 h-4" />}
                  variant={formData.reminderEnabled ? "solid" : "bordered"}
                  onPress={() =>
                    handleInputChange(
                      "reminderEnabled",
                      !formData.reminderEnabled,
                    )
                  }
                >
                  {formData.reminderEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Preview */}
          {formData.title && (
            <Card className="mb-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Preview
                </h3>
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-full bg-${getSelectedTypeData()?.color}-100 text-${getSelectedTypeData()?.color}-600`}
                  >
                    {
                      icons.find((icon) => icon.key === formData.customIcon)
                        ?.icon
                    }
                  </div>
                  <div>
                    <h4 className="font-semibold">{formData.title}</h4>
                    <Chip
                      color={getSelectedTypeData()?.color as any}
                      size="sm"
                      variant="flat"
                    >
                      {getSelectedTypeData()?.label}
                    </Chip>
                  </div>
                </div>
                {formData.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {formData.description}
                  </p>
                )}
                {formData.category && (
                  <Chip size="sm" variant="bordered">
                    {
                      categories.find((cat) => cat.key === formData.category)
                        ?.label
                    }
                  </Chip>
                )}
              </CardBody>
            </Card>
          )}

          {/* Action Buttons */}
          <Card className="shadow-lg">
            <CardBody className="flex flex-row gap-3 justify-end">
              <Button
                disabled={isLoading}
                variant="light"
                onPress={() => router.push("/insight")}
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
                {isLoading ? "Creating..." : "Create Insight"}
              </Button>
            </CardBody>
          </Card>
        </form>
      </div>
    </div>
  );
}
