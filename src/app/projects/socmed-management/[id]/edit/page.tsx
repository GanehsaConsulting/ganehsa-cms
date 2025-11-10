import { ProjectForm } from "@/components/project-form";

function EditSocmedPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ProjectForm 
      projectId={params.id}
      serviceId={7}
      basePath="/projects/socmed-management"
      pageTitle="Socmed Management"
    />
  );
}

export default EditSocmedPage;