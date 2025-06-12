const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { job, strengths } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `지원 직무는 ${job}이고, 강점은 ${strengths}야. 이에 맞는 자소서를 A4 반 페이지 분량으로 작성해줘.`,
      }],
    });

    const result = chatCompletion.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error("GPT 호출 에러:", error.message);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});

app.listen(port, () => {
  console.log(`서버가 실행되었습니다 👉 http://localhost:${port}`);
});

