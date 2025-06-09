// index.js
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/render-tags', async (req, res) => {
  const { url, keyword } = req.body;
  if (!url || !keyword) return res.status(400).json({ error: 'Missing url or keyword' });

  let browser, result = {};
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    // Your tag extraction logic here...
    // result = { keywordInTitle: true, titleText: '...' };

    res.json(result);
  } catch (err) {
    console.error('Error in /render-tags:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Puppeteer service running on port ${PORT}`));
