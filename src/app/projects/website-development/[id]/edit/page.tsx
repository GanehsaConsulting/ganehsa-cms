import { ProjectForm } from "@/components/project-form";

export default function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProjectForm projectId={params.id} />;
}