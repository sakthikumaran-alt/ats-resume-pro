"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Save, Eye, Copy, FileText, Briefcase, GraduationCap, Code, Award } from "lucide-react";

export default function ResumeEditor() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("personal");
  const [showScanner, setShowScanner] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [issues, setIssues] = useState<string[]>([]);

  // Resume data state
  const [resume, setResume] = useState({
    personal: {
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      summary: "Results-driven software engineer with 5+ years of experience building scalable web applications."
    },
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Corp",
        dates: "2020-Present",
        achievements: "Led development of 3 major features increasing user engagement by 45%"
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "University of Technology",
        year: "2018"
      }
    ],
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL"]
  });

  // ATS Scanner Function (runs 100% locally, free!)
  const runATSScan = () => {
    const resumeText = JSON.stringify(resume).toLowerCase();
    let score = 70;
    const foundIssues: string[] = [];

    // Check for action verbs
    const actionVerbs = ["led", "developed", "created", "implemented", "managed", "increased"];
    const hasActionVerbs = actionVerbs.some(verb => resumeText.includes(verb));
    if (!hasActionVerbs) {
      score -= 15;
      foundIssues.push("Add action verbs (Led, Developed, Created)");
    }

    // Check for metrics/numbers
    const hasMetrics = /\d+%|\d+x|\$\d+/.test(resumeText);
    if (!hasMetrics) {
      score -= 15;
      foundIssues.push("Add measurable results (e.g., 'increased sales by 25%')");
    }

    // Check for email
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
    if (!hasEmail) {
      score -= 20;
      foundIssues.push("Add valid email address");
    }

    // Check skills count
    if (resume.skills.length < 5) {
      score -= 10;
      foundIssues.push("Add more skills (minimum 5 recommended)");
    }

    // Ensure score is between 0-100
    score = Math.min(100, Math.max(0, score));
    setAtsScore(score);
    setIssues(foundIssues);
    setShowScanner(true);
  };

  // Export as PDF (using browser print)
  const exportPDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <html>
        <head><title>${resume.personal.name} - Resume</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #333; border-bottom: 2px solid #667eea; }
          .section { margin: 20px 0; }
          .section-title { font-weight: bold; color: #667eea; margin-bottom: 10px; }
        </style>
        </head>
        <body>
          <h1>${resume.personal.name}</h1>
          <p>${resume.personal.email} | ${resume.personal.phone} | ${resume.personal.location}</p>
          <div class="section"><div class="section-title">Professional Summary</div><p>${resume.personal.summary}</p></div>
          <div class="section"><div class="section-title">Skills</div><p>${resume.skills.join(", ")}</p></div>
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-purple-600">Resume Sections</h2>
        {[
          { id: "personal", label: "Personal Info", icon: FileText },
          { id: "experience", label: "Experience", icon: Briefcase },
          { id: "education", label: "Education", icon: GraduationCap },
          { id: "skills", label: "Skills", icon: Code },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-2 rounded-lg mb-2 flex items-center ${
              activeTab === tab.id ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
        
        <div className="mt-8 space-y-2">
          <button
            onClick={runATSScan}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            🔍 Run ATS Scan
          </button>
          <button
            onClick={exportPDF}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
          {activeTab === "personal" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
              <input
                type="text"
                value={resume.personal.name}
                onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, name: e.target.value } })}
                className="w-full p-2 border rounded mb-3"
                placeholder="Full Name"
              />
              <input
                type="email"
                value={resume.personal.email}
                onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, email: e.target.value } })}
                className="w-full p-2 border rounded mb-3"
                placeholder="Email"
              />
              <textarea
                value={resume.personal.summary}
                onChange={(e) => setResume({ ...resume, personal: { ...resume.personal, summary: e.target.value } })}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Professional summary..."
              />
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Skills</h2>
              <input
                type="text"
                value={resume.skills.join(", ")}
                onChange={(e) => setResume({ ...resume, skills: e.target.value.split(",").map(s => s.trim()) })}
                className="w-full p-2 border rounded"
                placeholder="JavaScript, React, Python, etc."
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ATS Scanner Panel */}
      {showScanner && (
        <div className="w-96 bg-white shadow-lg p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">ATS Scanner Results</h3>
            <button onClick={() => setShowScanner(false)} className="text-gray-500">✕</button>
          </div>
          
          {atsScore !== null && (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">{atsScore}%</div>
                <div className="text-gray-600">ATS Compatibility Score</div>
              </div>
              
              {issues.length > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-800 mb-2">Issues Found:</h4>
                  <ul className="space-y-1">
                    {issues.map((issue, i) => (
                      <li key={i} className="text-sm text-red-700">• {issue}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800">✓ Excellent! Your resume is ATS-friendly!</p>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Tips to Improve:</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Use action verbs (Led, Developed, Created)</li>
                  <li>• Add numbers and metrics</li>
                  <li>• Include keywords from job description</li>
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}