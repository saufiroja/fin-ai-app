"use client";
import React, { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";

import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  confirmReceipt,
  clearReceipt,
  clearReceiptsError,
} from "@/lib/redux/receiptSlice";
import { navigateToReceiptList } from "@/lib/utils/navigation";

interface ReceiptConfirmationProps {
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ReceiptConfirmation: React.FC<ReceiptConfirmationProps> = ({
  onConfirm,
  onCancel,
}) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { currentReceipt, loading, error } = useSelector(
    (state: RootState) => state.receipt,
  );
  const { token } = useSelector((state: RootState) => state.auth);

  // Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearReceiptsError());
  }, [dispatch]);

  if (!currentReceipt) {
    return null;
  }

  const handleConfirm = async () => {
    if (!token) {
      return;
    }

    // Clear any existing errors before attempting
    dispatch(clearReceiptsError());

    await dispatch(
      confirmReceipt({ token, receiptId: currentReceipt.receipt_id }),
    ).unwrap();
    onConfirm?.();
  };

  const handleCancel = () => {
    dispatch(clearReceiptsError());
    dispatch(clearReceipt());
    onCancel?.();
  };

  const handleSeeAllReceipts = () => {
    navigateToReceiptList(router);
  };

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

  const subtotal = currentReceipt.subtotal || currentReceipt.sub_total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <Icon
                className="w-6 h-6 text-success-600"
                icon="lucide:receipt"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Konfirmasi Receipt</h3>
              <p className="text-sm text-default-500">
                Pastikan data berikut sudah benar
              </p>
            </div>
          </div>
          <Chip
            className="ml-2"
            color={currentReceipt.confirmed ? "success" : "warning"}
            size="sm"
            variant="flat"
          >
            {currentReceipt.confirmed ? "Completed" : "Pending"}
          </Chip>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          {/* Receipt Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-default-600">
                Merchant
              </span>
              <p className="text-lg font-semibold">
                {currentReceipt.merchant_name}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-default-600">
                Tanggal Transaksi
              </span>
              <p className="text-lg">
                {formatDate(currentReceipt.transaction_date)}
              </p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-default-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Ringkasan Keuangan</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-default-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-600">Total Diskon:</span>
                <span
                  className={`font-medium ${
                    currentReceipt.total_discount < 0
                      ? "text-success-600"
                      : "text-default-900"
                  }`}
                >
                  {formatCurrency(currentReceipt.total_discount)}
                </span>
              </div>
              <Divider />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Belanja:</span>
                <span>{formatCurrency(currentReceipt.total_shopping)}</span>
              </div>
            </div>
          </div>

          {/* Items List */}
          {currentReceipt.items && currentReceipt.items.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Detail Item</h4>
              <div className="space-y-2">
                {currentReceipt.items.map((item, _index) => (
                  <Card key={item.receipt_item_id} shadow="none">
                    <CardBody className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{item.item_name}</p>
                          <p className="text-sm text-default-500">
                            {item.item_quantity} ×{" "}
                            {formatCurrency(item.item_price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(item.item_price_total)}
                          </p>
                          {item.item_discount !== 0 && (
                            <p className="text-sm text-success-600">
                              Diskon: {formatCurrency(item.item_discount)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Icon
                    className="w-5 h-5 text-danger-600 flex-shrink-0"
                    icon="lucide:alert-circle"
                  />
                  <div className="flex-1">
                    <p className="text-danger-600 text-sm font-medium">
                      Gagal mengkonfirmasi receipt
                    </p>
                    <p className="text-danger-500 text-xs mt-1">
                      {typeof error === "string"
                        ? error
                        : "Terjadi kesalahan. Silakan coba lagi."}
                    </p>
                  </div>
                </div>
                <Button
                  isIconOnly
                  className="min-w-6 w-6 h-6"
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => dispatch(clearReceiptsError())}
                >
                  <Icon className="w-4 h-4" icon="lucide:x" />
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <div className="flex gap-3">
              <Button
                className="flex-1"
                color="primary"
                isLoading={loading}
                size="lg"
                onPress={handleConfirm}
              >
                {currentReceipt.confirmed
                  ? "Sudah Dikonfirmasi"
                  : "Konfirmasi Data"}
              </Button>
              <Button
                color="danger"
                isDisabled={loading}
                size="lg"
                variant="light"
                onPress={handleCancel}
              >
                Batal
              </Button>
            </div>
            <Button
              className="w-full"
              color="default"
              size="lg"
              startContent={<Icon className="w-5 h-5" icon="lucide:list" />}
              variant="bordered"
              onPress={handleSeeAllReceipts}
            >
              Lihat Semua Receipt
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
