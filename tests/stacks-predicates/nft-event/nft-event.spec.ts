import * as util from "util";
import * as fs from "fs";
import * as child_process from "child_process";
const exec = util.promisify(child_process.exec);
import { getPOSTPage } from "../../utility/browser-instance";
import predicateCommands from "../../stacks-predicates/predicate-commands.json";
import { PostPageInstance } from "../../utility/post-page-instance";

jest.setTimeout(45 * 60 * 1000); // 45 mins
const expectedIdentifier = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.redeeem-nft-v0";

describe("nft-event:", () => {
  it("file-append test", async () => {
    console.log("EXECUTING file-append predicate for NFT Event");
    await NFTEventFilePredicate();
    console.log("COMPLETED file-append predicate for NFT Event");
    const result = await NFTEventFileResult();
    const actualIdentifier = result.apply[0]?.transactions[0]?.metadata?.kind?.data?.contract_identifier;
    const actualMethod = result.apply[0]?.transactions[0]?.metadata?.kind?.data?.method;
    expect(actualIdentifier).toEqual(expectedIdentifier);
    expect(actualMethod).toEqual("mint");
  });

  it("post test", async () => {
    console.log("EXECUTING post predicate for NFT Event");
    const { stdout, stderr } = await exec(predicateCommands.nft_event_post);
    console.log(stderr);
    console.log("COMPLETED post predicate for NFT Event");
    // get the POST page from the browser
    const postPage: PostPageInstance = await getPOSTPage();
    const result = await postPage.getPOSTResult();
    const actualIdentifier = result.apply[0]?.transactions[0]?.metadata?.kind?.data?.contract_identifier;
    const actualMethod = result.apply[0]?.transactions[0]?.metadata?.kind?.data?.method;
    expect(actualIdentifier).toEqual(expectedIdentifier);
    expect(actualMethod).toEqual("mint");
  });
});

const NFTEventFilePredicate = async (): Promise<any> => {
  fs.writeFileSync(predicateCommands.nft_event_file.result_file, "");
  const { stdout, stderr } = await exec(
    predicateCommands.nft_event_file.command
  );
  console.log(stderr);
};

const NFTEventFileResult = async (): Promise<any> => {
  let fileContent = fs.readFileSync(
    predicateCommands.nft_event_file.result_file,
    "utf8"
  );
  if (fileContent) {
    fileContent = JSON.parse(fileContent);
  }
  return fileContent;
};