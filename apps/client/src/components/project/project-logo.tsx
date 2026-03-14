import { Avatar, AvatarImage } from "../ui/avatar";

type ProjectLogoProps = {
  size: "xs" | "md" | "lg" | "xl" | "xl2";
  image?: string;
};

const ProjectLogo = ({ size, image = undefined }: ProjectLogoProps) => {
  const sizes = {
    xs: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-24 w-24",
    xl2: "h-32 w-32",
  };
  return (
    <Avatar className={`${sizes[size]} rounded-full overflow-hidden border`}>
      <AvatarImage
        src={image ? image : "/blank_project_image.png"}
        alt="Логотип"
        className="object-cover w-full h-full bg-transparent"
      />
    </Avatar>
  );
};

export default ProjectLogo;
