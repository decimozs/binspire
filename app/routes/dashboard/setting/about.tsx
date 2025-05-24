import { useEffect, useState } from "react";

type SystemDetails = {
  name: string;
  community: string;
  status: string;
  version: string;
  environment: string;
  uptime: string;
  lastUpdated: string;
  serverRegion: string;
  developedBy: string;
  contact: string;
  about: string;
  links: {
    terms: string;
    privacy: string;
    github: string;
  };
};

export default function AboutSettingsRoute() {
  const [details, setDetails] = useState<SystemDetails | null>(null);

  useEffect(() => {
    const fetchXML = async () => {
      try {
        const res = await fetch(
          `/xml/settings/about/system-details.xml?ts=${Date.now()}`,
        );
        const xmlStr = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlStr, "application/xml");

        const getText = (tag: string) =>
          xml.getElementsByTagName(tag)[0]?.textContent || "";

        const getLink = (type: string) =>
          Array.from(xml.getElementsByTagName("link")).find(
            (l) => l.getAttribute("type") === type,
          )?.textContent || "";

        setDetails({
          name: getText("name"),
          community: getText("community"),
          status: getText("status"),
          version: getText("version"),
          environment: getText("environment"),
          uptime: getText("uptime"),
          lastUpdated: getText("lastUpdated"),
          serverRegion: getText("serverRegion"),
          developedBy: getText("developedBy"),
          contact: getText("contact"),
          about: getText("about"),
          links: {
            terms: getLink("terms"),
            privacy: getLink("privacy"),
            github: getLink("github"),
          },
        });
      } catch (error) {
        console.error("Failed to fetch or parse XML:", error);
      }
    };

    fetchXML();
  }, []);

  if (!details) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <h1 className="text-3xl font-semibold">System Details</h1>

      <div className="text-base w-full space-y-3">
        <DetailRow label="Name" value={details.name} />
        <DetailRow label="Community" value={details.community} />
        <DetailRow label="Status" value={details.status} />
        <DetailRow label="Version" value={details.version} />
        <DetailRow label="Environment" value={details.environment} />
        <DetailRow label="Uptime" value={details.uptime} />
        <DetailRow label="Last Updated" value={details.lastUpdated} />
        <DetailRow label="Server Region" value={details.serverRegion} />
        <DetailRow label="Developed By" value={details.developedBy} />
        <DetailRow
          label="Contact"
          value={
            <a
              href={`mailto:${details.contact}`}
              className="text-blue-600 hover:underline"
            >
              {details.contact}
            </a>
          }
        />
      </div>

      <div className="pt-6 border-t">
        <h2 className="text-xl font-medium mb-2">About {details.name}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {details.about}
        </p>
      </div>

      <div className="pt-4 border-t text-sm space-y-2 text-muted-foreground">
        <a
          href={details.links.terms}
          className="hover:underline block"
          target="_blank"
          rel="noreferrer"
        >
          Terms of Service
        </a>
        <a
          href={details.links.privacy}
          className="hover:underline block"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
        <a
          href={details.links.github}
          className="hover:underline block"
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-center justify-between">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-right max-w-[60%]">{value}</p>
    </div>
  );
}
