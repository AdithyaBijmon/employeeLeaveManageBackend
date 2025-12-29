const jwt = require('jsonwebtoken')

const adminAuthenticate = (req: any, res: any, next: any) => {
    // console.log("Admin jwt")

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1]



    if (!token) {
        res.status(401).json({ message: "Authorization token is required." })
    }


    try {
        const jwtResponse = jwt.verify(token, process.env.JWT_SECRET || '');
        req.payload = jwtResponse.email
        req.user = jwtResponse
        if (req.user?.role == "admin") {
            next()
        }
        else{
            res.status(404).json({message:"Unauthorized user"})
        }

    }
    catch (err) {
        res.status(500).json({ message: "Invalid token" })
    }
}

export default adminAuthenticate