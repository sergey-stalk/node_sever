import express from 'express'
import bodyParser from 'body-parser'
import mysql from 'mysql'
import { join } from 'path';
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
	port: 3306,
	insecureAuth : true
})
 
app.use(bodyParser.text()) 
app.use(bodyParser.json())


//get all data
app.get('/admin/start', (req, res)=> {
	/* console.log('request url: '+ req.url) */

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
		
	})
	con.query('SELECT * FROM themes', (err, data)=>{
		if (err) {
			console.log(err);
		} else {
			
			const ltheme = data.map((theme)=>{
				return {ltheme: theme.theme, lcourse:theme.courseName} 
			})
			arrCourses.ltheme = ltheme
		}
		res.setHeader('Content-Type', 'application/json');
		res.send(arrCourses);
	})
})

/*ADD COURSE NAME*/ 

app.post('/admin/addcourse', (req, res) =>{
	const course = req.body
	con.query('SELECT * FROM courses', (err, data) => {
		const arr = data.map((course)=> {
			return course.courseName
		})
		const empty = {
			statusEror: true,
			message:`Ошибка: пустое значение`
		}
		const ok = {
			statusEror: false,
			message: `Успешно: добавлен "${course}"`
		}
		const fail = {
			statusEror: true,
			message:`Ошибка: "${course}" уже существует`
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
			con.query(`INSERT INTO courses (courseName, rating) VALUE("${course}", 0)`);
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		} 
	})
})

//ADD THEME

