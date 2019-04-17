# table 

* official repo: https://github.com/progmem64/tableapp
* docs: https://progmem64.github.io/tableapp/

![Logo](./logo/logo-table.svg)

## todos 

### high priority

- [ ] was passiert (durch neues routing) mit laufender Übertragung, wenn die API kurz nicht erreichbar ist?
- [x] notifications in-app
- [x] fix routing/links (entry, comment): parent-paths should wrap subpaths to manage data-subscriptions (entries/comments) [=> ability for permalinks]
  - [ ] maybe? log read event for entry/comment in post comment view
- [x] notification subscription verwaltung ui
- [ ] notifications email
- [ ] desktop-app: improve screen selection
- [x] survey integration
  - [x] track if user successfully filled survey
- [ ] Zoom!
- [x] remove prompt-groups
- [x] fixes:
  - [ ] fix notification popup: remove hideOnScroll Property from Popup in NotificationsMenuItem after upgrade to semantic-ui 0.87.0 (requires fix: <https://github.com/Semantic-Org/Semantic-UI-React/pull/3532>); then popup should stay fixed at menu item and position should be correct after/before scrolling the page (and opening after page has been scrolled down)
  - [x] fix subscription missing, when directly opening new comment form (move subscribeEntryList action from EntriesView to wrapper), e.g. link <https://localhost:3000/552786262cec76ed95fd61d0/5ca6072fe85f2699640ad75f/0/new>
  - [x] write sessionInfos as single documents in another collection (very important!) => continous use WILL break app in future
  - [ ] fix 'after-logout.png'
  - [x] remove tos link from minicontrol
  - [x] screen broadcast won't stop
  - [x] windows-app: zoom does not work
  - [ ] entries-view: scroll restore broken on React 16.4+ (breaks scrollToPosition)
    - https://github.com/bvaughn/react-virtualized/issues/1179
    - https://github.com/bvaughn/react-virtualized/issues/1226
    - https://github.com/bvaughn/react-window
  - [x] fix TimeStamp.js:42 language
  - [x] fix presentationmode add entry button still there
  - [x] fix restore full view if screen unselects in miniview
  - [x] fix restore mini-view after api connection loss? (keep inner-state of screenbroadcasthelper)
  - [x] fix timestamp not updating due to view reuse in virtualized list
  - [x] fix minicontrolview counter not decrementing on entry deletion
  - [ ] desktop-client: fix TitleBar in viewport => render to Frame?
  - [ ] fix screenshot-viewer, picture too large => user must scroll
  - [x] thumbnails for entry/comment in post-comment-view are not shown 
  - [ ] fix TransitionablePortal close bug somehow (see known-bugs inside docs)
    - implement own component (or Modal with Animation)
    - remove dual-trigger onClose workaround for TransitionablePortal/Modal combo 
- [x] moderation options: delete entry
- [x] moderation options: delete comment
- [x] screencapture module for windows / desktop-app for windows
- [x] fix: screenshots of active window not working sometimes => allow screenshots per screen (& maybe screenshot preview for presenter)
- [x] ssl: secure websocket connections
- [ ] ssl: update deployment details (with own certs) 
- [x] data-tracking
- [x] track entries read
- [ ] track comments read
- [x] hide "new entry"-dialogue in presentation-mode
- [x] mongodb scripts for stats
- [x] desktop-client: continue streaming on monitor change
- [ ] restructure TitleBar & NavBar rendering => also set height as paddingTop of contentWrapper to fix jumping of page switch
- [x] usability: button "comment" comments-view
- [x] backend: log activities
- [x] prompts (groups & ui)
- [ ] fully implement manage-event view
- [ ] automation scripts / or view for creating/removing events, etc.
- [x] opt-in/opt-out
- [ ] client-desktop: show last broadcasted pic
- [ ] save all screenshots, link them in db
- [ ] desktop-client: easier window-move
- [x] desktop-client: toggle mini control with global shortcut
- [x] desktop-client: remember table position on extend->mirror->extend change (per monitor save)
- [ ] desktop-client: show thumb in minicontrolview if monitor-setup changes
- [x] desktop-client: check for screen border on restore
- [x] sign-out


### normal priority

- [ ] ?? remove extra-code for surveys
- [ ] presentation-mode view
- [x] login with kürzel (30min)
- [ ] optimize desktop-client zoom (track cmd + +/-, add overlay)
- [ ] desktop-client: manage zoom by WindowManager and save zoom-level per setup/hashed screen
- [ ] popups on entry send: "add screenshot"/"" (=> mockups) (!)
- [ ] redesign posting design
  - [ ] "new entry"-dialogue in EntriesView should be minimized and open on click (like FB)
  - [ ] input bar at bottom of viewport
- [ ] windows: desktop-client prebuild script
- [ ] desktop-client: option to mark entry as unread
- [ ] option to add tag to entry -> "discussed in lecture" (!)
- [ ] backend: permission-check for events
- [ ] add activities:
  - [ ] clicked on email notification link
  - [ ] clicked on in-app notification
  - [ ] read in-app notification
- [ ] Archive/close option for events
- [x] client: no longer split api-actions and actions
- [ ] maybe? client: [REQUEST, SUCCESS, FAILED] generate => { type: CHANGE_VOTE, apiRequestState: REQUEST}
- [ ] document api messages (client->backend, backend->client & data)
- [ ] document activities
- [ ] document client-desktop usage (modes, shortcuts, ...)
- [ ] split full-name into tuple (title, first name, last name)
- [ ] moderation options: edit entry
- [ ] moderation options: edit comment
- [ ] feed sorting / filter options
- [ ] show new entries counter in normal-view
- [ ] improve (really bad atm) container/presentational component split (https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [ ] add documentation for components/containers
- [ ] max character limit for comments/entries
- [ ] edit feature for images (pen/marker)
- [ ] collapse entry content in feed if its too long => add button to "expand" / "collapse" long content
- [ ] make more than the last 3 screenshots available for use / preview other screenshots in zoomed view
- [ ] switch attached images in full screen with arrows & arrow-keys
- [ ] post entry: show minimum/maximum characters
- [ ] rate-limits (e.g. you can only post x new entries in x secs)
- [ ] ability to ban or temp-ban users
- [ ] optimize entry virtualisation
  - [ ] maybe? scroll to entry by entryId not last scrollY 
- [ ] fix jumping comments page on open
- [ ] virtualize comment section
- [ ] optimize design, especially for desktop
- [ ] use Flow typechecking (https://flow.org)
- [ ] maybe? replace listsubscription with update notifications for events
- [ ] backend: better error handling


### low priority

- [ ] choose proper text-font
- [ ] update icons/favicons
- [ ] electron app icon & title
- [ ] desktop-app for linux
- [ ] polls / quizzes
- [ ] integrate with tuc course catalog
- [ ] comment-section: add person-tracking for anonymous comments (@1, @2, ...)
- [ ] pwa
- [ ] respond to mail to post new answers


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