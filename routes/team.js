var express = require("express");
var router = express.Router();
var Team = require("../models/team");

router.get("/", function(req, res, next) {
  Team.find()
    .sort({ score: "descending" })
    .exec(function(err, teams) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(teams);
      }
    });
});

router.get("/admin", function(req, res, next) {
  Team.find(function(err, teams) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(teams);
    }
  });
});
router.get("/:name", function(req, res, next) {
  Team.findOne({ name: req.params.name }, function(err, team) {
    if (err) {
      res.send(err);
    }
    if (team) {
      res.send(team);
    } else {
      res.send("No team found with that name");
    }
  });
});

router.post("/", function(req, res, next) {
  var team = new Team(req.body);
  team.save(function(err, createdTeam) {
    if (err) {
      res.send(err);
    }
    res.send(createdTeam);
  });
});

router.put("/:name", function(req, res, next) {
  Team.findOne({ name: req.params.name }, function(err, team) {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(req.body);
      team.name = req.body.name || team.name;
      team.p1 = req.body.p1 || team.p1;
      team.p2 = req.body.p2 || team.p2;
      team.score = req.body.score || team.score;

      // Save the updated document back to the database
      team.save(function(err, team) {
        if (err) {
          res.status(500).send(err);
        }
        res.send(team);
      });
    }
  });
});

router.delete("/:name", function(req, res, next) {
  Team.findOneAndRemove({ name: req.params.name }, function(err, team) {
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    var response = {
      message: "Team successfully deleted",
      id: team._id
    };
    res.send(response);
  });
});
module.exports = router;
