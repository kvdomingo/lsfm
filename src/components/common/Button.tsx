import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import { cn } from "@/utils";

function Button({
  className = "",
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      {...props}
      className={cn(
        "border-3 mr-2 cursor-pointer px-14 py-2",
        "bg-transparent text-sm uppercase leading-loose tracking-wider text-white",
        "transition-all duration-200 ease-in-out",
        "border-solid border-white",
        "hover:backdrop-brightness-[4]",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    />
  );
}

export default Button;
