import { APP_NAME, ALCHEMY_ID } from '@/lib/consts'
import { createClient, WagmiConfig, configureChains, chain, } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ConnectKitProvider, getDefaultClient } from 'connectkit'

// const alchemyId = process.env.ALCHEMY_ID;

const client = createClient(
	getDefaultClient({
		appName: APP_NAME,
		chains: [chain.mainnet, chain.goerli],
		autoConnect: true,
		alchemyId: ALCHEMY_ID,
	})
)

const Web3Provider = ({ children }) => {
	return (
		<WagmiConfig client={client}>
			<ConnectKitProvider
				theme='midnight'
				mode='auto'
				customTheme={{
					"--ck-connectbutton-color": "#a1a1aa",
					"--ck-connectbutton-hover-color": "#ffffff",
					"--ck-connectbutton-border-radius": "0px",
					"--ck-connectbutton-box-shadow": "0",
					"--ck-connectbutton-background": "rgba(0,0,0,0)",
					"--ck-connectbutton-hover-background": "rgba(0,0,0,0)",
					"--ck-connectbutton-active-color": "rgb(34 197 94)",
					"--ck-connectbutton-active-background": "rgba(0,0,0,0)",
					"--ck-border-radius": "0px",
					"--ck-font-family": '"interstate-mono", monospace',
					"--ck-body-background": '#0a100d',
					"--ck-accent-color": '#222222',
					"--ck-accent-text-color": '#ffe7bc',
					"--ck-primary-button-border-radius": '0px',
					"--ck-secondary-button-border-radius": '0px',
				  }}>
				{children}
			</ConnectKitProvider>
		</WagmiConfig>
	)
}

export default Web3Provider
