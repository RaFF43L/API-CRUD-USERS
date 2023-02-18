import mongoose from 'mongoose';

class Mongo {
  async conectar() {
    // const options: ConnectOptions = {
    //   sslCA: `${__dirname}/rds-combined-ca-bundle.pem`,
    // };

    try {
      await mongoose.connect('mongodb://localhost:27017/projeto');
      // await mongoose.connect('mongodb://db:27017/projeto'); // docker
      console.log('MONGO OK');
    } catch (error) {
      console.log(error);
    }
  }
}

const mongo = new Mongo();

export { mongo as MongoConnection };
