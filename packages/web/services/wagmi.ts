import {
  connectorsForWallets,
  createAuthenticationAdapter,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { GetSiweMessageOptions } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SiweMessage } from "siwe";
import { configureChains, createClient, goerli, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import env from "../environment";
import { isProd, vars } from "./../environment/vars";
import http from "./http";

export const { chains, provider, webSocketProvider } = configureChains(
  isProd() ? [mainnet] : [goerli],
  [alchemyProvider({ apiKey: vars.AlchemyKey }), publicProvider()]
);

const { wallets } = getDefaultWallets({ appName: env.app.name, chains });
const connectors = connectorsForWallets([...wallets]);
export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Meme2Earn",
});

interface CreateRainbowAdapterProps {
  onVerifySuccess: () => void;
  onLogoutSuccess: () => void;
}

export const createRainbowAuthAdapter = ({
  onVerifySuccess,
  onLogoutSuccess,
}: CreateRainbowAdapterProps) =>
  createAuthenticationAdapter({
    getNonce: async () => {
      const { data } = await http.get("/auth/nonce");
      return data.nonce;
    },
    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to Meme2Earn",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }: { message: SiweMessage }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      const res = await http.post("/auth/login", { message, signature });
      if (res.status === 201) {
        await onVerifySuccess();
        return true;
      }
      return false;
    },
    signOut: async () => {
      try {
        await http.get("/auth/logout");
      } catch (e) {
        console.log(e);
      } finally {
        await onLogoutSuccess();
      }
    },
  });
