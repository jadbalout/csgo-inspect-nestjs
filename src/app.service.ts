import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CSGOInspector } from 'csgo-inspect';
import { InspectAdapter } from './inspect.adapter';
import proxiesConfig from './config/proxies.config';
import { ConfigType } from '@nestjs/config';
@Injectable()
export class AppService {
	csgoInspector: CSGOInspector;
	constructor(
		@Inject(proxiesConfig.KEY)
		private readonly config: ConfigType<typeof proxiesConfig>,
		private readonly inspectAdapter: InspectAdapter
	) {
		this.csgoInspector = new CSGOInspector({
			httpProxies: this.config.proxies
		});
		this.csgoInspector.useAdapter(this.inspectAdapter);
		this.csgoInspector.loadBots();
	}
	async inspectURL(url: string) {
		try {
			const res = await this.csgoInspector.getItemByInspectLink(url);
			return res;
		} catch (e) {
			throw new InternalServerErrorException(e.message ?? e);
		}
	}
	async inspectURLs(urls: string[]) {
		try {
			const res = await this.csgoInspector.getItemsByInspectLinks(urls);
			return res;
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException(e.message ?? e);
		}
	}
}
