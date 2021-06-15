import { FundoDiarioRepoLocal } from "../repo/FundoDiarioRepoLocal";

async function execute() {
  await new FundoDiarioRepoLocal().synchronize();
}
execute();
