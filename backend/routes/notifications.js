import prisma from '../lib/prisma.js';

export default async function notificationRoutes(app) {
  // Get notifications
  app.get('/api/notifications', async (req, res) => {
    try {
      const userEmail = req.headers['x-user-email'];
      
      if (!userEmail) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const notifications = await prisma.notification.findMany({
        where: { userEmail: userEmail },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      const formatted = notifications.map(n => ({
        id: n.id,
        title: n.title,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt,
        time: getTimeAgo(n.createdAt),
      }));

      res.json({ success: true, notifications: formatted });
    } catch (error) {
      console.error('Notification error:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  // Mark all notifications as read
  app.post('/api/notifications/read', async (req, res) => {
    try {
      const userEmail = req.headers['x-user-email'];
      
      if (!userEmail) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await prisma.notification.updateMany({
        where: {
          userEmail: userEmail,
          isRead: false,
        },
        data: { isRead: true },
      });

      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Mark read error:', error);
      res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
  });
}

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}