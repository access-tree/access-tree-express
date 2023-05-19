
const endpointAccess = (tree, level) => {
    return (req, res, next) => {
        try {
            const user = req.cookies.username;
            let path = req.originalUrl.split("/");
            path.shift()
            path.push(req.method)
            path.unshift(user);
            const paramsArray = Object.values(req.params);
            let newPath = []
            if (paramsArray.length > 0) {
                path.forEach(item => {
                    if (!paramsArray.includes(item)) {
                        newPath.push(item)
                    }
                })
            } else {
                newPath = path;
            }
            const accessPermission = tree.find(newPath);
            const read = (accessPermission > 3);
            const readWrite = (accessPermission > 4)

            if (level === "read") {
                if (read) {
                    next();
                } else {
                    next("no permission");
                }
            } else if (level === "write") {
                if (readWrite) {
                    next();
                } else {
                    next("no permission");
                }
            }
        } catch (error) {
            next(error);
        }
    };
}
module.exports = endpointAccess;