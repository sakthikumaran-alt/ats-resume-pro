"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import { FileText, Plus, TrendingUp, Target } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const sampleResumes = [
    { id: 1, title: "Software Engineer Resume", ats_score: 85, updated_at: "2024-06-01" },
    { id: 2, title: "Frontend Developer Resume", ats_score: 92, updated_at: "2024-06-02" },
  ];
const [user, setUser] = useState(null);
const router = useRouter();

useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
    } else {
      setUser(user);
    }
  };
  getUser();
}, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600 mt-1">Create and manage your ATS-friendly resumes</p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition">
            <Plus className="w-5 h-5 mr-2" /> New Resume
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <FileText className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="text-2xl font-bold">{sampleResumes.length}</h3>
            <p className="text-gray-600">Total Resumes</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-2xl font-bold">88%</h3>
            <p className="text-gray-600">Average ATS Score</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Target className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-2xl font-bold">+24%</h3>
            <p className="text-gray-600">Interview Rate</p>
          </div>
        </div>

        {/* Resumes List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Your Resumes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {sampleResumes.map((resume) => (
              <div key={resume.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <h3 className="font-medium text-gray-900">{resume.title}</h3>
                  <p className="text-sm text-gray-500">Updated: {resume.updated_at}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-sm ${resume.ats_score >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    ATS: {resume.ats_score}%
                  </span>
                  <Link href={`/resume/${resume.id}`}>
                    <button className="text-purple-600 hover:text-purple-700">Edit →</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
          <p className="mb-4">Get unlimited AI optimizations, team collaboration, and more!</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            Upgrade Now → 
          </button>
        </div>
      </div>
    </div>
  );
}