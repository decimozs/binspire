import { icons } from "@/lib/constants";

export const SVG: React.FC<{ icon: keyof typeof icons }> = ({ icon }) => {
  return (
    <div className="icon" dangerouslySetInnerHTML={{ __html: icons[icon] }} />
  );
};
