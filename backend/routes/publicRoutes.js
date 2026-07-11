const express = require("express");
const Admin = require("../models/Admin");
const Market = require("../models/Market");
const Result = require("../models/Result");
const SiteSetting = require("../models/SiteSetting");
const Guess = require("../models/Guess");
const Chart = require("../models/Chart");
const Starline = require("../models/Starline");
const PassHua = require("../models/PassHua");
const StarlineChart = require("../models/StarlineChart");
const Banner = require("../models/Banner");
const Forum = require("../models/Forum");

const router = express.Router();

router.get("/markets/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    console.log(admin,"admin")
    if (!admin) 
      return res.status(404).json({ msg: "Site not found" });

    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const markets = await Market.find({ adminId: admin._id, active: true }).sort({ displayOrder: 1 });
    console.log(markets,"markets")
    const results = await Result.find({
      market: { $in: markets.map((m) => m._id) },
      date: { $gte: start, $lte: end }
    }).populate("market");
    console.log(results,"results")

    const resultMap = {};
    results.forEach((r) => { resultMap[r.market._id.toString()] = r; });

    const data = markets.map((m) => ({
      _id: m._id,
      name: m.name,
      openTime: m.openTime,
      closeTime: m.closeTime,
      finalAnk: m.finalAnk,
      result: resultMap[m._id.toString()] || null
    }));

  return res.json(data);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/settings/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    console.log(admin,"admin")
    if (!admin) return res.status(404).json({ msg: "Site not found" });

    const settings = await SiteSetting.findOne({ adminId: admin._id });
    if (!settings) return res.json({});

    const publicFields = [
      "siteName", "logo", "favicon", "header", "footer",
      "welcomeText", "luckyNumber", "goldenAnk",
      "whatsappNumber", "email", "telegramChannel", "aboutUs", "appDownloadUrl",
      "themeBg", "themeCardBg", "themeBorder", "themePrimary", "themePrimaryDark",
      "themeText", "themeTextMuted", "themeHeaderBg", "themeSectionBg",
      "themeResultBg", "themeResultText", "themeSectionText", "themeCardRadius",
      "themeHoverBg", "themeShadow", "themeFont",
      "addMarketEnabled", "addMarketTitle", "addMarketContent", "addMarketWhatsapp", "addMarketEmail"
    ];
    const result = {};
    publicFields.forEach((f) => { result[f] = settings[f] || ""; });
    res.json(result);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/live/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    console.log(admin,"admin")
    if (!admin) return res.status(404).json({ msg: "Site not found" });

    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const markets = await Market.find({ adminId: admin._id, active: true }).sort({ displayOrder: 1 });
    console.log(markets,"markets")
    const results = await Result.find({
      market: { $in: markets.map((m) => m._id) },
      date: { $gte: start, $lte: end }
    });
    console.log(results,"results")

    const resultMap = {};
    results.forEach((r) => { resultMap[r.market.toString()] = r; });

    const live = markets.map((m) => {
      const r = resultMap[m._id.toString()];
      return {
        marketId: m._id,
        name: m.name,
        openTime: m.openTime,
        closeTime: m.closeTime,
        openPatti: r ? r.openPatti : null,
        jodi: r ? r.jodi : null,
        closePatti: r ? r.closePatti : null,
        hasResult: !!r,
        status: r ? r.status : null,
      };
    });

    console.log(live,"live")
    return res.json(live);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/guesses/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    console.log(admin,"admin")
    if (!admin) return res.status(404).json({ msg: "Site not found" });

    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const guesses = await Guess.find({
      adminId: admin._id,
      date: { $gte: start, $lte: end },
      status: "active"
    }).populate("marketId", "name").sort({ "marketId.name": 1 });

    return res.json(guesses);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/charts/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    console.log(admin,"admin")
    if (!admin) return res.status(404).json({ msg: "Site not found" });
    const charts = await Chart.find({ adminId: admin._id, status: "active" }).sort({ type: 1 });
    console.log(charts,"charts")
    return res.json(charts);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/starline/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    console.log(admin,"admin")
    if (!admin) return res.status(404).json({ msg: "Site not found" });
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));
    const starlines = await Starline.find({
      adminId: admin._id, date: { $gte: start, $lte: end }, status: "active"
    }).sort({ name: 1 });
    console.log(starlines,"starlines")
    return res.json(starlines);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});


