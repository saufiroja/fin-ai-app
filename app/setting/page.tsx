"use client";
import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Switch } from "@heroui/switch";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { User, Mail, Lock, Bell, Globe, Shield, Camera } from "lucide-react";

import Loading from "./loading";

import { ThemeSwitch } from "@/components/theme-switch";

export default function SettingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Software developer passionate about building great user experiences.",
    language: "en",
    timezone: "UTC+7",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Simulate loading user settings
    const loadSettings = async () => {
      try {
        // Simulate API call to fetch user settings
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Settings would be loaded from API here
        console.log("Settings loaded");
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form submitted:", { formData, notifications });
      // Handle form submission here
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const languages = [
    { key: "en", label: "English" },
    { key: "id", label: "Bahasa Indonesia" },
    { key: "es", label: "Español" },
    { key: "fr", label: "Français" },
    { key: "de", label: "Deutsch" },
  ];

  const timezones = [
    { key: "UTC+7", label: "UTC+7 (Jakarta)" },
    { key: "UTC+0", label: "UTC+0 (London)" },
    { key: "UTC-5", label: "UTC-5 (New York)" },
    { key: "UTC+9", label: "UTC+9 (Tokyo)" },
  ];

  // Show loading skeleton
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center items-start">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation Tabs */}
          <Card className="lg:col-span-1 h-fit">
            <CardBody className="p-4">
              <div className="flex flex-col gap-2">
                <Button
                  className="justify-start"
                  color="primary"
                  startContent={<User size={18} />}
                  variant={activeTab === "profile" ? "solid" : "light"}
                  onPress={() => setActiveTab("profile")}
                >
                  Profile
                </Button>
                <Button
                  className="justify-start"
                  color="primary"
                  startContent={<Shield size={18} />}
                  variant={activeTab === "security" ? "solid" : "light"}
                  onPress={() => setActiveTab("security")}
                >
                  Security
                </Button>
                <Button
                  className="justify-start"
                  color="primary"
                  startContent={<Bell size={18} />}
                  variant={activeTab === "notifications" ? "solid" : "light"}
                  onPress={() => setActiveTab("notifications")}
                >
                  Notifications
                </Button>
                <Button
                  className="justify-start"
                  color="primary"
                  startContent={<Globe size={18} />}
                  variant={activeTab === "preferences" ? "solid" : "light"}
                  onPress={() => setActiveTab("preferences")}
                >
                  Preferences
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Main Content */}
          <Card className="lg:col-span-2">
            <CardBody className="p-6">
              <form onSubmit={handleSubmit}>
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <Avatar
                          className="w-20 h-20"
                          size="lg"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                        />
                        <Button
                          isIconOnly
                          className="absolute -bottom-1 -right-1"
                          color="primary"
                          size="sm"
                          variant="solid"
                        >
                          <Camera size={14} />
                        </Button>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {formData.name}
                        </h3>
                        <p className="text-default-500">{formData.email}</p>
                        <Chip
                          className="mt-1"
                          color="success"
                          size="sm"
                          variant="flat"
                        >
                          Verified
                        </Chip>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        required
                        label="Full Name"
                        placeholder="Enter your full name"
                        startContent={
                          <User className="text-default-400" size={18} />
                        }
                        value={formData.name}
                        onValueChange={(value) =>
                          handleInputChange("name", value)
                        }
                      />
                      <Input
                        required
                        label="Email Address"
                        placeholder="Enter your email"
                        startContent={
                          <Mail className="text-default-400" size={18} />
                        }
                        type="email"
                        value={formData.email}
                        onValueChange={(value) =>
                          handleInputChange("email", value)
                        }
                      />
                    </div>

                    <Textarea
                      label="Bio"
                      maxRows={3}
                      placeholder="Tell us about yourself"
                      value={formData.bio}
                      onValueChange={(value) => handleInputChange("bio", value)}
                    />
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Password & Security
                      </h3>
                      <div className="space-y-4">
                        <Input
                          label="Current Password"
                          placeholder="Enter current password"
                          startContent={
                            <Lock className="text-default-400" size={18} />
                          }
                          type="password"
                        />
                        <Input
                          label="New Password"
                          placeholder="Enter new password"
                          startContent={
                            <Lock className="text-default-400" size={18} />
                          }
                          type="password"
                        />
                        <Input
                          label="Confirm New Password"
                          placeholder="Confirm new password"
                          startContent={
                            <Lock className="text-default-400" size={18} />
                          }
                          type="password"
                        />
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <h4 className="font-medium mb-3">
                        Two-Factor Authentication
                      </h4>
                      <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                        <div>
                          <p className="font-medium">SMS Authentication</p>
                          <p className="text-sm text-default-500">
                            Receive codes via SMS
                          </p>
                        </div>
                        <Switch defaultSelected />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Login Sessions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-default-500">
                              Chrome on Windows • Jakarta, Indonesia
                            </p>
                          </div>
                          <Chip color="success" size="sm" variant="dot">
                            Active
                          </Chip>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
                          <div>
                            <p className="font-medium">Mobile App</p>
                            <p className="text-sm text-default-500">
                              iPhone • Last active 2 hours ago
                            </p>
                          </div>
                          <Button color="danger" size="sm" variant="light">
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Notification Preferences
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-default-500">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch
                            isSelected={notifications.email}
                            onValueChange={(value) =>
                              handleNotificationChange("email", value)
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-default-500">
                              Receive push notifications on your device
                            </p>
                          </div>
                          <Switch
                            isSelected={notifications.push}
                            onValueChange={(value) =>
                              handleNotificationChange("push", value)
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                          <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-default-500">
                              Receive updates about new features and offers
                            </p>
                          </div>
                          <Switch
                            isSelected={notifications.marketing}
                            onValueChange={(value) =>
                              handleNotificationChange("marketing", value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "preferences" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Language & Region
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                          label="Language"
                          placeholder="Select language"
                          selectedKeys={[formData.language]}
                          onSelectionChange={(keys) =>
                            handleInputChange(
                              "language",
                              Array.from(keys)[0] as string,
                            )
                          }
                        >
                          {languages.map((lang) => (
                            <SelectItem key={lang.key} textValue={lang.key}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          label="Timezone"
                          placeholder="Select timezone"
                          selectedKeys={[formData.timezone]}
                          onSelectionChange={(keys) =>
                            handleInputChange(
                              "timezone",
                              Array.from(keys)[0] as string,
                            )
                          }
                        >
                          {timezones.map((tz) => (
                            <SelectItem key={tz.key} textValue={tz.key}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <h4 className="font-medium mb-3">Theme Preferences</h4>
                      <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-default-500">
                            Use dark theme across the application
                          </p>
                        </div>
                        <ThemeSwitch />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-default-200">
                  <Button color="default" disabled={isSaving} variant="light">
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    disabled={isSaving}
                    isLoading={isSaving}
                    type="submit"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
