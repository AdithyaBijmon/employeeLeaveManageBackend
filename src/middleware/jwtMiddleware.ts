const jwt = require('jsonwebtoken')

const authenticate = (req:any,res:any,next:any)=>{
    // console.log("jwt")

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1]



    if(!token){
         res.status(401).json({message:"Authorization token is required."})
    }
    

    try{
         const jwtResponse = jwt.verify(token, process.env.JWT_SECRET || '');
         console.log("🔐 AUTH USER ID:", jwtResponse.id, jwtResponse.email);
          req.payload = jwtResponse.email
          req.user = jwtResponse
          next()
    }
    catch(err){
        res.status(500).json({message:"Invalid token"})
    }
}

export default authenticate