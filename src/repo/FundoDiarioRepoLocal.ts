import { CkanLocalCache } from "../services/CkanLocalCache";
import { FundoDiarioRepo, FundoDiarioRepoConsumer } from "./FundoDiarioRepo";

export class FundoDiarioRepoLocal implements FundoDiarioRepo {
  cache = new CkanLocalCache({
    api_url: "http://dados.cvm.gov.br",
    package_id: "fi-doc-inf_diario",
    file_format: "CSV",
    gzip: true,
  });

  async synchronize() {
    console.log("FundoDiarioRepoLocal starting...");
    const startTime = new Date();
    await this.cache.synchronize();
    const endTime = new Date();
    console.log(
      "...FundoDiarioRepoLocal completed, took",
      (endTime.getTime() - startTime.getTime()) / 1000.0,
      "segs."
    );
  }

  forEach = (
    year: number,
    month: number,
    consumer: FundoDiarioRepoConsumer
  ): Promise<void> => {
    const filename = `inf_diario_fi_${year}_${("00" + month).substr(
      -2
    )}.csv.gz`;
    return Promise.resolve();
  };
}
