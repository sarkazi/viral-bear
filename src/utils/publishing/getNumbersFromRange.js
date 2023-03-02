

export const getNumbersFromRange = (rangeIdVideo) => {
   let arrId = []
   for (let i = +rangeIdVideo.from; i <= +rangeIdVideo.to; i++) {
      arrId.push(i)
   }
   return arrId
}

