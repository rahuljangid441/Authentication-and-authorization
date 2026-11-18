import fs from "node:fs"

fs.writeFile("a.txt","Some content of a file",(err)=>{
    if(err){
        console.log('There is been an error in writing this file',err)
    }

    fs.cp("a.txt","b.txt",(err)=>{
        if(err){
            console.log('There is been an error in copying the file',err)
        }

        fs.unlink("a.txt",(err)=>{
            if(err){
                console.log("Delte",err)
            }
        })
    })
})

/**
 * See this is very bad to reading
 */

