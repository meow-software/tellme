import { API } from '@/lib'

export const projectService = {
  list: () => API.get('/projects').then(res => res.data),
  create: (data: { title: string; description: string }) =>
    API.post('/projects', data).then(res => res.data),
}
