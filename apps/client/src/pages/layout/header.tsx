import EndMenu from "./components/end-menu";
import HeaderLogo from "./components/header-logo";
import Naviagtion from "./components/navigation";

const Header = () => {
  return (
    <header className="flex justify-center bg-zinc-100">
      <div className="flex items-center gap-6 p-4 max-w-342 w-full ">
        <div className="order-2 md:order-1">
          <HeaderLogo />
        </div>
        <div className="order-1 md:order-2">
          <Naviagtion />
        </div>
        <div className="order-3 ml-auto">
          <EndMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