app.post('/admin/addtheme', (req, res) =>{
	const theme = req.body.split(',')
	con.query(`SELECT * FROM themes`, (err, data) => {
		const arr = data.map((theme)=> {
			return theme.theme
		})

		const empty = {
			statusEror: true,
			message:`Ошибка: пустое значение`
		}
		const ok = {
			statusEror: false,
			message: `Успешно: добавлен "${theme[1]}"`
		}
		const fail = {
			statusEror: true,
			message:`Ошибка: "${theme[1]}" уже существует`
		}
		if (theme[1] === ' ' || theme[1] === '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		}
		let rule = false
		for (let i = 0; i < arr.length; i++) {
			if (theme[1] !== arr[i]) {
				rule = true
			} else {
				rule = false
				break
			}
		}
		if (rule) {
			con.query(`INSERT INTO themes (courseName, theme, rating) VALUE("${theme[0]}", "${theme[1]}", 0)`);
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		}
	})
})

//ADD LESSON

app.post('/admin/addlessons', (req, res) =>{
		const lesson = req.body.split('----')
		const empty = {
			statusEror: true,
			message:`Ошибка: пустое значение`
		}
		const ok = {
			statusEror: false,
			message: `Успешно: добавлен "${lesson[1]}"`
		}
		if (lesson[1] === ' ' || lesson[1] === '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		}
			con.query(`INSERT INTO lessons (theme, lesson) VALUE("${lesson[0]}", "${lesson[1]}")`);
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
})

//ADD QST

app.post('/admin/addqst', (req, res) =>{
	const qst = req.body.split(',')
	con.query(`SELECT * FROM qst`, (err, data) => {
		const arr = data.map((qst)=> {
			return qst.qst
		})
		const empty = {
			statusEror: true,
			message:`Ошибка: пустое значение`
		}
		const ok = {
			statusEror: false,
			message: `Успешно: добавлен "${qst[1]}"`
		}
		const fail = {
			statusEror: true,
			message:`Ошибка: "${qst[1]}" уже существует`
		}
		if (qst[1] === ' ' || qst[1] === '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		}
		let rule = false
		for (let i = 0; i < arr.length; i++) {
			if (qst[1] !== arr[i]) {
				rule = true
			} else {
				rule = false
				break
			}
		}
		if (rule) {
			con.query(`INSERT INTO qst (theme, qst, rating) VALUE("${qst[0]}", "${qst[1]}", 0)`);
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		}
	})
})

//ADD TEST

app.post('/admin/addtest', (req, res) =>{
	const test = req.body.split(',')
	con.query(`SELECT * FROM test`, (err, data) => {
		const arr = data.map((test)=> {
			return test.test
		})
		const empty = {
			statusEror: true,
			message:`Ошибка: пустое значение`
		}
		const ok = {
			statusEror: false,
			message: `Успешно: добавлен "${test[1]}"`
		}
		const fail = {
			statusEror: true,
			message:`Ошибка: "${test[1]}" уже существует`
		}
		if (test[1] === ' ' || test[1] === '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		}
		let rule = false
		for (let i = 0; i < arr.length; i++) {
			if (test[1] !== arr[i]) {
				rule = true
			} else {
				rule = false
				break
			}
		}
		if (rule) {
			con.query(`INSERT INTO test (theme, test) VALUE("${test[0]}", "${test[1]}")`);
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		}
		rule = false;
	})
})

//ADD QST ANSWER

app.post('/admin/addqstanswer', (req, res) =>{
	const qa = req.body.split(',')
	con.query(`SELECT * FROM qstanswers`, (err, data) => {
		const arr = data.map((qa)=> {
			return qa.qstAnswer
		})
		const empty = {
			statusEror: true,
			message:`Ошибка: пустое значение`
		}
		const ok = {
			statusEror: false,
			message: `Успешно: добавлен "${qa[1]}"`
		}
		const fail = {
			statusEror: true,
			message:`Ошибка: "${qa[1]}" уже существует`
		}
		if (qa[1] === ' ' || qa[1] === '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		}
		/* let rule = false
		for (let i = 0; i < arr.length; i++) {
			if (qa[1] !== arr[i]) {
				rule = true
			} else {
				rule = false
				break
			}
		} */
		// if (rule) {
			con.query(`INSERT INTO qstanswers (qst, qstAnswer, rqst) VALUE("${qa[0]}", "${qa[1]}", "${qa[2]}")`);
			res.setHeader('Content-Type', 'application/json');
			res.send(ok) 
		/* } else { 
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		} 
		rule = false; */
	})
})

//ADD TEST ANSWER

app.post('/admin/addtestanswer', (req, res) =>{
	const ta = req.body.split(',')
	con.query(`SELECT * FROM testanswers`, (err, data) => {
		const arr = data.map((ta)=> {
			return ta.testAnswer
		})
		const empty = {
			statusEror: true,
			message:`Ошибка: пустое значение`
		}
		const ok = {
			statusEror: false,
			message: `Успешно: добавлен "${ta[1]}"`
		}
		const fail = {
			statusEror: true,
			message:`Ошибка: "${ta[1]}" уже существует`
		}
		if (ta[1] === ' ' || ta[1] === '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		}
		/* let rule = false
		for (let i = 0; i < arr.length; i++) {
			if (ta[1] !== arr[i]) {
				rule = true
			} else {
				rule = false
				break
			}
		}
		if (rule) { */
			con.query(`INSERT INTO testanswers (test, testAnswer, rtest) VALUE("${ta[0]}", "${ta[1]}", "${ta[2]}")`);
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
		/* } else {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		}
		rule = false; */
	})
})

//SHOW LESSONS

app.post('/admin/showlesson', (req, res) =>{
	con.query(`SELECT lesson FROM lessons WHERE theme='${req.body}'`, (err, data) => {
		const empty = {
			statusEror: true,
			message:`Ошибка: Лекции не существует`
		}
		if (data == '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send([data[0].lesson])
		}
	})
})

//SHOW QUEST

app.post('/admin/showquest', (req, res) =>{
	con.query(`SELECT qstAnswer, rqst  FROM qstAnswers WHERE qst='${req.body}'`, (err, data) => {

		const empty = {
			statusEror: true,
			message:`Ошибка: Ответа не существует`
		}
		if (data == '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(data)
		}
	})
})

//SHOW TEST

app.post('/admin/showtest', (req, res) =>{
	con.query(`SELECT testAnswer, rtest  FROM testAnswers WHERE test='${req.body}'`, (err, data) => {

		const empty = {
			statusEror: true,
			message:`Ошибка: Ответа не существует`
		}
		if (data == '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
			return;
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(data)
		}
	})
})

//DELETE ALL

app.post('/admin/delete', (req, res) =>{
	const reqArr = req.body.split(',')
	con.query(`DELETE FROM ${reqArr[0]} WHERE ${reqArr[2]}='${reqArr[1]}'`, (err, data) => {
		const empty = {
			statusEror: true,
			message:`Ошибка: Лекции не существует`
		}
		const ok = {
			statusEror: false,
			message: `Успешно: Удалено "${reqArr[1]}"`
		}
		if (reqArr[0] == 'lessons') {
			con.query(`SELECT lesson FROM lessons WHERE theme = '${reqArr[1]}'`, (err, data)=>{
				if (data == '') {
					res.setHeader('Content-Type', 'application/json');
					res.send(empty)
				}
			})
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
		}
	})
})

//REGISTRATION

app.post('/registration', (req, res) =>{
	const reqArr = req.body.split(',')
	con.query(`SELECT login FROM users`, (err, data) => {
		const empty = {
			statusEror: true,
			message:`Ошибка: заполните все поля`
		}
		const ok = {
			statusEror: false,
			message: `Пользователь создан "${reqArr[0]}", теперь вы можите войти`
		}
		const fail = {
			statusEror: true,
			message:`Ошибка: "${reqArr[0]}" уже существует`
		}
		const login = data.map((el)=>{
			return el.login
		})
		
		let rule = false
		for (let i = 0; i < login.length ; i++) {
			
			if (reqArr[0] != login[i]) {
				rule = true
			} else {
				rule = false
				break
			}
		}
		
		if (reqArr[2] !== reqArr [3]) {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		} else if (reqArr[0] == '' || reqArr[1] == '' || reqArr[2] == '' || reqArr[3] == '' || reqArr[0] == ' ' || reqArr[1] == ' ' || reqArr[2] == ' ' || reqArr[3] == ' ' || reqArr[0] == '  ' || reqArr[1] == '  ' || reqArr[2] == '  ' || reqArr[3] == '  ') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
		} else if(rule) {
			con.query(`INSERT INTO users (login, password, groupe) VALUE("${reqArr[0]}", "${reqArr[2]}", "${reqArr[1]}")`)
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		}
		
	})
})

//ENTER

app.post('/enter', (req, res) =>{
	const reqArr = req.body.split(',')
	con.query(`SELECT password FROM users WHERE login="${reqArr[0]}"`, (err, data) => {
	
		const arrPass = data.map((el)=> {
			return el.password
		}) 
		const empty = {
			statusEror: true,
			message:`Ошибка: заполните все поля`
		}
		const ok = {
			statusEror: false,
			message: `Добро пожаловать ${reqArr[0]}`
		}
		const fail = {
			statusEror: true,
			message:`Ошибка: не верный логин или пароль`
		}
		if (data == '') {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		} else if (data[0].password != reqArr[1]) {
			res.setHeader('Content-Type', 'application/json');
			res.send(fail)
		} else if (reqArr[0] == '' || reqArr[0] == ' ' || reqArr[0] == '  ' || reqArr[1] == '' || reqArr[1] == ' ' || reqArr[1] == '  ') {
			res.setHeader('Content-Type', 'application/json');
			res.send(empty)
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(ok)
		}
	})
})

app.post('/getreeting', (req, res) =>{
	con.query(`SELECT courseName FROM courses`, (err, data) =>{
		const course = data.map((el)=>{
			return el.courseName
		})
		res.setHeader('Content-Type', 'application/json');
		res.send(course)
	})
	
})

app.post('/addcourse', (req, res) =>{
	const reqArr = req.body.split(',')
	con.query(`SELECT * FROM usercourse`, (err, data) =>{
		const course = data.map((el)=>{
			return el.course
		})

		let rule = false
		 for (let i = 0; i < course.length ; i++) {
			if (reqArr[0] != course[i]) {
				rule = true
			} else {
				rule = false
				break
			}
		}
		if (rule) {
			console.log('add')
			con.query(`INSERT INTO usercourse (login, course, testing, completing) VALUE("${reqArr[1]}", "${reqArr[0]}", "0", "0")`)
		} 
	})
})
	

app.post('/gettesting', (req, res) =>{
	const reqArr = req.body.split(',')
	con.query(`SELECT testing FROM usercourse WHERE course="${reqArr[1]}"`, (err, data)=>{
		let body = []
		if (data[0].testing == '0') {
			con.query(`SELECT * FROM qstanswers`, (err, data)=>{
				body[1] = data
			})
			con.query(`SELECT * FROM qst`, (err, data)=>{
				body[0] = data.map((el)=>{
					return el.qst
				})
				body[2] = data.map((el)=>{
					return el.theme
				})
				res.setHeader('Content-Type', 'application/json');
				res.send(body)
			})
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.send(['redirect'])
		}
	})
})

app.post('/endtesting', (req, res) =>{
	const reqArr = req.body.split(',')
	con.query(`UPDATE usercourse SET testing="1" WHERE course="${reqArr[1]}"`)
	con.query(`SELECT theme FROM themes`, (err, data)=>{
		const theme = data.map((el)=>{
			return el.theme
		})
		const r = Number(reqArr[0])
		if (r !== 0) {
			const stheme = theme.splice(0, r)
			stheme.forEach(element => {
				con.query(`SELECT theme FROM usersthemes`, (err, data)=>{
					const theme = data.map((el)=>{
						return el.theme
					})
					theme.forEach((element1, i) => {
						if (element1 != theme[i]) {
							console.log('addr')
							con.query(`INSERT INTO usersthemes (course, theme) VALUE("${reqArr[1]}", "${element1}")`)
						}
					});
				})
			});
		} else {
			con.query(`SELECT theme FROM usersthemes`, (err, data)=>{
				const theme = data.map((el)=>{
					return el.theme
				})
				theme.forEach((elemen,i)  => {
					if (elemen != theme[i]) {
						theme.forEach(element => {
							console.log('addr')
							con.query(`INSERT INTO usersthemes (course, theme) VALUE("${reqArr[1]}", "${element}")`)
						});
					}
				});
			})
			
		}
	})
	res.setHeader('Content-Type', 'application/json');
	res.send(['redirect'])
})

app.post('/givelesson', (req, res) =>{
	const reqArr = req.body.split(',')
	con.query(`SELECT theme FROM usersthemes`, (err, data)=>{
		const theme = data.map((el)=>{
			return el.theme
		})
		const selecttheme = theme[0]
		con.query(`SELECT lesson FROM lessons WHERE theme="${selecttheme}"`, (err, data)=>{
			const lesson = data.map((el)=>{
				return el.lesson
			})
			res.setHeader('Content-Type', 'application/json');
			res.send(lesson)
		})
	})

	
})



const server = app.listen(port, () => {
	console.log('Server is up and running on port ' + port)
});