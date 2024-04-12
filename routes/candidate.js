// importing tools 
const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require("../jwtAuthMiddleware");
const Candidate = require("./../models/candidate");
const User = require("../models/user");

// function for checking is user a admin
const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === "admin";
  } catch (error) {
    return false;
  }
};

//setting signup page
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (! await checkAdminRole(req.user.id)) {
      return res.status(403).json({ message: "user is not admin" });
    }
    const data = req.body;
    // creating a new user and saving in db
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();

    // sending user data and token in response with success code
    res.status(200).json({ response: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// setting route for updating candidate data 
router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id)) {
      return res.status(403).json({ message: "user is not admin" });
    }

    const candidateId = req.params.candidateId;
    const updatedCandidateData = req.body;
    const response = await User.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      console.log("candidate Data updated");

      return res.status(200).json(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal  server error" });
  }
});

// setting route for deleting a perticular candidate
router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    // checking is user an admin or
    if (!checkAdminRole(req.user.id)) {
      return res.status(403).json({ message: "user is not admin" });
    }
    
    const candidateId = req.params.candidateId;

    const updatedCandidateData = req.body;
    const response = await Candidate.findByIdAndDelete(candidateId);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    console.log('Candidate Deleted');
    res.status(200).json(response);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal  server error" });
  }
});

// setting voting for giving votes
router.post('/vote/:candidateId', jwtAuthMiddleware, async (req, res)=>{
   const candidateId = req.params.candidateId;
   const userId = req.user.id;
  try {
    const candidate = await Candidate.findById(candidateId);
    if(!candidate){
      return res.status(404).json({message:'Candidate not found'});
    }
    const user =  await User.findById(userId);
    if(!user){
      return res.status(404).json({message:"user not found"});
    }
    if(user.role = 'admin'){
      res.status(403).json({ message : "admin can not vote"});
    }
    if(user.isVoted){
    res.status(403).json({message:"Already voted"});
    }

    candidate.votes.push({user:userId})
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({message:"Vote recorded successfully"});

  } catch (error) {
    console.log(error);
    res.status(500).json({error:'Internal Server Error'});
  } 
})

router.get("/vote/count", async(req, res)=>{
  try {
    const candidate = await Candidate.find().sort({voteCount:'desc'});

    const record = candidate.map( (data)=>{
      return{
        party:data.party,
        count: data.voteCount
      }
    });

    return res.status(200).json(record);
    } catch (error) {
    return res.status(500).json({error:"internal server Error"});
  }
})

module.exports = router;
