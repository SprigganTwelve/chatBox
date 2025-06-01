

const fileToTextPromise = (file, reader) =>{
        return new Promise((resolve, reject)=>{
                reader.onload = ()=> resolve(reader.result)
                reader.onerror = ()=> reject(reader.error)
                reader.onabort = () => reject (new Error("Something went wrong"))
                reader.readAsDataURL(file)
        })
}

const convertFilesListIntoBase64 = async (array)=> {
        const convertedFilesArray = []
        const failedFilesNames = []
        const fileReader = new FileReader()
        for(const file of array){
            await fileToTextPromise(file, fileReader)
                    .then((result)=>{
                        convertedFilesArray.push(result)
                    })
                    .catch((error)=>{
                        console.log(error.message)
                        failedFilesNames.push(file.name)
                    });
        }
        array.length = 0
        array.push(...convertedFilesArray)
        return failedFilesNames
}

export { fileToTextPromise, convertFilesListIntoBase64 }