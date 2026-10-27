const crypto = require('crypto');
const fs = require('fs');
const pinataSDK = require('@pinata/sdk'); // Using the correct Node.js SDK
const { ethers } = require('ethers');

// Initialize Pinata using the Node SDK syntax
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

// Smart contract ABI
const contractABI = [
    "function mintCertificate(address to, string memory studentRegNo, string memory ipfsHash, string memory docHash) public returns (uint256)"
];

const issueCertificate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file provided.' });
        }

        const { studentRegNo } = req.body; 
        const filePath = req.file.path;

        // 1. Calculate SHA-256 Fingerprint
        const fileBuffer = fs.readFileSync(filePath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const sha256Fingerprint = hashSum.digest('hex');

        // 2. Upload to Pinata IPFS using Node.js readable streams
        console.log("Uploading to Pinata...");
        const readableStreamForFile = fs.createReadStream(filePath);
        
        const uploadResult = await pinata.pinFileToIPFS(readableStreamForFile, {
            pinataMetadata: {
                name: req.file.originalname // Keeps the original PDF name in your Pinata dashboard
            }
        });
        
        const ipfsCID = uploadResult.IpfsHash; // The SDK returns 'IpfsHash'
        console.log("IPFS CID:", ipfsCID);

        // Clean up temp file from the server
        fs.unlinkSync(filePath);

        // 3. Smart Contract Mint
        /* NOTE: Uncomment this block when Ashwin provides the contract address
        console.log("Connecting to Sepolia Testnet...");
        const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL);
        const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

        console.log("Minting transaction initiated...");
        const tx = await contract.mintCertificate(wallet.address, studentRegNo, ipfsCID, sha256Fingerprint);
        const receipt = await tx.wait();
        console.log(`Minted successfully! Tx Hash: ${receipt.hash}`);
        */

        res.json({
            message: "Certificate issued and pinned to IPFS successfully!",
            sha256Fingerprint: sha256Fingerprint,
            ipfsCID: ipfsCID,
            // transactionHash: receipt.hash 
        });

    } catch (error) {
        console.error("Issuance Error:", error);
        res.status(500).json({ error: "Failed to process certificate." });
    }
};

module.exports = {
    issueCertificate
};