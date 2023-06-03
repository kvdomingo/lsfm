import { Cloudinary } from "@cloudinary/url-gen";

export const cld = new Cloudinary({
  cloud: {
    cloudName: "kdphotography-assets",
  },
  url: {
    secure: true,
  },
  tag: {
    clientHints: true,
    responsive: {
      isResponsive: true,
    },
    contentDelimiter: "/",
  },
});

export const buildUrl = (path: string) => {
  const _path = `lsfm/assets/${path}`;
  if (path.includes("Moving")) {
    return cld.video(_path).toURL();
  } else {
    return cld.image(_path).toURL();
  }
};
