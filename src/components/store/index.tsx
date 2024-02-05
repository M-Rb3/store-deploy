import styled from 'styled-components';

import { VmComponent } from '@/components/vm/VmComponent';

const Container = styled.div`
  height: 100vh;
`;
console.log(process.env.NEXT_PUBLIC_CONTRACT_ID);

export function StoreBOS() {
  return (
    <Container>
      <VmComponent src="baam25.near/widget/store" props={{ store: process.env.NEXT_PUBLIC_CONTRACT_ID }} />
    </Container>
  );
}
