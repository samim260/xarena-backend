const { createTeamSchema, updateTeamSchema } = require("../validations/team.validation")
const TeamModel = require("../models/Team")
const UserModal = require("../models/User")
const { logger } = require("../helpers")

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
            value.ownerId = req.user.id
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
            logger.error(`error : ${error}`)
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
            logger.error(`error : ${error}`)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
    async deleteTeam(req, res) {
        try {
            const team = await TeamModel.findOne({ ownerId: req.user.id });
            if (!team) {
                return res.status(400).json({ success: false, error: true, message: "unable to delete team" });
            }
            await UserModal.updateMany({teamId : team.id},{
                teamId : null
            })
            await team.deleteOne();
            res.json({ success: true, error: false })
        } catch (error) {
            logger.error(`error : ${error}`)
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
            logger.error(`error : ${error}`)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
    async getTeamById(req,res){
         try {
            const teamId = req.params.teamId
            const team = await TeamModel.findById(teamId);
            if (!team) {
                return res.status(400).json({ success: false, error: true, message: "no team found" });
            }
            res.json({ success: true, error: false, data: team })
        } catch (error) {
            logger.error(`error : ${error}`)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
    async getAllTeam(req,res){
         try {
            const team = await TeamModel.find();
            if (!team || team.length == 0) {
                return res.status(400).json({ success: false, error: true, message: "no teams found" });
            }
            res.json({ success: true, error: false, data: team })
        } catch (error) {
            logger.error(`error : ${error}`)
            return res.status(500).json({ success: false, error: true, message: error.message })
        }
    }
}


module.exports = Team