"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wrapper } from "@/components/wrapper";
import { SelectComponent } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getToken } from "@/lib/helpers";
import { HeaderActions } from "@/components/header-actions";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

interface Service {
  id: number;
  name: string;
}

interface Client {
  id: number;
  clientName: string;
  companyName: string | null;
  clientReview: string;
  serviceId: number;
  clientPhoto: string | null;
  companyLogo: string | null;
  service: Service;
}

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    clientReview: "",
    serviceId: "",
  });
  
  const [clientPhoto, setClientPhoto] = useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [clientPhotoPreview, setClientPhotoPreview] = useState<string>("");
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string>("");

  // Load client data and services on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getToken();
        if (!token) {
          toast.error("Token tidak ditemukan");
          setIsLoadingData(false);
          return;
        }

        // Load client data
        const clientRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/business/clients/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (clientRes.ok) {
          const clientData = await clientRes.json();
          if (clientData.success) {
            setClient(clientData.data);
            setFormData({
              clientName: clientData.data.clientName,
              companyName: clientData.data.companyName || "",
              clientReview: clientData.data.clientReview,
              serviceId: clientData.data.serviceId.toString(),
            });
            setClientPhotoPreview(clientData.data.clientPhoto || "");
            setCompanyLogoPreview(clientData.data.companyLogo || "");
          }
        } else {
          toast.error("Failed to load client data");
        }

        // Load services
        const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/services`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          if (servicesData.success) {
            setServices(servicesData.data || []);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Error loading data");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (clientId) {
      loadData();
    }
  }, [clientId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "clientPhoto" | "companyLogo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    if (type === "clientPhoto") {
      setClientPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setClientPhotoPreview(previewUrl);
    } else {
      setCompanyLogo(file);
      const previewUrl = URL.createObjectURL(file);
      setCompanyLogoPreview(previewUrl);
    }
  };

  const removeFile = (type: "clientPhoto" | "companyLogo") => {
    if (type === "clientPhoto") {
      setClientPhoto(null);
      if (clientPhotoPreview && !clientPhotoPreview.startsWith('/uploads')) {
        URL.revokeObjectURL(clientPhotoPreview);
      }
      setClientPhotoPreview("");
    } else {
      setCompanyLogo(null);
      if (companyLogoPreview && !companyLogoPreview.startsWith('/uploads')) {
        URL.revokeObjectURL(companyLogoPreview);
      }
      setCompanyLogoPreview("");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const token = getToken();
      if (!token) {
        toast.error("Token tidak ditemukan");
        setIsLoading(false);
        return;
      }

      // Validation
      if (!formData.clientName.trim()) {
        toast.error("Client name is required");
        setIsLoading(false);
        return;
      }

      if (!formData.clientReview.trim()) {
        toast.error("Client review is required");
        setIsLoading(false);
        return;
      }

      if (!formData.serviceId) {
        toast.error("Service is required");
        setIsLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("clientName", formData.clientName);
      submitData.append("companyName", formData.companyName);
      submitData.append("clientReview", formData.clientReview);
      submitData.append("serviceId", formData.serviceId);

      if (clientPhoto) {
        submitData.append("clientPhoto", clientPhoto);
      }
      if (companyLogo) {
        submitData.append("companyLogo", companyLogo);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/business/clients/${clientId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: submitData,
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Client updated successfully!");
        router.push("/business/clients");
      } else {
        toast.error(data.message || "Failed to update client");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(errorMsg);
      console.error("Update client error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/business/clients");
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (clientPhotoPreview && !clientPhotoPreview.startsWith('/uploads')) {
        URL.revokeObjectURL(clientPhotoPreview);
      }
      if (companyLogoPreview && !companyLogoPreview.startsWith('/uploads')) {
        URL.revokeObjectURL(companyLogoPreview);
      }
    };
  }, [clientPhotoPreview, companyLogoPreview]);

  if (isLoadingData) {
    return (
      <Wrapper className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading client data...</div>
      </Wrapper>
    );
  }

  if (!client) {
    return (
      <Wrapper className="flex items-center justify-center min-h-96">
        <div className="text-white text-center">
          <p>Client not found</p>
          <Link href="/business/clients">
            <Button className="mt-4">Back to Clients</Button>
          </Link>
        </div>
      </Wrapper>
    );
  }

  return (
    <>
      <HeaderActions position="left">
        <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
          Edit Client
        </h1>
      </HeaderActions>

      <HeaderActions position="right">
        <div className="flex items-center gap-2">
          <AlertDialogComponent
            header="Batalkan Perubahan Client?"
            desc="Semua perubahan yang belum disimpan akan hilang."
            continueAction={handleCancel}
          >
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Batal
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>

          <AlertDialogComponent
            header="Simpan Perubahan Client?"
            desc="Perubahan client akan disimpan"
            continueAction={handleSubmit}
          >
            <AlertDialogTrigger asChild>
              <Button size="sm" className="w-30" disabled={isLoading}>
                <Upload className="w-4 h-4 mr-1" />
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>
        </div>
      </HeaderActions>

      <Wrapper className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        {/* left column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Client Name */}
          <div className="flex flex-col gap-5">
            <label
              htmlFor="clientName"
              className="text-white px-1"
            >
              Client Name *
            </label>
            <Input
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              placeholder="Enter client name"
              required
              disabled={isLoading}
            />
          </div>

          {/* Company Name */}
          <div className="flex flex-col gap-5">
            <label
              htmlFor="companyName"
              className="text-white px-1"
            >
              Company Name
            </label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter company name (optional)"
              disabled={isLoading}
            />
          </div>

          {/* Service Selection */}
          <div className="flex flex-col gap-5">
            <label
              htmlFor="serviceId"
              className="text-white px-1"
            >
              Service *
            </label>
            <SelectComponent
              value={formData.serviceId}
              onChange={(value) => handleSelectChange("serviceId", value)}
              options={services.map((service) => ({
                label: service.name,
                value: service.id.toString(),
              }))}
              placeholder="Select a service"
              disabled={isLoading}
            />
          </div>

          {/* Client Review */}
          <div className="flex flex-col gap-5">
            <label
              htmlFor="clientReview"
              className="text-white px-1"
            >
              Client Review *
            </label>
            <Textarea
              id="clientReview"
              name="clientReview"
              value={formData.clientReview}
              onChange={handleInputChange}
              placeholder="Enter client review or testimonial"
              rows={6}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* right column */}
        <div className="lg:col-span-3 space-y-5">
          {/* Client Photo Upload */}
          <div className="flex flex-col gap-5">
            <label className="text-white px-1">
              Client Photo
            </label>
            <div className="space-y-3">
              {/* Selected Image Preview */}
              {clientPhotoPreview && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="relative group">
                    <div className="w-full h-20 rounded-lg overflow-hidden">
                      <Image
                        src={clientPhotoPreview}
                        alt="Client photo preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile("clientPhoto")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Image Picker Button */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  id="clientPhoto"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "clientPhoto")}
                  className="hidden"
                />
                <label
                  htmlFor="clientPhoto"
                  className="flex flex-col items-center justify-center h-32 text-sm text-gray-400 cursor-pointer"
                >
                  <div className="text-lg mb-2">📷</div>
                  <div>Klik untuk upload client photo</div>
                  <div className="text-xs mt-1 text-gray-500">
                    PNG, JPG, JPEG (max 5MB)
                  </div>
                  {client?.clientPhoto && !clientPhoto && (
                    <div className="text-xs mt-1 text-green-500">
                      Current photo exists
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Company Logo Upload */}
          <div className="flex flex-col gap-5">
            <label className="text-white px-1">
              Company Logo
            </label>
            <div className="space-y-3">
              {/* Selected Image Preview */}
              {companyLogoPreview && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="relative group">
                    <div className="w-full p-6 rounded-lg overflow-hidden bg-white ">
                      <Image
                        src={companyLogoPreview}
                        alt="Company logo preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile("companyLogo")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Image Picker Button */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  id="companyLogo"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "companyLogo")}
                  className="hidden"
                />
                <label
                  htmlFor="companyLogo"
                  className="flex flex-col items-center justify-center h-32 text-sm text-gray-400 cursor-pointer"
                >
                  <div className="text-lg mb-2">🏢</div>
                  <div>Klik untuk upload company logo</div>
                  <div className="text-xs mt-1 text-gray-500">
                    PNG, JPG, JPEG (max 5MB)
                  </div>
                  {client?.companyLogo && !companyLogo && (
                    <div className="text-xs mt-1 text-green-500">
                      Current logo exists
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}