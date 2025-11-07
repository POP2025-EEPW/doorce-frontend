import { QueryProvider } from "./providers/QueryProvider";
import { AppRouter } from "@/app/router";
import { Toaster } from "@/ui/lib/components/ui/sonner";

export function App() {
  return (
    <QueryProvider>
      <AppRouter />
      <Toaster richColors />
    </QueryProvider>
  );
}
