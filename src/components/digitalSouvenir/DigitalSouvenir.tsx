import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { memberIndex } from "../../constants.ts";
import { useDispatch, useSelector } from "../../hooks/store.ts";
import { Page, resetState } from "../../store/appSlice.ts";
import { Member } from "../../types/member.ts";
import GlobalNotification from "../common/GlobalNotification.tsx";
import ActionButtons from "./ActionButtons.tsx";
import AudioGallery from "./AudioGallery.tsx";
import MiniGallery from "./MiniGallery.tsx";
import Preview from "./Preview.tsx";
import TextGallery from "./TextGallery.tsx";

function DigitalSouvenir() {
  const dispatch = useDispatch();
  const member = useParams().member as Member;
  const page = useSelector(state => state.app.page);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

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
        .map(
          (_, i) => `Photocard_Visual_Moving_${memberIndex[member]}_${i + 1}`,
        ),
    [member],
  );

  return (
    <>
      <div className="container min-h-screen my-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="col-span-4" />
          <div className="col-span-8 -mx-14 -mb-12">
            <h1 className="my-0">The First Moment of</h1>
            <h2 className="text-[100pt] relative my-0 capitalize text-outline">
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
                <p className="uppercase text-sm font-bold mb-4">
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
                <p className="text-sm uppercase font-bold">
                  Step 03. Choose one text card and one auditory card to
                  complete
                </p>
                <TextGallery />
                <AudioGallery />
              </>
            )}
            <ActionButtons />
          </div>
        </div>
      </div>
      <GlobalNotification />
    </>
  );
}

export default DigitalSouvenir;
