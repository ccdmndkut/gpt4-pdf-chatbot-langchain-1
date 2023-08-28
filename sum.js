import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";

// In this example, we use a `MapReduceDocumentsChain` specifically prompted to summarize a set of documents.
const text = fs.readFileSync(`README.md`, "utf8");
const model = new OpenAI({ temperature: 0 });
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 300,  overlapSize: 10 });
const docs = await textSplitter.createDocuments([text]);

// This convenience function creates a document chain prompted to summarize a set of documents.
const chain = loadSummarizationChain(model, { type: "map_reduce" });
const res = await chain.call({
  input_documents: docs,
});
console.log({ res });

// import { OpenAI } from "langchain/llms/openai";
// import { loadSummarizationChain, AnalyzeDocumentChain } from "langchain/chains";
// import * as fs from "fs";

// // In this example, we use the `AnalyzeDocumentChain` to summarize a large text document.
// const text = fs.readFileSync(`+19379310117.txt`, "utf8");
// const model = new OpenAI({ temperature: 0, model:"gpt-4", max_tokens: 3000 });
// const combineDocsChain = loadSummarizationChain(model);
// const chain = new AnalyzeDocumentChain({
//   combineDocumentsChain: combineDocsChain,
// });
// const res = await chain.call({
//   input_document: text,
// });
// console.log({ res });
