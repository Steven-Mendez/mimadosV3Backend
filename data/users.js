import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin',
    email: 'admin@mimados.com',
    password: bcrypt.hashSync('#adminMimados', 10),
    isAdmin: true,
  },
  {
    name: 'MJMENDEZ',
    email: 'maria.mendez@mimados.com',
    password: bcrypt.hashSync('#Mimados', 10),
    isAdmin: true,
  },
  {
    name: 'ACMENDEZ',
    email: 'alvaro.mendez@mimados.com',
    password: bcrypt.hashSync('#Mimados', 10),
  },
  {
    name: 'MFOVIEDO',
    email: 'mercedes.oviedo@mimados.com',
    password: bcrypt.hashSync('#Mimados', 10),
  },
  {
    name: 'SAMENDEZ',
    email: 'steven.mendez@mimados.com',
    password: bcrypt.hashSync('#Mimados', 10),
  },
  {
    name: 'JKCERNA',
    email: 'jhon.cerna@mimados.com',
    password: bcrypt.hashSync('#Mimados', 10),
  },
  {
    name: 'JDLOPEZ',
    email: 'jeannette.lopez@mimados.com',
    password: bcrypt.hashSync('#Mimados', 10),
  },
];

export default users;
