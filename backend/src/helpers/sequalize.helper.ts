import sequelize from 'sequelize';

export function dateQuery(col: string, table?: string) {
  col = table ? `"${table}"."${col}"` : `"${col}"`;
  return sequelize.literal(
    `to_char(${col} AT TIME ZONE 'Europe/Moscow', 'dd.mm.YYYY HH24:mi')`,
  );
}
