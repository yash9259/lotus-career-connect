import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, Heart, Users, TrendingUp, Target, Compass, ShieldCheck, FileText, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Seo, { getSiteUrl } from "@/components/seo/Seo";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import { STATIC_ROUTES, absoluteUrl, breadcrumbSchema } from "@/lib/seoConfig";

const aboutMeta = STATIC_ROUTES.find((route) => route.path === "/about")!;
const aboutCrumbs = [{ label: "Home", to: "/" }, { label: "About Us" }];

const values = [
  {
    title: "Integrity",
    description: "Honesty and transparency in every connection we make.",
    icon: CheckCircle2,
  },
  {
    title: "Compassion",
    description: "We listen to the needs and aspirations of each person we work with.",
    icon: Heart,
  },
  {
    title: "Service",
    description: "We bridge the gap between talent and opportunity for our community.",
    icon: Users,
  },
  {
    title: "Excellence",
    description: "High standards in our platform and in the support we give.",
    icon: TrendingUp,
  },
];

const howWeWork = [
  { icon: ShieldCheck, text: "Every job is reviewed by our team before it goes live." },
  { icon: FileText, text: "Employers post a job without creating an account." },
  { icon: MapPin, text: "Based in Bhuj, Gujarat, with jobs from across India and worldwide." },
];

const About = () => {
  const siteUrl = getSiteUrl();
  return (
    <Layout>
      <Seo
        title={aboutMeta.title}
        description={aboutMeta.description}
        jsonLd={[
          breadcrumbSchema(siteUrl, aboutCrumbs),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: absoluteUrl(siteUrl, "/about"),
            name: aboutMeta.title,
            about: { "@id": `${siteUrl}/#organization` },
            inLanguage: "en-IN",
          },
        ]}
      />

      {/* Hero: copy on the left, framed image on the right */}
      <section className="hero-ink overflow-hidden border-b border-white/10">
        <div className="container grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <PageBreadcrumbs items={aboutCrumbs} className="mb-8 [&_*]:!text-white/70 [&_[aria-current]]:!text-white" />
            <span className="mb-6 block h-0.5 w-10 bg-gold" aria-hidden="true" />
            <h1 className="text-4xl leading-[1.1] sm:text-5xl lg:text-[3.5rem]">
              Empowering careers, enriching communities
            </h1>
            <p className="mt-7 max-w-xl text-base text-white/80 sm:text-lg">
              Hare Krishna Job Placement is more than a job portal. We are a bridge between dedicated professionals and
              organizations that value purpose-driven work.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/jobs" className="btn-gold">Browse jobs</Link>
              <Link to="/contact" className="chip-area h-12 px-6 text-base">Talk to our team</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-md"
          >
            <div className="rounded-lg border border-white/20 p-2">
              <img
                src="/about_hero.webp"
                width={1024}
                height={1024}
                alt=""
                aria-hidden="true"
                className="aspect-[4/5] w-full rounded-md object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="container py-20 sm:py-28" aria-labelledby="our-story">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="section-rule" aria-hidden="true" />
            <h2 id="our-story" className="section-title">Our story</h2>
            <p className="mt-6 font-display text-2xl leading-snug text-primary sm:text-3xl">
              Connections that are financially rewarding, and spiritually and professionally fulfilling.
            </p>
            <div className="relative mt-10 hidden lg:block">
              <div className="absolute -inset-3 rounded-lg border border-gold/60" aria-hidden="true" />
              <img
                src="/our_values.webp"
                width={1024}
                height={1024}
                alt="Illustration of the values that guide Hare Krishna Job Placement"
                loading="lazy"
                decoding="async"
                className="relative aspect-square w-full rounded-md object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="max-w-prose space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Hare Krishna Job Placement began as a humble initiative to help friends and family in the devotee
                community find meaningful work within organizations that share their values.
              </p>
              <p>
                As the community grew, so did the need for a professional and efficient way to manage career
                opportunities. Today we connect candidates and employers across sectors, from non-profits and
                educational institutions to businesses.
              </p>
              <p>Our mission has stayed the same: to make the right introduction between the right people.</p>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {howWeWork.map((item) => (
                <li key={item.text} className="card-premium p-5">
                  <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-foreground">{item.text}</p>
                </li>
              ))}
            </ul>
            <img
              src="/our_values.webp"
              width={1024}
              height={1024}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="mt-10 aspect-video w-full rounded-md object-cover lg:hidden"
            />
          </div>
        </div>
      </section>

      {/* Mission and vision on one dark panel */}
      <section className="hero-ink" aria-label="Mission and vision">
        <div className="container grid gap-12 py-16 sm:py-24 md:grid-cols-2">
          <div>
            <Target className="h-7 w-7 text-gold" aria-hidden="true" />
            <h2 className="mt-5 font-display text-3xl font-medium sm:text-4xl">Our mission</h2>
            <p className="mt-4 max-w-md text-white/80">
              To connect talented individuals with opportunities that align with their skills and spiritual values,
              building a community of professionals dedicated to service and excellence.
            </p>
          </div>
          <div className="md:border-l md:border-white/15 md:pl-12">
            <Compass className="h-7 w-7 text-gold" aria-hidden="true" />
            <h2 className="mt-5 font-display text-3xl font-medium sm:text-4xl">Our vision</h2>
            <p className="mt-4 max-w-md text-white/80">
              To become a leading platform for career development in the devotee community, recognized for integrity,
              innovation and impact on lives.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container py-20 sm:py-28" aria-labelledby="core-values">
        <div className="max-w-2xl">
          <span className="section-rule" aria-hidden="true" />
          <h2 id="core-values" className="section-title">Core values</h2>
          <p className="section-lead">These principles guide the features we build and the way we treat everyone who uses them.</p>
        </div>
        <ul className="mt-12 grid overflow-hidden rounded-lg border border-border bg-card shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <li
              key={value.title}
              className="border-b border-border p-8 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 lg:[&:nth-child(odd)]:border-r"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-gold">
                <value.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-xl font-medium">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="hero-ink">
        <div className="container py-16 text-center sm:py-24">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium sm:text-4xl">Ready to join our community?</h2>
          <p className="mx-auto mt-5 max-w-xl text-white/75">
            Whether you are looking for your next job or the right candidate, we are here to help.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-gold">Register as a candidate</Link>
            <Link to="/post-job" className="chip-area h-12 justify-center px-6 text-base">Post a job opening</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
