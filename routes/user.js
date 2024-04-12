// requiring tools 
const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const {jwtAuthMiddleware, generateToken} = require("../jwtAuthMiddleware");

//setting signup page
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    // creating a new user and saving in db
    const newUser = new User(data);
    const response = await newUser.save();

    //creating  payload
    const payload = {
      id: response.id,
    };

    // generating token usign generate token function
    const token = generateToken(payload);
    console.log(`Token is for ${response.name} `, token);

    // sending user data and token in response with success code
    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// setting login page 
router.post("/login", async (req, res) => {
  try {
    // getting adhar no and password from body
    const { adharNo, password } = req.body;

    // finding user in db with given adhar no in req
    const user = await User.findOne({ adharNo: adharNo });

    // checking if user not exist or password mismatched
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // generating and sending token to the user 
    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

// Profile page
// here jwtAuthMiddleware is a middleware that runs before the handler function. 
//only authenticated user can acess the profile route
//jwtAuthmiddlewatre is setting req.user = payload send by server 
router.get('/profile', jwtAuthMiddleware, async(req,res)=>{
   try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json(user);
   } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
   }
})

// setting 
router.put("/profile/password", async(req, res)=>{
    try {
        const userId = req.user;
        const {currentPassword, newPassword} = req.body;
        const user = await User.findById(userId);

        if((await user.comparePassword(password))) return res.status(401).json({error:"Invalid username or password"});
        
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({message:"Password updated"});      
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"internal  server error"});
    }
})

module.exports = router;