"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
} from "@/redux/feature/settingAPI";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const EditAboutUs = () => {
  const [updateAboutUs, { isLoading: isUpdating }] = useUpdateAboutUsMutation();
  const { data, isLoading, refetch } = useGetAboutUsQuery("");
  const quillRef = useRef<any>(null); // To store Quill instance
  const editorRef = useRef(null); // To reference the editor DOM element

  const router = useRouter();

  // Initialize Quill editor
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !editorRef.current ||
      quillRef.current
    ) {
      return;
    }

    // Initialize Quill
    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Enter your update about us...",
    });

    // Set initial content when data is available
    if (data?.data[0]?.description) {
      quillRef.current.clipboard.dangerouslyPasteHTML(data.data[0].description);
    }

    // Cleanup on unmount
    return () => {
      quillRef.current = null;
    };
  }, [data]); // Add data to dependency array

  // Handle form submission
  const handleSubmit = async () => {
    if (quillRef.current) {
      const html = quillRef.current.root.innerHTML;
      try {
        await updateAboutUs({
          id: data?.data[0]?.id,
          description: html,
        }).unwrap();

        toast.success("About Us updated successfully!");
        router.push("/setting/about-us");
        refetch();
      } catch (error) {
        console.error("Failed to update About Us:", error);
        alert("Failed to update About Us.");
      }
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] w-[96%] mx-auto flex flex-col justify-between gap-6">
      <div className="space-y-6">
        <div className="h-full">
          <div
            id="editor"
            ref={editorRef}
            className="h-[50vh] bg-white text-base"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            isUpdating ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditAboutUs;
