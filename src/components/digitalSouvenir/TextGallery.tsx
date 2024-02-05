import { useMemo } from "react";

import { useParams } from "@tanstack/react-router";

import { memberIndex } from "@/constants.ts";
import { useZStore } from "@/store.ts";
import { Member } from "@/types/member.ts";

import Image from "../common/Image.tsx";

function TextGallery() {
  const { setSelectedText } = useZStore();
  const { member }: { member: Member } = useParams({ strict: false });

  const textWhite = useMemo(
    () =>
      Array(6)
        .fill("")
        .map((_, i) => `Photocard_Text_${memberIndex[member]}_${i + 1}_w.png`),
    [member],
  );

  const textBlack = useMemo(
    () =>
      Array(6)
        .fill("")
        .map((_, i) => `Photocard_Text_${memberIndex[member]}_${i + 1}_b.png`),
    [member],
  );

  const handleClick = (txt: string) => () => {
    setSelectedText(txt);
  };

  return (
    <div className="mb-6">
      <h3 className="my-2 text-2xl">TEXT</h3>
      <hr className="text-white" />
      <div className="grid grid-cols-6 gap-4 py-4">
        {textWhite.map(txt => (
          <Image
            key={txt}
            path={`${member}/${txt}`}
            className="w-full cursor-pointer border border-solid border-white bg-[#080808]"
            onClick={handleClick(txt)}
          />
        ))}
        {textBlack.map(txt => (
          <Image
            key={txt}
            path={`${member}/${txt}`}
            className="w-full cursor-pointer bg-white"
            onClick={handleClick(txt)}
          />
        ))}
      </div>
    </div>
  );
}

export default TextGallery;
