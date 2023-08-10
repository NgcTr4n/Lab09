var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
app.use(express.json()); // Parse JSON requests
app.listen(5555, function () {
    console.log("Server is running ...");
})

// Firebase
const { db } = require('./config');

app.get("/api/sensors", async (req, res) => {
    try {
        const cRef = db.collection('temperature');
        const snapshot = await cRef.get();
        const items = snapshot.docs.map((doc) => (
            {
                id: doc.id,
                ...doc.data()
            }
        ));
        console.log(items);
        res.status(201).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/sensors', async (req, res) => {
    try {
        const { name, temperature, humid, atTime } = req.body;
        const c = db.collection('temperature').doc();
        const item = {
            id: c.id,
            name: name,
            temperature: temperature,
            humid: humid,
            atTime: atTime,
        };
        console.log('add done', item);
        await c.set(item); // Use await for asynchronous operations
        res.status(200).json({
            status: 'success',
            message: 'entry added successfully',
            data: item,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ...

app.delete('/api/sensors/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const cRef = db.collection('temperature').doc(itemId);
        const snapshot = await cRef.get();

        if (!snapshot.exists) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }

        await cRef.delete();
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/sensors/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { name, temperature, humid, atTime } = req.body;
        const cRef = db.collection('temperature').doc(itemId);
        const snapshot = await cRef.get();

        if (!snapshot.exists) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }

        const updatedItem = {
            id: itemId,
            name: name,
            temperature: temperature,
            humid: humid,
            atTime: atTime,
        };

        await cRef.update(updatedItem);
        res.status(200).json({
            status: 'success',
            message: 'Item updated successfully',
            data: updatedItem,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ...
