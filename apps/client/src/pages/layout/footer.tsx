import React from "react";

const Footer = () => {
  return (
    <div className="mt-auto bg-zinc-100 p-4">
      <div className="flex w-full justify-center">
        <p className="text-secondary-foreground">
          © {new Date().getFullYear()} FlowIT. Oleksandr Ivanov
        </p>
      </div>
    </div>
  );
};

export default Footer;
