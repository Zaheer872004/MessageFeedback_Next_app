import { resend } from '@/lib/resend';
import VerificationEmailTemplate from '../../emails/VerificationEmailTemplate';
import {ApiResponse} from '@/types/ApiResponse'


export async function sendVerificationEmail(
    email: string,
    username : string,
    verifyCode : string,
) : Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from : 'onboarding@resend.dev',
            to: email,
            subject:'Feedback Application | Verification Code',
            react: VerificationEmailTemplate({
                username , 
                otp: verifyCode,
            }),
        });
        


        return {
            success: true,
            message:`Email send successfully to ${username} from Feedback Application `,

        }
    } catch (emailError) {
        console.log("Error sending verification email",emailError);
        return {success:false,message:`Failed to send verification email`}

        
    }
}


