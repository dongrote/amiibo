/**
 * remove the checksum bytes from the first two pages of a tag to get the uid
 */
export default page => page.slice(7, 7+8);
