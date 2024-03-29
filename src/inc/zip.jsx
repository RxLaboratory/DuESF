/**
    * Zip methods. This lib needs the 7zip command line tool <code>7za.exe</code> to be located next to the script on Windows.
    * @namespace
    * @category DuESF
    */
var DuZip = {};

if ( DuSystem.win ) DuZip.processArgs = ['a', '-mx9'];
else DuZip.processArgs = ['-r', '-X'];

/**
 * The path to 7za.exe or 7z.exe (windows only, mac uses the internal command 'zip')
 * @memberof DuZip
 * @type {string}
 */
DuZip.processPath = '';

if ( DuSystem.win ) DuZip.processPath = DuESF.file.parent.absoluteURI + '/7za.exe';
else DuZip.processPath = 'zip';

/**
 * Compresses the content of a folder
 * @memberof DuZip
 * @method
 * @param {Folder} folder The folder to zip
 * @param {string} [archiveName=folder.name + ".zip"] The archive name
 * @param {boolean} [wipeFolder=false] Set to true to remove the original folder as soon as the zip is ready
 * @return {File} The zip file
 */
DuZip.compressFolderContent = function (folder, archiveName, wipeFolder) {
    wipeFolder = def (wipeFolder, true);
    archiveName = def(archiveName, DuPath.getName(folder) + ".zip");
    if (archiveName == '') archiveName = folder.name + ".zip";

    var folderPath = folder.fsName;
    if (DuSystem.win) folderPath += "\\*";

    var args = DuZip.processArgs.concat( [folder.parent.fsName + "/" + archiveName, folderPath ] );

    if ( DuSystem.win && !new File(DuZip.processPath).exists ) {
        alert("7zip not found. Cannot zip folder: " + folder.fsName);
        return null;
    }

    var processes = [ new DuProcess(DuZip.processPath, args) ];

    if (wipeFolder) {
        var wipeProcessPath = '';
        var wipeProcessArgs = [];
        if (DuSystem.win) {
            wipeProcessPath = 'rmdir';
            wipeProcessArgs = [ '/Q', '/S', folder.fsName];
        }
        else {
            wipeProcessPath = 'rmdir';
            //TODO test on mac. For safety, set to interactive mode. change the flags to '-rf' when tests are run succesfully
            wipeProcessArgs = [ '-ir', folder.fsName];
        }
        processes.push( new DuProcess( wipeProcessPath, wipeProcessArgs ) );
    }

    var processQueue = new DuProcessQueue(processes);
    processQueue.start();

    return new File( folder.parent.fsName + "/" + archiveName );
}