"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { getResumeById, updateResume } from "@/lib/resumeService";

export default function ResumeEditor() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const router = useRouter();
  const params = useParams();
  const resumeId = params.id;

  useEffect(() => {
    checkUser();
    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
    }
  }

  async function loadResume() {
    try {
      const data = await getResumeById(resumeId);
      setResume(data.content);
      setAtsScore(data.ats_score || 0);
    } catch (error) {
      console.error('Error loading resume:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  const calculateATSScore = (data) => {
    let score = 0;
    if (data?.name) score += 15;
    if (data?.email) score += 15;
    if (data?.summary && data.summary.length > 50) score += 20;
    if (data?.experience && data.experience.length > 100) score += 25;
    if (data?.education && data.education.length > 50) score += 15;
    if (data?.skills && data.skills.split(',').length > 3) score += 10;
    return score;
  };

  const handleInputChange = (field, value) => {
    const newData = { ...resume, [field]: value };
    setResume(newData);
    setAtsScore(calculateATSScore(newData));
  };

  async function handleSave() {
    setSaving(true);
    try {
      const newScore = calculateATSScore(resume);
      await updateResume(resumeId, resume.title, resume, newScore);
      setAtsScore(newScore);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Resume not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Resume</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
          </div>

          {/* ATS Score Display */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">ATS Score:</span>
              <span className="text-2xl font-bold text-purple-600">{atsScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${atsScore}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {atsScore < 50 ? 'Your resume needs improvement' : 
               atsScore < 70 ? 'Good start! Add more details' : 
               'Excellent! Your resume is ATS-friendly'}
            </p>
          </div>

          {/* Resume Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Resume Title</label>
              <input
                type="text"
                value={resume.title || ''}
                onChange={(e) => setResume({...resume, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                value={resume.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={resume.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone</label>
              <input
                type="tel"
                value={resume.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="(123) 456-7890"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Professional Summary</label>
              <textarea
                value={resume.summary || ''}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Experienced professional with 5+ years in..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Work Experience</label>
              <textarea
                value={resume.experience || ''}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Software Engineer, ABC Corp (2020-Present)&#10;- Led development of...&#10;- Improved performance by..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Education</label>
              <textarea
                value={resume.education || ''}
                onChange={(e) => handleInputChange('education', e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="B.S. Computer Science, University Name (2015-2019)"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Skills (comma-separated)</label>
              <input
                type="text"
                value={resume.skills || ''}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="JavaScript, React, Node.js, Python, SQL"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save Resume'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}