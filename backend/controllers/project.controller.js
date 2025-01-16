import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js';

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }

        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = loggedInUser._id;

        // Check for duplicate project name
        const existingProject = await projectModel.findOne({ name, userId });
        if (existingProject) {
            return res.status(400).json({ message: 'Project with this name already exists' });
        }

        const newProject = await projectService.createProject({ name, userId });
        res.status(201).json(newProject);
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ message: 'Failed to create project', error: err.message });
    }
};

export const getAllProject = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }

        const loggedInUser = await userModel.findOne({ email: req.user.email });
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const allUserProjects = await projectService.getAllProjectByUserId({ userId: loggedInUser._id });
        return res.status(200).json({ projects: allUserProjects });
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
    }
};

export const addUserToProject = async (req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    try{

        const {projectId, users}=req.body

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({
            project,
        })

    } catch(err){
        console.log(err)
        res.status(400).json({error:err.message})
    }
}