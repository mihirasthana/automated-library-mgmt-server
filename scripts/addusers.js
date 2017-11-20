const db = require('../controllers/db');
const _ = require('lodash');
const faker = require('faker');
const passwordHasher = require('../controllers/util').passwordHasher;

const myuser = {
  id: 1,
  name: 'Mihir Asthana',
  username: 'mihir',
  password: passwordHasher('019019019'),
};
const NUM_USERS = 20;
const DEV_USERS = [myuser];

const users = DEV_USERS.concat(
  _.range(NUM_USERS).map(id => {
    const randomUser = faker.helpers.userCard();
    return {
      id: id + 2,
      username: randomUser.username,
      name: randomUser.name,
      password: passwordHasher(faker.internet.password()),
    };
  })
);
// TODO: write the generated passwords to a file
// Write users to db in a single transaction
db
  .tx(t => {
    const queries = users.map(user =>
      t.none(
        'INSERT INTO users(id, username, name, password) VALUES (${id}, ${username}, ${name}, ${password})',
        user
      )
    );
    return t.batch(queries);
  })
  .then(nSucc => console.log('Inserted %d.', nSucc.length))
  .catch(console.err);
