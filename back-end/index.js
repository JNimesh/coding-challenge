const express = require('express');
const issues = require('./routes/issues');

const app = express();

app.use(express.json());

app.use('/api/issues', issues);


app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port ' + (process.env.PORT || 4000) + '...');
});
