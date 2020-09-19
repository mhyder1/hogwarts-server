const app = require('../src/app')
const { expect } = require('chai');
const supertest = require('supertest');
const knex = require('knex');
const StudentService = require('../src/students/student-service');



describe('Students service object', () => {
  let db;

  const testStudents = [
    {
      id: 1,
      pronouns: 'She/Her',
      pet: 'Owl',
      wandType: 'Ash',
      wandCore: 'Dragon',
      favoriteSubject: 'Flying'
    },
    {
      id: 2,
      pronouns: 'He/Him',
      pet: 'Cat',
      wandType: 'Birch',
      wandCore: 'Unicorn',
      favoriteSubject: 'Herbology'
    },
    {
      id: 3,
      pronouns: 'They/Them',
      pet: 'Toad',
      wandType: 'Alder',
      wandCore: 'Phoenix',
      favoriteSubject: 'Astronomy'
    },
  ];

  
  before('setup db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL || 'postgresql://hogwarts\@localhost/headmaster-test'
    });
  });

  before('clean db', () => db('students').truncate());

  afterEach('clean db', () => db('students').truncate());


  after('destroy db connection', () => db.destroy());

  describe('getAllStudents()', () => {
    it('returns an empty array', () => {
      return StudentService
        .getAllStudents(db)
        .then(students => expect(students).to.eql([]));
    });
    context('with data present', () => {
      beforeEach('insert test students', () =>
        db('students')
          .insert(testStudents)
      );

      it('returns all test students', () => {
        return StudentService
          .getAllStudents(db)
          .then(students => expect(students).to.eql(testStudents));
      });
    });
  });

  describe('insertStudent()' , () => {
    it('inserts record in db and returns student with new id', () => {
      const newStudent = {
        id: 3,
        pronouns: 'She/Her',
        pet: 'Owl',
        wandType: 'Ash',
        wandCore: 'Dragon',
        favoriteSubject: 'Flying'
      };

      return StudentService.insertStudent(db, newStudent)
        .then(actual => {
          expect(actual).to.eql({
            id: 4,
            pronouns: 'She/Her',
            pet: 'Owl',
            wandType: 'Ash',
            wandCore: 'Dragon',
            favoriteSubject: 'Flying'
          });
        });
    });


    it('throws not-null constraint error if pet not provided', () => {      
      const newStudent = {
        id: 1,
        pronouns: 'She/Her',
        wandType: 'Alder',
        wandCore: 'Phoenix',
        favoriteSubject: 'Astronomy',
      };


      return StudentService 
        .insertStudent(db, newStudent)
        .then(
          () => expect.fail('db should throw error'),
          err => expect(err.message).to.include('not-null')
        );
    });
  });

  describe('getById()', () => {
    it('should return undefined', () => {
      return StudentService
        .getById(db, 999)
        .then(student => expect(student).to.be.undefined);
    });

    context('with data present', () => {
      before('insert students', () => 
        db('students')
          .insert(testStudents)
      );

      it('should return existing article', () => {
        const expectedStudentId = 3;
        const expectedStudent = testStudents.find(a => a.id === expectedStudentId);
        return StudentService.getById(db, expectedStudentId)
          .then(actual => expect(actual).to.eql(expectedStudent));
      });
    });
  });

  describe('deleteStudent()', () => {
    it('should return 0 rows affected', () => {
      return StudentService
        .deleteStudent(db, 999)
        .then(rowsAffected => expect(rowsAffected).to.eq(0));
    });

    context('with data present', () => {
      before('insert students', () => 
        db('students')
          .insert(testStudent)
      );

      it('should return 1 row affected and record is removed from db', () => {
        const deletedStudentId = 1;

        return StudentService
          .deleteArticle(db, deletedStudentId)
          .then(rowsAffected => {
            expect(rowsAffected).to.eq(1);
            return db('students').select('*');
          })
          .then(actual => {
            const expected = testStudents.filter(a => a.id !== deletedStudentId);
            expect(actual).to.eql(expected);
          });
      });
    });
  });
});