const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("open-modal");
const closeModalBtn = document.getElementById("close-modal");
let isDragging = false;
let modalOffsetX;
let modalOffsetY;

// 모달창 열기
openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // 스크롤바 제거
});

// 모달창 닫기
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // 스크롤바 보이기
});


// 모달창 드래그 시작
modal.addEventListener("mousedown", (event) => {
  isDragging = true;
  modalOffsetX = event.offsetX;
  modalOffsetY = event.offsetY;
});

// 모달창 드래그 중
modal.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const x = event.clientX - modalOffsetX;
    const y = event.clientY - modalOffsetY;
    modal.style.left = `${x}px`;
    modal.style.top = `${y}px`;
  }
});

// 모달창 드래그 종료
modal.addEventListener("mouseup", () => {
  isDragging = false;
});