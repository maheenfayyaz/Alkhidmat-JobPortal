"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Upload, FileText, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useAuth } from "@/contexts/AuthContext";

interface JobApplicationProps {
  id: string;
  title?: string;
}

export default function JobApplication({ id, title }: JobApplicationProps) {
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const jobTitle = title || "Software Engineer";
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phoneNumber: "",
    currentAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    jobTitle: jobTitle,
    experience: "No experience",  // Provide default non-empty value to satisfy backend validation
    skills: [] as string[],       // Added skills field as empty array
    resume: null as File | null,
    coverLetter: "",
  });

  useEffect(() => {
    // Fetch job details to get status
    const fetchJobDetails = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const jobData = await response.json();
        setJobStatus(jobData.status || "active");
        // Removed alert here to prevent duplicate alerts
        // if (jobData.status === "inactive") {
        //   alert("You can not apply because this job is inactive");
        //   // Optionally, redirect back or prevent form display by setting a flag
        // }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setJobStatus("active"); // default to active if error
      }
    };
    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (PDF or Word)
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF or Word document for your resume.");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }

      setFormData((prev) => ({ ...prev, resume: file }));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (jobStatus === "inactive") {
      alert("You can not apply because this job is inactive");
      return;
    }
    if (jobStatus === "closed") {
      alert("This job is now closed. You can not apply.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.resume) {
      setError("Please upload your resume.");
      setIsSubmitting(false);
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("jobId", id);
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phoneNumber);
      formDataToSend.append("address", formData.currentAddress);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("zipCode", formData.zipCode);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("jobTitle", formData.jobTitle);
      formDataToSend.append("coverLetter", formData.coverLetter);
      formDataToSend.append("experience", formData.experience || "");
      formDataToSend.append("skills", JSON.stringify(formData.skills || []));
      if (formData.resume) {
        formDataToSend.append("resume", formData.resume);
      }

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/jobs/${id}/apply`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Application submission failed");
      }

      const data = await response.json();
      console.log("Job application submitted successfully:", data);

      // Show success state
      setIsSubmitted(true);
    } catch (error) {
      console.error("Application submission error:", error);
      setError(
        error instanceof Error ? error.message : "An error occurred while submitting your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Application submitted
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Your application has been successfully submitted for the position of{" "}
            <span className="font-semibold text-gray-900">{jobTitle}</span>.
          </p>

          {/* Status Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Application Status</span>
            </div>
            <p className="text-blue-700 text-sm">
              Your application is currently under review. You can track the status of all your applications on the{" "}
              <a href="/my-applications" className="font-semibold underline hover:text-blue-800">
                My Applications
              </a>{" "}
              page.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base"
            >
              Edit Application
            </Button>
            <Button
              onClick={() => window.location.href = '/my-applications'}
              variant="outline"
              className="px-8 py-3 text-base"
            >
              View My Applications
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Jobs", href: "/jobs" },
              { label: jobTitle, href: `/job/${id}` },
              { label: "Apply" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Application Form
          </h1>
          <p className="text-gray-600">Apply for: {jobTitle}</p>
        </div>

        {/* Application Form */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                  readOnly
                />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                  readOnly
                />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Address
                </label>
                <Input
                  type="text"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your current address"
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter your state"
                    className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Enter your zip code"
                    className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <Input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter your country"
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <Input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Enter the job title you are applying for"
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                  readOnly
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume (PDF or Word) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {formData.resume ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <FileText className="w-6 h-6" />
                        <span className="font-medium">
                          {formData.resume.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload your resume
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PDF or Word format, max 5MB
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience <span className="text-red-500">*</span>
                </label>
                <Textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Describe your experience"
                  rows={4}
                  className="w-full bg-gray-50 border-0 focus:bg-white resize-none"
                  required
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (comma separated)
                </label>
                <Input
                  type="text"
                  name="skills"
                  value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
                  onChange={(e) => {
                    const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                    setFormData(prev => ({ ...prev, skills: skillsArray }));
                  }}
                  placeholder="Enter your skills separated by commas"
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <Textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Write your cover letter here..."
                  rows={6}
                  className="w-full bg-gray-50 border-0 focus:bg-white resize-none"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-medium disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Submitting Application..."
                    : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
