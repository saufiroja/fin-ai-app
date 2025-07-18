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
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Shield,
  Camera,
  LogOut,
  Trash2,
} from "lucide-react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import Loading from "./loading";

import { ThemeSwitch } from "@/components/theme-switch";
import { getUserMe } from "@/lib/redux/userSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";

export default function SettingPage() {
  const dispatch: AppDispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { currentUser, loading: userLoading } = useSelector(
    (state: RootState) => state.user,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "Software developer passionate about building great user experiences.",
    language: "en",
    timezone: "UTC+7",
  });

  // Get first letter of user's name or default to "U"
  const getAvatarInitial = () => {
    if (currentUser?.full_name) {
      return currentUser.full_name.charAt(0).toUpperCase();
    }
    if (currentUser?.name) {
      return currentUser.name.charAt(0).toUpperCase();
    }
    if (currentUser?.avatar) {
      return currentUser.avatar.toUpperCase();
    }

    return "U";
  };

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Fetch user data when component mounts
    if (token && !currentUser) {
      dispatch(getUserMe(token));
    }
  }, [token, currentUser, dispatch]);

  useEffect(() => {
    // Update form data when user data is loaded
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.full_name || currentUser.name || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      console.log("User logged out");

      // Clear access_token cookie using js-cookie
      Cookies.remove("access_token");
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("access_token", {
        path: "/",
        domain: window.location.hostname,
      });

      // Redirect to login page
      window.location.href = "/login";

      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      // Simulate delete account API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Account deleted");
      window.location.href = "/register";
    } catch (error) {
      console.error("Error deleting account:", error);
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
  if (isLoading || userLoading) {
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
                <Button
                  className="justify-start"
                  color="primary"
                  startContent={<LogOut size={18} />}
                  variant={activeTab === "account" ? "solid" : "light"}
                  onPress={() => setActiveTab("account")}
                >
                  Account
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
                          className="w-20 h-20 text-white font-semibold"
                          color="primary"
                          name={getAvatarInitial()}
                          size="lg"
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
                          {currentUser?.full_name ||
                            currentUser?.name ||
                            "User"}
                        </h3>
                        <p className="text-default-500">
                          {currentUser?.email || "No email"}
                        </p>
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

                {activeTab === "account" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Account Management
                      </h3>

                      {/* Logout Section */}
                      <div className="space-y-4">
                        <div className="p-4 bg-default-50 rounded-lg border border-default-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Sign Out</h4>
                              <p className="text-sm text-default-500">
                                Sign out from your account on this device
                              </p>
                            </div>
                            <Button
                              color="primary"
                              isLoading={isLoggingOut}
                              startContent={<LogOut size={18} />}
                              variant="flat"
                              onPress={handleLogout}
                            >
                              {isLoggingOut ? "Signing Out..." : "Sign Out"}
                            </Button>
                          </div>
                        </div>

                        {/* Account Data Export */}
                        <div className="p-4 bg-default-50 rounded-lg border border-default-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Export Data</h4>
                              <p className="text-sm text-default-500">
                                Download a copy of your account data
                              </p>
                            </div>
                            <Button color="default" variant="flat">
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Divider />

                    {/* Danger Zone */}
                    <div>
                      <h4 className="font-medium text-danger mb-3">
                        Danger Zone
                      </h4>
                      <div className="p-4 bg-danger-50 rounded-lg border border-danger-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-danger">
                              Delete Account
                            </h4>
                            <p className="text-sm text-danger-600">
                              Permanently delete your account and all data. This
                              action cannot be undone.
                            </p>
                          </div>
                          <Button
                            color="danger"
                            startContent={<Trash2 size={18} />}
                            variant="flat"
                            onPress={handleDeleteAccount}
                          >
                            Delete Account
                          </Button>
                        </div>
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
