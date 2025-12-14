const express = require("express");
const router = express.Router();
const upload = require("../config/upload");

const {
  addCandidate,
  getCandidatesByElection,
  updateCandidate,
  deleteCandidate
} = require("../controllers/candidate.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");


router.post(
  "/:electionId",
  authMiddleware,
  adminMiddleware,
  upload.single("photo"),
  addCandidate
);


router.get(
  "/:electionId",
  getCandidatesByElection
);


router.put(
  "/:candidateId",
  authMiddleware,
  adminMiddleware,
  upload.single("photo"),
  updateCandidate
);


router.delete(
  "/:candidateId",
  authMiddleware,
  adminMiddleware,
  deleteCandidate
);

module.exports = router;
