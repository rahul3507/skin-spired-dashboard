/** @format */
"use client";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAllSkinConditionQuery,
  useGetSkinConditionByIdQuery,
  useUpdateSkinConditionMutation,
  useCreateSkinConditionMutation,
} from "@/redux/feature/skinConditionAPI";
import { Info, X, Plus, Trash2, Upload } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const SkinCondition = () => {
  return (
    <main className="bg-background2 w-full p-4 md:p-6">
      <section>
        <SkinConditionTable />
      </section>
    </main>
  );
};

export default SkinCondition;

function SkinConditionTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit form states
  const [editForm, setEditForm] = useState<{
    skinType: string;
    symptoms: string;
    treatment: string[];
    image: File | null;
  }>({
    skinType: "",
    symptoms: "",
    treatment: [],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useGetAllSkinConditionQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  // Fetch individual condition details when modal opens
  const { data: conditionDetails, isLoading: isDetailsLoading } =
    useGetSkinConditionByIdQuery(selectedConditionId, {
      skip: !selectedConditionId,
    });

  // Update mutation
  const [updateSkinCondition, { isLoading: isUpdating }] =
    useUpdateSkinConditionMutation();
  const [createSkinCondition, { isLoading: isCreating }] =
    useCreateSkinConditionMutation();

  const conditions = data?.data?.result || [];
  const totalItems = data?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Initialize edit form when condition details are loaded or for create
  useEffect(() => {
    if (conditionDetails?.data && selectedConditionId) {
      setEditForm({
        skinType: conditionDetails.data.skinType || "",
        symptoms: conditionDetails.data.symptmos || "",
        treatment: conditionDetails.data.treatment || [],
        image: null,
      });
      setImagePreview(
        conditionDetails.data.image
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${conditionDetails.data.image}`
          : null
      );
    } else if (!selectedConditionId && isModalOpen) {
      setEditForm({
        skinType: "",
        symptoms: "",
        treatment: ["", "", ""],
        image: null,
      });
      setImagePreview(null);
    }
  }, [conditionDetails, selectedConditionId, isModalOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openConditionModal = (conditionId: string) => {
    setSelectedConditionId(conditionId);
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const openCreateModal = () => {
    setSelectedConditionId(null);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConditionId(null);
    setIsEditMode(false);
    setEditForm({
      skinType: "",
      symptoms: "",
      treatment: [],
      image: null,
    });
    setImagePreview(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTreatmentChange = (index, value) => {
    const newTreatment = [...editForm.treatment];
    newTreatment[index] = value;
    setEditForm((prev) => ({
      ...prev,
      treatment: newTreatment,
    }));
  };

  const addTreatment = () => {
    setEditForm((prev) => ({
      ...prev,
      treatment: [...prev.treatment, ""],
    }));
  };

  const removeTreatment = (index) => {
    const newTreatment = editForm.treatment.filter((_, i) => i !== index);
    setEditForm((prev) => ({
      ...prev,
      treatment: newTreatment,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditForm((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("skinType", editForm.skinType);
      formData.append("symptmos", editForm.symptoms);

      // Add treatment array
      editForm.treatment.forEach((treatment, index) => {
        if (treatment.trim() !== "") {
          formData.append(`treatment[${index}]`, treatment);
        }
      });

      // Add image if selected
      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      if (selectedConditionId) {
        await updateSkinCondition({
          id: selectedConditionId,
          data: formData,
        }).unwrap();
      } else {
        await createSkinCondition(formData).unwrap();
      }

      // Close modal and reset form
      closeModal();
    } catch (error) {
      console.error("Failed to save skin condition:", error);
      // Handle error (show toast, etc.)
    }
  };

  const handleCancel = () => {
    if (selectedConditionId) {
      setIsEditMode(false);
      // Reset form to original values
      if (conditionDetails?.data) {
        setEditForm({
          skinType: conditionDetails.data.skinType || "",
          symptoms: conditionDetails.data.symptmos || "",
          treatment: conditionDetails.data.treatment || [],
          image: null,
        });
        setImagePreview(
          conditionDetails.data.image
            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${conditionDetails.data.image}`
            : null
        );
      }
    } else {
      closeModal();
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="overflow-hidden bg-white rounded-md">
        <h2 className="text-3xl font-medium text-primary py-6 px-3">
          Skin Condition List
        </h2>
        <div className="flex justify-between items-center px-3 pb-6">
          <input
            type="text"
            placeholder="Search by skin type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={openCreateModal}
            className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-white"
          >
            Create Skin Condition
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-black py-8">
              <TableRow>
                <TableHead className="text-[#FFF] text-lg text-center justify-center items-center">
                  Skin Type
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Created Date
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {conditions?.map((condition) => (
                <TableRow key={condition._id}>
                  <TableCell className="text-start text-black text-lg">
                    <div className="flex items-center justify-center gap-2">
                      {condition?.image && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${condition.image}`}
                          className="w-8 h-8 rounded-full object-cover"
                          alt="Skin condition"
                        />
                      )}
                      <span>{condition.skinType || "Unknown Type"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center text-black text-lg">
                    {new Date(condition.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-center text-black text-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openConditionModal(condition._id)}
                    >
                      <Info className="h-6 w-6" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="max-w-sm mx-auto flex items-center justify-between border-t border-gray-200 rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-black px-4 py-3 mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <span className="text-sm text-[#E6E6E6]">Previous</span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    page === currentPage ? "bg-teal-800 text-white" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#E6E6E6]">Next</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Page Info */}
        <div className="text-center text-sm text-gray-600 mt-2">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
          to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          entries
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-6xl mx-4 rounded-xl bg-white shadow-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                {!selectedConditionId
                  ? "Create New Skin Condition"
                  : isEditMode
                  ? "Edit Skin Condition Details"
                  : "Skin Condition Details"}
              </h2>
              <div className="flex items-center gap-2">
                {selectedConditionId && !isEditMode ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-white"
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm"
                      onClick={handleCancel}
                      disabled={isUpdating || isCreating}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="text-sm bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-white "
                      onClick={handleSave}
                      disabled={isUpdating || isCreating}
                    >
                      {isUpdating || isCreating
                        ? "Saving..."
                        : selectedConditionId
                        ? "Save"
                        : "Create"}
                    </Button>
                  </>
                )}
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedConditionId && isDetailsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loading />
                </div>
              ) : selectedConditionId && !conditionDetails?.data ? (
                <div className="text-center py-8">
                  <span className="text-gray-500">
                    Failed to load condition details
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Details */}
                  <div className="space-y-6">
                    {/* Skin Condition */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Skin Condition
                      </label>
                      {isEditMode || !selectedConditionId ? (
                        <input
                          type="text"
                          value={editForm.skinType}
                          onChange={(e) =>
                            handleInputChange("skinType", e.target.value)
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Type skin name"
                        />
                      ) : (
                        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                          <span className="text-gray-900">
                            {conditionDetails.data.skinType || "Unknown"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Symptoms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Symptoms
                      </label>
                      {isEditMode || !selectedConditionId ? (
                        <textarea
                          value={editForm.symptoms}
                          onChange={(e) =>
                            handleInputChange("symptoms", e.target.value)
                          }
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Write skin problem symptoms..."
                        />
                      ) : (
                        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                          <p className="text-gray-900 leading-relaxed">
                            {conditionDetails.data.symptmos ||
                              "No symptoms available"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Treatment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Treatment
                      </label>
                      {isEditMode || !selectedConditionId ? (
                        <div className="space-y-3">
                          {editForm.treatment.map((treatment, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="text"
                                value={treatment}
                                onChange={(e) =>
                                  handleTreatmentChange(index, e.target.value)
                                }
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Treatment type 0${index + 1}..`}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 p-0 text-red-600 hover:text-red-800"
                                onClick={() => removeTreatment(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-10 text-gray-600 border-dashed"
                            onClick={addTreatment}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add more
                          </Button>
                        </div>
                      ) : (
                        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                          {conditionDetails.data.treatment?.length > 0 ? (
                            <ul className="space-y-2">
                              {conditionDetails.data.treatment.map(
                                (treatment, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="text-gray-900">
                                      {treatment}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <span className="text-gray-500">
                              No treatment options available
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Image */}
                  <div className="flex items-start justify-center">
                    {isEditMode || !selectedConditionId ? (
                      <div className="w-full max-w-md">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <div
                          onClick={handleImageClick}
                          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full rounded-xl object-cover"
                            />
                          ) : (
                            <>
                              <Upload className="h-12 w-12 text-gray-400 mb-2" />
                              <span className="text-gray-500">
                                Upload Image
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : conditionDetails.data.image ? (
                      <div className="w-full max-w-md">
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${conditionDetails.data.image}`}
                          alt={conditionDetails.data.skinType}
                          className="w-full h-auto rounded-xl object-cover shadow-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-full max-w-md h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-500">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
