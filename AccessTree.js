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
    removeUri(uri){
        let uriSplit = uri.split("/");
        uriSplit.shift();
        this.remove(uriSplit);
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
    remove(uriSplit){
       
        let runner = this._root;

        for (let x=0; x<uriSplit.length; x++){

            const segment = uriSplit[x];

            if (runner.children[segment]) {

                runner = runner.children[segment]

            } else {
                // runner is at the end of the tree
                console.log(runner)
                for (let i=uriSplit.length-1; i>1; i--){

                    const segment = uriSplit[i];

                    if (Object.keys(runner.children[segment].children).length === 0){
                        // take runner up the tree one level
                        runner = runner.parent;
                        // delete the child node
                        console.log(segment);
                        delete runner.children[segment];

                    } else {
                        break;
                    }

                }
            }
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