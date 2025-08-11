"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Youtube, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import { useCreateServiceMutation } from "@/redux/feature/servicesAPI";
import { toast } from "sonner";

export default function CreateService({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [externalSourceTitle, setExternalSourceTitle] = useState("");
  const [premium, setPremium] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [createService] = useCreateServiceMutation();

  useEffect(() => {
    // In a real app, you would fetch the data based on the ID
    // This is just a placeholder
  }, [params.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    // In a real app, you would save the changes to a database
    // console.log({ title, description, websiteUrl, youtubeUrl, image });

    if (!title || !description || !websiteUrl || !externalSourceTitle) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("short_description", description);
    formData.append("external_source_title", externalSourceTitle);
    formData.append("external_source_url", websiteUrl);
    formData.append("type", "service");
    formData.append("is_premium", premium ? "true" : "false");

    if (image) {
      formData.append("icon", image);
    }

    try {
      const response = await createService(formData).unwrap();

      if (response?.status === "success") {
        toast.success("Service created successfully!");
        router.push("/services");
      } else {
        console.error("Failed to create service:", response);
      }
    } catch (error) {
      console.error("Error creating service:", error);
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
            Create Item
          </button>
        </div>

        <div className='px-4 pb-6 space-y-4'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full p-3 bg-zinc-700 border border-zinc-600 rounded text-white'
            required
            placeholder='Enter Service Title'
          />

          {imagePreview ? (
            <div className='relative flex justify-center py-4'>
              <Image
                src={imagePreview}
                alt={title}
                width={190}
                height={190}
                className='object-contain'
              />

              <div>
                <X
                  onClick={() => setImagePreview(null)}
                  className='absolute top-0 right-0 text-white hover:text-gray-300 transition-colors'
                />
              </div>
            </div>
          ) : (
            <div className='flex justify-center py-4'>
              <Image
                src='/issue/1.png'
                alt={title}
                width={190}
                height={190}
                className='object-contain'
              />
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
                type='url'
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className='p-2 bg-zinc-700 border-none text-white text-sm flex-1 min-w-0 outline-none'
                placeholder='https://example.com/action'
                required
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
