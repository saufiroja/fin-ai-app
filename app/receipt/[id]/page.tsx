"use client";
import React, { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  getReceiptDetails,
  confirmReceipt,
  clearError,
} from "@/lib/redux/receiptSlice";
import {
  navigateToScanTab,
  navigateToReceiptList,
} from "@/lib/utils/navigation";

export default function ReceiptDetailPage() {
  const router = useRouter();
  const params = useParams();
  const receiptId = params.id as string;

  const dispatch: AppDispatch = useDispatch();
  const { currentReceipt, loading, error } = useSelector(
    (state: RootState) => state.receipt,
  );
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && receiptId) {
      dispatch(getReceiptDetails({ token, receiptId }));
    }
  }, [token, receiptId, dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy, HH:mm", {
        locale: id,
      });
    } catch {
      return dateString;
    }
  };

  const handleConfirm = async () => {
    if (!token || !currentReceipt) return;

    await dispatch(
      confirmReceipt({ token, receiptId: currentReceipt.receipt_id }),
    ).unwrap();
  };

  const handleBack = () => {
    router.push("/receipt");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm sm:text-base text-default-600">
            Memuat detail receipt...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-8 max-w-2xl">
        <Card className="border-danger-200 bg-danger-50">
          <CardBody className="text-center py-8 sm:py-12 px-4 sm:px-6">
            <Icon
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-danger-500"
              icon="lucide:alert-circle"
            />
            <h3 className="text-lg sm:text-xl font-semibold text-danger-600 mb-2">
              Gagal Memuat Receipt
            </h3>
            <p className="text-sm sm:text-base text-danger-500 mb-6 break-words">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button color="danger" variant="light" onPress={handleBack}>
                Kembali
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  dispatch(clearError());
                  if (token && receiptId) {
                    dispatch(getReceiptDetails({ token, receiptId }));
                  }
                }}
              >
                Coba Lagi
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!currentReceipt) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-8 max-w-2xl">
        <Card>
          <CardBody className="text-center py-8 sm:py-12 px-4 sm:px-6">
            <Icon
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-default-300"
              icon="lucide:receipt"
            />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Receipt Tidak Ditemukan
            </h3>
            <p className="text-sm sm:text-base text-default-600 mb-6">
              Receipt yang Anda cari tidak dapat ditemukan.
            </p>
            <Button color="primary" onPress={handleBack}>
              Kembali ke Daftar Receipt
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const subtotal = currentReceipt.subtotal || currentReceipt.sub_total || 0;

  return (
    <motion.div
      animate="visible"
      className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-3xl"
      initial="hidden"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        variants={itemVariants}
      >
        <Button isIconOnly variant="light" onPress={handleBack}>
          <Icon className="w-5 h-5" icon="lucide:arrow-left" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
            Detail Receipt
          </h1>
          <p className="text-sm sm:text-base text-default-600 truncate">
            ID: {currentReceipt.receipt_id.slice(-12)}
          </p>
        </div>
      </motion.div>

      {/* Receipt Info Card */}
      <motion.div variants={itemVariants}>
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-6">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                <Icon
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600"
                  icon="lucide:receipt"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold truncate">
                  Informasi Receipt
                </h3>
                <p className="text-xs sm:text-sm text-default-500 truncate">
                  Detail transaksi dan merchant
                </p>
              </div>
            </div>
            <Chip
              className="sm:text-base"
              color={currentReceipt.confirmed ? "success" : "warning"}
              size="sm"
              variant="flat"
            >
              {currentReceipt.confirmed ? "Completed" : "Pending"}
            </Chip>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <span className="text-xs sm:text-sm font-medium text-default-600">
                  Nama Merchant
                </span>
                <p className="text-lg sm:text-xl font-semibold mt-1 break-words">
                  {currentReceipt.merchant_name}
                </p>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-medium text-default-600">
                  Tanggal Transaksi
                </span>
                <p className="text-sm sm:text-lg mt-1">
                  {formatDate(currentReceipt.transaction_date)}
                </p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-default-50 rounded-lg p-4 sm:p-6">
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                Ringkasan Keuangan
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-default-600">
                    Subtotal:
                  </span>
                  <span className="font-medium text-sm sm:text-lg">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-default-600">
                    Total Diskon:
                  </span>
                  <span
                    className={`font-medium text-sm sm:text-lg ${
                      currentReceipt.total_discount < 0
                        ? "text-success-600"
                        : "text-default-900"
                    }`}
                  >
                    {formatCurrency(currentReceipt.total_discount)}
                  </span>
                </div>
                <Divider />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base sm:text-xl">
                    Total Belanja:
                  </span>
                  <span className="font-bold text-lg sm:text-2xl text-primary-600">
                    {formatCurrency(currentReceipt.total_shopping)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {!currentReceipt.confirmed && (
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  color="primary"
                  isLoading={loading}
                  size="lg"
                  onPress={handleConfirm}
                >
                  <span className="hidden sm:inline">Konfirmasi Data</span>
                  <span className="sm:hidden">Konfirmasi</span>
                </Button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                className="flex-1"
                color="default"
                size="lg"
                startContent={<Icon className="w-4 h-4" icon="lucide:list" />}
                variant="bordered"
                onPress={() => navigateToReceiptList(router)}
              >
                <span className="hidden sm:inline">Semua Receipt</span>
                <span className="sm:hidden">Daftar Receipt</span>
              </Button>
              <Button
                className="flex-1"
                color="secondary"
                size="lg"
                startContent={<Icon className="w-4 h-4" icon="lucide:scan" />}
                variant="solid"
                onPress={() => navigateToScanTab(router)}
              >
                Scan Lagi
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Items List */}
      {currentReceipt.items && currentReceipt.items.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success-100 rounded-lg flex-shrink-0">
                  <Icon
                    className="w-5 h-5 sm:w-6 sm:h-6 text-success-600"
                    icon="lucide:shopping-bag"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Detail Item
                  </h3>
                  <p className="text-xs sm:text-sm text-default-500">
                    {currentReceipt.items.length} item dibeli
                  </p>
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              <div className="divide-y">
                {currentReceipt.items.map((item, index) => (
                  <motion.div
                    key={item.receipt_item_id}
                    className="p-4 sm:p-6 hover:bg-default-50 transition-colors"
                    custom={index}
                    variants={itemVariants}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base sm:text-lg mb-2 break-words">
                          {item.item_name}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-default-600">
                          <div className="flex items-center gap-1">
                            <Icon
                              className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                              icon="lucide:package"
                            />
                            <span>Qty: {item.item_quantity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon
                              className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                              icon="lucide:tag"
                            />
                            <span className="break-all">
                              {formatCurrency(item.item_price)} per item
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <div className="text-lg sm:text-xl font-bold">
                          {formatCurrency(item.item_price_total)}
                        </div>
                        {item.item_discount !== 0 && (
                          <div className="text-xs sm:text-sm text-success-600 mt-1">
                            Diskon: {formatCurrency(item.item_discount)}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Metadata */}
      <motion.div className="mt-4 sm:mt-6" variants={itemVariants}>
        <Card>
          <CardBody className="p-4 sm:p-6">
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
              Informasi Tambahan
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row">
                <span className="text-default-600 font-medium sm:w-24 flex-shrink-0">
                  Dibuat:
                </span>
                <span className="sm:ml-2 break-words">
                  {formatDate(currentReceipt.created_at)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="text-default-600 font-medium sm:w-24 flex-shrink-0">
                  Diperbarui:
                </span>
                <span className="sm:ml-2 break-words">
                  {formatDate(currentReceipt.updated_at)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="text-default-600 font-medium sm:w-24 flex-shrink-0">
                  User ID:
                </span>
                <span className="sm:ml-2 font-mono text-xs break-all">
                  {currentReceipt.user_id}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="text-default-600 font-medium sm:w-24 flex-shrink-0">
                  Receipt ID:
                </span>
                <span className="sm:ml-2 font-mono text-xs break-all">
                  {currentReceipt.receipt_id}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
}
