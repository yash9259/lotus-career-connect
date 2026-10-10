import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Seo, { getSiteUrl } from "@/components/seo/Seo";
import PageHeader from "@/components/layout/PageHeader";
import FaqList from "@/components/seo/FaqList";
import { STATIC_ROUTES, breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seoConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const contactMeta = STATIC_ROUTES.find((route) => route.path === "/contact")!;
const contactCrumbs = [{ label: "Home", to: "/" }, { label: "Contact Us" }];

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Thank you! Your message has been sent successfully.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 98798 21908",
      link: "tel:+919879821908",
    },
    {
      icon: Mail,
      label: "Email",
      value: "harekrishnajobplacement@gmail.com",
      link: "mailto:harekrishnajobplacement@gmail.com",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Shop 4, Harikrishna Plaza, Bhuj, Gujarat 370001",
      link: "https://www.google.com/maps?q=Shop+4,+Harikrishna+Plaza,+Raghuvanshi+Rd,+near+Sarah's+Academy,+Char+Raasta,+Ravalvadi,+Bhuj,+Gujarat+370001",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+91 98798 21908",
      link: "https://wa.me/919879821908",
    },
  ];

  const faqs = [
    {
      question: "How can I register as a candidate?",
      answer: "You can register by clicking the 'Register' button on the homepage and filling in your professional details.",
    },
    {
      question: "Is there a fee to post a job?",
      answer: "Currently, we offer both free and featured job posting options. Contact us for premium listing details.",
    },
    {
      question: "How long does it take for a job to be approved?",
      answer: "Most jobs are reviewed and approved within 24 hours of submission.",
    },
  ];

  return (
    <Layout>
      <Seo
        title={contactMeta.title}
        description={contactMeta.description}
        jsonLd={[
          breadcrumbSchema(getSiteUrl(), contactCrumbs),
          webPageSchema(getSiteUrl(), { path: "/contact", type: "ContactPage", name: contactMeta.title, description: contactMeta.description }),
          faqSchema(faqs),
        ]}
      />
      <PageHeader
        title="Get in touch"
        crumbs={contactCrumbs}
        description="Have questions or need assistance? Reach out using the form below or through our contact details."
      />

      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <h2 className="font-display text-2xl font-medium mb-6">Contact information</h2>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                      <info.icon className="text-primary w-5 h-5 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        {info.label}
                      </div>
                      <div className="text-foreground font-semibold">{info.value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>

            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-8 md:p-10 rounded-lg border border-border shadow-card"
              >
                <h2 className="font-display text-2xl font-medium mb-8">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="text-sm font-medium">Full Name</label>
                      <Input
                        required
                        id="contact-name"
                        autoComplete="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-sm font-medium">Email Address</label>
                      <Input
                        required
                        id="contact-email"
                        autoComplete="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contact-phone" className="text-sm font-medium">Phone Number</label>
                      <Input
                        id="contact-phone"
                        autoComplete="tel"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-subject" className="text-sm font-medium">Subject</label>
                      <Input
                        required
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-sm font-medium">Message</label>
                    <Textarea
                      required
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className="min-h-[150px] resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>

          {/* FAQ Section Moved Here */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="section-title mb-8">Frequently asked questions</h2>
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[450px] w-full bg-surface border-t border-border relative">
        <iframe
          title="Map showing the Hare Krishna Job Placement office in Bhuj, Gujarat"
          src="https://www.google.com/maps?q=23.2460209,69.6466976&z=17&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute bottom-8 left-8 bg-card p-4 rounded-lg border border-border shadow-premium max-w-[250px] hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
              <MapPin className="text-primary w-4 h-4" />
            </div>
            <span className="font-bold">Our HQ</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Shop 4, Harikrishna Plaza, Bhuj, Gujarat 370001
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
