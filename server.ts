import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (err) {
        console.error("Failed to initialize GoogleGenAI with key:", err);
      }
    }
  }
  return aiClient;
}

// Global In-Memory Booking storage for clients
interface Booking {
  id: string;
  name: string;
  phone: string;
  location: string;
  budget: string;
  projectType: string;
  preferredTime: string;
  status: string;
  createdAt: string;
}

const bookingsList: Booking[] = [
  {
    id: "B-8419",
    name: "Arjun Khanna",
    phone: "+91 98765 43210",
    location: "DLF Phase 5, Gurugram",
    budget: "₹35L - ₹50L",
    projectType: "Luxury Penthouse Interior",
    preferredTime: "11:00 AM",
    status: "Confirmed",
    createdAt: "2026-05-24"
  },
  {
    id: "B-2901",
    name: "Priya Sharma",
    phone: "+91 99991 88882",
    location: "South Extension II, Delhi",
    budget: "₹1.2Cr+",
    projectType: "Complete Turnkey Villa",
    preferredTime: "04:30 PM",
    status: "Designing Stage",
    createdAt: "2026-05-23"
  }
];

// Serve static inquiries to represent real system responsiveness
app.get("/api/bookings", (req, res) => {
  res.json({ bookings: bookingsList });
});

app.post("/api/bookings", (req, res) => {
  const { name, phone, location, budget, projectType, preferredTime } = req.body;
  
  if (!name || name.trim() === "" || !phone || phone.trim() === "") {
    return res.status(400).json({ error: "Client Name and Contact Phone are required." });
  }

  const newBooking: Booking = {
    id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name.trim(),
    phone: phone.trim(),
    location: location || "India",
    budget: budget || "Luxury Custom Portfolio",
    projectType: projectType || "Turnkey Luxury Solution",
    preferredTime: preferredTime || "Immediate Call back",
    status: "Consultation Scheduled",
    createdAt: new Date().toISOString().split("T")[0]
  };

  bookingsList.unshift(newBooking);
  res.json({ success: true, booking: newBooking });
});

// Aakriti Developers chatbot counselor endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Prompt message is required." });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are "Aarav", the ultra-premium AI Design Partner for Aakriti Developers (owned by Ankit Gupta, GSTIN: 09ATRPG9136B1ZI). 
Aakriti Developers creates architectural-level, world-class bespoke interior spaces and complete house constructions across India.

Introduce yourself as Ankit Gupta's lead digital design partner here to craft spaces of absolute perfection.
Be sophisticated, polite, informative, and deeply knowledgeable about high-end design traits:
- Materials: Italian custom marbles (Calacatta, Carrara), flute textured oak-wood, brushed brass/bronze details, premium lacquer coatings, premium structural glass partitions.
- Services: Interior Design, Smart Modular Kitchens with soft-close BLUM hardware, bespoke modular wardrobes, False ceiling designs with integrated ambient LEDs, complete Home Construction/Turnkey.
- Touch points: Indian luxury architectural digest values, space maximization, clean lines with warmth.

Your goal is to understand their preferences, recommend spectacular upscale materials, and help steer them to book a personalized design review session with Managing Director Ankit Gupta using the consultation form on our website.

Keep responses under 200 words, formatting with sleek spacing and premium tone. Do not write server logs or technical jargon. Let's make their dreams of a luxury home real!`;

    if (!ai) {
      const luxuryFallbacks = [
        "Welcome to the high-concept lounge of Aakriti Developers. For an elite living room experience, our director Ankit Gupta suggests a backdrop of warm neutral charcoal panels, structured walnut wood veneers, and indirect recessed lighting at 2700K temperature. Would you like to map out our bespoke modular wardrobes or design a high-tech smart kitchen next? I highly recommend booking a consultation with us using our luxury scheduler board.",
        "Aakriti Developers designs homes as masterwork pieces. To achieve a ₹1 Crore luxury experience, we focus on material continuity—integrating calacatta marble textures, seamless brushed gold trims, and bespoke turnkey ceiling solutions. Please register your details in our private Consultation Booking desk so Ankit Gupta's premier designer team can phone you directly.",
        "Ah, bespoke luxury requires architectural perfection. For multi-story villas or luxury turnkeys, we control all execution from false-ceiling acoustic layouts to smart lighting installations. Let's design your dream space. Please input your preferred details in our Booking form or click the floating WhatsApp inquiries to lock an express session."
      ];
      const randomFallback = luxuryFallbacks[Math.floor(Math.random() * luxuryFallbacks.length)];
      return res.json({ text: randomFallback });
    }

    // Call the modern Gemini API generateContent method cleanly
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: systemPrompt },
        ...(history || []).slice(-8).map((h: any) => ({
          text: `${h.role === "user" ? "Client" : "Aarav"}: ${h.text}`
        })),
        { text: `Client: ${message}` }
      ],
      config: {
        temperature: 0.72,
      }
    });

    res.json({ text: response.text || "I am processing your luxury architectural queries. Let's connect you directly with Ankit Gupta's custom planning desk for high-fidelity estimates." });
  } catch (error: any) {
    console.error("Gemini server integration warning:", error);
    res.json({
      text: "At Aakriti Developers, we seek pristine quality in every aspect. Although there is a minor network line delay on my end, our design team is fully available to orchestrate your layout. Kindly register your contact number on our consultation book, or connect via our live WhatsApp line, and we will initiate details immediately."
    });
  }
});

// Configure Vite or Serve Compiled Static Assets
async function startAppServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aakriti Developers] Premium Full-Stack Web Portal is active on port ${PORT}`);
  });
}

startAppServer();
