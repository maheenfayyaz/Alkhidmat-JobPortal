"use client";

import { useState, useEffect } from "react";
import { Camera, Save, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [savedData, setSavedData] = useState<{
    image: string;
    name: string;
    title: string;
    about: string;
    age: string;
    nationalId: string;
    city: string;
    email: string;
    dateOfBirth: string;
    country: string;
    phone: string;
    address: string;
    experience: {
      id: number;
      company: string;
      position: string;
      duration: string;
      logo: string;
      bgColor: string;
    }[];
    education: {
      id: number;
      institution: string;
      degree: string;
      duration: string;
      logo: string;
      bgColor: string;
    }[];
  }>({
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    name: "",
    title: "",
    about: "",
    age: "",
    nationalId: "",
    city: "",
    email: "",
    dateOfBirth: "",
    country: "",
    phone: "",
    address: "",
    experience: [],
    education: [],
  });

  const [editData, setEditData] = useState(savedData);

  // Fetch profile data from backend API on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        console.log("Fetched profile phone:", data.profile.phone); // Debug log for phone
        setSavedData({
        image: data.profile.profileImage ? `http://localhost:8000${data.profile.profileImage.startsWith('/') ? data.profile.profileImage : '/' + data.profile.profileImage}` : savedData.image,
        name: data.profile.fullname || savedData.name || "",
        title: data.profile.title || savedData.title || "",
        about: data.profile.about || savedData.about || "",
        age: data.profile.age || savedData.age || "",
        nationalId: data.profile.nationalId || savedData.nationalId || "",
        city: data.profile.city || savedData.city || "",
        email: data.profile.email || savedData.email || "",
        dateOfBirth: data.profile.dateOfBirth || savedData.dateOfBirth || "",
        country: data.profile.country || savedData.country || "",
        phone: data.profile.phone ?? savedData.phone ?? "",
        address: data.profile.address || savedData.address || "",
        experience: Array.isArray(data.profile.experience)
          ? data.profile.experience.map((exp: any, index: number) => ({
              id: exp.id ?? index,
              company: exp.company ?? "",
              position: exp.position ?? "",
              duration: exp.duration ?? "",
              logo: exp.logo ?? "",
              bgColor: exp.bgColor ?? "",
            }))
          : [],
        education: Array.isArray(data.profile.education)
          ? data.profile.education.map((edu: any, index: number) => ({
              id: edu.id ?? index,
              institution: edu.institution ?? "",
              degree: edu.degree ?? "",
              duration: edu.duration ?? "",
              logo: edu.logo ?? "",
              bgColor: edu.bgColor ?? "",
            }))
          : [],
        });
        setEditData({
          image: data.profile.profileImage ? `http://localhost:8000${data.profile.profileImage.startsWith('/') ? data.profile.profileImage : '/' + data.profile.profileImage}` : savedData.image,
          name: data.profile.fullname || savedData.name || "",
          title: data.profile.title || savedData.title || "",
          about: data.profile.about || savedData.about || "",
          age: data.profile.age || savedData.age || "",
          nationalId: data.profile.nationalId || savedData.nationalId || "",
          city: data.profile.city || savedData.city || "",
          email: data.profile.email || savedData.email || "",
          dateOfBirth: data.profile.dateOfBirth || savedData.dateOfBirth || "",
          country: data.profile.country || savedData.country || "",
          phone: data.profile.phone ?? savedData.phone ?? "",
          address: data.profile.address || savedData.address || "",
          experience: Array.isArray(data.profile.experience)
            ? data.profile.experience.map((exp: any, index: number) => ({
                id: exp.id ?? index,
                company: exp.company ?? "",
                position: exp.position ?? "",
                duration: exp.duration ?? "",
                logo: exp.logo ?? "",
                bgColor: exp.bgColor ?? "",
              }))
            : [],
          education: Array.isArray(data.profile.education)
            ? data.profile.education.map((edu: any, index: number) => ({
                id: edu.id ?? index,
                institution: edu.institution ?? "",
                degree: edu.degree ?? "",
                duration: edu.duration ?? "",
                logo: edu.logo ?? "",
                bgColor: edu.bgColor ?? "",
              }))
            : [],
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExperienceChange = (id: number, field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleEducationChange = (id: number, field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Always send base64 string with proper prefix for JPEG or PNG
        if (result && !result.startsWith("data:image/")) {
          const mimeType = file.type || "image/jpeg";
          setEditData((prev) => ({ ...prev, image: `data:${mimeType};base64,${result}` }));
        } else {
          setEditData((prev) => ({ ...prev, image: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Fix for name field: ensure editData.name is always string, not undefined or null
  useEffect(() => {
    if (editData.name === undefined || editData.name === null) {
      setEditData((prev) => ({ ...prev, name: "" }));
    }
  }, [editData.name]);

  const handleSave = async () => {
      try {
      const token = localStorage.getItem("token");

      // Prepare form data for profile update including image file if changed
      const formData = new FormData();

      // Append all fields except image to formData
      for (const key in editData) {
        if (key !== "image") {
          const value = (editData as any)[key];
          if (value !== undefined) {
            if (typeof value === "object") {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          }
        }
      }

      // Handle image upload: if image is base64 string, convert to Blob and append as file
      if (editData.image && editData.image.startsWith("data:image")) {
        const base64Data = editData.image.split(",")[1];
        const contentType = editData.image.substring(
          editData.image.indexOf(":") + 1,
          editData.image.indexOf(";")
        );
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        formData.append("profileImage", blob, "profileImage.png");
      }

      const response = await fetch("http://localhost:8000/api/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      const updatedData = await response.json();
      setSavedData(updatedData.profile);
      setEditData(updatedData.profile);
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Profile updated successfully!',
        confirmButtonColor: '#3B82F6'
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update profile',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  const handleCancel = () => {
    setEditData(savedData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditData(savedData);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="text-center mb-12">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-orange-300">
                <img
                  src={isEditing ? editData.image : savedData.image}
                  alt={
                    isEditing
                      ? editData.name ?? ""
                      : savedData.name ?? ""
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <label htmlFor="profile-image" className="cursor-pointer">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

          {isEditing ? (
            <div className="space-y-4 max-w-md mx-auto">
              <Input
                name="name"
                value={editData.name || ""}
                onChange={handleInputChange}
                className="text-center text-3xl font-bold border-0 border-b-2 border-gray-200 focus:border-primary bg-transparent"
                placeholder="Full Name"
              />
              <Input
                name="title"
                value={editData.title || ""}
                onChange={handleInputChange}
                className="text-center text-gray-600 border-0 border-b-2 border-gray-200 focus:border-primary bg-transparent"
                placeholder="Professional Title"
              />
            </div>
          ) : (
            <>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {savedData.name || ""}
          </h1>
          <p className="text-gray-600 mb-6">{savedData.title || ""}</p>
            </>
          )}

          <div className="flex justify-center space-x-4 mt-6">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 text-white px-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="px-6"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEdit}
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              >
                Edit profile
              </Button>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
          {isEditing ? (
            <Textarea
              name="about"
              value={editData.about}
              onChange={handleInputChange}
              rows={4}
              className="w-full mb-8 resize-none"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed mb-8">
              {savedData.about}
            </p>
          )}

          {/* Personal Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              {isEditing ? (
                <Input
                  name="name"
                  value={editData.name ?? ""}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{savedData.name ?? ""}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Age
              </label>
              {isEditing ? (
                <Input
                  name="age"
                  value={editData.age}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{savedData.age}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                National ID
              </label>
              {isEditing ? (
                <Input
                  name="nationalId"
                  value={editData.nationalId}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{savedData.nationalId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                City
              </label>
              {isEditing ? (
                <Input
                  name="city"
                  value={editData.city}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{savedData.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              {isEditing ? (
                <Input
                  name="email"
                  type="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{savedData.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Date of Birth (DOB)
              </label>
              {isEditing ? (
                <Input
                  name="dateOfBirth"
                  value={editData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{savedData.dateOfBirth}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Country
              </label>
              {isEditing ? (
                <Input
                  name="country"
                  value={editData.country}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900">{savedData.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone
                </label>
                  <Input
                    name="phone"
                    value={editData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Phone number"
                  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Address
                </label>
                  <Input
                    name="address"
                    value={editData.address || ""}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Address"
                  />
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-gray-900 font-semibold">Phone</p>
              <p className="text-gray-900">{savedData.phone || "-"}</p>
            </div>
            <div>
              <p className="text-gray-900 font-semibold">Address</p>
              <p className="text-gray-900">{savedData.address || "-"}</p>
            </div>
          </div>
          )}
        </div>

        {/* Experience Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex justify-between items-center">
            Experience
            {isEditing && (
              <Button
                onClick={() => {
                  const newExp = {
                    id: Date.now(),
                    company: "",
                    position: "",
                    duration: "",
                    logo: "",
                    bgColor: "",
                  };
                  setEditData((prev) => ({
                    ...prev,
                    experience: [...prev.experience, newExp],
                  }));
                }}
                size="sm"
                variant="outline"
              >
                Add Experience
              </Button>
            )}
          </h2>
          <div className="space-y-4">
          {(isEditing ? editData.experience : savedData.experience).map(
            (exp) => (
              <div key={exp.id} className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 ${exp.bgColor} rounded flex items-center justify-center flex-shrink-0`}
                >
                  {/* Removed image for experience */}
                </div>
                <div className="flex-1 space-y-2">
                  {isEditing ? (
                    <>
                      <p className="font-semibold">Company</p>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          handleExperienceChange(
                            exp.id,
                            "company",
                            e.target.value
                          )
                        }
                        className="font-semibold"
                        placeholder="Company name"
                      />
                      <p className="font-semibold">Duration</p>
                      <Input
                        value={exp.duration}
                        onChange={(e) =>
                          handleExperienceChange(
                            exp.id,
                            "duration",
                            e.target.value
                          )
                        }
                        className="text-gray-600"
                        placeholder="Duration"
                      />
                      <p className="font-semibold">Position</p>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          handleExperienceChange(
                            exp.id,
                            "position",
                            e.target.value
                          )
                        }
                        className="text-gray-700"
                        placeholder="Position"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">Company</p>
                      <h3 className="font-semibold text-gray-900">
                        {exp.company}
                      </h3>
                      <p className="font-semibold">Duration</p>
                      <p className="text-gray-600">{exp.duration}</p>
                      <p className="font-semibold">Position</p>
                      <p className="text-gray-700">{exp.position}</p>
                    </>
                  )}
                </div>
              </div>
            )
          )}
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex justify-between items-center">
            Education
            {isEditing && (
              <Button
                onClick={() => {
                  const newEdu = {
                    id: Date.now(),
                    institution: "",
                    degree: "",
                    duration: "",
                    logo: "",
                    bgColor: "",
                  };
                  setEditData((prev) => ({
                    ...prev,
                    education: [...prev.education, newEdu],
                  }));
                }}
                size="sm"
                variant="outline"
              >
                Add Education
              </Button>
            )}
          </h2>
          <div className="space-y-4">
          {(isEditing ? editData.education : savedData.education).map(
            (edu) => (
              <div key={edu.id} className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 ${edu.bgColor} rounded flex items-center justify-center flex-shrink-0`}
                >
                  {/* Removed image for education */}
                </div>
                <div className="flex-1 space-y-2">
                  {isEditing ? (
                    <>
                      <p className="font-semibold">Institution</p>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          handleEducationChange(
                            edu.id,
                            "institution",
                            e.target.value
                          )
                        }
                        className="font-semibold"
                        placeholder="Institution name"
                      />
                      <p className="font-semibold">Duration</p>
                      <Input
                        value={edu.duration}
                        onChange={(e) =>
                          handleEducationChange(
                            edu.id,
                            "duration",
                            e.target.value
                          )
                        }
                        className="text-gray-600"
                        placeholder="Duration"
                      />
                      <p className="font-semibold">Degree</p>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          handleEducationChange(
                            edu.id,
                            "degree",
                            e.target.value
                          )
                        }
                        className="text-gray-700"
                        placeholder="Degree"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">Institution</p>
                      <h3 className="font-semibold text-gray-900">
                        {edu.institution}
                      </h3>
                      <p className="font-semibold">Duration</p>
                      <p className="text-gray-600">{edu.duration}</p>
                      <p className="font-semibold">Degree</p>
                      <p className="text-gray-700">{edu.degree}</p>
                    </>
                  )}
                </div>
              </div>
            )
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
