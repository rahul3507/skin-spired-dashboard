"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  useGetPrivacyPolicyQuery,
  useSetPrivacyPolicyMutation,
} from "@/redux/feature/settingAPI";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EditPrivacyPolicy = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  const {
    data: privacyPolicy,
    isLoading,
    refetch,
  } = useGetPrivacyPolicyQuery({});

  const [setPrivacyPolicy, { isLoading: isSaving }] =
    useSetPrivacyPolicyMutation();

  useEffect(() => {
    let initialized = false;

    const init = async () => {
      if (initialized || quillRef.current) return;
      initialized = true;

      const Quill = (await import("quill")).default;

      if (editorRef.current && !editorRef.current.querySelector(".ql-editor")) {
        const quill = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Edit your Privacy Policy...",
        });

        quillRef.current = quill;

        // Load description from fetched data
        if (privacyPolicy?.data[0]?.description) {
          quill.root.innerHTML = privacyPolicy?.data[0]?.description || "";
          setContent(privacyPolicy?.data[0]?.description || "");
        }

        quill.on("text-change", () => {
          setContent(quill.root.innerHTML);
        });
      }
    };

    if (typeof window !== "undefined") {
      init();
    }

    return () => {
      initialized = true;
    };
  }, [privacyPolicy]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></div>
      </div>
    );
  }

  const handleSubmit = async () => {
    try {
      const res = await setPrivacyPolicy({ description: content }).unwrap();
      if (res?.success === true) {
        await refetch(); // Wait for refetch to complete
        toast.success("Privacy Policy updated successfully!");
        router.push("/setting/privacy-policy");
      } else {
        toast.error("Failed to update Privacy Policy.");
      }
    } catch (error) {
      toast.error("Update failed. Please try again.");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="min-h-[75vh] w-[96%] mx-auto flex flex-col justify-between gap-6">
      <div className="space-y-6">
        {/* Display raw description */}
        <div className="my-4">
          <h3 className="text-lg font-semibold">Current Privacy Policy:</h3>
          <p className="text-gray-600">
            {privacyPolicy?.data[0]?.description || "No description available"}
          </p>
        </div>

        <div className="h-auto">
          <div
            ref={editorRef}
            className="h-[50vh] bg-white text-base border rounded-md"
            id="quill-editor"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-primary hover:bg-teal-700"
        >
          {isSaving ? "Saving..." : "Update Privacy Policy"}
        </Button>
      </div>
    </div>
  );
};

export default EditPrivacyPolicy;
