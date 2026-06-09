"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FileText, Plus, TrendingUp, Target, LogOut } from "lucide-react";
import Link from "next/link";
import { saveResume, getUserResumes, deleteResume } from "@/lib/resumeService";
import { useAuth } from "@/context/AuthContext";

interface Resume {
  id: string;
  title: string;
  ats_score: number;
  updated_at: string;
  content: any;
}

export default function Dashboard() {
  const { signOut } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, avgScore: 0 });
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        loadResumes();
      }
    };
    getUser();
  }, []);

  async function loadResumes() {
    try {
      const data = await getUserResumes();
      setResumes(data);
      
      const total = data.length;
      const avgScore = total > 0 
        ? Math.round(data.reduce((sum: number, r: any) => sum + (r.ats_score || 0), 0) / total)
        : 0;
      setStats({ total, avgScore });
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteResume(id: string) {
    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(id);
        await loadResumes();
      } catch (error) {
        console.error('Error deleting resume:', error);
        alert('Error deleting resume');
      }
    }
  }

  async function handleNewResume() {
    const newResume = {
      title: "My New Resume",
      name: "",
      email: user?.email || "",
      phone: "",
      summary: "",
      experience: "",
      education: "",
      skills: ""
    };
    
    try {
      const saved = await saveResume("My New Resume", newResume, 0);
      router.push(`/resume/${saved.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      alert('Error creating resume');
    }
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600 mt-1">Create and manage your ATS-friendly resumes</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleNewResume}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5 mr-2" /> New Resume
            </button>
            <button 
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600 transition"
            >
              <LogOut className="w-5 h-5 mr-2" /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <FileText className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="text-2xl font-bold">{stats.total}</h3>
            <p className="text-gray-600">Total Resumes</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-2xl font-bold">{stats.avgScore}%</h3>
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
            {loading ? (
              <div className="px-6 py-8 text-center text-gray-500">Loading your resumes...</div>
            ) : resumes.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No resumes yet. Click "New Resume" to create your first one!
              </div>
            ) : (
              resumes.map((resume: Resume) => (
                <div key={resume.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-900">{resume.title}</h3>
                    <p className="text-sm text-gray-500">
                      Updated: {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-sm ${resume.ats_score >= 80 ? 'bg-green-100 text-green-700' : resume.ats_score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      ATS: {resume.ats_score || 0}%
                    </span>
                    <Link href={`/resume/${resume.id}`}>
                      <button className="text-purple-600 hover:text-purple-700">Edit →</button>
                    </Link>
                    <button 
                      onClick={() => handleDeleteResume(resume.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
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