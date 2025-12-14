const Election = require("../models/Election.model");
const Candidate = require("../models/Candidate.model");

exports.getElectionResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).send("Election not found");
    }

    if (!election.resultsPublished) {
      return res.render("results-pending", { election });
    }

    const candidates = await Candidate.find({
      electionId: election._id
    }).sort({ voteCount: -1 });

    const results = candidates.map(c => ({
      name: c.name,
      votes: c.voteCount
    }));

    const highestVotes = results.length > 0 ? results[0].votes : 0;

const winners = results.filter(r => r.votes === highestVotes);

    res.render("results", {
      election,
      results,
        winners,
  highestVotes
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};