const Election = require("../models/Election.model");
const crypto = require("crypto");

exports.createElection = async (req, res) => {
  try {
    const { title, description } = req.body;

    const voterKey = crypto.randomBytes(4).toString("hex");

    const election = await Election.create({
      title,
      description,
      voterKey,
      adminId: req.user.id
    });

    return res.redirect(`/admin/elections/${election._id}/edit`);

  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllElections = async (req, res) => {
  try {
    const elections = await Election.find().select("-voterKey");
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id).select("-voterKey");

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.publishElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    election.isPublished = true;
    election.resultsPublished = true;
    await election.save();

    res.json({ message: "Election results published" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateElection = async (req, res) => {
  try {
    const { title, description } = req.body;

    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteElection = async (req, res) => {
  try {
    const electionId = req.params.id;

    await Election.findByIdAndDelete(electionId);
    await Candidate.deleteMany({ electionId });
    await Vote.deleteMany({ electionId });

    res.json({ message: "Election deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

