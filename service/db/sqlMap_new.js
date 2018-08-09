var sqlMap_new = {
    student_user: {
        add: 'insert into student_user (studentName, studentID, password, repeatPass) values (?,?,?,?)',
        select_name: 'select * from student_user',
        update_user: 'update student_user set'
    }
}

module.exports = sqlMap_new;
