cd packages/smart-contracts/
npx hardhat node&
PID=$!
echo "PID is ${$PID}"
sleep 5
npx hardhat run scripts/deploy.ts