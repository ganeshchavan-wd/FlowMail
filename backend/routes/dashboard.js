import prisma from '../lib/prisma.js';

export default async function dashboardRoutes(app) {
  // Dashboard Stats
  app.get('/api/dashboard/stats', async (req, res) => {
    try {
      // Get user from session (you'll need to implement auth)
      const userEmail = req.headers['x-user-email'];
      
      if (!userEmail) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          emails: {
            orderBy: { receivedAt: 'desc' },
            take: 10,
          },
          events: {
            where: {
              startTime: {
                gte: new Date(),
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const totalEmails = user.emails.length;
      const unreadEmails = user.emails.filter(e => e.priority === 'important').length || 0;
      const importantEmails = user.emails.filter(e => e.priority === 'high').length || 0;
      const starredEmails = user.emails.filter(e => e.priority === 'starred').length || 0;
      
      const meetingsToday = user.events.filter(e => {
        const today = new Date();
        return e.startTime.getDate() === today.getDate() &&
               e.startTime.getMonth() === today.getMonth() &&
               e.startTime.getFullYear() === today.getFullYear();
      }).length;

      const recentEmails = user.emails.slice(0, 5).map(email => ({
        from: email.sender,
        subject: email.subject,
        snippet: email.body?.substring(0, 100) || '',
        receivedAt: email.receivedAt,
      }));

      const aiActions = await prisma.aIActivity.count({
        where: {
          userEmail: userEmail,
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      });

      const hoursSaved = `${Math.floor(aiActions * 0.5)}h`;

      res.json({
        emails: totalEmails,
        unread: unreadEmails,
        important: importantEmails,
        starred: starredEmails,
        meetings: meetingsToday,
        aiActions: aiActions,
        hoursSaved: hoursSaved,
        recentEmails: recentEmails,
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });

  // Recent Activity
  app.get('/api/dashboard/activity', async (req, res) => {
    try {
      const userEmail = req.headers['x-user-email'];
      
      if (!userEmail) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          emails: {
            orderBy: { receivedAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const activities = user.emails.map(email => ({
        type: 'email',
        from: email.sender,
        subject: email.subject,
        snippet: email.body?.substring(0, 100) || '',
        time: email.receivedAt,
      }));

      res.json({ activities });
    } catch (error) {
      console.error('Activity error:', error);
      res.status(500).json({ error: 'Failed to fetch activity' });
    }
  });
}