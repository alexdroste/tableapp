## Ziele

* "digitale Lerngruppe" über die Gesamtheit der Teilnehmer
* Audience interaction erhöhen
  * Möglichkeit vermittelt & anonym fragen zu stellen
    * Während der VL -> Dozent bekommt Benachrichtigung -> direkte Reaktion möglich
    * Außerhalb der VL -> Klärung mittels Community (Teilnehmer, Dozent, Tutoren)
  * Möglichkeit Feedback abzugeben
    * Feedback wird klassischerweise nicht von Teilnehmer per Handzeichen gegeben
  * Lernen intensivieren
    * Probleme/Erkenntnisse diskutieren
  * Visuelles Feedback durch Screenshots/Bilder
  * Verifizierte Antworten

## other

* erste Veranstaltung am 25.10.
* ergänzungen im tool zum erreichen der leute
  * prompts manuell gesteuert
  * prompts abhängig vom nutzerverhalten
  * opt-in / opt-out
* Daten
  * Gerät
  * Login
  * Zeitfenster tracken zugriff
  * prompts tracken
* Alle screenshots zwischenspeichern, Screenshots bei Anhängen in der DB verlinken
* email zusammenfassungen



MMI

* Startpost (man kann so posten... anonym)
* Zeit reservieren Fragebögen
* Link + QR-Code
* Abschnittswechsel Link + QR-Code
* MMI Gruppen untereinander austauschen



* Interviews Dozenten zur Halbzeit mit Daum, Ü-Leiter, Michael & Niklas





* idee: rolle des lehrenden kann antwort verifizieren



* Müller / BWL
  * BWL Veranstaltungen ausmachen
* Veranstaltungen
  * Elektrotechnik
    * Beck, Hans-Peter, Prof. Dr.-Ing.
  * Wirtschaftspolitik (WiPo)
    * Menges
  * OM I
    * Schwindt ! (donnerstag vormittag)
  * Mafo I
    * Steiner
  * Makro?
    * Menges
  * Kosten/Leistungsrechnung S6615
    * Prof. Dr. Inge Wulf
  * WITA
    * Müller !
  * ExPhysik
    * Daum
* Ausbildungsprogramm ZHD (Seifert)
  * Tool für aktivierende Lehre nutzen
* Pre/Post Fragebögen
  * Fragebögen/Nutzerdaten
    * Zusichern: Lehrkräfte können keine Deanonymisierung vornehmen
  * Hilft das System den Studierenden beim Verständnis des Inhalts, beim Lernen und demnach auch beim Lösen von Aufgaben?
  * Egal, wann die Fragebögen ausfüllen
    * wie verhält sich die selbsteinschätzung vor und nach dem tool
      * pre bogen noch in späteren wochen sinnvoll
  * pre:
    * während der vl habe ich häufig fragen, deren direkte  beantwortung für mein verständnis wichtig ist
    * ...deren beantwortung nach der vl wichtig für mein verständnis ist
    * während einer vl stelle ich fragen, wenn ich sie habe
    * nach einer vl stelle ich fragen, wenn ich sie habe
    * Ich habe oft fragen, stelle sie aber den lehrenden nicht
    * ich hätte gerne die möglichkeit mehr fragen stellen
    * ?Bei meinen Frage ist es mir wichtig, dass mir Lehrende/Tutoren antworten
    * ?Bei meinen Fragen ist es mir wichtig, dass mir Kommilltionen aantworten
    * Meine Fragen würde ich gerne Lehrenden/Tutoren stellen
    * -> Bekannten
    * -> allen d vl
    * Bei Fragen fällt es mir häufig schwer, genau zu erklären, zu was ich eine Frage habe
    * anreize: 
      * gutschein?
        * 5x 10€ gutschein z.b. 
  * post
    * direkt: hat mich das tool beim lernen unterstützt
    * 
* Lehrende
  * tool aktiv bespielen
  * zeit lassen für bogen
  * tool nutzen



# desktop

* frameless window
  * Titlebar: schließen button und Move & Dock toggle
* transparent-miniview
* Move & Dock Overlay
  * fenster in Bildschirmecken docken lassen
  * Fenster per Drag und drop bewegen können
* Fenster vergrößert so, dass es im Screen bleibt
* Automatischer Modus für Wechsel zwischen Clone/Extend bei Bildschirmübertragungen
* verstecke "Neuer Eintrag" im Präsentationsmodus
* Maybe? Gar nicht verschieben sonder immer rechts oben docken im Präsentationsmodus?
* button: "besprochen"
* global shortcut

## notifications

* table: notifications
  * userId
  * timestamp
  * isRead
  * isEmail
  * isInApp
  * type
  * senderId // user that triggered notification
  * data
* global (veranstaltung mit angegeben)
* Benachrichtigungen
  * In-App & optional Email
    * Benutzer X/Jemand hat Eintrag kommentiert.
    * Benutzer X/Jemand hat auf deinen Kommentar geantwortet.(Rekursiv?)
  * Optional Email
    * Neuer Eintrag in Veranstaltung.
    * (Täglicher Aktivitätsbericht?)
* group notifications in client (not backend!)
  * e.g. 4x notification for new comment: client recognizes same reference and only show 1 notification
* client-datenstruktur
  * userId
  * sender
  * isRead
  * type
  * data





## analytics



- anzahl overall sessions in useractivity