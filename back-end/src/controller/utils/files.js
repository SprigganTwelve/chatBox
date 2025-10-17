
function chatFileRepository(fileType){
        let folder = 'documents';
        if (fileType.includes('image')) folder = 'photos';
        else if (fileType.includes('video')) folder = 'videos';
        else if (fileType.includes('audio')) folder = 'audios';
        return folder;
}


module.exports = { chatFileRepository }