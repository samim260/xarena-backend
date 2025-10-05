const router = require("express").Router()
const Team = require("../controller/team.controller")
const authMiddleware = require("../middleware/auth")

const team = new Team()

router.use(authMiddleware)

router.route("/")
    .get(team.getTeam)
    .post(team.createTeam)
    .patch(team.updateTeam)
    .delete(team.deleteTeam)

router.route("/all").get(team.getAllTeam)
router.route("/:teamId").get(team.getTeamById)

module.exports = router