import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import { cn } from "@/utils";

function Button({
  className = "",
  ...props
}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "mr-2 cursor-pointer border-3 px-14 py-2",
        "bg-transparent text-sm text-white uppercase leading-loose tracking-wider",
        "transition-all duration-200 ease-in-out",
        "border-white border-solid",
        "hover:backdrop-brightness-[4]",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    />
  );
}

export default Button;
