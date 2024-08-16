import dbConnect from "@/lib/dbConnect";

import { getServerSession, User } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/option";

import UserModel from "@/model/User";
import mongoose from "mongoose";
import { match } from "assert";
import { flattenDiagnosticMessageText } from "typescript";


// change the toggle status yes or not user accepting message. or not
export async function POST(request: Request){

    dbConnect();

    const session = await getServerSession(authOptions);

    const user : User = session?.user as User 

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message : "Not Authentication"
            },
            {status : 401}
        )
    }

    const userId = user._id

    const { acceptMessages } = await request.json();

    try {
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage : acceptMessages},
            { new : true }
        )
    
        if(!updatedUser){
            console.log(`failed while updating the messages acceptMessages in db`,updatedUser);
            return Response.json({ 
                success : false,
                message : `failed while updating the messages acceptMessages in db`
             },{status : 401})
            
        }

        return Response.json({ 
            success : true,
            message : ` messages acceptance status updated Successfully `,updatedUser
         },{status : 200})
    

    } catch (error) {
        console.log(`Failed to update user status to accept messages`);
        return Response.json(
            {
                success : false,
                messages : "failed to update user accept messages"
            },
            {status : 500}
        )
        
    }



}


// get all the messages of the user_id 

export async function GET(request : Request){
 
    dbConnect();

    const session = await getServerSession(authOptions);

    const user : User = session?.user as User 

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message : "Not Authentication"
            },
            {status : 401}
        )
    }

    // here userId contain mongoose object.
    const userId = new mongoose.Types.ObjectId(user._id);

 try {


       const user = await UserModel.aggregate([
        { $match : {id : userId}},
        {$unwind : "$messages"},
        {$sort  : {'messages.createdAt' : -1}},
        {$group : {_id: '$_id', messages : {$push : '$messages'}}}
       ])


       if(!user || user.length === 0){
        return Response.json({
            success : false,
            messsage : `user not found`
        },{status : 401})
       }

       return Response.json(
        {
            success : true,
            message : user[0].messages
        },
        {
            status : 200
        }
       )




   
 } catch (error) {

    console.log(`Error while get all the messages : `,error)
    
    return Response.json(
        {
            success : false,
            message : `Not able to get the messages data`
        },
        {
            status : 500
        }
       )
 }






}