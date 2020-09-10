const StudentService = {
    getAllStudents(knex) {
      return knex.select('*').from('students')
    },
    insertStudent(knex, newStudent) {
      return knex
        .insert(newStudent)
        .into('students')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    removeStudent(knex, id){
      return knex('students')
        .where({id})
        .delete()
    },
    getById(knex, id) {
      return knex.from('students').select('*').where('id', id).first()
    },
    // deleteFolder(knex, id) {
    //   return knex('folders')
    //     .where({ id })
    //     .delete()
    // },
    updateFolder(knex, id, newStudent) {
      return knex('students')
        .where({ id })
        .update(newStudent)
    },
  }
  
  module.exports = StudentService