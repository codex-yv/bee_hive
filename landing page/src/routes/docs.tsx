import { createFileRoute } from "@tanstack/react-router";
import { DocumentationLayout } from "@/components/documentation/DocumentationLayout";

export const Route = createFileRoute("/docs")({
  component: DocumentationLayout,
});
