'use client';
import React from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/button';

export const PhotoUpload: React.FC = () => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
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

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-primary bg-primary/10' : 'border-default-300'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {file ? (
        <div className='space-y-4'>
          <img
            src={URL.createObjectURL(file)}
            alt='Uploaded preview'
            className='max-h-48 mx-auto object-contain'
          />
          <p className='text-default-600'>{file.name}</p>
          <Button color='primary' onPress={() => setFile(null)}>
            Upload Another Photo
          </Button>
        </div>
      ) : (
        <>
          <Icon
            icon='lucide:upload-cloud'
            className='w-16 h-16 mx-auto text-default-400 mb-4'
          />
          <p className='text-default-600 mb-4'>
            Drag and drop your photo here, or click to select (max 50MB)
          </p>
          <Button color='primary' onPress={handleButtonClick}>
            Select Photo
          </Button>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileInput}
            accept='image/*'
            className='hidden'
          />
        </>
      )}
    </div>
  );
};
