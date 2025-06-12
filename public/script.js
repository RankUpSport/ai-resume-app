async function generate() {
  const job = document.getElementById("job").value;
  const strengths = document.getElementById("strengths").value;

  document.getElementById("result").innerText = "생성 중... 잠시만 기다려주세요.";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job, strengths })
    });

    const data = await response.json();
    document.getElementById("result").innerText = data.result || "자소서 생성에 실패했습니다.";
  } catch (error) {
    document.getElementById("result").innerText = "오류 발생: " + error.message;
  }
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const content = document.getElementById("result").innerText;

  if (!content.trim()) {
    alert("먼저 자소서를 생성해주세요.");
    return;
  }

    // 한글 폰트 등록
  doc.addFileToVFS("NanumGothic-Regular-normal.ttf", NanumGothic_Regular);
  doc.addFont("NanumGothic-Regular-normal.ttf", "NanumGothic", "normal");
  doc.setFont("NanumGothic");

  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 15, 20);

  doc.save("자소서.pdf");
}

