# WIP, this is not good
cd packages/smart-contracts/
npx hardhat node > /dev/null 2>&1 & 
PID=$!
trap "echo 'task executed failed, clearing up' && pkill -P $PID" ERR
echo "PID is ${PID}"
echo "local network is setup"
sleep 2
echo "deploying contract"
npx hardhat run scripts/deploy.ts --network localhost

echo "task executed successfully"