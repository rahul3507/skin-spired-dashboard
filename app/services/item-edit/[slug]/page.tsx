"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import {
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
} from "@/redux/feature/servicesAPI";

export default function EditService() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [externalSourceTitle, setExternalSourceTitle] = useState("");
  const [premium, setPremium] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const params = useParams();

  const { data: serviceData, isLoading } = useGetServiceByIdQuery(
    params?.slug as string
  );

  const [updateService] = useUpdateServiceMutation();

  useEffect(() => {
    if (serviceData) {
      const service = serviceData?.service;
      setTitle(service?.title);
      // setDescription(service?.short_description);
      // setWebsiteUrl(service?.external_source_url);
      // setExternalSourceTitle(service?.external_source_title);
      // setPremium(service?.is_premium === "true");

      if (service?.icon) {
        setImagePreview(`${process.env.NEXT_PUBLIC_API_URL}${service.icon}`);
      }
    }
  }, [serviceData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async () => {
    // In a real app, you would save the changes to a database

    const formData = new FormData();

    formData.append("title", title);
    formData.append("short_description", description);
    formData.append("external_source_url", websiteUrl);
    formData.append("external_source_title", externalSourceTitle);
    formData.append("type", "service");
    formData.append("is_premium", premium ? "true" : "false");

    if (image) {
      formData.append("icon", image);
    }

    try {
      const response = await updateService({
        data: formData,
        id: params?.slug as string,
      }).unwrap();

      if (response?.status === "success") {
        router.push("/services");
      } else {
        console.error("Failed to update service:", response);
      }
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <div className='bg-black flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl bg-zinc-800 rounded-lg overflow-hidden'>
        <div className='p-4 flex items-center justify-between'>
          <button
            onClick={() => router.back()}
            className='text-white flex items-center hover:text-gray-300 transition-colors'
          >
            <ArrowLeft size={20} className='mr-2' />
            <span>Back</span>
          </button>

          <button
            type='submit'
            onClick={handleSubmit}
            className='bg-cyan-400 hover:bg-cyan-500 text-black font-medium px-6 py-2 rounded-full transition-colors'
          >
            Update Item
          </button>
        </div>

        <div className='px-4 pb-6 space-y-4'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full p-3 bg-zinc-700 border border-zinc-600 rounded text-white'
            required
            placeholder='Enter Item Title'
          />

          {imagePreview ? (
            <div className='flex justify-center py-4'>
              <Image
                src={imagePreview || "/placeholder.png"}
                alt={title}
                width={190}
                height={190}
                className='object-contain'
              />
            </div>
          ) : (
            <div className='relative flex justify-center py-4'>
              {image ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                  alt={title}
                  width={190}
                  height={190}
                  className='object-contain'
                />
              ) : null}

              <div>
                <X
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className='absolute top-0 right-0 text-white hover:text-gray-300 transition-colors cursor-pointer'
                />
              </div>
            </div>
          )}
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='w-full p-2 text-white bg-zinc-700 rounded border border-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-400 file:text-black hover:file:bg-cyan-500'
          />

          {/* <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className='w-full p-3 bg-zinc-700 border border-zinc-600 rounded text-white resize-none'
            placeholder='Enter Service Description'
          /> */}

          {/* <div className='flex flex-wrap gap-2'>
            <div className='flex items-center bg-zinc-700 rounded overflow-hidden flex-1'>
              <input
                type='text'
                value={externalSourceTitle}
                onChange={(e) => setExternalSourceTitle(e.target.value)}
                className='p-2 bg-zinc-700 border-none text-white text-sm w-full'
                required
                placeholder='External Source Title'
              />
            </div>

            <div className='flex items-center bg-zinc-700 rounded overflow-hidden flex-1'>
              <input
                type='text'
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className='p-2 bg-zinc-700 border-none text-white text-sm flex-1 min-w-0 outline-none'
                placeholder='Enter Website URL'
              />
              <button className='p-2 bg-zinc-700 text-white'>
                <ExternalLink size={16} />
              </button>
            </div>
          </div> */}

          {/* <div className='flex flex-col mt-20'>
            <label className='text-white block mb-2 text-xl'>
              Is Premium Service
            </label>
            <div className='flex items-center space-x-4 mt-2'>
              <div>
                <input
                  id='premium'
                  type='checkbox'
                  checked={premium}
                  onChange={(e) => setPremium(e.target.checked)}
                  className='h-4 w-4 text-cyan-400 border-gray-300 rounded focus:ring-cyan-500'
                />
                <label htmlFor='premium' className='ml-2 text-white'>
                  Yes
                </label>
              </div>
              <div>
                <input
                  id='not-premium'
                  type='checkbox'
                  checked={!premium}
                  onChange={(e) => setPremium(!e.target.checked)}
                  className='h-4 w-4 text-cyan-400 border-gray-300 rounded focus:ring-cyan-500'
                />
                <label htmlFor='not-premium' className='ml-2 text-white'>
                  No
                </label>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
