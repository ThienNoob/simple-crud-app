const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // URL frontend của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

const pool = new Pool({
    user: 'go_user',
    host: 'localhost',
    database: 'go_crud',
    password: 'go_user',
    port: 5432,
});

app.post('/items', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const result = await pool.query(
            'INSERT INTO items (name, description, price) VALUES ($1, $2, $3) RETURNING id',
            [name, description, price]
        );
        const id = result.rows[0].id;
        res.status(201).json({ id, name, description, price });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, description, price FROM items');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT id, name, description, price FROM items WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        await pool.query(
            'UPDATE items SET name = $1, description = $2, price = $3 WHERE id = $4',
            [name, description, price, id]
        );
        res.sendStatus(204);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM items WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 8001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
