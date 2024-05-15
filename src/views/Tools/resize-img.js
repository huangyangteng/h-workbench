export const resizeImg = (file, maxWidth = 800) => {
    console.log('1. resizeImg -> file', file)

    return new Promise(resolve => {
        const reader = new FileReader()
        console.log('2 resizeImg -> reader', reader)
        reader.readAsDataURL(file)

        reader.onload = function(readerEvent) {
            console.log('3 reader onload')
            const image = new Image()
            image.src = readerEvent.target.result
            image.onload = function() {
                console.log('img onload')
                const canvas = document.createElement('canvas')
                let { width, height } = image
                // 保持比例，只限制横屏尺寸
                if (width > maxWidth) {
                    height = (height * maxWidth) / width
                    width = maxWidth
                }
                canvas.width = width
                canvas.height = height
                canvas.getContext('2d').drawImage(image, 0, 0, width, height)
                const dataURL = canvas.toDataURL('image/jpeg')
                const resizedImage = dataURLToBlob(dataURL)
                resolve(resizedImage)
            }
        }
    })
}

const dataURLToBlob = function(dataURL) {
    let BASE64_MARKER = ';base64,'
    let parts, contentType, raw
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        parts = dataURL.split(',')
        contentType = parts[0].split(':')[1]
        raw = parts[1]

        return new Blob([raw], { type: contentType })
    }

    parts = dataURL.split(BASE64_MARKER)
    contentType = parts[0].split(':')[1]
    raw = window.atob(parts[1])
    const rawLength = raw.length

    let uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
    }

    return new Blob([uInt8Array], { type: contentType })
}

export function blobToFile(theBlob, fileName) {
    if (theBlob instanceof Blob) {
        return new File([theBlob], fileName)
    }
    return null
}
