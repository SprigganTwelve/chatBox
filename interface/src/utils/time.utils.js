
//modify all the dates inside an array by the formated one

function insertFormattedDateFromArray(data){
    if (data.length > 0) {
         for (const message of data) {
            insertFormattedDate(message)
         }
    }
}

// Format Date 

function insertFormattedDate(message){
    const isNotDate = (object) => Object.prototype.toString.call(object) !== "[Object Date]";

    const dateObj = isNotDate(message) ? new Date(message.createdAt ?? message.created_at) 
                    : message.createdAt ?? message.created_at;
 
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

    // Convert time (in seconds) to a human-readable format (hours-minutes-seconds)

const convertDuration = (time) => {
    if (!time) return null;

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60);

    return { hours, minutes, seconds };
};
    








export { insertFormattedDateFromArray, insertFormattedDate, convertDuration }