// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DecisionLog {
    struct LogEntry {
        bytes32 outputHash;
        string prompt;
        address agent;
        uint256 timestamp;
    }

    LogEntry[] private entries;

    event Logged(
        uint256 indexed index,
        bytes32 indexed outputHash,
        string prompt,
        address indexed agent,
        uint256 timestamp
    );

    function log(bytes32 outputHash, string calldata prompt) external {
        entries.push(LogEntry({
            outputHash: outputHash,
            prompt: prompt,
            agent: msg.sender,
            timestamp: block.timestamp
        }));

        emit Logged(entries.length - 1, outputHash, prompt, msg.sender, block.timestamp);
    }

    function getLogs() external view returns (LogEntry[] memory) {
        return entries;
    }

    function getCount() external view returns (uint256) {
        return entries.length;
    }
}
