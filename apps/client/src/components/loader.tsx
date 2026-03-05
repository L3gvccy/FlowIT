import React from "react";
import { BeatLoader } from "react-spinners";

const Loader = ({ size }: { size: number }) => {
  return <BeatLoader color="#7c3aed" size={size} margin={6} />;
};

export default Loader;
