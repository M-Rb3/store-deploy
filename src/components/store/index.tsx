import styled from 'styled-components';
import { VmComponent } from '@/components/vm/VmComponent';
import { useState } from 'react';

const Container = styled.div`
  height: 100vh;
  padding: 3rem 0;
  .header-title {
    font-size: 48px;
    font-weight: 600;
  }
  .tabs {
    margin: 2rem 0;
    display: flex;
    gap: 1rem;
    > div {
      padding: 1rem;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 300ms ease-in-out;
      :hover {
        border-bottom-color: #aeaeae;
      }
      &.active {
        border-bottom-color: #aeaeae;
      }
    }
  }
`;
const tabs = ['Items', 'Activities'];
export function StoreBOS() {
  const [currentTab, setCurrentTab] = useState('Items');
  return (
    <Container className="container-xl">
      <div className="header-title">{process.env.NEXT_PUBLIC_CONTRACT_ID}</div>
      <div className="tabs">
        {tabs.map((tab) => (
          <div key={tab} onClick={() => setCurrentTab(tab)} className={currentTab === tab ? 'active' : ''}>
            {tab}
          </div>
        ))}
      </div>
      {currentTab === 'Items' && (
        <VmComponent src="baam25.near/widget/store" props={{ store: process.env.NEXT_PUBLIC_CONTRACT_ID }} />
      )}
      {currentTab === 'Activities' && (
        <VmComponent
          src="baam25.near/widget/storeActivities"
          props={{ contractId: process.env.NEXT_PUBLIC_CONTRACT_ID, color: '#aeaeae' }}
        />
      )}
    </Container>
  );
}
