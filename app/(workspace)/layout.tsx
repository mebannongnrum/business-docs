import WorkspaceLayout from "@/features/workspace/components/WorkspaceLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>;
}