import { Snackbar } from "@mui/base";

import { useSelector } from "../../hooks/store.ts";
import { AlertColor } from "../../types/alert.ts";

function GlobalNotification() {
  const notification = useSelector(state => state.app.notification);

  return (
    <Snackbar
      open={notification.isOpen}
      className={`animate-slide-in animate-slide-out text-black fixed bottom-0 right-0 m-6 p-4 rounded-lg ${
        AlertColor[notification.status]
      }`}
    >
      {notification.message}
    </Snackbar>
  );
}

export default GlobalNotification;
