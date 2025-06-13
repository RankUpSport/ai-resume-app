// ✅ Firebase SDK 불러오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// ✅ Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCsScMukPgubKCX-iUjp-i-LuvNQHH_u1s",
  authDomain: "resumeai-web.firebaseapp.com",
  projectId: "resumeai-web",
  storageBucket: "resumeai-web.appspot.com",
  messagingSenderId: "200328517569",
  appId: "1:200328517569:web:1d969f4d35786b71444140",
  measurementId: "G-J6Y01BBT9Y"
};

// ✅ Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ 자소서 저장 함수
async function saveResumeToFirestore(job, strengths, result) {
  console.log("📥 Firestore 저장 함수 실행됨");
  try {
    const docRef = await addDoc(collection(db, "resumes"), {
      job,
      strengths,
      result,
      createdAt: new Date().toISOString() // UTC 표준시간 문자열로 저장
    });
    console.log("✅ Firebase 저장 완료: 문서 ID →", docRef.id);
  } catch (e) {
    console.error("❌ 저장 오류:", e.message || e);
  }
}

// ✅ 자소서 생성 함수
window.generate = async function () {
  const job = document.getElementById("job").value;
  const strengths = document.getElementById("strengths").value;

  console.log("🎯 generate() 시작", { job, strengths });
  document.getElementById("result").innerText = "생성 중... 잠시만 기다려주세요.";

  try {
    const response = await fetch("https://ai-resume-backend-tj6g.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job, strengths })
    });

    const data = await response.json();
    const result = data.result || "자소서 생성에 실패했습니다.";
    document.getElementById("result").innerText = result;

    console.log("🎯 Firebase 저장 시작");
    await saveResumeToFirestore(job, strengths, result);
  } catch (error) {
    console.error("❌ 자소서 생성 오류:", error);
    document.getElementById("result").innerText = "오류 발생: " + (error.message || error);
  }
};

// ✅ PDF 저장 함수
window.downloadPDF = async function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const content = document.getElementById("result").innerText;

  if (!content.trim()) {
    alert("먼저 자소서를 생성해주세요.");
    return;
  }

  doc.addFileToVFS("NanumGothic-Regular-normal.ttf", NanumGothic_Regular);
  doc.addFont("NanumGothic-Regular-normal.ttf", "NanumGothic", "normal");
  doc.setFont("NanumGothic");

  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 15, 20);

  doc.save("자소서.pdf");
};

