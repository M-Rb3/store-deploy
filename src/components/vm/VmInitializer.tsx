import { sanitizeUrl } from '@braintree/sanitize-url';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import type { WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { mapValues } from 'lodash';
import { setupNeth } from '@near-wallet-selector/neth';
import { setupNightly } from '@near-wallet-selector/nightly';
import { setupSender } from '@near-wallet-selector/sender';
import { setupWelldoneWallet } from '@near-wallet-selector/welldone-wallet';
import Big from 'big.js';
import {
  CommitButton,
  EthersProviderContext,
  useAccount,
  useCache,
  useInitNear,
  useNear,
  utils,
  Widget,
} from 'near-social-vm';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import { useEthersProviderContext } from '@/data/web3';
import { setupFastAuth } from '@/lib/selector/setup';
import { useAuthStore } from '@/stores/auth';
import { useVmStore } from '@/stores/vm';
import { networkId, signInContractId } from '@/utils/config';
import { setupMintbaseWallet } from '@near-wallet-selector/mintbase-wallet';
import { isValidAttribute } from 'dompurify';

export default function VmInitializer() {
  const [signedIn, setSignedIn] = useState(false);
  const [signedAccountId, setSignedAccountId] = useState(null);
  const [availableStorage, setAvailableStorage] = useState<Big | null>(null);
  const [walletModal, setWalletModal] = useState<WalletSelectorModal | null>(null);
  const ethersProviderContext = useEthersProviderContext();
  const router = useRouter();
  const { initNear } = useInitNear();
  const near = useNear();
  const account = useAccount();
  const cache = useCache();
  const accountId = account.accountId;
  const setAuthStore = useAuthStore((state) => state.set);
  const setVmStore = useVmStore((store) => store.set);

  useEffect(() => {
    initNear &&
      initNear({
        networkId,
        // walletConnectCallback: recordWalletConnect,
        selector: setupWalletSelector({
          network: networkId,
          modules: [
            setupMintbaseWallet({
              walletUrl: 'https://wallet.mintbase.xyz',
              callbackUrl: 'https://store-deploy-omega.vercel.app/',
              deprecated: false,
            }),
            setupMyNearWallet(),
            setupSender(),
            setupHereWallet(),
            setupMeteorWallet(),
            setupNeth({
              gas: '300000000000000',
              bundle: false,
            }),
            setupNightly(),
            setupWelldoneWallet(),

            setupFastAuth({
              networkId,
              signInContractId,
              relayerUrl:
                networkId === 'testnet'
                  ? 'http://34.70.226.83:3030/relay'
                  : 'https://near-relayer-mainnet.api.pagoda.co/relay',
            }) as any, // TODO: Refactor setupFastAuth() to TS
          ],
        }),
        customElements: {
          Link: ({ to, href, ...rest }: { to: string | object | undefined; href: string | object }) => {
            const cleanProps = mapValues({ to, href, ...rest }, (val: any, key: string) => {
              if (!['to', 'href'].includes(key)) return val;
              if (key === 'href' && !val) val = to;
              return typeof val === 'string' && isValidAttribute('a', 'href', val) ? val : 'about:blank';
            });

            return <Link {...cleanProps} />;
          },
        },
      });
  }, [initNear]);

  useEffect(() => {
    if (!near) {
      return;
    }
    near.selector.then((selector: any) => {
      setWalletModal(setupModal(selector, { contractId: near.config.contractName }));
    });
  }, [near]);

  const requestSignInWithWallet = useCallback(
    (event: any) => {
      event?.preventDefault();
      walletModal?.show();
      return false;
    },
    [walletModal],
  );

  const requestSignIn = useCallback(
    (queryParam?: string) => {
      router.push(`/signin${queryParam}`);
    },
    [router],
  );

  const logOut = useCallback(async () => {
    if (!near) {
      return;
    }
    const wallet = await (await near.selector).wallet();
    wallet.signOut();
    near.accountId = null;
    setSignedIn(false);
    setSignedAccountId(null);
    localStorage.removeItem('accountId');
  }, [near]);

  const refreshAllowance = useCallback(async () => {
    alert("You're out of access key allowance. Need sign in again to refresh it");
    await logOut();
    requestSignIn();
  }, [logOut, requestSignIn]);

  useEffect(() => {
    if (!near) {
      return;
    }
    setSignedIn(!!accountId);
    setSignedAccountId(accountId);
  }, [near, accountId]);

  useEffect(() => {
    setAvailableStorage(
      account.storageBalance ? Big(account.storageBalance.available).div(utils.StorageCostPerByte) : Big(0),
    );
  }, [account]);

  useEffect(() => {
    if (navigator.userAgent !== 'ReactSnap') {
      const pageFlashPrevent = document.getElementById('page-flash-prevent');
      if (pageFlashPrevent) {
        pageFlashPrevent.remove();
      }
    }
  }, []);

  useEffect(() => {
    setAuthStore({
      account,
      accountId: signedAccountId || '',
      availableStorage,
      logOut,
      refreshAllowance,
      requestSignIn,
      requestSignInWithWallet,
      signedIn,
    });
  }, [
    account,
    availableStorage,
    logOut,
    refreshAllowance,
    requestSignIn,
    requestSignInWithWallet,
    signedIn,
    signedAccountId,
    setAuthStore,
  ]);

  useEffect(() => {
    setVmStore({
      cache,
      CommitButton,
      ethersContext: ethersProviderContext,
      EthersProvider: EthersProviderContext.Provider,
      Widget,
      near,
    });
  }, [cache, ethersProviderContext, setVmStore, near]);

  return <></>;
}
