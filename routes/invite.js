const router = require("express").Router()
const Invite = require("../controller/invite.controller")
const authMiddleware = require("../middleware/auth")

const invite = new Invite()

router.use(authMiddleware)

router.route("/:inviteId/respond").post(invite.respondInvite)
router.route("/:inviteId").get(invite.getInvite)
router.route("/:teamId/:userId").post(invite.sendInvite)

module.exports = router
