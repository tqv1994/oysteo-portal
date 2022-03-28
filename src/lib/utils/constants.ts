export const INVALID_DELAY_TIME = 9000; // ms
export const TIME_RESEND_EMAIL_FORGOT_PW = 10; // s
export const TIME_ZONES = [
	{ locale: 'America/Havana', gmt: 'GMT-05:00', zone: 'Cuba' },
	{ locale: 'America/Bogota', gmt: 'GMT-05:00', zone: 'Bogota, Lima, Quito, Rio Branco' },
	{ locale: 'America/Caracas', gmt: 'GMT-04:30', zone: 'Caracas' },
	{ locale: 'America/Santiago', gmt: 'GMT-04:00', zone: 'Santiago' },
	{ locale: 'America/La_Paz', gmt: 'GMT-04:00', zone: 'La Paz' },
	{ locale: 'Atlantic/Stanley', gmt: 'GMT-04:00', zone: 'Faukland Islands' },
	{ locale: 'America/Campo_Grande', gmt: 'GMT-04:00', zone: 'Brazil' },
	{ locale: 'America/Goose_Bay', gmt: 'GMT-04:00', zone: 'Atlantic Time (Goose Bay)' },
	{ locale: 'America/Glace_Bay', gmt: 'GMT-04:00', zone: 'Atlantic Time (Canada)' },
	{ locale: 'America/St_Johns', gmt: 'GMT-03:30', zone: 'Newfoundland' },
	{ locale: 'America/Araguaina', gmt: 'GMT-03:00', zone: 'UTC-3' },
	{ locale: 'America/Montevideo', gmt: 'GMT-03:00', zone: 'Montevideo' },
	{ locale: 'America/Miquelon', gmt: 'GMT-03:00', zone: 'Miquelon, St. Pierre' },
	{ locale: 'America/Godthab', gmt: 'GMT-03:00', zone: 'Greenland' },
	{ locale: 'America/Argentina/Buenos_Aires', gmt: 'GMT-03:00', zone: 'Buenos Aires' },
	{ locale: 'America/Sao_Paulo', gmt: 'GMT-03:00', zone: 'Brasilia' },
	{ locale: 'America/Noronha', gmt: 'GMT-02:00', zone: 'Mid-Atlantic' },
	{ locale: 'Atlantic/Cape_Verde', gmt: 'GMT-01:00', zone: 'Cape Verde Is.' },
	{ locale: 'Atlantic/Azores', gmt: 'GMT-01:00', zone: 'Azores' },
	{ locale: 'Europe/Belfast', gmt: 'GMT', zone: 'Greenich Mean Time : Belfast' },
	{ locale: 'Europe/Dublin', gmt: 'GMT', zone: 'Greenich Mean Time : Dublin' },
	{ locale: 'Europe/Lisbon', gmt: 'GMT', zone: 'Greenich Mean Time : Lisbon' },
	{ locale: 'Europe/London', gmt: 'GMT', zone: 'Greenich Mean Time : London' },
	{ locale: 'Africa/Abidjan', gmt: 'GMT) Monr', zone: 'ia, Reykjavik' },
	{
		locale: 'Europe/Amsterdam',
		gmt: 'GMT+01:00',
		zone: 'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna'
	},
	{
		locale: 'Europe/Belgrade',
		gmt: 'GMT+01:00',
		zone: 'Belgrade, Bratislava, Budapest, Ljubljana, Prague'
	},
	{ locale: 'Europe/Brussels', gmt: 'GMT+01:00', zone: 'Brussels, Copenhagen, Madrid, Paris' },
	{ locale: 'Africa/Algiers', gmt: 'GMT+01:00', zone: 'West Central Africa' },
	{ locale: 'Africa/Windhoek', gmt: 'GMT+01:00', zone: 'Windhoek' },
	{ locale: 'Asia/Beirut', gmt: 'GMT+02:00', zone: 'Beirut' },
	{ locale: 'Africa/Cairo', gmt: 'GMT+02:00', zone: 'Cairo' },
	{ locale: 'Asia/Gaza', gmt: 'GMT+02:00', zone: 'Gaza' },
	{ locale: 'Africa/Blantyre', gmt: 'GMT+02:00', zone: 'Harare, Pretoria' },
	{ locale: 'Asia/Jerusalem', gmt: 'GMT+02:00', zone: 'Jerusalem' },
	{ locale: 'Europe/Minsk', gmt: 'GMT+02:00', zone: 'Minsk' },
	{ locale: 'Asia/Damascus', gmt: 'GMT+02:00', zone: 'Syria' },
	{ locale: 'Europe/Moscow', gmt: 'GMT+03:00', zone: 'Moscow, St. Petersburg, Volgograd' },
	{ locale: 'Africa/Addis_Ababa', gmt: 'GMT+03:00', zone: 'Nairobi' },
	{ locale: 'Asia/Tehran', gmt: 'GMT+03:30', zone: 'Tehran' },
	{ locale: 'Asia/Dubai', gmt: 'GMT+04:00', zone: 'Abu Dhabi, Muscat' },
	{ locale: 'Asia/Yerevan', gmt: 'GMT+04:00', zone: 'Yerevan' },
	{ locale: 'Asia/Kabul', gmt: 'GMT+04:30', zone: 'Kabul' },
	{ locale: 'Asia/Yekaterinburg', gmt: 'GMT+05:00', zone: 'Ekaterinburg' },
	{ locale: 'Asia/Tashkent', gmt: 'GMT+05:00', zone: 'Tashkent' },
	{ locale: 'Asia/Kolkata', gmt: 'GMT+05:30', zone: 'Chennai, Kolkata, Mumbai, New Delhi' },
	{ locale: 'Asia/Katmandu', gmt: 'GMT+05:45', zone: 'Kathmandu' },
	{ locale: 'Asia/Dhaka', gmt: 'GMT+06:00', zone: 'Astana, Dhaka' },
	{ locale: 'Asia/Novosibirsk', gmt: 'GMT+06:00', zone: 'Novosibirsk' },
	{ locale: 'Asia/Rangoon', gmt: 'GMT+06:30', zone: 'Yangon (Rangoon)' },
	{ locale: 'Asia/Bangkok', gmt: 'GMT+07:00', zone: 'Bangkok, Hanoi, Jakarta' },
	{ locale: 'Asia/Krasnoyarsk', gmt: 'GMT+07:00', zone: 'Krasnoyarsk' },
	{ locale: 'Asia/Hong_Kong', gmt: 'GMT+08:00', zone: 'Beijing, Chongqing, Hong Kong, Urumqi' },
	{ locale: 'Asia/Irkutsk', gmt: 'GMT+08:00', zone: 'Irkutsk, Ulaan Bataar' },
	{ locale: 'Australia/Perth', gmt: 'GMT+08:00', zone: 'Perth' },
	{ locale: 'Australia/Eucla', gmt: 'GMT+08:45', zone: 'Eucla' },
	{ locale: 'Asia/Tokyo', gmt: 'GMT+09:00', zone: 'Osaka, Sapporo, Tokyo' },
	{ locale: 'Asia/Seoul', gmt: 'GMT+09:00', zone: 'Seoul' },
	{ locale: 'Asia/Yakutsk', gmt: 'GMT+09:00', zone: 'Yakutsk' },
	{ locale: 'Australia/Adelaide', gmt: 'GMT+09:30', zone: 'Adelaide' },
	{ locale: 'Australia/Darwin', gmt: 'GMT+09:30', zone: 'Darwin' },
	{ locale: 'Australia/Brisbane', gmt: 'GMT+10:00', zone: 'Brisbane' },
	{ locale: 'Australia/Hobart', gmt: 'GMT+10:00', zone: 'Hobart' },
	{ locale: 'Asia/Vladivostok', gmt: 'GMT+10:00', zone: 'Vladivostok' },
	{ locale: 'Australia/Lord_Howe', gmt: 'GMT+10:30', zone: 'Lord Howe Island' },
	{ locale: 'Etc/GMT-11', gmt: 'GMT+11:00', zone: 'Solomon Is., New Caledonia' },
	{ locale: 'Asia/Magadan', gmt: 'GMT+11:00', zone: 'Magadan' },
	{ locale: 'Pacific/Norfolk', gmt: 'GMT+11:30', zone: 'Norfolk Island' },
	{ locale: 'Asia/Anadyr', gmt: 'GMT+12:00', zone: 'Anadyr, Kamchatka' },
	{ locale: 'Pacific/Auckland', gmt: 'GMT+12:00', zone: 'Auckland, Wellington' },
	{ locale: 'Etc/GMT-12', gmt: 'GMT+12:00', zone: 'Fiji, Kamchatka, Marshall Is.' },
	{ locale: 'Pacific/Chatham', gmt: 'GMT+12:45', zone: 'Chatham Islands' },
	{ locale: 'Pacific/Tongatapu', gmt: 'GMT+13:00', zone: "Nuku'alofa" },
	{ locale: 'Pacific/Kiritimati', gmt: 'GMT+14:00', zone: 'Kiritimati' }
];
