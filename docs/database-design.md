# Database Design

The database consists of the following collections:

* comments
* entries
* events
* eventscreenshots
* images
* users

## Important design hints

* **UserIds** are strings (not ObjectIDs). They **are base64 encoded** ldap **DNs**. This design of userIds allow faster user-data lookups for instance.

## activitylog

A single document is a single log entry and has the following properties:

| Property      | Type       | Description                |
| ------------- | ---------- | -------------------------- |
| _id           | `ObjectID` | (not relevant)             |
| activeEventId | `ObjectID` | id of users active event   |
| activity      | `string`   | name of activity           |
| data          | `object`   | additional data            |
| timestamp     | `number`   | timestamp of log-date/time |
| userId        | `string`   | id of user                 |

## comments

A single document has the following properties:

| Property   | Type                     | Description                                            |
| ---------- | ------------------------ | ------------------------------------------------------ |
| _id        | `ObjectID`               | id of comment                                          |
| authorId   | `string` &#124; `null`   | id of user, null if comment was posted anonymously     |
| content    | `string`                 | text content                                           |
| downvotes  | `Array<ObjectID>`        | array of userIds that downvoted                        |
| entryId    | `ObjectID`               | id of related entry                                    |
| eventId    | `ObjectID`               | id of related event                                    |
| imageIds   | `Array<ObjectID>`        | array of imageIds (of attached images)                 |
| isDeleted  | `boolean`                | indicates if comment is deleted                        |
| parentId   | `ObjectID` &#124; `null` | id of parent comment, null if it comment has no parent |
| postedById | `string`                 | id of user                                             |
| timestamp  | `number`                 | timestamp of creation                                  |
| upvotes    | `Array<ObjectID>`        | array of userIds that upvoted                          |

## entries

A single document has the following properties:

| Property       | Type                   | Description                                                  |
| -------------- | ---------------------- | ------------------------------------------------------------ |
| _id            | `ObjectID`             | id of entry                                                  |
| authorId       | `string` &#124; `null` | id of user, null if entry was posted anonymously             |
| bookmarks      | `Array<ObjectID>`      | array of userIds that bookmarked the entry                   |
| content        | `string`               | text content                                                 |
| downvotes      | `Array<ObjectID>`      | array of userIds that downvoted                              |
| eventId        | `ObjectID`             | id of related event                                          |
| following      | `Array<ObjectID>`      | array of userIds that follow the entry                       |
| imageIds       | `Array<ObjectID>`      | array of imageIds (of attached images)                       |
| isDeleted      | `boolean`              | indicates if entry is deleted                                |
| isLiveAnswered | `boolean`              | indicates if entry was discussed in live situation (not used atm) |
| postedById     | `string`               | id of user                                                   |
| timestamp      | `number`               | timestamp of creation                                        |
| upvotes        | `Array<ObjectID>`      | array of userIds that upvoted                                |

## events

A single document has the following properties:

| Property   | Type          | Description                                                  |
| ---------- | ------------- | ------------------------------------------------------------ |
| _id        | `ObjectID`    | id of event                                                  |
| roles      | `Array<Role>` | array of roles defined for this event                        |
| isArchived | `boolean`     | indicates if event was archived (not used atm)               |
| name       | `string`      | title/name of the event                                      |
| users      | `object`      | object containing userIds as keys and `User`-objects as value |

A **Role** object has the following properties:

| Property   | Type      | Description                                                  |
| ---------- | --------- | ------------------------------------------------------------ |
| id         | `string`  | id of role                                                   |
| color      | `string`  | named color, e.g. "red", "green", ...                        |
| name       | `string`  | title/name of the role                                       |

A **User** object has the following properties:

| Property        | Type     | Description                                                  |
| --------------- | -------- | ------------------------------------------------------------ |
| permissionLevel | `number` | access level for event (see: [Backend_code/PermissionLevelEnum](Backend_code/PermissionLevelEnum)). |
| roleId          | `string` | id of assigned role                                          |

## eventscreenshots

A single document has the following properties:

| Property   | Type              | Description                                                  |
| ---------- | ----------------- | ------------------------------------------------------------ |
| _id        | `ObjectID`        | id of event the screenshots are for                          |
| imageIds   | `Array<ObjectID>` | array of imageIds that are used as event-screenshots for the defined event |
| lastUpdate | `number`          | timestamp of last update                                     |

## images

A single document has the following properties:

| Property  | Type       | Description                          |
| --------- | ---------- | ------------------------------------ |
| _id       | `ObjectID` | id of image                          |
| data      | `string`   | image as base64 encoded              |
| thumbnail | `string`   | thumbnail of image as base64 encoded |

## users

A single document has the following properties:

| Property          | Type                 | Description                                      |
| ----------------- | -------------------- | ------------------------------------------------ |
| _id               | `string`             | id of user                                       |
| hasAcceptedTos    | `boolean`            | indicates if users accepted the terms of service |
| lastActiveEventId | `ObjectID`           | id of last active event                          |
| sessionInfos      | `Array<SessionInfo>` | thumbnail of image as base64 encoded             |

A **SessionInfo** object has the following properties:

| Property     | Type     | Description                                 |
| ------------ | -------- | ------------------------------------------- |
| from         | `number` | timestamp of session begin (auth)           |
| ip           | `string` | IP-Address                                  |
| sessionToken | `string` | used sessionToken                           |
| to           | `number` | timestamp of sesson end (logout/disconnect) |
| userAgent    | `string` | user-agent of browser                       |

