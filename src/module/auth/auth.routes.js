import { Router } from "express";
import * as authController from './auth.controller.js'
import RegisterDto from "./dto/register.dto.js";
import validate from "../../common/middlewares/validate.middleware.js";
import LoginDto from "./dto/login.dto.js";
import { authenticate } from "./auth.middleware.js";
import { upload } from "../../common/middlewares/multer.middleware.js";
const router = Router();



router.post('/register',validate(RegisterDto),authController.register);
router.post('/login',validate(LoginDto),authController.login);
router.post('/refresh',authController.refresh);

router.post('/verify/:verifytoken', authController.verifyEmail);

router.post('/forget-password',authController.forgetPassword);
router.post('/reset-password',authController.resetPassword);

/**
 * There will be some routes where we will expect user must have been logged in
 */

router.get('/get-me', authenticate, authController.getMyProfile);

router.post('/upload',authenticate,upload.single('file'),authController.uploadAvatar)
export default router;