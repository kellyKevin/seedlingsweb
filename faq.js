function toggleAnswer(id) {
    const answer = document.getElementById(id);
    answer.classList.toggle('active');
}

function searchFAQ() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const questions = document.querySelectorAll('.question');

    questions.forEach(question => {
        const questionText = question.textContent.toLowerCase();
        const answer = question.nextElementSibling;
        if (questionText.includes(input)) {
            question.style.display = 'block';
            answer.style.display = 'block';
        } else {
            question.style.display = 'none';
            answer.style.display = 'none';
        }
    });
}