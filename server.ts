import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

// Prevent local loopback resolution issues
dns.setDefaultResultOrder("ipv4first");

// Initialize Gemini safely, logging if it is missing
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully with API key.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.warn("GEMINI_API_KEY environment variable is missing. Server will use intelligent fallback responses.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    const { messages, activityContext, systemTime } = req.body;

    if (!messages || !Array.isArray(messages) || !activityContext) {
      res.status(400).json({ error: "Invalid request payload. Messages and activity context are required." });
      return;
    }

    const lastMessage = messages[messages.length - 1]?.text || "";
    const conversationHistoryStr = messages.map(m => `${m.sender === 'user' ? 'Guest' : 'Assistant'}: ${m.text}`).join("\n");

    // Dynamic slot list to insert into instructions
    const slotsStr = activityContext.slots
      .map((s: any) => `- ${s.date} at ${s.time} (${s.spotsLeft} spots left${s.full ? ' - FULL' : ''})`)
      .join("\n");

    const systemInstruction = 
      `You are a friendly and helpful AI Booking Assistant named "Shoreline Assistant" representing the beach activity marketplace "Shoreline". ` +
      `Your goal is to assist the guest in reserving a spot for the experience: "${activityContext.title}". ` +
      `Activity Details:\n` +
      `- Price per person: €${activityContext.price}\n` +
      `- Duration: ${activityContext.duration}\n` +
      `- Capacity limits: Max group size is ${activityContext.maxGroupSize} people.\n\n` +
      `Available dates & times for booking:\n${slotsStr}\n\n` +
      `Today's date context: June 12, 2026. Current time: ${systemTime || '09:41 AM'}.\n\n` +
      `Guidance:\n` +
      `1. Be welcoming, clear, and highly concise. Use friendly professional tone appropriate for a luxury beach resort.\n` +
      `2. Identify the guest's preferred date/time slot and the number of people. Only suggest the exact slots listed above.\n` +
      `3. If they select a slot that is marked as FULL, politely let them know and recommend other times.\n` +
      `4. Verify that their group size does not exceed the limit (${activityContext.maxGroupSize} people).\n` +
      `5. Once you have BOTH a valid slot (date & time) AND a valid guest count, ask them to click the confirm button to finalize the reservation. ` +
      `Make sure to populate the 'bookingAttempt' structure in your JSON response with the dates and a 'readyToConfirm' value of true. ` +
      `If the details are not yet complete, set 'bookingAttempt' to null or keep 'readyToConfirm' as false.`;

    // Attempt calling real Gemini API
    if (aiClient) {
      try {
        const prompt = `Current conversation history:\n${conversationHistoryStr}\n\nLatest response from Guest: "${lastMessage}"\n\nAnalyze the context and reply.`;

        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reply: {
                  type: Type.STRING,
                  description: "A natural, friendly message responding to the guest."
                },
                bookingAttempt: {
                  type: Type.OBJECT,
                  description: "Set this of type Object ONLY when a specific valid slot and number of people have been determined.",
                  properties: {
                    date: { type: Type.STRING, description: "The booking date. Must map to a listed slot, e.g. 'June 12'." },
                    time: { type: Type.STRING, description: "The time slot. Must map to a listed slot, e.g. '10:00 AM - 12:00 PM'." },
                    people: { type: Type.INTEGER, description: "Number of people to register." },
                    readyToConfirm: { type: Type.BOOLEAN, description: "True if both valid slot and correct person count exist and are confirmed by the guest." }
                  },
                  required: ["date", "time", "people", "readyToConfirm"]
                }
              },
              required: ["reply"]
            }
          }
        });

        if (response && response.text) {
          try {
            const parsedResult = JSON.parse(response.text);
            res.json(parsedResult);
            return;
          } catch (jsonErr) {
            console.error("Failed to parse JSON response from Gemini:", response.text);
            // Fallback parsing below
          }
        }
      } catch (geminiError) {
        console.error("Gemini API execution error:", geminiError);
      }
    }

    // Elegant fallback rule-based bot if API is down or missing
    console.log("Executing intelligent fallback assistant.");
    const inputUpper = lastMessage.toUpperCase();
    let reply = "";
    let bookingAttempt: any = null;

    if (inputUpper.includes("JUNE 12") && (inputUpper.includes("10") || inputUpper.includes("TEN"))) {
      let count = 2;
      const match = lastMessage.match(/\b([1-6])\b/);
      if (match) count = parseInt(match[1]);

      reply = `Perfect! The slots for June 12 at 10:00 AM matches beautifully. We still have spots available! I can help you prepare for a great time. Would you like to confirm this reservation for ${count} guest(s)? If so, please click the confirmation banner below!`;
      bookingAttempt = {
        date: "June 12",
        time: "10:00 AM - 12:00 PM",
        people: count,
        readyToConfirm: true
      };
    } else if (inputUpper.includes("JUNE 13") && (inputUpper.includes("10") || inputUpper.includes("TEN"))) {
      let count = 2;
      const match = lastMessage.match(/\b([1-6])\b/);
      if (match) count = parseInt(match[1]);

      reply = `Perfect, June 13 at 10:00 AM is a great choice! We have 6 spots left. I'm ready to set up this booking for ${count} guest(s). Please click the confirm button to finalize!`;
      bookingAttempt = {
        date: "June 13",
        time: "10:00 AM - 12:00 PM",
        people: count,
        readyToConfirm: true
      };
    } else if (inputUpper.includes("2") || inputUpper.includes("TWO") || inputUpper.includes("3") || inputUpper.includes("THREE") || inputUpper.includes("1") || inputUpper.includes("ONE")) {
      let count = 2;
      const match = lastMessage.match(/\b([1-6])\b/);
      if (match) count = parseInt(match[1]);

      reply = `Excellent, I've noted down ${count} people. For which date and time should we book? Our active slots are: June 12 at 10:00 AM (4 spots left) and June 13 at 10:00 AM (6 spots left).`;
      bookingAttempt = {
        date: "June 12",
        time: "10:00 AM - 12:00 PM",
        people: count,
        readyToConfirm: false
      };
    } else {
      reply = `I would love to help you book the ${activityContext.title}! We have spots available on June 12 at 10:00 AM and June 13 at 10:00 AM. Please let me know your preferred date, time, and how many people are in your party?`;
    }

    res.json({ reply, bookingAttempt });
  });

  // Apply dev server on port 3000
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production files from dist/.");
  }

  app.listen(PORT, "localhost", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical error starting active Express server:", err);
});
