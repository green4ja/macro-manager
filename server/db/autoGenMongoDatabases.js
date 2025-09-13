const mongodb = require('mongodb');
const mongodbUrl = process.env.MONGO_DB_URL || 'mongodb://localhost:27017';

const databaseNames = [
  {
    databaseName: 'MacroManager',
    collectionNames: ['recipes'],
  },
];

async function setupDatabase() {
  try {
    const client = await mongodb.MongoClient.connect(mongodbUrl);
    const currentDatabases = await client.db('admin').admin().listDatabases();
    const currentDatabaseNames = currentDatabases.databases.map(db => db.name);
    for(const database of databaseNames) {
      if(!currentDatabaseNames.includes(database.databaseName)) {
        const db = client.db(database.databaseName);
        for(const collection of database.collectionNames) {
          await db.createCollection(collection);
        }
        console.log(`Database ${database.databaseName} with collections ${database.collectionNames.join(', ')} created.`);
      } else {
        console.log(`Database ${database.databaseName} already exists.`);
      }
    }
    console.log('Database setup complete.');
    await client.close();
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();