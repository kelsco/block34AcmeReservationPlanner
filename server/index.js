const { client } = require('./db');

const init = async() => {
    console.log('connecting to db');
    await client.connect();
    console.log('connected to db');
}

init();