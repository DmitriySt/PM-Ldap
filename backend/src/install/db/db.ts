import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { dbConfig } from 'config/db.config';
const { db } = dbConfig();

const sequelize = new Sequelize(db.database, db.username, db.password, {
  dialect: db.dialect,
  host: db.host,
  port: db.port,
});

const umzug = new Umzug({
  migrations: {
    glob: __dirname + '/migrations/*.js',
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export type Migration = typeof umzug._types.migration;

export async function dbMigrate() {
  await umzug.up();
}
