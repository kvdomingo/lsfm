import { memo, useMemo } from "react";

import Image from "@/components/common/Image.tsx";
import Video from "@/components/common/Video.tsx";

interface PreviewMediaComponentProps {
  output: string | null;
  member: string;
  selVisual: string | null;
}

function PreviewMediaComponent({
  output,
  member,
  selVisual,
}: PreviewMediaComponentProps) {
  const MediaComponent = useMemo(
    () => (output?.includes("Moving") ? Video : Image),
    [output],
  );

  return (
    <>
      {!selVisual ? null : (
        <MediaComponent path={`${member}/${selVisual}`} className="w-full" />
      )}
    </>
  );
}

const MemoMediaComponent = memo(PreviewMediaComponent);

export default MemoMediaComponent;
