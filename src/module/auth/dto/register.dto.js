import Joi from "joi";
import Basedto from "../../../common/config/base.dto.js";

class RegisterDto extends Basedto{
    static Schema = Joi.object({
        name: Joi.string().trim().min(2).max(16).required(),
        email:Joi.string().email().min(8).max(325).required(),
        password:Joi.string().min(8).max(16).message('Password is required').required(),
        role:Joi.string().valid('Customer','Admin').default('Customer')
    })
}

export default RegisterDto