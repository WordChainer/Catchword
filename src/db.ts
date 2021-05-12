import Const from './const.json';
import mongoose from 'mongoose';

export default () => {
    let {
        MONGO_USER: user,
        MONGO_PASS: pass,
        MONGO_HOST: host,
        MONGO_PORT: port,
        MONGO_DATABASE: dababase
    } = Const;

    pass = encodeURIComponent(pass);

    async function connect() {
        let url = `mongodb://${user}:${pass}@${host}:${port}/${dababase}`;

        await mongoose.connect(url, {
            keepAlive: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(() => {
            console.log('Connected to mongodb');
        }).catch((err: Error) => {
            console.log('Failed to connect to mongodb: ');
            console.log(err);
        });
    }

    connect();
    mongoose.connection.on('disconnected', connect);
};
