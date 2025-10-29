import { QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "@/app/router";
import { queryClient } from "@/app/query";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}
