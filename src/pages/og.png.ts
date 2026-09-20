import type { APIRoute } from "astro";
import { renderOgImage } from "@/utils/ogImage";
import config from "@/config";

export const GET: APIRoute = ({ url }) =>
  renderOgImage(
    {
      label: "Computação · Matemática",
      title: config.site.description,
      footer: config.site.author,
    },
    url
  );
