// hello main.js
const AccessTree = require("../AccessTree");
const userData = require('./userData.json');
const express = require("express");
const cookieParser = require("cookie-parser");

let tree = new AccessTree("root");
tree.readUserFile(userData)
const app = express();
app.use(cookieParser());
app.use(express.json());

app.get(
    "/api/users/dogs/names",
    tree.endpointAccess(tree, "read"),
    (req, res) => {
        res.json({ message: "hello data" });
    }
);

app.get(
    "/api/home/data/chicken/legs/raw",
    tree.endpointAccess(tree, "write"),
    (req, res) => {
        res.json({ message: "hello users" });
    }
);

app.post("/api/data/people/things/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B",
    tree.endpointAccess(tree, "read"),
    (req, res) => {
        res.json({ message: "hello post" })
    }
);

app.post("/api/%E4%B8%A1/%E4%B9%93/%E4%B9%B6",
    tree.endpointAccess(tree, "read"),
    (req, res) => {
        res.json({ message: "hello pinyin" })
    }
);
// add endpoint to add paths
app.post("/api/add-endpoint",
    tree.endpointAccess(tree, "write"),
    (req, res) => {
        tree.addUri(req.body.uri)
        res.json({ message: "you just added an endpoint" })
    }
);
// add endpoint to remove a user
app.delete("/api/remove-user/:username",
    tree.endpointAccess(tree, "write"),
    (req, res) => {
        tree.removeUser(req.params.username);
        res.json({ message: "you just removed a user and their endpoints" })
    }
);

app.post("/api/test", (req, res) => {
    console.log(req.body);
    res.json({ message: "big test" })
})

app.get("/api/list-users", (req, res) => {
    const users = tree.listUsers();
    res.json({message: users})
})

app.listen(5000, () => {
    console.log("server up on 5000");
});