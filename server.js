const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const dataFilePath = 'grades.json';

// Load grades from JSON file
function loadGrades() {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

// Save grades to JSON file
function saveGrades(grades) {
    fs.writeFileSync(dataFilePath, JSON.stringify(grades, null, 2));
}

// API endpoints
app.get('/grades', (req, res) => {
    const grades = loadGrades();
    res.json(grades);
});

app.post('/grades', (req, res) => {
    const grades = loadGrades();
    grades.push(req.body);
    saveGrades(grades);
    res.status(201).send('Grade added.');
});

app.put('/grades/:code', (req, res) => {
    const grades = loadGrades();
    const index = grades.findIndex(g => g.code === req.params.code);
    if (index !== -1) {
        grades[index] = req.body;
        saveGrades(grades);
        res.send('Grade updated.');
    } else {
        res.status(404).send('Grade not found.');
    }
});

app.delete('/grades/:code', (req, res) => {
    const grades = loadGrades();
    const index = grades.findIndex(g => g.code === req.params.code);
    if (index !== -1) {
        grades.splice(index, 1);
        saveGrades(grades);
        res.send('Grade deleted.');
    } else {
        res.status(404).send('Grade not found.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
