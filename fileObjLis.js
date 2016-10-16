var myray = ['.gitignore','index.js','package.json','readme.md'];

var fileOjsList = {};

function getObjList(){
for(var i = 0; i< myray.length; i++) {     
        var file = myray[i];
    
        if(fileOjsList.file === undefined){
            myray[i] = fileOjsList['file'];
         }    
        };
    console.log(fileOjsList)
    return fileOjsList;

};
getObjList()
