import { useSnackbar } from "@/components/use-snackbar/useSnackbar";

export const errorSnackbarMixin = {
  methods: {
    errorSnackbar(error: any) {
      const openSnackbar = useSnackbar();

      const status = error?.response?.status;

      if (status === 401) {
        openSnackbar({
          props: {
            message: "Unauthorized access.",
            color: "error",
          },
        });
      } else if (status === 403) {
        openSnackbar({
          props: {
            message: "Forbidden access.",
            color: "error",
          },
        });
      } else if (status === 404) {
        openSnackbar({
          props: {
            message: "Resource not found.",
            color: "error",
          },
        });
      } else if (status === 500) {
        openSnackbar({
          props: {
            message: "Internal server error.",
            color: "error",
          },
        });
      }

      console.error(error);
    },
  },
};
