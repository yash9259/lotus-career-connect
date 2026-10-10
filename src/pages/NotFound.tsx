import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Compass } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <Seo title="Page not found" description="The page you are looking for does not exist." noindex />
      <section className="hero-mesh">
        <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Compass className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Error 404</p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground sm:text-5xl">Page not found</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            The page you are looking for may have moved or no longer exists. Let&apos;s get you back on your path.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
