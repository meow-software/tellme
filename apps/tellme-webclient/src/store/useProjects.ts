"use client"
import { create } from 'zustand'
import { projectService } from '@/lib/'

interface Project {
  id: string
  title: string
  description: string
}

interface ProjectState {
  projects: Project[]
  loading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  addProject: (data: { title: string; description: string }) => Promise<void>
}

export const useProjects = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true })
    try {
      const data = await projectService.list()
      set({ projects: data, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  addProject: async (data) => {
    set({ loading: true })
    try {
      const newProject = await projectService.create(data)
      set(state => ({ projects: [...state.projects, newProject], loading: false }))
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
}))
