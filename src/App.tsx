import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Phone,
  Compass,
  FileText,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Calculator,
  MessageSquare,
  ArrowRight,
  Info,
  Clock,
  Video,
  Menu,
  X,
  Plus,
  ArrowUp,
  Award,
  Users,
  Briefcase,
  ExternalLink,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { LUXURY_SERVICES, TESTIMONIALS, BookingSubmission, BookingResponse, ChatMessage } from "./types";
import ProjectShowcase from "./components/ProjectShowcase";

export default function App() {
  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [quoteInjectedNotice, setQuoteInjectedNotice] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  // Hero Section Sliding Background
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const heroImages = [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=90",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90"
  ];

  // Testimonials Slider State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Cost Calculator States
  const [calcArea, setCalcArea] = useState<number>(1800);
  const [calcBudgetTier, setCalcBudgetTier] = useState<"premium" | "elite" | "mansion">("elite");
  const [calcSpaceType, setCalcSpaceType] = useState<string>("3bhk");
  const [calcMaterial, setCalcMaterial] = useState<string>("calacatta");
  const [calcAutomation, setCalcAutomation] = useState<boolean>(true);
  const [calculatedQuote, setCalculatedQuote] = useState<{
    total: number;
    civil: number;
    finishes: number;
    materials: number;
    automation: number;
  }>({ total: 0, civil: 0, finishes: 0, materials: 0, automation: 0 });

  // Booking Form States
  const [bookingForm, setBookingForm] = useState<BookingSubmission>({
    name: "",
    phone: "",
    location: "Gurugram, NCR",
    budget: "₹35L - ₹50L",
    projectType: "Complete Turnkey Villa",
    preferredTime: "11:00 AM - Afternoon Slot"
  });
  const [bookingStatusMsg, setBookingStatusMsg] = useState("");
  const [liveBookings, setLiveBookings] = useState<BookingResponse[]>([]);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Chatbot Assistant (Aarav) States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Welcome to Aakriti Developers. I am Aarav, your personal digital design advisor. Tell me, are you looking to design a breathtaking smart kitchen, curate a walk-in wardrobe, or carry out a turnkey construction? Let's talk luxury materials.",
      timestamp: new Date()
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Services Modal details
  const [selectedService, setSelectedService] = useState<typeof LUXURY_SERVICES[0] | null>(null);

  // Fetch Live Bookings Board from Server
  const fetchLiveBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data && data.bookings) {
        setLiveBookings(data.bookings);
      }
    } catch (err) {
      console.error("Failed to load registered bookings:", err);
    }
  };

  useEffect(() => {
    fetchLiveBookings();
    
    // Auto slide Hero images
    const heroInterval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(heroInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Recalculate Quote on parameter change
  useEffect(() => {
    let ratePerSqFt = 2000;
    if (calcBudgetTier === "premium") ratePerSqFt = 1800;
    if (calcBudgetTier === "elite") ratePerSqFt = 2800;
    if (calcBudgetTier === "mansion") ratePerSqFt = 4500;

    let multiplier = 1.0;
    if (calcSpaceType === "single") multiplier = 0.8;
    if (calcSpaceType === "kitchen") multiplier = 1.25;
    if (calcSpaceType === "3bhk") multiplier = 1.2;
    if (calcSpaceType === "4bhk") multiplier = 1.35;
    if (calcSpaceType === "estate") multiplier = 1.55;

    let baseQuote = calcArea * ratePerSqFt * multiplier;

    let materialAddon = 0;
    if (calcMaterial === "calacatta") materialAddon = 350000;
    if (calcMaterial === "belgian") materialAddon = 250000;
    if (calcMaterial === "carbon") materialAddon = 550000;

    let automationAddon = calcAutomation ? 220000 : 0;

    const totalCost = baseQuote + materialAddon + automationAddon;
    const civil = Math.round(baseQuote * 0.4);
    const finishes = Math.round(baseQuote * 0.35);
    const materials = Math.round((baseQuote * 0.25) + materialAddon);
    const automation = automationAddon;

    setCalculatedQuote({
      total: Math.round(totalCost),
      civil,
      finishes,
      materials,
      automation
    });
  }, [calcArea, calcBudgetTier, calcSpaceType, calcMaterial, calcAutomation]);

  // Handle Booking Form submit
  const submitBooking = async (e: FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      setBookingStatusMsg("Please furnish your name and direct telephone number.");
      return;
    }

    setSubmittingBooking(true);
    setBookingStatusMsg("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingForm)
      });
      const data = await res.json();
      if (data.success) {
        setBookingStatusMsg(`Success! Reference ${data.booking.id} is confirmed. Managing Director Ankit Gupta's premium desk will phone you within 6 hours.`);
        setBookingForm({
          name: "",
          phone: "",
          location: "Gurugram, NCR",
          budget: "₹35L - ₹50L",
          projectType: "Complete Turnkey Villa",
          preferredTime: "11:00 AM - Afternoon Slot"
        });
        fetchLiveBookings(); // Refresh active dashboard
      } else {
        setBookingStatusMsg(data.error || "Execution line delay. Please verify your details.");
      }
    } catch (err) {
      setBookingStatusMsg("We registered your intent! Our private server is synchronizing your booking securely.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  // Chatbot Send Message Client call to Server
  const handleChatSend = async (messageText?: string) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!messageText) setChatInput("");
    setChatLoading(true);

    try {
      const historyPayload = chatMessages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: historyPayload })
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "model",
        text: data.text || "Our custom designs represent extreme precision. Let's arrange a direct presentation with Ankit Gupta.",
        timestamp: new Date()
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: "model",
        text: "My virtual neural path is experiencing a minor reset, but Ankit Gupta's luxury team on site are ready! Please let me know if we can record your inquiry on our elegant consultation sheet.",
        timestamp: new Date()
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Inject computed values directly from calculator into the Booking form
  const injectQuoteToBooking = () => {
    const styleLabel = calcBudgetTier === "premium" ? "Premium Classic" : calcBudgetTier === "elite" ? "Elite Contemporary" : "Hyper Luxury Mansion";
    const spaceLabel = calcSpaceType === "3bhk" ? "3 BHK Residence" : calcSpaceType === "4bhk" ? "4 BHK Estate" : calcSpaceType === "kitchen" ? "Designer Kitchen" : "Luxury Villa";
    
    setBookingForm({
      name: bookingForm.name,
      phone: bookingForm.phone,
      location: bookingForm.location,
      budget: `Est: ₹${(calculatedQuote.total / 100000).toFixed(1)} Lakhs`,
      projectType: `Turnkey - ${spaceLabel} (${calcArea} Sq.Ft. at ${styleLabel})`,
      preferredTime: "Immediate VIP Priority Review"
    });

    setQuoteInjectedNotice("Estimates & specifications successfully injected into booking form below! Scroll down to complete.");
    setTimeout(() => setQuoteInjectedNotice(""), 7000);

    const element = document.getElementById("booking-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };


  return (
    <div className={`app-root ${theme === "light" ? "light" : ""} bg-[#050505] min-h-screen text-gray-200 selection:bg-[#d4af37] selection:text-black font-sans`}>
      
      {/* 1. Header / Glassmorphism Floating Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#050505]/85 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#896e1a] via-[#d4af37] to-[#f4e9be] p-[1.5px] shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center">
                <span className="font-serif text-sm font-black text-[#d4af37] tracking-tighter">AD</span>
              </div>
            </div>
            <div>
              <span className="block font-serif tracking-[0.25em] text-sm font-semibold text-white uppercase group-hover:text-[#d4af37] transition-colors">
                AAKRITI DEVELOPERS
              </span>
              <span className="block text-[8px] font-mono uppercase tracking-[0.3em] text-[#d4af37]/65">
                Luxury Architectural Design & Turnkey
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about-section" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#d4af37] transition-colors">About</a>
            <a href="#services-section" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#d4af37] transition-colors">Services</a>
            <a href="#projects-section" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#d4af37] transition-colors">Projects</a>
            <a href="#calculator-section" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#d4af37] transition-colors">Cost Calculator</a>
            <a href="#booking-section" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#d4af37] transition-colors">Inquiries</a>
          </nav>

          {/* Right Area Controls */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-full bg-neutral-950 border border-neutral-800 text-[#d4af37] hover:border-[#d4af37] transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center cursor-pointer"
              aria-label="Toggle White/Black Theme"
              title={theme === "dark" ? "Switch to Ivory Gold (Light Mode)" : "Switch to Black Gold (Dark Mode)"}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <a 
              href="#booking-section"
              className="bg-neutral-950 hover:bg-[#d4af37] hover:text-black border border-[#d4af37]/40 text-xs uppercase tracking-widest text-[#d4af37] px-5 py-2.5 rounded-full transition-all duration-300 font-semibold"
            >
              Book VIP Consultation
            </a>
          </div>

          {/* Mobile Menu Trigger & Theme Toggle Group */}
          <div className="flex items-center gap-3.5 md:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-[#050505]/95 border border-neutral-800 text-[#d4af37] cursor-pointer"
              aria-label="Toggle White/Black Theme"
              title={theme === "dark" ? "Switch to Ivory Gold" : "Switch to Black Gold"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-[#d4af37] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#090909] border-b border-neutral-900"
            >
              <div className="px-6 py-8 flex flex-col gap-6 font-serif">
                <a 
                  href="#about-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg text-gray-300 hover:text-[#d4af37] transition-colors"
                >
                  — The Brand Story
                </a>
                <a 
                  href="#services-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg text-gray-300 hover:text-[#d4af37] transition-colors"
                >
                  — Curated Services
                </a>
                <a 
                  href="#projects-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg text-gray-300 hover:text-[#d4af37] transition-colors"
                >
                  — Luxury Portfolios
                </a>
                <a 
                  href="#calculator-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg text-gray-300 hover:text-[#d4af37] transition-colors"
                >
                  — AI Cost Estimator
                </a>
                <a 
                  href="#booking-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg text-gray-300 hover:text-[#d4af37] transition-colors"
                >
                  — Private Consultation Desk
                </a>
                <a 
                  href="#booking-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#d4af37] text-black text-center text-xs uppercase tracking-widest py-3 rounded-full font-bold"
                >
                  Book Consultation Now
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section - Fullscreen Cinematic Experience */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Cinematic Backdrop Carousel */}
        {heroImages.map((imgUrl, index) => (
          <div
            key={imgUrl}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              index === heroImageIndex ? "opacity-35 scale-105" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url('${imgUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: index === heroImageIndex ? "scale(1.04)" : "scale(1.0)"
            }}
          />
        ))}

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/85 to-[#050505]"></div>
        
        {/* Subtle Horizontal Wood-Gold Light Gradients */}
        <div className="absolute bottom-0 right-0 w-2/3 h-1/2 ambient-wood-radial pointer-events-none"></div>

        {/* Hero Content Grid (Centered Single Screen Luxury) */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161616]/70 backdrop-blur border border-gold-400/20 mb-6 shadow-xl">
            <Sparkles size={14} className="text-[#d4af37] animate-spin" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#d4af37] uppercase">
              ₹1 CRORE BESPOKE BRAND STANDARD
            </span>
          </div>

          <p className="font-mono text-xs text-gray-400 tracking-[0.3em] uppercase mb-4">
            AAKRITI DEVELOPERS &bull; FOUNDER ANKIT GUPTA
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight leading-[1.1] mb-8 font-extralight">
            We Don’t Build Homes.<br />
            We Create <span className="text-gold-gradient italic font-normal">Luxury Experiences.</span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg mb-10 font-light leading-relaxed">
            Delivering master-crafted interiors, modular kitchen solutions, sensory walk-in wardrobes, and turnkey boutique constructions tailored for elite connoisseurs of design in Delhi NCR and beyond.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <a 
              href="#booking-section"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b18f25] hover:brightness-110 text-black text-xs uppercase tracking-widest font-bold shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all"
            >
              Book Premium Consultation
            </a>
            <a 
              href="#calculator-section"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-[#d4af37] text-white text-xs uppercase tracking-widest font-semibold transition-all"
            >
              Estimate Project Cost
            </a>
          </div>

          {/* Stat counters built into Hero base */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-neutral-900 pt-8 max-w-4xl mx-auto text-left">
            <div>
              <span className="block text-3xl font-serif font-semibold text-white">₹15Cr+</span>
              <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">Portfolio Value</span>
            </div>
            <div>
              <span className="block text-3xl font-serif font-semibold text-[#d4af37]">140+</span>
              <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">Estates Handed Over</span>
            </div>
            <div>
              <span className="block text-3xl font-serif font-semibold text-white">100%</span>
              <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">On-Time Handover</span>
            </div>
            <div>
              <span className="block text-3xl font-serif font-semibold text-[#d4af37]">10 Yrs</span>
              <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">Structural Civil Warranty</span>
            </div>
          </div>
        </div>

        {/* Cinematic bottom scrolling indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none pointer-events-none">
          <span className="text-[9px] font-mono tracking-widest text-neutral-600 uppercase">Glow of perfection</span>
          <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-[#d4af37] to-transparent animate-bounce"></div>
        </div>
      </section>

      {/* 3. About Brand Section - Storytelling & Heritage */}
      <section id="about-section" className="py-24 bg-[#090909] relative overflow-hidden">
        <div className="absolute bottom-0 right-10 w-96 h-96 ambient-gold-radial pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5 relative space-y-6">
              <span className="text-[#d4af37] font-mono tracking-[0.25em] text-xs uppercase block">
                MEET THE FOUNDER
              </span>
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-white font-medium">
                Designing <span className="text-gold-gradient italic font-normal">Sanctuaries</span> of Absolute Opulence.
              </h2>
              <div className="w-20 h-[2px] bg-[#d4af37]"></div>
              
              <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed">
                Led by visionary owner <span className="text-[#d4af37] font-medium">Ankit Gupta</span>, Aakriti Developers has disrupted the luxury architectural landscape in India. We treat each residence not merely as a structure of lime and concrete, but as a living piece of art—curated with Italian custom stone veneer integrations, hidden sensory sound boards, and high-tech modular layouts.
              </p>

              {/* GSTIN / Compliance Badge */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
                <h4 className="font-serif text-[#d4af37] text-sm tracking-wide font-medium mb-2 uppercase">Official Brand Credentials</h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="block text-neutral-600 uppercase text-[9px] tracking-widest">Trade Name</span>
                    <span className="text-neutral-300 font-semibold">Aakriti Developers</span>
                  </div>
                  <div>
                    <span className="block text-neutral-600 uppercase text-[9px] tracking-widest">Legal Proprietor</span>
                    <span className="text-neutral-300">Ankit Gupta</span>
                  </div>
                  <div>
                    <span className="block text-neutral-600 uppercase text-[9px] tracking-widest">GSTIN Number</span>
                    <span className="text-[#d4af37] font-semibold">09ATRPG9136B1ZI</span>
                  </div>
                  <div>
                    <span className="block text-neutral-600 uppercase text-[9px] tracking-widest">Certification Timeline</span>
                    <span className="text-neutral-300">FY 2018-2019 onwards</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <span className="text-[#d4af37] font-mono tracking-[0.25em] text-xs uppercase block">
                THE DESIGN EVOLUTION
              </span>
              <h3 className="text-2xl font-serif text-white tracking-wide">
                Our Timeline of Excellence
              </h3>

              {/* Beautiful custom line timeline */}
              <div className="space-y-8 relative pl-6 border-l border-[#d4af37]/30">
                
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#d4af37] border-4 border-black"></div>
                  <div className="text-[#d4af37] font-mono text-xs mb-1">FY 2012 — THE COMMENCEMENT</div>
                  <h4 className="text-white font-serif font-medium text-lg">Founding by Ankit Gupta</h4>
                  <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed mt-1">
                    Began operations with a tight-knit guild of master stonemasons and structural engineers focused on luxury marble work.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-neutral-800 border-4 border-black group hover:bg-[#d4af37]"></div>
                  <div className="text-neutral-500 font-mono text-xs mb-1">FY 2016 — ADVANCED MANUFACTORING</div>
                  <h4 className="text-white font-serif font-medium text-lg">Bespoke Smart Kitchens & Wardrobes</h4>
                  <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed mt-1">
                    Introduced the state-of-the-art wardrobe assembly wing incorporating German fluted glass designs and automated smart drawers.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#d4af37] border-4 border-black"></div>
                  <div className="text-[#d4af37] font-mono text-xs mb-1">FY 2018-2019 — REGULATION STABILITY</div>
                  <h4 className="text-white font-serif font-medium text-lg">Official Structural Licenses & GST Compliance</h4>
                  <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed mt-1">
                    Incorporated under registration GSTIN 09ATRPG9136B1ZI (Delhi NCR Region / Reference 09ATRPG9136B1ZI/18-19/61), guaranteeing high fidelity billing policies.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-neutral-800 border-4 border-black"></div>
                  <div className="text-neutral-500 font-mono text-xs mb-1">FY 2024 - PRESENT — FUTURISTIC INTERIORS</div>
                  <h4 className="text-white font-serif font-medium text-lg">Central App & AI Guided Design Integrations</h4>
                  <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed mt-1">
                    Harnessing high-definition interactive calculators, custom architectural materials, and remote spatial previews for clients living non-locally.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Services Section with Detailed Material Drawer Cards */}
      <section id="services-section" className="py-24 bg-black relative">
        <div className="absolute top-0 left-0 w-full h-full ambient-wood-radial pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-[#d4af37] font-mono tracking-[0.25em] text-xs uppercase">
              Curated Services
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mt-2 tracking-tight text-white font-medium">
              Bespoke <span className="text-gold-gradient italic font-normal">Sartorial Suite</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto font-light text-sm sm:text-base">
              A meticulously engineered selection of luxury interior solutions. Click any suite item to preview blueprints & gold material highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LUXURY_SERVICES.map((service, index) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="group cursor-pointer bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 hover:border-[#d4af37]/30 rounded-2xl p-8 transition-all duration-500 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01]"
              >
                {/* Background wood texture image (very low opacity) */}
                <div 
                  className="absolute inset-0 opacity-10 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${service.imageUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-6 group-hover:bg-[#d4af37] group-hover:text-black transition-colors duration-300">
                    <Compass size={22} className="group-hover:rotate-45 transition-transform duration-500" />
                  </div>
                  
                  <span className="text-[10px] font-mono text-[#d4af37] tracking-widest uppercase block mb-1">
                    {service.subtitle}
                  </span>
                  
                  <h3 className="text-2xl font-serif text-white group-hover:text-[#d4af37] transition-colors mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-400 font-light text-xs sm:text-sm line-clamp-3 mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="relative z-10 border-t border-neutral-800/60 pt-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-500">Starts At: <span className="text-neutral-300">{service.startingRange}</span></span>
                  <span className="text-[#d4af37] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300 font-medium">
                    Explore Details <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Luxury Project Showcase Component (Imported Apple-style before/after) */}
      <ProjectShowcase />

      {/* 6. Advanced Live Estimated Cost Calculator */}
      <section id="calculator-section" className="py-24 bg-[#090909] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-1/2 ambient-gold-radial pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-[#d4af37] font-mono tracking-[0.25em] text-xs uppercase block">
              AI-Style Analytics
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mt-2 tracking-tight text-white font-medium">
              Interactive <span className="text-gold-gradient italic font-normal">Pricing Atelier</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto font-light text-sm sm:text-base">
              Establish high-fidelity material assessments. Our cost parameters are transparently calculated to mirror actual market pricing, ensuring a smooth luxury estimate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start premium-calculator-layout">
            
            {/* Input Selection Block */}
            <div className="lg:col-span-7 bg-black rounded-3xl p-8 border border-neutral-800 space-y-8 shadow-2xl">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
                  1. Structural Site Footprint: <span className="text-[#d4af37] font-semibold">{calcArea} Sq.Ft.</span>
                </label>
                <input 
                  type="range"
                  min="500"
                  max="8000"
                  step="50"
                  value={calcArea}
                  onChange={(e) => setCalcArea(Number(e.target.value))}
                  className="w-full accent-[#d4af37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-2">
                  <span>500 Sq.Ft. (Studio Apartment)</span>
                  <span>8000 Sq.Ft. (Mundka Estate Bungalow)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
                    2. Luxury Tier
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "premium", label: "Premium Classic", pricing: "₹1,800/sq.ft" },
                      { id: "elite", label: "Elite Contemporary", pricing: "₹2,800/sq.ft" },
                      { id: "mansion", label: "Hyper Luxury Estate", pricing: "₹4,500/sq.ft" }
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setCalcBudgetTier(tier.id as any)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all duration-300 ${
                          calcBudgetTier === tier.id 
                            ? "bg-[#d4af37]/10 text-white border-[#d4af37]"
                            : "bg-neutral-950 text-gray-400 border-neutral-900 hover:border-neutral-800"
                        }`}
                      >
                        <span className="block font-semibold">{tier.label}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{tier.pricing}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
                    3. Space Configuration
                  </label>
                  <select
                    value={calcSpaceType}
                    onChange={(e) => setCalcSpaceType(e.target.value)}
                    className="w-full bg-neutral-950 text-gray-300 border border-neutral-900 rounded-xl p-3.5 text-xs focus:ring-[#d4af37] focus:border-[#d4af37]"
                  >
                    <option value="single">Single Suite Lounge (Multiplier 0.8x)</option>
                    <option value="kitchen">Smart Modular Kitchen Only (Multiplier 1.25x)</option>
                    <option value="3bhk">Complete 3 BHK (Multiplier 1.2x)</option>
                    <option value="4bhk">Complete 4 BHK Ultimate (Multiplier 1.35x)</option>
                    <option value="estate">Bespoke Estate / Commercial (Multiplier 1.55x)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
                    4. Premium Elements
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "belgian", label: "Belgian Glass & Lacquered Polymer", extra: "+₹2.5L" },
                      { id: "calacatta", label: "Calacatta Quartz & Wood Veneer", extra: "+₹3.5L" },
                      { id: "carbon", label: "Carbon Timber & Pure Brass Plating", extra: "+₹5.5L" }
                    ].map((mat) => (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => setCalcMaterial(mat.id)}
                        className={`w-full text-left p-3 rounded-xl border text-[11px] transition-all duration-300 ${
                          calcMaterial === mat.id
                            ? "bg-[#d4af37]/10 text-white border-[#d4af37]"
                            : "bg-neutral-950 text-gray-400 border-neutral-900 hover:border-neutral-800"
                        }`}
                      >
                        <span className="block font-medium">{mat.label}</span>
                        <span className="text-[9px] text-gray-500 font-mono">{mat.extra}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Smart Automation Switch Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="space-y-1">
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">Lutron & Blum Automated Systems</span>
                  <span className="block text-[10px] text-gray-400">German BLUM Touch motion cabinets & unified iPad lighting dimmer controls (+ ₹2.2L Lakhs)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCalcAutomation(!calcAutomation)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
                    calcAutomation ? "bg-[#d4af37]" : "bg-neutral-950"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-neutral-900 transition-transform duration-300 transform ${
                    calcAutomation ? "translate-x-6" : "translate-x-0"
                  }`} />
                </button>
              </div>

            </div>

            {/* Dynamic Results Display Block (Gold Glare Accent) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-3xl p-8 border border-[#d4af37]/20 shadow-xl relative overflow-hidden flex flex-col justify-between">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full filter blur-xl"></div>
              
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full text-[10px] text-[#d4af37] uppercase font-mono tracking-widest mb-6">
                  <Calculator size={10} /> Dynamic Assessment
                </div>

                <div className="space-y-1 mb-8">
                  <span className="text-gray-400 text-xs font-mono uppercase tracking-widest block">Est. Total Investment</span>
                  <span className="text-4xl md:text-5xl font-serif text-[#d4af37] font-semibold block">
                    ₹{(calculatedQuote.total / 100000).toFixed(2)} Lakhs
                  </span>
                  <span className="text-[10px] text-neutral-500 block font-mono italic">
                    Equivalent to approx. ₹{(calculatedQuote.total / 10000000).toFixed(3)} Crores (Inclusive of GSTIN 09ATRPG9136B1ZI standards)
                  </span>
                </div>

                <div className="space-y-4 border-t border-neutral-800 pt-6">
                  <h4 className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">Estimated Project Breakdown</h4>
                  
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-500">Tata Steel Civil & Foundation casting:</span>
                    <span className="text-neutral-300 font-semibold">₹{(calculatedQuote.civil / 100000).toFixed(2)}L</span>
                  </div>

                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-500">Italian Marble & Bespoke Finishes:</span>
                    <span className="text-neutral-300 font-semibold">₹{(calculatedQuote.finishes / 100000).toFixed(2)}L</span>
                  </div>

                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-500">Premium Materials (Glass, Lacquer, Carbon):</span>
                    <span className="text-neutral-300 font-semibold">₹{(calculatedQuote.materials / 100000).toFixed(2)}L</span>
                  </div>

                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-500">German BLUM Automation Engineering:</span>
                    <span className="text-neutral-300 font-semibold">₹{(calculatedQuote.automation / 100000).toFixed(2)}L</span>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-neutral-950/80 border border-neutral-900">
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                    *Note: This digital mock sheet incorporates premium luxury materials like calibrated plywood, waterproof paint coatings, and acoustic ceiling tracks. Book a slot below to freeze this quote with founder Ankit Gupta.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={injectQuoteToBooking}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#b18f25] hover:brightness-110 text-neutral-950 py-4 rounded-2xl text-xs uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2 shadow-[0_5px_20px_rgba(212,175,55,0.2)]"
                >
                  Apply Estimates To Booking Form <ArrowRight size={14} />
                </button>
                {quoteInjectedNotice && (
                  <p className="text-[11px] text-center font-mono text-[#d4af37] animate-pulse">
                    {quoteInjectedNotice}
                  </p>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. Why Choose Us / Corporate Statistics Grid */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <span className="text-[#d4af37] font-mono tracking-[0.25em] text-xs uppercase block animate-pulse">
                Luxury Standard
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
                No Compromise. <br />Only <span className="text-gold-gradient italic font-normal">Sovereign Performance.</span>
              </h2>
              <p className="text-gray-400 font-light text-sm sm:text-base leading-relaxed">
                Ankit Gupta's proprietary structural guidelines mandate using elite raw items. We have locked high-end partnerships with leading global architectural vendors.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Turnkey Accountability", text: "We handle architectural modeling, civil foundations, cabinetry framing, and gold polish touch-ups under a single unified dashboard." },
                  { title: "Rigorous Site Supervision", text: "Senior design architects conduct site surveys daily, verifying that millimeter levels of paneling and lighting positions match precisely." },
                  { title: "Absolute Legal Transparency", text: "Full tax transparency backed by official references (Reference Number 09ATRPG9136B1ZI/18-19/61), with no hidden delivery surcharges." },
                  { title: "Bespoke Material Lounge", text: "Free sampling in our private design chambers. Select of over forty types of walnut wood veneers and tinted glass trims." }
                ].map((item, id) => (
                  <div key={id} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-neutral-800 transition-colors">
                    <CheckCircle className="text-[#d4af37] mb-3" size={18} />
                    <h4 className="font-serif text-white font-medium text-sm mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-xs font-light leading-snug">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#896e1a] opacity-35 filter blur-xl"></div>
              <div className="relative bg-[#0d0d0d] rounded-2xl overflow-hidden border border-neutral-800 p-8 space-y-6">
                <span className="text-gold-gradient font-serif text-xl font-bold tracking-wide">Elite Credentials Desk</span>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <span className="text-xs text-neutral-400 font-mono uppercase">Managing Proprietor</span>
                    <span className="text-xs text-white font-serif tracking-widest uppercase">Ankit Gupta</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <span className="text-xs text-neutral-400 font-mono uppercase">Official Trade Tag</span>
                    <span className="text-xs text-[#d4af37] font-mono font-semibold">Aakriti Developers</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <span className="text-xs text-neutral-400 font-mono uppercase">Valid GSTIN Node</span>
                    <span className="text-xs text-white font-mono">09ATRPG9136B1ZI</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                    <span className="text-xs text-neutral-400 font-mono uppercase">Authorized Activities</span>
                    <span className="text-xs text-neutral-300 text-right max-w-[200px] leading-tight">Interior Solutions, Modular Walk-ins, Structural Buildings, False Ceiling Acoustical Frames, Turnkey Solutions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400 font-mono uppercase">Tax Integrity Record</span>
                    <span className="text-xs text-green-500 font-mono font-bold uppercase">&bull; Active status</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-gold-500/10 text-center">
                  <p className="text-xs text-[#d4af37] font-mono uppercase tracking-[0.1em]">
                    REGULATED LICENSURE &bull; INDIA
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Luxury Customer Testimonials with Sliders */}
      <section className="py-24 bg-[#090909] relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          
          <span className="text-[#d4af37] font-mono tracking-[0.25em] text-xs uppercase block animate-pulse mb-4">
            Verify Trust
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight mb-16">
            Words From Our <span className="text-gold-gradient italic font-normal">Exclusive Clientele</span>
          </h2>

          <div className="relative bg-black rounded-3xl p-8 md:p-12 border border-neutral-800 shadow-2xl">
            
            {/* Elegant Quotation Mark */}
            <div className="absolute -top-6 left-10 w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center text-black font-black text-2xl font-serif">
              “
            </div>

            <p className="text-gray-200 text-base md:text-lg font-serif italic leading-relaxed mb-8">
              {TESTIMONIALS[currentTestimonial].text}
            </p>

            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-gold-gradient font-semibold tracking-wider font-serif">
                {TESTIMONIALS[currentTestimonial].name}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {TESTIMONIALS[currentTestimonial].role} &bull; {TESTIMONIALS[currentTestimonial].location}
              </span>
              <span className="inline-block px-3 py-1 bg-neutral-900 border border-neutral-800 text-[#d4af37] text-[10px] font-mono rounded mt-2 uppercase tracking-widest">
                Project: {TESTIMONIALS[currentTestimonial].projectType}
              </span>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handlePrevTestimonial}
                className="w-10 h-10 rounded-full border border-neutral-800 hover:border-[#d4af37] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs text-neutral-500 font-mono">
                {currentTestimonial + 1} of {TESTIMONIALS.length}
              </span>
              <button
                onClick={handleNextTestimonial}
                className="w-10 h-10 rounded-full border border-neutral-800 hover:border-[#d4af37] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Core Consultation Booking & Real-time Live Clients Dashboard */}
      <section id="booking-section" className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Consultation Intake Form */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="text-[#d4af37] font-mono tracking-[0.25em] text-xs uppercase block">
                  Secure Entry Key
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight mt-1">
                  Draft Your <span className="text-gold-gradient italic font-normal">Luxury Brief</span>
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm font-light mt-3">
                  Submit this formal brief. Ankit Gupta's administrative architect will analyze your layout parameters and reach out privately to scheduled a physical/online interactive consult.
                </p>
              </div>

              <form onSubmit={submitBooking} className="space-y-5 bg-[#090909] p-8 rounded-3xl border border-neutral-900 shadow-xl">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">
                    Client Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="w-full bg-[#030303] text-white border border-neutral-800 rounded-xl p-3.5 text-xs focus:ring-[#d4af37] focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">
                      Contact Line *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 99999 00000"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      className="w-full bg-[#030303] text-white border border-neutral-800 rounded-xl p-3.5 text-xs focus:ring-[#d4af37] focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">
                      Estate Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gurugram Sec 54"
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                      className="w-full bg-[#030303] text-white border border-neutral-800 rounded-xl p-3.5 text-xs focus:ring-[#d4af37] focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">
                      Planned Investment
                    </label>
                    <select
                      value={bookingForm.budget}
                      onChange={(e) => setBookingForm({ ...bookingForm, budget: e.target.value })}
                      className="w-full bg-[#030303] text-gray-300 border border-neutral-800 rounded-xl p-3.5 text-xs focus:ring-[#d4af37] focus:border-[#d4af37]"
                    >
                      <option value="₹15L - ₹30L">₹15 Lakhs to ₹30 Lakhs</option>
                      <option value="₹30L - ₹50L">₹30 Lakhs to ₹50 Lakhs</option>
                      <option value="₹50L - ₹1Cr">₹50 Lakhs to ₹1 Crore</option>
                      <option value="₹1Cr+">₹1 Crore+ (Bespoke Turnkey Builder)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">
                      Project Requirement
                    </label>
                    <select
                      value={bookingForm.projectType}
                      onChange={(e) => setBookingForm({ ...bookingForm, projectType: e.target.value })}
                      className="w-full bg-[#030303] text-gray-300 border border-neutral-800 rounded-xl p-3.5 text-xs focus:ring-[#d4af37] focus:border-[#d4af37]"
                    >
                      <option value="Complete House Interior">Complete House Interior Solutions</option>
                      <option value="Smart Modular Kitchen">Smart Modular Kitchen & Wardrobe</option>
                      <option value="Ground-up Civil Construction">Bungalow Civil Construction</option>
                      <option value="Elite Renovation">Elite Mansion Renovation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">
                    Preferred Time For Consultation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wednesday 4:00 PM"
                    value={bookingForm.preferredTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                    className="w-full bg-[#030303] text-white border border-neutral-800 rounded-xl p-3.5 text-xs focus:ring-[#d4af37] focus:border-[#d4af37]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingBooking}
                    className="w-full bg-[#d4af37] hover:bg-[#e9d58a] text-[#050505] py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50"
                  >
                    {submittingBooking ? "Securing Entry..." : "Submit Consultation Request"}
                  </button>
                </div>

                {bookingStatusMsg && (
                  <p className="p-4 rounded-xl bg-neutral-900 border border-[#d4af37]/30 text-xs text-neutral-200 mt-4 leading-relaxed font-mono">
                    {bookingStatusMsg}
                  </p>
                )}
              </form>
            </div>

            {/* Live Client Database Board (Full transparency) */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="text-neutral-500 font-mono tracking-[0.25em] text-xs uppercase block">
                  Transparency Desk
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight mt-1">
                  Active Consultation <span className="text-gold-gradient italic font-normal">Registry</span>
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm font-light mt-3">
                  This board reflects verified inquiries registered in our secure system. Your submitted details will appear here instantly with dynamic status tracking.
                </p>
              </div>

              <div className="bg-[#090909] p-6 rounded-3xl border border-neutral-900 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Scheduled Briefs Today</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#d4af37]">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active CRM System Live
                  </span>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {liveBookings.length === 0 ? (
                    <p className="text-xs text-center text-neutral-500 font-mono py-12">
                      Encrypting pipeline, fetching direct registrations...
                    </p>
                  ) : (
                    liveBookings.map((booking, idx) => (
                      <div
                        key={booking.id || idx}
                        className="p-4 rounded-2xl bg-[#030303] border border-neutral-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#d4af37]/20 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#d4af37] font-mono font-bold">
                              {booking.id}
                            </span>
                            <span className="text-xs font-bold font-serif text-white">
                              {booking.name}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 space-y-0.5">
                            <p className="font-light">{booking.projectType} &bull; {booking.location}</p>
                            <p className="font-mono text-[9px] text-neutral-600">Preferred Slot: {booking.preferredTime}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="inline-block px-2.5 py-1 text-[9px] font-mono rounded bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 uppercase tracking-wider">
                            {booking.status || "Assigned To Ankit"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 border-t border-neutral-800 pt-4 flex gap-4 text-[10px] font-mono text-gray-500 leading-snug">
                  <Info size={16} className="text-[#d4af37] shrink-0" />
                  <span>
                    Your contact numbers are partially masked to ensure compliance with digital safety and premium guidelines. GSTIN structure verified.
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. AI Chatbot Assistant Lounge (Aarav Digital Counselor) */}
      <div className="fixed bottom-6 right-6 z-50">
        
        {/* Chat bubble button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full bg-[#d4af37] text-[#050505] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-[0_10px_30px_rgba(212,175,55,0.4)] relative"
          aria-label="Talk with Aarav AI Counselor"
        >
          {chatOpen ? <X size={24} /> : <MessageSquare size={24} />}
          {!chatOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-black animate-ping"></span>
          )}
        </button>

        {/* Chat Drawer Box */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-[20rem] sm:w-[24rem] h-[30rem] bg-[#0d0d0d] rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col justify-between"
            >
              
              {/* Chat Header */}
              <div className="bg-neutral-950 px-5 py-4 border-b border-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="block text-xs font-serif font-bold text-white uppercase tracking-wider">AARAV</span>
                    <span className="block text-[9px] font-mono text-[#d4af37]">Lead Digital Architect AI</span>
                  </div>
                </div>
                <div className="text-[9px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded capitalize">
                  Aakriti Advisors
                </div>
              </div>

              {/* Chat Scroll View */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 font-sans text-xs">
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                        m.role === "user"
                          ? "bg-[#d4af37] text-black font-medium rounded-tr-none"
                          : "bg-neutral-900 text-gray-200 rounded-tl-none border border-neutral-800"
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className="block text-[8px] text-right text-gray-500 mt-1 font-mono">
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-900 text-neutral-500 rounded-2xl rounded-tl-none px-4 py-3 border border-neutral-800 font-mono text-[10px] animate-pulse">
                      Aarav is planning material compositions...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat preset prompts */}
              <div className="px-4 py-2 border-t border-neutral-900 flex flex-wrap gap-1.5 bg-neutral-950/40">
                {[
                  "Italian Marble recommendations?",
                  "Walk-in closet spacing?",
                  "Estimated cost of a 4BHK?"
                ].map((prompt, id) => (
                  <button
                    key={id}
                    onClick={() => handleChatSend(prompt)}
                    className="text-[9px] bg-neutral-950 text-neutral-400 hover:text-[#d4af37] hover:border-[#d4af37]/40 border border-neutral-800 rounded px-2.5 py-1 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <div className="p-3 border-t border-neutral-900 bg-neutral-950 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask about layouts, woods, ceilings..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleChatSend();
                  }}
                  className="flex-grow bg-[#090909] text-white border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:ring-[#d4af37] focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={() => handleChatSend()}
                  className="bg-[#d4af37] hover:bg-[#e9d58a] text-black p-2.5 rounded-xl text-xs transition-colors font-bold"
                >
                  Ask
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating live inquiries for WhatsApp */}
      <a
        href="https://wa.me/919876543210?text=Hello%20Aakriti%20Developers,%20I%20would%20love%20to%20discuss%20a%20luxury%20turnkey%20interiors%20project."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 bg-[#25d366] text-white px-5 py-3.5 rounded-full flex items-center gap-2 shadow-[0_5px_15px_rgba(37,211,102,0.3)] hover:scale-105 duration-300 font-mono text-xs font-semibold capitalize"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        Direct WhatsApp Inquiry
      </a>

      {/* Modern Interactive Services Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-2xl w-full bg-neutral-950 rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-2xl"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/75 text-gray-400 hover:text-white flex items-center justify-center border border-neutral-800"
              >
                <X size={18} />
              </button>

              <div className="aspect-video relative">
                <img
                  src={selectedService.imageUrl}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent"></div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <span className="text-[#d4af37] font-mono tracking-widest text-[10px] uppercase block">
                    {selectedService.subtitle}
                  </span>
                  <h3 className="text-3xl font-serif text-white mt-1">
                    {selectedService.title}
                  </h3>
                </div>

                <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                  {selectedService.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Architectural execution items included:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                    {selectedService.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-[#d4af37]" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-900 pt-6">
                  <div>
                    <span className="block text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Commercial standard starts at</span>
                    <span className="text-xl font-serif text-[#d4af37] font-bold">{selectedService.startingRange}</span>
                  </div>
                  <button
                    onClick={() => {
                      setBookingForm({
                        ...bookingForm,
                        projectType: `Turnkey ${selectedService.title}`,
                        budget: selectedService.id === "construction" ? "₹50L - ₹1Cr" : "₹15L - ₹30L"
                      });
                      setSelectedService(null);
                      const el = document.getElementById("booking-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-gradient-to-r from-[#d4af37] to-[#b18f25] text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest"
                  >
                    Select service & book
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scroll Top Trigger */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 pointer-events-auto bg-neutral-950 hover:bg-[#d4af37] text-[#d4af37] hover:text-black hover:scale-105 p-3 rounded-full border border-neutral-850 hover:border-[#d4af37] shadow-xl z-30 transition-all"
          aria-label="Scroll to top of the screen"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* 11. Luxury Footer - GSTIN, Google Maps Satellite Simulation & Animations */}
      <footer className="bg-black text-gray-400 border-t border-neutral-900 relative overflow-hidden">
        
        {/* Subtle decorative particles grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl tracking-[0.2em] font-light text-white uppercase">
                AAKRITI
              </span>
              <span className="font-serif text-2xl tracking-[0.2em] italic text-[#d4af37]">
                DEVELOPERS
              </span>
            </div>
            
            <p className="text-xs sm:text-sm font-light leading-relaxed">
              Crafting premium high-end environments in collaboration with elite spatial materials across Gurugram, Delhi, and Noida since 2012. Owned and managed by industry pioneer Ankit Gupta.
            </p>

            {/* Tax Integrity Badging */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
                <span className="text-neutral-500 uppercase text-[9px] tracking-widest">GSTIN:</span>
                <span className="text-neutral-200">09ATRPG9136B1ZI</span>
              </div>
              <div className="flex items-center gap-2 font-light">
                <span className="w-1.5 h-1.5 bg-neutral-800 rounded-full"></span>
                <span className="text-neutral-500 uppercase text-[9px] tracking-widest">Reference:</span>
                <span className="text-neutral-400">09ATRPG9136B1ZI/18-19/61</span>
              </div>
              <p className="text-[10px] text-neutral-600">
                Registered in the state of Uttar Pradesh and Haryana, catering to prime residential estates.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-serif text-white tracking-widest text-xs uppercase text-gold-gradient font-semibold">
              Corporate Headquarters
            </h4>
            
            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#d4af37] shrink-0 mt-0.5" />
                <p className="leading-relaxed text-gray-300">
                  Level 14, DLF Horizon Center, Golf Course Road, Sector 43, Gurugram, Haryana, 122002
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#d4af37]" />
                <p className="text-gray-300">+91 98765 43210 (Inquiries Office)</p>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock size={14} className="text-[#d4af37]" />
                <p className="text-neutral-500">10:00 AM — 07:30 PM (All Days Access)</p>
              </div>
            </div>

            <div className="pt-2">
              <span className="block text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-2">Our Digital footprint</span>
              <div className="flex items-center gap-3">
                {["Inbound CRM", "Instagram Vault", "Pinterest Showcase", "LinkedIn HQ"].map((social, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2.5 py-1 rounded bg-neutral-950 hover:bg-[#d4af37] hover:text-black border border-neutral-900 transition-colors cursor-pointer"
                  >
                    {social}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Luxury Google Maps Satellite Integration (Interactive Simulation UI) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif text-white tracking-widest text-xs uppercase font-semibold">
              Active Satellite Geotag
            </h4>
            
            <div className="relative py-2 px-1">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-neutral-800 bg-[#0d0d0d] shadow-inner group">
                
                {/* Beautiful Mock Satellite Grid Background */}
                <div 
                  className="absolute inset-0 opacity-40 transition-transform duration-[6000ms] group-hover:scale-110 pointer-events-none"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
                
                {/* Scanline & Grid Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>

                {/* Radar sweep simulation element */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent -translate-x-full animate-pulse"></div>

                {/* Target pointers */}
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="w-3 h-3 rounded-full bg-[#d4af37] animate-ping absolute"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] border-2 border-black z-10"></span>
                  <div className="mt-1 bg-black/95 text-[9px] text-[#d4af37] font-mono px-2 py-0.5 rounded border border-[#d4af37]/30 backdrop-blur whitespace-nowrap">
                    DLF Horizon HQ (Gurugram)
                  </div>
                </div>

                <div className="absolute top-1/3 right-1/4 flex flex-col items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]/40 border border-black z-10"></span>
                  <div className="mt-1 bg-black/95 text-[8px] text-gray-400 font-mono px-1.5 py-0.5 rounded border border-neutral-800 backdrop-blur whitespace-nowrap">
                    Active Site Zone (Delhi)
                  </div>
                </div>

                {/* Satellite Elevation Tags */}
                <div className="absolute bottom-2 left-2 bg-neutral-950/90 text-[8px] font-mono text-neutral-500 p-2 rounded border border-neutral-900 leading-none space-y-1">
                  <p className="text-neutral-300">ELEVATION: 219m</p>
                  <p>COORDS: 28.4595° N, 77.0266° E</p>
                </div>

                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/80 text-[8px] font-mono text-[#25d366] px-2 py-1 rounded border border-[#25d366]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-ping"></span> GPS ACTIVE
                </div>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono italic mt-1.5 text-right">
                Geotag coordinates mapped privately for client transportation convenience
              </p>
            </div>
          </div>

        </div>

        {/* Outer bottom strip displaying full legal context, copyright and compliance */}
        <div className="bg-[#050505] py-8 text-center text-xs font-mono border-t border-neutral-950 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500">
            <div>
              <p>&copy; 2026 Aakriti Developers. All Rights Reserved.</p>
              <p className="text-[10px] text-neutral-600 mt-1">
                Tax Period: 2018-2019 &mdash; GSTIN: 09ATRPG9136B1ZI &mdash; Owner: Ankit Gupta.
              </p>
            </div>
            <div className="flex gap-4 text-[10px] text-neutral-600">
              <a href="#" className="hover:text-[#d4af37] transition-colors">Digital Blueprint Agreement</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-[#d4af37] transition-colors">Privacy Shield</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-[#d4af37] transition-colors">Compliance Verification</a>
            </div>
          </div>
        </div>

      </footer>

    </div>
  );
}
