"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchUserReceipts,
  clearReceiptsError,
} from "@/lib/redux/receiptSlice";
import {
  navigateToScanTab,
  navigateToReceiptDetail,
} from "@/lib/utils/navigation";

export default function ReceiptPage() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { receipts, pagination, fetchingReceipts, receiptsError } = useSelector(
    (state: RootState) => state.receipt,
  );
  const { token } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounced search to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch receipts when parameters change
  useEffect(() => {
    if (token) {
      dispatch(
        fetchUserReceipts({
          token,
          params: {
            limit: itemsPerPage,
            offset: currentPage,
            search: debouncedSearchTerm || undefined,
            sortBy,
            sortOrder,
          },
        }),
      );
    }
  }, [
    token,
    dispatch,
    currentPage,
    itemsPerPage,
    debouncedSearchTerm,
    sortBy,
    sortOrder,
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm", {
        locale: id,
      });
    } catch {
      return dateString;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(newSortBy);
      setSortOrder("DESC");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleReceiptClick = (receiptId: string) => {
    navigateToReceiptDetail(router, receiptId);
  };

  const handleNewReceipt = () => {
    router.push("/");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (fetchingReceipts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-default-600">Memuat receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate="visible"
      className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl"
      initial="hidden"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Daftar Receipt</h1>
            <p className="text-default-600 mt-1 text-sm sm:text-base">
              Kelola dan lihat semua receipt yang telah di-upload
            </p>
          </div>
          <Button
            className="w-full sm:w-auto"
            color="primary"
            endContent={<Icon className="hidden sm:block" icon="lucide:scan" />}
            size="md"
            onPress={() => navigateToScanTab(router)}
          >
            <span className="sm:hidden">Scan Receipt</span>
            <span className="hidden sm:inline">Scan Receipt</span>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <Input
            className="w-full"
            placeholder="Cari berdasarkan nama merchant..."
            size="sm"
            startContent={<Icon icon="lucide:search" />}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />

          {/* Mobile Filter Row */}
          <div className="flex flex-wrap gap-2 sm:hidden">
            <Button
              size="sm"
              variant={sortBy === "created_at" ? "solid" : "bordered"}
              onPress={() => handleSortChange("created_at")}
            >
              Tanggal
            </Button>
            <Button
              size="sm"
              variant={sortBy === "merchant_name" ? "solid" : "bordered"}
              onPress={() => handleSortChange("merchant_name")}
            >
              Merchant
            </Button>
            <Button
              size="sm"
              variant={sortBy === "total_shopping" ? "solid" : "bordered"}
              onPress={() => handleSortChange("total_shopping")}
            >
              Jumlah
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="bordered"
              onPress={() => setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")}
            >
              <Icon
                icon={
                  sortOrder === "ASC" ? "lucide:arrow-up" : "lucide:arrow-down"
                }
              />
            </Button>
          </div>

          {/* Desktop Filter Row */}
          <div className="hidden sm:flex sm:flex-row gap-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={sortBy === "created_at" ? "solid" : "bordered"}
                onPress={() => handleSortChange("created_at")}
              >
                Tanggal
              </Button>
              <Button
                size="sm"
                variant={sortBy === "merchant_name" ? "solid" : "bordered"}
                onPress={() => handleSortChange("merchant_name")}
              >
                Merchant
              </Button>
              <Button
                size="sm"
                variant={sortBy === "total_shopping" ? "solid" : "bordered"}
                onPress={() => handleSortChange("total_shopping")}
              >
                Jumlah
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="bordered"
                onPress={() =>
                  setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
                }
              >
                <Icon
                  icon={
                    sortOrder === "ASC"
                      ? "lucide:arrow-up"
                      : "lucide:arrow-down"
                  }
                />
              </Button>
            </div>
            <Select
              className="w-32"
              selectedKeys={[itemsPerPage.toString()]}
              size="sm"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;

                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectItem key="10">10</SelectItem>
              <SelectItem key="20">20</SelectItem>
              <SelectItem key="50">50</SelectItem>
            </Select>
          </div>

          {/* Mobile Items Per Page */}
          <div className="sm:hidden">
            <Select
              className="w-full"
              label="Items per halaman"
              selectedKeys={[itemsPerPage.toString()]}
              size="sm"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;

                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectItem key="10">10 per halaman</SelectItem>
              <SelectItem key="20">20 per halaman</SelectItem>
              <SelectItem key="50">50 per halaman</SelectItem>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Error State */}
      {receiptsError && (
        <motion.div className="mb-6" variants={itemVariants}>
          <Card className="border-danger-200 bg-danger-50">
            <CardBody>
              <div className="flex items-center gap-3">
                <Icon
                  className="w-5 h-5 text-danger-600"
                  icon="lucide:alert-circle"
                />
                <div>
                  <p className="text-danger-600 font-medium">
                    Gagal memuat receipt
                  </p>
                  <p className="text-danger-500 text-sm">{receiptsError}</p>
                </div>
                <Button
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => dispatch(clearReceiptsError())}
                >
                  Tutup
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Receipt List */}
      {!receipts ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12">
            <CardBody>
              <Icon
                className="w-16 h-16 mx-auto mb-4 text-default-300"
                icon="lucide:receipt"
              />
              <h3 className="text-xl font-semibold mb-2">Belum ada receipt</h3>
              <p className="text-default-600 mb-6">
                {searchTerm
                  ? "Tidak ada receipt yang cocok dengan pencarian"
                  : "Upload receipt pertama Anda untuk mulai melacak transaksi"}
              </p>
              <Button color="primary" onPress={handleNewReceipt}>
                Upload Receipt Pertama
              </Button>
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <>
          <div className="space-y-4">
            {receipts.map((receipt, index) => (
              <motion.div
                key={receipt.receipt_id}
                custom={index}
                variants={itemVariants}
              >
                <Card
                  isPressable
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-primary-200 w-full"
                  onPress={() => handleReceiptClick(receipt.receipt_id)}
                >
                  <CardBody className="p-3 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <div className="p-2 sm:p-3 bg-primary-100 rounded-lg flex-shrink-0">
                          <Icon
                            className="w-4 h-4 sm:w-6 sm:h-6 text-primary-600"
                            icon="lucide:receipt"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold truncate">
                              {receipt.merchant_name}
                            </h3>
                            <Chip
                              className="self-start sm:self-auto"
                              color={receipt.confirmed ? "success" : "warning"}
                              size="sm"
                              variant="flat"
                            >
                              {receipt.confirmed ? "Dikonfirmasi" : "Pending"}
                            </Chip>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-default-600">
                            <div className="flex items-center gap-1">
                              <Icon
                                className="w-3 h-3 sm:w-4 sm:h-4"
                                icon="lucide:calendar"
                              />
                              <span className="truncate">
                                {formatDate(receipt.transaction_date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-lg sm:text-2xl font-bold">
                          {formatCurrency(receipt.total_shopping)}
                        </div>
                        {receipt.total_discount < 0 && (
                          <div className="text-xs sm:text-sm text-success-600">
                            Hemat{" "}
                            {formatCurrency(Math.abs(receipt.total_discount))}
                          </div>
                        )}
                      </div>

                      <Icon
                        className="w-4 h-4 sm:w-5 sm:h-5 text-default-400 ml-2 flex-shrink-0"
                        icon="lucide:chevron-right"
                      />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <motion.div
              className="flex justify-center mt-6 sm:mt-8"
              variants={itemVariants}
            >
              <Pagination
                showControls
                className="gap-1"
                color="primary"
                page={currentPage}
                size="sm"
                total={pagination.total_pages}
                onChange={handlePageChange}
              />
            </motion.div>
          )}
        </>
      )}

      {/* Stats */}
      {receipts && receipts.length > 0 && (
        <motion.div className="mt-6 sm:mt-8" variants={itemVariants}>
          <Card>
            <CardBody className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Statistik Halaman Ini
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-default-900">
                    {pagination.total}
                  </div>
                  <div className="text-xs sm:text-sm text-default-600">
                    Total Receipt
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-success-600">
                    {receipts.filter((r) => r.confirmed).length}
                  </div>
                  <div className="text-xs sm:text-sm text-default-600">
                    Dikonfirmasi
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-default-900">
                    {formatCurrency(
                      receipts.reduce(
                        (sum, receipt) => sum + receipt.total_shopping,
                        0,
                      ),
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-default-600">
                    Total Belanja
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
