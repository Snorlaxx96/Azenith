import { useMemo } from "react";

export type PageTypographyProps = {
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string | number;
  bodyWeight?: string | number;
  primaryColor?: string;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
};

export type PageTypographyRecipe = PageTypographyProps & {
  headingSelector?: string;
  bodySelector?: string;
};

export type LandingPageCustomization = PageTypographyProps & {
  recipe?: PageTypographyRecipe;
};

const FONT_STACKS: Record<string, string> = {
  "iowan-old-style": '"Iowan Old Style", "Baskerville", "Times New Roman", serif',
  inter: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
};

export function splitTypographyProps<T extends PageTypographyProps>(
  props: T,
): [PageTypographyProps, Omit<T, keyof PageTypographyProps>] {
  const {
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    primaryColor,
    headingSize,
    bodySize,
    headingLetterSpacing,
    ...rest
  } = props;
  return [
    {
      headingFont,
      bodyFont,
      headingWeight,
      bodyWeight,
      primaryColor,
      headingSize,
      bodySize,
      headingLetterSpacing,
    },
    rest,
  ];
}

export function usePageTypography(
  recipe: PageTypographyRecipe,
  overrides: PageTypographyProps,
): LandingPageCustomization {
  return useMemo(
    () => ({
      ...recipe,
      ...Object.fromEntries(
        Object.entries(overrides).filter(([, value]) => value !== undefined),
      ),
      recipe,
    }),
    [
      recipe,
      overrides.headingFont,
      overrides.bodyFont,
      overrides.headingWeight,
      overrides.bodyWeight,
      overrides.primaryColor,
      overrides.headingSize,
      overrides.bodySize,
      overrides.headingLetterSpacing,
    ],
  );
}

const CUSTOMIZATION_STYLE_ID = "threeui-page-customization";

export function applyPageCustomization(
  frame: HTMLIFrameElement | null,
  customization?: LandingPageCustomization,
) {
  const doc = frame?.contentDocument;
  if (!doc) return;

  doc.getElementById(CUSTOMIZATION_STYLE_ID)?.remove();
  if (!customization) return;

  const serifStack = customization.headingFont
    ? FONT_STACKS[customization.headingFont] || customization.headingFont
    : undefined;
  const monoStack = customization.bodyFont
    ? FONT_STACKS[customization.bodyFont] || customization.bodyFont
    : undefined;

  const accentColor =
    !customization.primaryColor ||
    customization.primaryColor.toLowerCase() === "#c87046"
      ? "#F5AFAF"
      : customization.primaryColor;

  const style = doc.createElement("style");
  style.id = CUSTOMIZATION_STYLE_ID;
  style.textContent = `
    :root {
      ${serifStack ? `--serif: ${serifStack};` : ""}
      ${monoStack ? `--mono: ${monoStack};` : ""}
      ${accentColor ? `--accent: ${accentColor};` : ""}
    }
    ${
      customization.headingWeight
        ? `.selection__title, .detail-title, .editorial-identity strong { font-weight: ${customization.headingWeight}; }`
        : ""
    }
    ${
      customization.headingLetterSpacing !== undefined
        ? `.selection__title { letter-spacing: ${customization.headingLetterSpacing}em; }`
        : ""
    }
    ${
      customization.bodyWeight
        ? `body { font-weight: ${customization.bodyWeight}; }`
        : ""
    }
  `;
  doc.head.appendChild(style);
}

export function postPageCustomization(
  frame: HTMLIFrameElement | null,
  customization?: LandingPageCustomization,
) {
  if (!frame?.contentWindow || !customization) return;
  frame.contentWindow.postMessage(
    {
      type: "threeui-page-customization",
      customization,
    },
    "*",
  );
}
