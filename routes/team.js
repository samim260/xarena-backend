const router = require("express").Router()
const Team = require("../controller/team.controller")
const authMiddleware = require("../middleware/auth")

const team = new Team()

router.route("/")
.get(authMiddleware, team.getTeam)
.post(authMiddleware,team.createTeam)
.patch(authMiddleware, team.updateTeam)
.delete(authMiddleware, team.deleteTeam)

router.route("/all").get(authMiddleware,team.getAllTeam)
router.route("/:teamId").get(authMiddleware,team.getTeamById)


//invite
router.route("/:teamId/invite/:userId").post(authMiddleware,team.sendInvite)
router.route("/:inviteId/respond").post(authMiddleware,team.respondInvite)
router.route("/:inviteId/invite").get(authMiddleware, team.getInvite)



module.exports = router