class ApiError extends Error{
    constructor(statusCode,message){
        super(message);
        this.statusCode=statusCode
        this.isOpreational=true
        Error.captureStackTrace(this,this.constructor)
    }

     static badRequest(message='Bad request'){
        return new ApiError(400,message);
    }

    static unauthorized(message='Unauthorized'){
        return new ApiError(403,message);
    }

    static conflict(message='User Already exist'){
        return new ApiError(409,message);
    }

    static forbidden(message='Forbidden'){
        return new ApiError(404,message);
    }

     static notfound(message='notfound'){
        return new ApiError(412,message);
    }
}

export default ApiError