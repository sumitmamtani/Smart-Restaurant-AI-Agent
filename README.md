A simple Node.js backend server that runs an LLM-powered API.
Create a .env file in the root directory.
GOOGLE_API_KEY=your_api_key_here


Run the Server: node server.js

You should see: Server is running on port http://localhost:3000

Open your browser and go to:  http://localhost:3000

Tech Stack: Node.js, Express, LLM Agent Executor using LangChain

Requires Node.js v20+

command to install dependencies: npm install langchain @langchain/community @langchain/google-genai @langchain/core express --legacy-peer-deps
