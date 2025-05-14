import pgPromise from "pg-promise";
const pgp = pgPromise();

const { DATABASE_URL, PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD, PG_PORT } =
  process.env;

const cn = DATABASE_URL
  ? {
      connectionString: DATABASE_URL,
      max: 30,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      host: PG_HOST,
      database: PG_DATABASE,
      user: PG_USER,
      password: PG_PASSWORD,
      port: PG_PORT,
    };

console.log(`=== DB Config Check: DATABASE_URL: ${DATABASE_URL}`);

let dbInstance = null;

const getDb = () => {
  if (!dbInstance) {
    console.log("Initializing new database connection pool...");
    dbInstance = pgp(cn);
  } else {
    console.log("Reusing existing database connection pool.");
  }
  return dbInstance;
};

export const db = getDb();
