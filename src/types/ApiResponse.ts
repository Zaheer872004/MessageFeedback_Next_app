import { Message } from "@/model/User";


export interface ApiResponse{
    success: boolean;  // this field is compulsory
    message: string;    // this field is compulsory
    isAcceptingMessages? : boolean;   // this field is not compulsory
    messages?: Array<Message>    // this field is not compulsory
}