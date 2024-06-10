const express = require('express');
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/download', async (req, res) => {
    const { url } = req.body;
    const output = `downloads/${Date.now()}.mp3`;

    try {
        await youtubedl(url, {
            extractAudio: true,
            audioFormat: 'mp3',
            output,
        });

        res.json({ success: true, file: `/${output}` });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    fs.ensureDir('downloads');
});
