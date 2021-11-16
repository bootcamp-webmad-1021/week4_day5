## AUTH

Para la autenticación necesitamos principalmente dos apartados. La configuración de sesión que gestionará tanto las cookies en cliente como la sesión en servidor y encriptar la contraseña.

### session.config

  - Para gestionar las sesiones vamos a apoyarnos en las dependencias de express-session y connect-mongo.
  - No olvidéis añadir el SESS_SECRET y el MONGODB_URI en el .env
  - La configuración básica de sesión es:

  ```js
    const session = require('express-session');    
    const MongoStore = require('connect-mongo');   
    const mongoose = require('mongoose');

    module.exports = app => {
      app.set('trust proxy', 1);
      app.use(
        session({
          secret: process.env.SESS_SECRET,
          resave: true,
          saveUninitialized: false,
          cookie: {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
          },
          store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
        })
      );
    };
  ```

### bcrypt

  - Para encriptar las contraseñas de usuario usaremos la dependencia bcrypt.

  ```js   
      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      
      const hashPass = bcrypt.hashSync(password, salt) //Contraseña hasheada
  ```

## Modelos relacionados

Si necesitamos relacionar modelos entre sí hemos de tener presente el tipo de relación que tienen (one to one, one to many o many to many).

Si es un one to one la sintaxis del *esquema* sería:

  ```js 
    //Varios ejemplos
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
    DNI: { type: Schema.Types.ObjectId, ref: 'Document' },
    bestFriend: { type: Schema.Types.ObjectId, ref: 'User' },
  ```

Si es one to many o many to many:

  ```js 
    //Varios ejemplos
    authors: [ { type: Schema.Types.ObjectId, ref: 'Author' } ],
    documents: [ { type: Schema.Types.ObjectId, ref: 'Document' } ],
    friends: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
  ```

### Populate

A la hora de realizar una búsqueda en la BD podemos popular estos campos mediante el método populate. Si quisieramos ver los amigos de un usuario podríamos hacer:

  ```js
    User.findById(id)
      .populate("friends")
      .then(userWithFriendsPopulated => /*...*/)
      .catch(err => /*...*/)
  ```