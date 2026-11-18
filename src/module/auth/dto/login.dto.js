import Joi from "joi";
import Basedto from "../../../common/config/base.dto.js";

class LoginDto extends Basedto{
    static Schema = Joi.object({
            email:Joi.string().email().min(8).max(325).required(),
            password:Joi.string().min(8).max(16).message('Password is required').required(),
    })
}

export default LoginDto