# gasless AI decision logger

![gasless AI decision logger](ai-decision-logger.jpg)

AI decisions are basically unverifiable. you ask an agent something, it responds — but there's no proof of what it said or that it wasn't changed later. this project fixes that by logging every decision hash onchain, for free, on Status Network.

the agent takes a prompt, calls OpenAI, hashes the response with keccak256, and writes it to a smart contract via a gasless transaction. the tx hash is your proof. that's it.

gas is 0 at the protocol level on Status Network — not sponsored, not abstracted, literally zero. so every log is permanent and costs nothing.

## setup

```bash
npm install
cp .env.example .env
```

fill in `PRIVATE_KEY` and `OPENAI_API_KEY` in `.env`.

## deploy

```bash
npx hardhat run scripts/deploy.js --network statusNetwork
```

prints the contract address and writes it to `deployedAddress.txt`.

## run

```bash
node agent/index.js "should I invest in ETH this week?"
```

the agent fetches market context, makes a structured decision (verdict / reasoning / confidence), hashes it, logs it onchain, and prints the tx hash.

## example output

```
contract address: 0xF1DD974deD8ECF432AF9A0abb10584dE92d2Fc1e
agent wallet: 0x483Ad5439E1F4Adc69bC3C66A67902d563CD4BDa

prompt: should I invest in ETH this week?

calling OpenAI...

AI response:
verdict: wait
reasoning: ETH is experiencing elevated volatility following macro uncertainty...
confidence: medium

output hash: 0x3fbec0...
logging decision onchain (gasless)...
tx submitted: 0x7ab9da...
waiting for confirmation...

=== decision logged onchain ===
prompt:       should I invest in ETH this week?
output hash:  0x3fbec0...
tx hash:      0x7ab9da...
block:        18142428
status:       success
```

## network

Status Network Sepolia testnet — chainId `1660990954`, RPC `https://public.sepolia.rpc.status.network`, gasPrice `0`.

## proof of deployment

contract: `0xF1DD974deD8ECF432AF9A0abb10584dE92d2Fc1e`
deploy tx: `0xa27d970cc85d071ae388543fac09a2791705834f3af3ebc893f85f51d302c46e`
agent tx: `0x7ab9dab65eb58ee3abeeb32239f0c109073c5b18fcbc4660fa94c13dc5fbcc37`

## why it qualifies

verified contract deployment on Status Network, gasless tx (`gasPrice: 0n`) with tx hash proof, OpenAI agent component, and this README.
