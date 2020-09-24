const { Client: { plugin } } = require('klasa');

module.exports = {
	KlasaGuild: require('./lib/extensions/KlasaGuild'),
	KlasaGuildMemberManager: require('./lib/extensions/KlasaGuildMemberManager'),
	KlasaMember: require('./lib/extensions/KlasaMember'),
	Client: require('./lib/Client'),
	[plugin]: require('./lib/Client')[plugin]
};
