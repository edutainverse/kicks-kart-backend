import express from 'express';
import { authGuard } from '../../middlewares/authGuard.js';
import { roleGuard } from '../../middlewares/roleGuard.js';
import EmailTracking from '../../models/emailTracking.model.js';

const router = express.Router();

// Get email analytics for admin
router.get('/analytics', authGuard, roleGuard('admin'), async (req, res, next) => {
  try {
    const analytics = await EmailTracking.aggregate([
      {
        $group: {
          _id: '$emailType',
          totalSent: { $sum: 1 },
          totalOpened: { $sum: { $cond: ['$opened', 1, 0] } },
          openRate: { 
            $multiply: [
              { $divide: [{ $sum: { $cond: ['$opened', 1, 0] } }, { $sum: 1 }] },
              100
            ]
          }
        }
      }
    ]);

    const recentEmails = await EmailTracking.find()
      .sort({ sentAt: -1 })
      .limit(50)
      .lean();

    res.json({
      analytics,
      recentEmails
    });
  } catch (error) {
    next(error);
  }
});

// Get tracking details for specific email
router.get('/details/:trackingId', authGuard, roleGuard('admin'), async (req, res, next) => {
  try {
    const tracking = await EmailTracking.findOne({ trackingId: req.params.trackingId });
    if (!tracking) {
      return res.status(404).json({ error: 'Tracking record not found' });
    }
    res.json(tracking);
  } catch (error) {
    next(error);
  }
});

export default router;
