import { clearTokens } from './tokenStorage';

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let isHandlingUnauthorized = false;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

export function handleUnauthorized(): void {
  if (isHandlingUnauthorized) return;

  isHandlingUnauthorized = true;
  clearTokens();

  if (unauthorizedHandler) {
    unauthorizedHandler();
  } else {
    window.location.assign('/login');
  }

  window.setTimeout(() => {
    isHandlingUnauthorized = false;
  }, 1000);
}
