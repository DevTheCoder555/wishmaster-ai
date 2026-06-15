import { NextResponse } from 'next/server';

// 100% FREE LOCAL AI SIMULATOR
// No OpenAI API key required! This simulates AI generation locally based on keywords.
// In production, you can easily swap this for Hugging Face Inference API (free tier) or Ollama (local).
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    // Simulate network delay for realistic AI feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerPrompt = prompt.toLowerCase();
    
    // Smart keyword-based mock generation
    if (lowerPrompt.includes('laptop') || lowerPrompt.includes('computer') || lowerPrompt.includes('gaming')) {
      return NextResponse.json({
        title: "High-Performance Gaming Laptop",
        description: "A powerful gaming laptop suitable for modern AAA games, video editing, and software development. Looking for something with at least an RTX 4060, 16GB RAM, and 1TB SSD.",
        category: "Technology",
        budget: 1500,
        products: [
          { name: "ASUS ROG Strix G16", price: 1499, url: "https://amazon.com/dp/example1", commission: "4.0%" },
          { name: "Lenovo Legion Pro 5", price: 1549, url: "https://amazon.com/dp/example2", commission: "3.5%" }
        ]
      });
    } else if (lowerPrompt.includes('camera') || lowerPrompt.includes('photo')) {
      return NextResponse.json({
        title: "Professional Mirrorless Camera",
        description: "Looking for a reliable mirrorless camera for freelance photography work. Needs good low-light performance and 4K video capabilities.",
        category: "Creative",
        budget: 2500,
        products: [
          { name: "Sony Alpha a7 IV", price: 2498, url: "https://amazon.com/dp/example3", commission: "3.0%" },
          { name: "Canon EOS R6 Mark II", price: 2499, url: "https://amazon.com/dp/example4", commission: "2.5%" }
        ]
      });
    } else {
      // Generic fallback
      return NextResponse.json({
        title: "Custom Wish: " + prompt.substring(0, 40) + (prompt.length > 40 ? "..." : ""),
        description: "AI-generated description based on your request: " + prompt + ". This wish has been structured to help the community understand exactly what you need.",
        category: "General",
        budget: 500,
        products: [
          { name: "Generic Product Option 1", price: 250, url: "#", commission: "5.0%" },
          { name: "Generic Product Option 2", price: 250, url: "#", commission: "5.0%" }
        ]
      });
    }
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate wish' }, { status: 500 });
  }
}