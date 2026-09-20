import satori from "satori";
import sharp from "sharp";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "./getFontPathByWeight";
import config from "@/config";

const WIDTH = 1200;
const HEIGHT = 630;
const ORANGE = "#ff6600";
const INK = "#171717";
const MUTED = "#737373";
const FONT_FAMILY = "Lora";

type OgImageContent = {
  label: string;
  title: string;
  footer: string;
};

export async function renderOgImage(
  content: OgImageContent,
  requestUrl: URL
): Promise<Response> {
  const fonts = await loadFonts(requestUrl);
  const svg = await satori(buildTree(content), {
    width: WIDTH,
    height: HEIGHT,
    embedFont: true,
    fonts,
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}

async function loadFonts(requestUrl: URL) {
  const family = fontData["--font-og"];
  const regularPath = getFontPathByWeight(family, 400);
  const boldPath = getFontPathByWeight(family, 700);
  if (!regularPath || !boldPath) {
    throw new Error("Cannot find the OG image font files.");
  }
  const [regular, bold] = await Promise.all(
    [regularPath, boldPath].map(path =>
      fetch(experimental_getFontFileURL(path, requestUrl)).then(res =>
        res.arrayBuffer()
      )
    )
  );
  return [
    {
      name: FONT_FAMILY,
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: FONT_FAMILY,
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

function buildTree({ label, title, footer }: OgImageContent) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        color: INK,
        fontFamily: FONT_FAMILY,
      },
      children: [topBar(), body(label, title, footer)],
    },
  };
}

function topBar() {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        height: 56,
        padding: "0 48px",
        background: ORANGE,
        color: "#ffffff",
        fontSize: 26,
        fontWeight: 700,
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              marginRight: 16,
              border: "2px solid #ffffff",
            },
            children: config.site.title.charAt(0),
          },
        },
        config.site.title,
      ],
    },
  };
}

function body(label: string, title: string, footer: string) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: 1,
        padding: "56px 72px 48px",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    color: ORANGE,
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    marginBottom: 28,
                  },
                  children: label,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: titleFontSize(title),
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: -1,
                    maxHeight: 330,
                    overflow: "hidden",
                  },
                  children: title,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              borderTop: `3px solid ${ORANGE}`,
              paddingTop: 20,
              color: MUTED,
              fontSize: 26,
            },
            children: [
              { type: "span", props: { children: footer } },
              {
                type: "span",
                props: { children: new URL(config.site.url).hostname },
              },
            ],
          },
        },
      ],
    },
  };
}

function titleFontSize(title: string) {
  if (title.length > 90) return 56;
  if (title.length > 60) return 64;
  return 76;
}
