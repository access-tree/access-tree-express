const Node = require("./tree/Node")
const endpointAccess = require("./middleware/endpointAccess")

function addNode(data, parentNode) {
    const encodedData = encodeRFC3986URIComponent(data);
    let node = new Node(encodedData);
    parentNode.children[encodedData] = node;
    node.parent = parentNode;
    //console.log(node);
    return node;
}
function encodeRFC3986URIComponent(str) {
    return encodeURIComponent(str).replace(
        /[!'()*]/g,
        (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
    );
}

class AccessTree {
    constructor(root) {
        let node = new Node(root);
        this._root = node;
    }
    endpointAccess(tree, level) {
        return endpointAccess(tree, level);
    }
    readUserFile(userData) {
        for (let uri of userData.paths) {
            try {
                this.addUri(uri);
            } catch (e) {
                console.log(e);
            }
        }
    }
    addUri(uri) {
        let uriSplit = uri.split("/");
        uriSplit.shift();
        this.add(uriSplit);
    }
    add(uriSplit) {
        let runner = this._root;
        while (uriSplit.length > 0) {
            const segment = uriSplit[0];
            if (runner.children[segment]) {
                runner = runner.children[uriSplit[0]]
            } else {
                const newNode = addNode(uriSplit[0], runner)
                runner = newNode;
            }
            uriSplit.shift();
        }
    }
    find(uriSplit) {
        let runner = this._root;
        while (uriSplit.length > 0) {
            const segment = uriSplit[0];
            if (runner.children[segment]) {
                runner = runner.children[uriSplit[0]]
            } else {
                uriSplit = [];
            }
            uriSplit.shift()
        }
        const permission = Object.keys(runner.children)
        if (permission.length === 1) {
            return permission[0]
        } else {
            return 0
        }
    }
    removeUser(user) {
        delete this._root.children[user]
    }
    listUsers() {
        return Object.keys(this._root.children);
    }
}
module.exports = AccessTree;