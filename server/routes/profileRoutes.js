const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { protect, optionalAuth } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET /api/profile
// @desc    Get profile information (public or admin)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }

    const profileObj = profile.toObject();

    // If viewer is not admin, respect visibility flags
    if (!req.user) {
      if (!profileObj.isEmailPublic) delete profileObj.email;
      if (!profileObj.isPhonePublic) delete profileObj.phone;
      if (!profileObj.isDobPublic) delete profileObj.dateOfBirth;
    }

    res.json({ success: true, data: profileObj });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/profile
// @desc    Update profile (Admin only)
router.put('/', protect, async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }

    const updated = await profile.save();

    await ActivityLog.create({
      action: 'Updated Profile',
      entityType: 'Profile',
      entityTitle: updated.fullName,
      details: 'Personal and academic profile details updated',
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
