export async function upgrade(queryFn: (query: string, values?: any[]) => Promise<Array<any>>) {
  await queryFn(`
    CREATE TABLE IF NOT EXISTS \`user\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`wallet\` VARCHAR(80) NOT NULL,
      \`amount\` INT NOT NULL DEFAULT 1,
      \`signature\` VARCHAR(200) NULL,
      \`status\` INT NULL,
      \`createTime\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
      \`updateTime\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`));
  `);

  await queryFn(`
    CREATE UNIQUE INDEX \`wallet\` ON \`user\` (\`wallet\` ASC) VISIBLE;
  `);
}
export async function downgrade(queryFn: (query: string, values?: any[]) => Promise<Array<any>>) {
  await queryFn(`
    DROP TABLE IF EXISTS \`user\` ;
  `);
}
