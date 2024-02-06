import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@/components/lib/Button';
import { useSignInRedirect } from '@/hooks/useSignInRedirect';
import { useAuthStore } from '@/stores/auth';
import { UserDropdownMenu } from '../UserDropdownMenu';

const Wrapper = styled.div<{
  scrolled?: boolean;
}>`
  --nav-height: 75px;
  z-index: 1000;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  height: var(--nav-height);
  box-shadow: 0 1px 0 var(--sand6);
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 auto;
`;

const Logo = styled.a`
  text-decoration: none;
  cursor: pointer;
  outline: none;
  transition: all 200ms;
  border-radius: 4px;

  &:focus {
    outline: 2px solid var(--violet4);
    outline-offset: 0.3rem;
  }

  img {
    width: 110px;
  }
`;

const Search = styled.div`
  position: relative;
  z-index: 10;

  input {
    background-repeat: no-repeat;
    border-radius: 50px;
    padding: 7px 25px 7px 44px;
    background-position: 12px center;
    border: 1px solid var(--sand6);
    background-color: white;
    font-size: 16px;
    margin-left: 2rem;
    width: 200px;
    transition: all 200ms;

    :focus {
      outline: 0;
      border-color: var(--violet8);
      box-shadow: 0 0 0 4px var(--violet4);

      & ~ img {
        opacity: 1;
      }
    }

    ::placeholder {
      color: #9ba1a6;
    }

    & ~ img {
      position: absolute;
      right: 16px;
      top: 10px;
      width: 20px;
      height: 20px;
      opacity: 0;
      transition: all 200ms;
    }
  }
`;

const TypeAheadDropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 31px;
  margin-top: 10px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  position: relative;
  z-index: 10;
  gap: 0.5rem;
`;

export const DesktopNavigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const signedIn = useAuthStore((store) => store.signedIn);
  const { requestAuthentication } = useSignInRedirect();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignIn = () => {
    requestAuthentication();
  };

  const handleCreateAccount = () => {
    requestAuthentication(true);
  };

  return (
    <>
      <Wrapper scrolled={scrolled}>
        <Container className="container-xl">
          <Actions>
            {signedIn ? (
              <>
                <UserDropdownMenu />
              </>
            ) : (
              <>
                <Button label="Sign In" variant="secondary" onClick={handleSignIn} />
                <Button label="Create Account" variant="primary" onClick={handleCreateAccount} />
              </>
            )}
          </Actions>
        </Container>
      </Wrapper>
    </>
  );
};
