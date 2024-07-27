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
        <Image path={`${member}/${selText}`} className="absolute top-0 left-0 w-full" />
      )}
    </>
  );
}

const MemoText = memo(PreviewText);

export default MemoText;
