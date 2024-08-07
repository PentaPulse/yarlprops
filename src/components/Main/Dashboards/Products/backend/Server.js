const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product_management"
});

db.connect(err => {
    if (err) {
        console.error('Database Connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Routes
app.get('/api/products', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    db.query('SELECT * FROM products LIMIT ? OFFSET ?', [parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result[0]);
    });
});

app.post('/api/products', upload.single('image'), (req, res) => {
    const { title, category, type, description } = req.body;
    const image = req.file ? req.file.filename : null;

    db.query('INSERT INTO products (title, category, type, description, image) VALUES (?, ?, ?, ?, ?)', [title, category, type, description, image], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ id: results.insertId, title, category, type, description, image });
    });
});

app.put('/api/products/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, category, type, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const updateQuery = image
        ? 'UPDATE products SET title = ?, category = ?, type = ?, description = ?, image = ? WHERE id = ?'
        : 'UPDATE products SET title = ?, category = ?, type = ?, description = ? WHERE id = ?';

    const updateParams = image ? [title, category, type, description, image, id] : [title, category, type, description, id];

    db.query(updateQuery, updateParams, (err, results) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ id, title, category, type, description, image });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(204).end();
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// const express = require("express");
// const cors = require("cors");
// const mysql = require("mysql");


// const app = express();

// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "product_management"
// })

// app.get("/products", (req, res) => {
//     const sql = "SELECT * FROM products";
//     db.query(sql, (err, data) => {
//         if (err) return res.json("Error");
//         return res.json(data);
//     })
// })

// app.post('/products/edit', (req, res) => {
//     const sql ="INSERT INTO products (title, category, type, description, image) VALUES (?, ?, ?, ?, ?)";
//     const values = [
//         req.body.title,
//         req.body.category,
//         req.body.type,
//         req.body.description,
//         req.body.image
//     ]
//     db.query(sql, [values], (err, data) => {
//         if(err) return res.json("Error");
//         return res.json(data);
//     })
// })

// app.put('/products/edit/:id', (req, res) => {
//     const sql ='UPDATE products SET title = ?, category = ?, type = ?, description = ?, image = ? WHERE id = ?';
//     const values = [
//         req.body.title,
//         req.body.category,
//         req.body.type,
//         req.body.description,
//         req.body.image
//     ]
//     const id = req.params.id;

//     db.query(sql, [...values, id], (err, data) => {
//         if(err) return res.json("Error");
//         return res.json(data);
//     })
// })

// app.delete('/products/:id', (req, res) => {
//     const sql ="DELETE FROM products WHERE id = ?";
//     const id = req.params.id;

//     db.query(sql, [id], (err, data) => {
//         if(err) return res.json("Error");
//         return res.json(data);
//     })
// })

// app.listen(4000, () => {
//     console.log("listening");
// })