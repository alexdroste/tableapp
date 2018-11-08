# table 

* official repo: https://github.com/progmem64/tableapp
* docs: https://progmem64.github.io/tableapp/

![Logo](./logo/logo-table.svg)

## todos 

### high priority

- [x] fixes:
  - [x] remove tos link from minicontrol
  - [x] screen broadcast won't stop
  - [x] windows-app: zoom does not work
  - [x] entries-view: scroll restore broken (React 16.4 breaks scrollToPosition)
    - https://github.com/bvaughn/react-virtualized/issues/1179
    - https://github.com/bvaughn/react-virtualized/issues/1226
- [x] moderation options: delete entry
- [x] moderation options: delete comment
- [x] screencapture module for windows / desktop-app for windows
- [x] fix: screenshots of active window not working sometimes => allow screenshots per screen (& maybe screenshot preview for presenter)
- [x] ssl: secure websocket connections
- [ ] ssl: update deployment details (with own certs) 
- [x] data-tracking
- [x] track entries read
- [ ] track comments read
- [x] backend: log activities
- [x] prompts (groups & ui)
- [ ] fully implement manage-event view
- [ ] automation scripts / or view for creating/removing events, etc.
- [x] opt-in/opt-out
- [ ] save all screenshots, link them in db
- [ ] fix routing/links (entry, comment): parent-paths should wrap subpaths to manage data-subscriptions (entries/comments) [=> ability for permalinks]
  - [ ] maybe? log read event for entry/comment in post comment view
- [ ] desktop-client: window-move & check for screen border on restore
  - https://electronjs.org/docs/api/screen
  - https://github.com/electron/electron/blob/master/docs/api/browser-window.md 
- [x] sign-out


### normal priority

- [ ] backend: permission-check for events
- [x] client: no longer split api-actions and actions
- [ ] maybe? client: [REQUEST, SUCCESS, FAILED] generate => { type: CHANGE_VOTE, apiRequestState: REQUEST}
- [ ] document api messages (client->backend, backend->client & data) & activities
- [ ] split full-name into tuple (title, first name, last name)
- [ ] moderation options: edit entry
- [ ] moderation options: edit comment
- [ ] feed sorting / filter options
- [ ] notifications (in-app/email)
- [ ] "weiteres UI-Improvement für desktop wäre: direkt hinzufügen von screenshots, wenn man auf den grauen haken klickt"??
- [ ] show new entries counter in normal-view
- [ ] option to add tag to entry -> "discussed in lecture"
- [ ] improve (really bad atm) container/presentational component split (https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [ ] add documentation for components/containers
- [ ] max character limit for comments/entries
- [ ] collapse entry content in feed if its too long => add button to "expand" / "collapse" long content
- [ ] make more than the last 3 screenshots available for use / preview other screenshots in zoomed view
- [ ] implement or remove archive option for events
- [ ] post entry: show minimum/maximum characters
- [ ] rate-limits (e.g. you can only post x new entries in x secs)
- [ ] ability to ban or temp-ban users
- [ ] optimize entry virtualisation
- [ ] fix jumping comments page on open
- [ ] virtualize comment section
- [ ] optimize design, especially for desktop
- [ ] use Flow typechecking (https://flow.org)
- [ ] maybe? replace listsubscription with update notifications for events
- [ ] backend: better error handling


### low priority

- [ ] update icons/favicons
- [ ] electron app icon & title
- [ ] screencapture module for linux / desktop-app for linux
- [ ] polls / quizzes
- [ ] integrate with tuc course catalog
- [ ] comment-section: add person-tracking for anonymous comments (@1, @2, ...)


## documentation

### view

visit: https://progmem64.github.io/tableapp/

**or:**

* serve docs folder via local webserver
* install docsify and run `docsify serve docs`

### build / generate

In order to be able to generate the docs you need to install:

* node.js (npm)
* jsdoc-to-markdown - globally via npm: `npm install -g jsdoc-to-markdown`

Afterwars docs can be generated by executing `python3 generate-docs.py`.