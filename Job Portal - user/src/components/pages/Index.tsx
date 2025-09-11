"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase, Clock, ChevronDown } from "lucide-react";
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

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    department: string;
    type?: string;
    posted?: string;
    image?: string;
  }

  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        // For demo, set first job as featured, rest as all jobs
        setFeaturedJobs(data.length > 0 ? [data[0]] : []);
        setAllJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  // Filter the job listings based on search and filters
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector =
      selectedSector === "" ||
      selectedSector === "all" ||
      job.department.toLowerCase().includes(selectedSector.toLowerCase());

    const matchesLocation =
      selectedLocation === "" ||
      selectedLocation === "all" ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());

    // For experience and job type, we don't have data in allJobs, so we'll skip these for now

    return matchesSearch && matchesSector && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Job Search Section */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for jobs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg border-gray-200 focus:border-primary"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="human resources">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="customer service">
                  Customer Service
                </SelectItem>
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
                <SelectItem value="fulltime">Full Time</SelectItem>
                <SelectItem value="parttime">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured Jobs */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Featured Jobs
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {featuredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-1/3">
                        <img
                          src={job.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop&crop=building"}
                          alt={job.title}
                          className="w-full h-48 lg:h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {job.title}
                            </h3>
                            <p className="text-gray-600 mb-2">{job.company}</p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {job.location}
                              </span>
                              <span className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {job.type}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {job.posted}
                              </span>
                            </div>
                          </div>
                          <AuthButton
                            href={`/job/${job.id}/apply?title=${encodeURIComponent(job.title)}`}
                            className="bg-primary hover:bg-primary/90 cursor-pointer"
                            loginMessage="Please login to apply for this job"
                          >
                            Apply Now
                          </AuthButton>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Jobs */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              All Jobs{" "}
              {searchQuery ||
              selectedSector !== "all" ||
              selectedLocation !== "all"
                ? `(${filteredJobs.length} results)`
                : ""}
            </h2>
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{job.company}</p>
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary" className="text-xs">
                            {job.department}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <AuthButton
                        href={`/job/${job.id}/apply?title=${encodeURIComponent(job.title)}`}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white"
                        loginMessage="Please login to apply for this job"
                      >
                        Apply
                      </AuthButton>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* No Results Message */}
              {filteredJobs.length === 0 &&
                (searchQuery ||
                  selectedSector !== "all" ||
                  selectedLocation !== "all") && (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">
                        No jobs found
                      </h3>
                      <p>Try adjusting your search criteria or filters</p>
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
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
