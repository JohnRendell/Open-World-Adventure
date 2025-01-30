const express = require('express');
const router = express.Router();
const path = require('path');
const sanitizeHtml = require('sanitize-html');

require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

router.post('/', (req, res)=>{
    try{
        const {
            GoogleGenerativeAI,
            HarmCategory,
            HarmBlockThreshold,
        } = require("@google/generative-ai");

        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            systemInstruction: req.body.instruction,
        });

        const generationConfig = {
            temperature: 2,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };

        async function run() {
        const chatSession = model.startChat({
            generationConfig,
            history: [
            ],
        });

            try{
                const result = await chatSession.sendMessage(sanitizeHtml(req.body.prompt));
                const generateResult = await model.generateContent(sanitizeHtml(req.body.prompt));
                console.log(generateResult.response.usageMetadata);
                res.status(200).json({ message: 'success', output: result.response.text() });
            }
            catch(err){
                console.log(err);
                res.status(200).json({ message: 'success', output: 'Service is unavailable :(' });
            }
        }

        run();

    }
    catch(err){
        res.status(200).json({ message: 'failed' });
    }
});

module.exports = router;