import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/', async (req, res) => {
    const { question, history, namespace } = req.body;

    console.log('question', question);
    console.log('history', history);

    //only accept post requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    if (!question) {
        return res.status(400).json({ message: 'No question in the request' });
    }
    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

    try {
        const index = pinecone.Index(PINECONE_INDEX_NAME);

        /* create vectorstore*/
        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({}),
            {
                pineconeIndex: index,
                textKey: 'text',
                namespace: namespace, //namespace comes from your config folder
            },
        );

        //create chain
        const chain = makeChain(vectorStore);

        const pastMessages = history.map((message, i) => {
            if (i % 2 === 0) {
                return new HumanMessage(message);
            } else {
                return new AIMessage(message);
            }
        });

        //Ask a question using chat history
        const response = await chain.call({
            question: sanitizedQuestion,
            chat_history: pastMessages
        });

        console.log('response', response);
        res.status(200).json(response);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }


});

export default app;