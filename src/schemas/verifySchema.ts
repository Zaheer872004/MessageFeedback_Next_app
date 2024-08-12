//verify 6 digits verify code for email

import z from 'zod'


export const verifyCodeSchema = z.object({
    code : z.string().length(6,{message:`Verify Code must be 6 digits`})
})