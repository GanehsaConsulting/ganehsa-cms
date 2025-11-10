import { ProjectForm } from "@/components/project-form";

function EditWebPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ProjectForm 
      projectId={params.id}
      serviceId={3}
      basePath="/projects/website-development"
      pageTitle="Website Development"
    />
  );
}

export default EditWebPage;