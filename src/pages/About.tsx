import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { CheckCircle2, Target, Heart, Users, TrendingUp } from "lucide-react";

const About = () => {
  const values = [
    {
      title: "Integrity",
      description: "We uphold the highest standards of honesty and transparency in every connection we facilitate.",
      icon: CheckCircle2,
    },
    {
      title: "Compassion",
      description: "Our approach is rooted in understanding the unique needs and aspirations of every individual.",
      icon: Heart,
    },
    {
      title: "Service",
      description: "We are dedicated to serving our community by bridging the gap between talent and opportunity.",
      icon: Users,
    },
    {
      title: "Excellence",
      description: "We strive for excellence in our platform's performance and the quality of support we provide.",
      icon: TrendingUp,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/about_hero.png"
            alt="About Us Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>
        <div className="container relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Empowering Careers, <br />
            <span className="text-primary">Enriching Communities</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200"
          >
            Hare Krishna Job Placement is more than just a job portal. We are a bridge between 
            dedicated professionals and organizations that value purpose-driven work.
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2025 with a vision to create a centralized platform for the devotee community, 
                  Hare Krishna Job Placement began as a humble initiative to help friends and family 
                  find meaningful work within organizations that share their values.
                </p>
                <p>
                  As the community grew, so did the need for a professional, scalable, and 
                  efficient way to manage career opportunities. Today, we serve thousands of 
                  candidates and hundreds of employers across various sectors, from non-profits 
                  and educational institutions to corporate enterprises.
                </p>
                <p>
                  Our mission remains unchanged: to facilitate connections that are not just 
                  financially rewarding, but spiritually and professionally fulfilling.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="/our_values.png"
                alt="Our Values"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>


      {/* Mission & Vision Section */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card p-8 rounded-2xl border border-border shadow-card"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To connect talented individuals with opportunities that align with their skills 
                and spiritual values, fostering a community of professionals dedicated to 
                service and excellence.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card p-8 rounded-2xl border border-border shadow-card"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To become the premier global platform for career development within the 
                devotee community, recognized for our integrity, innovation, and impact 
                on lives.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-surface">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Core Values</h2>
            <p className="text-muted-foreground">
              These principles guide everything we do, from the features we build to the 
              way we interact with our users.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-6 rounded-xl border border-border text-center hover:shadow-card-hover transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-primary w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Whether you're looking for your dream job or the perfect candidate, 
            Hare Krishna Job Placement is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Get Started as Candidate
            </a>
            <a
              href="/post-job"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              Post a Job Opening
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
