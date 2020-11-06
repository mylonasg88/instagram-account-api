require("dotenv").config();
// import 'dotenv/config';
const { IgApiClient } = require("instagram-private-api");

function fakeSave(data) {
  console.log(data);
  // console.log(process.env.IG_USERNAME);
  // here you would save it to a file/database etc.
  // you could save it to a file: writeFile(path, JSON.stringify(data))
  return data;
}

function fakeExists() {
  // here you would check if the data exists
  return false;
}

function fakeLoad() {
  // here you would load the data
  return "";
}

(async () => {
  try {
    const ig = new IgApiClient();
    console.log('device string', ig.state.deviceString);
    ig.state.generateDevice(process.env.IG_USERNAME);
    // ig.state.proxyUrl = process.env.IG_PROXY;
    // ig.state.proxyUrl = 'http://google.com';
    // This function executes after every request
    ig.request.end$.subscribe(async () => {
      const serialized = await ig.state.serialize();
      delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
      fakeSave(serialized);
    });
    if (fakeExists()) {
      // import state accepts both a string as well as an object
      // the string should be a JSON object
      await ig.state.deserialize(fakeLoad());
    }
    // This call will provoke request.end$ stream
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    console.log("Account: ", ig.account);
    // console.log('Cookies: ', ig.account.cookies.cookies);
    // Most of the time you don't have to login after loading the state
  } catch (e) {
    console.log(e);
    console.log(e.message);
  }
})();
