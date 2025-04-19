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

interface EmailInvitation {
  id: string;
  email: string;
  token: string;
  type: string;
  role: string;
  orgId: string;
  permission: string;
  intent: "approved" | "rejected";
  inviteFromIp: string;
  inviteFromLocation: string;
}

const baseUrl = "http://localhost:5173";

export default function EmailInvitation({
  id,
  orgId,
  email,
  type,
  token,
  role,
  inviteFromIp,
  intent,
  permission,
  inviteFromLocation,
}: EmailInvitation) {
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
              {intent === "approved" && (
                <>
                  Join <strong className="capitalize">{role}</strong> on{" "}
                  <strong>Binspire</strong>
                </>
              )}
              {intent === "rejected" && (
                <>
                  Your access request as{" "}
                  <strong className="capitalize">{role}</strong> has been
                  declined.
                </>
              )}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello, {email}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {intent === "approved" && (
                <>
                  <strong>Binspire</strong> has invited you to the{" "}
                  <strong className="capitalize">{role}</strong> team on{" "}
                  <strong>Arcovia</strong> with{" "}
                  <strong className="capitalize">
                    {permission.replace(",", " ")}
                  </strong>{" "}
                  permissions.
                </>
              )}
              {intent === "rejected" && (
                <>
                  Your invitation to join the{" "}
                  <strong className="capitalize">{role}</strong> team on{" "}
                  <strong>Arcovia</strong> from <strong>Binspire</strong> was
                  not approved.
                </>
              )}
            </Text>
            {intent === "approved" && (
              <Section>
                <Row>
                  <Column align="right">
                    <Img
                      className="rounded-full"
                      src="https://i.ibb.co/bMjTNyym/binspire-1.png"
                      width="64"
                      height="64"
                      alt="picture"
                    />
                  </Column>
                  <Column align="center">
                    <Img
                      src="https://i.ibb.co/xq2xxqzj/icons8-arrow-right-96-1.png"
                      width="25"
                      height="25"
                      alt="Arrow indicating invitation"
                    />
                  </Column>
                  <Column align="left">
                    <Img
                      className="rounded-full"
                      src="https://i.ibb.co/rK4P145L/logo.png"
                      width="64"
                      height="64"
                      alt="picture"
                    />
                  </Column>
                </Row>
              </Section>
            )}
            {intent === "rejected" && (
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href="mailto:support@binspire.com?subject=Access Request Support"
                >
                  Contact Support
                </Button>
              </Section>
            )}
            {intent === "approved" && (
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href={`${baseUrl}/sign-up?t=${token}&id=${id}&o=${orgId}&p=${permission}`}
                >
                  Join the Team
                </Button>
              </Section>
            )}
            {intent === "approved" && (
              <Text className="text-black text-[14px] leading-[24px]">
                or copy and paste this URL into your browser:{" "}
                <Link
                  href={`${baseUrl}/sign-up?t=${token}&id=${id}&o=${orgId}&p=${permission}`}
                  className="text-blue-600 no-underline"
                >
                  {`${baseUrl}/sign-up?t=${token}&id=${id}&o=${orgId}&p=${permission}`}
                </Link>
              </Text>
            )}
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
}
