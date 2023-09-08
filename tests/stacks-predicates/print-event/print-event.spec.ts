import * as util from "util";
import * as fs from "fs";
import * as child_process from "child_process";
const exec = util.promisify(child_process.exec);
import predicateCommands from "../../stacks-predicates/predicate-commands.json";

jest.setTimeout(45 * 60 * 1000); // 45 mins

// TODO: Ask that this contract_identifier: ST113MYNN52BC76GWP8P9PYFEP7XWJP6S5YFQM4ZE.shitty-coin does not have any match
// https://explorer.hiro.so/txid/0x79705ba198aefcf822c327041d01d10c0b4c4b8c14f0edb546eed615e1f7c34c?chain=testnet
describe.skip("print-event:", () => {
  it("file-append test", async () => {
    console.log("EXECUTING file-append predicate for print Event");
    await printEventFilePredicate();
    console.log("COMPLETED file-append predicate for print Event");
    const result = await printEventFileResult();
    expect(0).toEqual(1);
  });
});

const printEventFilePredicate = async (): Promise<any> => {
  fs.writeFileSync(predicateCommands.print_event_file.result_file, "");
  const { stdout, stderr } = await exec(
    predicateCommands.print_event_file.command
  );
  console.log(stderr);
};

const printEventFileResult = async (): Promise<any> => {
  let fileContent = fs.readFileSync(
    predicateCommands.print_event_file.result_file,
    "utf8"
  );
  if (fileContent) {
    fileContent = JSON.parse(fileContent);
  }
  return fileContent;
};
