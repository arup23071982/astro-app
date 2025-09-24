import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY not set. AI responses will be limited to FAQ matching.");
}

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

interface ServiceContext {
  consultationTypes: any[];
  courses: any[];
  products: any[];
  faqs: any[];
  pricing: any;
}

export async function generateAIResponse(
  userMessage: string,
  context: ServiceContext
): Promise<string> {
  if (!genAI) {
    return "I apologize, but AI responses are currently unavailable. Please contact our support team directly for assistance with your astrology consultation needs.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are an AI assistant for "Jai Guru Astro Remedy", an astrology consultation business run by expert astrologer Arup Shastri. 

BUSINESS CONTEXT:
- Consultation Types: ${JSON.stringify(context.consultationTypes)}
- Available Courses: ${JSON.stringify(context.courses)}
- Products: ${JSON.stringify(context.products)}
- Common FAQs: ${context.faqs.map(faq => `Q: ${faq.question} A: ${faq.answer}`).join('\n')}

INSTRUCTIONS:
1. Provide helpful, accurate information about our astrology services
2. Always be respectful and professional
3. Mention specific pricing and service details when relevant
4. Encourage booking consultations when appropriate
5. If you don't know something specific, offer to connect them with our expert team
6. Keep responses concise but informative
7. Use warm, welcoming tone befitting an astrology business

USER QUESTION: ${userMessage}

Please provide a helpful response:`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm experiencing some technical difficulties right now. For immediate assistance with your astrology consultation needs, please contact our support team directly.";
  }
}

export async function buildServiceContext(storage: any): Promise<ServiceContext> {
  try {
    const [courses, products, faqs] = await Promise.all([
      storage.getAllCourses(),
      storage.getAllProducts(), 
      storage.getAllFaqs()
    ]);

    const consultationTypes = [
      {
        type: "video",
        name: "Video Call Consultation",
        pricing: "₹299-999 (15-60 minutes)",
        description: "Face-to-face consultation via secure video call"
      },
      {
        type: "audio", 
        name: "Audio Call Consultation",
        pricing: "₹299-999 (15-60 minutes)",
        description: "Voice-only consultation for focused guidance"
      },
      {
        type: "chat",
        name: "Chat Session",
        pricing: "₹299-999 (15-60 minutes)", 
        description: "Text-based consultation through secure messaging"
      },
      {
        type: "in-person",
        name: "In-Person Consultation",
        pricing: "₹499-999 (30-60 minutes)",
        description: "Traditional face-to-face consultation in Kolkata",
        availability: "Wednesdays 3pm-6pm only"
      },
      {
        type: "home-service",
        name: "Home Service Consultation", 
        pricing: "₹2499-6999 (90-180 minutes)",
        description: "Premium consultation at your home with personalized rituals",
        coverage: "Within 25km of Kolkata"
      },
      {
        type: "topic-based",
        name: "Topic-Based Consultation",
        pricing: "₹100 per topic (6 minutes each)",
        description: "Select specific topics for focused guidance"
      }
    ];

    return {
      consultationTypes,
      courses: courses.slice(0, 5), // Limit context size
      products: products.slice(0, 5),
      faqs: faqs.slice(0, 10),
      pricing: {
        consultations: "₹299-6999 depending on type and duration",
        courses: "Various pricing available", 
        products: "Authentic astrological remedies and items"
      }
    };

  } catch (error) {
    console.error("Error building service context:", error);
    return {
      consultationTypes: [],
      courses: [],
      products: [],
      faqs: [],
      pricing: {}
    };
  }
}