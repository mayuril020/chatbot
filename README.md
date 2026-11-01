# Verdant & Co. — AI Support Agent Integration

An end-to-end customer support automation platform built for Verdant & Co. It ingests incoming customer webhooks, stores data in a remote Supabase instance, generates live AI policy drafts via the Groq API (with a local regex rule fallback), and provides a dual-view interface for Customers and Support Agents.

1. Local Setup Instructions

   Clone the repository and install dependencies:
   bash

   git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git)
   cd chatbot
   npm install

2. Configure Environment Variables:
   Copy .env.example to .env.local in the project root:

   Bash

   cp .env.example .env.local

   Ensure your .env.local contains the following keys:
   Code snippet
   NEXT_PUBLIC_SUPABASE_URL=[https://nrgoqtcmulnwgcbxcyet.supabase.co](https://nrgoqtcmulnwgcbxcyet.supabase.co)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   WEBHOOK_SECRET=verdant-demo-secret-2026
   GROQ_API_KEY=your_groq_api_key_here

3. Run the Development Server:
   npm run dev

4. Access the Application:
   Open http://localhost:3000 in your browser.

5. Technical Decisions & Time-Limit Trade-Offs
   
   Next.js App Router & Serverless Routes: Used Next.js API endpoints (/api/webhook, /api/conversations, /api/messages) for serverless message handling, enabling rapid local development and seamless deployment on Vercel.

   Relational Supabase Persistence: Structured database tables (customers, conversations, messages) using UUID primary/foreign keys to guarantee schema integrity and historical chat tracking.

   esilient AI Draft Engine: Integrated Groq API (llama-3.3-70b-versatile) for ultra-fast response drafting based on Verdant & 
   Co.'s knowledge base. Implemented a synchronous local policy-matching engine as a fallback to guarantee system uptime even if LLM rate limits or network failures occur.

   Omissions due to Time Limit: Omitted vector database embeddings (RAG), and advanced message pagination.

6. AI Tool Collaboration
   
   Where AI Helped: Accelerated boilerplate generation for Next.js App Router API endpoints, structured the sequential relational upsert logic for Supabase, and assisted in building the responsive split UI layout.

   Where AI Got Something Wrong: Generated character order mismatches (bcx vs cbx) in hardcoded Supabase project reference strings, which caused temporary DNS ENOTFOUND lookup errors until manually matched against the dashboard URL.

7. Two short questions
 
   1. A customer message arrives at 2 a.m. and something in your system fails. What does the agent 
      see the next morning, and how would you find out what went wrong?

      Answer:
      The agent will see the incoming customer message displayed in the Agent View queue, but with the AI response field either marked as "Draft Generation Failed" or auto-populated with a safety fallback response. To diagnose the failure, I would check Vercel deployment logs for runtime execution errors, inspect Supabase database logs for failed messages table inserts, and check API error monitoring for Groq LLM rate-limit or timeout events.
   
   2. This now has to serve 20 brands, each with its own knowledge base and agents. What would 
      you change first, and why?

      Answer:
      I would first update the database schema to make it multi-tenant by adding a mandatory brand_id column across conversations, customers, and knowledge_base tables. This ensures query-level data isolation for agent views and allows the AI draft engine to dynamically select system prompts and policy rules specific to the incoming message's brand_id.



