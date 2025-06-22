"use client";

import Image from "next/image";
import Link from "next/link";
import {
  UserCircle,
  FileText,
  Briefcase,
  CheckCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  category: string;
  status: string;
}

export default function AboutUsPage() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/blogs", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        // Lọc bài published và lấy 2 bài mới nhất
        const publishedBlogs = data
          .filter((blog: Blog) => blog.status === "published")
          .sort((a: Blog, b: Blog) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, 2);
        setBlogs(publishedBlogs);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không tải được bài viết",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogs();
  }, [toast]);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Your Career, Upgraded with AI
              </h2>
              <p className="text-gray-600 mb-6">
                JobWinner is a modern job matching platform designed to connect
                job seekers with the best opportunities tailored to their skills
                and preferences. By combining user-friendly design with smart
                filtering, JobWinner helps candidates find ideal roles faster,
                while giving recruiters the tools they need to discover top
                talent effortlessly. Whether you're starting your career or
                scaling your team, JobWinner makes hiring and job hunting
                simpler and more effective.
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-6">
                JobMarket is a dynamic online marketplace where employers and
                job seekers meet in real-time. It offers a transparent,
                decentralized space to post openings, apply for roles, and
                manage applications — all in one place. Built for flexibility
                and accessibility, JobMarket empowers freelancers, full-timers,
                and recruiters to connect with precision and purpose. The AI CV
                Generator is your intelligent assistant for creating
                professional, customized resumes in minutes. Powered by AI, it
                analyzes your background, skills, and job goals to generate
                beautifully designed CVs tailored to your industry. Whether
                you're applying for your first job or making a career move, the
                AI CV Generator helps you stand out with ease and confidence.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <div className="relative rounded-lg overflow-hidden max-w-[1200px] mx-auto h-[500px]">
              <Image
                src="/about-us.webp"
                alt="About our company"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how our platform simplifies the job search and hiring
              process — from intelligent matching to seamless applications —
              helping candidates and employers connect faster and more
              efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCircle className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Create Account</h3>
              <p className="text-gray-600">
                Sign up for a free account. Add your skills and preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Upload Resume</h3>
              <p className="text-gray-600">
                Upload your resume or create a new one with our AI-powered
                tools.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Find Jobs</h3>
              <p className="text-gray-600">
                Browse through our curated list of jobs that match your skills
                and preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Apply Job</h3>
              <p className="text-gray-600">
                Apply with just one click. Track your application status in
                real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Iframe */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <video
              src="/vid_about_us.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Overlay content inside the video */}
            <div className="absolute inset-0 flex flex-col justify-end items-center text-white z-20 px-4 pb-6 bg-black bg-opacity-30">
              <div className="flex-grow flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold mb-2">
                  Find Your Perfect Job
                </h2>
                <h2 className="text-3xl font-bold">With Smart Matching</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
                <div className="flex items-start gap-3 bg-black bg-opacity-60 p-4 rounded-lg">
                  <div className="bg-teal-500 p-2 rounded-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm">
                    10,000+ jobs available across industries and locations.
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-black bg-opacity-60 p-4 rounded-lg">
                  <div className="bg-teal-500 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm">
                    Personalized job matching based on your skills & interests.
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-black bg-opacity-60 p-4 rounded-lg">
                  <div className="bg-teal-500 p-2 rounded-lg">
                    <UserCircle className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm">
                    Easy-to-use resume builder powered by AI to get you noticed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our job portal.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="bg-white rounded-lg overflow-hidden border border-gray-200"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center">
                    <span className="text-teal-500 font-medium mr-2">01.</span>
                    <span className="font-medium">Can I upload a CV?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-gray-600">
                  Yes, you can upload your CV in PDF, DOCX, or TXT format. Our
                  system will automatically parse your CV to extract relevant
                  information. You can also use our AI-powered CV analyzer to
                  get feedback on your CV and suggestions for improvement. This
                  will help you increase your chances of getting noticed by
                  employers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="bg-white rounded-lg overflow-hidden border border-gray-200"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center">
                    <span className="text-teal-500 font-medium mr-2">02.</span>
                    <span className="font-medium">
                      How long will the recruitment process take?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-gray-600">
                  The recruitment process timeline varies depending on the
                  employer and position. Typically, you can expect to hear back
                  within 1-2 weeks after applying. Some positions may have a
                  faster turnaround time, while others might take longer due to
                  multiple interview stages or a high volume of applications.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="bg-white rounded-lg overflow-hidden border border-gray-200"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center">
                    <span className="text-teal-500 font-medium mr-2">03.</span>
                    <span className="font-medium">
                      What does the recruitment and selection process involve?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-gray-600">
                  The typical recruitment process includes application
                  screening, initial phone or video interviews, technical or
                  skills assessments (if applicable), in-person interviews,
                  reference checks, and finally, a job offer. Our platform
                  allows you to track your application status at each stage of
                  the process.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="bg-white rounded-lg overflow-hidden border border-gray-200"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center">
                    <span className="text-teal-500 font-medium mr-2">04.</span>
                    <span className="font-medium">
                      Do you recruit for Graduates, Apprentices and Students?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-gray-600">
                  Yes, we have dedicated sections for entry-level positions,
                  internships, apprenticeships, and graduate programs. We
                  partner with companies that are specifically looking to hire
                  fresh talent and provide opportunities for career growth and
                  development.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="bg-white rounded-lg overflow-hidden border border-gray-200"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center">
                    <span className="text-teal-500 font-medium mr-2">05.</span>
                    <span className="font-medium">
                      Can I receive notifications for any future jobs that may
                      interest me?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-gray-600">
                  You can set up job alerts based on your preferences, including
                  job title, location, salary range, and industry. You'll
                  receive daily or weekly notifications about new job postings
                  that match your criteria. This ensures you never miss out on
                  relevant opportunities.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Working with the best */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/workinthebest1.webp?height=300&width=300"
                  alt="Team member"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/workinthebest2.webp?height=300&width=300"
                  alt="Office"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/workinthebest3.jpg?height=300&width=300"
                  alt="Meeting"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/workinthebest4.jpg?height=300&width=300"
                  alt="Workspace"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">
                We're Only Working With The Best
              </h2>
              <p className="text-gray-600 mb-8">
                Ultrices porta dolor mattis in tempor sit tempus et. Ultrices
                porta dolor mattis in tempor sit tempus et. Ultrices porta dolor
                mattis in tempor sit tempus et.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Quality Job</h3>
                    <p className="text-gray-600 text-sm">
                      Curated positions from top employers
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Resume builder</h3>
                    <p className="text-gray-600 text-sm">
                      Create professional resumes easily
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <Briefcase className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Top Companies</h3>
                    <p className="text-gray-600 text-sm">
                      Partner with industry leaders
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <UserCircle className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Top Talents</h3>
                    <p className="text-gray-600 text-sm">
                      Connect with skilled professionals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News and Blog */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">News and Blog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Latest headlines and career tips to help you succeed in your job
              search.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
          ) : blogs.length === 0 ? (
            <p className="text-center text-gray-600">Chưa có bài viết nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="relative">
                    <Image
                      src={blog.featuredImage || "/placeholder.svg"}
                      alt={blog.title}
                      width={600}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded">
                        {blog.category || "General"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-gray-500 text-sm mb-2">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </div>
                    <h3 className="font-bold text-xl mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <Link
                      href={`/blog/${blog._id}`}
                      className="text-teal-500 font-medium hover:text-teal-600"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}