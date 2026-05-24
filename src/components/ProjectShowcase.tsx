import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, MapPin, Calendar, Layers, Sliders, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { LUXURY_PROJECTS, ShowcaseProject } from "../types";

export default function ProjectShowcase() {
  const [activeCategory, setActiveCategory] = useState<"all" | "interior" | "kitchen" | "wardrobe" | "turnkey">("all");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const beforeAfterRef = useRef<HTMLDivElement>(null);

  const filteredProjects = LUXURY_PROJECTS.filter(
    (proj) => activeCategory === "all" || proj.category === activeCategory
  );

  const handleMove = (clientX: number) => {
    if (!beforeAfterRef.current) return;
    const rect = beforeAfterRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isResizing) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    handleMove(e.clientX);
  };

  const startResize = () => setIsResizing(true);
  const endResize = () => setIsResizing(false);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", endResize);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", endResize);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", endResize);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", endResize);
    };
  }, [isResizing]);

  const beforeImage = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"; // dusty empty structure
  const afterImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"; // warm finished luxury salon

  return (
    <section id="projects-section" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 ambient-gold-radial pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#d4af37] font-mono tracking-[0.25em] text-xs uppercase animate-pulse">
            Bespoke Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mt-2 tracking-tight text-white font-medium">
            Architectural <span className="text-gold-gradient italic font-normal">Masterworks</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto font-light text-sm sm:text-base">
            Every creation is a customized layout executed with rigorous structural guidelines and curated luxury aesthetics.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {(["all", "interior", "kitchen", "wardrobe", "turnkey"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-[#d4af37] text-black border-[#d4af37] font-medium shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                  : "bg-neutral-950/80 text-gray-400 border-neutral-800 hover:text-white hover:border-neutral-700"
              }`}
            >
              {cat === "all" ? "All Masterworks" : cat === "kitchen" ? "Modular Kitchens" : cat === "wardrobe" ? "Premium Wardrobes" : `${cat}s`}
            </button>
          ))}
        </div>

        {/* Dynamic Before & After Slider */}
        <div className="mb-24">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-serif text-center mb-6 text-white text-gold-gradient">
              Experience the Transformation (Before / After)
            </h3>
            <p className="text-xs text-center text-gray-500 mb-8 max-w-md mx-auto font-light">
              Slide the brass handle to peel away the raw, structural shell of our project space and view the completed gold-woven residence lounge.
            </p>

            <div
              id="before-after-slider-container"
              ref={beforeAfterRef}
              onMouseDown={(e) => {
                e.preventDefault();
                startResize();
                handleMove(e.clientX);
              }}
              onTouchStart={(e) => {
                startResize();
                handleMove(e.touches[0].clientX);
              }}
              className="relative h-[25rem] md:h-[30rem] w-full rounded-2xl overflow-hidden select-none cursor-ew-resize border border-neutral-800 shadow-2xl"
            >
              {/* After Image (Full background) */}
              <img
                src={afterImage}
                alt="After: Luxury Living Room"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute right-4 top-4 bg-black/70 backdrop-blur border border-gold-500/20 px-3 py-1 rounded text-[10px] text-[#d4af37] uppercase tracking-widest font-mono select-none">
                Bespoke Finish
              </div>

              {/* Before Image (Clipped overlay) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={beforeImage}
                  alt="Before: Raw Shell Structure"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: beforeAfterRef.current?.getBoundingClientRect().width || "800px" }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute left-4 top-4 bg-black/70 backdrop-blur border border-neutral-700 px-3 py-1 rounded text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                  Raw Site Shell
                </div>
              </div>

              {/* Slider Handle separator bar */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-[#d4af37] cursor-ew-resize pointer-events-none slider-handle-glow"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 rounded-full bg-black border border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-xl">
                  <Sliders size={14} className="animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-900 hover:border-[#d4af37]/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-500 flex flex-col h-full relative"
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60"></div>
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur border border-gold-500/20 text-[#d4af37] text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded">
                    {project.category}
                  </span>

                  {/* Social Proof & Trust Badges */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10 transition-transform duration-300 group-hover:scale-105">
                    {project.status && (
                      <span className={`px-2.5 py-0.5 rounded text-[8px] uppercase font-mono tracking-wider font-semibold backdrop-blur-md border shadow-[0_2px_10px_rgba(0,0,0,0.4)] ${
                        project.status === "Completed"
                          ? "bg-emerald-950/75 text-emerald-400 border-emerald-500/35"
                          : project.status === "In Progress"
                          ? "bg-amber-950/75 text-amber-400 border-amber-500/35"
                          : "bg-blue-950/75 text-blue-400 border-blue-500/35"
                      }`}>
                        ●&nbsp;&nbsp;{project.status}
                      </span>
                    )}
                    {project.verifiedClient && (
                      <span className="flex items-center gap-1 bg-black/85 backdrop-blur-md border border-[#d4af37]/35 text-[#d4af37] text-[8px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                        <ShieldCheck size={10} className="stroke-[2.5px] text-[#d4af37]" />
                        <span>Verified Client</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-mono mb-2">
                      <MapPin size={12} className="text-[#d4af37]" />
                      <span>{project.location}</span>
                    </div>

                    <h4 className="text-xl font-serif font-medium text-white mb-3 group-hover:text-[#d4af37] transition-colors duration-300">
                      {project.title}
                    </h4>

                    <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>

                  <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
                    <div className="border-t border-neutral-900 pt-4 mt-2 grid grid-cols-2 gap-4 text-[11px] font-mono text-gray-500 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div>
                        <span className="block text-gray-600 uppercase text-[9px] tracking-widest">Investment</span>
                        <span className="text-[#d4af37] font-semibold">{project.investment}</span>
                      </div>
                      <div>
                        <span className="block text-gray-600 uppercase text-[9px] tracking-widest">Dimensions</span>
                        <span className="text-neutral-300">{project.area}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
