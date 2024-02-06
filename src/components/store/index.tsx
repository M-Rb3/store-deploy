import styled from 'styled-components';

import { VmComponent } from '@/components/vm/VmComponent';
import { ComponentWrapperPage } from '../near-org/ComponentWrapperPage';

const Container = styled.div`
  height: 100vh;
  padding: 3rem 0;
`;
console.log(process.env.NEXT_PUBLIC_CONTRACT_ID);

export function StoreBOS() {
  return (
    <Container className="container-xl">
      <VmComponent
        src="baam25.near/widget/store"
        props={{ store: process.env.NEXT_PUBLIC_CONTRACT_ID, accountId: 'baam25.near' }}
      />
    </Container>
  );
}
