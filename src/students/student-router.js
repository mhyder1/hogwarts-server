const express = require('express');
const StudentService = require('./student-service');
const path = require('path');
// const xss = require('xss');

const studentRouter = express.Router();
const jsonParser = express.json();


const serializeStudent = (student) => ({
    id: String(student.id)
  });

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
            house
        } = req.body;
        
        const id = uuid();
        const newStudent = { 
            id,
            pronouns,
            pet,
            wandtype: wandType,
            wandcore: wandCore,
            favoritesubject: favoriteSubject,
            house
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
                        error: {message: `Student does not exist.`}
                    });
                }
                res.student = student;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeStudent(res.student));
    })
    .delete((req, res, next) => {
        StudentService.removeStudent(
            req.app.get('db'),
            req.params.student_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const {student_id} = req.body;
        const studentToUpdate = {student_id};

        const numberOfValues = Object.values(studentToUpdate).filter(Boolean).length;

        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {message: `Request body must contain a 'name.'`}
            });
        }

        StudentService.updateStudent(
            req.app.patch.get('db'),
            req.params.student_id,
            studentToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = studentRouter;
