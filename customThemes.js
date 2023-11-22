import { createThemeBuilder } from '@tamagui/theme-builder';

const themesBuilder = createThemeBuilder()
  .addPalettes({
    universalPalette: [
      '#000',
      '#222',
      '#333',
      '#444',
      '#888',
      '#999',
      '#c0c0c0',
      '#eee',
      '#B6B6B6',
      '#007aff',
    ],
  })
  .addTemplates({
    baseDark: {
      background: '#4f4f4f',
      backgroundFocus: '#787878',
      backgroundHover: '#787878',
      backgroundPress: '#787878',
      backgroundStrong: '#000000',
      backgroundTransparent: '#4f4f4f80',
      borderColor: '#787878',
      color: '#eeeeee',
      colorTransparent: '#eeeeee80',
      placeholderColor: '#a1a1a1',
      shadowColor: '#a1a1a1',
      highlightColor: 9,
    },
    baseLight: {
      background: '#c9c9c9',
      backgroundFocus: '#7d7d7d',
      backgroundHover: '#7d7d7d',
      backgroundPress: '#7d7d7d',
      backgroundStrong: '#eeeeee',
      backgroundTransparent: '#eeeeee80',
      borderColor: '#787878',
      color: '#000000',
      colorTransparent: '#00000080',
      placeholderColor: '#545454',
      shadowColor: '#545454',
      highlightColor: 9,
    },
  })
  .addThemes({
    light: {
      template: 'baseLight',
      palette: 'universalPalette',
    },

    dark: {
      template: 'baseDark',
      palette: 'universalPalette',
    },
  });
export const themes = themesBuilder.build();
