console.log("🔥 PAGE ROUTES FILE LOADED");
const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middlewares/admin.middleware");

const Election = require("../models/Election.model");
const Candidate = require("../models/Candidate.model");
const Vote = require("../models/Vote.model");

/* =====================================================
   PUBLIC / AUTH PAGES
===================================================== */


router.get("/", async (req, res) => {
  const elections = await Election.find({ isPublished: true })
    .select("-voterKey");

  res.render("home", { elections });
});

router.get("/login", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("login");
});


router.get("/register", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("register");
});

/* =====================================================
   USER VOTING FLOW
===================================================== */


router.get("/elections/:id", async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login");
    }

    const election = await Election.findById(req.params.id)
      .select("-voterKey");

  
    if (!election) {
      return res.redirect("/");
    }

    if (election.resultsPublished) {
      return res.redirect(`/results/${election._id}`);
    }

    if (!election.isPublished) {
      return res.redirect("/");
    }

    const candidates = await Candidate.find({
      electionId: election._id
    });

    res.render("vote", {
      election,
      candidates,
      user: req.user
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

router.get("/vote/success", async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login");
    }

    const lastVote = await Vote.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("electionId");

    if (!lastVote) {
      return res.redirect("/");
    }

    res.render("vote-success", {
      election: lastVote.electionId,
      timestamp: new Date(lastVote.createdAt).toLocaleString()
    });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

/* =====================================================
   ADMIN PAGES (PROTECTED)
===================================================== */

router.get("/admin/dashboard", adminMiddleware, async (req, res) => {
  const elections = await Election.find();

  const totalElections = elections.length;

  const activeElections = elections.filter(
    e => e.isPublished && !e.resultsPublished
  ).length;

  const publishedResults = elections.filter(
    e => e.resultsPublished
  ).length;

  const totalVotes = await Vote.countDocuments();

  res.render("admin/dashboard", {
    elections,
    stats: [
      { label: "Total Elections", value: totalElections },
      { label: "Active Elections", value: activeElections },
      { label: "Published Results", value: publishedResults },
      { label: "Votes Cast", value: totalVotes }
    ]
  });
});

router.get("/admin/elections/new", adminMiddleware, (req, res) => {
  res.render("admin/election-form", {
    election: null,
    candidates: []
  });
});


router.get("/admin/elections/:id/edit", adminMiddleware, async (req, res) => {
  const election = await Election.findById(req.params.id);
  if (!election) {
    return res.redirect("/admin/dashboard");
  }

  const candidates = await Candidate.find({
    electionId: election._id
  });

  res.render("admin/election-form", {
    election,
    candidates
  });
});

/* =====================================================
   ADMIN — OPEN VOTING
===================================================== */


router.get("/admin/elections/:id/publish", adminMiddleware, async (req, res) => {
  const election = await Election.findById(req.params.id);
  if (!election) {
    return res.redirect("/admin/dashboard");
  }

  res.render("admin/publish", { election });
});

router.post("/admin/elections/:id/publish", adminMiddleware, async (req, res) => {
  const election = await Election.findById(req.params.id);

  if (!election) {
    return res.redirect("/admin/dashboard");
  }

  election.isPublished = true;
  election.resultsPublished = false;
  election.isActive = true;

  await election.save();

  res.redirect("/admin/dashboard");
});

/* =====================================================
   ADMIN — PUBLISH RESULTS
===================================================== */

router.get(
  "/admin/elections/:id/results/publish",
  adminMiddleware,
  async (req, res) => {
    
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.redirect("/admin/dashboard");
    }

    if (election.resultsPublished) {
      return res.redirect(`/results/${election._id}`);
    }

    res.render("admin/publish", { election });
  }
);

router.post(
  "/admin/elections/:id/results/publish",
  adminMiddleware,
  async (req, res) => {
    console.log("🔥 RESULTS PUBLISH POST HIT");

    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.redirect("/admin/dashboard");
    }

    election.resultsPublished = true;
    election.isPublished = false;   
    election.isActive = false;

    await election.save();

    res.redirect("/admin/dashboard");
  }
);
router.get("/my-elections", async (req, res) => {
  try {
  
    if (!req.user) {
      return res.redirect("/login");
    }

    const votes = await Vote.find({ userId: req.user.id })
      .populate("electionId");

    const elections = votes
      .map(v => v.electionId)
      .filter(Boolean);

    res.render("my-elections", {
      elections,
      user: req.user
    });

  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

router.get("/profile", async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login");
    }
    console.log(req.user)

    res.render("profile");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});


module.exports = router;
