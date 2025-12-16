import React from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/ui/lib/components/ui/button";
import { Skeleton } from "@/ui/lib/components/ui/skeleton";

import { useSchemaController } from "@/application/schema/schema.controller";
import DataSchemaForm from "../components/DataSchemaForm.view";
import { DataSchemaListView } from "../components/DataSchemaList.view";

export default function DataSchemaPage() {
  const {
    schemas,
    isModalOpen,
    notification,
    isLoading,
    showAddSchemaForm,
    onCloseModal,
    onSubmitSchema,
    clearNotification,
  } = useSchemaController();

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/30">
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Data Schemas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your data structures and validation rules.
          </p>
        </div>
        
        <Button onClick={showAddSchemaForm} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Schema
        </Button>
      </div>

      {isLoading && schemas.length === 0 ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : (
        <DataSchemaListView 
          schemas={schemas} 
          onEdit={() => {}} 
        />
      )}

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
              notification.type === "success"
                ? "bg-white border-green-200 text-green-700"
                : "bg-white border-red-200 text-red-700"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${
               notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`} />
            
            {notification.message}

            {clearNotification && (
                <button onClick={clearNotification} className="ml-2 hover:opacity-70">
                    <X className="h-4 w-4" />
                </button>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={onCloseModal}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex-1 overflow-y-auto">
              <DataSchemaForm 
                onSubmit={onSubmitSchema} 
                onCancel={onCloseModal} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}