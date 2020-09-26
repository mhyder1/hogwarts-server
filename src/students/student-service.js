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
  getStudentsByUserId(db, user_id) {
    return db
    .from('students')
    .where('user_id', user_id)
    .select('*')
  },
  getById(knex, id) {
    return knex.from('students').select('*').where('id', id).first()
  },
  deleteStudent(knex, id) {
    return knex('students')
      .where({ id })
      .delete()
  },
  // updateFolder(knex, id, newStudentFields) {
  //   return knex('folders')
  //     .where({ id })
  //     .update(newStudentFields)
  // },
}

module.exports = StudentService