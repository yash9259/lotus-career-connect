import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const result = await login({ email, password });
      if (result.role === "admin") {
        toast.success("Welcome, Admin!");
        navigate("/admin");
        return;
      }

      toast.success(`Welcome back, ${result.user.fullName}!`);
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-16 sm:py-24 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-card p-8"
        >
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground text-center mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Sign in to your candidate account
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-11"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
