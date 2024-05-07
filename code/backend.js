const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const port = 3000; // Or your desired port

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = "AIzaSyCS4zuzxJf9IuBf_wIa4jl5vtsXzv80Elw"; // Replace with your actual API key

app.use(express.static(__dirname));
app.use(express.json()); // Enable JSON body parsing
app.use(express.static(__dirname));
app.use(express.static(__dirname, {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));
app.post('/api/health-assessment', async (req, res) => {
  const { q1, q2, q3, q4, q5, q6, q7, q8 } = req.body;

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({ generationConfig, safetySettings, history: [] });

  const prompt = `Here are the answers to some questions:
  Q1: In general, how would you rate your health? (Excellent, Good, Fair, Poor). The answer is: ${q1}
  Q2: Do you get enough sleep most nights (at least 7 hours)? The answer is: ${q2}
  Q3: Have you noticed any recent changes in your weight (unexpected gain or loss)? The answer is: ${q3}
  Q4: How would you rate your diet? (Excellent, Good, Fair, Poor). The answer is: ${q4}
  Q5: How often do you exercise per week? The answer is: ${q5}
  Q6: Do you smoke or consume alcohol regularly? The answer is: ${q6}
  Q7: Do you experience high levels of stress frequently? The answer is: ${q7}
  Q8: How often do you go for medical check-ups? The answer is: ${q8}
  . Now please give me a rough health analysis based on this info. Only 2 to 3 lines in a single paragraph`;

  try {
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();
    res.json({ healthAnalysis: responseText });
  } catch (error) {
    console.error('Error generating health analysis:', error);
    res.status(500).json({ error: 'An error occurred during processing' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
