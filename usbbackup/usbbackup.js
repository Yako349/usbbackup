const drive = require('drivelist');
const zipper = require('easy-zip2').EasyZip;
const fs = require('fs');
const uploader = require('node-uploader');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var today = new Date().getTime();

rl.question('Which drive do you wanna backup? (ONLY LETTER, not case-sensitive) ', (answer) => {
    answer = answer.toUpperCase();
    drive.list(function (err, lista) {
        if (err) {
            throw err;
        }
        console.log(answer);
        for (var i in lista) {
            if (lista[i].mountpoint == answer + ':') {
                console.log('Drive found');
                console.log(lista[i]);
            }
        }
        var given = answer + '://';
        console.log(given);
    });
    setTimeout(putIn, 5000, rl);
});

function putIn(rl) {
    var ok = false;
    var zipFold = new zipper();
    rl.question('Where do you wanna save it? (Write path here) ', (given) => {
        given = given.toUpperCase();
        console.log('this may take a while...');
        fs.readdir(given, (err, list) => {
            console.log("looking for 'backups' folder (if not found will be created, don't worry)"); 
            if (err) {
                console.log(err);
            } else {
                for (var i in list) {
                    if (list[i] == 'backups') {
                        ok = true;
                        console.log("'backups' folder found!");
                    }
                }
                if (!ok) {
                    fs.mkdirSync(given + '\\backups');
                    console.log("'backups' folder created");
                }
            }
        });
        var oggi = new Date().getTime();
        oggi = '' + oggi;
        zipFold.zipFolder(given, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('zipping files');
                zipFold.writeToFile(given + '/backups/' + oggi + '.zip');
                console.log('saved as ' + oggi + '.zip');
                rl.close();
            }
        });
   
    });
    
}	
