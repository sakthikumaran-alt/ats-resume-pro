"use client";

import { ArrowRight, Sparkles, FileText, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">🚀 ATS Resume Pro</div>
        <Link
          href="/dashboard"
          className="bg-purple-600 px-4 py-2 rounded-lg text-white hover:bg-purple-700 transition"
        >
          Get Started Free
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Beat Every ATS System
          <span className="text-purple-400 block">With AI Precision</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join 50,000+ job seekers who landed interviews at top companies
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center bg-purple-600 px-8 py-3 rounded-lg text-white font-semibold hover:bg-purple-700 transition"
        >
          Start Building Free <ArrowRight className="ml-2 w-5 h-5" />
        </Link>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: Sparkles,
              title: "AI-Powered",
              desc: "Smart suggestions to optimize your resume",
            },
            {
              icon: FileText,
              title: "11+ Sections",
              desc: "Complete resume builder with everything you need",
            },
            {
              icon: Zap,
              title: "ATS Scanner",
              desc: "Real-time score from 0-100",
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}