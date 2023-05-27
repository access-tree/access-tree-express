# Access Tree Express

### A library to provide access restrictions on express.js endpoints

## How does it work ? 

1. User to endpoint mappings are ingested into a Tree data structure.

2. Endpoint access middleware is designed to be applied to an Express.js endpoint.

3. A username cookie is read to match up the user permissions with the endpoints + HTTP Verb they have access to.  

## Setup

1. install the access-tree-express package and the cookie-parser package

    npm install @access-tree/access-tree-express cookie-parser

2. require access-tree-express in your express server and cookie-parser

    let AccessTree = require('@access-tree/access-tree-express');
    const cookieParser = require('cookie-parser');

3. instantiate the tree and apply the cookie parser middleware globally, as well as apply a body-parser type middleware

    let tree = new AccessTree('root');
    app.use(cookieParser());
    // express native body parser
    app.use(express.json());

4. read the initial user to endpoint mappings into the tree (imported from a file, first)
```javascript
    // in your initial dependency imports
    const userData = require('./userData.json');
    tree.readUserFile(userData)
```
## Examples: loading the initial user to endpoint mappings

* here are some example user to endpoint mappings
* this is the format for data to be read and loaded by readUserFile method

```javascript
{
    "paths": [
        "/john/api/home/data/chicken/legs/raw/GET/6",
        "/john/api/home/data/chicken/legs/raw/POST/0",
        "/john/api/home/data/chicken/legs/cooked/GET/4",
        "/bob/api/users/dogs/names/GET/4",
        "/alice/api/data/people/things/шеллы/POST/6",
        "/alice/api/両/乓/乶/POST/6",
        "/admin/api/add-endpoint/POST/6",
        "/admin/api/remove-user/DELETE/6"
    ]
}
```

## Examples: Applying Access-Tree to Express Endpoints

_Here is an example of endpoint access for a read endpoint (bob has access):_

```javascript
// user to endpoint mapping is:
//      /bob/api/users/dogs/names/GET/4
app.get(
    "/api/users/dogs/names",
    tree.endpointAccess(tree, "read"),
    (req, res) => {
        res.json({ message: "hello data" });
    }
);
```

_Here is an endpoint access example with utf-8 non-ascii characters_

```javascript
// user to endpoint mapping is:
//      /alice/api/両/乓/乶/POST/6
app.post("/api/%E4%B8%A1/%E4%B9%93/%E4%B9%B6",
    tree.endpointAccess(tree, "write"),
    (req, res) => {
        res.json({ message: "hello there" })
    }
);
```

_Here is an example where endpoint validation is done and then the access tree is modified:_

```javascript
// user to endpoint mapping is:
//     /admin/api/remove-user/DELETE/6
app.delete("/api/remove-user/:username",
    tree.endpointAccess(tree, "write"),
    (req, res) => {
        tree.removeUser(req.params.username);
        res.json({ message: "you just removed a user and their endpoints" })
    }
);
```
_Here is an example of endpoint access for admin, who will list the users in the tree:_

```javascript
// user to endpoint mapping for admin user is:
//   /admin/api/list-users/GET/4
app.get(
    "/api/list-users",
    tree.endpointAccess(tree, "read"),
    (req, res) => {
        const users = tree.listUsers();
        res.json({ message: users });
    }
);
```
## Why is Access Tree worth using ? 

1. The Tree is a Trie, optimized for string completion with O^1 time complexity for searching.

2. The Tree uses references, non-contiguous memory, so it can scale big for large organizations.

3. The Tree can be mutated in real-time so an administrator can modify permissions without rebooting a server

* A User tree can be pruned or an endpoint can be added.  

* To add a new user, you add all their endpoints.


### FAQ:

* can't a user just say they are admin and then get access to admin utilities ? 

 _Authentication is not Access Tree's job.  Authorization is.  So, it should be used in conjuction with a system for authenticating a user._ 


