const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }
  const shortID = shortid();
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    vistHistory: [],
  });

  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
    try {
      const shortId = req.params.shortId;
      console.log("Requested shortId:", shortId); // Add this debug log
      const result = await URL.findOne({ shortId });
      console.log("Result from database:", result); // Add this debug log
      if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
      }
      return res.json({
        totalClicks: result.vistHistory.length,
        analytics: result.vistHistory,
      });
    } catch (error) {
      console.error("Error in handleGetAnalytics:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics
};