import express from 'express'
import bodyParser from 'body-parser'
import mysql from 'mysql'
import { CONNREFUSED } from 'dns';
import { isNull } from 'util';
const app = express();
const port = 8080;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
}); 

const con = mysql.createConnection({
	host: 'localhost',
	user:'root',
	password: '1234',
	database: 'diplom',
	port: 3306
})
 
app.use(bodyParser.text()) 
app.use(bodyParser.json())


//get all data
app.get('/admin/start', (req, res)=> {
	console.log('request url: '+ req.url)

	const arrCourses = {}

	con.query('SELECT * FROM courses', (err, data)=>{
		if (err) {
			console.log(err);
		} else {
			const course = data.map((course)=>{
				return course.courseName 
			})
			arrCourses.course = course
		}
	})
	con.query('SELECT * FROM themes', (err, data)=>{
		if (err) {
			console.log(err);
		} else {
			const theme = data.map((theme)=>{
				return theme.theme 
			})
			arrCourses.theme = theme
		}
	})
	con.query('SELECT * FROM lessons', (err, data)=>{
		if (err) {
			console.log(err);
		} else {
			const lesson = data.map((lesson)=>{
				return lesson.lesson 
			})
			arrCourses.lesson = lesson
		}
	})
	con.query('SELECT * FROM qst', (err, data)=>{
		if (err) {
			console.log(err);
		} else {
			const qst = data.map((qst)=>{
				return qst.qst 
			})
			arrCourses.qst = qst
		}
	})
	con.query('SELECT * FROM test', (err, data)=>{
		if (err) {
			console.log(err);
		} else {
			const test = data.map((test)=>{
				return test.test 
			})
			arrCourses.test = test
		}
	})
	con.query('SELECT * FROM qstanswers', (err, data)=>{
		if (err) {
			console.log(err);
		} else {
			const qstAnswer = data.map((qAnswer)=>{
				return qAnswer.qstAnswer 
			})
			arrCourses.qstAnswer = qstAnswer
		}
	})
	con.query('SELECT * FROM testanswers', (err, data)=>{
		if (err) {
			console.log(err);
		} else {
			const testAnswer = data.map((testA)=>{
				return testA.testAnswer 
			})
			arrCourses.testAnswer = testAnswer
		}
		res.setHeader('Content-Type', 'application/json');
		res.send(arrCourses);
	})
})

app.post('/admin/addcourse', (req, res) =>{
	const course = req.body
	con.query('SELECT * FROM courses', (err, data) => {
		const arr = data.map((course)=> {
			return course.courseName
		})
		const empty = {
			statusEror: true,
			message:`Пустое значение`
		}
		const ok = {
			statusEror: false,
			message: `Добавлен ${course}`
		}
		const fail = {
			statusEror: true,
			message:`Ошибка, ${course} уже существует`
		}
		if (course === ' ' || course === '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		}
		let rule = false
		for (let i = 0; i < arr.length; i++) {
			if (course !== arr[i]) {
				rule = true
			} else {
				rule = false
				break
			}
		}
		if (rule) {
			con.query(`INSERT INTO courses (courseName, courseRating) VALUE("${course}", 0)`);
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		} 
	})
})

app.post('/admin/addtheme', (req, res) =>{
	const course = req.body
	con.query('SELECT * FROM courses', (err, data) => {
		const arr = data.map((course)=> {
			return course.courseName
		})
		const empty = {
			statusEror: true,
			massage:`Пустое значение`
		}
		const ok = {
			statusEror: false,
			massage: `Добавлен ${course}`
		}
		const fail = {
			statusEror: true,
			massage:`Ошибка, ${course} уже существует`
		}
		if (course === ' ' || course === '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		}
		let rule = false
		for (let i = 0; i < arr.length; i++) {
			if (course !== arr[i]) {
				rule = true
			} else {
				rule = false
				break
			}
		}
		if (rule) {
			con.query(`INSERT INTO courses (courseName, courseRating) VALUE("${course}", 0)`);
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		} 
	})
})

const server = app.listen(port, () => {
	console.log('Server is up and running on port ' + port)
});