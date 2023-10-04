const express = require('express');
const issues = require('./routes/issues');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/issues', issues);


app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port ' + (process.env.PORT || 4000) + '...');
});
