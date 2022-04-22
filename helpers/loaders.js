const fs = require('fs');




module.exports.routes = (app) => {
    let directories = fs.readdirSync(`${appRootPath}/src/`)
    let endpoint_root
    for (dir of directories) {
        files = fs.readdirSync(`${appRootPath}/src/${dir}`)
        if (files.length > 0) {
            for (file of files) {
                if (file.includes('_route.js')) {
                    endpoint_root = file.substring(0, file.indexOf('_route'))
                    app.use(`/api/${endpoint_root}`, require(`../src/${dir}/${file}`));
                }
            }
        }
    }
}


module.exports.models = () => {
    let directories = fs.readdirSync(`${appRootPath}/src/`)
    for (dir of directories) {
        files = fs.readdirSync(`${appRootPath}/src/${dir}`)
        if (files.length > 0) {
            for (file of files) {
                if (file.includes('_model.js')) {
                    require(`${appRootPath}/src/${dir}/${file}`)
                }
            }
        }
    }
}