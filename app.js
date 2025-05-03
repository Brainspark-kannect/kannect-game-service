require('dotenv').config();
require('./models/db');
const express = require('express');
const app = express();
const gameRoutes = require('./routes/gameRoutes');

app.use(express.json());
app.use('/api/games', gameRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));