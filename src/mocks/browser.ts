import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// MSW Worker 설정
export const worker = setupWorker(...handlers);

