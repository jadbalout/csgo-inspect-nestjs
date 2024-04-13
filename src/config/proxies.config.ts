import { registerAs } from "@nestjs/config";
export default registerAs("proxies", () => ({
  proxies: JSON.parse(process.env.PROXIES || "[]")
}));
