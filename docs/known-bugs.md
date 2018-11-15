# Known Bugs

## Client

* TransitionablePortal (used in combination with Modal) closes itself - even though `open={true}` is set, if you use a hold & drag (after doubleclick/click) the mouse outside the Portal-scope/inside the Portal-scope and release the mousebtn. Luckily, OnClose event of TransitionablePortal gets triggered, so you can track unwanted closes.

