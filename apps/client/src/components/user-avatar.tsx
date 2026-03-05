import { Avatar, AvatarImage } from "./ui/avatar";

type UserAvatarProps = {
  size: "xs" | "md" | "lg" | "xl" | "xl2";
  image?: string;
};

const UserAvatar = ({ size, image = undefined }: UserAvatarProps) => {
  const sizes = {
    xs: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-24 w-24",
    xl2: "h-32 w-32",
  };
  return (
    <Avatar className={`${sizes[size]} rounded-full overflow-hidden`}>
      <AvatarImage
        src={image ? image : "/avatar.png"}
        alt="Аватар"
        className="object-cover w-full h-full bg-transparent"
      />
    </Avatar>
  );
};

export default UserAvatar;
