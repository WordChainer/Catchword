const mongoose = require('mongoose');
const WordModel = require('./models/Word.js');

module.exports = () => {
    let {
        MONGO_USER: user,
        MONGO_PASS: pass,
        MONGO_HOST: host,
        MONGO_PORT: port,
        MONGO_DATABASE: dababase
    } = process.env;

    pass = encodeURIComponent(pass);

    async function connect() {
        let url = `mongodb://${user}:${pass}@${host}:${port}/${dababase}`;

        try {
            await mongoose.connect(url, {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            });

            console.log('Connected to mongodb');
        } catch (e) {
            console.log('Failed to connect to mongodb: ');
            console.log(e);
        }
    }

    connect();
    mongoose.connection.on('disconnected', connect);
};
