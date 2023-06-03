import { memo } from "react";

import Image from "@/components/common/Image.tsx";

interface PreviewImageProps {
  selText: string | null;
  member: string;
}

function PreviewText({ selText, member }: PreviewImageProps) {
  return (
    <>
      {!!selText && (
        <Image
          path={`${member}/${selText}`}
          className="absolute left-0 top-0 w-full"
        />
      )}
    </>
  );
}

const MemoText = memo(PreviewText);

export default MemoText;
