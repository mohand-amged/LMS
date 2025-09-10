'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, File, Image, Video, Music, Archive } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';

interface FileUploadProps {
  onFileUpload: (files: FileList) => Promise<void>;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  courseId?: string;
}

interface UploadProgress {
  [key: string]: number;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return Image;
  if (fileType.startsWith('video/')) return Video;
  if (fileType.startsWith('audio/')) return Music;
  if (fileType.includes('zip') || fileType.includes('rar')) return Archive;
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileUpload({
  onFileUpload,
  multiple = false,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = '',
  courseId
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, []);

  const handleFileSelection = (files: File[]) => {
    // Filter files by size
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`);
        return false;
      }
      return true;
    });

    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    } else {
      setSelectedFiles(validFiles.slice(0, 1));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelection(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileKey = `${file.name}-${file.size}`;
        
        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        if (courseId) formData.append('courseId', courseId);
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileKey]: Math.min((prev[fileKey] || 0) + 10, 90)
          }));
        }, 100);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          
          clearInterval(progressInterval);
          
          if (!response.ok) {
            throw new Error(result.error || 'Upload failed');
          }
          
          setUploadProgress(prev => ({
            ...prev,
            [fileKey]: 100
          }));
          
        } catch (error) {
          clearInterval(progressInterval);
          throw error;
        }
      }
      
      // Call the callback with all files
      const fileList = selectedFiles.reduce((dt, file) => {
        dt.items.add(file);
        return dt;
      }, new DataTransfer()).files;
      
      await onFileUpload(fileList);
      
      // Clear selected files after successful upload
      setTimeout(() => {
        setSelectedFiles([]);
        setUploadProgress({});
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragOver ? 'Drop files here' : 'Drag and drop files here, or click to browse'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: {formatFileSize(maxSize)}
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
      />

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Selected Files</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => {
              const fileKey = `${file.name}-${file.size}`;
              const progress = uploadProgress[fileKey] || 0;
              const FileIcon = getFileIcon(file.type);
              
              return (
                <div
                  key={fileKey}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <FileIcon className="h-6 w-6 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      {progress > 0 && progress < 100 && (
                        <Progress value={progress} className="mt-1" />
                      )}
                      {progress === 100 && (
                        <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                      )}
                    </div>
                  </div>
                  {!isUploading && progress < 100 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={uploadFiles}
            disabled={isUploading}
            className="min-w-[120px]"
          >
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
}
