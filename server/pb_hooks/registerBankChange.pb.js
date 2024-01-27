onRecordBeforeCreateRequest((event) => {
  const date = new DateTime();
  $app.logger().info(`Create Item :: bank_updates - Recording bank change for ${event.record.get('account_id')}`)

  if (event.httpContext.get("admin")) {
    $app.logger().info(`Create Item :: bank_updates - Admin request - skipping`);
    return null
  }

  try {
    $app.logger().info(`Create Item :: bank_updates - Checking for existing update record`);

    const record = $app.dao().findFirstRecordByData("bank_updates", "account_id", event.record.get("account_id"))
    $app.logger().info(`Create Item :: bank_updates - Existing record found - ${ record.id }`);

    record.set('last_update', date)

    $app.dao().saveRecord(record);
  } catch (err) {
    $app.logger().info(`Create Item :: bank_updates - No existing records found. One will be created.`);

    const collection = $app.dao().findCollectionByNameOrId("bank_updates");

    const record = new Record(collection, {
      account_id: event.record.get("account_id"),
      last_update: date,
    })


    $app.dao().saveRecord(record);
  }
}, "items")

onRecordBeforeUpdateRequest((event) => {
  const date = new DateTime();
  $app.logger().info(`Update Item :: bank_updates - Recording bank change for ${event.record.get('account_id')}`)

  if (event.httpContext.get("admin")) {
    $app.logger().info(`Update Item :: bank_updates - Admin request - skipping`);
    return null
  }

  try {
    $app.logger().info(`Update Item :: bank_updates - Checking for existing update record`);

    const record = $app.dao().findFirstRecordByData("bank_updates", "account_id", event.record.get("account_id"))
    $app.logger().info(`Update Item :: bank_updates - Existing record found - ${ record.id }`);

    record.set('last_update', date)

    $app.dao().saveRecord(record);
  } catch (err) {
    $app.logger().info(`Update Item :: bank_updates - No existing records found. One will be created.`);

    const collection = $app.dao().findCollectionByNameOrId("bank_updates");

    const record = new Record(collection, {
      account_id: event.record.get("account_id"),
      last_update: date,
    })


    $app.dao().saveRecord(record);
  }
}, "items")