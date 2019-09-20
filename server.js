const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const register = require('./controllers/register');
const signin = require("./controllers/signin");
const image = require("./controllers/image");

const db = knex({
	client: 'pg',
	connection: {
		host:'127.0.0.1',
		user: 'postgres',
		password: 'mikearo',
		database: 'smart-brain'
	}
})


const app = express();

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res)=>{ res.send(database.users) })

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)}) //dependency injection

app.get("/profile/:id", (req, res) =>{
	const {id} = req.params;
	db.select('*').from('users').where({id})
		.then(user => {
			if(user.length){
				res.json(user[0]);
			} else{
				res.status(400).json("Not found")
			}
		})
		.catch(err => res.status(400).json("Not found"));
})
 
app.put("/image", (req, res) => {image.handleImage(req, res, db)})

app.post("/imageUrl", (req, res) => {image.handleApiCall(req, res)})


app.listen(3000, ()=> {
	console.log('App is running on port 3000');
})