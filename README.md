# Gasless AI Decision Logger

A minimal onchain AI agent built for the Status Network hackathon. The agent accepts a user prompt, reasons about it using Claude, hashes the AI response, and logs the decision hash on Status Network's Sepolia Testnet via a gasless transaction — returning a tx hash as cryptographic proof that the AI decision occurred and was committed to the chain. Gas is set to 0 at the protocol level on Status Network, so every interaction is completely free.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in:
   - `PRIVATE_KEY` — your wallet private key (the account that will deploy and interact with the contract)
   - `ANTHROPIC_API_KEY` — your Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

## Deploy the Contract

```bash
npx hardhat run scripts/deploy.js --network statusNetwork
```

This will:
- Deploy `DecisionLog.sol` to Status Network Sepolia Testnet (Chain ID: 1660990954)
- Print the deployed contract address and deploy tx hash
- Write the contract address to `deployedAddress.txt` for the agent to use

## Run the Agent

```bash
node agent/index.js "Should I invest in ETH this week?"
```

The agent will:
1. Read the contract address from `deployedAddress.txt`
2. Send your prompt to Claude (`claude-sonnet-4-20250514`)
3. Receive a structured decision (verdict, reasoning, confidence)
4. Hash the response with `keccak256`
5. Call `DecisionLog.log()` with `gasPrice: 0n` — completely gasless
6. Print the full Claude response, output hash, and tx hash

## Example Output

```
Contract address: 0xabc...
Agent wallet: 0xdef...

Prompt: Should I invest in ETH this week?

Calling Claude...

Claude's Response:
Verdict: Wait
Reasoning: ETH is experiencing elevated volatility following macro uncertainty...
Confidence: medium

Output Hash: 0x3f2a...
Logging decision onchain (gasless)...
Tx submitted: 0x9c1b...
Waiting for confirmation...

=== Decision Logged Onchain ===
Prompt:       Should I invest in ETH this week?
Output Hash:  0x3f2a...
Tx Hash:      0x9c1b...
Block:        123456
Status:       Success
```

## Network Details

| Field       | Value                                        |
|-------------|----------------------------------------------|
| Network     | Status Network Sepolia Testnet               |
| Chain ID    | 1660990954                                   |
| RPC URL     | https://public.sepolia.rpc.status.network    |
| Gas Price   | 0 (gasless at protocol level)                |

---

## Proof of Deployment

> Fill in after running the deploy and agent scripts.

| Field             | Value |
|-------------------|-------|
| Contract Address  | 0xF1DD974deD8ECF432AF9A0abb10584dE92d2Fc1e |
| Deploy Tx Hash    | 0xa27d970cc85d071ae388543fac09a2791705834f3af3ebc893f85f51d302c46e |
| Agent Tx Hash     | 0x7ab9dab65eb58ee3abeeb32239f0c109073c5b18fcbc4660fa94c13dc5fbcc37 |

---

## Why This Qualifies

- **Verified contract deployment** — `DecisionLog.sol` is deployed to Status Network Sepolia Testnet with a publicly verifiable deploy tx hash.
- **Gasless transaction with tx hash** — every `log()` call sets `gasPrice: 0n` explicitly, leveraging the protocol-level zero-gas feature of Status Network. Each call produces a confirmed tx hash as proof.
- **AI agent component** — the agent queries Claude's API for a structured decision, hashes the response deterministically with `keccak256`, and commits it onchain — making the AI output tamper-evident and auditable.
