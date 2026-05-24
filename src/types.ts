export interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  startingRange: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  category: "all" | "interior" | "kitchen" | "wardrobe" | "turnkey";
  description: string;
  location: string;
  timeline: string;
  area: string;
  investment: string;
  imageUrl: string;
  beforeUrl?: string;
  afterUrl?: string;
  status?: "Completed" | "In Progress" | "Under Design";
  verifiedClient?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  text: string;
  rating: number;
  projectType: string;
  avatarUrl: string;
}

export interface BookingSubmission {
  name: string;
  phone: string;
  location: string;
  budget: string;
  projectType: string;
  preferredTime: string;
}

export interface BookingResponse extends BookingSubmission {
  id: string;
  status: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

// Initial luxury materials list
export const LUXURY_SERVICES: ServiceDetail[] = [
  {
    id: "interior-design",
    title: "Luxury Interior Design",
    subtitle: "Connoisseur Living Spaces",
    description: "Immersive layouts built with hand-picked Italian marble backdrops, fluted wooden cladding, custom metallic architectural inserts, and precise 2700K ambient warmth matching premium architectural digest requirements.",
    highlights: ["Symmetrical design alignments", "Bespoke veneer styling", "Italian Calacatta backlighting", "Curated custom home decor"],
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    startingRange: "₹15 Lakhs Onwards"
  },
  {
    id: "modular-kitchen",
    title: "Smart Modular Kitchens",
    subtitle: "Culinary Masterpieces",
    description: "Premium ergonomic layouts featuring seamless glass panel shutters, quartz stone countertops, integrated German soft-closing drawer channels, and custom automated appliance configurations designed for Indian cooking lifestyles.",
    highlights: ["Blum soft-closing automation", "Anti-scratch acrylic finishes", "Pristine double-sink layouts", "Integrated concealed lighting"],
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    startingRange: "₹8 Lakhs Onwards"
  },
  {
    id: "wardrobes",
    title: "Bespoke Wardrobe walk-ins",
    subtitle: "Couture Walk-In Closets",
    description: "Floor-to-ceiling modern walk-in wardrobes styled with tinted fluted-glass frames, sensory light tracks, brushed bronze door finishes, and internal leather velvet custom jewelry organizers.",
    highlights: ["Sensory dynamic LEDs", "Tinted acoustic security glass", "Custom luxury velvet linings", "Maximum space engineering"],
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    startingRange: "₹5 Lakhs Onwards"
  },
  {
    id: "construction",
    title: "Home Construction & Turnkeys",
    subtitle: "End-to-End Civil Excellence",
    description: "Ground-up foundation design, structure building, layout casting, waterproofing, and absolute execution of structural facades for modern bungalows and boutique apartments handled by certified site leads.",
    highlights: ["Tata premium steel skeleton", "Grade M25 certified casting", "Precision exterior cladding", "10-Year structural guarantee"],
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    startingRange: "₹1,800 / Sq.Ft."
  },
  {
    id: "smart-interiors",
    title: "Smart Home Tech Integrations",
    subtitle: "Future Connected Living",
    description: "Intelligent automation units allowing voice and motion control of custom magnetic profile tracks, central ducted climate, acoustic glass panels, and mechanical false ceiling configurations.",
    highlights: ["Unified iPad smart controller", "Lutron certified dimming presets", "Presence-aware motion arrays", "Acoustic noise isolation panels"],
    imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    startingRange: "₹4 Lakhs Onwards"
  },
  {
    id: "renovations",
    title: "Elite Property Renovations",
    subtitle: "Restoration Of Splendor",
    description: "Complete overhaul of historic and premium estates into ultra-modern design domains without disrupting structural integrity, backed by rigorous civil and damp-proofing warranties.",
    highlights: ["Micro-concrete overlaying", "Advanced structural damp shield", "Piping & premium Kohler plumbing upgrade", "High fidelity wall restructuring"],
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    startingRange: "₹10 Lakhs Onwards"
  }
];

export const LUXURY_PROJECTS: ShowcaseProject[] = [
  {
    id: "project-1",
    title: "The Regal Penthouse",
    category: "interior",
    description: "An elegant charcoal-wood and calacatta gold marble masterpiece reflecting absolute symmetry and grand visual scales for an elite family in Gurgaon.",
    location: "Magnolias, DLF Phase 5, Gurugram",
    timeline: "6 Months",
    area: "4,500 Sq.Ft.",
    investment: "₹75 Lakhs",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    beforeUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    afterUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    status: "Completed",
    verifiedClient: true
  },
  {
    id: "project-2",
    title: "The Emerald Villa facade",
    category: "turnkey",
    description: "Full-scale custom concrete villa construction with immense thermal-efficient float-glass partitions, wooden outdoor decks, and structural cantilevers.",
    location: "Sushant Lok I, Gurugram",
    timeline: "14 Months",
    area: "8,200 Sq.Ft.",
    investment: "₹2.4 Crores",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    status: "In Progress",
    verifiedClient: true
  },
  {
    id: "project-3",
    title: "Culinary Atelier Kitchen",
    category: "kitchen",
    description: "Smart automation kitchen emphasizing deep matte-ash polymer panels, hidden finger pull magnetic grooves, and robust seamless marble finishes.",
    location: "Jor Bagh, New Delhi",
    timeline: "45 Days",
    area: "350 Sq.Ft.",
    investment: "₹18 Lakhs",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    status: "Completed",
    verifiedClient: true
  },
  {
    id: "project-4",
    title: "The walk-in Vault Wardrobe",
    category: "wardrobe",
    description: "Master designer walk-in glass wardrobe integrated with leather display units, sensory track spotlights, and dynamic automated pull-down clothes hangers.",
    location: "Golf Link, New Delhi",
    timeline: "30 Days",
    area: "280 Sq.Ft.",
    investment: "₹12 Lakhs",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    status: "Completed",
    verifiedClient: false
  },
  {
    id: "project-5",
    title: "The Onyx Lounge Residence",
    category: "interior",
    description: "High-contrast luxury lounge styled with fluted dark panel columns, built-in smart wall controls, and statement marble floating platforms.",
    location: "Greater Kailash II, Delhi",
    timeline: "4 Months",
    area: "2,200 Sq.Ft.",
    investment: "₹45 Lakhs",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    status: "Under Design",
    verifiedClient: true
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Vikramaditya Singhania",
    role: "Industrialist",
    location: "Vasant Vihar, New Delhi",
    text: "Working with Ankit Gupta and Aakriti Developers was like commissioning a work of fine art. The attention to wood grains, alignment of Italian marbles, and prompt turnaround exceeded our ₹2 Crore expectations. A true luxury standard in India.",
    rating: 5,
    projectType: "Luxury Villa Turnkey",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "test-2",
    name: "Shalini Khurana",
    role: "Premium Realtor & Designer",
    location: "DLF Kings Court, GK II, Delhi",
    text: "The before/after difference Aakriti Developers delivered was phenomenal. Their cost calculations are strictly transparent, and they customized our full walk-in closets with sensory LED rails exactly as mapped in high-fidelity blueprints.",
    rating: 5,
    projectType: "Full House Interior Package",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "test-3",
    name: "Dr. Rohit Jaichand",
    role: "Cardiologist",
    location: "Golf Course Road, Gurgaon",
    text: "Their Smart Modular Kitchen functions flawlessly, highlighting incredible German engineering. Our family enjoys cooking in a noise-free, highly fluid culinary space. Ankit's execution timeline estimation was exactly on time.",
    rating: 5,
    projectType: "Automation Kitchen & Living Area",
    avatarUrl: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80"
  }
];
