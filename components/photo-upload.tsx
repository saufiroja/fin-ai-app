'use client';
import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { UploadCloud } from 'lucide-react';
import { getLocalTimeZone } from '@internationalized/date';
import { Progress } from '@heroui/progress';
import { Form as HeroForm } from '@heroui/form';
import { Input as HeroInput } from '@heroui/input';
import { Select, SelectSection, SelectItem } from '@heroui/select';

// Dummy transaction extraction for receipt
const extractTransactionFromReceipt = (file: File) => {
  // Simulate extracting transaction from receipt image
  return {
    date: new Date().toLocaleDateString('id-ID'),
    desc: 'Receipt Transaction',
    category: 'Food',
    amount: 50000,
    type: 'Pengeluaran',
  };
};

export const PhotoUpload: React.FC = () => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [transaction, setTransaction] = React.useState<any>(null);
  const [editMode, setEditMode] = React.useState(false);
  const [editTransaction, setEditTransaction] = React.useState<any>(null);
  const [saved, setSaved] = React.useState(false);
  const [showSavedMsg, setShowSavedMsg] = React.useState(false);
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
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
    }
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleUpload = () => {
    setUploading(true);
    setProgress(0);
    setTransaction(null);
    // Simulate upload
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          // Simulate extracting transaction from receipt
          if (file) {
            const extracted = extractTransactionFromReceipt(file);
            setTransaction({
              ...extracted,
              type: extracted.type || 'Pengeluaran',
            });
          }
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };
  const handleEdit = () => {
    setEditTransaction({
      ...transaction,
      type: transaction.type || 'Pengeluaran',
    });
    setEditMode(true);
  };
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditTransaction((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    setTransaction(editTransaction);
    setEditMode(false);
    setSaved(true);
    setShowSavedMsg(true);
    setTimeout(() => {
      setSaved(false);
      setShowSavedMsg(false);
      setFile(null);
      setTransaction(null);
      setEditTransaction(null);
      setProgress(0);
      setUploading(false);
      setEditMode(false);
    }, 1200);
  };

  return (
    <Card
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-default-300 bg-background'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardBody>
        {file ? (
          <div className='space-y-4'>
            <img
              src={URL.createObjectURL(file)}
              alt='Uploaded preview'
              className='max-h-48 mx-auto object-contain rounded-xl border border-default-200 shadow-sm'
            />
            <div className='text-default-600 font-medium'>{file.name}</div>
            {uploading ? (
              <Progress
                value={progress}
                maxValue={100}
                aria-label='Uploading...'
                className='w-full h-2 rounded bg-default-100'
                size='sm'
              />
            ) : transaction ? (
              <div className='mt-4 p-4 rounded-xl bg-default-100 text-left'>
                <div className='font-semibold mb-2'>
                  Transaction Extracted from Receipt:
                </div>
                {editMode ? (
                  <HeroForm
                    className='flex flex-col gap-2'
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <HeroInput
                      label='Date'
                      name='date'
                      value={editTransaction.date}
                      onChange={handleEditChange}
                      className='border rounded px-2 py-1'
                    />
                    <HeroInput
                      label='Description'
                      name='desc'
                      value={editTransaction.desc}
                      onChange={handleEditChange}
                      className='border rounded px-2 py-1'
                    />
                    <HeroInput
                      label='Category'
                      name='category'
                      value={editTransaction.category}
                      onChange={handleEditChange}
                      className='border rounded px-2 py-1'
                    />
                    <HeroInput
                      label='Amount'
                      name='amount'
                      type='number'
                      value={editTransaction.amount}
                      onChange={handleEditChange}
                      className='border rounded px-2 py-1'
                    />
                    <Select
                      label='Type'
                      name='type'
                      selectedKeys={[editTransaction.type]}
                      onSelectionChange={(keys) =>
                        handleEditChange({
                          target: {
                            name: 'type',
                            value: Array.isArray(keys) ? keys[0] : keys,
                          },
                        } as any)
                      }
                      className='border rounded px-2 py-1'
                    >
                      <SelectSection>
                        <SelectItem key='Pemasukan'>Pemasukan</SelectItem>
                        <SelectItem key='Pengeluaran'>Pengeluaran</SelectItem>
                      </SelectSection>
                    </Select>
                    <div className='flex gap-2 mt-2'>
                      <Button
                        color='primary'
                        onPress={handleSave}
                        type='button'
                      >
                        Save
                      </Button>
                      <Button
                        color='secondary'
                        onPress={() => setEditMode(false)}
                        type='button'
                      >
                        Cancel
                      </Button>
                    </div>
                  </HeroForm>
                ) : (
                  <>
                    <div className='flex flex-col gap-1'>
                      <span>
                        <b>Date:</b> {transaction.date}
                      </span>
                      <span>
                        <b>Description:</b> {transaction.desc}
                      </span>
                      <span>
                        <b>Category:</b> {transaction.category}
                      </span>
                      <span>
                        <b>Amount:</b> Rp{' '}
                        {Number(transaction.amount).toLocaleString('id-ID')}
                      </span>
                      <span>
                        <b>Type:</b> {transaction.type}
                      </span>
                    </div>
                    <div className='flex gap-2 mt-4'>
                      <Button
                        color='primary'
                        onPress={() => {
                          setEditTransaction(transaction);
                          setTransaction(transaction);
                          setSaved(true);
                          setShowSavedMsg(true);
                          setTimeout(() => {
                            setSaved(false);
                            setShowSavedMsg(false);
                            setFile(null);
                            setTransaction(null);
                            setEditTransaction(null);
                            setProgress(0);
                            setUploading(false);
                            setEditMode(false);
                          }, 1200);
                        }}
                        type='button'
                      >
                        Save
                      </Button>
                      <Button
                        color='primary'
                        onPress={handleEdit}
                        type='button'
                      >
                        Edit
                      </Button>
                      <Button
                        color='danger'
                        onPress={() => setFile(null)}
                        type='button'
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className='flex flex-col gap-2'>
                <Button
                  color='primary'
                  onPress={handleUpload}
                  disabled={uploading}
                >
                  Upload Photo
                </Button>
                <Button variant='light' onPress={() => setFile(null)}>
                  Choose Another
                </Button>
              </div>
            )}
            {showSavedMsg && (
              <div className='text-success-600 font-semibold py-2'>
                Transaction saved successfully!
              </div>
            )}
          </div>
        ) : (
          <div
            className='flex flex-col items-center gap-4 cursor-pointer select-none'
            onClick={handleButtonClick}
            tabIndex={0}
            role='button'
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && handleButtonClick()
            }
          >
            <div className='flex items-center justify-center w-20 h-20 rounded-full bg-default-100 dark:bg-default-900 mb-2'>
              <UploadCloud className='w-10 h-10 text-default-400' />
            </div>
            <div className='text-default-600 mb-2'>
              Drag & drop atau klik area ini untuk memilih foto (max 50MB)
            </div>
            <Input
              type='file'
              ref={fileInputRef}
              onChange={handleFileInput}
              accept='image/*'
              className='hidden'
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
};
