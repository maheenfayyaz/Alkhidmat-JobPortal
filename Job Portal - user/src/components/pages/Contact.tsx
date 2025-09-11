"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${API_BASE_URL}/api/contact/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }

      console.log("Contact form submitted:", formData);

      // Reset form and show success
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(true);

      // Hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Contact Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter the subject"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Enter your message"
                      rows={6}
                      required
                      className="w-full resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>

                  {isSubmitted && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 text-sm">Message sent successfully! We'll get back to you soon.</span>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Other Ways to Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Other Ways to Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">General Inquiries</h3>
                    <p className="text-gray-600">info@alkhidmat.org</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Support</h3>
                    <p className="text-gray-600">support@alkhidmat.org</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">HR Department</h3>
                    <p className="text-gray-600">hr@alkhidmat.org</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1-555-123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Our Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-gray-900 font-medium">123 Al Khidmat Street, City, State, Zip Code</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">Location visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
