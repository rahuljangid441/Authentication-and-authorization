import fs from "node:fs"

fs.writeFile("Async.txt" , "I am writing using async file system",(err)=>{
    if(err){
        console.log('There is an error in writing the file',err);
    }

    console.log('File written sucessfully');
})

fs.readFile("Async.txt","utf-8",(err,data)=>{
    if(err){
        console.log('There is been an error in reading the file',err);
    }

    console.log('File has been read successfully',data);
});

fs.writeFile('Async.txt',"I am overwrting this",(err)=>{
    if(err){
        console.log('There is been error here',err);
    }
    console.log('File written successfully');
})

fs.appendFile('Async.txt',"\nthis will be appeneded to overwritten",(err)=>{
    if(err){
        console.log('There is been an error in appending the data',err)
    }

    console.log('Data has been appended successfully');
});

fs.mkdir("MyFolder",(err)=>{
    if(err){
        console.log('There is been an error in making the directory',err);
    }

    console.log('Directory has been made successfully');
})


fs.mkdir("MyFolderNeqqqw/newFile.txt",{recursive:true},(err)=>{
    if(err){
        console.log('There is been an error in making the directory',err);
    }

    console.log('Directory has been made successfully');
})


fs.rename("Async.txt","NewAsync.txt",(err)=>{
    if(err){
        console.log('There is been an error in renaming this file',err);
    }
})

fs.cp("NewAsync.txt","Copy.txt",(err)=>{
    if(err){
        console.log("dssdsds");
    }
})