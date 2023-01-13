const { default: axios } = require("axios");

const main = async () => {
  //   const { data: test } = await axios.get("http://localhost:3000/competition");
  //   console.log(test);

  try {
    const { data } = await axios.get(
      `http://localhost:3000/competition/search`,
      {
        params: {
          count: 0,
          offset: 0,
          config: encodeBase64({
            filters: [{ key: "name", operation: "contains", value: "test" }],
          }),
        },
      }
    );
    console.log(data);
  } catch (e) {
    console.error(e.response.data);
  }
};

function decodeBase64(value) {
  return JSON.parse(Buffer.from(value, "base64").toString());
}

function encodeBase64(obj) {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
