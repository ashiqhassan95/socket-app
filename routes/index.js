const express = require('express');
const router = express.Router();

const publicDir = {
    root: __dirname + '/public',
};

router.get('/', (request, response) => {
    response.sendFile('index.html', publicDir);
});

module.exports = router;