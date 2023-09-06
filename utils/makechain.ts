import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { BufferMemory } from 'langchain/memory';

import { ConversationalRetrievalQAChain } from 'langchain/chains';

const CONDENSE_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_TEMPLATE = `You are a knowledgeable AI assistant. Utilizing any relevant context provided in the query along with your extensive database, please answer the question at the end of the prompt in an in-depth manner. If you don't know the answer, clearly state so and refrain from fabricating information. If the question isn't directly related to the provided context, answer based on your general knowledge, while politely noting that your expertise is most effective when the query is aligned with the given context. Conclude your response by suggesting at least three related follow-up questions that deepen the exploration of the topic.

{context}

Question: {question}

Response Format=
In-depth answer in Markdown format:
Suggested Follow Up Question:
`;

export const makeChain = (vectorstore: PineconeStore) => {
  const model = new ChatOpenAI({
    temperature: 0.8, // increase temepreature to get more creative answers
    modelName: 'gpt-4', //change this to gpt-4 if you have access
    // maxTokens: 13000,
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_TEMPLATE,
      questionGeneratorTemplate: CONDENSE_TEMPLATE,
      returnSourceDocuments: true,
      //The number of source documents returned is 4 by default
    },
  );
  return chain;
};
