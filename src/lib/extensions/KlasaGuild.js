const { Structures } = require('discord.js');
const KlasaGuildMemberManager = require('./KlasaGuildMemberManager');

Structures.extend('Guild', Guild => {
	class KlasaGuild extends Guild {

		constructor(client, data) {
			// avoid double iteration by the super class populating the members collection
			const { members, ...restData } = data || {};
			super(client, Object.keys(restData).length ? restData : undefined);

			this.members = new KlasaGuildMemberManager(this);
			if (members) for (const member of members) this.members.add(member);
		}

	}

	return KlasaGuild;
});
