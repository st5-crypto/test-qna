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

// 초기 주제 데이터
let topics = [
    { id: 'all', name: '전체보기' },
    { id: 1, name: '인공지능과 미래' },
    { id: 2, name: '기후 위기 대응' },
    { id: 3, name: '공동체 의식' }
];
let currentTopicId = 'all';
let dragSrcIndex = null;

// DOM 요소 선택
const feed = document.getElementById('question-feed');
const addBtn = document.getElementById('add-question-btn');
const modal = document.getElementById('modal-container');
const closeModalBtn = document.getElementById('close-modal-btn');
const submitBtn = document.getElementById('submit-question-btn');
const input = document.getElementById('question-input');

// 주제 관련 DOM 요소
const topicList = document.getElementById('topic-list');
const addTopicBtn = document.getElementById('add-topic-btn');
const topicInputContainer = document.getElementById('topic-input-container');
const newTopicInput = document.getElementById('new-topic-input');
const saveTopicBtn = document.getElementById('save-topic-btn');
const cancelTopicBtn = document.getElementById('cancel-topic-btn');

// 질문 카드 렌더링 함수
function renderFeed() {
    feed.innerHTML = '';

    questions.forEach(q => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="user-info">
                <div class="avatar"><i class="fa-solid fa-user-graduate" style="color: #64748b;"></i></div>
                <div>
                    <div class="username">${q.user}</div>
                    <div class="time">${q.time} • ${q.keyword}</div>
                </div>
            </div>
            <div class="content">${q.content}</div>
            <div class="footer">
                <span><i class="fa-regular fa-comment-dots" style="margin-right: 6px;"></i>답변 ${q.replies}개</span>
            </div>
        `;
        feed.appendChild(card);
    });
}

// 모달 열기 함수
function showModal() {
    modal.style.display = 'flex';
    modal.classList.remove('modal-hidden');
    input.focus();
}

// 모달 닫기 함수
function hideModal() {
    modal.style.display = 'none';
    modal.classList.add('modal-hidden');
    input.value = '';
}

// 이벤트 리스너 연결
addBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);

// 모달 바깥 배경 클릭 시 닫기
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
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

    questions.unshift(newQuestion);
    renderFeed();
    hideModal(); // 항상 이 함수를 통해 닫기
});

// 주제 목록 렌더링 함수
function renderTopics() {
    topicList.innerHTML = '';
    topics.forEach((topic, index) => {
        const li = document.createElement('li');
        li.className = currentTopicId === topic.id ? 'active' : '';

        // 드래그 앤 드롭 설정 (전체보기 제외)
        if (topic.id !== 'all') {
            li.draggable = true;

            li.addEventListener('dragstart', (e) => {
                dragSrcIndex = index;
                li.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            li.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (index !== 0) { // 전체보기위로는 못 옮김
                    li.classList.add('drag-over');
                }
            });

            li.addEventListener('dragleave', () => {
                li.classList.remove('drag-over');
            });

            li.addEventListener('drop', (e) => {
                e.preventDefault();
                li.classList.remove('drag-over');
                if (dragSrcIndex !== null && dragSrcIndex !== index && index !== 0) {
                    const draggedIndex = dragSrcIndex;
                    const dropIndex = index;

                    const draggedItem = topics.splice(draggedIndex, 1)[0];
                    topics.splice(dropIndex, 0, draggedItem);
                    renderTopics();
                }
            });

            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
                document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            });
        }

        const nameSpan = document.createElement('span');
        nameSpan.textContent = topic.name;
        li.appendChild(nameSpan);

        if (topic.id !== 'all') {
            const actions = document.createElement('div');
            actions.className = 'topic-actions';

            // 수정 아이콘
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-icon btn-small';
            editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
            editBtn.onclick = (e) => { e.stopPropagation(); editTopic(topic.id); };

            // 삭제 아이콘
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-icon btn-small';
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.onclick = (e) => { e.stopPropagation(); deleteTopic(topic.id); };

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            li.appendChild(actions);
        }

        li.addEventListener('click', () => {
            currentTopicId = topic.id;
            renderTopics();
        });

        topicList.appendChild(li);
    });
}

// 주제 추가 입력창 보여주기
addTopicBtn.addEventListener('click', () => {
    topicInputContainer.classList.remove('topic-input-hidden');
    newTopicInput.focus();
});

// 주제 저장
function saveTopic() {
    const name = newTopicInput.value.trim();
    if (name) {
        const newTopic = {
            id: Date.now(),
            name: name
        };
        topics.push(newTopic);
        renderTopics();
        hideTopicInput();
    }
}

// 입력창 숨기기
function hideTopicInput() {
    topicInputContainer.classList.add('topic-input-hidden');
    newTopicInput.value = '';
}

// 이벤트 리스너 연결
saveTopicBtn.addEventListener('click', saveTopic);
cancelTopicBtn.addEventListener('click', hideTopicInput);
newTopicInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveTopic();
});

// 주제 입력창 포커스 아웃 시 알림 (다른 작업을 하려 할 때)
newTopicInput.addEventListener('blur', (e) => {
    // 체크 버튼이나 취소 버튼을 직접 클릭한 경우는 제외합니다
    if (e.relatedTarget === saveTopicBtn || e.relatedTarget === cancelTopicBtn) return;

    if (!topicInputContainer.classList.contains('topic-input-hidden')) {
        if (confirm('주제 입력을 취소하시겠습니까?')) {
            hideTopicInput();
        } else {
            // 취소하지 않으면 다시 입력칸에 포커스를 줍니다
            setTimeout(() => newTopicInput.focus(), 10);
        }
    }
});

// 주제 수정
function editTopic(id) {
    const topic = topics.find(t => t.id === id);
    if (!topic) return;
    const newName = prompt('수정할 주제 이름을 입력해 주세요:', topic.name);
    if (newName && newName.trim()) {
        topic.name = newName.trim();
        renderTopics();
    }
}

// 주제 삭제
function deleteTopic(id) {
    if (confirm('이 주제를 삭제할까요?')) {
        topics = topics.filter(t => t.id !== id);
        if (currentTopicId === id) currentTopicId = 'all';
        renderTopics();
    }
}

// 위치 이동
function moveTopic(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 1 || targetIndex >= topics.length) return;
    const temp = topics[index];
    topics[index] = topics[targetIndex];
    topics[targetIndex] = temp;
    renderTopics();
}

// 초기 실행
document.addEventListener('DOMContentLoaded', () => {
    renderTopics();
    renderFeed();
    hideModal();
});
