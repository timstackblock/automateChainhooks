import * as util from "util";
import * as fs from "fs";
import * as child_process from "child_process";
const exec = util.promisify(child_process.exec);
import { getPOSTPage } from "../../utility/browser-instance";
import predicateCommands from "../../stacks-predicates/predicate-commands.json";
import { PostPageInstance } from "../../utility/post-page-instance";

jest.setTimeout(45 * 60 * 1000); // 45 mins

describe("stx-event:", () => {
  it("file-append test", async () => {
    console.log("EXECUTING file-append predicate for STX Event");
    await stxEventFilePredicate();
    console.log("COMPLETED file-append predicate for STX Event");
    const result = await stxEventFileResult();
    const actualEventType = result.apply[0]?.transactions[0]?.metadata?.receipt?.events
      ?.find((x: any) => x.type === 'STXTransferEvent')?.type;
    expect(actualEventType).toEqual('STXTransferEvent');
  });

  // the chainhook is matching one occurance but posting empty result to ngrok
  it.skip("post test", async () => {
    console.log("EXECUTING post predicate for STX Event");
    const { stdout, stderr } = await exec(predicateCommands.stx_event_post);
    console.log(stderr);
    console.log("COMPLETED post predicate for STX Event");
    // get the POST page from the browser
    const postPage: PostPageInstance = await getPOSTPage();
    const result = await postPage.getPOSTResult();
    const actualEventType = result.apply[0]?.transactions[0]?.metadata?.receipt?.events
      ?.find((x: any) => x.type === 'STXTransferEvent')?.type;
    expect(actualEventType).toEqual('STXTransferEvent');
  });

});

const stxEventFilePredicate = async (): Promise<any> => {
  fs.writeFileSync(predicateCommands.stx_event_file.result_file, "");
  const { stdout, stderr } = await exec(
    predicateCommands.stx_event_file.command
  );
  console.log(stderr);
};

const stxEventFileResult = async (): Promise<any> => {
  let fileContent = fs.readFileSync(
    predicateCommands.stx_event_file.result_file,
    "utf8"
  );
  if (fileContent) {
    fileContent = JSON.parse(fileContent);
  }
  return fileContent;
};
