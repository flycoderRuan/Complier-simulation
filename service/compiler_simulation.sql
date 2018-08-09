create database if not exists compiler_simulation;
use compiler_simulation;


create table if not exists identity(
email varchar(50) NOT NULL,
identityCode char(6) NOT NULL,
style int NOT NULL,/*1为注册用，2为忘记密码 */
primary key (email)
)default charset=utf8 ;


/*select * from student_user;*/
create table if not exists student_user (
studentName varchar(30) NOT NULL,
studentID varchar(12) NOT NULL,
password varchar(30) NOT NULL,
email varchar(50) NOT NULL,
primary key (studentID)
)default charset=utf8 ;
/*增改查*/

CREATE TABLE IF NOT EXISTS user_collection (
    studentID VARCHAR(12) NOT NULL,
    collectionID INT NOT NULL auto_increment,
	collectionType int NOT NULL,
	data_content varchar(1200) NOT NULL,
    displayOrNot boolean NOT NULL,
	primary key(collectionID)
)  DEFAULT CHARSET=UTF8;
/*增删查*/
