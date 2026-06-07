import { supabase } from './supabaseClient'

export async function saveResume(title, content, atsScore) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabase
    .from('resumes')
    .insert([{ user_id: user.id, title, content, ats_score: atsScore }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getUserResumes() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getResumeById(id) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  
  if (error) throw error
  return data
}

export async function updateResume(id, title, content, atsScore) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabase
    .from('resumes')
    .update({ title, content, ats_score: atsScore, updated_at: new Date() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteResume(id) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) throw error
  return true
} 
