const userModel = require ('../schema/userschema');

const getProfile = async (req,res) =>{
    try {
        const user = await userModel.findById(req.user.userId).select('fullName email role');
        if(!user){
            res.status(400).send({message:'user not found'});
        }
        res.status(200).send(user);
    } catch (error) {
         console.error('Error fetching profile:', error);
    res.status(500).send({ message: 'Server error', error });
    }

}

module.exports = getProfile;