let grades = [];
let editIndex = -1;

// Function to show login form
function showLogin() {
    document.getElementById('studentView').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Function to log in and show the dashboard
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'youssef sakr' && password === '309310') {
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
        fetchGrades(); // Fetch and render grades table on dashboard
    } else {
        document.getElementById('loginErrorMessage').textContent = 'Invalid username or password!';
    }
}

// Function to fetch grades from the server
function fetchGrades() {
    fetch('http://localhost:3000/grades')
        .then(response => response.json())
        .then(data => {
            grades = data;
            renderTable();
        });
}

// Function to view grades for a specific student
function viewGrade() {
    const studentCode = document.getElementById("studentCode").value.trim();
    const errorMessage = document.getElementById("errorMessage");
    const gradesTable = document.getElementById("gradesTable");
    const tableBody = document.querySelector('#gradesTable tbody');

    errorMessage.textContent = '';

    const student = grades.find(g => g.code.toString() === studentCode);

    if (student) {
        gradesTable.style.display = 'table';
        tableBody.innerHTML = `
            <tr>
                <td>${student.name}</td>
                <td>${student.code}</td>
                <td>${formatScore(student.homework, student.totalHomework)}</td>
                <td>${formatScore(student.classwork, student.totalClasswork)}</td>
                <td>${formatScore(student.exam, student.totalExam)}</td>
                <td>${student.absent ? 'Absent' : 'Present'}</td>
            </tr>
        `;
    } else {
        gradesTable.style.display = 'none';
        errorMessage.textContent = 'No grade found for the provided student code.';
    }
}

// Function to format the score
function formatScore(score, total) {
    if (score === "Not Done" || total === "Not Done") {
        return "Not Done";
    }
    return `${score}/${total}`;
}

// Function to add a grade
function addGrade() {
    const gradeData = {
        name: document.getElementById('studentName').value,
        code: document.getElementById('studentCodeInput').value,
        homework: document.getElementById('homeworkScore').value || "Not Done",
        totalHomework: document.getElementById('totalHomeworkScore').value || "Not Done",
        classwork: document.getElementById('classworkScore').value || "Not Done",
        totalClasswork: document.getElementById('totalClassworkScore').value || "Not Done",
        exam: document.getElementById('examScore').value || "Not Done",
        totalExam: document.getElementById('totalExamScore').value || "Not Done",
        absent: document.getElementById('absentCheckbox').checked
    };

    fetch('http://localhost:3000/grades', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradeData),
    })
    .then(() => {
        fetchGrades(); // Refresh the grades table
        clearInputs();
    });
}

// Function to edit grade
function editGrade(index) {
    const grade = grades[index];
    document.getElementById('studentName').value = grade.name;
    document.getElementById('studentCodeInput').value = grade.code;
    document.getElementById('homeworkScore').value = grade.homework !== "Not Done" ? grade.homework : '';
    document.getElementById('totalHomeworkScore').value = grade.totalHomework !== "Not Done" ? grade.totalHomework : '';
    document.getElementById('classworkScore').value = grade.classwork !== "Not Done" ? grade.classwork : '';
    document.getElementById('totalClassworkScore').value = grade.totalClasswork !== "Not Done" ? grade.totalClasswork : '';
    document.getElementById('examScore').value = grade.exam !== "Not Done" ? grade.exam : '';
    document.getElementById('totalExamScore').value = grade.totalExam !== "Not Done" ? grade.totalExam : '';
    document.getElementById('absentCheckbox').checked = grade.absent;

    editIndex = index;
    document.getElementById('updateButton').style.display = 'inline';
    document.getElementById('addButton').style.display = 'none';
}

// Function to update grade
function updateGrade() {
    const gradeData = {
        name: document.getElementById('studentName').value,
        code: document.getElementById('studentCodeInput').value,
        homework: document.getElementById('homeworkScore').value || "Not Done",
        totalHomework: document.getElementById('totalHomeworkScore').value || "Not Done",
        classwork: document.getElementById('classworkScore').value || "Not Done",
        totalClasswork: document.getElementById('totalClassworkScore').value || "Not Done",
        exam: document.getElementById('examScore').value || "Not Done",
        totalExam: document.getElementById('totalExamScore').value || "Not Done",
        absent: document.getElementById('absentCheckbox').checked
    };

    fetch(`http://localhost:3000/grades/${gradeData.code}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradeData),
    })
    .then(() => {
        fetchGrades(); // Refresh the grades table
        clearInputs();
    });
}

// Function to delete grade
function deleteGrade(index) {
    const code = grades[index].code;
    fetch(`http://localhost:3000/grades/${code}`, {
        method: 'DELETE',
    })
    .then(() => {
        fetchGrades(); // Refresh the grades table
    });
}

// Function to render the grades table
function renderTable() {
    const tableBody = document.querySelector('#gradesTableDashboard tbody');
    tableBody.innerHTML = '';

    grades.forEach((grade, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${grade.name}</td>
            <td>${grade.code}</td>
            <td>${grade.homework}</td>
            <td>${grade.totalHomework}</td>
            <td>${grade.classwork}</td>
            <td>${grade.totalClasswork}</td>
            <td>${grade.exam}</td>
            <td>${grade.totalExam}</td>
            <td>${grade.absent ? 'Absent' : 'Present'}</td>
            <td>
                <button onclick="editGrade(${index})">Edit</button>
                <button onclick="deleteGrade(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to clear inputs
function clearInputs() {
    document.getElementById('studentName').value = '';
    document.getElementById('studentCodeInput').value = '';
    document.getElementById('homeworkScore').value = '';
    document.getElementById('totalHomeworkScore').value = '';
    document.getElementById('classworkScore').value = '';
    document.getElementById('totalClassworkScore').value = '';
    document.getElementById('examScore').value = '';
    document.getElementById('totalExamScore').value = '';
    document.getElementById('absentCheckbox').checked = false;
    editIndex = -1;
}

// Initial load
window.onload = function() {
    fetchGrades(); // Load grades on page load
};
