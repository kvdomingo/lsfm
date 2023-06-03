import { Alert, Snackbar } from "@mui/material";

import { useDispatch, useSelector } from "@/hooks/store.ts";
import { setIsErrorNotificationOpen } from "@/store/appSlice.ts";

function ErrorNotification() {
  const dispatch = useDispatch();
  const { isErrorNotificationOpen } = useSelector(state => state.app);

  return (
    <Snackbar
      open={isErrorNotificationOpen}
      autoHideDuration={5000}
      onClose={() => dispatch(setIsErrorNotificationOpen(false))}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity="info" icon={false}>
        An error occurred. Please try again later.
      </Alert>
    </Snackbar>
  );
}

export default ErrorNotification;
