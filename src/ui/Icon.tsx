import type { IconProps } from "../types/types";

export const Icon = ({ name, size = 20, className = "" }: IconProps) => {
  return (
    <span
      className={`material-symbols-outlined ${className} `}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
};
