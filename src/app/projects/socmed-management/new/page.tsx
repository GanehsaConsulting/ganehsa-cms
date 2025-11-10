import { ProjectForm } from '@/components/project-form'

function NewSocmedPage() {
  return (
    <ProjectForm 
      serviceId={7}
      basePath="/projects/socmed-management"
      pageTitle="Social Media Management"
    />
  )
}

export default NewSocmedPage