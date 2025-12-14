const Vote = require("../models/Vote.model");
const Election = require("../models/Election.model");
const Candidate = require("../models/Candidate.model");


exports.verifyVoterKey = async (req, res) => {
  try {
    const { electionId, voterKey } = req.body;

    if (!electionId || !voterKey) {
      return res.status(400).json({ message: "Missing electionId or voterKey" });
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }


    if (election.voterKey.trim() !== voterKey.trim()) {
      return res.status(401).json({ message: "Invalid election key" });
    }

    return res.status(200).json({
      success: true,
      message: "Election key verified"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId, voterKey } = req.body;

    if (!electionId || !candidateId || !voterKey) {
      return res.status(400).json({ message: "Missing vote data" });
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    if (election.voterKey.trim() !== voterKey.trim()) {
      return res.status(401).json({ message: "Invalid election key" });
    }

    await Vote.create({
      userId: req.user.id,
      electionId,
      candidateId
    });

    await Candidate.findByIdAndUpdate(candidateId, {
      $inc: { voteCount: 1 }
    });

    return res.status(200).json({
      success: true,
      message: "Vote cast successfully"
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already voted" });
    }

    return res.status(500).json({ message: error.message });
  }
};
