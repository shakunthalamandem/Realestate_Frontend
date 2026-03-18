import { useEffect } from "react";
import { ArrowUpRight, Building2, Globe, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactItems = [
  { icon: Mail, label: "Email", value: "contact@ghills.ai", href: "mailto:contact@ghills.ai" },
  { icon: Globe, label: "Website", value: "https://ghills.ai/", href: "https://ghills.ai/" },
  { icon: Building2, label: "Company", value: "Golden Hills Capital India Pvt Ltd", href: "https://ghills.ai/" },
];

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef4ff_48%,_#f8fafc_100%)]">
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(30,64,175,0.14),_transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
          <div className="text-center mb-14">
            <span className="inline-flex items-center rounded-full border border-[#BFDBFE] bg-white/75 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#1D4ED8] shadow-sm backdrop-blur">
              Contact Vertex AI
            </span>
            <h1 className="mt-6 text-4xl font-semibold text-[#0F172A] tracking-tight md:text-5xl">
              Let&apos;s talk about your needs
            </h1>
            <p className="mt-5 text-lg text-[#475569] max-w-2xl mx-auto leading-8">
              Connect with the Golden Hills team for product questions, partnership discussions, or
              a guided walkthrough of Vertex AI.
            </p>
          </div>

          <div className="mb-10 rounded-[28px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur md:p-10">
            <div className="mb-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <h2 className="text-2xl font-semibold text-[#0F172A]">
                  Get in touch with our team
                </h2>
                <p className="mt-3 text-[#64748B] leading-7">
                  We support investors, operators, and analysts using Vertex AI for portfolio
                  monitoring, rent intelligence, market research, and deal underwriting.
                </p>
              </div>
              <div className="rounded-2xl border border-[#DBEAFE] bg-[linear-gradient(135deg,_#EFF6FF,_#F8FAFC)] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
                  Response
                </p>
                <p className="mt-3 text-3xl font-semibold text-[#0F172A]">Within 1 business day</p>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  Reach out for platform access, demos, or policy-related questions and You&apos;ll
                  be routed to the appropriate team promptly.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="group rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_18px_40px_rgba(30,64,175,0.10)]"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#1D4ED8] transition-colors group-hover:bg-[#DBEAFE]">
                    <item.icon size={28} strokeWidth={1.6} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center justify-center gap-1 text-sm font-semibold text-[#0F172A] transition-colors hover:text-[#1D4ED8] break-all"
                    >
                      {item.value}
                      <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <p className="mt-3 text-sm font-semibold text-[#0F172A]">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
