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
	}
]

export default setDirectoryConfigs(
	sirenParserNodeConfig,
	{ 'test': sirenParserTestingConfig },
);
