import * as util from "util";
import * as fs from "fs";
import * as child_process from "child_process";
const exec = util.promisify(child_process.exec);
import { getPOSTPage } from "../../utility/browser-instance";
import predicateCommands from "../../stacks-predicates/predicate-commands.json";
import { PostPageInstance } from "../../utility/post-page-instance";

const expectedIdentifier = "ST113MYNN52BC76GWP8P9PYFEP7XWJP6S5YFQM4ZE.shitty-coin";
jest.setTimeout(45 * 60 * 1000); // 45 mins

describe("ft-event:", () => {
  it("file-append test", async () => {
    console.log("EXECUTING file-append predicate for FT Event");
    await FTEventFilePredicate();
    console.log("COMPLETED file-append predicate for FT Event");
    const result = await FTEventFileResult();
    const actualIdentifier = result.apply[0]?.transactions[0]?.metadata?.kind?.data?.contract_identifier;
    const actualMethod = result.apply[0]?.transactions[0]?.metadata?.kind?.data?.method;
    expect(actualIdentifier).toEqual(expectedIdentifier);
    expect(actualMethod).toEqual("transfer");
  });

  it("post test", async () => {
    console.log("EXECUTING post predicate for FT Event");
    const { stdout, stderr } = await exec(predicateCommands.ft_event_post);
    console.log(stderr);
    console.log("COMPLETED post predicate for FT Event");
    // get the POST page from the browser
    const postPage: PostPageInstance = await getPOSTPage();
    const result = await postPage.getPOSTResult();
    const actualIdentifier = result.apply[0]?.transactions[0]?.metadata?.kind?.data?.contract_identifier;
    const actualMethod = result.apply[0]?.transactions[0]?.metadata?.kind?.data?.method;
    expect(actualIdentifier).toEqual(expectedIdentifier);
    expect(actualMethod).toEqual("transfer");
  });
});

const FTEventFilePredicate = async (): Promise<any> => {
  fs.writeFileSync(predicateCommands.ft_event_file.result_file, "");
  const { stdout, stderr } = await exec(
    predicateCommands.ft_event_file.command
  );
  console.log(stderr);
};

const FTEventFileResult = async (): Promise<any> => {
  let fileContent = fs.readFileSync(
    predicateCommands.ft_event_file.result_file,
    "utf8"
  );
  if (fileContent) {
    fileContent = JSON.parse(fileContent);
  }
  return fileContent;
};