router.get("/pass-hua/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    console.log(admin,"admin")
    if (!admin) return res.status(404).json({ msg: "Site not found" });

    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const record = await PassHua.findOne({
      adminId: admin._id,
      date: { $gte: start, $lte: end },
      status: "active"
    });

    console.log(record,"record")
    if (!record || record.entries.length === 0) return res.json({ entries: [] });
    return res.json({ date: record.date, entries: record.entries });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/history/:slug/:marketId", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    console.log(admin,"admin")
    if (!admin) 
      return res.status(404).json({ msg: "Site not found" });

    const market = await Market.findOne({ _id: req.params.marketId, adminId: admin._id });
    console.log(market,"market")
    if (!market) 
      return res.status(404).json({ msg: "Market not found" });

    const type = req.query.type || "jodi"; 
    const limit = parseInt(req.query.limit) || 300;

    const results = await Result.find({ market: req.params.marketId })
      .sort({ date: 1 })
      .limit(limit)
      .select("date openPatti jodi closePatti");
      console.log(results,"results")

    if (type === "jodi") {
      
      const jodiList = results.map((r) => r.jodi || "**");
      const weeks = [];
      for (let i = 0; i < jodiList.length; i += 6) {
        weeks.push(jodiList.slice(i, i + 6));
      }
      return res.json({ market: market.name, type: "jodi", weeks });
    }

    // PANEL — group by calendar week (Mon–Sat)
    // Helper: get Monday of a given date's week
    const getWeekStart = (d) => {
      const date = new Date(d);
      const day = date.getDay(); // 0=Sun,1=Mon,...,6=Sat
      const diff = day === 0 ? -6 : 1 - day; // shift to Monday
      date.setDate(date.getDate() + diff);
      date.setHours(0, 0, 0, 0);
      return date.toISOString().split("T")[0];
    };

    const weekMap = {}; // key = "YYYY-MM-DD" (Monday)
    results.forEach((r) => {
      const wKey = getWeekStart(r.date);
      if (!weekMap[wKey]) weekMap[wKey] = [];
      weekMap[wKey].push({
        date: r.date,
        openPatti: r.openPatti || "* * *",
        jodi: r.jodi || "**",
        closePatti: r.closePatti || "* * *",
      });
    });

    // Sort weeks chronologically
    const weekKeys = Object.keys(weekMap).sort();
    const panelWeeks = weekKeys.map((wKey) => {
      const days = weekMap[wKey];
      // Sort days within week Mon→Sat
      days.sort((a, b) => new Date(a.date) - new Date(b.date));

      const weekStart = new Date(wKey);
      const weekEnd = new Date(wKey);
      weekEnd.setDate(weekEnd.getDate() + 5); // Mon + 5 = Sat

      const fmt = (d) => {
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
      };

      return {
        label: `${fmt(weekStart)} to ${fmt(weekEnd)}`,
        days,
      };
    });

    console.log(panelWeeks,"panelWeeks")
    return res.json({ market: market.name, type: "panel", weeks: panelWeeks });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/starline-charts/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    if (!admin) return res.status(404).json({ msg: "Site not found" });
    // ✅ status filter hata diya
    const charts = await StarlineChart.find({ adminId: admin._id }).sort({ createdAt: -1 });
    return res.json(charts);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/banners/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    if (!admin) return res.status(404).json({ msg: "Site not found" });
    const banners = await Banner.find({ adminId: admin._id, status: "active" }).sort({ displayOrder: 1 });
    return res.json(banners);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/forums/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    if (!admin) return res.status(404).json({ msg: "Site not found" });
    const forums = await Forum.find({ adminId: admin._id, status: "active" }).sort({ createdAt: -1 });
    return res.json(forums);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
