import { Link } from "wouter";
import { Mail, Phone, Globe, Facebook, Twitter, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const quickLinks = [
    { href: "/", label: t("home") },
    { href: "/booking", label: t("bookConsultation") },
    { href: "/courses", label: t("courses") },
    { href: "/products", label: t("products") },
  ];

  const services = [
    { href: "/booking?type=video", label: t("videoConsultation") },
    { href: "/booking?type=audio", label: t("audioConsultation") },
    { href: "/booking?type=chat", label: t("chatConsultation") },
    { href: "/booking?type=in-person", label: t("inPersonReading") },
  ];

  const legalLinks = [
    { href: "/privacy", label: t("privacyPolicy") },
    { href: "/terms", label: t("termsOfService") },
    { href: "/disclaimer", label: t("disclaimer") },
    { href: "/refund", label: t("refundPolicy") },
  ];

  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 mt-16 relative z-10" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center neon-border overflow-hidden">
                  {/* Animated Background Stars */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse" style={{top: '20%', left: '30%'}} />
                    <div className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500" style={{top: '60%', left: '70%'}} />
                    <div className="absolute w-0.5 h-0.5 bg-purple-200 rounded-full animate-pulse delay-1000" style={{top: '80%', left: '50%'}} />
                  </div>
                  
                  {/* Central Star Symbol */}
                  <div className="relative z-20">
                    <div className="text-lg font-bold text-yellow-300 drop-shadow-lg">
                      ✦
                    </div>
                  </div>
                  
                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-400/10 rounded-lg pointer-events-none z-10" />
                </div>
                <span className="font-bold text-xl neon-text text-primary">
                  Jai Guru Astro Remedy
                </span>
              </div>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Expert Vedic astrology consultations and cosmic guidance by Arup Shastri with 18+ years of experience.
                Unlock the secrets of the universe with personalized readings and authentic astrological remedies.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/jaiguruastroremedy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary rounded-full flex items-center justify-center neon-border hover:scale-110 transition-transform"
                  data-testid="social-facebook"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-primary-foreground" />
                </a>
                <a 
                  href="https://twitter.com/jaiguruastro" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ boxShadow: "0 0 20px var(--secondary)" }}
                  data-testid="social-twitter"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-secondary-foreground" />
                </a>
                <a 
                  href="https://instagram.com/jaiguruastroremedy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center neon-border hover:scale-110 transition-transform"
                  style={{ boxShadow: "0 0 20px #e91e63" }}
                  data-testid="social-instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-foreground">{t("quickLinks")}</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      data-testid={`footer-link-${link.href.replace(/[^a-zA-Z0-9]/g, "-")}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    href="/about" 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    data-testid="footer-link-about"
                  >
                    {t("aboutArupShastri")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-foreground">{t("services")}</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.href}>
                    <Link 
                      href={service.href} 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      data-testid={`footer-service-${service.href.replace(/[^a-zA-Z0-9]/g, "-")}`}
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    href="/products" 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    data-testid="footer-service-remedies"
                  >
                    {t("astrologicalRemedies")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Legal */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-foreground">{t("contactLegal")}</h4>
              <ul className="space-y-3 mb-6">
                <li className="text-muted-foreground text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href="mailto:info@jaiguruastroremedy.com" className="hover:text-primary transition-colors">
                      info@jaiguruastroremedy.com
                    </a>
                  </div>
                </li>
                <li className="text-muted-foreground text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-secondary" />
                    <a href="tel:+919876543210" className="hover:text-secondary transition-colors">
                      +91 98765-43210
                    </a>
                  </div>
                </li>
                <li className="text-muted-foreground text-sm">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-6 h-6 text-accent" style={{ 
                      filter: 'drop-shadow(0 0 8px hsl(279, 100%, 50%))',
                      color: 'hsl(279, 100%, 50%)',
                      strokeWidth: '2'
                    }} />
                    <span>{t("availableGlobally")}</span>
                  </div>
                </li>
              </ul>
              
              <div className="space-y-2">
                {legalLinks.map((link) => (
                  <div key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors text-xs block"
                      data-testid={`footer-legal-${link.href.replace(/[^a-zA-Z0-9]/g, "-")}`}
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-primary/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-muted-foreground text-sm text-center md:text-left">
                © {currentYear} {t("copyrightText")}
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-muted-foreground">
                <span>🌟 {t("yearsOfExcellence")}</span>
                <span className="hidden sm:block">•</span>
                <span>🔮 {t("trustedByClients")}</span>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-6 p-4 glass rounded-lg">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                <strong>{t("importantDisclaimer")}:</strong> {t("disclaimerText")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
