import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCm-LEH6ALM3tmn1Xn50eZykS9KD_EvyOc';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface TreatmentData {
  treatmentName: string;
  tagline: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  sideEffects: {
    common: string[];
    rare: string[];
  };
  treatmentProcess: {
    preTreatmentCare: string[];
    postTreatmentCare: string[];
  };
  contact: {
    phone: string;
    notes: string[];
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  sources?: string[];
}

export interface ChatSession {
  userId: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

class GeminiChatService {
  private model: any;
  private treatmentData: Record<string, TreatmentData> = {};
  private lastTreatmentDataFetch = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests

  constructor() {
    try {
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.8, // Slightly higher for more conversational responses
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
    } catch (error) {
      console.error('Error initializing Gemini model:', error);
    }
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  async fetchTreatmentData(): Promise<Record<string, TreatmentData>> {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (now - this.lastTreatmentDataFetch < this.CACHE_DURATION && Object.keys(this.treatmentData).length > 0) {
      return this.treatmentData;
    }

    try {
      const response = await fetch('https://danielesthetixs-default-rtdb.firebaseio.com/treatmentPages.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.treatmentData = data || {};
      this.lastTreatmentDataFetch = now;
      
      console.log('Treatment data fetched:', Object.keys(this.treatmentData).length, 'treatments');
      return this.treatmentData;
    } catch (error) {
      console.error('Error fetching treatment data:', error);
      return this.treatmentData; // Return cached data on error
    }
  }

  findRelevantTreatments(query: string): Array<{ name: string; data: TreatmentData; relevance: number }> {
    const queryLower = query.toLowerCase();
    const results: Array<{ name: string; data: TreatmentData; relevance: number }> = [];

    Object.entries(this.treatmentData).forEach(([key, treatment]) => {
      let relevance = 0;
      
      // Check treatment name
      if (treatment.treatmentName?.toLowerCase().includes(queryLower)) {
        relevance += 10;
      }
      
      // Check tagline
      if (treatment.tagline?.toLowerCase().includes(queryLower)) {
        relevance += 5;
      }
      
      // Check FAQs
      treatment.faqs?.forEach(faq => {
        if (faq.question.toLowerCase().includes(queryLower) || 
            faq.answer.toLowerCase().includes(queryLower)) {
          relevance += 3;
        }
      });
      
      // Check side effects
      treatment.sideEffects?.common?.forEach(effect => {
        if (effect.toLowerCase().includes(queryLower)) {
          relevance += 2;
        }
      });
      
      treatment.sideEffects?.rare?.forEach(effect => {
        if (effect.toLowerCase().includes(queryLower)) {
          relevance += 2;
        }
      });

      // Check for common keywords
      const keywords = ['botox', 'filler', 'prp', 'treatment', 'procedure', 'cosmetic', 'aesthetic', 'skin', 'face', 'lip', 'chin', 'hair', 'rejuvenation'];
      keywords.forEach(keyword => {
        if (queryLower.includes(keyword) && treatment.treatmentName?.toLowerCase().includes(keyword)) {
          relevance += 3;
        }
      });

      if (relevance > 0) {
        results.push({ name: key, data: treatment, relevance });
      }
    });

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 3);
  }

  private buildTreatmentContext(relevantTreatments: Array<{ name: string; data: TreatmentData; relevance: number }>): string {
    if (relevantTreatments.length === 0) {
      return '';
    }

    let context = '\n=== AVAILABLE TREATMENTS AT DR. DANIEL ESTHETIXS ===\n';
    
    relevantTreatments.forEach(({ data }, index) => {
      context += `\n${index + 1}. ${data.treatmentName}\n`;
      context += `   Description: ${data.tagline}\n`;
      
      if (data.faqs && data.faqs.length > 0) {
        context += `   Common Questions:\n`;
        data.faqs.slice(0, 2).forEach(faq => {
          context += `   Q: ${faq.question}\n   A: ${faq.answer}\n`;
        });
      }
      
      if (data.sideEffects?.common && data.sideEffects.common.length > 0) {
        context += `   Common Side Effects: ${data.sideEffects.common.slice(0, 3).join(', ')}\n`;
      }
      
      if (data.contact?.phone) {
        context += `   Contact: ${data.contact.phone}\n`;
      }
      context += '\n';
    });

    return context;
  }

  async generateResponse(userMessage: string, conversationHistory: ChatMessage[]): Promise<{ response: string; sources: string[] }> {
    try {
      // Apply rate limiting
      await this.rateLimit();

      // Fetch latest treatment data
      await this.fetchTreatmentData();
      
      // Find relevant treatments
      const relevantTreatments = this.findRelevantTreatments(userMessage);
      
      console.log('Found relevant treatments:', relevantTreatments.length);

      // Build comprehensive context
      const treatmentContext = this.buildTreatmentContext(relevantTreatments);
      
      // Get recent conversation context
      const recentHistory = conversationHistory.slice(-4).map(msg => 
        `${msg.sender === 'user' ? 'Patient' : 'Assistant'}: ${msg.text}`
      ).join('\n');

      const prompt = `You are Dr. Daniel's friendly AI assistant at Dr. Daniel Esthetixs, a premier cosmetic and medical treatment clinic in Toronto. You're here to help patients learn about treatments and feel comfortable about their aesthetic journey.

CLINIC INFORMATION:
- Dr. Daniel Esthetixs specializes in cosmetic and aesthetic treatments
- Phone: 416-449-0936 (Aesthetic inquiries)
- Phone: 416-342-0670 (Medical inquiries)
- Location: 1265 York Mills Rd, Unit F1-1, Toronto, ON M3A 1Z4

${treatmentContext}

CONVERSATION HISTORY:
${recentHistory}

CURRENT QUESTION: ${userMessage}

RESPONSE STYLE GUIDELINES:
1. **Be Warm & Conversational**: Use a friendly, approachable tone like you're talking to a friend
2. **Use Natural Language**: Avoid medical jargon - explain things in simple, everyday terms
3. **Be Encouraging**: Help patients feel confident about their aesthetic journey
4. **Format for Readability**: 
   - Use short paragraphs (2-3 sentences max)
   - Add line breaks between different topics
   - Use bullet points for lists when helpful
   - Keep sentences conversational and not too long

5. **Be Personal & Caring**: 
   - Acknowledge their concerns
   - Use phrases like "I'd be happy to help" or "That's a great question!"
   - Show enthusiasm about helping them achieve their goals

6. **Provide Helpful Information**:
   - Give specific details about treatments when relevant
   - Mention benefits and what to expect
   - Always include contact information for booking
   - Suggest next steps

7. **Keep It Conversational**: 
   - Use contractions (we'll, you'll, it's)
   - Ask follow-up questions when appropriate
   - Use transitional phrases to connect ideas

EXAMPLE RESPONSE FORMAT:
"Hi there! 😊 That's a fantastic question about [treatment].

[Brief, friendly explanation in 1-2 sentences]

Here's what makes this treatment special:
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

[Additional paragraph with more details, keeping it conversational]

I'd love to help you learn more! Feel free to give us a call at 416-449-0936 for aesthetic consultations, and we can discuss what might work best for your goals.

Is there anything specific about [treatment] you'd like to know more about?"

Please respond to the patient's question in this friendly, conversational style:`;

      console.log('Sending request to Gemini...');
      
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log('Received response from Gemini');

      // Determine sources
      const sources: string[] = [];
      if (relevantTreatments.length > 0) {
        sources.push('Dr. Daniel Esthetixs Treatment Database');
      }
      sources.push('Professional Medical Knowledge');

      return {
        response: text,
        sources
      };
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Enhanced fallback with treatment-specific information
      let fallbackResponse = "Hi there! 😊 I'm having a little trouble connecting right now, but I'm still here to help! ";
      
      // Try to provide some basic information even if AI fails
      const relevantTreatments = this.findRelevantTreatments(userMessage);
      if (relevantTreatments.length > 0) {
        const treatment = relevantTreatments[0];
        fallbackResponse += `\n\nI can tell you that we offer ${treatment.data.treatmentName}! `;
        if (treatment.data.tagline) {
          fallbackResponse += `${treatment.data.tagline}\n\n`;
        }
      }
      
      fallbackResponse += `For the most detailed information and to book your consultation, I'd recommend giving us a call:\n\n`;
      fallbackResponse += `📞 **416-449-0936** for aesthetic inquiries\n`;
      fallbackResponse += `📞 **416-342-0670** for medical inquiries\n\n`;
      fallbackResponse += `Our team would love to chat with you about your goals and help you find the perfect treatment! ✨`;

      return {
        response: fallbackResponse,
        sources: relevantTreatments.length > 0 ? ['Dr. Daniel Esthetixs Treatment Database'] : []
      };
    }
  }

  // Method to get all available treatments for general queries
  getAllTreatments(): string[] {
    return Object.values(this.treatmentData).map(treatment => treatment.treatmentName).filter(Boolean);
  }

  // Method to check if service is working
  async testConnection(): Promise<boolean> {
    try {
      await this.rateLimit();
      const result = await this.model.generateContent('Hello, please respond with "Connection successful"');
      const response = result.response.text();
      return response.includes('successful') || response.includes('Hello');
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const geminiChatService = new GeminiChatService();

// Test the connection on initialization
geminiChatService.testConnection().then(success => {
  console.log('Gemini API connection test:', success ? 'SUCCESS' : 'FAILED');
});