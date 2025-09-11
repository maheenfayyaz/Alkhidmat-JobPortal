"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthButton } from "@/components/AuthButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  department: string;
  type: string;
  description: string;
  createdAt: string;
  status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      !selectedLocation ||
      selectedLocation === "all" ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesDepartment =
      !selectedSector ||
      selectedSector === "all" ||
      job.department.toLowerCase().includes(selectedSector.toLowerCase());
    const matchesJobType =
      !selectedJobType ||
      selectedJobType === "all" ||
      job.type.toLowerCase().includes(selectedJobType.toLowerCase());
    const matchesExperience =
      !selectedExperience || selectedExperience === "all";

    return (
      matchesSearch &&
      matchesLocation &&
      matchesDepartment &&
      matchesJobType &&
      matchesExperience
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-gray-600">
            Discover meaningful career opportunities with Al Khidmat
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for jobs by title, company, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base border-gray-200 focus:border-primary"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="human resources">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="customer service">
                  Customer Service
                </SelectItem>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="social services">Social Services</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="karachi">Karachi</SelectItem>
                <SelectItem value="lahore">Lahore</SelectItem>
                <SelectItem value="islamabad">Islamabad</SelectItem>
                <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                <SelectItem value="peshawar">Peshawar</SelectItem>
                <SelectItem value="quetta">Quetta</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedExperience}
              onValueChange={setSelectedExperience}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <Card
              key={job.id || index}
              className="hover:shadow-lg transition-shadow duration-200 bg-white"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary cursor-pointer">
                          {job.status === "inactive" ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                alert("You can not view details because this job is inactive");
                              }}
                              className="text-gray-400 cursor-not-allowed"
                              type="button"
                            >
                              {job.title}
                            </button>
                          ) : (
                            <Link href={`/job/${job.id}`}>{job.title}</Link>
                          )}
                        </h3>
                        <p className="text-gray-600 font-medium mb-2">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {job.department}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.type}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    <Link
                      href={`/job/${job.id}`}
                      prefetch={true}
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer select-none"
                    >
                      <Button className="bg-primary hover:bg-primary/90 text-white px-6 w-full cursor-pointer">
                        View Details
                      </Button>
                    </Link>
                    {job.status === "inactive" ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          alert("You can not apply because this job is inactive");
                        }}
                        className="border border-gray-400 text-gray-400 px-6 w-full cursor-not-allowed"
                        type="button"
                      >
                        Apply Now
                      </button>
                    ) : (
                      <AuthButton
                        href={`/job/${job.id}/apply?title=${encodeURIComponent(job.title)}`}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white px-6 w-full cursor-pointer"
                        loginMessage="Please login to apply for this job"
                      >
                        Apply Now
                      </AuthButton>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedSector("all");
                setSelectedLocation("all");
                setSelectedExperience("all");
                setSelectedJobType("all");
              }}
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

