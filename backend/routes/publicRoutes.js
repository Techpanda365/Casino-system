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
const MainBombay36 = require("../models/MainBombay36");
const Banner = require("../models/Banner");
const Forum = require("../models/Forum");
const Contact = require("../models/Contact");

const router = express.Router();

const getTodayRange = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  const istDateStr = istDate.toISOString().split('T')[0];
  return {
    start: new Date(istDateStr + 'T00:00:00.000+05:30'),
    end: new Date(istDateStr + 'T23:59:59.999+05:30')
  };
};

// Get day-of-week (0=Sun..6=Sat) in IST from any Date object
const getISTDay = (date) => {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(date.getTime() + istOffset);
  return ist.getUTCDay();
};

// Get YYYY-MM-DD in IST from any Date object (avoids setDate timezone issues)
const getISTDateStr = (date) => {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(date.getTime() + istOffset);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const d = String(ist.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

router.get("/markets/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    console.log(admin,"admin")
    if (!admin) 
      return res.status(404).json({ msg: "Site not found" });

    const { start, end } = getTodayRange();

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
      "addMarketEnabled", "addMarketTitle", "addMarketContent", "addMarketWhatsapp", "addMarketEmail",
      "footerAboutLabel", "footerAboutEnabled", "footerContactLabel", "footerContactEnabled",
      "footerPrivacyLabel", "footerPrivacyEnabled", "footerTermsLabel", "footerTermsEnabled",
      "footerApiLabel", "footerApiEnabled", "footerDisclaimer"
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
    if (!admin) return res.status(404).json({ msg: "Site not found" });

    const markets = await Market.find({ adminId: admin._id, active: true }).sort({ displayOrder: 1 });

    // Get all results sorted newest first, then pick latest per market
    const allResults = await Result.find({
      market: { $in: markets.map((m) => m._id) }
    }).sort({ date: -1, _id: -1 });

    const resultMap = {};
    allResults.forEach((r) => {
      const key = r.market.toString();
      if (!resultMap[key]) resultMap[key] = r;
    });

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

    const { start, end } = getTodayRange();

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
    const { start, end } = getTodayRange();
    const starlines = await Starline.find({
      adminId: admin._id, date: { $gte: start, $lte: end }, status: "active"
    }).sort({ name: 1 }).limit(20);
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

    const { start, end } = getTodayRange();

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
    const limit = parseInt(req.query.limit) || 2000;

    const results = await Result.find({ market: req.params.marketId })
      .sort({ date: -1 })
      .limit(limit)
      .select("date openPatti jodi closePatti");
    results.reverse();
    console.log(results,"results")

    const latestResult = results.length > 0 ? results[results.length - 1] : null;
    const currentResult = latestResult ? {
      openPatti: latestResult.openPatti,
      jodi: latestResult.jodi,
      closePatti: latestResult.closePatti
    } : null;

    if (type === "jodi") {
      const getWeekStart = (d) => {
        const istOffset = 5.5 * 60 * 60 * 1000;
        const ist = new Date(new Date(d).getTime() + istOffset);
        const day = ist.getUTCDay();
        const diff = day === 0 ? -6 : 1 - day;
        const mon = new Date(ist.getTime() + diff * 86400000);
        const y = mon.getUTCFullYear();
        const m = String(mon.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(mon.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${dd}`;
      };

      const weekMap = {};
      results.forEach((r) => {
        const wKey = getWeekStart(r.date);
        if (!weekMap[wKey]) weekMap[wKey] = {};
        const dayOfWeek = getISTDay(new Date(r.date));
        weekMap[wKey][dayOfWeek] = r.jodi || "**";
      });

      const weekKeys = Object.keys(weekMap).sort();
      const jodiWeeks = weekKeys.map((wKey) => {
        const days = [];
        for (let d = 1; d <= 7; d++) {
          days.push(weekMap[wKey][d % 7] || "**");
        }
        return days;
      });

      return res.json({ market: market.name, type: "jodi", weeks: jodiWeeks, currentResult });
    }

    // PANEL — group by calendar week (Mon–Sun)
    const getWeekStart = (d) => {
      const istOffset = 5.5 * 60 * 60 * 1000;
      const ist = new Date(new Date(d).getTime() + istOffset);
      const day = ist.getUTCDay();
      const diff = day === 0 ? -6 : 1 - day;
      const mon = new Date(ist.getTime() + diff * 86400000);
      const y = mon.getUTCFullYear();
      const m = String(mon.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(mon.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${dd}`;
    };

    const weekMap = {};
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

    const weekKeys = Object.keys(weekMap).sort();
    const panelWeeks = weekKeys.map((wKey) => {
      const days = weekMap[wKey];
      days.sort((a, b) => {
        const da = getISTDay(new Date(a.date));
        const db = getISTDay(new Date(b.date));
        return (da === 0 ? 7 : da) - (db === 0 ? 7 : db);
      });

      const weekStart = new Date(wKey + 'T00:00:00.000+05:30');
      const weekEnd = new Date(weekStart.getTime() + 6 * 86400000);

      const fmt = (d) => {
        const istOffset = 5.5 * 60 * 60 * 1000;
        const ist = new Date(d.getTime() + istOffset);
        const dd = String(ist.getUTCDate()).padStart(2, "0");
        const mm = String(ist.getUTCMonth() + 1).padStart(2, "0");
        const yyyy = ist.getUTCFullYear();
        return `${dd}/${mm}/${yyyy}`;
      };

      return {
        label: `${fmt(weekStart)} to ${fmt(weekEnd)}`,
        days,
      };
    });

    console.log(panelWeeks,"panelWeeks")
    return res.json({ market: market.name, type: "panel", weeks: panelWeeks, currentResult });
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

router.get("/all-charts/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    if (!admin) return res.status(404).json({ msg: "Site not found" });
    const markets = await Market.find({ adminId: admin._id, active: true }).sort({ displayOrder: 1 });

    const getWeekStart = (d) => {
      const istOffset = 5.5 * 60 * 60 * 1000;
      const ist = new Date(new Date(d).getTime() + istOffset);
      const day = ist.getUTCDay();
      const diff = day === 0 ? -6 : 1 - day;
      const mon = new Date(ist.getTime() + diff * 86400000);
      const y = mon.getUTCFullYear();
      const m = String(mon.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(mon.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${dd}`;
    };

    const getISTDay = (date) => {
      const istOffset = 5.5 * 60 * 60 * 1000;
      const ist = new Date(new Date(date).getTime() + istOffset);
      return ist.getUTCDay();
    };

    const allMarketsData = await Promise.all(markets.map(async (market) => {
      const limit = parseInt(req.query.limit) || 2000;
      const results = await Result.find({ market: market._id })
        .sort({ date: -1 }).limit(limit)
        .select("date openPatti jodi closePatti");
      results.reverse();

      // Jodi weeks
      const jodiWeekMap = {};
      results.forEach((r) => {
        const wKey = getWeekStart(r.date);
        if (!jodiWeekMap[wKey]) jodiWeekMap[wKey] = {};
        jodiWeekMap[wKey][getISTDay(new Date(r.date))] = r.jodi || "**";
      });
      const jodiWeeks = Object.keys(jodiWeekMap).sort().map((wKey) => {
        const days = [];
        for (let d = 1; d <= 7; d++) days.push(jodiWeekMap[wKey][d % 7] || "**");
        return days;
      });

      // Panel weeks
      const panelWeekMap = {};
      results.forEach((r) => {
        const wKey = getWeekStart(r.date);
        if (!panelWeekMap[wKey]) panelWeekMap[wKey] = [];
        panelWeekMap[wKey].push({
          date: r.date,
          openPatti: r.openPatti || "* * *",
          jodi: r.jodi || "**",
          closePatti: r.closePatti || "* * *",
        });
      });
      const panelWeeks = Object.keys(panelWeekMap).sort().map((wKey) => {
        const days = panelWeekMap[wKey];
        days.sort((a, b) => {
          const da = getISTDay(new Date(a.date));
          const db = getISTDay(new Date(b.date));
          return (da === 0 ? 7 : da) - (db === 0 ? 7 : db);
        });
        const weekStart = new Date(wKey + 'T00:00:00.000+05:30');
        const weekEnd = new Date(weekStart.getTime() + 6 * 86400000);
        const fmt = (d) => {
          const istOffset = 5.5 * 60 * 60 * 1000;
          const ist = new Date(d.getTime() + istOffset);
          const dd = String(ist.getUTCDate()).padStart(2, "0");
          const mm = String(ist.getUTCMonth() + 1).padStart(2, "0");
          const yyyy = ist.getUTCFullYear();
          return `${dd}/${mm}/${yyyy}`;
        };
        return { label: `${fmt(weekStart)} to ${fmt(weekEnd)}`, days };
      });

      return {
        _id: market._id,
        name: market.name,
        jodi: { weeks: jodiWeeks },
        panel: { weeks: panelWeeks },
      };
    }));

    return res.json(allMarketsData);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/main-bombay36/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    if (!admin) return res.status(404).json({ msg: "Site not found" });
    const records = await MainBombay36.find({ adminId: admin._id }).sort({ date: -1 }).limit(30);
    return res.json(records);
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Contact form submission
router.post("/contact/:slug", async (req, res) => {
  try {
    const admin = await Admin.findOne({ siteSlug: req.params.slug });
    if (!admin) return res.status(404).json({ msg: "Site not found" });
    const { name, email, phone, gameType, gameName, message, record } = req.body;
    const contact = new Contact({ adminId: admin._id, name, email, phone, gameType, gameName, message, record });
    await contact.save();
    res.json({ msg: "Form submitted successfully!" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
