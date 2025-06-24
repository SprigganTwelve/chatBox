

async function checkAvailableMediaDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices()

    const hasVideoInput = devices.some( (device)=> device.kind === "videoinput" )
    const hasAudioInput = devices.some( (device) => device.kind === "audioinput" )

    return ({ hasAudioInput, hasVideoInput })
}

export { checkAvailableMediaDevices }