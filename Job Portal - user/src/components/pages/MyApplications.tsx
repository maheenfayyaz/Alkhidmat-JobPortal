"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Building, Eye, CheckCircle, XCircle, AlertCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    department: string;
  };
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  adminNotes?: string;
  interviewDate?: string;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/jobs/applications/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'reviewed':
        return <Eye className="w-5 h-5 text-blue-500" />;
      case 'shortlisted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'hired':
        return <UserCheck className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shortlisted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'reviewed':
        return 'Under Review';
      case 'shortlisted':
        return 'Shortlisted';
      case 'rejected':
        return 'Not Selected';
      case 'hired':
        return 'Hired';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your applications.</p>
          <Button
            onClick={() => window.location.href = '/login'}
            className="bg-primary hover:bg-primary/90"
          >
            Login Now
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Applications</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">
            Track the status of your job applications
          </p>
        </div>

        {/* Applications Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            You have applied to {applications.length} job{applications.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't applied to any jobs yet. Start exploring opportunities!
            </p>
            <Button
              onClick={() => window.location.href = '/jobs'}
              className="bg-primary hover:bg-primary/90"
            >
              Browse Jobs
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2">
                        {application.job.title}
                      </CardTitle>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building className="w-4 h-4 mr-2" />
                        <span className="font-medium">{application.job.company}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{application.job.location}</span>
                        <span className="mx-2">•</span>
                        <span>{application.job.department}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge
                        className={`flex items-center space-x-1 px-3 py-1 ${getStatusColor(application.status)}`}
                      >
                        {getStatusIcon(application.status)}
                        <span>{getStatusText(application.status)}</span>
                      </Badge>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Additional Information */}
                  <div className="space-y-3">
                    {application.interviewDate && (
                      <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-medium">Interview Scheduled:</span>
                        <span className="ml-1">{isNaN(new Date(application.interviewDate).getTime()) ? 'Invalid Date' : new Date(application.interviewDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    {application.adminNotes && (
                      <div className="bg-gray-50 px-3 py-2 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {application.adminNotes}
                        </p>
                      </div>
                    )}

                    {/* Status-specific messages */}
                    {application.status === 'shortlisted' && !application.interviewDate && (
                      <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Congratulations! You've been shortlisted. The recruiter will contact you soon.</span>
                      </div>
                    )}

                    {application.status === 'hired' && (
                      <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                        <UserCheck className="w-4 h-4 mr-2" />
                        <span>Congratulations! You've been selected for this position.</span>
                      </div>
                    )}

                    {application.status === 'rejected' && (
                      <div className="flex items-center text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                        <XCircle className="w-4 h-4 mr-2" />
                        <span>We appreciate your interest. Unfortunately, we won't be moving forward with your application at this time.</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back to Jobs Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => window.location.href = '/jobs'}
            variant="outline"
            className="px-8"
          >
            Browse More Jobs
          </Button>
        </div>
      </div>
    </div>
  );
}
