import prisma from '../lib/prisma.js';
import { google } from 'googleapis';

export default async function gmailRoutes(app) {
  // Get Gmail messages
  app.get('/api/gmail/messages', async (req, res) => {
    try {
      const accessToken = req.headers['authorization']?.replace('Bearer ', '');
      
      if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 20,
        q: 'is:inbox -is:spam',
      });

      const messages = response.data.messages || [];
      const emails = [];

      for (const msg of messages.slice(0, 10)) {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
        });

        const headers = email.data.payload?.headers || [];
        const subject = headers.find(h => h.name === 'Subject')?.value || '';
        const from = headers.find(h => h.name === 'From')?.value || '';

        emails.push({
          id: msg.id,
          subject: subject,
          from: from,
          snippet: email.data.snippet || '',
          body: email.data.snippet || '',
        });
      }

      res.json({ success: true, emails });
    } catch (error) {
      console.error('Gmail messages error:', error);
      res.status(500).json({ error: 'Failed to fetch emails' });
    }
  });

  // Summarize inbox
  app.get('/api/gmail/summarize', async (req, res) => {
    try {
      // Your summarize logic here
      res.json({
        success: true,
        data: {
          overview: { totalEmails: 0, summary: 'Inbox summary' },
          important: [],
          urgent: [],
          meetings: [],
          summary: ['No emails to summarize'],
        },
      });
    } catch (error) {
      console.error('Summarize error:', error);
      res.status(500).json({ error: 'Failed to summarize emails' });
    }
  });

  // Categorize emails
  app.get('/api/gmail/categorize', async (req, res) => {
    try {
      // Your categorize logic here
      res.json({
        success: true,
        data: {
          urgent: [],
          important: [],
          jobs: [],
          meetings: [],
          promotions: [],
          social: [],
        },
      });
    } catch (error) {
      console.error('Categorize error:', error);
      res.status(500).json({ error: 'Failed to categorize emails' });
    }
  });

  // Check for new emails
  app.get('/api/gmail/check-new', async (req, res) => {
    try {
      res.json({
        success: true,
        count: 0,
        message: 'Email check endpoint',
      });
    } catch (error) {
      console.error('Check new emails error:', error);
      res.status(500).json({ error: 'Failed to check emails' });
    }
  });
}