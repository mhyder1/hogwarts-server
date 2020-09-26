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
            favoriteSubject,
            house,
            user_id
        } = req.body;
        
        const newStudent = { 
            pronouns,
            pet,
            wandtype: wandType,
            wandcore: wandCore,
            favoritesubject: favoriteSubject,
            house,
            user_id
        };

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

studentRouter
    .route('/users/:user_id')
    .get((req, res, next) => {
    StudentService.getStudentsByUserId(
        req.app.get('db'),
        req.params.user_id
      )
        .then(students => {
          res.json(students)
        })
        .catch(next)
    })

studentRouter
    .route('/:student_id')
    .all((req, res, next) => {
        StudentService.getById (
            req.app.get('db'),
            req.params.student_id
        )
        .then(student => {
            if (!student) {
                return res.status(404).json({
                    error: {message: `student does not exist.`}
                });
            }
            res.student = student;
            next();
        })
        .catch(next);
    })
    .get((req, res, next) => {
        res.json(res.student);
    })
    .delete((req, res, next) => {
        StudentService.deleteStudent(
            req.app.get('db'),
            req.params.student_id
        )
        .then(() => {
            res.status(204).end();
        })
        .catch(next);
    })
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
//             req.params.student_id,
//             folderToUpdate
//         )
//             .then(numRowsAffected => {
//                 res.status(204).end();
//             })
//             .catch(next);
//     });

module.exports = studentRouter;