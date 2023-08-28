// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import run from '../../scripts/ingest-data';
import multer from 'multer';
import fs from 'fs';
import { promisify } from 'util';
const upload = multer({ storage: multer.memoryStorage() });
const writeFile = promisify(fs.writeFile);

export const config = {
    api: {
        bodyParser: false, // Disabling Next.js's body parser as multer will handle it
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Use multer to parse the form data
    upload.single('file')(req, res, async (err) => {
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
}