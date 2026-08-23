export interface LkLogoPath {
  readonly d: string;
  readonly transform: string;
}

export interface LkRoboticsPath extends LkLogoPath {
  readonly letter: string;
}

export const LK_PATHS: readonly Readonly<LkLogoPath>[];
export const ROBOTICS_PATHS: readonly Readonly<LkRoboticsPath>[];
export const ROBOTICS_INLINE_TRANSFORM: string;

export const LK_LOGO_VIEWBOX: Readonly<{
  mark: string;
  stacked: string;
  inline: string;
}>;

export const LK_LOGO_COLORS: Readonly<{
  navy: string;
  accent: string;
  white: string;
}>;

export const LK_LOGO_USAGE: Readonly<{
  geometryVersion: string;
  minimumVisibleArtworkHeightPx: Readonly<{ mark: number }>;
  minimumRenderedHeightPx: Readonly<{
    mark: number;
    stacked: number;
    inline: number;
    banner: number;
  }>;
  minimumRequiredSlotWidthPx: Readonly<{
    mark: number;
    stacked: number;
    inline: number;
    banner: number;
  }>;
  officialSquare: Readonly<{
    minimumRenderedSquarePx: number;
    recommendedRenderedSquarePx: number;
  }>;
  favicon: Readonly<{ minimumRenderedSquarePx: number }>;
  corporateSquare: Readonly<{
    minimumRenderedSquarePx: number;
    recommendedRenderedSquarePx: number;
    minimumPrintedSquareMm: number;
  }>;
  clearSpace: Readonly<{
    measurement: string;
    application: string;
    minimumToX: number;
    coBrandToX: number;
    appliesTo: readonly string[];
  }>;
}>;
