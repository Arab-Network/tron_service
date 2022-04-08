import mongoDBConnection from "./connection";

{
  mongoDBConnection.init(function (err: any, db: any) {
    if (err) {
      LoggerService.error(err.message);
    }
  });
}
