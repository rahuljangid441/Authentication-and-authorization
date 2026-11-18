import fs, { mkdirSync } from "node:fs"

// fs.writeFileSync('test.txt',"Hello from fs");


// const data = fs.readFileSync('test.txt' , "utf-8");
// console.log(data);

/**
 * Some data is written in test.txt so if we write something it will overrite it
 */


// fs.writeFileSync('test.txt',"\nHello from fs over write");

// fs.appendFileSync('test.txt',"\nasathis will be appended dekhsssso")

// fs.mkdirSync("MyFolder");
// fs.mkdirSync("MyNewFolder/test2.txt",{
//     recursive:true
// })

// fs.unlinkSync('test.txt');
fs.writeFileSync('test.txt',"Hey what's up");
fs.renameSync('test.txt',"newTest.txt");

fs.cpSync("newTest.txt","CopyTest.txt");

//**
// to delete a folder */
fs.rmdirSync("MyFolder");