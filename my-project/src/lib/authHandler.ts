import type { AppDispatch } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

let dispatch: AppDispatch | null = null;
let isHandlingUnauthorized = false;

export const injectStore = (_dispatch: AppDispatch) => {
  dispatch = _dispatch;
};

export const handleUnauthorized = () => {
  // 🚫 prevent infinite loop / blinking
  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;

  if (dispatch) {
    dispatch(logout());
  }

  // slight delay avoids race with pending requests
  setTimeout(() => {
    window.location.href = "/login";
  }, 100);
};
