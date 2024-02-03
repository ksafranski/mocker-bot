# Mocker-Bot

Provide a schema, get random data.

## Installation

You'll need to first setup a local enviornment variable storing
the [OpenAI API](https://platform.openai.com/docs/overview) token.

```bash
export OPENAI_API_KEY=[API_KEY]
```

Install the dependencies:

```bash
yarn
```

## Usage

Modify the `schema` object in `config.js` to match the desired
output. Set the count to the desired number of output records,
then run the following command to generate random data:

```bash
yarn generate
```

## Notes

While this script is designed to work with the OpenAI API, it
relies on the prompts provided in the `config.js` file. The
specificity and clarity of these prompts will directly impact
the quality of the output data. The core system prompts are
written into the script to inform the AI of it's purpose and
prepare it for the work but good prompts will yield better results.

If you haven't read up on [prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering) you should - it will help a lot.
