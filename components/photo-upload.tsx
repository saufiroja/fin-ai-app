"use client";
import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { UploadCloud } from "lucide-react";
import { Progress } from "@heroui/progress";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  uploadReceipt,
  getReceiptDetails,
  clearReceipt,
} from "@/lib/redux/receiptSlice";
import { ReceiptConfirmation } from "@/components/receipt-confirmation";

export const PhotoUpload: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const { currentReceipt, error } = useSelector(
    (state: RootState) => state.receipt,
  );

  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file || !token) return;

    setUploading(true);

    // Upload receipt
    const uploadResult = await dispatch(
      uploadReceipt({ token, file }),
    ).unwrap();

    // Get receipt details after upload
    await dispatch(
      getReceiptDetails({
        receiptId: uploadResult.receipt_id,
        token,
      }),
    ).unwrap();

    // Show confirmation
    setShowConfirmation(true);
    setUploading(false);
  };

  const handleConfirmation = () => {
    // Reset everything after confirmation and navigate to receipt list
    setFile(null);
    setShowConfirmation(false);
    dispatch(clearReceipt());

    // Navigate to receipt list to see the uploaded receipt
    router.push("/receipt");
  };

  const handleCancel = () => {
    // Reset everything if cancelled
    setFile(null);
    setShowConfirmation(false);
    dispatch(clearReceipt());
  };

  const handleReset = () => {
    setFile(null);
    setUploading(false);
    dispatch(clearReceipt());
  };

  if (showConfirmation && currentReceipt) {
    return (
      <ReceiptConfirmation
        onCancel={handleCancel}
        onConfirm={handleConfirmation}
      />
    );
  }

  return (
    <Card
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-default-300 bg-background"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardBody>
        {file ? (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative">
              <Image
                alt="Uploaded preview"
                className="max-h-48 mx-auto object-contain rounded-xl border border-default-200 shadow-sm"
                height={200}
                src={URL.createObjectURL(file)}
                width={300}
              />
            </div>

            {/* File Name */}
            <div className="text-default-600 font-medium">{file.name}</div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon
                    className="w-5 h-5 text-danger-600"
                    icon="lucide:alert-circle"
                  />
                  <p className="text-danger-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <Progress
                  isIndeterminate
                  aria-label="Uploading receipt..."
                  className="w-full"
                  color="primary"
                  size="sm"
                />
                <p className="text-sm text-default-500">
                  Mengupload dan memproses struk...
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {!uploading && (
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  color="primary"
                  startContent={
                    <Icon className="w-4 h-4" icon="lucide:upload" />
                  }
                  onPress={handleUpload}
                >
                  Upload & Proses Struk
                </Button>
                <Button variant="light" onPress={handleReset}>
                  Pilih Foto Lain
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center gap-4 cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onClick={handleButtonClick}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && handleButtonClick()
            }
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-default-100 dark:bg-default-900 mb-2">
              <UploadCloud className="w-10 h-10 text-default-400" />
            </div>
            <div className="text-default-600 mb-2">
              <p className="text-lg font-medium mb-2">Upload Foto Struk</p>
              <p className="text-sm text-default-500">
                Drag & drop atau klik area ini untuk memilih foto struk
              </p>
              <p className="text-xs text-default-400 mt-1">
                Format: JPG, PNG (max 50MB)
              </p>
            </div>
            <Input
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              type="file"
              onChange={handleFileInput}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
};
