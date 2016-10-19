var myray = ['.gitignore','index.js','package.json','readme.md'];

function getObjList(){
    var fileOjsList = [];
    for(var i = 0; i< myray.length; i++) {
      fileOjsList.push({
        file : myray[i]
      });
    }

    return fileOjsList;

};
console.log(getObjList())


var expectedUserFiles = [ { file_name: '.gitignore' },
  { file_name: 'index.js' },
  { file_name: 'package.json' },
  { file_name: 'readme.md' } ]

_.some(expectedUserFiles, { file_name: 'readme.md'  });
