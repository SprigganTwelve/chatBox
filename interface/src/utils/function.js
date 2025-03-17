
function insertFormattedDateFromArray(data){
    if (data.length > 0) {
         for (const message of data) {
            insertFormattedDate(message)
         }
    }
 }

function insertFormattedDate(message){
    const isNotDate = (object) => Object.prototype.toString.call(object) !== "[Object Date]";

    const dateObj = isNotDate(message) ? new Date(message.createdAt) : message.createdAt;
 
             if (isNaN(dateObj.getTime())) {
                 console.warn(`Date invalide: ${message.createdAt}`);
             }
             const formattedDate = new Intl.DateTimeFormat("fr-FR", {
                 year: "numeric",
                 month: "2-digit",
                 day: "2-digit",
                 hour: "2-digit",
                 minute: "2-digit",
                 second: "2-digit",
                 hour12: false
             }).format(dateObj);
 
             const formattedHours = new Intl.DateTimeFormat("fr-FR", {
                 hour: "2-digit",
                 minute: "2-digit",
                 hour12: false
             }).format(dateObj);
             
             message.date = dateObj;
             message.formattedDate = formattedDate;
             message.formattedHours = formattedHours;
}



const getCroppedImage = (fileUrl, croppedAreaPixels, rotation = 0) => {
    const image = new Image()
    image.src = fileUrl
    return new Promise(( resolve, reject )=>{
        image.onload = ()=>{
            const canvas = new document.createElement('canvas')
            const ctx = canvas.getContext('2d')
    
            const { x, y, width, height } = croppedAreaPixels;
            
            ctx.rotate((rotation * Math.PI) / 180);
    
            ctx.drawImage(image, x, y, width, height, 0, 0, width, height )
    
            canvas.toBlob((blob)=>{
                const file = new File([blob], Date.now() + '.jpeg' , {lastModified: Date.now(), type: 'image/jpeg'}  )
                resolve({file})
            }, 'image/jpeg')
        }
        image.onerror = reject
    })
}



export { insertFormattedDateFromArray, insertFormattedDate, getCroppedImage }