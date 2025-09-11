"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, Building, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { Breadcrumb } from "@/components/Breadcrumb";

interface JobDetailsProps {
  id: string;
}

interface Job {
  title: string;
  company: string;
  location: string;
  department?: string;
  type: string;
  breadcrumb: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  requirements?: string[];
  createdAt: string;
}

export default function JobDetails({ id }: { id: string }) {

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Job ID is missing");
      setLoading(false);
      return;
    }
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await response.json();
        setJob({
          title: data.title,
          company: data.createdBy || "Company",
          location: data.location || "Location not specified",
          department: data.department || "N/A",
          type: data.type || "On-site",
          breadcrumb: `Jobs / ${data.title}`,
          description: data.description,
          responsibilities: data.responsibilities || [],
          qualifications: data.qualifications || [],
          requirements: data.requirements || [],
          createdAt: data.createdAt,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button and Breadcrumb */}
        <div className="mb-6">
          <BackButton fallbackPath="/jobs" className="mb-4" />
          <Breadcrumb
            items={[
              { label: "Jobs", href: "/jobs" },
              { label: job.title }
            ]}
          />
        </div>

        {/* Job Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-gray-600">{job.company}</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              {job.type}
            </Badge>
          </div>
          <div className="flex gap-4">
            <Link href={`/job/${id}/apply?title=${encodeURIComponent(job.title)}`}>
              <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                Apply Now
              </Button>
            </Link>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About the job */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About the job</h2>
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-gray-600">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Qualifications</h2>
                <ul className="space-y-3">
                  {job.qualifications.map((qualification, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{qualification}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {(job.requirements ?? []).map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-gray-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Department</h2>
                <p className="text-gray-600">{job.department || "N/A"}</p>
              </CardContent>
            </Card>

            {/* Apply Button */}
            <div className="pt-4">
              <Link href={`/job/${id}/apply?title=${encodeURIComponent(job.title)}`}>
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Job Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Company</div>
                    <div className="text-gray-900">{job.company}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="text-gray-900">{job.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Department</div>
                    <div className="text-gray-900">{job.department}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Job Type</div>
                    <div className="text-gray-900">{job.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Posted</div>
                    <div className="text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</div>
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
