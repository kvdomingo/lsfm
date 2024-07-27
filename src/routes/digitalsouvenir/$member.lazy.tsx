import ActionButtons from "@/components/digitalSouvenir/ActionButtons.tsx";
import AudioGallery from "@/components/digitalSouvenir/AudioGallery.tsx";
import MiniGallery from "@/components/digitalSouvenir/MiniGallery.tsx";
import TextGallery from "@/components/digitalSouvenir/TextGallery.tsx";
import Preview from "@/components/digitalSouvenir/preview/Preview.tsx";
import { memberIndex } from "@/constants.ts";
import { Page, useStore } from "@/store.ts";
import type { Member } from "@/types/member.ts";
import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

export const Route = createLazyFileRoute("/digitalsouvenir/$member")({
  component: DigitalSouvenir,
});

function DigitalSouvenir() {
  const { resetState, page } = useStore();
  const { member }: { member: Member } = useParams({ strict: false });

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  const visual = useMemo(
    () =>
      Array(10)
        .fill("")
        .map((_, i) => `Photocard_Visual_${memberIndex[member]}_${i + 1}.png`),
    [member],
  );

  const moving = useMemo(
    () =>
      Array(10)
        .fill("")
        .map((_, i) => `Photocard_Visual_Moving_${memberIndex[member]}_${i + 1}`),
    [member],
  );

  return (
    <>
      <div className="container mx-auto my-8 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="col-span-4" />
          <div className="-mx-14 -mb-12 col-span-8">
            <h1 className="my-0">The First Moment of</h1>
            <h2 className="relative z-10 my-0 text-[100pt] text-outline capitalize">
              {member}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="col-span-4">
            <Preview />
          </div>
          <div className="col-span-8 content-start px-8 pt-12">
            {page === Page.VISUAL && (
              <>
                <p className="mb-4 font-bold text-sm uppercase">
                  Step 02. Choose the visual card you like best
                </p>
                <MiniGallery
                  header="Visual - Still Images"
                  media={visual}
                  type="image"
                />
                <MiniGallery
                  header="Visual - Moving Images"
                  media={moving}
                  type="video"
                />
              </>
            )}
            {page === Page.TEXT_AUDIO && (
              <>
                <p className="font-bold text-sm uppercase">
                  Step 03. Choose one text card and one auditory card to complete
                </p>
                <TextGallery />
                <AudioGallery />
              </>
            )}
            <ActionButtons />
          </div>
        </div>
      </div>
    </>
  );
}
