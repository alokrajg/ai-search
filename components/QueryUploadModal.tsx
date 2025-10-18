"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface QueryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

interface UploadResult {
  success: boolean;
  message: string;
  data?: {
    queries_imported: number;
    queries_processed: number;
    citations_found: number;
  };
}

export default function QueryUploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: QueryUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setUploadResult({
        success: false,
        message: "Please upload a CSV file",
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/v1/upload/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: result.message,
          data: result.data,
        });

        // Note: Query processing will happen in the background
        // You can manually trigger it from the dashboard
      } else {
        setUploadResult({
          success: false,
          message: result.detail || "Upload failed",
        });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const processQueries = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/v1/upload/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult((prev) =>
          prev
            ? {
                ...prev,
                data: {
                  ...prev.data,
                  queries_processed: result.data?.queries_processed || 0,
                  citations_found: result.data?.citations_found || 0,
                },
              }
            : null
        );

        // Notify parent component
        onUploadComplete();
      } else {
        setUploadResult((prev) =>
          prev
            ? {
                ...prev,
                message: `Processing failed: ${
                  result.detail || "Unknown error"
                }`,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Error processing queries:", error);
      setUploadResult((prev) =>
        prev
          ? {
              ...prev,
              message: "Processing failed: Network error",
            }
          : null
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setUploadResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-600 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Upload className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add Queries</h2>
              <p className="text-sm text-gray-300">
                Upload CSV file to add and run queries
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!uploadResult ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Upload Query CSV File
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Drag and drop your CSV file here, or click to browse
                  </p>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2 inline" />
                        Choose File
                      </>
                    )}
                  </button>
                </div>

                <div className="text-sm text-gray-400">
                  <p>CSV format should include:</p>
                  <p className="font-mono text-xs mt-1">
                    brand_name, text, category, engine_targets, active
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upload Result */}
              <div
                className={`p-4 rounded-lg border ${
                  uploadResult.success
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {uploadResult.success ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <h3
                      className={`font-medium ${
                        uploadResult.success ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {uploadResult.success
                        ? "Upload Successful"
                        : "Upload Failed"}
                    </h3>
                    <p className="text-gray-300 mt-1">{uploadResult.message}</p>
                  </div>
                </div>
              </div>

              {/* Results Data */}
              {uploadResult.success && uploadResult.data && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-500">
                      {uploadResult.data.queries_imported}
                    </div>
                    <div className="text-sm text-gray-300">
                      Queries Imported
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-500">
                      {uploadResult.data.queries_processed}
                    </div>
                    <div className="text-sm text-gray-300">
                      Queries Processed
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-500">
                      {uploadResult.data.citations_found}
                    </div>
                    <div className="text-sm text-gray-300">Citations Found</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Close
                </button>
                {uploadResult.success && (
                  <>
                    <button
                      onClick={processQueries}
                      disabled={isProcessing}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                          Processing...
                        </>
                      ) : (
                        "Process Queries"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setUploadResult(null);
                        onUploadComplete();
                      }}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      View Results
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
