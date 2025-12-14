const express = require("express");
const router = express.Router();

const { getElectionResults } = require("../controllers/result.controller");

router.get("/:id", getElectionResults);

module.exports = router;
