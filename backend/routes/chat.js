export default async function chatRoutes(app) {
  // Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message } = req.body;

      // Your AI chat logic here
      const reply = `AI response to: "${message}"`;

      res.json({ reply });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to process chat' });
    }
  });
}