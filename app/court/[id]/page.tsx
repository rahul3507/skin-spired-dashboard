"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, MapPin, DollarSign, Clock, Calendar } from "lucide-react";
import { toast, Toaster } from "sonner";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import {
  useGetSingleCourtQuery,
  useUpdateCourtMutation,
} from "@/redux/feature/courtAPI";

interface TimeSlot {
  time: string;
}

interface AvailableSlot {
  date: string;
  slots: TimeSlot[];
}

interface VenueData {
  name: string;
  image: File | string | null;
  price: number;
  address: string;
  slotTime: string;
  availableSlots: AvailableSlot[];
}

export default function VenueForm() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();

  const { data, isLoading, error, refetch } = useGetSingleCourtQuery(id, {
    skip: !id,
  });
  const [updateCourt] = useUpdateCourtMutation();

  const [formData, setFormData] = useState<VenueData>({
    name: "",
    image: null,
    price: 0,
    address: "",
    slotTime: "",
    availableSlots: [],
  });

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);

  // Prepopulate form with fetched data
  useEffect(() => {
    if (data?.data) {
      const courtData = data.data;
      setFormData({
        name: courtData.name || "",
        image: courtData.image || null,
        price: courtData.price || 0,
        address: courtData.address || "",
        slotTime: courtData.slotTime || "",
        availableSlots:
          courtData.availableSlots?.map((slot: any) => ({
            date: slot.date,
            slots: slot.slots.map((timeSlot: any) => ({
              time: timeSlot.time,
            })),
          })) || [],
      });
      setImagePreview(
        courtData.image
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${courtData.image}`
          : null
      );
    }
  }, [data]);

  const handleInputChange = (
    field: keyof VenueData,
    value: string | number | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addTimeSlot = () => {
    if (!currentDate || !currentTime) {
      toast.error("Please select both date and time");
      return;
    }

    const existingDateIndex = formData.availableSlots.findIndex(
      (slot) => slot.date === currentDate
    );

    if (existingDateIndex >= 0) {
      const timeExists = formData.availableSlots[existingDateIndex].slots.some(
        (slot) => slot.time === currentTime
      );

      if (timeExists) {
        toast.error("This time slot already exists for this date");
        return;
      }

      const updatedSlots = [...formData.availableSlots];
      updatedSlots[existingDateIndex].slots.push({ time: currentTime });

      setFormData((prev) => ({
        ...prev,
        availableSlots: updatedSlots,
      }));
    } else {
      const newSlot: AvailableSlot = {
        date: currentDate,
        slots: [{ time: currentTime }],
      };

      setFormData((prev) => ({
        ...prev,
        availableSlots: [...prev.availableSlots, newSlot],
      }));
    }

    setCurrentTime("");
  };

  const removeTimeSlot = (date: string, timeToRemove: string) => {
    const updatedSlots = formData.availableSlots
      .map((slot) => {
        if (slot.date === date) {
          return {
            ...slot,
            slots: slot.slots.filter(
              (timeSlot) => timeSlot.time !== timeToRemove
            ),
          };
        }
        return slot;
      })
      .filter((slot) => slot.slots.length > 0);

    setFormData((prev) => ({
      ...prev,
      availableSlots: updatedSlots,
    }));
  };

  const removeDateSlot = (dateToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.filter(
        (slot) => slot.date !== dateToRemove
      ),
    }));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      if (
        !formData.name?.trim() ||
        !formData.address?.trim() ||
        formData.price == null ||
        !formData.slotTime?.trim() ||
        formData.availableSlots.length === 0
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const formattedSlots = formData.availableSlots.map((s) => ({
        date: s.date,
        slots: s.slots.map((t) => ({ time: formatTime(t.time) })),
      }));

      const payload = {
        name: formData.name.trim(),
        price: formData.price,
        address: formData.address.trim(),
        slotTime: formData.slotTime,
        availableSlots: formattedSlots,
      };

      const fd = new FormData();
      fd.append("data", JSON.stringify(payload));

      if (avatar instanceof File) {
        fd.append("image", avatar, avatar.name);
      }

      const res = await updateCourt({ id, data: fd }).unwrap();

      if (res?.success) {
        toast.success("Court updated successfully");
        router.push("/court");
        refetch();
      } else toast.error("Failed to update court");
    } catch (err) {
      console.error("Error updating court:", err);
      toast.error("An error occurred while updating the court");
    }
  };

  const getTotalSlots = () => {
    return formData.availableSlots.reduce(
      (total, slot) => total + slot.slots.length,
      0
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) {
    console.error("Error fetching court data:", error);
    return <div>Error or no data found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Toaster />
      <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white">
        <CardHeader className="flex flex-row">
          <Link href="/court">
            <p className="text-sm font-medium">
              <IoMdArrowRoundBack className="h-6 w-6 mt-2 mr-2" />
            </p>
          </Link>
          <CardTitle className="text-2xl font-bold">Update Court</CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Venue Name *</Label>
              <Input
                id="name"
                placeholder="Enter venue name"
                className="text-black"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price per Slot *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  className="pl-10 text-black"
                  value={formData.price || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "price",
                      Number.parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter full address"
              className="text-black"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slotTime">Slot Duration *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="slotTime"
                placeholder="e.g., 90 minutes, 2 hours"
                className="pl-10 text-black"
                value={formData.slotTime}
                onChange={(e) => handleInputChange("slotTime", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Venue Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Venue preview"
                  className="mt-2 max-h-32 rounded-lg object-cover"
                />
                <Button
                  onClick={() => {
                    setImagePreview(null);
                    handleInputChange("image", null);
                  }}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-red-600 text-white hover:bg-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Available Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Add Time Slot</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  className="text-black"
                  id="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  type="time"
                  id="time"
                  className="text-black"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={addTimeSlot}
                  className="w-full"
                  disabled={!currentDate || !currentTime}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slot
                </Button>
              </div>
            </div>
          </div>

          {formData.availableSlots.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Available Slots</h3>
                <Badge variant="secondary">{getTotalSlots()} total slots</Badge>
              </div>

              {formData.availableSlots.map((dateSlot, dateIndex) => (
                <div
                  key={dateIndex}
                  className="border rounded-lg p-4 text-black"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">
                      {new Date(dateSlot.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h4>
                    <Button
                      onClick={() => removeDateSlot(dateSlot.date)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {dateSlot.slots.map((timeSlot, timeIndex) => (
                      <div
                        key={timeIndex}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span className="text-sm font-medium">
                          {timeSlot.time}
                        </span>
                        <Button
                          onClick={() =>
                            removeTimeSlot(dateSlot.date, timeSlot.time)
                          }
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <div className="flex flex-col items-center justify-center space-y-4">
          <CardContent className="pt-6">
            <button
              onClick={handleSubmit}
              className="border h-10 rounded-md w-96 font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white hover:from-blue-700 hover:via-blue-600 hover:to-teal-500 transition-colors"
              disabled={
                !formData.name ||
                !formData.address ||
                !formData.price ||
                !formData.slotTime ||
                formData.availableSlots.length === 0
              }
            >
              Update Court
            </button>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
