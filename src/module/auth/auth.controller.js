import ApiError from "../../common/utils/api-error.js";
import ApiResponse from "../../common/utils/api-response.js";
import * as authService from './auth.service.js'
export const register = async(req, res) => {
    console.log('I am RegisterController');
    const user = await authService.register(req.body);
    return ApiResponse.ok(res,'Register controller is working',user)
}

export const login = async(req, res) => {
    // console.log('I am a logic controller');
    // return res.status(201).json({
    //     message:'woking',
    //     data:{
    //         email:req.body.email,
    //         password:req.body.password
    //     }
    // })

    const user = await authService.login(req.body);
    return ApiResponse.ok(res,'Login successfull',user);
}

export const refresh = async(req,res) => {
    const token = await authService.refresh(req.body);
    return ApiResponse.ok(res,'successfully token generation',token)
}

export const verifyEmail = async(req,res) => {
    console.log('token is',req.params.verifytoken);

    const user = await authService.verifyEmail(req.params.verifytoken)
    return ApiResponse.ok(res,'successfully token generation',user);
}

export const forgetPassword = async(req,res)=>{
    const user = await authService.forgotPassword(req.body.email);
    console.log('User controller forget password',user);
    return ApiResponse.ok(res,'Success',user);
}

export const resetPassword = async(req, res)=>{
    const {token, newPassword} = req.body;
    const user = await authService.resetPassword(token,newPassword);
    return ApiResponse.ok(res,'Success',user);
}

export const getMyProfile = async(req,res)=>{
    const user = await authService.getMe(req.user.id);
    return ApiResponse.ok(res,'Success',user);

}

export const uploadAvatar = async(req,res)=>{
    console.log('Hey',req.user);
    try{
        const file = req.file;
        if(!file) throw ApiError.badRequest('Please send the file');

       const result = await authService.handleUpload(req.user.id, file);

        ApiResponse.ok(res,'File is uploaded',result);
    }catch(error){
        throw ApiError.conflict('Error in uploading the file',error);
    }
}