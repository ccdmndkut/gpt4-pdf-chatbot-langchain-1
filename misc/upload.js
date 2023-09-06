import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { promisify } from 'util';
import run from './ingest.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const writeFile = promisify(fs.writeFile);

app.post('/', upload.single('file'), async (req, res) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    const file = req.file;
    console.log('file', file);
    // Write the uploaded file to disk
    await writeFile(`docs/${file.originalname}`, file.buffer);        // req.file will hold the uploaded file
    // req.body will hold the text fields, if there were any (in this case, the namespace)
    const namespace = req.body.namespace;

    try {
        await run(namespace); // Call the ingest-data script with the namespace
        res.status(200).json({ message: 'Data ingestion complete' });
    } catch (error) {
        res.status(500).json({ error: 'Data ingestion failed' });
    } finally {
        console.log('deleting file');
        fs.rmSync(`docs/${file.originalname}`); // Delete the file from disk
    }
});
app.listen(3000, () => console.log('Listening on port 3000'));
export default app;