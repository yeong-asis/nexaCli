interface Color {
  primaryRedHex: string;
  secondaryRedHex: string;
  primaryGreenHex: string;
  secondaryGreenHex: string;
  primaryOrangeHex: string;
  primaryYellowHex: string;
  primaryBlackHex: string;
  primaryDarkGreyHex: string;
  secondaryDarkGreyHex: string;
  primaryGreyHex: string;
  secondaryGreyHex: string;
  primaryLightGreyHex: string;
  secondaryLightGreyHex: string;
  primaryWhiteHex: string;
  primaryBlackRGBA: string;
  secondaryBlackRGBA: string;
  primaryVeryLightGreyHex: string;
  secondaryVeryLightGreyHex: string;
  standardGreyHex: string;
  normalLightGreyHex: string;
  thirdBlackRGBA: string;
  headerColor: string;
  CardGoodStatusColorRGBA: string;
  CardBadStatusColorRGBA: string;
  primaryPurpleHex: string;
  secondaryPurpleHex: string;
  primaryLightBlueHex: string;
  veryPinkHex: string;
}

export const COLORS: Color = {
  primaryRedHex: '#DC3535',
  secondaryRedHex: '#FFDADA',
  primaryGreenHex: '#31572C',
  secondaryGreenHex: '#7AAD7B',
  primaryOrangeHex: '#D17842',
  primaryYellowHex: '#BAB513',
  primaryBlackHex: '#0C0F14',
  primaryDarkGreyHex: '#141921',
  secondaryDarkGreyHex: '#21262E',
  primaryGreyHex: '#252A32',
  secondaryGreyHex: '#252A32',
  primaryLightGreyHex: '#52555A',
  secondaryLightGreyHex: '#AEAEAE',
  primaryVeryLightGreyHex: "#E7E7E7",
  secondaryVeryLightGreyHex: "#F5F5F5",
  standardGreyHex: "#F3F3F3",
  normalLightGreyHex: "#C2C2C2",
  primaryWhiteHex: '#FFFFFF',
  primaryBlackRGBA: 'rgba(12,15,20,0.5)',
  secondaryBlackRGBA: 'rgba(0,0,0,0.7)',
  thirdBlackRGBA: 'rgba(42, 45, 60, 0.48)',
  headerColor: "#F9F9F9",
  CardGoodStatusColorRGBA:'rgba(0, 214, 4)',
  CardBadStatusColorRGBA:'rgba(166, 34, 17)',
  primaryPurpleHex: '#681371',
  secondaryPurpleHex: '#08087DA8',
  primaryLightBlueHex: "#D1E5F4",
  veryPinkHex: "#fffafe",
};

interface FontFamily {
  poppins_black: string;
  poppins_bold: string;
  poppins_extrabold: string;
  poppins_extralight: string;
  poppins_light: string;
  poppins_medium: string;
  poppins_regular: string;
  poppins_semibold: string;
  poppins_thin: string;
}

export const FONTFAMILY: FontFamily = {
  poppins_black: 'Poppins-Black',
  poppins_bold: 'Poppins-Bold',
  poppins_extrabold: 'Poppins-ExtraBold',
  poppins_extralight: 'Poppins-ExtraLight',
  poppins_light: 'Poppins-Light',
  poppins_medium: 'Poppins-Medium',
  poppins_regular: 'Poppins-Regular',
  poppins_semibold: 'Poppins-SemiBold',
  poppins_thin: 'Poppins-Thin',
};


export const BACKGROUNDCOLORCODE = COLORS.secondaryLightGreyHex;

export const HEADERBACKGROUNDCOLORCODE = "#0B3D2E";
// export const HEADERBACKGROUNDCOLORCODE = "#3F51B5";
// export const HEADERBACKGROUNDCOLORCODE = "#007ed9";

export const SECONDGREENCOLOR = "#CFDDBB";
export const BLUEUSEFULCOLOR = "#3F51B5";
export const BLACKUSEFULCOLOR = "#2C2C2C";

export const MAINCOLOR = COLORS.primaryBlackHex;

export const BUTTONCOLOR = COLORS.primaryBlackHex;

