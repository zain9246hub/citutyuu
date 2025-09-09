
import React from "react";

interface ReelInfoProps {
  user: string;
  caption: string;
}

const ReelInfo = ({ user, caption }: ReelInfoProps) => {
  return (
    <div className="absolute bottom-36 left-4 right-4 text-white z-10">
      <h3 className="font-display text-xl tracking-tight drop-shadow-lg">{user}</h3>
      <p className="text-sm font-sans drop-shadow-md mt-2 max-w-[80%] line-clamp-2">{caption}</p>
    </div>
  );
};

export default ReelInfo;
