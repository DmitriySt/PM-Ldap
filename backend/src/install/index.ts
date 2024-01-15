import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import { dbMigrate } from './db/db';

export async function install() {
  await dbMigrate();
}
