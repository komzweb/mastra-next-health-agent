import { Mastra } from "@mastra/core";

import { healthAgent } from "./agents/healthAgent";

export const mastra = new Mastra({
	agents: { healthAgent },
});
