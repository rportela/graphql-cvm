import { fetch } from "apollo-env";
import Papa from "papaparse";
import { FundoDiario } from "../entities/FundoDiario";

export class FundoDiarioCsv {
  parseStream = (
    stream: ReadableStream,
    consumer: (item: FundoDiario) => void
  ): Promise<void> =>
    new Promise((resolve, reject) => {
      stream
        .pipe(
          (Papa.parse(Papa.NODE_STREAM_INPUT, {
            delimiter: ";",
          }) as unknown) as WritableStream
        )
        .on("data", consumer)
        .on("error", reject)
        .on("finish", resolve);
    });

  parseUrl = (
    url: string,
    consumer: (item: FundoDiario) => void
  ): Promise<void> => {
    return fetch(url).then((req) => this.parseStream(req.body, consumer));
  };
}

new FundoDiarioCsv()
  .parseUrl(
    "http://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS/inf_diario_fi_201702.csv",
    () => {}
  )
  .then(() => console.log("done"));
