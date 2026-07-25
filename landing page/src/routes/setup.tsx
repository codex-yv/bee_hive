import { createFileRoute } from "@tanstack/react-router";
import { Setup } from "@/components/setup/Setup";

export const Route = createFileRoute("/setup")({
  component: Setup,
});
