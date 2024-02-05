import { useEffect } from 'react';

import { MetaTags } from '@/components/MetaTags';
import { StoreBOS } from '@/components/store';
import { useDefaultLayout } from '@/hooks/useLayout';
import { useAuthStore } from '@/stores/auth';
import { useCurrentComponentStore } from '@/stores/current-component';
import type { NextPageWithLayout } from '@/utils/types';

const HomePage: NextPageWithLayout = () => {
  const signedIn = useAuthStore((store) => store.signedIn);
  const setComponentSrc = useCurrentComponentStore((store) => store.setSrc);

  useEffect(() => {
    if (!signedIn) {
      setComponentSrc(null);
    }
  }, [signedIn, setComponentSrc]);

  return (
    <>
      <MetaTags
        title={`${process.env.NEXT_PUBLIC_CONTRACT_ID} Store`}
        description={`${process.env.NEXT_PUBLIC_CONTRACT_ID} Store.`}
      />
      <StoreBOS />
    </>
  );
};

HomePage.getLayout = useDefaultLayout;

export default HomePage;
