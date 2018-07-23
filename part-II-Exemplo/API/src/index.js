const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const watson = require('../src/watson/client-watson');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/mensagem/', (req, res) => {
    const { text, context = {} } = req.body;

    const params = {
        input: { text },
        workspace_id: '97c1a5d4-cea5-423e-818c-7d4ec81060ce',
        context,
    };

    watson.message(params, (err, response) => {
        if (err) res.status(500).json(err);
        res.json(response);
    });
});

app.listen(3000);