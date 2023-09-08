import * as util from "util";
import * as fs from "fs";
import * as child_process from "child_process";
const exec = util.promisify(child_process.exec);
import { getPOSTPage } from "../../utility/browser-instance";
import predicateCommands from "../../stacks-predicates/predicate-commands.json";
import { PostPageInstance } from "../../utility/post-page-instance";

const expectedBlockHeight = 114261;
jest.setTimeout(45 * 60 * 1000); // 45 mins

describe("block-height:", () => {
  it("file-append test", async () => {
    console.log("EXECUTING file-append predicate for Block Height");
    await blockHeightFilePredicate();
    console.log("COMPLETED file-append predicate for Block Height");
    const result = await blockHeightFileResult();
    const actualBlockHeight = result.apply[0]?.block_identifier.index;
    const parentBlockHeight = result.apply[0]?.parent_block_identifier.index;
    expect(actualBlockHeight).toEqual(expectedBlockHeight);
    expect(parentBlockHeight).toEqual(expectedBlockHeight - 1);
  });

  it("post test", async () => {
    console.log("EXECUTING post predicate for Block Height");
    const { stdout, stderr } = await exec(predicateCommands.block_height_post);
    console.log(stderr);
    console.log("COMPLETED post predicate for Block Height");
    // get the POST page from the browser
    const postPage: PostPageInstance = await getPOSTPage();
    const result = await postPage.getPOSTResult();
    const actualBlockHeight = result.apply[0]?.block_identifier.index;
    const parentBlockHeight = result.apply[0]?.parent_block_identifier.index;
    expect(actualBlockHeight).toEqual(expectedBlockHeight);
    expect(parentBlockHeight).toEqual(expectedBlockHeight - 1);
  });

});

const blockHeightFilePredicate = async (): Promise<any> => {
  fs.writeFileSync(predicateCommands.block_height_file.result_file, "");
  const { stdout, stderr } = await exec(
    predicateCommands.block_height_file.command
  );
  console.log(stderr);
};

const blockHeightFileResult = async (): Promise<any> => {
  let fileContent = fs.readFileSync(
    predicateCommands.block_height_file.result_file,
    "utf8"
  );
  if (fileContent) {
    fileContent = JSON.parse(fileContent);
  }
  return fileContent;
};
