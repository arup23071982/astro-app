import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CartDrawer from "@/components/ui/cart-drawer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentLanguage, setLanguage, t } = useLanguage();

  // Check if user is authenticated
  const { data: user } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!localStorage.getItem("token"),
  });

  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const languages = [
    // English (International)
    { value: "en", label: "English" },
    
    // Major Indian Languages
    { value: "hi", label: "हिंदी (Hindi)" },
    { value: "bn", label: "বাংলা (Bengali)" },
    { value: "te", label: "తెలుగు (Telugu)" },
    { value: "mr", label: "मराठी (Marathi)" },
    { value: "ta", label: "தமிழ் (Tamil)" },
    { value: "gu", label: "ગુજરાતી (Gujarati)" },
    { value: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { value: "or", label: "ଓଡ଼ିଆ (Odia)" },
    { value: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
    { value: "ml", label: "മലയാളം (Malayalam)" },
    { value: "as", label: "অসমীয়া (Assamese)" },
    { value: "ur", label: "اردو (Urdu)" },
    { value: "sa", label: "संस्कृतम् (Sanskrit)" },
    
    // Major World Languages
    { value: "es", label: "Español (Spanish)" },
    { value: "fr", label: "Français (French)" },
    { value: "de", label: "Deutsch (German)" },
    { value: "it", label: "Italiano (Italian)" },
    { value: "pt", label: "Português (Portuguese)" },
    { value: "ru", label: "Русский (Russian)" },
    { value: "zh", label: "中文 (Chinese)" },
    { value: "ja", label: "日本語 (Japanese)" },
    { value: "ko", label: "한국어 (Korean)" },
    { value: "ar", label: "العربية (Arabic)" },
    
    // European Languages
    { value: "nl", label: "Nederlands (Dutch)" },
    { value: "sv", label: "Svenska (Swedish)" },
    { value: "no", label: "Norsk (Norwegian)" },
    { value: "da", label: "Dansk (Danish)" },
    { value: "fi", label: "Suomi (Finnish)" },
    { value: "pl", label: "Polski (Polish)" },
    { value: "cs", label: "Čeština (Czech)" },
    { value: "hu", label: "Magyar (Hungarian)" },
    { value: "ro", label: "Română (Romanian)" },
    { value: "el", label: "Ελληνικά (Greek)" },
    { value: "tr", label: "Türkçe (Turkish)" },
    
    // Middle Eastern & Central Asian
    { value: "fa", label: "فارسی (Persian)" },
    { value: "he", label: "עברית (Hebrew)" },
    
    // Southeast Asian
    { value: "th", label: "ไทย (Thai)" },
    { value: "vi", label: "Tiếng Việt (Vietnamese)" },
    { value: "id", label: "Bahasa Indonesia" },
    { value: "ms", label: "Bahasa Melayu (Malay)" },
    { value: "fil", label: "Filipino" },
    
    // African Languages
    { value: "sw", label: "Kiswahili (Swahili)" },
    { value: "af", label: "Afrikaans" },
    
    // Additional Languages
    { value: "uk", label: "Українська (Ukrainian)" },
    { value: "bg", label: "Български (Bulgarian)" },
    { value: "hr", label: "Hrvatski (Croatian)" },
    { value: "sk", label: "Slovenčina (Slovak)" },
    { value: "sl", label: "Slovenščina (Slovenian)" },
    { value: "et", label: "Eesti (Estonian)" },
    { value: "lv", label: "Latviešu (Latvian)" },
    { value: "lt", label: "Lietuvių (Lithuanian)" },
  ];

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/booking", label: t("bookConsultation") },
    { href: "/courses", label: t("courses") },
    { href: "/home-tuition", label: t("homeTuition") },
    { href: "/products", label: t("products") },
  ];

  // Only show Admin Dashboard on admin pages
  if (location.startsWith('/admin')) {
    navItems.push({ href: "/admin", label: t("adminDashboard") });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-glass" data-testid="navigation">
      <div className="max-w-full mx-auto px-1 sm:px-2 lg:px-4">
        <div className="flex items-center justify-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" data-testid="logo-link">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border-2 border-dashed border-primary/50 flex items-center justify-center neon-border hover:bg-primary/30 transition-colors">
              <span className="text-primary text-xs font-medium">LOGO</span>
            </div>
            <span className="font-bold text-xl neon-text text-primary hidden md:block whitespace-nowrap">
              Jai Guru Astro Remedy
            </span>
          </Link>

          {/* Navigation - Close to Logo */}
          <div className="hidden lg:flex items-center space-x-6 ml-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-foreground hover:text-primary transition-colors text-base font-medium whitespace-nowrap ${
                  location === item.href ? "text-primary" : ""
                }`}
                data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions - Close to Navigation */}
          <div className="hidden lg:flex items-center space-x-4 ml-8">
            {/* Language Selector */}
            <Select value={currentLanguage} onValueChange={(value) => setLanguage(value as any)} data-testid="language-selector">
              <SelectTrigger className="w-32 form-input text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/20">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CartDrawer />
            
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-foreground text-sm">{t("welcome")}, {user && typeof user === 'object' && 'fullName' in user ? (user.fullName || (user as any).username) : 'User'}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-foreground border-primary/30 hover:bg-primary/10"
                  data-testid="logout-button"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("logout")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth">
                  <Button variant="outline" size="sm" className="text-foreground border-primary/30 hover:bg-primary/10" data-testid="login-button">
                    <User className="w-4 h-4 mr-2" />
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/booking">
                  <Button className="neon-button text-primary-foreground font-semibold" data-testid="book-consultation-button">
                    {t("bookConsultation")}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden" data-testid="mobile-menu-button">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-card w-full sm:w-80">
              <div className="flex flex-col space-y-6 mt-6">
                {/* Mobile Navigation Links */}
                <div className="space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block text-foreground hover:text-primary transition-colors py-2 ${
                        location === item.href ? "text-primary font-semibold" : ""
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Language Selector */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                  <Select value={currentLanguage} onValueChange={(value) => setLanguage(value as any)}>
                    <SelectTrigger className="w-full form-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-primary/20">
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="space-y-3 pt-4 border-t border-primary/20">
                  {isAuthenticated ? (
                    <>
                      <div className="text-foreground text-sm">{t("welcome")}, {user && typeof user === 'object' && 'fullName' in user ? (user.fullName || (user as any).username) : 'User'}</div>
                      <Button
                        variant="outline"
                        className="w-full text-foreground border-primary/30 hover:bg-primary/10"
                        onClick={handleLogout}
                        data-testid="mobile-logout-button"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("logout")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full text-foreground border-primary/30 hover:bg-primary/10" data-testid="mobile-login-button">
                          <User className="w-4 h-4 mr-2" />
                          {t("login")}
                        </Button>
                      </Link>
                      <Link href="/booking" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full neon-button text-primary-foreground font-semibold" data-testid="mobile-book-consultation-button">
                          Book Consultation
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
