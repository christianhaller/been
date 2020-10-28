import { LastUsers } from "../src/backend/lastUsers.ts";
import { failure, success } from "../src/backend/response.ts";
import { Timestamp } from "../src/backend/timeStamp30DaysAgo.ts";
import { S3 } from "../src/backend/s3.ts";
import { ServerRequest } from "../deps.ts";

export default async (req: ServerRequest) => {
  try {
    success(req, await new LastUsers(new Timestamp(), new S3()).list(), "60");
  } catch (error) {
    failure(req, error.message);
  }
};
