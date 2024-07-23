import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/items');
            setItems(response.data);
        } catch (error) {
            console.error("There was an error fetching the items!", error);
        }
    };

    const addItem = async () => {
        try {
            const newItem = { name, description, price: parseFloat(price) };
            const response = await axios.post('http://localhost:8000/items', newItem);
            setItems([...items, response.data]);
            setName('');
            setDescription('');
            setPrice('');
        } catch (error) {
            console.error("There was an error adding the item!", error);
        }
    };

    const updateItem = async () => {
        try {
            const updatedItem = { ...editItem, name, description, price: parseFloat(price) };
            await axios.put(`http://localhost:8000/items/${editItem.id}`, updatedItem);
            setItems(items.map(item => (item.id === editItem.id ? updatedItem : item)));
            setEditItem(null);
            setName('');
            setDescription('');
            setPrice('');
        } catch (error) {
            console.error("There was an error updating the item!", error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/items/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error("There was an error deleting the item!", error);
        }
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price.toString());
    };

    return (
        <div className="App">
            <h1>CRUD App with Go and PostgreSQL</h1>
            <div className="form">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                {editItem ? (
                    <button onClick={updateItem}>Update Item</button>
                ) : (
                    <button onClick={addItem}>Add Item</button>
                )}
            </div>
            <div className="items-list">
                {items.map(item => (
                    <div key={item.id} className="item">
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                        <p>{item.price}</p>
                        <button onClick={() => handleEdit(item)}>Edit</button>
                        <button onClick={() => deleteItem(item.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;

