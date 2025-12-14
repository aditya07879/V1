const express = require("express");
const router = express.Router();

const {
  verifyVoterKey,
  castVote
} = require("../controllers/vote.controller");

router.post("/verify-key", verifyVoterKey);

router.post("/cast", require("../middlewares/auth.middleware"), castVote);

module.exports = router;
