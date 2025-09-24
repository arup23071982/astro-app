import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useLanguage } from "@/contexts/LanguageContext";

interface FileUploaderProps {
  onFileUpload: (fileUrl: string) => void;
  accept?: string;
  maxFileSize?: number; // in bytes
  fileType?: string; // for backend upload URL
  placeholder?: string;
  className?: string;
}

export function FileUploader({
  onFileUpload,
  accept = "image/*,.pdf",
  maxFileSize = 5 * 1024 * 1024, // 5MB
  fileType = "aadhar",
  placeholder = "Upload file",
  className = "",
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSize) {
      toast({
        title: t("fileTooLarge") || "File too large",
        description: `File must be smaller than ${Math.round(maxFileSize / (1024 * 1024))}MB`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Get upload URL from backend
      const response = await fetch("/api/objects/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileType }),
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadURL } = await response.json();

      // Upload file directly to object storage
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      setUploadedFile(uploadURL);
      onFileUpload(uploadURL);
      
      toast({
        title: t("fileUploaded") || "File uploaded successfully",
        description: `${selectedFile.name} has been uploaded`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: t("uploadFailed") || "Upload failed",
        description: t("tryAgain") || "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!uploadedFile && !selectedFile && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="relative"
            >
              <File className="w-4 h-4 mr-2" />
              {placeholder}
            </Button>
            <p className="text-sm text-gray-500">
              Max file size: {Math.round(maxFileSize / (1024 * 1024))}MB
            </p>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {selectedFile && !uploadedFile && (
        <Card className="p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={uploadFile}
                disabled={uploading}
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
              <Button
                onClick={removeFile}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {uploadedFile && (
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium text-sm text-green-700 dark:text-green-300">
                  File uploaded successfully
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {selectedFile?.name}
                </p>
              </div>
            </div>
            <Button
              onClick={removeFile}
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}