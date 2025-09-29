import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

export default withMermaid({
	...defineConfig({
		title: 'Thiran',
		lang: 'en-US',
		description: 'Config Manager',
		base: '/thiran/',
		head: [['link', { rel: 'icon', href: '/thiran.svg' }]],
		themeConfig: {
			nav: [{ text: 'Guide', link: '/guides/' }],
			sidebar: {
				'/guides/': [
					{
						text: 'Guide',
						items: [
							{ text: 'Introduction', link: '/guides/' },
							{ text: 'Overview', link: '/guides/overview' },
							{
								text: 'Concepts',
								items: [
									{ text: 'Components', link: '/guides/concepts/' },
									{ text: 'Loader', link: '/guides/concepts/loader' },
									{ text: 'Transformer', link: '/guides/concepts/transformer' },
									{ text: 'Hydration', link: '/guides/concepts/hydration' },
									{ text: 'Validation', link: '/guides/concepts/validation' },
								],
							},
						],
					},
				],
			},
			socialLinks: [
				{
					icon: 'github',
					link: 'https://github.com/Prasanna-ramesh/thiran',
				},
			],
			footer: {
				message: 'Released under the MIT License.',
				copyright: 'Copyright © 2025-present Prasanna Ramesh',
			},
			outline: [2, 4],
		},
	}),
});
