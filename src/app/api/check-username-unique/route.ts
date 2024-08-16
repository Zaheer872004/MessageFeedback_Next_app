import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import { usernameValidation } from "@/schemas/signUpSchema";
import { sortAndDeduplicateDiagnostics } from "typescript";

import { z } from "zod";

// validating the username our custom zod object 
const UsernameVerificationQuerySchema = z
.object({username : usernameValidation})

export async function GET(request: Request){

    await dbConnect();

    try {
        
        const { searchParams, hostname } = new URL(request.url);
        
        // here multiple params get username one.
        const queryParam = {
            username : searchParams.get('username')
        }

        const result = UsernameVerificationQuerySchema.safeParse(queryParam)


        console.log(result);
        if(!result.success){
            const usernameError = result.error.format().username?._errors || []

            return Response.json({
                success: false,
                message : usernameError?.length > 0 ? usernameError.join(', ') : 'Invalid query parameter'
            },{status:400})
        }

        const username = result.data?.username;

        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})

        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message : 'username already taken '
            },{status : 400})
        }

        return Response.json({
            success : true,
            message : 'username is unique '
        },{status : 200})




        
    } catch (error) {
        console.error(`Error checking username`,error);
        return Response.json({
            success : false,
            message :'Error checking username'
        },{status : 500});        
    }



}







