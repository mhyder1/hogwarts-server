const express = require('express');
const StudentService = require('./student-service');
const path = require('path');
// const xss = require('xss');

const studentRouter = express.Router();
const jsonParser = express.json();

studentRouter 
    .route('/')
    .get((req, res, next) => {
        StudentService.getAllStudents(
            req.app.get('db')
        )
      .then(students => {
        res.json(students);
      })
            .catch(next);
    }) 
    .post(jsonParser, (req, res, next) => {
        console.log(req.body)
        const {
            pronouns,
            pet,
            wandType,
            wandCore,
            favoriteSubject
        } = req.body;
        
        const newStudent = { 
            pronouns,
            pet,
            wandtype: wandType,
            wandcore: wandCore,
            favoritesubject: favoriteSubject
        };
        console.log(newStudent)

        for (const [key, value] of Object.entries(newStudent)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body.`}
                });
            }
        }

        StudentService.insertStudent(
            req.app.get('db'),
            newStudent
        )
        .then(student => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${student.id}`))
                .json(student);
        })
        .catch(next);
    });

// studentRouter
//     .route('/:folder_id')
//     .all((req, res, next) => {
//         console.log('hello world');
//         StudentService.getById (
//             req.app.get('db'),
//             req.params.folder_id
//         )
//             .then(folder => {
//                 if (!folder) {
//                     return res.status(404).json({
//                         error: {message: `Folder does not exist.`}
//                     });
//                 }
//                 res.folder = folder;
//                 next();
//             })
//             .catch(next);
//     })
//     .get((req, res, next) => {
//         res.json(serializeFolder(res.folder));
//     })
//     .delete((req, res, next) => {
//         StudentService.deleteFolder(
//             req.app.get('db'),
//             req.params.folder_id
//         )
//             .then(() => {
//                 res.status(204).end();
//             })
//             .catch(next);
//     })
//     .patch(jsonParser, (req, res, next) => {
//         const {folder_name} = req.body;
//         const folderToUpdate = {folder_name};

//         const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;

//         if (numberOfValues === 0) {
//             return res.status(400).json({
//                 error: {message: `Request body must contain a 'name.'`}
//             });
//         }

//         StudentService.updateFolder(
//             req.app.patch.get('db'),
//             req.params.folder_id,
//             folderToUpdate
//         )
//             .then(numRowsAffected => {
//                 res.status(204).end();
//             })
//             .catch(next);
//     });

module.exports = studentRouter;
