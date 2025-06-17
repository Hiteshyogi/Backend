const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const server = express()
server.use(express.json())
server.use(cors({
    origin:["http://localhost:5173"]
}))

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxLength: 100
    },
    email:{
        type: String,
        required: true,
        unique: true

    },
    password:{
        type: String,
        required: true,
        MinLength: 6
    },
    contact:{
        type: String,
        default: null

    },
    status:{
        type: Boolean,
        default: true      // true-Activated   false-Deactivated
    }

})

const UserModel = mongoose.model("users",userSchema);   // UserModel Database ka Reference

// User Create

server.post("/user/register", (req, res) => {
    console.log(req.body)
try{
    const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    user.save().then(
        () => {
        res.send({
            msg: "User Created",
            status: 1
        
        })
        }
    ).catch(
        (err) => {
            console.log(err.errmsg)
            res.send({
                msg: "Unable to create user",
                status: 0,
                err: err.errmsg
            
            })
        }
    )

    }catch(error) {
        res.send(
            {
                msg:"Internal Server Error",
                status: 0
            }
        )

    }

})

// User Login

server.post("/user/login", async(req, res) => {
    console.log(req.body)
    try{
        const userExist = await UserModel.findOne({email: req.body.email});
        // console.log(userExist)
        if (userExist) {
            if (userExist.password == req.body.password) {
                res.send(
                    {
                        msg:"Login Successfully",
                        status: 1
                    }
                )
            } else {
                res.send(
                    {
                        msg:"Password doesn`t match",
                        status: 0
                    }
                )
            }

        } else {
            res.send(
                {
                    msg:"unable to find this email",
                    status: 0
                }
            )

        
        }
    }
    catch(error) {
        res.send(
            {
                msg:"Internal Server Error",
                status: 0
            }
        )

    }
})

// Get all users
server.get("/user", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.send({
            msg: `${users.length} Users Found`,
            status: 1,
            users: users
        });
    } catch (error) {
        res.send({
            msg: "Internal Server Error",
            status: 0
        });
    }
});

// Get user by ID
server.get("/user/:id", async (req, res) => {
    try {
        console.log(req.params.id)
        const userId = req.params.id;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.send({
                msg: "User Not Found",
                status: 0
            });
        }

        res.send({
            msg: "1 User Found",
            status: 1,
            users: user
        });
    } catch (error) {
        res.send({
            msg: "Internal Server Error",
            status: 0
        });
    }
});

// User Delete

server.delete("/user/delete/:id", (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId)
        UserModel.deleteOne({_id: userId}).then(
            () => {
                res.send({
                    msg: "User Deleted",
                    status: 1
                });
            }
        ).catch(
            () => {
                res.send({
                    msg: "Unable to user deleted",
                    status: 0
                });
            }
        )


    } catch (error) {
        res.send({
            msg: "Internal Server Error",
            status: 0
        });
    }
})

// User only status Update

server.patch("/user/status-update/:id", async (req, res) => {
    try {
        
        const user = await UserModel.findById(req.params.id);
        console.log(user)
        if (user) {
            UserModel.updateOne(
                {_id: req.params.id},
                {
                    $set:{
                        status: !user.status
                    }
                }
            ).then(
                () => {
                    res.send({
                        msg: "User status update",
                        status: 1
                    });
                }
            ).catch(
                () => {
                    res.send({
                        msg: "Unable to update user status",
                        status: 0
                    });
                }
            )

        } else {

        }



    } catch (error) {
        res.send({
            msg: "Internal Server Error",
            status: 0
        });
    }
})

// User All Updated

server.put("/user/update/:id", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
        console.log(user)
        UserModel.updateOne(
            {_id: req.params.id},
                {
                    ...req.body
                }
        ).then(
            () => {
                res.send({
                    msg: "User status update",
                    status: 1
                });
            }
        ).catch(
            () => {
                res.send({
                    msg: "Unable to update user status",
                    status: 0
                });
            }
        )
    
    } catch (error) {
        res.send({
            msg: "Internal Server Error",
            status: 0
        });
    }
})



mongoose.connect("mongodb://localhost:27017/",
    {dbName: "wsjp_72"}
).then(
    () => {
        console.log("Database Connected");
        server.listen(
            5000,
            () => {
                console.log("Server Starting");
            }
        )

    }

).catch(
    () => {
        console.log("Unable to connect database");
    }


)





