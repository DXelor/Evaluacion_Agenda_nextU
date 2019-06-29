const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');//requiriendo el model Usuario

passport.use(new LocalStrategy({
  usernameField: 'name'
}, async (name, password, done) => {
  const users = await User.findOne({name: name});
  if(!users){
    return done (null, false, {message: 'Usuario no registrado.'});
  }else{
    const match = await users.matchPassword(password);
    if(match){
      return done(null, users);
    }else{
      return done(null, false, {message: 'contraseña incorrecta.'});
    }
  }
}));

passport.serializeUser((users, done)=>{
  done(null, users.id);
});

passport.deserializeUser((id, done)=>{
  User.findById(id, (err, users) =>{
    done(err, users);
  })
})