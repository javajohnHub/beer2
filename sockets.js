console.log("loaded");
var Team = require("./models/team");
module.exports = function(io) {
  io.sockets.on("connection", function(socket) {
    console.log("connected", socket.id);
    socket.on("error", err => {
      console.log(err);
    });
    socket.on("get teams", () => {
      Team.find()
        .sort({ score: "descending" })
        .exec(function(err, teams) {
          if (err) {
            console.log(err);
          } else {
            socket.emit("send teams", teams);
          }
        });
    });
    socket.on("get team", name => {
      Team.findOne({ name: name }, function(err, team) {
        if (err) {
          console.log(err);
        }
        if (team) {
          socket.emit("send team", team);
        } else {
          console.log("No team found with that name");
        }
      });
    });

    socket.on("post team", teamy => {
      console.log(teamy);
      var team = new Team(teamy);
      team.save(function(err, createdTeam) {
        if (err) {
          console.log(err);
        }
        socket.emit("post team response", createdTeam);
      });
    });

    socket.on("put team", putteam => {
      Team.findOne({ name: putteam.name }, function(err, team) {
        if (err) {
          console.log(err);
        } else {
          console.log(team);
          team.name = putteam.name || team.name;
          team.p1 = putteam.p1 || team.p1;
          team.p2 = putteam.p2 || team.p2;
          team.score = putteam.score || team.score;

          // Save the updated document back to the database
          team.save(function(err, team) {
            if (err) {
              console.log(err);
            }
            socket.emit("put team response", team);
          });
        }
      });
    });
    socket.on("delete team", delteam => {
      Team.findOneAndRemove({ name: delteam.name }, function(err, team) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        var response = {
          message: delteam.name + " successfully deleted",
          id: team._id
        };
        socket.emit("delete team response", team);
      });
    });
  });
};
