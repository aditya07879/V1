const express = require("express");
const router = express.Router();

const {
  createElection,
  getAllElections,
  getElectionById,
  publishElection,
  updateElection,
  deleteElection
} = require("../controllers/election.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");


router.post("/", authMiddleware, adminMiddleware, createElection);


router.get("/", getAllElections);

router.get("/:id", getElectionById);

router.post("/:id/publish", authMiddleware, adminMiddleware, publishElection);

router.put("/:id", authMiddleware, adminMiddleware, updateElection);

router.delete("/:id", authMiddleware, adminMiddleware, deleteElection);

module.exports = router;
