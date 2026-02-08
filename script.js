// 초기 더미 데이터 (학생들의 질문)
let questions = [
    {
        id: 1,
        user: "이하늘",
        time: "10분 전",
        content: "수학 익힘책 45쪽 3번 문제 풀이 과정이 이해가 안 가요. 누군가 도와줄 수 있나요?",
        keyword: "수학",
        replies: 2
    },
    {
        id: 2,
        user: "박지민",
        time: "30분 전",
        content: "세종대왕님이 훈민정음을 만든 가장 큰 이유가 무엇이었을까요? 교과서 내용 외에 더 궁금해요!",
        keyword: "국어",
        replies: 5
    }
];

// DOM 요소 선택
const feed = document.getElementById('question-feed');
const addBtn = document.getElementById('add-question-btn');
const modal = document.getElementById('modal-container');
const closeModalBtn = document.getElementById('close-modal-btn');
const submitBtn = document.getElementById('submit-question-btn');
const input = document.getElementById('question-input');

// 질문 카드 렌더링 함수
function renderFeed() {
    feed.innerHTML = '';
    
    questions.forEach(q => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="user-info">
                <div class="avatar">👤</div>
                <div>
                    <div class="username">${q.user}</div>
                    <div class="time">${q.time} • ${q.keyword}</div>
                </div>
            </div>
            <div class="content">${q.content}</div>
            <div class="footer">
                <span>💬 답변 ${q.replies}개</span>
            </div>
        `;
        feed.appendChild(card);
    });
}

// 모달 열기/닫기
addBtn.addEventListener('click', () => {
    modal.classList.remove('modal-hidden');
    input.focus();
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.add('modal-hidden');
    input.value = '';
});

// 질문 등록 기능
submitBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) {
        alert('질문 내용을 입력해 주세요!');
        return;
    }

    const newQuestion = {
        id: Date.now(),
        user: "선생님 (테스트)",
        time: "방금 전",
        content: text,
        keyword: "기타",
        replies: 0
    };

    questions.unshift(newQuestion); // 맨 앞에 추가
    renderFeed();
    
    // 모달 닫기 및 초기화
    modal.classList.add('modal-hidden');
    input.value = '';
});

// 초기 실행
document.addEventListener('DOMContentLoaded', () => {
    renderFeed();
    // 모달 초기 상태 숨김 (CSS에서 이미 처리했지만 확실히 하기 위해)
    modal.classList.add('modal-hidden');
});
