/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import { VDialog } from "vuetify/components";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: "#FFD600",
          secondary: "#a9e5d5",
          error: "#FF1744",
          success: "#00C853",
        },
      },
    },
  },
  defaults: {
    VBtn: {
      variant: "elevated",
      color: "primary",
    },
    VDialog: {
      width: 800,
      scrim: "rgba(0,0,0,1)",
    },
    VTooltip: {
      location: "bottom",
    },
    VTextarea: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
    },
    VTextField: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
    },
    VSelect: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
    },
  },
});
