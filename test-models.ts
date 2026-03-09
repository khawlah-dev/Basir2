import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function main() {
    const apiKey = process.env.GEMINI_API_KEY?.split(',')[0];
    if (!apiKey) throw new Error("No API key");
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(JSON.stringify(data.models.map((m: any) => m.name), null, 2));
    } catch (e) {
        console.error(e);
    }
}

main();
