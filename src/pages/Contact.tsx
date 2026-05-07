import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

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
      {/* Hero Section */}
      <section className="bg-surface py-16 border-b border-border">
        <div className="container px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Have questions or need assistance? We're here to help. Reach out to us 
            via the form below or through our contact information.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
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
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-card transition-all group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                      <info.icon className="text-primary w-5 h-5 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
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
                className="bg-card p-8 md:p-10 rounded-2xl border border-border shadow-card"
              >
                <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        required
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
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        required
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      required
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
                    className="w-full h-12 text-base font-bold"
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
            <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="border border-border bg-card rounded-xl px-6"
                >
                  <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[450px] w-full bg-surface border-t border-border relative">
        <iframe
          title="Office Location"
          src="https://www.google.com/maps?q=23.2460209,69.6466976&z=17&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute bottom-8 left-8 bg-card p-4 rounded-xl border border-border shadow-xl max-w-[250px] hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
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
