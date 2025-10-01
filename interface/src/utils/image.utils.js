

// cut / crop an image based on a defined pixels area


const getCroppedImage = (fileUrl, croppedAreaPixels, rotation = 0) => {
    const image = new Image()
    image.src = fileUrl
    return new Promise(( resolve, reject )=>{
        image.onload = ()=>{
            const canvas =  document.createElement('canvas')

            const ctx = canvas.getContext('2d')
    
            const { x, y, width, height } = croppedAreaPixels;
            canvas.width = width;
            canvas.height = height;
            
            ctx.rotate((rotation * Math.PI) / 180);
    
            ctx.drawImage(image, x, y, width, height, 0, 0, width, height )
    
            canvas.toBlob((blob)=>{
                const file = new File([blob], Date.now() + '.jpeg' , {lastModified: Date.now(), type: 'image/jpeg'}  )
                resolve(file)
            }, 'image/jpeg')
        }
        image.onerror = reject
    })
}


export { getCroppedImage }