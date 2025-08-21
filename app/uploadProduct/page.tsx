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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
} from "@/redux/feature/uploadProductAPI";
import {
  useGetAllSkinConditionQuery,
  useCreateSkinConditionMutation,
} from "@/redux/feature/skinConditionAPI";
import { Info, X, Plus, Trash2, Upload, Eye } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

// Types
interface Product {
  _id: string;
  productName: string;
  ingredients: string;
  image: string[];
  howToUse: string[];
  skinCondition: string;
  createdAt: string;
  updatedAt: string;
}

interface SkinCondition {
  _id: string;
  skinType: string;
}

interface EditForm {
  productName: string;
  ingredients: string;
  howToUse: string[];
  skinCondition: string;
  images: (File | null)[];
}

const UploadProductPage = () => {
  return (
    <main className="bg-background2 w-full p-4 md:p-6">
      <section>
        <ProductTable />
      </section>
    </main>
  );
};

export default UploadProductPage;

function ProductTable() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Edit form states
  const [editForm, setEditForm] = useState<EditForm>({
    productName: "",
    ingredients: "",
    howToUse: [],
    skinCondition: "",
    images: [null, null, null],
  });
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);

  // Category adding states
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  // API hooks
  const { data, isLoading } = useGetAllProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  // Always fetch all skin conditions to ensure they are available
  const { data: skinConditionsData, refetch: refetchSkinConditions } =
    useGetAllSkinConditionQuery({
      page: 1,
      limit: 1000, // Increased limit to get all conditions
      search: "",
    });

  const { data: productDetails, isLoading: isDetailsLoading } =
    useGetProductByIdQuery(selectedProductId, {
      skip: !selectedProductId,
    });

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [createSkinCondition, { isLoading: isCreatingCategory }] =
    useCreateSkinConditionMutation();

  const products: Product[] = data?.data?.result || [];
  const skinConditions: SkinCondition[] =
    skinConditionsData?.data?.result || [];
  const totalItems = data?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Enhanced function to get skin condition name by ID
  const getSkinConditionName = (id: string) => {
    if (!id || !skinConditions || skinConditions.length === 0) {
      return "Unknown";
    }

    const condition = skinConditions.find((sc) => sc._id === id);
    console.log("Finding skin condition for ID:", id);
    console.log("Available skin conditions:", skinConditions);
    console.log("Found condition:", condition);

    return condition?.skinType || "Unknown";
  };

  // Force refetch skin conditions when modal opens
  useEffect(() => {
    if (isModalOpen) {
      refetchSkinConditions();
    }
  }, [isModalOpen, refetchSkinConditions]);

  useEffect(() => {
    if (productDetails?.data && selectedProductId) {
      const product = productDetails.data;
      setEditForm({
        productName: product.productName || "",
        ingredients: product.ingredients || "",
        howToUse: product.howToUse || [],
        skinCondition: product.skinCondition || "",
        images: [null, null, null],
      });

      // Set image previews from existing images
      const previews = [null, null, null];
      if (product.image && product.image.length > 0) {
        product.image.forEach((img, index) => {
          if (index < 3) {
            previews[index] = `${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`;
          }
        });
      }
      setImagePreviews(previews);
    } else if (!selectedProductId && isModalOpen) {
      setEditForm({
        productName: "",
        ingredients: "",
        howToUse: ["", "", ""],
        skinCondition: "",
        images: [null, null, null],
      });
      setImagePreviews([null, null, null]);
    }
  }, [productDetails, selectedProductId, isModalOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openProductModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const openCreateModal = () => {
    setSelectedProductId(null);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
    setIsEditMode(false);
    setEditForm({
      productName: "",
      ingredients: "",
      howToUse: [],
      skinCondition: "",
      images: [null, null, null],
    });
    setImagePreviews([null, null, null]);
    setIsAddingCategory(false);
    setNewCategoryName("");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHowToUseChange = (index: number, value: string) => {
    const newHowToUse = [...editForm.howToUse];
    newHowToUse[index] = value;
    setEditForm((prev) => ({
      ...prev,
      howToUse: newHowToUse,
    }));
  };

  const addHowToUse = () => {
    setEditForm((prev) => ({
      ...prev,
      howToUse: [...prev.howToUse, ""],
    }));
  };

  const removeHowToUse = (index: number) => {
    const newHowToUse = editForm.howToUse.filter((_, i) => i !== index);
    setEditForm((prev) => ({
      ...prev,
      howToUse: newHowToUse,
    }));
  };

  const handleImageChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        const newImages = [...editForm.images];
        newImages[index] = file;
        setEditForm((prev) => ({
          ...prev,
          images: newImages,
        }));

        const newPreviews = [...imagePreviews];
        newPreviews[index] = URL.createObjectURL(file);
        setImagePreviews(newPreviews);
      }
    };

  const handleImageClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const removeImage = (index: number) => {
    const newImages = [...editForm.images];
    newImages[index] = null;
    setEditForm((prev) => ({
      ...prev,
      images: newImages,
    }));

    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("productName", editForm.productName);
      formData.append("ingredients", editForm.ingredients);
      formData.append("skinCondition", editForm.skinCondition);

      // Add howToUse array - filter out empty strings
      const validHowToUse = editForm.howToUse.filter(
        (item) => item.trim() !== ""
      );
      validHowToUse.forEach((item, index) => {
        formData.append(`howToUse[${index}]`, item);
      });

      // Add only new images (File objects)
      editForm.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`image`, image);
        }
      });

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      if (selectedProductId) {
        const result = await updateProduct({
          id: selectedProductId,
          data: formData,
        }).unwrap();
        console.log("Update successful:", result);
      } else {
        const result = await createProduct(formData).unwrap();
        console.log("Create successful:", result);
      }

      closeModal();
      // Optional: Show success message
      alert(
        selectedProductId
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
    } catch (error) {
      console.error("Failed to save product:", error);
      // Show error message to user
      alert("Failed to save product. Please try again.");
    }
  };

  const handleCancel = () => {
    if (selectedProductId) {
      setIsEditMode(false);
      // Reset form to original values
      if (productDetails?.data) {
        const product = productDetails.data;
        setEditForm({
          productName: product.productName || "",
          ingredients: product.ingredients || "",
          howToUse: product.howToUse || [],
          skinCondition: product.skinCondition || "",
          images: [null, null, null],
        });

        const previews = [null, null, null];
        if (product.image && product.image.length > 0) {
          product.image.forEach((img, index) => {
            if (index < 3) {
              previews[index] = `${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`;
            }
          });
        }
        setImagePreviews(previews);
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
          Products List
        </h2>
        <div className="flex justify-between items-center px-3 pb-6">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={openCreateModal}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload New Product
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-black py-8">
              <TableRow>
                <TableHead className="text-[#FFF] text-lg  justify-center items-center">
                  File Name
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Category
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Upload Date
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products?.map((product) => (
                <TableRow key={product._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.image && product.image[0] && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image[0]}`}
                            className="w-full h-full object-cover"
                            alt="Product"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.productName || "Unknown Product"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getSkinConditionName(product.skinCondition)}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center text-gray-700 ">
                    {getSkinConditionName(product.skinCondition)}
                  </TableCell>

                  <TableCell className="text-center text-gray-700">
                    {new Date(product.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                        onClick={() => openProductModal(product._id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
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
                {!selectedProductId
                  ? "Upload New Product"
                  : isEditMode
                  ? "Edit Product Details"
                  : "Product Details"}
              </h2>
              <div className="flex items-center gap-2">
                {selectedProductId && !isEditMode ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm"
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
                      className="text-sm bg-black text-white hover:bg-gray-800"
                      onClick={handleSave}
                      disabled={isUpdating || isCreating}
                    >
                      {isUpdating || isCreating
                        ? "Saving..."
                        : selectedProductId
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
              {selectedProductId && isDetailsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loading />
                </div>
              ) : selectedProductId && !productDetails?.data ? (
                <div className="text-center py-8">
                  <span className="text-gray-500">
                    Failed to load product details
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Details */}
                  <div className="space-y-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                      </label>
                      {isEditMode || !selectedProductId ? (
                        <input
                          type="text"
                          value={editForm.productName}
                          onChange={(e) =>
                            handleInputChange("productName", e.target.value)
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Type product name"
                        />
                      ) : (
                        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                          <span className="text-gray-900">
                            {productDetails.data.productName || "Unknown"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Skin Condition */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Skin Condition
                      </label>
                      {isEditMode || !selectedProductId ? (
                        <div className="space-y-3 border border-gray-200 rounded-lg">
                          <Select
                            value={editForm.skinCondition}
                            onValueChange={(value) =>
                              handleInputChange("skinCondition", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select one" />
                            </SelectTrigger>
                            <SelectContent>
                              {skinConditions.map((condition) => (
                                <SelectItem
                                  key={condition._id}
                                  value={condition._id}
                                >
                                  {condition.skinType}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                          <span className="text-gray-900">
                            {productDetails.data.skinCondition.skinType}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Ingredients */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ingredients
                      </label>
                      {isEditMode || !selectedProductId ? (
                        <textarea
                          value={editForm.ingredients}
                          onChange={(e) =>
                            handleInputChange("ingredients", e.target.value)
                          }
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Write about product ingredients..."
                        />
                      ) : (
                        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                          <p className="text-gray-900 leading-relaxed">
                            {productDetails.data.ingredients ||
                              "No ingredients available"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* How to Use */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How to use
                      </label>
                      {isEditMode || !selectedProductId ? (
                        <div className="space-y-3">
                          {editForm.howToUse.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="text"
                                value={item}
                                onChange={(e) =>
                                  handleHowToUseChange(index, e.target.value)
                                }
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`How to use this product 0${
                                  index + 1
                                }..`}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 p-0 text-red-600 hover:text-red-800"
                                onClick={() => removeHowToUse(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-10 text-gray-600 border-dashed"
                            onClick={addHowToUse}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add more
                          </Button>
                        </div>
                      ) : (
                        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                          {productDetails.data.howToUse?.length > 0 ? (
                            <ul className="space-y-2">
                              {productDetails.data.howToUse.map(
                                (item: string, index: number) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="text-gray-900">
                                      {item}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <span className="text-gray-500">
                              No usage instructions available
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Images */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Upload Product Image
                      </label>

                      {/* Existing images display (for view mode) */}
                      {!isEditMode &&
                        selectedProductId &&
                        productDetails?.data?.image && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {productDetails.data.image.map((img, index) => (
                              <div
                                key={index}
                                className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                              >
                                <img
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Image upload interface */}
                      {(isEditMode || !selectedProductId) && (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {imagePreviews.slice(0, 2).map((preview, index) => (
                              <div key={index} className="relative">
                                <input
                                  type="file"
                                  ref={(el) =>
                                    (fileInputRefs.current[index] = el)
                                  }
                                  onChange={handleImageChange(index)}
                                  accept="image/*"
                                  className="hidden"
                                />
                                <div
                                  onClick={() => handleImageClick(index)}
                                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                                >
                                  {preview ? (
                                    <img
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                      className="w-full h-full rounded-lg object-cover"
                                    />
                                  ) : (
                                    <Upload className="h-8 w-8 text-gray-400" />
                                  )}
                                </div>
                                {preview && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="absolute top-2 right-2 h-6 w-6 p-0 bg-white"
                                    onClick={() => removeImage(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Third image upload */}
                          <div className="relative">
                            <input
                              type="file"
                              ref={(el) => (fileInputRefs.current[2] = el)}
                              onChange={handleImageChange(2)}
                              accept="image/*"
                              className="hidden"
                            />
                            <div
                              onClick={() => handleImageClick(2)}
                              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                            >
                              {imagePreviews[2] ? (
                                <img
                                  src={imagePreviews[2]}
                                  alt="Preview 3"
                                  className="w-full h-full rounded-lg object-cover"
                                />
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                  <span className="text-gray-500">
                                    Upload Image
                                  </span>
                                </>
                              )}
                            </div>
                            {imagePreviews[2] && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0 bg-white"
                                onClick={() => removeImage(2)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
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
