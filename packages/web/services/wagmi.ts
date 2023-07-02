import {
  createAuthenticationAdapter,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { configureChains, createConfig } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import env from "../environment";
import { isProd, vars } from "./../environment/vars";
import Http from "./http";

const targetNetwork = isProd() ? mainnet : goerli;

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [targetNetwork],
  [alchemyProvider({ apiKey: vars.AlchemyKey }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: env.app.name,
  projectId: vars.WalletConnectId,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

interface CreateRainbowAdapterProps {
  onVerifySuccess: (address: string) => void;
  onLogoutSuccess: () => void;
}

export const createRainbowAuthAdapter = ({
  onVerifySuccess,
  onLogoutSuccess,
}: CreateRainbowAdapterProps) =>
  createAuthenticationAdapter({
    getNonce: async () => {
      const { data } = await Http.getNonce();
      return data.nonce;
    },
    createMessage: ({ nonce, address, chainId }) => {
      const message = new SiweMessage({
        domain: window.location.host,
        statement: "Sign in to wanwan",
        uri: window.location.origin,
        version: "1",
        address,
        chainId,
        nonce,
      });
      return message;
    },
    getMessageBody: ({ message }: { message: SiweMessage }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      const res = await Http.login({ message, signature });
      if (res.status === 201) {
        await onVerifySuccess(res.data.address);
        return true;
      }
      return false;
    },
    signOut: async () => {
      try {
        await Http.logout();
      } catch (e) {
        console.log(e);
      } finally {
        await onLogoutSuccess();
      }
    },
  });
