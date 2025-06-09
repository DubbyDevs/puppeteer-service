const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/render-tags', async (req, res) => {
  const { url, keyword } = req.body;
  if (!url || !keyword) return res.status(400).json({ error: 'Missing url or keyword' });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

    const result = await page.evaluate((k) => {
      const t = document.title?.toLowerCase() || '';
      const m = document.querySelector("meta[name='description']")?.content?.toLowerCase() || '';
      const h1 = document.querySelector('h1')?.innerText?.toLowerCase() || '';
      return {
        keywordInTitle: t.includes(k),
        keywordInMeta: m.includes(k),
        keywordInH1: h1.includes(k)
      };
    }, keyword.toLowerCase());

    res.json({ ...result });
  } catch (err) {
    console.error('Error in /render-tags:', err);
    res.status(500).json({ keywordInTitle: null, keywordInMeta: null, keywordInH1: null, error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Puppeteer service running on port ${PORT}`));
