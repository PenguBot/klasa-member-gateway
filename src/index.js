const { Client: { plugin } } = require('klasa');

module.exports = {
	KlasaGuild: require('./lib/extensions/KlasaGuild'),
	KlasaGuildMemberManager: require('./lib/extensions/KlasaGuildMemberManager'),
	KlasaMember: require('./lib/extensions/KlasaMember'),
	MemberGateway: require('./lib/settings/MemberGateway'),
	Client: require('./lib/Client'),
	[plugin]: require('./lib/Client')[plugin]
};
