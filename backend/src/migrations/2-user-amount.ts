export async function upgrade(queryFn: (query: string, values?: any[]) => Promise<Array<any>>) {
  await queryFn(`
    ALTER TABLE \`user\`
    ADD COLUMN \`amount\` integer NULL;
    `);
}
export async function downgrade(queryFn: (query: string, values?: any[]) => Promise<Array<any>>) {
  await queryFn(`ALTER TABLE \`user\` DROP COLUMN amount;`);
}
