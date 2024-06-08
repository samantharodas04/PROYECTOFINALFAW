const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Importa la conexión a la base de datos

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Lógica para el registro  de usuarios
app.post('/register', (req, res) => {
  // Extrae email, name, birthdate, password y gender del cuerpo de la solicitud y los registra en la consola.
  const { email, name, birthdate, password, gender } = req.body;
  console.log('Received registration data:', req.body);
  //Consulta la base de datos para verificar si ya existe un usuario con el mismo correo electrónico.
  const existe = 'SELECT * FROM users WHERE email = ?';
  //Realiza una consulta a la base de datos para verificar si ya existe un usuario con el correo electrónico proporcionado (email).
  db.query(existe, [email], (err, result) => {
    //Aquí se está verificando si hay algún error (err) o si la longitud del resultado (result.length) es igual a cero. Esto indica que no se encontró ningún usuario con el mismo correo electrónico en la base de datos.
    if (err || result.length === 0) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      console.log('Hashed password:', hashedPassword);

      //Inserta un nuevo usuario en la base de datos y maneja errores o confirma el éxito.
      const query = 'INSERT INTO users (email, name, birthdate, password, gender) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [email, name, birthdate, hashedPassword, gender], (err, result) => {
        if (err) {
          console.error('Error inserting user into database:', err);
          res.status(500).send({ error: 'Registration failed', details: err });
        } else {
          console.log('User registered successfully:', result);
          res.status(200).send({ message: 'Registration successful' });
    }
      });
    } else {
      res.status(400).send({ error: 'Ya existe el correo.', details: "" });
    }
  });

});

// Lógica para el inicio de sesión de usuarios
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  //Consulta la base de datos para encontrar un usuario con el correo electrónico proporcionado.
  const query = 'SELECT * FROM users WHERE email = ?';
  //Realiza una consulta a la base de datos para verificar si ya existe un usuario con el correo electrónico proporcionado (email).
  db.query(query, [email], (err, result) => {
    //Aquí se está verificando si hay algún error (err) o si la longitud del resultado (result.length) es igual a cero. Esto indica que no se encontró ningún usuario con el mismo correo electrónico en la base de datos.
    if (err || result.length === 0) {
      console.error('Error fetching user from database or user not found:', err);
      res.status(401).send({ error: 'Login failed' });
    } else {
      //Si se encuentra el usuario, compara la contraseña proporcionada con el hash almacenado en la base de datos.
      console.log("codigo de usuario");
      const user = result[0];
      console.log(user);
      //Se usa la función compareSync de bcrypt para comparar la contraseña proporcionada (password)
      //con la contraseña almacenada en la base de datos (user.password). Esta función devuelve true si las contraseñas coinciden y false si no lo hacen.
      if (bcrypt.compareSync(password, user.password)) {
        //Si la comparación de contraseñas es exitosa, se genera un token JWT utilizando la función sign del módulo jsonwebtoken.
        //Este token contendrá el ID del usuario (user.id) como carga útil. Se utiliza una cadena 'your_jwt_secret' como la clave secreta para firmar el token.
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
        res.status(200).send({ message: 'Login successful', token, codigo: user['id'] });
      } else {
        res.status(401).send({ error: 'Login failed' });
      }
    }
  });
});


// Ruta para crear una nueva tarea
  app.post('/tarea', (req, res) => {
    //Extrae title, priority, description y user del cuerpo de la solicitud y los registra en la consola
    const { title, priority, description, user } = req.body;
    console.log('Received registration data:', req.body);
    //nserta una nueva tarea en la base de datos y maneja errores o confirma el éxito.
    const query = 'INSERT INTO tasks (title, priority, description, user_id) VALUES (?, ?, ?, ?)';
    db.query(query, [title, priority, description, user], (err, result) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        res.status(500).send({ error: 'Registration failed', details: err });
      } else {
        console.log('Task Saved successfuly:', result);
        res.status(200).send({ message: 'Task Saved successfuly' });
      }
    });
  });

  // Ruta ver la tarea
  app.get('/list/:id', (req, res) => {
    //Consulta la base de datos para obtener todas las tareas del usuario y maneja errores o envía los resultados.
    const query = `SELECT a.id, a.title, a.priority, a.description, a.date, user_id, a.status, b.name AS usuario FROM tasks a INNER JOIN users b ON a.user_id = b.id WHERE user_id = ${req.params.id}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching tasks from database:', err);
        res.status(500).send({ error: 'Failed to fetch tasks', details: err });
      } else {
        res.status(200).send(results);
      }
    });
  });

  app.delete('/deleteTask/:id', (req, res) => {
    //Elimina una tarea de la base de datos y maneja errores o envía los resultados.
    const query = `DELETE FROM tasks WHERE id = ${req.params.id}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching tasks from database:', err);
        res.status(500).send({ error: 'Failed to fetch tasks', details: err });
      } else {
        res.status(200).send(results);
      }
    });
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

