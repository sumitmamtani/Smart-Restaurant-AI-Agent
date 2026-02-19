import express from "express";
import dotenv from "dotenv";
import { createAgent } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool } from "@langchain/core/tools";

import {z} from "zod";
import path from "path";

dotenv.config()

const port = 3000;
const app = express();
app.use(express.json());

const __dirname = path.resolve();
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});

const getMenuTool = new DynamicStructuredTool({
  name: "getMenuTool",
  description: "Returns the final answer for today's menu for the given category (breakfast, lunch, or dinner). Use this tool to answer the user's menu question directly.",
  schema: z.object({
    category: z.string().describe("Type of food. Example: breakfast, lunch, dinner"),
  }),
  func: async ({ category }) => {
    const menus = {
      breakfast: "Aloo Paratha, Poha, Masala Chai",
      lunch: "Paneer Butter Masala, Dal Fry, Jeera Rice, Roti",
      dinner: "Veg Biryani, Raita, Salad, Gulab Jamun",
    };

    return menus[category.toLowerCase()] || "No menu found for that category.";
  },
});

const agent = createAgent({
  model,
  tools: [getMenuTool],
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post("/api/chat", async (req, res) => {
  const userInput = req.body.input;
  console.log("userInput : ", userInput);

  try {

    const result = await agent.invoke({
      messages: [
        { role: "user", content: userInput },
      ],
    });
    console.log(result.messages.at(-1).content);

    if (result.messages.at(-1).content) {
      return res.json({ output: result.messages.at(-1).content });
    }

    res.status(500).json({ output: "Agent couldn't find a valid answer." });
  } catch (err) {
    console.log("Error during agent execution: ", err);
    res
      .status(500)
      .json({ output: "Sorry, something went wrong. Please try again." });
  }
});

app.listen(port, ()=>{
    console.log(`server is running on port http://localhost:${port}`);
})
