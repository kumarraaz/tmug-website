/**
 * Serialise structured data for a `<script type="application/ld+json">` tag.
 *
 * `JSON.stringify` alone is not safe here: a product name such as `</script><script>…`
 * would close the tag early. Escaping every `<` as `<` keeps the JSON identical for
 * parsers while making it impossible for the text to end the script block.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
