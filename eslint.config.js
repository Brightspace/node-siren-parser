import { nodeConfig, setDirectoryConfigs, testingConfig } from 'eslint-config-brightspace';

const sirenParserNodeConfig = [
	...nodeConfig,
	{
		languageOptions: {
			sourceType: 'module',
		},
	},
];

const sirenParserTestingConfig = [
	...testingConfig,
	{
		languageOptions: {
			sourceType: 'module',
		},
		rules: {
			'prefer-arrow-callback': 'off',
		},
	}
]

export default setDirectoryConfigs(
	sirenParserNodeConfig,
	{ 'test': sirenParserTestingConfig },
);
