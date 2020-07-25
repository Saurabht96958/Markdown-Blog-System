const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const route = require('./routers/route');
const methodOverride = require('method-override');
const app = express();
const PORT = 3000;

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static('public'));

//setting session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use('/', route);

const  db = require('./config/database');
db.authenticate()
.then(()=>{
  console.log('connection done');
})
.catch(err =>{
  console.log('connection failed: ',err);
});





app.listen(PORT, console.log('server is running'));
