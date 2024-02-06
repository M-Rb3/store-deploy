Easily deploy a Store of your Mintbase ContractId - updates when you add information from any gateway

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FM-Rb3%2Fstore-deploy&build-command=pnpm%20run%20build&env=NEXT_PUBLIC_NETWORK_ID,NEXT_PUBLIC_HOSTNAME,NEXT_PUBLIC_CONTRACT_ID&envDescription=mainnet-near.org-themecanbeanything&envLink=https%3A%2F%2Fgithub.com%2FM-Rb3%2Fstore-deploy%2Fblob%2Fmain%2F.env.example)

To setup a custom domain on vercel

https://vercel.com/docs/concepts/projects/domains/add-a-domain

## Setup & Development

Initialize repo:

```bash
pnpm i
```

Start development version:

```bash
cp .env.example .env
pnpm dev
```

The entry component is `Mintbase Store Template` and it's located at
`/src/components/polygon/index.tsx`

It loads the `baam25.near/widget/store` BOS component. The source can be found [here](https://near.org/baam25.near/widget/store).

EX: https://near.social/baam25.near/widget/store?store=spin-nft-contract.near
![image](https://github.com/M-Rb3/store-deploy/assets/68287884/be367d61-f9f1-4a41-a225-9fbf9b0f4fd9)


## Deployment

This is a [Next.js](https://github.com/vercel/next.js/) app and a fork of [NEAR Discovery](https://github.com/near/near-discovery) gateway app.

For static exports just run `next build` and upload the build files to your hosting provider. More info [here](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports).

For Vercel, Cloudflare or others that supports a Next app just connect the repo and follow the deploy steps from the dashboards.

More info on Next.js deployments [here](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports).

## Running with docker

```bash
docker build -t store-deploy .
docker run -p 3000:3000 store-deploy
```
