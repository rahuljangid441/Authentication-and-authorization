import ApiError from "../../common/utils/api-error.js";
import User from './auth.model.js'
import { verifyAccessToken } from "../../common/utils/jwt-utils.js";

const authenticate = async (req, res, next) => {
    /**
     * user will send accessToken and send it whenever user sends the request
     * 
     * in web application we store this cookie in httpOnly cookie
     * how tokens are send?
     * 
     * Auth -> Bearer Token (in postman or request kit)
     * manually -> Add key in header Key-> Authorization, value -> Bearer TOKENVALUE
     * 
     * 1. Recieve the token 
     */

    let token;
    if(req.headers.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];

    }

    if(!token) throw ApiError.unauthorized('Not Authenticated');
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);
    if(!user) throw ApiError.unauthorized('User not found');

    //user mil gaya, add property in req object

    req.user = {
        id:user._id,
        role:user.role,
        name:user.name,
        email:user.email
    }

    next();

    /**
     * Along with cookies
     */
}

const authorize = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            throw ApiError.forbidden('Not allowed')
        }

        next();
    }
}

export {
    authenticate,
    authorize
}