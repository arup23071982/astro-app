import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Globe, Award, Video, MessageSquare, Phone, MapPin, Home as HomeIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
// AutoTranslate import removed - using t() function instead

export default function Home() {
  const { t } = useLanguage();
  
  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const stats = [
    { icon: Award, label: t("yearsExperience"), value: "18+", color: "text-primary" },
    { icon: Users, label: t("satisfiedClients"), value: "5000+", color: "text-secondary" },
    { icon: Globe, label: t("countriesServed"), value: "100+", color: "text-pink-500" },
  ];

  const consultationTypes = [
    {
      icon: Video,
      title: t("videoCall"),
      description: t("videoCallDesc"),
      price: "₹2,500",
      color: "primary",
      href: "/booking?type=video",
    },
    {
      icon: Phone,
      title: t("audioCall"),
      description: t("audioCallDesc"),
      price: "₹1,800",
      color: "secondary",
      href: "/booking?type=audio",
    },
    {
      icon: MessageSquare,
      title: t("chatSession"),
      description: t("chatSessionDesc"),
      price: "₹1,200",
      color: "accent",
      href: "/booking?type=chat",
    },
    {
      icon: MapPin,
      title: t("inPerson"),
      description: t("inPersonDesc"),
      price: "₹5,000",
      color: "yellow",
      href: "/booking?type=in-person",
    },
    {
      icon: HomeIcon,
      title: t("homeService"),
      description: t("homeServiceDesc"),
      price: "₹2,499",
      color: "amber",
      href: "/booking?type=home-service",
    },
  ];

  const testimonials = [
    {
      name: t("priyaSharma"),
      location: t("mumbaiIndia"),
      rating: 5,
      content: t("testimonial1"),
      initials: "P.S.",
    },
    {
      name: t("michaelJohnson"), 
      location: t("newYorkUSA"),
      rating: 5,
      content: t("testimonial2"),
      initials: "M.J.",
    },
    {
      name: t("sarahMitchell"),
      location: t("londonUK"), 
      rating: 5,
      content: t("testimonial3"),
      initials: "S.M.",
    },
  ];

  const featuredCourses = Array.isArray(courses) ? courses.slice(0, 3) : [];
  const featuredProducts = Array.isArray(products) ? products.slice(0, 4) : [];

  return (
    <div className="min-h-screen pt-16" data-testid="home-page">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" data-testid="hero-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text text-primary animate-float" data-testid="hero-title">
              {t("heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="hero-description">
              {t("heroSubtitle")}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/booking">
                <NeonButton size="lg" className="text-lg px-8 py-4" data-testid="book-reading-button">
                  {t("bookReadingNow")}
                </NeonButton>
              </Link>
              <Link href="/courses">
                <NeonButton size="lg" className="text-lg px-8 py-4" data-testid="explore-courses-button">
                  {t("exploreCourses")}
                </NeonButton>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <GlassCard key={index} className="p-6 text-center" hover data-testid={`stat-${index}`}>
                  <stat.icon className={`w-12 h-12 mx-auto mb-2 neon-border rounded-full p-3 ${stat.color}`} style={{ 
                    filter: 'drop-shadow(0 0 12px currentColor) brightness(1.2)',
                    background: index === 2 ? 'rgba(20, 20, 40, 0.8)' : 'rgba(255, 193, 7, 0.1)',
                    border: index === 2 ? '2px solid rgba(255, 193, 7, 0.4)' : '1px solid rgba(255, 193, 7, 0.2)',
                    strokeWidth: index === 2 ? '3' : '2',
                    color: index === 2 ? '#e91e63' : undefined,
                    fill: index === 2 ? 'rgba(20, 20, 40, 0.3)' : 'none'
                  }} />
                  <div className="text-3xl font-bold text-primary neon-text mb-2" data-testid={`stat-value-${index}`} style={{ 
                    textShadow: '0 0 10px hsl(42, 92%, 56%)' 
                  }}>{stat.value}</div>
                  <div className="text-muted-foreground" data-testid={`stat-label-${index}`}>{stat.label}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Astrologer Profile Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" data-testid="astrologer-profile">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                  alt="Arup Shastri - Expert Vedic Astrologer" 
                  className="rounded-2xl shadow-2xl w-full max-w-md mx-auto neon-border"
                  data-testid="astrologer-image"
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-6 neon-text text-primary" data-testid="astrologer-title">
                  {t("meetAstrologer")}
                </h2>
                <p className="text-lg text-muted-foreground mb-6" data-testid="astrologer-description">
                  {t("astrologerDescription")}
                </p>
                
                {/* Expertise Areas */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {[
                    { title: t("vedicAstrology"), desc: t("vedicAstrologyDesc") },
                    { title: t("palmistry"), desc: t("palmistryDesc") },
                    { title: t("numerology"), desc: t("numerologyDesc") },
                    { title: t("cosmicRemedies"), desc: t("cosmicRemediesDesc") },
                    { title: t("vedicVastu"), desc: t("vedicVastuDesc") },
                    { title: t("yogaMeditation"), desc: t("yogaMeditationDesc") },
                  ].map((expertise, index) => (
                    <div key={index} className="glass p-4 rounded-lg" data-testid={`expertise-${index}`}>
                      <h4 className="font-semibold text-primary mb-2">{expertise.title}</h4>
                      <p className="text-sm text-muted-foreground">{expertise.desc}</p>
                    </div>
                  ))}
                </div>

                <Link href="/booking">
                  <NeonButton data-testid="schedule-consultation-button">
                    {t("scheduleConsultation")}
                  </NeonButton>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" data-testid="services-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text text-primary" data-testid="services-title">
              {t("consultationServices")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="services-description">
              {t("servicesDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {consultationTypes.map((consultation, index) => (
              <GlassCard key={index} className="p-8 text-center" hover data-testid={`consultation-${index}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  consultation.color === 'primary' ? 'bg-primary neon-border' :
                  consultation.color === 'secondary' ? 'bg-secondary' :
                  consultation.color === 'accent' ? 'bg-accent' :
                  'bg-gradient-to-br from-purple-500 to-pink-500'
                }`} style={
                  consultation.color === 'primary' ? { boxShadow: '0 0 20px hsl(42, 92%, 56%)' } :
                  consultation.color === 'secondary' ? { boxShadow: '0 0 20px hsl(195, 100%, 50%)' } :
                  consultation.color === 'accent' ? { boxShadow: '0 0 20px hsl(279, 100%, 50%)', background: 'hsl(279, 100%, 50%)' } :
                  { boxShadow: '0 0 20px #e91e63', background: 'linear-gradient(to bottom right, #8b5cf6, #ec4899)' }
                }>
                  <consultation.icon className={`w-8 h-8 ${
                    consultation.color === 'yellow' ? 'text-white' : 
                    consultation.color === 'primary' ? 'text-primary-foreground' :
                    consultation.color === 'secondary' ? 'text-secondary-foreground' :
                    'text-white'
                  }`} style={
                    consultation.color === 'accent' ? { 
                      filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                      strokeWidth: '2'
                    } : consultation.color === 'yellow' ? {
                      filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                      strokeWidth: '2'
                    } : {}
                  } />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground" data-testid={`consultation-title-${index}`}>
                  {consultation.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-sm" data-testid={`consultation-description-${index}`}>
                  {consultation.description}
                </p>
                <div className={`text-2xl font-bold mb-4 ${
                  consultation.color === 'primary' ? 'text-primary' :
                  consultation.color === 'secondary' ? 'text-secondary' :
                  consultation.color === 'accent' ? 'text-accent' :
                  'text-pink-500'
                }`} style={
                  consultation.color === 'accent' ? { 
                    color: 'hsl(279, 100%, 60%)', 
                    textShadow: '0 0 10px hsl(279, 100%, 50%)' 
                  } : consultation.color === 'yellow' ? {
                    color: '#ec4899',
                    textShadow: '0 0 10px #e91e63'
                  } : {}
                } data-testid={`consultation-price-${index}`}>
                  {consultation.price}
                </div>
                <Link href={consultation.href}>
                  <button 
                    className="w-full py-3 rounded-lg font-semibold transition-all neon-button text-primary-foreground"
                    data-testid={`consultation-book-${index}`}>
                    {consultation.color === 'primary' ? t('bookVideoSession') :
                     consultation.color === 'secondary' ? t('bookAudioSession') :
                     consultation.color === 'accent' ? t('startChatSession') :
                     consultation.color === 'yellow' ? t('bookInPerson') :
                     t('bookHomeService')}
                  </button>
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* All Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" data-testid="all-services-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text text-primary" data-testid="all-services-title">
              {t("allServices")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="all-services-description">
              {t("allServicesDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Consultation Services */}
            <GlassCard className="p-8 text-center group" hover data-testid="service-consultations">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 neon-border group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px hsl(42, 92%, 56%)' }}>
                <Video className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{t("liveConsultations")}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{t("liveConsultationsDesc")}</p>
              <div className="text-lg font-semibold text-primary">{t("startingFrom")} ₹1,200</div>
            </GlassCard>

            {/* Astrology Courses */}
            <GlassCard className="p-8 text-center group" hover data-testid="service-courses">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px hsl(195, 100%, 50%)' }}>
                <Award className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{t("vedicAstrologyCourses")}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{t("vedicAstrologyCoursesDesc")}</p>
              <div className="text-lg font-semibold text-secondary">{t("beginnerToExpert")}</div>
            </GlassCard>

            {/* Cosmic Products */}
            <GlassCard className="p-8 text-center group" hover data-testid="service-products">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px hsl(279, 100%, 50%)' }}>
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{t("cosmicRemedies")}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{t("cosmicRemediesFullDesc")}</p>
              <div className="text-lg font-semibold text-primary neon-text">{t("authenticBlessed")}</div>
            </GlassCard>

            {/* Vedic Services */}
            <GlassCard className="p-8 text-center group" hover data-testid="service-vedic">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px #f97316' }}>
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{t("traditionalWisdom")}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{t("palmistryFullDesc")}</p>
              <div className="text-lg font-semibold" style={{ color: '#f97316' }}>18+ {t("yearsExperience")}</div>
            </GlassCard>

            {/* Vastu Shastra */}
            <GlassCard className="p-8 text-center group" hover data-testid="service-vastu">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px #10b981' }}>
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{t("vedicVastu")}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{t("vedicVastuFullDesc")}</p>
              <div className="text-lg font-semibold" style={{ color: '#10b981' }}>
                {t("sacredGeometry")}
              </div>
            </GlassCard>

            {/* Yoga & Meditation */}
            <GlassCard className="p-8 text-center group" hover data-testid="service-yoga">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px #e91e63' }}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{t("yogaMeditation")}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{t("yogaMeditationFullDesc")}</p>
              <div className="text-lg font-semibold" style={{ color: '#e91e63' }}>{t("mindBodyHarmony")}</div>
            </GlassCard>

            {/* Home Service */}
            <GlassCard className="p-8 text-center group" hover data-testid="service-home">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 20px #fbbf24' }}>
                <HomeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{t("homeService")}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{t("homeServiceFullDesc")}</p>
              <div className="text-lg font-semibold" style={{ color: '#fbbf24' }}>{t("sacredHomeVisits")}</div>
            </GlassCard>
          </div>

          <div className="text-center mt-12">
            <Link href="/booking">
              <NeonButton size="lg" className="text-lg px-8 py-4" data-testid="explore-all-services-button">
                {t("allServices")}
              </NeonButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8" data-testid="featured-courses">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text text-primary">
                {t("courses")}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t("vedicAstrologyCoursesDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <GlassCard key={course.id} className="p-6" hover data-testid={`featured-course-${index}`}>
                  <Badge className="mb-4" variant={
                    course.level === 'beginner' ? 'default' :
                    course.level === 'intermediate' ? 'secondary' :
                    'destructive'
                  }>
                    {course.level}
                  </Badge>
                  <h3 className="text-xl font-bold mb-4 text-foreground" data-testid={`course-title-${index}`}>
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm" data-testid={`course-description-${index}`}>
                    {course.description}
                  </p>
                  <div className="text-2xl font-bold text-primary mb-6" data-testid={`course-price-${index}`}>
                    ₹{course.price}
                  </div>
                  <Link href="/courses">
                    <NeonButton size="sm" className="w-full" data-testid={`course-enroll-${index}`}>
                      {t("learnMore") || "Learn More"}
                    </NeonButton>
                  </Link>
                </GlassCard>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/courses">
                <NeonButton size="lg" className="text-lg px-8 py-4" data-testid="view-all-courses">
                  {t("viewAllCourses")}
                </NeonButton>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8" data-testid="featured-products">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text text-primary">
                {t("cosmicRemedies")}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t("cosmicRemediesDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <GlassCard key={product.id} className="p-6" hover data-testid={`featured-product-${index}`}>
                  <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground">Product Image</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground" data-testid={`product-title-${index}`}>
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm" data-testid={`product-description-${index}`}>
                    {product.description.substring(0, 80)}...
                  </p>
                  <div className="text-lg font-bold text-primary mb-4" data-testid={`product-price-${index}`}>
                    Starting ₹{product.price}
                  </div>
                  <Link href="/products">
                    <NeonButton size="sm" className="w-full" data-testid={`product-view-${index}`}>
                      {t("viewProduct")}
                    </NeonButton>
                  </Link>
                </GlassCard>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/products">
                <NeonButton size="lg" className="text-lg px-8 py-4" data-testid="view-all-products">
                  {t("browseAllProducts")}
                </NeonButton>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text text-primary">
              Client Testimonials
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("discoverGuidance")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <GlassCard key={index} className="p-8" data-testid={`testimonial-${index}`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-foreground font-bold" data-testid={`testimonial-initials-${index}`}>
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground" data-testid={`testimonial-name-${index}`}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`testimonial-location-${index}`}>
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <div className="flex text-yellow-500 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star key={starIndex} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground" data-testid={`testimonial-content-${index}`}>
                  "{testimonial.content}"
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" data-testid="cta-section">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12 text-center neon-border">
            <h3 className="text-3xl font-bold mb-4 text-primary" data-testid="cta-title">
              {t("readyToDiscover")}
            </h3>
            <p className="text-muted-foreground mb-8 text-lg" data-testid="cta-description">
              {t("bookPersonalizedConsultation")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <NeonButton size="lg" className="text-lg px-8 py-4" data-testid="cta-book-button">
                  {t("bookConsultation")}
                </NeonButton>
              </Link>
              <Link href="/courses">
                <NeonButton size="lg" className="text-lg px-8 py-4" data-testid="cta-learn-button">
                  Start Learning Astrology
                </NeonButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Floating Action Button */}
      <Link href="/booking">
        <button 
          className="fixed bottom-6 right-6 z-50 neon-button w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-transform"
          title={t("quickBooking")}
          data-testid="floating-book-button"
        >
          <Phone className="w-8 h-8 text-primary-foreground mx-auto" />
        </button>
      </Link>
    </div>
  );
}
