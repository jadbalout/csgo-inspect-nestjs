import { registerAs } from "@nestjs/config";
import proxies from "proxies.json";
export default registerAs("proxies", () => ({
  proxies: proxies ?? []
}));
