const SettingsService = require("../services/settings.service");

async function getMe(req, res) {
  const data = await SettingsService.getMySettings({ userId: req.user.id });
  return res.status(200).json(data);
}

async function updateMe(req, res) {
  const data = await SettingsService.updateMySettings({
    userId: req.user.id,
    patch: req.body,
  });
  return res.status(200).json(data);
}

module.exports = { getMe, updateMe };
