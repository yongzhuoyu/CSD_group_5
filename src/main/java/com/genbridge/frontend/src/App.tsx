import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Redirects to /login if no token
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  return localStorage.getItem("token") ? element : <Navigate to="/login" replace />;
};

// Redirects to /learn if already logged in
const PublicOnlyRoute = ({ element }: { element: JSX.Element }) => {
  return localStorage.getItem("token") ? <Navigate to="/learn" replace /> : element;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<PublicOnlyRoute element={<Login />} />} />
          <Route path="/register" element={<PublicOnlyRoute element={<Register />} />} />
          <Route path="/learn" element={<PrivateRoute element={<Learn />} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
