import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronUp,
  Clock,
  Code2,
  Cpu,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Monitor,
  Network,
  Phone,
  Printer,
  Shield,
  ShieldCheck,
  Star,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "./hooks/useIntersectionObserver";
import { useSubmitContactForm } from "./hooks/useQueries";

// ─── Animated Counter ───────────────────────────────────────────────────────

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, start]);

  return count;
}

// ─── Scroll Reveal Wrapper ───────────────────────────────────────────────────

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });
  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Clients", href: "#clients" },
  { label: "Get In Touch", href: "#contact", cta: true },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = [
        "home",
        "about",
        "services",
        "products",
        "clients",
        "contact",
      ];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.10_0.02_260/0.92)] backdrop-blur-xl shadow-[0_1px_0_oklch(0.35_0.04_255/0.4)] py-3 nav-top-border"
          : "bg-transparent py-5"
      }`}
      style={{ position: "fixed" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick("#home")}
          data-ocid="nav.logo.link"
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric-blue to-[oklch(0.45_0.15_255)] flex items-center justify-center shadow-glow-blue">
            <span className="font-heading font-black text-white text-sm tracking-tight">
              PICL
            </span>
          </div>
          <div className="hidden sm:block">
            <div className="font-heading font-bold text-foreground text-sm leading-tight">
              Perfect Innovative
            </div>
            <div className="text-muted-foreground text-[10px] tracking-widest uppercase">
              Computers Pvt. Ltd
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            if (link.cta) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  data-ocid={`nav.${id}.link`}
                  className="ml-3 px-5 py-2 rounded-lg bg-electric-blue text-white font-heading font-semibold text-sm glow-blue-hover glow-blue transition-all duration-200 hover:bg-[oklch(0.70_0.18_255)]"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                data-ocid={`nav.${id}.link`}
                className={`relative px-4 py-2 text-sm font-body font-medium transition-colors duration-200 rounded-md ${
                  isActive
                    ? "text-electric-blue"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-electric-blue rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-foreground/70 hover:text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.menu.toggle"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden animate-slide-down bg-[oklch(0.12_0.025_260/0.98)] backdrop-blur-xl border-t border-border">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  data-ocid={`nav.mobile.${id}.link`}
                  className={`px-4 py-3 rounded-lg text-sm font-body font-medium transition-colors ${
                    link.cta
                      ? "bg-electric-blue text-white text-center mt-2"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

// ─── Stats Ticker ─────────────────────────────────────────────────────────────

const tickerItems = [
  "🏆 ISO 9001 Certified",
  "👥 30,000+ Users",
  "⏳ 30+ Years Experience",
  "📅 Est. 1995",
  "🔧 52+ Technicians",
  "🗺️ 90% India Coverage",
  "🏛️ 14+ Government Clients",
  "🛡️ Armed Forces Trusted",
  "💻 Pan India Service",
];

function StatsTicker() {
  const items = [
    ...tickerItems.map((t, i) => ({ text: t, id: `a-${i}` })),
    ...tickerItems.map((t, i) => ({ text: t, id: `b-${i}` })),
  ];
  return (
    <div className="relative overflow-hidden bg-[oklch(0.08_0.015_255)] border-y border-[oklch(0.35_0.04_255/0.3)] py-3 marquee-ticker">
      <div className="marquee-track flex gap-10 whitespace-nowrap">
        {items.map((item) => (
          <span
            key={item.id}
            className="text-gold font-body font-semibold text-sm tracking-wide flex items-center gap-2"
          >
            {item.text}
            <span className="text-[oklch(0.35_0.04_255)] ml-4">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

const partnerLogos = [
  { name: "DELL", color: "#007DB8" },
  { name: "Cisco", color: "#1BA0D7" },
  { name: "IBM", color: "#054ADA" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Fortinet", color: "#EE3124" },
  { name: "HPE", color: "#01A982" },
  { name: "VMware", color: "#607078" },
  { name: "Sophos", color: "#1F5E92" },
  { name: "Checkpoint", color: "#E2231A" },
  { name: "Adobe", color: "#FF0000" },
  { name: "Red Hat", color: "#EE0000" },
  { name: "Epson", color: "#003399" },
  { name: "Canon", color: "#CC0000" },
  { name: "Samsung", color: "#1428A0" },
  { name: "Polycom", color: "#003067" },
  { name: "LIPI", color: "#004A97" },
];

function PartnerMarquee() {
  const doubled = [
    ...partnerLogos.map((l, i) => ({ ...l, id: `a-${i}` })),
    ...partnerLogos.map((l, i) => ({ ...l, id: `b-${i}` })),
  ];
  return (
    <div className="relative overflow-hidden marquee-left">
      <div className="marquee-track flex gap-8 items-center">
        {doubled.map((logo) => (
          <div
            key={logo.id}
            className="flex-shrink-0 px-5 py-2 rounded-lg border border-[oklch(0.30_0.03_255/0.4)] bg-[oklch(0.15_0.02_260/0.5)]"
          >
            <span
              className="font-heading font-bold text-sm tracking-wider whitespace-nowrap"
              style={{
                color: logo.color,
                filter: "brightness(1.2) saturate(0.85)",
              }}
            >
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hero Banner Reel cards
const heroBannerCards = [
  {
    img: "/assets/generated/hero-datacenter.dim_1200x700.jpg",
    label: "Data Centre",
    accent: "oklch(0.60 0.20 255)",
  },
  {
    img: "/assets/generated/hero-networking.dim_1200x700.jpg",
    label: "Networking",
    accent: "oklch(0.70 0.18 200)",
  },
  {
    img: "/assets/generated/hero-cybersecurity.dim_1200x700.jpg",
    label: "Cyber Security",
    accent: "oklch(0.60 0.20 30)",
  },
  {
    img: "/assets/generated/hero-enterprise.dim_1200x700.jpg",
    label: "Enterprise IT",
    accent: "oklch(0.78 0.16 70)",
  },
  {
    img: "/assets/generated/hero-india-coverage.dim_1200x700.jpg",
    label: "Pan India",
    accent: "oklch(0.65 0.20 300)",
  },
];

function HeroBannerReel() {
  const doubled = [
    ...heroBannerCards.map((c, i) => ({ ...c, id: `a-${i}` })),
    ...heroBannerCards.map((c, i) => ({ ...c, id: `b-${i}` })),
  ];
  return (
    <div className="relative overflow-hidden mt-10 mb-0">
      <div className="banner-reel-track">
        {doubled.map((card) => (
          <div
            key={card.id}
            className="flex-shrink-0 relative rounded-xl overflow-hidden mx-2"
            style={{ width: "260px", height: "160px" }}
          >
            <img
              src={card.img}
              alt={card.label}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.06_0.015_260/0.85)] via-transparent to-transparent" />
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-6">
              <span
                className="text-xs font-body font-bold tracking-widest uppercase"
                style={{ color: card.accent }}
              >
                {card.label}
              </span>
            </div>
            {/* Border accent */}
            <div
              className="absolute inset-0 rounded-xl border"
              style={{ borderColor: `${card.accent.replace(")", " / 0.3)")}` }}
            />
          </div>
        ))}
      </div>
      {/* Edge fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[oklch(0.10_0.02_260)] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[oklch(0.10_0.02_260)] to-transparent pointer-events-none" />
    </div>
  );
}

// Hero stat pills
const heroPills = [
  {
    icon: Clock,
    value: "30+",
    label: "Years",
    color: "oklch(0.60 0.20 255)",
    bg: "oklch(0.60 0.20 255 / 0.10)",
    border: "oklch(0.60 0.20 255 / 0.35)",
  },
  {
    icon: Users,
    value: "30,000+",
    label: "Users",
    color: "oklch(0.78 0.16 70)",
    bg: "oklch(0.78 0.16 70 / 0.10)",
    border: "oklch(0.78 0.16 70 / 0.35)",
  },
  {
    icon: Award,
    value: "52+",
    label: "Experts",
    color: "oklch(0.70 0.18 200)",
    bg: "oklch(0.70 0.18 200 / 0.10)",
    border: "oklch(0.70 0.18 200 / 0.35)",
  },
  {
    icon: Globe,
    value: "90%",
    label: "Coverage",
    color: "oklch(0.65 0.20 300)",
    bg: "oklch(0.65 0.20 300 / 0.10)",
    border: "oklch(0.65 0.20 300 / 0.35)",
  },
];

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-[oklch(0.10_0.02_260)]">
        {/* Particle dot field */}
        <div className="absolute inset-0 hero-dots opacity-70" />
        {/* Grid overlay — subtle on top of dots */}
        <div className="absolute inset-0 hero-grid opacity-25" />

        {/* Orb 1 — top left */}
        <div
          className="orb-1 absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.60 0.20 255 / 0.18) 0%, transparent 70%)",
          }}
        />

        {/* Orb 2 — bottom right */}
        <div
          className="orb-2 absolute bottom-[5%] right-[5%] w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.50 0.18 265 / 0.14) 0%, transparent 70%)",
          }}
        />

        {/* Orb 3 — center top */}
        <div
          className="orb-3 absolute top-[30%] right-[30%] w-[300px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.16 70 / 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-6 w-full">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6 animate-[fade-up_0.6s_ease_0.2s_both]">
            <span className="px-3 py-1 rounded-full text-xs font-body font-semibold tracking-widest uppercase bg-[oklch(0.60_0.20_255/0.15)] text-electric-blue border border-[oklch(0.60_0.20_255/0.3)]">
              Est. 1995 · ISO 9001 Certified
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="font-heading font-black leading-[1.05] mb-6 animate-[fade-up_0.7s_ease_0.3s_both]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
          >
            <span className="text-foreground block">India's Premier</span>
            <span className="shimmer-text block">IT Systems</span>
            <span className="text-foreground block">Integrator</span>
          </h1>

          {/* Subheadline */}
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-8 animate-[fade-up_0.7s_ease_0.45s_both]">
            Delivering cutting-edge hardware, software, cyber security and
            networking solutions for over 30 years. Trusted by India's Defence
            Forces, Government Bodies, and enterprises nationwide.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-10 animate-[fade-up_0.7s_ease_0.55s_both]">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="hero.explore_services.primary_button"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-electric-blue text-white font-heading font-semibold text-base glow-blue glow-blue-hover transition-all duration-200 hover:bg-[oklch(0.70_0.18_255)] animate-pulse-glow"
            >
              Explore Services <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="hero.contact.secondary_button"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-[oklch(0.35_0.04_255/0.6)] text-foreground font-heading font-semibold text-base transition-all duration-200 hover:border-electric-blue hover:text-electric-blue hover:bg-[oklch(0.60_0.20_255/0.06)]"
            >
              Get In Touch
            </button>
          </div>

          {/* Hero Stat Pills */}
          <div className="flex flex-wrap gap-3 animate-[fade-up_0.7s_ease_0.65s_both]">
            {heroPills.map((pill) => {
              const Icon = pill.icon;
              return (
                <div
                  key={pill.label}
                  className="stat-pill"
                  style={{
                    background: pill.bg,
                    borderColor: pill.border,
                    boxShadow: `0 0 12px ${pill.color.replace(")", " / 0.18)")}`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: pill.bg }}
                  >
                    <Icon size={14} style={{ color: pill.color }} />
                  </div>
                  <span
                    className="font-heading font-black text-base leading-none"
                    style={{ color: pill.color }}
                  >
                    {pill.value}
                  </span>
                  <span className="text-muted-foreground text-xs font-body tracking-wide">
                    {pill.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Banner Reel */}
        <div className="animate-[fade-up_0.7s_ease_0.72s_both]">
          <HeroBannerReel />
        </div>

        {/* Partners marquee */}
        <div className="mt-6 animate-[fade-up_0.7s_ease_0.78s_both]">
          <div className="max-w-7xl mx-auto px-6 mb-3">
            <p className="text-xs text-muted-foreground tracking-widest uppercase font-body">
              Authorized Partner of
            </p>
          </div>
          <PartnerMarquee />
        </div>
      </div>

      {/* Stats ticker */}
      <StatsTicker />

      {/* Scroll indicator */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs text-muted-foreground tracking-widest uppercase font-body">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-electric-blue to-transparent animate-bounce-down" />
      </div>
    </section>
  );
}

// ─── About Section ─────────────────────────────────────────────────────────────

const featureBadges = [
  "Active Services & Immediate Response",
  "30 Years of Experienced Team",
  "State of the Art Technology",
  "Expert Consultation",
  "Qualified & Certified Services",
  "ISO 9001-2008 Certified Company",
  "Pan India Presence",
  "52+ Trained Technicians",
];

function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-[oklch(0.08_0.015_255)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <RevealSection>
              <p className="text-xs font-body font-semibold tracking-widest uppercase text-electric-blue mb-3">
                About PICL
              </p>
              <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground leading-tight mb-6">
                A Trusted IT Partner{" "}
                <span className="text-electric-blue">Since 1995</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Perfect Innovative Computer Pvt. Ltd incorporates the latest
                microprocessor-based technology delivering the highest quality
                in design, performance and reliability. We oversee the full
                scope of supply, installation, testing, commissioning and
                maintenance of IT hardware and software systems.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                As a standard re-seller for DELL, Cisco, IBM, Microsoft,
                Fortinet, Checkpoint, Sophos, Adobe, Red Hat, HPE, EPSON, CANON,
                LIPI and VMware, we are a leading force on the networking &amp;
                communication horizon. Our company is managed by highly dynamic
                professionals committed to a benchmark of excellence.
              </p>
            </RevealSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {featureBadges.map((badge, i) => (
                <RevealSection key={badge} delay={i * 60}>
                  <div className="flex items-center gap-2.5 p-3 rounded-lg glass-card">
                    <CheckCircle2
                      size={16}
                      className="text-electric-blue flex-shrink-0"
                    />
                    <span className="text-sm text-foreground/80 font-body">
                      {badge}
                    </span>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>

          {/* Right: image stack */}
          <div className="relative">
            <RevealSection delay={100}>
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden h-80 md:h-[440px]">
                <img
                  src="/assets/generated/datacenter-hero.dim_1200x800.jpg"
                  alt="Data Centre Infrastructure"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.015_255/0.8)] via-transparent to-transparent" />
                {/* Overlay stats */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="glass-card rounded-xl p-4 border border-[oklch(0.60_0.20_255/0.3)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-electric-blue/20 flex items-center justify-center">
                        <Award size={18} className="text-electric-blue" />
                      </div>
                      <div>
                        <p className="font-heading font-black text-foreground text-lg leading-none">
                          30+ Years
                        </p>
                        <p className="text-muted-foreground text-xs">
                          of Excellence in IT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating mini cards */}
              <div className="absolute -top-5 -right-5 glass-card rounded-xl p-3 border border-[oklch(0.60_0.20_255/0.3)] shadow-glow-blue">
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-electric-blue" />
                  <span className="text-xs font-body font-semibold text-foreground">
                    Data Centre
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 glass-card rounded-xl p-3 border border-[oklch(0.78_0.16_70/0.4)] shadow-glow-gold">
                <div className="flex items-center gap-2">
                  <Network size={14} className="text-gold" />
                  <span className="text-xs font-body font-semibold text-foreground">
                    Networking
                  </span>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>

        {/* Bottom info strip */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Award,
              label: "ISO Certified",
              sub: "ISO 9001-2008 certified with stringent quality checks",
              color: "text-gold",
            },
            {
              icon: Users,
              label: "Expert Team",
              sub: "52+ highly trained & certified technicians",
              color: "text-electric-blue",
            },
            {
              icon: Globe,
              label: "Pan India",
              sub: "Covering 90% of India with doorstep services",
              color: "text-[oklch(0.70_0.18_200)]",
            },
          ].map(({ icon: Icon, label, sub, color }, i) => (
            <RevealSection key={label} delay={i * 100}>
              <div className="glass-card glass-card-hover rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[oklch(0.18_0.025_255)] flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground mb-1">
                    {label}
                  </p>
                  <p className="text-muted-foreground text-sm">{sub}</p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Choose PICL ──────────────────────────────────────────────────────────

const whyFeatures = [
  {
    icon: Zap,
    stat: "24/7",
    title: "Immediate Response",
    desc: "Round-the-clock support with rapid on-site dispatch across all major cities.",
    color: "oklch(0.78 0.16 70)",
    bg: "oklch(0.78 0.16 70 / 0.10)",
    border: "oklch(0.78 0.16 70 / 0.30)",
  },
  {
    icon: ShieldCheck,
    stat: "ISO",
    title: "ISO 9001 Certified",
    desc: "Quality management systems certified to international standards since inception.",
    color: "oklch(0.60 0.20 255)",
    bg: "oklch(0.60 0.20 255 / 0.10)",
    border: "oklch(0.60 0.20 255 / 0.30)",
  },
  {
    icon: Globe,
    stat: "90%",
    title: "Pan India Service",
    desc: "Covering 90% of India with regional salesmen and OEM-certified engineers.",
    color: "oklch(0.70 0.18 200)",
    bg: "oklch(0.70 0.18 200 / 0.10)",
    border: "oklch(0.70 0.18 200 / 0.30)",
  },
  {
    icon: Clock,
    stat: "30+",
    title: "Years of Expertise",
    desc: "Three decades of delivering excellence in IT systems integration nationwide.",
    color: "oklch(0.65 0.20 300)",
    bg: "oklch(0.65 0.20 300 / 0.10)",
    border: "oklch(0.65 0.20 300 / 0.30)",
  },
];

function WhyChooseSection() {
  return (
    <section className="py-24 lg:py-32 bg-[oklch(0.10_0.02_260)] relative overflow-hidden">
      {/* Background radial accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, oklch(0.60 0.20 255 / 0.05) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <RevealSection className="text-center mb-14">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-gold mb-3">
            Our Edge
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-4">
            Why Choose <span className="text-electric-blue">PICL</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Three decades of trust built on performance, certification, and
            unmatched service reach.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <RevealSection key={feat.title} delay={i * 80}>
                <div
                  className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col items-center text-center h-full"
                  data-ocid={`why.item.${i + 1}`}
                >
                  {/* Animated glow ring icon */}
                  <div className="mb-5">
                    <div className="glow-ring-wrapper">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                          background: feat.bg,
                          border: `1px solid ${feat.border}`,
                          boxShadow: `0 0 20px ${feat.color.replace(")", " / 0.15)")}`,
                        }}
                      >
                        <Icon size={28} style={{ color: feat.color }} />
                      </div>
                    </div>
                  </div>

                  {/* Big stat */}
                  <div
                    className="font-heading font-black text-3xl leading-none mb-2"
                    style={{ color: feat.color }}
                  >
                    {feat.stat}
                  </div>

                  <h3 className="font-heading font-bold text-foreground text-base mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Numbers / Stats ───────────────────────────────────────────────────────────

const statsData = [
  {
    target: 30,
    suffix: "+",
    label: "Years in Business",
    sub: "Since 1995",
    icon: Clock,
  },
  {
    target: 30000,
    suffix: "+",
    label: "Users Across India",
    sub: "And growing",
    icon: Users,
  },
  {
    target: 52,
    suffix: "+",
    label: "Strong Workforce",
    sub: "Trained professionals",
    icon: Award,
  },
  {
    target: 90,
    suffix: "%",
    label: "India Coverage",
    sub: "Doorstep service",
    icon: Globe,
  },
  {
    target: 14,
    suffix: "+",
    label: "Major Gov. Clients",
    sub: "Including Armed Forces",
    icon: Building2,
  },
];

function StatCounter({
  target,
  suffix,
  label,
  sub,
  icon: Icon,
  start,
}: {
  target: number;
  suffix: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  start: boolean;
}) {
  const count = useCountUp(target, 2200, start);
  const display = target >= 10000 ? count.toLocaleString() : count;

  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-12 h-12 rounded-xl bg-[oklch(0.60_0.20_255/0.12)] border border-[oklch(0.60_0.20_255/0.25)] flex items-center justify-center mb-4">
        <Icon size={20} className="text-electric-blue" />
      </div>
      <div className="font-heading font-black text-4xl md:text-5xl text-foreground leading-none mb-1">
        {display}
        {suffix}
      </div>
      <div className="font-heading font-semibold text-foreground/80 text-base mt-2">
        {label}
      </div>
      <div className="text-muted-foreground text-sm mt-1">{sub}</div>
    </div>
  );
}

function StatsSection() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
  });

  return (
    <section id="stats" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[oklch(0.10_0.02_260)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.60 0.20 255 / 0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <RevealSection>
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-electric-blue mb-3">
              Track Record
            </p>
            <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground">
              Numbers That <span className="text-electric-blue">Speak</span>
            </h2>
          </RevealSection>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-[oklch(0.25_0.03_255/0.4)] rounded-2xl overflow-hidden border border-[oklch(0.25_0.03_255/0.4)]">
          {statsData.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-[oklch(0.12_0.025_260)] last:col-span-2 last:md:col-span-1"
            >
              <RevealSection delay={i * 80}>
                <StatCounter {...stat} start={isVisible} />
              </RevealSection>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services Section ──────────────────────────────────────────────────────────

const services = [
  {
    icon: Shield,
    title: "Cyber Security",
    desc: "Complete IT Cyber Security solutions including hardware firewalls and endpoint protection.",
    brands: ["Fortinet", "Checkpoint", "Force-Point", "Sophos"],
    color: "oklch(0.60 0.20 255)",
  },
  {
    icon: Network,
    title: "Networking & Communication",
    desc: "Structured wired & Wi-Fi networking solutions and communication products for all environments.",
    brands: ["Cisco", "Structured Cabling", "Wi-Fi", "VoIP"],
    color: "oklch(0.70 0.18 200)",
  },
  {
    icon: Monitor,
    title: "Desktops & Laptops",
    desc: "Customized & branded Desktop Computers and Laptops tailored to enterprise needs.",
    brands: ["Dell", "HP", "IBM", "Custom Builds"],
    color: "oklch(0.65 0.18 160)",
  },
  {
    icon: Code2,
    title: "Software Solutions",
    desc: "Authorized software reseller for leading vendors. Licensing, deployment & support included.",
    brands: ["Microsoft", "IBM", "Red Hat", "VMware"],
    color: "oklch(0.78 0.16 70)",
  },
  {
    icon: Video,
    title: "Display & Video Conferencing",
    desc: "Full range of display panels and video conferencing equipment from global brands.",
    brands: ["Samsung", "LG", "Cisco", "Polycom"],
    color: "oklch(0.65 0.20 300)",
  },
  {
    icon: Printer,
    title: "Peripherals & Consumables",
    desc: "All IT peripherals including printers (Inkjet, Laser, Ink Tank), scanners and more.",
    brands: ["HP", "Canon", "Epson", "Kingston"],
    color: "oklch(0.70 0.16 30)",
  },
];

function ServicesSection() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="services"
      className="py-24 lg:py-32 bg-[oklch(0.08_0.015_255)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center mb-16">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-electric-blue mb-3">
            What We Offer
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            End-to-end IT solutions from procurement to maintenance — all under
            one roof.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <RevealSection key={svc.title} delay={i * 70}>
                <div
                  className={`glass-card glass-card-hover service-card-sweep rounded-xl p-6 h-full flex flex-col stagger-${i + 1}`}
                  data-ocid={`services.item.${i + 1}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      background: `${svc.color.replace(")", " / 0.12)")}`,
                      border: `1px solid ${svc.color.replace(")", " / 0.25)")}`,
                    }}
                  >
                    <Icon size={22} style={{ color: svc.color }} />
                  </div>

                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                    {svc.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {svc.brands.map((brand) => (
                      <span
                        key={brand}
                        className="px-2.5 py-0.5 rounded-full text-xs font-body font-medium bg-[oklch(0.18_0.025_255)] text-foreground/70 border border-[oklch(0.30_0.03_255/0.4)]"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>

                  {/* Enquire link */}
                  <div className="border-t border-[oklch(0.30_0.03_255/0.35)] pt-3 mt-auto">
                    <button
                      type="button"
                      onClick={scrollToContact}
                      data-ocid={`services.enquire.button.${i + 1}`}
                      className="text-sm font-body font-semibold transition-colors duration-200 flex items-center gap-1"
                      style={{ color: svc.color }}
                    >
                      Enquire{" "}
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Products Section ──────────────────────────────────────────────────────────

const products = [
  {
    title: "Software Products",
    icon: Code2,
    items: [
      "Microsoft (all editions)",
      "IBM Software Suite",
      "Red Hat Linux",
      "VMware Virtualization",
    ],
  },
  {
    title: "Security Hardware & Software",
    icon: Shield,
    items: [
      "Fortinet Firewalls",
      "Checkpoint Solutions",
      "Force-Point Security",
      "Sophos Endpoint",
    ],
  },
  {
    title: "Display Panels",
    icon: Monitor,
    items: [
      "Samsung Display Panels",
      "LG Screens",
      "Aaztech / People Link",
      "Barco & Delta",
    ],
  },
  {
    title: "Video Conferencing",
    icon: Video,
    items: [
      "People Link Systems",
      "Cisco Telepresence",
      "Polycom Solutions",
      "HD Video Endpoints",
    ],
  },
  {
    title: "Printers & Consumables",
    icon: Printer,
    items: [
      "HP Inkjet & Laser",
      "Canon Printers",
      "Epson Ink Tank",
      "Xerox & Samsung",
    ],
  },
  {
    title: "IT Peripherals",
    icon: Cpu,
    items: [
      "SSD & Storage Drives",
      "Keyboards & Mice",
      "Scanners & Monitors",
      "Speakers & Headsets",
    ],
  },
];

function ProductsSection() {
  return (
    <section id="products" className="py-24 lg:py-32 bg-[oklch(0.10_0.02_260)]">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center mb-16">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-gold mb-3">
            Product Range
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-4">
            Our Products
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            World-class products from reputed manufacturers — all available
            through PICL.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod, i) => {
            const Icon = prod.icon;
            return (
              <RevealSection key={prod.title} delay={i * 70}>
                <div
                  className="glass-card glass-card-hover rounded-xl p-6 h-full"
                  data-ocid={`products.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-[oklch(0.78_0.16_70/0.12)] border border-[oklch(0.78_0.16_70/0.25)] flex items-center justify-center">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground">
                      {prod.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {prod.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-foreground/75 font-body"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/60 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Clients Section ───────────────────────────────────────────────────────────

const clients = [
  {
    name: "Indian Air Force",
    category: "Defence",
    sub: "Directorate of IT Air HQ VB, New Delhi",
    color: "oklch(0.60 0.20 255)",
  },
  {
    name: "Indian Army",
    category: "Defence",
    sub: "HQ Sena Bhawan & Head Quarter TG EME Delhi Cantt.",
    color: "oklch(0.60 0.20 255)",
  },
  {
    name: "Air Force Stations",
    category: "Defence",
    sub: "Air Force Station New Delhi, Western Air Command",
    color: "oklch(0.60 0.20 255)",
  },
  {
    name: "Border Roads Organisation",
    category: "Govt.",
    sub: "Director General, BRO",
    color: "oklch(0.70 0.18 200)",
  },
  {
    name: "Indian Railways",
    category: "PSU",
    sub: "National rail network services",
    color: "oklch(0.78 0.16 70)",
  },
  {
    name: "Delhi Transport Corporation",
    category: "PSU",
    sub: "DTC, New Delhi",
    color: "oklch(0.78 0.16 70)",
  },
  {
    name: "Election Commission of India",
    category: "Govt.",
    sub: "Statutory body of India",
    color: "oklch(0.70 0.18 200)",
  },
  {
    name: "Delhi University",
    category: "Education",
    sub: "One of India's premier universities",
    color: "oklch(0.65 0.20 300)",
  },
  {
    name: "ESSL India",
    category: "Corporate",
    sub: "Enterprise security solutions client",
    color: "oklch(0.65 0.18 160)",
  },
];

const categoryColor: Record<string, string> = {
  Defence: "oklch(0.60 0.20 255)",
  "Govt.": "oklch(0.70 0.18 200)",
  PSU: "oklch(0.78 0.16 70)",
  Education: "oklch(0.65 0.20 300)",
  Corporate: "oklch(0.65 0.18 160)",
};

const clientFilterTabs = [
  "All",
  "Defence",
  "Govt.",
  "PSU",
  "Education",
  "Corporate",
];

function ClientsSection() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredClients =
    activeFilter === "All"
      ? clients
      : clients.filter((c) => c.category === activeFilter);

  return (
    <section id="clients" className="py-24 lg:py-32 bg-[oklch(0.08_0.015_255)]">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center mb-6">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-electric-blue mb-3">
            Trusted By
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-4">
            Major Clients
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Serving India's defence forces, government bodies, railways and
            educational institutions.
          </p>
        </RevealSection>

        {/* Coverage callout */}
        <RevealSection>
          <div className="mb-8 p-5 rounded-2xl border border-[oklch(0.60_0.20_255/0.3)] bg-[oklch(0.60_0.20_255/0.05)] text-center">
            <p className="font-heading font-bold text-foreground text-lg">
              🇮🇳 Pan India Presence
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              30,000+ Users Across India · Covering 90% of India with doorstep
              services, regional salesmen and OEM-certified engineers
            </p>
          </div>
        </RevealSection>

        {/* Filter tabs */}
        <RevealSection>
          <div
            className="flex flex-wrap gap-2 mb-8 justify-center"
            data-ocid="clients.filter.tab"
          >
            {clientFilterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                data-ocid={`clients.tab.${tab.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                className={`client-tab ${activeFilter === tab ? "active" : ""}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client, i) => (
            <RevealSection
              key={`${client.name}-${activeFilter}`}
              delay={i * 60}
            >
              <div
                className="glass-card glass-card-hover rounded-xl p-5 group"
                data-ocid={`clients.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-heading font-bold text-foreground text-base leading-tight">
                    {client.name}
                  </h3>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-body font-bold uppercase tracking-wider flex-shrink-0"
                    style={{
                      color: categoryColor[client.category] ?? client.color,
                      background: `${(categoryColor[client.category] ?? client.color).replace(")", " / 0.12)")}`,
                      border: `1px solid ${(categoryColor[client.category] ?? client.color).replace(")", " / 0.3)")}`,
                    }}
                  >
                    {client.category}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {client.sub}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Brand Ecosystem / Partners ────────────────────────────────────────────────

const partnerRow1 = [
  { name: "DELL", color: "#007DB8" },
  { name: "Cisco", color: "#1BA0D7" },
  { name: "IBM", color: "#054ADA" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Fortinet", color: "#EE3124" },
  { name: "Checkpoint", color: "#E2231A" },
  { name: "Force-Point", color: "#003F87" },
  { name: "Sophos", color: "#1F5E92" },
  { name: "Adobe", color: "#FF0000" },
];

const partnerRow2 = [
  { name: "Red Hat", color: "#EE0000" },
  { name: "HPE", color: "#01A982" },
  { name: "Epson", color: "#003399" },
  { name: "Canon", color: "#CC0000" },
  { name: "LIPI", color: "#004A97" },
  { name: "VMware", color: "#607078" },
  { name: "Samsung", color: "#1428A0" },
  { name: "Polycom", color: "#003067" },
];

function BrandEcosystemSection() {
  return (
    <section className="py-24 bg-[oklch(0.10_0.02_260)]">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center mb-12">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-gold mb-3">
            Authorized Partners
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-4">
            Our Brand Ecosystem
          </h2>
          <p className="text-muted-foreground">
            Premium partnerships with the world's leading technology companies.
          </p>
        </RevealSection>
      </div>

      <div className="space-y-4">
        {/* Row 1: scroll left */}
        <div className="overflow-hidden marquee-left">
          <div className="marquee-track flex gap-5 items-center">
            {[
              ...partnerRow1.map((l, i) => ({ ...l, id: `r1a-${i}` })),
              ...partnerRow1.map((l, i) => ({ ...l, id: `r1b-${i}` })),
            ].map((logo) => (
              <div
                key={logo.id}
                className="brand-logo-card flex-shrink-0 px-6 py-3.5 rounded-xl border border-[oklch(0.30_0.03_255/0.4)] bg-[oklch(0.13_0.025_260/0.7)] min-w-[120px] text-center"
              >
                <span
                  className="font-heading font-bold text-base tracking-wide whitespace-nowrap"
                  style={{
                    color: logo.color,
                    filter: "brightness(1.15) saturate(0.9)",
                  }}
                >
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: scroll right */}
        <div className="overflow-hidden marquee-right">
          <div className="marquee-track flex gap-5 items-center">
            {[
              ...partnerRow2.map((l, i) => ({ ...l, id: `r2a-${i}` })),
              ...partnerRow2.map((l, i) => ({ ...l, id: `r2b-${i}` })),
            ].map((logo) => (
              <div
                key={logo.id}
                className="brand-logo-card flex-shrink-0 px-6 py-3.5 rounded-xl border border-[oklch(0.30_0.03_255/0.4)] bg-[oklch(0.13_0.025_260/0.7)] min-w-[120px] text-center"
              >
                <span
                  className="font-heading font-bold text-base tracking-wide whitespace-nowrap"
                  style={{
                    color: logo.color,
                    filter: "brightness(1.15) saturate(0.9)",
                  }}
                >
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Trust Seal Strip ─────────────────────────────────────────────────────────

const trustSeals = [
  {
    icon: ShieldCheck,
    label: "ISO 9001:2008 Certified",
    color: "text-electric-blue",
  },
  {
    icon: Shield,
    label: "Armed Forces Trusted",
    color: "text-[oklch(0.60_0.20_255)]",
  },
  { icon: Award, label: "Dell Authorized Partner", color: "text-gold" },
  { icon: Star, label: "Cisco Reseller", color: "text-[oklch(0.70_0.18_200)]" },
  {
    icon: Clock,
    label: "30+ Years Excellence",
    color: "text-[oklch(0.65_0.20_300)]",
  },
];

function TrustSealStrip() {
  return (
    <div className="bg-[oklch(0.07_0.015_255)] border-t border-[oklch(0.25_0.03_255/0.35)] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection>
          <p className="text-center text-[10px] font-body font-semibold tracking-widest uppercase text-muted-foreground mb-5">
            Trusted Credentials
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {trustSeals.map((seal, i) => {
              const Icon = seal.icon;
              return (
                <div
                  key={seal.label}
                  className="trust-seal"
                  data-ocid={`trust.seal.${i + 1}`}
                >
                  <Icon size={14} className={seal.color} />
                  <span className="text-xs font-body font-semibold text-foreground/80">
                    {seal.label}
                  </span>
                </div>
              );
            })}
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

// ─── Contact Section ───────────────────────────────────────────────────────────

function FloatLabelInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  "data-ocid": dataOcid,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  "data-ocid"?: string;
}) {
  return (
    <div className="float-label-wrapper">
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-ocid={dataOcid}
        className="w-full px-4 pt-6 pb-2 rounded-lg bg-[oklch(0.15_0.02_260)] border border-[oklch(0.30_0.03_255/0.5)] text-foreground text-sm font-body focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-[oklch(0.60_0.20_255/0.3)] transition-all"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function FloatLabelTextarea({
  id,
  label,
  value,
  onChange,
  "data-ocid": dataOcid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  "data-ocid"?: string;
}) {
  return (
    <div className="float-label-wrapper">
      <textarea
        id={id}
        placeholder=" "
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-ocid={dataOcid}
        className="w-full px-4 pt-6 pb-2 rounded-lg bg-[oklch(0.15_0.02_260)] border border-[oklch(0.30_0.03_255/0.5)] text-foreground text-sm font-body focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-[oklch(0.60_0.20_255/0.3)] transition-all resize-none"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submit, isPending, isError } = useSubmitContactForm();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !email || !message) return;
      submit(
        { name, email, company, message },
        {
          onSuccess: () => {
            setSubmitted(true);
            setName("");
            setEmail("");
            setCompany("");
            setMessage("");
          },
        },
      );
    },
    [name, email, company, message, submit],
  );

  return (
    <section id="contact" className="py-24 lg:py-32 bg-[oklch(0.08_0.015_255)]">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center mb-16">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-electric-blue mb-3">
            Get In Touch
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-4">
            Let's Connect
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ready to upgrade your IT infrastructure? Reach out to our team and
            we'll get back to you promptly.
          </p>
        </RevealSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: contact info */}
          <div className="space-y-5">
            {[
              {
                icon: Phone,
                label: "Mobile",
                value: "+91 9810299525",
                href: "tel:+919810299525",
                color: "text-electric-blue",
                bg: "oklch(0.60 0.20 255)",
              },
              {
                icon: Mail,
                label: "Email",
                value: "ajay@picl.co.in",
                href: "mailto:ajay@picl.co.in",
                color: "text-gold",
                bg: "oklch(0.78 0.16 70)",
              },
              {
                icon: MapPin,
                label: "Head Office",
                value: "AJ-20A, Shalimar Bagh, Delhi-110088",
                href: "#",
                color: "text-[oklch(0.70_0.18_200)]",
                bg: "oklch(0.70 0.18 200)",
              },
            ].map(({ icon: Icon, label, value, href, color, bg }, i) => (
              <RevealSection key={label} delay={i * 80}>
                <a
                  href={href}
                  data-ocid={`contact.info.item.${i + 1}`}
                  className="glass-card glass-card-hover rounded-xl p-5 flex items-start gap-4 no-underline block"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${bg.replace(")", " / 0.12)")}`,
                      border: `1px solid ${bg.replace(")", " / 0.3)")}`,
                    }}
                  >
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider font-body mb-0.5">
                      {label}
                    </p>
                    <p className="font-heading font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                </a>
              </RevealSection>
            ))}

            {/* Map placeholder */}
            <RevealSection delay={300}>
              <div className="glass-card rounded-xl p-5 overflow-hidden">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-body">
                  Registered Office
                </p>
                <p className="text-sm text-foreground/80 font-body">
                  G-8/31, Indiradeep Building, Commercial Complex, Wazir Pur,
                  New Delhi-110052
                </p>
              </div>
            </RevealSection>
          </div>

          {/* Right: form */}
          <RevealSection delay={100}>
            <div
              className="glass-card rounded-2xl p-8"
              data-ocid="contact.form.card"
            >
              {submitted ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="contact.success_state"
                >
                  <div className="w-16 h-16 rounded-full bg-[oklch(0.60_0.20_255/0.12)] border border-[oklch(0.60_0.20_255/0.3)] flex items-center justify-center mb-5">
                    <CheckCircle2 size={28} className="text-electric-blue" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Thank you for reaching out. Our team will get back to you
                    within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-5 py-2 text-sm text-electric-blue border border-[oklch(0.60_0.20_255/0.3)] rounded-lg hover:bg-[oklch(0.60_0.20_255/0.08)] transition-colors font-body"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FloatLabelInput
                    id="contact-name"
                    label="Your Name"
                    value={name}
                    onChange={setName}
                    data-ocid="contact.name.input"
                  />
                  <FloatLabelInput
                    id="contact-email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    data-ocid="contact.email.input"
                  />
                  <FloatLabelInput
                    id="contact-company"
                    label="Company (optional)"
                    value={company}
                    onChange={setCompany}
                    data-ocid="contact.company.input"
                  />
                  <FloatLabelTextarea
                    id="contact-message"
                    label="Your Message"
                    value={message}
                    onChange={setMessage}
                    data-ocid="contact.message.textarea"
                  />

                  {isError && (
                    <p
                      className="text-sm text-[oklch(0.70_0.20_30)] font-body"
                      data-ocid="contact.error_state"
                    >
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isPending || !name || !email || !message}
                    data-ocid="contact.form.submit_button"
                    className="w-full py-3.5 rounded-lg bg-electric-blue text-white font-heading font-semibold flex items-center justify-center gap-2 glow-blue glow-blue-hover transition-all duration-200 hover:bg-[oklch(0.70_0.18_255)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[oklch(0.07_0.015_255)] border-t border-[oklch(0.25_0.03_255/0.4)] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric-blue to-[oklch(0.45_0.15_255)] flex items-center justify-center shadow-glow-blue">
                <span className="font-heading font-black text-white text-sm">
                  PICL
                </span>
              </div>
              <div>
                <div className="font-heading font-bold text-foreground text-sm">
                  Perfect Innovative
                </div>
                <div className="text-muted-foreground text-[10px] tracking-widest uppercase">
                  Computers Pvt. Ltd
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              India's trusted IT systems integrator since 1995. Delivering
              excellence in hardware, software and cyber security.
            </p>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Phone size={12} className="text-electric-blue" />
                +91 9810299525
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Mail size={12} className="text-electric-blue" />
                ajay@picl.co.in
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <MapPin size={12} className="text-electric-blue" />
                AJ-20A, Shalimar Bagh, Delhi-110088
              </p>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-bold text-foreground text-sm uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", id: "about" },
                { label: "Services", id: "services" },
                { label: "Products", id: "products" },
                { label: "Clients", id: "clients" },
                { label: "Contact", id: "contact" },
              ].map(({ label, id }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => scrollTo(id)}
                    data-ocid={`footer.${id}.link`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-heading font-bold text-foreground text-sm uppercase tracking-widest mb-4">
              Solutions
            </h4>
            <ul className="space-y-2">
              {[
                "Cyber Security",
                "Networking",
                "Software",
                "Hardware",
                "Video Conferencing",
                "Peripherals",
              ].map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => scrollTo("services")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="font-heading font-bold text-foreground text-sm uppercase tracking-widest mb-4">
              Certifications
            </h4>
            <ul className="space-y-2.5">
              {[
                "ISO 9001-2008 Certified",
                "Microsoft Partner",
                "Dell Authorized",
                "Cisco Reseller",
                "VMware Partner",
              ].map((cert) => (
                <li key={cert} className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-gold flex-shrink-0" />
                  <span className="text-sm text-muted-foreground font-body">
                    {cert}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[oklch(0.25_0.03_255/0.3)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-body">
            © {year} Perfect Innovative Computers Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-body">
            Built with <span className="text-[oklch(0.70_0.22_30)]">♥</span>{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric-blue hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Back To Top ──────────────────────────────────────────────────────────────

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollY > 400);
      setProgress(totalH > 0 ? (scrollY / totalH) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = circ - (progress / 100) * circ;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      data-ocid="back_to_top.button"
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center glass-card rounded-full border-0"
      style={{ boxShadow: "0 4px 20px oklch(0 0 0 / 0.5)" }}
    >
      <svg
        role="img"
        aria-label="Scroll progress"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className="absolute inset-0 progress-ring-svg"
      >
        <title>Scroll progress</title>
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="oklch(0.25 0.03 255 / 0.4)"
          strokeWidth="2"
        />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="oklch(0.60 0.20 255)"
          strokeWidth="2"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
        />
      </svg>
      <ChevronUp size={16} className="text-foreground relative z-10" />
    </button>
  );
}

// ─── WhatsApp Floating Button ─────────────────────────────────────────────────

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919810299525"
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.button"
      aria-label="Chat on WhatsApp"
      className="whatsapp-btn fixed bottom-24 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center"
      style={{
        background: "oklch(0.55 0.22 145)",
        boxShadow: "0 4px 20px oklch(0.55 0.22 145 / 0.4)",
      }}
    >
      <MessageCircle size={22} className="text-white" fill="white" />
    </a>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <WhyChooseSection />
        <StatsSection />
        <ServicesSection />
        <ProductsSection />
        <ClientsSection />
        <BrandEcosystemSection />
        <ContactSection />
      </main>
      <TrustSealStrip />
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </div>
  );
}
