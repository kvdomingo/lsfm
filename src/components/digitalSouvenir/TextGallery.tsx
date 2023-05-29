import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { memberIndex } from "../../constants.ts";
import { useDispatch } from "../../hooks/store.ts";
import { setSelectedText } from "../../store/appSlice.ts";
import { Member } from "../../types/member.ts";
import Image from "../common/Image.tsx";

function TextGallery() {
  const dispatch = useDispatch();
  const member = useParams().member as Member;

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
    dispatch(setSelectedText(txt));
  };

  return (
    <div className="mb-6">
      <h3 className="text-2xl my-2">TEXT</h3>
      <hr className="text-white" />
      <div className="grid grid-cols-6 py-4 gap-4">
        {textWhite.map(txt => (
          <Image
            key={txt}
            path={`${member}/${txt}`}
            className="w-full bg-[#080808] cursor-pointer border border-solid border-white"
            onClick={handleClick(txt)}
          />
        ))}
        {textBlack.map(txt => (
          <Image
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
