const router = require("express").Router()
const Team = require("../controller/team.controller")
const authMiddleware = require("../middleware/auth")

const team = new Team()

router.route("/")
.get(authMiddleware, team.getTeam)
.post(authMiddleware,team.createTeam)
.patch(authMiddleware, team.updateTeam)
.delete(authMiddleware, team.deleteTeam)


//invite
router.route("/:teamId/invite/:userId").post(authMiddleware,team.sendInvite)


module.exports = router