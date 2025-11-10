import { ProjectForm } from '@/components/project-form'

function NewWebPage() {
  return (
    <ProjectForm 
      serviceId={3}
      basePath="/projects/website-development"
      pageTitle="Website Development"
    />
  )
}

export default NewWebPage