import { Global } from '@mantine/core';

export function GlobalFonts() {
  return (
    <Global
      styles={() => [
        {
          '@font-face': {
            fontFamily: 'NeoSansArabic',
            src: `url(/fonts/NeoSans_Regular.ttf)`,
            fontWeight: 600,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'NeoSansArabic',
            src: `url(/fonts/NeoSans_Medium.ttf)`,
            fontWeight: 700,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'NeoSansArabic',
            src: `url(/fonts/NeoSans_Bold.ttf)`,
            fontWeight: 900,
            fontStyle: 'normal',
          },
        },
      ]}
    />
  );
}