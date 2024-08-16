import { Body, Button, Column, Container, Head, Heading, Hr, Html, Img, Link, Preview, Row, Section, Text, Tailwind } from '@react-email/components';

import * as React from 'react';


interface WelcomeEmailProps {

  username?: string;

  otp?: string;

}



const VerificationEmailTemplate = ({username,otp} : WelcomeEmailProps) => {

  const previewText = `Welcome to ${username}, on Feedback application`;


  return (

    <Html>

      <Head />

      <Preview>{previewText}</Preview>

      <Tailwind>

      <Body className="bg-white my-auto mx-auto font-sans">

        <Container className="my-10 mx-auto p-5 w-[465px]">

          <Section className="mt-8">

            <Text>
              <p className='bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text'>Feedback Application</p>
            </Text>


            {/* <Img

              src={`${baseUrl}/static/example-logo.png`}

              width="80"

              height="80"

              alt="Logo Example"

              className="my-0 mx-auto"

            /> */}

          </Section>

          <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0">

            Welcome to <strong> Feedback application </strong>, {username}!

          </Heading>

          <Text className="text-sm">

            Hello {username},

          </Text>

          <Text className="text-sm">

            We're excited to have you onboard at <strong>Feedback Application </strong>. We hope you enjoy your journey with us. If you have any questions or need assistance, feel free to reach out.

          </Text>

          <Text className='font-medium text-white'>
              {otp}
          </Text>

          <Section className="text-center mt-[32px] mb-[32px]">

              <Button

                // pX={20}

                // pY={12}

                className="px-20 py-12 bg-[#00A3FF] rounded text-white text-xs font-semibold no-underline text-center"

                href={`${baseUrl}/sign-in`}

              >

                Get Started with {otp}

              </Button>

          </Section>

          <Text className="text-sm">

            Cheers,

            <br/>

            The Feedback Application Team - <strong>Zaheer khan</strong>

          </Text>

        </Container>

      </Body>

      </Tailwind>

    </Html>

  );

};


const baseUrl = 'http://localhost'


export default VerificationEmailTemplate;


 // This is like a component for Emails





// import {
//     Html,
//     Head,
//     Font,
//     Preview,
//     Heading,
//     Row,
//     Section,
//     Text,
//     Button
// } from '@react-email/components';


// interface VerificationEmailProps {
//   username: string;
//   otp:string;
// }

// export default function VerificationEmailTemplate({username,otp} : VerificationEmailProps){
//   return (
//     <Html lang="en" dir="ltr">
//       <Head>
//         <title>Verification Code</title>
//         <Font
//           fontFamily="Roboto"
//           fallbackFontFamily="Verdana"
//           webFont={{
//             url:'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
//             format:'woff2'
//           }}
//           fontWeight={400}
//           fontStyle="normal"
//         />
//       </Head>
//       <Preview>
//         Here&apos;s Your Verification Code: {otp}
//       </Preview>
//       <Section>
//           <Row>
//               <Heading as='h2'>Hello {username}</Heading>
//           </Row>
//           <Row>
//             <Text>
//               Thank you for registering. Please use the following Verification code to complete your registration
//             </Text>
//           </Row>
//           <Row>
//               <Text>{otp}</Text>
//           </Row>
//           <Row>
//              <Text>
//                 If you did not request this code, please ignore this email.
//              </Text> 
//           </Row>
//           <Row>
//               <Text>
//                 By the way I'm Zaheer Khan. <strong>You can content on zaheer.224246108@vcet.edu.in For freelancing project</strong>
//               </Text>
//           </Row>
//           {/* <Row>
//               <Button
//                 href={`http://localhost:3000/verify/${username}`}
//                 style={{color:"#61dafb="}}
//               >
//                 Verify here
//               </Button>
//           </Row>  */}
//       </Section>
//     </Html>
//   )
// }
