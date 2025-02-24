require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => console.error(err));

const Book = mongoose.model('Book', new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publishedYear: Number,
    availableCopies: { type: Number, required: true },
    borrowedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}));

app.post('/books', async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/books/:id?', async (req, res) => {
    const book = req.params.id ? await Book.findById(req.params.id) : await Book.find();
    book ? res.json(book) : res.status(404).json({ error: "Not Found" });
});

app.put('/books/:id', async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    book ? res.json(book) : res.status(404).json({ error: "Not Found" });
});

app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    book ? res.json({ message: "Deleted" }) : res.status(404).json({ error: "Not Found" });
});

app.listen(process.env.PORT, () => console.log("http://localhost:4000"));