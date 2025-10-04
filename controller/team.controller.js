const { createTeamSchema, updateTeamSchema } = require("../validations/team.validation")
const TeamModel = require("../models/Team")
const UserModal = require("../models/User")
const inviteModal = require("../models/Invite")
const { logger, isInviteExpired } = require("../helpers")

class Team {
    async createTeam(req, res) {
        try {
            const { value, error } = createTeamSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, error: true, message: error.details[0].message });
            }
            const user = await UserModal.findById(req.user.id)
            if (!user) {
                return res.status(400).json({ success: false, error: true, message: "You are not allowed to create a team" });
            }
            if (user.teamId) {
                return res.status(400).json({ success: false, error: true, message: "You are already in a team" });
            }
            if (value.ownerId != req.user.id) {
                return res.status(400).json({ success: false, error: true, message: "You are not allowed to create a team for another user" });
            }
            value.members = [value.ownerId]

            const nameExists = await TeamModel.findOne({ name: value.name });
            if (nameExists) {
                return res.status(400).json({ success: false, error: true, message: "Team name already exists" });
            }
            const team = await TeamModel.create(value)
            user.teamId = team.id
            await user.save()
            res.json({ success: true, error: false, data: team })
        } catch (error) {
            logger.error("error ", error.message)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
    async updateTeam(req, res) {
        try {
            const { value, error } = updateTeamSchema.validate(req.body)
            if (error) {
                return res.status(400).json({ success: false, error: true, message: error.details[0].message });
            }
            if (value.name) {
                const checkDuplicateName = await TeamModel.findOne({ name: value.name })
                if (checkDuplicateName) {
                    return res.status(400).json({ success: false, error: true, message: "Team name already exists" });
                }
            }
            const team = await TeamModel.findOneAndUpdate({ ownerId: req.user.id }, value)
            if (!team) {
                return res.status(400).json({ success: false, error: true, message: "unable to update bio" });
            }
            res.json({ success: true, error: false, data: team })
        } catch (error) {
            logger.error("error ", error.message)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
    async deleteTeam(req, res) {
        try {
            const team = await TeamModel.findOneAndDelete({ ownerId: req.user.id });
            if (!team) {
                return res.status(400).json({ success: false, error: true, message: "unable to delete bio" });
            }
            res.json({ success: true, error: false })
        } catch (error) {
            logger.error("error ", error.message)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
    async getTeam(req, res) {
        try {
            const team = await TeamModel.findOne({ ownerId: req.user.id });
            if (!team) {
                return res.status(400).json({ success: false, error: true, message: "no team found" });
            }
            res.json({ success: true, error: false, data: team })
        } catch (error) {
            logger.error("error ", error.message)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
    async sendInvite(req, res) {
        try {
            const teamId = req.params.teamId
            const requestUserId = req.params.userId

            const team = await TeamModel.findById(teamId);
            if (!team || team.ownerId != req.user.id) {
                return res.status(400).json({ success: false, error: true, message: "you don't have permission to send invite" })
            }

            const user = await UserModal.findById(requestUserId);
            if (!user) {
                return res.status(400).json({ success: false, error: true, message: "user doesnt exists" })
            }
            if (user.teamId) {
                return res.status(400).json({ success: false, error: true, message: "user is already in a team" })
            }

            const checkInvite = await inviteModal.findOne({ teamId, userId: requestUserId, status: "pending" })

            if (checkInvite && !isInviteExpired(checkInvite)) {
                return res.status(400).json({ success: false, error: true, message: "An active invite already exists for this user" })
            }

            const invite = await inviteModal.create({
                userId: requestUserId,
                teamId: teamId,
                invitedBy: req.user.id,
            })

            res.json({ success: true, error: false, data: invite })

        } catch (error) {
            logger.error("error ", error.message)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
    async respondInvite(req, res) {
        try {
            const { status } = req.body
            const inviteId = req.params.inviteId
            const invite = await inviteModal.findById(inviteId);

            if (!invite || !(invite.status === "pending") || isInviteExpired(invite)) {
                return res.status(400).json({ success: false, error: true, message: "no pending invite exists" })
            }

            const user = await UserModal.findById(req.user.id);
            if(!user){
                return res.status(400).json({ success: false, error: true, message: "invalid user please log in" })
            }
            
            if(status == "cancelled" && req.user.id == invite.invitedBy){
                invite.status = status
                await invite.save();
                return res.json({ success: true, error: false, message : "status updated to " + status })
            }
            
            if(["accepted", "rejected"].includes(status) && req.user.id == invite.userId){
                if(status == "accepted"){
                    const team = await TeamModel.findById(invite.teamId);
                    if(!team){
                        return res.status(400).json({ success: false, error: true, message: "no team exists" })
                    }
                    team.members.push(invite.userId)
                    user.teamId = invite.teamId
                    await user.save();
                    await team.save()
                }
                invite.status = status
                await invite.save();
                return res.json({ success: true, error: false, message : "status updated to " + status })
            }
            return res.status(400).json({ success: false, error: true, message: "you are not allowed to updated invite status" })
        } catch (error) {
            logger.error("error ", error.message)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
}


module.exports = Team