import { CkanApi } from "../services";

async function synchronizeRawFundoDiarioToLocalFileSystem() {
  return new CkanApi("http://dados.cvm.gov.br")
    .getPackage("fi-doc-inf_diario")
    .then((pkg) => pkg.resources.filter((res) => res.format === "CSV"))
    .then((csvs) => {
      console.log(csvs);
    });
}
synchronizeRawFundoDiarioToLocalFileSystem();
