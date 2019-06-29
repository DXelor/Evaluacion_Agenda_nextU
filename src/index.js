//Requires
const express =  require('express'); // Módulo de enrutado
const path = require('path'); //Módulo para trabajar con directorios
const exphbs = require('express-handlebars'); //Motor de renderizacion
const methodO = require('method-override'); //Módulo que permite usar el PUT y DELETE
const bodyParser = require('body-parser'); //Módulo para interpretar datos JSON.

const session = require('express-session');//crea una (session)
const flash = require('connect-flash'); //modulo de alertas

const passport = require('passport'); //modulo de passport



//Init
const app = express();
require('./database');
require('./config/passport');

//Setings
app.set('port',process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); //establece el directorio para las vistas
app.engine('.hbs', exphbs({ //asigna express-handlebars como el motro de renderizado
    defaultLayout: 'main',//el archivo donde se cargaran todos los elementos
    layoutsDir: path.join(app.get('views'), 'layouts'), //directorio para layouts
    partialsDir: path.join(app.get('views'), 'partials'),//directorio para partials
    extname: '.hbs' //nombre de extencion para el motor de renderizado
}));
app.set('view engine', '.hbs');

//Middlewares

app.use(express.urlencoded({extended:false}));
app.use(methodO('_method'));
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); //middleware de alerta

//Variables Globales

app.use( (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');//muestra el mensaje de success
    //res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/agenda'));
app.use(require('./routes/users'));

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//server listen
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
});
