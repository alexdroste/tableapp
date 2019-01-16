## add event

```
db.events.insertOne({
    "roles": [{
		"id": "1",
        "color": "violet",
        "name": "Dozent"
    },
    {
        "id": "2",
        "name": "Übungsleiter",
        "color": "blue"
    },
    {
        "id": "3",
        "name": "Tutor",
        "color": "green"
    }],
    "isArchived": false,
    "name": "Grundlagen der Programmierung WS2018/19",
    "users": {
        "dWlkPWF2ZDE1LG91PXBlb3BsZSxkYz10dS1jbGF1c3RoYWwsZGM9ZGU=": {
            "permissionLevel": 3,
            "roleId": "3"
        },
        "dWlkPW1wcjE2LG91PXBlb3BsZSxkYz10dS1jbGF1c3RoYWwsZGM9ZGU=": {
            "permissionLevel": 3,
            "roleId": "1"
        },
        "dWlkPW9iMTYsb3U9cGVvcGxlLGRjPXR1LWNsYXVzdGhhbCxkYz1kZQ==": {
            "permissionLevel": 3,
            "roleId": "1"
        }
    }
});
```

## update rights

```
db.events.updateOne(
	{ _id: ObjectId("5bd1c0b188b8da7757fc575c") },
	{ $set: {
        "users.dWlkPW1qMDgsb3U9cGVvcGxlLGRjPXR1LWNsYXVzdGhhbCxkYz1kZQ==": {
            permissionLevel: 3,
            roleId: "2"
        }
	}}
);
```

## update promtpgroup

```
db.promptgroup.updateOne(
	{ userId: "dWlkPW1wcjE2LG91PXBlb3BsZSxkYz10dS1jbGF1c3RoYWwsZGM9ZGU=" },
	{ $set: { group: 1 }}
);
```