
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

 export { insertFormattedDateFromArray, insertFormattedDate }