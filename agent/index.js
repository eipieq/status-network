require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { ethers } = require("ethers");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const DECISION_LOG_ABI = [
  "function log(bytes32 outputHash, string calldata prompt) external",
  "function getLogs() external view returns (tuple(bytes32 outputHash, string prompt, address agent, uint256 timestamp)[])",
  "function getCount() external view returns (uint256)",
  "event Logged(uint256 indexed index, bytes32 indexed outputHash, string prompt, address indexed agent, uint256 timestamp)",
];

const RPC_URL = "https://public.sepolia.rpc.status.network";

async function main() {
  const prompt = process.argv[2];
  if (!prompt) {
    console.error("Usage: node agent/index.js \"Your prompt here\"");
    process.exit(1);
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("Error: PRIVATE_KEY not set in .env");
    process.exit(1);
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    console.error("Error: OPENAI_API_KEY not set in .env");
    process.exit(1);
  }

  const addressFile = path.join(__dirname, "..", "deployedAddress.txt");
  if (!fs.existsSync(addressFile)) {
    console.error("Error: deployedAddress.txt not found. Run deploy script first.");
    process.exit(1);
  }
  const contractAddress = fs.readFileSync(addressFile, "utf8").trim();
  console.log("Contract address:", contractAddress);

  // Connect to Status Network
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, DECISION_LOG_ABI, wallet);

  console.log("Agent wallet:", wallet.address);
  console.log("\nPrompt:", prompt);
  console.log("\nCalling OpenAI...");

  // Call OpenAI API
  const openai = new OpenAI({ apiKey: openaiKey });

  let aiResponse;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 512,
      messages: [
        {
          role: "system",
          content:
            "You are an onchain decision agent. Analyze the user's prompt and return a concise structured decision with: verdict, reasoning (2-3 sentences), confidence (low/medium/high). Be direct.",
        },
        { role: "user", content: prompt },
      ],
    });

    aiResponse = completion.choices[0].message.content;
  } catch (err) {
    console.error("Error calling OpenAI API:", err.message);
    process.exit(1);
  }

  console.log("\nAI Response:\n" + aiResponse);

  // Hash the response
  const outputHash = ethers.keccak256(ethers.toUtf8Bytes(aiResponse));
  console.log("\nOutput Hash:", outputHash);

  // Log decision onchain
  console.log("\nLogging decision onchain (gasless)...");
  let tx;
  try {
    tx = await contract.log(outputHash, prompt, {
      gasPrice: 0n,
      gasLimit: 3000000n,
    });
  } catch (err) {
    console.error("Error sending transaction:", err.message);
    process.exit(1);
  }

  console.log("Tx submitted:", tx.hash);
  console.log("Waiting for confirmation...");

  let receipt;
  try {
    receipt = await tx.wait();
  } catch (err) {
    console.error("Error waiting for receipt:", err.message);
    process.exit(1);
  }

  console.log("\n=== Decision Logged Onchain ===");
  console.log("Prompt:      ", prompt);
  console.log("Output Hash: ", outputHash);
  console.log("Tx Hash:     ", receipt.hash);
  console.log("Block:       ", receipt.blockNumber);
  console.log("Status:      ", receipt.status === 1 ? "Success" : "Failed");
}

main();
