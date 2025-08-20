// index.js
const express = require('express');

// Load .env in development (Vercel handles env vars automatically)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// Use env vars with defaults
const PORT = process.env.PORT || 3000;
const SITE_NAME = process.env.SITE_NAME || 'My Express App';

// Basic middleware (logging + JSON body support if you later add APIs)
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Home
app.get('/', (_req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Home - ${SITE_NAME}</title>
        <style>
          body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 2rem; }
          a { margin-right: 1rem; }
        </style>
      </head>
      <body>
        <h1>Welcome to ${SITE_NAME}</h1>
        <p>This is a simple Node.js server using Express.</p>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </body>
    </html>
  `);
});
// About
app.get('/about', (_req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>About - ${SITE_NAME}</title>
        <style>
          body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 2rem; }
          a { margin-right: 1rem; }
          .about-me { margin-top: 1rem; padding: 1rem; background: #f8f8f8; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>About Us</h1>
        <p>We build simple demos with Node.js and Express.</p>

        <div class="about-me">
          <h2>About Me</h2>
          <p>Hello! I'm Akhilesh , a developer who loves building clean and simple apps with JavaScript and Node.js.</p>
          <p>I enjoy learning new frameworks, solving tricky bugs, and helping others understand code better.</p>
        </div>

        <nav style="margin-top: 1rem;">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
           <a href="https://github.com/akhileshverma92/nodedemo" target="_blank">Github</a>
        </nav>
      </body>
    </html>
  `);
});

// Contact (GET)
app.get('/contact', (_req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Contact - ${SITE_NAME}</title>
        <style>
          body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 2rem; }
          label { display:block; margin-top: .5rem; }
          input, textarea { width: 320px; max-width: 100%; padding: .5rem; margin-top: .25rem; }
          button { margin-top: .75rem; padding: .5rem .75rem; cursor: pointer; }
          a { margin-right: 1rem; }
        </style>
      </head>
      <body>
        <h1>Contact</h1>
        <p>Send us a message (this form posts JSON to /contact).</p>
        <form id="contactForm">
          <label>Name <input name="name" required /></label>
          <label>Email <input name="email" type="email" required /></label>
          <label>Message <textarea name="message" rows="4" required></textarea></label>
          <button type="submit">Send</button>
        </form>

        <p id="status" style="margin-top:1rem;"></p>

        <nav style="margin-top: 1rem;">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>

        <script>
          const form = document.getElementById('contactForm');
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());
            const res = await fetch('/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            document.getElementById('status').textContent = data.message || 'Sent!';
            form.reset();
          });
        </script>
      </body>
    </html>
  `);
});

// Contact (POST) – just echoes JSON (you can wire this to email/db later)
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'name, email, and message are required' });
  }
  return res.status(200).json({ message: 'Thanks! We received your message.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).type('text').send('404 Not Found');
});

// Start server (Vercel will handle port automatically)
app.listen(PORT, () => {
  console.log(`Starting ${SITE_NAME} on http://localhost:${PORT}`);
});
