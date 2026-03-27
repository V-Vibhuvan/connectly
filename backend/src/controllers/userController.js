const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/userModel.js");
const Meeting = require("../models/meetingModel.js");


module.exports.login = async (req,res) => {
    const {username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({message: "Please Provide User name and Password"})
    } 

    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User Not Found"});
        }

        let check_password = await bcrypt.compare(password, user.password);

        if(check_password){
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();

            return res.status(200).json({token});
        }else{
            return res.status(401).json({message: "Invalid Username or Password"});
        }

    } catch (error){
        return res.status(500).json({error:"Internal Server Error"});
    }
};

module.exports.register = async(req,res)=>{
    const {name, username, password} = req.body;

    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(200).json({message: "User already Exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(200).json({message: "User Registered"});

    }catch(error){
        return res.status(500).json({error: "Internal Server Error"});
    }
};


module.exports.getUserHistory = async (req,res) => {
    const {token} = req.query;  

    try{
        const user = await User.findOne({token});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const meetings = await Meeting
            .find({ user_id: user._id })
            .populate("user_id", "username name")
            .sort({ date: -1 });                    
        return res.status(200).json(meetings);

    }catch(error){
        return res.status(500).json({ message: `Something went wrong ${error}` });
    }
};

module.exports.addToHistory = async(req,res) => {
    const {token , meeting_code} = req.body;

    try{
        const user = await User.findOne({token});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const existingMeeting = await Meeting.findOne({
            user_id: user._id,
            meeting_code
        });

        if(existingMeeting){
            return res.status(200).json({message: "Meeting already exists"});
        }

        const newMeeting = new Meeting({
            user_id: user._id,
            meeting_code
        });

        await newMeeting.save();

        console.log("addToHistory API HIT", meeting_code);

        return res.status(200).json({message: "Added to History"});

    }catch(error){
        return res.status(500).json({ message: `Something went wrong ${error}` });   
    }
};