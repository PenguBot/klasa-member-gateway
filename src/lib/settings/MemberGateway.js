const { Gateway, Settings, util: { getIdentifier } } = require('klasa');
const { Collection } = require('discord.js');

/**
 * The Gateway class that manages the data input, parsing, and output, of an entire database, while keeping a cache system sync with the changes.
 * @extends GatewayStorage
 */
class MemberGateway extends Gateway {

	constructor(store, type, schema, provider) {
		super(store.client, type, schema, provider);

		this.store = store;
		this.syncQueue = new Collection();

		Object.defineProperty(this, '_synced', { value: false, writable: true });
	}

	get idLength() {
		// 18 + 1 + 18: `{MEMBERID}.{GUILDID}`
		return 37;
	}

	acquire(target, id = `${target.guild.id}.${target.id}`) {
		return super.acquire(target, id);
	}

	get(id) {
		const [guildID, memberID] = id.split('.');
		const guild = this.client.guilds.cache.get(guildID);
		if (guild) {
			const member = guild.members.cache.get(memberID);
			return (member && member.settings) || null;
		}

		return null;
	}

	create(target, id = `${target.guild.id}.${target.id}`) {
		return super.create(target, id);
	}

	get Settings() {
		return Settings;
	}

	async sync(input = this.client.guilds.cache.reduce((keys, guild) => keys.concat(guild.members.cache.map(member => member.settings.id)), [])) {
		if (Array.isArray(input)) {
			if (!this._synced) this._synced = true;
			const entries = await this.provider.getAll(this.type, input);
			for (const entry of entries) {
				if (!entry) continue;

				// Get the entry from the cache
				const cache = this.get(entry.id);
				if (!cache) continue;

				cache._existsInDB = true;
				cache._patch(entry);
			}

			// Set all the remaining settings from unknown status in DB to not exists.
			for (const guild of this.client.guilds.cache.values()) {
				for (const member of guild.members.cache.values()) if (member.settings._existsInDB !== true) member.settings._existsInDB = false;
			}
			return this;
		}

		const target = getIdentifier(input);
		if (!target) throw new TypeError('The selected target could not be resolved to a string.');

		const cache = this.get(target);
		return cache ? cache.sync() : null;
	}

}

module.exports = MemberGateway;
