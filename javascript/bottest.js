// node --version # Should be >= 18
// npm install @google/generative-ai

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = "AIzaSyCS4zuzxJf9IuBf_wIa4jl5vtsXzv80Elw";

async function runChat() {
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

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  // Read values from the form
  const q1 = document.getElementById("q1").value;
  const q2 = document.getElementById("q2").value;
  const q3 = document.getElementById("q3").value;
  const q4 = document.getElementById("q4").value;
  const q5 = document.getElementById("q5").value;
  const q6 = document.getElementById("q6").value;
  const q7 = document.getElementById("q7").value;
  const q8 = document.getElementById("q8").value;

  // Construct the prompt
  const prompt =
    "Here are the answers to some questions: " +
    "Q1: In general, how would you rate your health? (Excellent, Good, Fair, Poor). The answer is: " +
    q1 +
    " Q2: Do you get enough sleep most nights (at least 7 hours)? The answer is: " +
    q2 +
    " Q3: Have you noticed any recent changes in your weight (unexpected gain or loss)? The answer is: " +
    q3 +
    " Q4: Are you able to complete your daily activities without excessive fatigue? The answer is: " +
    q4 +
    " Q5: Do you experience any frequent pain or discomfort? The answer is: " +
    q5 +
    " Q6: Do you have a healthy appetite and eat regular meals? The answer is: " +
    q6 +
    " Q7: Have you been feeling more stressed or anxious lately? The answer is: " +
    q7 +
    " Q8: Do you generally feel energized and ready to take on the day? The answer is: " +
    q8 +
    ". Now please give me a rough health analysis based on this info. Only 2 to 3 lines.";

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  console.log(response.text());
  document.getElementById("response").innerText = response;
  
}

runChat();