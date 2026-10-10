import { Link } from "react-router-dom";
import { LOCATIONS } from "@/lib/seoConfig";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const footerLink =
  "rounded-sm text-sm text-white/70 transition-colors hover:text-white focus-visible:text-white";

const Footer = () => (
  <footer className="relative bg-brand-ink text-white">
    <div className="brand-ribbon" aria-hidden="true" />
    <div className="container py-14">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-md bg-white p-1.5">
              <img
                src="/logo-192.webp"
                width={48}
                height={48}
                alt="Hare Krishna Job Placement logo"
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-medium tracking-tight">Hare Krishna</span>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                Job Placement
              </span>
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            Find your path. Serve with purpose. Connecting devotees with meaningful career opportunities.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[
              {
                href: "https://www.facebook.com/share/16GoJDMm55/",
                label: "Facebook",
                Icon: Facebook,
              },
              {
                href: "https://www.instagram.com/harekrishnajobplacement?utm_source=qr&igsh=MTUwYTZhbjRzYm1jbQ==",
                label: "Instagram",
                Icon: Instagram,
              },
              {
                href: "https://www.linkedin.com/in/hare-krishna-job-placement-a2066435a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
                label: "LinkedIn",
                Icon: Linkedin,
              },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Candidates" className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-white">For candidates</h2>
          <ul className="space-y-2.5">
            <li><Link to="/jobs" className={footerLink}>Browse Jobs</Link></li>
            <li><Link to="/register" className={footerLink}>Register</Link></li>
            <li><Link to="/login" className={footerLink}>Login</Link></li>
          </ul>
        </nav>

        <nav aria-label="Employers" className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-white">For employers</h2>
          <ul className="space-y-2.5">
            <li><Link to="/post-job" className={footerLink}>Post a Job</Link></li>
          </ul>
        </nav>

        <nav aria-label="Company" className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-white">Company</h2>
          <ul className="space-y-2.5">
            <li><Link to="/about" className={footerLink}>About Us</Link></li>
            <li><Link to="/contact" className={footerLink}>Contact Us</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-2 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-white">Contact</h2>
          <address className="space-y-3 not-italic">
            <p className="flex items-start gap-2.5 text-sm text-white/70">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="sr-only">Phone: </span>
                <a href="tel:+919879821908" className="transition-colors hover:text-white">98798 21908</a>
              </span>
            </p>
            <p className="flex items-start gap-2.5 break-all text-sm text-white/70">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="sr-only">Email: </span>
                <a href="mailto:harekrishnajobplacement@gmail.com" className="transition-colors hover:text-white">
                  harekrishnajobplacement@gmail.com
                </a>
              </span>
            </p>
            <p className="flex items-start gap-2.5 text-sm text-white/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="sr-only">Address: </span>
                <a
                  href="https://www.google.com/maps?q=Shop+4,+Harikrishna+Plaza,+Raghuvanshi+Rd,+near+Sarah's+Academy,+Char+Raasta,+Ravalvadi,+Bhuj,+Gujarat+370001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Shop 4, Harikrishna Plaza, Bhuj, Gujarat 370001
                </a>
              </span>
            </p>
          </address>
        </div>
      </div>

      <p className="mt-12 border-t border-white/10 pt-8 text-sm leading-relaxed text-white/60">
        Job placement for candidates and employers in {LOCATIONS.map((l) => l.name).join(", ")}. Jobs are posted from
        across India and worldwide.
      </p>

      <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Hare Krishna Job Placement. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
