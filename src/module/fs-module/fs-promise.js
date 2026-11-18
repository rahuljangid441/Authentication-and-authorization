import fs from "node:fs/promises"

await fs.writeFile("a.txt","This is the content by me me me");

const data = await fs.readFile("a.txt","utf-8");

console.log('see',data);

await fs.cp("a.txt","b.txt");

await fs.unlink("a.txt");
