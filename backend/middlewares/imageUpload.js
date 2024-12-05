const path = require('path')
const fs = require('fs')
const ApiError = require('../utils/apiError')

module.exports = function imageUpload(allowedExt) {
    return async function(req, res, next) {
        if (req.files) {

            if (Object.keys(req.files).length > 1) return next(new ApiError(`Only One Image Is allowed`, 500));
            
            let fileType = Object.keys(req.files)[0] // icon OR profilePhoto
            let image = req.files[fileType];

            if (fileType !== 'icon' && fileType !== 'profilePhoto') return next(new ApiError("Unacceptable Image", 500))
            
            // If Extention Allowed
            if (!allowedExt.includes(path.extname(image.name))) return next(new ApiError(`${path.extname(image.name)} Is not allowed`, 500));
        
            // If Size Is < 5MP
            const size = .5;
            const SIZE_IN_BYTES = size * 1024 * 1024;        

            if (image.size > SIZE_IN_BYTES) return next(new ApiError(`${image.name} Larger than ${size}MP`, 500))

            let fileName = image.name
            let filePath = getPath(fileType, fileName)
            let exist = fs.existsSync(filePath)
            while (exist) {

                let fileNameWithOutExt = fileName.slice(0, fileName.indexOf('.'))
                let fileExt = fileName.slice(fileName.indexOf('.'))
                
                fileNameWithOutExt += Math.floor( Math.random() * 10 + 1 );
                fileName = fileNameWithOutExt + fileExt;
                filePath = getPath(fileType, fileName)

                exist = fs.existsSync(filePath)
            }

            try {

                await image.mv(filePath)
                const serverUrl = req.protocol + "://" + req.headers.host + '/images/' + (fileType === 'icon' ? 'icons/' : 'profile/')
                req.body[fileType] = serverUrl + fileName;
            } catch (err) {
                return next(err)
            }
            
        }
    
        next()
    }

}

function getPath(fileType, fileName) {
    let subPath = fileType === 'icon' ? '/icons' : 
                    fileType === 'profilePhoto' ? '/profile' : '';
    return path.join(__dirname, `../uploads` + subPath, fileName)
}