import { User } from "../models/UserModel.js"; 

//Get logged-in user info
export const getUser = async (req, res) => {
  try{
    const user = await User.findByPk(req.user.id, { attributes: ["userId", "username", "email"]});
    if(!user) return res.status(404).json({message: "User not found"});

    res.json({user});
  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server error while fetching user info"});
  }
};