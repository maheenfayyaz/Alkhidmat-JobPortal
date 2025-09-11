"use client"

import Link from "next/link";
import { DollarSign, Briefcase, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Compensation",
      description: "Competitive salary and benefits package"
    },
    {
      icon: Briefcase,
      title: "Career Development", 
      description: "Opportunities for professional growth and development"
    },
    {
      icon: Users,
      title: "Work Environment",
      description: "A supportive and inclusive work environment"
    },
    {
      icon: Heart,
      title: "Impact",
      description: "Making a meaningful difference in the lives of others"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Al Khidmat</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Al Khidmat is a leading non-profit organization dedicated to serving humanity through various social welfare initiatives. Our mission is to provide relief, rehabilitation, and development services to communities in need, fostering a culture of compassion and excellence.
          </p>
        </div>

        {/* Our Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At Al Khidmat, we are driven by a profound commitment to making a positive impact on society. Our mission is to alleviate suffering, promote social justice, and empower individuals and communities to thrive. We strive to be a beacon of hope, providing essential services and support to those facing adversity.
          </p>
        </section>

        {/* Work Culture */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Work Culture</h2>
          <p className="text-gray-600 leading-relaxed">
            Our work culture is built on the principles of integrity, empathy, and collaboration. We foster an environment where every team member is valued, respected, and empowered to contribute their best. We believe in continuous learning and professional development, encouraging our staff to grow and excel in their roles.
          </p>
        </section>

        {/* Benefits */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Benefits of Working at Al Khidmat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Join Our Team */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Team</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If you are passionate about social work and dedicated to making a difference, we invite you to explore career opportunities with Al Khidmat. Join us in our mission to serve humanity and build a better future for all.
          </p>
          <Link href="/jobs">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8">
              View Open Positions
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
