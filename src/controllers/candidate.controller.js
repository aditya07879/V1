const Candidate = require("../models/Candidate.model");
const Election = require("../models/Election.model");
const Vote = require("../models/Vote.model.js");


exports.addCandidate = async (req, res) => {
  try {
    const { name } = req.body;
    const electionId = req.params.electionId;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const candidate = await Candidate.create({
      name,
      electionId,
      photo: req.file
        ? `/uploads/candidates/${req.file.filename}`
        : null
    });

    const redirectUrl = `/admin/elections/${electionId}/edit`;


if (req.headers.accept && req.headers.accept.includes("text/html")) {
  return res.redirect(redirectUrl);
}
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getCandidatesByElection = async (req, res) => {
  try {
    const electionId = req.params.id;

    const candidates = await Candidate.find({ electionId });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateCandidate = async (req, res) => {
  try {
    const updateData = {};

    if (req.body.name) {
      updateData.name = req.body.name;
    }

    if (req.file) {
      updateData.photo = `/uploads/candidates/${req.file.filename}`;
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.candidateId,
      updateData,
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

   const redirectUrl = `/admin/elections/${candidate.electionId}/edit`;


if (req.headers.accept && req.headers.accept.includes("text/html")) {
  return res.redirect(redirectUrl);
}
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.deleteCandidate = async (req, res) => {
  try {
  
    const candidate = await Candidate.findById(req.params.candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

 
    const electionId = candidate.electionId;


    await candidate.deleteOne();


    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect(`/admin/elections/${electionId}/edit`);
    }

    return res.json({ message: "Candidate deleted successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete candidate" });
  }
};

