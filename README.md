# Access Tree Javascript

### A library to provide access restrictions on express.js endpoints

## How does it work ? 

1. Access tree is instantiated with a list of endpoints with users and permissions, for example:

    `"/bob/api/users/dogs/names/GET/4",`

* The user bob has read (4) access to the endpoint /api/users/dogs/names.

2. User endpoints are ingested into a Tree data structure, with sub-trees for each user.

3. Endpoint access middleware is designed to be applied to an Express.js endpoint.

* A username cookie is read to match up the user with the endpoints they have access to.  

_Here is an example of endpoint access for a read endpoint (bob has access):_

```javascript
app.get(
    "/api/users/dogs/names",
    tree.endpointAccess(tree, "read"),
    (req, res) => {
        res.json({ message: "hello data" });
    }
);
```

## Why is Access Tree worth using ? 

1. The Tree is a Trie, optimized for string completion with O^1 time complexity for searching.

2. The Tree uses references, non-contiguous memory, so it can scale big for large organizations.

3. The Tree can be mutated in real-time so an administrator can modify permissions without rebooting a server

_Here is an example where endpoint validation is done and then the access tree is modified:_

```javascript
app.delete("/api/remove-user/:username",
    tree.endpointAccess(tree, "write"),
    (req, res) => {
        tree.removeUser(req.params.username);
        res.json({ message: "you just removed a user and their endpoints" })
    }
);
```
* A User tree can be pruned or an endpoint can be added.  

* To add a new user, you add all their endpoints.


### FAQ:

* can't a user just say they are admin and then get access to admin utilities ? 

 _Authentication is not Access Tree's job.  Authorization is.  So, it should be used in conjuction with a system for authenticating a user._ 


