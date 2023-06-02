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
        "border-3 mr-2 cursor-pointer border-solid border-white bg-transparent px-14 py-2 text-sm uppercase leading-loose tracking-wider text-white transition-all duration-200 ease-in-out hover:backdrop-brightness-[4]",
        className,
      )}
    />
  );
}

export default Button;
