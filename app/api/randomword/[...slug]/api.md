# Phrase Retrieval API

This API allows you to retrieve sentences based on a specified quantity and an optional maximum character count.

## How to Use the API

To retrieve sentences, make a request to the following endpoint:

    https://projectpath/api/randomword/numberofsentences


Where `numberofsentences` is the number of sentences you want to retrieve.

- The minimum number of sentences is set at 2.

### Limiting Character Count

If you wish to limit the maximum number of characters per sentence, you can add a second parameter to the endpoint:

    https://projectpath/api/randomword/numberofsentences/maximumcharacters


Where `maximumcharacters` is the character limit you want for each sentence.

- The minimum length is set at 30 characters.
- If no `maximumcharacters` is provided, it defaults to 400000 as an "infinite" number.

## Example

If you want to retrieve 5 sentences with a maximum of 50 characters each, the request would be:

    https://projectpath/api/randomword/5/50