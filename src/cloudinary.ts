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
