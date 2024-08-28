import { NextResponse } from "next/server";
import { Pinecone, QueryOptions } from "@pinecone-database/pinecone";
import { ChatGroq } from "@langchain/groq";
import {
  HuggingFaceInferenceEmbeddings,
  HuggingFaceInferenceEmbeddingsParams,
} from "@langchain/community/embeddings/hf";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
  // other params...
});

const systemPrompt = `

**Prompt:**

**Task:**

* **Identify:** The user's query or request related to professors at a specific university.
* **Search:** Retrieve relevant information from a pre-defined knowledge base (e.g., RateMyProfessor database, academic department websites) using RAG.
* **Rank:** Based on the search results, provide the top 3 professors who best match the user's query.
* **Provide:** A concise and informative response that includes the professors' names, departments, and a brief overview of their teaching styles or areas of expertise.

**Example User Query:**
* "Who are the best professors for CS 101 at the University of Alberta?"

**Expected Response:**
* "Based on your query, here are the top 3 professors for CS 101 at the University of Alberta:
    * Professor A: Known for their engaging lectures and clear explanations.
    * Professor B: Renowned for their hands-on approach and helpful office hours.
    * Professor C: Highly rated for their challenging assignments and valuable feedback."

**Additional Considerations:**

* **Contextual Understanding:** Consider the user's location and the specific university they are interested in.
* **Customization:** Allow for customization of the response, such as including additional criteria (e.g., average rating, student satisfaction) or limiting the results to professors with specific teaching styles or research interests.
* **Data Privacy:** Ensure that the response is compliant with data privacy regulations and avoids sharing personally identifiable information.
* **RAG Effectiveness:** Continuously evaluate the effectiveness of the RAG model and refine the knowledge base to improve the accuracy and relevance of the responses.
`;

export async function POST(req: Request) {
  const data = await req.json();
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "",
  });

  const index = pc.Index("rag").namespace("nsl");

  const text = data[data.length - 1].content;

  const hfie_params: HuggingFaceInferenceEmbeddingsParams = {
    apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
  };

  const hfembeddingmodel = new HuggingFaceInferenceEmbeddings(hfie_params);

  const embedding = await hfembeddingmodel.embedQuery(text);

  const index_query_optins: QueryOptions = {
    topK: 3,
    includeMetadata: true,
    vector: embedding,
  };

  const results = index.query(index_query_optins);

  let result_string =
    "\n\nReturned results from vector db (done automatically): ";
  (await results).matches.forEach((match) => {
    result_string += `\n
    Professor:${match.id}
    Review:${match.metadata?.review}
    Subject:${match.metadata?.subject}
    Stars:${match.metadata?.stars}
    \n\n
    `;
  });

  const lastMessage = data[data.length - 1];
  const lastMessageContent = lastMessage.content + result_string;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

  /* const messages: BaseLanguageModelInput = [
    { type: "system", content: systemPrompt },
    ...lastDataWithoutLastMessage,
    { type: "user", content: lastMessageContent },
  ];

  const completion = await llm.stream(messages); */

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      ...lastDataWithoutLastMessage,
      { role: "user", content: lastMessageContent },
    ],
    model: "llama3-8b-8192",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content as string);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
