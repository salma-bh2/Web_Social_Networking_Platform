const UploadsService = require("../services/uploads.service");

async function remove(req, res) {
  const userId = req.user.id;
  const { filename } = req.params;

  const data = await UploadsService.deleteMedia({ userId, filename });
  return res.status(200).json(data);
}

module.exports = { remove };
