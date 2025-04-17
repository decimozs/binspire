import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailVerificationProps {
  email: string;
  token: string;
  type: string;
  inviteFromIp: string;
  inviteFromLocation: string;
}

const baseUrl = "http://localhost:5173";

export const EmailVerification = ({
  email,
  type,
  token,
  inviteFromIp,
  inviteFromLocation,
}: EmailVerificationProps) => {
  const previewText = `Verify your email for Binspire`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Preview>{previewText}</Preview>
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://i.ibb.co/rK4P145L/logo.png"
                width="100"
                height="100"
                alt="Binspire Logo"
                className="my-0 mx-auto rounded-md"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Email Verification for <strong>Binspire</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello, {email}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thank you for registering with <strong>Binspire</strong>. To
              complete your registration, please verify your email by clicking
              the button below:
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={`${baseUrl}/verification?t=${token}&tp=${type}&e=${email}`}
              >
                Verify Email
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={`${baseUrl}/verification?t=${token}&tp=${type}&e=${email}`}
                className="text-blue-600 no-underline"
              >
                {`${baseUrl}/verification?t=${token}&tp=${type}&e=${email}`}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This verification email was sent from{" "}
              <span className="text-black">{inviteFromIp}</span> located in{" "}
              <span className="text-black">{inviteFromLocation}</span>. If you
              did not request this, you can ignore this email. If you have
              concerns, please reply to this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailVerification;
